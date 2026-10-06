import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getCachedApiResponse, setCachedApiResponse, invalidateApiCache, invalidateCachedImage } from '@/lib/serverCache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const difficulty = searchParams.get('difficulty');

    // If specific kit requested (e.g. quick view modal or edit)
    if (id) {
      const cacheKey = `kit_item_${id}`;
      const cached = getCachedApiResponse(cacheKey);
      if (cached) {
        return NextResponse.json({ success: true, data: cached });
      }

      const { db } = await connectToDatabase();
      const kit = await db.collection('kits').findOne({ id: id });
      if (!kit) {
        return NextResponse.json({ success: false, error: 'Kit not found' }, { status: 404 });
      }
      setCachedApiResponse(cacheKey, kit, 300);
      return NextResponse.json({ success: true, data: kit });
    }

    const queryKey = `kits_list_${difficulty || 'all'}`;
    const cachedList = getCachedApiResponse(queryKey);
    if (cachedList) {
      return NextResponse.json(
        { success: true, data: cachedList },
        {
          headers: {
            'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
          },
        }
      );
    }

    const { db } = await connectToDatabase();
    let query: any = {};
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    // Use aggregation to map heavy base64 strings to fast cached URLs without blowing up the payload
    const kits = await db.collection('kits').aggregate([
      { $match: query },
      {
        $addFields: {
          images: {
            $map: {
              input: {
                $range: [
                  0,
                  {
                    $cond: [
                      { $and: [{ $isArray: '$images' }, { $gt: [{ $size: '$images' }, 0] }] },
                      { $size: '$images' },
                      { $cond: [{ $ifNull: ['$image', false] }, 1, 0] }
                    ]
                  }
                ]
              },
              as: 'idx',
              in: {
                $let: {
                  vars: {
                    elem: {
                      $cond: [
                        { $isArray: '$images' },
                        { $arrayElemAt: ['$images', '$$idx'] },
                        '$image'
                      ]
                    }
                  },
                  in: {
                    $cond: [
                      {
                        $or: [
                          { $regexMatch: { input: { $ifNull: ['$$elem', ''] }, regex: '^https?://' } },
                          { $regexMatch: { input: { $ifNull: ['$$elem', ''] }, regex: '^/uploads/' } }
                        ]
                      },
                      '$$elem',
                      { $concat: ['/api/kits/image?id=', '$id', '&idx=', { $toString: '$$idx' }] }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          image: 0
        }
      }
    ]).toArray();

    // Map primary image string to first item of images array
    const optimizedKits = kits.map((kit: any) => ({
      ...kit,
      image: Array.isArray(kit.images) && kit.images.length > 0 ? kit.images[0] : `/api/kits/image?id=${kit.id}&idx=0`,
    }));

    setCachedApiResponse(queryKey, optimizedKits, 120);

    return NextResponse.json(
      { success: true, data: optimizedKits },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    console.error('Kits GET error:', error);
    return NextResponse.json({ success: true, data: [], fallback: true });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    
    if (!body.id) {
      body.id = 'kit-' + Date.now();
    }
    
    const result = await db.collection('kits').insertOne(body);
    invalidateApiCache('kits');
    invalidateCachedImage(`kit_img_${body.id}`);

    return NextResponse.json({ success: true, data: { ...body, _id: result.insertedId } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    const { id, _id, ...updateData } = body;
    
    // Resolve any endpoint URLs back to existing DB images so original image data is never overwritten
    const existing = await db.collection('kits').findOne({ id: id });
    if (Array.isArray(updateData.images) && existing) {
      updateData.images = updateData.images.map((img: string) => {
        if (typeof img === 'string' && img.includes('/api/kits/image')) {
          const match = img.match(/idx=(\d+)/);
          const idx = match ? parseInt(match[1], 10) : 0;
          if (Array.isArray(existing.images) && existing.images[idx]) {
            return existing.images[idx];
          }
          if (idx === 0 && existing.image) {
            return existing.image;
          }
        }
        return img;
      });
    }

    if (updateData.image && typeof updateData.image === 'string' && updateData.image.startsWith('/api/kits/image')) {
      if (Array.isArray(updateData.images) && updateData.images.length > 0) {
        updateData.image = updateData.images[0];
      } else if (existing?.image) {
        updateData.image = existing.image;
      } else {
        delete updateData.image;
      }
    }

    await db.collection('kits').updateOne(
      { id: id },
      { $set: updateData },
      { upsert: true }
    );
    invalidateApiCache('kits');
    invalidateCachedImage(`kit_img_${id}`);

    return NextResponse.json({ success: true, message: 'Kit updated' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const { db } = await connectToDatabase();
    await db.collection('kits').deleteOne({ id: id });
    invalidateApiCache('kits');
    invalidateCachedImage(`kit_img_${id}`);

    return NextResponse.json({ success: true, message: 'Kit deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getCachedApiResponse, setCachedApiResponse, invalidateApiCache, invalidateCachedImage } from '@/lib/serverCache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // If specific ID requested (e.g. quick view modal or detail page)
    if (id) {
      const cacheKey = `product_item_${id}`;
      const cached = getCachedApiResponse(cacheKey);
      if (cached) {
        return NextResponse.json({ success: true, data: cached });
      }

      const { db } = await connectToDatabase();
      const product = await db.collection('products').findOne({ id: id });
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      setCachedApiResponse(cacheKey, product, 300);
      return NextResponse.json({ success: true, data: product });
    }

    const queryKey = `products_list_${category || 'all'}_${search || 'none'}`;
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
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    // Use aggregation to map heavy base64 strings to fast cached URLs without blowing up the payload
    const products = await db.collection('products').aggregate([
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
                      { $concat: ['/api/products/image?id=', '$id', '&idx=', { $toString: '$$idx' }] }
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
    const optimizedProducts = products.map((prod: any) => ({
      ...prod,
      image: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : `/api/products/image?id=${prod.id}&idx=0`,
    }));

    setCachedApiResponse(queryKey, optimizedProducts, 120);

    return NextResponse.json(
      { success: true, data: optimizedProducts },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    console.error('Products GET error:', error);
    return NextResponse.json({ success: true, data: [], fallback: true });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    
    if (!body.id) {
      body.id = 'prod-' + Date.now();
    }
    
    const result = await db.collection('products').insertOne(body);
    invalidateApiCache('products');
    invalidateCachedImage(body.id);

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
    const existing = await db.collection('products').findOne({ id: id });
    if (Array.isArray(updateData.images) && existing) {
      updateData.images = updateData.images.map((img: string) => {
        if (typeof img === 'string' && img.includes('/api/products/image')) {
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

    if (updateData.image && typeof updateData.image === 'string' && updateData.image.startsWith('/api/products/image')) {
      if (Array.isArray(updateData.images) && updateData.images.length > 0) {
        updateData.image = updateData.images[0];
      } else if (existing?.image) {
        updateData.image = existing.image;
      } else {
        delete updateData.image;
      }
    }
    
    await db.collection('products').updateOne(
      { id: id },
      { $set: updateData },
      { upsert: true }
    );
    invalidateApiCache('products');
    invalidateCachedImage(id);

    return NextResponse.json({ success: true, message: 'Product updated' });
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
    await db.collection('products').deleteOne({ id: id });
    invalidateApiCache('products');
    invalidateCachedImage(id);

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

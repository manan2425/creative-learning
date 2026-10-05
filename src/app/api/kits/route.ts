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

    // Exclude heavy images array and base64 image field from bulk list
    const kits = await db.collection('kits')
      .find(query, { projection: { images: 0, image: 0 } })
      .toArray();

    // Map image strings to fast cached image endpoint
    const optimizedKits = kits.map((kit: any) => ({
      ...kit,
      image: `/api/kits/image?id=${kit.id}`,
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
    
    // If the image was unchanged (points to the /api/kits/image endpoint), don't overwrite the original in DB
    if (updateData.image && typeof updateData.image === 'string' && updateData.image.startsWith('/api/kits/image')) {
      delete updateData.image;
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

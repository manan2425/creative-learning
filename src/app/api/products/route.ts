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

    // Exclude heavy duplicate images array and heavy base64 image field from bulk list
    // This reduces payload from 50MB down to <100KB, making the response load in ~1 second!
    const products = await db.collection('products')
      .find(query, { projection: { images: 0, image: 0 } })
      .toArray();

    // Map image URL to dedicated fast cached image endpoint for each item
    const optimizedProducts = products.map((prod: any) => ({
      ...prod,
      image: `/api/products/image?id=${prod.id}`,
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
    
    // If the image was unchanged (points to the /api/products/image endpoint), don't overwrite the original in DB
    if (updateData.image && typeof updateData.image === 'string' && updateData.image.startsWith('/api/products/image')) {
      delete updateData.image;
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

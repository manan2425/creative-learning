import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

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

    const products = await db.collection('products').find(query).toArray();
    return NextResponse.json(
      { success: true, data: products },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
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
    
    await db.collection('products').updateOne(
      { id: id },
      { $set: updateData },
      { upsert: true }
    );
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
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

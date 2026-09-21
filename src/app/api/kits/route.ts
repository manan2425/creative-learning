import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');

    const { db } = await connectToDatabase();
    let query: any = {};
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    const kits = await db.collection('kits').find(query).toArray();
    return NextResponse.json({ success: true, data: kits });
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
    
    await db.collection('kits').updateOne(
      { id: id },
      { $set: updateData },
      { upsert: true }
    );
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
    return NextResponse.json({ success: true, message: 'Kit deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

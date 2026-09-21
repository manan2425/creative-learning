import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');

    const { db } = await connectToDatabase();
    let query: any = {};
    if (level && level !== 'All') {
      query.level = level;
    }

    const practicals = await db.collection('practicals').find(query).toArray();
    return NextResponse.json({ success: true, data: practicals });
  } catch (error: any) {
    console.error('Practicals GET error:', error);
    return NextResponse.json({ success: true, data: [], fallback: true });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    
    if (!body.id) {
      body.id = 'prac-' + Date.now();
    }
    
    const result = await db.collection('practicals').insertOne(body);
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
    
    await db.collection('practicals').updateOne(
      { id: id },
      { $set: updateData },
      { upsert: true }
    );
    return NextResponse.json({ success: true, message: 'Practical updated' });
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
    await db.collection('practicals').deleteOne({ id: id });
    return NextResponse.json({ success: true, message: 'Practical deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

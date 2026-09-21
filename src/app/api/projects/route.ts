import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const projects = await db.collection('projects').find({}).toArray();
    return NextResponse.json(
      { success: true, data: projects },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ success: true, data: [], fallback: true });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    if (!body.id) body.id = 'proj-' + Date.now();
    const result = await db.collection('projects').insertOne(body);
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
    await db.collection('projects').updateOne({ id: id }, { $set: updateData }, { upsert: true });
    return NextResponse.json({ success: true, message: 'Project updated' });
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
    await db.collection('projects').deleteOne({ id: id });
    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

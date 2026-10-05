import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getCachedApiResponse, setCachedApiResponse, invalidateApiCache } from '@/lib/serverCache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const queryKey = `practicals_list_${level || 'all'}`;

    const cached = getCachedApiResponse(queryKey);
    if (cached) {
      return NextResponse.json(
        { success: true, data: cached },
        {
          headers: {
            'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
          },
        }
      );
    }

    const { db } = await connectToDatabase();
    let query: any = {};
    if (level && level !== 'All') {
      query.level = level;
    }

    const practicals = await db.collection('practicals').find(query).toArray();
    setCachedApiResponse(queryKey, practicals, 120);

    return NextResponse.json(
      { success: true, data: practicals },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    );
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
    invalidateApiCache('practicals_list');
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
    invalidateApiCache('practicals_list');
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
    invalidateApiCache('practicals_list');
    return NextResponse.json({ success: true, message: 'Practical deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

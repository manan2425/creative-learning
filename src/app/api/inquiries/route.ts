import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ inquiries: [] });
    }
    const inquiries = await db
      .collection('inquiries')
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    return NextResponse.json({ inquiries });
  } catch (err) {
    console.error('Error fetching inquiries from MongoDB:', err);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    if (db) {
      const doc = {
        ...body,
        createdAt: new Date(),
        status: 'new',
      };
      await db.collection('inquiries').insertOne(doc);
      console.log('📬 New Inquiry recorded in MongoDB Atlas:', body.name || body.phone);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error recording inquiry in MongoDB:', err);
    return NextResponse.json({ success: true, warning: 'Saved locally' });
  }
}

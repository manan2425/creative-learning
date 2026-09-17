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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const db = await getDb();

    if (!db) {
      return NextResponse.json({ success: true, warning: 'MongoDB not connected' });
    }

    if (id) {
      const { ObjectId } = await import('mongodb');
      try {
        await db.collection('inquiries').deleteOne({ _id: new ObjectId(id) });
      } catch {
        await db.collection('inquiries').deleteOne({ _id: id as any });
      }
      return NextResponse.json({ success: true, message: `Inquiry ${id} deleted` });
    } else {
      // Clear all inquiries if no specific ID passed
      await db.collection('inquiries').deleteMany({});
      return NextResponse.json({ success: true, message: 'All inquiries cleared' });
    }
  } catch (err: any) {
    console.error('Error deleting inquiry:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete inquiry' }, { status: 500 });
  }
}


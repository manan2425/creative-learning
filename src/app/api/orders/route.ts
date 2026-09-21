import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'orders' or 'inquiries'

    const { db } = await connectToDatabase();
    
    if (type === 'inquiries') {
      const inquiries = await db.collection('inquiries').find({}).sort({ timestamp: -1 }).limit(100).toArray();
      return NextResponse.json(
        { success: true, data: inquiries },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }

    const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).limit(100).toArray();
    return NextResponse.json(
      { success: true, data: orders },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ success: true, data: [], fallback: true });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    
    if (body.inquiryType) {
      // It is an inquiry log
      const inquiry = {
        id: 'inq-' + Date.now(),
        type: body.inquiryType,
        targetTitle: body.targetTitle || 'General',
        targetId: body.targetId || '',
        customerName: body.customerName || 'Anonymous',
        customerPhone: body.customerPhone || '',
        message: body.message || '',
        timestamp: new Date().toISOString(),
      };
      await db.collection('inquiries').insertOne(inquiry);
      return NextResponse.json({ success: true, data: inquiry });
    }

    // It is a WhatsApp Order record
    const orderData = {
      ...body,
      orderId: body.orderId || 'CL-ORD-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: body.status || 'New',
    };

    const result = await db.collection('orders').insertOne(orderData);
    return NextResponse.json({ success: true, data: { ...orderData, _id: result.insertedId } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status, notes } = body;
    const { db } = await connectToDatabase();

    await db.collection('orders').updateOne(
      { orderId: orderId },
      { $set: { status, notes, updatedAt: new Date().toISOString() } }
    );
    return NextResponse.json({ success: true, message: 'Order status updated' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    if (!orderId) return NextResponse.json({ success: false, error: 'Order ID required' }, { status: 400 });

    const { db } = await connectToDatabase();
    await db.collection('orders').deleteOne({ orderId: orderId });
    return NextResponse.json({ success: true, message: 'Order deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

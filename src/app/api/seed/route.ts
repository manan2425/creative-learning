import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { INITIAL_SETTINGS } from '@/data/initialData';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Check settings only
    const settings = await db.collection('settings').findOne();
    if (!settings) {
      await db.collection('settings').insertOne(INITIAL_SETTINGS as any);
    }

    return NextResponse.json({
      success: true,
      message: 'MongoDB collections status.',
      counts: {
        products: await db.collection('products').countDocuments(),
        kits: await db.collection('kits').countDocuments(),
        practicals: await db.collection('practicals').countDocuments(),
        projects: await db.collection('projects').countDocuments(),
        orders: await db.collection('orders').countDocuments(),
      }
    });
  } catch (error: any) {
    console.error('Seed API error:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Database error'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    const { db } = await connectToDatabase();
    await db.collection('products').deleteMany({});
    await db.collection('kits').deleteMany({});
    await db.collection('practicals').deleteMany({});
    await db.collection('projects').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('inquiries').deleteMany({});
    await db.collection('quotes').deleteMany({});
    
    // Clean legacy collections if any
    try { await db.collection('catalog').deleteMany({}); } catch(e) {}
    try { await db.collection('company').deleteMany({}); } catch(e) {}

    await db.collection('settings').deleteMany({});
    await db.collection('settings').insertOne(INITIAL_SETTINGS as any);

    return NextResponse.json({
      success: true,
      message: 'All collections completely cleared (0 items). Ready for fresh client inventory.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

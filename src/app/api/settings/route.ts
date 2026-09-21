import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { INITIAL_SETTINGS } from '@/data/initialData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    let settings = await db.collection('settings').findOne({});
    if (!settings) {
      await db.collection('settings').insertOne(INITIAL_SETTINGS as any);
      settings = INITIAL_SETTINGS as any;
    } else {
      // Merge with default initial structure to guarantee newly added fields exist
      settings = {
        ...INITIAL_SETTINGS,
        ...settings,
        categories: settings.categories?.length ? settings.categories : INITIAL_SETTINGS.categories,
        hero: { ...INITIAL_SETTINGS.hero, ...(settings.hero || {}) },
        whyUs: { ...INITIAL_SETTINGS.whyUs, ...(settings.whyUs || {}) },
        quotes: settings.quotes?.length ? settings.quotes : INITIAL_SETTINGS.quotes,
      };
    }
    return NextResponse.json(
      { success: true, data: settings },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ success: true, data: INITIAL_SETTINGS, fallback: true });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    const { _id, ...settingsData } = body;
    
    await db.collection('settings').updateOne(
      {},
      { 
        $set: {
          ...settingsData,
          updatedAt: new Date().toISOString()
        } 
      },
      { upsert: true }
    );
    return NextResponse.json({ success: true, message: 'Settings saved', data: settingsData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

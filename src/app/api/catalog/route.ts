import { NextResponse } from 'next/server';
import { getCatalogDataAsync, saveCatalogDataAsync } from '@/lib/storage';
import { CatalogData } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getCatalogDataAsync();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('API GET /api/catalog error:', error);
    return NextResponse.json({ error: 'Failed to retrieve catalog data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CatalogData = await request.json();
    if (!body || !Array.isArray(body.products)) {
      return NextResponse.json({ error: 'Invalid catalog data structure' }, { status: 400 });
    }
    const success = await saveCatalogDataAsync(body);
    if (success) {
      return NextResponse.json({ success: true, data: body });
    } else {
      return NextResponse.json({ error: 'Failed to save catalog data' }, { status: 500 });
    }
  } catch (error) {
    console.error('API POST /api/catalog error:', error);
    return NextResponse.json({ error: 'Failed to update catalog data' }, { status: 500 });
  }
}

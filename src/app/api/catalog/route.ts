import { NextResponse } from 'next/server';
import { getCatalogData, saveCatalogData } from '@/lib/storage';
import { CatalogData } from '@/types';

export async function GET() {
  try {
    const data = getCatalogData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve catalog data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CatalogData = await request.json();
    if (!body || !Array.isArray(body.products)) {
      return NextResponse.json({ error: 'Invalid catalog data structure' }, { status: 400 });
    }
    const success = saveCatalogData(body);
    if (success) {
      return NextResponse.json({ success: true, data: body });
    } else {
      return NextResponse.json({ error: 'Failed to save catalog data' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update catalog data' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { PracticalsTable } from '@/lib/db-tables';
import { getCatalogDataAsync, saveCatalogDataAsync } from '@/lib/storage';
import { PracticalActivity } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const catalog = await getCatalogDataAsync();
    return NextResponse.json({ practicals: catalog.practicals || [] });
  } catch (error) {
    console.error('API GET /api/practicals error:', error);
    return NextResponse.json({ error: 'Failed to retrieve practicals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const item: PracticalActivity = await request.json();
    if (!item || !item.key || !item.title) {
      return NextResponse.json({ error: 'Practical title and key are required' }, { status: 400 });
    }

    await PracticalsTable.upsert(item);

    const catalog = await getCatalogDataAsync();
    const idx = catalog.practicals.findIndex((p) => p.key === item.key);
    const updated = [...catalog.practicals];
    if (idx >= 0) {
      updated[idx] = item;
    } else {
      updated.push(item);
    }
    await saveCatalogDataAsync({ ...catalog, practicals: updated });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('API POST /api/practicals error:', error);
    return NextResponse.json({ error: 'Failed to save practical' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) {
      return NextResponse.json({ error: 'Practical key parameter is required' }, { status: 400 });
    }

    await PracticalsTable.delete(key);

    const catalog = await getCatalogDataAsync();
    const updated = catalog.practicals.filter((p) => p.key !== key);
    await saveCatalogDataAsync({ ...catalog, practicals: updated });

    return NextResponse.json({ success: true, deletedKey: key });
  } catch (error) {
    console.error('API DELETE /api/practicals error:', error);
    return NextResponse.json({ error: 'Failed to delete practical' }, { status: 500 });
  }
}

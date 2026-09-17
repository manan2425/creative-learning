import { NextResponse } from 'next/server';
import { QuotesTable } from '@/lib/db-tables';
import { getCatalogDataAsync, saveCatalogDataAsync } from '@/lib/storage';
import { Quote } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const mongoItems = await QuotesTable.getAll();
    if (mongoItems.length > 0) {
      return NextResponse.json({ quotes: mongoItems });
    }
    const catalog = await getCatalogDataAsync();
    return NextResponse.json({ quotes: catalog.quotes || [] });
  } catch (error) {
    console.error('API GET /api/quotes error:', error);
    return NextResponse.json({ error: 'Failed to retrieve quotes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const quote: Quote = await request.json();
    if (!quote || !quote.id || !quote.text) {
      return NextResponse.json({ error: 'Quote text and id are required' }, { status: 400 });
    }

    const catalog = await getCatalogDataAsync();
    const isHero = quote.id === catalog.heroQuoteId;
    await QuotesTable.upsert(quote, isHero);

    const idx = catalog.quotes.findIndex((q) => q.id === quote.id);
    const updated = [...catalog.quotes];
    if (idx >= 0) {
      updated[idx] = quote;
    } else {
      updated.push(quote);
    }
    await saveCatalogDataAsync({ ...catalog, quotes: updated });

    return NextResponse.json({ success: true, quote });
  } catch (error) {
    console.error('API POST /api/quotes error:', error);
    return NextResponse.json({ error: 'Failed to save quote' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Quote id parameter is required' }, { status: 400 });
    }

    await QuotesTable.delete(id);

    const catalog = await getCatalogDataAsync();
    const updated = catalog.quotes.filter((q) => q.id !== id);
    const newHero = catalog.heroQuoteId === id ? (updated[0]?.id || '') : catalog.heroQuoteId;
    await saveCatalogDataAsync({ ...catalog, quotes: updated, heroQuoteId: newHero });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('API DELETE /api/quotes error:', error);
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}

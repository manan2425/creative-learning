import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCatalogDataAsync } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  let mongoConnected = false;
  let mongoError = '';
  let ipWhitelistRequired = false;

  try {
    const db = await getDb();
    if (db) {
      await db.command({ ping: 1 });
      mongoConnected = true;
    }
  } catch (err: any) {
    mongoError = err?.message || 'Connection failed';
    if (
      mongoError.includes('SSL alert number 80') ||
      mongoError.includes('tlsv1 alert internal error') ||
      mongoError.includes('MongoServerSelectionError')
    ) {
      ipWhitelistRequired = true;
    }
  }

  const catalog = await getCatalogDataAsync();

  return NextResponse.json({
    mongoConnected,
    mongoError: mongoError ? mongoError.slice(0, 150) : null,
    ipWhitelistRequired,
    stats: {
      products: catalog.products?.length || 0,
      practicals: catalog.practicals?.length || 0,
      projects: catalog.projects?.length || 0,
      quotes: catalog.quotes?.length || 0,
      company: catalog.company?.name || 'Creative Learning',
    },
    storageEngine: mongoConnected ? 'MongoDB Atlas Cloud' : 'Local Persistent Storage (Syncing)',
  });
}

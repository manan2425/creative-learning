import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';
import { TABLES, initializeMongoTables } from '@/lib/db-tables';
import { saveCatalogData } from '@/lib/storage';
import initialCatalog from '@/data/initialCatalog.json';
import { CatalogData } from '@/types';

export const dynamic = 'force-dynamic';

const DEFAULT_PASS_HASH = crypto.createHash('sha256').update('admin123').digest('hex');
const DEFAULT_RECOVERY_HASH = crypto.createHash('sha256').update('CREATIVE-LEARNING-RESET').digest('hex');

export async function GET() {
  return NextResponse.json({
    message: 'Creative Learning Database Reset Endpoint',
    readyToReset: true,
    tables: [
      { name: 'products', description: 'Components, MCUs, sensors & starter kits', count: initialCatalog.products.length },
      { name: 'practicals', description: 'Step-by-step guided lab experiments & schematics', count: initialCatalog.practicals.length },
      { name: 'projects', description: 'Robotics & IoT engineering blueprints', count: initialCatalog.projects.length },
      { name: 'quotes', description: 'Featured vision quotes & hero badges', count: initialCatalog.quotes.length },
      { name: 'company', description: 'Contact, phone, WhatsApp & brand identity', count: 1 },
      { name: 'auth', description: 'Admin password hash & recovery code hash', count: 1 },
      { name: 'inquiries', description: 'Customer quotes & order submissions', count: 'variable' },
      { name: 'catalog', description: 'Composite root store for fast unified caching', count: 1 },
    ],
  });
}

export async function POST(request: Request) {
  try {
    let resetInquiries = false;
    try {
      const body = await request.json();
      if (body && body.resetInquiries) {
        resetInquiries = true;
      }
    } catch {
      // Body may be empty
    }

    let mongoSynced = false;
    let mongoError: string | null = null;
    const db = await getDb();

    if (db) {
      try {
        // Initialize indexes
        await initializeMongoTables(db);

        // 1. Reset PRODUCTS table
        const prodCol = db.collection(TABLES.PRODUCTS);
        await prodCol.deleteMany({});
        if (initialCatalog.products && initialCatalog.products.length > 0) {
          const prodDocs = initialCatalog.products.map((p) => ({
            ...p,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
          await prodCol.insertMany(prodDocs);
        }

        // 2. Reset PRACTICALS table
        const pracCol = db.collection(TABLES.PRACTICALS);
        await pracCol.deleteMany({});
        if (initialCatalog.practicals && initialCatalog.practicals.length > 0) {
          const pracDocs = initialCatalog.practicals.map((pr) => ({
            ...pr,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
          await pracCol.insertMany(pracDocs);
        }

        // 3. Reset PROJECTS table
        const projCol = db.collection(TABLES.PROJECTS);
        await projCol.deleteMany({});
        if (initialCatalog.projects && initialCatalog.projects.length > 0) {
          const projDocs = initialCatalog.projects.map((pj) => ({
            ...pj,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
          await projCol.insertMany(projDocs);
        }

        // 4. Reset QUOTES table
        const quotesCol = db.collection(TABLES.QUOTES);
        await quotesCol.deleteMany({});
        if (initialCatalog.quotes && initialCatalog.quotes.length > 0) {
          const quoteDocs = initialCatalog.quotes.map((q) => ({
            ...q,
            isHero: q.id === initialCatalog.heroQuoteId,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
          await quotesCol.insertMany(quoteDocs);
        }

        // 5. Reset COMPANY table
        const companyCol = db.collection(TABLES.COMPANY);
        await companyCol.updateOne(
          { _id: 'company_config' as any },
          { $set: { _id: 'company_config', ...initialCatalog.company, updatedAt: new Date() } },
          { upsert: true }
        );

        // 6. Reset AUTH credentials table
        const authCol = db.collection('auth');
        await authCol.updateOne(
          { _id: 'admin_credentials' as any },
          {
            $set: {
              _id: 'admin_credentials',
              passHash: DEFAULT_PASS_HASH,
              recoveryHash: DEFAULT_RECOVERY_HASH,
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );

        // 7. Reset INQUIRIES table (if requested)
        if (resetInquiries) {
          const inqCol = db.collection(TABLES.INQUIRIES);
          await inqCol.deleteMany({});
        }

        // 8. Reset COMPOSITE CATALOG table
        const catalogCol = db.collection(TABLES.CATALOG);
        await catalogCol.updateOne(
          { _id: 'main_catalog' as any },
          { $set: { _id: 'main_catalog', data: initialCatalog, updatedAt: new Date() } },
          { upsert: true }
        );

        mongoSynced = true;
        console.log('✅ MongoDB database completely reset and seeded with all tables!');
      } catch (err: any) {
        mongoError = err?.message || 'Failed to populate MongoDB tables';
        console.warn('MongoDB reset warning:', mongoError);
      }
    }

    // Always keep local disk copy in sync
    saveCatalogData(initialCatalog as CatalogData);

    return NextResponse.json({
      success: true,
      message: 'Database reset & re-seeded successfully across all tables',
      mongoSynced,
      mongoError,
      counts: {
        products: initialCatalog.products.length,
        practicals: initialCatalog.practicals.length,
        projects: initialCatalog.projects.length,
        quotes: initialCatalog.quotes.length,
      },
      catalog: initialCatalog,
    });
  } catch (error) {
    console.error('API POST /api/reset-db error:', error);
    return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 });
  }
}


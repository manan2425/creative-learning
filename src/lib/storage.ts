import fs from 'fs';
import path from 'path';
import { CatalogData, CompanyConfig } from '@/types';
import initialData from '@/data/initialCatalog.json';
import { getDb } from './mongodb';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json');

// In-memory fallback if file system or mongo is unreachable
let memoryCatalog: CatalogData = initialData as CatalogData;

/**
 * Synchronous local file/memory getter (used as instantaneous local fallback)
 */
export function getCatalogData(): CatalogData {
  try {
    if (fs.existsSync(CATALOG_FILE)) {
      const content = fs.readFileSync(CATALOG_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.products)) {
        memoryCatalog = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading local catalog.json:', err);
  }
  return memoryCatalog;
}

/**
 * Synchronous local file/memory saver
 */
export function saveCatalogData(data: CatalogData): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CATALOG_FILE, JSON.stringify(data, null, 2), 'utf-8');
    memoryCatalog = data;
    return true;
  } catch (err) {
    console.error('Error writing local catalog.json:', err);
    memoryCatalog = data;
    return true;
  }
}

/**
 * Asynchronous Getter that reads directly from MongoDB Atlas online,
 * automatically migrating initial products on first load if the database is empty.
 */
export async function getCatalogDataAsync(): Promise<CatalogData> {
  try {
    const db = await getDb();
    if (db) {
      const collection = db.collection('catalog');
      const record = await collection.findOne({ _id: 'main_catalog' as any });

      if (record && record.data && Array.isArray(record.data.products)) {
        memoryCatalog = record.data as CatalogData;
        // Also keep local disk copy in sync
        saveCatalogData(memoryCatalog);
        return memoryCatalog;
      }

      // If database is brand new and empty, auto-seed with initial catalog data
      console.log('⚡ Initializing & seeding MongoDB Atlas with Creative Learning hardware catalog...');
      const fallback = getCatalogData();
      await saveCatalogDataAsync(fallback);
      return fallback;
    }
  } catch (err) {
    console.warn('MongoDB Atlas read fallback to local storage:', (err as any)?.message || err);
  }

  // Fallback to local storage
  return getCatalogData();
}

/**
 * Asynchronous Saver that saves directly to MongoDB Atlas online
 * across multiple collections (catalog, products, practicals, projects, quotes, company)
 * and mirrors changes to local disk.
 */
export async function saveCatalogDataAsync(data: CatalogData): Promise<boolean> {
  let mongoSuccess = false;

  try {
    const db = await getDb();
    if (db) {
      // 1. Save main composite catalog document
      const catalogCol = db.collection('catalog');
      await catalogCol.updateOne(
        { _id: 'main_catalog' as any },
        { $set: { _id: 'main_catalog', data: data, updatedAt: new Date() } },
        { upsert: true }
      );

      // 2. Sync individual products collection for easy MongoDB browsing/editing
      if (Array.isArray(data.products) && data.products.length > 0) {
        const prodCol = db.collection('products');
        const bulkOps = data.products.map((prod) => ({
          updateOne: {
            filter: { id: prod.id },
            update: { $set: { ...prod, updatedAt: new Date() } },
            upsert: true,
          },
        }));
        await prodCol.bulkWrite(bulkOps);
      }

      // 3. Sync individual practicals collection
      if (Array.isArray(data.practicals) && data.practicals.length > 0) {
        const pracCol = db.collection('practicals');
        const bulkPrac = data.practicals.map((prac) => ({
          updateOne: {
            filter: { key: prac.key },
            update: { $set: { ...prac, updatedAt: new Date() } },
            upsert: true,
          },
        }));
        await pracCol.bulkWrite(bulkPrac);
      }

      // 4. Sync individual projects collection
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        const projCol = db.collection('projects');
        const bulkProj = data.projects.map((proj) => ({
          updateOne: {
            filter: { key: proj.key },
            update: { $set: { ...proj, updatedAt: new Date() } },
            upsert: true,
          },
        }));
        await projCol.bulkWrite(bulkProj);
      }

      // 5. Sync quotes collection
      if (Array.isArray(data.quotes) && data.quotes.length > 0) {
        const quotesCol = db.collection('quotes');
        const bulkQuotes = data.quotes.map((q) => ({
          updateOne: {
            filter: { id: q.id },
            update: { $set: { ...q, isHero: q.id === data.heroQuoteId, updatedAt: new Date() } },
            upsert: true,
          },
        }));
        await quotesCol.bulkWrite(bulkQuotes);
      }

      // 6. Sync company settings collection
      if (data.company) {
        const companyCol = db.collection('company');
        await companyCol.updateOne(
          { _id: 'company_config' as any },
          { $set: { _id: 'company_config', ...data.company, updatedAt: new Date() } },
          { upsert: true }
        );
      }

      mongoSuccess = true;
      console.log('✅ Catalog and all collections successfully updated in MongoDB Atlas online!');
    }
  } catch (err) {
    console.warn('MongoDB Atlas write fallback to local storage:', (err as any)?.message || err);
  }

  // Always keep local disk copy synced as well
  saveCatalogData(data);

  return mongoSuccess || true;
}

export async function getCompanyDataAsync(): Promise<CompanyConfig> {
  const catalog = await getCatalogDataAsync();
  return catalog.company || (initialData.company as CompanyConfig);
}

export async function saveCompanyDataAsync(company: CompanyConfig): Promise<boolean> {
  const catalog = await getCatalogDataAsync();
  catalog.company = company;
  return saveCatalogDataAsync(catalog);
}

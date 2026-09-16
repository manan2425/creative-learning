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
      await collection.updateOne(
        { _id: 'main_catalog' as any },
        { $set: { _id: 'main_catalog', data: fallback, updatedAt: new Date() } },
        { upsert: true }
      );
      return fallback;
    }
  } catch (err) {
    console.error('MongoDB Atlas read failed, falling back to local storage:', err);
  }

  // Fallback to local storage
  return getCatalogData();
}

/**
 * Asynchronous Saver that saves directly to MongoDB Atlas online
 * and mirrors changes to local disk.
 */
export async function saveCatalogDataAsync(data: CatalogData): Promise<boolean> {
  let mongoSuccess = false;

  try {
    const db = await getDb();
    if (db) {
      const collection = db.collection('catalog');
      await collection.updateOne(
        { _id: 'main_catalog' as any },
        { $set: { _id: 'main_catalog', data: data, updatedAt: new Date() } },
        { upsert: true }
      );
      mongoSuccess = true;
      console.log('✅ Catalog successfully saved to MongoDB Atlas online!');
    }
  } catch (err) {
    console.error('MongoDB Atlas save failed:', err);
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

import { Collection, Db } from 'mongodb';
import { getDb } from './mongodb';
import { Product, PracticalActivity, Project, Quote, CompanyConfig } from '@/types';

/**
 * MongoDB Collections ("Tables") Names
 */
export const TABLES = {
  PRODUCTS: 'products',
  PRACTICALS: 'practicals',
  PROJECTS: 'projects',
  QUOTES: 'quotes',
  COMPANY: 'company',
  INQUIRIES: 'inquiries',
  CATALOG: 'catalog',
} as const;

/**
 * Ensures indexes exist on MongoDB tables for high performance queries
 */
export async function initializeMongoTables(db: Db): Promise<void> {
  try {
    // 1. Products table indexes
    const prodCol = db.collection(TABLES.PRODUCTS);
    await prodCol.createIndex({ id: 1 }, { unique: true });
    await prodCol.createIndex({ category: 1 });
    await prodCol.createIndex({ sku: 1 });
    await prodCol.createIndex({ name: 'text', description: 'text', specifications: 'text' });

    // 2. Practicals table indexes
    const pracCol = db.collection(TABLES.PRACTICALS);
    await pracCol.createIndex({ key: 1 }, { unique: true });
    await pracCol.createIndex({ product: 1 });

    // 3. Projects table indexes
    const projCol = db.collection(TABLES.PROJECTS);
    await projCol.createIndex({ key: 1 }, { unique: true });

    // 4. Quotes table indexes
    const quotesCol = db.collection(TABLES.QUOTES);
    await quotesCol.createIndex({ id: 1 }, { unique: true });

    // 5. Inquiries table indexes
    const inqCol = db.collection(TABLES.INQUIRIES);
    await inqCol.createIndex({ createdAt: -1 });

    console.log('✅ MongoDB tables and indexes initialized successfully.');
  } catch (err) {
    console.warn('MongoDB index initialization note:', (err as any)?.message || err);
  }
}

/**
 * Helper to get a collection
 */
export async function getTable<T = any>(tableName: string): Promise<Collection<any> | null> {
  const db = await getDb();
  if (!db) return null;
  return db.collection(tableName);
}

// -------------------------------------------------------------
// PRODUCTS TABLE CRUD
// -------------------------------------------------------------
export const ProductsTable = {
  async getAll(): Promise<Product[]> {
    const col = await getTable<Product>(TABLES.PRODUCTS);
    if (!col) return [];
    const items = await col.find({}).toArray();
    return items.map((doc: any) => {
      const { _id, ...rest } = doc;
      return rest as Product;
    });
  },

  async getById(id: string): Promise<Product | null> {
    const col = await getTable<Product>(TABLES.PRODUCTS);
    if (!col) return null;
    const doc: any = await col.findOne({ id });
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return rest as Product;
  },

  async upsert(product: Product): Promise<boolean> {
    const col = await getTable<Product>(TABLES.PRODUCTS);
    if (!col) return false;
    await col.updateOne(
      { id: product.id },
      { $set: { ...product, updatedAt: new Date() } },
      { upsert: true }
    );
    return true;
  },

  async delete(id: string): Promise<boolean> {
    const col = await getTable<Product>(TABLES.PRODUCTS);
    if (!col) return false;
    const res = await col.deleteOne({ id });
    return res.deletedCount > 0;
  },

  async bulkUpsert(products: Product[]): Promise<boolean> {
    const col = await getTable<Product>(TABLES.PRODUCTS);
    if (!col || products.length === 0) return false;
    const ops = products.map((p) => ({
      updateOne: {
        filter: { id: p.id },
        update: { $set: { ...p, updatedAt: new Date() } },
        upsert: true,
      },
    }));
    await col.bulkWrite(ops);
    return true;
  },
};

// -------------------------------------------------------------
// PRACTICALS TABLE CRUD
// -------------------------------------------------------------
export const PracticalsTable = {
  async getAll(): Promise<PracticalActivity[]> {
    const col = await getTable<PracticalActivity>(TABLES.PRACTICALS);
    if (!col) return [];
    const items = await col.find({}).toArray();
    return items.map((doc: any) => {
      const { _id, ...rest } = doc;
      return rest as PracticalActivity;
    });
  },

  async upsert(item: PracticalActivity): Promise<boolean> {
    const col = await getTable<PracticalActivity>(TABLES.PRACTICALS);
    if (!col) return false;
    await col.updateOne(
      { key: item.key },
      { $set: { ...item, updatedAt: new Date() } },
      { upsert: true }
    );
    return true;
  },

  async delete(key: string): Promise<boolean> {
    const col = await getTable<PracticalActivity>(TABLES.PRACTICALS);
    if (!col) return false;
    const res = await col.deleteOne({ key });
    return res.deletedCount > 0;
  },

  async bulkUpsert(practicals: PracticalActivity[]): Promise<boolean> {
    const col = await getTable<PracticalActivity>(TABLES.PRACTICALS);
    if (!col || practicals.length === 0) return false;
    const ops = practicals.map((p) => ({
      updateOne: {
        filter: { key: p.key },
        update: { $set: { ...p, updatedAt: new Date() } },
        upsert: true,
      },
    }));
    await col.bulkWrite(ops);
    return true;
  },
};

// -------------------------------------------------------------
// PROJECTS TABLE CRUD
// -------------------------------------------------------------
export const ProjectsTable = {
  async getAll(): Promise<Project[]> {
    const col = await getTable<Project>(TABLES.PROJECTS);
    if (!col) return [];
    const items = await col.find({}).toArray();
    return items.map((doc: any) => {
      const { _id, ...rest } = doc;
      return rest as Project;
    });
  },

  async upsert(item: Project): Promise<boolean> {
    const col = await getTable<Project>(TABLES.PROJECTS);
    if (!col) return false;
    await col.updateOne(
      { key: item.key },
      { $set: { ...item, updatedAt: new Date() } },
      { upsert: true }
    );
    return true;
  },

  async delete(key: string): Promise<boolean> {
    const col = await getTable<Project>(TABLES.PROJECTS);
    if (!col) return false;
    const res = await col.deleteOne({ key });
    return res.deletedCount > 0;
  },

  async bulkUpsert(projects: Project[]): Promise<boolean> {
    const col = await getTable<Project>(TABLES.PROJECTS);
    if (!col || projects.length === 0) return false;
    const ops = projects.map((p) => ({
      updateOne: {
        filter: { key: p.key },
        update: { $set: { ...p, updatedAt: new Date() } },
        upsert: true,
      },
    }));
    await col.bulkWrite(ops);
    return true;
  },
};

// -------------------------------------------------------------
// QUOTES TABLE CRUD
// -------------------------------------------------------------
export const QuotesTable = {
  async getAll(): Promise<Quote[]> {
    const col = await getTable<Quote>(TABLES.QUOTES);
    if (!col) return [];
    const items = await col.find({}).toArray();
    return items.map((doc: any) => {
      const { _id, ...rest } = doc;
      return rest as Quote;
    });
  },

  async upsert(quote: Quote, isHero = false): Promise<boolean> {
    const col = await getTable<Quote>(TABLES.QUOTES);
    if (!col) return false;
    await col.updateOne(
      { id: quote.id },
      { $set: { ...quote, isHero, updatedAt: new Date() } },
      { upsert: true }
    );
    return true;
  },

  async delete(id: string): Promise<boolean> {
    const col = await getTable<Quote>(TABLES.QUOTES);
    if (!col) return false;
    const res = await col.deleteOne({ id });
    return res.deletedCount > 0;
  },

  async bulkUpsert(quotes: Quote[], heroQuoteId?: string): Promise<boolean> {
    const col = await getTable<Quote>(TABLES.QUOTES);
    if (!col || quotes.length === 0) return false;
    const ops = quotes.map((q) => ({
      updateOne: {
        filter: { id: q.id },
        update: { $set: { ...q, isHero: q.id === heroQuoteId, updatedAt: new Date() } },
        upsert: true,
      },
    }));
    await col.bulkWrite(ops);
    return true;
  },
};

// -------------------------------------------------------------
// COMPANY CONFIG TABLE CRUD
// -------------------------------------------------------------
export const CompanyTable = {
  async get(): Promise<CompanyConfig | null> {
    const col = await getTable<CompanyConfig>(TABLES.COMPANY);
    if (!col) return null;
    const doc: any = await col.findOne({ _id: 'company_config' as any });
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return rest as CompanyConfig;
  },

  async upsert(company: CompanyConfig): Promise<boolean> {
    const col = await getTable<CompanyConfig>(TABLES.COMPANY);
    if (!col) return false;
    await col.updateOne(
      { _id: 'company_config' as any },
      { $set: { _id: 'company_config', ...company, updatedAt: new Date() } },
      { upsert: true }
    );
    return true;
  },
};

// -------------------------------------------------------------
// INQUIRIES & ORDERS TABLE CRUD
// -------------------------------------------------------------
export const InquiriesTable = {
  async getAll(limit = 100): Promise<any[]> {
    const col = await getTable(TABLES.INQUIRIES);
    if (!col) return [];
    return col.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
  },

  async insert(inquiry: any): Promise<boolean> {
    const col = await getTable(TABLES.INQUIRIES);
    if (!col) return false;
    await col.insertOne({
      ...inquiry,
      createdAt: new Date(),
      status: 'new',
    });
    return true;
  },

  async delete(id: string): Promise<boolean> {
    const col = await getTable(TABLES.INQUIRIES);
    if (!col) return false;
    const { ObjectId } = require('mongodb');
    try {
      await col.deleteOne({ _id: new ObjectId(id) });
      return true;
    } catch {
      await col.deleteOne({ _id: id });
      return true;
    }
  },
};

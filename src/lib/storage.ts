import fs from 'fs';
import path from 'path';
import { CatalogData, CompanyConfig } from '@/types';
import initialData from '@/data/initialCatalog.json';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json');
const COMPANY_FILE = path.join(DATA_DIR, 'company.json');

// In-memory fallback if fs writes fail in serverless
let memoryCatalog: CatalogData = initialData as CatalogData;

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
    console.error('Error reading catalog.json:', err);
  }
  return memoryCatalog;
}

export function saveCatalogData(data: CatalogData): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CATALOG_FILE, JSON.stringify(data, null, 2), 'utf-8');
    memoryCatalog = data;
    return true;
  } catch (err) {
    console.error('Error writing catalog.json, saving to memory:', err);
    memoryCatalog = data;
    return true;
  }
}

export function getCompanyData(): CompanyConfig {
  const catalog = getCatalogData();
  return catalog.company || (initialData.company as CompanyConfig);
}

export function saveCompanyData(company: CompanyConfig): boolean {
  const catalog = getCatalogData();
  catalog.company = company;
  return saveCatalogData(catalog);
}

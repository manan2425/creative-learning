export interface Product {
  id: string;
  name: string;
  category: string;
  page?: number;
  description: string;
  specifications: string;
  applications: string;
  image?: string;
  images?: string[];
  price: string;
  sku: string;
  pdf?: string;
}

export interface PracticalActivity {
  key: string;
  title: string;
  product: string;
  level: string;
  time: string;
  goal: string;
  steps: string[] | string;
  images?: string[];
  pdf?: string;
}

export interface Project {
  key: string;
  title: string;
  product: string;
  kit: string;
  summary: string;
  learn: string;
  upgrade: string;
  images?: string[];
  pdf?: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
}

export interface CompanyConfig {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address?: string;
  heroImage?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CatalogData {
  catalogVersion: number;
  company: CompanyConfig;
  products: Product[];
  practicals: PracticalActivity[];
  projects: Project[];
  quotes: Quote[];
  heroQuoteId: string;
}

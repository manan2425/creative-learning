'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CatalogData, Product, PracticalActivity, Project, Quote, CompanyConfig } from '@/types';
import fallbackCatalog from '@/data/initialCatalog.json';

interface DataContextType {
  catalog: CatalogData;
  loading: boolean;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshCatalog: () => Promise<void>;
  saveCatalog: (updated: CatalogData) => Promise<boolean>;
  saveProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  savePractical: (item: PracticalActivity) => Promise<boolean>;
  deletePractical: (key: string) => Promise<boolean>;
  saveProject: (item: Project) => Promise<boolean>;
  deleteProject: (key: string) => Promise<boolean>;
  saveQuote: (quote: Quote) => Promise<boolean>;
  deleteQuote: (id: string) => Promise<boolean>;
  setHeroQuote: (id: string) => Promise<boolean>;
  saveCompany: (company: CompanyConfig) => Promise<boolean>;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  inquiryProduct: Product | null;
  setInquiryProduct: (p: Product | null) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<CatalogData>(fallbackCatalog as CatalogData);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);

  const fetchFreshCatalog = async () => {
    try {
      const res = await fetch('/api/catalog', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.products)) {
          setCatalog(data);
        }
      }
    } catch (e) {
      console.error('Error fetching catalog data from MongoDB:', e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch catalog on mount and listen to window focus / visibility events
  useEffect(() => {
    fetchFreshCatalog();

    const handleFocus = () => {
      fetchFreshCatalog();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        fetchFreshCatalog();
      }
    });

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const saveCatalog = async (updated: CatalogData): Promise<boolean> => {
    setCatalog(updated);
    try {
      const res = await fetch('/api/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      return res.ok;
    } catch (err) {
      console.error('Error saving catalog:', err);
      return false;
    }
  };

  const saveProduct = async (product: Product): Promise<boolean> => {
    const existingIndex = catalog.products.findIndex((p) => p.id === product.id);
    let updatedProducts = [...catalog.products];
    if (existingIndex >= 0) {
      updatedProducts[existingIndex] = product;
    } else {
      updatedProducts.push(product);
    }
    return saveCatalog({ ...catalog, products: updatedProducts });
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    const updatedProducts = catalog.products.filter((p) => p.id !== id);
    return saveCatalog({ ...catalog, products: updatedProducts });
  };

  const savePractical = async (item: PracticalActivity): Promise<boolean> => {
    const existingIndex = catalog.practicals.findIndex((p) => p.key === item.key);
    let updated = [...catalog.practicals];
    if (existingIndex >= 0) {
      updated[existingIndex] = item;
    } else {
      updated.push(item);
    }
    return saveCatalog({ ...catalog, practicals: updated });
  };

  const deletePractical = async (key: string): Promise<boolean> => {
    const updated = catalog.practicals.filter((p) => p.key !== key);
    return saveCatalog({ ...catalog, practicals: updated });
  };

  const saveProject = async (item: Project): Promise<boolean> => {
    const existingIndex = catalog.projects.findIndex((p) => p.key === item.key);
    let updated = [...catalog.projects];
    if (existingIndex >= 0) {
      updated[existingIndex] = item;
    } else {
      updated.push(item);
    }
    return saveCatalog({ ...catalog, projects: updated });
  };

  const deleteProject = async (key: string): Promise<boolean> => {
    const updated = catalog.projects.filter((p) => p.key !== key);
    return saveCatalog({ ...catalog, projects: updated });
  };

  const saveQuote = async (quote: Quote): Promise<boolean> => {
    const existingIndex = catalog.quotes.findIndex((q) => q.id === quote.id);
    let updated = [...catalog.quotes];
    if (existingIndex >= 0) {
      updated[existingIndex] = quote;
    } else {
      updated.push(quote);
    }
    return saveCatalog({ ...catalog, quotes: updated });
  };

  const deleteQuote = async (id: string): Promise<boolean> => {
    const updated = catalog.quotes.filter((q) => q.id !== id);
    const newHero = catalog.heroQuoteId === id ? (updated[0]?.id || '') : catalog.heroQuoteId;
    return saveCatalog({ ...catalog, quotes: updated, heroQuoteId: newHero });
  };

  const setHeroQuote = async (id: string): Promise<boolean> => {
    return saveCatalog({ ...catalog, heroQuoteId: id });
  };

  const saveCompany = async (company: CompanyConfig): Promise<boolean> => {
    return saveCatalog({ ...catalog, company });
  };

  return (
    <DataContext.Provider
      value={{
        catalog,
        loading,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        refreshCatalog: fetchFreshCatalog,
        saveCatalog,
        saveProduct,
        deleteProduct,
        savePractical,
        deletePractical,
        saveProject,
        deleteProject,
        saveQuote,
        deleteQuote,
        setHeroQuote,
        saveCompany,
        selectedProduct,
        setSelectedProduct,
        inquiryProduct,
        setInquiryProduct,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

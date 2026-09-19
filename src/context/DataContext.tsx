'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

const SYNC_CHANNEL = 'creative_learning_live_catalog_sync';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<CatalogData>(fallbackCatalog as CatalogData);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const broadcastRef = useRef<BroadcastChannel | null>(null);
  const catalogRequestRef = useRef<Promise<void> | null>(null);
  const lastCatalogFetchRef = useRef(0);

  const fetchFreshCatalog = async (force = false) => {
    const now = Date.now();
    if (!force && (catalogRequestRef.current || now - lastCatalogFetchRef.current < 15000)) {
      return catalogRequestRef.current || Promise.resolve();
    }

    lastCatalogFetchRef.current = now;
    const request = (async () => {
    try {
      const res = await fetch('/api/catalog', { cache: force ? 'no-store' : 'default' });
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
    })();

    catalogRequestRef.current = request;
    try {
      await request;
    } finally {
      catalogRequestRef.current = null;
    }
  };

  const broadcastUpdate = () => {
    try {
      if (broadcastRef.current) {
        broadcastRef.current.postMessage({ type: 'CATALOG_UPDATED', timestamp: Date.now() });
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('cl_catalog_sync_timestamp', String(Date.now()));
        window.dispatchEvent(new CustomEvent('cl:catalog-updated'));
      }
    } catch (err) {
      console.warn('Broadcast notice error:', err);
    }
  };

  // Real-time listener: BroadcastChannel, storage events, window focus, and background polling
  useEffect(() => {
    fetchFreshCatalog();

    // 1. BroadcastChannel for instant cross-tab sync
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel(SYNC_CHANNEL);
      broadcastRef.current = bc;
      bc.onmessage = (event) => {
        if (event.data?.type === 'CATALOG_UPDATED') {
          fetchFreshCatalog(true);
        }
      };
    }

    // 2. Storage event listener (for browsers/tabs without active BroadcastChannel)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cl_catalog_sync_timestamp') {
        fetchFreshCatalog(true);
      }
    };
    window.addEventListener('storage', handleStorage);

    // Refresh this tab too after a successful mutation from this provider.
    const handleLocalCatalogUpdate = () => {
      fetchFreshCatalog(true);
    };
    window.addEventListener('cl:catalog-updated', handleLocalCatalogUpdate);

    // 3. Focus & Visibility Change: Auto-refresh when user opens or returns to the storefront
    const handleFocus = () => {
      fetchFreshCatalog();
    };
    window.addEventListener('focus', handleFocus);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchFreshCatalog();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (broadcastRef.current) {
        broadcastRef.current.close();
      }
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cl:catalog-updated', handleLocalCatalogUpdate);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
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
      if (res.ok) {
        const data = await res.json();
        if (data && data.data && Array.isArray(data.data.products)) {
          setCatalog(data.data);
        }
        // Broadcast to all open tabs and devices
        broadcastUpdate();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error saving catalog:', err);
      return false;
    }
  };

  const saveProduct = async (product: Product): Promise<boolean> => {
    // Synchronize image and images array
    const cleanImages =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images.filter(Boolean)
        : product.image
        ? [product.image]
        : [];
    const cleanProduct: Product = {
      ...product,
      image: cleanImages[0] || product.image || '',
      images: cleanImages.length > 0 ? cleanImages : (product.image ? [product.image] : []),
      sku: product.sku || `CL-${product.id}`,
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanProduct),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        console.error('Error saving product:', errorBody?.error || response.statusText);
        return false;
      }

      const existingIndex = catalog.products.findIndex((p) => p.id === cleanProduct.id);
      const updatedProducts = [...catalog.products];
      if (existingIndex >= 0) {
        updatedProducts[existingIndex] = cleanProduct;
      } else {
        updatedProducts.push(cleanProduct);
      }

      setCatalog({ ...catalog, products: updatedProducts });
      if (selectedProduct && selectedProduct.id === cleanProduct.id) {
        setSelectedProduct(cleanProduct);
      }
      if (inquiryProduct && inquiryProduct.id === cleanProduct.id) {
        setInquiryProduct(cleanProduct);
      }
      broadcastUpdate();
      return true;
    } catch (err) {
      console.error('Error saving product:', err);
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!response.ok) return false;
      const updatedProducts = catalog.products.filter((p) => p.id !== id);
      setCatalog({ ...catalog, products: updatedProducts });
      if (selectedProduct && selectedProduct.id === id) setSelectedProduct(null);
      if (inquiryProduct && inquiryProduct.id === id) setInquiryProduct(null);
      broadcastUpdate();
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      return false;
    }
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
    try {
      const response = await fetch(`/api/practicals?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
      if (!response.ok) return false;
      setCatalog({ ...catalog, practicals: catalog.practicals.filter((p) => p.key !== key) });
      broadcastUpdate();
      return true;
    } catch (err) {
      console.error('Error deleting practical:', err);
      return false;
    }
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
    try {
      const response = await fetch(`/api/projects?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
      if (!response.ok) return false;
      setCatalog({ ...catalog, projects: catalog.projects.filter((p) => p.key !== key) });
      broadcastUpdate();
      return true;
    } catch (err) {
      console.error('Error deleting project:', err);
      return false;
    }
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
    try {
      const response = await fetch(`/api/quotes?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!response.ok) return false;
      const updated = catalog.quotes.filter((q) => q.id !== id);
      const newHero = catalog.heroQuoteId === id ? (updated[0]?.id || '') : catalog.heroQuoteId;
      setCatalog({ ...catalog, quotes: updated, heroQuoteId: newHero });
      broadcastUpdate();
      return true;
    } catch (err) {
      console.error('Error deleting quote:', err);
      return false;
    }
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
        refreshCatalog: () => fetchFreshCatalog(true),
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

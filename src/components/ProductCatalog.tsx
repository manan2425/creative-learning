'use client';

import React, { useMemo } from 'react';
import { useData } from '@/context/DataContext';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';

export default function ProductCatalog() {
  const { catalog, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useData();

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set(catalog.products.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [catalog.products]);

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return catalog.products.filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchQuery =
        !q ||
        [p.name, p.category, p.description, p.specifications, p.applications, p.sku]
          .join(' ')
          .toLowerCase()
          .includes(q);
      return matchCategory && matchQuery;
    });
  }, [catalog.products, activeCategory, searchQuery]);

  return (
    <section className="catalogue page-section" id="products">
      <div className="section-head">
        <div>
          <p className="eyebrow">DISCOVER HARDWARE</p>
          <h2>Explore Components & Boards</h2>
          <p>Carefully curated, tested, and reliable electronics for all skill levels.</p>
        </div>

        <div className="catalogue-controls">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search components, sensors, kits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search catalogue"
            />
          </div>

          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories ({catalog.products.length})</option>
            {categories
              .filter((c) => c !== 'all')
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="chips">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'all' ? 'All Items' : cat}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '12px', color: '#66748b', margin: '14px 0 6px' }}>
        Showing <b>{filteredProducts.length}</b> items
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#fff',
            borderRadius: '20px',
            border: '1px solid var(--line)',
            marginTop: '20px',
          }}
        >
          <h3>No matching components found</h3>
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
            Try adjusting your search terms or selecting another category.
          </p>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            style={{ marginTop: '12px' }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}

'use client';

import React, { useMemo, useState } from 'react';
import { useData } from '@/context/DataContext';
import ProductCard from './ProductCard';
import { Search, X, Cpu, Bot, SlidersHorizontal, Terminal } from 'lucide-react';

export default function ProductCatalog() {
  const { catalog, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useData();
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'name-desc'>('default');

  // Extract unique categories dynamically with item counts
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { all: catalog.products.length };
    catalog.products.forEach((p) => {
      if (p.category) {
        stats[p.category] = (stats[p.category] || 0) + 1;
      }
    });
    return stats;
  }, [catalog.products]);

  const categories = useMemo(() => {
    const set = new Set(catalog.products.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [catalog.products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let list = catalog.products.filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchQuery =
        !q ||
        [p.name, p.category, p.description, p.specifications, p.applications, p.sku]
          .join(' ')
          .toLowerCase()
          .includes(q);
      return matchCategory && matchQuery;
    });

    if (sortBy === 'name-asc') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    }

    return list;
  }, [catalog.products, activeCategory, searchQuery, sortBy]);

  return (
    <section className="catalogue page-section" id="products">
      <div className="section-head">
        <div>
          <p className="eyebrow">
            <Cpu size={14} /> HARDWARE INVENTORY // VAULT
          </p>
          <h2>Robotics Components & Microcontrollers</h2>
          <p>
            Lab-tested development boards, environmental sensors, wireless modules, and precision
            actuator drivers.
          </p>
        </div>

        <div className="catalogue-controls">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon-inside" />
            <input
              type="text"
              placeholder="Search by chip, sensor, MCU, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search hardware catalogue"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort products"
          >
            <option value="default">// SORT: FEATURED</option>
            <option value="name-asc">// NAME: A TO Z</option>
            <option value="name-desc">// NAME: Z TO A</option>
          </select>
        </div>
      </div>

      <div className="chips">
        {categories.map((cat) => {
          const count = categoryStats[cat] || 0;
          return (
            <button
              key={cat}
              type="button"
              className={`chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' ? '[ ALL MODULES ]' : `[ ${cat.toUpperCase()} ]`} ({count})
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '13px',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-primary)',
          margin: '18px 0 10px',
        }}
      >
        <div>
          STATUS: <b style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}>{filteredProducts.length}</b> verified hardware modules ready
        </div>
        {activeCategory !== 'all' && (
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            style={{
              background: 'none',
              border: 0,
              color: 'var(--cyan)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12.5px',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.04em',
            }}
          >
            [ RESET FILTER ]
          </button>
        )}
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
            padding: '70px 24px',
            background: 'rgba(8, 15, 34, 0.85)',
            borderRadius: '18px',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            marginTop: '24px',
            boxShadow: 'var(--shadow-hud)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(0, 240, 255, 0.1)',
              color: 'var(--cyan)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 16px',
              border: '1px solid var(--cyan-border)',
            }}
          >
            <Search size={24} />
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: '20px' }}>No hardware modules matched</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '13.5px', maxWidth: '420px', margin: '0 auto 20px' }}>
            No component found for &quot;{searchQuery}&quot;. Check SKU or try selecting another category.
          </p>
          <button
            type="button"
            className="primary"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          >
            Reset Hardware Filter
          </button>
        </div>
      )}
    </section>
  );
}

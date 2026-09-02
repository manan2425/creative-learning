'use client';

import React from 'react';
import { useData } from '@/context/DataContext';
import { useCart } from '@/context/CartContext';
import { Box, FileText, ShoppingCart, Eye } from 'lucide-react';

export default function KitsSection() {
  const { catalog, setSelectedProduct } = useData();
  const { addToCart } = useCart();

  const kits = catalog.products.filter(
    (p) => p.category.toLowerCase().includes('kit') || p.id.includes('kit')
  );

  return (
    <section className="kits-section page-section" id="kits">
      <div className="section-head">
        <div>
          <p className="eyebrow">COMPLETE LEARNING BUNDLES</p>
          <h2>Starter & Prototype Kits</h2>
          <p>
            All-in-one hardware kits with sensors, actuators, and jumper wires to start building
            immediately.
          </p>
        </div>
      </div>

      <div className="practical-grid">
        {kits.map((kit) => {
          const img =
            kit.images?.[0] || kit.image || '/images/branding/creative-learning-logo.png';
          return (
            <article key={kit.id} className="kit-card">
              <img src={img.startsWith('/') ? img : `/${img}`} alt={kit.name} loading="lazy" />
              <div className="kit-body">
                <span className="tag" style={{ background: '#fff2e6', color: '#e06500' }}>
                  <Box size={11} style={{ display: 'inline', marginRight: '4px' }} />
                  Starter Kit
                </span>
                <h3>{kit.name}</h3>
                <p>{kit.description}</p>
                <div className="sku-line">SKU: {kit.sku || `CL-${kit.id}`}</div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: '10px 0 16px',
                    fontSize: '12px',
                  }}
                >
                  <span className="price">{kit.price}</span>
                  {kit.pdf && (
                    <a
                      href={kit.pdf.startsWith('/') ? kit.pdf : `/${kit.pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#0872c9',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <FileText size={13} /> PDF Guide
                    </a>
                  )}
                </div>

                <div className="card-actions">
                  <button type="button" onClick={() => setSelectedProduct(kit)}>
                    <Eye size={14} /> View Kit
                  </button>
                  <button type="button" className="add" onClick={() => addToCart(kit)}>
                    <ShoppingCart size={14} /> Add Kit
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

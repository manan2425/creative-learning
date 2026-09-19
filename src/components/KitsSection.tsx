'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useCart } from '@/context/CartContext';
import { formatMediaUrl } from '@/lib/utils';
import { FileText, ShoppingCart, Eye, Bot, Check, PackageCheck } from 'lucide-react';

export default function KitsSection() {
  const { catalog, setSelectedProduct } = useData();
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const kits = catalog.products.filter(
    (p) =>
      p.category.toLowerCase().includes('kit') ||
      p.id.toLowerCase().includes('kit') ||
      p.category === 'Starter Kits'
  );

  const handleAdd = (kit: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(kit);
    setAddedId(kit.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="kits-section page-section" id="kits">
      <div className="section-head">
        <div>
          <p className="eyebrow">
            <Bot size={14} /> AUTONOMOUS PROTOTYPING BUNDLES
          </p>
          <h2>Robotics Starter & Capstone Kits</h2>
          <p>
            Complete turn-key engineering kits featuring microcontrollers, precision servos, ultrasonic
            radars, motor driver shields, and jumper harnesses.
          </p>
        </div>
      </div>

      <div className="practical-grid">
        {kits.map((kit) => {
          const imgUrl = formatMediaUrl(kit.images?.[0] || kit.image);
          const isAdded = addedId === kit.id;

          return (
            <article
              key={kit.id}
              className="kit-card"
              onClick={() => setSelectedProduct(kit)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={imgUrl}
                alt={kit.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/branding/creative-learning-logo.png';
                }}
              />
              <div className="kit-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    className="tag"
                    style={{
                      background: 'rgba(255, 123, 0, 0.12)',
                      color: 'var(--orange)',
                      borderColor: 'rgba(255, 123, 0, 0.3)',
                    }}
                  >
                    <Bot size={12} />
                    ROBOTICS BUNDLE
                  </span>

                  {kit.pdf && (
                    <a
                      href={formatMediaUrl(kit.pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: 'var(--cyan)',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10.5px',
                        fontFamily: 'var(--font-primary)',
                        background: 'rgba(0, 240, 255, 0.1)',
                        border: '1px solid var(--cyan-border)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                      }}
                    >
                      <FileText size={11} /> LAB PDF
                    </a>
                  )}
                </div>

                <h3 style={{ cursor: 'pointer' }}>{kit.name}</h3>
                <p>{kit.description}</p>
                <div className="sku-line">SKU: {kit.sku || `CL-${kit.id}`}</div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <span className="price">{kit.price || 'Contact for price'}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#059669',
                      fontWeight: 700,
                      fontFamily: 'var(--font-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <PackageCheck size={13} /> ALL COMPONENTS INCLUDED
                  </span>
                </div>

                <div className="card-actions">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(kit);
                    }}
                  >
                    <Eye size={14} /> Kit Specs
                  </button>
                  <button
                    type="button"
                    className="add"
                    onClick={(e) => handleAdd(kit, e)}
                    style={{
                      background: isAdded ? '#00ff9d' : undefined,
                      color: isAdded ? '#030712' : undefined,
                    }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} /> Added!
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={14} /> Add Kit to Cart
                      </>
                    )}
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

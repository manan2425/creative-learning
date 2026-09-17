'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useData } from '@/context/DataContext';
import { useCart } from '@/context/CartContext';
import { formatMediaUrl } from '@/lib/utils';
import { FileText, ShoppingCart, Eye, Check, Cpu } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { setSelectedProduct } = useData();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const mainImage = formatMediaUrl(product.images?.[0] || product.image);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="product-card">
      <div className="product-img">
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/branding/creative-learning-logo.png';
          }}
        />
      </div>

      <div className="product-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="tag">
            <Cpu size={10} /> {product.category}
          </span>
          {product.pdf && (
            <span
              style={{
                fontSize: '10.5px',
                color: 'var(--cyan)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 700,
                fontFamily: 'var(--font-primary)',
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid var(--cyan-border)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              <FileText size={11} /> DATASHEET
            </span>
          )}
        </div>

        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="sku-line">SKU: {product.sku || `CL-${product.id}`}</div>

        <div className="product-meta">
          <span className="price">{product.price || 'Contact for price'}</span>
          <span
            style={{
              fontSize: '11px',
              color: '#00ff9d',
              fontWeight: 700,
              fontFamily: 'var(--font-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ● VERIFIED IC
          </span>
        </div>

        <div className="card-actions">
          <button type="button" onClick={() => setSelectedProduct(product)} aria-label="View technical specs">
            <Eye size={14} /> Specs
          </button>
          <button
            type="button"
            className="add"
            onClick={handleAdd}
            aria-label="Add to Engineer's Cart"
            style={{
              background: added ? '#00ff9d' : undefined,
              color: added ? '#030712' : undefined,
            }}
          >
            {added ? (
              <>
                <Check size={14} /> Added!
              </>
            ) : (
              <>
                <ShoppingCart size={14} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

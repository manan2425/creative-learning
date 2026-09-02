'use client';

import React from 'react';
import { Product } from '@/types';
import { useData } from '@/context/DataContext';
import { useCart } from '@/context/CartContext';
import { FileText, ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { setSelectedProduct } = useData();
  const { addToCart } = useCart();

  const mainImage =
    product.images?.[0] || product.image || '/images/branding/creative-learning-logo.png';

  return (
    <article className="product-card">
      <div className="product-img">
        <img
          src={mainImage.startsWith('/') ? mainImage : `/${mainImage}`}
          alt={product.name}
          loading="lazy"
        />
      </div>

      <div className="product-body">
        <span className="tag">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="sku-line">SKU: {product.sku || `CL-${product.id}`}</div>

        <div className="product-meta">
          <span className="price">{product.price || 'Contact for price'}</span>
          {product.pdf && (
            <span
              style={{
                fontSize: '11px',
                color: '#0872c9',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 700,
              }}
            >
              <FileText size={13} /> PDF Guide
            </span>
          )}
        </div>

        <div className="card-actions">
          <button type="button" onClick={() => setSelectedProduct(product)}>
            <Eye size={14} /> Details
          </button>
          <button type="button" className="add" onClick={() => addToCart(product)}>
            <ShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useCart } from '@/context/CartContext';
import { X, FileText, ShoppingCart, MessageSquare, Check } from 'lucide-react';

export default function ProductModal() {
  const { selectedProduct, setSelectedProduct, setInquiryProduct } = useData();
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedProduct) return null;

  const images =
    selectedProduct.images && selectedProduct.images.length > 0
      ? selectedProduct.images
      : selectedProduct.image
      ? [selectedProduct.image]
      : ['/images/branding/creative-learning-logo.png'];

  const currentImage = images[activeImageIndex] || images[0];

  const specsList = selectedProduct.specifications
    ? selectedProduct.specifications.split(';').map((s) => s.trim()).filter(Boolean)
    : [];

  const appsList = selectedProduct.applications
    ? selectedProduct.applications.split(';').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="close-btn"
          onClick={() => setSelectedProduct(null)}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="product-detail-layout">
          <div>
            <div className="product-gallery-main">
              <img
                src={currentImage.startsWith('/') ? currentImage : `/${currentImage}`}
                alt={selectedProduct.name}
              />
            </div>

            {images.length > 1 && (
              <div className="product-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`product-thumb ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img.startsWith('/') ? img : `/${img}`} alt="" />
                  </button>
                ))}
              </div>
            )}

            {selectedProduct.pdf && (
              <div style={{ marginTop: '16px' }}>
                <a
                  href={
                    selectedProduct.pdf.startsWith('/')
                      ? selectedProduct.pdf
                      : `/${selectedProduct.pdf}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    borderColor: '#0872c9',
                    color: '#0872c9',
                    fontWeight: 800,
                  }}
                >
                  <FileText size={16} /> Open Official Datasheet / Manual (PDF)
                </a>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="tag">{selectedProduct.category}</span>
            <h2 style={{ margin: '8px 0', fontSize: '26px' }}>{selectedProduct.name}</h2>
            <div className="sku-line">SKU: {selectedProduct.sku || `CL-${selectedProduct.id}`}</div>

            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>
              {selectedProduct.description}
            </p>

            <div
              style={{
                fontSize: '18px',
                fontWeight: 900,
                color: 'var(--orange)',
                margin: '12px 0',
              }}
            >
              {selectedProduct.price || 'Contact for price'}
            </div>

            {specsList.length > 0 && (
              <div style={{ margin: '10px 0' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: '#1e293b' }}>
                  Specifications:
                </h4>
                <ul
                  style={{
                    paddingLeft: '18px',
                    margin: 0,
                    fontSize: '12px',
                    color: '#475569',
                    lineHeight: '1.6',
                  }}
                >
                  {specsList.map((spec, i) => (
                    <li key={i}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}

            {appsList.length > 0 && (
              <div style={{ margin: '10px 0' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: '#1e293b' }}>
                  Applications & Use Cases:
                </h4>
                <ul
                  style={{
                    paddingLeft: '18px',
                    margin: 0,
                    fontSize: '12px',
                    color: '#475569',
                    lineHeight: '1.6',
                  }}
                >
                  {appsList.map((app, i) => (
                    <li key={i}>{app}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '20px' }}>
              <button
                type="button"
                className="primary"
                style={{ flex: 1 }}
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>

              <button
                type="button"
                className="secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  setInquiryProduct(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                <MessageSquare size={16} /> Send Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

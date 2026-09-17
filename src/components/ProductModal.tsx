'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useCart } from '@/context/CartContext';
import { X, FileText, ShoppingCart, MessageSquare, Check, Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ProductModal() {
  const { selectedProduct, setSelectedProduct, setInquiryProduct } = useData();
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [added, setAdded] = useState(false);

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

  const handleAddToCart = () => {
    addToCart(selectedProduct);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setSelectedProduct(null);
    }, 1000);
  };

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
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img.startsWith('/') ? img : `/${img}`} alt="" />
                  </button>
                ))}
              </div>
            )}

            {selectedProduct.pdf && (
              <div style={{ marginTop: '18px' }}>
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
                    gap: '8px',
                    borderColor: 'var(--cyan)',
                    color: 'var(--cyan)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                    background: 'rgba(0, 240, 255, 0.1)',
                  }}
                >
                  <FileText size={16} /> Technical Datasheet / Manual (PDF)
                </a>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="tag">
                <Cpu size={11} /> {selectedProduct.category}
              </span>
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
                ● 100% VERIFIED IC
              </span>
            </div>

            <h2 style={{ margin: '10px 0 6px', fontSize: '26px', lineHeight: '1.2', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              {selectedProduct.name}
            </h2>
            <div className="sku-line">SKU: {selectedProduct.sku || `CL-${selectedProduct.id}`}</div>

            <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.65' }}>
              {selectedProduct.description}
            </p>

            <div
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: 'var(--orange)',
                fontFamily: 'var(--font-heading)',
                margin: '12px 0 16px',
              }}
            >
              {selectedProduct.price || 'Contact for price'}
            </div>

            {specsList.length > 0 && (
              <div
                style={{
                  margin: '10px 0',
                  background: 'rgba(3, 7, 18, 0.7)',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 240, 255, 0.15)',
                }}
              >
                <h4 style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--cyan)', fontFamily: 'var(--font-heading)', letterSpacing: '0.04em' }}>
                  // HARDWARE SPECIFICATIONS:
                </h4>
                <ul
                  style={{
                    paddingLeft: '18px',
                    margin: 0,
                    fontSize: '12.5px',
                    color: '#cbd5e1',
                    lineHeight: '1.6',
                    fontFamily: 'var(--font-primary)',
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
                <h4 style={{ margin: '0 0 6px', fontSize: '12px', color: 'var(--cyan)', fontFamily: 'var(--font-heading)', letterSpacing: '0.04em' }}>
                  // ROBOTICS USE CASES:
                </h4>
                <ul
                  style={{
                    paddingLeft: '18px',
                    margin: 0,
                    fontSize: '12px',
                    color: '#94a3b8',
                    lineHeight: '1.6',
                  }}
                >
                  {appsList.map((app, i) => (
                    <li key={i}>{app}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '22px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="primary"
                style={{
                  flex: 1,
                  background: added ? '#00ff9d' : undefined,
                  color: added ? '#030712' : undefined,
                }}
                onClick={handleAddToCart}
              >
                {added ? (
                  <>
                    <Check size={16} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} /> Add to Cart
                  </>
                )}
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
                <MessageSquare size={16} /> Tech Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

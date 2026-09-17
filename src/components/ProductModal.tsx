'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { useCart } from '@/context/CartContext';
import { formatMediaUrl, parseStringList } from '@/lib/utils';
import {
  X,
  FileText,
  ShoppingCart,
  MessageSquare,
  Check,
  Cpu,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export default function ProductModal() {
  const { selectedProduct, setSelectedProduct, setInquiryProduct } = useData();
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [added, setAdded] = useState(false);

  // Reset active image index whenever a new product is selected
  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProduct?.id]);

  if (!selectedProduct) return null;

  const rawImages =
    selectedProduct.images && selectedProduct.images.length > 0
      ? selectedProduct.images.filter(Boolean)
      : selectedProduct.image
      ? [selectedProduct.image]
      : ['/images/branding/creative-learning-logo.png'];

  const images = rawImages.map(formatMediaUrl);
  const currentImage = images[activeImageIndex] || images[0] || '/images/branding/creative-learning-logo.png';

  const specsList = parseStringList(selectedProduct.specifications);
  const appsList = parseStringList(selectedProduct.applications);

  const handleAddToCart = () => {
    addToCart(selectedProduct);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setSelectedProduct(null);
    }, 1000);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  return (
    <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          color: '#0f172a',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 70px rgba(15, 23, 42, 0.22)',
          borderRadius: '24px',
          maxWidth: '920px',
          padding: '36px',
        }}
      >
        <button
          type="button"
          className="close-btn"
          onClick={() => setSelectedProduct(null)}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="product-detail-layout">
          {/* Left Column: Image Gallery & PDF Datasheet */}
          <div>
            <div
              className="product-gallery-main"
              style={{
                position: 'relative',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '18px',
                aspectRatio: '1 / 1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '24px',
              }}
            >
              {/* Photo Counter Badge */}
              {images.length > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(6px)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.03em',
                    zIndex: 3,
                  }}
                >
                  Photo {activeImageIndex + 1} / {images.length}
                </div>
              )}

              {/* Main Image */}
              <img
                key={currentImage}
                src={currentImage}
                alt={selectedProduct.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/branding/creative-learning-logo.png';
                }}
              />

              {/* Prev / Next Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    aria-label="Previous photo"
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.92)',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                      zIndex: 3,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    aria-label="Next photo"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.92)',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                      zIndex: 3,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div
                className="product-thumbs"
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '14px',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                  scrollbarWidth: 'thin',
                }}
              >
                {images.map((img, idx) => {
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`View photo ${idx + 1}`}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '12px',
                        border: isActive ? '2.5px solid #0284c7' : '1.5px solid #e2e8f0',
                        background: '#ffffff',
                        padding: '4px',
                        cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: isActive ? '0 0 0 3px rgba(2, 132, 199, 0.2)' : 'none',
                        transform: isActive ? 'scale(1.04)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <img
                        src={img}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/branding/creative-learning-logo.png';
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* PDF Datasheet & Schematic Manual */}
            {selectedProduct.pdf ? (
              <div style={{ marginTop: '20px' }}>
                <a
                  href={formatMediaUrl(selectedProduct.pdf)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '1.5px solid #bae6fd',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    color: '#0369a1',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: '#0284c7',
                        color: '#ffffff',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)',
                      }}
                    >
                      <FileText size={20} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13.5px', fontFamily: 'var(--font-heading)' }}>
                        Technical Datasheet / Manual (PDF)
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                        Click to view & download official schematic
                      </div>
                    </div>
                  </div>
                  <ExternalLink size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
                </a>
              </div>
            ) : null}
          </div>

          {/* Right Column: Specs, Applications & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="tag" style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' }}>
                <Cpu size={12} /> {selectedProduct.category}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: '#059669',
                  fontWeight: 700,
                  fontFamily: 'var(--font-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#ecfdf5',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid #a7f3d0',
                }}
              >
                <ShieldCheck size={12} /> 100% VERIFIED IC
              </span>
            </div>

            <h2
              style={{
                margin: '12px 0 6px',
                fontSize: '26px',
                lineHeight: '1.25',
                color: '#0f172a',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
              }}
            >
              {selectedProduct.name}
            </h2>
            <div className="sku-line" style={{ color: '#64748b', fontSize: '12px', fontWeight: 600 }}>
              SKU: {selectedProduct.sku || `CL-${selectedProduct.id}`}
            </div>

            <p style={{ color: '#334155', fontSize: '14px', lineHeight: '1.65', margin: '12px 0 16px' }}>
              {selectedProduct.description}
            </p>

            <div
              style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#ea580c',
                fontFamily: 'var(--font-heading)',
                marginBottom: '16px',
              }}
            >
              {selectedProduct.price || 'Contact for price'}
            </div>

            {/* Hardware Specifications */}
            {specsList.length > 0 && (
              <div
                style={{
                  margin: '8px 0 14px',
                  background: '#f8fafc',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 10px',
                    fontSize: '12px',
                    color: '#0369a1',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.04em',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Cpu size={14} /> HARDWARE SPECIFICATIONS:
                </h4>
                <ul
                  style={{
                    paddingLeft: '20px',
                    margin: 0,
                    fontSize: '13px',
                    color: '#1e293b',
                    lineHeight: '1.7',
                    fontFamily: 'var(--font-primary)',
                  }}
                >
                  {specsList.map((spec, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Robotics & IoT Applications */}
            {appsList.length > 0 && (
              <div
                style={{
                  margin: '0 0 16px',
                  background: '#ffffff',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  border: '1px dashed #cbd5e1',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 8px',
                    fontSize: '12px',
                    color: '#ea580c',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.04em',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Layers size={14} /> ROBOTICS & IOT USE CASES:
                </h4>
                <ul
                  style={{
                    paddingLeft: '20px',
                    margin: 0,
                    fontSize: '12.5px',
                    color: '#475569',
                    lineHeight: '1.65',
                  }}
                >
                  {appsList.map((app, i) => (
                    <li key={i}>{app}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: 'auto',
                paddingTop: '20px',
                borderTop: '1px solid #f1f5f9',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                className="primary"
                style={{
                  flex: 1,
                  background: added
                    ? '#10b981'
                    : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onClick={handleAddToCart}
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                className="secondary"
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onClick={() => {
                  setInquiryProduct(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                <MessageSquare size={18} /> Tech Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


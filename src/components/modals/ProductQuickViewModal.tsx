'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  X, 
  ShoppingCart, 
  MessageCircle, 
  Check, 
  Star, 
  Cpu, 
  Activity, 
  Plus, 
  Minus, 
  FileText, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';

export const ProductQuickViewModal: React.FC = () => {
  const { 
    activeQuickViewProduct, 
    setActiveQuickViewProduct, 
    addToCart, 
    openWhatsAppInquiry, 
    settings 
  } = useStore();

  const [qty, setQty] = useState(1);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Close on Escape key press and prevent background page scrolling
  useEffect(() => {
    if (!activeQuickViewProduct) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveQuickViewProduct(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeQuickViewProduct, setActiveQuickViewProduct]);

  if (!activeQuickViewProduct) return null;

  const product = activeQuickViewProduct;

  const allPhotos = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'];

  const currentPhoto = allPhotos[activePhotoIdx] || allPhotos[0];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      type: 'product',
      name: product.name,
      price: product.hidePrice ? 0 : product.price,
      hidePrice: Boolean(product.hidePrice || !product.price),
      image: currentPhoto,
      sku: product.sku,
    }, qty);
    setActiveQuickViewProduct(null);
  };

  const handleWhatsAppInquiry = () => {
    openWhatsAppInquiry(
      `Product: ${product.name} (SKU: ${product.sku})`,
      `Price: ${product.hidePrice ? 'Price on Request' : `₹${product.price}`}, Voltage: ${product.voltage || 'N/A'}`,
      product.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 animate-fade-in touch-manipulation">
      {/* Dedicated Backdrop Overlay (Click anywhere outside to close) */}
      <div 
        onClick={() => setActiveQuickViewProduct(null)}
        className="fixed inset-0 bg-navy/80 backdrop-blur-xs transition-opacity cursor-pointer z-0"
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-border w-full max-w-3xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        
        {/* Sticky Header with high-visibility Cancel button */}
        <div className="bg-slate-900 text-white p-3 sm:p-4 px-3 sm:px-6 flex items-center justify-between border-b border-slate-800 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-md bg-cyan/20 text-cyan border border-cyan/40 shrink-0">
              {product.category}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">Hardware Component</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveQuickViewProduct(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 active:bg-red-700 text-white transition-all cursor-pointer shadow-sm active:scale-95 text-xs font-bold shrink-0 border border-red-500/50 min-h-[34px]"
            aria-label="Close product modal"
            title="Close / Cancel (Esc)"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* 1. Component Name (Always First on mobile & desktop) */}
          <div className="space-y-2 border-b border-border pb-4">
            <h3 className="font-extrabold text-xl sm:text-2xl text-navy leading-snug font-heading">
              {product.name}
            </h3>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Price Display */}
              <div className="flex items-center gap-3">
                {product.hidePrice || !product.price ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-extrabold font-heading">Price on Request (Contact on WhatsApp)</span>
                  </div>
                ) : (
                  <>
                    <span className="text-2xl sm:text-3xl font-extrabold text-navy font-mono">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through font-mono">
                        ₹{product.originalPrice}
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="text-xs font-bold text-success bg-emerald-50 px-2.5 py-0.5 rounded-md">
                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-amber-700 font-mono">{product.rating || 4.9}</span>
                <span className="text-slate-500 font-normal">({product.reviewsCount || 48} reviews)</span>
              </div>
            </div>

            {/* Description */}
            {(product.description || product.shortDescription) && (
              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-sans pt-1">
                {product.description || product.shortDescription}
              </p>
            )}
          </div>

          {/* Grid Layout: Photos on Left / Side on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
            
            {/* Component Photo Gallery */}
            <div className="space-y-3">
              {/* Main Photo Viewer */}
              <div className="aspect-square bg-slate-50 border border-border rounded-2xl overflow-hidden relative flex items-center justify-center p-2 group shadow-2xs">
                <img
                  src={currentPhoto}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl transition-all duration-300"
                />

                {/* Verified Silicon Badge */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-navy border border-border flex items-center gap-1 shadow-2xs">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  <span>Pre-Tested Silicon</span>
                </div>

                {/* Photo Navigator Arrows (if multiple photos) */}
                {allPhotos.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-navy hover:bg-white hover:text-primary flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100 cursor-pointer"
                      title="Previous photo"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActivePhotoIdx((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-navy hover:bg-white hover:text-primary flex items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100 cursor-pointer"
                      title="Next photo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip (if multiple photos) */}
              {allPhotos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {allPhotos.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activePhotoIdx === idx 
                          ? 'border-primary ring-2 ring-primary/20 scale-105' 
                          : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* PDF Datasheet Button (if available) */}
              {(product.pdfUrl || product.datasheetUrl) && (
                <a
                  href={product.pdfUrl || product.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-red-50/60 hover:bg-red-50 border border-red-200/80 rounded-2xl flex items-center justify-between transition-colors group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-navy group-hover:text-red-700 transition-colors block truncate">
                        {product.pdfName || 'Technical Datasheet & Specifications'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Open verified PDF specification guide
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl text-navy hover:text-primary text-xs font-bold shadow-2xs border border-border shrink-0">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    <span>View PDF</span>
                  </div>
                </a>
              )}

              {/* 3. Applications (Pinout & Use-cases) - Placed under Photo on Desktop/Laptop */}
              {product.pinout && product.pinout.length > 0 && (
                <div className="hidden md:block bg-slate-50 p-3.5 rounded-2xl border border-border space-y-2">
                  <h5 className="font-bold text-xs text-navy uppercase tracking-wider flex items-center gap-1.5 font-heading">
                    <Cpu className="w-3.5 h-3.5 text-primary" /> Applications &amp; Pinout
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {product.pinout.map((pin, idx) => (
                      <span key={idx} className="text-[11px] font-mono bg-white px-2.5 py-1 rounded-lg border border-border text-navy shadow-2xs font-semibold">
                        {pin}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column / Sequential Flow on Mobile */}
            <div className="space-y-4">
              
              {/* 2. Technical Specifications with Eye Symbol */}
              {product.specs && Object.keys(product.specs).length > 0 ? (
                <div className="border border-border rounded-2xl overflow-hidden text-xs shadow-2xs">
                  <div className="bg-slate-50 px-3.5 py-2.5 font-bold text-navy text-[11px] uppercase tracking-wider flex items-center gap-2 border-b border-border font-heading">
                    <Eye className="w-4 h-4 text-primary" />
                    <span>Technical Specifications</span>
                  </div>
                  <div className="divide-y divide-border font-sans max-h-56 overflow-y-auto">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between px-3.5 py-2 bg-white hover:bg-slate-50/60">
                        <span className="text-secondary font-medium">{key}</span>
                        <span className="font-semibold text-navy font-mono text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border border-border rounded-2xl overflow-hidden text-xs">
                  <div className="bg-slate-50 px-3.5 py-2.5 font-bold text-navy text-[11px] uppercase tracking-wider flex items-center gap-2 border-b border-border font-heading">
                    <Eye className="w-4 h-4 text-primary" />
                    <span>Technical Specifications</span>
                  </div>
                  <div className="divide-y divide-border font-sans">
                    <div className="flex justify-between px-3.5 py-2 bg-white">
                      <span className="text-secondary">Operating Voltage</span>
                      <span className="font-semibold text-navy font-mono">{product.voltage || '3.3V / 5V DC'}</span>
                    </div>
                    <div className="flex justify-between px-3.5 py-2 bg-white">
                      <span className="text-secondary">Hardware Category</span>
                      <span className="font-semibold text-navy font-mono">{product.category}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Applications (Pinout & Use-cases) - Placed after Specs on Mobile */}
              {product.pinout && product.pinout.length > 0 && (
                <div className="block md:hidden bg-slate-50 p-3.5 rounded-2xl border border-border">
                  <h5 className="font-bold text-xs text-navy uppercase tracking-wider mb-2 flex items-center gap-1.5 font-heading">
                    <Cpu className="w-3.5 h-3.5 text-primary" /> Applications &amp; Pinout
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {product.pinout.map((pin, idx) => (
                      <span key={idx} className="text-[11px] font-mono bg-white px-2.5 py-1 rounded-lg border border-border text-navy shadow-2xs font-semibold">
                        {pin}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Quantity: & Subtotal: */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy font-heading">Quantity:</span>
                  <div className="flex items-center border border-border bg-white rounded-xl shadow-2xs overflow-hidden">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-2 hover:bg-slate-100 text-navy transition-colors cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold font-mono text-navy min-w-[36px] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="p-2 hover:bg-slate-100 text-navy transition-colors cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="text-secondary font-medium">Subtotal:</span>
                  <strong className="font-mono text-base font-extrabold text-navy">
                    {product.hidePrice || !product.price ? 'Price on Request' : `₹${product.price * qty}`}
                  </strong>
                </div>
              </div>

              {/* 5. Add to Cart & WhatsApp Inquiry Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-hover active:bg-primary text-white rounded-xl font-bold text-xs shadow-md shadow-primary/20 transition-all cursor-pointer font-heading active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {product.hidePrice || !product.price ? 'Add to Cart (Quote Request)' : 'Add to Cart'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer font-heading active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Inquiry</span>
                </button>
              </div>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setActiveQuickViewProduct(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-red-50 active:bg-red-100 text-slate-700 hover:text-red-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
              >
                <X className="w-4 h-4" />
                <span>Cancel &amp; Close</span>
              </button>

            </div>

          </div>

        </div>

        {/* Sticky Mobile Bottom Bar (Always accessible on small mobile screens) */}
        <div className="sm:hidden sticky bottom-0 bg-white/95 backdrop-blur-md p-3 border-t border-border shadow-lg flex items-center gap-2 z-20 shrink-0">
          <button
            type="button"
            onClick={() => setActiveQuickViewProduct(null)}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200 shadow-2xs active:scale-95"
          >
            <X className="w-4 h-4 text-slate-500" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-[2] py-2.5 bg-primary hover:bg-primary-hover active:bg-primary text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{product.hidePrice || !product.price ? 'Quote' : 'Add to Cart'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};




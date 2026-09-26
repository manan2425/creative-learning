'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  X, 
  ShoppingCart, 
  MessageCircle, 
  CheckCircle2, 
  Star, 
  Bot, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Layers, 
  GraduationCap, 
  Code2, 
  ShieldCheck,
  Plus,
  Minus
} from 'lucide-react';

export const KitQuickViewModal: React.FC = () => {
  const { 
    activeQuickViewKit, 
    setActiveQuickViewKit, 
    addToCart, 
    openWhatsAppInquiry 
  } = useStore();

  const [qty, setQty] = useState(1);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Close on Escape key press and prevent background page scrolling
  useEffect(() => {
    if (!activeQuickViewKit) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveQuickViewKit(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeQuickViewKit, setActiveQuickViewKit]);

  if (!activeQuickViewKit) return null;

  const kit = activeQuickViewKit;

  const allPhotos = kit.images && kit.images.length > 0 
    ? kit.images 
    : [kit.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=700&q=80'];

  const currentPhoto = allPhotos[activePhotoIdx] || allPhotos[0];

  const handleAddToCart = () => {
    addToCart({
      id: kit.id,
      type: 'kit',
      name: kit.title,
      price: kit.hidePrice ? 0 : kit.price,
      hidePrice: Boolean(kit.hidePrice || !kit.price),
      image: currentPhoto,
      sku: `KIT-${(kit.difficulty || 'DIY').toUpperCase()}`,
    }, qty);
    setActiveQuickViewKit(null);
  };

  const handleWhatsAppInquiry = () => {
    openWhatsAppInquiry(
      `Starter Kit Inquiry: ${kit.title}`,
      `Price: ${kit.hidePrice ? 'Price on Request' : `₹${kit.price}`}, Level: ${kit.difficulty}`,
      kit.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 animate-fade-in touch-manipulation">
      {/* Backdrop */}
      <div 
        onClick={() => setActiveQuickViewKit(null)}
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
              {kit.difficulty || 'Beginner'} Level Kit
            </span>
            {kit.badge && (
              <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                ★ {kit.badge}
              </span>
            )}
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium truncate hidden sm:inline">
              STEM Robotics Kit
            </span>
          </div>

          <button
            type="button"
            onClick={() => setActiveQuickViewKit(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 active:bg-red-700 text-white transition-all cursor-pointer shadow-sm active:scale-95 text-xs font-bold shrink-0 border border-red-500/50 min-h-[34px]"
            aria-label="Close kit modal"
            title="Close / Cancel (Esc)"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* 1. Header Information */}
          <div className="space-y-2 border-b border-border pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-primary font-mono">
                {kit.ageRange || 'Age 10+ / Engineering Students'}
              </span>
              <div className="flex items-center gap-1.5 text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-amber-700 font-mono">{kit.rating || 4.9}</span>
                <span className="text-slate-500 font-normal">({kit.reviewsCount || 30} reviews)</span>
              </div>
            </div>

            <h3 className="font-extrabold text-xl sm:text-2xl text-navy leading-snug font-heading">
              {kit.title}
            </h3>

            {kit.subtitle && (
              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-sans">
                {kit.subtitle}
              </p>
            )}

            {/* Price Display */}
            <div className="flex items-center gap-3 pt-2">
              {kit.hidePrice || !kit.price ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold font-heading">Price on Request (Contact on WhatsApp)</span>
                </div>
              ) : (
                <>
                  <span className="text-2xl sm:text-3xl font-extrabold text-navy font-mono">
                    ₹{kit.price}
                  </span>
                  {kit.originalPrice ? (
                    <span className="text-sm text-slate-400 line-through font-mono">
                      ₹{kit.originalPrice}
                    </span>
                  ) : null}
                  {kit.originalPrice && kit.originalPrice > kit.price && (
                    <span className="text-xs font-bold text-success bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      Save {Math.round(((kit.originalPrice - kit.price) / kit.originalPrice) * 100)}%
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Grid Layout: Photos on Left, Highlights & Specs on Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
            {/* Kit Photo Gallery */}
            <div className="space-y-3">
              <div className="aspect-4/3 bg-slate-50 border border-border rounded-2xl overflow-hidden relative flex items-center justify-center p-2 group shadow-2xs">
                <img
                  src={currentPhoto}
                  alt={kit.title}
                  className="w-full h-full object-cover rounded-xl transition-all duration-300"
                />

                {/* Build Time Badge */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-navy border border-border flex items-center gap-1 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{kit.buildTimeHours || 2} hrs Build Time</span>
                </div>

                {/* Pre-tested Badge */}
                <div className="absolute top-3 left-3 bg-navy/90 text-white backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-cyan" />
                  <span>Zero-Soldering Friendly</span>
                </div>

                {/* Photo Navigator Arrows */}
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

              {/* Thumbnails */}
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

              {/* PDF Manual Download Button (if available) */}
              {(kit.pdfUrl || kit.manualUrl) && (
                <a
                  href={kit.pdfUrl || kit.manualUrl}
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
                        {kit.pdfName || 'Assembly & Circuit Manual'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Download step-by-step PDF robotics guide
                      </span>
                    </div>
                  </div>
                  <FileText className="w-4 h-4 text-red-600 shrink-0" />
                </a>
              )}
            </div>

            {/* Right Column: Features, BOM, and Outcomes */}
            <div className="space-y-4">
              {/* Features / Highlights */}
              {kit.features && kit.features.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-border space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy">
                    <Bot className="w-4 h-4 text-primary" />
                    <span>What&apos;s Included &amp; Key Features</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {kit.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Complete BOM Components List */}
              {kit.bomList && kit.bomList.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-navy flex items-center gap-1.5 uppercase tracking-wider">
                      <Layers className="w-4 h-4 text-primary" /> Bill of Materials ({kit.bomList.length} Items)
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Pre-Packed
                    </span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-200/70">
                    {kit.bomList.map((bom, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <span className="text-navy font-medium truncate max-w-[200px]">{bom.item}</span>
                        <span className="font-mono font-bold text-primary shrink-0">x{bom.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Outcomes */}
              {kit.learningOutcomes && kit.learningOutcomes.length > 0 && (
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span>Core Learning Outcomes</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {kit.learningOutcomes.map((outcome, idx) => (
                      <span key={idx} className="text-[11px] bg-white border border-blue-200 px-2.5 py-1 rounded-lg text-navy font-medium">
                        ✓ {outcome}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Supported Languages */}
              {kit.codeLanguage && kit.codeLanguage.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <Code2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px] text-slate-500 font-bold">Programming:</span>
                  <div className="flex flex-wrap gap-1">
                    {kit.codeLanguage.map((lang, idx) => (
                      <span key={idx} className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions (Sticky Bottom) */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Quantity Selector */}
          {!kit.hidePrice && kit.price > 0 ? (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-xs font-bold text-navy font-sans">Quantity:</span>
              <div className="flex items-center border border-border bg-white rounded-xl overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="p-2 hover:bg-slate-100 text-navy transition-colors cursor-pointer"
                  title="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-mono font-bold text-navy min-w-[32px] text-center">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((prev) => prev + 1)}
                  className="p-2 hover:bg-slate-100 text-navy transition-colors cursor-pointer"
                  title="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-secondary font-medium">
              Lab &amp; Institutional Kit Inquiry
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold font-heading shadow-md shadow-primary/20 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{kit.hidePrice ? 'Add to Inquiry Cart' : 'Add Kit to Cart'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-heading shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

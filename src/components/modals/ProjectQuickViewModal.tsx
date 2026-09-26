'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  X, 
  ShoppingCart, 
  MessageCircle, 
  CheckCircle2, 
  Star, 
  Compass, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Layers, 
  Box, 
  FileCode2, 
  Cpu, 
  Check
} from 'lucide-react';

export const ProjectQuickViewModal: React.FC = () => {
  const { 
    activeQuickViewProject, 
    setActiveQuickViewProject, 
    addToCart, 
    openWhatsAppInquiry,
    showToast 
  } = useStore();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Close on Escape key press and prevent background page scrolling
  useEffect(() => {
    if (!activeQuickViewProject) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveQuickViewProject(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeQuickViewProject, setActiveQuickViewProject]);

  if (!activeQuickViewProject) return null;

  const project = activeQuickViewProject;

  const allPhotos = project.images && project.images.length > 0 
    ? project.images 
    : [project.image || 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=700&q=80'];

  const currentPhoto = allPhotos[activePhotoIdx] || allPhotos[0];

  const handleAddAllBOMToCart = () => {
    const isQuoteItem = Boolean(project.hidePrice || !project.estimatedCost);

    if (project.bom && project.bom.length > 0) {
      project.bom.forEach((item, index) => {
        addToCart({
          id: `${project.id}-bom-${index}`,
          type: 'bom_bundle',
          name: `${item.name} (${project.title} BOM)`,
          price: isQuoteItem ? 0 : (item.unitPrice || 0),
          hidePrice: isQuoteItem,
          image: currentPhoto,
          sku: `BOM-${project.id.slice(0, 8).toUpperCase()}-${index + 1}`
        }, item.qty || 1);
      });
      showToast('BOM Parts Added', `All ${project.bom.length} components for ${project.title} added to cart.`, 'success');
    } else {
      addToCart({
        id: project.id,
        type: 'project',
        name: `${project.title} (Blueprint & Hardware Kit)`,
        price: isQuoteItem ? 0 : (project.estimatedCost || 0),
        hidePrice: isQuoteItem,
        image: currentPhoto,
        sku: `PROJ-${project.difficulty.toUpperCase()}`
      }, 1);
      showToast('Project Added', `${project.title} added to your project cart.`, 'success');
    }

    setActiveQuickViewProject(null);
  };

  const handleWhatsAppInquiry = () => {
    openWhatsAppInquiry(
      `Blueprint & BOM Inquiry: ${project.title}`,
      `Estimated BOM: ${project.hidePrice ? 'Price on Request' : `₹${project.estimatedCost}`}, Level: ${project.difficulty}`,
      project.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 animate-fade-in touch-manipulation">
      {/* Backdrop */}
      <div 
        onClick={() => setActiveQuickViewProject(null)}
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
              {project.category}
            </span>
            <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-mono font-bold rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {project.difficulty}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium truncate hidden sm:inline">
              Engineering Blueprint
            </span>
          </div>

          <button
            type="button"
            onClick={() => setActiveQuickViewProject(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 active:bg-red-700 text-white transition-all cursor-pointer shadow-sm active:scale-95 text-xs font-bold shrink-0 border border-red-500/50 min-h-[34px]"
            aria-label="Close project modal"
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
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {project.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-amber-700 font-mono">{project.rating || 4.9}</span>
                <span className="text-slate-500 font-normal">({project.reviewsCount || 18} reviews)</span>
              </div>
            </div>

            <h3 className="font-extrabold text-xl sm:text-2xl text-navy leading-snug font-heading">
              {project.title}
            </h3>

            {project.description && (
              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-sans">
                {project.description}
              </p>
            )}

            {/* Estimated BOM Cost Display */}
            <div className="flex items-center gap-3 pt-2">
              {project.hidePrice || !project.estimatedCost ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold font-heading">Custom Quotation (Contact on WhatsApp)</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium text-secondary">Estimated BOM Hardware Cost:</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-navy font-mono">
                    ₹{project.estimatedCost}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Grid Layout: Photos on Left, BOM & Circuit on Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
            {/* Project Photo Gallery */}
            <div className="space-y-3">
              <div className="aspect-4/3 bg-slate-50 border border-border rounded-2xl overflow-hidden relative flex items-center justify-center p-2 group shadow-2xs">
                <img
                  src={currentPhoto}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-xl transition-all duration-300"
                />

                {/* Hardware indicators badge */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md backdrop-blur-xs flex items-center gap-1 ${
                    project.cadModelAvailable ? 'bg-emerald-600/90 text-white' : 'bg-slate-700/80 text-slate-300'
                  }`}>
                    <Box className="w-3 h-3" />
                    <span>3D CAD Model</span>
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md backdrop-blur-xs flex items-center gap-1 ${
                    project.gerberAvailable ? 'bg-cyan/90 text-navy' : 'bg-slate-700/80 text-slate-300'
                  }`}>
                    <FileCode2 className="w-3 h-3" />
                    <span>Gerber PCB</span>
                  </span>
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

              {/* PDF Blueprint Download Button (if available) */}
              {project.pdfUrl && (
                <a
                  href={project.pdfUrl}
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
                        {project.pdfName || 'Engineering Blueprint & Schematic PDF'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Open verified project circuit documentation
                      </span>
                    </div>
                  </div>
                  <FileText className="w-4 h-4 text-red-600 shrink-0" />
                </a>
              )}
            </div>

            {/* Right Column: Circuit Topology, Highlights, BOM */}
            <div className="space-y-4">
              {/* Circuit Signal Topology */}
              {project.circuitTopology && (
                <div className="bg-slate-900 text-cyan p-4 rounded-2xl border border-slate-800 space-y-1.5 font-mono text-xs shadow-inner">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <Cpu className="w-3.5 h-3.5 text-cyan" />
                    <span>Circuit Signal Topology</span>
                  </div>
                  <p className="text-white font-medium leading-relaxed">{project.circuitTopology}</p>
                </div>
              )}

              {/* Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-border space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy">
                    <Compass className="w-4 h-4 text-primary" />
                    <span>Project Architecture &amp; Highlights</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span className="leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Complete BOM Table */}
              {project.bom && project.bom.length > 0 && (
                <div className="bg-white rounded-2xl border border-border overflow-hidden space-y-0 shadow-2xs">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-border flex items-center justify-between text-xs font-bold text-navy">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Layers className="w-3.5 h-3.5 text-primary" /> Bill of Materials ({project.bom.length} parts)
                    </span>
                    <span className="text-[10px] text-secondary font-mono">Qty &amp; Unit Price</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                    {project.bom.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between px-4 py-2 text-xs">
                        <span className="text-navy font-medium truncate max-w-[190px]">{item.name}</span>
                        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                          <span className="text-slate-500">x{item.qty}</span>
                          {item.unitPrice ? (
                            <span className="font-bold text-primary">₹{item.unitPrice}</span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions (Sticky Bottom) */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-secondary font-medium hidden sm:block">
            {project.bom && project.bom.length > 0
              ? `Includes ${project.bom.length} lab-tested components`
              : 'Complete hardware & blueprint package'}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAddAllBOMToCart}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold font-heading shadow-md shadow-primary/20 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {project.hidePrice || !project.estimatedCost
                  ? 'Add All BOM to Cart (Quote Request)'
                  : `Add All BOM to Cart (₹${project.estimatedCost})`}
              </span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-heading shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Enquire via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { PracticalExperiment } from '@/types';
import { 
  Layers, 
  Code2, 
  Cpu, 
  Clock, 
  ArrowRight, 
  ShoppingCart, 
  BookOpen, 
  Sparkles,
  Terminal,
  Check,
  AlertCircle
} from 'lucide-react';

export const PracticalSection: React.FC = () => {
  const { practicals, setActivePracticalModal, addToCart, products, openWhatsAppInquiry, showToast } = useStore();
  const [activeTopicFilter, setActiveTopicFilter] = useState('All');

  const getPracticalPrice = (prac: PracticalExperiment) => {
    if (prac.estimatedCost && prac.estimatedCost > 0) {
      return { price: prac.estimatedCost, isQuote: Boolean(prac.hidePrice) };
    }
    if (prac.requiredComponents && prac.requiredComponents.length > 0) {
      let total = 0;
      let matchedAny = false;
      for (const comp of prac.requiredComponents) {
        const matched = products.find(
          (p) => p.id === comp.productId || p.name.toLowerCase().includes((comp.name || '').toLowerCase())
        );
        if (matched && matched.price && !matched.hidePrice) {
          total += matched.price * (comp.qty || 1);
          matchedAny = true;
        }
      }
      if (matchedAny && total > 0) {
        return { price: total, isQuote: false };
      }
    }
    return { price: 0, isQuote: true };
  };

  const handleAddPracticalToCart = (prac: PracticalExperiment) => {
    const { price, isQuote } = getPracticalPrice(prac);

    addToCart({
      id: `practical-${prac.id}`,
      type: 'practical',
      name: `${prac.title} (Complete Lab Kit)`,
      price: isQuote ? 0 : price,
      hidePrice: isQuote,
      image: (prac.images && prac.images[0]) || prac.image || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
      sku: `PRAC-${prac.id.slice(0, 8).toUpperCase()}`,
      meta: {
        topic: prac.topic,
        level: prac.level,
        componentsCount: prac.requiredComponents?.length || 0,
        note: 'Programming charge will be extra'
      }
    }, 1);

    showToast('Lab Practical Added 🔬', `${prac.title} added to your cart as a complete practical kit.`, 'success');
  };

  const topics = ['All', 'Microcontroller Fundamentals', 'Robotic Vision & Distance Ranging', 'Motors, Actuators & Power Electronics', 'Wireless, IoT & WebSockets'];

  const filteredPracticals = activeTopicFilter === 'All'
    ? practicals
    : practicals.filter((p) => p.topic === activeTopicFilter);

  return (
    <section id="practical" className="py-16 lg:py-24 bg-background border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Layers className="w-3.5 h-3.5 text-success" />
              <span>Guided Labs &amp; Experiments</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy tracking-tight">
              Interactive Hardware Practicals
            </h2>
            <p className="text-sm text-secondary max-w-xl">
              Learn by building. Step-by-step practical guides with live wiring schematics, pinout connections, and verified source code.
            </p>
          </div>

          {/* Quick Lab Help */}
          <button
            onClick={() => openWhatsAppInquiry('STEM Practical Curriculum & Lab Manual Inquiry')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-navy font-bold text-xs rounded-xl border border-border shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Download Full Lab Curriculum PDF</span>
          </button>
        </div>

        {/* Practicals Grid */}
        {filteredPracticals.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border p-8 sm:p-12 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-primary mx-auto flex items-center justify-center">
              <Layers className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-navy font-heading text-lg">Guided STEM Labs &amp; Practicals</h4>
              <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
                Step-by-step experiment blueprints with verified wiring schematics and code are being prepared for this semester. Looking for custom lab manuals for your school or college?
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => openWhatsAppInquiry('STEM Lab Curriculum & Practical Manual Inquiry')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold font-heading rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Request Lab Curriculum Manual via WhatsApp</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPracticals.map((prac) => {
              const displayImg = prac.image || (prac.images && prac.images[0]) || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80';
              const { price, isQuote } = getPracticalPrice(prac);

              return (
                <div
                  key={prac.id}
                  className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Practical Cover Photo */}
                  <div 
                    onClick={() => setActivePracticalModal(prac)}
                    className="aspect-video sm:h-52 w-full bg-slate-900 relative overflow-hidden cursor-pointer"
                    style={{ aspectRatio: '16 / 9' }}
                  >
                    <img
                      src={displayImg}
                      alt={prac.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 text-[10px] uppercase font-extrabold tracking-wider rounded-md bg-gradient-to-r from-primary to-cyan text-white shadow-xs">
                        NEW
                      </span>
                      <span className="px-2.5 py-1 text-[10px] uppercase font-extrabold tracking-wider rounded-lg bg-navy/90 backdrop-blur-xs text-white border border-slate-700 shadow-xs">
                        {prac.level || 'Beginner'} Level
                      </span>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 bg-navy/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-[11px] flex items-center gap-1 shadow-md border border-white/20">
                      <Clock className="w-3.5 h-3.5 text-cyan" />
                      <span>{prac.durationMin || 30} mins</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 
                        onClick={() => setActivePracticalModal(prac)}
                        className="text-base sm:text-lg font-extrabold text-navy group-hover:text-primary transition-colors cursor-pointer leading-snug"
                      >
                        {prac.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {prac.topic || 'STEM Practical'}
                      </p>
                    </div>

                    {/* Description */}
                    {prac.description && (
                      <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                        {prac.description}
                      </p>
                    )}

                    {/* Component preview */}
                    {prac.requiredComponents && prac.requiredComponents.length > 0 && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-border space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block">
                          Required Lab Hardware:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {prac.requiredComponents.map((comp, idx) => (
                            <span key={idx} className="text-[10px] bg-white border border-border px-2 py-0.5 rounded text-navy">
                              {comp?.name || 'Component'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price & Programming Note */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-secondary">Complete Lab Kit:</span>
                        {isQuote ? (
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                            Price on Request
                          </span>
                        ) : (
                          <span className="font-extrabold text-navy font-mono text-sm">
                            ₹{price}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-xl">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Note: Programming charge will be extra</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 pt-0 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <button
                      onClick={() => setActivePracticalModal(prac)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Terminal className="w-4 h-4 text-cyan" />
                      <span>Lab Guide &amp; Code</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan" />
                    </button>

                    <button
                      onClick={() => handleAddPracticalToCart(prac)}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                      title="Add Whole Lab Kit to Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{isQuote ? 'Add Whole Kit' : `Add Kit (₹${price})`}</span>
                    </button>
                  </div>

                </div>
              );
            })}
        </div>
        )}

      </div>
    </section>
  );
};

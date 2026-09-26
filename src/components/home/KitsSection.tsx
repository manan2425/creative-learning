'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { RoboticsKit } from '@/types';
import { 
  Bot, 
  ShoppingCart, 
  MessageCircle, 
  Clock, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Eye
} from 'lucide-react';

export const KitsSection: React.FC = () => {
  const { kits, addToCart, openWhatsAppInquiry, setActiveQuickViewKit } = useStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  const filteredKits = selectedDifficulty === 'All' 
    ? kits 
    : kits.filter((k) => k.difficulty === selectedDifficulty);

  return (
    <section id="kits" className="py-16 lg:py-24 bg-white border-b border-border relative overflow-hidden">
      
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-bold border border-cyan/30">
              <Bot className="w-3.5 h-3.5 text-cyan" />
              <span>DIY Robotics Starter Kits</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy tracking-tight">
              Hands-On Robot Kits &amp; STEM Bundles
            </h2>
            <p className="text-sm text-secondary max-w-xl">
              Complete plug-and-play kits engineered for schools, makers, and engineering colleges. Includes all motors, sensors, pre-tested microcontrollers, and illustrated manuals.
            </p>
          </div>

          {/* Difficulty Filters */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-xl border border-border overflow-x-auto max-w-full scrollbar-none">
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedDifficulty(lvl)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedDifficulty === lvl
                    ? 'bg-white text-navy shadow-xs border border-border'
                    : 'text-secondary hover:text-navy'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Kits Grid */}
        {filteredKits.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border p-8 sm:p-12 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-cyan/10 border border-cyan/20 text-navy mx-auto flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-navy font-heading text-lg">
                {selectedDifficulty !== 'All' 
                  ? `No ${selectedDifficulty} Kits Listed Currently` 
                  : 'Robotics Starter Kits Arriving Soon'}
              </h4>
              <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
                Looking for an Arduino, ESP32, or STEM DIY robotics kit tailored for students or university labs? Chat directly with our engineering team on WhatsApp for custom bundles.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {selectedDifficulty !== 'All' && (
                <button
                  onClick={() => setSelectedDifficulty('All')}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  View All Levels
                </button>
              )}
              <button
                onClick={() => openWhatsAppInquiry(selectedDifficulty !== 'All' ? `Inquiry for ${selectedDifficulty} Robotics Starter Kits` : 'Robotics Starter Kits Inquiry')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-heading rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Request Custom Starter Kit on WhatsApp</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredKits.map((kit) => (
              <div
                key={kit.id}
                className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-cyan/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Image Banner */}
                  <div 
                    onClick={() => setActiveQuickViewKit(kit)}
                    className="aspect-16/9 bg-slate-900 relative overflow-hidden cursor-pointer"
                  >
                    <img
                      src={kit.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=700&q=80'}
                      alt={kit.title}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {kit.badge && (
                        <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-gradient-to-r from-primary to-cyan text-white shadow-md">
                          ★ {kit.badge}
                        </span>
                      )}
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-navy/90 text-white backdrop-blur-xs border border-slate-700">
                        {kit.difficulty || 'Beginner'}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 bg-navy/90 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-mono font-bold border border-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan" />
                      <span>{kit.buildTimeHours || 2} hrs Build</span>
                    </div>

                    {/* Quick View Button Overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveQuickViewKit(kit);
                      }}
                      className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-white/95 text-navy hover:text-primary hover:bg-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer text-xs font-bold font-heading z-10 opacity-95 group-hover:scale-105"
                      title="View Specifications & Included Parts"
                      aria-label="View Kit Details"
                    >
                      <Eye className="w-3.5 h-3.5 text-primary" />
                      <span>View Kit</span>
                    </button>

                    {/* Price Tag Overlay */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-border shadow-lg flex items-baseline gap-2">
                      {kit.hidePrice || !kit.price ? (
                        <span className="text-xs font-extrabold font-heading text-emerald-800 flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Price on Request
                        </span>
                      ) : (
                        <>
                          <span className="text-xl font-extrabold font-mono text-navy">
                            ₹{kit.price}
                          </span>
                          {kit.originalPrice ? (
                            <span className="text-xs text-slate-400 line-through font-mono">
                              ₹{kit.originalPrice}
                            </span>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    
                    {/* Title & Age */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-secondary mb-1">
                        <span className="font-semibold text-primary">{kit.ageRange || 'All Ages'}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{kit.rating || 4.9}</span>
                          <span className="text-secondary font-normal">({kit.reviewsCount || 0})</span>
                        </div>
                      </div>

                      <h3 
                        onClick={() => setActiveQuickViewKit(kit)}
                        className="text-lg sm:text-xl font-extrabold text-navy leading-snug group-hover:text-primary transition-colors cursor-pointer"
                      >
                        {kit.title}
                      </h3>
                      <p className="text-xs text-secondary mt-1 leading-relaxed">
                        {kit.subtitle}
                      </p>
                    </div>

                    {/* Highlights Features List */}
                    {kit.features && kit.features.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-navy block">
                          What&apos;s Included &amp; Highlights:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {kit.features.slice(0, 3).map((feat, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                              <span className="leading-tight">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* BOM Bill of Materials Pill Preview */}
                    {kit.bomList && kit.bomList.length > 0 && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-border space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-secondary">
                          <span className="font-bold text-navy flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-primary" /> Included Components ({kit.bomList.length} items)
                          </span>
                          <span className="text-[10px]">Zero Soldering Needed</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {kit.bomList.slice(0, 5).map((b, idx) => (
                            <span key={idx} className="text-[10px] bg-white border border-border px-2 py-0.5 rounded text-navy font-medium">
                              {b.item} (x{b.qty})
                            </span>
                          ))}
                          {kit.bomList.length > 5 && (
                            <span className="text-[10px] bg-primary-light text-primary px-2 py-0.5 rounded font-bold">
                              +{kit.bomList.length - 5} more parts
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-0 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      onClick={() => addToCart({
                        id: kit.id,
                        type: 'kit',
                        name: kit.title,
                        price: kit.hidePrice ? 0 : kit.price,
                        hidePrice: Boolean(kit.hidePrice || !kit.price),
                        image: kit.image,
                        sku: `KIT-${(kit.difficulty || 'DIY').toUpperCase()}`,
                      })}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add Kit to Cart</span>
                    </button>

                    <button
                      onClick={() => openWhatsAppInquiry(
                        `Starter Kit Inquiry: ${kit.title}`,
                        `Price: ${kit.hidePrice ? 'Price on Request' : `₹${kit.price}`}, Level: ${kit.difficulty}`,
                        kit.id
                      )}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Order via WhatsApp</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

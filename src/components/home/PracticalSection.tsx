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
  Check
} from 'lucide-react';

export const PracticalSection: React.FC = () => {
  const { practicals, setActivePracticalModal, addToCart, products, openWhatsAppInquiry } = useStore();
  const [activeTopicFilter, setActiveTopicFilter] = useState('All');

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
              Learn by building. Step-by-step practical guides with live wiring schematics, pinout connections, and tested Arduino C++ / MicroPython source code.
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
            {filteredPracticals.map((prac) => (
              <div
                key={prac.id}
                className="bg-white rounded-3xl border border-border p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  
                  {/* Top Badge & Time */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 text-[10px] uppercase font-extrabold tracking-wider rounded-lg bg-primary-light text-primary border border-blue-100">
                      {prac.level || 'Beginner'} Level
                    </span>
                    <div className="flex items-center gap-1 text-xs text-secondary font-mono">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{prac.durationMin || 30} mins</span>
                    </div>
                  </div>

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
                  <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                    {prac.description}
                  </p>

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

                </div>

                {/* Action Buttons */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActivePracticalModal(prac)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Terminal className="w-4 h-4 text-cyan" />
                    <span>Open Lab Guide &amp; Code</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan" />
                  </button>

                  <button
                    onClick={() => {
                      const firstComp = prac.requiredComponents?.[0];
                      const matched = products.find((p) => p.id === firstComp?.productId);
                      if (matched) {
                        addToCart({
                          id: matched.id,
                          type: 'product',
                          name: matched.name,
                          price: matched.price,
                          image: matched.image,
                          sku: matched.sku,
                        });
                      } else {
                        setActivePracticalModal(prac);
                      }
                    }}
                    className="p-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl transition-colors cursor-pointer"
                    title="Add Lab Components to Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

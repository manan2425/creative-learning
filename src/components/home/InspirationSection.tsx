'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Quote, Sparkles, ChevronLeft, ChevronRight, Award, Compass, Lightbulb, MessageCircle, Plus } from 'lucide-react';
import Link from 'next/link';

export const InspirationSection: React.FC = () => {
  const { settings, openWhatsAppInquiry } = useStore();
  const [currentIdx, setCurrentIdx] = useState(0);

  const quotesList = settings.quotes || [];

  useEffect(() => {
    if (quotesList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % quotesList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [quotesList.length]);

  const activeQuote = quotesList[currentIdx];

  return (
    <section id="inspiration" className="py-14 lg:py-20 bg-background border-b border-border relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-circuit-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/10 text-cyan text-xs font-bold border border-cyan/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pioneers &amp; STEM Philosophy</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-navy tracking-tight font-heading">
            Inspiration for the Next Generation of Builders
          </h2>
        </div>

        {/* Carousel & Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Quote Card */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-10 lg:p-12 border border-border shadow-2xs flex flex-col justify-between relative overflow-hidden w-full max-w-full">
            <div className="absolute top-6 right-6 text-slate-100 pointer-events-none">
              <Quote className="w-28 h-28 opacity-80" />
            </div>

            {quotesList.length === 0 ? (
              <div className="py-10 text-center space-y-3 relative z-10">
                <Quote className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-navy text-base font-heading">No Quotes Added Yet</h4>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  You can add inspirational quotes by pioneers (Tesla, Turing, Lovelace) or custom motto from the Admin CMS.
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Quotes in Admin CMS</span>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4 sm:space-y-6 relative z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary">
                    <Quote className="w-5 h-5 sm:w-6 sm:h-6 fill-primary/20" />
                  </div>

                  <blockquote className="text-base sm:text-2xl lg:text-3xl font-extrabold text-navy leading-snug tracking-tight font-heading break-words">
                    &ldquo;{activeQuote?.text}&rdquo;
                  </blockquote>

                  <div>
                    <div className="font-extrabold text-base text-primary font-heading">
                      {activeQuote?.author}
                    </div>
                    <div className="text-xs text-secondary font-medium">
                      {activeQuote?.role}
                    </div>
                  </div>
                </div>

                {/* Carousel Controls */}
                {quotesList.length > 1 && (
                  <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 relative z-10">
                    <div className="flex items-center gap-2">
                      {quotesList.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentIdx(i)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            currentIdx === i ? 'w-8 bg-primary' : 'w-2 bg-slate-200 hover:bg-slate-300'
                          }`}
                          aria-label={`Slide ${i + 1}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentIdx((prev) => (prev - 1 + quotesList.length) % quotesList.length)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy transition-colors cursor-pointer"
                        aria-label="Previous quote"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCurrentIdx((prev) => (prev + 1) % quotesList.length)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy transition-colors cursor-pointer"
                        aria-label="Next quote"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Right STEM Stats Column */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            
            <div className="bg-white p-6 rounded-3xl border border-border shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-navy text-base font-heading">5,000+ Students Mentored</h4>
              <p className="text-xs text-secondary leading-relaxed font-sans">
                Empowering school and engineering students across India with hands-on robotics and IoT kits.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-border shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan/15 text-cyan flex items-center justify-center font-bold">
                <Lightbulb className="w-5 h-5 text-cyan" />
              </div>
              <h4 className="font-extrabold text-navy text-base font-heading">100% Pre-Tested Silicon</h4>
              <p className="text-xs text-secondary leading-relaxed font-sans">
                Curated by embedded engineers with zero-error pin connections and tested C++ firmware.
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary to-cyan text-white p-6 rounded-3xl shadow-md space-y-3">
              <div className="font-extrabold text-base font-heading">Need Lab Mentorship?</div>
              <p className="text-xs text-white/90 font-sans">
                Direct WhatsApp consultation with our hardware team for science fair &amp; robotics competitions.
              </p>
              <button
                onClick={() => openWhatsAppInquiry('Science Fair & Robotics Mentorship Consultation')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-navy hover:bg-slate-100 text-xs font-bold font-heading rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

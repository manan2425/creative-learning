'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  Bot, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle, 
  Zap, 
  CheckCircle2,
  Terminal,
  Layers,
  ChevronRight,
  Sliders,
  Radio
} from 'lucide-react';
import Link from 'next/link';

export const HeroSection: React.FC = () => {
  const { openWhatsAppInquiry, settings } = useStore();

  const hero = settings.hero || {
    badgeText: 'GENUINE STEM HARDWARE & ROBOTICS LABS',
    headlinePrefix: 'Build The Future With',
    highlightWord: 'Next-Gen Robotics',
    headlineSuffix: '& Embedded Systems',
    subheadline: 'Industrial-grade microcontrollers, smart sensor arrays, autonomous rover kits, and open-source STEM blueprints with direct WhatsApp ordering and fast pan-India dispatch.',
    primaryCtaText: 'Explore Hardware Store',
    primaryCtaLink: '#products',
    secondaryCtaText: 'Launch Bot Builder',
    secondaryCtaLink: '#bot-builder',
    stat1Value: '100%',
    stat1Label: 'Pre-Tested Silicon',
    stat2Value: '48h',
    stat2Label: 'Pan-India Dispatch',
    stat3Value: '1-Click Direct',
    stat3Label: 'WhatsApp Dispatch & Support'
  };

  return (
    <section className="relative overflow-hidden w-full max-w-full bg-robotic-circuit border-b border-border py-8 sm:py-12 lg:py-20">
      
      {/* High-Tech PCB Vector Overlays */}
      <div className="absolute top-1/4 left-1/3 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] bg-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            
            {/* Top Robotic Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-primary-light border border-blue-200 text-[10px] sm:text-xs font-bold font-mono text-primary shadow-2xs max-w-full">
              <span className="w-2 h-2 rounded-full bg-cyan animate-ping inline-block shrink-0" />
              <span className="truncate">{hero.badgeText}</span>
              <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy font-heading tracking-tight leading-[1.15] break-words">
              {hero.headlinePrefix}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan underline decoration-cyan decoration-2 sm:decoration-4 underline-offset-4 sm:underline-offset-8">
                {hero.highlightWord}
              </span>{' '}
              {hero.headlineSuffix}
            </h1>

            {/* Sub-headline */}
            <p className="text-xs sm:text-base lg:text-lg text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans">
              {hero.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
              <a
                href={hero.primaryCtaLink || '#products'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 btn-primary-glow text-white rounded-xl font-bold font-heading text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                <span>{hero.primaryCtaText || 'Explore Storefront'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#kits"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 bg-white hover:bg-slate-50 text-navy rounded-xl font-bold font-heading text-xs sm:text-sm border border-border shadow-2xs transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-cyan" />
                <span>Explore Robotics Kits</span>
              </a>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-4 sm:pt-6 border-t border-border text-xs">
              <div className="flex items-center gap-2.5 p-2.5 bg-white/80 rounded-xl border border-border justify-center sm:justify-start">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <div className="text-left">
                  <div className="font-extrabold font-mono text-navy">{hero.stat1Value}</div>
                  <div className="text-[10px] text-secondary font-medium">{hero.stat1Label}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-white/80 rounded-xl border border-border justify-center sm:justify-start">
                <Zap className="w-4 h-4 text-cyan shrink-0" />
                <div className="text-left">
                  <div className="font-extrabold font-mono text-navy">{hero.stat2Value}</div>
                  <div className="text-[10px] text-secondary font-medium">{hero.stat2Label}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-white/80 rounded-xl border border-border justify-center sm:justify-start min-w-0">
                <Terminal className="w-4 h-4 text-primary shrink-0" />
                <div className="text-left min-w-0">
                  <div className="font-extrabold font-mono text-navy truncate">{hero.stat3Value}</div>
                  <div className="text-[10px] text-secondary font-medium">{hero.stat3Label}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Official Logo Brand Terminal Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Card Container */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 text-navy shadow-xl border border-border relative overflow-hidden">
                
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan via-primary to-orange" />

                {/* Top Status Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-border/70">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono font-extrabold bg-slate-50 text-navy rounded-lg border border-border tracking-wider">
                    <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
                    ROBOTICS COMMAND TERMINAL
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                    VERIFIED DESK
                  </span>
                </div>

                {/* Official Logo Brand Panel - Pure White Background */}
                <div className="my-6 py-6 px-4 rounded-2xl bg-white border border-border shadow-2xs flex flex-col items-center justify-center text-center relative group">
                  <img
                    src="/images/branding/creative-learning-hero-logo.png"
                    alt="Creative Learning - Robotics & Electronics Innovation"
                    className="max-h-24 sm:max-h-28 w-auto object-contain drop-shadow-2xs transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.png';
                    }}
                  />
                  <p className="text-primary font-heading font-semibold text-xs sm:text-sm mt-3 tracking-wide">
                    Robotics &amp; Electronics Innovation Hub
                  </p>
                </div>

                {/* Inspiration Quote / Mission Pill */}
                {(() => {
                  const quoteText = settings.heroQuoteText || settings.sectionQuotes?.globalQuoteText || 'The future belongs to students and makers who build what they imagine with hands-on silicon.';
                  const quoteAuthor = settings.heroQuoteAuthor || settings.sectionQuotes?.globalQuoteAuthor || 'Creative Learning Engineering Lab';
                  return (
                    <div className="bg-slate-50 rounded-xl p-4 border border-border/80 text-left relative overflow-hidden">
                      <div className="text-3xl text-primary/20 font-serif font-black absolute top-1 right-3 select-none leading-none">
                        &ldquo;
                      </div>
                      <p className="text-xs sm:text-[13px] italic text-slate-700 font-sans leading-relaxed relative z-10 pr-4">
                        {quoteText}
                      </p>
                      <small className="text-[11px] font-mono font-bold text-primary mt-2 block">
                        {quoteAuthor.startsWith('—') ? quoteAuthor : `— ${quoteAuthor}`}
                      </small>
                    </div>
                  );
                })()}

                {/* Quick WhatsApp Technical Consultation */}
                <button
                  onClick={() => openWhatsAppInquiry('Hardware Storefront Quick Inquiry')}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-bold font-heading text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant Technical Desk on WhatsApp</span>
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

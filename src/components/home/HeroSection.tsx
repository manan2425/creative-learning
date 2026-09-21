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
  Sliders
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
    stat3Value: '+91 9714045096',
    stat3Label: 'WhatsApp Direct Support'
  };

  return (
    <section className="relative overflow-hidden bg-robotic-circuit border-b border-border py-12 lg:py-20">
      
      {/* High-Tech PCB Vector Overlays */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Robotic Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light border border-blue-200 text-xs font-bold font-mono text-primary shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-cyan animate-ping inline-block" />
              <span>{hero.badgeText}</span>
              <ChevronRight className="w-3.5 h-3.5 text-primary" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-navy font-heading tracking-tight leading-[1.12]">
              {hero.headlinePrefix}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan underline decoration-cyan decoration-4 underline-offset-8">
                {hero.highlightWord}
              </span>{' '}
              {hero.headlineSuffix}
            </h1>

            {/* Sub-headline */}
            <p className="text-sm sm:text-base lg:text-lg text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans">
              {hero.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href={hero.primaryCtaLink || '#products'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 btn-primary-glow text-white rounded-xl font-bold font-heading text-sm shadow-md transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                <span>{hero.primaryCtaText || 'Explore Storefront'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#kits"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white hover:bg-slate-50 text-navy rounded-xl font-bold font-heading text-sm border border-border shadow-2xs transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-cyan" />
                <span>Explore Robotics Kits</span>
              </a>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-border text-xs">
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

              <div className="flex items-center gap-2.5 p-2.5 bg-white/80 rounded-xl border border-border justify-center sm:justify-start">
                <Terminal className="w-4 h-4 text-primary shrink-0" />
                <div className="text-left">
                  <div className="font-extrabold font-mono text-navy truncate">{hero.stat3Value}</div>
                  <div className="text-[10px] text-secondary font-medium">{hero.stat3Label}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High-Tech Telemetry & Robot Visualizer Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Card Container */}
              <div className="glass-dark bg-dark-robotic rounded-3xl p-6 text-white shadow-2xl border border-slate-700 relative overflow-hidden">
                
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan/15 to-transparent opacity-30 animate-scanline pointer-events-none" />

                {/* Top Status Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    <span className="text-xs font-mono text-slate-300 ml-2">robotics_os_v2.bin</span>
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-cyan/20 text-cyan rounded-full border border-cyan/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-ping" />
                    SYSTEM ONLINE
                  </span>
                </div>

                {/* Robot Visualizer Image */}
                <div className="my-5 aspect-4/3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-4 border border-slate-700 relative overflow-hidden flex flex-col justify-between">
                  <img
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80"
                    alt="Autonomous AI Robot Rover"
                    className="w-full h-full object-cover rounded-xl opacity-90"
                  />

                  {/* Overlay Badges */}
                  <div className="absolute top-6 left-6 bg-navy/90 backdrop-blur-md px-3 py-1 rounded-lg border border-cyan/40 text-xs font-mono text-cyan flex items-center gap-1.5 shadow-lg">
                    <Bot className="w-4 h-4 text-cyan" />
                    <span>RoboNav AI Kernel</span>
                  </div>

                  <div className="absolute bottom-6 right-6 bg-navy/90 backdrop-blur-md px-3 py-1 rounded-lg border border-emerald-500/40 text-xs font-mono text-emerald-400 flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Verified</span>
                  </div>
                </div>

                {/* Live Telemetry Data Box */}
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700 font-mono text-xs space-y-2.5">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>HARDWARE TELEMETRY</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      BENCH READY
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">DIRECT WHATSAPP</span>
                      <span className="text-cyan font-bold block truncate">{settings.whatsappNumber || '+91 9714045096'}</span>
                    </div>

                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">FREE SHIPPING ON</span>
                      <span className="text-emerald-400 font-bold block">₹{settings.freeShippingThreshold || 999}+</span>
                    </div>
                  </div>
                </div>

                {/* Quick WhatsApp Inquiry Action */}
                <button
                  onClick={() => openWhatsAppInquiry('Hardware Storefront Quick Inquiry')}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-bold font-heading text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant Technical Consultation on WhatsApp</span>
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

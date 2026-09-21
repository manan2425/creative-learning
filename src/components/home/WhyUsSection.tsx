'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  ShieldCheck, 
  Activity, 
  Zap, 
  Cpu, 
  MessageCircle, 
  Building2, 
  Truck, 
  CheckCircle2, 
  Award,
  ArrowRight
} from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const { openWhatsAppInquiry, settings } = useStore();

  const whyUs = settings.whyUs || {
    badge: 'HARDWARE QUALITY GUARANTEE',
    title: 'Why Creative Learning Leads In STEM Robotics',
    subtitle: 'Every microcontroller, sensor, and starter kit passes through our multi-stage hardware diagnostic pipeline before dispatch.',
    steps: [
      {
        stepNumber: '01',
        title: 'Rigorous Silicon Pre-Testing',
        subtitle: '100% of microcontrollers (ESP32, Arduino, Pico) are bench-flashed with test firmware to verify GPIO pins, ADC accuracy, and clock stability.',
        highlight: 'Zero DOA Guarantee'
      },
      {
        stepNumber: '02',
        title: 'Engineered For Students & Labs',
        subtitle: 'Our starter kits feature plug-and-play wiring guides, clear pinout labels, and verified sample code eliminating wiring mistakes.',
        highlight: 'Zero-Soldering Friendly'
      },
      {
        stepNumber: '03',
        title: 'Direct WhatsApp Support',
        subtitle: 'Get instant hardware troubleshooting, schematic reviews, and bulk lab quotations directly from engineers on WhatsApp (+91 9714045096).',
        highlight: 'Engineer on Chat'
      },
      {
        stepNumber: '04',
        title: 'Open Source Ecosystem',
        subtitle: 'Every practical and project includes complete wiring diagrams, bill of materials, and downloadable C++/MicroPython source code.',
        highlight: '100% Open Access'
      }
    ],
    guaranteeTitle: 'School, College & Maker Lab Package Consultation',
    guaranteeDesc: 'Equipping a robotics lab or organizing a STEM workshop? We provide custom hardware bundles with itemized GST invoices, curriculum manuals, and component replacement warranties.'
  };

  const icons = [Zap, Cpu, Activity, ShieldCheck];

  return (
    <section id="why-us" className="py-14 lg:py-20 bg-white border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span>{whyUs.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-navy font-heading tracking-tight">
            {whyUs.title}
          </h2>
          <p className="text-xs sm:text-sm text-secondary leading-relaxed font-sans">
            {whyUs.subtitle}
          </p>
        </div>

        {/* Diagnostic Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {whyUs.steps.map((step, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="bg-card rounded-2xl border border-border p-6 shadow-2xs hover:shadow-md hover:border-primary/40 transition-all space-y-3 relative group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-primary border border-blue-100">
                      {step.highlight || `STEP ${step.stepNumber}`}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-navy font-heading leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed font-sans">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional STEM Lab Setup Banner */}
        <div className="bg-gradient-to-br from-navy to-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 text-white border border-slate-700 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-bold border border-cyan/40">
                <Building2 className="w-3.5 h-3.5" />
                <span>Institutional Partner</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
                {whyUs.guaranteeTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-sans">
                {whyUs.guaranteeDesc}
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-200 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan" /> Custom Syllabus Kits
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan" /> GST Invoice &amp; Institution Discount
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan" /> Engineer WhatsApp Support
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => openWhatsAppInquiry('Institutional Bulk STEM Lab Setup & Quotation')}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold font-heading text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Request Lab Quotation on WhatsApp</span>
              </button>

              <div className="text-center text-xs text-slate-400 font-mono">
                Direct WhatsApp: {settings.whatsappNumber || '+91 9714045096'}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

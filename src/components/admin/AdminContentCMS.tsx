'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  CMSHeroContent, 
  CMSWhyUsContent, 
  QuoteItem 
} from '@/types';
import { 
  FileEdit, 
  Save, 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  Quote, 
  Plus, 
  Trash2, 
  RefreshCw,
  ExternalLink,
  Sliders,
  Megaphone
} from 'lucide-react';

export const AdminContentCMS: React.FC = () => {
  const { settings, updateCMSContent, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<'hero' | 'whyUs' | 'quotes' | 'footer'>('hero');
  const [isSaving, setIsSaving] = useState(false);

  // Hero State
  const [heroData, setHeroData] = useState<CMSHeroContent>({
    badgeText: settings.hero?.badgeText || 'GENUINE STEM HARDWARE & ROBOTICS LABS',
    headlinePrefix: settings.hero?.headlinePrefix || 'Build The Future With',
    highlightWord: settings.hero?.highlightWord || 'Next-Gen Robotics',
    headlineSuffix: settings.hero?.headlineSuffix || '& Embedded Systems',
    subheadline: settings.hero?.subheadline || 'Industrial-grade microcontrollers, smart sensor arrays, autonomous rover kits, and open-source STEM blueprints with direct WhatsApp ordering and fast pan-India dispatch.',
    primaryCtaText: settings.hero?.primaryCtaText || 'Explore Hardware Store',
    primaryCtaLink: settings.hero?.primaryCtaLink || '#products',
    secondaryCtaText: settings.hero?.secondaryCtaText || 'Launch Bot Builder',
    secondaryCtaLink: settings.hero?.secondaryCtaLink || '#bot-builder',
    stat1Value: settings.hero?.stat1Value || '100%',
    stat1Label: settings.hero?.stat1Label || 'Pre-Tested Silicon',
    stat2Value: settings.hero?.stat2Value || '48h',
    stat2Label: settings.hero?.stat2Label || 'Pan-India Dispatch',
    stat3Value: settings.hero?.stat3Value || '1-Click Direct',
    stat3Label: settings.hero?.stat3Label || 'WhatsApp Dispatch & Support',
  });

  // Why Us State
  const [whyUsData, setWhyUsData] = useState<CMSWhyUsContent>({
    badge: settings.whyUs?.badge || 'HARDWARE QUALITY GUARANTEE',
    title: settings.whyUs?.title || 'Why Creative Learning Leads In STEM Robotics',
    subtitle: settings.whyUs?.subtitle || 'Every microcontroller, sensor, and starter kit passes through our multi-stage hardware diagnostic pipeline before dispatch.',
    steps: settings.whyUs?.steps || [
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
        subtitle: 'Get instant hardware troubleshooting, schematic reviews, and bulk lab quotations directly from engineers on WhatsApp.',
        highlight: 'Engineer on Chat'
      },
      {
        stepNumber: '04',
        title: 'Open Source Ecosystem',
        subtitle: 'Every practical and project includes complete wiring diagrams, bill of materials, and downloadable C++/MicroPython source code.',
        highlight: '100% Open Access'
      }
    ],
    guaranteeTitle: settings.whyUs?.guaranteeTitle || 'School, College & Maker Lab Package Consultation',
    guaranteeDesc: settings.whyUs?.guaranteeDesc || 'Equipping a robotics lab or organizing a STEM workshop? We provide custom hardware bundles with itemized GST invoices, curriculum manuals, and component replacement warranties.'
  });

  // Quotes State
  const [quotesList, setQuotesList] = useState<QuoteItem[]>(
    settings.quotes && settings.quotes.length > 0 
      ? settings.quotes 
      : [
          {
            id: 'quote-1',
            text: "The present is theirs; the future, for which I really worked, is mine.",
            author: "Nikola Tesla",
            role: "Electrical Pioneer & Inventor"
          },
          {
            id: 'quote-2',
            text: "Sometimes it is the people no one can imagine anything of who do the things that no one can imagine.",
            author: "Alan Turing",
            role: "Father of Modern Computer Science & AI"
          }
        ]
  );

  // Footer State
  const [footerData, setFooterData] = useState({
    footerBio: settings.footerBio || 'Creative Learning is your premier robotics and electronics supplier, empowering students, makers, and universities with precision STEM kits and embedded components.',
    footerAddress: settings.footerAddress || 'Electronics & Robotics Innovation Hub, Ahmedabad, Gujarat, India',
    footerPhone: settings.footerPhone || 'WhatsApp Direct Chat',
  });

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCMSContent('hero', heroData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWhyUs = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCMSContent('whyUs', whyUsData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveQuotes = async () => {
    setIsSaving(true);
    try {
      await updateCMSContent('quotes', quotesList);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFooter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCMSContent('general', footerData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuote = () => {
    const newQ: QuoteItem = {
      id: 'quote-' + Date.now(),
      text: 'Engineering is the closest thing to magic that exists in the world.',
      author: 'Elon Musk / Maker Quote',
      role: 'Technology Pioneer'
    };
    setQuotesList([...quotesList, newQ]);
  };

  const handleUpdateQuote = (idx: number, field: keyof QuoteItem, val: string) => {
    const updated = [...quotesList];
    updated[idx] = { ...updated[idx], [field]: val };
    setQuotesList(updated);
  };

  const handleDeleteQuote = (idx: number) => {
    setQuotesList(quotesList.filter((_, i) => i !== idx));
  };

  const handleUpdateWhyUsStep = (stepIdx: number, field: string, val: string) => {
    const updatedSteps = [...whyUsData.steps];
    updatedSteps[stepIdx] = { ...updatedSteps[stepIdx], [field]: val };
    setWhyUsData({ ...whyUsData, steps: updatedSteps });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-navy font-heading">
            Website Content &amp; Text CMS
          </h2>
          <p className="text-xs text-secondary mt-0.5 font-sans">
            Customize all headlines, banners, telemetry stats, diagnostic steps, and quotes displayed on the website.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold font-mono transition-colors self-start sm:self-auto"
        >
          <span>Preview Live Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-border">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold font-heading rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'hero'
              ? 'border-primary text-primary bg-blue-50/50'
              : 'border-transparent text-secondary hover:text-navy'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Hero &amp; Headlines</span>
        </button>

        <button
          onClick={() => setActiveTab('whyUs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold font-heading rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'whyUs'
              ? 'border-primary text-primary bg-blue-50/50'
              : 'border-transparent text-secondary hover:text-navy'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Why Us &amp; Diagnostics</span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold font-heading rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'quotes'
              ? 'border-primary text-primary bg-blue-50/50'
              : 'border-transparent text-secondary hover:text-navy'
          }`}
        >
          <Quote className="w-4 h-4" />
          <span>Inspiration Quotes</span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold font-heading rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'footer'
              ? 'border-primary text-primary bg-blue-50/50'
              : 'border-transparent text-secondary hover:text-navy'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Footer &amp; Bio Info</span>
        </button>
      </div>

      {/* 1. HERO SECTION FORM */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHero} className="bg-white p-6 rounded-2xl border border-border shadow-2xs space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-navy uppercase tracking-wider font-mono border-b border-slate-100 pb-2 flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              Hero Section Headline &amp; Subtitle
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-navy">Top Cyber Badge Text</label>
              <input
                type="text"
                value={heroData.badgeText}
                onChange={(e) => setHeroData({ ...heroData, badgeText: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-mono font-bold text-navy focus:outline-hidden focus:border-primary focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-navy">Headline Prefix</label>
                <input
                  type="text"
                  value={heroData.headlinePrefix}
                  onChange={(e) => setHeroData({ ...heroData, headlinePrefix: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-primary">Highlighted Word (Cyan Gradient)</label>
                <input
                  type="text"
                  value={heroData.highlightWord}
                  onChange={(e) => setHeroData({ ...heroData, highlightWord: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-blue-50 border border-primary/40 rounded-xl text-xs font-extrabold text-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-navy">Headline Suffix</label>
                <input
                  type="text"
                  value={heroData.headlineSuffix}
                  onChange={(e) => setHeroData({ ...heroData, headlineSuffix: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-navy">Subheadline Paragraph</label>
              <textarea
                rows={3}
                value={heroData.subheadline}
                onChange={(e) => setHeroData({ ...heroData, subheadline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary focus:bg-white leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Hero Buttons & Stats */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider font-mono">
              Action Buttons &amp; Live Telemetry Metrics
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-navy">Primary Button Label</label>
                <input
                  type="text"
                  value={heroData.primaryCtaText}
                  onChange={(e) => setHeroData({ ...heroData, primaryCtaText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-navy">Secondary Button Label</label>
                <input
                  type="text"
                  value={heroData.secondaryCtaText}
                  onChange={(e) => setHeroData({ ...heroData, secondaryCtaText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-border space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Metric 1</span>
                <input
                  type="text"
                  placeholder="100%"
                  value={heroData.stat1Value}
                  onChange={(e) => setHeroData({ ...heroData, stat1Value: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-border rounded-lg text-xs font-bold font-mono text-navy"
                />
                <input
                  type="text"
                  placeholder="Pre-Tested Silicon"
                  value={heroData.stat1Label}
                  onChange={(e) => setHeroData({ ...heroData, stat1Label: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-border rounded-lg text-xs text-secondary"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-border space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Metric 2</span>
                <input
                  type="text"
                  placeholder="48h"
                  value={heroData.stat2Value}
                  onChange={(e) => setHeroData({ ...heroData, stat2Value: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-border rounded-lg text-xs font-bold font-mono text-navy"
                />
                <input
                  type="text"
                  placeholder="Pan-India Dispatch"
                  value={heroData.stat2Label}
                  onChange={(e) => setHeroData({ ...heroData, stat2Label: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-border rounded-lg text-xs text-secondary"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-border space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Metric 3</span>
                <input
                  type="text"
                  placeholder="1-Click Direct"
                  value={heroData.stat3Value}
                  onChange={(e) => setHeroData({ ...heroData, stat3Value: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-border rounded-lg text-xs font-bold font-mono text-navy"
                />
                <input
                  type="text"
                  placeholder="WhatsApp Support"
                  value={heroData.stat3Label}
                  onChange={(e) => setHeroData({ ...heroData, stat3Label: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-border rounded-lg text-xs text-secondary"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Hero Section'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. WHY US SECTION FORM */}
      {activeTab === 'whyUs' && (
        <form onSubmit={handleSaveWhyUs} className="bg-white p-6 rounded-2xl border border-border shadow-2xs space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-navy uppercase tracking-wider font-mono border-b border-slate-100 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Why Choose Us Section &amp; Diagnostic Pipeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-navy">Section Badge</label>
                <input
                  type="text"
                  value={whyUsData.badge}
                  onChange={(e) => setWhyUsData({ ...whyUsData, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-bold text-navy"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-navy">Section Title</label>
                <input
                  type="text"
                  value={whyUsData.title}
                  onChange={(e) => setWhyUsData({ ...whyUsData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-extrabold text-navy"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-navy">Subtitle</label>
              <input
                type="text"
                value={whyUsData.subtitle}
                onChange={(e) => setWhyUsData({ ...whyUsData, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-secondary"
              />
            </div>
          </div>

          {/* 4 Steps */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider font-mono">
              4 Quality Diagnostic Steps
            </h4>

            <div className="space-y-4">
              {whyUsData.steps.map((step, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold text-primary">
                      Step {step.stepNumber}
                    </span>
                    <input
                      type="text"
                      placeholder="Highlight tag (e.g. 'Zero DOA Guarantee')"
                      value={step.highlight}
                      onChange={(e) => handleUpdateWhyUsStep(idx, 'highlight', e.target.value)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-white border border-border rounded-lg text-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-navy">Step Title</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleUpdateWhyUsStep(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-bold text-navy"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-navy">Step Description</label>
                      <textarea
                        rows={2}
                        value={step.subtitle}
                        onChange={(e) => handleUpdateWhyUsStep(idx, 'subtitle', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-border rounded-lg text-xs text-secondary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Why Us Section'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. INSPIRATION QUOTES */}
      {activeTab === 'quotes' && (
        <div className="bg-white p-6 rounded-2xl border border-border shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-navy uppercase tracking-wider font-mono flex items-center gap-2">
              <Quote className="w-4 h-4 text-cyan" />
              STEM Pioneer &amp; Robotics Quotes
            </h3>
            <button
              type="button"
              onClick={handleAddQuote}
              className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-primary text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Quote</span>
            </button>
          </div>

          <div className="space-y-4">
            {quotesList.map((q, idx) => (
              <div key={q.id || idx} className="p-4 bg-slate-50 rounded-2xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Quote #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuote(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Quote"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Quote Text</label>
                  <textarea
                    rows={2}
                    value={q.text}
                    onChange={(e) => handleUpdateQuote(idx, 'text', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-border rounded-xl text-xs text-navy font-serif italic"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy">Author</label>
                    <input
                      type="text"
                      value={q.author}
                      onChange={(e) => handleUpdateQuote(idx, 'author', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-bold text-navy"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy">Role / Title</label>
                    <input
                      type="text"
                      value={q.role}
                      onChange={(e) => handleUpdateQuote(idx, 'role', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-border rounded-lg text-xs text-secondary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={handleSaveQuotes}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Quotes List'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. FOOTER & BIO FORM */}
      {activeTab === 'footer' && (
        <form onSubmit={handleSaveFooter} className="bg-white p-6 rounded-2xl border border-border shadow-2xs space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-navy uppercase tracking-wider font-mono border-b border-slate-100 pb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              Footer Branding &amp; Contact Details
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-navy">Company Bio Paragraph (Footer)</label>
              <textarea
                rows={3}
                value={footerData.footerBio}
                onChange={(e) => setFooterData({ ...footerData, footerBio: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-navy">Physical Hub / City Address</label>
                <input
                  type="text"
                  value={footerData.footerAddress}
                  onChange={(e) => setFooterData({ ...footerData, footerAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-navy">Direct Contact Hotline</label>
                <input
                  type="text"
                  value={footerData.footerPhone}
                  onChange={(e) => setFooterData({ ...footerData, footerPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Footer Info'}</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

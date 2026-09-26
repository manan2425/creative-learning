'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { MessageCircle, X, Sparkles, Send, ShieldCheck, ShoppingCart } from 'lucide-react';

export const WhatsAppFloatingBtn: React.FC = () => {
  const { 
    openWhatsAppInquiry, 
    settings, 
    isCartOpen, 
    isCheckoutOpen, 
    isSearchOpen,
    activePracticalModal,
    activeQuickViewProduct,
    activeQuickViewKit,
    activeQuickViewProject,
    cart,
    setIsCartOpen
  } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const cartTotalCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Automatically hide floating button if cart, checkout, search, or details modal is open
  if (isCartOpen || isCheckoutOpen || isSearchOpen || activePracticalModal || activeQuickViewProduct || activeQuickViewKit || activeQuickViewProject) {
    return null;
  }

  const quickTopics = [
    '📦 Check component stock & price list',
    '🤖 Need help selecting a Robotics Kit',
    '🔬 Setting up a School / College STEM Lab',
    '⚡ Request custom PCB / Component BOM Quote',
  ];

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    openWhatsAppInquiry('Custom Website Inquiry', customMsg);
    setCustomMsg('');
    setIsOpen(false);
  };

  return (
    <aside aria-label="WhatsApp Support and Quick Cart" className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end max-w-[calc(100vw-1.5rem)] pointer-events-auto">
      {/* Popover Assistant */}
      {isOpen && (
        <div className="mb-2.5 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white p-0.5 flex items-center justify-center border border-white/30 shrink-0 overflow-hidden shadow-xs">
                  <Image 
                    src="/logo-emblem.png" 
                    alt="Creative Learning Logo" 
                    width={32} 
                    height={32} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm leading-tight font-heading truncate">Creative Learning WhatsApp</h4>
                  <p className="text-[10px] sm:text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping inline-block shrink-0" />
                    Live Hardware Engineer Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer shrink-0"
                aria-label="Close WhatsApp chat popover"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-3.5 sm:p-4 space-y-3 bg-slate-50">
            <div className="bg-white p-3 rounded-xl border border-border text-xs text-navy space-y-1 shadow-2xs">
              <p className="font-medium">
                👋 Hello Maker! Welcome to <strong>Creative Learning</strong>.
              </p>
              <p className="text-secondary text-[11px]">
                How can our robotics lab team assist you today? Select a quick inquiry below or type your message:
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              {quickTopics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => {
                    openWhatsAppInquiry(topic);
                    setIsOpen(false);
                  }}
                  className="w-full text-left text-xs bg-white hover:bg-emerald-50 text-navy hover:text-emerald-700 font-medium py-2 px-3 rounded-lg border border-border hover:border-emerald-300 transition-colors shadow-2xs flex items-center justify-between cursor-pointer gap-2"
                >
                  <span className="truncate">{topic}</span>
                  <span className="text-[10px] text-emerald-600 font-bold shrink-0">Send →</span>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <form onSubmit={handleSendCustom} className="pt-1.5">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Type your component requirement..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 bg-white border border-border rounded-lg text-navy focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-w-0"
                />
                <button
                  type="submit"
                  disabled={!customMsg.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="pt-0.5 text-[10px] text-center text-slate-400 flex items-center justify-center gap-1 truncate">
              <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>Direct WhatsApp Engineering Consultation</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Elements Above WhatsApp Button */}
      {!isOpen && (
        <div className="mb-2 flex flex-col items-end gap-1.5 sm:gap-2">
          {/* Small Brand Logo Badge */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-navy/95 backdrop-blur-md text-white rounded-full shadow-lg border border-slate-700/80 select-none">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-white p-0.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
              <Image 
                src="/logo-emblem.png" 
                alt="Creative Learning Logo" 
                width={20} 
                height={20} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[10px] sm:text-[11px] font-extrabold font-heading tracking-tight">
              Creative<span className="text-cyan">Learning</span>
            </span>
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          </div>

          {/* Floating Cart Button with Cart Logo and Number of Items Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-navy via-slate-900 to-navy hover:from-primary hover:to-primary-hover text-white rounded-full shadow-xl shadow-navy/30 hover:shadow-primary/40 border border-slate-700/80 hover:border-primary/50 transition-all duration-200 cursor-pointer active:scale-95"
            aria-label={`Open Cart (${cartTotalCount} items)`}
            title={`Open Cart (${cartTotalCount} items)`}
          >
            <div className="relative flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan group-hover:text-white transition-colors" />
            </div>
            <span className="text-xs font-bold font-heading tracking-wide">
              Cart
            </span>
            <span className={`inline-flex items-center justify-center font-extrabold text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full font-mono transition-all ${
              cartTotalCount > 0
                ? 'bg-cyan text-navy shadow-xs animate-pulse'
                : 'bg-slate-700 text-slate-300'
            }`}>
              {cartTotalCount}
            </span>
          </button>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 transition-all duration-200 cursor-pointer active:scale-95"
        aria-label="Open WhatsApp Chat"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-emerald-600" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-white" />
        </div>
        <span className="font-bold text-xs sm:text-sm font-heading">WhatsApp Order</span>
        <span className="text-xs bg-emerald-700/80 px-2 py-0.5 rounded-full font-mono font-medium hidden md:inline">
          Live Chat
        </span>
      </button>
    </aside>
  );
};

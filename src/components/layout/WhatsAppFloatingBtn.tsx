'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { MessageCircle, X, Sparkles, Send, ShieldCheck } from 'lucide-react';

export const WhatsAppFloatingBtn: React.FC = () => {
  const { openWhatsAppInquiry, settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

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
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover Assistant */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">Creative Learning WhatsApp</h4>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping inline-block" />
                    Live Hardware Engineer Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-slate-50">
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
                  className="w-full text-left text-xs bg-white hover:bg-emerald-50 text-navy hover:text-emerald-700 font-medium py-2 px-3 rounded-lg border border-border hover:border-emerald-300 transition-colors shadow-2xs flex items-center justify-between"
                >
                  <span className="truncate">{topic}</span>
                  <span className="text-[10px] text-emerald-600 font-bold shrink-0 ml-1">Send →</span>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <form onSubmit={handleSendCustom} className="pt-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Type your component requirement..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 bg-white border border-border rounded-lg text-navy focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!customMsg.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="pt-1 text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Direct WhatsApp to {settings.whatsappNumber || '+91 9714045096'}
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 transition-all duration-200 cursor-pointer"
        aria-label="Open WhatsApp Chat"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-white" />
        </div>
        <span className="font-bold text-sm hidden sm:inline">WhatsApp Order</span>
        <span className="text-xs bg-emerald-700/80 px-2 py-0.5 rounded-full font-mono font-medium hidden md:inline">
          {settings.whatsappNumber || '+91 9714045096'}
        </span>
      </button>
    </aside>
  );
};

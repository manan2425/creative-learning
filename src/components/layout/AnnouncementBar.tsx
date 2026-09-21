'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { MessageSquare, Zap, ShieldCheck, PhoneCall } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings, openWhatsAppInquiry } = useStore();

  if (!settings.showAnnouncement) return null;

  return (
    <aside aria-label="Announcement" className="bg-navy text-white text-xs sm:text-sm py-2 px-4 border-b border-navy-light/40 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden text-center sm:text-left">
          <span className="inline-flex items-center gap-1 bg-cyan text-navy font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider shrink-0">
            <Zap className="w-3 h-3 fill-navy" /> Live STEM Lab
          </span>
          <p className="text-slate-200 truncate font-medium">
            {settings.announcementText || '⚡ Next-Day Dispatch on All Robotics Starter Kits & Genuine ICs!'}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs shrink-0">
          <button
            onClick={() => openWhatsAppInquiry('Bulk Lab Setup & Pricing')}
            className="flex items-center gap-1.5 text-cyan-300 hover:text-white transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp: <strong>{settings.whatsappNumber || '+91 9714045096'}</strong></span>
          </button>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="hidden md:flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-success" /> 100% Pre-Tested Hardware
          </span>
        </div>
      </div>
    </aside>
  );
};

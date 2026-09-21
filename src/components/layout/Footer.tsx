'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Bot, Cpu, MessageCircle, Phone, Mail, MapPin, Heart, ShieldCheck, Truck, Clock, Sliders } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, openWhatsAppInquiry } = useStore();

  const bio = settings.footerBio || 'Creative Learning is your premier robotics and electronics supplier, empowering students, makers, and universities with precision STEM kits and embedded components.';
  const address = settings.footerAddress || 'Electronics & Robotics Innovation Hub, Ahmedabad, Gujarat, India';
  const phone = settings.footerPhone || settings.whatsappNumber || '+91 9714045096';

  return (
    <footer className="bg-navy text-slate-300 border-t border-slate-800 relative overflow-hidden">
      {/* Background Circuit Grid Accent */}
      <div className="absolute inset-0 bg-circuit-grid opacity-10 pointer-events-none" />

      {/* Highlights Banner */}
      <div className="border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/30">
                <ShieldCheck className="w-6 h-6 text-cyan" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm font-heading">100% Pre-Tested ICs</h4>
                <p className="text-xs text-slate-400">Zero DOA hardware guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-xl bg-cyan/20 text-cyan flex items-center justify-center shrink-0 border border-cyan/30">
                <Truck className="w-6 h-6 text-cyan" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm font-heading">Same-Day Dispatch</h4>
                <p className="text-xs text-slate-400">Pan-India express delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm font-heading">WhatsApp Live Orders</h4>
                <p className="text-xs text-slate-400">Direct engineer consultation</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Cpu className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm font-heading">STEM Lab Packages</h4>
                <p className="text-xs text-slate-400">College &amp; School setups</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3.5 group inline-flex">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary via-blue-600 to-cyan flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300 border border-white/10">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-2xl text-white tracking-tight font-heading">
                    Creative<span className="text-cyan">Learning</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] uppercase font-mono font-bold tracking-wider rounded-md bg-cyan/20 text-cyan border border-cyan/40">
                    STEM • DIY
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Robotics Hardware &amp; Engineering Labs
                </p>
              </div>
            </Link>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm font-sans">
              {bio}
            </p>
            <div className="pt-2">
              <button
                onClick={() => openWhatsAppInquiry('Direct Inquiry via Footer')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-heading shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp: {settings.whatsappNumber || '+91 9714045096'}</span>
              </button>
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-primary pl-2.5 font-mono">
              Store Catalog
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#products" className="hover:text-cyan transition-colors">Microcontrollers &amp; ESP32</a></li>
              <li><a href="#products" className="hover:text-cyan transition-colors">Sensors &amp; Sonar Arrays</a></li>
              <li><a href="#products" className="hover:text-cyan transition-colors">Motor Drivers &amp; Steppers</a></li>
              <li><a href="#products" className="hover:text-cyan transition-colors">OLED &amp; Graphic Displays</a></li>
              <li><a href="#products" className="hover:text-cyan transition-colors">Power &amp; LiPo Converters</a></li>
              <li><a href="#kits" className="hover:text-cyan transition-colors">All Robotics Starter Kits</a></li>
            </ul>
          </div>

          {/* Practicals & Blueprints */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-cyan pl-2.5 font-mono">
              Labs &amp; Practicals
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#practical" className="hover:text-cyan transition-colors">Guided STEM Practicals</a></li>
              <li><a href="#practical" className="hover:text-cyan transition-colors">Wiring Schematics &amp; Pinouts</a></li>
              <li><a href="#projects" className="hover:text-cyan transition-colors">Engineering Blueprints</a></li>
              <li><a href="#inspiration" className="hover:text-cyan transition-colors">Pioneer Quotes</a></li>
              <li><a href="#why-us" className="hover:text-cyan transition-colors">Hardware Diagnostics</a></li>
            </ul>
          </div>

          {/* Contact & WhatsApp */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2.5 font-mono">
              Contact &amp; Hub
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">WhatsApp Hotline</span>
                  <a href={`https://wa.me/${(settings.whatsappNumber || '919714045096').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-white font-mono hover:text-emerald-400 font-bold">
                    {phone}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Support Email</span>
                  <span className="text-white font-mono">{settings.supportEmail || 'support@creativelearning.in'}</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Hardware Hub</span>
                  <span className="text-slate-300">{address}</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} {settings.storeName || 'Creative Learning'}. All Rights Reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Engineered for Makers &amp; STEM Learners</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 ml-1" />
          </div>
        </div>

      </div>
    </footer>
  );
};

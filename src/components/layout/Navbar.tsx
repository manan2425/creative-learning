'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { 
  Bot, 
  Cpu, 
  Layers, 
  Compass, 
  Wrench, 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  MessageCircle,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cart, setIsCartOpen, setIsSearchOpen, openWhatsAppInquiry, settings } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartTotalCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Hardware Store', href: '#products', icon: Cpu, badge: 'Components' },
    { name: 'Robotics Kits', href: '#kits', icon: Bot, badge: 'DIY' },
    { name: 'Guided Labs', href: '#practical', icon: Layers, badge: 'Code' },
    { name: 'Blueprints', href: '#projects', icon: Compass },
    { name: 'Why Us', href: '#why-us', icon: Wrench },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-200 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border' 
        : 'bg-white border-b border-border'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-cyan flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
              <Bot className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl text-navy tracking-tight font-heading">
                  Creative<span className="text-primary">Learning</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-cyan/15 text-cyan border border-cyan/30">
                  STEM
                </span>
              </div>
              <p className="text-[11px] text-secondary font-medium tracking-wide">
                Hardware Components • Robotics Kits • Practicals
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 mx-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold text-navy hover:text-primary hover:bg-slate-50 transition-all font-heading"
                >
                  <Icon className="w-4 h-4 text-secondary" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-500 border border-slate-200 uppercase font-mono">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-secondary bg-slate-50 hover:bg-slate-100 border border-border rounded-xl transition-colors cursor-pointer font-medium"
              title="Search components, kits, and codes"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline-block text-[10px] bg-white text-slate-400 font-mono px-1.5 py-0.5 rounded border border-border shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Quick WhatsApp Inquiry CTA */}
            <button
              onClick={() => openWhatsAppInquiry('Hardware Catalog & Custom Kit Inquiries')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors cursor-pointer font-heading shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
              <span>WhatsApp Us</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              id="cart-button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-sm shadow-primary/30 transition-all font-bold text-xs sm:text-sm font-heading cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartTotalCount > 0 ? (
                <span className="bg-cyan text-navy font-extrabold text-xs px-2 py-0.5 rounded-full font-mono shadow-xs">
                  {cartTotalCount}
                </span>
              ) : null}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-navy hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border shadow-xl px-4 pt-3 pb-6 animate-fade-in">
          <div className="grid grid-cols-1 gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-navy hover:bg-slate-50 hover:text-primary transition-colors font-heading"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-slate-100 text-secondary border border-border">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openWhatsAppInquiry('General WhatsApp Support');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-sm transition-colors cursor-pointer font-heading"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+91 9714045096)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


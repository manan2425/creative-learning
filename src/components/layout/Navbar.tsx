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
  Search, 
  Menu, 
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { setIsSearchOpen, categories } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('products');

  // Detect scroll state and active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);

      const sections = ['products', 'kits', 'practical', 'projects', 'why-us'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener for Search (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  const navLinks = [
    { id: 'products', name: 'Hardware Store', href: '#products', icon: Cpu, badge: 'Components' },
    { id: 'kits', name: 'Starter Kits', href: '#kits', icon: Bot, badge: 'DIY' },
    { id: 'practical', name: 'Guided Labs', href: '#practical', icon: Layers, badge: 'Code' },
    { id: 'projects', name: 'Blueprints', href: '#projects', icon: Compass, badge: 'BOM' },
    { id: 'why-us', name: 'Diagnostics', href: '#why-us', icon: Wrench },
  ];

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border/80 py-2.5' 
          : 'bg-white border-b border-border py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-primary via-blue-600 to-cyan flex items-center justify-center text-white shadow-md shadow-primary/25 group-hover:scale-105 transition-transform duration-300">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-navy tracking-tight font-heading">
                  Creative<span className="text-primary">Learning</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] uppercase font-mono font-bold tracking-wider rounded-md bg-cyan/15 text-navy border border-cyan/30">
                  STEM • DIY
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-secondary font-medium tracking-normal hidden xs:block">
                Robotics Hardware &amp; Engineering Labs
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links with Active State Indicator */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50/80 p-1 rounded-2xl border border-border/60">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;

              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all font-heading ${
                    isActive
                      ? 'bg-white text-primary shadow-xs border border-border/80'
                      : 'text-navy hover:text-primary hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded uppercase font-mono transition-colors ${
                      isActive 
                        ? 'bg-primary-light text-primary' 
                        : 'bg-slate-200/70 text-slate-500'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Cluster: Search & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Desktop Search Trigger Pill */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs text-secondary bg-slate-50 hover:bg-slate-100 hover:border-slate-300 border border-border rounded-xl transition-all cursor-pointer font-medium shadow-2xs group"
              title="Search components, kits, and codes (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
              <span className="hidden md:inline text-slate-500">Search components...</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 text-[9px] bg-white text-slate-400 font-mono px-1.5 py-0.5 rounded border border-border shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-navy hover:bg-slate-100 rounded-xl border border-border transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border shadow-xl px-4 pt-4 pb-6 animate-fade-in divide-y divide-border">
          
          {/* Mobile Search Quick Bar */}
          <div className="pb-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-secondary font-medium"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <span>Search components, kits, labs...</span>
              </div>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-border">Find</span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;

              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors font-heading ${
                    isActive
                      ? 'bg-primary-light text-primary font-extrabold'
                      : 'text-navy hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-500 border border-border uppercase font-mono">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>

          {/* Popular Categories Shortcut List */}
          {categories && categories.length > 1 && (
            <div className="pt-3 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Category Filters
              </span>
              <div className="flex flex-wrap gap-1.5">
                {categories.slice(0, 6).map((cat) => (
                  <a
                    key={cat}
                    href="#products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-medium bg-slate-50 hover:bg-primary-light hover:text-primary px-2.5 py-1 rounded-lg border border-border text-navy transition-colors"
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </header>
  );
};

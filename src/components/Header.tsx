'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { Menu, X, Phone, Mail } from 'lucide-react';

export default function Header() {
  const { catalog } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-ticker">
            <span className="topbar-ticker-badge">SYS_ONLINE 2026</span>
            <span>ROBOTICS & EMBEDDED BENCH</span>
            <span className="divider">•</span>
            <span>150+ VERIFIED MODULES & ICs</span>
            <span className="divider">•</span>
            <span>INSTANT WHATSAPP QUOTE</span>
          </div>

          <div className="top-contact">
            <a href={`tel:${catalog.company.phone}`} title="Call Direct">
              <Phone size={12} color="#00f0ff" />
              <span>{catalog.company.phone}</span>
            </a>
            <a href={`mailto:${catalog.company.email}`} title="Email Support">
              <Mail size={12} color="#00f0ff" />
              <span>{catalog.company.email}</span>
            </a>
          </div>
        </div>
      </div>

      <header className={`site-header ${scrolled ? 'scrolled' : ''}`} id="siteHeader">
        <div className="site-header-inner">
          <Link href="/" className="brand" aria-label="Creative Learning Home">
            <img src="/images/branding/creative-learning-logo.png" alt="Creative Learning Logo" />
            <div className="brand-text-block">
              <strong>{catalog.company.name.toUpperCase()}</strong>
              <span>[ ROBOTICS_LAB_V4.2 ]</span>
            </div>
          </Link>

          <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <Link href="#products" className="nav-item active" onClick={() => setMobileMenuOpen(false)}>
              Hardware Storefront
            </Link>
            <Link href="#kits" className="nav-item tab-link" onClick={() => setMobileMenuOpen(false)}>
              Robotics Starter Kits
            </Link>
            <Link href="#practical" className="nav-item tab-link" onClick={() => setMobileMenuOpen(false)}>
              Guided Labs & Experiments
            </Link>
            <Link href="#projects" className="nav-item tab-link" onClick={() => setMobileMenuOpen(false)}>
              Engineering Blueprints
            </Link>
            <Link href="#inspiration" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
              Inspiration & Quotes
            </Link>
            <Link href="#why-us" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
              Diagnostics & Why Us
            </Link>
          </nav>

          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
    </>
  );
}

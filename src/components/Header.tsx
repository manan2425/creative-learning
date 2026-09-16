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
        <div className="topbar-ticker">
          <span className="topbar-ticker-badge">SYS_ONLINE 2026</span>
          <span>ROBOTICS & EMBEDDED BENCH</span>
          <span className="divider">•</span>
          <span>150+ VERIFIED MODULES & ICs</span>
          <span className="divider">•</span>
          <span>INSTANT WHATSAPP QUOTE</span>
        </div>

        <div className="top-contact">
          <a href={`tel:${catalog.company.phone}`}>
            <Phone size={12} color="#00f0ff" />
            <span>{catalog.company.phone}</span>
          </a>
          <a href={`mailto:${catalog.company.email}`}>
            <Mail size={12} color="#00f0ff" />
            <span>{catalog.company.email}</span>
          </a>
        </div>
      </div>

      <header className={`site-header ${scrolled ? 'scrolled' : ''}`} id="siteHeader">
        <Link href="/" className="brand" aria-label="Creative Learning Home">
          <img src="/images/branding/creative-learning-logo.png" alt="Creative Learning Logo" />
          <div>
            <strong>{catalog.company.name.toUpperCase()}</strong>
            <span>[ ROBOTICS_LAB_V4.2 ]</span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className={mobileMenuOpen ? 'open' : ''}>
          <Link href="#products" className="active" onClick={() => setMobileMenuOpen(false)}>
            Hardware Storefront
          </Link>
          <Link href="#kits" className="tab-link" onClick={() => setMobileMenuOpen(false)}>
            Robotics Starter Kits
          </Link>
          <Link href="#practical" className="tab-link" onClick={() => setMobileMenuOpen(false)}>
            Guided Labs & Experiments
          </Link>
          <Link href="#projects" className="tab-link" onClick={() => setMobileMenuOpen(false)}>
            Engineering Blueprints
          </Link>
          <Link href="#inspiration" onClick={() => setMobileMenuOpen(false)}>
            Inspiration & Quotes
          </Link>
          <Link href="#why-us" onClick={() => setMobileMenuOpen(false)}>
            Diagnostics & Why Us
          </Link>
        </nav>
      </header>
    </>
  );
}

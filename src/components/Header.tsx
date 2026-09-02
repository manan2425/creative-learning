'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X, Mail } from 'lucide-react';

export default function Header() {
  const { catalog } = useData();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="topbar">
        <div>
          Authentic Components <span>•</span> Practical Learning <span>•</span> Project Support
        </div>
        <div className="top-contact">
          <a href={`tel:${catalog.company.phone}`}>
            📞 <span>{catalog.company.phone}</span>
          </a>
          <a href={`mailto:${catalog.company.email}`}>
            ✉️ <span>{catalog.company.email}</span>
          </a>
        </div>
      </div>

      <header className="site-header" id="siteHeader">
        <Link href="/" className="brand" aria-label="Creative Learning home">
          <img src="/images/branding/creative-learning-logo.png" alt="Creative Learning Logo" />
          <div>
            <strong>{catalog.company.name.toUpperCase()}</strong>
            <span>{catalog.company.tagline}</span>
          </div>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={mobileMenuOpen ? 'open' : ''}>
          <Link href="#home" className="active" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="#products" onClick={() => setMobileMenuOpen(false)}>
            Products
          </Link>
          <Link href="#kits" className="tab-link" onClick={() => setMobileMenuOpen(false)}>
            Kits
          </Link>
          <Link href="#practical" className="tab-link" onClick={() => setMobileMenuOpen(false)}>
            Practical
          </Link>
          <Link href="#projects" className="tab-link" onClick={() => setMobileMenuOpen(false)}>
            Projects
          </Link>
          <Link href="#inspiration" onClick={() => setMobileMenuOpen(false)}>
            Inspiration
          </Link>
          <Link href="#why-us" onClick={() => setMobileMenuOpen(false)}>
            Why Us
          </Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0872c9' }}>
            Admin Panel
          </Link>

          <button
            id="cartBtn"
            className="cart-button"
            onClick={() => {
              setIsCartOpen(true);
              setMobileMenuOpen(false);
            }}
          >
            <ShoppingBag size={17} />
            Cart <span>{totalItems}</span>
          </button>
        </nav>
      </header>
    </>
  );
}

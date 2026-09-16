'use client';

import React from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { Lock, Phone, Mail, MapPin, Sparkles, MessageCircle, ArrowUp, Terminal, Bot } from 'lucide-react';

export default function Footer() {
  const { catalog } = useData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/images/branding/creative-learning-logo.png" alt="Creative Learning" />
          <div>
            <strong>{catalog.company.name.toUpperCase()}</strong>
            <span>{catalog.company.tagline}</span>
          </div>
        </div>

        <div className="footer-links">
          <Link href="#products">Hardware</Link>
          <Link href="#kits">Robotics Kits</Link>
          <Link href="#practical">Guided Labs</Link>
          <Link href="#projects">Blueprints</Link>
          <Link href="#inspiration">Inspiration</Link>
          <Link href="#why-us">Diagnostics</Link>
          <Link
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: 'var(--cyan)',
              fontFamily: 'JetBrains Mono',
            }}
          >
            <Lock size={12} /> Admin Portal
          </Link>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          marginTop: '36px',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '12px',
          color: '#94a3b8',
          fontFamily: 'JetBrains Mono',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={13} color="var(--cyan)" /> {catalog.company.phone}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={13} color="var(--cyan)" /> {catalog.company.email}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={13} color="var(--cyan)" /> {catalog.company.address || 'Ahmedabad, Gujarat, India'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span>© {new Date().getFullYear()} {catalog.company.name}. ALL RIGHTS RESERVED.</span>
          <button
            type="button"
            onClick={scrollToTop}
            style={{
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid var(--cyan-border)',
              color: 'var(--cyan)',
              borderRadius: '6px',
              padding: '6px 12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontFamily: 'JetBrains Mono',
            }}
          >
            <ArrowUp size={12} /> TOP
          </button>
        </div>
      </div>
    </footer>
  );
}

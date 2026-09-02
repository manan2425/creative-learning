'use client';

import React from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { Lock } from 'lucide-react';

export default function Footer() {
  const { catalog } = useData();

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/images/branding/creative-learning-logo.png" alt="Creative Learning" />
          <div>
            <strong>{catalog.company.name}</strong>
            <span>{catalog.company.tagline}</span>
          </div>
        </div>

        <div className="footer-links">
          <Link href="#home">Home</Link>
          <Link href="#products">Products</Link>
          <Link href="#kits">Kits</Link>
          <Link href="#practical">Practicals</Link>
          <Link href="#projects">Projects</Link>
          <Link href="#inspiration">Inspiration</Link>
          <Link
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: '#38bdf8',
            }}
          >
            <Lock size={12} /> Admin Portal
          </Link>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          marginTop: '24px',
          paddingTop: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '11px',
          color: '#8395b5',
        }}
      >
        <div>
          {catalog.company.phone} • {catalog.company.email} • {catalog.company.address || 'Ahmedabad, India'}
        </div>
        <div>
          © {new Date().getFullYear()} {catalog.company.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

'use client';

import React from 'react';
import { useData } from '@/context/DataContext';
import { Clock, Award, CheckCircle2, FileText, ArrowUpRight } from 'lucide-react';

export default function PracticalSection() {
  const { catalog, setSelectedProduct } = useData();

  return (
    <section className="learning-page page-section" id="practical">
      <div className="section-head">
        <div>
          <p className="eyebrow">PRACTICAL EXPERIMENTS</p>
          <h2>Guided Hardware Labs</h2>
          <p>Clear, step-by-step lab exercises designed to build strong foundations in electronics.</p>
        </div>
      </div>

      <div className="practical-grid">
        {catalog.practicals.map((prac) => {
          const linkedProduct = catalog.products.find((p) => p.id === prac.product);
          const stepsArray = Array.isArray(prac.steps)
            ? prac.steps
            : typeof prac.steps === 'string'
            ? prac.steps.split(';').map((s) => s.trim())
            : [];

          const img =
            prac.images?.[0] ||
            linkedProduct?.images?.[0] ||
            linkedProduct?.image ||
            '/images/branding/creative-learning-logo.png';

          return (
            <article key={prac.key} className="practical-card">
              <img src={img.startsWith('/') ? img : `/${img}`} alt={prac.title} loading="lazy" />
              <div className="practical-body">
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <span
                    className="tag"
                    style={{
                      background: '#eef8fd',
                      color: '#0872c9',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Award size={12} /> {prac.level}
                  </span>
                  <span
                    className="tag"
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Clock size={12} /> {prac.time}
                  </span>
                </div>

                <h3>{prac.title}</h3>
                <p>
                  <b>Goal:</b> {prac.goal}
                </p>

                <div style={{ marginTop: 'auto' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#334155',
                      marginBottom: '6px',
                    }}
                  >
                    Step-by-step procedure:
                  </div>
                  <ul className="steps-list">
                    {stepsArray.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '16px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--line)',
                    }}
                  >
                    {linkedProduct && (
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => setSelectedProduct(linkedProduct)}
                        style={{ fontSize: '11px', padding: '8px 12px', width: '100%' }}
                      >
                        Board: {linkedProduct.name} <ArrowUpRight size={13} />
                      </button>
                    )}
                    {prac.pdf && (
                      <a
                        href={prac.pdf.startsWith('/') ? prac.pdf : `/${prac.pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="primary"
                        style={{
                          fontSize: '11px',
                          padding: '8px 12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <FileText size={13} /> Lab Sheet
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

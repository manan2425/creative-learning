'use client';

import React from 'react';
import { useData } from '@/context/DataContext';
import { Quote as QuoteIcon, Sparkles } from 'lucide-react';

export default function QuotesSection() {
  const { catalog } = useData();

  return (
    <section className="catalogue page-section" id="inspiration">
      <div className="section-head">
        <div>
          <p className="eyebrow">WORDS OF INSPIRATION</p>
          <h2>Ideas Worth Building</h2>
          <p>
            Insights and motivation from Creative Learning to empower students, educators, and
            innovators.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {catalog.quotes.map((q) => {
          const isHero = q.id === catalog.heroQuoteId;
          return (
            <div
              key={q.id}
              style={{
                background: isHero
                  ? 'linear-gradient(135deg, #07152f, #0c3870)'
                  : 'linear-gradient(135deg, #ffffff, #f7faff)',
                color: isHero ? '#fff' : 'var(--ink)',
                border: isHero ? '1px solid #1a4d8c' : '1px solid var(--line)',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: isHero ? 'var(--shadow-lg)' : '0 8px 24px rgba(7,21,47,0.04)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isHero && (
                <span
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '16px',
                    background: '#ff7b19',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 900,
                    padding: '4px 8px',
                    borderRadius: '999px',
                    letterSpacing: '0.08em',
                  }}
                >
                  FEATURED QUOTE
                </span>
              )}

              <div
                style={{
                  fontSize: '38px',
                  lineHeight: '1',
                  color: isHero ? '#0cc5e8' : '#0872c9',
                  opacity: 0.4,
                  marginBottom: '8px',
                  fontFamily: 'Space Grotesk',
                }}
              >
                “
              </div>

              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '1.5',
                  margin: '0 0 16px',
                  fontStyle: 'italic',
                }}
              >
                {q.text}
              </p>

              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: isHero ? '#8fe7ff' : '#64748b',
                }}
              >
                — {q.author}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

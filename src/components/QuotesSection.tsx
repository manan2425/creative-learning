'use client';

import React from 'react';
import { useData } from '@/context/DataContext';
import { Quote as QuoteIcon, Sparkles, Terminal } from 'lucide-react';

export default function QuotesSection() {
  const { catalog } = useData();

  return (
    <section className="catalogue page-section" id="inspiration">
      <div className="section-head">
        <div>
          <p className="eyebrow">
            <Terminal size={14} /> INSPIRATION // LOG
          </p>
          <h2>Makers & Engineering Vision</h2>
          <p>
            Insights and motivation from Creative Learning to empower students, robotics teams, and
            innovators to build what they imagine.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '24px',
          width: '100%',
        }}
      >
        {catalog.quotes.map((q) => {
          const isHero = q.id === catalog.heroQuoteId;
          return (
            <div
              key={q.id}
              style={{
                background: isHero
                  ? 'linear-gradient(145deg, #071026 0%, #0d1e47 100%)'
                  : 'rgba(8, 15, 34, 0.85)',
                color: '#ffffff',
                border: isHero
                  ? '1px solid var(--cyan)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '32px',
                boxShadow: isHero
                  ? '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 240, 255, 0.25)'
                  : 'var(--shadow-hud)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {isHero && (
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '18px',
                    background: 'rgba(0, 240, 255, 0.15)',
                    border: '1px solid var(--cyan-border)',
                    color: 'var(--cyan)',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '4px',
                    letterSpacing: '0.08em',
                    fontFamily: 'JetBrains Mono',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={11} /> FEATURED LOG
                </span>
              )}

              <div
                style={{
                  fontSize: '44px',
                  lineHeight: '1',
                  color: isHero ? '#00f0ff' : '#38bdf8',
                  opacity: isHero ? 0.9 : 0.4,
                  marginBottom: '10px',
                  fontFamily: 'Space Grotesk',
                  textShadow: isHero ? '0 0 15px #00f0ff' : 'none',
                }}
              >
                “
              </div>

              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '1.65',
                  margin: '0 0 20px',
                  fontStyle: 'italic',
                  color: '#e2e8f0',
                  flex: 1,
                }}
              >
                {q.text}
              </p>

              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--cyan)',
                  fontFamily: 'JetBrains Mono',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
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

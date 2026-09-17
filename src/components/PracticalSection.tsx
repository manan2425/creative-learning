'use client';

import React from 'react';
import { useData } from '@/context/DataContext';
import { Clock, Award, CheckCircle2, FileText, ArrowUpRight, Terminal, Cpu } from 'lucide-react';

export default function PracticalSection() {
  const { catalog, setSelectedProduct } = useData();

  const getLevelColor = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes('beginner') || l.includes('basic')) {
      return { bg: 'rgba(0, 240, 255, 0.1)', text: 'var(--cyan)', border: 'var(--cyan-border)' };
    }
    if (l.includes('inter') || l.includes('medium')) {
      return { bg: 'rgba(255, 123, 0, 0.12)', text: 'var(--orange)', border: 'rgba(255, 123, 0, 0.3)' };
    }
    return { bg: 'rgba(168, 85, 247, 0.12)', text: 'var(--purple)', border: 'rgba(168, 85, 247, 0.3)' };
  };

  return (
    <section className="learning-page page-section" id="practical">
      <div className="section-head">
        <div>
          <p className="eyebrow">
            <Terminal size={14} /> GUIDED LAB SCHEMATICS
          </p>
          <h2>Hands-on Robotics & Sensor Labs</h2>
          <p>
            Structured, step-by-step experiment modules designed for engineering colleges, robotics clubs,
            and self-paced innovators.
          </p>
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

          const levelStyle = getLevelColor(prac.level || 'Beginner');

          return (
            <article key={prac.key} className="practical-card">
              <img src={img.startsWith('/') ? img : `/${img}`} alt={prac.title} loading="lazy" />
              <div className="practical-body">
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span
                    className="tag"
                    style={{
                      background: levelStyle.bg,
                      color: levelStyle.text,
                      borderColor: levelStyle.border,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Award size={12} /> {prac.level.toUpperCase()}
                  </span>

                  <span
                    className="tag"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#cbd5e1',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
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
                  <strong style={{ color: 'var(--cyan)', fontFamily: 'var(--font-heading)', fontSize: '12.5px', letterSpacing: '0.04em' }}>
                    [ OBJECTIVE ]:
                  </strong>{' '}
                  {prac.goal}
                </p>

                <div style={{ marginTop: 'auto' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#cbd5e1',
                      marginBottom: '8px',
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Terminal size={13} color="var(--cyan)" /> CIRCUIT PROCEDURE:
                  </div>

                  <ul className="steps-list">
                    {stepsArray.map((step, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>&gt;</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px',
                      marginTop: '18px',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {linkedProduct && (
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => setSelectedProduct(linkedProduct)}
                        style={{ fontSize: '11.5px', padding: '10px 14px', width: '100%' }}
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
                          fontSize: '11.5px',
                          padding: '10px 14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <FileText size={14} /> Lab Sheet
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

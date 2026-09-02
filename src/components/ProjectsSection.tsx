'use client';

import React from 'react';
import { useData } from '@/context/DataContext';
import { Cpu, Lightbulb, Zap, FileText, ArrowUpRight } from 'lucide-react';

export default function ProjectsSection() {
  const { catalog, setSelectedProduct } = useData();

  return (
    <section className="learning-page page-section" id="projects" style={{ background: '#f8fafc' }}>
      <div className="section-head">
        <div>
          <p className="eyebrow">CAPSTONE PROTOTYPES</p>
          <h2>Real-World Robotics & IoT Projects</h2>
          <p>Complete project builds from circuit diagrams to working code and firmware.</p>
        </div>
      </div>

      <div className="project-grid">
        {catalog.projects.map((proj) => {
          const linkedProduct = catalog.products.find((p) => p.id === proj.product);
          const img =
            proj.images?.[0] ||
            linkedProduct?.images?.[0] ||
            linkedProduct?.image ||
            '/images/branding/creative-learning-logo.png';

          return (
            <article key={proj.key} className="project-card">
              <img src={img.startsWith('/') ? img : `/${img}`} alt={proj.title} loading="lazy" />
              <div className="project-body">
                <span
                  className="tag"
                  style={{
                    background: '#f0fdf4',
                    color: '#15803d',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Zap size={11} /> Project Guide
                </span>

                <h3>{proj.title}</h3>
                <p>{proj.summary}</p>

                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--line)',
                    borderRadius: '12px',
                    padding: '12px',
                    margin: '10px 0',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ color: '#0872c9', fontWeight: 800, marginBottom: '4px' }}>
                    📦 Required Kit / Hardware:
                  </div>
                  <div style={{ color: '#334155' }}>{proj.kit}</div>
                </div>

                <div style={{ fontSize: '11px', color: '#475569', margin: '8px 0' }}>
                  <b>💡 What you learn:</b> {proj.learn}
                </div>

                {proj.upgrade && (
                  <div style={{ fontSize: '11px', color: '#64748b', margin: '6px 0 16px' }}>
                    <b>🚀 Upgrade idea:</b> {proj.upgrade}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: 'auto',
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
                      View Board <ArrowUpRight size={13} />
                    </button>
                  )}
                  {proj.pdf && (
                    <a
                      href={proj.pdf.startsWith('/') ? proj.pdf : `/${proj.pdf}`}
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
                      <FileText size={13} /> Project PDF
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { useData } from '@/context/DataContext';
import { Cpu, Lightbulb, Zap, FileText, ArrowUpRight, Rocket, Bot } from 'lucide-react';

export default function ProjectsSection() {
  const { catalog, setSelectedProduct } = useData();

  return (
    <section className="learning-page page-section" id="projects">
      <div className="section-head">
        <div>
          <p className="eyebrow">
            <Rocket size={14} /> CAPSTONE PROTOTYPES // BLUEPRINTS
          </p>
          <h2>Robotics & IoT Engineering Blueprints</h2>
          <p>
            Complete end-to-end autonomous builds featuring circuit schematics, firmware code, and real-world
            actuation mechanisms.
          </p>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    className="tag"
                    style={{
                      background: 'rgba(0, 255, 157, 0.1)',
                      color: '#00ff9d',
                      borderColor: 'rgba(0, 255, 157, 0.3)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Zap size={12} /> BLUEPRINT
                  </span>
                </div>

                <h3>{proj.title}</h3>
                <p>{proj.summary}</p>

                <div
                  style={{
                    background: 'rgba(3, 7, 18, 0.7)',
                    border: '1px solid rgba(0, 240, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    margin: '12px 0',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono',
                  }}
                >
                  <div
                    style={{
                      color: 'var(--cyan)',
                      fontWeight: 700,
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Cpu size={13} /> // REQUIRED HARDWARE:
                  </div>
                  <div style={{ color: '#f1f5f9' }}>{proj.kit}</div>
                </div>

                <div
                  style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    margin: '6px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px',
                  }}
                >
                  <Lightbulb size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong style={{ color: '#ffffff' }}>What you learn:</strong> {proj.learn}
                  </span>
                </div>

                {proj.upgrade && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#cbd5e1',
                      margin: '6px 0 18px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '6px',
                    }}
                  >
                    <Rocket size={14} color="#a855f7" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>
                      <strong style={{ color: '#a855f7' }}>Upgrade Idea:</strong> {proj.upgrade}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginTop: 'auto',
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
                        fontSize: '11.5px',
                        padding: '10px 14px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <FileText size={14} /> Blueprint PDF
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

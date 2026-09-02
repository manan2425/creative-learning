'use client';

import React from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { ArrowRight, Sparkles, Cpu, Layers, Award } from 'lucide-react';

export default function Hero() {
  const { catalog } = useData();

  const activeQuote =
    catalog.quotes.find((q) => q.id === catalog.heroQuoteId) ||
    catalog.quotes[0] || {
      text: 'The future belongs to people who build what they imagine.',
      author: 'Creative Learning',
    };

  return (
    <section className="hero page-section" id="home">
      <div className="hero-copy">
        <div className="live-view-pill">
          <span className="live-dot"></span>
          <span>Live activity</span>
          <b id="liveViewCount">48+</b>
          <small>learners active now</small>
        </div>

        <p className="eyebrow">ELECTRONICS • ROBOTICS • INNOVATION</p>
        <h1>
          Learn it.
          <br />
          <span>Build it.</span>
          <br />
          Innovate it.
        </h1>

        <p className="hero-text">
          A modern learning destination for authentic components, practical experiments, and
          real-world robotics kits. Explore ideas, master the hardware, and turn curiosity into
          working prototypes.
        </p>

        <div className="hero-actions">
          <Link href="#projects" className="primary">
            Explore Projects <ArrowRight size={16} />
          </Link>
          <Link href="#practical" className="secondary">
            Start Practicals
          </Link>
        </div>

        <div className="hero-points">
          <div>
            <b>Hands-on Learning</b>
            <span>Understand by doing</span>
          </div>
          <div>
            <b>Real Components</b>
            <span>Build with authentic hardware</span>
          </div>
          <div>
            <b>Project Ready</b>
            <span>From idea to prototype</span>
          </div>
        </div>
      </div>

      <div className="hero-brand-showcase">
        <div className="hero-brand-panel">
          <span className="hero-brand-kicker">CREATIVE LEARNING SHOWCASE</span>
          <img
            src="/images/branding/creative-learning-hero-logo.png"
            alt="Creative Learning — Education can Transform a Nation"
          />
          <p style={{ color: '#bcd8f2', fontSize: '13px', margin: '8px 0 0' }}>
            {catalog.company.tagline}
          </p>

          <div className="hero-brand-quote">
            <p>“{activeQuote.text}”</p>
            <small>— {activeQuote.author}</small>
          </div>
        </div>
      </div>
    </section>
  );
}

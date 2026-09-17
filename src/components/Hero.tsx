'use client';

import React from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import {
  ArrowRight,
  Cpu,
  Layers,
  Award,
  Activity,
  Radio,
  Terminal,
  MessageCircle,
  Zap,
} from 'lucide-react';

export default function Hero() {
  const { catalog } = useData();

  const activeQuote =
    catalog.quotes.find((q) => q.id === catalog.heroQuoteId) ||
    catalog.quotes[0] || {
      text: 'The future belongs to people who build what they imagine.',
      author: 'Creative Learning',
    };

  const handleWhatsAppChat = () => {
    const rawPhone = catalog.company.whatsapp || catalog.company.phone || '919714045096';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const text = `Hello Creative Learning! I am interested in your Robotics kits, microcontrollers, sensors, and practical lab modules.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="hero page-section" id="home">
      <div className="hero-glow-orb-1" />
      <div className="hero-glow-orb-2" />

      <div className="hero-copy">
        <div className="live-view-pill">
          <span className="live-dot" />
          <span>ROBOTICS & EMBEDDED HUB</span>
          <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>//</span>
          <span><b>64+</b> WORKBENCHES ACTIVE</span>
        </div>

        <p className="eyebrow">AUTONOMOUS SYSTEMS • EMBEDDED HARDWARE • IOT BENCH</p>

        <h1>
          Engineer Next-Gen
          <br />
          <span className="cyan-text">Robotics & AI.</span>
          <br />
          <span className="gradient-text">Build the Future.</span>
        </h1>

        <p className="hero-text">
          The premier hardware destination for engineering students, robotics labs, and makers.
          Equipped with authentic microcontrollers, precision sensors, high-torque motor drivers,
          and step-by-step schematics from prototype to autonomous deployment.
        </p>

        {/* Live Robotics Hardware Telemetry Gauge */}
        <div className="hero-telemetry-strip">
          <div className="telemetry-item">
            <span>// CORE PROCESSORS</span>
            <b>ESP32-S3 • RP2040 • ARM</b>
          </div>
          <div className="telemetry-item">
            <span>// BUS PROTOCOLS</span>
            <b>I2C • SPI • UART • CAN</b>
          </div>
          <div className="telemetry-item">
            <span>// LOGIC COMPATIBILITY</span>
            <b>3.3V / 5.0V PWM READY</b>
          </div>
        </div>

        <div className="hero-actions">
          <Link href="#products" className="primary">
            Deploy Hardware <ArrowRight size={17} />
          </Link>
          <Link href="#practical" className="secondary">
            Robotics Labs
          </Link>
          <button
            type="button"
            onClick={handleWhatsAppChat}
            className="secondary"
            style={{
              color: '#00ff9d',
              borderColor: 'rgba(0, 255, 157, 0.3)',
              background: 'rgba(0, 255, 157, 0.08)',
            }}
          >
            <MessageCircle size={17} /> WhatsApp Tech Desk
          </button>
        </div>

        <div className="hero-points">
          <div className="hero-point-card">
            <div className="hero-point-icon">
              <Cpu size={18} />
            </div>
            <div>
              <b>100% Genuine Silicon</b>
              <span>Lab-verified ICs & Boards</span>
            </div>
          </div>

          <div className="hero-point-card">
            <div
              className="hero-point-icon"
              style={{
                background: 'rgba(255, 123, 0, 0.1)',
                color: '#ff7b00',
                borderColor: 'rgba(255, 123, 0, 0.25)',
              }}
            >
              <Activity size={18} />
            </div>
            <div>
              <b>Circuit Schematics</b>
              <span>Pinouts & step-by-step code</span>
            </div>
          </div>

          <div className="hero-point-card">
            <div
              className="hero-point-icon"
              style={{
                background: 'rgba(0, 255, 157, 0.1)',
                color: '#00ff9d',
                borderColor: 'rgba(0, 255, 157, 0.25)',
              }}
            >
              <Zap size={18} />
            </div>
            <div>
              <b>Prototype Ready</b>
              <span>Motors, Servos & IoT modules</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-brand-showcase">
        <div className="hero-brand-panel">
          <span className="hero-brand-kicker">
            <Radio size={13} /> ROBOTICS COMMAND TERMINAL
          </span>

          <img
            src="/images/branding/creative-learning-hero-logo.png"
            alt="Creative Learning — Robotics & Electronics Innovation"
          />

          <p style={{ color: '#38bdf8', fontSize: '14px', margin: '6px 0 0', fontWeight: 600, fontFamily: 'var(--font-heading)', letterSpacing: '0.02em' }}>
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

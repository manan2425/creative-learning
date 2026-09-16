import React from 'react';
import { ShieldCheck, Cpu, Zap, Radio, Terminal, Bot } from 'lucide-react';

export default function TrustStrip() {
  const diagnosticItems = [
    {
      icon: <ShieldCheck size={22} />,
      title: '01 // GENUINE SILICON',
      subtitle: '100% Original tested ICs',
      color: '#00f0ff',
      bg: 'rgba(0, 240, 255, 0.1)',
    },
    {
      icon: <Bot size={22} />,
      title: '02 // ROBOTICS READY',
      subtitle: 'Servos, Motors & Drivers',
      color: '#ff7b00',
      bg: 'rgba(255, 123, 0, 0.1)',
    },
    {
      icon: <Zap size={22} />,
      title: '03 // RAPID DISPATCH',
      subtitle: 'Secure ESD-Safe packaging',
      color: '#00ff9d',
      bg: 'rgba(0, 255, 157, 0.1)',
    },
    {
      icon: <Terminal size={22} />,
      title: '04 // SCHEMATICS & CODE',
      subtitle: 'Free wiring diagrams & code',
      color: '#a855f7',
      bg: 'rgba(168, 85, 247, 0.1)',
    },
    {
      icon: <Radio size={22} />,
      title: '05 // LAB MENTORSHIP',
      subtitle: 'Direct hardware support',
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.1)',
    },
  ];

  return (
    <section className="trust-strip" id="why-us">
      {diagnosticItems.map((item, idx) => (
        <div key={idx} className="trust-item">
          <div className="trust-icon-wrap" style={{ color: item.color, background: item.bg }}>
            {item.icon}
          </div>
          <b style={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}>{item.title}</b>
          <small>{item.subtitle}</small>
        </div>
      ))}
    </section>
  );
}

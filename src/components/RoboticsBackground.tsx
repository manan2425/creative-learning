'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  isHub?: boolean;
}

interface Spark {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

export default function RoboticsBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse coordinates for interactive repulsion / glow
    const mouse = { x: -1000, y: -1000, maxDist: 160 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Setup Robotics Circuit Nodes
    const particleCount = Math.min(Math.floor((width * height) / 16000), 55);
    const particles: Particle[] = [];
    const colors = ['#00f0ff', '#00d2ff', '#ff7b00', '#00ff9d', '#38bdf8'];

    for (let i = 0; i < particleCount; i++) {
      const isHub = i % 8 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: isHub ? 3.5 : Math.random() * 1.5 + 1.2,
        baseRadius: isHub ? 3.5 : 1.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        isHub,
      });
    }

    // Active sparks traveling across circuits
    const sparks: Spark[] = [];
    const maxSparks = 14;

    const spawnSpark = () => {
      if (sparks.length >= maxSparks || particles.length < 2) return;
      const fromNode = Math.floor(Math.random() * particles.length);
      // Find a close neighbor
      const neighbors: number[] = [];
      for (let j = 0; j < particles.length; j++) {
        if (fromNode === j) continue;
        const dx = particles[fromNode].x - particles[j].x;
        const dy = particles[fromNode].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          neighbors.push(j);
        }
      }

      if (neighbors.length > 0) {
        const toNode = neighbors[Math.floor(Math.random() * neighbors.length)];
        sparks.push({
          fromNode,
          toNode,
          progress: 0,
          speed: Math.random() * 0.015 + 0.008,
          color: Math.random() > 0.4 ? '#00f0ff' : '#ffaa00',
        });
      }
    };

    let sparkTimer = 0;

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Update and draw particles (Robotics circuit nodes)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce from edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.maxDist) {
          const force = (mouse.maxDist - dist) / mouse.maxDist;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.isHub ? 12 : 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw hub outer ring
        if (p.isHub) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // 2. Draw circuit traces between adjacent nodes
      const maxConnectDist = 170;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 3. Update & draw traveling data pulses/sparks
      sparkTimer++;
      if (sparkTimer % 20 === 0) {
        spawnSpark();
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.progress += s.speed;

        if (s.progress >= 1) {
          sparks.splice(i, 1);
          continue;
        }

        const p1 = particles[s.fromNode];
        const p2 = particles[s.toNode];
        if (!p1 || !p2) {
          sparks.splice(i, 1);
          continue;
        }

        const sparkX = p1.x + (p2.x - p1.x) * s.progress;
        const sparkY = p1.y + (p2.y - p1.y) * s.progress;

        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="robotics-bg-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="robotics-canvas" />
      {/* Laser Scanning Beam Line */}
      <div className="robotics-laser-scanner" />
      {/* Floating Robotics HUD Glyphs */}
      <div className="robotics-hud-grid">
        <div className="hud-corner-cross top-left">+</div>
        <div className="hud-corner-cross top-right">+</div>
        <div className="hud-corner-cross bottom-left">+</div>
        <div className="hud-corner-cross bottom-right">+</div>
        <div className="hud-floating-radar" />
        <div className="hud-telemetry-tag tag-1">[ 0x7F_BUS_ACTIVE ]</div>
        <div className="hud-telemetry-tag tag-2">[ SYS_CLK: 240MHz ]</div>
        <div className="hud-telemetry-tag tag-3">[ PWM_SERVO_CH: 16 ]</div>
      </div>
    </div>
  );
}

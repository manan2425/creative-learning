'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isHub: boolean;
}

interface DataPulse {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export function RoboticsBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let animationRunning = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse coordinates for gentle interaction
    const mouse = { x: -1000, y: -1000, maxDist: 140, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Subtle, light, elegant color palette for professional look
    const dotColors = [
      'rgba(2, 132, 199, 0.4)',   // Soft Cyan
      'rgba(56, 189, 248, 0.45)', // Light Sky Blue
      'rgba(37, 99, 235, 0.35)',  // Royal Blue
      'rgba(100, 116, 139, 0.3)', // Muted Slate
      'rgba(249, 115, 22, 0.35)', // Warm Amber
    ];

    // Minimal particle count (20-30 dots only, sparse and clean)
    const particleCount = Math.min(Math.max(Math.floor((width * height) / 38000), 18), 30);
    const particles: ParticleNode[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isHub = i % 8 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28, // very slow, calm drift
        vy: (Math.random() - 0.5) * 0.28,
        radius: isHub ? 2.8 : Math.random() * 0.8 + 1.4, // small micro-dots
        color: dotColors[Math.floor(Math.random() * dotColors.length)],
        isHub,
      });
    }

    // Occasional subtle data pulses
    const pulses: DataPulse[] = [];
    const maxPulses = 5;

    const spawnPulse = () => {
      if (pulses.length >= maxPulses || particles.length < 2) return;
      const fromIndex = Math.floor(Math.random() * particles.length);
      const neighbors: number[] = [];
      const connectDist = 140;

      for (let j = 0; j < particles.length; j++) {
        if (fromIndex === j) continue;
        const dx = particles[fromIndex].x - particles[j].x;
        const dy = particles[fromIndex].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectDist) {
          neighbors.push(j);
        }
      }

      if (neighbors.length > 0) {
        const toIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
        pulses.push({
          fromIndex,
          toIndex,
          progress: 0,
          speed: Math.random() * 0.012 + 0.006,
          color: 'rgba(2, 132, 199, 0.5)',
        });
      }
    };

    let frameCount = 0;

    // Main Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      frameCount++;

      // 1. Update particle positions with calm drifting
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Soft bounce from window edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Subtle, smooth mouse deflection
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxDist) {
            const force = (mouse.maxDist - dist) / mouse.maxDist;
            p.x -= (dx / dist) * force * 1.2;
            p.y -= (dy / dist) * force * 1.2;
          }
        }
      }

      // 2. Draw Subtle, Hairline Connecting Lines
      const maxConnectDist = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.14; // very light, faint line
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Faint mouse proximity line
        if (mouse.active) {
          const mdx = mouse.x - particles[i].x;
          const mdy = mouse.y - particles[i].y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140) {
            const mAlpha = (1 - mdist / 140) * 0.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(2, 132, 199, ${mAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 3. Draw Gentle Traveling Data Pulses
      if (frameCount % 45 === 0) {
        spawnPulse();
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        const p1 = particles[pulse.fromIndex];
        const p2 = particles[pulse.toIndex];
        if (!p1 || !p2) {
          pulses.splice(i, 1);
          continue;
        }

        const currentX = p1.x + (p2.x - p1.x) * pulse.progress;
        const currentY = p1.y + (p2.y - p1.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
        ctx.fillStyle = pulse.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(2, 132, 199, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Draw Clean Dots (Micro-Particles)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Subtle outer ring only for hub nodes
        if (p.isHub) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 3.5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(2, 132, 199, 0.2)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      if (animationRunning) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleVisibilityChange = () => {
      animationRunning = document.visibilityState === 'visible';
      if (animationRunning) render();
      else cancelAnimationFrame(animationFrameId);
    };

    render();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="robotics-bg-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="robotics-canvas" />
      {/* Light, subtle laser scanning beam */}
      <div className="robotics-laser-scanner opacity-20" />
      {/* Subtle corner crosshairs */}
      <div className="robotics-hud-grid opacity-40">
        <div className="hud-corner-cross top-left">+</div>
        <div className="hud-corner-cross top-right">+</div>
        <div className="hud-corner-cross bottom-left">+</div>
        <div className="hud-corner-cross bottom-right">+</div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, Cpu, X, Zap, Terminal } from 'lucide-react';

export default function HudToast() {
  const { toasts, dismissToast, setIsCartOpen } = useCart();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="hud-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="hud-toast-item" role="alert">
          <div className="hud-toast-glow" />

          {toast.image ? (
            <img
              src={toast.image.startsWith('http') || toast.image.startsWith('data:') || toast.image.startsWith('/') ? toast.image : `/${toast.image}`}
              alt=""
              className="hud-toast-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/branding/creative-learning-logo.png';
              }}
            />
          ) : (
            <div className="hud-toast-icon">
              <Zap size={18} color="var(--cyan)" />
            </div>
          )}

          <div className="hud-toast-content">
            <div className="hud-toast-title">
              <Terminal size={11} color="var(--cyan)" /> {toast.title}
            </div>
            <div className="hud-toast-msg">{toast.message}</div>
          </div>

          <button
            type="button"
            className="hud-toast-action"
            onClick={() => {
              dismissToast(toast.id);
              setIsCartOpen(true);
            }}
          >
            VIEW CART
          </button>

          <button
            type="button"
            className="hud-toast-close"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>

          <div className="hud-toast-bar" />
        </div>
      ))}
    </div>
  );
}

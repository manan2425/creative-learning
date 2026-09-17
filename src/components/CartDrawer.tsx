'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, MessageCircle, Mail, Terminal, Bot, Check, Sparkles, Loader2 } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    openWhatsAppOrder,
    openEmailOrder,
  } = useCart();

  const [dispatchingWhatsApp, setDispatchingWhatsApp] = useState(false);
  const [dispatchingEmail, setDispatchingEmail] = useState(false);

  const logCartOrder = (channel: string) => {
    try {
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cart_order_requisition',
          channel,
          totalItems,
          items: items.map(({ product, quantity }) => ({
            id: product.id,
            name: product.name,
            sku: product.sku || product.id,
            price: product.price || '',
            quantity,
          })),
        }),
      }).catch(() => {});
    } catch {}
  };

  const handleWhatsAppDispatch = () => {
    setDispatchingWhatsApp(true);
    logCartOrder('whatsapp');
    setTimeout(() => {
      openWhatsAppOrder();
      setDispatchingWhatsApp(false);
    }, 600);
  };

  const handleEmailDispatch = () => {
    setDispatchingEmail(true);
    logCartOrder('email');
    setTimeout(() => {
      openEmailOrder();
      setDispatchingEmail(false);
    }, 600);
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)} />
      <aside className="cart-drawer">
        <div className="drawer-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(0, 240, 255, 0.12)',
                color: 'var(--cyan)',
                border: '1px solid var(--cyan-border)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Terminal size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontFamily: 'var(--font-heading)' }}>
                Engineer&apos;s Cart
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--cyan)', fontFamily: 'var(--font-heading)', letterSpacing: '0.04em' }}>
                [ {totalItems} {totalItems === 1 ? 'MODULE' : 'MODULES'} QUEUED ]
              </span>
            </div>
          </div>
          <button
            type="button"
            className="close-btn"
            style={{ position: 'static' }}
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        <div className="cart-items">
          {items.length > 0 ? (
            items.map(({ product, quantity }) => {
              const img =
                product.images?.[0] || product.image || '/images/branding/creative-learning-logo.png';
              return (
                <div key={product.id} className="cart-row">
                  <img src={img.startsWith('/') ? img : `/${img}`} alt={product.name} />

                  <div>
                    <h4>{product.name}</h4>
                    <p>SKU: {product.sku || product.id}</p>
                    <div style={{ fontWeight: 800, color: 'var(--orange)', fontSize: '13px', marginTop: '3px', fontFamily: 'var(--font-heading)' }}>
                      {product.price || 'Contact for price'}
                    </div>

                    <div className="qty-controls">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    style={{
                      border: 0,
                      background: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '6px',
                      transition: 'color 0.2s',
                    }}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: '#64748b' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(0, 240, 255, 0.08)',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--cyan)',
                  border: '1px solid var(--cyan-border)',
                }}
              >
                <Bot size={32} />
              </div>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                Engineer&apos;s Cart is Empty
              </p>
              <small style={{ display: 'block', marginTop: '6px', fontSize: '12.5px', fontFamily: 'var(--font-primary)' }}>
                Add robotics modules, kits, or sensors to submit your hardware requisition.
              </small>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.04em',
              }}
            >
              <span>TOTAL HARDWARE UNITS:</span>
              <span style={{ color: 'var(--cyan)' }}>{totalItems} items</span>
            </div>

            <button
              type="button"
              className="primary full-btn"
              style={{
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                border: 0,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 0 25px rgba(37, 211, 102, 0.4)',
                opacity: dispatchingWhatsApp ? 0.8 : 1,
              }}
              onClick={handleWhatsAppDispatch}
              disabled={dispatchingWhatsApp}
            >
              {dispatchingWhatsApp ? (
                <>
                  <Loader2 size={18} className="spin-animation" /> TRANSMITTING REQUISITION...
                </>
              ) : (
                <>
                  <MessageCircle size={18} /> Order & Inquire via WhatsApp
                </>
              )}
            </button>

            <button
              type="button"
              className="secondary full-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onClick={handleEmailDispatch}
              disabled={dispatchingEmail}
            >
              {dispatchingEmail ? (
                <>
                  <Loader2 size={18} className="spin-animation" /> PREPARING EMAIL...
                </>
              ) : (
                <>
                  <Mail size={18} /> Inquire via Email
                </>
              )}
            </button>

            <button
              type="button"
              onClick={clearCart}
              style={{
                width: '100%',
                background: 'none',
                border: 0,
                color: '#64748b',
                fontSize: '11px',
                cursor: 'pointer',
                marginTop: '4px',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.04em',
              }}
            >
              [ CLEAR ENGINEER&apos;S CART ]
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

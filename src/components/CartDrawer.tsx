'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, MessageCircle, Mail, ShoppingBag } from 'lucide-react';

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

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)} />
      <aside className="cart-drawer">
        <div className="drawer-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#0872c9" />
            <h3 style={{ margin: 0 }}>Your Cart ({totalItems})</h3>
          </div>
          <button
            type="button"
            className="close-btn"
            style={{ position: 'static' }}
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={20} />
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
                    <div style={{ fontWeight: 800, color: 'var(--orange)', fontSize: '11px', marginTop: '2px' }}>
                      {product.price}
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
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '6px',
                    }}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Your cart is empty</p>
              <small>Add components or kits from the catalogue to start your inquiry.</small>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '14px',
                fontSize: '13px',
                fontWeight: 800,
              }}
            >
              <span>Total Items:</span>
              <span>{totalItems} items</span>
            </div>

            <button
              type="button"
              className="primary full-btn"
              style={{
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                border: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onClick={openWhatsAppOrder}
            >
              <MessageCircle size={18} /> Order / Inquire via WhatsApp
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
              onClick={openEmailOrder}
            >
              <Mail size={18} /> Inquire via Email
            </button>

            <button
              type="button"
              onClick={clearCart}
              style={{
                width: '100%',
                background: 'none',
                border: 0,
                color: '#94a3b8',
                fontSize: '11px',
                cursor: 'pointer',
                marginTop: '6px',
              }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

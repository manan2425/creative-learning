'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function FloatingCartTrigger() {
  const { totalItems, setIsCartOpen, cartBump } = useCart();

  return (
    <button
      type="button"
      className={`floating-cart-trigger ${cartBump ? 'bump' : ''} ${totalItems > 0 ? 'has-items' : ''}`}
      onClick={() => setIsCartOpen(true)}
      aria-label="Open Engineer's Cart"
      title="Open Engineer's Cart"
    >
      <div className="floating-cart-icon-wrap">
        <ShoppingBag size={20} />
        {totalItems > 0 && <span className="floating-cart-badge">{totalItems}</span>}
      </div>
      <div className="floating-cart-text">
        <span className="floating-cart-label">CART</span>
        <span className="floating-cart-count">{totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}</span>
      </div>
      <ArrowRight size={14} className="floating-cart-arrow" />
    </button>
  );
}

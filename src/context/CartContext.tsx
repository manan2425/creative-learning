'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';
import { useData } from './DataContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  openWhatsAppOrder: () => void;
  openEmailOrder: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { catalog } = useData();

  // Load cart from localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cl_cart_v2');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cl_cart_v2', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const buildOrderSummary = () => {
    let text = `Hello ${catalog.company.name},\nI would like to inquire/order the following items:\n\n`;
    items.forEach((item, index) => {
      text += `${index + 1}. ${item.product.name} (SKU: ${item.product.sku}) - Qty: ${item.quantity}\n`;
    });
    text += `\nPlease provide price and availability details. Thank you!`;
    return text;
  };

  const openWhatsAppOrder = () => {
    const rawPhone = catalog.company.whatsapp || catalog.company.phone || '919714045096';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(buildOrderSummary());
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const openEmailOrder = () => {
    const email = catalog.company.email || 'vhp10995@gmail.com';
    const subject = encodeURIComponent(`Product Inquiry - ${catalog.company.name}`);
    const body = encodeURIComponent(buildOrderSummary());
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        openWhatsAppOrder,
        openEmailOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

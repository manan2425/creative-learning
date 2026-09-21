'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  MessageCircle,
  Truck,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    setIsCheckoutOpen,
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    settings
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * couponDiscount);
  const freeShippingThreshold = settings.freeShippingThreshold || 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const deliveryFee = cart.length === 0 ? 0 : (isFreeShipping ? 0 : (settings.defaultDeliveryFee || 60));
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-navy/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-border">
          
          {/* Header */}
          <div className="p-5 bg-navy text-white flex items-center justify-between border-b border-navy-light">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary/30 flex items-center justify-center text-cyan border border-cyan/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Your Robotics Cart</h3>
                <p className="text-xs text-slate-300">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} in your kit bag
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="bg-primary-light px-5 py-2.5 border-b border-blue-100 text-xs">
              {isFreeShipping ? (
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>🎉 Free Express Shipping Unlocked!</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-secondary mb-1">
                    <span>Add <strong>₹{amountToFreeShipping}</strong> more for <strong>FREE Delivery</strong></span>
                    <span className="font-bold text-navy">{Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%</span>
                  </div>
                  <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <div>
                  <h4 className="font-bold text-navy text-lg">Your Cart is Empty</h4>
                  <p className="text-secondary text-sm mt-1 max-w-xs">
                    Explore our sensors, microcontrollers, and DIY robotics kits to start building!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-sm hover:bg-primary-hover transition-colors"
                >
                  Explore Storefront
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-xl border border-border bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="w-18 h-18 rounded-lg bg-white border border-border overflow-hidden shrink-0 relative flex items-center justify-center p-1">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80'} 
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-navy line-clamp-2 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-secondary">
                          SKU: {item.sku || 'IC-PART'}
                        </span>
                        {item.type === 'kit' && (
                          <span className="text-[10px] px-1.5 py-0.2 font-bold bg-cyan/15 text-cyan rounded">
                            Kit
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm font-extrabold text-navy font-mono">
                        ₹{item.price * item.quantity}
                        {item.quantity > 1 && (
                          <span className="text-[11px] text-secondary font-normal ml-1">
                            (₹{item.price} ea)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center border border-border bg-white rounded-lg shadow-2xs">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 text-secondary hover:text-navy transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold font-mono text-navy min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-100 text-secondary hover:text-navy transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-border bg-white space-y-4 shadow-lg">
              
              {/* Promo code box */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Tag className="w-3.5 h-3.5 text-success" />
                    <span>Coupon <strong>{appliedCoupon}</strong> Applied (-{couponDiscount * 100}%)</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-red-500 text-xs font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. ROBOTICS10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs uppercase font-mono bg-slate-50 border border-border rounded-lg text-navy focus:outline-hidden focus:border-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-navy transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-secondary border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-navy">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-success font-medium">
                    <span>Discount</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-mono font-medium text-navy">
                    {deliveryFee === 0 ? <span className="text-success font-bold">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-navy pt-2 border-t border-border">
                  <span>Total Amount</span>
                  <span className="text-base font-mono text-primary">₹{totalAmount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  id="checkout-whatsapp-btn"
                  onClick={handleProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/30 transition-all duration-200 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>Order via WhatsApp (+91 9714045096)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-success" /> Instant verification on WhatsApp
                  </span>
                  <button 
                    onClick={clearCart} 
                    className="hover:text-red-500 transition-colors cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

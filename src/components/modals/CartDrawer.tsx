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
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Package
} from 'lucide-react';

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

  const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * couponDiscount);
  const freeShippingThreshold = settings.freeShippingThreshold || 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const deliveryFee = cart.length === 0 ? 0 : (isFreeShipping ? 0 : (settings.defaultDeliveryFee || 60));
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const hasQuoteItems = cart.some((i) => i.hidePrice || !i.price || i.price === 0);

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
    <div className="fixed inset-0 z-[99] overflow-hidden animate-fade-in">
      {/* Dark Overlay Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-navy/80 backdrop-blur-xs transition-opacity cursor-pointer" 
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200 h-full transform transition-transform duration-300 ease-out">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-navy via-slate-900 to-navy text-white flex items-center justify-between border-b border-slate-800 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-circuit-grid opacity-10 pointer-events-none" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-cyan flex items-center justify-center text-white shadow-md shadow-primary/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg font-heading tracking-tight text-white">
                  Hardware Bag &amp; Order
                </h3>
                <p className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan inline-block animate-pulse" />
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} ({cart.length} unique)
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="relative z-10 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="bg-primary-light/50 px-4 sm:px-5 py-2.5 border-b border-blue-100 text-xs shrink-0">
              {isFreeShipping ? (
                <div className="flex items-center gap-2 text-primary font-bold">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>🎉 Free Express Shipping Unlocked!</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-secondary">
                    <span>Add <strong className="text-primary font-bold font-mono">₹{amountToFreeShipping}</strong> more for <strong>FREE Delivery</strong></span>
                    <span className="font-bold font-mono text-navy">{Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%</span>
                  </div>
                  <div className="w-full bg-blue-200/60 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-300 rounded-full"
                      style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shadow-xs">
                  <ShoppingBag className="w-10 h-10 stroke-1 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-navy font-heading text-lg">Your Cart is Empty</h4>
                  <p className="text-secondary text-xs max-w-xs mx-auto leading-relaxed">
                    Explore our silicon microcontrollers, sensor arrays, DIY starter kits, and practical experiment bundles.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    const el = document.getElementById('products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-xs font-heading shadow-xs hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  Browse Hardware Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const isQuoteItem = item.hidePrice || !item.price || item.price === 0;

                return (
                  <div 
                    key={item.id}
                    className="flex gap-3 sm:gap-3.5 pt-3 first:pt-0 group"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border border-border overflow-hidden shrink-0 relative flex items-center justify-center p-1">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80'} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-navy line-clamp-2 leading-snug font-heading group-hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.sku ? `SKU: ${item.sku}` : 'GENUINE PART'}
                          </span>
                          {item.type === 'kit' && (
                            <span className="text-[9px] px-1.5 py-0.2 font-bold bg-cyan/15 text-navy rounded font-mono">
                              Robotics Kit
                            </span>
                          )}
                          {item.type === 'bom_bundle' && (
                            <span className="text-[9px] px-1.5 py-0.2 font-bold bg-primary-light text-primary rounded font-mono">
                              BOM Part
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & Quantity Controls */}
                      <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100">
                        {isQuoteItem ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-heading">
                            <MessageCircle className="w-3 h-3 text-emerald-600" /> Price on Request
                          </span>
                        ) : (
                          <div className="text-sm sm:text-base font-extrabold text-navy font-mono">
                            ₹{item.price * item.quantity}
                            {item.quantity > 1 && (
                              <span className="text-[10px] text-slate-400 font-normal ml-1">
                                (₹{item.price} ea)
                              </span>
                            )}
                          </div>
                        )}

                        {/* Quantity Counter */}
                        <div className="flex items-center border border-border bg-slate-50 rounded-xl overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 hover:text-navy transition-colors cursor-pointer"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-extrabold font-mono text-navy min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 hover:text-navy transition-colors cursor-pointer"
                            title="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-border bg-slate-50/90 space-y-3.5 shadow-lg shrink-0">
              
              {/* Promo Coupon Code */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
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
                      placeholder="Coupon Code (e.g. ROBO10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase font-mono bg-white border border-border rounded-xl text-navy focus:outline-hidden focus:border-primary placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-navy text-white text-xs font-bold font-heading rounded-xl hover:bg-primary transition-colors cursor-pointer shadow-2xs"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-secondary bg-white p-3.5 rounded-2xl border border-border">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-mono font-bold text-navy">
                    ₹{subtotal}
                    {hasQuoteItems && (
                      <span className="text-[10px] text-emerald-700 ml-1 font-sans font-semibold">+ Custom Quote</span>
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-success font-medium">
                    <span>Coupon Discount</span>
                    <span className="font-mono font-bold">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping &amp; Delivery</span>
                  <span className="font-mono font-bold text-navy">
                    {deliveryFee === 0 ? <span className="text-success font-bold">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-navy pt-2 border-t border-slate-100">
                  <span>Total Amount Payable</span>
                  <span className="text-base font-mono text-primary font-extrabold">
                    ₹{totalAmount}
                    {hasQuoteItems && (
                      <span className="text-xs text-emerald-700 ml-1 font-sans font-semibold">(+ Custom Quote)</span>
                    )}
                  </span>
                </div>

                {hasQuoteItems && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 mt-2 font-medium leading-tight flex items-start gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Your order contains Price-on-Request item(s). Our team will provide the exact item quotation directly in your WhatsApp checkout chat.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  id="checkout-whatsapp-btn"
                  onClick={handleProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-sm font-heading shadow-md shadow-emerald-600/30 transition-all cursor-pointer group"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Proceed to WhatsApp Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1 text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Hotline: {settings.whatsappNumber || '+91 9714045096'}
                  </span>
                  <button 
                    onClick={clearCart} 
                    className="hover:text-red-500 transition-colors cursor-pointer text-[11px] font-medium"
                  >
                    Clear All
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

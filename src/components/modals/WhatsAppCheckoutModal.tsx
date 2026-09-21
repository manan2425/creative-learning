'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  X, 
  MessageCircle, 
  CheckCircle, 
  ShieldCheck, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  ArrowRight,
  PackageCheck,
  Zap,
  Sparkles
} from 'lucide-react';

export const WhatsAppCheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    clearCart,
    processWhatsAppCheckout, 
    appliedCoupon, 
    couponDiscount,
    settings,
    showToast
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'WhatsApp UPI' as 'WhatsApp UPI' | 'Cash on Delivery' | 'Bank Transfer / NEFT',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * couponDiscount);
  const deliveryFee = subtotal >= (settings.freeShippingThreshold || 999) ? 0 : (settings.defaultDeliveryFee || 60);
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      showToast('Missing Details', 'Please fill in your name, phone number, and delivery address.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const waUrl = await processWhatsAppCheckout({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerCity: formData.city || 'Local',
        customerPincode: formData.pincode || '380001',
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        items: cart,
        subtotal,
        discount: discountAmount,
        deliveryFee,
        totalAmount,
      });

      setGeneratedUrl(waUrl);
      setOrderComplete(true);
      
      // Open WhatsApp link immediately in new tab
      window.open(waUrl, '_blank');
      
      // Clear cart
      clearCart();
    } catch (err) {
      console.error(err);
      showToast('Checkout Error', 'Could not generate WhatsApp order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderComplete(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-navy text-white p-5 flex items-center justify-between border-b border-navy-light relative overflow-hidden">
          <div className="absolute inset-0 bg-circuit-grid opacity-10 pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-6 h-6 fill-emerald-500/20" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                {orderComplete ? 'Order Placed on WhatsApp!' : 'Quick WhatsApp Checkout'}
              </h3>
              <p className="text-xs text-slate-300">
                Direct Dispatch by Creative Learning • WhatsApp: {settings.whatsappNumber || '+91 9714045096'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {orderComplete ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-18 h-18 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-200">
              <CheckCircle className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h4 className="font-extrabold text-xl text-navy">Order Summary Sent to WhatsApp! 🚀</h4>
              <p className="text-sm text-secondary leading-relaxed">
                We have prepared your formatted order message and launched WhatsApp to chat directly with our engineering team at <strong>{settings.whatsappNumber || '+91 9714045096'}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-border text-left text-xs space-y-2 font-mono max-w-md mx-auto">
              <div className="flex justify-between text-secondary">
                <span>Customer:</span>
                <span className="text-navy font-bold">{formData.name} ({formData.phone})</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Delivery:</span>
                <span className="text-navy truncate max-w-[200px]">{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between text-secondary border-t border-border pt-2">
                <span>Total Amount:</span>
                <span className="text-primary font-bold text-sm">₹{totalAmount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Re-open WhatsApp Chat</span>
              </a>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-navy rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                Done / Browse More
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Quick Order Breakdown Banner */}
            <div className="bg-primary-light/60 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-navy">
                <PackageCheck className="w-5 h-5 text-primary shrink-0" />
                <span>Ordering <strong>{cart.length} unique components/kits</strong> ({cart.reduce((s, i) => s + i.quantity, 0)} total items)</span>
              </div>
              <div className="font-mono text-sm font-extrabold text-primary">
                Total: ₹{totalAmount}
                {cart.some(i => i.hidePrice || !i.price || i.price === 0) && (
                  <span className="text-xs text-emerald-700 ml-1 font-sans font-semibold">(+ Custom Quote)</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-secondary" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manan Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-sm text-navy focus:outline-hidden focus:border-primary focus:bg-white transition-all"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-secondary" />
                  WhatsApp Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-sm text-navy focus:outline-hidden focus:border-primary focus:bg-white transition-all"
                />
              </div>

              {/* Delivery Address */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-navy flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  Complete Delivery Address (House/Flat No, Street, Landmark) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. 402, Tech Heights, Near STEM Robotics Hub, Main Ring Road"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-sm text-navy focus:outline-hidden focus:border-primary focus:bg-white transition-all resize-none"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy">City / District</label>
                <input
                  type="text"
                  placeholder="e.g. Ahmedabad / Surat"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-sm text-navy focus:outline-hidden focus:border-primary focus:bg-white transition-all"
                />
              </div>

              {/* Pincode */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy">Pincode</label>
                <input
                  type="text"
                  placeholder="e.g. 380015"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-sm text-navy focus:outline-hidden focus:border-primary focus:bg-white transition-all"
                />
              </div>

              {/* Payment Method */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-navy flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-secondary" />
                  Preferred Payment Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {[
                    { id: 'WhatsApp UPI', label: '📱 WhatsApp UPI / QR', desc: 'Scan & Pay via GPay/PhonePe' },
                    { id: 'Cash on Delivery', label: '💵 Cash on Delivery', desc: 'Pay when delivered' },
                    { id: 'Bank Transfer / NEFT', label: '🏦 Bank NEFT/RTGS', desc: 'For institutional orders' },
                  ].map((mode) => (
                    <div
                      key={mode.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: mode.id as any })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.paymentMethod === mode.id
                          ? 'border-primary bg-primary-light/50 text-navy ring-1 ring-primary'
                          : 'border-border bg-slate-50 text-secondary hover:bg-white'
                      }`}
                    >
                      <div className="font-bold text-xs text-navy">{mode.label}</div>
                      <div className="text-[10px] text-secondary mt-0.5">{mode.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-navy">Special Instructions or Customizations (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Please pre-flash Obstacle Avoider code on Arduino Uno"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary focus:bg-white"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Opens WhatsApp immediately with order code
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-xs font-bold text-secondary hover:text-navy hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{isSubmitting ? 'Opening WhatsApp...' : 'Confirm Order on WhatsApp'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

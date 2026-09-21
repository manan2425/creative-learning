'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Settings, Save, ShieldAlert, Phone, Mail, Megaphone, Truck, RefreshCw } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, showToast, refreshData } = useStore();

  const [formData, setFormData] = useState({
    whatsappNumber: settings.whatsappNumber || '+919714045096',
    storeName: settings.storeName || 'Creative Learning - Robotics & Electronics',
    supportEmail: settings.supportEmail || 'support@creativelearning.in',
    announcementText: settings.announcementText || '⚡ Welcome to Creative Learning! WhatsApp Ordering: +91 9714045096',
    showAnnouncement: settings.showAnnouncement ?? true,
    freeShippingThreshold: settings.freeShippingThreshold || 999,
    defaultDeliveryFee: settings.defaultDeliveryFee || 60,
    upiId: settings.upiId || '9714045096@upi',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetCatalog = async () => {
    if (!confirm('Warning: This will clear all products, kits, practicals, and orders from MongoDB Atlas. Are you sure?')) return;
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const d = await res.json();
      if (d.success) {
        showToast('Database Reset', 'Collections cleared for custom client inventory.', 'success');
        refreshData();
      }
    } catch (e) {
      showToast('Error', 'Failed to reset database', 'error');
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-navy">Store &amp; WhatsApp Configuration</h2>
        <p className="text-xs text-secondary mt-0.5">
          Configure the client WhatsApp target number, store branding, announcement messages, and shipping rules.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 shadow-2xs space-y-6">
        
        {/* WhatsApp & Contact Section */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-navy uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            WhatsApp Orders &amp; Inquiries Integration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-navy">Client WhatsApp Mobile Number *</label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-mono font-bold text-navy focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              />
              <p className="text-[10px] text-slate-400">
                All checkout orders and product inquiries automatically route to this WhatsApp number.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-navy">UPI ID for Direct QR Payments</label>
              <input
                type="text"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy focus:outline-hidden focus:border-primary focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-navy">Store Business Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-navy">Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-extrabold text-sm text-navy uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Megaphone className="w-4 h-4 text-cyan" />
            Top Announcement Banner
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showAnnouncement"
                checked={formData.showAnnouncement}
                onChange={(e) => setFormData({ ...formData, showAnnouncement: e.target.checked })}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="showAnnouncement" className="text-xs font-bold text-navy cursor-pointer">
                Display top announcement marquee bar on storefront
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-navy">Announcement Text</label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Delivery & Shipping Rules */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-extrabold text-sm text-navy uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Truck className="w-4 h-4 text-primary" />
            Delivery &amp; Shipping Calculation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-navy">Free Delivery Order Threshold (₹)</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy focus:outline-hidden focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-navy">Standard Flat Delivery Fee (₹)</label>
              <input
                type="number"
                value={formData.defaultDeliveryFee}
                onChange={(e) => setFormData({ ...formData, defaultDeliveryFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy focus:outline-hidden focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-border flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>

      {/* Danger Zone */}
      <div className="bg-red-50/70 border border-red-200 rounded-2xl p-6 space-y-3">
        <h4 className="text-sm font-extrabold text-red-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          Database Management
        </h4>
        <p className="text-xs text-red-700 leading-relaxed">
          Reset all collections in MongoDB Atlas to start with a completely empty catalog for client data entry.
        </p>
        <button
          type="button"
          onClick={handleResetCatalog}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Reset / Clear MongoDB Collections
        </button>
      </div>

    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { X, Send, MessageCircle, Mail, Terminal, Bot } from 'lucide-react';

export default function InquiryModal() {
  const { inquiryProduct, setInquiryProduct, catalog } = useData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  if (!inquiryProduct) return null;

  const logInquiry = async (channel: string) => {
    try {
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'product_inquiry',
          channel,
          productId: inquiryProduct.id,
          productName: inquiryProduct.name,
          sku: inquiryProduct.sku || inquiryProduct.id,
          name: name || 'Customer',
          email: email || '',
          phone: phone || '',
          message: message || '',
        }),
      }).catch(() => {});
    } catch {}
  };

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    logInquiry('whatsapp');
    const rawPhone = catalog.company.whatsapp || catalog.company.phone || '919714045096';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const text = `Hello Creative Learning Robotics Team,\n\nI am inquiring about hardware module: ${inquiryProduct.name} (SKU: ${inquiryProduct.sku || inquiryProduct.id})\n\nName: ${name || 'Customer'}\nEmail: ${email || 'N/A'}\nPhone: ${phone || 'N/A'}\nMessage: ${message || 'Please provide quotation, pinout details, and delivery timeline.'}`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    setInquiryProduct(null);
  };

  const handleEmail = () => {
    logInquiry('email');
    const targetEmail = catalog.company.email || 'vhp10995@gmail.com';
    const subject = encodeURIComponent(`Robotics Hardware Inquiry: ${inquiryProduct.name}`);
    const body = encodeURIComponent(
      `Hello Creative Learning Team,\n\nI would like to inquire about ${inquiryProduct.name} (SKU: ${inquiryProduct.sku || inquiryProduct.id}).\n\nName: ${name || 'Customer'}\nContact: ${phone || 'N/A'}\nDetails: ${message || 'Please share module specifications and pricing.'}\n\nThank you!`
    );
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    setInquiryProduct(null);
  };

  return (
    <div className="modal-backdrop" onClick={() => setInquiryProduct(null)}>
      <div
        className="modal"
        style={{ maxWidth: '580px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-btn"
          onClick={() => setInquiryProduct(null)}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="tag">
            <Terminal size={12} /> HARDWARE INQUIRY // DESK
          </span>
        </div>

        <h3 style={{ margin: '4px 0 6px', fontSize: '24px', letterSpacing: '-0.02em', color: '#ffffff' }}>
          Inquire: {inquiryProduct.name}
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>
          Submit your requirements for <b>{inquiryProduct.name}</b> and our engineering team will respond with quotations and specs.
        </p>

        <form onSubmit={handleWhatsApp}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '6px',
                  color: 'var(--cyan)',
                  fontFamily: 'JetBrains Mono',
                }}
              >
                // YOUR FULL NAME
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  background: 'rgba(3, 7, 18, 0.9)',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontFamily: 'JetBrains Mono',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginBottom: '6px',
                    color: 'var(--cyan)',
                    fontFamily: 'JetBrains Mono',
                  }}
                >
                  // EMAIL
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    background: 'rgba(3, 7, 18, 0.9)',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontFamily: 'JetBrains Mono',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginBottom: '6px',
                    color: 'var(--cyan)',
                    fontFamily: 'JetBrains Mono',
                  }}
                >
                  // PHONE / WHATSAPP
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    background: 'rgba(3, 7, 18, 0.9)',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontFamily: 'JetBrains Mono',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '6px',
                  color: 'var(--cyan)',
                  fontFamily: 'JetBrains Mono',
                }}
              >
                // REQUIRED UNITS / SPECIFICATIONS
              </label>
              <textarea
                rows={3}
                placeholder="Enter required quantities, voltage levels, or school robotics lab requirements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  background: 'rgba(3, 7, 18, 0.9)',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontFamily: 'JetBrains Mono',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="submit"
              className="primary"
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                border: 0,
                color: '#ffffff',
                boxShadow: '0 0 25px rgba(37, 211, 102, 0.4)',
              }}
            >
              <MessageCircle size={17} /> Send via WhatsApp
            </button>

            <button
              type="button"
              className="secondary"
              style={{ flex: 1 }}
              onClick={handleEmail}
            >
              <Mail size={17} /> Send via Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

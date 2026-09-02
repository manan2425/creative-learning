'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { X, Send, MessageCircle, Mail } from 'lucide-react';

export default function InquiryModal() {
  const { inquiryProduct, setInquiryProduct, catalog } = useData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  if (!inquiryProduct) return null;

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const rawPhone = catalog.company.whatsapp || catalog.company.phone || '919714045096';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const text = `Hello Creative Learning,\n\nI am inquiring about: ${inquiryProduct.name} (SKU: ${inquiryProduct.sku || inquiryProduct.id})\n\nName: ${name || 'Customer'}\nEmail: ${email || 'N/A'}\nPhone: ${phone || 'N/A'}\nMessage: ${message || 'Please provide price and delivery timeline.'}`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    setInquiryProduct(null);
  };

  const handleEmail = () => {
    const targetEmail = catalog.company.email || 'vhp10995@gmail.com';
    const subject = encodeURIComponent(`Inquiry for ${inquiryProduct.name}`);
    const body = encodeURIComponent(
      `Hello Creative Learning Team,\n\nI would like to inquire about ${inquiryProduct.name} (SKU: ${inquiryProduct.sku || inquiryProduct.id}).\n\nName: ${name || 'Customer'}\nContact: ${phone || 'N/A'}\nDetails: ${message || 'Please share product details and quote.'}\n\nThank you!`
    );
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    setInquiryProduct(null);
  };

  return (
    <div className="modal-backdrop" onClick={() => setInquiryProduct(null)}>
      <div
        className="modal"
        style={{ maxWidth: '560px' }}
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

        <h3 style={{ margin: '0 0 4px', fontSize: '22px' }}>Inquire About Product</h3>
        <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '0 0 18px' }}>
          Interested in <b>{inquiryProduct.name}</b>? Send us a message and our team will get back
          to you immediately.
        </p>

        <form onSubmit={handleWhatsApp}>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--line)',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--line)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--line)',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>
                Message / Quantity
              </label>
              <textarea
                rows={3}
                placeholder="Enter required quantities, questions, or project specs..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--line)',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              className="primary"
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                borderColor: '#128C7E',
              }}
            >
              <MessageCircle size={16} /> Send via WhatsApp
            </button>

            <button
              type="button"
              className="secondary"
              style={{ flex: 1 }}
              onClick={handleEmail}
            >
              <Mail size={16} /> Send via Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

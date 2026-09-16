'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { MessageCircle, X, Send, Bot, CheckCircle2, Sparkles } from 'lucide-react';

export default function FloatingWhatsApp() {
  const { catalog } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const rawPhone = catalog.company.whatsapp || catalog.company.phone || '919714045096';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  const handleSendCustomMessage = (presetText?: string) => {
    const text = presetText || `Hello Creative Learning team! I am browsing your robotics hardware store and need assistance with components & quotation.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    setIsOpen(false);
  };

  const quickPrompts = [
    { label: '⚡ Request Fast Quote', text: 'Hello! I need a fast quotation for robotics modules & microcontroller kits.' },
    { label: '🤖 Custom Robotics Kit', text: 'Hello! I want to inquire about custom robotics kits for our college/institution.' },
    { label: '📦 Bulk Component Order', text: 'Hello! I would like to check stock availability and bulk pricing for hardware components.' },
  ];

  return (
    <div className="whatsapp-floating-container">
      {/* Interactive WhatsApp Quick Chat Box */}
      {isOpen && (
        <div className="whatsapp-popup-card">
          <div className="whatsapp-popup-header">
            <div className="whatsapp-agent-info">
              <div className="whatsapp-agent-avatar">
                <Bot size={20} />
                <span className="whatsapp-online-pulse" />
              </div>
              <div>
                <div className="whatsapp-agent-name">Creative Learning Support</div>
                <div className="whatsapp-agent-status">
                  <span className="whatsapp-online-dot" /> Typically replies within 5 mins
                </div>
              </div>
            </div>
            <button
              type="button"
              className="whatsapp-popup-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp chat"
            >
              <X size={16} />
            </button>
          </div>

          <div className="whatsapp-popup-body">
            <div className="whatsapp-bubble-msg">
              <p>
                👋 Welcome to <strong>Creative Learning Robotics</strong>!
              </p>
              <p style={{ marginTop: '4px' }}>
                How can we assist your embedded & hardware engineering project today?
              </p>
            </div>

            <div className="whatsapp-quick-prompts">
              <span className="whatsapp-quick-label">QUICK INQUIRY OPTIONS:</span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="whatsapp-prompt-chip"
                  onClick={() => handleSendCustomMessage(p.text)}
                >
                  <Sparkles size={11} color="#25D366" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="whatsapp-popup-footer">
            <button
              type="button"
              className="whatsapp-start-chat-btn"
              onClick={() => handleSendCustomMessage()}
            >
              <MessageCircle size={18} />
              <span>Direct WhatsApp Chat</span>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        className={`whatsapp-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={28} />}
        {!isOpen && <span className="whatsapp-status-badge" />}
      </button>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  X, 
  Layers, 
  Clock, 
  Copy, 
  Check, 
  ShoppingCart, 
  MessageCircle, 
  Cpu, 
  AlertTriangle, 
  HelpCircle,
  Code2,
  ListChecks
} from 'lucide-react';

export const PracticalDetailModal: React.FC = () => {
  const { 
    activePracticalModal, 
    setActivePracticalModal, 
    addToCart, 
    products, 
    openWhatsAppInquiry,
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'wiring' | 'code' | 'troubleshooting'>('wiring');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!activePracticalModal) return null;

  const lab = activePracticalModal;

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    showToast('Code Copied! 📋', 'Practical experiment code copied to clipboard.', 'success');
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleAddAllComponentsToCart = () => {
    let addedCount = 0;
    lab.requiredComponents?.forEach((comp) => {
      const matchedProd = products.find((p) => p.id === comp.productId || p.name.toLowerCase().includes((comp.name || '').toLowerCase()));
      if (matchedProd) {
        addToCart({
          id: matchedProd.id,
          type: 'product',
          name: matchedProd.name,
          price: matchedProd.price,
          image: matchedProd.image,
          sku: matchedProd.sku,
        }, comp.qty || 1);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      showToast('Lab Components Added! 🛒', `Added ${addedCount} components for ${lab.title} to your cart.`, 'success');
    } else {
      showToast('Custom Components', 'Please check individual component stocks in the Hardware Store.', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-border w-full max-w-4xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-navy text-white p-5 flex items-center justify-between border-b border-navy-light shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan/20 text-cyan border border-cyan/30 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-cyan text-navy">
                  {lab.level} Level
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan" /> {lab.durationMin} Minutes Lab
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-white mt-0.5">{lab.title}</h3>
            </div>
          </div>

          <button
            onClick={() => setActivePracticalModal(null)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('wiring')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer ${
              activeTab === 'wiring'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent text-secondary hover:text-navy'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Circuit Schematics & Components</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent text-secondary hover:text-navy'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Code Snippets ({lab.codeSnippets?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer ${
              activeTab === 'troubleshooting'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent text-secondary hover:text-navy'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Troubleshooting & Notes</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Lab Objective */}
          <div className="bg-primary-light/50 border border-blue-100 rounded-xl p-4 text-xs text-navy space-y-1">
            <span className="font-extrabold uppercase tracking-wider text-primary text-[10px] block">
              Learning Objective
            </span>
            <p className="leading-relaxed">{lab.objective}</p>
          </div>

          {/* TAB 1: WIRING & COMPONENTS */}
          {activeTab === 'wiring' && (
            <div className="space-y-6">
              {/* Components List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-navy flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-primary" />
                    Bill of Materials Required for this Lab
                  </h4>
                  <button
                    onClick={handleAddAllComponentsToCart}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add All Components to Cart</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {lab.requiredComponents?.map((comp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-slate-50 text-xs text-navy"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold">{comp.name}</span>
                      </div>
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-border text-secondary">
                        Qty: {comp.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wiring Connections Table */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-navy flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan" />
                  Pin-to-Pin Circuit Wiring Guide
                </h4>

                <div className="border border-border rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-12 bg-slate-100 font-bold text-navy px-4 py-2.5 text-[11px] uppercase tracking-wider border-b border-border">
                    <div className="col-span-4">Source Pin</div>
                    <div className="col-span-4">Target Pin</div>
                    <div className="col-span-4">Connection Wire / Note</div>
                  </div>
                  <div className="divide-y divide-border">
                    {lab.circuitWiring?.map((wire, idx) => (
                      <div key={idx} className="grid grid-cols-12 px-4 py-2.5 bg-white items-center">
                        <div className="col-span-4 font-mono font-bold text-navy">{wire.pinFrom}</div>
                        <div className="col-span-4 font-mono font-semibold text-primary">{wire.pinTo}</div>
                        <div className="col-span-4 text-secondary flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${wire.color || 'bg-slate-400'}`} />
                          <span className="text-[11px] truncate">{wire.note || 'Direct jumper wire'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CODE SNIPPETS */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              {lab.codeSnippets?.map((snippet, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-primary" />
                      {snippet.language} Source Code
                    </span>
                    <button
                      onClick={() => handleCopyCode(snippet.code, idx)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-navy text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-success" />
                          <span className="text-success">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="code-block p-4 overflow-x-auto max-h-96 text-xs leading-relaxed">
                    <pre>
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: TROUBLESHOOTING */}
          {activeTab === 'troubleshooting' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-navy flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Common Lab Mistakes & Hardware Fixes
              </h4>

              <div className="space-y-2.5">
                {lab.troubleshootingTips?.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 flex items-start gap-3 text-xs text-slate-800 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      !
                    </span>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-border p-4 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-navy">Need technical lab consultation?</h5>
                  <p className="text-secondary text-[11px]">Chat with our embedded systems engineer on WhatsApp.</p>
                </div>
                <button
                  onClick={() => openWhatsAppInquiry(`Lab Support for ${lab.title}`)}
                  className="px-3.5 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Help</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-slate-50 flex items-center justify-between shrink-0">
          <button
            onClick={() => setActivePracticalModal(null)}
            className="px-4 py-2 text-xs font-bold text-secondary hover:text-navy cursor-pointer"
          >
            Close Lab Guide
          </button>

          <button
            onClick={() => openWhatsAppInquiry(`Practical Kit Inquiry: ${lab.title}`)}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Order Complete Lab Hardware on WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
};

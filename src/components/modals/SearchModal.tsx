'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  X, 
  Search, 
  Cpu, 
  Bot, 
  Layers, 
  Compass, 
  ArrowRight,
  ShoppingCart,
  MessageCircle
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    products, 
    kits, 
    practicals, 
    projects,
    setActiveQuickViewProduct,
    setActivePracticalModal,
    addToCart
  } = useStore();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchedProducts = cleanQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery) ||
          p.sku.toLowerCase().includes(cleanQuery) ||
          p.shortDescription.toLowerCase().includes(cleanQuery)
      )
    : products.slice(0, 4);

  const matchedKits = cleanQuery
    ? kits.filter(
        (k) =>
          k.title.toLowerCase().includes(cleanQuery) ||
          k.subtitle.toLowerCase().includes(cleanQuery) ||
          k.difficulty.toLowerCase().includes(cleanQuery)
      )
    : kits.slice(0, 2);

  const matchedPracticals = cleanQuery
    ? practicals.filter(
        (pr) =>
          pr.title.toLowerCase().includes(cleanQuery) ||
          pr.topic.toLowerCase().includes(cleanQuery) ||
          pr.description.toLowerCase().includes(cleanQuery)
      )
    : practicals.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 sm:p-6 md:p-20 bg-navy/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-border flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search microcontrollers, sensors, robotics kits, labs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-navy text-sm font-medium focus:outline-hidden placeholder:text-slate-400"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-navy p-1 text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-slate-400 hover:text-navy p-1 rounded-lg border border-border bg-white text-xs px-2 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6 divide-y divide-border">
          
          {/* Products Results */}
          {matchedProducts.length > 0 && (
            <div className="space-y-2 pt-2 first:pt-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-primary" /> Electronics Components ({matchedProducts.length})
              </span>
              <div className="space-y-1.5">
                {matchedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActiveQuickViewProduct(prod);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-border">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-navy group-hover:text-primary transition-colors">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-secondary">
                          <span>{prod.category}</span>
                          <span>•</span>
                          <span className="font-mono">SKU: {prod.sku}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {prod.hidePrice || !prod.price ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-emerald-600" /> Price on Request
                        </span>
                      ) : (
                        <span className="text-xs font-bold font-mono text-navy">₹{prod.price}</span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            id: prod.id,
                            type: 'product',
                            name: prod.name,
                            price: prod.hidePrice ? 0 : prod.price,
                            hidePrice: Boolean(prod.hidePrice || !prod.price),
                            image: prod.image,
                            sku: prod.sku,
                          });
                        }}
                        className="p-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="Add to cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Starter Kits Results */}
          {matchedKits.length > 0 && (
            <div className="space-y-2 pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-cyan" /> Robotics Starter Kits ({matchedKits.length})
              </span>
              <div className="space-y-1.5">
                {matchedKits.map((kit) => (
                  <a
                    key={kit.id}
                    href="#kits"
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-border">
                        <img src={kit.image} alt={kit.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-navy group-hover:text-cyan transition-colors">
                          {kit.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-secondary">
                          <span className="bg-cyan/15 text-cyan px-1.5 rounded font-bold">{kit.difficulty}</span>
                          <span>•</span>
                          <span>{kit.ageRange}</span>
                        </div>
                      </div>
                    </div>
                    {kit.hidePrice || !kit.price ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        WhatsApp for Price
                      </span>
                    ) : (
                      <span className="text-xs font-bold font-mono text-navy">₹{kit.price}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Practicals Results */}
          {matchedPracticals.length > 0 && (
            <div className="space-y-2 pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" /> Guided Practicals & Code ({matchedPracticals.length})
              </span>
              <div className="space-y-1.5">
                {matchedPracticals.map((prac) => (
                  <div
                    key={prac.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActivePracticalModal(prac);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-border"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-navy group-hover:text-primary transition-colors">
                        {prac.title}
                      </h4>
                      <p className="text-[11px] text-secondary truncate max-w-md">{prac.topic}</p>
                    </div>
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      Open Lab <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedProducts.length === 0 && matchedKits.length === 0 && matchedPracticals.length === 0 && (
            <div className="p-8 text-center text-secondary text-xs">
              No components or kits matched &quot;{query}&quot;. Try searching for <strong>ESP32</strong>, <strong>Sensor</strong>, or <strong>Rover</strong>.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

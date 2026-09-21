'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  X, 
  ShoppingCart, 
  MessageCircle, 
  Check, 
  Star, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Activity,
  Plus,
  Minus,
  FileText
} from 'lucide-react';

export const ProductQuickViewModal: React.FC = () => {
  const { 
    activeQuickViewProduct, 
    setActiveQuickViewProduct, 
    addToCart, 
    openWhatsAppInquiry,
    settings 
  } = useStore();

  const [qty, setQty] = useState(1);

  if (!activeQuickViewProduct) return null;

  const product = activeQuickViewProduct;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      type: 'product',
      name: product.name,
      price: product.hidePrice ? 0 : product.price,
      hidePrice: Boolean(product.hidePrice || !product.price),
      image: product.image,
      sku: product.sku,
    }, qty);
    setActiveQuickViewProduct(null);
  };

  const handleWhatsAppInquiry = () => {
    openWhatsAppInquiry(
      `Product: ${product.name} (SKU: ${product.sku})`,
      `Price: ${product.hidePrice ? 'Price on Request' : `₹${product.price}`}, Voltage: ${product.voltage || 'N/A'}`,
      product.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-border w-full max-w-3xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded bg-cyan/20 text-cyan border border-cyan/40">
              {product.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
          </div>
          <button
            onClick={() => setActiveQuickViewProduct(null)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          
          {/* Left: Image & Quick Badges */}
          <div className="space-y-4">
            <div className="aspect-square bg-slate-50 border border-border rounded-xl overflow-hidden relative flex items-center justify-center p-4">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-bold text-navy border border-border flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <span>Tested & Verified</span>
              </div>
            </div>

            {/* Pinout & Specs Highlight */}
            {product.pinout && product.pinout.length > 0 && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-border">
                <h5 className="font-bold text-xs text-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-primary" /> Pinout Connections
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {product.pinout?.map((pin, idx) => (
                    <span key={idx} className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-border text-navy">
                      {pin}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Details & Buying Controls */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="font-extrabold text-lg sm:text-xl text-navy leading-snug">
                {product.name}
              </h3>

              {/* Rating & Stock */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating || 4.9}</span>
                  <span className="text-secondary font-normal">({product.reviewsCount || 48} reviews)</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-success font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({product.stockQuantity || 50} units)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 pt-1">
                {product.hidePrice || !product.price ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-extrabold font-heading">Price on Request (Contact on WhatsApp)</span>
                  </div>
                ) : (
                  <>
                    <span className="text-2xl font-extrabold text-navy font-mono">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through font-mono">
                        ₹{product.originalPrice}
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="text-xs font-bold text-success bg-emerald-50 px-2 py-0.5 rounded">
                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-secondary leading-relaxed">
                {product.description || product.shortDescription}
              </p>

              {/* Technical Specifications Table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="border border-border rounded-xl overflow-hidden text-xs">
                  <div className="bg-slate-100 px-3 py-1.5 font-bold text-navy text-[11px] uppercase tracking-wider">
                    Technical Specifications
                  </div>
                  <div className="divide-y divide-border">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between px-3 py-1.5 bg-white">
                        <span className="text-secondary">{key}</span>
                        <span className="font-semibold text-navy font-mono text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-border">
              
              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-navy">Quantity:</span>
                <div className="flex items-center border border-border bg-slate-50 rounded-lg">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-1.5 hover:bg-slate-200 text-navy transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold font-mono text-navy min-w-[32px] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="p-1.5 hover:bg-slate-200 text-navy transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-secondary">
                  Subtotal: <strong className="font-mono text-navy">
                    {product.hidePrice || !product.price ? 'Price on Request' : `₹${product.price * qty}`}
                  </strong>
                </span>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-md shadow-primary/20 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {product.hidePrice || !product.price ? 'Add to Cart (Quote Request)' : 'Add to Cart'}
                  </span>
                </button>

                <button
                  onClick={handleWhatsAppInquiry}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Inquiry</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

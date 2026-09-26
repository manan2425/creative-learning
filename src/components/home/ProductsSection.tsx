'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';
import { 
  Cpu, 
  ShoppingCart, 
  MessageCircle, 
  Eye, 
  Search, 
  Check, 
  Star, 
  SlidersHorizontal,
  Sparkles,
  Zap,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export const ProductsSection: React.FC = () => {
  const { 
    products, 
    categories,
    addToCart, 
    setActiveQuickViewProduct, 
    openWhatsAppInquiry 
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const activeCategories = categories && categories.length > 0 ? categories : ['All', 'Microcontrollers', 'Sensors', 'Motors & Drivers'];

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCategory = selectedCategory === 'All' || prod.category === selectedCategory;
      const matchSearch = 
        (prod.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prod.shortDescription || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prod.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <section id="products" className="py-10 sm:py-14 lg:py-20 bg-background border-b border-border relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-bold font-mono border border-blue-200">
              <Cpu className="w-3.5 h-3.5" />
              <span>HARDWARE STOREFRONT</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy font-heading tracking-tight">
              Electronics Components &amp; ICs
            </h2>
            <p className="text-xs sm:text-sm text-secondary max-w-xl font-sans">
              100% genuine, pre-tested microcontrollers, precision sensors, motor drivers, and power modules for robotics practicals.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs bg-white p-2.5 rounded-xl border border-border shadow-2xs self-start md:self-auto">
            <div className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-success" />
              <span>Pre-Tested Guarantee</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-blue-50 text-primary font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span>Pan-India Delivery</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-border shadow-2xs mb-8 space-y-3 sm:space-y-4 max-w-full overflow-hidden">
          
          {/* Top Row: Dynamic Categories Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {activeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold font-heading whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-50 text-secondary hover:bg-slate-100 hover:text-navy border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Bottom Row: Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-3 border-t border-slate-100">
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search component name, SKU, or specs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-border rounded-xl text-navy placeholder:text-slate-400 focus:outline-hidden focus:border-primary focus:bg-white transition-all"
              />
            </div>

            {/* Sort & Count */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
              <span className="text-secondary font-medium font-mono text-[11px]">
                Showing <strong>{filteredProducts.length}</strong> items
              </span>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-slate-50 border border-border rounded-xl px-3 py-2 text-navy font-semibold focus:outline-hidden focus:border-primary cursor-pointer font-sans"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

        </div>

        {/* Products Grid - 2 columns on mobile, 3-4 on larger screens */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border p-8 sm:p-12 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-primary mx-auto flex items-center justify-center">
              <Cpu className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-navy font-heading text-lg">
                {searchTerm || selectedCategory !== 'All' 
                  ? 'No Components Match Your Filter' 
                  : 'Hardware Catalog Arriving Soon'}
              </h4>
              <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
                {searchTerm || selectedCategory !== 'All' 
                  ? 'Try clearing your search query or switching categories. Need a specific microcontroller or IC? Chat directly with our engineers.' 
                  : 'Our high-precision robotics and microcontroller inventory is being updated. Inquire directly for immediate lab components and bulk availability.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {(searchTerm || selectedCategory !== 'All') && (
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => openWhatsAppInquiry(selectedCategory !== 'All' ? `Inquiry for ${selectedCategory} components` : 'General Hardware Inquiry')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-heading rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Inquire on WhatsApp Direct</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart({
                  id: product.id,
                  type: 'product',
                  name: product.name,
                  price: product.hidePrice ? 0 : product.price,
                  hidePrice: Boolean(product.hidePrice || !product.price),
                  image: product.image,
                  sku: product.sku,
                })}
                onQuickView={() => setActiveQuickViewProduct(product)}
                onWhatsApp={() => openWhatsAppInquiry(
                  `Product Inquiry: ${product.name}`,
                  `Price: ${product.hidePrice ? 'Price on Request' : `₹${product.price}`}, SKU: ${product.sku}`,
                  product.id
                )}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  onQuickView: () => void;
  onWhatsApp: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onWhatsApp
}) => {
  const isQuoteItem = product.hidePrice || !product.price;

  return (
    <div className="bg-card rounded-xl sm:rounded-2xl border border-border overflow-hidden shadow-2xs hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col justify-between group">
      
      <div>
        {/* Product Image Box */}
        <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges Overlay */}
          <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex flex-wrap gap-1 max-w-[85%]">
            <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold rounded sm:rounded-md bg-navy/90 text-white backdrop-blur-xs border border-slate-700 truncate max-w-full">
              {product.category}
            </span>
            {product.sku && (
              <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold rounded sm:rounded-md bg-cyan/90 text-navy truncate max-w-[120px]">
                {product.sku}
              </span>
            )}
            {product.images && product.images.length > 1 && (
              <span className="px-1 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold rounded sm:rounded-md bg-black/75 text-white backdrop-blur-xs flex items-center gap-0.5">
                📷 {product.images.length}
              </span>
            )}
            {product.pdfUrl && (
              <span className="px-1 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold rounded sm:rounded-md bg-red-600/90 text-white backdrop-blur-xs">
                PDF
              </span>
            )}
          </div>

          {/* Quick View & Specs Button Overlay */}
          <button
            onClick={onQuickView}
            className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 p-1 sm:px-2.5 sm:py-1.5 rounded-full bg-white/95 text-navy hover:text-primary hover:bg-white flex items-center gap-1 shadow-md transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer text-[10px] sm:text-xs font-bold font-heading"
            title="View Specifications & Pinouts"
            aria-label="View Specifications"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
            <span className="hidden sm:inline">Specs</span>
          </button>
        </div>

        {/* Product Details */}
        <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between text-[10px] sm:text-xs">
            <span className="text-[10px] sm:text-[11px] font-semibold text-primary font-sans truncate max-w-[65%]">
              {product.category || 'Hardware'}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500 font-bold shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[10px] sm:text-xs">{product.rating || 4.8}</span>
            </div>
          </div>

          <h3 
            onClick={onQuickView}
            className="font-bold font-heading text-xs sm:text-sm text-navy line-clamp-2 hover:text-primary transition-colors cursor-pointer leading-tight sm:leading-snug min-h-[2rem] sm:min-h-[2.5rem]"
            title={product.name}
          >
            {product.name}
          </h3>

          {product.shortDescription && (
            <p className="hidden sm:block text-xs text-secondary line-clamp-2 leading-relaxed font-sans">
              {product.shortDescription}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Price & Action Buttons */}
      <div className="p-2.5 sm:p-4 pt-0 space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 sm:pt-3">
          {isQuoteItem ? (
            <div className="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[10px] sm:text-xs font-extrabold font-heading">On Request</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-sm sm:text-lg font-extrabold font-mono text-navy">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through font-mono">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          )}

          {/* Quick Specs Eye Trigger (Desktop / Tablet) */}
          <button
            onClick={onQuickView}
            className="hidden sm:flex text-[11px] text-primary hover:text-primary-hover font-bold items-center gap-1 cursor-pointer transition-colors"
            title="View Specifications & Pinouts"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Specifications</span>
          </button>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <button
            onClick={onAddToCart}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold font-heading shadow-2xs transition-colors cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="sm:hidden font-semibold">Add</span>
            <span className="hidden sm:inline">Add to Cart</span>
          </button>

          <button
            onClick={onWhatsApp}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold font-heading transition-colors cursor-pointer"
            title="Ask on WhatsApp"
          >
            <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 fill-emerald-600/20 shrink-0" />
            <span className="sm:hidden font-semibold">Chat</span>
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>
      </div>

    </div>
  );
};


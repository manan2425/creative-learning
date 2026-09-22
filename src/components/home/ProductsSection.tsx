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
    <section id="products" className="py-14 lg:py-20 bg-background border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border p-8 sm:p-12 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-primary mx-auto flex items-center justify-center">
              <Cpu className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-navy font-heading text-lg">No Components Listed Yet</h4>
              <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
                Your database is clean. You can add components, microcontrollers, and sensors directly from the Admin Dashboard.
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold font-heading rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Components in Admin Panel</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xs hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col justify-between group">
      
      <div>
        {/* Product Image Box */}
        <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-navy/90 text-white backdrop-blur-xs border border-slate-700">
              {product.category}
            </span>
            {product.voltage && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-cyan/90 text-navy">
                {product.voltage}
              </span>
            )}
          </div>

          {/* Quick View Button Overlay */}
          <button
            onClick={onQuickView}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-navy hover:text-primary hover:bg-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Pinout & Specs Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-slate-400">
              {product.sku ? `SKU: ${product.sku}` : 'GENUINE SILICON'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
            </div>
          </div>

          <h3 
            onClick={onQuickView}
            className="font-bold font-heading text-sm text-navy line-clamp-2 hover:text-primary transition-colors cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          <p className="text-xs text-secondary line-clamp-2 leading-relaxed font-sans">
            {product.shortDescription}
          </p>
        </div>
      </div>

      {/* Bottom Price & Action Buttons */}
      <div className="p-4 pt-0 space-y-3">
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          {isQuoteItem ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-extrabold font-heading">Price on Request</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold font-mono text-navy">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          )}

          <span className="text-[10px] text-success font-bold flex items-center gap-1">
            <Check className="w-3 h-3" /> Ready to Ship
          </span>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onAddToCart}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold font-heading shadow-2xs transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={onWhatsApp}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer"
            title="Ask on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

    </div>
  );
};


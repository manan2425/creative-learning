'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  TrendingUp, 
  ShoppingCart, 
  Cpu, 
  Bot, 
  Layers, 
  MessageSquare, 
  AlertTriangle, 
  Plus, 
  ExternalLink,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface AdminOverviewProps {
  setCurrentTab: (tab: string) => void;
  orders: any[];
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ setCurrentTab, orders }) => {
  const { products, kits, practicals, projects, settings } = useStore();

  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
  const lowStockProducts = products.filter((p) => p.stockQuantity < 50);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-navy">Robotics Lab Command Center</h2>
          <p className="text-xs text-secondary mt-1">
            Real-time catalog inventory, WhatsApp orders, and STEM lab metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('products')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Component</span>
          </button>
          <button
            onClick={() => setCurrentTab('kits')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan text-navy rounded-xl text-xs font-bold hover:bg-cyan-hover shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Starter Kit</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-bold uppercase tracking-wider">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-navy">{products.length} Items</div>
          <div className="text-[11px] text-slate-500">Across 7 hardware categories</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-bold uppercase tracking-wider">Starter Kits</span>
            <div className="w-8 h-8 rounded-lg bg-cyan/15 text-cyan flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-navy">{kits.length} Kits</div>
          <div className="text-[11px] text-slate-500">Beginner, Inter &amp; Advanced</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-bold uppercase tracking-wider">WhatsApp Orders</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-navy">{orders.length} Logged</div>
          <div className="text-[11px] text-slate-500">Direct to {settings.whatsappNumber || '+91 9714045096'}</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-bold uppercase tracking-wider">Logged Inquiries Value</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-primary">₹{totalRevenue}</div>
          <div className="text-[11px] text-slate-500">Total gross order volume</div>
        </div>

      </div>

      {/* Grid: Recent WhatsApp Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent WhatsApp Orders */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-border shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-navy flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Recent WhatsApp Checkout Orders
            </h3>
            <button
              onClick={() => setCurrentTab('orders')}
              className="text-xs text-primary font-bold hover:underline cursor-pointer"
            >
              View All ({orders.length}) →
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center text-xs text-secondary bg-slate-50 rounded-xl border border-border">
              No WhatsApp orders received yet. When customers place orders through the storefront, they will be logged here with customer details and SKU breakdown.
            </div>
          ) : (
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden text-xs">
              {orders.slice(0, 5).map((order) => (
                <div key={order.orderId || order._id} className="p-3.5 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-navy">{order.orderId}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {order.status || 'New'}
                      </span>
                    </div>
                    <div className="text-secondary text-[11px] mt-0.5">
                      <strong>{order.customerName}</strong> ({order.customerPhone}) • {order.items?.length || 1} items
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-navy text-sm">₹{order.totalAmount}</div>
                    <a
                      href={`https://wa.me/${(order.customerPhone || '').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center gap-1 justify-end mt-0.5"
                    >
                      <span>Chat on WA</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Low Stock / IC Alerts */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-border shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-navy flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Inventory Stock Monitor
            </h3>
            <button
              onClick={() => setCurrentTab('products')}
              className="text-xs text-primary font-bold hover:underline cursor-pointer"
            >
              Manage Stock →
            </button>
          </div>

          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden text-xs">
            {products.slice(0, 5).map((prod) => (
              <div key={prod.id} className="p-3 bg-white flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-navy truncate">{prod.name}</div>
                  <div className="text-[10px] text-secondary font-mono">SKU: {prod.sku}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    prod.stockQuantity < 50
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    {prod.stockQuantity} in stock
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">₹{prod.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

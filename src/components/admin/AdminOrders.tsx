'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  MessageSquare, 
  Trash2, 
  ExternalLink, 
  Search, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Package, 
  Truck, 
  XCircle,
  CreditCard
} from 'lucide-react';

interface AdminOrdersProps {
  orders: any[];
  refreshOrders: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, refreshOrders }) => {
  const { showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = orders.filter((ord) => {
    const matchStatus = statusFilter === 'All' || ord.status === statusFilter;
    const matchSearch =
      (ord.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ord.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ord.customerPhone || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      showToast('Status Updated', `Order ${orderId} marked as ${newStatus}`, 'success');
      refreshOrders();
    } catch (e) {
      showToast('Update Failed', 'Could not update status', 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Delete order log ${orderId}?`)) return;
    try {
      await fetch(`/api/orders?orderId=${orderId}`, { method: 'DELETE' });
      showToast('Order Deleted', 'Order log removed', 'info');
      refreshOrders();
    } catch (e) {
      showToast('Delete Failed', 'Could not delete order', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-navy">WhatsApp Orders &amp; Inquiry Logs</h2>
          <p className="text-xs text-secondary mt-0.5">
            Track customers who checked out or submitted inquiries through WhatsApp.
          </p>
        </div>

        <button
          onClick={refreshOrders}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          ↻ Refresh Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Name, Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-border rounded-xl text-navy focus:outline-hidden focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-secondary font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-border rounded-xl px-3 py-2 text-navy font-semibold focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-navy text-base">No WhatsApp Orders Logged Yet</h4>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            When users add components/kits and click &quot;Order via WhatsApp&quot;, their orders appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const cleanPhone = (order.customerPhone || '').replace(/[^0-9]/g, '');
            return (
              <div
                key={order.orderId || order._id}
                className="bg-white rounded-2xl border border-border shadow-2xs p-5 space-y-4 hover:border-emerald-300 transition-colors"
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-mono font-bold text-xs">
                      WA
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-sm text-navy">{order.orderId}</span>
                        <span className="text-[10px] text-slate-400">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'}
                        </span>
                      </div>
                      <div className="text-xs text-secondary font-medium mt-0.5">
                        {order.customerName} • <span className="font-mono">{order.customerPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Amount */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">Total Value</span>
                      <span className="text-lg font-extrabold font-mono text-primary">₹{order.totalAmount}</span>
                    </div>

                    <select
                      value={order.status || 'New'}
                      onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                      className="text-xs bg-slate-50 border border-border rounded-xl px-3 py-1.5 font-bold text-navy focus:outline-hidden cursor-pointer"
                    >
                      <option value="New">🟢 New</option>
                      <option value="Contacted">💬 Contacted</option>
                      <option value="Packed">📦 Packed</option>
                      <option value="Shipped">🚚 Shipped</option>
                      <option value="Delivered">✅ Delivered</option>
                      <option value="Cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Delivery details */}
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-border">
                    <div className="font-bold text-navy flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      Delivery Address
                    </div>
                    <p className="text-secondary leading-relaxed">
                      {order.customerAddress}, {order.customerCity} - {order.customerPincode}
                    </p>
                    <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-secondary" />
                      <span>Payment: <strong>{order.paymentMethod || 'WhatsApp UPI'}</strong></span>
                    </div>
                    {order.notes && (
                      <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded mt-1 border border-amber-200">
                        <strong>Note:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Ordered Items List */}
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-border">
                    <div className="font-bold text-navy flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-cyan" />
                      Items Ordered ({order.items?.length || 0})
                    </div>
                    <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                      {order.items && order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-[11px] bg-white p-1.5 rounded border border-border">
                          <span className="truncate max-w-[200px] font-medium text-navy">{item.name}</span>
                          <span className="font-mono font-bold text-secondary">
                            x{item.quantity} (₹{item.price * item.quantity})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => handleDeleteOrder(order.orderId)}
                    className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>

                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${order.customerName}! 🤖 This is Creative Learning regarding your order ${order.orderId}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white" />
                    <span>Chat with Customer on WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

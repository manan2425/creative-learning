'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminProducts } from '@/components/admin/AdminProducts';
import { AdminCategories } from '@/components/admin/AdminCategories';
import { AdminKits } from '@/components/admin/AdminKits';
import { AdminPracticals } from '@/components/admin/AdminPracticals';
import { AdminProjects } from '@/components/admin/AdminProjects';
import { AdminContentCMS } from '@/components/admin/AdminContentCMS';
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { ToastContainer } from '@/components/common/ToastContainer';
import { useStore } from '@/context/StoreContext';
import { Bot, Menu, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useStore();

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const d = await res.json();
        if (d.data) setOrders(d.data);
      }
    } catch (e) {
      console.warn('Orders fetch error:', e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <ToastContainer />

      {/* Mobile Top Header */}
      <div className="md:hidden bg-navy text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/" className="flex items-center gap-2 text-white">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-cyan flex items-center justify-center text-white font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-xs font-heading">
            Creative<span className="text-cyan">Learning</span> Admin
          </span>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="p-2 text-slate-300 hover:text-cyan hover:bg-slate-800 rounded-xl transition-colors"
          title="View Live Store"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Admin Sidebar with Mobile Drawer support */}
      <AdminSidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        orderCount={orders.length}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Admin Content View */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-60px)] md:max-h-screen w-full max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto w-full">
          {currentTab === 'overview' && (
            <AdminOverview setCurrentTab={setCurrentTab} orders={orders} />
          )}

          {currentTab === 'products' && <AdminProducts />}

          {currentTab === 'categories' && <AdminCategories />}

          {currentTab === 'kits' && <AdminKits />}

          {currentTab === 'practicals' && <AdminPracticals />}

          {currentTab === 'projects' && <AdminProjects />}

          {currentTab === 'cms' && <AdminContentCMS />}

          {currentTab === 'orders' && (
            <AdminOrders orders={orders} refreshOrders={fetchOrders} />
          )}

          {currentTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Cpu, 
  Bot, 
  Layers, 
  Compass, 
  MessageSquare, 
  Settings, 
  ArrowLeft,
  Tag,
  FileEdit,
  X,
  Menu,
  Sparkles
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  orderCount: number;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  orderCount,
  isMobileOpen = false,
  setIsMobileOpen
}) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Inventory', icon: Cpu },
    { id: 'categories', label: 'Dynamic Categories', icon: Tag },
    { id: 'kits', label: 'Robotics Starter Kits', icon: Bot },
    { id: 'practicals', label: 'Guided Labs & Experiments', icon: Layers },
    { id: 'projects', label: 'Engineering Blueprints', icon: Compass },
    { id: 'cms', label: 'Website CMS & Text', icon: FileEdit },
    { id: 'orders', label: 'WhatsApp Orders & Logs', icon: MessageSquare, badge: orderCount > 0 ? orderCount : undefined },
    { id: 'settings', label: 'Store & WhatsApp Settings', icon: Settings },
  ];

  const handleSelectTab = (id: string) => {
    setCurrentTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-white">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-cyan flex items-center justify-center text-white font-bold shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white font-heading">
                Creative<span className="text-cyan">Learning</span>
              </div>
              <span className="text-[10px] text-cyan font-mono block">ADMIN CONTROL</span>
            </div>
          </Link>

          {/* Close Mobile Drawer */}
          {setIsMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-heading ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-cyan text-navy px-1.5 py-0.2 rounded-full text-[10px] font-extrabold font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Return Links */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 bg-navy text-white flex-col border-r border-slate-800 shrink-0 min-h-screen hidden md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-navy/80 backdrop-blur-xs animate-fade-in"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-navy text-white h-full shadow-2xl flex flex-col z-10 animate-slide-in-right">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

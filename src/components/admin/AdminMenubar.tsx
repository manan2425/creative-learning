'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { NavMenuItem } from '@/types';
import { INITIAL_MENU_ITEMS } from '@/data/initialData';
import { AVAILABLE_NAV_ICONS, getNavIcon } from '@/lib/navIcons';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Menu as MenuIcon,
  Sparkles,
  Link as LinkIcon,
  HelpCircle
} from 'lucide-react';

export const AdminMenubar: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();

  const currentItems: NavMenuItem[] = (settings.menuItems && settings.menuItems.length > 0)
    ? settings.menuItems
    : INITIAL_MENU_ITEMS;

  const [items, setItems] = useState<NavMenuItem[]>(currentItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavMenuItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<NavMenuItem>({
    id: '',
    name: '',
    href: '',
    icon: 'Cpu',
    isActive: true,
    isExternal: false,
  });

  // Sync state if store settings change externally
  React.useEffect(() => {
    if (settings.menuItems && settings.menuItems.length > 0) {
      setItems(settings.menuItems);
    }
  }, [settings.menuItems]);

  const saveMenuItems = async (newItems: NavMenuItem[]) => {
    setItems(newItems);
    await updateSettings({ menuItems: newItems });
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: 'menu-' + Date.now(),
      name: '',
      href: '#',
      icon: 'Cpu',
      isActive: true,
      isExternal: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NavMenuItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (items.length <= 1) {
      showToast('Cannot Delete', 'You must have at least one menu item in the menubar.', 'warning');
      return;
    }
    const filtered = items.filter(i => i.id !== id);
    await saveMenuItems(filtered);
    showToast('Menu Item Deleted', 'Menubar link removed.', 'info');
  };

  const handleToggleActive = async (id: string) => {
    const updated = items.map(i => {
      if (i.id === id) {
        return { ...i, isActive: i.isActive === false ? true : false };
      }
      return i;
    });
    await saveMenuItems(updated);
    showToast('Visibility Updated', 'Menubar visibility changed.', 'success');
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    await saveMenuItems(newItems);
  };

  const handleMoveDown = async (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    await saveMenuItems(newItems);
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset the menubar navigation to the original 5 default links?')) {
      await saveMenuItems(INITIAL_MENU_ITEMS);
      showToast('Menubar Reset', 'Restored default navigation links.', 'success');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Validation Error', 'Menu Item Name is required.', 'warning');
      return;
    }
    if (!formData.href.trim()) {
      showToast('Validation Error', 'Target Link / URL is required.', 'warning');
      return;
    }

    let updatedList: NavMenuItem[];
    if (editingItem) {
      updatedList = items.map(i => (i.id === editingItem.id ? { ...formData } : i));
      showToast('Item Updated', `Updated "${formData.name}" in menubar.`, 'success');
    } else {
      updatedList = [...items, { ...formData, id: 'menu-' + Date.now() }];
      showToast('Item Added', `Added "${formData.name}" to menubar.`, 'success');
    }

    await saveMenuItems(updatedList);
    setIsModalOpen(false);
  };

  const quickLinks = [
    { label: 'Products Section', href: '#products', icon: 'Cpu' },
    { label: 'Starter Kits Section', href: '#kits', icon: 'Bot' },
    { label: 'Guided Labs Section', href: '#practical', icon: 'Layers' },
    { label: 'Blueprints Section', href: '#projects', icon: 'Compass' },
    { label: 'Diagnostics Section', href: '#why-us', icon: 'Wrench' },
    { label: 'Footer Contact', href: '#footer', icon: 'Phone' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary-light text-primary">
              <MenuIcon className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-extrabold text-navy font-heading">Menubar &amp; Header Navigation</h2>
          </div>
          <p className="text-xs text-secondary mt-1">
            Add, update, reorder, or remove navigation links displayed in the website header and mobile drawer.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer border border-border"
            title="Restore original default navigation items"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Live Navigation Bar Simulation */}
      <div className="bg-white rounded-2xl border border-border p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Live Storefront Menubar Preview
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Active items: {items.filter(i => i.isActive !== false).length} of {items.length}
          </span>
        </div>

        <div className="bg-slate-50/90 p-2 sm:p-3 rounded-xl border border-border flex items-center gap-2 overflow-x-auto">
          <div className="font-extrabold text-xs text-navy px-3 py-1.5 bg-white border border-border rounded-lg shadow-2xs shrink-0">
            Creative Learning
          </div>
          <div className="h-4 w-px bg-slate-300 mx-1 shrink-0" />
          <div className="flex items-center gap-1.5 shrink-0">
            {items.map((item) => {
              const Icon = getNavIcon(item.icon);
              const isHidden = item.isActive === false;

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    isHidden
                      ? 'bg-slate-100 text-slate-400 border-dashed border-slate-300 opacity-60 line-through'
                      : 'bg-white text-navy border-border shadow-2xs'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isHidden ? 'text-slate-400' : 'text-primary'}`} />
                  <span>{item.name}</span>
                  {item.isExternal && <ExternalLink className="w-2.5 h-2.5 text-slate-400" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Items List Table / Cards */}
      <div className="bg-white rounded-2xl border border-border shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-border bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-navy uppercase tracking-wider">
            Navigation Menu Items ({items.length})
          </span>
          <span className="text-[11px] text-secondary">
            Use arrows to reorder items from left to right
          </span>
        </div>

        <div className="divide-y divide-border">
          {items.map((item, index) => {
            const Icon = getNavIcon(item.icon);
            const isHidden = item.isActive === false;

            return (
              <div 
                key={item.id} 
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isHidden ? 'bg-slate-50/50 opacity-75' : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Item Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 rounded transition-colors"
                      title="Move Left / Earlier"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === items.length - 1}
                      className="p-1 text-slate-400 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 rounded transition-colors"
                      title="Move Right / Later"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-border flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm text-navy ${isHidden ? 'line-through text-slate-400' : ''}`}>
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-border">
                        Position #{index + 1}
                      </span>
                      {isHidden && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Hidden
                        </span>
                      )}
                      {item.isExternal && (
                        <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200 flex items-center gap-1">
                          <ExternalLink className="w-2.5 h-2.5" /> New Tab
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-secondary font-mono truncate mt-0.5">
                      Target: <span className="text-primary font-semibold">{item.href}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleActive(item.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                      isHidden
                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title={isHidden ? 'Click to Show in Menubar' : 'Click to Hide from Menubar'}
                  >
                    {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-navy hover:text-primary hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-border"
                    title="Edit Menu Item"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-red-200"
                    title="Delete Menu Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-navy/80 backdrop-blur-xs animate-fade-in">
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-navy text-white p-5 flex items-center justify-between border-b border-navy-light">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white/10 text-cyan">
                  <MenuIcon className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-base sm:text-lg font-heading">
                  {editingItem ? 'Edit Menubar Item' : 'Add New Menubar Item'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-navy mb-1">
                  Menu Item Label / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Products, Guided Labs, Workshops"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-sm text-navy focus:outline-hidden focus:border-primary focus:bg-white transition-all"
                />
              </div>

              {/* Target Link / Href */}
              <div>
                <label className="block text-xs font-bold text-navy mb-1">
                  Target Link (Anchor or URL) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. #products, #practical, /catalog, or https://..."
                  value={formData.href}
                  onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-sm font-mono text-navy focus:outline-hidden focus:border-primary focus:bg-white transition-all"
                />

                {/* Quick Link Presets */}
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] text-slate-400 font-semibold block">Quick section presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickLinks.map((ql) => (
                      <button
                        key={ql.href}
                        type="button"
                        onClick={() => setFormData({ ...formData, href: ql.href, icon: ql.icon })}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          formData.href === ql.href
                            ? 'bg-primary text-white border-primary'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-border'
                        }`}
                      >
                        {ql.label} ({ql.href})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-bold text-navy mb-1.5 flex items-center justify-between">
                  <span>Select Menu Icon</span>
                  <span className="text-[11px] text-primary font-mono font-bold">
                    Selected: {formData.icon || 'Cpu'}
                  </span>
                </label>
                
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-44 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-border">
                  {AVAILABLE_NAV_ICONS.map((iconItem) => {
                    const IconComp = iconItem.icon;
                    const isSelected = formData.icon === iconItem.id;

                    return (
                      <button
                        key={iconItem.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: iconItem.id })}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs scale-105'
                            : 'bg-white hover:bg-slate-100 text-navy border-border'
                        }`}
                        title={iconItem.label}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="text-[9px] font-medium truncate w-full">
                          {iconItem.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 bg-slate-50 border border-border rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span className="text-xs font-bold text-navy">Visible in Menubar</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-50 border border-border rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isExternal)}
                    onChange={(e) => setFormData({ ...formData, isExternal: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span className="text-xs font-bold text-navy">Open in New Tab</span>
                </label>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingItem ? 'Update Menu Item' : 'Add to Menubar'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

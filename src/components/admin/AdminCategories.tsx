'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  Save, 
  X, 
  Check, 
  Tag, 
  FolderTree,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory, updateCategories, products, showToast } = useStore();

  const [newCatInput, setNewCatInput] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;

    setIsSubmitting(true);
    try {
      const ok = await addCategory(newCatInput.trim());
      if (ok) setNewCatInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (cat: string) => {
    if (cat.toLowerCase() === 'all') {
      showToast('Notice', 'Default "All" category cannot be renamed.', 'info');
      return;
    }
    setEditingCat(cat);
    setEditValue(cat);
  };

  const handleSaveEdit = async () => {
    if (!editingCat || !editValue.trim()) return;
    if (editValue.trim().toLowerCase() === editingCat.toLowerCase()) {
      setEditingCat(null);
      return;
    }

    const updated = categories.map((c) => (c === editingCat ? editValue.trim() : c));
    await updateCategories(updated);
    setEditingCat(null);
  };

  const handleDelete = async (cat: string) => {
    const count = products.filter((p) => p.category === cat).length;
    let msg = `Are you sure you want to delete category "${cat}"?`;
    if (count > 0) {
      msg = `Category "${cat}" currently has ${count} product(s) assigned. Deleting it will remove the filter tab on the storefront. Continue?`;
    }

    if (confirm(msg)) {
      await deleteCategory(cat);
    }
  };

  // Quick category suggestions
  const SUGGESTED_CATEGORIES = [
    'Drones & Quadcopters',
    '3D Printing & Filament',
    'AI & Computer Vision',
    'Wearable Tech',
    'Solar & Clean Energy',
    'RC Transmitters & Receivers',
    'Arduino Shields',
    'Relays & Switching',
    'Precision Soldering'
  ];

  const handleQuickAdd = async (sug: string) => {
    if (categories.some((c) => c.toLowerCase() === sug.toLowerCase())) {
      showToast('Notice', `"${sug}" is already in your categories.`, 'info');
      return;
    }
    await addCategory(sug);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-navy font-heading">
            Storefront Categories Management
          </h2>
          <p className="text-xs text-secondary mt-0.5 font-sans">
            Add, rename, or remove product categories. All changes sync immediately to the Hardware Storefront filters and product forms.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-primary border border-blue-200 self-start sm:self-auto">
          {categories.length} Categories Total
        </span>
      </div>

      {/* Add Category Card */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-2xs">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Enter new category name (e.g. 'Drones & UAV Parts', 'LiPo Batteries')..."
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newCatInput.trim()}
            className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold font-heading whitespace-nowrap shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </form>

        {/* Quick Suggestions */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-[11px] font-bold text-secondary flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan" />
            <span>1-Click Recommended Categories:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_CATEGORIES.filter(s => !categories.includes(s)).map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => handleQuickAdd(sug)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-primary border border-border transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>{sug}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Grid Table */}
      <div className="bg-white rounded-2xl border border-border shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-border flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-navy font-mono flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-primary" />
            Active Category List
          </h3>
          <span className="text-[11px] text-secondary">
            Categories appear on storefront in the order listed below
          </span>
        </div>

        <div className="divide-y divide-border">
          {categories.map((cat, idx) => {
            const productCount = products.filter(
              (p) => p.category === cat || (cat === 'All')
            ).length;

            const isEditing = editingCat === cat;
            const isAll = cat.toLowerCase() === 'all';

            return (
              <div
                key={cat}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                {/* Left: Index & Name */}
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-6 text-center text-xs font-mono font-bold text-slate-400">
                    {idx + 1}.
                  </span>

                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1 max-w-sm">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        className="px-3 py-1.5 text-xs bg-white border border-primary rounded-lg text-navy focus:outline-hidden w-full font-bold"
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-1.5 bg-success text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                        title="Save Name"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingCat(null)}
                        className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-xs sm:text-sm text-navy font-heading">
                        {cat}
                      </span>
                      {isAll && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-200">
                          System Default
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Product Count Badge & Actions */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                    <strong>{isAll ? products.length : productCount}</strong> products
                  </span>

                  {!isAll && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 text-slate-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Category Name"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

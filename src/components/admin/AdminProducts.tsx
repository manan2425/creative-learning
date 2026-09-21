'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Cpu, 
  X, 
  Check, 
  Star, 
  ExternalLink,
  Upload,
  FolderPlus,
  SlidersHorizontal,
  Package
} from 'lucide-react';
import { ImageUploadField } from '@/components/common/ImageUploadField';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories, showToast } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: categories[1] || 'Microcontrollers',
    price: 199,
    originalPrice: 299,
    stockQuantity: 100,
    inStock: true,
    sku: '',
    image: '',
    shortDescription: '',
    description: '',
    voltage: '5V DC',
    rating: 4.8,
    reviewsCount: 24,
  });

  const [specsInput, setSpecsInput] = useState('Operating Voltage: 5V\nClock Speed: 16MHz');
  const [pinoutInput, setPinoutInput] = useState('VCC: 5V\nGND: Ground\nPWM: Pin 9');

  const filtered = products.filter((p) => {
    const matchCategory = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      id: 'prod-' + Date.now(),
      name: '',
      category: categories.find(c => c !== 'All') || 'Microcontrollers',
      price: 199,
      originalPrice: 299,
      stockQuantity: 100,
      inStock: true,
      sku: 'MCU-' + Math.floor(1000 + Math.random() * 9000),
      image: '',
      shortDescription: '',
      description: '',
      voltage: '5V DC',
      rating: 4.8,
      reviewsCount: 20,
    });
    setSpecsInput('Operating Voltage: 5V\nInterface: I2C / UART');
    setPinoutInput('VCC: 5V DC\nGND: 0V Ground\nSCL: Clock\nSDA: Data');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({ ...p });
    
    // Parse specs to lines
    if (p.specs) {
      const spLines = Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join('\n');
      setSpecsInput(spLines);
    } else {
      setSpecsInput('');
    }

    // Parse pinout
    if (p.pinout) {
      setPinoutInput(p.pinout.join('\n'));
    } else {
      setPinoutInput('');
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast('Validation Error', 'Product Name and Price are required.', 'warning');
      return;
    }

    // Parse specs object
    const parsedSpecs: Record<string, string> = {};
    specsInput.split('\n').forEach((line) => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        parsedSpecs[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    });

    // Parse pinout array
    const parsedPinout = pinoutInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const productPayload: Product = {
      ...(formData as Product),
      id: editingProduct ? editingProduct.id : (formData.id || 'prod-' + Date.now()),
      category: formData.category || 'Microcontrollers',
      image: formData.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      specs: parsedSpecs,
      pinout: parsedPinout,
    };

    if (editingProduct) {
      await updateProduct(productPayload);
    } else {
      await addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-navy font-heading">Component &amp; IC Inventory</h2>
          <p className="text-xs text-secondary mt-0.5">
            Add, edit, or adjust stock for microcontrollers, sensors, motors, and displays.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors cursor-pointer self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Component</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search component name, category, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-border rounded-xl text-navy focus:outline-hidden focus:border-primary"
          />
        </div>

        {/* Dynamic Category Selector Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs font-bold text-navy focus:outline-hidden focus:border-primary cursor-pointer"
          >
            <option value="All">All Categories ({products.length})</option>
            {categories.filter(c => c !== 'All').map((cat) => (
              <option key={cat} value={cat}>
                {cat} ({products.filter(p => p.category === cat).length})
              </option>
            ))}
          </select>

          <span className="text-xs text-secondary font-medium whitespace-nowrap hidden sm:inline">
            Showing <strong>{filtered.length}</strong> items
          </span>
        </div>
      </div>

      {/* Products Table (Desktop) & Cards (Mobile/Tablet) */}
      <div className="bg-white rounded-2xl border border-border shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Cpu className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-navy text-sm font-heading">No Components Found</h4>
            <p className="text-xs text-secondary max-w-sm mx-auto">
              Your inventory is empty or no products match the selected filters. Click below to add your first component.
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hardware Component</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-secondary uppercase font-bold text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="p-4">Component</th>
                  <th className="p-4 hidden sm:table-cell">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 hidden md:table-cell">Stock</th>
                  <th className="p-4 hidden lg:table-cell">Voltage</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&q=80'}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-border shrink-0"
                        />
                        <div className="space-y-0.5">
                          <span className="font-bold text-navy hover:text-primary transition-colors block">
                            {prod.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            SKU: {prod.sku || 'N/A'} • {prod.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 hidden sm:table-cell">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-primary text-[10px] font-bold border border-blue-100">
                        {prod.category}
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-navy">
                      ₹{prod.price}
                      {prod.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through ml-1 font-normal">
                          ₹{prod.originalPrice}
                        </span>
                      )}
                    </td>

                    <td className="p-4 hidden md:table-cell font-mono">
                      <span className={`inline-flex items-center gap-1 font-bold ${prod.stockQuantity > 10 ? 'text-success' : 'text-amber-600'}`}>
                        {prod.stockQuantity > 0 ? `${prod.stockQuantity} in stock` : 'Out of stock'}
                      </span>
                    </td>

                    <td className="p-4 hidden lg:table-cell font-mono text-slate-500">
                      {prod.voltage || '5V DC'}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Component"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${prod.name} from catalog?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Component"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-navy/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-navy text-white p-4 px-6 flex items-center justify-between shrink-0">
              <h3 className="font-extrabold text-sm font-heading flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan" />
                <span>{editingProduct ? 'Edit Hardware Component' : 'Add New Hardware Component'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Image Upload Component */}
              <ImageUploadField
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Component Picture (Device Upload / Camera)"
                description="Tap to select photo from phone gallery, capture with camera, or paste link."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Component Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ESP32 Dual-Core Wi-Fi MCU Dev Board"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary focus:bg-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Category (Dynamic)</label>
                  <select
                    value={formData.category || (categories[1] || 'Microcontrollers')}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary cursor-pointer font-semibold"
                  >
                    {categories.filter(c => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono font-bold text-navy focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Original MRP Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || 0}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Stock Quantity Available</label>
                  <input
                    type="number"
                    value={formData.stockQuantity || 0}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Operating Voltage</label>
                  <input
                    type="text"
                    value={formData.voltage || ''}
                    onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
                    placeholder="e.g. 3.3V / 5V DC"
                    className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Short Description</label>
                  <input
                    type="text"
                    placeholder="Brief 1-sentence overview of the board or sensor..."
                    value={formData.shortDescription || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Technical Specifications (Key: Value per line)</label>
                  <textarea
                    rows={3}
                    value={specsInput}
                    onChange={(e) => setSpecsInput(e.target.value)}
                    placeholder="Clock Speed: 240MHz&#10;Flash Memory: 4MB&#10;Wi-Fi: 802.11 b/g/n"
                    className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy focus:outline-hidden focus:border-primary leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Pinout Schematic Map (1 Pin per line)</label>
                  <textarea
                    rows={3}
                    value={pinoutInput}
                    onChange={(e) => setPinoutInput(e.target.value)}
                    placeholder="VCC: 5V Power&#10;GND: Ground (0V)&#10;GPIO2: Built-in Blue LED"
                    className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy focus:outline-hidden focus:border-primary leading-relaxed"
                  />
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-navy rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  {editingProduct ? 'Update Component' : 'Save to MongoDB'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { RoboticsKit } from '@/types';
import { Plus, Trash2, Edit3, Bot, X, Star, Clock, Layers, MessageCircle, Check, FileText, Download, Eye } from 'lucide-react';
import { MultiImageUploadField } from '@/components/common/MultiImageUploadField';
import { PdfUploadField } from '@/components/common/PdfUploadField';
import { exportKitsToCSV } from '@/lib/exportUtils';
import { RatingChangeModal } from '@/components/modals/RatingChangeModal';

export const AdminKits: React.FC = () => {
  const { kits, addKit, updateKit, deleteKit, showToast, setActiveQuickViewKit } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKit, setEditingKit] = useState<RoboticsKit | null>(null);
  const [ratingModalKit, setRatingModalKit] = useState<RoboticsKit | null>(null);

  // Close on Escape and prevent body scrolling when modal is open
  React.useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  const [formData, setFormData] = useState<Partial<RoboticsKit>>({
    title: '',
    subtitle: '',
    difficulty: 'Beginner',
    ageRange: 'Age 10+ / Engineering Students',
    price: 1499,
    originalPrice: 2199,
    hidePrice: false,
    rating: 4.9,
    reviewsCount: 30,
    buildTimeHours: 2.5,
    image: '',
    images: [],
    pdfUrl: '',
    pdfName: '',
    badge: 'Popular',
  });

  const [featuresInput, setFeaturesInput] = useState('Plug & Play Jumper Wires\nStep-by-step PDF assembly guide\nPre-tested Microcontroller');
  const [bomInput, setBomInput] = useState('Arduino Uno R3: 1\nL298N Motor Driver: 1\nHC-SR04 Ultrasonic Sensor: 1\nBO Motors + Wheels: 2');
  const [outcomesInput, setOutcomesInput] = useState('Motor PWM velocity control\nUltrasonic distance trigonometry');

  const handleOpenAdd = () => {
    setEditingKit(null);
    setFormData({
      id: 'kit-' + Date.now(),
      title: '',
      subtitle: '',
      difficulty: 'Beginner',
      ageRange: 'Age 10+ / Engineering Students',
      price: 0,
      originalPrice: 0,
      hidePrice: false,
      rating: 4.9,
      reviewsCount: 20,
      buildTimeHours: 2.5,
      image: '',
      images: [],
      pdfUrl: '',
      pdfName: '',
      badge: 'New',
    });
    setFeaturesInput('Plug-and-play jumper cables\nZero-soldering assembly\nFull video guide');
    setBomInput('Arduino Uno R3: 1\nMotor Driver: 1\nChassis Pack: 1');
    setOutcomesInput('Robotics kinematics\nC++ coding');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (kit: RoboticsKit) => {
    setEditingKit(kit);
    const initialImages = kit.images && kit.images.length > 0 ? kit.images : (kit.image ? [kit.image] : []);
    setFormData({ 
      ...kit,
      images: initialImages,
      pdfUrl: kit.pdfUrl || kit.manualUrl || '',
      pdfName: kit.pdfName || '',
      hidePrice: Boolean(kit.hidePrice)
    });
    setFeaturesInput(kit.features ? kit.features.join('\n') : '');
    setBomInput(kit.bomList ? kit.bomList.map((b) => `${b.item}: ${b.qty}`).join('\n') : '');
    setOutcomesInput(kit.learningOutcomes ? kit.learningOutcomes.join('\n') : '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showToast('Validation Error', 'Kit Title is required.', 'warning');
      return;
    }

    if (!formData.hidePrice && (!formData.price || formData.price <= 0)) {
      showToast('Validation Error', 'Please enter a valid price or toggle "Hide Price on Storefront".', 'warning');
      return;
    }

    const parsedFeatures = featuresInput.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const parsedOutcomes = outcomesInput.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const parsedBom = bomInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((l) => {
        const parts = l.split(':');
        return {
          item: parts[0].trim(),
          qty: parts.length > 1 ? Number(parts[1].trim()) || 1 : 1,
        };
      });

    const allImgs = formData.images && formData.images.length > 0 ? formData.images : (formData.image ? [formData.image] : []);
    const primaryImg = allImgs[0] || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=700&q=80';

    const kitPayload: RoboticsKit = {
      ...(formData as RoboticsKit),
      id: editingKit ? editingKit.id : (formData.id || 'kit-' + Date.now()),
      price: formData.hidePrice ? 0 : Number(formData.price || 0),
      hidePrice: Boolean(formData.hidePrice),
      image: primaryImg,
      images: allImgs,
      pdfUrl: formData.pdfUrl || '',
      pdfName: formData.pdfName || '',
      manualUrl: formData.pdfUrl || '',
      features: parsedFeatures,
      learningOutcomes: parsedOutcomes,
      bomList: parsedBom,
      codeLanguage: ['Arduino C++', 'Block Coding'],
    };

    if (editingKit) {
      await updateKit(kitPayload);
    } else {
      await addKit(kitPayload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-navy font-heading">Robotics Starter Kits</h2>
          <p className="text-xs text-secondary mt-0.5">
            Manage complete robotics learning bundles, difficulty tiers, and Bill of Materials.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => {
              exportKitsToCSV(kits);
              showToast('Download Complete', `Exported ${kits.length} starter kits to CSV.`, 'success');
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer border border-border"
            title="Download full starter kits catalog as CSV"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Robotics Kit</span>
          </button>
        </div>
      </div>

      {/* Kits Grid */}
      <div className="bg-white rounded-2xl border border-border shadow-2xs overflow-hidden">
        {kits.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Bot className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-navy text-sm font-heading">No Robotics Kits in Database</h4>
            <p className="text-xs text-secondary max-w-sm mx-auto">
              Your starter kits catalog is empty. Click below to add an autonomous rover, robotic arm, or IoT kit.
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Robotics Kit</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {kits.map((kit) => (
              <div
                key={kit.id}
                className="bg-slate-50/70 rounded-2xl border border-border overflow-hidden flex flex-col justify-between hover:border-primary/50 transition-all"
              >
                <div>
                  <div className="h-40 bg-slate-900 relative">
                    <img
                      src={kit.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=700&q=80'}
                      alt={kit.title}
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-navy text-white text-[10px] font-bold border border-slate-700">
                        {kit.difficulty}
                      </span>
                      {kit.badge && (
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold">
                          {kit.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      {kit.hidePrice || !kit.price ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp for Price
                        </span>
                      ) : (
                        <span className="font-bold text-navy">₹{kit.price}</span>
                      )}
                      <span className="text-slate-500">{kit.buildTimeHours || 2}h Build</span>
                    </div>

                    <h4 className="font-bold text-navy text-sm font-heading line-clamp-1">{kit.title}</h4>
                    <p className="text-xs text-secondary line-clamp-2">{kit.subtitle}</p>
                    
                    {/* Rating row with click-to-edit */}
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setRatingModalKit(kit)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-amber-800 text-[11px] font-bold font-mono transition-colors cursor-pointer group"
                        title="Click to edit kit rating & reviews"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span>{kit.rating || 4.9}</span>
                        <span className="text-slate-400 font-normal">({kit.reviewsCount || 0})</span>
                      </button>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {kit.bomList?.length || 0} BOM items
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => setActiveQuickViewKit(kit)}
                    className="p-1.5 text-slate-500 hover:text-primary hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Preview Kit Details (Quick View)"
                  >
                    <Eye className="w-4 h-4 text-primary" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(kit)}
                    className="p-1.5 text-slate-500 hover:text-primary hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Edit Kit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${kit.title}?`)) deleteKit(kit.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Delete Kit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 animate-fade-in touch-manipulation">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-navy/80 backdrop-blur-xs transition-opacity cursor-pointer z-0"
            aria-hidden="true"
          />

          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            
            <div className="bg-navy text-white p-3.5 sm:p-4 px-4 sm:px-6 flex items-center justify-between shrink-0 border-b border-navy-light sticky top-0 z-20">
              <h3 className="font-extrabold text-sm font-heading flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan" />
                <span>{editingKit ? 'Edit Robotics Kit' : 'Add New Robotics Kit'}</span>
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-600 active:bg-red-700 text-white transition-all cursor-pointer shadow-xs active:scale-95 text-xs font-bold border border-slate-700"
                title="Cancel & Close (Esc)"
                aria-label="Cancel & Close modal"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Multi-Image Upload Component */}
              <MultiImageUploadField
                images={formData.images || (formData.image ? [formData.image] : [])}
                onChange={(imgs) => setFormData({ ...formData, images: imgs, image: imgs[0] || '' })}
                label="Kit Photographs (Multiple Photos Allowed)"
                description="Upload multiple pictures of assembled kit, breadboard wiring, and parts pack."
              />

              {/* Single PDF Upload Component */}
              <PdfUploadField
                pdfUrl={formData.pdfUrl || formData.manualUrl || ''}
                pdfName={formData.pdfName || ''}
                onChange={(url, name) => setFormData({ ...formData, pdfUrl: url, manualUrl: url, pdfName: name || '' })}
                label="Assembly Manual / Guide (1 PDF Allowed)"
                description="Attach a step-by-step PDF manual or assembly guide for students."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Kit Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4WD Autonomous Obstacle-Avoiding Rover Kit"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy font-bold focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Subtitle / Catchphrase</label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Difficulty Level</label>
                  <select
                    value={formData.difficulty || 'Beginner'}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Target Age / Audience</label>
                  <input
                    type="text"
                    value={formData.ageRange || ''}
                    onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                  />
                </div>

                {/* Hide Price / WhatsApp for Price Toggle Card */}
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Hide Price &amp; Show &quot;Contact on WhatsApp for Price&quot;</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Enable this to provide custom or institutional quotes. Customers will see a direct WhatsApp inquiry button.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.hidePrice)}
                      onChange={(e) => setFormData({ ...formData, hidePrice: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {!formData.hidePrice ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-navy">Selling Price (₹) *</label>
                      <input
                        type="number"
                        required={!formData.hidePrice}
                        value={formData.price || 0}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono font-bold text-navy"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-navy">Original MRP Price (₹)</label>
                      <input
                        type="number"
                        value={formData.originalPrice || 0}
                        onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy"
                      />
                    </div>
                  </>
                ) : (
                  <div className="sm:col-span-2 p-3 bg-slate-50 border border-dashed border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Price will be hidden. Customers will click <strong>&quot;Contact on WhatsApp for Price&quot;</strong> to get a quote.</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Build Time (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.buildTimeHours || 2}
                    onChange={(e) => setFormData({ ...formData, buildTimeHours: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Promo Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Popular, Best Value, Bestseller"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                  />
                </div>

                {/* Rating & Reviews Count in Edit Modal */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy flex items-center justify-between">
                    <span>Customer Rating (1.0 to 5.0)</span>
                    <span className="text-amber-500 font-bold flex items-center gap-1 text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {formData.rating || 4.9}
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={formData.rating ?? 4.9}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.9 })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono font-bold text-navy"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Reviews Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reviewsCount ?? 20}
                    onChange={(e) => setFormData({ ...formData, reviewsCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Bill of Materials (Part Name: Quantity per line)</label>
                  <textarea
                    rows={3}
                    value={bomInput}
                    onChange={(e) => setBomInput(e.target.value)}
                    placeholder="Arduino Uno R3: 1&#10;L298N Motor Driver: 1&#10;Ultrasonic HC-SR04: 1"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Key Learning Outcomes (1 per line)</label>
                  <textarea
                    rows={2}
                    value={outcomesInput}
                    onChange={(e) => setOutcomesInput(e.target.value)}
                    placeholder="PWM Motor speed calibration&#10;Autonomous obstacle detection logic"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                  />
                </div>

              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-navy rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <X className="w-4 h-4 text-slate-500" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover active:bg-primary text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingKit ? 'Update Robotics Kit' : 'Save to MongoDB'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Quick Rating Change Modal */}
      {ratingModalKit && (
        <RatingChangeModal
          isOpen={Boolean(ratingModalKit)}
          onClose={() => setRatingModalKit(null)}
          itemTitle={ratingModalKit.title}
          itemType="Starter Kit"
          initialRating={ratingModalKit.rating || 4.9}
          initialReviewsCount={ratingModalKit.reviewsCount || 0}
          onSave={async (newRating, newReviewsCount) => {
            await updateKit({
              ...ratingModalKit,
              rating: newRating,
              reviewsCount: newReviewsCount,
            });
            showToast('Rating Saved', `${ratingModalKit.title} rating updated to ${newRating} ★ (${newReviewsCount} reviews).`, 'success');
            setRatingModalKit(null);
          }}
        />
      )}

    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { RoboticsKit } from '@/types';
import { Plus, Trash2, Edit3, Bot, X, Star, Clock, Layers } from 'lucide-react';
import { ImageUploadField } from '@/components/common/ImageUploadField';

export const AdminKits: React.FC = () => {
  const { kits, addKit, updateKit, deleteKit, showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKit, setEditingKit] = useState<RoboticsKit | null>(null);

  const [formData, setFormData] = useState<Partial<RoboticsKit>>({
    title: '',
    subtitle: '',
    difficulty: 'Beginner',
    ageRange: 'Age 10+ / Engineering Students',
    price: 1499,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 30,
    buildTimeHours: 2.5,
    image: '',
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
      price: 1499,
      originalPrice: 2199,
      rating: 4.9,
      reviewsCount: 20,
      buildTimeHours: 2.5,
      image: '',
      badge: 'New',
    });
    setFeaturesInput('Plug-and-play jumper cables\nZero-soldering assembly\nFull video guide');
    setBomInput('Arduino Uno R3: 1\nMotor Driver: 1\nChassis Pack: 1');
    setOutcomesInput('Robotics kinematics\nC++ coding');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (kit: RoboticsKit) => {
    setEditingKit(kit);
    setFormData({ ...kit });
    setFeaturesInput(kit.features ? kit.features.join('\n') : '');
    setBomInput(kit.bomList ? kit.bomList.map((b) => `${b.item}: ${b.qty}`).join('\n') : '');
    setOutcomesInput(kit.learningOutcomes ? kit.learningOutcomes.join('\n') : '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      showToast('Validation Error', 'Kit Title and Price are required.', 'warning');
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

    const kitPayload: RoboticsKit = {
      ...(formData as RoboticsKit),
      id: editingKit ? editingKit.id : (formData.id || 'kit-' + Date.now()),
      image: formData.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=700&q=80',
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

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors cursor-pointer self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Robotics Kit</span>
        </button>
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
                      <span className="font-bold text-navy">₹{kit.price}</span>
                      <span className="text-slate-500">{kit.buildTimeHours || 2}h Build</span>
                    </div>

                    <h4 className="font-bold text-navy text-sm font-heading line-clamp-1">{kit.title}</h4>
                    <p className="text-xs text-secondary line-clamp-2">{kit.subtitle}</p>
                    
                    <div className="pt-2 text-[11px] text-slate-500 font-mono">
                      {kit.bomList?.length || 0} Components in BOM bundle
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(kit)}
                    className="p-1.5 text-slate-500 hover:text-primary hover:bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${kit.title}?`)) deleteKit(kit.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-navy/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
            
            <div className="bg-navy text-white p-4 px-6 flex items-center justify-between shrink-0">
              <h3 className="font-extrabold text-sm font-heading flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan" />
                <span>{editingKit ? 'Edit Robotics Kit' : 'Add New Robotics Kit'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Image Upload Component */}
              <ImageUploadField
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Robotics Kit Cover Image"
                description="Upload photo of the assembled kit, packaging, or parts bundle."
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

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
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

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
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
                  {editingKit ? 'Update Robotics Kit' : 'Save to MongoDB'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { EngineeringProject } from '@/types';
import { Plus, Trash2, Edit3, Compass, X, Box, FileCode2, MessageCircle, Check } from 'lucide-react';
import { ImageUploadField } from '@/components/common/ImageUploadField';

export const AdminProjects: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<EngineeringProject | null>(null);

  const [formData, setFormData] = useState<Partial<EngineeringProject>>({
    title: '',
    category: 'Robotics & Automation',
    difficulty: 'Intermediate',
    estimatedCost: 1950,
    hidePrice: false,
    image: '',
    description: '',
    cadModelAvailable: true,
    gerberAvailable: true,
    circuitTopology: 'Transmitter -> MCU -> Receiver -> Motor Driver',
  });

  const [bomInput, setBomInput] = useState('Arduino Nano: 2: 280\nMPU6050 Gyro: 1: 135\nNRF24L01 Module: 2: 95');
  const [highlightsInput, setHighlightsInput] = useState('2.4GHz wireless telemetry\nKalman filter orientation');

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      id: 'proj-' + Date.now(),
      title: '',
      category: 'Robotics & Automation',
      difficulty: 'Intermediate',
      estimatedCost: 0,
      hidePrice: false,
      image: '',
      description: '',
      cadModelAvailable: true,
      gerberAvailable: true,
      circuitTopology: 'Input Sensor -> Brain MCU -> Output Actuators',
    });
    setBomInput('Microcontroller: 1: 350\nSensor: 1: 150\nDriver: 1: 130');
    setHighlightsInput('Full open-source code\nSchematic included');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: EngineeringProject) => {
    setEditingProject(proj);
    setFormData({ 
      ...proj,
      hidePrice: Boolean(proj.hidePrice)
    });
    setBomInput(proj.bom ? proj.bom.map((b) => `${b.name}: ${b.qty}: ${b.unitPrice}`).join('\n') : '');
    setHighlightsInput(proj.highlights ? proj.highlights.join('\n') : '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showToast('Validation Error', 'Project Title is required.', 'warning');
      return;
    }

    const parsedBom = bomInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((l) => {
        const parts = l.split(':');
        return {
          name: parts[0]?.trim() || 'Part',
          qty: parts.length > 1 ? Number(parts[1].trim()) || 1 : 1,
          unitPrice: parts.length > 2 ? Number(parts[2].trim()) || 100 : 100,
        };
      });

    const parsedHighlights = highlightsInput.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    const projectPayload: EngineeringProject = {
      ...(formData as EngineeringProject),
      id: editingProject ? editingProject.id : (formData.id || 'proj-' + Date.now()),
      estimatedCost: formData.hidePrice ? 0 : Number(formData.estimatedCost || 0),
      hidePrice: Boolean(formData.hidePrice),
      image: formData.image || 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=700&q=80',
      bom: parsedBom,
      highlights: parsedHighlights,
    };

    if (editingProject) {
      await updateProject(projectPayload);
    } else {
      await addProject(projectPayload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-navy font-heading">Engineering Blueprints &amp; DIY Projects</h2>
          <p className="text-xs text-secondary mt-0.5">
            Manage open-source capstone blueprints with itemized BOM costs and circuit topologies.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors cursor-pointer self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Blueprint</span>
        </button>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-border shadow-2xs overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Compass className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-navy text-sm font-heading">No Blueprints Listed</h4>
            <p className="text-xs text-secondary max-w-sm mx-auto">
              Share open-source DIY blueprints with component bundles so students can order all parts in 1 click.
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Blueprint</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-50/70 rounded-2xl border border-border overflow-hidden flex flex-col justify-between hover:border-primary/50 transition-all"
              >
                <div>
                  <div className="h-40 bg-slate-900 relative">
                    <img
                      src={proj.image || 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=700&q=80'}
                      alt={proj.title}
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-navy text-white text-[10px] font-bold border border-slate-700">
                        {proj.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      {proj.hidePrice || !proj.estimatedCost ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp for Quote
                        </span>
                      ) : (
                        <span className="font-bold text-navy">Est. ₹{proj.estimatedCost}</span>
                      )}
                      <span className="text-primary font-semibold">{proj.category}</span>
                    </div>

                    <h4 className="font-bold text-navy text-sm font-heading line-clamp-1">{proj.title}</h4>
                    <p className="text-xs text-secondary line-clamp-2">{proj.description}</p>
                    
                    <div className="pt-2 text-[11px] text-slate-500 font-mono">
                      {proj.bom?.length || 0} Parts in BOM
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 text-slate-500 hover:text-primary hover:bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${proj.title}?`)) deleteProject(proj.id);
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
                <Compass className="w-4 h-4 text-cyan" />
                <span>{editingProject ? 'Edit Engineering Blueprint' : 'Add New Engineering Blueprint'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              
              <ImageUploadField
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Blueprint Schematic / Prototype Photo"
                description="Upload circuit diagram, CAD rendering, or finished project photo."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2-Wheeled Inverted Pendulum Self-Balancing Robot"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy font-bold focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Category</label>
                  <input
                    type="text"
                    value={formData.category || 'Robotics & Automation'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Difficulty Tier</label>
                  <select
                    value={formData.difficulty || 'Intermediate'}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* Hide Price / WhatsApp for Price Toggle Card */}
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Hide BOM Cost &amp; Show &quot;Contact on WhatsApp for Price&quot;</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Enable this to provide custom capstone project quotations.
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
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-navy">Estimated Total BOM Cost (₹)</label>
                    <input
                      type="number"
                      value={formData.estimatedCost || 1500}
                      onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono font-bold text-navy"
                    />
                  </div>
                ) : (
                  <div className="sm:col-span-2 p-3 bg-slate-50 border border-dashed border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cost will be hidden. Customers will click <strong>&quot;Contact on WhatsApp for Price&quot;</strong> to get a quote.</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Circuit Topology Summary</label>
                  <input
                    type="text"
                    placeholder="e.g. Gyro Sensor -> PID Algorithm -> Dual DC Motors"
                    value={formData.circuitTopology || ''}
                    onChange={(e) => setFormData({ ...formData, circuitTopology: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Project Overview Description</label>
                  <textarea
                    rows={2}
                    placeholder="A PID stabilized mobile robot that balances on two wheels using accelerometer data..."
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Bill of Materials (Part Name: Quantity: Unit Price per line)</label>
                  <textarea
                    rows={3}
                    value={bomInput}
                    onChange={(e) => setBomInput(e.target.value)}
                    placeholder="Arduino Nano: 1: 280&#10;MPU-6050 IMU: 1: 135&#10;L298N Motor Driver: 1: 130"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Key Highlights &amp; Features (1 per line)</label>
                  <textarea
                    rows={2}
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                    placeholder="Complementary filter orientation sensing&#10;High torque 300RPM gear motors"
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
                  {editingProject ? 'Update Blueprint' : 'Save to MongoDB'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

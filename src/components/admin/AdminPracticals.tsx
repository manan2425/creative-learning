'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { PracticalExperiment } from '@/types';
import { Plus, Trash2, Edit3, Layers, X, Clock, Code2 } from 'lucide-react';
import { ImageUploadField } from '@/components/common/ImageUploadField';

export const AdminPracticals: React.FC = () => {
  const { practicals, addPractical, updatePractical, deletePractical, showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPractical, setEditingPractical] = useState<PracticalExperiment | null>(null);

  const [formData, setFormData] = useState<Partial<PracticalExperiment>>({
    title: '',
    topic: 'Microcontroller Fundamentals',
    level: 'Beginner',
    durationMin: 30,
    image: '',
    description: '',
    objective: '',
  });

  const [componentsInput, setComponentsInput] = useState('Arduino Uno: 1\nLED 5mm: 1\nResistor 220 Ohm: 1');
  const [wiringInput, setWiringInput] = useState('Arduino D9 -> LED Anode (+) (PWM Signal)\nLED Cathode (-) -> Arduino GND (Ground)');
  const [codeSnippet, setCodeSnippet] = useState(`// Arduino C++ Practical Code\nvoid setup() {\n  pinMode(9, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(9, HIGH);\n  delay(500);\n  digitalWrite(9, LOW);\n  delay(500);\n}`);
  const [tipsInput, setTipsInput] = useState('Check LED polarity (long pin is positive)\nEnsure resistor is connected');

  const handleOpenAdd = () => {
    setEditingPractical(null);
    setFormData({
      id: 'prac-' + Date.now(),
      title: '',
      topic: 'Microcontroller Fundamentals',
      level: 'Beginner',
      durationMin: 30,
      image: '',
      description: '',
      objective: '',
    });
    setComponentsInput('Arduino Uno: 1\nSensor Module: 1');
    setWiringInput('VCC -> 5V (Power)\nGND -> GND (Ground)');
    setCodeSnippet(`void setup() {\n  Serial.begin(9600);\n}\nvoid loop() {\n}`);
    setTipsInput('Verify wiring before powering board');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prac: PracticalExperiment) => {
    setEditingPractical(prac);
    setFormData({ ...prac });
    setComponentsInput(prac.requiredComponents ? prac.requiredComponents.map((c) => `${c.name}: ${c.qty}`).join('\n') : '');
    setWiringInput(prac.circuitWiring ? prac.circuitWiring.map((w) => `${w.pinFrom} -> ${w.pinTo} (${w.note || 'Signal'})`).join('\n') : '');
    setCodeSnippet(prac.codeSnippets?.[0]?.code || '');
    setTipsInput(prac.troubleshootingTips ? prac.troubleshootingTips.join('\n') : '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showToast('Validation Error', 'Practical Title is required.', 'warning');
      return;
    }

    const parsedComponents = componentsInput.split('\n').map((l) => l.trim()).filter((l) => l.length > 0).map((l) => {
      const parts = l.split(':');
      return {
        name: parts[0].trim(),
        qty: parts.length > 1 ? Number(parts[1].trim()) || 1 : 1,
      };
    });

    const parsedWiring = wiringInput.split('\n').map((l) => l.trim()).filter((l) => l.length > 0).map((l) => {
      const arrowParts = l.split('->');
      const from = arrowParts[0]?.trim() || 'Pin';
      const toWithNote = arrowParts[1]?.trim() || 'Pin';
      const noteMatch = toWithNote.match(/\((.*?)\)/);
      const note = noteMatch ? noteMatch[1] : 'Direct Connection';
      const to = toWithNote.replace(/\(.*?\)/, '').trim();

      return {
        pinFrom: from,
        pinTo: to,
        color: 'bg-blue-500',
        note,
      };
    });

    const parsedTips = tipsInput.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    const practicalPayload: PracticalExperiment = {
      ...(formData as PracticalExperiment),
      id: editingPractical ? editingPractical.id : (formData.id || 'prac-' + Date.now()),
      image: formData.image || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80',
      requiredComponents: parsedComponents,
      circuitWiring: parsedWiring,
      codeSnippets: [
        {
          language: 'Arduino C++',
          code: codeSnippet,
        },
      ],
      troubleshootingTips: parsedTips,
    };

    if (editingPractical) {
      await updatePractical(practicalPayload);
    } else {
      await addPractical(practicalPayload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-navy font-heading">Guided Labs &amp; Experiments</h2>
          <p className="text-xs text-secondary mt-0.5">
            Create interactive electronics practicals with pinout wiring tables, code snippets, and troubleshooting.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors cursor-pointer self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Guided Practical</span>
        </button>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-border shadow-2xs overflow-hidden">
        {practicals.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Layers className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-navy text-sm font-heading">No Guided Practicals Listed</h4>
            <p className="text-xs text-secondary max-w-sm mx-auto">
              Add hands-on lab experiments for sensors, displays, and motors to guide students step-by-step.
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Practical Lab</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {practicals.map((prac) => (
              <div
                key={prac.id}
                className="bg-slate-50/70 rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-primary/50 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-primary-light text-primary text-[10px] font-bold">
                      {prac.level}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary" />
                      {prac.durationMin} mins
                    </span>
                  </div>

                  <h4 className="font-bold text-navy text-sm font-heading">{prac.title}</h4>
                  <p className="text-xs text-secondary line-clamp-2">{prac.description}</p>

                  <div className="text-[11px] font-mono text-slate-600 bg-white p-2.5 rounded-xl border border-border space-y-1">
                    <div>{prac.circuitWiring?.length || 0} Pin Connections</div>
                    <div>{prac.requiredComponents?.length || 0} Required Hardware Parts</div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => handleOpenEdit(prac)}
                    className="p-1.5 text-slate-500 hover:text-primary hover:bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${prac.title}?`)) deletePractical(prac.id);
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
                <Layers className="w-4 h-4 text-cyan" />
                <span>{editingPractical ? 'Edit Guided Practical' : 'Add New Guided Practical'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              
              <ImageUploadField
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Lab Diagram / Banner Image"
                description="Upload circuit breadboard photo or schematic diagram."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Practical Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Interfacing HC-SR04 Ultrasonic Sensor with Arduino & OLED"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy font-bold focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Skill Level</label>
                  <select
                    value={formData.level || 'Beginner'}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Estimated Duration (Mins)</label>
                  <input
                    type="number"
                    value={formData.durationMin || 30}
                    onChange={(e) => setFormData({ ...formData, durationMin: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Objective &amp; Learning Goal</label>
                  <input
                    type="text"
                    placeholder="Understand trigger/echo ultrasound pulses and calculate distance in cm..."
                    value={formData.objective || ''}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Required Hardware Parts (Name: Quantity per line)</label>
                  <textarea
                    rows={2}
                    value={componentsInput}
                    onChange={(e) => setComponentsInput(e.target.value)}
                    placeholder="Arduino Uno R3: 1&#10;HC-SR04 Sensor: 1&#10;Jumper Wires Pack: 1"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Circuit Wiring Map (PinFrom &rarr; PinTo (Note) per line)</label>
                  <textarea
                    rows={3}
                    value={wiringInput}
                    onChange={(e) => setWiringInput(e.target.value)}
                    placeholder="Sensor VCC -> Arduino 5V (Power)&#10;Sensor GND -> Arduino GND (Ground)&#10;Sensor Trig -> Arduino D9 (Pulse Output)"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono text-navy leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Arduino C++ Sample Code</label>
                  <textarea
                    rows={4}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-700 leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Troubleshooting Tips (1 per line)</label>
                  <textarea
                    rows={2}
                    value={tipsInput}
                    onChange={(e) => setTipsInput(e.target.value)}
                    placeholder="Ensure baud rate is set to 9600&#10;Keep distance under 400cm"
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
                  {editingPractical ? 'Update Practical' : 'Save to MongoDB'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

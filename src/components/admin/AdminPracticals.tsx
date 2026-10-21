'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { PracticalExperiment } from '@/types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Layers, 
  X, 
  Clock, 
  Code2, 
  FileText, 
  Check, 
  Download, 
  Eye, 
  Cpu, 
  BookOpen,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { MultiImageUploadField } from '@/components/common/MultiImageUploadField';
import { PdfUploadField } from '@/components/common/PdfUploadField';
import { exportPracticalsToCSV } from '@/lib/exportUtils';

export const AdminPracticals: React.FC = () => {
  const { 
    practicals, 
    addPractical, 
    updatePractical, 
    deletePractical, 
    showToast,
    setActivePracticalModal 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState('All');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPractical, setEditingPractical] = useState<PracticalExperiment | null>(null);

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

  const [formData, setFormData] = useState<Partial<PracticalExperiment>>({
    title: '',
    topic: 'Microcontroller Fundamentals',
    level: 'Beginner',
    durationMin: 30,
    image: '',
    images: [],
    pdfUrl: '',
    pdfName: '',
    description: '',
    objective: '',
  });

  const [componentsInput, setComponentsInput] = useState('Arduino Uno: 1\nLED 5mm: 1\nResistor 220 Ohm: 1');
  const [wiringInput, setWiringInput] = useState('Arduino D9 -> LED Anode (+) (PWM Signal)\nLED Cathode (-) -> Arduino GND (Ground)');
  const [codeSnippet, setCodeSnippet] = useState(`// Arduino C++ Practical Code\nvoid setup() {\n  pinMode(9, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(9, HIGH);\n  delay(500);\n  digitalWrite(9, LOW);\n  delay(500);\n}`);
  const [tipsInput, setTipsInput] = useState('Check LED polarity (long pin is positive)\nEnsure resistor is connected');

  // Available topics for filtering and selection
  const standardTopics = [
    'Microcontroller Fundamentals',
    'Sensors & Interfacing',
    'Robotic Vision & Distance Ranging',
    'Motors, Actuators & Power Electronics',
    'Wireless, IoT & WebSockets',
    'Displays & Human Interface',
  ];

  // Derive all unique topics present in practicals
  const allTopics = Array.from(
    new Set([
      ...standardTopics,
      ...practicals.map((p) => p.topic).filter(Boolean),
    ])
  );

  const filtered = practicals.filter((p) => {
    const matchTopic = selectedTopicFilter === 'All' || p.topic === selectedTopicFilter;
    const matchLevel = selectedLevelFilter === 'All' || p.level === selectedLevelFilter;
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.topic || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.objective || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.requiredComponents || []).some((c) => (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

    return matchTopic && matchLevel && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingPractical(null);
    setFormData({
      id: 'prac-' + Date.now(),
      title: '',
      topic: 'Microcontroller Fundamentals',
      level: 'Beginner',
      durationMin: 30,
      image: '',
      images: [],
      pdfUrl: '',
      pdfName: '',
      description: '',
      objective: '',
    });
    setComponentsInput('Arduino Uno: 1\nSensor Module: 1\nJumper Wires Pack: 1');
    setWiringInput('VCC -> 5V (Power)\nGND -> GND (Ground)\nOUT -> Pin 2 (Signal)');
    setCodeSnippet(`// Arduino C++ Practical Code\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(2, INPUT);\n}\n\nvoid loop() {\n  int val = digitalRead(2);\n  Serial.println(val);\n  delay(200);\n}`);
    setTipsInput('Verify wiring before powering board\nCheck USB baud rate matches Serial.begin');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prac: PracticalExperiment) => {
    setEditingPractical(prac);
    const initialImages = prac.images && prac.images.length > 0 ? prac.images : (prac.image ? [prac.image] : []);
    setFormData({ 
      ...prac,
      images: initialImages,
      pdfUrl: prac.pdfUrl || '',
      pdfName: prac.pdfName || '',
    });
    setComponentsInput(
      prac.requiredComponents
        ? prac.requiredComponents.map((c) => (c.unitPrice && c.unitPrice > 0 ? `${c.name}: ${c.qty}: ${c.unitPrice}` : `${c.name}: ${c.qty}`)).join('\n')
        : ''
    );
    setWiringInput(prac.circuitWiring ? prac.circuitWiring.map((w) => `${w.pinFrom} -> ${w.pinTo} (${w.note || 'Signal'})`).join('\n') : '');
    setCodeSnippet(prac.codeSnippets?.[0]?.code || '');
    setTipsInput(prac.troubleshootingTips ? prac.troubleshootingTips.join('\n') : '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      showToast('Validation Error', 'Practical Title is required.', 'warning');
      return;
    }

    const parsedComponents = componentsInput.split('\n').map((l) => l.trim()).filter((l) => l.length > 0).map((l) => {
      const parts = l.split(':');
      const priceVal = parts.length > 2 ? Number(parts[2].trim()) : undefined;
      return {
        name: parts[0].trim(),
        qty: parts.length > 1 ? Number(parts[1].trim()) || 1 : 1,
        unitPrice: priceVal && !isNaN(priceVal) && priceVal > 0 ? priceVal : undefined,
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

    const allImgs = formData.images && formData.images.length > 0 ? formData.images : (formData.image ? [formData.image] : []);
    const primaryImg = allImgs[0] || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80';

    const practicalPayload: PracticalExperiment = {
      ...(formData as PracticalExperiment),
      id: editingPractical ? editingPractical.id : (formData.id || 'prac-' + Date.now()),
      image: primaryImg,
      images: allImgs,
      pdfUrl: formData.pdfUrl || '',
      pdfName: formData.pdfName || '',
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

    let success = false;
    if (editingPractical) {
      success = await updatePractical(practicalPayload);
    } else {
      success = await addPractical(practicalPayload);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary-light text-primary">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-extrabold text-navy font-heading">Guided Labs &amp; Practicals</h2>
          </div>
          <p className="text-xs text-secondary mt-1">
            Create, edit, or remove interactive electronics experiments with pinout wiring tables, hardware parts, and downloadable code.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => {
              exportPracticalsToCSV(practicals);
              showToast('Download Complete', `Exported ${practicals.length} practical experiments to CSV.`, 'success');
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer border border-border"
            title="Download full practical experiments catalog as CSV"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Practical</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar - EXACTLY like AdminProducts */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search practical title, topic, components, wiring..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-border rounded-xl text-navy focus:outline-hidden focus:border-primary"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Topic Selector */}
          <select
            value={selectedTopicFilter}
            onChange={(e) => setSelectedTopicFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs font-bold text-navy focus:outline-hidden focus:border-primary cursor-pointer max-w-[200px] truncate"
          >
            <option value="All">All Topics ({practicals.length})</option>
            {allTopics.map((top) => (
              <option key={top} value={top}>
                {top} ({practicals.filter(p => p.topic === top).length})
              </option>
            ))}
          </select>

          {/* Level Selector */}
          <select
            value={selectedLevelFilter}
            onChange={(e) => setSelectedLevelFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs font-bold text-navy focus:outline-hidden focus:border-primary cursor-pointer"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner ({practicals.filter(p => p.level === 'Beginner').length})</option>
            <option value="Intermediate">Intermediate ({practicals.filter(p => p.level === 'Intermediate').length})</option>
            <option value="Advanced">Advanced ({practicals.filter(p => p.level === 'Advanced').length})</option>
          </select>

          <span className="text-xs text-secondary font-medium whitespace-nowrap hidden sm:inline">
            Showing <strong>{filtered.length}</strong> items
          </span>
        </div>

      </div>

      {/* Practicals Table (Desktop) & Cards (Mobile/Tablet) */}
      <div className="bg-white rounded-2xl border border-border shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Layers className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-navy text-sm font-heading">
              {searchTerm || selectedTopicFilter !== 'All' || selectedLevelFilter !== 'All'
                ? 'No Practicals Match Your Search'
                : 'No Guided Practicals Listed'}
            </h4>
            <p className="text-xs text-secondary max-w-sm mx-auto">
              {searchTerm || selectedTopicFilter !== 'All' || selectedLevelFilter !== 'All'
                ? 'Try clearing your search query or reset topic and level filters.'
                : 'Add hands-on lab experiments for sensors, displays, and motors to guide students step-by-step.'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              {(searchTerm || selectedTopicFilter !== 'All' || selectedLevelFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTopicFilter('All');
                    setSelectedLevelFilter('All');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Practical Lab</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-secondary uppercase font-bold text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="p-4">Practical Experiment</th>
                  <th className="p-4 hidden sm:table-cell">Topic / Domain</th>
                  <th className="p-4">Level</th>
                  <th className="p-4 hidden md:table-cell">Duration</th>
                  <th className="p-4 hidden lg:table-cell">Components</th>
                  <th className="p-4 hidden xl:table-cell">Wiring Pins</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                {filtered.map((prac) => {
                  const displayImg = prac.image || (prac.images && prac.images[0]) || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80';

                  return (
                    <tr key={prac.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Name & Photo */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-border shrink-0 shadow-2xs">
                            <img
                              src={displayImg}
                              alt={prac.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                          </div>

                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span 
                                onClick={() => setActivePracticalModal(prac)}
                                className="font-bold text-navy hover:text-primary transition-colors cursor-pointer truncate max-w-xs block text-xs sm:text-sm font-heading"
                              >
                                {prac.title}
                              </span>
                              {prac.images && prac.images.length > 1 && (
                                <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 text-[9px] font-mono font-bold rounded">
                                  📷 {prac.images.length}
                                </span>
                              )}
                              {prac.pdfUrl && (
                                <a
                                  href={prac.pdfUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-1.5 py-0.2 bg-red-100 text-red-700 text-[9px] font-mono font-bold rounded hover:bg-red-200 transition-colors flex items-center gap-0.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  PDF
                                </a>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 block truncate">
                              ID: {prac.id} • {prac.durationMin || 30} mins
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Topic */}
                      <td className="p-4 hidden sm:table-cell">
                        <span className="px-2.5 py-1 rounded-md bg-blue-50 text-primary text-[10px] font-bold border border-blue-100 block truncate max-w-[200px]">
                          {prac.topic || 'General STEM'}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          prac.level === 'Advanced'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : prac.level === 'Intermediate'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {prac.level || 'Beginner'}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="p-4 font-mono text-slate-600 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>{prac.durationMin || 30} mins</span>
                        </div>
                      </td>

                      {/* Components count */}
                      <td className="p-4 hidden lg:table-cell">
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-border text-navy font-semibold text-[11px]">
                          {prac.requiredComponents?.length || 0} Parts
                        </span>
                      </td>

                      {/* Wiring count */}
                      <td className="p-4 hidden xl:table-cell">
                        <span className="font-mono bg-cyan/10 text-cyan-800 px-2 py-0.5 rounded border border-cyan/20 font-semibold text-[11px]">
                          {prac.circuitWiring?.length || 0} Wires
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActivePracticalModal(prac)}
                            className="p-1.5 text-slate-500 hover:text-cyan hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Preview Practical Modal"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(prac)}
                            className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Practical"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete practical "${prac.title}"?`)) {
                                deletePractical(prac.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Practical"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Add Modal - Polished like AdminProducts Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-navy/80 backdrop-blur-xs animate-fade-in touch-manipulation">
          <div className="relative bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-border overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-navy text-white p-4 sm:p-5 flex items-center justify-between border-b border-navy-light shrink-0 sticky top-0 z-20">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-cyan/20 text-cyan border border-cyan/30">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg font-heading">
                    {editingPractical ? 'Edit Practical Experiment' : 'Create New Practical Lab'}
                  </h3>
                  <span className="text-[10px] text-cyan font-mono block">
                    {editingPractical ? `ID: ${editingPractical.id}` : 'NEW PRACTICAL LAB'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-600 active:bg-red-700 text-white transition-all cursor-pointer text-xs font-bold border border-slate-700"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 max-w-full">
              
              {/* Photo Upload Section */}
              <MultiImageUploadField
                images={formData.images || []}
                onChange={(imgs) => setFormData({ ...formData, images: imgs, image: imgs[0] || '' })}
                label="Practical Breadboard & Circuit Photographs"
                description="Upload circuit diagram photos or real breadboard setups. The primary photo is displayed in the storefront practicals grid."
                maxImages={6}
              />

              {/* PDF Lab Manual Upload */}
              <PdfUploadField
                pdfUrl={formData.pdfUrl || ''}
                pdfName={formData.pdfName || ''}
                onChange={(url, name) => setFormData({ ...formData, pdfUrl: url, pdfName: name })}
                label="Student Practical Manual / Theory Sheet (PDF)"
                description="Attach downloadable step-by-step experiment instructions for schools and colleges."
              />

              {/* Main Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Practical Lab Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ultrasonic Distance Meter with OLED Display"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs sm:text-sm font-bold text-navy focus:outline-hidden focus:border-primary focus:bg-white"
                  />
                </div>

                {/* Topic / Domain */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Topic / Subject Domain</label>
                  <select
                    value={formData.topic || 'Microcontroller Fundamentals'}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-semibold text-navy focus:outline-hidden focus:border-primary focus:bg-white cursor-pointer"
                  >
                    {allTopics.map((top) => (
                      <option key={top} value={top}>{top}</option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Difficulty Level</label>
                  <select
                    value={formData.level || 'Beginner'}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-semibold text-navy focus:outline-hidden focus:border-primary focus:bg-white cursor-pointer"
                  >
                    <option value="Beginner">Beginner Level</option>
                    <option value="Intermediate">Intermediate Level</option>
                    <option value="Advanced">Advanced Level</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy flex items-center justify-between">
                    <span>Experiment Duration (Minutes)</span>
                    <span className="text-[11px] font-mono text-primary font-bold">
                      {formData.durationMin || 30} mins
                    </span>
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={formData.durationMin || 30}
                    onChange={(e) => setFormData({ ...formData, durationMin: parseInt(e.target.value, 10) || 30 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-mono font-bold text-navy focus:outline-hidden focus:border-primary focus:bg-white"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-navy">Short Overview Summary</label>
                  <input
                    type="text"
                    placeholder="Brief 1-line overview of the practical..."
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary focus:bg-white"
                  />
                </div>

                {/* Learning Objective */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-navy">Learning Objective</label>
                  <textarea
                    rows={2}
                    placeholder="What students learn from this experiment (e.g. Understand ultrasonic pulse timing and I2C protocol)..."
                    value={formData.objective || ''}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary focus:bg-white leading-relaxed"
                  />
                </div>

                {/* Required Hardware BOM */}
                <div className="sm:col-span-2 space-y-1 bg-slate-50/80 p-3.5 rounded-2xl border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-navy flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-primary" />
                      <span>Required Components &amp; BOM (Component: Quantity or Component: Quantity: Price)</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Price is optional</span>
                  </div>
                  <textarea
                    rows={3}
                    value={componentsInput}
                    onChange={(e) => setComponentsInput(e.target.value)}
                    placeholder="Arduino Uno: 1: 450&#10;HC-SR04 Sensor: 1&#10;Jumper Wires: 8: 40"
                    className="w-full px-3.5 py-2 bg-white border border-border rounded-xl text-xs font-mono text-navy focus:outline-hidden focus:border-primary leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-500">
                    💡 If component prices are added, they will be displayed in the lab BOM table.
                  </p>
                </div>

                {/* Pin Wiring */}
                <div className="sm:col-span-2 space-y-1 bg-slate-50/80 p-3.5 rounded-2xl border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-navy flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-primary" />
                      <span>Circuit Pin-to-Pin Wiring (Source Pin -&gt; Target Pin (Wire Note))</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">1 connection per line</span>
                  </div>
                  <textarea
                    rows={3}
                    value={wiringInput}
                    onChange={(e) => setWiringInput(e.target.value)}
                    placeholder="Sensor VCC -&gt; Arduino 5V (Red wire)&#10;Sensor GND -&gt; Arduino GND (Black wire)&#10;Sensor Trig -&gt; Arduino D9 (Trigger PWM)&#10;Sensor Echo -&gt; Arduino D10 (Echo Input)"
                    className="w-full px-3.5 py-2 bg-white border border-border rounded-xl text-xs font-mono text-navy focus:outline-hidden focus:border-primary leading-relaxed"
                  />
                </div>

                {/* Practical Source Code */}
                <div className="sm:col-span-2 space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-navy flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-primary" />
                      <span>Practical C++ / MicroPython Source Code</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Arduino C++ / MicroPython</span>
                  </div>
                  <textarea
                    rows={6}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="// Paste Arduino C++ or MicroPython experiment code here..."
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-cyan focus:outline-hidden focus:border-primary leading-relaxed"
                  />
                </div>

                {/* Troubleshooting Tips */}
                <div className="sm:col-span-2 space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-navy flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Troubleshooting &amp; Common Lab Fixes (1 per line)</span>
                    </label>
                  </div>
                  <textarea
                    rows={2}
                    value={tipsInput}
                    onChange={(e) => setTipsInput(e.target.value)}
                    placeholder="Verify power rails before switching on&#10;Check I2C address using I2C scanner code"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary"
                  />
                </div>

              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-navy rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4 text-slate-500" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover active:bg-primary text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingPractical ? 'Update Practical Lab' : 'Save to MongoDB'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

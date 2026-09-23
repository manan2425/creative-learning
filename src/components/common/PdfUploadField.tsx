'use client';

import React, { useState, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  FileText, 
  Upload, 
  Link as LinkIcon, 
  Trash2, 
  ExternalLink, 
  Check, 
  Loader2,
  FileCheck,
  Eye,
  RefreshCw
} from 'lucide-react';

interface PdfUploadFieldProps {
  pdfUrl?: string;
  pdfName?: string;
  onChange: (url: string, name?: string) => void;
  label?: string;
  description?: string;
}

export const PdfUploadField: React.FC<PdfUploadFieldProps> = ({
  pdfUrl = '',
  pdfName = '',
  onChange,
  label = 'Product Datasheet / Specification (1 PDF Document Allowed)',
  description = 'Upload an official PDF datasheet, pinout schematic guide, or manual. Customers can view or download it directly.',
}) => {
  const { uploadFile, showToast } = useStore();
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || (file.type && file.type.includes('pdf'));
    if (!isPdf) {
      alert('Please select a valid PDF file (.pdf)');
      return;
    }

    setIsUploading(true);
    try {
      // Read as base64 data URL
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const base64Data = await base64Promise;

      const res = await uploadFile(file, base64Data);
      if (res.success && res.url) {
        onChange(res.url, file.name);
      } else {
        onChange(base64Data, file.name);
      }
    } catch (err: any) {
      console.warn('PDF upload fallback error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) return;

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://') && !trimmedUrl.startsWith('data:application/pdf')) {
      alert('Please enter a valid PDF link starting with https://');
      return;
    }

    const displayName = nameInput.trim() || trimmedUrl.split('/').pop() || 'datasheet.pdf';
    onChange(trimmedUrl, displayName);
    setUrlInput('');
    setNameInput('');
    showToast('PDF Attached', 'Datasheet URL saved.', 'success');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('PDF Removed', 'Attached PDF document removed.', 'info');
  };

  return (
    <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-border">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-red-100 text-red-600 flex items-center justify-center font-bold text-[10px]">
              PDF
            </div>
            <label className="text-xs font-bold text-navy">{label}</label>
            {pdfUrl ? (
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Check className="w-3 h-3" /> Attached
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-slate-200 text-slate-600">
                Optional
              </span>
            )}
          </div>
          {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg text-[10px] font-bold border border-border shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              activeMode === 'upload'
                ? 'bg-primary text-white shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-navy'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload PDF</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              activeMode === 'url'
                ? 'bg-primary text-white shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-navy'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>PDF Link</span>
          </button>
        </div>
      </div>

      {/* Hidden PDF File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
        }}
      />

      {/* When PDF is attached */}
      {pdfUrl ? (
        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-navy truncate block">
                  {pdfName || 'Product_Technical_Datasheet.pdf'}
                </span>
                <span className="px-1.5 py-0.2 bg-red-100 text-red-700 text-[9px] font-mono font-bold rounded">
                  PDF
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate font-mono">
                {pdfUrl.startsWith('data:') ? 'Embedded PDF Document' : pdfUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {/* View PDF Button */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-primary rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Open and view PDF document"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View PDF</span>
            </a>

            {/* Replace Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Replace with another PDF"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>

            {/* Remove Button */}
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Remove attached PDF"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : activeMode === 'upload' ? (
        /* Upload Drag & Drop Box */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all bg-white ${
            dragOver
              ? 'border-red-400 bg-red-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-red-400 hover:bg-red-50/30'
          }`}
        >
          {isUploading ? (
            <div className="py-3 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
              <span className="text-xs font-bold text-navy">Processing PDF document...</span>
            </div>
          ) : (
            <div className="py-1 flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-navy block">
                  Click or drag &amp; drop to attach 1 PDF Datasheet / Guide
                </span>
                <p className="text-[11px] text-slate-400">
                  Select a PDF file from your phone storage or computer (.pdf up to 20MB)
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* URL Input Mode */
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="relative">
              <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                placeholder="https://example.com/datasheet.pdf"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary shadow-2xs"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Document Title (e.g. ESP32 Datasheet)"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary shadow-2xs"
              />
              <button
                type="button"
                onClick={() => handleAddUrl()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                Attach PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

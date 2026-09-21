'use client';

import React, { useState, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { compressImage } from '@/lib/imageCompressor';
import { 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  X, 
  Check, 
  Loader2,
  Camera,
  Smartphone,
  Trash2
} from 'lucide-react';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = 'Component / Product Image',
  description = 'Upload from device storage, capture with mobile camera, or paste an image URL.'
}) => {
  const { uploadImage, showToast } = useStore();
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, GIF)');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Client-side compress for fast mobile upload & serverless compatibility
      const compressedDataUrl = await compressImage(file, 1000, 1000, 0.85);
      
      // Immediately set the compressed data URL so the user sees it instantly
      onChange(compressedDataUrl);

      // 2. Also send to API (passing both file and compressed base64)
      const res = await uploadImage(file, compressedDataUrl);
      if (res.success && res.url) {
        onChange(res.url);
      }
    } catch (err: any) {
      console.warn('Upload fallback to compressed base64:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-navy">{label}</label>
        
        {/* Toggle Mode */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              activeMode === 'upload'
                ? 'bg-white text-primary shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-navy'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Upload from Device</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              activeMode === 'url'
                ? 'bg-white text-primary shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-navy'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {activeMode === 'upload' ? (
        <div className="space-y-3">
          {/* Drag & Drop / Click to Browse Box */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-primary bg-blue-50/70 scale-[1.01]'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileInputChange}
            />

            {isUploading ? (
              <div className="py-4 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="text-xs font-bold text-navy">Processing &amp; optimizing image...</span>
              </div>
            ) : value ? (
              <div className="flex items-center gap-4 justify-between py-1">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 border border-border shrink-0 shadow-2xs">
                    <img src={value} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left space-y-0.5 min-w-0">
                    <div className="text-xs font-bold text-success flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Image Attached
                    </div>
                    <p className="text-[10px] text-slate-500 truncate font-mono max-w-[200px] sm:max-w-xs">
                      {value.startsWith('data:') ? 'Optimized Device Photo' : value}
                    </p>
                    <span className="text-[10px] text-primary font-bold inline-block hover:underline">
                      Tap to replace photo
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClearImage}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="py-3 flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center border border-blue-100 shadow-2xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-navy">Tap or Click to choose image</span>
                  <p className="text-[10px] text-slate-400">
                    Works directly with mobile camera, photo gallery, or desktop files
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary focus:bg-white"
            />
          </div>
          {value && (
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-border">
              <img src={value} alt="Preview" className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0" />
              <span className="text-[11px] text-slate-600 truncate flex-1 font-mono">{value}</span>
            </div>
          )}
        </div>
      )}

      {description && <p className="text-[10px] text-slate-400">{description}</p>}
    </div>
  );
};

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
  Smartphone,
  Trash2,
  Star,
  Plus,
  ArrowLeftRight,
  Eye
} from 'lucide-react';

interface MultiImageUploadFieldProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  description?: string;
  maxImages?: number;
}

export const MultiImageUploadField: React.FC<MultiImageUploadFieldProps> = ({
  images = [],
  onChange,
  label = 'Product Photographs (Multiple Images Allowed)',
  description = 'Upload multiple high-resolution photos from device, camera, or paste image URLs. The first image will be the primary cover photo.',
  maxImages = 10,
}) => {
  const { uploadImage, showToast } = useStore();
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validImageFiles = fileArray.filter((f) => f.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      alert('Please select valid image files (PNG, JPG, WEBP, GIF)');
      return;
    }

    if (images.length + validImageFiles.length > maxImages) {
      showToast('Limit Notice', `Maximum ${maxImages} images allowed per product.`, 'warning');
    }

    const filesToProcess = validImageFiles.slice(0, maxImages - images.length);
    if (filesToProcess.length === 0) return;

    setIsUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of filesToProcess) {
        try {
          // 1. Client-side compress for fast mobile upload & serverless storage
          const compressedDataUrl = await compressImage(file, 1000, 1000, 0.85);
          
          // 2. Upload to server
          const res = await uploadImage(file, compressedDataUrl);
          if (res.success && res.url) {
            newImageUrls.push(res.url);
          } else {
            newImageUrls.push(compressedDataUrl);
          }
        } catch (err) {
          console.warn('Individual image processing error:', err);
        }
      }

      if (newImageUrls.length > 0) {
        onChange([...images, ...newImageUrls]);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image')) {
      alert('Please enter a valid image URL starting with https://');
      return;
    }

    if (images.length >= maxImages) {
      showToast('Limit Reached', `Maximum ${maxImages} images allowed.`, 'warning');
      return;
    }

    onChange([...images, trimmed]);
    setUrlInput('');
    showToast('Photo Added', 'Image URL added to gallery.', 'success');
  };

  const handleRemoveImage = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetMainPhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    const selected = images[index];
    const rest = images.filter((_, idx) => idx !== index);
    onChange([selected, ...rest]);
    showToast('Primary Photo Set', 'Main cover image updated.', 'success');
  };

  return (
    <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-border">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <label className="text-xs font-bold text-navy">{label}</label>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-blue-50 text-primary border border-blue-200">
              {images.length} / {maxImages} Photos
            </span>
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
            <Smartphone className="w-3 h-3" />
            <span>Upload Photos</span>
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
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
        }}
      />

      {/* Image Gallery Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-1">
          {images.map((imgUrl, index) => {
            const isMain = index === 0;
            return (
              <div
                key={index}
                className={`group relative aspect-square rounded-xl overflow-hidden bg-white border-2 shadow-2xs transition-all ${
                  isMain 
                    ? 'border-amber-400 ring-2 ring-amber-400/20' 
                    : 'border-slate-200 hover:border-primary/60'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Product photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Main Photo Badge */}
                {isMain ? (
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-amber-500 text-white rounded-md text-[9px] font-mono font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    <span>MAIN</span>
                  </div>
                ) : (
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-navy/80 text-white rounded-md text-[9px] font-mono font-bold shadow-sm">
                    #{index + 1}
                  </div>
                )}

                {/* Overlay Action Buttons */}
                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                  {!isMain && (
                    <button
                      type="button"
                      onClick={(e) => handleSetMainPhoto(index, e)}
                      className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer w-full justify-center"
                      title="Make this the primary photo"
                    >
                      <Star className="w-3 h-3 fill-white" />
                      <span>Set Main</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleRemoveImage(index, e)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer w-full justify-center"
                    title="Delete this photo"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Append More Photos Button */}
          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-primary hover:bg-blue-50/50 bg-white flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-primary transition-all cursor-pointer shadow-2xs"
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-bold font-heading">Add Photo</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Upload Box (when empty) */}
      {images.length === 0 && activeMode === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all bg-white ${
            dragOver
              ? 'border-primary bg-blue-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-primary hover:bg-slate-50'
          }`}
        >
          {isUploading ? (
            <div className="py-4 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="text-xs font-bold text-navy">Processing &amp; optimizing photographs...</span>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center border border-blue-100 shadow-2xs">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-navy block">
                  Click to select multiple photographs or drag &amp; drop
                </span>
                <p className="text-[11px] text-slate-400">
                  Select 1 to {maxImages} images directly from your phone gallery, camera, or desktop
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL Input Mode */}
      {activeMode === 'url' && (
        <div className="space-y-2 pt-1">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/... or image link"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
                className="w-full pl-9 pr-4 py-2 bg-white border border-border rounded-xl text-xs text-navy focus:outline-hidden focus:border-primary shadow-2xs"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAddUrl()}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

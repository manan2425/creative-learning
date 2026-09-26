'use client';

import React, { useState, useEffect } from 'react';
import { Star, X, Check, Sparkles } from 'lucide-react';

interface RatingChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemType: 'Component' | 'Starter Kit' | 'Engineering Project';
  initialRating: number;
  initialReviewsCount: number;
  onSave: (newRating: number, newReviewsCount: number) => Promise<void>;
}

export const RatingChangeModal: React.FC<RatingChangeModalProps> = ({
  isOpen,
  onClose,
  itemTitle,
  itemType,
  initialRating,
  initialReviewsCount,
  onSave,
}) => {
  const [rating, setRating] = useState<number>(initialRating || 4.8);
  const [reviewsCount, setReviewsCount] = useState<number>(initialReviewsCount || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating || 4.8);
      setReviewsCount(initialReviewsCount || 0);
    }
  }, [isOpen, initialRating, initialReviewsCount]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(Number(rating), Number(reviewsCount));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-navy/80 backdrop-blur-xs transition-opacity cursor-pointer z-0"
        aria-hidden="true"
      />

      {/* Dialog */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-border w-full max-w-md overflow-hidden p-6 space-y-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono block">
              Admin Rating Controller • {itemType}
            </span>
            <h3 className="font-extrabold text-base sm:text-lg text-navy line-clamp-1 mt-0.5">
              {itemTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Interactive Star Preview */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="cursor-pointer transition-transform hover:scale-110 active:scale-95 p-1"
                >
                  <Star 
                    className={`w-7 h-7 ${
                      star <= Math.round(rating)
                        ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-xs text-amber-900 font-semibold font-mono">
              Live Storefront Preview: <strong className="text-base text-amber-700 font-bold">{Number(rating).toFixed(1)}</strong> ★ ({reviewsCount} reviews)
            </div>
          </div>

          {/* Numeric Rating Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-navy flex items-center justify-between">
              <span>Customer Rating (1.0 to 5.0)</span>
              <span className="text-slate-400 font-mono text-[11px]">Step: 0.1</span>
            </label>
            <input
              type="number"
              min="1.0"
              max="5.0"
              step="0.1"
              required
              value={rating}
              onChange={(e) => setRating(Math.min(5, Math.max(1, parseFloat(e.target.value) || 1)))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-sm font-mono font-bold text-navy focus:outline-hidden focus:border-primary"
            />
          </div>

          {/* Reviews Count Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-navy flex items-center justify-between">
              <span>Verified Customer Reviews Count</span>
              <span className="text-slate-400 font-mono text-[11px]">Number of ratings</span>
            </label>
            <input
              type="number"
              min="0"
              required
              value={reviewsCount}
              onChange={(e) => setReviewsCount(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-border rounded-xl text-sm font-mono font-bold text-navy focus:outline-hidden focus:border-primary"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-secondary hover:text-navy hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Update Rating'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

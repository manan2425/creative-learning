'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
          info: <Info className="w-5 h-5 text-primary shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
          error: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
        };

        const borderColors = {
          success: 'border-success/30 bg-white',
          info: 'border-primary/30 bg-white',
          warning: 'border-warning/30 bg-white',
          error: 'border-red-300 bg-white',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border ${borderColors[toast.type]} animate-fade-in text-navy`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-sm leading-tight text-navy">{toast.title}</h5>
              <p className="text-xs text-secondary mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-navy p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

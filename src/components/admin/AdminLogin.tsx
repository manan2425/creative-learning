'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  Sparkles
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Please enter the administrator password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Save session
        if (rememberMe) {
          localStorage.setItem('cl_admin_token', data.token);
          localStorage.setItem('cl_admin_auth_time', Date.now().toString());
        } else {
          sessionStorage.setItem('cl_admin_token', data.token);
        }
        onLoginSuccess();
      } else {
        setErrorMessage(data.error || 'Incorrect password. Please verify and try again.');
      }
    } catch (err) {
      setErrorMessage('Network error during authentication. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-cyan/30 selection:text-white">
      {/* Background Circuit Grid & Lighting Effects */}
      <div className="absolute inset-0 bg-circuit-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan/15 rounded-full blur-3xl pointer-events-none" />

      {/* Card Container */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand Header & Logo Emblem */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-lg shadow-primary/25 border border-white/20 overflow-hidden group">
            <Image 
              src="/logo-emblem.png" 
              alt="Creative Learning Logo" 
              width={64} 
              height={64} 
              className="w-full h-full object-contain"
              priority
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/15 text-cyan text-[11px] font-mono font-bold border border-cyan/30 mb-2">
              <Lock className="w-3 h-3 text-cyan" />
              <span>SECURE ACCESS PORTAL</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight">
              Creative<span className="text-cyan">Learning</span> Admin
            </h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Enter master administrator password to manage inventory, starter kits, lab practicals, website CMS, and customer orders.
            </p>
          </div>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-400 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan" />
                Admin Master Password
              </span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Enter password..."
                className="w-full pl-4 pr-11 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 font-mono focus:outline-hidden focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-cyan focus:ring-cyan cursor-pointer"
              />
              <span>Remember session on this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-3.5 bg-gradient-to-r from-primary via-blue-600 to-cyan hover:from-primary-hover hover:to-cyan-light text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Authenticate &amp; Enter Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation & Security */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Store</span>
          </Link>

          <span className="text-[11px] text-slate-500 font-mono">
            Creative Learning v1.0
          </span>
        </div>

      </div>

      {/* Security Footer Notice */}
      <div className="mt-6 text-center text-xs text-slate-500 flex items-center gap-1.5 relative z-10">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Protected by Creative Learning Session Encryption</span>
      </div>
    </div>
  );
};

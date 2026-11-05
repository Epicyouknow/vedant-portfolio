'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('Owner@vedantverse.in');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Authentication failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Store client session information
      try {
        localStorage.setItem('vedant_admin_user', JSON.stringify(data.user));
        localStorage.setItem('vedant_admin_role', data.user.role);
      } catch (e) {
        console.error(e);
      }

      // Redirect to dashboard
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      setErrorMessage('Network or server error. Please try again.');
      setLoading(false);
    }
  };

  const handleSelectAccount = (presetEmail: string) => {
    setEmail(presetEmail);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EC] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 selection:bg-[#ED463B] selection:text-white">
      {/* Brand & Security Header */}
      <div className="w-full max-w-md text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group cursor-pointer mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#191919] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-black/10 transition-transform duration-200 group-hover:scale-105">
            V
          </div>
          <div className="text-left">
            <div className="text-lg font-bold tracking-tight text-[#191919]">VedantVerse</div>
            <div className="text-[11px] font-mono tracking-wider uppercase text-[#737373] font-semibold">
              CMS Command Centre
            </div>
          </div>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[#191919]">
          Sign in to administration
        </h1>
        <p className="text-xs text-[#737373] mt-1.5 max-w-sm mx-auto">
          Secure management console controlling live case studies, performance metrics, and client directories.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl p-7 sm:p-9 shadow-xl shadow-black/5 border border-[#E5E0D6] space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-[#ED463B] shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#191919]">
              Authorized Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A3A3A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Owner@vedantverse.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] text-sm text-[#191919] focus:outline-none focus:border-[#ED463B] focus:ring-2 focus:ring-[#ED463B]/20 transition-all font-medium"
              />
            </div>
          </div>

          {/* Quick Select Pill Buttons for Authorized Accounts */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[10px] font-mono uppercase text-[#737373] font-semibold tracking-wider">
              Quick select:
            </span>
            <button
              type="button"
              onClick={() => handleSelectAccount('Owner@vedantverse.in')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border ${
                email.toLowerCase() === 'owner@vedantverse.in'
                  ? 'bg-[#191919] text-white border-[#191919]'
                  : 'bg-[#FAF8F5] text-[#525252] border-[#E5E0D6] hover:bg-stone-100'
              }`}
            >
              Owner
            </button>
            <button
              type="button"
              onClick={() => handleSelectAccount('Partner@vedantverse.in')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border ${
                email.toLowerCase() === 'partner@vedantverse.in'
                  ? 'bg-[#191919] text-white border-[#191919]'
                  : 'bg-[#FAF8F5] text-[#525252] border-[#E5E0D6] hover:bg-stone-100'
              }`}
            >
              Partner
            </button>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#191919]">
                Password
              </label>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-[#A3A3A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] text-sm text-[#191919] focus:outline-none focus:border-[#ED463B] focus:ring-2 focus:ring-[#ED463B]/20 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#191919] transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#ED463B] text-white font-semibold text-sm shadow-md shadow-[#ED463B]/20 hover:bg-[#D9382E] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <>
                <span>Sign In to Command Centre</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="pt-4 border-t border-[#E5E0D6] flex items-center justify-between text-[11px] text-[#737373]">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            256-bit HMAC Protected
          </span>
          <span className="font-mono text-[10px]">v2.6 Live CMS</span>
        </div>
      </div>

      {/* Return to Public Website */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs font-semibold text-[#737373] hover:text-[#191919] transition-colors inline-flex items-center gap-1.5"
        >
          <span>← Return to public website</span>
        </Link>
      </div>
    </div>
  );
}


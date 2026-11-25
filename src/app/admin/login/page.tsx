'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Key,
  ShieldCheck,
  Check,
  RefreshCw,
  AlertTriangle,
  Lock,
  Clock3,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Send,
  LogOut,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { RateLimitData, RATE_LIMIT_TIERS } from '@/lib/securityTypes';

interface SessionUser {
  name: string;
  email: string;
  role: string;
}

export default function AdminLoginPage() {
  const router = useRouter();

  // Primary mode is 'credentials' (Email + Password + 15-Day Remember Me)
  // Which smoothly advances to 'otp' (2FA 4-Digit Code Confirmation)
  const [mode, setMode] = useState<'credentials' | 'otp' | 'setup_password'>('credentials');
  const [animState, setAnimState] = useState<'idle' | 'constellation' | 'bloom'>('idle');
  const [email, setEmail] = useState('Owner@vedantverse.in');
  const [digits, setDigits] = useState(['', '', '', '']);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // Default 15 days
  const [errorMsg, setErrorMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeSessionUser, setActiveSessionUser] = useState<SessionUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Rate limit state
  const [rateLimit, setRateLimit] = useState<RateLimitData>({
    stage: 1,
    attemptsRemaining: 5,
    maxAttempts: 5,
    isLocked: false,
    lockoutExpiry: null,
    isBlocked: false,
  });
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState(0);

  // Setup password modal state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setupOtp, setSetupOtp] = useState('');
  const [pwdSetupSuccess, setPwdSetupSuccess] = useState(false);
  const [pwdSetupError, setPwdSetupError] = useState('');

  const inputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  // Check active session & rate limit on mount
  useEffect(() => {
    checkActiveSession();
    fetchRateLimit(email);
  }, [email]);

  const checkActiveSession = async () => {
    try {
      // Don't auto-divert if user specifically passed ?reauth=1 or ?switch=1
      const params = new URLSearchParams(window.location.search);
      if (params.get('reauth') === '1' || params.get('switch') === '1') {
        setActiveSessionUser(null);
        setCheckingSession(false);
        return;
      }

      const res = await fetch('/api/admin/session');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setActiveSessionUser(data.user);
      } else {
        setActiveSessionUser(null);
      }
    } catch {
      setActiveSessionUser(null);
    } finally {
      setCheckingSession(false);
    }
  };

  const fetchRateLimit = async (targetEmail: string) => {
    try {
      const res = await fetch(`/api/admin/rate-limit?email=${encodeURIComponent(targetEmail)}`);
      const data = await res.json();
      if (data.success && data.rateLimit) {
        setRateLimit(data.rateLimit);
      }
    } catch (e) {
      console.error('Error fetching rate limit:', e);
    }
  };

  // Lockout countdown timer
  useEffect(() => {
    if (rateLimit.isLocked && rateLimit.lockoutExpiry) {
      const updateLockout = () => {
        const remaining = Math.max(0, Math.ceil((rateLimit.lockoutExpiry! - Date.now()) / 1000));
        setLockoutRemainingSeconds(remaining);
        if (remaining <= 0) {
          fetchRateLimit(email);
        }
      };
      updateLockout();
      const interval = setInterval(updateLockout, 1000);
      return () => clearInterval(interval);
    }
  }, [rateLimit.isLocked, rateLimit.lockoutExpiry, email]);

  // Auto-focus first input when entering OTP mode
  useEffect(() => {
    if (mode === 'otp' && animState === 'idle' && !rateLimit.isLocked && !rateLimit.isBlocked && !activeSessionUser) {
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [mode, animState, rateLimit.isLocked, rateLimit.isBlocked, activeSessionUser]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5500);
  };

  // Step 1: Submit Password -> Validates credentials, dispatches real OTP, advances to Step 2
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rateLimit.isBlocked || rateLimit.isLocked) return;
    if (!passwordInput.trim()) return;

    setLoading(true);
    setIsError(false);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: passwordInput, rememberMe }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setIsError(true);
        if (data.rateLimit) {
          setRateLimit(data.rateLimit);
        }
        setErrorMsg(data.error || 'Authentication failed. Please check your credentials.');
        return;
      }

      // If requireOtp is returned (2FA flow):
      if (data.requireOtp) {
        setDigits(['', '', '', '']);
        setCountdown(30);
        if (data.rateLimit) setRateLimit(data.rateLimit);
        setMode('otp');
        showToast('📧 Single-use 4-digit security code dispatched to contactvedantverse@gmail.com & Telegram @Vedantversebot');
        return;
      }

      // If direct login was granted:
      await playSuccessAnimationAndLogin(data.user);
    } catch {
      setLoading(false);
      setIsError(true);
      setErrorMsg('Network error during authentication.');
    }
  };

  // Direct OTP Request (without password)
  const handleDirectOtpRequest = async () => {
    setLoading(true);
    setIsError(false);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setIsError(true);
        setErrorMsg(data.error || 'Failed to dispatch security code.');
        if (data.rateLimit) setRateLimit(data.rateLimit);
        return;
      }

      setMode('otp');
      setDigits(['', '', '', '']);
      setCountdown(30);
      if (data.rateLimit) setRateLimit(data.rateLimit);
      showToast(`📧 Single-use 4-digit OTP dispatched to contactvedantverse@gmail.com & Telegram @Vedantversebot`);
    } catch {
      setLoading(false);
      setIsError(true);
      setErrorMsg('Network error. Unable to contact authentication server.');
    }
  };

  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (!clean && val !== '') return;

    const newDigits = [...digits];
    newDigits[index] = clean.slice(-1);
    setDigits(newDigits);
    setIsError(false);
    setErrorMsg('');

    if (clean && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 4 digits are entered
    if (clean && index === 3 && newDigits.every((d) => d !== '')) {
      setTimeout(() => {
        handleSubmitOtpWithDigits(newDigits);
      }, 50);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current?.focus();
    } else if (e.key === 'Enter' && digits.join('').length === 4) {
      handleSubmitOtp();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (pasted.length > 0) {
      const nextDigits = ['', '', '', ''];
      for (let i = 0; i < 4; i++) {
        nextDigits[i] = pasted[i] || '';
      }
      setDigits(nextDigits);
      setIsError(false);
      setErrorMsg('');
      const focusIndex = Math.min(pasted.length, 3);
      inputRefs[focusIndex].current?.focus();

      if (pasted.length === 4) {
        setTimeout(() => {
          handleSubmitOtpWithDigits(nextDigits);
        }, 100);
      }
    }
  };

  // Play approved 2-phase animation: Constellation X -> Bloom Success Ripple
  const playSuccessAnimationAndLogin = async (userData?: any) => {
    setAnimState('constellation');
    setLoading(false);

    // Phase 1: Constellation 2x2 with glowing emerald X lines & pulsating core (1200ms)
    await new Promise((r) => setTimeout(r, 1200));

    // Phase 2: Bloom Success Ripple with glowing badge (900ms)
    setAnimState('bloom');
    await new Promise((r) => setTimeout(r, 900));

    // Phase 3: Store local admin metadata and redirect
    if (userData) {
      try {
        localStorage.setItem('vedant_admin_user', JSON.stringify(userData));
        localStorage.setItem('vedant_admin_role', userData.role);
      } catch (e) {}
    }

    window.location.href = '/admin/dashboard';
  };

  const handleSubmitOtp = () => {
    handleSubmitOtpWithDigits(digits);
  };

  const handleSubmitOtpWithDigits = async (inputDigits: string[]) => {
    if (rateLimit.isBlocked || rateLimit.isLocked) return;

    const code = inputDigits.join('');
    if (code.length < 4) return;

    setLoading(true);
    setIsError(false);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoading(false);
        setIsError(true);
        if (data.rateLimit) {
          setRateLimit(data.rateLimit);
        }
        setErrorMsg(data.error || 'Invalid 4-digit code.');
        inputRefs[0].current?.focus();
        return;
      }

      // Success: auto-reset rate limits and trigger constellation animation!
      setRateLimit({
        stage: 1,
        attemptsRemaining: 5,
        maxAttempts: 5,
        isLocked: false,
        lockoutExpiry: null,
        isBlocked: false,
      });

      await playSuccessAnimationAndLogin(data.user);
    } catch {
      setLoading(false);
      setIsError(true);
      setErrorMsg('Network error verifying code. Please try again.');
    }
  };

  const handleSimulatePass = async () => {
    try {
      const res = await fetch('/api/admin/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate_pass', email }),
      });
      const data = await res.json();
      if (data.success) {
        setRateLimit(data.rateLimit);
        setIsError(false);
        setErrorMsg('');
        setDigits(['', '', '', '']);
        showToast('⚡ Simulated 6 hours passed. Escalated to next ladder stage.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminUnlock = async () => {
    try {
      const res = await fetch('/api/admin/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'admin_unlock', email }),
      });
      const data = await res.json();
      if (data.success) {
        setRateLimit(data.rateLimit);
        setIsError(false);
        setErrorMsg('');
        setDigits(['', '', '', '']);
        showToast('🔓 Super Admin Emergency Unlock applied. Reset to Chance 1 (5 attempts).');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOutAndReauth = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    try {
      localStorage.removeItem('vedant_admin_user');
      localStorage.removeItem('vedant_admin_role');
    } catch (e) {}

    setActiveSessionUser(null);
    setDigits(['', '', '', '']);
    setPasswordInput('');
    setIsError(false);
    setErrorMsg('');
    setLoading(false);
    setMode('credentials');
    showToast('Signed out of previous session. Please enter your credentials.');
  };

  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPwdSetupError('Password must be at least 8 characters.');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setPwdSetupError('Password must contain at least one number (0-9).');
      return;
    }
    if (!/[!@#$%^&*]/.test(newPassword)) {
      setPwdSetupError('Password must contain at least one special symbol (!@#$%^&*).');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdSetupError('Passwords do not match.');
      return;
    }
    if (!setupOtp.trim()) {
      setPwdSetupError('Authorization 4-digit OTP is required.');
      return;
    }

    try {
      const res = await fetch('/api/admin/password/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, otp: setupOtp.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPwdSetupError(data.error || 'Failed to configure password.');
        return;
      }

      setPwdSetupSuccess(true);
      setPwdSetupError('');
      setTimeout(() => {
        setPwdSetupSuccess(false);
        setMode('credentials');
        setPasswordInput(newPassword);
      }, 1500);
    } catch {
      setPwdSetupError('Network error updating password.');
    }
  };

  const formatLockoutTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const maskedEmail = useMemo(() => {
    return 'contactvedantverse@gmail.com'.replace(/(^.{2})(.*)(@.*$)/, '$1••••••$3');
  }, []);

  return (
    <div className="vv-otp-page selection:bg-[#ED463B] selection:text-white">
      {/* Real Live Notification Toast */}
      {toastMsg && (
        <div className="fixed top-5 z-50 px-4 py-3 rounded-xl bg-[#191919] text-white text-xs flex items-center gap-3 shadow-2xl border border-white/10 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#ED463B]" />
          <span className="font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Brand Header */}
      <div className="w-full max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-3 group cursor-pointer mb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#191919] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-black/10 transition-transform duration-200 group-hover:scale-105">
            V
          </div>
          <div className="text-left">
            <div className="text-lg font-bold tracking-tight text-[#191919] dark:text-white">
              VedantVerse
            </div>
            <div className="text-[10px] font-mono tracking-wider uppercase text-[#737373] font-semibold">
              CMS Command Centre Security
            </div>
          </div>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[#191919] dark:text-white">
          Sign in to administration
        </h1>
        <p className="text-xs text-[#737373] mt-1 max-w-sm mx-auto">
          Secure management console controlling live case studies, performance metrics, and client directories.
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="vv-otp-card">
        {/* BLOOM SUCCESS VIEW */}
        {animState === 'bloom' ? (
          <div className="bloom-success-view">
            <div className="bloom-circle-badge">
              <Check size={44} color="#ffffff" strokeWidth={3.5} />
            </div>
            <h2 className="bloom-title">You're verified</h2>
            <p className="bloom-sub">
              <Sparkles size={14} /> Redirecting to CMS Command Centre...
            </p>
          </div>
        ) : rateLimit.isBlocked ? (
          /* BLOCKED SCREEN (After Chance 5 exhausted) */
          <div className="lockout-box">
            <div className="lockout-icon blocked">
              <Lock size={32} />
            </div>
            <h2 className="lockout-title text-red-600 dark:text-red-400">Account Blocked</h2>
            <p className="lockout-sub">
              All 5 security chances (15 attempts across 30 hours) have been exhausted.
              For enterprise security, this account is locked from signing in.
            </p>

            {/* 6-Card Ladder Matrix */}
            <div className="ladder-ladder-matrix">
              {[1, 2, 3, 4, 5, 6].map((stg) => (
                <div key={stg} className={`ladder-tier-step ${stg <= 5 ? 'done' : 'blocked'}`}>
                  <div>{stg === 6 ? 'BLOCKED' : `Chance ${stg}`}</div>
                  <div style={{ fontSize: '9px', marginTop: '2px' }}>
                    {stg === 6 ? 'Locked' : '0 att'}
                  </div>
                </div>
              ))}
            </div>

            <div className="ladder-auto-reset-rule" style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', borderColor: 'rgba(239,68,68,0.25)' }}>
              🔒 <b>Admin Protection Active:</b> Contact Super Administrator at <b>contactvedantverse@gmail.com</b> to unlock.
            </div>

            <div className="lockout-actions-row">
              <button
                className="w-full h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                onClick={handleAdminUnlock}
              >
                <Lock className="w-3.5 h-3.5" /> 🔓 Admin Emergency Unblock
              </button>
            </div>
          </div>
        ) : rateLimit.isLocked ? (
          /* 6-HOUR LOCKOUT SCREEN */
          <div className="lockout-box">
            <div className="lockout-icon">
              <Clock3 size={32} />
            </div>
            <h2 className="lockout-title">Account Locked (6-Hour Window)</h2>
            <p className="lockout-sub">
              You have exhausted all {rateLimit.maxAttempts} attempts for <b>Chance {rateLimit.stage}</b>.
              Please wait for the 6-hour security cooldown before trying again.
            </p>

            <div className="lockout-timer-pill">
              <Clock3 size={16} /> Cooldown remaining: {formatLockoutTime(lockoutRemainingSeconds)}
            </div>

            {/* 6-Card Ladder Matrix */}
            <div className="ladder-ladder-matrix">
              {[1, 2, 3, 4, 5, 6].map((stg) => {
                const tier = RATE_LIMIT_TIERS[stg];
                const isPast = rateLimit.stage > stg;
                const isCurrent = rateLimit.stage === stg;
                let cls = 'ladder-tier-step';
                if (isPast) cls += ' done';
                if (isCurrent) cls += ' current';

                return (
                  <div key={stg} className={cls}>
                    <div>{stg === 6 ? 'BLOCKED' : `Chance ${stg}`}</div>
                    <div style={{ fontSize: '9px', marginTop: '2px' }}>
                      {stg === 6 ? 'Locked' : `${tier.maxAttempts} att`}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="ladder-auto-reset-rule">
              ✓ <b>Auto-Reset Rule:</b> A single successful 4-digit OTP or verified password authentication resets attempts and stages immediately back to Chance 1 (5 attempts).
            </div>

            <div className="lockout-actions-row">
              <button
                className="flex-1 h-9 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-[11px] hover:bg-stone-300 transition-colors cursor-pointer"
                onClick={handleSimulatePass}
                title="Fast forward 6 hours to test the next chance (5 -> 4 -> 3 -> 2 -> 1 -> Blocked)"
              >
                ⚡ Simulate 6-Hr Pass
              </button>
              <button
                className="flex-1 h-9 rounded-lg bg-[#ED463B] text-white font-bold text-[11px] hover:bg-[#D94035] transition-colors cursor-pointer"
                onClick={handleAdminUnlock}
                title="Super Admin override to reset attempts"
              >
                🔓 Admin Unlock
              </button>
            </div>
          </div>
        ) : activeSessionUser ? (
          /* ACTIVE 15-DAY SESSION BANNER */
          <div className="text-left space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>15-Day Remembered Session Active</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-200 font-bold">
                  Verified
                </span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-4 leading-relaxed">
                You are currently signed in as <b>{activeSessionUser.name}</b> (<code>{activeSessionUser.email}</code>). Your device is remembered for 15 days.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="/admin/dashboard"
                  className="flex-1 py-2 px-4 rounded-xl bg-[#191919] hover:bg-black text-white font-bold text-xs text-center shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  Enter Command Centre <ExternalLink size={12} />
                </a>
                <button
                  type="button"
                  onClick={handleSignOutAndReauth}
                  disabled={loading}
                  className="py-2 px-3 rounded-xl bg-white dark:bg-stone-800 border border-emerald-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-stone-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogOut size={12} /> Sign out / Re-login
                </button>
              </div>
            </div>
          </div>
        ) : mode === 'setup_password' ? (
          /* PASSWORD SETUP VIEW */
          <div className="text-left">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setMode('credentials')}
                className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <h3 className="font-bold text-sm text-[#191919] dark:text-white">
                Configure Master Password
              </h3>
            </div>
            <p className="text-xs text-[#737373] mb-4">
              Set a master password for <b>{maskedEmail}</b>. Requires single-use 4-digit OTP authorization.
            </p>

            {pwdSetupSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs mb-3 flex items-center gap-2 font-medium">
                <Check size={14} /> Password successfully configured! Switching to sign-in...
              </div>
            )}
            {pwdSetupError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-800 text-xs mb-3 flex items-center gap-2 font-medium">
                <AlertTriangle size={14} /> {pwdSetupError}
              </div>
            )}

            <form onSubmit={handleSaveNewPassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter 8+ char password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E5E0D6] bg-[#FAF8F5] dark:bg-stone-900 text-xs text-[#191919] dark:text-white focus:outline-none focus:border-[#ED463B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E5E0D6] bg-[#FAF8F5] dark:bg-stone-900 text-xs text-[#191919] dark:text-white focus:outline-none focus:border-[#ED463B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                  Authorization 4-Digit OTP (Sent to Admin Gmail)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="Enter code"
                    value={setupOtp}
                    onChange={(e) => setSetupOtp(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg border border-[#E5E0D6] bg-[#FAF8F5] dark:bg-stone-900 text-xs text-[#191919] dark:text-white focus:outline-none focus:border-[#ED463B]"
                  />
                  <button
                    type="button"
                    onClick={handleDirectOtpRequest}
                    className="px-3 h-9 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-[11px] font-semibold hover:bg-stone-200 cursor-pointer"
                  >
                    Send OTP
                  </button>
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div className="pwd-checklist">
                <div className={`pwd-item ${newPassword.length >= 8 ? 'valid' : ''}`}>
                  <Check size={12} /> Minimum 8 characters
                </div>
                <div className={`pwd-item ${/[0-9]/.test(newPassword) ? 'valid' : ''}`}>
                  <Check size={12} /> At least one number (0-9)
                </div>
                <div className={`pwd-item ${/[!@#$%^&*]/.test(newPassword) ? 'valid' : ''}`}>
                  <Check size={12} /> At least one special symbol (!@#$%^&*)
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-[#191919] text-white font-bold text-xs hover:bg-black transition-colors cursor-pointer mt-2"
              >
                Save &amp; Enable Password
              </button>
            </form>
          </div>
        ) : mode === 'credentials' ? (
          /* STEP 1: CREDENTIALS (EMAIL + PASSWORD + REMEMBER ME CHECKBOX) */
          <div className="text-left space-y-5">
            {/* Error message */}
            {isError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-[#ED463B] shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Authorized Email field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#191919] dark:text-stone-200">
                  Authorized Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A3A3A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsError(false);
                      setErrorMsg('');
                    }}
                    placeholder="Owner@vedantverse.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E0D6] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-900 text-sm text-[#191919] dark:text-white focus:outline-none focus:border-[#ED463B] focus:ring-2 focus:ring-[#ED463B]/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Quick Select Pill Buttons */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[10px] font-mono uppercase text-[#737373] font-semibold tracking-wider">
                  Quick select:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('Owner@vedantverse.in');
                    setIsError(false);
                    setErrorMsg('');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border cursor-pointer ${
                    email.toLowerCase() === 'owner@vedantverse.in'
                      ? 'bg-[#191919] text-white border-[#191919]'
                      : 'bg-[#FAF8F5] dark:bg-stone-900 text-[#525252] dark:text-stone-300 border-[#E5E0D6] dark:border-stone-800 hover:bg-stone-100'
                  }`}
                >
                  Owner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('Partner@vedantverse.in');
                    setIsError(false);
                    setErrorMsg('');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border cursor-pointer ${
                    email.toLowerCase() === 'partner@vedantverse.in'
                      ? 'bg-[#191919] text-white border-[#191919]'
                      : 'bg-[#FAF8F5] dark:bg-stone-900 text-[#525252] dark:text-stone-300 border-[#E5E0D6] dark:border-stone-800 hover:bg-stone-100'
                  }`}
                >
                  Partner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('contactvedantverse@gmail.com');
                    setIsError(false);
                    setErrorMsg('');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border cursor-pointer ${
                    email.toLowerCase() === 'contactvedantverse@gmail.com'
                      ? 'bg-[#191919] text-white border-[#191919]'
                      : 'bg-[#FAF8F5] dark:bg-stone-900 text-[#525252] dark:text-stone-300 border-[#E5E0D6] dark:border-stone-800 hover:bg-stone-100'
                  }`}
                >
                  Gmail
                </button>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#191919] dark:text-stone-200">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#A3A3A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setIsError(false);
                      setErrorMsg('');
                    }}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#E5E0D6] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-900 text-sm text-[#191919] dark:text-white focus:outline-none focus:border-[#ED463B] focus:ring-2 focus:ring-[#ED463B]/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#191919] dark:hover:text-white transition-colors p-1 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 15-DAY REMEMBER ME CHECKBOX */}
              <div className="flex items-center justify-between text-xs px-0.5 pt-1 text-stone-600 dark:text-stone-300">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#ED463B] cursor-pointer"
                  />
                  <span className="font-semibold text-xs text-[#191919] dark:text-white">
                    Remember this device for 15 days
                  </span>
                </label>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold border border-stone-200 dark:border-stone-700">
                  15-day session
                </span>
              </div>

              {/* Rate limit status badge */}
              <div className={`rate-limit-badge ${rateLimit.attemptsRemaining <= 2 ? 'danger' : rateLimit.attemptsRemaining <= 3 ? 'warning' : ''}`}>
                <ShieldCheck size={13} /> Chance {rateLimit.stage} of 5 · {rateLimit.attemptsRemaining} of {rateLimit.maxAttempts} attempts left
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !passwordInput}
                className="w-full py-3 px-4 rounded-xl bg-[#ED463B] text-white font-semibold text-sm shadow-md shadow-[#ED463B]/20 hover:bg-[#D9382E] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Validating &amp; Sending OTP...
                  </span>
                ) : (
                  <>
                    <span>Sign In to Command Centre</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Direct OTP / Reset Password Links */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs border-t border-[#E5E0D6] dark:border-stone-800">
              <button
                type="button"
                onClick={handleDirectOtpRequest}
                className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 underline cursor-pointer"
              >
                Sign in with 4-Digit OTP without password →
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('setup_password');
                  setIsError(false);
                  setErrorMsg('');
                }}
                className="text-[#ED463B] hover:text-[#D94035] font-semibold underline cursor-pointer"
              >
                Set up / Reset Password
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: 4-DIGIT OTP CONFIRMATION SCREEN WITH CONSTELLATION X ANIMATION */
          <>
            {/* Top Mail Badge with Red Unread Dot */}
            <div className="vv-mail-badge">
              <Mail size={24} />
              <span className="unread-dot" />
            </div>

            {/* Title & Subtitle */}
            <h2 className="vv-otp-title">Check your inbox</h2>
            <p className="vv-otp-sub">
              Enter the 4-digit code sent to<br />
              <span className="email-target">contactvedantverse@gmail.com &amp; Telegram</span>
            </p>

            {/* Live routing badge */}
            <div className="vv-routing-pill">
              <ShieldCheck size={14} /> Real OTP dispatched to: <b>contactvedantverse@gmail.com</b> &amp; Telegram @Vedantversebot
            </div>

            {/* Rate limit status badge */}
            <div>
              <div className={`rate-limit-badge ${rateLimit.attemptsRemaining <= 2 ? 'danger' : rateLimit.attemptsRemaining <= 3 ? 'warning' : ''}`}>
                <ShieldCheck size={13} /> Chance {rateLimit.stage} of 5 · {rateLimit.attemptsRemaining} of {rateLimit.maxAttempts} attempts left
              </div>
            </div>

            {/* 4 Digit Inputs with Constellation X Morphing */}
            <div className="constellation-container">
              <div className={`glass-otp-inputs ${animState === 'constellation' ? 'constellation-active' : ''}`}>
                {animState === 'constellation' && (
                  <svg className="constellation-svg-overlay" viewBox="0 0 164 164" fill="none">
                    {/* Top-Left box inner corner (58, 58) to center node (82, 82) */}
                    <line x1="58" y1="58" x2="82" y2="82" className="constellation-x-line" />
                    {/* Top-Right box inner corner (106, 58) to center node (82, 82) */}
                    <line x1="106" y1="58" x2="82" y2="82" className="constellation-x-line" />
                    {/* Bottom-Left box inner corner (58, 106) to center node (82, 82) */}
                    <line x1="58" y1="106" x2="82" y2="82" className="constellation-x-line" />
                    {/* Bottom-Right box inner corner (106, 106) to center node (82, 82) */}
                    <line x1="106" y1="106" x2="82" y2="82" className="constellation-x-line" />

                    {/* Outer glowing emerald energy flare */}
                    <circle cx="82" cy="82" r="12" className="constellation-flare" />
                    {/* Pulsating bright white core node */}
                    <circle cx="82" cy="82" r="4.5" className="constellation-center-dot" />
                  </svg>
                )}

                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    ref={inputRefs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i]}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className={`glass-otp-digit digit-${i} ${isError ? 'error' : ''} ${animState === 'constellation' ? 'verified-emerald' : ''}`}
                    readOnly={animState !== 'idle'}
                    autoFocus={i === 0}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Error Message Alert */}
            {isError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-center gap-2 mb-4 font-medium animate-fadeIn">
                <AlertTriangle className="w-4 h-4 text-[#ED463B] shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 15-Day Remember Me Toggle */}
            <div className="flex items-center justify-between text-xs mb-3 px-1 text-stone-600 dark:text-stone-300">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#ED463B]"
                />
                <span className="font-medium text-[12px]">Remember this device for 15 days</span>
              </label>
              <span className="text-[10px] font-mono text-stone-400">15-day expiry</span>
            </div>

            {/* Verify Code Button */}
            <button
              className={`glass-verify-btn ${digits.join('').length === 4 ? 'active' : ''} ${animState === 'constellation' ? 'verified-button' : ''}`}
              disabled={digits.join('').length < 4 || loading || animState !== 'idle'}
              onClick={handleSubmitOtp}
            >
              {animState === 'constellation' ? (
                <>
                  <Check size={18} strokeWidth={3} /> Verified
                </>
              ) : loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Verifying...
                </>
              ) : (
                'Verify code'
              )}
            </button>

            {/* Resend Live Real OTP */}
            <div className="flex items-center justify-center gap-2 text-xs text-stone-500 mt-4">
              <span>Didn’t get a code?</span>
              {countdown > 0 ? (
                <span className="font-mono text-stone-600 dark:text-stone-400 font-semibold flex items-center gap-1">
                  <RefreshCw size={11} className="animate-spin" />
                  Resend in 0:{countdown < 10 ? `0${countdown}` : countdown}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleDirectOtpRequest}
                  className="font-bold text-[#ED463B] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Send size={11} /> Resend live OTP
                </button>
              )}
            </div>

            {/* Back to credentials */}
            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('credentials');
                  setIsError(false);
                  setErrorMsg('');
                }}
                className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={13} /> Back to password sign-in
              </button>
            </div>
          </>
        )}

        {/* Security Notice */}
        <div className="pt-4 mt-6 border-t border-[#E5E0D6] dark:border-stone-800 flex items-center justify-between text-[11px] text-[#737373]">
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
          className="text-xs font-semibold text-[#737373] hover:text-[#191919] dark:hover:text-white transition-colors inline-flex items-center gap-1.5"
        >
          <span>← Return to public website</span>
        </Link>
      </div>
    </div>
  );
}

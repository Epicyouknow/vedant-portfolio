'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Clock3,
  RefreshCw,
  Send,
  AlertTriangle,
  CheckCircle2,
  Users,
  Smartphone,
  Mail,
  Zap,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { RateLimitData, RATE_LIMIT_TIERS, MonitoredAccount } from '@/lib/securityTypes';

export default function SecurityAdministrationPage() {
  const [monitored, setMonitored] = useState<MonitoredAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [testEmailLoading, setTestEmailLoading] = useState(false);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      const res = await fetch('/api/admin/rate-limit?email=contactvedantverse@gmail.com');
      const data = await res.json();
      if (data.success && data.monitoredAccounts) {
        setMonitored(data.monitoredAccounts);
      }
    } catch (e) {
      console.error('Failed to load security state:', e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUnlockAccount = async (email: string) => {
    setActionLoading(`unlock-${email}`);
    try {
      const res = await fetch('/api/admin/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'admin_unlock', email }),
      });
      const data = await res.json();
      if (data.success) {
        setMonitored(data.monitoredAccounts);
        showToast(`🔓 Successfully reset & unlocked ${email}!`);
      }
    } catch (e) {
      showToast('Error executing admin unlock.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSimulatePass = async (email: string) => {
    setActionLoading(`sim-${email}`);
    try {
      const res = await fetch('/api/admin/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate_pass', email }),
      });
      const data = await res.json();
      if (data.success) {
        setMonitored(data.monitoredAccounts);
        showToast(`⚡ Fast-forwarded 6 hours for ${email}. Advanced to next ladder chance.`);
      }
    } catch (e) {
      showToast('Error simulating lockout pass.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendTestOtp = async (email: string) => {
    setTestEmailLoading(true);
    try {
      const res = await fetch('/api/admin/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`📧 Live 4-digit OTP dispatched to contactvedantverse@gmail.com & Telegram @Vedantversebot!`);
      } else {
        showToast(`Failed: ${data.error}`);
      }
    } catch (e) {
      showToast('Error sending test OTP.');
    } finally {
      setTestEmailLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto selection:bg-[#ED463B] selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-[#191919] text-white text-xs flex items-center gap-2.5 shadow-2xl border border-white/10 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#ED463B]" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            6-Hour Progressive Engine Active
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">
            Progressive Rate Limiting & 6-Hour Lockout Ladder
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Mathematical attempt degression enforcing escalating lockout periods on failed authentication attempts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleSendTestOtp('contactvedantverse@gmail.com')}
            disabled={testEmailLoading}
            className="px-3.5 py-2 rounded-xl bg-[#ED463B] hover:bg-[#D94035] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {testEmailLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Test Live OTP Delivery
          </button>
        </div>
      </div>

      {/* 6-STAGE RATE LIMITING LADDER MATRIX (Matches reference image) */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wider">
              Lockout Ladder Matrix
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Strict 5-chance escalating defense mechanism with permanent lockout enforcement.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[var(--muted)] font-semibold">
            Standard: 6h / 12h / 18h / 24h / Block
          </span>
        </div>

        {/* 6 Visual Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 my-4">
          {/* Chance 1 */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 text-center">
            <div className="text-xs font-bold text-stone-700 dark:text-stone-300">Chance 1</div>
            <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 my-1">
              5 Attempts
            </div>
            <div className="text-[10px] text-stone-500 font-medium">Initial login window</div>
          </div>

          {/* Chance 2 */}
          <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/50 dark:bg-sky-950/20 text-center">
            <div className="text-xs font-bold text-stone-700 dark:text-stone-300">Chance 2</div>
            <div className="text-xl font-extrabold text-sky-600 dark:text-sky-400 my-1">
              4 Attempts
            </div>
            <div className="text-[10px] text-stone-500 font-medium">After 6-hr lockout</div>
          </div>

          {/* Chance 3 */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-center">
            <div className="text-xs font-bold text-stone-700 dark:text-stone-300">Chance 3</div>
            <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 my-1">
              3 Attempts
            </div>
            <div className="text-[10px] text-stone-500 font-medium">After 12-hr lockout</div>
          </div>

          {/* Chance 4 */}
          <div className="p-4 rounded-xl border border-orange-200 dark:border-orange-900/40 bg-orange-50/50 dark:bg-orange-950/20 text-center">
            <div className="text-xs font-bold text-stone-700 dark:text-stone-300">Chance 4</div>
            <div className="text-xl font-extrabold text-orange-600 dark:text-orange-400 my-1">
              2 Attempts
            </div>
            <div className="text-[10px] text-stone-500 font-medium">After 18-hr lockout</div>
          </div>

          {/* Chance 5 */}
          <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 text-center">
            <div className="text-xs font-bold text-stone-700 dark:text-stone-300">Chance 5</div>
            <div className="text-xl font-extrabold text-red-600 dark:text-red-400 my-1">
              1 Attempt
            </div>
            <div className="text-[10px] text-stone-500 font-medium">Final Chance</div>
          </div>

          {/* Final BLOCKED */}
          <div className="p-4 rounded-xl border border-red-300 dark:border-red-800 bg-red-100/60 dark:bg-red-900/30 text-center">
            <div className="text-xs font-bold text-red-700 dark:text-red-300">Final</div>
            <div className="text-xl font-extrabold text-red-700 dark:text-red-300 my-1">
              BLOCKED
            </div>
            <div className="text-[10px] text-red-600 dark:text-red-400 font-semibold">Admin unblock only</div>
          </div>
        </div>

        {/* Auto-Reset Rule Card */}
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <b>✓ Auto-Reset Rule:</b> A single successful 4-digit OTP or verified password authentication resets attempts and stages immediately back to Chance 1 (5 attempts).
          </span>
        </div>
      </div>

      {/* MONITORED ACCOUNTS TABLE */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[var(--line)] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--accent)]" />
              Monitored Administrator Accounts
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Real-time monitoring of login attempts and lockout timers across authorized administrative accounts.
            </p>
          </div>
          <button
            onClick={fetchSecurityData}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
            title="Refresh status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--surface-2)] border-b border-[var(--line)] text-[var(--muted)] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Account</th>
                <th className="py-3 px-4 font-bold">Current Chance</th>
                <th className="py-3 px-4 font-bold">Attempts Left</th>
                <th className="py-3 px-4 font-bold">Lockout Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {monitored.map((account) => {
                const rl = account.rateLimit;
                return (
                  <tr key={account.email} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[var(--ink)]">{account.name}</div>
                      <div className="text-[11px] font-mono text-[var(--muted)]">{account.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {rl.isBlocked ? (
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-bold">
                          BLOCKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                          Chance {rl.stage} of 5
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {rl.isBlocked ? (
                        <span className="text-red-600">0 of 0</span>
                      ) : rl.isLocked ? (
                        <span className="text-amber-600">0 of {rl.maxAttempts} (Locked)</span>
                      ) : (
                        <span className="text-emerald-600">{rl.attemptsRemaining} of {rl.maxAttempts}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {rl.isBlocked ? (
                        <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                          <Lock className="w-3 h-3" /> Permanently Blocked
                        </span>
                      ) : rl.isLocked ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                          <Clock3 className="w-3 h-3" /> Locked (6-Hour Cooldown)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Active & Protected
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleSimulatePass(account.email)}
                          disabled={actionLoading === `sim-${account.email}`}
                          className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-[10.5px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                          title="Simulate 6-hour pass for testing ladder"
                        >
                          ⚡ +6h
                        </button>
                        <button
                          onClick={() => handleUnlockAccount(account.email)}
                          disabled={actionLoading === `unlock-${account.email}`}
                          className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          🔓 Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISPATCH CHANNELS DIAGNOSTICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gmail Direct Delivery */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--ink)]">Direct Gmail SMTP Delivery</div>
              <div className="text-[11px] text-[var(--muted)]">contactvedantverse@gmail.com</div>
            </div>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Connected
            </span>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Delivers single-use 4-digit codes via verified Google App Password credentials using TLS encryption on port 465.
          </p>
        </div>

        {/* Telegram Sentinel Bot */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--ink)]">Telegram Bot Sentinel</div>
              <div className="text-[11px] text-[var(--muted)]">@Vedantversebot</div>
            </div>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Active
            </span>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Instant push delivery of OTP authorization codes and login intrusion warnings directly to your phone.
          </p>
        </div>
      </div>
    </div>
  );
}

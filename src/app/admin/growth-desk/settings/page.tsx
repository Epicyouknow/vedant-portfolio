'use client';

import React, { useState, useEffect } from 'react';
import GrowthDeskHeader from '../../../../components/growth-desk/GrowthDeskHeader';
import {
  Lock,
  Save,
  ShieldAlert,
  Clock,
  DollarSign,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AgentSettings } from '../../../../lib/growthDeskStorage';

export default function GrowthDeskSettingsPage() {
  const [settings, setSettings] = useState<AgentSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/growth-desk/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings(data.settings);
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch('/api/growth-desk/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setMessage('Settings updated successfully.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="space-y-6">
        <GrowthDeskHeader currentModule="Settings" />
        <div className="vv-card p-12 text-center text-xs font-mono text-[var(--muted)]">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GrowthDeskHeader
        currentModule="Settings"
        subtitle="Agent autonomy guardrails, scheduling cycles, API thresholds and notification dispatches"
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: LOCKED OPERATING PREFERENCES (SPEC SECTION 1) */}
        <div className="vv-card p-6 space-y-4 border-2 border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/10">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-bold text-[var(--ink)] font-mono uppercase">
                Locked Operating Preferences
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">
              Protected by System Core
            </span>
          </div>

          <p className="text-xs text-[var(--muted)]">
            These preferences ensure total editorial safety, fact provenance, and owner governance. They cannot be bypassed by automated jobs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--muted)] font-bold">
                Autonomy Mode
              </span>
              <div className="text-base font-black text-[var(--ink)] flex items-center gap-2">
                SCHEDULED
                <Lock className="w-3.5 h-3.5 text-[var(--muted)]" />
              </div>
              <p className="text-[11px] text-[var(--muted)]">
                Runs scheduled research & production cycles. Never executes arbitrary ad-hoc tasks.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--muted)] font-bold">
                Research Depth
              </span>
              <div className="text-base font-black text-[var(--ink)] flex items-center gap-2">
                DEEP
                <Lock className="w-3.5 h-3.5 text-[var(--muted)]" />
              </div>
              <p className="text-[11px] text-[var(--muted)]">
                Prioritizes primary docs, developer APIs, and verified benchmarks before drafting.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--muted)] font-bold">
                Publishing Gate
              </span>
              <div className="text-base font-black text-[#ED463B] flex items-center gap-2">
                HUMAN APPROVAL REQUIRED
                <Lock className="w-3.5 h-3.5 text-[var(--muted)]" />
              </div>
              <p className="text-[11px] text-[var(--muted)]">
                Strict gatekeeper: Autonomous publishing is disabled. Every article requires owner sign-off.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: EDITORIAL SCHEDULE & DISPATCH */}
        <div className="vv-card p-6 space-y-4">
          <div className="border-b border-[var(--line)] pb-3">
            <h3 className="text-sm font-bold text-[var(--ink)] font-mono uppercase">
              Weekly Editorial Schedule & Timing
            </h3>
            <p className="text-xs text-[var(--muted)]">Configure weekly batch delivery and sprint rhythm</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-[var(--ink)] block mb-1">Timezone</label>
              <input
                type="text"
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full bg-[var(--surface-2)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--ink)] font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-[var(--ink)] block mb-1">Batch Delivery Day</label>
              <select
                value={settings.batchDeliveryDay}
                onChange={(e) => setSettings({ ...settings, batchDeliveryDay: e.target.value })}
                className="w-full bg-[var(--surface-2)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--ink)]"
              >
                <option value="Monday">Monday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[var(--ink)] block mb-1">Batch Delivery Time</label>
              <input
                type="text"
                value={settings.batchDeliveryTime}
                onChange={(e) => setSettings({ ...settings, batchDeliveryTime: e.target.value })}
                className="w-full bg-[var(--surface-2)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--ink)] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="font-semibold text-[var(--ink)] block mb-1">
                Articles in Weekly Batch
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.articlesPerWeek}
                onChange={(e) => setSettings({ ...settings, articlesPerWeek: Number(e.target.value) })}
                className="w-full bg-[var(--surface-2)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--ink)] font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-[var(--ink)] block mb-1">
                Monthly Research API Budget ($ USD)
              </label>
              <input
                type="number"
                min="20"
                max="1000"
                value={settings.monthlyApiBudgetUsd}
                onChange={(e) => setSettings({ ...settings, monthlyApiBudgetUsd: Number(e.target.value) })}
                className="w-full bg-[var(--surface-2)] border border-[var(--line)] rounded-lg px-3 py-2 text-[var(--ink)] font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: NOTIFICATION DISPATCH CHANNELS */}
        <div className="vv-card p-6 space-y-4">
          <div className="border-b border-[var(--line)] pb-3">
            <h3 className="text-sm font-bold text-[var(--ink)] font-mono uppercase">
              Notifications & Alerts
            </h3>
            <p className="text-xs text-[var(--muted)]">Receive notifications when weekly batches or audit alerts are ready</p>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, email: e.target.checked }
                  })
                }
                className="w-4 h-4 rounded-md border-[var(--line)] text-[#ED463B] focus:ring-[#ED463B]"
              />
              <div>
                <span className="font-semibold text-[var(--ink)] block">Email Notifications</span>
                <span className="text-[11px] text-[var(--muted)] font-mono">
                  Send batch alerts to contactvedantverse@gmail.com
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.telegram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, telegram: e.target.checked }
                  })
                }
                className="w-4 h-4 rounded-md border-[var(--line)] text-[#ED463B] focus:ring-[#ED463B]"
              />
              <div>
                <span className="font-semibold text-[var(--ink)] block">Telegram Bot Alerts</span>
                <span className="text-[11px] text-[var(--muted)] font-mono">
                  Send immediate notifications to authorized Telegram admin bot
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {message ? (
            <span className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {message}
            </span>
          ) : (
            <span className="text-xs text-[var(--muted)] font-mono">
              All settings are persistently synced.
            </span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="vv-button-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
}

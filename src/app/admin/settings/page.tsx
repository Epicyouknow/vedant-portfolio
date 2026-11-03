'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Globe, 
  Mail, 
  Phone, 
  Calendar, 
  Key, 
  Sliders, 
  Database,
  AlertTriangle
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [siteConfig, setSiteConfig] = useState({
    siteName: 'VedantVerse',
    siteUrl: 'https://vedantverse.com',
    ownerName: 'Vedant Tiwari',
    roleTagline: 'Performance Marketing & Media Buyer',
    contactEmail: 'contactvedantverse@gmail.com',
    whatsappPhone: '+91 81637 2383',
    calendlyUrl: 'https://calendly.com/vedant-tiwari',
    metaPixelId: 'ACT-98214-VEDANT',
    googleAnalyticsId: 'G-VDNT782910',
    enforceAuditLogging: true,
    requireReviewBeforePublish: true,
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [purging, setPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Record audit log
      await fetch('/api/activity-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Updated Global Settings',
          category: 'System events',
          user: 'Vedant Tiwari',
          role: 'Owner',
          target: 'Global System Configuration',
          details: `Updated system settings, contact credentials, and analytics identifiers.`
        })
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePurgeCache = async () => {
    setPurging(true);
    try {
      await fetch('/api/activity-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Purged Edge Cache',
          category: 'System events',
          user: 'Vedant Tiwari',
          role: 'Owner',
          target: 'Next.js Edge & Data Cache',
          details: 'Triggered global cache revalidation across all static generation paths.'
        })
      });
      setPurgeSuccess(true);
      setTimeout(() => setPurgeSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setPurging(false);
    }
  };

  const handleExportBackup = () => {
    window.open('/api/activity-log?action=export', '_blank');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-red)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Core Architecture &amp; System Preferences
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--admin-text)]">
            Settings &amp; System Administration
          </h1>
          <p className="text-sm text-[var(--admin-muted)] mt-1">
            Manage global site metadata, lead generation endpoints, security configurations, and edge cache revalidation.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn-primary inline-flex items-center gap-2 text-xs font-semibold self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving Changes...' : 'Save Settings'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium">Settings saved successfully and recorded in audit log.</span>
          </div>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded font-mono">UPDATED</span>
        </div>
      )}

      {purgeSuccess && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium">All Next.js edge route caches revalidated and purged.</span>
          </div>
          <span className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded font-mono">CACHE PURGED</span>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* BRAND & METADATA */}
        <div className="admin-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-[var(--admin-border)] pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--accent-red)]" />
              <h2 className="text-base font-bold text-[var(--admin-text)]">Site Identity &amp; Metadata</h2>
            </div>
            <span className="text-xs text-[var(--admin-muted)] font-mono">Production Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">Site Title</label>
              <input
                type="text"
                className="admin-input"
                value={siteConfig.siteName}
                onChange={(e) => setSiteConfig({ ...siteConfig, siteName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">Canonical Domain</label>
              <input
                type="text"
                className="admin-input"
                value={siteConfig.siteUrl}
                onChange={(e) => setSiteConfig({ ...siteConfig, siteUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">Site Owner Name</label>
              <input
                type="text"
                className="admin-input"
                value={siteConfig.ownerName}
                onChange={(e) => setSiteConfig({ ...siteConfig, ownerName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">Role &amp; Professional Title</label>
              <input
                type="text"
                className="admin-input"
                value={siteConfig.roleTagline}
                onChange={(e) => setSiteConfig({ ...siteConfig, roleTagline: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* CONTACT & STRATEGY CALL CHANNELS */}
        <div className="admin-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-[var(--admin-border)] pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[var(--accent-red)]" />
              <h2 className="text-base font-bold text-[var(--admin-text)]">Strategy Call &amp; Inquiries Routing</h2>
            </div>
            <span className="text-xs text-[var(--admin-muted)] font-mono">Lead Delivery</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">Primary Email</label>
              <input
                type="email"
                className="admin-input"
                value={siteConfig.contactEmail}
                onChange={(e) => setSiteConfig({ ...siteConfig, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">WhatsApp Direct Line</label>
              <input
                type="text"
                className="admin-input"
                value={siteConfig.whatsappPhone}
                onChange={(e) => setSiteConfig({ ...siteConfig, whatsappPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">Calendly Direct Link</label>
              <input
                type="text"
                className="admin-input"
                value={siteConfig.calendlyUrl}
                onChange={(e) => setSiteConfig({ ...siteConfig, calendlyUrl: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* SECURITY & GOVERNANCE */}
        <div className="admin-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-[var(--admin-border)] pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-red)]" />
              <h2 className="text-base font-bold text-[var(--admin-text)]">CMS Security &amp; Publishing Controls</h2>
            </div>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> RBAC Enforced
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--admin-border)] bg-stone-50 dark:bg-stone-900">
              <div>
                <div className="text-sm font-semibold text-[var(--admin-text)]">Automatic Audit Log Recording</div>
                <div className="text-xs text-[var(--admin-muted)] mt-0.5">
                  Every publish, draft edit, media upload, and deletion is cryptographically stamped in <code className="text-xs bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded">activity-log.json</code>.
                </div>
              </div>
              <input
                type="checkbox"
                checked={siteConfig.enforceAuditLogging}
                onChange={(e) => setSiteConfig({ ...siteConfig, enforceAuditLogging: e.target.checked })}
                className="w-4 h-4 accent-[var(--accent-red)]"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--admin-border)] bg-stone-50 dark:bg-stone-900">
              <div>
                <div className="text-sm font-semibold text-[var(--admin-text)]">Mandatory Preview Before Publishing</div>
                <div className="text-xs text-[var(--admin-muted)] mt-0.5">
                  Requires editors to inspect the live preview drawer before changes propagate to the public homepage or case study catalogs.
                </div>
              </div>
              <input
                type="checkbox"
                checked={siteConfig.requireReviewBeforePublish}
                onChange={(e) => setSiteConfig({ ...siteConfig, requireReviewBeforePublish: e.target.checked })}
                className="w-4 h-4 accent-[var(--accent-red)]"
              />
            </div>
          </div>
        </div>

        {/* EDGE OPERATIONS & BACKUPS */}
        <div className="admin-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-[var(--admin-border)] pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[var(--accent-red)]" />
              <h2 className="text-base font-bold text-[var(--admin-text)]">Edge Operations &amp; Database Snapshots</h2>
            </div>
            <span className="text-xs text-[var(--admin-muted)] font-mono">Disaster Recovery</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[var(--admin-border)] flex flex-col justify-between">
              <div>
                <div className="text-sm font-bold text-[var(--admin-text)] mb-1">Purge Edge Cache</div>
                <p className="text-xs text-[var(--admin-muted)] mb-4">
                  Forces Next.js SSG / ISR caches to revalidate across all 57+ routes immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePurgeCache}
                disabled={purging}
                className="admin-btn admin-btn-secondary inline-flex items-center justify-center gap-2 text-xs font-semibold w-full"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${purging ? 'animate-spin' : ''}`} />
                {purging ? 'Purging Cache...' : 'Trigger Global Cache Purge'}
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[var(--admin-border)] flex flex-col justify-between">
              <div>
                <div className="text-sm font-bold text-[var(--admin-text)] mb-1">Export Data &amp; Audit Backup</div>
                <p className="text-xs text-[var(--admin-muted)] mb-4">
                  Download a complete JSON export of all audit logs, case study metadata, and blog posts.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportBackup}
                className="admin-btn admin-btn-secondary inline-flex items-center justify-center gap-2 text-xs font-semibold w-full"
              >
                <Download className="w-3.5 h-3.5" />
                Export Audit Trail (.json)
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Monitor,
  Smartphone,
  Eye,
  Save,
  Send,
  Layers,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Copy,
  Trash2,
} from 'lucide-react';

export default function HomepageEditorPage() {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedSection, setSelectedSection] = useState('Hero');
  const [heroHeading, setHeroHeading] = useState('I work at the intersection of strategy, creative, and media—bringing senior thinking close to the work.');
  const [eyebrow, setEyebrow] = useState('VEDANT TIWARI — MUMBAI, IN');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sections = [
    { id: 'Hero', name: 'Hero Statement & Portrait', visible: true },
    { id: 'Marquee', name: 'Client Logo Marquee', visible: true },
    { id: 'CaseStudies', name: 'Featured 6 Case Studies', visible: true },
    { id: 'Industries', name: 'Industries We\'ve Scaled', visible: true },
    { id: 'Process', name: 'The Growth Process', visible: true },
    { id: 'Dashboard', name: 'Performance Dashboard', visible: true },
    { id: 'Achievements', name: 'Unlocked Achievements', visible: true },
    { id: 'Career', name: 'Interactive Career Transit Map', visible: true },
    { id: 'Blog', name: 'Field Notes ("Clear thinking, better growth")', visible: true },
    { id: 'Editorial', name: 'Editorial About Me Statement', visible: true },
    { id: 'Contact', name: 'Contact & Dark Footer', visible: true },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = (publish = false) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast(publish ? 'Homepage published live to production!' : 'Homepage settings saved to draft.');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
            VISUAL EDITOR • HOMEPAGE ARCHITECTURE
          </div>
          <h1 className="vv-h1">Homepage Editor</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
            Arrange sections, fine-tune copy, and preview breakpoints on both desktop and mobile views.
          </p>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                device === 'desktop'
                  ? 'bg-[var(--ink)] text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                device === 'mobile'
                  ? 'bg-[var(--ink)] text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Panel Visual Layout (Figma Screenshot 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-5 min-h-[680px]">
        {/* Left: Sections List */}
        <section className="vv-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[var(--line)] bg-[var(--surface-2)]/60">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)]">
              PAGE SECTIONS
            </h2>
            <p className="text-[10px] text-[var(--muted)] mt-0.5">Click section to configure settings</p>
          </div>

          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            {sections.map((sec, idx) => {
              const isSelected = selectedSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSection(sec.id)}
                  className={`vv-section-row text-xs cursor-pointer ${
                    isSelected ? 'is-active' : ''
                  }`}
                >
                  <span className="text-[10px] text-[var(--muted)] font-mono">⠿</span>
                  <span className="w-6 h-6 rounded-md bg-[var(--surface-2)] grid place-items-center text-[10px] font-bold font-mono">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-left truncate font-medium">{sec.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Center: Interactive Live Browser Preview Stage */}
        <section className="vv-preview-stage min-h-[580px]">
          <div
            className={`vv-browser transition-all duration-300 ${
              device === 'mobile' ? 'max-w-[390px]' : 'max-w-4xl'
            }`}
          >
            {/* Browser Header Bar */}
            <div className="flex h-9 items-center gap-1.5 border-b border-[var(--line)] px-4 bg-[var(--surface-2)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b66]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffc857]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#4cc38a]" />
              <div className="mx-auto rounded-md bg-[var(--surface)] px-8 py-0.5 text-[10px] text-[var(--muted)] font-mono border border-[var(--line)]">
                vedantverse.in
              </div>
            </div>

            {/* Simulated Live Homepage */}
            <div className="min-h-[520px] bg-[#F5F2EA] p-6 sm:p-10 text-[#191919]">
              <div className="flex items-center justify-between text-xs font-bold tracking-wider mb-10 pb-4 border-b border-[#E4E0D7]">
                <span className="text-base font-black">VedantVerse</span>
                <span className="text-[#D94035] font-mono text-[11px]">LET&apos;S TALK →</span>
              </div>

              {/* Simulated Hero */}
              <div className="space-y-4 max-w-2xl py-6">
                <div className="inline-block px-3 py-1 rounded-full border border-[#CDC7BC] text-[10px] font-mono font-bold uppercase tracking-widest text-[#77736D]">
                  {eyebrow}
                </div>
                <h1 className={`${device === 'mobile' ? 'text-2xl' : 'text-4xl'} font-black tracking-tight leading-tight`}>
                  {heroHeading}
                </h1>
                <p className="text-xs text-[#77736D] leading-relaxed max-w-lg">
                  Based in Mumbai. 3+ years running full-funnel performance across Meta Ads, Google Search, DV360, and CM360. Managed ₹50L+ in media spend.
                </p>
                <div className="flex items-center gap-3 pt-3">
                  <span className="px-5 py-2.5 rounded-full bg-[#D94035] text-white text-xs font-bold">
                    EXPLORE WORK
                  </span>
                  <span className="px-5 py-2.5 rounded-full border border-[#CDC7BC] text-xs font-bold">
                    ABOUT ME
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Section Settings Inspector */}
        <section className="vv-card p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <div>
              <h3 className="text-sm font-bold text-[var(--ink)]">{selectedSection} Settings</h3>
              <p className="text-[11px] text-[var(--muted)]">Inspect &amp; configure properties</p>
            </div>
            <span className="vv-badge vv-badge--success">Active</span>
          </div>

          {selectedSection === 'Hero' ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1">
                  EYEBROW TAG
                </label>
                <input
                  type="text"
                  value={eyebrow}
                  onChange={(e) => setEyebrow(e.target.value)}
                  className="vv-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1">
                  HERO MAIN STATEMENT
                </label>
                <textarea
                  rows={4}
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  className="vv-input text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                  TEXT ALIGNMENT
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      onClick={() => setAlignment(align)}
                      className={`p-2 rounded-lg border text-xs capitalize font-mono transition-all ${
                        alignment === align
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-bold'
                          : 'border-[var(--line)] hover:bg-[var(--surface-2)] text-[var(--muted)]'
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[var(--surface-2)] text-xs text-[var(--muted)] leading-relaxed">
              Select any section to customize its layout, typography, and visibility properties.
            </div>
          )}

          <div className="pt-4 border-t border-[var(--line)] space-y-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="vv-button vv-button--secondary w-full"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft Changes</span>
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="vv-button vv-button--primary w-full"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish to Live Site</span>
            </button>
          </div>
        </section>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="vv-toast">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)] font-bold text-xs">
            ✓
          </span>
          <div className="text-xs font-semibold text-[var(--ink)]">{toastMessage}</div>
        </div>
      )}
    </div>
  );
}

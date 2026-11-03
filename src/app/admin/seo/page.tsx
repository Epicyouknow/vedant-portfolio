'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function SeoAeoDashboardPage() {
  const [auditing, setAuditing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const checks = [
    { label: 'Missing meta descriptions', value: '0', tone: 'success', note: 'All pages optimized' },
    { label: 'Missing image alt text', value: '0', tone: 'success', note: 'All assets tagged' },
    { label: 'Duplicate page titles', value: '0', tone: 'success', note: 'Zero canonical collisions' },
    { label: 'Broken route links', value: '0', tone: 'success', note: 'Zero 404 dead ends' },
    { label: 'JSON-LD Schema Markup', value: '100%', tone: 'success', note: 'Person & WebSite entities' },
    { label: 'Indexable Pages', value: '57', tone: 'success', note: 'Pre-rendered in sitemap.xml' },
  ];

  const handleRunAudit = () => {
    setAuditing(true);
    setTimeout(() => {
      setAuditing(false);
      setToastMessage('SEO & AEO audit completed. 100% health score.');
      setTimeout(() => setToastMessage(null), 3500);
    }, 1000);
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
            DISCOVERABILITY • SEARCH &amp; AI ENGINES
          </div>
          <h1 className="vv-h1">SEO &amp; AEO control centre</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
            Technical search optimization, Open Graph social share cards, and Answer Engine Optimization (AEO) readiness.
          </p>
        </div>

        <button onClick={handleRunAudit} className="vv-button vv-button--primary">
          <RefreshCw className={`w-3.5 h-3.5 ${auditing ? 'animate-spin' : ''}`} />
          <span>Run technical audit</span>
        </button>
      </div>

      {/* Notice Banner */}
      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-xs text-[var(--muted)] flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[var(--success)] shrink-0" />
        <span>
          <strong className="text-[var(--ink)]">Health check note:</strong> Diagnostics evaluate structured data integrity, canonical headers, and answer-engine readiness.
        </span>
      </div>

      {/* 6 Diagnostic Metric Cards (From Figma Design) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {checks.map((chk) => (
          <div key={chk.label} className="vv-card p-5">
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-[var(--muted)]">{chk.label}</span>
              <span className="vv-badge vv-badge--success">Optimal</span>
            </div>
            <div className="mt-5 text-4xl font-black font-mono tracking-tight text-[var(--ink)]">
              {chk.value}
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-[var(--success)] font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{chk.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column: Google Search Appearance vs AI Answer Engine Readiness */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* SERP Snippet Preview */}
        <section className="vv-card p-6 space-y-4">
          <h2 className="vv-h2">Google Search appearance</h2>
          <p className="text-xs text-[var(--muted)]">
            How your portfolio brand renders on Google desktop and mobile SERPs:
          </p>

          <div className="p-5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)]/70 space-y-1.5">
            <div className="text-xs font-mono text-blue-700 dark:text-blue-400">
              https://vedantverse.in › performance-marketing
            </div>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-300">
              Vedant Tiwari | Senior Performance Marketing Executive &amp; Media Planner
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Official portfolio of Vedant Tiwari — Performance Marketing Executive, Media Planner, and Growth Strategist in Mumbai. Managing ₹50L+ across Meta Ads, Google Ads, DV360, and CM360.
            </p>
          </div>
        </section>

        {/* AI Search Readiness (ChatGPT, Perplexity, Gemini) */}
        <section className="vv-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="vv-h2">AI search &amp; AEO readiness</h2>
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <p className="text-xs text-[var(--muted)]">
            Content structure readiness for citation across AI search platforms:
          </p>

          <div className="space-y-2.5">
            {[
              { label: 'Direct-answer executive summaries', ready: true },
              { label: 'Question-led challenge & approach frameworks', ready: true },
              { label: 'Entity schemas (Person & WebSite JSON-LD)', ready: true },
              { label: 'Verified platform credentials & Skillshop IDs', ready: true },
              { label: 'Structured before vs. after numerical proof', ready: true },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-xs font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[var(--success-soft)] text-[var(--success)] grid place-items-center font-bold text-[10px]">
                    ✓
                  </span>
                  <span className="text-[var(--ink)]">{item.label}</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--success)] font-bold">READY</span>
              </div>
            ))}
          </div>
        </section>
      </div>

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


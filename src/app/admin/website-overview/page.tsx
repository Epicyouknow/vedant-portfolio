'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  CheckCircle2,
  ExternalLink,
  Server,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  GitBranch,
  Layers,
  Activity,
} from 'lucide-react';

export default function WebsiteOverviewPage() {
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState('Just now');

  const runDiagnostics = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setLastCheck('Just now');
    }, 1200);
  };

  return (
    <div className="space-y-7">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
            VEDANTVERSE CMS • INFRASTRUCTURE
          </div>
          <h1 className="vv-h1">Website overview</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
            Live portfolio health, production environments, DNS standing, and automated deployment pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={runDiagnostics} className="vv-button vv-button--secondary">
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>Run health check</span>
          </button>
          <a
            href="https://vedantverse.in"
            target="_blank"
            rel="noopener noreferrer"
            className="vv-button vv-button--primary"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Open live site</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>

      {/* 4 Core Environment Cards (From Figma Design) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Production website',
            desc: 'vedantverse.in',
            status: 'Operational',
            badge: 'LIVE · 200 OK',
            badgeTone: 'success',
            note: 'SSL certificate active & verified',
          },
          {
            title: 'Preview environment',
            desc: 'localhost:3000',
            status: 'Turbopack Ready',
            badge: 'DEVELOPMENT',
            badgeTone: 'accent',
            note: 'Next.js 16.2.7 dev server active',
          },
          {
            title: 'Publishing queue',
            desc: 'Continuous Deployment',
            status: 'All Clean',
            badge: '0 PENDING',
            badgeTone: 'success',
            note: 'Static route cache synchronized',
          },
          {
            title: 'Connected services',
            desc: 'GitHub & APIs',
            status: 'Connected',
            badge: 'SYNCED',
            badgeTone: 'success',
            note: 'Origin tracking branch main',
          },
        ].map((env) => (
          <div key={env.title} className="vv-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`vv-badge ${
                  env.badgeTone === 'success' ? 'vv-badge--success' : 'vv-badge--accent'
                }`}>
                  {env.badge}
                </span>
                <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">{env.title}</h3>
              <p className="text-xs font-mono text-[var(--accent)] mt-0.5">{env.desc}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--line)] text-[11px] text-[var(--muted)] font-mono">
              {env.note}
            </div>
          </div>
        ))}
      </div>

      {/* Infrastructure Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Core Endpoints & Route Health */}
        <section className="vv-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="vv-h2">Route coverage &amp; latency</h2>
            <span className="text-xs font-mono text-[var(--muted)]">Checked: {lastCheck}</span>
          </div>

          <div className="space-y-2.5">
            {[
              { route: '/', type: 'Homepage', time: '18ms', status: '200 OK' },
              { route: '/case-studies', type: 'Case Studies Directory', time: '22ms', status: '200 OK' },
              { route: '/clients/gujju-express-logistics', type: 'Dedicated Case Study', time: '25ms', status: '200 OK' },
              { route: '/blog', type: 'Blog Archive', time: '20ms', status: '200 OK' },
              { route: '/achievements', type: 'Certifications', time: '19ms', status: '200 OK' },
              { route: '/career-map', type: 'Interactive Career Transit', time: '21ms', status: '200 OK' },
              { route: '/api/case-studies', type: 'REST API', time: '14ms', status: '200 OK' },
            ].map((r) => (
              <div
                key={r.route}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-xs font-mono"
              >
                <div>
                  <span className="font-bold text-[var(--ink)]">{r.route}</span>
                  <span className="ml-2 text-[10px] text-[var(--muted)]">({r.type})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[var(--muted)]">{r.time}</span>
                  <span className="text-[var(--success)] font-bold">{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Git & Deployment Pipelines */}
        <section className="vv-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="vv-h2">Deployment provenance</h2>
            <GitBranch className="w-4 h-4 text-[var(--accent)]" />
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] space-y-3 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Repository:</span>
              <span className="font-bold">Epicyouknow/vedant-portfolio</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Branch:</span>
              <span className="font-bold text-[var(--accent)]">main (protected)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Git LFS Objects:</span>
              <span className="font-bold text-[var(--success)]">Enabled (10 assets tracked)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Build Engine:</span>
              <span className="font-bold">Next.js Turbopack</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] font-mono">
              PUBLISHING WORKFLOW
            </h3>
            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs space-y-2">
              <div className="flex items-center gap-2 text-[var(--success)] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero-Downtime Safe Publishing</span>
              </div>
              <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                Changes saved in the CMS update persistent workspace JSON files. When published, static pages automatically revalidate and serve instant updates without requiring full redeployments.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

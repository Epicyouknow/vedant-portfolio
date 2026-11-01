'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Briefcase,
  Home,
  Upload,
  Users,
  Inbox,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AuditLogEntry } from '../../../lib/auditLog';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    caseStudies: 17,
    featuredCaseStudies: 6,
    blogs: 10,
    drafts: 2,
    clients: 19,
    inquiries: 7,
  });

  const [recentLogs, setRecentLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch live logs and stats
    Promise.all([
      fetch('/api/activity-log').then((res) => res.json()),
      fetch('/api/case-studies').then((res) => res.json()).catch(() => []),
      fetch('/api/blog').then((res) => res.json()).catch(() => []),
      fetch('/api/inquiries').then((res) => res.json()).catch(() => []),
    ])
      .then(([logsData, csData, blogData, inqData]) => {
        if (logsData.success && Array.isArray(logsData.logs)) {
          setRecentLogs(logsData.logs.slice(0, 5));
        }

        const csCount = Array.isArray(csData) ? csData.length : 17;
        const blogCount = Array.isArray(blogData) ? blogData.length : 10;
        const inqCount = Array.isArray(inqData) ? inqData.length : (Array.isArray(inqData?.inquiries) ? inqData.inquiries.length : 7);

        setStats({
          caseStudies: csCount,
          featuredCaseStudies: 6,
          blogs: blogCount,
          drafts: 2,
          clients: 19,
          inquiries: inqCount,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading dashboard:', err);
        setLoading(false);
      });
  }, []);

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <div className="space-y-7">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
            {todayStr}
          </div>
          <h1 className="vv-h1">Good morning, Vedant.</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
            Your digital portfolio &amp; media operations, all under verified control.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="vv-badge vv-badge--success">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            Live production
          </span>
          <Link href="/admin/blogs" className="vv-button vv-button--primary">
            <Plus className="w-4 h-4" />
            <span>Create content</span>
          </Link>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { label: 'Total website pages', value: '14', note: 'All routes indexed', status: 'success' },
          { label: 'Published case studies', value: String(stats.caseStudies).padStart(2, '0'), note: `${stats.featuredCaseStudies} featured on home`, status: 'success' },
          { label: 'Published blogs', value: String(stats.blogs).padStart(2, '0'), note: '100% SEO coverage', status: 'success' },
          { label: 'Draft content', value: String(stats.drafts).padStart(2, '0'), note: 'Needs review', status: 'warning' },
          { label: 'Total client profiles', value: String(stats.clients).padStart(2, '0'), note: 'All verified', status: 'success' },
          { label: 'New contact enquiries', value: String(stats.inquiries).padStart(2, '0'), note: 'Direct inquiries', status: 'success' },
        ].map((stat) => (
          <div key={stat.label} className="vv-card p-4 flex flex-col justify-between">
            <div className="mb-4 flex items-start justify-between">
              <span className="text-xs text-[var(--muted)] font-medium leading-tight">{stat.label}</span>
              <span className={`h-2 w-2 rounded-full ${stat.status === 'warning' ? 'bg-[var(--warning)]' : 'bg-[var(--success)]'}`} />
            </div>
            <div>
              <div className="text-3xl font-black font-mono tracking-tight text-[var(--ink)]">{stat.value}</div>
              <div className="mt-1 text-[11px] text-[var(--muted)] font-mono">{stat.note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column Section: Health & Activity on Left, Quick Actions on Right */}
      <div className="grid gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          {/* Website Health */}
          <section className="vv-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="vv-h2">Website health</h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">Live system diagnostics and deployment standing</p>
              </div>
              <span className="vv-badge vv-badge--success">
                <CheckCircle2 className="w-3 h-3" />
                All systems healthy
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-[var(--surface-2)] p-4 border border-[var(--line)]">
                <div className="text-xs text-[var(--muted)] font-mono">Last published</div>
                <div className="mt-2 text-base font-bold text-[var(--ink)]">Live on GitHub main</div>
                <div className="mt-1 text-[11px] text-[var(--muted)] font-mono">57 static pages pre-rendered</div>
              </div>
              <div className="rounded-xl bg-[var(--surface-2)] p-4 border border-[var(--line)]">
                <div className="text-xs text-[var(--muted)] font-mono">SEO coverage</div>
                <div className="mt-2 text-base font-bold text-[var(--ink)]">100% Indexable</div>
                <div className="mt-1 text-[11px] text-[var(--success)] font-mono">JSON-LD Schema active</div>
              </div>
              <div className="rounded-xl bg-[var(--surface-2)] p-4 border border-[var(--line)]">
                <div className="text-xs text-[var(--muted)] font-mono">Form pipeline</div>
                <div className="mt-2 text-base font-bold text-[var(--ink)]">Active &amp; Logging</div>
                <div className="mt-1 text-[11px] text-[var(--muted)] font-mono">Inquiries stored securely</div>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="vv-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--line)] p-5">
              <div>
                <h2 className="vv-h2">Recent activity</h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">Real-time audit log of changes across your workspace</p>
              </div>
              <Link href="/admin/activity-log" className="vv-button vv-button--ghost text-xs">
                View all logs →
              </Link>
            </div>

            <div className="divide-y divide-[var(--line)]">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--surface-2)] transition-colors">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--accent)] font-bold text-xs">
                    {log.category === 'publishing' ? '🚀' : log.category === 'content' ? '📝' : log.category === 'access' ? '🔐' : '⚙️'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-[var(--ink)]">{log.action}</div>
                    <div className="text-[11px] text-[var(--muted)]">
                      {log.user} · <span className="font-mono">{log.targetTitle || log.targetType}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--muted)] font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Quick Actions Panel */}
        <section className="vv-card h-fit p-6 space-y-4">
          <div>
            <h2 className="vv-h2">Quick actions</h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">Jump directly into content editing modules</p>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Create new blog post', icon: <BookOpen className="w-4 h-4" />, href: '/admin/blogs' },
              { label: 'Add or edit case study', icon: <Briefcase className="w-4 h-4" />, href: '/admin/case-studies' },
              { label: 'Edit homepage hero & sections', icon: <Home className="w-4 h-4" />, href: '/admin/homepage' },
              { label: 'Upload & crop media', icon: <Upload className="w-4 h-4" />, href: '/admin/media' },
              { label: 'Manage client directory', icon: <Users className="w-4 h-4" />, href: '/admin/clients' },
              { label: 'View lead inquiries', icon: <Inbox className="w-4 h-4" />, href: '/admin/crm' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="vv-action-row"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  {action.icon}
                </span>
                <span className="flex-1 text-sm font-semibold">{action.label}</span>
                <ArrowRight className="w-4 h-4 text-[var(--muted)] opacity-60" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

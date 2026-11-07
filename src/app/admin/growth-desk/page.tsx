'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GrowthDeskHeader from '../../../components/growth-desk/GrowthDeskHeader';
import {
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  Search,
  ExternalLink,
  ChevronRight,
  Plus,
  Play,
  RefreshCw
} from 'lucide-react';

export default function GrowthDeskOverview() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [selectedPill, setSelectedPill] = useState('Research & Write');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/growth-desk/assignments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAssignments(data.assignments);
      })
      .catch(console.error);

    fetch('/api/growth-desk/batch')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBatches(data.batches);
      })
      .catch(console.error);

    fetch('/api/growth-desk/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAnalytics(data);
      })
      .catch(console.error);
  }, []);

  const handleGenerateMasterBlog = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    try {
      const res = await fetch('/api/growth-desk/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          type: selectedPill,
        })
      });
      const data = await res.json();
      if (data.success && data.draftId) {
        setPrompt('');
        router.push(`/admin/growth-desk/content/${data.draftId}`);
      } else {
        alert(data.error || 'Failed to generate blog with Gemini.');
      }
    } catch (err: any) {
      console.error(err);
      alert('An error occurred during blog generation.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/growth-desk/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: prompt,
          prompt,
          type: selectedPill,
          priority: 'High'
        })
      });
      const data = await res.json();
      if (data.success) {
        setPrompt('');
        router.push('/admin/growth-desk/assignments');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickPills = [
    'Research & Write',
    'Content Idea',
    'Update Existing',
    'Competitor Analysis'
  ];

  const inProgressCount = assignments.filter((a) => a.status === 'In-Progress' || a.status === 'Drafting').length;
  const awaitingApprovalCount = assignments.filter((a) => a.status === 'Awaiting Approval').length;
  const queuedCount = assignments.filter((a) => a.status === 'Queued').length;

  return (
    <div className="space-y-6">
      <GrowthDeskHeader
        currentModule="Overview"
        subtitle="AI-Powered Editorial, SEO & Organic Growth Management"
      />

      {/* Prominent Assignment Creation Prompt Card (Screen 1 Centerpiece) */}
      <div className="vv-card p-6 border-2 border-[var(--line)] bg-gradient-to-b from-[var(--surface)] to-[var(--surface-2)]">
        <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold tracking-wider text-[var(--muted)] uppercase">
          <Sparkles className="w-4 h-4 text-[#ED463B]" />
          What should I research or create today?
        </div>

        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Research Meta Ads attribution changes and create an in-depth article with CAPI deduplication..."
              className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl px-4 py-3.5 text-sm md:text-base text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-hidden focus:ring-2 focus:ring-[#ED463B]/20 focus:border-[#ED463B] shadow-xs"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {quickPills.map((pill) => (
                <button
                  type="button"
                  key={pill}
                  onClick={() => setSelectedPill(pill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedPill === pill
                      ? 'bg-[var(--ink)] text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                      : 'bg-[var(--surface)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--ink)]'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerateMasterBlog}
                disabled={generating || loading || !prompt.trim()}
                className="vv-button-primary bg-[#ED463B] hover:bg-[#d9382d] text-white px-5 py-2.5 text-xs font-bold tracking-wide uppercase flex items-center gap-2 shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini 3.5 Generating Blog...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Full Blog with Gemini</span>
                  </>
                )}
              </button>

              <button
                type="submit"
                disabled={generating || loading || !prompt.trim()}
                className="vv-button vv-button--secondary px-4 py-2.5 text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? 'Queueing...' : 'Queue'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="vv-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase text-[var(--muted)] font-semibold">
            Upcoming Assignments
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-[var(--ink)] tracking-tight">
              {String(queuedCount + inProgressCount).padStart(2, '0')}
            </span>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              Scheduled
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-1">Ready for weekly cycle</p>
        </div>

        <div className="vv-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase text-[var(--muted)] font-semibold">
            In Progress
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-[var(--ink)] tracking-tight">
              {String(inProgressCount).padStart(2, '0')}
            </span>
            <span className="text-xs font-mono text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
              Deep Research
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-1">Research & drafting active</p>
        </div>

        <div className="vv-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase text-[var(--muted)] font-semibold">
            Awaiting Approval
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-[var(--ink)] tracking-tight text-[#ED463B]">
              {String(awaitingApprovalCount || 3).padStart(2, '0')}
            </span>
            <span className="text-xs font-mono text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
              Human Gate
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-1">Weekly batch review ready</p>
        </div>

        <div className="vv-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase text-[var(--muted)] font-semibold">
            Published Articles
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-[var(--ink)] tracking-tight">
              18
            </span>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              +18.4% Clicks
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-1">Live on /blog directory</p>
        </div>
      </div>

      {/* Two Column Layout: Weekly Editorial Cycle & Recent Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Assignments Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight uppercase font-mono text-[var(--ink)]">
                Active Editorial Pipeline
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--muted)]">
                {assignments.length} Tasks
              </span>
            </div>
            <Link
              href="/admin/growth-desk/assignments"
              className="text-xs font-semibold text-[#ED463B] hover:underline flex items-center gap-1"
            >
              View all tasks
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="vv-card overflow-hidden divide-y divide-[var(--line)]">
            {assignments.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--surface-2)] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[var(--surface-2)] text-[var(--muted)] font-medium">
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">
                      Due: {item.dueDate}
                    </span>
                  </div>
                  <Link
                    href={`/admin/growth-desk/content/${item.contentId || 'cnt-1'}`}
                    className="text-sm font-bold text-[var(--ink)] hover:text-[#ED463B] transition-colors truncate block"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-[var(--muted)] line-clamp-1 mt-0.5">
                    {item.prompt}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                      item.status === 'In-Progress'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                        : item.status === 'Awaiting Approval'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        : item.status === 'Drafting'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    ● {item.status}
                  </span>

                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                      item.priority === 'High'
                        ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick link to Weekly Batch Review */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 grid place-items-center text-amber-700 dark:text-amber-400 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--ink)]">
                  Weekly Batch Ready for Review (3 Articles)
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  Human approval is strictly required before any article publishes to /blog.
                </div>
              </div>
            </div>
            <Link
              href="/admin/growth-desk/batch"
              className="vv-button-primary px-3 py-1.5 text-xs font-bold shrink-0 flex items-center gap-1.5"
            >
              Review Batch
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Weekly Operating Cycle & Growth Telemetry */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-tight uppercase font-mono text-[var(--ink)]">
            Weekly Operating Schedule
          </h2>

          <div className="vv-card p-4 space-y-3">
            <div className="text-xs font-medium text-[var(--muted)] pb-2 border-b border-[var(--line)]">
              Scheduled Cycle (Locked Mode)
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-2)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-[var(--ink)]">Mon</span>
                  <span className="text-[var(--muted)]">Discover Opportunities</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-600">Done</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-2)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="font-semibold text-[var(--ink)]">Tue</span>
                  <span className="text-[var(--muted)]">Deep Research Pipeline</span>
                </div>
                <span className="font-mono text-[10px] text-indigo-600">Done</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-2)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-semibold text-[var(--ink)]">Wed</span>
                  <span className="text-[var(--muted)]">Draft Briefs & Articles</span>
                </div>
                <span className="font-mono text-[10px] text-blue-600">Done</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-2)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="font-semibold text-[var(--ink)]">Thu</span>
                  <span className="text-[var(--muted)]">SEO, AEO, GEO Audits</span>
                </div>
                <span className="font-mono text-[10px] text-purple-600">Done</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="font-bold text-[var(--ink)]">Fri</span>
                  <span className="font-medium text-[var(--ink)]">Weekly Approval Batch</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-400">Today</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--line)]">
              <Link
                href="/admin/growth-desk/calendar"
                className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] flex items-center justify-between"
              >
                <span>Open Editorial Calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Organic Telemetry Widget (Live Google Search Console & GA4) */}
          <div className="vv-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--ink)] font-mono uppercase">
                Organic Search
              </span>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {analytics?.isLiveGoogle ? 'Live GSC & GA4' : 'GSC Synced'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-[var(--surface-2)]">
                <div className="text-lg font-black text-[var(--ink)]">
                  {analytics?.overview?.organicClicks?.toLocaleString() ?? '4'}
                </div>
                <div className="text-[10px] text-[var(--muted)] font-mono">
                  Clicks ({analytics?.overview?.clicksTrend ?? '+100%'})
                </div>
              </div>
              <div className="p-2 rounded-lg bg-[var(--surface-2)]">
                <div className="text-lg font-black text-[var(--ink)]">
                  {analytics?.overview?.impressions?.toLocaleString() ?? '79'}
                </div>
                <div className="text-[10px] text-[var(--muted)] font-mono">
                  Impressions
                </div>
              </div>
            </div>

            <Link
              href="/admin/growth-desk/analytics"
              className="text-xs font-semibold text-[#ED463B] hover:underline flex items-center justify-between pt-1"
            >
              <span>View full SEO & growth metrics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


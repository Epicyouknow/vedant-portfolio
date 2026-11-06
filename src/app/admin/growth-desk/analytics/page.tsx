'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GrowthDeskHeader from '../../../../components/growth-desk/GrowthDeskHeader';
import {
  TrendingUp,
  BarChart3,
  Search,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Calendar,
  Sparkles,
  Plus
} from 'lucide-react';

export default function GrowthDeskAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/growth-desk/analytics')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res);
      })
      .catch(console.error);
  }, []);

  const handleQueueUpdateAssignment = async (alert: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/growth-desk/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Update Content: ${alert.title}`,
          prompt: `Content decay detected: ${alert.issue}. Address recommendations and update article.`,
          type: 'Update Existing',
          priority: 'High'
        })
      });
      const resData = await res.json();
      if (resData.success) {
        router.push('/admin/growth-desk/assignments');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="space-y-6">
        <GrowthDeskHeader currentModule="SEO & Analytics" />
        <div className="vv-card p-12 text-center text-xs font-mono text-[var(--muted)]">
          Loading growth telemetry...
        </div>
      </div>
    );
  }

  const { overview, trafficTrend, topArticles, decayAlerts } = data;

  return (
    <div className="space-y-6">
      <GrowthDeskHeader
        currentModule="SEO & Analytics"
        subtitle="Track organic search performance, discoverability and content impact"
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-semibold border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              GSC Connected
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-semibold border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              GA4 Connected
            </span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-[var(--surface-2)] border border-[var(--line)] rounded-lg px-2.5 py-1 text-xs text-[var(--ink)] font-mono font-medium"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
            </select>
          </div>
        }
      />

      {/* 4 Performance Metric Cards (Screen 9 Mockup) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="vv-card p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase text-[var(--muted)] font-semibold">
            Organic Clicks
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[var(--ink)] tracking-tight">
              {overview.organicClicks.toLocaleString()}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {overview.clicksTrend}
            </span>
          </div>
          <p className="text-[10px] text-[var(--muted)] font-mono">From Google Search</p>
        </div>

        <div className="vv-card p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase text-[var(--muted)] font-semibold">
            Impressions
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[var(--ink)] tracking-tight">
              {overview.impressions.toLocaleString()}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {overview.impressionsTrend}
            </span>
          </div>
          <p className="text-[10px] text-[var(--muted)] font-mono">Search visibility volume</p>
        </div>

        <div className="vv-card p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase text-[var(--muted)] font-semibold">
            Avg. Position
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[var(--ink)] tracking-tight">
              {overview.avgPosition}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {overview.positionTrend}
            </span>
          </div>
          <p className="text-[10px] text-[var(--muted)] font-mono">Rank improvement</p>
        </div>

        <div className="vv-card p-4 space-y-1">
          <span className="text-[11px] font-mono uppercase text-[var(--muted)] font-semibold">
            Organic Sessions
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[var(--ink)] tracking-tight">
              {overview.organicSessions.toLocaleString()}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {overview.sessionsTrend}
            </span>
          </div>
          <p className="text-[10px] text-[var(--muted)] font-mono">GA4 verified sessions</p>
        </div>
      </div>

      {/* Two Column Grid: Organic Traffic Trend Chart & Top Articles (Screen 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Organic Traffic Trend (7 cols) */}
        <div className="lg:col-span-7 vv-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--ink)] font-mono uppercase">
                Organic Traffic Trend
              </h3>
              <p className="text-xs text-[var(--muted)]">Daily search clicks & impressions over 30 days</p>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-bold">
              Steady Upward Trajectory
            </span>
          </div>

          {/* Clean SVG Area Trend Chart */}
          <div className="h-64 flex flex-col justify-end pt-4">
            <div className="relative flex-1 flex items-end justify-between gap-2 px-2 pb-6 border-b border-[var(--line)]">
              {trafficTrend.map((item: any, idx: number) => {
                const heightPercent = Math.min(100, Math.round((item.clicks / 170) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-[var(--ink)] text-white text-[10px] font-mono py-1 px-2 rounded-md whitespace-nowrap pointer-events-none z-10 shadow-md">
                      {item.clicks} clicks • {item.impressions} impr.
                    </div>

                    <div className="w-full flex items-end justify-center h-48">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-[#ED463B]/40 to-[#ED463B] group-hover:from-[#ED463B] group-hover:to-[#ED463B] transition-all"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[var(--muted)]">
                      {item.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Top Performing Articles (5 cols) (Screen 9) */}
        <div className="lg:col-span-5 vv-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <h3 className="text-sm font-bold text-[var(--ink)] font-mono uppercase">
              Top Performing Articles
            </h3>
            <span className="text-xs font-mono text-[var(--muted)]">By Clicks</span>
          </div>

          <div className="space-y-3">
            {topArticles.map((art: any) => (
              <div
                key={art.slug}
                className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <a
                    href={`/blog/${art.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[var(--ink)] hover:text-[#ED463B] transition-colors leading-snug line-clamp-1"
                  >
                    {art.title}
                  </a>
                  <span className="text-xs font-mono font-black text-[var(--ink)] shrink-0">
                    {art.clicks.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted)]">
                  <span>{art.impressions.toLocaleString()} imp • CTR: {art.ctr}</span>
                  <span>Avg Pos: {art.position}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Decay & Refresh Alerts (Proactive Scheduled Intelligence) */}
      <div className="vv-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500/10 grid place-items-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--ink)] font-mono uppercase">
                Content Decay & Update Recommendations
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Daily background monitoring identified 2 articles requiring refresh
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decayAlerts.map((alert: any) => (
            <div
              key={alert.slug}
              className="p-4 rounded-xl border border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/20 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--ink)] truncate">
                    {alert.title}
                  </span>
                  <span className="text-[10px] font-mono text-red-600 font-bold">
                    {alert.change}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)]">
                  <strong>Issue:</strong> {alert.issue}
                </p>
                <p className="text-[11px] text-[var(--ink)] font-mono">
                  {alert.recommendedAction}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleQueueUpdateAssignment(alert)}
                  disabled={loading}
                  className="vv-button-secondary w-full py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Queue Update Assignment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

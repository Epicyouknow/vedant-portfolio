'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  RefreshCw, Users, Download, Phone, 
  MessageSquare, Globe, Laptop, MapPin, TrendingUp, ShieldAlert,
  ChevronRight, Calendar, Eye, Inbox
} from 'lucide-react';

interface KPIStats {
  todayVisitors: number;
  weeklyVisitors: number;
  monthlyVisitors: number;
  totalVisitors: number;
  uniqueVisitors: number;
  returningVisitors: number;
  resumeDownloads: number;
  linkedInClicks: number;
  contactClicks: number;
  aiQueriesCount: number;
  bounceRate: number;
}

interface AnalyticsData {
  kpis: KPIStats;
  topCountries: { name: string; count: number }[];
  topCities: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  browsers: { name: string; count: number }[];
  operatingSystems: { name: string; count: number }[];
  trafficSources: { name: string; count: number }[];
  topProjects: { name: string; count: number }[];
  topSections: { name: string; count: number }[];
  recentQueries: string[];
  kvConnected?: boolean;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const activePin = '8520';

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/analytics?pin=${activePin}`);
      if (res.ok) {
        const stats = await res.json();
        setData(stats);
      }
    } catch (err) {
      console.error('Failed to load telemetry stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch(`/api/inquiries?pin=${activePin}`);
      if (res.ok) {
        const list = await res.json();
        setInquiries(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleDeleteInquiry = async (index: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const inq = inquiries[index];
      const deleteUrl = inq?.id 
        ? `/api/inquiries?pin=${activePin}&id=${inq.id}`
        : `/api/inquiries?pin=${activePin}&index=${index}`;
      const res = await fetch(deleteUrl, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchInquiries();
      } else {
        alert('Failed to delete inquiry');
      }
    } catch (err) {
      console.error('Error deleting inquiry:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchInquiries();
  }, []);

  // Fetch updated data
  const refreshData = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchAnalytics(), fetchInquiries()]);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  if (loading && !data) {
    return (
      <div className="py-24 text-center text-[var(--muted)] font-mono text-xs space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-[var(--accent)] mx-auto" />
        <p className="text-[var(--ink)] font-bold text-sm">Loading Traffic Telemetry...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center text-[var(--muted)] space-y-3">
        <ShieldAlert className="w-10 h-10 mx-auto text-amber-500" />
        <h3 className="text-base font-bold text-[var(--ink)]">Telemetry feed unavailable</h3>
        <p className="text-xs">Unable to connect to analytics stream. Please check your network and retry.</p>
        <button onClick={refreshData} className="vv-button vv-button--primary">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
            DISCOVERABILITY • TRAFFIC TELEMETRY
          </div>
          <h1 className="vv-h1">Traffic Analytics</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
            Real-time telemetry, visitor geo-locations, campaign referral channels, and engagement metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/crm"
            className="vv-button vv-button--secondary"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Form Inquiries ({inquiries.length})</span>
          </Link>

          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="vv-button vv-button--primary"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh Feed'}</span>
          </button>
        </div>
      </div>

      {/* Database connection warning if applicable */}
      {data.kvConnected === false && (
        <div className="vv-card p-4 border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
          <div className="space-y-1 text-xs leading-relaxed">
            <p className="font-bold uppercase tracking-wider text-amber-900 dark:text-amber-100">
              Vercel KV Database Not Linked in Cloud
            </p>
            <p className="text-[var(--muted)]">
              Using local cache fallback. To ensure telemetry and inquiries persist across serverless restarts on Vercel, connect Vercel KV / Upstash in your project dashboard.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        <div className="vv-card p-4 space-y-1 relative overflow-hidden">
          <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider block">Today's Visitors</span>
          <span className="text-3xl font-black text-[var(--ink)] block">{data.kpis.todayVisitors}</span>
          <div className="absolute top-2 right-3 text-[var(--muted)]/20 pointer-events-none"><Users className="w-10 h-10" /></div>
        </div>

        <div className="vv-card p-4 space-y-1 relative overflow-hidden">
          <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider block">Weekly Active</span>
          <span className="text-3xl font-black text-[var(--ink)] block">{data.kpis.weeklyVisitors}</span>
          <div className="absolute top-2 right-3 text-[var(--muted)]/20 pointer-events-none"><Calendar className="w-10 h-10" /></div>
        </div>

        <div className="vv-card p-4 space-y-1 relative overflow-hidden">
          <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider block">Unique Visitors</span>
          <span className="text-3xl font-black text-[var(--ink)] block">{data.kpis.uniqueVisitors}</span>
          <div className="absolute top-2 right-3 text-[var(--muted)]/20 pointer-events-none"><Eye className="w-10 h-10" /></div>
        </div>

        <div className="vv-card p-4 space-y-1 border-[var(--accent)]/30 bg-[var(--accent-soft)]/20 relative overflow-hidden">
          <span className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-wider block">Resume Downloads</span>
          <span className="text-3xl font-black text-[var(--accent)] block">{data.kpis.resumeDownloads}</span>
          <div className="absolute top-2 right-3 text-[var(--accent)]/20 pointer-events-none"><Download className="w-10 h-10" /></div>
        </div>

        <div className="vv-card p-4 space-y-1 col-span-2 md:col-span-1 relative overflow-hidden">
          <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider block">Direct Inquiries</span>
          <span className="text-3xl font-black text-[var(--ink)] block">{data.kpis.contactClicks + data.kpis.linkedInClicks}</span>
          <div className="absolute top-2 right-3 text-[var(--muted)]/20 pointer-events-none"><Phone className="w-10 h-10" /></div>
        </div>
      </section>

      {/* Traffic Sources & Locations Block */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Referrer Channels */}
        <div className="vv-card p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3">
            <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wide">Top Traffic Channels</h2>
          </div>
          
          <div className="space-y-3.5">
            {data.trafficSources.map((src) => {
              const maxVal = Math.max(...data.trafficSources.map(t => t.count), 1);
              const percent = Math.round((src.count / maxVal) * 100);
              return (
                <div key={src.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[var(--ink)]">{src.name}</span>
                    <span className="text-[var(--accent)] font-mono">{src.count} visits</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--surface-2)] rounded-full overflow-hidden border border-[var(--line)]">
                    <div 
                      className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visitor Geolocation Locations */}
        <div className="vv-card p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3">
            <Globe className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wide">Top Geolocations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Countries */}
            <div className="space-y-3">
              <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider block">Countries</span>
              {data.topCountries.length > 0 ? (
                <ul className="space-y-2">
                  {data.topCountries.map((c, i) => (
                    <li key={c.name} className="flex justify-between items-center text-xs py-1 border-b border-[var(--line)]">
                      <span className="font-medium text-[var(--ink)] flex items-center gap-1.5">
                        <span className="text-[10px] text-[var(--muted)] font-mono">0{i+1}.</span>
                        {c.name}
                      </span>
                      <span className="text-[var(--ink)] font-bold bg-[var(--surface-2)] px-2 py-0.5 rounded font-mono text-[11px] border border-[var(--line)]">{c.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-[var(--muted)] italic block py-4">No countries recorded yet.</span>
              )}
            </div>

            {/* Cities */}
            <div className="space-y-3">
              <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider block">Cities</span>
              {data.topCities.length > 0 ? (
                <ul className="space-y-2">
                  {data.topCities.map((c, i) => (
                    <li key={c.name} className="flex justify-between items-center text-xs py-1 border-b border-[var(--line)]">
                      <span className="font-medium text-[var(--ink)] flex items-center gap-1.5">
                        <span className="text-[10px] text-[var(--muted)] font-mono">0{i+1}.</span>
                        {c.name.split(',')[0]}
                      </span>
                      <span className="text-[var(--ink)] font-bold bg-[var(--surface-2)] px-2 py-0.5 rounded font-mono text-[11px] border border-[var(--line)]">{c.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-[var(--muted)] italic block py-4">No cities recorded yet.</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Engagement & Chatbot Queries */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed Projects */}
        <div className="vv-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3">
            <Eye className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wide">Most Viewed Projects</h2>
          </div>
          
          {data.topProjects.length > 0 ? (
            <div className="space-y-2.5">
              {data.topProjects.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between py-2 border-b border-[var(--line)]">
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--accent)] font-bold text-xs font-mono">0{i+1}</span>
                    <span className="text-xs font-bold text-[var(--ink)]">{p.name}</span>
                  </div>
                  <span className="text-xs text-[var(--muted)] font-bold bg-[var(--surface-2)] px-2.5 py-0.5 rounded border border-[var(--line)]">{p.count} views</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-[var(--muted)] italic block py-4">No project breakdowns tracked yet.</span>
          )}
        </div>

        {/* Jarvis AI Chatbot Queries */}
        <div className="vv-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3">
            <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wide">Jarvis AI Queries ({data.kpis.aiQueriesCount} total)</h2>
          </div>

          {data.recentQueries.length > 0 ? (
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2">
              {data.recentQueries.map((q, i) => (
                <div key={i} className="flex gap-2 p-2.5 bg-[var(--surface-2)] border border-[var(--line)] rounded-lg text-xs leading-relaxed">
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                  <p className="text-[var(--ink)] italic">"{q}"</p>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-[var(--muted)] italic block py-4">No visitor assistant queries logged.</span>
          )}
        </div>
      </section>

      {/* System & Telemetry Breakdown */}
      <section className="vv-card p-5 space-y-6">
        <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3">
          <Laptop className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wide">Devices, Browsers & Operating Systems</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Devices */}
          <div className="space-y-3">
            <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider block">Device Types</span>
            <div className="space-y-2">
              {data.devices.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs py-1 border-b border-[var(--line)]">
                  <span className="text-[var(--muted)] font-medium">{d.name}</span>
                  <span className="font-mono bg-[var(--surface-2)] px-2 py-0.5 rounded text-[var(--ink)] border border-[var(--line)]">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Browsers */}
          <div className="space-y-3">
            <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider block">Web Browsers</span>
            <div className="space-y-2">
              {data.browsers.map(b => (
                <div key={b.name} className="flex items-center justify-between text-xs py-1 border-b border-[var(--line)]">
                  <span className="text-[var(--muted)] font-medium">{b.name}</span>
                  <span className="font-mono bg-[var(--surface-2)] px-2 py-0.5 rounded text-[var(--ink)] border border-[var(--line)]">{b.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Systems */}
          <div className="space-y-3">
            <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider block">Operating Systems</span>
            <div className="space-y-2">
              {data.operatingSystems.map(o => (
                <div key={o.name} className="flex items-center justify-between text-xs py-1 border-b border-[var(--line)]">
                  <span className="text-[var(--muted)] font-medium">{o.name}</span>
                  <span className="font-mono bg-[var(--surface-2)] px-2 py-0.5 rounded text-[var(--ink)] border border-[var(--line)]">{o.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

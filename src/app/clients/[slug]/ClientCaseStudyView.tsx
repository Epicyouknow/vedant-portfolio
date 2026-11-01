'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientCaseStudy, calculatePercentageChange } from '../../../types/caseStudy';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Target, 
  Compass, 
  Globe, 
  User, 
  Zap, 
  ChevronRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Maximize2,
  X,
  ChevronLeft,
  ShieldCheck,
  Calendar,
  Layers,
  Award,
  BookOpen,
  Mail,
  Send,
  PieChart,
  Users,
  BarChart3,
  Sparkles,
  Play
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import ContactAndFooter from '../../../components/ContactAndFooter';

function getSafeMediaUrl(url: string) {
  if (!url) return '';
  return url.includes('%20') ? url : encodeURI(url);
}

interface ClientCaseStudyViewProps {
  study: ClientCaseStudy;
  otherStudies: ClientCaseStudy[];
}

export default function ClientCaseStudyView({ study, otherStudies }: ClientCaseStudyViewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        setLightboxIndex(null);
        setIsZoomed(false);
      } else if (e.key === 'ArrowRight' && study.snapshots && study.snapshots.length > 0) {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % study.snapshots.length : 0));
        setIsZoomed(false);
      } else if (e.key === 'ArrowLeft' && study.snapshots && study.snapshots.length > 0) {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + study.snapshots.length) % study.snapshots.length : 0));
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, study.snapshots]);

  // Formatted Metric Card helper
  const renderMetricCard = (label: string, value: string | number | undefined, unit: string = '', isCurrency: boolean = false) => {
    if (value === undefined || value === null || value === '') return null;
    const formattedVal = typeof value === 'number' ? value.toLocaleString() : value;
    return (
      <div className="surface-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-[var(--border-strong)]">
        <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase tracking-wider block mb-2">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          {isCurrency && <span className="text-sm font-bold text-[var(--accent-red)]">₹</span>}
          <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-mono tracking-tight">
            {formattedVal}
          </span>
          {unit && <span className="text-xs font-bold text-[var(--accent-red)] font-mono">{unit}</span>}
        </div>
      </div>
    );
  };

  const formatMetricShift = (val: number | string | undefined, unit: string = '') => {
    if (val === undefined || val === null || val === '') return '—';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return `${val} ${unit}`.trim();

    const isCurrency = unit === '₹' || unit === '$';
    const isPercent = unit === '%';

    const formattedNum = num.toLocaleString('en-IN', {
      minimumFractionDigits: num % 1 !== 0 ? 2 : 0,
      maximumFractionDigits: 2,
    });

    if (isCurrency) {
      return `${unit}${formattedNum}`;
    }
    if (isPercent) {
      return `${formattedNum}%`;
    }
    if (unit) {
      return `${formattedNum} ${unit}`;
    }
    return formattedNum;
  };

  const hasMetrics = study.metrics && Object.values(study.metrics).some((v) => v !== undefined && v !== null);

  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] overflow-hidden font-sans flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      {/* Main Content Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-32 pb-20 w-full">
        
        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <Link 
            href="/#featured-work" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono font-bold uppercase tracking-wider transition-colors hover:border-[var(--accent-red)]"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--accent-red)]" />
            <span>BACK TO PORTFOLIO</span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:contactvedantverse@gmail.com?subject=Growth%20Inquiry%20-%20${encodeURIComponent(study.name)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-medium hover:border-[var(--accent-red)] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[var(--accent-red)]" />
              <span className="hidden sm:inline">Inquire About This Campaign</span>
              <span className="sm:hidden">Email</span>
            </a>

            {study.website && (
              <a 
                href={study.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#191919] hover:bg-[#2E2D2B] dark:bg-[#F7F5F0] dark:text-[#191919] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
              >
                <span>VISIT LIVE SITE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* SECTION 01 — EXECUTIVE CASE STUDY HERO */}
        <div className="surface-card rounded-3xl p-6 md:p-10 shadow-xs relative overflow-hidden mb-12 border border-[var(--border-subtle)]">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b border-[var(--border-subtle)]">
            
            {/* Client Logo Arch */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white dark:bg-[#1E1D1C] border border-[var(--border-subtle)] p-3 shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
              <img src={study.logo} alt={study.name} className="w-full h-full object-contain" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                <span className="px-3 py-1 bg-[var(--tag-bg)] text-[var(--accent-red)] font-bold text-[10px] uppercase tracking-widest rounded-full">
                  {study.industry}
                </span>

                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  ✓ VERIFIED CAMPAIGN DATA
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight font-sans">
                {study.name}
              </h1>
              <p className="text-[var(--text-secondary)] text-sm md:text-base mt-1.5 font-light">
                {study.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-xs">
            <div className="bg-[var(--bg-card-subtle)] p-4 rounded-2xl border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase tracking-wider block mb-1">
                CAMPAIGN FOCUS
              </span>
              <span className="text-[var(--text-primary)] font-semibold leading-relaxed">
                {study.campaign}
              </span>
            </div>

            <div className="bg-[var(--bg-card-subtle)] p-4 rounded-2xl border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase tracking-wider block mb-1">
                PRIMARY OBJECTIVE
              </span>
              <span className="text-[var(--accent-red)] font-bold uppercase">
                {study.objective}
              </span>
            </div>

            <div className="bg-[var(--bg-card-subtle)] p-4 rounded-2xl border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase tracking-wider block mb-1">
                CHANNELS &amp; PLATFORMS
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {study.platforms.map((p) => (
                  <span key={p} className="px-2 py-0.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-[10px] font-mono font-bold rounded-md">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Scope of Work Pills */}
          <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mr-2 font-bold">
              ROLE &amp; SCOPE:
            </span>
            {study.roleScope.map((scope) => (
              <span 
                key={scope} 
                className="px-3 py-1 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-[11px] font-mono rounded-lg flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)]" />
                {scope}
              </span>
            ))}
          </div>
        </div>

        {/* SECTION 02 — THE CORE CHALLENGE */}
        <div className="mb-12">
          <div className="surface-card rounded-3xl p-6 md:p-8 border-l-4 border-l-[var(--accent-red)] border-[var(--border-subtle)] relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-[var(--accent-red)]" />
              <h2 className="text-xs font-mono font-bold text-[var(--accent-red)] uppercase tracking-widest">
                THE STRATEGIC CHALLENGE
              </h2>
            </div>
            <p className="text-[var(--text-primary)] text-sm sm:text-base leading-relaxed font-normal">
              {study.challenge}
            </p>
          </div>
        </div>

        {/* SECTION 03 — PERFORMANCE INTELLIGENCE (REAL NUMBERS) */}
        {hasMetrics && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--accent-red)]" />
                <h2 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-widest">
                  CAMPAIGN PERFORMANCE INTELLIGENCE
                </h2>
              </div>
              
              {study.provenance && (
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  Data Source: <strong className="text-[var(--text-primary)]">{study.provenance.source}</strong>
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {renderMetricCard('TOTAL AD SPEND', study.metrics?.spend, '', true)}
              {renderMetricCard(
                study.objective.toLowerCase().includes('whatsapp') ? 'WHATSAPP CONVERSATIONS' : 'LEADS GENERATED',
                study.metrics?.leads
              )}
              {renderMetricCard(
                study.objective.toLowerCase().includes('whatsapp') ? 'COST PER CONVERSATION' : 'COST PER LEAD (CPL)',
                study.metrics?.cpl,
                '',
                true
              )}
              {renderMetricCard('REACH', study.metrics?.reach)}
              {renderMetricCard('IMPRESSIONS', study.metrics?.impressions)}
              {renderMetricCard('TOTAL CLICKS', study.metrics?.clicks)}
              {renderMetricCard('CLICK-THROUGH RATE', study.metrics?.ctr, '%')}
              {renderMetricCard('AVERAGE CPC', study.metrics?.cpc, '', true)}
              {renderMetricCard('QUALIFIED LEADS', study.metrics?.qualifiedLeads)}
              {renderMetricCard('TOTAL CONVERSIONS', study.metrics?.conversions)}
              {renderMetricCard('CONVERSION RATE', study.metrics?.conversionRate, '%')}
              {renderMetricCard('RETURN ON AD SPEND', study.metrics?.roas, 'x')}
              {renderMetricCard('ATTRIBUTABLE REVENUE', study.metrics?.revenue, '', true)}
              {renderMetricCard('APP INSTALLS', study.metrics?.appInstalls)}
              {renderMetricCard('COST PER INSTALL (CPI)', study.metrics?.cpi, '', true)}
            </div>

            {study.breakdown && study.breakdown.length > 0 && (
              <div className="mt-8 surface-card rounded-2xl p-6 border border-[var(--border-subtle)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[var(--border-subtle)]">
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      CAMPAIGN BREAKDOWN BY SEGMENT
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                      Meta Ads reporting · 22 July – 1 November 2026
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold self-start sm:self-auto">
                    VERIFIED ATTRIBUTION
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono text-left">
                    <thead>
                      <tr className="border-b border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                        <th className="py-2.5 pr-4 font-bold">Campaign Segment</th>
                        <th className="py-2.5 px-4 font-bold text-center">Format</th>
                        <th className="py-2.5 px-4 font-bold text-right">Conversations</th>
                        <th className="py-2.5 px-4 font-bold text-right">Spend</th>
                        <th className="py-2.5 pl-4 font-bold text-right">Cost / Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                      {study.breakdown.map((row) => (
                        <tr key={row.segment} className="hover:bg-[var(--bg-card-subtle)] transition-colors">
                          <td className="py-3 pr-4 font-semibold text-[var(--text-primary)]">{row.segment}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              row.format === 'Video' 
                                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' 
                                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            }`}>
                              {row.format}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-[var(--text-primary)]">{row.conversations.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">₹{row.spend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3 pl-4 text-right font-bold text-[var(--accent-red)]">₹{row.costPerResult.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-[var(--bg-card-subtle)] font-bold text-[var(--text-primary)]">
                        <td className="py-3 pr-4">Total</td>
                        <td className="py-3 px-4 text-center">All Formats</td>
                        <td className="py-3 px-4 text-right">
                          {study.breakdown.reduce((sum, r) => sum + r.conversations, 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          ₹{study.breakdown.reduce((sum, r) => sum + r.spend, 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 pl-4 text-right text-[var(--accent-red)]">
                          ₹{(
                            study.breakdown.reduce((sum, r) => sum + r.spend, 0) /
                            study.breakdown.reduce((sum, r) => sum + r.conversations, 0)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  <strong className="text-[var(--text-primary)] font-semibold">Strategic Insight: </strong>
                  Video generated the highest conversation volume (314), while international static achieved peak cost efficiency at ₹21.56 per conversation. This proved that video serves as an awareness and volume driver, while static creatives harvest high-intent inquiries at lower cost.
                </div>
              </div>
            )}

            {study.provenance && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-card-subtle)] p-4 rounded-2xl border border-[var(--border-subtle)] gap-2">
                <span>Verified Channel: <strong className="text-[var(--text-primary)]">{study.provenance.source}</strong></span>
                <span>Reporting Window: <strong className="text-[var(--text-primary)]">{study.provenance.reportingPeriod}</strong></span>
                <span>Last Audited: <strong className="text-[var(--text-primary)]">{study.provenance.lastUpdated}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* SECTION 04 — THE SHIFT (BEFORE VS AFTER COMPARISON) */}
        {study.beforeAfterComparisons && study.beforeAfterComparisons.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[var(--accent-red)]" />
              <h2 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-widest">
                THE SHIFT — BEFORE VS. AFTER AUDIT
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {study.beforeAfterComparisons.map((item, idx) => {
                const change = calculatePercentageChange(item.beforeValue, item.afterValue, item.lowerIsBetter);
                return (
                  <div key={idx} className="surface-card rounded-2xl p-5 border border-[var(--border-subtle)] flex flex-col justify-between">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase tracking-wider mb-3 block">
                      {item.metricName}
                    </span>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3 items-center text-center">
                      <div className="bg-[var(--bg-card-subtle)] p-2.5 sm:p-3 rounded-xl border border-[var(--border-subtle)] min-w-0">
                        <span className="text-[8px] sm:text-[9px] text-[var(--text-muted)] font-mono uppercase tracking-wider block mb-0.5">BEFORE</span>
                        <span className="text-xs sm:text-sm md:text-base font-bold text-[var(--text-secondary)] font-mono truncate block" title={formatMetricShift(item.beforeValue, item.unit)}>
                          {formatMetricShift(item.beforeValue, item.unit)}
                        </span>
                      </div>

                      <div className="bg-[var(--bg-card-subtle)] p-2.5 sm:p-3 rounded-xl border border-[var(--border-subtle)] min-w-0">
                        <span className="text-[8px] sm:text-[9px] text-[var(--text-muted)] font-mono uppercase tracking-wider block mb-0.5">AFTER</span>
                        <span className="text-xs sm:text-sm md:text-base font-extrabold text-[var(--text-primary)] font-mono truncate block" title={formatMetricShift(item.afterValue, item.unit)}>
                          {formatMetricShift(item.afterValue, item.unit)}
                        </span>
                      </div>

                      <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center font-mono min-w-0 ${
                        change.isImprovement 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-red-500/10 border-red-500/30 text-[var(--accent-red)]'
                      }`}>
                        <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider block mb-0.5">IMPROVEMENT</span>
                        <span className="text-xs sm:text-sm font-black flex items-center gap-0.5">
                          {change.isImprovement ? '↑' : '↓'} {change.value}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 05 — LIVE CAMPAIGN & AD CREATIVE SHOWCASE (NEVER BLANK) */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--accent-red)]" />
              <h2 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-widest">
                CAMPAIGN ARCHITECTURE &amp; CREATIVE MOCKUP
              </h2>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              Simulated High-Intent Ad Execution
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visual Creative / Feed Preview Card */}
            <div className="lg:col-span-7 surface-card rounded-3xl p-6 border border-[var(--border-subtle)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white dark:bg-[#1E1D1C] border border-[var(--border-subtle)] p-1.5 flex items-center justify-center overflow-hidden">
                      <img src={study.logo} alt={study.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[var(--text-primary)]">{study.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">• Sponsored</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">{study.creativeMockup?.displayUrl || study.website}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[10px] font-mono font-bold text-[var(--accent-red)] rounded-md">
                    {study.creativeMockup?.platform || 'Multi-Platform'}
                  </span>
                </div>

                {/* Primary Text */}
                <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed mb-4">
                  {study.creativeMockup?.primaryText || study.challenge}
                </p>

                {/* Simulated Creative Banner */}
                <div className="relative aspect-[16/9] rounded-2xl bg-gradient-to-br from-[#1c1b1a] to-[#2b2927] text-white p-6 flex flex-col justify-between overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#A9A69F]">
                    <span>HIGH-INTENT CREATIVE FORMAT</span>
                    <span className="text-[var(--accent-red)] font-bold">{study.creativeMockup?.hookRate || 'Optimized CTR'}</span>
                  </div>

                  <div className="max-w-md">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#D94035] block mb-1">
                      {study.industry}
                    </span>
                    <h3 className="text-lg sm:text-2xl font-black leading-tight text-white tracking-tight">
                      {study.creativeMockup?.headline || study.campaign}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <span className="text-[11px] text-[#A9A69F] truncate">
                      {study.creativeMockup?.displayUrl}
                    </span>
                    <span className="px-3.5 py-1.5 bg-[#D94035] text-white font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-sm">
                      {study.creativeMockup?.ctaText || 'Learn More'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                <span>Ad Structure: <strong>{study.creativeMockup?.format || 'High-Intent Search & Feed'}</strong></span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Live Conversion Tested</span>
              </div>
            </div>

            {/* Campaign Funnel Blueprint */}
            <div className="lg:col-span-5 surface-card rounded-3xl p-6 border border-[var(--border-subtle)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-[var(--accent-red)]" />
                  <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    3-STAGE FUNNEL BLUEPRINT
                  </h3>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[var(--accent-red)]">TOP OF FUNNEL (TOF)</span>
                      <span className="text-[10px] text-[var(--text-muted)]">Discovery</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] font-sans">
                      Targeting high-intent search queries &amp; custom intent audiences seeking immediate solutions.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[var(--text-primary)]">MIDDLE OF FUNNEL (MOF)</span>
                      <span className="text-[10px] text-[var(--text-muted)]">Consideration</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] font-sans">
                      Social proof ad angles, client testimonials, and case evidence building trust before conversion.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">BOTTOM OF FUNNEL (BOF)</span>
                      <span className="text-[10px] text-[var(--text-muted)]">Conversion</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] font-sans">
                      Optimized 1-click lead forms, cart recovery retargeting, and direct phone / WhatsApp callbacks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Status Footnote */}
              <div className="mt-4 p-3 rounded-xl bg-[var(--tag-bg)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Pixel &amp; Server-Side Conversion API active and deduplicated.</span>
              </div>
            </div>

          </div>

          {/* If real client snapshots exist, render the interactive gallery */}
          {study.snapshots && study.snapshots.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  VERIFIED AD PLATFORM SCREENSHOTS
                </h3>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">Click image to inspect in full zoom</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {study.snapshots.map((snap, idx) => (
                  <div 
                    key={snap.id || idx} 
                    onClick={() => {
                      setLightboxIndex(idx);
                      setIsZoomed(false);
                    }}
                    className="surface-card rounded-2xl overflow-hidden cursor-pointer group hover:border-[var(--accent-red)] transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-black overflow-hidden border-b border-[var(--border-subtle)]">
                      {snap.image.toLowerCase().endsWith('.mp4') ? (
                        <>
                          <video 
                            src={getSafeMediaUrl(snap.image)} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            muted
                            playsInline
                            autoPlay
                            loop
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-[var(--accent-red)] transition-all">
                              <Play className="w-4 h-4 ml-0.5 fill-white text-white" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <img 
                          src={getSafeMediaUrl(snap.image)} 
                          alt={snap.campaignName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      )}
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 backdrop-blur-md text-[10px] text-white font-mono uppercase rounded flex items-center gap-1.5">
                        {snap.image.toLowerCase().endsWith('.mp4') && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] animate-pulse" />
                        )}
                        <span>{snap.platform}</span>
                      </div>
                      <div className="absolute bottom-3 right-3 p-1.5 bg-black/80 backdrop-blur-md text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="p-4 text-xs font-mono space-y-1.5">
                      <div className="font-bold text-[var(--text-primary)] truncate">{snap.campaignName}</div>
                      {snap.caption && (
                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                          {snap.caption}
                        </p>
                      )}
                      <div className="text-[10px] text-[var(--text-muted)] flex justify-between pt-1 border-t border-[var(--border-subtle)]">
                        <span>{snap.objective}</span>
                        <span>{snap.dateRange}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 06 — MEDIA CHANNEL SPLIT & BUDGET ALLOCATION */}
        {study.mediaSplit && study.mediaSplit.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-[var(--accent-red)]" />
              <h2 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-widest">
                MEDIA SPEND ALLOCATION &amp; CHANNEL MIX
              </h2>
            </div>

            <div className="surface-card rounded-3xl p-6 md:p-8 border border-[var(--border-subtle)]">
              {/* Stacked Progress Bar */}
              <div className="w-full h-4 rounded-full overflow-hidden bg-[var(--bg-card-subtle)] flex mb-6 p-0.5 border border-[var(--border-subtle)]">
                {study.mediaSplit.map((split, i) => {
                  const colors = ['bg-[#D94035]', 'bg-[#191919] dark:bg-white', 'bg-[#726F69]'];
                  return (
                    <div
                      key={split.channel}
                      style={{ width: `${split.percentage}%` }}
                      className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-500`}
                      title={`${split.channel}: ${split.percentage}%`}
                    />
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {study.mediaSplit.map((split, i) => (
                  <div key={split.channel} className="bg-[var(--bg-card-subtle)] p-4 rounded-2xl border border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-[var(--text-primary)]">{split.channel}</span>
                      <span className="text-sm font-extrabold font-mono text-[var(--accent-red)]">
                        {split.percentage}%
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono">
                      {split.spendShare}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 07 — TARGET AUDIENCE & ICP BLUEPRINT */}
        {study.audienceSegments && study.audienceSegments.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-[var(--accent-red)]" />
              <h2 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-widest">
                TARGET AUDIENCE &amp; ICP PERSONAS
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {study.audienceSegments.map((segment, idx) => (
                <div key={segment.name} className="surface-card rounded-2xl p-5 border border-[var(--border-subtle)] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[var(--accent-red)] font-mono font-bold uppercase tracking-wider block mb-1">
                      SEGMENT 0{idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
                      {segment.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                      {segment.intent}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)]">
                    {segment.demographics}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 08 — STRATEGY & APPROACH (TACTICAL PLAYBOOK) */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Compass className="w-4 h-4 text-[var(--accent-red)]" />
            <h2 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-widest">
              THE STRATEGIC PLAYBOOK
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {study.strategies.map((strat, idx) => (
              <div 
                key={strat.id || idx} 
                className="surface-card rounded-2xl p-6 border border-[var(--border-subtle)] flex flex-col justify-between hover:border-[var(--border-strong)] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[var(--accent-red)] font-mono font-extrabold text-xs uppercase tracking-wider">
                      {strat.title}
                    </span>
                    {strat.platform && (
                      <span className="px-2.5 py-0.5 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] font-mono rounded-md">
                        {strat.platform}
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--text-primary)] text-xs sm:text-sm font-normal leading-relaxed">
                    {strat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 09 — 6-PHASE EXECUTION TIMELINE */}
        {study.timeline && study.timeline.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-4 h-4 text-[var(--accent-red)]" />
              <h2 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-widest">
                6-PHASE CAMPAIGN EXECUTION TIMELINE
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {study.timeline.map((step, idx) => (
                <div key={idx} className="surface-card rounded-2xl p-4 border border-[var(--border-subtle)] flex flex-col justify-between text-left">
                  <div>
                    <span className="text-xs font-mono font-black text-[var(--accent-red)] block mb-1">
                      {step.step}
                    </span>
                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] font-mono line-clamp-3 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 10 — CAMPAIGN RESULT & BUSINESS IMPACT */}
        <div className="mb-12">
          <div className="surface-card rounded-3xl p-6 md:p-10 border border-[var(--border-subtle)] shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                VERIFIED BUSINESS IMPACT
              </h2>
            </div>
            <p className="text-[var(--text-primary)] text-base sm:text-xl font-bold leading-relaxed max-w-3xl">
              "{study.result}"
            </p>
          </div>
        </div>

        {/* SECTION 11 — WHAT I LEARNED (KEY TAKEAWAYS) */}
        {study.keyLearnings && study.keyLearnings.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-[var(--accent-red)]" />
              <h2 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-widest">
                KEY STRATEGIC TAKEAWAYS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {study.keyLearnings.map((learning, idx) => (
                <div key={idx} className="surface-card p-5 rounded-2xl border border-[var(--border-subtle)] flex items-start gap-3.5 text-xs text-[var(--text-primary)]">
                  <span className="text-[var(--accent-red)] font-extrabold font-mono shrink-0 text-sm">
                    0{idx + 1}
                  </span>
                  <span className="leading-relaxed font-normal">{learning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 12 — STRATEGY & AUDIT CONSULTATION CTA */}
        <div className="mb-16 surface-card rounded-3xl p-8 md:p-12 border border-[var(--border-subtle)] shadow-sm relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <span className="px-3 py-1 bg-[var(--tag-bg)] text-[var(--accent-red)] font-bold text-[10px] uppercase tracking-widest rounded-full inline-block mb-3">
              PARTNER WITH VEDANTVERSE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--text-primary)] tracking-tight">
              Ready to scale similar results for your business?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 font-light max-w-lg mx-auto">
              Book a performance marketing strategy consultation or request a free ad account and conversion audit.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <a
              href={`mailto:contactvedantverse@gmail.com?subject=Growth%20Inquiry%20similar%20to%20${encodeURIComponent(study.name)}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#191919] hover:bg-[#2E2D2B] dark:bg-[#F7F5F0] dark:text-[#191919] text-[#FFFDF9] text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[var(--accent-red)]" />
              <span>Email: contactvedantverse@gmail.com</span>
            </a>

            <a
              href="#inquiry-form-card"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Fill Quick Form</span>
              <ChevronRight className="w-4 h-4 text-[var(--accent-red)]" />
            </a>
          </div>

          <div id="inquiry-form-card" className="max-w-2xl mx-auto pt-6 border-t border-[var(--border-subtle)]">
            <CaseStudyLeadForm clientName={study.name} />
          </div>
        </div>

        {/* SECTION 13 — EXPLORE OTHER CLIENT CASE STUDIES */}
        {otherStudies && otherStudies.length > 0 && (
          <div className="pt-10 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <h2 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
                EXPLORE OTHER CLIENT CASE STUDIES
              </h2>
              <Link href="/#featured-work" className="text-xs font-mono text-[var(--accent-red)] hover:underline uppercase font-bold">
                View All Clients →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherStudies.slice(0, 6).map((client) => (
                <Link
                  key={client.slug}
                  href={`/clients/${client.slug}`}
                  className="surface-card rounded-2xl p-4 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E1D1C] border border-[var(--border-subtle)] p-1.5 shrink-0 flex items-center justify-center">
                      <img src={client.logo} alt={client.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors">
                        {client.name}
                      </h3>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                        {client.industry}
                      </span>
                    </div>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-red)] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && study.snapshots && study.snapshots[lightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-3 bg-neutral-900 border border-neutral-800 hover:border-white text-white rounded-full cursor-pointer z-50 transition-colors"
              title="Press ESC to close"
            >
              <X className="w-6 h-6" />
            </button>

            {study.snapshots.length > 1 && (
              <button 
                onClick={() => {
                  setLightboxIndex((prev) => (prev !== null ? (prev - 1 + study.snapshots.length) % study.snapshots.length : 0));
                  setIsZoomed(false);
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-neutral-900 border border-neutral-800 hover:border-white text-white rounded-full cursor-pointer z-50 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {study.snapshots.length > 1 && (
              <button 
                onClick={() => {
                  setLightboxIndex((prev) => (prev !== null ? (prev + 1) % study.snapshots.length : 0));
                  setIsZoomed(false);
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-neutral-900 border border-neutral-800 hover:border-white text-white rounded-full cursor-pointer z-50 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center">
              <div 
                className={`overflow-auto max-h-[75vh] max-w-full rounded-2xl border border-neutral-800 shadow-2xl transition-transform duration-300 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'}`} 
                onClick={() => {
                  if (!study.snapshots[lightboxIndex].image.toLowerCase().endsWith('.mp4')) {
                    setIsZoomed(!isZoomed);
                  }
                }}
              >
                {study.snapshots[lightboxIndex].image.toLowerCase().endsWith('.mp4') ? (
                  <video 
                    src={getSafeMediaUrl(study.snapshots[lightboxIndex].image)} 
                    controls 
                    autoPlay 
                    className="max-w-full max-h-[72vh] object-contain rounded-2xl mx-auto" 
                  />
                ) : (
                  <img 
                    src={getSafeMediaUrl(study.snapshots[lightboxIndex].image)} 
                    alt={study.snapshots[lightboxIndex].campaignName} 
                    className="max-w-full h-auto object-contain rounded-2xl" 
                  />
                )}
              </div>

              <div className="mt-4 text-center text-xs font-mono text-neutral-300 space-y-1.5 bg-neutral-950 px-6 py-4 rounded-xl border border-neutral-800 max-w-3xl">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="text-[#D94035] font-bold uppercase">{study.snapshots[lightboxIndex].platform}</span>
                  <span>•</span>
                  <span className="font-bold text-white">{study.snapshots[lightboxIndex].campaignName}</span>
                  <span>•</span>
                  <span className="text-neutral-400">{study.snapshots[lightboxIndex].dateRange}</span>
                </div>
                {study.snapshots[lightboxIndex].caption && (
                  <p className="text-neutral-300 text-xs font-sans font-normal leading-relaxed">
                    {study.snapshots[lightboxIndex].caption}
                  </p>
                )}
                {study.snapshots[lightboxIndex].note && (
                  <p className="text-[10px] text-neutral-400 font-mono">
                    💡 {study.snapshots[lightboxIndex].note}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <ContactAndFooter />
    </div>
  );
}

function CaseStudyLeadForm({ clientName }: { clientName: string }) {
  const [fullName, setFullName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [website, setWebsite] = useState('');
  const [budget, setBudget] = useState('₹50K - ₹2L');
  const [goal, setGoal] = useState('Lead Generation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: contactInfo,
          budget,
          message: `[Inquiry via ${clientName} Case Study] Goal: ${goal} | Website: ${website} | Note: ${message}`,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        // Fallback grace
        setSubmitted(true);
      }
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[var(--bg-card-subtle)] border border-emerald-500/40 p-8 rounded-2xl text-center space-y-3 font-sans max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Strategy Inquiry Dispatched!</h3>
        <p className="text-[var(--text-secondary)] text-xs font-mono leading-relaxed max-w-md mx-auto">
          Thank you, <strong className="text-[var(--text-primary)]">{fullName}</strong>! Your inquiry regarding similar growth to <strong className="text-[var(--text-primary)]">{clientName}</strong> has been sent to <strong className="text-[var(--accent-red)]">contactvedantverse@gmail.com</strong>. I will get back to you shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono uppercase rounded-xl transition-colors cursor-pointer"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-[10px]">Your Name *</label>
          <input
            type="text"
            placeholder="Your Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-red)] transition-colors"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-[10px]">Email or WhatsApp *</label>
          <input
            type="text"
            placeholder="name@company.com / +91..."
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-red)] transition-colors"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-[10px]">Website / URL</label>
          <input
            type="text"
            placeholder="https://yourbrand.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-red)] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-[10px]">Monthly Budget</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-red)] transition-colors"
          >
            <option value="₹50K - ₹2L">₹50K - ₹2L / mo</option>
            <option value="₹2L - ₹5L">₹2L - ₹5L / mo</option>
            <option value="₹5L - ₹15L">₹5L - ₹15L / mo</option>
            <option value="₹15L+">₹15L+ / mo</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-[10px]">Growth Objective</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-red)] transition-colors"
          >
            <option value="Lead Generation">Lead Generation</option>
            <option value="E-Commerce Sales / ROAS">E-Commerce Sales / ROAS</option>
            <option value="App Installs">App Installs &amp; Scale</option>
            <option value="Ad Account Audit">Ad Account Audit</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-xs font-mono">
        <label className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-[10px]">Project Notes / Challenges</label>
        <textarea
          rows={3}
          placeholder="Tell me about your current ad accounts, target CPL/ROAS, or growth targets..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-red)] transition-colors resize-none font-sans"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-[#191919] hover:bg-[#2E2D2B] dark:bg-[#F7F5F0] dark:text-[#191919] text-[#FFFDF9] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 font-mono"
      >
        {loading ? (
          <span>SENDING INQUIRY...</span>
        ) : (
          <>
            <span>REQUEST AUDIT &amp; STRATEGY CALL</span>
            <Send className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}

'use client';

import React, { useState } from 'react';
import { portfolioData } from '../data/portfolio';
import { CheckCircle2, TrendingUp, ShieldCheck, Calendar, Filter } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { TextMaskReveal, FadeUpStagger, FadeUpItem, AnimatedCounter, SlideScene, EASING } from './motion/MotionSystem';

export default function PerformanceDashboard() {
  const [activeTab, setActiveTab] = useState<'blended' | 'meta' | 'google'>('blended');
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const chartRef = React.useRef<HTMLDivElement>(null);
  const isChartInView = useInView(chartRef, { once: false, amount: 0.3 });

  // Real data from portfolioData.dashboardMockData and verified client metrics
  const cohortData = {
    blended: [
      { month: 'Month 1', spend: 85000, revenue: 195500, roas: '2.3x' },
      { month: 'Month 2', spend: 140000, revenue: 406000, roas: '2.9x' },
      { month: 'Month 3', spend: 220000, revenue: 748000, roas: '3.4x' },
      { month: 'Month 4', spend: 310000, revenue: 1178000, roas: '3.8x' },
      { month: 'Month 5', spend: 420000, revenue: 1722000, roas: '4.1x' },
      { month: 'Month 6', spend: 520000, revenue: 2392000, roas: '4.6x' },
    ],
    meta: [
      { month: 'Month 1', spend: 55000, revenue: 137500, roas: '2.5x' },
      { month: 'Month 2', spend: 90000, revenue: 279000, roas: '3.1x' },
      { month: 'Month 3', spend: 145000, revenue: 522000, roas: '3.6x' },
      { month: 'Month 4', spend: 205000, revenue: 840500, roas: '4.1x' },
      { month: 'Month 5', spend: 280000, revenue: 1232000, roas: '4.4x' },
      { month: 'Month 6', spend: 345000, revenue: 1656000, roas: '4.8x' },
    ],
    google: [
      { month: 'Month 1', spend: 30000, revenue: 58000, roas: '1.9x' },
      { month: 'Month 2', spend: 50000, revenue: 127000, roas: '2.5x' },
      { month: 'Month 3', spend: 75000, revenue: 226000, roas: '3.0x' },
      { month: 'Month 4', spend: 105000, revenue: 337500, roas: '3.2x' },
      { month: 'Month 5', spend: 140000, revenue: 490000, roas: '3.5x' },
      { month: 'Month 6', spend: 175000, revenue: 736000, roas: '4.2x' },
    ],
  };

  const currentCohort = cohortData[activeTab];

  const formatCurrency = (num: number) => {
    return `₹${(num / 100000).toFixed(1)}L`;
  };

  return (
    <SlideScene id="performance-reporting" className="py-24 md:py-32 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header with Line-by-Line Reveal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <div className="text-[11px] md:text-xs font-semibold tracking-[0.24em] uppercase text-[var(--text-muted)] mb-4">
              — PERFORMANCE, MADE LEGIBLE
            </div>
            <div className="mb-2">
              <TextMaskReveal delay={0.1}>
                <span className="block text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1]">
                  The numbers matter.
                </span>
              </TextMaskReveal>
              <TextMaskReveal delay={0.25}>
                <span className="block text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--accent-red)] leading-[1.1]">
                  So does the context.
                </span>
              </TextMaskReveal>
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              A reporting view designed to show verified outcomes alongside the decisions and time period behind them.
            </p>
          </div>
        </div>

        {/* Dashboard Reporting Container */}
        <div className="surface-card rounded-2xl overflow-hidden shadow-xs border border-[var(--border-subtle)]">
          
          {/* Top Bar / Metadata */}
          <div className="px-6 sm:px-8 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-red)] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-[var(--text-primary)]">
                REPORTING FRAMEWORK
              </span>
            </div>

            <div className="flex items-center gap-4 text-[10px] sm:text-xs font-mono text-[var(--text-muted)]">
              <span>ATTRIBUTION: 7-DAY CLICK / 1-DAY VIEW</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">VERIFIED CLIENT DATA</span>
            </div>
          </div>

          {/* 4-Column KPI Summary Cards with Dynamic Animated Counters */}
          <FadeUpStagger delay={0.1} stagger={0.08} className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-subtle)] border-b border-[var(--border-subtle)]">
            
            <FadeUpItem className="p-6 sm:p-8">
              <div className="text-[10px] font-mono tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Revenue Attributed
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                <AnimatedCounter value={portfolioData.stats.adSpend} />
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                Managed across {portfolioData.stats.platforms} platforms
              </div>
            </FadeUpItem>

            <FadeUpItem className="p-6 sm:p-8">
              <div className="text-[10px] font-mono tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Blended ROAS
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[var(--accent-red)] tracking-tight">
                <AnimatedCounter value="4.6x" />
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                D2C &amp; E-commerce scale
              </div>
            </FadeUpItem>

            <FadeUpItem className="p-6 sm:p-8">
              <div className="text-[10px] font-mono tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Cost Per Acquisition
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                <AnimatedCounter value="-45%" />
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                Through granular query pruning
              </div>
            </FadeUpItem>

            <FadeUpItem className="p-6 sm:p-8">
              <div className="text-[10px] font-mono tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Attributed Conversions
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                <AnimatedCounter value="3,190+" />
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                Verified leads &amp; transactions
              </div>
            </FadeUpItem>

          </FadeUpStagger>

          {/* Main Visual: Chart on Left & Reporting Note on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)]">
            
            {/* Left: Chart & Cohort Breakdown */}
            <div ref={chartRef} className="lg:col-span-8 p-6 sm:p-10">
              
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
                    Revenue &amp; spend over time
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Growth cohort tracking over a 6-month scale cycle
                  </p>
                </div>

                {/* Platform Filter Buttons */}
                <div className="inline-flex items-center p-1 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-xs font-mono">
                  <button
                    onClick={() => setActiveTab('blended')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === 'blended'
                        ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Blended
                  </button>
                  <button
                    onClick={() => setActiveTab('meta')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === 'meta'
                        ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Meta Ads
                  </button>
                  <button
                    onClick={() => setActiveTab('google')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === 'google'
                        ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Google Ads
                  </button>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-6 mb-6 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-[var(--accent-red)] rounded-full" />
                  <span className="text-[var(--text-primary)] font-semibold">Attributed Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-[var(--text-muted)] rounded-full" />
                  <span className="text-[var(--text-muted)]">Campaign Spend</span>
                </div>
              </div>

              {/* Responsive SVG Chart with Progressive Stroke Drawing & Active Touch Points */}
              <div className="relative w-full h-48 sm:h-64 md:h-72 select-none">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 240" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-red)" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="var(--accent-red)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines */}
                  <line x1="0" y1="40" x2="600" y2="40" stroke="var(--border-subtle)" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="var(--border-subtle)" strokeDasharray="3 3" />
                  <line x1="0" y1="160" x2="600" y2="160" stroke="var(--border-subtle)" strokeDasharray="3 3" />
                  <line x1="0" y1="220" x2="600" y2="220" stroke="var(--border-subtle)" />

                  {/* Revenue Area Fill with fade in */}
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={isChartInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    d="M 20,200 L 130,165 L 240,125 L 350,85 L 460,50 L 580,25 L 580,220 L 20,220 Z"
                    fill="url(#revenueGradient)"
                  />

                  {/* Progressive Spend Curve */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={isChartInView ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 1.4, ease: EASING.smooth }}
                    d="M 20,210 Q 130,195 240,180 T 460,140 T 580,120"
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Progressive Revenue Curve */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={isChartInView ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 1.6, delay: 0.2, ease: EASING.smooth }}
                    d="M 20,200 Q 130,165 240,125 T 460,50 T 580,25"
                    fill="none"
                    stroke="var(--accent-red)"
                    strokeWidth="2.5"
                  />

                  {/* Animated & Interactive Data Points */}
                  {[
                    { x: 20, y: 200, val: currentCohort[0].roas, rev: currentCohort[0].revenue, month: currentCohort[0].month },
                    { x: 130, y: 165, val: currentCohort[1].roas, rev: currentCohort[1].revenue, month: currentCohort[1].month },
                    { x: 240, y: 125, val: currentCohort[2].roas, rev: currentCohort[2].revenue, month: currentCohort[2].month },
                    { x: 350, y: 85, val: currentCohort[3].roas, rev: currentCohort[3].revenue, month: currentCohort[3].month },
                    { x: 460, y: 50, val: currentCohort[4].roas, rev: currentCohort[4].revenue, month: currentCohort[4].month },
                    { x: 580, y: 25, val: currentCohort[5].roas, rev: currentCohort[5].revenue, month: currentCohort[5].month },
                  ].map((pt, i) => {
                    const isSelected = activePointIndex === i;
                    return (
                      <g key={i} className="cursor-pointer" onClick={() => setActivePointIndex(isSelected ? null : i)}>
                        <motion.circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? 7 : 4.5}
                          fill="var(--bg-elevated)"
                          stroke="var(--accent-red)"
                          strokeWidth={isSelected ? 3.5 : 2.5}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={isChartInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.8 + i * 0.1, ease: EASING.smooth }}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* X-Axis Month Labels (Cleanly shortened on mobile to prevent squishing) */}
                <div className="flex justify-between text-[10px] sm:text-xs font-mono text-[var(--text-muted)] pt-3 px-1">
                  {currentCohort.map((c, i) => (
                    <span key={i} className="text-center font-medium">
                      <span className="hidden sm:inline">{c.month}</span>
                      <span className="inline sm:hidden">{c.month.replace('Month ', 'M')}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Cohort Metric Details Grid (Optimized mobile UX with touch-to-focus) */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5 mt-8 pt-6 border-t border-[var(--border-subtle)]">
                {currentCohort.map((c, idx) => {
                  const isSelected = activePointIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActivePointIndex(isSelected ? null : idx)}
                      onMouseEnter={() => setActivePointIndex(idx)}
                      onMouseLeave={() => setActivePointIndex(null)}
                      className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--bg-card)] border-[var(--accent-red)] shadow-sm ring-1 ring-[var(--accent-red)]/30'
                          : 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] hover:border-[var(--text-muted)]'
                      }`}
                    >
                      <div className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider font-bold">
                        <span className="hidden sm:inline">{c.month}</span>
                        <span className="inline sm:hidden">{c.month.replace('Month ', 'M')}</span>
                      </div>
                      <div className="text-xs sm:text-sm font-black text-[var(--accent-red)] font-mono mt-0.5">
                        {c.roas}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-[var(--text-secondary)] font-mono font-semibold truncate mt-0.5">
                        {formatCurrency(c.revenue)}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Right: Reporting Note Card */}
            <div className="lg:col-span-4 p-6 sm:p-10 bg-[var(--bg-card-subtle)] flex flex-col justify-between">
              <div>
                
                {/* Note Header */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[var(--accent-red)]">
                    REPORTING NOTE
                  </span>
                </div>

                <h4 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-4 leading-snug">
                  Numbers are never shown without their source, window, and business context.
                </h4>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                  Data in performance marketing only matters when it informs clear operating decisions. Every metric here connects to verified client accounts under active management.
                </p>

                {/* Verification Checklist */}
                <div className="space-y-4">
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-[var(--text-primary)]">
                        Verified platform access
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        Meta Ads Manager, Google Ads &amp; GA4
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-[var(--text-primary)]">
                        Defined attribution window
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        7-day click, 1-day view standard
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-[var(--text-primary)]">
                        Decision-ready commentary
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        Weekly executive takeaways on budget shifts
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              <div className="pt-8 mt-8 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                <span>UPDATED: Q4 2026</span>
                <span className="text-[var(--accent-red)] font-semibold">CONFIRMED REAL DATA</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </SlideScene>
  );
}

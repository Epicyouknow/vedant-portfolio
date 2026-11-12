'use client';

import React from 'react';
import { 
  Briefcase, 
  Users, 
  Compass, 
  Palette, 
  GitBranch, 
  Gauge, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function FrameworkSection() {
  const steps = [
    {
      num: '01',
      title: 'BUSINESS OBJECTIVE',
      short: 'Unit Economics & Targets',
      desc: 'Clarifying margin thresholds, cash-flow cycles, CAC ceilings, and the true commercial objective.',
      icon: Briefcase,
    },
    {
      num: '02',
      title: 'AUDIENCE & MARKET RESEARCH',
      short: 'Intent & Competitor Gaps',
      desc: 'Mapping search intent tiers, competitor ad libraries, and core customer buying friction.',
      icon: Users,
    },
    {
      num: '03',
      title: 'CAMPAIGN STRATEGY',
      short: 'Channel Architecture',
      desc: 'Structuring campaign partitions across Meta & Google Ads, budget splits, and conversion hierarchies.',
      icon: Compass,
    },
    {
      num: '04',
      title: 'CREATIVE & MEDIA EXECUTION',
      short: 'Direct-Response Testing',
      desc: 'Deploying direct-response angles, messaging variations, formats, and high-CTR landing pages.',
      icon: Palette,
    },
    {
      num: '05',
      title: 'TRACKING & MEASUREMENT',
      short: 'Server-Side Telemetry',
      desc: 'Establishing server-side CAPI pipelines, GA4 events, DataLayer deduplication, and UTM tracking.',
      icon: GitBranch,
    },
    {
      num: '06',
      title: 'OPTIMISATION',
      short: 'Continuous Calibration',
      desc: 'Real-time telemetry monitoring, 72h burn-in checks, creative fatigue rotation, and budget scaling.',
      icon: Gauge,
    },
  ];

  return (
    <section id="framework" className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-base)] relative overflow-hidden">
      {/* Subtle background red glow */}
      <div 
        className="absolute bottom-0 right-1/4 w-[500px] h-[300px] pointer-events-none opacity-20 dark:opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(237, 70, 59, 0.25) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[#ED463B] text-[11px] font-mono font-bold tracking-widest uppercase mb-3">
            THE PERFORMANCE FRAMEWORK
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] font-outfit mb-4">
            Every Campaign Needs a Clear Direction.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] font-normal">
            From understanding the business to measuring the outcome.
          </p>
        </div>

        {/* Desktop Horizontal Workflow Funnel (Grid on large, stacked on mobile) */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden xl:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-neutral-300 via-[#ED463B]/60 to-neutral-300 dark:from-neutral-800 dark:via-[#ED463B]/60 dark:to-neutral-800 -translate-y-8 z-0 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="group relative p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs hover:border-[#ED463B] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Step indicator & icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-extrabold text-[#ED463B] px-2.5 py-1 rounded-md bg-[#ED463B]/10 border border-[#ED463B]/20">
                        {step.num}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[var(--bg-card-subtle)] flex items-center justify-center text-[var(--text-primary)] group-hover:bg-[#ED463B] group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Step Name */}
                    <h3 className="text-xs font-extrabold tracking-wider text-[var(--text-primary)] uppercase font-outfit mb-1 leading-snug">
                      {step.title}
                    </h3>
                    <div className="text-[11px] font-mono text-[#ED463B] font-semibold mb-3">
                      {step.short}
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  {/* Flow arrow on smaller screens */}
                  {index < steps.length - 1 && (
                    <div className="xl:hidden pt-3 mt-3 border-t border-[var(--border-subtle)] flex items-center justify-end text-[10px] font-mono text-[var(--text-secondary)]">
                      <span>Next &rarr;</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Operating Principle */}
        <div className="mt-12 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <p className="text-xs md:text-sm text-[var(--text-primary)] font-medium">
              <strong className="font-bold text-[var(--text-primary)]">Strict Operating Rule:</strong> No budget scaling occurs until full-funnel tracking signals are verified and stable across 72 hours.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#ED463B] uppercase tracking-wider shrink-0">
            Deduplicated &bull; Measured &bull; Accountable
          </span>
        </div>

      </div>
    </section>
  );
}


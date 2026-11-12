'use client';

import React from 'react';
import { 
  Target, 
  Search, 
  PieChart, 
  Lightbulb, 
  Activity, 
  SlidersHorizontal,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function CapabilitiesSection() {
  const capabilities = [
    {
      id: 'meta-ads',
      tag: '01 / PAID SOCIAL',
      title: 'META ADS',
      description: 'Campaign strategy, lead generation and sales campaigns.',
      icon: Target,
      metrics: [
        { label: 'Focus', value: 'Full-Funnel Sales & Leads' },
        { label: 'Tooling', value: 'Advantage+ & Catalogues' },
      ],
      features: ['Lead gen & e-commerce purchases', 'High-intent retargeting funnels', 'CPA & CPL guardrails']
    },
    {
      id: 'google-ads',
      tag: '02 / PAID SEARCH',
      title: 'GOOGLE ADS',
      description: 'Search, Performance Max and paid search campaigns.',
      icon: Search,
      metrics: [
        { label: 'Intent', value: 'Commercial & Transactional' },
        { label: 'Format', value: 'Search • PMax • Shopping' },
      ],
      features: ['Granular keyword segmentation', 'Negative query pruning', 'PMax asset partitioning']
    },
    {
      id: 'media-planning',
      tag: '03 / STRATEGY',
      title: 'MEDIA PLANNING',
      description: 'Audience research, budget allocation and channel strategy.',
      icon: PieChart,
      metrics: [
        { label: 'Allocation', value: 'Multi-Channel Mix' },
        { label: 'Targeting', value: 'Audience & Geographies' },
      ],
      features: ['Unit economics & margin modeling', 'Cross-platform budget split', 'Frequency management']
    },
    {
      id: 'creative-strategy',
      tag: '04 / ASSETS',
      title: 'CREATIVE STRATEGY',
      description: 'Ad angles, messaging, creative testing and iteration.',
      icon: Lightbulb,
      metrics: [
        { label: 'Method', value: 'Systematic Angle Testing' },
        { label: 'Focus', value: 'Thumb-Stop & Click-Through' },
      ],
      features: ['Direct-response copy hooks', 'Format & motion variants', 'Fatigue-resistant iteration']
    },
    {
      id: 'tracking-analytics',
      tag: '05 / TELEMETRY',
      title: 'TRACKING & ANALYTICS',
      description: 'Meta Pixel, CAPI, GTM, GA4 and UTM tracking.',
      icon: Activity,
      metrics: [
        { label: 'Accuracy', value: 'Deduplicated Signals' },
        { label: 'Stack', value: 'CAPI • DataLayer • GA4' },
      ],
      features: ['Server-side CAPI event pipelines', 'Event ID deduplication', 'Clean UTM parameter taxonomies']
    },
    {
      id: 'optimisation',
      tag: '06 / PERFORMANCE',
      title: 'OPTIMISATION',
      description: 'Campaign analysis, performance monitoring and improvement.',
      icon: SlidersHorizontal,
      metrics: [
        { label: 'Pacing', value: 'Active Real-Time Audit' },
        { label: 'Telemetry', value: 'ROAS & Contribution Margin' },
      ],
      features: ['72-hour burn-in calibration', 'Bid strategy transitions', 'Budget scale without CPL blowup']
    }
  ];

  return (
    <section id="capabilities" className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[#ED463B] text-[11px] font-mono font-bold tracking-widest uppercase mb-3">
              CAPABILITY OVERVIEW
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] font-outfit">
              Engineered Across Every Growth Dimension
            </h2>
          </div>
          <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-md font-normal leading-relaxed">
            Dashboard-inspired campaign execution connecting business economics with granular platform mechanics.
          </p>
        </div>

        {/* 6 Dashboard-Style Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.id}
                className="group relative p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs hover:border-[#ED463B]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Row: Tag & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-mono tracking-wider text-[var(--text-secondary)] font-bold">
                      {cap.tag}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] flex items-center justify-center text-[#ED463B] group-hover:bg-[#ED463B] group-hover:text-white transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & One Short Sentence Description */}
                  <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)] mb-2 font-outfit flex items-center gap-2">
                    <span>{cap.title}</span>
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 font-normal">
                    {cap.description}
                  </p>
                </div>

                {/* Dashboard-style Spec Box */}
                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <div className="grid grid-cols-2 gap-2 mb-4 bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
                    {cap.metrics.map((m, i) => (
                      <div key={i}>
                        <div className="text-[10px] uppercase font-mono text-[var(--text-secondary)]">
                          {m.label}
                        </div>
                        <div className="text-xs font-bold text-[var(--text-primary)] truncate font-outfit mt-0.5">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                    {cap.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#ED463B] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}


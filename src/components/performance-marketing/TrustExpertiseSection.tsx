'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Briefcase, 
  Share2, 
  Activity, 
  Sliders, 
  CheckCircle2, 
  ShieldCheck, 
  Award,
  Sparkles 
} from 'lucide-react';

export default function TrustExpertiseSection() {
  const proofPoints = [
    {
      title: 'Business-First Campaign Planning',
      desc: 'Grounding advertising in gross margins, contribution margin, and customer payback velocity rather than platform impressions.',
      icon: Briefcase,
    },
    {
      title: 'Multi-Channel Advertising Execution',
      desc: 'Orchestrating Meta Ads, Google Search, and PMax into a cohesive demand-capture system with disciplined budget governance.',
      icon: Share2,
    },
    {
      title: 'Conversion-Focused Tracking',
      desc: 'Deploying server-side CAPI pipelines and verified DataLayer events so machine-learning algorithms optimize for verified revenue.',
      icon: Activity,
    },
    {
      title: 'Structured Performance Optimisation',
      desc: 'Methodical angle iteration, creative fatigue rotation, and continuous bid calibration rather than reactive daily budget tweaks.',
      icon: Sliders,
    },
  ];

  return (
    <section id="trust" className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Headline */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[#ED463B] text-[11px] font-mono font-bold tracking-widest uppercase mb-3">
            ACCOUNTABILITY & DISCIPLINE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] font-outfit mb-4">
            Strategy Before Spending.
          </h2>
          <p className="text-sm md:text-base text-[var(--text-secondary)] font-normal">
            Every rupee of ad spend must serve a commercial objective with direct measurement.
          </p>
        </div>

        {/* 4 Proof Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {proofPoints.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs hover:border-[#ED463B]/50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] flex items-center justify-center text-[#ED463B] mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 font-outfit">
                  {pt.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Professional Profile Card */}
        <div className="max-w-4xl mx-auto p-8 sm:p-10 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div 
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(237, 70, 59, 0.4) 0%, transparent 70%)',
            }}
          />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
            {/* Portrait */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[var(--border-subtle)] bg-neutral-900 shrink-0 shadow-md">
              <Image
                src="/vedant_portrait.jpg"
                alt="Vedant Tiwari"
                fill
                sizes="144px"
                className="object-cover object-top"
              />
            </div>

            {/* Introduction Bio */}
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ED463B]/10 border border-[#ED463B]/20 text-[#ED463B] text-[10px] font-mono font-bold tracking-wider uppercase mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Hands-On Practitioner</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-outfit mb-2">
                Vedant Tiwari
              </h3>
              <p className="text-base sm:text-lg text-[var(--text-primary)] font-medium leading-relaxed mb-4">
                &ldquo;I&apos;m Vedant Tiwari, a performance marketing professional working across paid media, campaign strategy, creative planning and conversion measurement.&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal max-w-2xl">
                I do not outsource your campaigns to junior account coordinators. Every strategy, media allocation, tracking script, and creative test is architected and audited directly by me.
              </p>

              {/* Verified Credentials Pills */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-6 pt-5 border-t border-[var(--border-subtle)]">
                <span className="px-3 py-1 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)]">
                  Meta Certified
                </span>
                <span className="px-3 py-1 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)]">
                  Google Ads Search & Measurement
                </span>
                <span className="px-3 py-1 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)]">
                  CAPI & GA4 Specialist
                </span>
                <span className="px-3 py-1 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[11px] font-mono text-[#ED463B] font-bold">
                  ₹50L+ Active Spend
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}


'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronDown, CheckCircle2, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Cinematic Lighting Gradients */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40 dark:opacity-60"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(237, 70, 59, 0.18) 0%, rgba(237, 70, 59, 0.04) 40%, transparent 70%)',
        }}
      />
      <div 
        className="absolute -top-32 right-0 w-[450px] h-[450px] pointer-events-none opacity-20 dark:opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(237, 70, 59, 0.25) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs (7 columns) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xs mb-6">
              <span className="w-2 h-2 rounded-full bg-[#ED463B] animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[var(--text-secondary)] font-mono">
                PERFORMANCE MARKETING, THOUGHTFULLY DONE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.08] mb-6 font-outfit">
              Performance Marketing That Makes{' '}
              <span className="text-[#ED463B] relative inline-block underline decoration-[#ED463B]/30 decoration-wavy underline-offset-8">
                Business Sense
              </span>
              .
            </h1>

            {/* Supporting Brand Line */}
            <div className="inline-block text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#ED463B] font-mono mb-4">
              Strategy &bull; Media &bull; Tracking &bull; Growth
            </div>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mb-8 font-normal">
              Turn your business goals into a structured advertising strategy through media, creative, tracking and optimisation.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                type="button"
                onClick={() => scrollTo('enquiry')}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#ED463B] hover:bg-[#d9382d] text-white text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#ED463B]/25 hover:shadow-xl hover:shadow-[#ED463B]/35 hover:-translate-y-0.5 cursor-pointer group"
              >
                <span>Let&apos;s Discuss Your Business</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo('capabilities')}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-primary)] text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer"
              >
                <span>Explore Capabilities</span>
                <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* Micro Trust Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[var(--border-subtle)] w-full max-w-xl text-left">
              <div>
                <div className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                  Managed Spend
                </div>
                <div className="text-base font-bold text-[var(--text-primary)] mt-0.5 font-outfit">
                  ₹50 Lakhs+
                </div>
              </div>
              <div>
                <div className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                  Channels
                </div>
                <div className="text-base font-bold text-[var(--text-primary)] mt-0.5 font-outfit">
                  Meta &bull; Google &bull; CAPI
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                  Operating Model
                </div>
                <div className="text-base font-bold text-[var(--text-primary)] mt-0.5 font-outfit">
                  Zero Vanity Metrics
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actual Portrait with Cinematic Red Halo (5 columns) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            {/* Cinematic Halo */}
            <div 
              className="absolute inset-0 max-w-[420px] max-h-[520px] m-auto rounded-3xl blur-2xl opacity-50 dark:opacity-75 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(237, 70, 59, 0.35) 0%, rgba(237, 70, 59, 0.1) 60%, transparent 80%)',
              }}
            />

            {/* Premium Portrait Card */}
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl transition-all duration-300 hover:border-[#ED463B]/40 group">
              {/* Inner Portrait Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
                <Image
                  src="/vedant_portrait.jpg"
                  alt="Vedant Tiwari — Performance Marketing Executive"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle gradient vignette to blend base */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121211] via-transparent to-transparent opacity-80" />

                {/* Top Badge: Verified Status */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Verified Portfolio</span>
                </div>

                {/* Role Label Overlay on bottom */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-extrabold tracking-wide uppercase font-outfit">
                        VEDANT TIWARI
                      </div>
                      <div className="text-[11px] font-mono tracking-widest text-[#ED463B] uppercase font-bold mt-0.5">
                        PERFORMANCE MARKETING
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#ED463B]/20 border border-[#ED463B]/40 flex items-center justify-center text-[#ED463B]">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Card Footer */}
              <div className="p-4 bg-[var(--bg-card)] flex items-center justify-between text-xs text-[var(--text-secondary)] border-t border-[var(--border-subtle)]">
                <span className="font-mono">Strategy &bull; Media &bull; Tracking</span>
                <span className="text-[#ED463B] font-semibold font-mono">Mumbai, India</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


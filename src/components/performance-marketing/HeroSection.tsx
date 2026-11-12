'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronDown, TrendingUp } from 'lucide-react';

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
          
          {/* Left Column: Copy & CTAs (6 to 7 columns) */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start text-left">
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

          {/* Right Column: Big Unboxed Portrait on Hero Section */}
          <div className="lg:col-span-5 xl:col-span-6 flex flex-col items-center lg:items-end justify-center relative w-full">
            {/* Cinematic Background Glow */}
            <div 
              className="absolute -inset-4 sm:-inset-8 rounded-full blur-3xl opacity-30 dark:opacity-60 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 60% 50%, rgba(237, 70, 59, 0.4) 0%, rgba(237, 70, 59, 0.08) 60%, transparent 80%)',
              }}
            />

            {/* Unboxed Big Portrait Container */}
            <div className="relative w-full max-w-[560px] lg:max-w-[620px] xl:max-w-[680px]">
              
              {/* Dark Theme: Big Unboxed Portrait */}
              <div className="relative hidden dark:block w-full">
                <Image
                  src="/vedant_hero_dark.jpg"
                  alt="Vedant Tiwari — Performance Marketing Executive"
                  width={1024}
                  height={576}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 680px"
                  className="w-full h-auto object-cover select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                />
                {/* Soft feathered fade on the left edge so it dissolves seamlessly into dark background */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--bg-base)] via-[var(--bg-base)]/40 to-transparent pointer-events-none hidden lg:block" />
                {/* Soft feathered fade on bottom edge */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--bg-base)] to-transparent pointer-events-none" />
              </div>

              {/* Light Theme: Big Unboxed Portrait */}
              <div className="relative block dark:hidden w-full">
                <Image
                  src="/vedant_hero_light.jpg"
                  alt="Vedant Tiwari — Performance Marketing Executive"
                  width={1024}
                  height={576}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 680px"
                  className="w-full h-auto object-cover select-none pointer-events-none drop-shadow-[0_15px_35px_rgba(237,70,59,0.12)]"
                />
                {/* Soft feathered fade on the left edge so it dissolves seamlessly into light background */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--bg-base)] via-[var(--bg-base)]/40 to-transparent pointer-events-none hidden lg:block" />
                {/* Soft feathered fade on bottom edge */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--bg-base)] to-transparent pointer-events-none" />
              </div>

              {/* Verified Performance Marketer Pill (Floating, non-boxed) */}
              <div className="mt-3 flex items-center justify-between px-1 text-xs">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)]/80 backdrop-blur-md border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#ED463B] animate-pulse" />
                  <span className="font-extrabold uppercase tracking-wider text-[11px] font-mono">
                    VEDANT TIWARI
                  </span>
                  <span className="text-[var(--text-secondary)] font-mono text-[10px]">&bull;</span>
                  <span className="text-[#ED463B] font-bold text-[11px] font-mono tracking-wider">
                    PERFORMANCE MARKETING
                  </span>
                </div>

                <div className="hidden sm:inline-flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
                  <span>Strategy &bull; Media &bull; Tracking</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


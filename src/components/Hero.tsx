'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TextMaskReveal, FadeUpStagger, FadeUpItem, EASING } from './motion/MotionSystem';
import StatsStrip from './StatsStrip';
import { useEnquiryModal } from '../context/EnquiryModalContext';

export default function Hero() {
  const { openModal } = useEnquiryModal();
  const { scrollY } = useScroll();
  const archParallax = useTransform(scrollY, [0, 600], [0, 45]);
  const textParallax = useTransform(scrollY, [0, 600], [0, -25]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen pt-24 pb-16 md:pt-40 md:pb-28 overflow-hidden flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Positioning & CTAs with motion reveals */}
          <motion.div style={{ y: textParallax }} className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
            
            {/* Eyebrow with reveal */}
            <div className="mb-6 flex items-center gap-2">
              <span className="text-[11px] md:text-xs font-semibold tracking-[0.24em] uppercase text-[var(--text-muted)]">
                — PERFORMANCE MARKETING, THOUGHTFULLY DONE
              </span>
            </div>

            {/* Main Headline line-by-line reveal */}
            <div className="mb-6">
              <TextMaskReveal delay={0.1}>
                <span className="block text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.08]">
                  Strategy. Ads.
                </span>
              </TextMaskReveal>
              <TextMaskReveal delay={0.25}>
                <span className="block text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--accent-red)] leading-[1.08]">
                  Real Growth.
                </span>
              </TextMaskReveal>
            </div>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: EASING.smooth }}
              className="text-base sm:text-lg text-[var(--text-secondary)] font-normal leading-relaxed max-w-xl mb-10"
            >
              I help ambitious brands turn attention into measurable growth through sharp strategy, conversion-led creative, and performance media.
            </motion.p>

            {/* Action Buttons Stagger */}
            <FadeUpStagger delay={0.5} stagger={0.1} className="flex flex-wrap items-center gap-4 mb-16">
              <FadeUpItem>
                <button
                  type="button"
                  onClick={openModal}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#ED463B] hover:bg-[#d9382d] text-white transition-all duration-200 cursor-pointer shadow-lg shadow-[#ED463B]/25 hover:shadow-xl hover:shadow-[#ED463B]/35 hover:-translate-y-0.5 group"
                >
                  <span>LET&apos;S DISCUSS YOUR BUSINESS</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </FadeUpItem>

              <FadeUpItem>
                <button
                  type="button"
                  onClick={() => scrollTo('featured-work')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-wide bg-transparent text-[var(--text-primary)] border border-[var(--border-strong)] hover:border-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-all duration-200 cursor-pointer group"
                >
                  <span>Explore selected work</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </FadeUpItem>
            </FadeUpStagger>

            {/* Three Positioning Columns Stagger */}
            <FadeUpStagger delay={0.65} stagger={0.12} className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-[var(--border-subtle)]">
              <FadeUpItem>
                <div className="font-bold text-sm sm:text-base text-[var(--text-primary)] mb-1">
                  Full-funnel
                </div>
                <div className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">
                  DEMAND TO REVENUE
                </div>
              </FadeUpItem>

              <FadeUpItem>
                <div className="font-bold text-sm sm:text-base text-[var(--text-primary)] mb-1">
                  Multi-channel
                </div>
                <div className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">
                  MEDIA EXECUTION
                </div>
              </FadeUpItem>

              <FadeUpItem>
                <div className="font-bold text-sm sm:text-base text-[var(--text-primary)] mb-1">
                  Always clear
                </div>
                <div className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">
                  WEEKLY REPORTING
                </div>
              </FadeUpItem>
            </FadeUpStagger>

          </motion.div>

          {/* Right Column: Transparent Cutout Portrait covering hero from the right side */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2 relative">
            <motion.div
              style={{ y: archParallax }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: EASING.smooth }}
              className="relative w-full flex flex-col items-center lg:items-end justify-end"
            >
              {/* Cinematic Red Halo Glow */}
              <div 
                className="absolute inset-0 m-auto w-[360px] h-[360px] lg:w-[440px] lg:h-[440px] rounded-full blur-3xl opacity-35 dark:opacity-60 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(237, 70, 59, 0.45) 0%, rgba(237, 70, 59, 0.08) 65%, transparent 80%)',
                }}
              />

              {/* Dark Theme Cutout */}
              <div className="relative hidden dark:block w-full max-w-[440px] lg:max-w-[480px]">
                <Image
                  src="/vedant_hero_cutout_dark.png"
                  alt="Vedant Tiwari — Senior Performance Marketing Executive"
                  width={484}
                  height={553}
                  priority
                  className="w-full h-auto max-h-[560px] lg:max-h-[620px] object-contain object-bottom ml-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] select-none"
                />
              </div>

              {/* Light Theme Cutout */}
              <div className="relative block dark:hidden w-full max-w-[440px] lg:max-w-[480px]">
                <Image
                  src="/vedant_hero_cutout_light.png"
                  alt="Vedant Tiwari — Senior Performance Marketing Executive"
                  width={467}
                  height={539}
                  priority
                  className="w-full h-auto max-h-[560px] lg:max-h-[620px] object-contain object-bottom ml-auto drop-shadow-[0_20px_40px_rgba(237,70,59,0.18)] select-none"
                />
              </div>

              {/* Floating Role Pill */}
              <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)]/80 backdrop-blur-md border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-sm text-xs">
                <span className="w-2 h-2 rounded-full bg-[#ED463B] animate-pulse" />
                <span className="font-extrabold uppercase tracking-wider text-[11px] font-mono">
                  VEDANT TIWARI
                </span>
                <span className="text-[var(--text-secondary)] font-mono text-[10px]">&bull;</span>
                <span className="text-[#ED463B] font-bold text-[11px] font-mono tracking-wider">
                  PERFORMANCE MARKETING
                </span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Core Stats Bar (3+ Years Experience | ₹50L+ Ad Budget | 7+ Ad Platforms | 100+ Campaigns) */}
        <div className="mt-14 md:mt-20 pt-10 border-t border-[var(--border-subtle)]">
          <StatsStrip className="!px-0" />
        </div>

      </div>
    </section>
  );
}

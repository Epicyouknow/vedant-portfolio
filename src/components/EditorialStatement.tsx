'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Mail } from 'lucide-react';
import { SlideScene } from './motion/MotionSystem';
import { portfolioData } from '../data/portfolio';

export default function EditorialStatement() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [30, 0]);

  // 3D Flip & Tilt Physics (matches hero card mechanics without text labels)
  const [isFlipped, setIsFlipped] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <SlideScene id="editorial-statement" className="py-20 md:py-36 border-t border-[var(--border-subtle)] bg-[var(--bg-base)] overflow-hidden">
      <div ref={containerRef} className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Two-column editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: Photo Card with 3D Flip */}
          <motion.div
            style={{ y: imageY, opacity }}
            className="relative order-2 lg:order-1"
          >
            {/* Eyebrow label above image */}
            <div className="mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-[var(--accent-red)]" />
              <span className="text-[10px] font-mono font-bold tracking-[0.22em] uppercase text-[var(--text-muted)]">
                VEDANT TIWARI — MUMBAI, IN
              </span>
            </div>

            {/* 3D Perspective Viewport */}
            <div
              style={{ perspective: 1200 }}
              className="w-full max-w-[420px] aspect-[3/4] mx-auto lg:mx-0 select-none cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleCardClick}
            >
              <motion.div
                style={{
                  transformStyle: 'preserve-3d',
                  rotateX: isFlipped ? '0deg' : rotateX,
                  rotateY: rotateY,
                }}
                animate={{
                  rotateY: isFlipped ? 180 : 0,
                }}
                transition={{
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative w-full h-full group"
              >
                {/* FRONT SIDE: Matches user's exact screenshot */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] shadow-xl"
                >
                  <img
                    src="/vedant_editorial.jpg"
                    alt="Vedant Tiwari — Performance Marketing Executive"
                    className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700 ease-out block pointer-events-none"
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Corner label */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold tracking-widest uppercase text-white/90">
                    PORTFOLIO ©2026
                  </div>

                  {/* Bottom caption overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-5 pointer-events-none">
                    <div className="surface-card rounded-xl px-4 py-3 backdrop-blur-md border border-[var(--border-subtle)] inline-block">
                      <p className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] mb-0.5">
                        ROLE &amp; FOCUS
                      </p>
                      <p className="text-xs font-bold text-[var(--text-primary)]">
                        Performance Marketing &amp; Media Buyer
                      </p>
                    </div>
                  </div>
                </div>

                {/* BACK SIDE: Executive Performance Profile */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-xl p-6 sm:p-7 flex flex-col justify-between bg-[var(--bg-card)] dark:bg-[#141413] text-[var(--text-primary)]"
                >
                  {/* Header / Brand Mark */}
                  <div>
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[var(--text-primary)] text-[var(--bg-base)] flex items-center justify-center font-bold text-xs">
                          V
                        </div>
                        <span className="font-bold text-sm tracking-tight text-[var(--text-primary)]">
                          VedantVerse
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)]">
                        EXECUTIVE PROFILE
                      </span>
                    </div>

                    {/* Headline & Title */}
                    <div className="mb-3.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] block mb-0.5">
                        PERFORMANCE PROFILE
                      </span>
                      <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
                        Vedant Tiwari
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Performance Marketing Executive &amp; Media Buyer
                      </p>
                    </div>

                    {/* 4 Core Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-[var(--bg-card-subtle)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                        <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase block">EXPERIENCE</span>
                        <span className="text-base font-black text-[var(--accent-red)] font-mono">
                          {portfolioData.stats.experience || '3+'} Yrs
                        </span>
                      </div>

                      <div className="bg-[var(--bg-card-subtle)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                        <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase block">AD SPEND</span>
                        <span className="text-base font-black text-[var(--text-primary)] font-mono">
                          {portfolioData.stats.adSpend || '₹50L+'}
                        </span>
                      </div>

                      <div className="bg-[var(--bg-card-subtle)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                        <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase block">CHANNELS</span>
                        <span className="text-base font-black text-[var(--accent-red)] font-mono">
                          {portfolioData.stats.platforms || '7+'} Platforms
                        </span>
                      </div>

                      <div className="bg-[var(--bg-card-subtle)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                        <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase block">CAMPAIGNS</span>
                        <span className="text-base font-black text-[var(--text-primary)] font-mono">
                          {portfolioData.stats.campaigns || '100+'} Run
                        </span>
                      </div>
                    </div>

                    {/* Core Skill Tags */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] block">
                        CORE SPECIALIZATION
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Meta Ads & CAPI', 'Google Search / PMax', 'DV360 & CM360', 'GA4 Analytics', 'Conversion CRO'].map((skill) => (
                          <span 
                            key={skill}
                            className="px-2 py-0.5 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-lg text-[10px] font-mono font-semibold text-[var(--text-secondary)]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Back Side Footer */}
                  <div className="pt-3 mt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                    <a
                      href="mailto:contactvedantverse@gmail.com"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-[var(--accent-red)] font-bold hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span className="text-[11px]">contactvedantverse@gmail.com</span>
                    </a>

                    <span className="text-[10px] text-[var(--text-muted)]">
                      Mumbai, IN
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative side accent */}
            <div className="hidden lg:block absolute -left-4 top-1/3 w-px h-24 bg-gradient-to-b from-transparent via-[var(--accent-red)] to-transparent opacity-50" />
          </motion.div>

          {/* RIGHT: Editorial Statement */}
          <motion.div
            style={{ scale, opacity }}
            className="order-1 lg:order-2 flex flex-col justify-center"
          >
            {/* Eyebrow */}
            <div className="mb-8">
              <span className="text-[11px] md:text-xs font-semibold tracking-[0.24em] uppercase text-[var(--text-muted)]">
                — ABOUT ME
              </span>
            </div>

            {/* Main statement */}
            <blockquote className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.18] mb-10">
              I work at the intersection of{' '}
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-[var(--accent-red)] inline-block transition-transform duration-200"
              >
                strategy
              </motion.span>
              ,{' '}
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-[var(--accent-red)] inline-block transition-transform duration-200"
              >
                creative
              </motion.span>
              , and{' '}
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-[var(--accent-red)] inline-block transition-transform duration-200"
              >
                media
              </motion.span>
              —bringing senior thinking close to the work and making complexity feel clear.
            </blockquote>

            {/* Supporting bio */}
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg">
                Based in Mumbai. 3+ years running full-funnel performance across Meta Ads, Google Search, DV360, and CM360. I&apos;ve managed ₹50L+ in ad budgets and built systems that turn spend into measurable growth — for D2C brands, B2B companies, and everything in between.
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg">
                I care deeply about the work, take ownership of outcomes, and believe the best results come from thinking clearly before acting fast.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </SlideScene>
  );
}

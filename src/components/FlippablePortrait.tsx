'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, ExternalLink, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

export default function FlippablePortrait() {
  const [isFlipped, setIsFlipped] = useState(false);


  // Mouse tilt physics for high-end 3D feel
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
    <div className="relative w-full max-w-[380px] sm:max-w-[440px] md:max-w-[460px] select-none">
      


      {/* 3D Perspective Viewport */}
      <div 
        style={{ perspective: 1200 }} 
        className="w-full h-[540px] sm:h-[520px] md:h-[580px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          onClick={handleCardClick}
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
          className="relative w-full h-full cursor-pointer group"
        >

          {/* ========================================================
              FRONT SIDE: PERFECTLY FITTED PORTRAIT
              ======================================================== */}
          <div 
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-xl flex flex-col justify-between bg-gradient-to-b from-[#F2EFE8] via-[#E8E4DA] to-[#DFDAD0] dark:from-[#1E1D1C] dark:via-[#161514] dark:to-[#0F0E0E] transition-colors"
          >
            {/* Background Ambient Lighting & Watermark */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <span className="watermark-vv select-none opacity-40">VV</span>
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-white/60 dark:bg-white/10 blur-3xl rounded-full" />
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--accent-red)]/15 blur-3xl rounded-full" />
            </div>

            {/* Top Bar inside portrait */}
            <div className="relative z-20 p-5 flex items-center justify-between text-xs">
              <div className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase text-[var(--text-secondary)]">
                VEDANT TIWARI
              </div>


            </div>

            {/* PORTRAIT IMAGE FLUSH WITH CARD BOTTOM (Torso emerges directly from card base) */}
            <div className="absolute inset-x-0 bottom-0 z-10 w-full h-full flex items-end justify-center pointer-events-none overflow-hidden">
              <img
                src="/vedant_portrait.png"
                alt="Vedant Tiwari — Senior Performance Marketing Executive"
                className="w-auto h-[500px] sm:h-[490px] md:h-[545px] max-w-none object-contain object-bottom select-none filter brightness-115 contrast-[1.04] drop-shadow-[0_16px_32px_rgba(0,0,0,0.22)] transition-transform duration-500 group-hover:scale-[1.02] origin-bottom translate-x-[-10px] translate-y-[2px]"
              />
            </div>

            {/* Subtle grounding vignette over lower shirt */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 via-black/5 to-transparent pointer-events-none z-15" />

            {/* Floating Badges Pinned Over Lower Torso at Card Bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between gap-2.5 pointer-events-auto">
              {/* Left Identity Badge */}
              <div className="surface-card rounded-xl px-3.5 py-2.5 shadow-xl border border-[var(--border-subtle)] backdrop-blur-md">
                <div className="text-[9px] font-bold tracking-widest uppercase text-[var(--text-muted)]">
                  ROLE &amp; FOCUS
                </div>
                <div className="text-xs font-extrabold text-[var(--text-primary)] tracking-tight">
                  PERFORMANCE &amp; MEDIA
                </div>
              </div>

              {/* Right Status Badge */}
              <div className="surface-card rounded-xl px-3.5 py-2.5 shadow-xl border border-[var(--border-subtle)] flex items-center gap-2 backdrop-blur-md shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <div>
                  <div className="text-[8px] font-bold tracking-wider uppercase text-[var(--text-muted)]">
                    STATUS
                  </div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    Available for Q2/Q3
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================
              BACK SIDE: 360° FLIPPED EXECUTIVE PROFILE & METRICS
              ======================================================== */}
          <div 
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-xl p-6 sm:p-8 flex flex-col justify-between bg-[var(--bg-card)] dark:bg-[#141413] text-[var(--text-primary)]"
          >
            {/* Header / Brand Mark */}
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[var(--text-primary)] text-[var(--bg-base)] flex items-center justify-center font-bold text-xs">
                    V
                  </div>
                  <span className="font-bold text-sm tracking-tight text-[var(--text-primary)]">
                    VedantVerse
                  </span>
                </div>


              </div>

              {/* Headline & Title */}
              <div className="mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] block mb-1">
                  PERFORMANCE PROFILE
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
                  Vedant Tiwari
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Performance Marketing Executive &amp; Media Buyer
                </p>
              </div>

              {/* 4 Core Stats Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <div className="bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
                  <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase block">EXPERIENCE</span>
                  <span className="text-lg font-black text-[var(--accent-red)] font-mono">
                    {portfolioData.stats.experience || '3+'} Yrs
                  </span>
                </div>

                <div className="bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
                  <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase block">AD SPEND MANAGED</span>
                  <span className="text-lg font-black text-[var(--text-primary)] font-mono">
                    {portfolioData.stats.adSpend || '₹50L+'}
                  </span>
                </div>

                <div className="bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
                  <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase block">PLATFORMS</span>
                  <span className="text-lg font-black text-[var(--accent-red)] font-mono">
                    {portfolioData.stats.platforms || '7+'} Channels
                  </span>
                </div>

                <div className="bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
                  <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase block">CAMPAIGNS</span>
                  <span className="text-lg font-black text-[var(--text-primary)] font-mono">
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
                      className="px-2.5 py-1 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-lg text-[10px] font-mono font-semibold text-[var(--text-secondary)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Back Side Footer CTA */}
            <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
              <a
                href="mailto:contactvedantverse@gmail.com"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-[var(--accent-red)] font-bold hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>contactvedantverse@gmail.com</span>
              </a>

              <span className="text-[10px] text-[var(--text-muted)]">
                Mumbai, India
              </span>
            </div>

          </div>

        </motion.div>
      </div>



    </div>
  );
}

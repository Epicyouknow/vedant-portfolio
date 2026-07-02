'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Download, Award } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { useAnalytics } from '../hooks/useAnalytics';

// Dynamic Counter Component
function AnimatedCounter({ value, duration = 1.5 }: { value: string; duration?: number }) {
  const [current, setCurrent] = useState(0);
  
  // Extract prefix, target, and suffix correctly (e.g. "₹15L+" -> prefix: "₹", target: 15, suffix: "L+")
  const match = value.match(/^([^\d.]*)([\d.]+)([^\d.]*)$/);
  const prefix = match ? match[1] : '';
  const target = match ? parseFloat(match[2]) : 0;
  const suffix = match ? match[3] : value;

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      const val = progress * target;
      setCurrent(target % 1 === 0 ? Math.floor(val) : parseFloat(val.toFixed(1)));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return (
    <span>
      {prefix}
      {current}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const { trackEvent } = useAnalytics();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const scrollSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen lg:h-[105vh] lg:min-h-[950px] flex flex-col justify-between px-5 md:px-12 lg:px-24 pt-24 pb-12 overflow-hidden z-[1] bg-[#050505]">
      {/* Grid background overlay - Layer 2 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-[1]" />

      {/* Split-screen Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[45%_55%] gap-8 lg:gap-12 items-center flex-1 my-auto">
        
        {/* Right Side: Portrait Column - Layer 5 (Order-1 on Mobile, lg:order-2 on Desktop) */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full lg:col-span-1 relative flex items-end justify-center select-none order-1 lg:order-2 self-stretch min-h-[420px] sm:min-h-[550px] lg:min-h-[650px] overflow-visible z-[5] py-4"
        >
          {/* Giant glowing V logo directly behind subject - Layer 4 */}
          <div className="absolute top-[2%] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none select-none z-[4] overflow-visible opacity-[0.07] mix-blend-screen blur-[1px]">
            <svg className="w-[32rem] h-[32rem] sm:w-[40rem] sm:h-[40rem] md:w-[48rem] md:h-[48rem] overflow-visible" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="vFacet1-hero" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e50914" />
                  <stop offset="100%" stopColor="#800206" />
                </linearGradient>
                <linearGradient id="vFacet2-hero" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e50914" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1a0001" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="vFacet3-hero" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff4148" />
                  <stop offset="100%" stopColor="#800206" />
                </linearGradient>
              </defs>
              <path d="M 20 15 L 42 15 L 50 85 L 35 85 Z" fill="url(#vFacet1-hero)" />
              <path d="M 42 15 L 50 15 L 50 85 Z" fill="url(#vFacet2-hero)" />
              <path d="M 50 85 L 50 15 L 58 15 L 80 15 L 65 85 Z" fill="url(#vFacet3-hero)" />
              <path d="M 50 85 L 50 15 L 58 15 Z" fill="url(#vFacet2-hero)" />
            </svg>
          </div>

          {/* Red radial glow directly behind the character - Layer 4 */}
          <div className="absolute w-[600px] lg:w-[800px] h-[600px] lg:h-[800px] rounded-full bg-[#E50914]/12 z-[4] blur-3xl pointer-events-none top-[10%] left-1/2 -translate-x-1/2 lg:left-auto lg:right-[5%] lg:translate-x-0 mix-blend-screen" />

          {/* Portrait Image Wrapper - NO card border, NO card container, bleeding off viewport - Layer 5 */}
          <motion.div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] lg:left-auto lg:translate-x-0 lg:right-[2%] lg:w-[75%] h-[90%] lg:h-[105%] z-[5] flex items-end justify-center overflow-visible"
          >
            <img 
              src="/vedant_portrait.png" 
              alt="Vedant Tiwari" 
              className="h-[380px] sm:h-[480px] lg:h-full w-auto object-contain object-bottom pointer-events-none scale-100 lg:scale-[1.08] transition-transform duration-700 portrait-mask-blend"
              style={{
                filter: 'drop-shadow(0 0 12px rgba(229, 9, 20, 0.95)) drop-shadow(0 0 30px rgba(229, 9, 20, 0.6)) drop-shadow(0 0 65px rgba(229, 9, 20, 0.35))'
              }}
            />
          </motion.div>

          {/* DESKTOP ONLY: Orbiting HUD Cards - Layer 6 */}
          <div className="hidden lg:block absolute inset-0 z-[6] pointer-events-none">
            {/* 1. ROAS (Top-Left) */}
            <motion.div
              style={{
                x: mousePos.x * -12,
                y: mousePos.y * -12,
              }}
              className="absolute top-[6%] left-[12%] z-[6] bg-[#070707]/70 border border-red-500/20 backdrop-blur-md rounded-lg p-3.5 shadow-2xl flex flex-col gap-0.5 w-[130px] select-none pointer-events-none transition-all duration-200 hover:border-red-500/40"
            >
              <span className="text-[8px] uppercase tracking-wider text-red-500 font-mono font-bold">ROAS</span>
              <span className="text-base font-black text-white tracking-tight">8.45x</span>
              <span className="text-[8px] text-green-500 font-mono font-bold">↑ 28% Growth</span>
              <svg className="w-full h-5 text-red-600 mt-1" viewBox="0 0 50 20">
                <path d="M0 18 Q10 14 20 12 T40 6 T50 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.div>

            {/* 2. Conversions (Mid-Left) */}
            <motion.div
              style={{
                x: mousePos.x * -20,
                y: mousePos.y * -20,
              }}
              className="absolute top-[34%] left-[6%] z-[6] bg-[#070707]/70 border border-red-500/20 backdrop-blur-md rounded-lg p-3.5 shadow-2xl flex flex-col gap-0.5 w-[130px] select-none pointer-events-none transition-all duration-200 hover:border-red-500/40"
            >
              <span className="text-[8px] uppercase tracking-wider text-red-500 font-mono font-bold">Conversions</span>
              <span className="text-base font-black text-white tracking-tight">23,456</span>
              <span className="text-[8px] text-green-500 font-mono font-bold">↑ 32% YoY</span>
              <div className="flex items-end gap-1.5 h-6 mt-1.5">
                <div className="w-1.5 h-2 bg-red-950/80 rounded-t" />
                <div className="w-2.5 h-3.5 bg-red-900/80 rounded-t" />
                <div className="w-2.5 h-4.5 bg-red-800/80 rounded-t" />
                <div className="w-2.5 h-6 bg-[#E50914] rounded-t animate-pulse" />
              </div>
            </motion.div>

            {/* 3. Ad Spend (Bottom-Left) */}
            <motion.div
              style={{
                x: mousePos.x * -8,
                y: mousePos.y * -8,
              }}
              className="absolute bottom-[12%] left-[12%] z-[6] bg-[#070707]/70 border border-red-500/20 backdrop-blur-md rounded-lg p-3.5 shadow-2xl flex flex-col gap-0.5 w-[130px] select-none pointer-events-none transition-all duration-200 hover:border-red-500/40"
            >
              <span className="text-[8px] uppercase tracking-wider text-red-500 font-mono font-bold">Ad Spend</span>
              <span className="text-base font-black text-white tracking-tight">₹15.4L</span>
              <span className="text-[8px] text-green-500 font-mono font-bold">↑ 28% Managed</span>
              <div className="flex items-end gap-1.5 h-6 mt-1.5">
                <div className="w-1.5 h-1.5 bg-red-950/80 rounded-t" />
                <div className="w-2 h-2.5 bg-red-900/80 rounded-t" />
                <div className="w-2.5 h-4 bg-red-800/80 rounded-t" />
                <div className="w-2.5 h-6 bg-[#E50914] rounded-t" />
              </div>
            </motion.div>

            {/* 4. CTR (Top-Right) */}
            <motion.div
              style={{
                x: mousePos.x * 12,
                y: mousePos.y * 12,
              }}
              className="absolute top-[6%] right-[12%] z-[6] bg-[#070707]/70 border border-red-500/20 backdrop-blur-md rounded-lg p-3.5 shadow-2xl flex flex-col gap-0.5 w-[130px] select-none pointer-events-none border-r border-r-[#E50914]/20 transition-all duration-200 hover:border-red-500/40"
            >
              <span className="text-[8px] uppercase tracking-wider text-red-500 font-mono font-bold">CTR</span>
              <span className="text-base font-black text-white tracking-tight">2.45%</span>
              <span className="text-[8px] text-green-500 font-mono font-bold">↑ 18% Avg</span>
              <svg className="w-full h-5 text-red-600 mt-1" viewBox="0 0 50 20">
                <path d="M0 15 Q15 17 30 9 T50 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.div>

            {/* 5. CPC (Mid-Right) */}
            <motion.div
              style={{
                x: mousePos.x * 20,
                y: mousePos.y * 20,
              }}
              className="absolute top-[34%] right-[6%] z-[6] bg-[#070707]/70 border border-red-500/20 backdrop-blur-md rounded-lg p-3.5 shadow-2xl flex flex-col gap-0.5 w-[130px] select-none pointer-events-none transition-all duration-200 hover:border-red-500/40"
            >
              <span className="text-[8px] uppercase tracking-wider text-red-500 font-mono font-bold">CPC</span>
              <span className="text-base font-black text-white tracking-tight">₹11.23</span>
              <span className="text-[8px] text-red-500 font-mono font-bold">↓ 12% Cost</span>
              <svg className="w-full h-5 text-red-600 mt-1" viewBox="0 0 50 20">
                <path d="M0 3 Q15 6 30 11 T50 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.div>

            {/* 6. Impressions (Bottom-Right) */}
            <motion.div
              style={{
                x: mousePos.x * 8,
                y: mousePos.y * 8,
              }}
              className="absolute bottom-[12%] right-[12%] z-[6] bg-[#070707]/70 border border-red-500/20 backdrop-blur-md rounded-lg p-3.5 shadow-2xl flex items-center justify-between gap-2.5 w-[130px] select-none pointer-events-none transition-all duration-200 hover:border-red-500/40"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] uppercase tracking-wider text-red-500 font-mono font-bold">Impressions</span>
                <span className="text-base font-black text-white tracking-tight">2.8M</span>
                <span className="text-[8px] text-green-500 font-mono font-bold">↑ 21%</span>
              </div>
              <svg className="w-7 h-7 text-[#E50914] shrink-0" viewBox="0 0 36 36">
                <path className="text-neutral-900" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#E50914]" strokeWidth="3.5" strokeDasharray="78, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Left Side: Content Column - Layers 7 and 8 (Order-2 on Mobile, lg:order-1 on Desktop) */}
        <div className="w-full lg:col-span-1 flex flex-col justify-center text-left order-2 lg:order-1 relative z-[7] max-w-[560px] lg:max-w-none pt-4 lg:pt-0">
          {/* Brand Tagline Header - Layer 7 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6 z-[7]"
          >
            <span className="text-[#E50914] text-[10px] font-mono font-black uppercase tracking-[0.25em] bg-red-950/20 px-3.5 py-2 border border-red-900/30 rounded-md flex items-center gap-2 shadow-[0_0_15px_rgba(229,9,20,0.1)] z-[7]">
              <span className="w-2 h-2 bg-[#E50914] rounded-full animate-pulse" />
              VEDANT TIWARI ORIGINAL
            </span>
          </motion.div>

          {/* Cinematic Main Title - Layer 7 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-black tracking-tight text-white mb-6 leading-[1.05] z-[7] uppercase max-w-[560px]"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)' }}
          >
            {/* Desktop title wrap */}
            <span className="hidden lg:block">
              Marketing
              <span className="block mt-1">Growth Through</span>
            </span>
            {/* Mobile/Tablet title wrap */}
            <span className="block lg:hidden">
              Marketing Growth
              <span className="block mt-1">Through</span>
            </span>
            
            {/* Common red accents */}
            <span className="block text-[#E50914] glow-text-red mt-1">
              Strategy, Media &
            </span>
            <span className="block text-[#E50914] glow-text-red mt-1">
              Performance.
            </span>
          </motion.h1>

          {/* Subtitle - Layer 7 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-neutral-400 font-light leading-relaxed max-w-lg mb-8 z-[7]"
            style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.05rem)' }}
          >
            Turning Data Into Growth. I build campaigns that scale brands, optimize performance and deliver measurable business growth.
          </motion.p>

          {/* Netflix Styled Action Buttons - Layer 8 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 z-[8] relative mb-4"
          >
            <button
              onClick={() => scrollSection('career-universe')}
              className="flex items-center gap-2.5 bg-[#E50914] text-white font-bold text-xs px-7 py-4 rounded hover:bg-[#b20710] active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_4px_15px_rgba(229,9,20,0.3)]"
            >
              <Play className="w-4 h-4 fill-white stroke-none" />
              Explore My Journey
            </button>

            <button
              onClick={() => scrollSection('work-showcase')}
              className="flex items-center gap-2.5 bg-[#181818]/90 text-white border border-neutral-800 font-bold text-xs px-7 py-4 rounded hover:bg-neutral-800/80 hover:border-neutral-700 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Info className="w-4 h-4" />
              View My Work
            </button>

            <a
              href={portfolioData.personal.resumeUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('resume_download')}
              className="flex items-center gap-2.5 bg-transparent text-[#E50914] border border-[#E50914]/40 hover:border-[#E50914] hover:bg-[#E50914]/5 font-bold text-xs px-7 py-4 rounded active:scale-95 transition-all duration-200 cursor-pointer text-center"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          </motion.div>

          {/* MOBILE ONLY: Inline bottom Analytics Cards Grid - Layer 6 (Renders below CTA buttons) */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto lg:hidden mt-8 z-[6] relative px-1">
            {/* Card 1: ROAS */}
            <div className="bg-[#070707]/70 border border-red-500/20 backdrop-blur-md rounded-lg p-3.5 shadow-lg flex flex-col gap-0.5 select-none pointer-events-none text-left">
              <span className="text-[8px] uppercase tracking-wider text-red-500 font-mono font-bold">ROAS</span>
              <span className="text-base font-black text-white tracking-tight">8.45x</span>
              <span className="text-[8px] text-green-500 font-mono font-bold">↑ 28% Growth</span>
            </div>

            {/* Card 2: CTR */}
            <div className="bg-[#070707]/70 border border-red-500/20 backdrop-blur-md rounded-lg p-3.5 shadow-lg flex flex-col gap-0.5 select-none pointer-events-none text-left">
              <span className="text-[8px] uppercase tracking-wider text-red-500 font-mono font-bold">CTR</span>
              <span className="text-base font-black text-white tracking-tight">2.45%</span>
              <span className="text-[8px] text-green-500 font-mono font-bold">↑ 18% Avg</span>
            </div>

            {/* Card 3: Conversions */}
            <div className="bg-[#070707]/70 border border-red-500/20 backdrop-blur-md rounded-lg p-3.5 shadow-lg flex flex-col gap-0.5 select-none pointer-events-none text-left">
              <span className="text-[8px] uppercase tracking-wider text-red-500 font-mono font-bold">Conversions</span>
              <span className="text-base font-black text-white tracking-tight">23,456</span>
              <span className="text-[8px] text-green-500 font-mono font-bold">↑ 32% YoY</span>
            </div>

            {/* Card 4: CPC */}
            <div className="bg-[#070707]/70 border border-red-500/20 backdrop-blur-md rounded-lg p-3.5 shadow-lg flex flex-col gap-0.5 select-none pointer-events-none text-left">
              <span className="text-[8px] uppercase tracking-wider text-red-500 font-mono font-bold">CPC</span>
              <span className="text-base font-black text-white tracking-tight">₹11.23</span>
              <span className="text-[8px] text-red-500 font-mono font-bold">↓ 12% Cost</span>
            </div>

            {/* Card 5: Ad Spend */}
            <div className="bg-[#070707]/70 border border-red-500/20 backdrop-blur-md rounded-lg p-3.5 shadow-lg flex flex-col gap-0.5 select-none pointer-events-none text-left">
              <span className="text-[8px] uppercase tracking-wider text-red-500 font-mono font-bold">Ad Spend</span>
              <span className="text-base font-black text-white tracking-tight">₹15.4L</span>
              <span className="text-[8px] text-green-500 font-mono font-bold">↑ 28% Managed</span>
            </div>

            {/* Card 6: Impressions */}
            <div className="bg-[#070707]/70 border border-red-500/20 backdrop-blur-md rounded-lg p-3.5 shadow-lg flex items-center justify-between gap-2.5 select-none pointer-events-none text-left">
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] uppercase tracking-wider text-red-500 font-mono font-bold">Impressions</span>
                <span className="text-base font-black text-white tracking-tight">2.8M</span>
                <span className="text-[8px] text-green-500 font-mono font-bold">↑ 21%</span>
              </div>
              <svg className="w-7 h-7 text-[#E50914] shrink-0" viewBox="0 0 36 36">
                <path className="text-neutral-900" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#E50914]" strokeWidth="3.5" strokeDasharray="78, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* Full Width Statistic Grid - Layer 7 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.6 }}
        className="w-full max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 py-6 md:py-8 border-t border-b border-neutral-900/80 relative z-[7] bg-black/40 backdrop-blur-sm px-4 rounded-lg mt-12 lg:mt-16"
      >
        <div className="flex flex-col items-center justify-center text-center py-4">
          <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-[#E50914] glow-text-red whitespace-nowrap">
            <AnimatedCounter value={portfolioData.stats.experience} />
          </span>
          <span className="text-neutral-500 text-[9px] sm:text-xs uppercase tracking-widest mt-2 font-medium">Experience</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center py-4 border-l border-neutral-900">
          <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-white whitespace-nowrap">
            <AnimatedCounter value={portfolioData.stats.adSpend} />
          </span>
          <span className="text-neutral-500 text-[9px] sm:text-xs uppercase tracking-widest mt-2 font-medium">Ad Budget Managed</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center py-4 border-t lg:border-t-0 lg:border-l border-neutral-900/80 lg:border-neutral-900">
          <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-[#E50914] glow-text-red whitespace-nowrap">
            <AnimatedCounter value={portfolioData.stats.platforms} />
          </span>
          <span className="text-neutral-500 text-[9px] sm:text-xs uppercase tracking-widest mt-2 font-medium">Ad Networks</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center py-4 border-t border-l lg:border-t-0 border-neutral-900/80 lg:border-neutral-900">
          <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-white whitespace-nowrap">
            <AnimatedCounter value={portfolioData.stats.campaigns} />
          </span>
          <span className="text-neutral-500 text-[9px] sm:text-xs uppercase tracking-widest mt-2 font-medium">Campaigns Executed</span>
        </div>
      </motion.div>

      {/* Floating Scroll Indicator progress bar */}
      <div className="fixed top-0 left-0 h-1 bg-red-600 z-50 transition-all duration-75" style={{ width: `${scrollProgress * 100}%` }} />
    </section>
  );
}

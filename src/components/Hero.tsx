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
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 pt-20 overflow-hidden">
      {/* Dynamic Red Glow Ambient Light */}
      <div className="ambient-light-red -top-20 -left-20" />
      <div className="ambient-light-red bottom-10 right-10" style={{ opacity: 0.05 }} />

      {/* Grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Split-screen Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-stretch justify-between gap-10 mt-6 md:mt-16 pb-12">
        
        {/* Left Side: Content Column */}
        <div className="w-full md:w-[55%] flex flex-col justify-center text-left order-1 md:order-1">
          {/* Brand Tagline Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="text-[#E50914] text-xs font-bold tracking-[0.3em] uppercase bg-red-950/40 px-3 py-1.5 border border-red-800/40 rounded-full flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 animate-pulse" />
              Vedant Tiwari Original
            </span>
            <span className="text-neutral-500 text-xs tracking-wider uppercase hidden sm:inline">
              • Interactive Portfolio
            </span>
          </motion.div>

          {/* Cinematic Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.05]"
            style={{ fontFamily: 'var(--netflix-font)' }}
          >
            Marketing Growth Through
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] via-[#F54F57] to-[#B20710] glow-text-red">
              Strategy, Media & Performance.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-neutral-400 text-base md:text-lg font-light leading-relaxed max-w-xl mb-10"
          >
            {portfolioData.personal.tagline} I build campaigns that scale brands, optimize performance and deliver measurable business growth.
          </motion.p>

          {/* Netflix Styled Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => scrollSection('career-universe')}
              className="flex items-center gap-2 bg-white text-black font-semibold px-6 md:px-8 py-3.5 rounded hover:bg-neutral-200 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg shadow-white/5"
            >
              <Play className="w-5 h-5 fill-black stroke-none" />
              Explore My Journey
            </button>

            <button
              onClick={() => scrollSection('work-showcase')}
              className="flex items-center gap-2 bg-neutral-800/80 text-white border border-neutral-700/60 font-semibold px-6 md:px-8 py-3.5 rounded hover:bg-neutral-700/80 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Info className="w-5 h-5" />
              View My Work
            </button>

            <a
              href={portfolioData.personal.resumeUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('resume_download')}
              className="flex items-center gap-2 bg-transparent text-[#E50914] border border-[#E50914]/50 hover:border-[#E50914] hover:bg-[#E50914]/5 font-semibold px-6 md:px-8 py-3.5 rounded active:scale-95 transition-all duration-200 cursor-pointer text-center"
            >
              <Download className="w-5 h-5" />
              Download Resume
            </a>
          </motion.div>
        </div>

        {/* Right Side: Cinematic Portrait & HUD Centerpiece */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full md:w-[48%] relative flex items-end justify-center select-none order-2 md:order-2 self-stretch min-h-[500px] md:min-h-none pt-8 pb-0 md:py-0 px-4 sm:px-8 overflow-visible"
        >
          {/* Target/Radar backdrop */}
          <div 
            className="absolute w-[350px] md:w-[500px] h-[350px] md:h-[500px] border border-red-600/10 rounded-full flex items-center justify-center opacity-70 z-0 pointer-events-none top-[15%] right-[-5%] sm:right-[-10%]"
            style={{ animation: 'spin 40s linear infinite' }}
          >
            <div className="w-[85%] h-[85%] border border-dashed border-red-600/10 rounded-full" />
            <div className="w-[60%] h-[60%] border border-red-600/10 rounded-full" />
            <div className="w-[30%] h-[30%] border border-red-600/20 rounded-full" />
          </div>

          {/* Giant glowing V logo */}
          <div className="absolute top-[5%] right-[-15%] sm:right-[-20%] flex items-center justify-center pointer-events-none select-none z-0 overflow-visible opacity-[0.03] blur-[2px]">
            <svg className="w-[40rem] h-[40rem] sm:w-[50rem] sm:h-[50rem] md:w-[60rem] md:h-[60rem] overflow-visible" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="vFacet1-hero" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff1e27" />
                  <stop offset="100%" stopColor="#b20710" />
                </linearGradient>
                <linearGradient id="vFacet2-hero" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e50914" />
                  <stop offset="100%" stopColor="#600104" />
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

          {/* Red radial glow directly behind the character for the premium red halo effect */}
          <div className="absolute w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-[radial-gradient(circle,rgba(229,9,20,0.3)_0%,transparent_70%)] z-0 blur-3xl pointer-events-none top-[10%] right-[-10%]" />

          {/* Portrait Image Wrapper - NO card border, NO card container, bleeding off viewport */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-0 right-[-15%] sm:right-[-10%] md:right-[-5%] w-auto h-[90%] md:h-[110%] z-10 flex items-end justify-center overflow-visible"
          >
            <img 
              src="/vedant_portrait.png" 
              alt="Vedant Tiwari" 
              className="h-full w-auto object-contain object-bottom pointer-events-none filter drop-shadow-[0_0_20px_rgba(229,9,20,0.25)] scale-100 md:scale-105 transition-transform duration-700"
            />

            {/* Smooth bottom fade gradient to blend his shirt into the dark background */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
          </motion.div>

          {/* Floating HUD Cards */}
          {/* 1. ROAS (Top-Left) */}
          <motion.div
            style={{
              x: mousePos.x * -12,
              y: mousePos.y * -12,
            }}
            animate={{ y: [0, -3, 0] }}
            transition={{
              y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-[8%] left-2 md:left-[-4%] z-20 bg-black/60 border border-red-500/15 backdrop-blur-md rounded p-3 shadow-2xl flex flex-col gap-0.5 w-[120px] select-none pointer-events-none border-l-2 border-l-[#E50914]"
          >
            <span className="text-[8px] uppercase tracking-wider text-red-500 font-bold">ROAS</span>
            <span className="text-sm font-black text-white tracking-tight">8.45x</span>
            <span className="text-[7.5px] text-green-500 font-bold flex items-center gap-0.5">↑ 28% Growth</span>
            <svg className="w-full h-5 text-red-500 mt-1" viewBox="0 0 50 20">
              <path d="M0 18 Q10 14 20 12 T40 6 T50 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.div>

          {/* 2. Conversions (Mid-Left) */}
          <motion.div
            style={{
              x: mousePos.x * -20,
              y: mousePos.y * -20,
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              y: { duration: 4.0, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
            }}
            className="absolute top-[40%] left-0 md:left-[-12%] z-20 bg-black/60 border border-red-500/15 backdrop-blur-md rounded p-3 shadow-2xl flex flex-col gap-0.5 w-[120px] select-none pointer-events-none border-l-2 border-l-[#E50914]"
          >
            <span className="text-[8px] uppercase tracking-wider text-red-500 font-bold">Conversions</span>
            <span className="text-sm font-black text-white tracking-tight">23,456</span>
            <span className="text-[7.5px] text-green-500 font-bold flex items-center gap-0.5">↑ 32% YoY</span>
            <svg className="w-full h-5 text-red-500 mt-1" viewBox="0 0 50 20">
              <path d="M0 18 L10 15 L20 16 L30 9 L40 11 L50 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.div>

          {/* 3. Ad Spend (Bottom-Left) */}
          <motion.div
            style={{
              x: mousePos.x * -8,
              y: mousePos.y * -8,
            }}
            animate={{ y: [0, -4, 0] }}
            transition={{
              y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
            }}
            className="absolute bottom-[8%] left-2 md:left-[-4%] z-20 bg-black/60 border border-red-500/15 backdrop-blur-md rounded p-3 shadow-2xl flex flex-col gap-0.5 w-[120px] select-none pointer-events-none border-l-2 border-l-[#E50914]"
          >
            <span className="text-[8px] uppercase tracking-wider text-red-500 font-bold">Ad Spend</span>
            <span className="text-sm font-black text-white tracking-tight">₹15.4L</span>
            <span className="text-[7.5px] text-green-500 font-bold flex items-center gap-0.5">↑ 28% Managed</span>
            <div className="flex items-end gap-1.5 h-5 mt-1">
              <div className="w-1.5 h-1.5 bg-red-950/80 rounded-t" />
              <div className="w-2 h-2.5 bg-red-900/80 rounded-t" />
              <div className="w-2 h-4 bg-red-800/80 rounded-t" />
              <div className="w-2.5 h-6 bg-red-500 rounded-t" />
            </div>
          </motion.div>

          {/* 4. CTR (Top-Right) */}
          <motion.div
            style={{
              x: mousePos.x * 12,
              y: mousePos.y * 12,
            }}
            animate={{ y: [0, -3.5, 0] }}
            transition={{
              y: { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.1 }
            }}
            className="absolute top-[8%] right-2 md:right-[0%] z-20 bg-black/60 border border-red-500/15 backdrop-blur-md rounded p-3 shadow-2xl flex flex-col gap-0.5 w-[120px] select-none pointer-events-none border-r-2 border-r-[#E50914] text-right items-end"
          >
            <span className="text-[8px] uppercase tracking-wider text-red-500 font-bold">CTR</span>
            <span className="text-sm font-black text-white tracking-tight">2.45%</span>
            <span className="text-[7.5px] text-green-500 font-bold">↑ 18% Avg</span>
            <svg className="w-full h-5 text-red-500 mt-1" viewBox="0 0 50 20">
              <path d="M0 15 Q15 17 30 9 T50 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.div>

          {/* 5. CPC (Mid-Right) */}
          <motion.div
            style={{
              x: mousePos.x * 20,
              y: mousePos.y * 20,
            }}
            animate={{ y: [0, -4.5, 0] }}
            transition={{
              y: { duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }
            }}
            className="absolute top-[40%] right-0 md:right-[-8%] z-20 bg-black/60 border border-red-500/15 backdrop-blur-md rounded p-3 shadow-2xl flex flex-col gap-0.5 w-[120px] select-none pointer-events-none border-r-2 border-r-[#E50914] text-right items-end"
          >
            <span className="text-[8px] uppercase tracking-wider text-red-500 font-bold">CPC</span>
            <span className="text-sm font-black text-white tracking-tight">₹11.23</span>
            <span className="text-[7.5px] text-red-500 font-bold">↓ 12% Cost</span>
            <svg className="w-full h-5 text-red-500 mt-1" viewBox="0 0 50 20">
              <path d="M0 3 Q15 6 30 11 T50 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.div>

          {/* 6. Impressions (Bottom-Right) */}
          <motion.div
            style={{
              x: mousePos.x * 8,
              y: mousePos.y * 8,
            }}
            animate={{ y: [0, -4, 0] }}
            transition={{
              y: { duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.7 }
            }}
            className="absolute bottom-[8%] right-2 md:right-[0%] z-20 bg-black/60 border border-red-500/15 backdrop-blur-md rounded p-3 shadow-2xl flex items-center justify-between gap-2.5 w-[120px] select-none pointer-events-none border-r-2 border-r-[#E50914]"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] uppercase tracking-wider text-red-500 font-bold">Impressions</span>
              <span className="text-sm font-black text-white tracking-tight">2.8M</span>
              <span className="text-[7.5px] text-green-500 font-bold">↑ 21%</span>
            </div>
            <svg className="w-7 h-7 text-red-500 shrink-0" viewBox="0 0 36 36">
              <path className="text-neutral-900" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-[#E50914]" strokeWidth="3" strokeDasharray="78, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
          </motion.div>
        </div>

      </div>

      {/* Full Width Statistic Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.6 }}
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-b border-neutral-900/80 relative z-10 bg-black/40 backdrop-blur-sm px-4 rounded-lg"
      >
        <div className="flex flex-col items-center justify-center text-center py-4 md:py-0">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#E50914] glow-text-red">
            <AnimatedCounter value={portfolioData.stats.experience} />
          </span>
          <span className="text-neutral-500 text-[10px] sm:text-xs uppercase tracking-widest mt-2 font-medium">Experience</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center py-4 md:py-0 border-t sm:border-t-0 sm:border-l border-neutral-900">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            <AnimatedCounter value={portfolioData.stats.adSpend} />
          </span>
          <span className="text-neutral-500 text-[10px] sm:text-xs uppercase tracking-widest mt-2 font-medium">Ad Budget Managed</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center py-4 md:py-0 border-t sm:border-t md:border-t-0 md:border-l border-neutral-900">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#E50914] glow-text-red">
            <AnimatedCounter value={portfolioData.stats.platforms} />
          </span>
          <span className="text-neutral-500 text-[10px] sm:text-xs uppercase tracking-widest mt-2 font-medium">Ad Networks</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center py-4 md:py-0 border-t sm:border-t sm:border-l md:border-t-0 md:border-l border-neutral-900">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            <AnimatedCounter value={portfolioData.stats.campaigns} />
          </span>
          <span className="text-neutral-500 text-[10px] sm:text-xs uppercase tracking-widest mt-2 font-medium">Campaigns Executed</span>
        </div>
      </motion.div>

      {/* Floating Scroll Indicator progress bar */}
      <div className="fixed top-0 left-0 h-1 bg-red-600 z-50 transition-all duration-75" style={{ width: `${scrollProgress * 100}%` }} />
    </section>
  );
}

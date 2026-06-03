'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Download, Award } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

// Dynamic Counter Component
function AnimatedCounter({ value, duration = 1.5 }: { value: string; duration?: number }) {
  const [current, setCurrent] = useState(0);
  
  // Extract number from string, e.g., "1.5+" -> 1.5, "15L+" -> 15, "50+" -> 50
  const match = value.match(/[\d.]+/);
  const target = match ? parseFloat(match[0]) : 0;
  const suffix = value.replace(/[\d.]+/, '');

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
      {current}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0);

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

      <div className="relative z-10 max-w-4xl mt-12 md:mt-20">
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
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.05]"
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
          className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mb-10"
        >
          {portfolioData.personal.tagline} I build campaigns that scale brands, optimize performance and deliver measurable business growth.
        </motion.p>

        {/* Netflix Styled Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap gap-4 mb-16 md:mb-24"
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
            className="flex items-center gap-2 bg-transparent text-[#E50914] border border-[#E50914]/50 hover:border-[#E50914] hover:bg-[#E50914]/5 font-semibold px-6 md:px-8 py-3.5 rounded active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            Download Resume
          </a>
        </motion.div>
      </div>

      {/* Full Width Statistic Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.6 }}
        className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-b border-neutral-900/80 relative z-10 bg-black/40 backdrop-blur-sm px-4 rounded-lg"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-3xl md:text-4xl font-extrabold text-[#E50914] glow-text-red">
            <AnimatedCounter value={portfolioData.stats.experience} />
          </span>
          <span className="text-neutral-500 text-xs uppercase tracking-widest mt-2 font-medium">Experience</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center border-l border-neutral-900">
          <span className="text-3xl md:text-4xl font-extrabold text-white">
            <AnimatedCounter value={portfolioData.stats.adSpend} />
          </span>
          <span className="text-neutral-500 text-xs uppercase tracking-widest mt-2 font-medium">Ad Budget Managed</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center border-l border-neutral-900">
          <span className="text-3xl md:text-4xl font-extrabold text-[#E50914] glow-text-red">
            <AnimatedCounter value={portfolioData.stats.platforms} />
          </span>
          <span className="text-neutral-500 text-xs uppercase tracking-widest mt-2 font-medium">Ad Networks</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center border-l border-neutral-900">
          <span className="text-3xl md:text-4xl font-extrabold text-white">
            <AnimatedCounter value={portfolioData.stats.campaigns} />
          </span>
          <span className="text-neutral-500 text-xs uppercase tracking-widest mt-2 font-medium">Campaigns Executed</span>
        </div>
      </motion.div>

      {/* Floating Scroll Indicator progress bar */}
      <div className="fixed top-0 left-0 h-1 bg-red-600 z-50 transition-all duration-75" style={{ width: `${scrollProgress * 100}%` }} />
    </section>
  );
}

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Maximize2, 
  MousePointer, 
  Command, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Crosshair, 
  Cpu, 
  ArrowRight,
  ChevronDown,
  Share2,
  Lock,
  Grid
} from 'lucide-react';

interface IntroAnimationProps {
  onComplete: (profileId: string) => void;
}

const BRAND_PALETTE = [
  { hex: '#FF1A1A', label: 'Primary Neon Red' },
  { hex: '#B80D0D', label: 'Crimson' },
  { hex: '#7A0707', label: 'Dark Red' },
  { hex: '#120202', label: 'Obsidian' },
  { hex: '#FFFFFF', label: 'Pure White' },
];

const LOADING_STAGES = [
  { progress: 25, label: 'INITIALIZING FIGMA BRAND CANVAS...', sub: 'Loading grid matrix & system tokens' },
  { progress: 55, label: 'RENDERING 3D CRYSTAL "V" MARK...', sub: 'Applying neon red light pass & shaders' },
  { progress: 85, label: 'COMPILING MEDIA & PERFORMANCE HUD...', sub: 'Syncing ROAS & strategy telemetry' },
  { progress: 100, label: 'VEDANTVERSE PROTOTYPE READY', sub: 'Click or scroll down to enter' },
];

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 120, y: 140 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion & sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      onComplete('performance-marketing');
      return;
    }

    const hasSeen = sessionStorage.getItem('vedant_seen_intro');
    if (hasSeen === 'true') {
      onComplete('performance-marketing');
    }
  }, [onComplete]);

  const handleFinish = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vedant_seen_intro', 'true');
    }
    onComplete('performance-marketing');
  }, [onComplete]);

  // Loading Progress Timer (0 to 100%)
  useEffect(() => {
    if (isReducedMotion) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        // Increment with dynamic acceleration
        const increment = prev < 40 ? 3 : prev < 75 ? 2 : 1;
        const next = Math.min(100, prev + increment);
        
        // Update stage
        if (next >= 85) setStageIndex(3);
        else if (next >= 55) setStageIndex(2);
        else if (next >= 25) setStageIndex(1);
        
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isReducedMotion]);

  // Simulated Figma Mouse Cursor movement
  useEffect(() => {
    if (isReducedMotion) return;
    const moves = [
      { x: 140, y: 180 },
      { x: 420, y: 320 },
      { x: 680, y: 450 },
      { x: 500, y: 380 },
    ];
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % moves.length;
      setCursorPos(moves[idx]);
    }, 1800);
    return () => clearInterval(timer);
  }, [isReducedMotion]);

  // Listen for user scroll / keyboard events to quickly finish
  useEffect(() => {
    if (isReducedMotion) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        handleFinish();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'Space', 'Enter', 'PageDown', 'Escape'].includes(e.key)) {
        handleFinish();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReducedMotion, handleFinish]);

  if (isReducedMotion) return null;

  const currentStage = LOADING_STAGES[stageIndex];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(12px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 w-screen h-screen bg-[#070709] text-white flex flex-col overflow-hidden select-none font-sans"
    >
      {/* Background Figma Dark Canvas Grid */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255, 26, 26, 0.15) 0%, transparent 60%),
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
      />

      {/* Crosshair Dots on Grid Intersections */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-12 left-12 text-[#FF1A1A]/40 text-xs font-mono">+ 0,0</div>
        <div className="absolute top-12 right-12 text-[#FF1A1A]/40 text-xs font-mono">+ 1920,0</div>
        <div className="absolute bottom-12 left-12 text-[#FF1A1A]/40 text-xs font-mono">+ 0,1080</div>
        <div className="absolute bottom-12 right-12 text-[#FF1A1A]/40 text-xs font-mono">+ 1920,1080</div>
      </div>

      {/* ---------------- FIGMA TOP TOOLBAR ---------------- */}
      <header className="relative z-30 h-13 bg-[#111116] border-b border-neutral-800/80 px-4 flex items-center justify-between shadow-md text-xs font-medium">
        {/* Left: Brand / File Info */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#FF1A1A] flex items-center justify-center font-black text-white text-sm shadow-[0_0_10px_rgba(255,26,26,0.6)]">
            ❖
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-neutral-200 font-bold tracking-tight">VEDANTVERSE</span>
              <span className="text-neutral-500 text-[10px]">/ Brand Identity & Intro.fig</span>
            </div>
            <span className="text-[9px] text-[#FF1A1A] font-mono tracking-widest uppercase font-bold">
              Figma Design Prototype v2.4
            </span>
          </div>
        </div>

        {/* Center: Frame indicator */}
        <div className="hidden md:flex items-center gap-2 bg-neutral-900/90 px-3 py-1 rounded-md border border-neutral-800 text-[11px] text-neutral-300">
          <Grid className="w-3.5 h-3.5 text-[#FF1A1A]" />
          <span className="font-mono">Frame 01: VEDANTVERSE Logo Reveal</span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400 font-mono">1920 × 1080</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900/80 border border-neutral-800 rounded text-[11px] text-neutral-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% ZOOM</span>
          </div>

          <button
            onClick={handleFinish}
            className="px-3.5 py-1.5 bg-[#FF1A1A] hover:bg-[#d90e0e] text-white font-bold text-[11px] uppercase tracking-wider rounded transition-all duration-200 shadow-[0_0_12px_rgba(255,26,26,0.4)] hover:shadow-[0_0_18px_rgba(255,26,26,0.7)] cursor-pointer flex items-center gap-1.5"
          >
            <span>SKIP INTRO</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* ---------------- MAIN CANVAS AREA ---------------- */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
        
        {/* Animated Figma Cursor Simulation */}
        <motion.div
          animate={{ x: cursorPos.x, y: cursorPos.y }}
          transition={{ type: 'spring', damping: 20, stiffness: 80 }}
          className="absolute top-20 left-20 z-40 pointer-events-none hidden md:flex items-center gap-1.5"
        >
          <MousePointer className="w-5 h-5 text-[#FF1A1A] fill-[#FF1A1A] drop-shadow-[0_0_8px_rgba(255,26,26,0.8)]" />
          <span className="px-2 py-0.5 bg-[#FF1A1A] text-white text-[10px] font-bold rounded shadow-md font-mono">
            Vedant (Designer)
          </span>
        </motion.div>

        {/* FIGMA SELECTION FRAME CONTAINER */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative max-w-2xl w-full bg-[#0c0c10]/90 rounded-2xl border-2 border-[#FF1A1A]/80 shadow-[0_0_60px_rgba(255,26,26,0.25)] p-8 md:p-12 flex flex-col items-center text-center backdrop-blur-xl"
        >
          {/* Figma Selection Nodes (Top-Left, Top-Right, Bottom-Left, Bottom-Right) */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-[#FF1A1A] shadow-md rounded-sm" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-[#FF1A1A] shadow-md rounded-sm" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-[#FF1A1A] shadow-md rounded-sm" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-[#FF1A1A] shadow-md rounded-sm" />

          {/* Figma Tag Badge on Frame */}
          <div className="absolute -top-7 left-4 bg-[#FF1A1A] text-white text-[10px] font-extrabold uppercase font-mono px-3 py-1 rounded-t-md shadow-md flex items-center gap-1.5 tracking-widest">
            <span>❖ PRIMARY BRAND MARK</span>
            <span className="text-white/60">|</span>
            <span className="text-white/90">VEDANTVERSE</span>
          </div>

          {/* 1. CENTRAL LOGO BADGE (From Attached Figma Assets) */}
          <div className="relative mb-6 group cursor-pointer" onClick={handleFinish}>
            {/* Pulsing Backlight Glow */}
            <motion.div 
              animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.75, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#FF1A1A] via-[#B80D0D] to-[#FF1A1A] blur-2xl opacity-60"
            />

            {/* Logo Image Circle Container */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-2 rounded-full border border-dashed border-[#FF1A1A]/40"
            />

            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full p-1 bg-gradient-to-b from-[#FF1A1A] via-[#7A0707] to-transparent shadow-[0_0_35px_rgba(255,26,26,0.5)]">
              <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center border border-neutral-800">
                <img 
                  src="/logo-circle-exact.png" 
                  alt="VedantVerse Logo" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* 2. TYPOGRAPHY BRAND NAME REVEAL */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-1.5 mb-5"
          >
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-widest text-white uppercase font-sans">
                VEDANT<span className="text-[#FF1A1A] drop-shadow-[0_0_12px_rgba(255,26,26,0.8)]">VERSE</span>
              </h1>
            </div>

            {/* Red Accent Divider Line with Center Gem */}
            <div className="flex items-center gap-3 w-full max-w-sm my-1">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#FF1A1A] to-transparent" />
              <span className="w-2 h-2 rounded-full bg-[#FF1A1A] shadow-[0_0_8px_rgba(255,26,26,0.9)]" />
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#FF1A1A] to-transparent" />
            </div>

            <p className="text-[10px] md:text-xs text-neutral-300 font-mono tracking-[0.25em] uppercase font-semibold">
              DRIVING <span className="text-[#FF1A1A] font-bold">GROWTH</span> THROUGH STRATEGY, MEDIA & PERFORMANCE.
            </p>
          </motion.div>

          {/* 3. COLOR PALETTE SWATCHES (Matching Image 1 Figma Spec) */}
          <div className="flex items-center gap-2 mb-8 bg-neutral-950/80 px-4 py-2 rounded-xl border border-neutral-900 shadow-inner">
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono font-bold mr-1">Palette:</span>
            {BRAND_PALETTE.map((color) => (
              <div key={color.hex} className="flex items-center gap-1 group relative">
                <div 
                  className="w-4 h-4 rounded-md border border-white/20 shadow-sm cursor-help transition-transform hover:scale-125"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black border border-neutral-800 text-[9px] font-mono text-neutral-300 rounded whitespace-nowrap z-50">
                  {color.hex}
                </span>
              </div>
            ))}
          </div>

          {/* 4. FIGMA COMPONENT LOADING PROGRESS BAR */}
          <div className="w-full max-w-md space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400 text-[11px] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF1A1A] animate-spin" />
                <span>{currentStage.label}</span>
              </span>
              <span className="text-[#FF1A1A] font-black text-sm drop-shadow-[0_0_10px_rgba(255,26,26,0.7)]">
                {progress}%
              </span>
            </div>

            {/* Glowing Red Track */}
            <div className="relative w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800 p-0.5 shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-[#7A0707] via-[#B80D0D] to-[#FF1A1A] rounded-full shadow-[0_0_15px_rgba(255,26,26,0.9)] relative"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full animate-ping" />
              </motion.div>
            </div>

            <p className="text-[10px] text-neutral-500 font-mono italic">
              {currentStage.sub}
            </p>
          </div>

          {/* 5. ACTION BUTTON / SCROLL TRIGGER */}
          <div className="mt-8">
            <button
              onClick={handleFinish}
              className={`px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-xl ${
                isReady
                  ? 'bg-gradient-to-r from-[#FF1A1A] to-[#b20710] text-white shadow-[0_0_30px_rgba(255,26,26,0.6)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,26,26,0.8)] border border-red-500/50'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
              }`}
            >
              <span>{isReady ? 'ENTER VEDANTVERSE EXPERIENCE' : 'CLICK OR SCROLL TO ENTER'}</span>
              <ArrowRight className="w-4 h-4 text-white animate-bounce-x" />
            </button>
          </div>

        </motion.div>
      </main>

      {/* ---------------- FIGMA BOTTOM STATUS FOOTER ---------------- */}
      <footer className="relative z-30 h-10 bg-[#0e0e12] border-t border-neutral-800/80 px-6 flex items-center justify-between text-[10px] font-mono text-neutral-400">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A]" />
            DATA DRIVEN
          </span>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <span className="hidden sm:inline">GROWTH FOCUSED</span>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <span className="hidden sm:inline">PERFORMANCE OPTIMIZED</span>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <span className="hidden sm:inline">RESULTS ORIENTED</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-neutral-500">CANVAS_RES: 1920×1080</span>
          <span className="text-[#FF1A1A] font-bold">SYSTEM ACTIVE</span>
        </div>
      </footer>
    </motion.div>
  );
}

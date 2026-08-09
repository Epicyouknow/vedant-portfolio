'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: (profileId: string) => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

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

  // Smooth loading progress bar (0 to 100%)
  useEffect(() => {
    if (isReducedMotion) return;

    const startTime = Date.now();
    const duration = 2400; // 2.4 seconds smooth load

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / duration) * 100);
      
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(timer);
        setTimeout(handleFinish, 200); // Smooth exit delay
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isReducedMotion, handleFinish]);

  // Click, scroll, or keypress to skip immediately
  useEffect(() => {
    if (isReducedMotion) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) handleFinish();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      handleFinish();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReducedMotion, handleFinish]);

  if (isReducedMotion) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      onClick={handleFinish}
      className="fixed inset-0 z-50 w-screen h-screen bg-black text-white flex flex-col items-center justify-center select-none cursor-pointer overflow-hidden"
    >
      {/* Subtle background ambient red radial glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 26, 26, 0.25) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* 1. ANIMATING "V" LOGO */}
        <motion.div
          animate={{
            scale: [0.96, 1.04, 0.96],
            opacity: [0.85, 1, 0.85],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative mb-10 group"
        >
          {/* Backlight Pulse Glow */}
          <div className="absolute -inset-6 rounded-full bg-[#FF1A1A] blur-3xl opacity-50 animate-pulse pointer-events-none" />

          {/* Glowing Red V Logo Mark Container */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl p-0.5 bg-gradient-to-b from-[#FF1A1A] via-[#800206] to-transparent shadow-[0_0_40px_rgba(255,26,26,0.6)]">
            <div className="w-full h-full rounded-[14px] overflow-hidden bg-black flex items-center justify-center border border-neutral-900/80">
              <img
                src="/logo-icon-exact.png"
                alt="V Logo"
                className="w-full h-full object-cover filter drop-shadow-[0_0_15px_rgba(255,26,26,0.8)]"
              />
            </div>
          </div>
        </motion.div>

        {/* 2. MINIMAL SLEEK LOADING BAR (NO NUMBERS, NO TEXT) */}
        <div className="w-48 md:w-64 h-1 bg-neutral-900 rounded-full overflow-hidden border border-neutral-900/80 relative shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-[#800206] via-[#B80D0D] to-[#FF1A1A] rounded-full shadow-[0_0_12px_rgba(255,26,26,0.9)] relative"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.1 }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full opacity-80 animate-ping" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

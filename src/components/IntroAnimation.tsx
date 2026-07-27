'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, ChevronDown } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: (profileId: string) => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [videoEnded, setVideoEnded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion & sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      return;
    }

    const hasSeen = sessionStorage.getItem('vedant_seen_intro');
    if (hasSeen === 'true') {
      onComplete('performance-marketing');
    }
  }, [onComplete]);

  // Autoplay video on mount
  useEffect(() => {
    if (videoRef.current && !isReducedMotion) {
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay fallback attempt:', err);
      });
    }
  }, [isReducedMotion]);

  const handleFinish = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vedant_seen_intro', 'true');
    }
    onComplete('performance-marketing');
  }, [onComplete]);

  // Pause on final frame showing SCROLL TO CONTINUE
  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setVideoEnded(true);
  };

  // Scroll-linked depth transition once video reaches end or in reduced motion
  useEffect(() => {
    if (!videoEnded && !isReducedMotion) return;

    let accumulatedScroll = 0;
    const threshold = 160; // Smooth scroll distance threshold

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        accumulatedScroll += e.deltaY;
        const progress = Math.min(1, accumulatedScroll / threshold);
        setScrollProgress(progress);

        if (progress >= 1) {
          handleFinish();
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const diffY = touchStartY - currentY;
      if (diffY > 0) {
        accumulatedScroll += diffY * 1.4;
        const progress = Math.min(1, accumulatedScroll / threshold);
        setScrollProgress(progress);

        if (progress >= 1) {
          handleFinish();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish();
      } else if (['ArrowDown', 'Space', 'Enter', 'PageDown'].includes(e.key)) {
        setScrollProgress(1);
        handleFinish();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoEnded, isReducedMotion, handleFinish]);

  return (
    <div
      ref={containerRef}
      onClick={() => {
        if (videoEnded || isReducedMotion) handleFinish();
      }}
      className="fixed inset-0 z-50 w-screen h-screen bg-black text-white overflow-hidden select-none cursor-pointer"
    >
      {/* Persistent, always-visible Skip Intro Button */}
      <button
        onClick={handleFinish}
        aria-label="Skip Intro"
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 border border-neutral-700 hover:border-white bg-black/80 hover:bg-white text-neutral-300 hover:text-black font-mono font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-all duration-300 shadow-2xl rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <span>Skip Intro</span>
        <SkipForward className="w-3.5 h-3.5" />
      </button>

      {/* Reduced Motion Static Fallback */}
      {isReducedMotion ? (
        <motion.div
          style={{ opacity: 1 - scrollProgress }}
          className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-black"
        >
          <div className="max-w-md space-y-6">
            <span className="text-[#E50914] text-xs font-mono font-bold uppercase tracking-[0.25em] block">
              VEDANTVERSE
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
              SCROLL TO CONTINUE
            </h1>
            <p className="text-neutral-400 text-xs font-mono">
              (Static version for reduced motion accessibility)
            </p>
            <ChevronDown className="w-6 h-6 text-[#E50914] animate-bounce mx-auto mt-4" />
          </div>
        </motion.div>
      ) : (
        /* Full-Bleed Video & Scroll Depth Transition */
        <AnimatePresence mode="wait">
          <motion.div
            key="video-intro"
            style={{
              scale: 1 + scrollProgress * 0.22,
              opacity: 1 - scrollProgress,
              filter: `blur(${scrollProgress * 14}px)`,
            }}
            transition={{ ease: 'easeOut', duration: 0.1 }}
            className="relative w-full h-full bg-black flex items-center justify-center will-change-transform"
          >
            <video
              ref={videoRef}
              src="/intro.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleVideoEnd}
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* Scroll Glow Hint overlay when holding on final frame */}
            {videoEnded && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1 - scrollProgress, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-10 inset-x-0 flex flex-col items-center justify-center z-40 text-center pointer-events-none"
              >
                <div className="flex flex-col items-center gap-2 px-6 py-2.5 bg-black/70 rounded-full border border-red-900/50 backdrop-blur-md shadow-[0_0_20px_rgba(229,9,20,0.4)]">
                  <span className="text-[#E50914] text-[11px] font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping" />
                    SCROLL DOWN TO ENTER
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

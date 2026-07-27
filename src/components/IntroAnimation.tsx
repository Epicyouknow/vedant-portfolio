'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, ChevronDown } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: (profileId: string) => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [stage, setStage] = useState<'initial' | 'playing' | 'continue' | 'reduced'>('initial');
  const [videoReady, setVideoReady] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion & sessionStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      setStage('reduced');
      return;
    }

    // Check sessionStorage
    const hasSeen = sessionStorage.getItem('vedant_seen_intro');
    if (hasSeen === 'true') {
      onComplete('performance-marketing');
    }
  }, [onComplete]);

  // Complete intro and save to sessionStorage
  const handleComplete = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vedant_seen_intro', 'true');
    }
    onComplete('performance-marketing');
  }, [onComplete]);

  // Trigger video playback on scroll or interaction
  const triggerPlay = useCallback(() => {
    if (stage !== 'initial') return;
    setStage('playing');
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Video playback interrupted or blocked:', err);
        // Fallback to continue state if video fails
        setStage('continue');
      });
    }
  }, [stage]);

  // Listen for scroll, touch, or key events to trigger playback
  useEffect(() => {
    if (stage !== 'initial' && stage !== 'continue') return;

    const handleScrollOrKey = (e: Event) => {
      if (stage === 'initial') {
        triggerPlay();
      } else if (stage === 'continue') {
        handleComplete();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleComplete();
      } else if (['ArrowDown', 'Space', 'Enter', 'PageDown'].includes(e.key)) {
        handleScrollOrKey(e);
      }
    };

    window.addEventListener('wheel', handleScrollOrKey, { passive: true });
    window.addEventListener('touchmove', handleScrollOrKey, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleScrollOrKey);
      window.removeEventListener('touchmove', handleScrollOrKey);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [stage, triggerPlay, handleComplete]);

  // IntersectionObserver to detect scroll gestures
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && stage === 'initial') {
            triggerPlay();
          }
        });
      },
      { threshold: 0.8 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [stage, triggerPlay]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black text-white overflow-hidden font-sans select-none"
    >
      {/* Persistent Skip Intro Button */}
      <button
        onClick={handleComplete}
        aria-label="Skip Intro"
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 border border-neutral-700 hover:border-white bg-black/80 hover:bg-white text-neutral-300 hover:text-black font-mono font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-all duration-300 shadow-2xl rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <span>Skip Intro</span>
        <SkipForward className="w-3.5 h-3.5" />
      </button>

      {/* STAGE 0: Reduced Motion Fallback */}
      {isReducedMotion || stage === 'reduced' ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-black">
          <div className="max-w-md space-y-6">
            <span className="text-red-500 text-xs font-mono font-bold uppercase tracking-[0.25em] block">
              VEDANTVERSE INTRO
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase font-sans">
              SCROLL TO CONTINUE
            </h1>
            <p className="text-neutral-400 text-xs font-mono">
              (Static version for reduced motion accessibility)
            </p>
            <button
              onClick={handleComplete}
              className="mt-6 px-8 py-3 bg-[#E50914] text-white font-bold uppercase text-xs tracking-wider rounded hover:bg-red-700 transition-colors cursor-pointer"
            >
              Enter Portfolio
            </button>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* STAGE 1: Calm Initial Dark Screen */}
          {stage === 'initial' && (
            <motion.div
              key="initial-stage"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              onClick={triggerPlay}
              className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[#050505] cursor-pointer"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
                <span className="text-neutral-500 text-xs font-mono font-bold uppercase tracking-[0.3em]">
                  VEDANTVERSE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-300 uppercase tracking-widest mt-2">
                  SCROLL TO REVEAL
                </h2>
                <ChevronDown className="w-5 h-5 text-neutral-500 animate-bounce mt-4" />
              </div>
            </motion.div>
          )}

          {/* STAGE 2: Full-Bleed Video Playback */}
          {(stage === 'playing' || stage === 'continue') && (
            <motion.div
              key="video-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-full bg-black flex items-center justify-center"
            >
              <video
                ref={videoRef}
                src="/intro.mp4"
                muted
                playsInline
                preload="auto"
                onCanPlay={() => setVideoReady(true)}
                onEnded={() => setStage('continue')}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* STAGE 3: Continue Scroll Overlay when video completes */}
              {stage === 'continue' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  onClick={handleComplete}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-end pb-16 text-center cursor-pointer z-40"
                >
                  <div className="flex flex-col items-center gap-3 p-6 bg-black/60 rounded-xl border border-red-900/40 backdrop-blur-md">
                    <span className="text-[#E50914] text-xs font-mono font-bold tracking-[0.25em] uppercase">
                      REVEAL COMPLETE
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest font-sans">
                      SCROLL TO CONTINUE
                    </h3>
                    <p className="text-neutral-400 text-[10px] font-mono tracking-wider">
                      (Or tap anywhere to enter homepage)
                    </p>
                    <ChevronDown className="w-6 h-6 text-[#E50914] animate-bounce mt-2" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

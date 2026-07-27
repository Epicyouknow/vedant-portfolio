'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: (profileId: string) => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [videoEnded, setVideoEnded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Autoplay video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay fallback attempt:', err);
      });
    }
  }, []);

  const handleFinish = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vedant_seen_intro', 'true');
    }
    onComplete('performance-marketing');
  }, [onComplete]);

  // When video ends, pause on last frame ("SCROLL TO CONTINUE")
  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setVideoEnded(true);
  };

  // Listen for realistic scroll input once video has ended
  useEffect(() => {
    if (!videoEnded) return;

    let accumulatedScroll = 0;
    const threshold = 180; // Scroll distance threshold

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
        accumulatedScroll += diffY * 1.5;
        const progress = Math.min(1, accumulatedScroll / threshold);
        setScrollProgress(progress);

        if (progress >= 1) {
          handleFinish();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'Space', 'Enter', 'PageDown'].includes(e.key)) {
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
  }, [videoEnded, handleFinish]);

  if (isReducedMotion) {
    return null;
  }

  return (
    <div
      onClick={() => {
        if (videoEnded) handleFinish();
      }}
      className="fixed inset-0 z-50 bg-black text-white overflow-hidden select-none cursor-pointer"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="video-intro"
          style={{
            scale: 1 + scrollProgress * 0.18,
            opacity: 1 - scrollProgress,
            filter: `blur(${scrollProgress * 12}px)`,
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

          {/* Interactive Scroll Glow Hint when video reaches SCROLL TO CONTINUE */}
          {videoEnded && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1 - scrollProgress, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-8 inset-x-0 flex flex-col items-center justify-center z-40 text-center pointer-events-none"
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
    </div>
  );
}

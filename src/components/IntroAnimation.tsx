'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: (profileId: string) => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [videoEnded, setVideoEnded] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      onComplete('performance-marketing');
      return;
    }

    // Check sessionStorage
    const hasSeen = sessionStorage.getItem('vedant_seen_intro');
    if (hasSeen === 'true') {
      onComplete('performance-marketing');
    }
  }, [onComplete]);

  // Ensure video plays immediately on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay fallback attempt:', err);
      });
    }
  }, []);

  const handleFinish = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vedant_seen_intro', 'true');
    }
    onComplete('performance-marketing');
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    // Smooth transition to homepage shortly after video ends
    setTimeout(() => {
      handleFinish();
    }, 1200);
  };

  // Allow clicking anywhere to complete after video finishes
  const handleContainerClick = () => {
    if (videoEnded) {
      handleFinish();
    }
  };

  if (isReducedMotion) {
    return null;
  }

  return (
    <div
      onClick={handleContainerClick}
      className="fixed inset-0 z-50 bg-black text-white overflow-hidden select-none cursor-pointer"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="video-intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="relative w-full h-full bg-black flex items-center justify-center"
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

          {videoEnded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute bottom-10 inset-x-0 flex flex-col items-center justify-center z-40 text-center pointer-events-none"
            >
              <span className="text-neutral-400 text-xs font-mono font-bold uppercase tracking-[0.25em] bg-black/60 px-4 py-2 rounded border border-neutral-800 backdrop-blur-md">
                ENTERING VEDANTVERSE...
              </span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

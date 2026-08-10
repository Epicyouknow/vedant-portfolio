'use client';

import React, { useEffect, useState, useCallback } from 'react';
import styles from './BrandLoader.module.css';

interface IntroAnimationProps {
  onComplete: (profileId: string) => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const handleFinish = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vedant_seen_intro', 'true');
    }
    onComplete('performance-marketing');
  }, [onComplete]);

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

  // Precise requestAnimationFrame progress loader (1800ms brisk pace)
  useEffect(() => {
    if (isReducedMotion) return;

    const duration = 1800; // ms, matches Figma's brisk pace
    const start = performance.now();
    let animFrameId: number;

    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);

      if (pct < 1) {
        animFrameId = requestAnimationFrame(tick);
      } else {
        setTimeout(handleFinish, 250); // brief hold at 100% before handing off
      }
    }

    animFrameId = requestAnimationFrame(tick);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [isReducedMotion, handleFinish]);

  // Click, scroll, or keypress to skip immediately
  useEffect(() => {
    if (isReducedMotion) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) handleFinish();
    };

    const handleKeyDown = () => {
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
    <div className={styles.wrap} onClick={handleFinish}>
      {/* Ambient Red Glow Background */}
      <div className={styles.ambientGlow} />

      <div className={styles.logoContainer}>
        {/* Animated Stroke Box & V Logo SVG */}
        <svg
          className={styles.logo}
          width="100"
          height="100"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1"
            y="1"
            width="62"
            height="62"
            rx="14"
            stroke="#e02020"
            strokeWidth="2"
            className={styles.rectPath}
          />
          <path
            d="M18 20 L32 46 L46 20"
            stroke="#e02020"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className={styles.vPath}
          />
        </svg>

        {/* Brand Logo Image from public/intro or public/ logo assets */}
        <img
          src="/logo-icon-exact.png"
          alt="Vedant Logo"
          className={styles.logoImage}
        />
      </div>

      {/* Brisk Progress Bar */}
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

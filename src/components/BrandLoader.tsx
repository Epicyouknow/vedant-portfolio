'use client';

import React, { useEffect, useState } from 'react';
import styles from './BrandLoader.module.css';

export default function BrandLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
        setTimeout(onDone, 250); // brief hold at 100% before handing off
      }
    }

    animFrameId = requestAnimationFrame(tick);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [onDone]);

  return (
    <div className={styles.wrap}>
      <div className={styles.ambientGlow} />

      <div className={styles.logoContainer}>
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

        <img
          src="/logo-icon-exact.png"
          alt="Vedant Logo"
          className={styles.logoImage}
        />
      </div>

      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}

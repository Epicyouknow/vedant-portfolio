'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './HorrorIntro.module.css';

const SCROLL_TEXT = 'SCROLL TO CONTINUE';

export default function HorrorIntro({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'checking' | 'playing' | 'holding' | 'done'>('checking');
  const [reduced, setReduced] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const seen = sessionStorage.getItem('vedant_seen_horror_intro') || sessionStorage.getItem('vedant_seen_intro');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(prefersReduced);

    if (seen) {
      setPhase('done');
      return;
    }

    if (prefersReduced) {
      // Skip straight to a static hold, no motion
      setPhase('holding');
      return;
    }

    setPhase('playing');
    // Total animation runtime ~8.5s, matches the CSS timeline
    const t = setTimeout(() => setPhase('holding'), 8500);
    return () => clearTimeout(t);
  }, []);

  // Once holding, wait for the user's actual scroll/wheel/touch input to finish
  useEffect(() => {
    if (phase !== 'holding') return;

    const finish = () => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('vedant_seen_horror_intro', '1');
        sessionStorage.setItem('vedant_seen_intro', 'true');
      }
      setPhase('done');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'Space', 'Enter', 'PageDown'].includes(e.key)) {
        finish();
      }
    };

    window.addEventListener('wheel', finish, { passive: true, once: true });
    window.addEventListener('touchmove', finish, { passive: true, once: true });
    window.addEventListener('keydown', handleKeyDown, { once: true });

    return () => {
      window.removeEventListener('wheel', finish);
      window.removeEventListener('touchmove', finish);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [phase]);

  const skip = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vedant_seen_horror_intro', '1');
      sessionStorage.setItem('vedant_seen_intro', 'true');
    }
    setPhase('done');
  };

  if (phase === 'checking') return null;

  return (
    <>
      {children}
      {phase !== 'done' && (
        <div
          ref={overlayRef}
          className={`${styles.overlay} ${phase === 'holding' ? styles.holding : ''} ${reduced ? styles.reduced : ''}`}
          role="presentation"
        >
          <div className={styles.zoomLayer}>
            <img src="/intro/keyboard.jpg" alt="" className={styles.keyboardImg} />
            <div className={styles.flash} />
          </div>

          <div className={styles.blackout} />

          <div className={styles.textWrap} aria-hidden={phase === 'playing'}>
            {SCROLL_TEXT.split('').map((char, i) => (
              <span
                key={i}
                className={styles.letter}
                style={{ animationDelay: reduced ? '0s' : `${6.6 + i * 0.17}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>

          <button
            onClick={skip}
            className={styles.skipBtn}
            aria-label="Skip intro animation"
          >
            SKIP INTRO ▶
          </button>
        </div>
      )}
    </>
  );
}

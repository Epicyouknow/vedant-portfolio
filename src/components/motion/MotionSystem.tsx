'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion';

// Refined Apple-style easing curves
export const EASING = {
  smooth: [0.16, 1, 0.3, 1] as const, // Decelerate smoothly
  cinematic: [0.25, 0.1, 0.25, 1] as const, // Subtle cinematic glide
  spring: { type: 'spring' as const, stiffness: 100, damping: 20 },
};

/**
 * TextMaskReveal: Reveals text lines smoothly using an overflow-hidden mask
 */
export function TextMaskReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
        transition={{
          duration: 0.85,
          delay,
          ease: EASING.smooth,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * FadeUpStagger: Staggers children with upward translation
 */
export function FadeUpStagger({
  children,
  className = '',
  delay = 0,
  stagger = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeUpItem: Child item for FadeUpStagger
 */
export function FadeUpItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 35 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            ease: EASING.smooth,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedCounter: Animates numbers smoothly when in view (e.g., ₹50L+, 4.6x, -22%, 3,190+)
 */
export function AnimatedCounter({
  value,
  duration = 1.8,
  className = '',
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [displayValue, setDisplayValue] = useState(value);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    if (!isInView) {
      setDisplayValue('0');
      return;
    }

    // Parse prefix, number, and suffix
    const match = value.match(/^([^\d.]*)([\d,.]+)([^\d.]*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1];
    const cleanNum = parseFloat(match[2].replace(/,/g, ''));
    const suffix = match[3];

    let start = 0;
    const isDecimal = match[2].includes('.');
    const decimalPlaces = isDecimal ? match[2].split('.')[1].length : 0;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Apple-style ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + easeProgress * (cleanNum - start);

      const formatted = isDecimal
        ? current.toFixed(decimalPlaces)
        : Math.round(current).toLocaleString();

      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(value);
      }
    };

    const animId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animId);
  }, [isInView, value, duration, shouldReduceMotion]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}

/**
 * SlideScene: Connected full-screen scene with subtle scroll-linked entrance/exit
 */
export function SlideScene({
  children,
  id,
  className = '',
  pinned = false,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  pinned?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Subtle opacity & translateY based on scroll position
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.65, 1, 1, 0.75]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [40, 0, 0, -30]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.985, 1, 1, 0.99]);

  if (shouldReduceMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      ref={ref}
      style={{ opacity, y, scale }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
    </motion.section>
  );
}

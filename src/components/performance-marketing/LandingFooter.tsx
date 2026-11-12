'use client';

import React from 'react';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';

export default function LandingFooter() {
  return (
    <footer className="py-12 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] text-xs">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-7 h-7 rounded-full bg-[#191919] dark:bg-[#F7F5F0] flex items-center justify-center text-white dark:text-[#191919] font-black text-xs">
            V
          </div>
          <div>
            <div className="font-bold text-sm text-[var(--text-primary)] font-outfit">
              VedantVerse
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              Performance Marketing That Makes Business Sense.
            </div>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs">
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
            Main Portfolio
          </Link>
          <Link href="/case-studies" className="hover:text-[var(--text-primary)] transition-colors">
            Case Studies
          </Link>
          <Link href="/blog" className="hover:text-[var(--text-primary)] transition-colors">
            Growth Blog
          </Link>
          <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors">
            Terms
          </Link>
        </div>

        {/* Theme Toggle & Copyright */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono">Theme:</span>
            <ThemeToggle />
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} Vedant Tiwari
          </span>
        </div>

      </div>
    </footer>
  );
}


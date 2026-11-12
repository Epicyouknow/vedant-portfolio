'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X, Shield, Sparkles } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-xs py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group cursor-pointer"
          aria-label="VedantVerse"
        >
          <div className="w-8 h-8 rounded-full bg-[#191919] dark:bg-[#F7F5F0] flex items-center justify-center text-white dark:text-[#191919] font-black text-sm tracking-tight transition-transform duration-200 group-hover:scale-105">
            V
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-[var(--text-primary)] transition-colors leading-none">
              VedantVerse
            </span>
            <span className="text-[10px] tracking-wider uppercase text-[#ED463B] font-semibold mt-0.5">
              Growth Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
          aria-label="Landing Page Navigation"
        >
          <button
            onClick={() => scrollTo('capabilities')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Capabilities
          </button>
          <button
            onClick={() => scrollTo('framework')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Framework
          </button>
          <button
            onClick={() => scrollTo('industries')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Industries
          </button>
          <button
            onClick={() => scrollTo('work')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Selected Work
          </button>
          <button
            onClick={() => scrollTo('trust')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Why Strategy
          </button>
          <button
            onClick={() => scrollTo('enquiry')}
            className="hover:text-[#ED463B] transition-colors cursor-pointer"
          >
            Enquire
          </button>
        </nav>

        {/* Action Controls: Theme Toggle & Primary CTA */}
        <div className="flex items-center gap-3">
          {/* Dark / Bright mode toggle button matching website */}
          <ThemeToggle />

          <button
            onClick={() => scrollTo('enquiry')}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase bg-[#ED463B] hover:bg-[#d9382d] text-white transition-all duration-200 cursor-pointer shadow-md shadow-[#ED463B]/20 group"
          >
            <span>Let&apos;s Discuss</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--tag-bg)] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-base)] px-6 py-6 transition-all duration-200 shadow-xl">
          <div className="flex flex-col gap-4 text-sm font-semibold tracking-wide uppercase text-[var(--text-primary)]">
            <button
              onClick={() => scrollTo('capabilities')}
              className="text-left py-2 hover:text-[#ED463B] transition-colors"
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollTo('framework')}
              className="text-left py-2 hover:text-[#ED463B] transition-colors"
            >
              Framework
            </button>
            <button
              onClick={() => scrollTo('industries')}
              className="text-left py-2 hover:text-[#ED463B] transition-colors"
            >
              Industries
            </button>
            <button
              onClick={() => scrollTo('work')}
              className="text-left py-2 hover:text-[#ED463B] transition-colors"
            >
              Selected Work
            </button>
            <button
              onClick={() => scrollTo('trust')}
              className="text-left py-2 hover:text-[#ED463B] transition-colors"
            >
              Why Strategy
            </button>
            <button
              onClick={() => scrollTo('enquiry')}
              className="text-left py-2 text-[#ED463B] font-bold"
            >
              Enquire Now
            </button>
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)] font-normal normal-case">
                Theme Toggle
              </span>
              <ThemeToggle />
            </div>
            <button
              onClick={() => scrollTo('enquiry')}
              className="mt-2 w-full py-3 rounded-full text-center text-xs font-bold uppercase tracking-wider bg-[#ED463B] text-white"
            >
              Let&apos;s Discuss Your Business &rarr;
            </button>
          </div>
        </div>
      )}
    </header>
  );
}


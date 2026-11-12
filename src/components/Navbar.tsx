'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useEnquiryModal } from '../context/EnquiryModalContext';
import { trackButtonClick, trackNavigationClick } from '@/lib/tracking';

export default function Navbar() {
  const { openModal } = useEnquiryModal();
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
    } else {
      window.location.href = `/#${id}`;
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
          aria-label="VedantVerse Homepage"
        >
          <div className="w-8 h-8 rounded-full bg-[#191919] dark:bg-[#F7F5F0] flex items-center justify-center text-white dark:text-[#191919] font-black text-sm tracking-tight transition-transform duration-200 group-hover:scale-105">
            V
          </div>
          <span className="font-semibold text-base tracking-tight text-[var(--text-primary)] transition-colors">
            VedantVerse
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[var(--text-secondary)]"
          aria-label="Primary Navigation"
        >
          <button
            onClick={() => scrollTo('case-study-cards')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Work
          </button>
          <button
            onClick={() => scrollTo('industries-scaled')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Industries
          </button>
          <Link
            href="/performance-marketing"
            className="hover:text-[#ED463B] transition-colors"
          >
            Growth Studio
          </Link>
          <button
            onClick={() => scrollTo('growth-process')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Services
          </button>
          <button
            onClick={() => scrollTo('performance-reporting')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Reporting
          </button>
          <button
            onClick={() => scrollTo('unlocked-achievements')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Achievements
          </button>
          <button
            onClick={() => scrollTo('interactive-career-map')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Career
          </button>
          <button
            onClick={() => scrollTo('editorial-statement')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            About
          </button>
          <Link
            href="/blog"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            Blog
          </Link>
          <button
            onClick={() => scrollTo('contact-section')}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Action Controls: Theme Toggle & CTA Button */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => {
              trackButtonClick({
                buttonName: 'header_discuss_click',
                label: "Let's Discuss",
                sectionName: 'header',
                destination: 'modal',
              });
              openModal();
            }}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ED463B] hover:bg-[#d9382d] text-white transition-all duration-200 cursor-pointer shadow-md shadow-[#ED463B]/20 group"
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
        <div className="lg:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-base)] px-6 py-6 transition-all duration-200 shadow-lg">
          <nav className="flex flex-col gap-3 text-sm font-medium text-[var(--text-secondary)]">
            <Link
              href="/performance-marketing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-2 text-[#ED463B] font-bold transition-colors border-b border-[var(--border-subtle)] flex items-center justify-between"
            >
              <span>Growth Studio &bull; Performance Marketing</span>
              <span>&rarr;</span>
            </Link>
            <button
              onClick={() => scrollTo('case-study-cards')}
              className="text-left py-2 hover:text-[var(--text-primary)] transition-colors border-b border-[var(--border-subtle)]"
            >
              Work
            </button>
            <button
              onClick={() => scrollTo('industries-scaled')}
              className="text-left py-2 hover:text-[var(--text-primary)] transition-colors border-b border-[var(--border-subtle)]"
            >
              Industries Scaled
            </button>
            <button
              onClick={() => scrollTo('growth-process')}
              className="text-left py-2 hover:text-[var(--text-primary)] transition-colors border-b border-[var(--border-subtle)]"
            >
              Services &amp; Process
            </button>
            <button
              onClick={() => scrollTo('performance-reporting')}
              className="text-left py-2 hover:text-[var(--text-primary)] transition-colors border-b border-[var(--border-subtle)]"
            >
              Reporting Dashboard
            </button>
            <button
              onClick={() => scrollTo('unlocked-achievements')}
              className="text-left py-2 hover:text-[var(--text-primary)] transition-colors border-b border-[var(--border-subtle)]"
            >
              Unlocked Achievements
            </button>
            <button
              onClick={() => scrollTo('interactive-career-map')}
              className="text-left py-2 hover:text-[var(--text-primary)] transition-colors border-b border-[var(--border-subtle)]"
            >
              Career Transit Map
            </button>
            <button
              onClick={() => scrollTo('editorial-statement')}
              className="text-left py-2 hover:text-[var(--text-primary)] transition-colors border-b border-[var(--border-subtle)]"
            >
              About
            </button>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-2 hover:text-[var(--text-primary)] transition-colors border-b border-[var(--border-subtle)]"
            >
              Blog
            </Link>
            <button
              onClick={() => scrollTo('contact-section')}
              className="text-left py-2 hover:text-[var(--text-primary)] transition-colors border-b border-[var(--border-subtle)]"
            >
              Contact
            </button>
            <Link
              href="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-2 hover:text-[var(--text-primary)] transition-colors border-b border-[var(--border-subtle)]"
            >
              Privacy Policy
            </Link>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  trackButtonClick({
                    buttonName: 'mobile_header_discuss_click',
                    label: "LET'S DISCUSS YOUR BUSINESS",
                    sectionName: 'mobile_nav',
                    destination: 'modal',
                  });
                  setMobileMenuOpen(false);
                  openModal();
                }}
                className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ED463B] text-white hover:bg-[#d9382d] flex items-center justify-center gap-2 shadow-md shadow-[#ED463B]/20 cursor-pointer"
              >
                <span>LET&apos;S DISCUSS YOUR BUSINESS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

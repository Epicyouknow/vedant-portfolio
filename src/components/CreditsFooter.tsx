'use client';

import React, { useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, ChevronUp, Heart } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { useAnalytics } from '../hooks/useAnalytics';

export default function CreditsFooter() {
  const { trackEvent } = useAnalytics();
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  // Global mouse coordinates tracker for the Custom Cursor
  useEffect(() => {
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const dot = cursorDotRef.current;
    const glow = cursorGlowRef.current;

    if (isTouch) {
      if (dot) dot.style.display = 'none';
      if (glow) glow.style.display = 'none';
      return;
    }

    if (!dot || !glow) return;

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the central red dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    // Smooth trailing animation for the outer glow ring
    const updateGlowPosition = () => {
      const ease = 0.15;
      glowX += (mouseX - glowX) * ease;
      glowY += (mouseY - glowY) * ease;

      if (glow) {
        glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
      }
      requestAnimationFrame(updateGlowPosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animationId = requestAnimationFrame(updateGlowPosition);

    // Scaling effect on hovering clickable items
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer');

      if (isClickable) {
        dot.style.width = '24px';
        dot.style.height = '24px';
        dot.style.backgroundColor = 'rgba(229, 9, 20, 0.2)';
        glow.style.width = '60px';
        glow.style.height = '60px';
        glow.style.borderColor = 'rgba(229, 9, 20, 0.9)';
      } else {
        dot.style.width = '8px';
        dot.style.height = '8px';
        dot.style.backgroundColor = 'var(--netflix-red)';
        glow.style.width = '40px';
        glow.style.height = '40px';
        glow.style.borderColor = 'rgba(229, 9, 20, 0.5)';
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="credits-footer" className="bg-[#000000] border-t border-neutral-900 pt-20 pb-8 px-6 md:px-16 relative overflow-hidden select-none">
      
      {/* Custom Cursor DOM nodes */}
      <div ref={cursorDotRef} className="custom-cursor z-50 pointer-events-none fixed top-0 left-0" />
      <div ref={cursorGlowRef} className="custom-cursor-glow z-50 pointer-events-none fixed top-0 left-0" />

      {/* Ambient glowing lines */}
      <div className="ambient-light-red bottom-0 left-10" style={{ opacity: 0.03 }} />

      <div className="max-w-6xl mx-auto">
        
        {/* Upper Grid: Contact Info Panels */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-16 border-b border-neutral-900">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-wider font-sans">
              VEDANT TIWARI
            </h3>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              Turning Data Into Growth. Mumbai-based growth marketer specializing in ROAS scaling, media plans, and technical tags.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Ad Spend Enquiries</h4>
            <div className="space-y-3">
              <a 
                href={`mailto:${portfolioData.personal.email}`}
                onClick={() => trackEvent('contact_click', { type: 'email' })}
                className="flex items-center gap-2.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#E50914]" />
                {portfolioData.personal.email}
              </a>
              <a 
                href={`tel:${portfolioData.personal.phone}`}
                onClick={() => trackEvent('contact_click', { type: 'phone' })}
                className="flex items-center gap-2.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#E50914]" />
                {portfolioData.personal.phone}
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Channels</h4>
            <div className="space-y-3">
              <a 
                href={portfolioData.personal.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('linkedin_click')}
                className="flex items-center gap-2.5 text-xs text-neutral-400 hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current text-[#E50914]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn Profile
              </a>
              <span className="flex items-center gap-2.5 text-xs text-neutral-400">
                <MapPin className="w-4 h-4 text-[#E50914]" />
                {portfolioData.personal.location}
              </span>
            </div>
          </div>

          {/* Return to top */}
          <div className="flex flex-col items-start md:items-end justify-center">
            <button
              onClick={scrollToTop}
              className="p-3 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-[#E50914] rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
            >
              <ChevronUp className="w-4 h-4" />
              Back to Start
            </button>
          </div>

        </div>

        {/* Middle: Netflix Rolling Credits Style */}
        <div className="py-16 text-center max-w-2xl mx-auto space-y-8 select-none">
          <span className="text-[10px] text-neutral-600 uppercase tracking-[0.3em] font-bold block mb-4">
            Production Credits
          </span>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-xs leading-relaxed">
            <div className="text-right">
              <span className="text-neutral-500 uppercase block tracking-wider text-[9px] font-bold">Directed By</span>
              <span className="text-neutral-200 font-extrabold">VEDANT TIWARI</span>
            </div>
            <div className="text-left">
              <span className="text-neutral-500 uppercase block tracking-wider text-[9px] font-bold">Executive Producer</span>
              <span className="text-neutral-200 font-extrabold">VEDANT TIWARI</span>
            </div>

            <div className="text-right">
              <span className="text-neutral-500 uppercase block tracking-wider text-[9px] font-bold">Growth Strategy</span>
              <span className="text-neutral-200 font-extrabold">THE ROAS ALCHEMIST</span>
            </div>
            <div className="text-left">
              <span className="text-neutral-500 uppercase block tracking-wider text-[9px] font-bold">Digital Commander</span>
              <span className="text-neutral-200 font-extrabold">MEDIA COMMANDER</span>
            </div>

            <div className="text-right">
              <span className="text-neutral-500 uppercase block tracking-wider text-[9px] font-bold">Special Thanks</span>
              <span className="text-neutral-200 font-extrabold">COFFEE & CODING CONCEPTS</span>
            </div>
            <div className="text-left">
              <span className="text-neutral-500 uppercase block tracking-wider text-[9px] font-bold">Cast</span>
              <span className="text-neutral-200 font-extrabold">RECRUITERS, CLIENTS, YOU</span>
            </div>
          </div>

          <p className="text-[10px] text-neutral-700 uppercase tracking-widest pt-8">
            © 2026 Vedant Tiwari. All Rights Reserved.
          </p>
        </div>

        {/* Lower row: Footer bottom branding */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-[#E50914] stroke-none animate-pulse" />
            <span>in Mumbai, India</span>
          </div>

          <div className="flex gap-4">
            <span className="hover:text-neutral-400 transition-colors">Privacy Policy</span>
            <span className="hover:text-neutral-400 transition-colors">Terms of Service</span>
            <span className="hover:text-neutral-400 transition-colors">Contact Support</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

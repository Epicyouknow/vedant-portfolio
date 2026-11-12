'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTASection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 border-t border-[var(--border-subtle)] bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-base)] relative overflow-hidden">
      {/* Subtle Red Center Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none opacity-30 dark:opacity-50"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(237, 70, 59, 0.28) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[#ED463B] text-[11px] font-mono font-bold tracking-widest uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#ED463B]" />
          <span>LET&apos;S BUILD SUSTAINABLE GROWTH</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] font-outfit mb-4 max-w-2xl mx-auto leading-tight">
          Ready to Make Your Advertising More Strategic?
        </h2>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] font-normal max-w-xl mx-auto mb-10 leading-relaxed">
          Let&apos;s discuss your business, your goals and the right way forward.
        </p>

        <button
          type="button"
          onClick={() => scrollTo('enquiry')}
          className="inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-[#ED463B] hover:bg-[#d9382d] text-white text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#ED463B]/25 hover:shadow-2xl hover:shadow-[#ED463B]/35 hover:-translate-y-0.5 cursor-pointer group"
        >
          <span>Start a Conversation</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        <div className="mt-8 text-xs text-[var(--text-secondary)] font-mono">
          Response within 24 business hours &bull; Strict confidentiality
        </div>

      </div>
    </section>
  );
}


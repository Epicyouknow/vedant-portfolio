'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, Award, FileText, Globe, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import ContactAndFooter from '../../components/ContactAndFooter';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col justify-between selection:bg-[#ED463B] selection:text-white">
      {/* 1. Global Navbar */}
      <Navbar />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20 w-full">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[var(--text-muted)] hover:text-[#ED463B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO PORTFOLIO</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-[var(--border-subtle)] pb-8 mb-12 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#ED463B]">
            <Scale className="w-4 h-4" />
            <span>TERMS OF ENGAGEMENT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1]">
            Terms of Service
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-muted)] pt-1">
            <span className="px-2.5 py-1 rounded-full bg-[var(--tag-bg)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold">
              Effective: November 2026
            </span>
            <span>•</span>
            <span>Applies to vedantverse.in</span>
          </div>
        </div>

        {/* Structured Editorial Terms Content */}
        <div className="space-y-10 text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">

          {/* Section 1: Acceptance */}
          <section className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2.5 tracking-tight">
              <span className="w-1.5 h-5 bg-[#ED463B] rounded-full" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing <strong>VedantVerse</strong> (<Link href="/" className="text-[#ED463B] font-mono hover:underline">https://vedantverse.in</Link>), you agree to abide by and be bound by these Terms of Service. If you do not agree with any portion of these terms, please discontinue using this website.
            </p>
          </section>

          {/* Section 2: Intellectual Property */}
          <section className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2.5 tracking-tight">
              <span className="w-1.5 h-5 bg-[#ED463B] rounded-full" />
              2. Intellectual Property &amp; Original Frameworks
            </h2>
            <p>
              All proprietary media buying models, campaign audit structures, written guides, graphic visualizations, case study summaries, and custom code on VedantVerse are the intellectual property of <strong>Vedant Tiwari</strong>, unless otherwise attributed.
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              You are welcome to reference concepts or share excerpts provided that clear attribution and a direct link back to <code className="font-mono text-[#ED463B]">https://vedantverse.in</code> are included.
            </p>
          </section>

          {/* Section 3: Client Case Studies & Verified Results */}
          <section className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2.5 tracking-tight">
              <span className="w-1.5 h-5 bg-[#ED463B] rounded-full" />
              3. Case Study Data &amp; NDA Integrity
            </h2>
            <p>
              All performance metrics (including ROAS, CPL, conversions, and ad spend) published on VedantVerse represent genuine, verified outcomes achieved in real-world advertising accounts managed by Vedant Tiwari.
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              In accordance with strict client non-disclosure agreements (NDAs), certain brand names, internal identifiers, or sensitive audience segments may be anonymized or aggregated. Past performance results do not constitute an explicit commercial guarantee for future campaigns.
            </p>
          </section>

          {/* Section 4: Contact & Governing Law */}
          <section className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2.5 tracking-tight">
              <span className="w-1.5 h-5 bg-[#ED463B] rounded-full" />
              4. Direct Inquiries
            </h2>
            <p>
              For legal inquiries, contract clarifications, or licensing permissions, please contact:
            </p>
            <div className="p-4 rounded-xl bg-[var(--tag-bg)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)]">
              Email: <a href="mailto:contactvedantverse@gmail.com" className="text-[#ED463B] hover:underline font-bold">contactvedantverse@gmail.com</a>
            </div>
          </section>

        </div>
      </main>

      {/* 3. Global Footer */}
      <ContactAndFooter />
    </div>
  );
}

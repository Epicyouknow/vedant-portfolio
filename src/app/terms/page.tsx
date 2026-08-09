'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, Award, FileText, Globe, AlertTriangle } from 'lucide-react';
import CreditsFooter from '../../components/CreditsFooter';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans flex flex-col justify-between selection:bg-[#E50914] selection:text-white">
      {/* Background Red Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-red-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-red-600/5 blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 h-16 md:h-20 bg-black/90 backdrop-blur-md border-b border-neutral-900/50 z-40 px-6 md:px-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-widest transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 text-[#E50914]" />
          Back to Portfolio
        </Link>
        <span className="text-[#E50914] font-black text-lg tracking-wider font-sans select-none" style={{ fontFamily: 'var(--netflix-title-font)' }}>
          VEDANTVERSE
        </span>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 md:py-24 relative z-10 w-full">
        <div className="space-y-12">
          {/* Header Title */}
          <div className="border-b border-neutral-900 pb-8 space-y-3">
            <span className="text-[#E50914] text-[10px] font-bold uppercase tracking-[0.3em] font-mono flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              Legal Agreements
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
              Terms of Service
            </h1>
            <p className="text-neutral-500 text-xs font-mono">
              Effective Date: July 2026
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-10 text-neutral-300 text-sm font-light leading-relaxed">
            
            {/* Acceptance */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm"></span>
                1. Acceptance
              </h2>
              <p>
                By accessing and using VedantVerse (<Link href="/" className="text-[#E50914] hover:underline font-mono">https://vedantverse.in</Link>), you agree to comply with and be bound by these Terms of Service.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm"></span>
                2. Intellectual Property
              </h2>
              <p>
                Unless otherwise stated, all content on this website—including designs, case studies, graphics, branding, layouts, source code, custom animations, and written content—is the intellectual property of **Vedant Tiwari**.
              </p>
              <p className="flex items-start gap-2.5 text-xs text-red-400 font-mono bg-red-950/10 p-4 rounded border border-red-900/15">
                <Scale className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>ATTENTION:</strong> Unauthorized copying, reproduction, redistribution, or commercial use without written permission is strictly prohibited and subject to legal actions.
                </span>
              </p>
            </section>

            {/* Portfolio Content */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm"></span>
                3. Portfolio Content
              </h2>
              <p>
                Campaign metrics, case studies, achievements, and projects are presented solely for professional portfolio purposes.
              </p>
              <p className="flex items-start gap-2.5 text-xs text-neutral-400 font-normal bg-neutral-950 p-4 rounded border border-neutral-900">
                <Award className="w-4 h-4 shrink-0 mt-0.5 text-[#E50914]" />
                <span>
                  To respect client confidentiality and privacy NDAs, some project visuals, names, and internal configurations may have been simplified, simulated, or anonymized.
                </span>
              </p>
            </section>

            {/* External Links */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm"></span>
                4. External Links
              </h2>
              <p>
                This website may contain links to third-party platforms such as LinkedIn, GitHub, Google Drive, or other resources.
              </p>
              <p>
                VedantVerse is not responsible for the content, privacy policies, or practices of external websites.
              </p>
            </section>

            {/* Disclaimer */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm"></span>
                5. Disclaimer
              </h2>
              <p>
                All information is provided in good faith for informational and professional verification purposes.
              </p>
              <p className="flex items-start gap-2.5 text-xs text-amber-500/90 font-mono bg-amber-500/5 p-4 rounded border border-amber-500/10">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  No guarantees, warranties, or representations are made regarding future campaign performance, ROAS outcomes, or specific business metrics for new partnerships.
                </span>
              </p>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <CreditsFooter />
    </div>
  );
}

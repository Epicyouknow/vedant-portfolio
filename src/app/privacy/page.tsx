'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail, Lock, Info } from 'lucide-react';
import CreditsFooter from '../../components/CreditsFooter';

export default function PrivacyPolicy() {
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
              <ShieldCheck className="w-3.5 h-3.5" />
              Legal Documents
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
              Privacy Policy
            </h1>
            <p className="text-neutral-500 text-xs font-mono">
              Last Updated: July 2026
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10 text-neutral-300 text-sm font-light leading-relaxed">
            
            {/* Introduction */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm"></span>
                1. Introduction
              </h2>
              <p>
                Welcome to VedantVerse (<Link href="/" className="text-[#E50914] hover:underline font-mono">https://vedantverse.in</Link>).
              </p>
              <p>
                Your privacy is important to us. This Privacy Policy explains what information may be collected when you visit this website and how it is used.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm"></span>
                2. Information We Collect
              </h2>
              <p>
                We may collect standard website analytics, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-400 font-normal">
                <li>Browser type</li>
                <li>Device type</li>
                <li>Operating system</li>
                <li>Approximate location (country/city)</li>
                <li>Pages visited</li>
                <li>Session duration</li>
                <li>Referral source</li>
                <li>Click interactions</li>
                <li>Resume downloads</li>
                <li>Contact form submissions</li>
              </ul>
              <p className="flex items-center gap-2 text-xs font-bold text-amber-500/90 font-mono bg-amber-500/5 p-3 rounded border border-amber-500/10">
                <Info className="w-4 h-4 shrink-0" />
                Note: We do NOT collect your precise GPS location without your explicit permission.
              </p>
            </section>

            {/* Cookies */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm"></span>
                3. Cookies
              </h2>
              <p>
                VedantVerse uses cookies and analytics technologies to improve user experience and understand website performance.
              </p>
            </section>

            {/* Third-Party Services */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm"></span>
                4. Third-Party Services
              </h2>
              <p>
                This website may use:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-400 font-normal font-mono text-xs">
                <li>Google Analytics</li>
                <li>Microsoft Clarity</li>
                <li>Vercel Analytics</li>
              </ul>
              <p>
                These services may collect anonymous usage data according to their own privacy policies.
              </p>
            </section>

            {/* Data Security */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm"></span>
                5. Data Security
              </h2>
              <p>
                Reasonable technical and organizational measures are implemented to protect visitor information.
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm"></span>
                6. Contact
              </h2>
              <p>
                For any privacy-related inquiries:
              </p>
              <div className="flex items-center gap-2.5 p-4 rounded-lg bg-neutral-950 border border-neutral-900 w-fit">
                <Mail className="w-4 h-4 text-[#E50914]" />
                <a href="mailto:tiwarivedant705@gmail.com" className="text-xs text-neutral-300 hover:text-white font-mono hover:underline">
                  tiwarivedant705@gmail.com
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <CreditsFooter />
    </div>
  );
}

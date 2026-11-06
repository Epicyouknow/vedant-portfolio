'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail, Lock, Info, CheckCircle2, Globe, Cookie, Database, FileText } from 'lucide-react';
import Navbar from '../../components/Navbar';
import ContactAndFooter from '../../components/ContactAndFooter';

export default function PrivacyPolicy() {
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

        {/* Page Header Header */}
        <div className="border-b border-[var(--border-subtle)] pb-8 mb-12 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#ED463B]">
            <ShieldCheck className="w-4 h-4" />
            <span>LEGAL &amp; DATA GOVERNANCE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1]">
            Privacy Policy
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-muted)] pt-1">
            <span className="px-2.5 py-1 rounded-full bg-[var(--tag-bg)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold">
              Effective: November 2026
            </span>
            <span>•</span>
            <span>Applies to vedantverse.in</span>
          </div>
        </div>

        {/* Structured Editorial Policy Content */}
        <div className="space-y-10 text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">

          {/* Section 1: Introduction */}
          <section className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2.5 tracking-tight">
              <span className="w-1.5 h-5 bg-[#ED463B] rounded-full" />
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>VedantVerse</strong> (<Link href="/" className="text-[#ED463B] font-mono hover:underline">https://vedantverse.in</Link>), the digital portfolio and media operations platform of <strong>Vedant Tiwari</strong>.
            </p>
            <p>
              Your personal privacy and digital safety are fundamental to how this platform operates. This Privacy Policy details the exact types of information collected when you browse this website, submit campaign inquiries, or interact with published performance insights, and explains how that data is protected.
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2.5 tracking-tight">
              <span className="w-1.5 h-5 bg-[#ED463B] rounded-full" />
              2. Information We Collect
            </h2>
            <p>
              When you interact with VedantVerse, we may collect two types of information:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[var(--tag-bg)] border border-[var(--border-subtle)] space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-[var(--text-primary)] flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#ED463B]" />
                  A. Analytics &amp; Telemetry
                </div>
                <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc pl-4 font-normal">
                  <li>Browser type &amp; operating system</li>
                  <li>Device category (Mobile, Desktop, Tablet)</li>
                  <li>Approximate location (Country &amp; City level only)</li>
                  <li>Page views, dwell time, and navigation sequences</li>
                  <li>Referral sources and campaign UTM parameters</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[var(--tag-bg)] border border-[var(--border-subtle)] space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-[var(--text-primary)] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#ED463B]" />
                  B. Information You Provide
                </div>
                <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc pl-4 font-normal">
                  <li>Full name and organization</li>
                  <li>Email address &amp; phone/WhatsApp number</li>
                  <li>Advertising budget brackets and campaign objectives</li>
                  <li>Direct messages submitted through contact forms</li>
                </ul>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5 font-medium">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Location Tracking:</strong> We never request, collect, or store your precise real-time GPS coordinates.
              </span>
            </div>
          </section>

          {/* Section 3: Cookies & Local Storage */}
          <section className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2.5 tracking-tight">
              <span className="w-1.5 h-5 bg-[#ED463B] rounded-full" />
              3. Cookies &amp; Local Storage
            </h2>
            <p>
              VedantVerse utilizes standard first-party cookies and browser local storage strictly to ensure optimal platform functionality:
            </p>
            <ul className="space-y-2.5 text-xs md:text-sm pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Theme Preference:</strong> Stores your chosen appearance mode (Light vs. Dark theme) locally on your device.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Session Management:</strong> Facilitates secure administrative verification for authorized CMS operations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Analytics Deduplication:</strong> Prevents inflated visit counts across page transitions without personal identification.</span>
              </li>
            </ul>
          </section>

          {/* Section 4: Third-Party Telemetry & Infrastructure */}
          <section className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2.5 tracking-tight">
              <span className="w-1.5 h-5 bg-[#ED463B] rounded-full" />
              4. Third-Party Services
            </h2>
            <p>
              To maintain reliable delivery, high uptime, and accurate traffic analytics, this site integrates with trusted infrastructure partners:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--tag-bg)]">
                <div className="font-bold text-[var(--text-primary)] mb-1">Google Analytics 4</div>
                <div className="text-[11px] text-[var(--text-muted)] font-mono">ID: G-50KTBS74YJ</div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-1">Aggregated site telemetry and traffic source measurement.</div>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--tag-bg)]">
                <div className="font-bold text-[var(--text-primary)] mb-1">Microsoft Clarity</div>
                <div className="text-[11px] text-[var(--text-muted)] font-mono">Heatmaps &amp; UX</div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-1">Anonymous scroll depth and UX friction analysis.</div>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--tag-bg)]">
                <div className="font-bold text-[var(--text-primary)] mb-1">Vercel Edge Network</div>
                <div className="text-[11px] text-[var(--text-muted)] font-mono">Global CDN</div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-1">High-speed serverless hosting and SSL encryption.</div>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] pt-1">
              These service providers process anonymized data in compliance with international privacy standards, including GDPR and CCPA guidelines.
            </p>
          </section>

          {/* Section 5: Data Security & Anti-Spam Commitment */}
          <section className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2.5 tracking-tight">
              <span className="w-1.5 h-5 bg-[#ED463B] rounded-full" />
              5. Data Security &amp; Anti-Spam Commitment
            </h2>
            <div className="space-y-3">
              <p>
                <strong>We will never sell, rent, or trade your personal information</strong> with third-party data brokers or marketing lists under any circumstances.
              </p>
              <p>
                Inquiry form submissions are transmitted over TLS/SSL encrypted channels directly to our verified administrative email address (<code className="text-[#ED463B] font-mono text-xs">contactvedantverse@gmail.com</code>) and are utilized solely to respond to your specific project brief.
              </p>
            </div>
          </section>

          {/* Section 6: Inquiries & Contact */}
          <section className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2.5 tracking-tight">
              <span className="w-1.5 h-5 bg-[#ED463B] rounded-full" />
              6. Contact &amp; Data Rights
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy, or if you wish to request the deletion or correction of any submitted details, please reach out directly:
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--tag-bg)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#191919] text-white dark:bg-white dark:text-[#191919] grid place-items-center shrink-0">
                  <Mail className="w-5 h-5 text-[#ED463B]" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-[var(--text-muted)] font-semibold">
                    Direct Privacy Contact
                  </div>
                  <a
                    href="mailto:contactvedantverse@gmail.com"
                    className="text-sm font-bold text-[var(--text-primary)] hover:text-[#ED463B] font-mono transition-colors"
                  >
                    contactvedantverse@gmail.com
                  </a>
                </div>
              </div>

              <a
                href="mailto:contactvedantverse@gmail.com?subject=Privacy%20Inquiry%20-%20VedantVerse"
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#191919] text-white dark:bg-white dark:text-[#191919] hover:bg-[#ED463B] dark:hover:bg-[#ED463B] dark:hover:text-white transition-colors text-center shrink-0"
              >
                Send Email Notice
              </a>
            </div>
          </section>

        </div>
      </main>

      {/* 3. Global Footer */}
      <ContactAndFooter />
    </div>
  );
}

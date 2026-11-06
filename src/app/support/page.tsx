'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Mail, Phone, Clock, HelpCircle, Send } from 'lucide-react';
import Navbar from '../../components/Navbar';
import ContactAndFooter from '../../components/ContactAndFooter';

export default function ContactSupport() {
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
            <MessageSquare className="w-4 h-4" />
            <span>CLIENT DESK &amp; ASSISTANCE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1]">
            Contact Support
          </h1>

          <p className="text-sm md:text-base text-[var(--text-secondary)] font-light max-w-xl">
            Need campaign assistance, portfolio clarifications, or want to discuss a dedicated performance sprint?
          </p>
        </div>

        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Email Support Card */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#191919] text-white dark:bg-white dark:text-[#191919] grid place-items-center">
              <Mail className="w-5 h-5 text-[#ED463B]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Direct Email</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                For detailed RFPs, media planning decks, or contract inquiries.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--tag-bg)] border border-[var(--border-subtle)]">
              <a
                href="mailto:contactvedantverse@gmail.com"
                className="text-xs font-mono font-bold text-[var(--text-primary)] hover:text-[#ED463B] transition-colors"
              >
                contactvedantverse@gmail.com
              </a>
            </div>
          </div>

          {/* Response Turnaround Card */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#191919] text-white dark:bg-white dark:text-[#191919] grid place-items-center">
              <Clock className="w-5 h-5 text-[#ED463B]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Response Time</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                All client inquiries are answered within 24 business hours.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--tag-bg)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)]">
              Monday – Friday • 10:00 AM – 7:00 PM IST
            </div>
          </div>
        </div>

        {/* Quick Contact Form Link */}
        <div className="mt-8 p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">Have a new campaign inquiry?</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Submit your budget and objectives via our interactive intake form.</p>
          </div>
          <Link
            href="/#contact-section"
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#191919] text-white dark:bg-white dark:text-[#191919] hover:bg-[#ED463B] dark:hover:bg-[#ED463B] dark:hover:text-white transition-colors text-center shrink-0"
          >
            Open Inquiry Form
          </Link>
        </div>
      </main>

      {/* 3. Global Footer */}
      <ContactAndFooter />
    </div>
  );
}

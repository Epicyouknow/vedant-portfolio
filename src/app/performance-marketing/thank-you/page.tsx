'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  Home, 
  FileText 
} from 'lucide-react';
import LandingNavbar from '@/components/performance-marketing/LandingNavbar';
import LandingFooter from '@/components/performance-marketing/LandingFooter';
import { useAnalytics } from '@/hooks/useAnalytics';
import { trackThankYouView } from '@/lib/tracking';

interface LeadData {
  name: string;
  email: string;
  business: string;
  service: string;
  budget: string;
  id: string;
  timestamp: string;
}

export default function ThankYouPage() {
  const [lead, setLead] = useState<LeadData | null>(null);
  const { trackPageView } = useAnalytics();
  const hasTrackedThankYou = useRef(false);

  useEffect(() => {
    trackPageView('/performance-marketing/thank-you');
    if (!hasTrackedThankYou.current) {
      hasTrackedThankYou.current = true;
      trackThankYouView();
    }

    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('vv_last_lead');
      if (stored) {
        try {
          setLead(JSON.parse(stored));
        } catch (e) {
          // ignore
        }
      }
    }
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col justify-between">
      <LandingNavbar />

      <main className="flex-1 w-full pt-36 pb-24 px-6 md:px-12 flex items-center justify-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none opacity-25 dark:opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(237, 70, 59, 0.25) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-2xl w-full mx-auto relative z-10 text-center">
          
          {/* Success Check Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto mb-6 shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold tracking-widest uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TRANSMISSION CONFIRMED</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] font-outfit mb-4">
            Your Enquiry Has Been Received.
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-[var(--text-secondary)] font-normal max-w-xl mx-auto mb-10 leading-relaxed">
            Thank you for reaching out. I&apos;ll review your requirements and get back to you.
          </p>

          {/* Confirmation Receipt Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-left shadow-xl mb-10">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)] block">
                  Reference Identifier
                </span>
                <span className="text-sm font-mono font-bold text-[var(--text-primary)]">
                  {lead?.id || `inq_${Date.now().toString().slice(-8)}`}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Review
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono mb-6">
              <div>
                <span className="text-[var(--text-secondary)] block text-[10px] uppercase">Client Name</span>
                <span className="font-bold text-[var(--text-primary)] text-sm">{lead?.name || 'Valued Partner'}</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block text-[10px] uppercase">Business / Brand</span>
                <span className="font-bold text-[var(--text-primary)] text-sm">{lead?.business || 'Confidential Business'}</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block text-[10px] uppercase">Service Requested</span>
                <span className="font-semibold text-[#ED463B]">{lead?.service || 'Performance Marketing Strategy'}</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)] block text-[10px] uppercase">Budget Scope</span>
                <span className="font-bold text-[var(--text-primary)]">{lead?.budget || '₹50,000–₹1 Lakh'}</span>
              </div>
            </div>

            {/* Next Steps Box */}
            <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] font-outfit uppercase tracking-wider">
                <Clock className="w-4 h-4 text-[#ED463B]" />
                <span>Next Steps & Response Timeline</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                I personally audit your category economics, competitor ad footprint, and tracking setup before our consultation. Expect a direct email or WhatsApp message within <strong>24 business hours</strong>.
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#191919] hover:bg-neutral-800 text-white dark:bg-[#F7F5F0] dark:text-[#191919] dark:hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Portfolio</span>
            </Link>

            <Link
              href="/blog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Explore Growth Insights</span>
            </Link>
          </div>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}


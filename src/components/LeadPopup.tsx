'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import {
  checkPopupEligibility,
  recordPopupDismissal,
  recordPopupSubmission,
} from '../lib/popupState';

const GROWTH_OBJECTIVES = [
  'Lead Generation',
  'E-commerce Sales',
  'App Installs',
  'Brand Awareness',
  'Performance Marketing Audit',
  'Scaling Existing Campaigns',
];

const BUDGET_OPTIONS = [
  'Below ₹25,000',
  '₹25,000–₹50,000',
  '₹50,000–₹1 Lakh',
  '₹1–2 Lakh',
  '₹2–5 Lakh',
  '₹5 Lakh+',
];

export default function LeadPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form inputs
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [website, setWebsite] = useState('');
  const [objective, setObjective] = useState(GROWTH_OBJECTIVES[0]);
  const [budget, setBudget] = useState(BUDGET_OPTIONS[2]);
  const hasTrackedStart = useRef(false);

  // Check eligibility and timer scheduler
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const checkAndSchedule = () => {
      const eligibility = checkPopupEligibility(pathname);
      if (eligibility.eligible) {
        setStage(eligibility.stage);
        setIsOpen(true);
        // Track impression
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: 'popup_impression',
            popup_stage: eligibility.stage,
            page_path: pathname,
            timestamp: Date.now(),
          });
        }
      } else if (eligibility.msRemaining > 0) {
        // Schedule next wakeup
        timer = setTimeout(() => {
          checkAndSchedule();
        }, Math.min(eligibility.msRemaining, 60000)); // check at least every 60s
      }
    };

    checkAndSchedule();

    // Check periodically in case timestamp passed while tab was idle
    const interval = setInterval(checkAndSchedule, 4000);

    return () => {
      if (timer) clearTimeout(timer);
      clearInterval(interval);
    };
  }, [pathname]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  // Handle ESC key dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, stage]);

  const handleDismiss = () => {
    setIsOpen(false);
    recordPopupDismissal(stage);

    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'popup_dismissed',
        popup_stage: stage,
        page_path: pathname,
        timestamp: Date.now(),
      });
    }
  };

  const handleInputFocus = () => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'popup_form_started',
          popup_stage: stage,
          page_path: pathname,
          timestamp: Date.now(),
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: contact.trim(),
          phone: contact.trim(),
          budget,
          website: website.trim(),
          growthObjective: objective,
          message: `[Lead Popup - Stage 0${stage}] Objective: ${objective} | Website: ${website || 'N/A'} | Budget: ${budget}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setSubmitted(true);
      recordPopupSubmission();

      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'popup_form_submitted',
          popup_stage: stage,
          growth_objective: objective,
          budget_range: budget,
          page_path: pathname,
          timestamp: Date.now(),
        });
      }

      // Auto dismiss after 3.5 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please check your connection.');
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'popup_form_error',
          popup_stage: stage,
          error_message: err.message,
          timestamp: Date.now(),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Content configuration by stage
  const stageContent = {
    1: {
      tag: 'STRATEGY CALL',
      heading: "Want to connect? Let's talk strategy.",
      description: "Looking to scale your business with smarter performance marketing? Let's schedule a 1-on-1 strategy call.",
      cta: "SCHEDULE STRATEGY CALL →",
    },
    2: {
      tag: 'GROWTH CONSULTATION',
      heading: 'Have a growth goal in mind?',
      description: "Tell me what you're building. Let's explore how disciplined performance marketing can help.",
      cta: 'SCHEDULE STRATEGY CALL →',
    },
    3: {
      tag: 'PRIVATE CONSULTATION',
      heading: 'Your next growth move starts here.',
      description: "Ready to make your media spend work harder? Let's connect and review your current bottlenecks.",
      cta: "LET'S CONNECT →",
    },
  }[stage as 1 | 2 | 3] || {
    tag: 'STRATEGY CALL',
    heading: "Want to connect? Let's talk strategy.",
    description: "Looking to scale your business with smarter performance marketing? Let's talk strategy.",
    cta: "SCHEDULE STRATEGY CALL →",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-popup-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleDismiss}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FFFDF9] dark:bg-[#181716] text-[#191918] dark:text-[#FFFDF9] border border-[#E5E0D8] dark:border-neutral-800 shadow-2xl p-6 sm:p-8 z-10 font-sans"
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              aria-label="Close consultation modal"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-200/50 dark:bg-neutral-800/80 hover:bg-neutral-300 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              /* Success State */
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Inquiry Received</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-[var(--text-primary)]">{name}</strong>. I will review your goals and reach out directly via WhatsApp / Email within 24 hours.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Closing window...
                  </span>
                </div>
              </div>
            ) : (
              /* Form State */
              <>
                {/* Header Section */}
                <div className="mb-6 pr-6">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/20 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] animate-pulse" />
                    <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-[var(--accent-red)]">
                      {stageContent.tag}
                    </span>
                  </div>

                  <h3
                    id="lead-popup-title"
                    className="text-2xl sm:text-3xl font-black text-[#191918] dark:text-white tracking-tight leading-tight"
                  >
                    {stageContent.heading}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                    {stageContent.description}
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                        YOUR NAME <span className="text-[var(--accent-red)]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={handleInputFocus}
                        placeholder="Vedant Tiwari"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1D1C] border border-[#DDD7CD] dark:border-neutral-800 text-xs text-[#191918] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[var(--accent-red)] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                        EMAIL / WHATSAPP <span className="text-[var(--accent-red)]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        onFocus={handleInputFocus}
                        placeholder="+91 98765 43210 or email"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1D1C] border border-[#DDD7CD] dark:border-neutral-800 text-xs text-[#191918] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[var(--accent-red)] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                      YOUR BUSINESS WEBSITE <span className="text-neutral-400 font-normal">(OPTIONAL)</span>
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      onFocus={handleInputFocus}
                      placeholder="https://yourbrand.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1D1C] border border-[#DDD7CD] dark:border-neutral-800 text-xs text-[#191918] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[var(--accent-red)] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                        WHAT ARE YOU LOOKING FOR?
                      </label>
                      <select
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1D1C] border border-[#DDD7CD] dark:border-neutral-800 text-xs text-[#191918] dark:text-white focus:outline-none focus:border-[var(--accent-red)] transition-colors"
                      >
                        {GROWTH_OBJECTIVES.map((obj) => (
                          <option key={obj} value={obj}>
                            {obj}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                        MONTHLY AD BUDGET
                      </label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1D1C] border border-[#DDD7CD] dark:border-neutral-800 text-xs text-[#191918] dark:text-white focus:outline-none focus:border-[var(--accent-red)] transition-colors"
                      >
                        {BUDGET_OPTIONS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-full bg-[var(--accent-red)] hover:opacity-90 active:scale-[0.99] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent-red)]/25 disabled:opacity-60 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>SENDING INQUIRY...</span>
                        </>
                      ) : (
                        <>
                          <span>{stageContent.cta}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Privacy reassurance */}
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Your information stays confidential. No spam.</span>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


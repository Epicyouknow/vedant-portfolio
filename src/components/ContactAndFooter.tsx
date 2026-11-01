'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Send, CheckCircle2, AlertCircle, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import { SlideScene, TextMaskReveal, FadeUpStagger, FadeUpItem, EASING } from './motion/MotionSystem';

export default function ContactAndFooter() {
  const { trackEvent } = useAnalytics();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const budgets = [
    { label: '< ₹1L', value: '< ₹1L' },
    { label: '₹1L - ₹5L', value: '₹1L - ₹5L' },
    { label: '₹5L - ₹15L', value: '₹5L - ₹15L' },
    { label: '₹15L+', value: '₹15L+' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectBudget = (val: string) => {
    setFormData((prev) => ({ ...prev, budget: val }));
    trackEvent('form_budget_select', { budget: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in your name, email, and message.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    trackEvent('form_submit_start');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        trackEvent('form_submit_success', { budget: formData.budget });
        setFormData({ name: '', email: '', phone: '', budget: '', message: '' });
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        trackEvent('form_submit_failed', { error: data.error });
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again or email directly.');
      setStatus('error');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact-section" className="bg-[#171716] text-[#F7F5F0] relative overflow-hidden">
      
      {/* Contact CTA Section */}
      <SlideScene className="py-28 md:py-36 px-6 md:px-12 max-w-5xl mx-auto text-center border-b border-[#2E2D2B]">
        
        {/* Eyebrow */}
        <div className="mb-6">
          <span className="text-[11px] md:text-xs font-semibold tracking-[0.25em] uppercase text-[#A9A69F]">
            — START A CONVERSATION
          </span>
        </div>

        {/* Big Central Headline with TextMaskReveal */}
        <div className="mb-6">
          <TextMaskReveal delay={0.1}>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#F7F5F0] leading-[1.1]">
              Ready to turn your brand
            </span>
          </TextMaskReveal>
          <TextMaskReveal delay={0.25}>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--accent-red)] leading-[1.1]">
              into a growth story?
            </span>
          </TextMaskReveal>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#A9A69F] max-w-xl mx-auto mb-10 leading-relaxed font-light">
          Bring the ambition. I&apos;ll bring a clear plan, considered creative, and the discipline to keep learning.
        </p>

        {/* Main CTA Trigger */}
        <FadeUpStagger delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <FadeUpItem>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold tracking-wide bg-[#F7F5F0] text-[#171716] hover:bg-[#EAE6DC] transition-all duration-200 cursor-pointer shadow-lg group"
            >
              <span>{showForm ? 'Hide Form' : "Let's Talk"}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </FadeUpItem>

          <FadeUpItem>
            <a
              href="mailto:contactvedantverse@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-sm font-medium tracking-wide bg-transparent text-[#F7F5F0] border border-[#383734] hover:border-white transition-all duration-200 cursor-pointer"
            >
              <span>Direct Email</span>
              <span className="hidden sm:inline text-xs text-[#A9A69F]">contactvedantverse@gmail.com</span>
            </a>
          </FadeUpItem>
        </FadeUpStagger>

        {/* Expandable / In-line Contact Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: EASING.smooth }}
              className="mt-12 max-w-xl mx-auto text-left bg-[#1F1E1D] border border-[#2E2D2B] rounded-2xl p-8 sm:p-10 shadow-2xl overflow-hidden"
            >
              <h3 className="text-xl font-bold text-white mb-2">Let&apos;s Build Your Growth Pipeline</h3>
              <p className="text-xs text-[#A9A69F] mb-6">Fill in details below and I will respond within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-[#A9A69F] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Vedant Tiwari"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#141413] border border-[#2E2D2B] text-sm text-white placeholder-[#5A5854] focus:outline-none focus:border-[var(--accent-red)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-[#A9A69F] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@brand.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#141413] border border-[#2E2D2B] text-sm text-white placeholder-[#5A5854] focus:outline-none focus:border-[var(--accent-red)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-[#A9A69F] mb-1.5">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-[#141413] border border-[#2E2D2B] text-sm text-white placeholder-[#5A5854] focus:outline-none focus:border-[var(--accent-red)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-[#A9A69F] mb-1.5">
                    Monthly Ad Spend Budget
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {budgets.map((b) => (
                      <button
                        key={b.value}
                        type="button"
                        onClick={() => handleSelectBudget(b.value)}
                        className={`py-2 px-3 rounded-lg text-xs font-mono transition-colors border ${
                          formData.budget === b.value
                            ? 'bg-[var(--accent-red)] text-white border-[var(--accent-red)]'
                            : 'bg-[#141413] text-[#A9A69F] border-[#2E2D2B] hover:border-neutral-600'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-[#A9A69F] mb-1.5">
                    Campaign Goals &amp; Context *
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your product, current ROAS / CPL challenges, and targets..."
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#141413] border border-[#2E2D2B] text-sm text-white placeholder-[#5A5854] focus:outline-none focus:border-[var(--accent-red)]"
                  />
                </div>

                {status === 'error' && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[var(--accent-red)] shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {status === 'success' && (
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Message sent successfully! I will be in touch shortly.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--accent-red)] text-white hover:bg-[var(--accent-red-hover)] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {status === 'loading' ? (
                    <span>Sending inquiry...</span>
                  ) : (
                    <>
                      <span>Submit Growth Inquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </SlideScene>

      {/* Clean Dark Footer Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-full bg-white text-[#171716] flex items-center justify-center font-bold text-xs">
                V
              </div>
              <span className="font-semibold text-base tracking-tight text-white">
                VedantVerse
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A9A69F] max-w-sm leading-relaxed mb-6 font-light">
              Independent performance marketing for teams ready to grow with clarity. Designing full-funnel media architectures across Meta, Google Ads, and analytics.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <div className="text-[10px] font-mono tracking-widest uppercase text-[#726F69] mb-4">
              Explore
            </div>
            <ul className="space-y-2.5 text-xs text-[#A9A69F]">
              <li>
                <a href="#featured-work" className="hover:text-white transition-colors">
                  Work
                </a>
              </li>
              <li>
                <a href="#growth-process" className="hover:text-white transition-colors">
                  Process
                </a>
              </li>
              <li>
                <a href="#performance-reporting" className="hover:text-white transition-colors">
                  Reporting
                </a>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Insights &amp; Field Notes
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Links */}
          <div className="md:col-span-4">
            <div className="text-[10px] font-mono tracking-widest uppercase text-[#726F69] mb-4">
              Connect
            </div>
            <ul className="space-y-2.5 text-xs text-[#A9A69F]">
              <li>
                <a
                  href="mailto:contactvedantverse@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  Email: contactvedantverse@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/vedant-tiwarii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn: /in/vedant-tiwarii
                </a>
              </li>
              <li>
                <a
                  href="/Vedant_Tiwari_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Resume: Download PDF
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/epicyouknow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-12 mt-12 border-t border-[#2E2D2B] flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-[#726F69]">
          <div>
            © 2026 VedantVerse.
          </div>

          <div className="hidden sm:inline">
            ALL RIGHTS RESERVED
          </div>

          <div>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </footer>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';

export default function ContactForm() {
  const { trackEvent } = useAnalytics();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const budgets = [
    { label: 'Less than ₹1L', value: '< ₹1L' },
    { label: '₹1L - ₹5L', value: '₹1L - ₹5L' },
    { label: '₹5L - ₹15L', value: '₹5L - ₹15L' },
    { label: '₹15L+', value: '₹15L+' }
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
      setErrorMessage('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    trackEvent('form_submit_start');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        trackEvent('form_submit_success', { budget: formData.budget });
        setFormData({ name: '', email: '', budget: '', message: '' });
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        trackEvent('form_submit_failed', { error: data.error });
      }
    } catch (err) {
      setErrorMessage('Network error. Please check your connection and try again.');
      setStatus('error');
      trackEvent('form_submit_failed', { error: 'Network error' });
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#050505] border-t border-neutral-900 px-6 md:px-16 relative overflow-hidden select-none">
      {/* Background Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-red-600/5 blur-[120px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#E50914] font-mono flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#E50914]" />
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase font-sans">
            START A <span className="text-[#E50914] glow-text-red">CAMPAIGN</span> SESSION
          </h2>
          <p className="text-neutral-400 text-xs md:text-sm max-w-lg mx-auto font-light leading-relaxed">
            Ready to scale your ROAS, optimize your tracking tags, or launch a media campaign? Leave a message below.
          </p>
        </div>

        <div className="bg-neutral-950/80 border border-neutral-900 rounded-2xl p-6 md:p-10 backdrop-blur-md shadow-2xl relative">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-12 space-y-6"
              >
                <div className="inline-flex p-4 rounded-full bg-green-500/10 text-green-500 mb-2 border border-green-500/20">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-wider">
                  Transmission Received!
                </h3>
                <p className="text-neutral-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. I have received your request and will review your campaign details. Expect a response shortly!
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2.5 border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-[#E50914] rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6 md:space-y-8"
              >
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">
                      Your Name <span className="text-[#E50914]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={status === 'loading'}
                      placeholder="e.g. John Doe"
                      className="w-full bg-neutral-900/60 border border-neutral-800/80 rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/25 transition-all duration-300"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">
                      Your Email <span className="text-[#E50914]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={status === 'loading'}
                      placeholder="e.g. john@company.com"
                      className="w-full bg-neutral-900/60 border border-neutral-800/80 rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/25 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Budget Selection */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">
                    Estimated Monthly Ad Budget
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {budgets.map((b) => (
                      <button
                        type="button"
                        key={b.value}
                        onClick={() => handleSelectBudget(b.value)}
                        disabled={status === 'loading'}
                        className={`py-3 rounded-lg border text-center text-xs font-bold uppercase transition-all duration-300 cursor-pointer active:scale-95 ${
                          formData.budget === b.value
                            ? 'bg-[#E50914] border-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]'
                            : 'bg-neutral-900/50 border-neutral-800/80 text-neutral-400 hover:border-neutral-700 hover:text-white'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">
                    Campaign Goals / Message <span className="text-[#E50914]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    placeholder="Describe your project, timeline, target ROAS, or technical tracking needs..."
                    className="w-full bg-neutral-900/60 border border-neutral-800/80 rounded-lg px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/25 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 flex justify-center">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="group relative flex items-center justify-center gap-2 px-8 py-3 bg-[#E50914] hover:bg-[#ff1e27] text-white font-black uppercase tracking-widest text-xs rounded-lg transition-all duration-300 shadow-xl cursor-pointer hover:shadow-[0_0_20px_rgba(229,9,20,0.5)] active:scale-95 hover:scale-102 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        Transmit Request
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

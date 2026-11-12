'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  ArrowRight, 
  Lock, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export default function EnquiryModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Form State - ALL FIELDS MANDATORY
  const [fullName, setFullName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [serviceHelp, setServiceHelp] = useState('Meta + Google Ads');
  const [advertisingBudget, setAdvertisingBudget] = useState('₹50,000–₹1 Lakh');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Spam protection honeypot
  const [companyFax, setCompanyFax] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // UTM parameters
  const [utmParams, setUtmParams] = useState({
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
  });

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setErrorMessage('');
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    window.addEventListener('open-enquiry-modal', handleOpen);
    window.addEventListener('close-enquiry-modal', handleClose);

    // Read UTM params
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setUtmParams({
        utmSource: params.get('utm_source') || '',
        utmMedium: params.get('utm_medium') || '',
        utmCampaign: params.get('utm_campaign') || '',
      });
    }

    return () => {
      window.removeEventListener('open-enquiry-modal', handleOpen);
      window.removeEventListener('close-enquiry-modal', handleClose);
    };
  }, []);

  // Escape key listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Spam honeypot
    if (companyFax) {
      console.warn('Bot submission blocked.');
      return;
    }

    // STRICT VALIDATION - ALL FIELDS MANDATORY
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail.trim())) {
      setErrorMessage('Please enter a valid business email address.');
      return;
    }

    const cleanPhoneDigits = phoneNumber.replace(/\D/g, '');
    if (cleanPhoneDigits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone or WhatsApp number.');
      return;
    }

    if (!businessName.trim()) {
      setErrorMessage('Please enter your business or company name.');
      return;
    }

    if (!websiteUrl.trim()) {
      setErrorMessage('Please provide your website or Instagram handle.');
      return;
    }

    if (!serviceHelp.trim()) {
      setErrorMessage('Please select what you need help with.');
      return;
    }

    if (!advertisingBudget.trim()) {
      setErrorMessage('Please select your monthly advertising budget.');
      return;
    }

    if (!additionalNotes.trim()) {
      setErrorMessage('Please share a few words about your business goals or current advertising bottlenecks.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: fullName.trim(),
        email: businessEmail.trim().toLowerCase(),
        phone: phoneNumber.trim(),
        businessName: businessName.trim(),
        website: websiteUrl.trim(),
        serviceHelp,
        budget: advertisingBudget,
        message: additionalNotes.trim(),
        utmSource: utmParams.utmSource,
        utmMedium: utmParams.utmMedium,
        utmCampaign: utmParams.utmCampaign,
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit enquiry. Please try again.');
      }

      const eventId = data.eventId || `lead_${Date.now()}`;

      // 1. Trigger Meta Pixel Lead event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        try {
          (window as any).fbq('track', 'Lead', {
            content_name: serviceHelp,
            content_category: 'Performance Marketing',
            value: advertisingBudget,
            currency: 'INR',
          }, { eventID: eventId });
        } catch (fbErr) {
          console.warn('Meta Pixel dispatch error:', fbErr);
        }
      }

      // 2. Trigger GA4 generate_lead conversion event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        try {
          (window as any).gtag('event', 'generate_lead', {
            currency: 'INR',
            service_help: serviceHelp,
            budget: advertisingBudget,
            event_id: eventId,
          });
        } catch (gaErr) {
          console.warn('GA4 dispatch error:', gaErr);
        }
      }

      // Store in sessionStorage for Thank You page personalization
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('vv_last_lead', JSON.stringify({
          name: fullName,
          email: businessEmail,
          business: businessName,
          service: serviceHelp,
          budget: advertisingBudget,
          id: data.id || eventId,
          timestamp: new Date().toISOString(),
        }));
      }

      setIsOpen(false);
      router.push('/performance-marketing/thank-you');
    } catch (err: any) {
      console.error('Modal submission error:', err);
      setErrorMessage(err.message || 'Something went wrong. Please check your connection.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md transition-opacity duration-300">
      
      {/* Backdrop click area */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => setIsOpen(false)} 
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-2xl p-6 sm:p-10 text-[var(--text-primary)] my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#ED463B] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-left mb-6 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] text-[#ED463B] text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
            <Sparkles className="w-3 h-3 text-[#ED463B]" />
            <span>DIRECT STRATEGY INQUIRY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] font-outfit">
            Let&apos;s Understand Your Business.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 font-normal">
            Share your requirements below. All fields are mandatory to ensure a productive first discussion.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Honeypot hidden input */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="company_fax_field"
              value={companyFax}
              onChange={(e) => setCompanyFax(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Row 1: Full Name & Business Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1.5">
                1. Full Name <span className="text-[#ED463B]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors placeholder:text-[var(--text-secondary)]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1.5">
                2. Business Email <span className="text-[#ED463B]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors placeholder:text-[var(--text-secondary)]/50"
              />
            </div>
          </div>

          {/* Row 2: Phone Number & Business Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1.5">
                3. Phone Number <span className="text-[#ED463B]">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors placeholder:text-[var(--text-secondary)]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1.5">
                4. Business Name <span className="text-[#ED463B]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Logistics or Nova D2C"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors placeholder:text-[var(--text-secondary)]/50"
              />
            </div>
          </div>

          {/* Row 3: Website or Instagram URL (MANDATORY) */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1.5">
              5. Website or Instagram URL <span className="text-[#ED463B]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="https://yourbrand.com or @yourhandle"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors placeholder:text-[var(--text-secondary)]/50"
            />
          </div>

          {/* Dropdown 1: What do you need help with? */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1.5">
              What do you need help with? <span className="text-[#ED463B]">*</span>
            </label>
            <select
              required
              value={serviceHelp}
              onChange={(e) => setServiceHelp(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors cursor-pointer"
            >
              <option value="Meta Ads Management">Meta Ads Management</option>
              <option value="Google Ads Management">Google Ads Management</option>
              <option value="Meta + Google Ads">Meta + Google Ads</option>
              <option value="Performance Marketing Strategy">Performance Marketing Strategy</option>
              <option value="E-commerce Growth">E-commerce Growth</option>
              <option value="Tracking & Analytics">Tracking & Analytics</option>
              <option value="Campaign Audit & Optimisation">Campaign Audit & Optimisation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Dropdown 2: What's your monthly advertising budget? */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1.5">
              What&apos;s your monthly advertising budget? <span className="text-[#ED463B]">*</span>
            </label>
            <select
              required
              value={advertisingBudget}
              onChange={(e) => setAdvertisingBudget(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors cursor-pointer font-medium"
            >
              <option value="Below ₹10,000">Below ₹10,000</option>
              <option value="₹10,000–₹25,000">₹10,000–₹25,000</option>
              <option value="₹25,000–₹50,000">₹25,000–₹50,000</option>
              <option value="₹50,000–₹1 Lakh">₹50,000–₹1 Lakh</option>
              <option value="₹1 Lakh+">₹1 Lakh+</option>
              <option value="Planning to start advertising">Planning to start advertising</option>
            </select>
          </div>

          {/* Textarea: MANDATORY */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1.5">
              Anything else I should know about your business? <span className="text-[#ED463B]">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Tell me about your business goals, target audience, past advertising challenges, or current growth bottlenecks..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors placeholder:text-[var(--text-secondary)]/50 resize-y"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-[#ED463B] hover:bg-[#d9382d] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#ED463B]/25 hover:shadow-2xl hover:shadow-[#ED463B]/35 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting Business Enquiry...</span>
                </>
              ) : (
                <>
                  <span>Submit Business Enquiry</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>

          {/* Privacy Note */}
          <div className="pt-1 text-center">
            <p className="text-[11px] text-[var(--text-secondary)] flex items-center justify-center gap-1.5 font-normal">
              <Lock className="w-3 h-3 text-[#ED463B]" />
              <span>Your information will only be used to respond to your enquiry.</span>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}


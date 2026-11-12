'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ShieldCheck 
} from 'lucide-react';

export default function LeadEnquiryForm() {
  const router = useRouter();

  // Form State
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

  // UTM Parameters
  const [utmParams, setUtmParams] = useState({
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setUtmParams({
        utmSource: params.get('utm_source') || '',
        utmMedium: params.get('utm_medium') || '',
        utmCampaign: params.get('utm_campaign') || '',
        utmTerm: params.get('utm_term') || '',
        utmContent: params.get('utm_content') || '',
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Spam honeypot check
    if (companyFax) {
      console.warn('Bot submission prevented.');
      return;
    }

    // Client-side validations
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
      setErrorMessage('Please provide a valid 10-digit phone or WhatsApp number.');
      return;
    }

    if (!businessName.trim()) {
      setErrorMessage('Please enter your business or company name.');
      return;
    }

    if (!websiteUrl.trim()) {
      setErrorMessage('Please enter your Website or Instagram URL.');
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
      setErrorMessage('Please share any context regarding your business or immediate objectives.');
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

      // 1. Trigger Meta Pixel Lead Event (Once, with Event ID deduplication)
      if (typeof window !== 'undefined' && (window as any).fbq) {
        try {
          (window as any).fbq('track', 'Lead', {
            content_name: serviceHelp,
            content_category: 'Performance Marketing',
            value: advertisingBudget,
            currency: 'INR',
          }, { eventID: eventId });
        } catch (fbErr) {
          console.warn('Meta Pixel Lead dispatch warning:', fbErr);
        }
      }

      // 2. Trigger Google Analytics 4 generate_lead conversion event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        try {
          (window as any).gtag('event', 'generate_lead', {
            currency: 'INR',
            service_help: serviceHelp,
            budget: advertisingBudget,
            event_id: eventId,
          });
        } catch (gaErr) {
          console.warn('GA4 generate_lead warning:', gaErr);
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

      // Redirect to dedicated Thank-You page
      router.push('/performance-marketing/thank-you');
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Something went wrong. Please check your connection.');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-base)] relative">
      {/* Background radial gradient */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[550px] pointer-events-none opacity-20 dark:opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(237, 70, 59, 0.25) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] font-outfit mb-3">
            Let&apos;s Understand Your Business.
          </h2>
          <p className="text-sm md:text-base text-[var(--text-secondary)] font-normal">
            Share your requirements. Let&apos;s explore the right advertising approach.
          </p>
        </div>

        {/* Premium Dark Glass Form Container */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-2xl relative">
          
          {errorMessage && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                  1. Full Name <span className="text-[#ED463B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors placeholder:text-[var(--text-secondary)]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                  2. Business Email <span className="text-[#ED463B]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors placeholder:text-[var(--text-secondary)]/50"
                />
              </div>
            </div>

            {/* Row 2: Phone Number & Business Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                  3. Phone Number <span className="text-[#ED463B]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors placeholder:text-[var(--text-secondary)]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                  4. Business Name <span className="text-[#ED463B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Logistics or Nova D2C"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors placeholder:text-[var(--text-secondary)]/50"
                />
              </div>
            </div>

            {/* Row 3: Website or Instagram URL (Mandatory) */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                5. Website or Instagram URL <span className="text-[#ED463B]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://yourbrand.com or @yourhandle"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors placeholder:text-[var(--text-secondary)]/50"
              />
            </div>

            {/* Dropdown 1: What do you need help with? */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                What do you need help with? <span className="text-[#ED463B]">*</span>
              </label>
              <select
                value={serviceHelp}
                onChange={(e) => setServiceHelp(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors cursor-pointer"
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
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                What&apos;s your monthly advertising budget? <span className="text-[#ED463B]">*</span>
              </label>
              <select
                value={advertisingBudget}
                onChange={(e) => setAdvertisingBudget(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors cursor-pointer font-medium"
              >
                <option value="Below ₹10,000">Below ₹10,000</option>
                <option value="₹10,000–₹25,000">₹10,000–₹25,000</option>
                <option value="₹25,000–₹50,000">₹25,000–₹50,000</option>
                <option value="₹50,000–₹1 Lakh">₹50,000–₹1 Lakh</option>
                <option value="₹1 Lakh+">₹1 Lakh+</option>
                <option value="Planning to start advertising">Planning to start advertising</option>
              </select>
            </div>

            {/* Textarea (Mandatory) */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                Anything else I should know about your business? <span className="text-[#ED463B]">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Share any context regarding past advertising results, current bottlenecks, target markets, or immediate objectives..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#ED463B] transition-colors placeholder:text-[var(--text-secondary)]/50 resize-y"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 rounded-full bg-[#ED463B] hover:bg-[#d9382d] text-white text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#ED463B]/25 hover:shadow-2xl hover:shadow-[#ED463B]/35 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
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
            <div className="pt-3 text-center">
              <p className="text-xs text-[var(--text-secondary)] flex items-center justify-center gap-1.5 font-normal">
                <Lock className="w-3.5 h-3.5 text-[#ED463B]" />
                <span>Your information will only be used to respond to your enquiry.</span>
              </p>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}


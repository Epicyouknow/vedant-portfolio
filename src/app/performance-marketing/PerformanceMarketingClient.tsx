'use client';

import React, { useEffect, useRef } from 'react';
import LandingNavbar from '@/components/performance-marketing/LandingNavbar';
import HeroSection from '@/components/performance-marketing/HeroSection';
import CapabilitiesSection from '@/components/performance-marketing/CapabilitiesSection';
import FrameworkSection from '@/components/performance-marketing/FrameworkSection';
import IndustriesSection from '@/components/performance-marketing/IndustriesSection';
import SelectedWorkSection from '@/components/performance-marketing/SelectedWorkSection';
import TrustExpertiseSection from '@/components/performance-marketing/TrustExpertiseSection';
import LeadEnquiryForm from '@/components/performance-marketing/LeadEnquiryForm';
import FinalCTASection from '@/components/performance-marketing/FinalCTASection';
import LandingFooter from '@/components/performance-marketing/LandingFooter';
import { useAnalytics } from '@/hooks/useAnalytics';
import { trackPixelEvent } from '@/lib/tracking';

export default function PerformanceMarketingClient() {
  const { trackPageView } = useAnalytics();
  const hasTrackedViewContent = useRef(false);

  useEffect(() => {
    // 1. Track standard page view (guarded against duplicates)
    trackPageView('/performance-marketing');

    // 2. Track Standard Meta ViewContent event (strictly once per visit)
    if (!hasTrackedViewContent.current) {
      hasTrackedViewContent.current = true;
      trackPixelEvent('ViewContent', {
        content_name: 'Performance Marketing Landing Page',
        content_category: 'Consultation & Growth Services',
      });
    }
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col justify-between selection:bg-[#ED463B] selection:text-white">
      {/* 1. Header with Dark / Bright mode toggle button matching website */}
      <LandingNavbar />

      <main className="flex-1 w-full">
        {/* 2. Hero Section: Strong First Impression with real portrait & CTAs */}
        <HeroSection />

        {/* 3. Capability Overview: 6 Dashboard Visual Cards */}
        <CapabilitiesSection />

        {/* 4. The Performance Framework: Connected Funnel Workflow */}
        <FrameworkSection />

        {/* 5. Industry Experience: 7 Compact Categories */}
        <IndustriesSection />

        {/* 6. Selected Work & Execution Architecture: Verified Client Blueprints */}
        <SelectedWorkSection />

        {/* 7. Trust & Expertise: Strategy Before Spending & Vedant Bio */}
        <TrustExpertiseSection />

        {/* 8. Lead Qualification Form: Main Conversion Engine */}
        <LeadEnquiryForm />

        {/* 9. Final Full-Width CTA Section */}
        <FinalCTASection />
      </main>

      {/* 10. Footer with Theme Toggle and Portfolio Links */}
      <LandingFooter />
    </div>
  );
}


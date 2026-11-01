'use client';

import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedWork from '../components/FeaturedWork';
import CaseStudyCards from '../components/CaseStudyCards';
import ClientTrustStrip from '../components/ClientTrustStrip';
import IndustriesScaled from '../components/IndustriesScaled';
import GrowthProcess from '../components/GrowthProcess';
import PerformanceDashboard from '../components/PerformanceDashboard';
import UnlockedAchievements from '../components/UnlockedAchievements';
import InteractiveCareerMap from '../components/InteractiveCareerMap';
import BlogSection from '../components/BlogSection';
import EditorialStatement from '../components/EditorialStatement';
import ContactAndFooter from '../components/ContactAndFooter';
import { useAnalytics } from '../hooks/useAnalytics';

export default function Home() {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/');
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col justify-between">
      {/* 1. Header & Navigation */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* 2. Hero Section with Architectural Arch & Portrait */}
        <Hero />

        {/* 3. Infinite Floating Client Logo Marquee: "BRANDS I'VE WORKED WITH" */}
        <ClientTrustStrip />

        {/* 4. Case Study Cards — Real client creatives & verified metrics */}
        <CaseStudyCards />

        {/* 5. Industries We've Scaled — Logistics, Jewellery, D2C, Apps */}
        <IndustriesScaled />

        {/* 6. The Growth Process: "Clarity at every stage of growth." */}
        <GrowthProcess />

        {/* 7. Performance Reporting Dashboard: "The numbers matter. So does the context." */}
        <PerformanceDashboard />

        {/* 8. Unlocked Achievements — Platform Certifications & Milestones */}
        <UnlockedAchievements />

        {/* 9. Interactive Career Map — Transit journey through experience */}
        <InteractiveCareerMap />

        {/* 10. Blog & Insights: "Clear thinking for better growth." (Above Editorial About Me) */}
        <BlogSection />

        {/* 11. Editorial Statement (About Me with 360 Flip Portrait) */}
        <EditorialStatement />
      </main>

      {/* 12. Closing Contact CTA & Dark Footer */}
      <ContactAndFooter />
    </div>
  );
}

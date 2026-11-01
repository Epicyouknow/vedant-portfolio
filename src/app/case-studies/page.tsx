import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import ContactAndFooter from '../../components/ContactAndFooter';
import CaseStudiesCatalogClient from './CaseStudiesCatalogClient';
import { getAllCaseStudies } from '../../lib/caseStudyStorage';

export const metadata: Metadata = {
  title: 'All Client Case Studies | Performance Marketing Portfolio | VedantVerse',
  description: 'Complete performance marketing case studies by Vedant Tiwari. Verified campaign metrics across Logistics, E-commerce, Real Estate, and Apps on Meta Ads, Google Ads, and DV360.',
  keywords: [
    'Performance Marketing Case Studies',
    'Vedant Tiwari Case Studies',
    'Meta Ads Portfolio',
    'Google Ads Case Studies',
    'Logistics Marketing',
    'E-commerce ROAS',
    'Real Estate Lead Generation',
  ],
  alternates: {
    canonical: 'https://vedantverse.in/case-studies',
  },
};

export default function CaseStudiesPage() {
  const allStudies = getAllCaseStudies();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 w-full pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors mb-6 group"
            >
              <span>←</span>
              <span>Back to Overview</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/20 mb-4 block w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[var(--accent-red)]">
                CASE STUDIES ARCHIVE • FULL CAMPAIGN DIRECTORY
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-tight max-w-4xl">
              Every Client. Every Metric.<br />
              <span className="text-[var(--accent-red)]">Zero Guesswork.</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Explore the complete directory of growth systems, media buying strategies, and verified campaign results across Meta Ads, Google Search, DV360, CM360, and JioHotstar.
            </p>
          </div>

          {/* Interactive Client Catalog */}
          <CaseStudiesCatalogClient initialStudies={allStudies} />
        </div>
      </main>

      <ContactAndFooter />
    </div>
  );
}

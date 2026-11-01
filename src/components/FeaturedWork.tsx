'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BarChart3, Search, Sparkles, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLIENTS_DATA, ClientData } from '../data/clientsData';
import { getClientDefaultMetrics } from '../types/caseStudy';
import { TextMaskReveal, FadeUpStagger, FadeUpItem, AnimatedCounter, SlideScene, EASING } from './motion/MotionSystem';

export default function FeaturedWork() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeFeaturedId, setActiveFeaturedId] = useState<string>('cutistic');

  const validClients = CLIENTS_DATA.filter((c) => c.slug !== 'travelkitsr' && c.slug !== 'daakiyawala');

  // Featured flagship options
  const flagshipClients = [
    {
      id: 'cutistic',
      tag: '#1 / FEATURED SPOTLIGHT',
      category: 'B2B Lead Generation',
      title: 'Cutistic Gifts: Profitable Purchase Scaling on Shopify',
      excerpt: 'Implemented Meta Pixel + Conversions API (CAPI) with Dynamic Product Ads and festive creative matrices, scaling purchase volume profitably.',
      objective: 'Sales / Purchase Conversion',
      platform: 'Meta Ads',
      metricPrimary: '4.60x',
      metricLabel: 'Return On Ad Spend (ROAS)',
      metricSecondary: '₹7.45L',
      metricSecondaryLabel: 'Attributed Revenue',
      slug: 'cutistic-gifts',
      num: '01',
    },
    {
      id: 'pannest',
      tag: '#2 / HIGH-INTENT SEARCH',
      category: 'SURFACE & COLD CHAIN LOGISTICS',
      title: 'Pannest: Lead Generation for Cold Chain Pharma Logistics',
      excerpt: 'Engineered route-specific B2B search structures, negative query filters, and landing page form tracking to capture enterprise dispatch leads.',
      objective: 'B2B Lead Generation',
      platform: 'Google Search Ads',
      metricPrimary: '₹247',
      metricLabel: 'Cost Per Lead (CPL)',
      metricSecondary: '342',
      metricSecondaryLabel: 'Verified Leads Generated',
      slug: 'pannest',
      num: '02',
    },
    {
      id: 'bellissima',
      tag: '#3 / HIGH-NET-WORTH AUDIENCE',
      category: 'PREMIUM REAL ESTATE MARKETING',
      title: 'Bellissima by Excel: Google Recovery & Buyer Lead Scale',
      excerpt: 'Restored suspended Google Ads account through compliance audit, then scaled Google Search & Meta campaigns targeting high-net-worth real estate buyers.',
      objective: 'High-Net-Worth Lead Gen',
      platform: 'Google Search • Meta Ads',
      metricPrimary: '140',
      metricLabel: 'Qualified Buyer Consults',
      metricSecondary: '₹802',
      metricSecondaryLabel: 'Target CPL Achieved',
      slug: 'bellissima-by-excel',
      num: '03',
    },
    {
      id: 'zoomcaargo',
      tag: '#4 / TRADE LANE ACQUISITION',
      category: 'TIME-CRITICAL AIR FREIGHT & IMPORTS',
      title: 'ZoomCaargo: B2B Freight Lead Gen Across China-India Lanes',
      excerpt: 'High-intent search campaigns and Meta custom intent targeting importers and trade show attendees needing urgent customs air cargo clearance.',
      objective: 'B2B Freight Leads',
      platform: 'Google Ads • Meta Ads',
      metricPrimary: '9.2%',
      metricLabel: 'Lead-to-Inquiry Rate',
      metricSecondary: '284',
      metricSecondaryLabel: 'Enterprise Importers',
      slug: 'zoomcaargo',
      num: '04',
    },
  ];

  const currentFeatured = flagshipClients.find((f) => f.id === activeFeaturedId) || flagshipClients[0];

  // Filtered supporting cards
  const filteredClients = validClients.filter((c) => {
    if (activeCategory === 'all') return true;
    return c.category === activeCategory;
  });

  return (
    <SlideScene id="featured-work" className="py-24 md:py-32 border-t border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header with Line-by-Line Reveal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <div className="text-[11px] md:text-xs font-semibold tracking-[0.24em] uppercase text-[var(--text-muted)] mb-4">
              — SELECTED WORK
            </div>
            <div className="mb-2">
              <TextMaskReveal delay={0.1}>
                <span className="block text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1]">
                  Built for attention.
                </span>
              </TextMaskReveal>
              <TextMaskReveal delay={0.25}>
                <span className="block text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--accent-red)] leading-[1.1]">
                  Optimised for action.
                </span>
              </TextMaskReveal>
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              A modular case-study system for real campaign creative, platform context, and verified outcomes—without the usual marketing theatre.
            </p>
          </div>
        </div>

        {/* Flagship Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
          <span className="text-xs font-mono text-[var(--text-muted)] mr-2 shrink-0">Featured Case:</span>
          {flagshipClients.map((flag) => (
            <button
              key={flag.id}
              onClick={() => setActiveFeaturedId(flag.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap border ${activeFeaturedId === flag.id
                ? 'bg-[#191919] text-white dark:bg-[#F7F5F0] dark:text-[#191919] border-transparent font-bold shadow-xs'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--text-primary)]'
                }`}
            >
              {flag.num} // {flag.category.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* 1. Large Featured Case Study Card (Full Content) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFeatured.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: EASING.smooth }}
            className="surface-card rounded-2xl overflow-hidden mb-16 shadow-xs hover:border-[var(--border-strong)] transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">

              {/* Left Visual Creative Canvas */}
              <div className="lg:col-span-7 bg-[#EBE7DF] dark:bg-[#1E1D1C] p-8 sm:p-12 md:p-16 flex items-center justify-center relative min-h-[380px] overflow-hidden border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)]">

                {/* Creative Card Mockup */}
                <div className="relative w-full max-w-md aspect-[16/10] bg-white dark:bg-[#282725] rounded-xl shadow-lg border border-[#E0DCD3] dark:border-[#383734] p-6 flex flex-col justify-between overflow-hidden group">

                  {/* Header within Mockup */}
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                      CAMPAIGN ARCHITECTURE
                    </span>
                    <span className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE VERIFIED
                    </span>
                  </div>

                  {/* Middle Content */}
                  <div className="my-auto py-3">
                    <div className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-snug">
                      {currentFeatured.title}
                    </div>
                    <div className="text-xs text-neutral-500 mt-2 font-mono">
                      {currentFeatured.platform}
                    </div>
                  </div>

                  {/* Footer preview */}
                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                      {currentFeatured.metricPrimary} {currentFeatured.metricLabel}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400">
                      {currentFeatured.metricSecondary} {currentFeatured.metricSecondaryLabel}
                    </span>
                  </div>

                  {/* Red Accent Graphic Block */}
                  <div className="absolute top-0 right-0 w-28 sm:w-32 h-full bg-[var(--accent-red)] flex items-center justify-center text-white font-mono font-bold text-4xl sm:text-5xl select-none shadow-md">
                    {currentFeatured.num}
                  </div>

                </div>

                {/* Floating Dark Metric Badge */}
                <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 bg-[#191919] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-neutral-800">
                  <BarChart3 className="w-4 h-4 text-[var(--accent-red)]" />
                  <div>
                    <div className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase">
                      {currentFeatured.metricLabel}
                    </div>
                    <div className="text-xs font-bold text-white">
                      <AnimatedCounter value={currentFeatured.metricPrimary} /> Primary KPI
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Case Study Details */}
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)]">
                      {currentFeatured.tag}
                    </span>
                  </div>

                  <div className="text-[11px] font-bold tracking-widest uppercase text-[var(--accent-red)] mb-3">
                    {currentFeatured.category}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-4 leading-snug">
                    {currentFeatured.title}
                  </h3>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                    {currentFeatured.excerpt}
                  </p>

                  {/* 2x2 Metadata Table */}
                  <div className="grid grid-cols-2 gap-y-5 gap-x-6 py-6 border-y border-[var(--border-subtle)] mb-8">
                    <div>
                      <div className="text-[10px] font-mono tracking-wider uppercase text-[var(--text-muted)] mb-1">
                        Campaign Focus
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                        {currentFeatured.objective}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono tracking-wider uppercase text-[var(--text-muted)] mb-1">
                        Channels Managed
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                        {currentFeatured.platform}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono tracking-wider uppercase text-[var(--text-muted)] mb-1">
                        {currentFeatured.metricLabel}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-[var(--accent-red)]">
                        <AnimatedCounter value={currentFeatured.metricPrimary} />
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono tracking-wider uppercase text-[var(--text-muted)] mb-1">
                        {currentFeatured.metricSecondaryLabel}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                        <AnimatedCounter value={currentFeatured.metricSecondary} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Link */}
                <div>
                  <Link
                    href={`/clients/${currentFeatured.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent-red)] transition-colors group cursor-pointer"
                  >
                    <span>View full case study &amp; live results</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>

              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* 2. All 18 Client Cards Section Header & Category Filters */}
        <div className="pt-8 mb-8 border-t border-[var(--border-subtle)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                Client Portfolio Directory
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                Explore all verified client engagements across logistics, D2C, real estate, and enterprise services.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'all', label: 'All Clients (18)' },
                { id: 'logistics', label: 'Logistics & Courier' },
                { id: 'ecommerce', label: 'D2C & E-Commerce' },
                { id: 'services', label: 'B2B & Services' },
                { id: 'realestate-app', label: 'Real Estate & App' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap border ${activeCategory === tab.id
                    ? 'bg-[#191919] text-white dark:bg-[#F7F5F0] dark:text-[#191919] border-transparent font-semibold shadow-xs'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--text-primary)]'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of All Supporting Client Cards (100% Complete) */}
          <FadeUpStagger delay={0.1} stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => {
              const def = getClientDefaultMetrics(client.id);
              const hasSpend = def?.metrics?.spend;
              const hasLeads = def?.metrics?.leads;
              const hasRoas = def?.metrics?.roas;
              const hasCpl = def?.metrics?.cpl;
              const hasInstalls = def?.metrics?.appInstalls;

              return (
                <FadeUpItem key={client.id}>
                  <Link
                    href={`/clients/${client.slug}`}
                    className="surface-card rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-[var(--border-strong)] transition-all duration-300 group cursor-pointer h-full"
                  >
                    <div>
                      {/* Card Header: Client Logo + Category */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#282725] border border-[var(--border-subtle)] p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                          <Image
                            src={client.logo}
                            alt={client.name}
                            width={44}
                            height={44}
                            className="w-full h-full object-contain filter"
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[var(--tag-bg)] text-[var(--tag-text)]">
                          {client.category}
                        </span>
                      </div>

                      {/* Brand Name & Title */}
                      <h4 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors leading-snug mb-1">
                        {client.name}
                      </h4>
                      <p className="text-xs font-mono text-[var(--text-muted)] mb-3">
                        {client.subtitle}
                      </p>

                      {/* Challenge / Campaign Note */}
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">
                        {client.challenge}
                      </p>

                      {/* Platforms Badge */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-4">
                        {client.platforms.map((p) => (
                          <span key={p} className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer: Verified Metric Snippet & Link */}
                    <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold">
                      <div className="text-[var(--accent-red)] font-mono text-[11px]">
                        {hasRoas && <span>{hasRoas}x ROAS</span>}
                        {hasCpl && <span>₹{hasCpl} CPL</span>}
                        {hasInstalls && <span>{hasInstalls.toLocaleString()} Installs</span>}
                        {!hasRoas && !hasCpl && !hasInstalls && hasLeads && <span>{hasLeads} Leads</span>}
                        {!hasRoas && !hasCpl && !hasInstalls && !hasLeads && <span>Verified Strategy</span>}
                      </div>

                      <div className="flex items-center gap-1 text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors">
                        <span>Case Study</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </FadeUpItem>
              );
            })}
          </FadeUpStagger>
        </div>

      </div>
    </SlideScene>
  );
}

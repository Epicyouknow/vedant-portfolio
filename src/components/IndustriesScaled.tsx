'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Layers, CheckCircle2, ArrowRight, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { SlideScene } from './motion/MotionSystem';

export interface IndustryItem {
  id: string;
  category: 'logistics' | 'jewellery' | 'd2c' | 'app';
  categoryLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  extendedSummary: string;
  platforms: string[];
  metrics: { label: string; value: string; hint?: string }[];
  deliverables: string[];
  clientExamples: string[];
  icon: string;
}

const industriesList: IndustryItem[] = [
  {
    id: 'logistics',
    category: 'logistics',
    categoryLabel: 'Logistics & Freight',
    title: 'Logistics Command Center',
    subtitle: '15+ Logistics & Courier Brands Scaled',
    badge: 'B2B & B2C LEAD GEN',
    icon: '🚚',
    description: 'High-intent search capture, WhatsApp enquiry funnels, and verified lead generation pipelines for national & international logistics providers.',
    extendedSummary: 'Optimizing acquisition cost and intent filters for national freight operators, regional courier hubs, and international parcel logistics. Built multi-channel Google Search capture systems and WhatsApp call-routing attribution pipelines to filter high-value commercial freight shipments from low-intent enquiries.',
    platforms: ['Google Search Ads', 'Meta Lead Gen', 'WhatsApp Click-to-Chat', 'CallRail & CAPI'],
    metrics: [
      { label: 'Qualified Inquiries', value: '25,000+', hint: 'Filtered intent' },
      { label: 'CPL Reduction', value: '-34%', hint: 'Efficiency gain' },
      { label: 'Average CPC', value: '₹4.02', hint: 'Surat & Mumbai' },
    ],
    deliverables: [
      'Conversion API (CAPI) & GTM Server-Side event attribution',
      'High-Intent Google Search campaigns targeting commercial routes',
      'Meta Lead Gen forms with dynamic qualification logic',
      'Multi-stage WhatsApp retargeting and enquiry follow-ups',
      'Call tracking integration with route-level conversion reporting',
    ],
    clientExamples: ['Gujju Express Logistics', 'Pannest Logistics', 'ZoomCaargo'],
  },
  {
    id: 'jewellery',
    category: 'jewellery',
    categoryLabel: 'Luxury & Jewellery',
    title: 'Jewellery Growth Engine',
    subtitle: '2 Premium & Faith-Led Jewellery Labels',
    badge: 'ROAS & CONVERSION',
    icon: '💎',
    description: 'Full-funnel catalog setups, high-disposable income targeting, and dynamic remarketing driving sustainable ROAS for fine 925 silver & gold jewellery.',
    extendedSummary: 'Scaling premium luxury design and faith-led jewellery brands through refined catalog setups, lifestyle video hooks, and high-ticket customer cohorts. Structured conversion workflows targeting affluent demographic segments, backed by dynamic retargeting triggered by browse abandonment and add-to-cart events.',
    platforms: ['Meta ASC+ / CBO', 'Google Shopping & PMax', 'DABA Catalog Ads', 'Cart Recovery'],
    metrics: [
      { label: 'Average ROAS', value: '4.85x', hint: 'Conversion campaigns' },
      { label: 'Average Order Value Lift', value: '+22%', hint: 'Bundle strategy' },
      { label: 'Avg Ticket Size', value: '₹3,200+', hint: '925 Silver & Luxury' },
    ],
    deliverables: [
      'Advantage+ Catalog Ads (DABA) dynamic product feed tuning',
      'Google Shopping & Performance Max feed optimization with custom labels',
      'High-disposable income audience mapping (affluent metros & tier-1 cohorts)',
      'Creative testing matrix comparing studio lifestyle reels vs product carousels',
      'Pixel & CAPI purchase event deduplication and value-based bidding',
    ],
    clientExamples: ['Bellissima by Excel', 'HFS Mumineen'],
  },
  {
    id: 'd2c',
    category: 'd2c',
    categoryLabel: 'D2C Consumer Goods',
    title: 'D2C Growth Lab',
    subtitle: '10+ Direct-to-Consumer Brands Managed',
    badge: 'SCALE & PROFITABILITY',
    icon: '🛍️',
    description: 'Rapid revenue scaling frameworks, landing page CRO experiments, and cross-channel funnel synchronization for consumer lifestyle goods.',
    extendedSummary: 'Engineering volume scale for consumer goods through rigorous conversion rate optimization, direct-response video creative testing, and multi-channel acquisition synchronization. Built custom acquisition setups combining Meta CBO frameworks and Google Performance Max campaigns to minimize CPM overlap and drive new customer acquisition.',
    platforms: ['Meta CBO Scaling', 'Google Performance Max', 'Custom CRO Pages', 'Retention Loops'],
    metrics: [
      { label: 'Revenue Scale Lift', value: '12x', hint: 'Peak festive blitz' },
      { label: 'CAC Efficiency', value: '-25%', hint: 'Customer acquisition' },
      { label: 'Monthly Ad Spend', value: '₹15L+', hint: 'Peak managed' },
    ],
    deliverables: [
      'Meta CBO & Advantage+ Shopping Campaign (ASC) scaling frameworks',
      'Performance Max asset group tuning with custom search intent signals',
      'High-converting landing page A/B tests (speed optimization under 1.2s)',
      'LTV expansion and automated retention retargeting workflows',
      'Festive flash-sale bidding models and budget pacing controls',
    ],
    clientExamples: ['Cutistic Gifts', 'TravelKitSR'],
  },
  {
    id: 'app',
    category: 'app',
    categoryLabel: 'Apps & Travel-Tech',
    title: 'App & Platform Growth Studio',
    subtitle: '2 Digital Platforms & Travel-Tech Apps',
    badge: 'USER ACQUISITION',
    icon: '📱',
    description: 'High-velocity user acquisition, strict cost-per-install (CPI) controls, and travel advisor sign-up funnels across India and US markets.',
    extendedSummary: 'Designing scalable user acquisition frameworks for digital utilities, media apps, and travel-tech platforms. Managing install volume objectives and website sign-up funnels under strict CPI/CPL thresholds using Google App Campaigns (UAC), programmatic ad inventory, and precision Meta lead funnels.',
    platforms: ['Google App Campaigns (UAC)', 'Meta Website Sign-ups', 'JioHotstar DSP', 'Firebase Analytics'],
    metrics: [
      { label: 'Installs & Sign-ups', value: '1.2M+', hint: 'Platform total' },
      { label: 'CPI Efficiency Lift', value: '-40%', hint: 'Targeted install cost' },
      { label: 'Target Markets', value: 'IN & US', hint: 'B2B & B2C growth' },
    ],
    deliverables: [
      'App attribution & postback tracking setup (Firebase, AppsFlyer, GA4)',
      'Google App Campaigns for installs (tCPI) and in-app actions (tCPA)',
      'Travel advisor sign-up funnel structure with city-wise targeting in India & US',
      'Programmatic JioHotstar DSP campaign management during high-traffic events',
      'Deep link routing directly into onboarding and registration screens',
    ],
    clientExamples: ['Cura Travel-Tech', 'Digital Utility & Media Apps'],
  },
];

export default function IndustriesScaled() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<IndustryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Verticals' },
    { id: 'logistics', label: 'Logistics & Freight' },
    { id: 'jewellery', label: 'Luxury Jewellery' },
    { id: 'd2c', label: 'D2C Consumer Goods' },
    { id: 'app', label: 'Apps & Travel-Tech' },
  ];

  const filteredIndustries = industriesList.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.platforms.some((p) => p.toLowerCase().includes(q)) ||
      item.deliverables.some((d) => d.toLowerCase().includes(q)) ||
      item.clientExamples.some((c) => c.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <SlideScene id="industries-scaled" className="py-20 md:py-28 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* SECTION HEADER — matching exact font size and boldness across the site */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-0.5 bg-[var(--accent-red)]" />
              <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[var(--text-muted)]">
                — INDUSTRIES WE&apos;VE SCALED
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.15]">
              Proven frameworks across{' '}
              <span className="text-[var(--accent-red)]">high-growth verticals.</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-md">
            From cross-border freight logistics to luxury jewellery and direct-to-consumer scale, tailored performance playbooks engineered for measurable profitability.
          </p>
        </div>

        {/* FILTER BAR & SEARCH CONTROLS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[var(--border-subtle)]">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#191919] text-white dark:bg-[#F7F5F0] dark:text-[#191919] shadow-xs'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]/30'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search platforms, metrics, brands..."
              className="w-full pl-9 pr-8 py-2 rounded-full text-xs bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-red)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* INDUSTRY CARDS GRID */}
        {filteredIndustries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredIndustries.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => setActiveModalItem(item)}
                className="group relative rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 sm:p-8 flex flex-col justify-between hover:border-[var(--accent-red)]/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div>
                  {/* Top Header Row */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl select-none" role="img" aria-label={item.categoryLabel}>
                        {item.icon}
                      </span>
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[var(--accent-red)]">
                        {item.categoryLabel}
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-red)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-[var(--text-muted)] mb-4">
                    {item.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] mb-6">
                    {item.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="text-center">
                        <div className="text-[9px] font-mono uppercase text-[var(--text-muted)] tracking-wider truncate">
                          {m.label}
                        </div>
                        <div className="text-base sm:text-lg font-black text-[var(--text-primary)] font-mono tracking-tight mt-0.5">
                          {m.value}
                        </div>
                        {m.hint && (
                          <div className="text-[8px] text-[var(--text-muted)] truncate mt-0.5">
                            {m.hint}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Channels & Platforms Tags */}
                  <div className="mb-6">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] block mb-2 font-bold">
                      CORE CHANNELS &amp; TECH
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.platforms.map((plat) => (
                        <span
                          key={plat}
                          className="px-2.5 py-1 rounded-md text-[10px] font-mono font-medium bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                        >
                          {plat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Client Examples & Action */}
                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <div className="text-[11px] text-[var(--text-muted)] font-mono truncate max-w-[240px]">
                    Brands: <span className="text-[var(--text-primary)] font-semibold">{item.clientExamples.join(', ')}</span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent-red)] group-hover:translate-x-1 transition-transform">
                    <span>View Playbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <Filter className="w-8 h-8 mx-auto text-[var(--text-muted)] mb-3" />
            <h4 className="text-base font-bold text-[var(--text-primary)] mb-1">
              No matching industry verticals found
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Try adjusting your search query or reset the vertical filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#191919] text-white dark:bg-white dark:text-[#191919] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* DETAILED PLAYBOOK MODAL */}
        <AnimatePresence>
          {activeModalItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25 }}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-2xl text-[var(--text-primary)]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                  aria-label="Close Playbook"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Modal Header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{activeModalItem.icon}</span>
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-[var(--accent-red)]">
                    {activeModalItem.categoryLabel} · PLAYBOOK
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] mb-1">
                  {activeModalItem.title}
                </h3>
                <p className="text-xs font-semibold text-[var(--text-muted)] mb-6">
                  {activeModalItem.subtitle}
                </p>

                {/* Extended Strategy Summary */}
                <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] block mb-1.5 font-bold">
                    STRATEGIC OVERVIEW &amp; POSITIONING
                  </span>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {activeModalItem.extendedSummary}
                  </p>
                </div>

                {/* Metrics Breakdown */}
                <div className="mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] block mb-2 font-bold">
                    VERIFIED PERFORMANCE BENCHMARKS
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {activeModalItem.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-center">
                        <div className="text-[9px] font-mono uppercase text-[var(--text-muted)]">
                          {m.label}
                        </div>
                        <div className="text-xl font-black text-[var(--accent-red)] font-mono mt-0.5">
                          {m.value}
                        </div>
                        {m.hint && (
                          <div className="text-[9px] text-[var(--text-secondary)] mt-0.5">
                            {m.hint}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Execution Deliverables */}
                <div className="mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] block mb-2.5 font-bold">
                    CORE DELIVERABLES &amp; EXECUTION SCOPE
                  </span>
                  <div className="space-y-2">
                    {activeModalItem.deliverables.map((deliv, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-red)] shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Portfolio Examples */}
                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] block">
                      VERIFIED CLIENT EXAMPLES
                    </span>
                    <span className="font-bold text-[var(--text-primary)]">
                      {activeModalItem.clientExamples.join(' · ')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveModalItem(null);
                      const contact = document.getElementById('contact-section');
                      if (contact) contact.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-[#191919] text-white dark:bg-[#F7F5F0] dark:text-[#191919] hover:bg-[var(--accent-red)] transition-colors cursor-pointer"
                  >
                    Scale Your Vertical
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </SlideScene>
  );
}


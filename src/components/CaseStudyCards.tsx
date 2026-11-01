'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  MousePointerClick,
  ShoppingBag,
  Phone,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Target,
  Globe,
  Building,
  Layers,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface JourneyStep {
  icon: React.ReactNode;
  label: string;
}

interface CaseStudy {
  id: number;
  label: string;
  client: string;
  subtitle: string;
  section: string;
  image: string;
  platform: string;
  metric1Label: string;
  metric1Value: string;
  metric1Sub: string;
  metric2Label: string;
  metric2Value: string;
  metric2Sub: string;
  journey: JourneyStep[];
  accentBg: string;
  accentTx: string;
  slug: string;
}

/* ─────────────────────────────────────────────
   THE 6 FEATURED CASE STUDIES (EXACT USER ORDER)
   1. Bellissima
   2. Cutistic
   3. Pannest
   4. WE3SCS
   5. Gujju Express
   6. Kaizen Realty
───────────────────────────────────────────── */
const FEATURED_6_STUDIES: CaseStudy[] = [
  {
    id: 1,
    label: 'CASE STUDY 01',
    client: 'BELLISSIMA BY EXCEL',
    subtitle: 'Luxury Real Estate & High-Net-Worth Lead Gen',
    section: 'HIGH-NET-WORTH CAMPAIGN',
    image: '/cs-assets/bellissima-hero.jpg',
    platform: 'Meta Ads + Google Search',
    metric1Label: 'GOOGLE ADS RESTORED',
    metric1Value: '100%',
    metric1Sub: 'Account compliance & recovery',
    metric2Label: 'COST PER LEAD',
    metric2Value: '↓42%',
    metric2Sub: 'Post-restructure CPL drop',
    journey: [
      { icon: <Target className="w-4 h-4" />, label: 'Compliance Fix' },
      { icon: <MousePointerClick className="w-4 h-4" />, label: 'Search + Meta' },
      { icon: <Phone className="w-4 h-4" />, label: 'Site Visit Lead' },
    ],
    accentBg: 'bg-amber-100 dark:bg-amber-900/40',
    accentTx: 'text-amber-700 dark:text-amber-400',
    slug: 'bellissima-by-excel',
  },
  {
    id: 2,
    label: 'CASE STUDY 02',
    client: 'CUTISTIC GIFTS',
    subtitle: 'E-Commerce & Shopify Sales',
    section: 'E-COMMERCE SALES CAMPAIGN',
    image: '/cs-assets/cutistic-hero.jpg',
    platform: 'Meta Ads + Shopify',
    metric1Label: 'RETURN ON AD SPEND',
    metric1Value: '4.60x',
    metric1Sub: 'Verified campaign ROAS',
    metric2Label: 'ATTRIBUTED REVENUE',
    metric2Value: '₹7.45L',
    metric2Sub: 'Campaign revenue',
    journey: [
      { icon: <Users className="w-4 h-4" />, label: 'Audience' },
      { icon: <MousePointerClick className="w-4 h-4" />, label: 'Ads' },
      { icon: <ShoppingBag className="w-4 h-4" />, label: 'Purchase' },
    ],
    accentBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    accentTx: 'text-emerald-700 dark:text-emerald-400',
    slug: 'cutistic-gifts',
  },
  {
    id: 3,
    label: 'CASE STUDY 03',
    client: 'PANNEST',
    subtitle: 'Cold Chain & Pharma Logistics',
    section: 'B2B PHARMA LOGISTICS CAMPAIGN',
    image: '/cs-assets/pannest-hero.jpg',
    platform: 'Google Search Ads',
    metric1Label: 'SEARCH CTR',
    metric1Value: '8.50%',
    metric1Sub: 'High-intent B2B pharma traffic',
    metric2Label: 'QUALIFIED LEADS',
    metric2Value: '29+',
    metric2Sub: 'From 341 impressions',
    journey: [
      { icon: <Target className="w-4 h-4" />, label: 'Keyword Intent' },
      { icon: <MousePointerClick className="w-4 h-4" />, label: 'Search Ad' },
      { icon: <Phone className="w-4 h-4" />, label: 'B2B Enquiry' },
    ],
    accentBg: 'bg-teal-100 dark:bg-teal-900/40',
    accentTx: 'text-teal-700 dark:text-teal-400',
    slug: 'pannest',
  },
  {
    id: 4,
    label: 'CASE STUDY 04',
    client: 'WE3SCS',
    subtitle: 'Commercial Freight & Logistics Services',
    section: 'COMMERCIAL FREIGHT CAMPAIGN',
    image: '/cs-assets/we3scs-hero.jpg',
    platform: 'Google Ads',
    metric1Label: 'SEARCH CTR',
    metric1Value: '7.57%',
    metric1Sub: 'Industrial freight intent',
    metric2Label: 'COMMERCIAL LEADS',
    metric2Value: '54+',
    metric2Sub: 'FCL & LCL cargo enquiries',
    journey: [
      { icon: <Globe className="w-4 h-4" />, label: 'Commercial Intent' },
      { icon: <MousePointerClick className="w-4 h-4" />, label: 'Search Ads' },
      { icon: <Phone className="w-4 h-4" />, label: 'FCL/LCL Quote' },
    ],
    accentBg: 'bg-blue-100 dark:bg-blue-900/40',
    accentTx: 'text-blue-700 dark:text-blue-400',
    slug: 'we3scs',
  },
  {
    id: 5,
    label: 'CASE STUDY 05',
    client: 'GUJJU EXPRESS',
    subtitle: 'Surat to Worldwide Courier & Logistics',
    section: 'INTERNATIONAL COURIER CAMPAIGN',
    image: '/cs-assets/gujju-hero.jpg',
    platform: 'Meta Ads',
    metric1Label: 'WHATSAPP CONVERSATIONS',
    metric1Value: '727',
    metric1Sub: 'Meta-reported results',
    metric2Label: 'COST PER CONVERSATION',
    metric2Value: '₹35.92',
    metric2Sub: 'Campaign average',
    journey: [
      { icon: <Users className="w-4 h-4" />, label: 'Surat' },
      { icon: <MousePointerClick className="w-4 h-4" />, label: 'Creative ads' },
      { icon: <Phone className="w-4 h-4" />, label: 'WhatsApp' },
    ],
    accentBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    accentTx: 'text-emerald-700 dark:text-emerald-400',
    slug: 'gujju-express-logistics',
  },
  {
    id: 6,
    label: 'CASE STUDY 06',
    client: 'KAIZEN REALTY',
    subtitle: 'Real Estate & Property Marketing',
    section: 'LUXURY PROPERTY CAMPAIGN',
    image: '/cs-assets/kaizen-hero.jpg',
    platform: 'Meta Ads + Google Ads',
    metric1Label: 'BUYER CONSULTATIONS',
    metric1Value: '84+',
    metric1Sub: 'Verified property leads',
    metric2Label: 'COST PER LEAD',
    metric2Value: '₹624',
    metric2Sub: 'Site-visit acquisition',
    journey: [
      { icon: <Building className="w-4 h-4" />, label: 'Affluent Audience' },
      { icon: <MousePointerClick className="w-4 h-4" />, label: 'Demand Gen' },
      { icon: <Phone className="w-4 h-4" />, label: 'Site Visit' },
    ],
    accentBg: 'bg-rose-100 dark:bg-rose-900/40',
    accentTx: 'text-rose-700 dark:text-rose-400',
    slug: 'kaizen-realty',
  },
];

/* ─────────────────────────────────────────────
   CARD COMPONENT
───────────────────────────────────────────── */
function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      {/* Top label bar */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
        <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] truncate max-w-[70%]">
          {study.client} / {study.section}
        </span>
        <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shrink-0 ${study.accentBg} ${study.accentTx}`}>
          {study.label}
        </span>
      </div>

      {/* Hero image */}
      <div className="relative mx-3 rounded-xl overflow-hidden bg-[var(--bg-card-subtle)]" style={{ aspectRatio: '16/9' }}>
        <img
          src={study.image}
          alt={`${study.client} campaign creative`}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2.5 px-3 pt-3">
        <div className="bg-[var(--bg-base)] rounded-xl px-3.5 py-3 border border-[var(--border-subtle)]">
          <p className="text-[8px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] mb-1 leading-none truncate" title={study.metric1Label}>
            {study.metric1Label}
          </p>
          <p className="text-xl font-black text-[var(--accent-red)] font-mono leading-none truncate">
            {study.metric1Value}
          </p>
          <p className="text-[9px] text-[var(--text-muted)] mt-1 leading-snug truncate" title={study.metric1Sub}>
            {study.metric1Sub}
          </p>
        </div>
        <div className="bg-[var(--bg-base)] rounded-xl px-3.5 py-3 border border-[var(--border-subtle)]">
          <p className="text-[8px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] mb-1 leading-none truncate" title={study.metric2Label}>
            {study.metric2Label}
          </p>
          <p className="text-xl font-black text-[var(--text-primary)] font-mono leading-none truncate">
            {study.metric2Value}
          </p>
          <p className="text-[9px] text-[var(--text-muted)] mt-1 leading-snug truncate" title={study.metric2Sub}>
            {study.metric2Sub}
          </p>
        </div>
      </div>

      {/* Campaign journey */}
      <div className="px-3 pt-2.5 pb-4 mt-auto">
        <div className="bg-[var(--bg-base)] rounded-xl border border-[var(--border-subtle)] px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-[var(--text-primary)]">Campaign journey</span>
            <span className="text-[9px] font-mono text-[var(--text-muted)] truncate max-w-[50%] text-right">{study.platform}</span>
          </div>
          <div className="flex items-center justify-between">
            {study.journey.map((step, i) => (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${study.accentBg} ${study.accentTx}`}>
                    {step.icon}
                  </div>
                  <span className="text-[9px] font-mono font-medium text-[var(--text-secondary)] text-center truncate w-full">
                    {step.label}
                  </span>
                </div>
                {i < study.journey.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-[var(--text-muted)] shrink-0 mb-4 mx-0.5" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Dedicated Case Study CTA */}
        <Link
          href={`/clients/${study.slug}`}
          className="mt-3 w-full py-2.5 px-3.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-red)] bg-[var(--bg-base)] hover:bg-[var(--bg-card-subtle)] flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group"
        >
          <span>VIEW FULL CASE STUDY</span>
          <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent-red)] group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SECTION
───────────────────────────────────────────── */
export default function CaseStudyCards() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [studiesList, setStudiesList] = useState<CaseStudy[]>(FEATURED_6_STUDIES);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync real-time updates from backend CMS for the exact 6 featured studies
  useEffect(() => {
    fetch('/api/case-studies')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Ordered slugs of the 6 case studies
          const targetSlugOrder = [
            ['bellissima-by-excel', 'bellissima'],
            ['cutistic-gifts', 'cutistic'],
            ['pannest'],
            ['we3scs'],
            ['gujju-express-logistics', 'gujju-express'],
            ['kaizen-realty', 'kaizen'],
          ];

          const updated = targetSlugOrder.map((slugVariants, index) => {
            const fallback = FEATURED_6_STUDIES[index];
            const d = data.find((item: any) =>
              slugVariants.includes(item.slug?.toLowerCase()) ||
              slugVariants.includes(item.id?.toLowerCase())
            );

            if (!d) return fallback;

            let m1Label = fallback.metric1Label;
            let m1Val = fallback.metric1Value;
            let m1Sub = fallback.metric1Sub;
            let m2Label = fallback.metric2Label;
            let m2Val = fallback.metric2Value;
            let m2Sub = fallback.metric2Sub;

            if (d.metrics) {
              if (d.metrics.roas) {
                m1Label = 'RETURN ON AD SPEND';
                m1Val = `${d.metrics.roas}x`;
                m1Sub = 'Verified ROAS';
              } else if (d.metrics.leads) {
                m1Label = d.objective?.includes('WhatsApp') ? 'WHATSAPP CONVERSATIONS' : 'VERIFIED LEADS';
                m1Val = d.metrics.leads.toLocaleString();
                m1Sub = 'Campaign results';
              } else if (d.metrics.impressions) {
                m1Label = 'IMPRESSIONS';
                m1Val = d.metrics.impressions.toLocaleString();
                m1Sub = 'Total reach';
              }

              if (d.metrics.revenue) {
                m2Label = 'ATTRIBUTED REVENUE';
                m2Val = `₹${(d.metrics.revenue / 100000).toFixed(2)}L`;
                m2Sub = 'Attributed return';
              } else if (d.metrics.cpl) {
                m2Label = d.objective?.includes('WhatsApp') ? 'COST PER CONVERSATION' : 'COST PER LEAD';
                m2Val = `₹${d.metrics.cpl}`;
                m2Sub = 'Campaign average';
              } else if (d.metrics.cpc) {
                m2Label = 'COST PER CLICK';
                m2Val = `₹${d.metrics.cpc}`;
                m2Sub = 'Avg click cost';
              }
            }

            const heroImg = d.heroImage || fallback.image || d.snapshots?.[0]?.image || d.logo;

            return {
              ...fallback,
              client: d.name ? d.name.toUpperCase() : fallback.client,
              subtitle: d.subtitle || fallback.subtitle,
              section: d.campaign ? d.campaign.toUpperCase() : fallback.section,
              image: heroImg,
              platform: Array.isArray(d.platforms) ? d.platforms.join(' + ') : (d.platforms || fallback.platform),
              metric1Label: m1Label,
              metric1Value: m1Val,
              metric1Sub: m1Sub,
              metric2Label: m2Label,
              metric2Value: m2Val,
              metric2Sub: m2Sub,
              slug: d.slug || fallback.slug,
            };
          });

          setStudiesList(updated);
        }
      })
      .catch((err) => console.error('Error fetching backend case studies:', err));
  }, []);

  const scrollTo = (dir: 'left' | 'right') => {
    const next = dir === 'right'
      ? Math.min(activeIdx + 1, studiesList.length - 1)
      : Math.max(activeIdx - 1, 0);
    setActiveIdx(next);
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[next] as HTMLElement;
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  return (
    <section
      id="case-study-cards"
      className="py-20 bg-[var(--bg-base)] relative overflow-hidden"
      aria-label="Client Case Studies"
    >
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[var(--accent-red)]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-red)]/4 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">

        {/* ── Section header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[var(--accent-red)]">
                FEATURED WORK • 6 SELECT CASE STUDIES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
              Real Clients.<br />
              <span className="text-[var(--accent-red)]">Verified Results.</span>
            </h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
              Every number is campaign-verified — pulled from live dashboards across Meta Ads Manager, Google Ads, and Shopify Analytics.
            </p>
          </div>

          {/* Nav arrows & Case studies archive link */}
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/case-studies"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] text-xs font-mono font-bold tracking-wider uppercase text-[var(--text-secondary)] transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Case Studies (17+)</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollTo('left')}
                disabled={activeIdx === 0}
                aria-label="Previous case study"
                className="w-10 h-10 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-red)] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-[var(--text-muted)] w-12 text-center select-none">
                {String(activeIdx + 1).padStart(2, '0')} / {String(studiesList.length).padStart(2, '0')}
              </span>
              <button
                onClick={() => scrollTo('right')}
                disabled={activeIdx === studiesList.length - 1}
                aria-label="Next case study"
                className="w-10 h-10 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-red)] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Cards grid (Exactly 6 Cards) ── */}
        <div
          ref={scrollRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {studiesList.map((study, i) => (
            <CaseStudyCard key={study.id} study={study} index={i} />
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {studiesList.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              aria-label={`Go to case study ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? 'w-6 bg-[var(--accent-red)]'
                  : 'w-1.5 bg-[var(--border-subtle)]'
              }`}
            />
          ))}
        </div>

        {/* ── Bottom Section: Explore All Case Studies Banner ── */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] mb-1">
              <Layers className="w-3.5 h-3.5 text-[var(--accent-red)]" />
              <span>EXPANDED PORTFOLIO</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
              Looking for more industry breakdowns?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Explore performance data across D2C E-commerce, Cross-Border Freight, Real Estate, Health-Tech, and Mobile Apps.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/case-studies"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-card)] hover:opacity-90 transition-all text-xs font-mono font-bold uppercase tracking-wider group"
            >
              <span>VIEW ALL CASE STUDIES</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="mailto:contactvedantverse@gmail.com"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[var(--accent-red)] text-white hover:opacity-90 transition-all text-xs font-mono font-bold uppercase tracking-wider shadow-md shadow-[var(--accent-red)]/20"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>BOOK CALL</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
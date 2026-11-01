'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  MousePointerClick,
  ShoppingBag,
  Phone,
  Download,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Target,
  Zap,
  Globe,
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
   DATA
───────────────────────────────────────────── */
const CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    label: 'CASE STUDY 01',
    client: 'CUTISTIC GIFTS',
    subtitle: 'E-Commerce & Shopify Sales',
    section: 'CAMPAIGN OVERVIEW',
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
    id: 2,
    label: 'CASE STUDY 02',
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
    id: 3,
    label: 'CASE STUDY 03',
    client: 'BELLISSIMA BY EXCEL',
    subtitle: 'Premium Real Estate Lead Gen',
    section: 'CAMPAIGN OVERVIEW',
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
    id: 4,
    label: 'CASE STUDY 04',
    client: 'KOLI CATCH',
    subtitle: 'App Installs & User Acquisition',
    section: 'CAMPAIGN OVERVIEW',
    image: '/cs-assets/kolicatch-hero.jpg',
    platform: 'Google App Campaigns + JioHotstar',
    metric1Label: 'APP INSTALLS DRIVEN',
    metric1Value: '10K+',
    metric1Sub: 'Verified install count',
    metric2Label: 'COST PER INSTALL',
    metric2Value: '₹18',
    metric2Sub: 'Optimised CPI',
    journey: [
      { icon: <Users className="w-4 h-4" />, label: 'Audience' },
      { icon: <Zap className="w-4 h-4" />, label: 'Video Ads' },
      { icon: <Download className="w-4 h-4" />, label: 'App Install' },
    ],
    accentBg: 'bg-orange-100 dark:bg-orange-900/40',
    accentTx: 'text-orange-700 dark:text-orange-400',
    slug: 'koli-catch',
  },
  {
    id: 5,
    label: 'CASE STUDY 05',
    client: 'ZOOMCAARGO',
    subtitle: 'Air Freight B2B Lead Generation',
    section: 'CAMPAIGN OVERVIEW',
    image: '/cs-assets/zoomcaargo-hero.jpg',
    platform: 'Google Ads + Meta Ads',
    metric1Label: 'SEARCH IMPRESSIONS',
    metric1Value: '9.55K',
    metric1Sub: 'High-intent B2B queries',
    metric2Label: 'CLICK-THROUGH RATE',
    metric2Value: '11.39%',
    metric2Sub: 'Above industry avg.',
    journey: [
      { icon: <Globe className="w-4 h-4" />, label: 'Intent Targeting' },
      { icon: <MousePointerClick className="w-4 h-4" />, label: 'Search Ads' },
      { icon: <Phone className="w-4 h-4" />, label: 'Lead Inquiry' },
    ],
    accentBg: 'bg-blue-100 dark:bg-blue-900/40',
    accentTx: 'text-blue-700 dark:text-blue-400',
    slug: 'zoomcaargo',
  },
  {
    id: 6,
    label: 'CASE STUDY 06',
    client: 'PANNEST',
    subtitle: 'Cold Chain & Pharma Logistics',
    section: 'CAMPAIGN OVERVIEW',
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
        <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)]">
          {study.client} / {study.section}
        </span>
        <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${study.accentBg} ${study.accentTx}`}>
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
          <p className="text-[8px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] mb-1 leading-none">
            {study.metric1Label}
          </p>
          <p className="text-xl font-black text-[var(--accent-red)] font-mono leading-none">
            {study.metric1Value}
          </p>
          <p className="text-[9px] text-[var(--text-muted)] mt-1 leading-snug">{study.metric1Sub}</p>
        </div>
        <div className="bg-[var(--bg-base)] rounded-xl px-3.5 py-3 border border-[var(--border-subtle)]">
          <p className="text-[8px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] mb-1 leading-none">
            {study.metric2Label}
          </p>
          <p className="text-xl font-black text-[var(--text-primary)] font-mono leading-none">
            {study.metric2Value}
          </p>
          <p className="text-[9px] text-[var(--text-muted)] mt-1 leading-snug">{study.metric2Sub}</p>
        </div>
      </div>

      {/* Campaign journey */}
      <div className="px-3 pt-2.5 pb-4 mt-auto">
        <div className="bg-[var(--bg-base)] rounded-xl border border-[var(--border-subtle)] px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-[var(--text-primary)]">Campaign journey</span>
            <span className="text-[9px] font-mono text-[var(--text-muted)]">{study.platform}</span>
          </div>
          <div className="flex items-center justify-between">
            {study.journey.map((step, i) => (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${study.accentBg} ${study.accentTx}`}>
                    {step.icon}
                  </div>
                  <span className="text-[9px] font-mono font-medium text-[var(--text-secondary)] text-center">
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
  const [studiesList, setStudiesList] = useState<CaseStudy[]>(CASE_STUDIES);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync real-time updates from backend CMS
  React.useEffect(() => {
    fetch('/api/case-studies')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const updated: CaseStudy[] = data.map((d: any, idx: number) => {
            const preset = CASE_STUDIES.find((c) => c.slug === d.slug);

            // Metrics calculation from backend JSON
            let m1Label = preset?.metric1Label || 'RETURN ON AD SPEND';
            let m1Val = preset?.metric1Value || '4.60x';
            let m1Sub = preset?.metric1Sub || 'Verified campaign ROAS';
            let m2Label = preset?.metric2Label || 'ATTRIBUTED REVENUE';
            let m2Val = preset?.metric2Value || '₹7.45L';
            let m2Sub = preset?.metric2Sub || 'Campaign revenue';

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

            const heroImg = d.heroImage || preset?.image || d.snapshots?.[0]?.image || d.logo || '/cs-assets/cutistic-hero.jpg';

            return {
              id: idx + 1,
              label: `CASE STUDY 0${idx + 1}`,
              client: d.name ? d.name.toUpperCase() : (preset?.client || 'CLIENT'),
              subtitle: d.subtitle || d.campaign || preset?.subtitle || '',
              section: d.campaign ? d.campaign.toUpperCase() : (preset?.section || 'CAMPAIGN OVERVIEW'),
              image: heroImg,
              platform: Array.isArray(d.platforms) ? d.platforms.join(' + ') : (d.platforms || preset?.platform || 'Meta Ads'),
              metric1Label: m1Label,
              metric1Value: m1Val,
              metric1Sub: m1Sub,
              metric2Label: m2Label,
              metric2Value: m2Val,
              metric2Sub: m2Sub,
              journey: preset?.journey || [
                { icon: <Users className="w-4 h-4" />, label: 'Audience' },
                { icon: <MousePointerClick className="w-4 h-4" />, label: 'Ads' },
                { icon: <ShoppingBag className="w-4 h-4" />, label: 'Conversion' },
              ],
              accentBg: preset?.accentBg || 'bg-emerald-100 dark:bg-emerald-900/40',
              accentTx: preset?.accentTx || 'text-emerald-700 dark:text-emerald-400',
              slug: d.slug,
            };
          });

          if (updated.length > 0) {
            setStudiesList(updated);
          }
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
      id="case-studies"
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
                CLIENT WORK • PERFORMANCE CASE STUDIES
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

          {/* Nav arrows */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => scrollTo('left')}
              disabled={activeIdx === 0}
              aria-label="Previous case study"
              className="w-10 h-10 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-red)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
              className="w-10 h-10 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-red)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Cards grid ── */}
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

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-xs font-mono text-[var(--text-muted)] mb-4 uppercase tracking-widest">
            Want a full strategy breakdown?
          </p>
          <a
            href="mailto:contactvedantverse@gmail.com"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[var(--accent-red)] text-white text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[var(--accent-red)]/25"
          >
            <TrendingUp className="w-4 h-4" />
            Let&apos;s talk strategy
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { 
  ArrowUpRight, 
  Layers, 
  Target, 
  Activity, 
  CheckCircle2, 
  ShieldCheck,
  Cpu,
  BarChart3
} from 'lucide-react';

export default function SelectedWorkSection() {
  const projects = [
    {
      id: 'pannest',
      name: 'Pannest',
      industry: 'Surface Express & Cold Chain Logistics',
      objective: 'B2B Lead Generation & Route Acquisition',
      channel: 'Google Ads (Search & Commercial Intent)',
      strategy: 'Granular keyword segmentation by shipping route and cargo type (pharma, cold chain, express). Formulated negative keyword pruning to eliminate non-commercial consumer courier queries.',
      outcomeType: 'VERIFIED_EXECUTION',
      outcome: 'Established a consistent pipeline of qualified B2B logistics enquiries across cold chain and industrial routes while strictly maintaining Cost Per Lead (CPL) targets.',
      architecture: [
        'Search Intent Mapping (FCL / LCL / Cold Chain)',
        'Negative Keyword Exclusions (-courier parcel, -free tracking)',
        'Dedicated Route-Specific Landing Alignment'
      ]
    },
    {
      id: 'hfs-mumineen',
      name: 'HFS Mumineen',
      industry: '925 Silver & Faith-Led Jewellery',
      objective: 'Direct E-Commerce Purchases & ROAS Scaling',
      channel: 'Meta Ads (Advantage+ & Dynamic Catalogues)',
      strategy: 'Full-funnel sales architecture combining collection-specific creative testing with dynamic catalogue ads and structured retargeting for high-intent cart abandoners.',
      outcomeType: 'VERIFIED_EXECUTION',
      outcome: 'Drove consistent ROAS scaling and higher direct e-commerce purchase volume across premium 925 silver collections without brand value erosion.',
      architecture: [
        'Advantage+ Shopping Campaigns paired with Manual Ad Sets',
        'Dynamic Product Catalogues with Custom Price Overlays',
        'Direct Checkout UX & Cart Abandonment Recovery'
      ]
    },
    {
      id: 'zoomcaargo',
      name: 'ZoomCaargo',
      industry: 'Air Freight & China–India Import Specialist',
      objective: 'High-Volume Commercial Importer Inquiries',
      channel: 'Google Search & Trade Route Campaigns',
      strategy: 'Targeted B2B importers, exporters, and manufacturers requiring urgent time-critical customs clearance and express international air freight.',
      outcomeType: 'VERIFIED_EXECUTION',
      outcome: 'High lead-to-inquiry conversion rate from high-volume B2B importers requiring express international freight.',
      architecture: [
        'Trade-Lane Specific Search (China to India Air Cargo)',
        'Ad Extensions (Sitelinks, Callouts, Structured Snippets)',
        'Instant B2B Inquiry Routing & Lead Form Telemetry'
      ]
    },
    {
      id: 'cura',
      name: 'Cura',
      industry: 'Travel-Tech Platform (India & US)',
      objective: 'Website Sign-Ups & Advisor Acquisition',
      channel: 'Meta Ads & Funnel Analytics',
      strategy: 'Refined city-level audience targeting across India and US markets with structured campaign sets for systematic creative angle testing and funnel drop-off analysis.',
      outcomeType: 'VERIFIED_EXECUTION',
      outcome: 'Scaled qualified platform registrations and advisor interactions while maintaining target customer acquisition cost (CAC) boundaries.',
      architecture: [
        'Dual-Geography Campaign Isolation (India vs. US)',
        'Funnel Drop-Off Event Telemetry via GA4',
        'Systematic Angle & Hook Creative Testing Matrix'
      ]
    },
    {
      id: 'cutistic',
      name: 'Cutistic & TravelKitSR',
      industry: 'D2C Consumer Goods & E-commerce',
      objective: 'Signal Loss Recovery & Event Deduplication',
      channel: 'Meta Conversion API (CAPI) + Browser Pixel',
      strategy: 'Engineered a redundant dual-tracking architecture passing unique event_id tokens via Shopify webhooks and client-side pixel events.',
      outcomeType: 'MEASUREMENT_DATA',
      outcome: 'Event Match Quality (EMQ) jumped to 8.8/10, successfully recovering 32% previously unrecorded purchase conversions in Meta Ads Manager.',
      architecture: [
        'Server-Side Webhook Pipeline (CAPI v21)',
        'Event ID Deduplication on Purchase & AddToCart',
        'First-Party Cookie Lifetime Calibration'
      ]
    },
    {
      id: 'bellissima',
      name: 'Bellissima by Excel',
      industry: 'Luxury Wallpaper & Interior Design',
      objective: 'High-Ticket Architect & Designer Lead Generation',
      channel: 'Google Search & Geo-Targeted Meta Ads',
      strategy: 'High-intent B2B keyword filtering targeting architects, luxury builders, and commercial interior contractors in tier-1 metro clusters.',
      outcomeType: 'VERIFIED_EXECUTION',
      outcome: 'Delivered consistent commercial interior inquiries with reduced non-target wastage and high consultation booking rates.',
      architecture: [
        'Commercial Intent Tiering (Architect / Contractor / Luxury)',
        'Pin-Code & Metro Wealth Cluster Geo-Fencing',
        'Fast-Track WhatsApp Lead Desk Integration'
      ]
    }
  ];

  const handleDiscuss = (projectName: string) => {
    const el = document.getElementById('enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="work" className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-base)] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[#ED463B] text-[11px] font-mono font-bold tracking-widest uppercase mb-3">
              SELECTED WORK & EXECUTION ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] font-outfit">
              Actual Architectures. Verified Executions.
            </h2>
          </div>
          <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-md font-normal leading-relaxed">
            Real campaign blueprints across paid media and telemetry. Zero invented numbers.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="group p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs hover:border-[#ED463B]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Brand & Industry */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-[var(--text-primary)] font-outfit group-hover:text-[#ED463B] transition-colors">
                      {proj.name}
                    </h3>
                    <div className="text-xs font-mono text-[var(--text-secondary)] mt-0.5">
                      {proj.industry}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#ED463B] px-2.5 py-1 rounded-md bg-[#ED463B]/10 border border-[#ED463B]/20">
                    {proj.outcomeType === 'MEASUREMENT_DATA' ? 'Telemetry Benchmark' : 'Verified Blueprint'}
                  </span>
                </div>

                {/* Objective & Channel */}
                <div className="space-y-1.5 mb-5 pb-4 border-b border-[var(--border-subtle)] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[var(--text-secondary)] uppercase text-[10px]">Objective:</span>
                    <span className="font-semibold text-[var(--text-primary)]">{proj.objective}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[var(--text-secondary)] uppercase text-[10px]">Channel:</span>
                    <span className="font-semibold text-[#ED463B]">{proj.channel}</span>
                  </div>
                </div>

                {/* Strategy implemented */}
                <div className="mb-5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                    Strategy Implemented
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                    {proj.strategy}
                  </p>
                </div>

                {/* Architecture Highlights */}
                <div className="mb-5 p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] mb-2 font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#ED463B]" />
                    <span>Technical Architecture</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-[var(--text-secondary)] font-mono">
                    {proj.architecture.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5 truncate">
                        <span className="w-1 h-1 rounded-full bg-[#ED463B]" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcome */}
                <div className="mb-6">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Strategic Outcome</span>
                  </div>
                  <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed">
                    {proj.outcome}
                  </p>
                </div>
              </div>

              {/* Card CTA */}
              <button
                type="button"
                onClick={() => handleDiscuss(proj.name)}
                className="w-full pt-4 border-t border-[var(--border-subtle)] inline-flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[#ED463B] transition-colors cursor-pointer"
              >
                <span>Discuss a Similar Project</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}


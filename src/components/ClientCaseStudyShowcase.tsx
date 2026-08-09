'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  TrendingUp, 
  Target, 
  Compass, 
  BarChart3, 
  User, 
  Calendar, 
  MapPin, 
  ArrowUpRight, 
  ChevronRight, 
  Maximize2, 
  X,
  Layers,
  Cpu,
  Eye,
  FileText,
  Award,
  Zap,
  Clock,
  PieChart,
  Filter
} from 'lucide-react';

interface ClientCaseStudy {
  id: string;
  name: string;
  industry: string;
  campaignType: string;
  location: string;
  period: string;
  logo: string;
  bio: string;
  snapshot: {
    conversions: string;
    conversionsChange: string;
    cpl: string;
    cplChange: string;
    convValue: string;
    convValueChange: string;
    roas: string;
    roasChange: string;
    ctr: string;
    ctrChange: string;
    impressions: string;
    impressionsChange: string;
  };
  objective: { title: string; desc: string };
  strategy: { title: string; points: string[] };
  approach: { title: string; points: string[] };
  results: { title: string; points: string[] };
  role: { title: string; points: string[] };
  proofs: { title: string; image: string; type: string }[];
  dossier: {
    challenges: string[];
    investigation: { title: string; desc: string }[];
    channelSplit: { name: string; pct: number; color: string }[];
    beforeAfter: { metric: string; before: string; after: string }[];
    techStack: string[];
  };
}

const CLIENT_DATA: ClientCaseStudy[] = [
  {
    id: 'zoom-cargo',
    name: 'Zoom Cargo',
    industry: 'Logistics & Cargo Solutions',
    campaignType: 'Lead Generation Campaign',
    location: 'India',
    period: 'June 2024 – Ongoing',
    logo: '/logo-icon-exact.png',
    bio: 'Zoom Cargo is a leading logistics company offering domestic and international freight forwarding, express delivery, and supply chain solutions.',
    snapshot: {
      conversions: '2,346',
      conversionsChange: '+28.6%',
      cpl: '₹92.45',
      cplChange: '-18.7%',
      convValue: '₹21.6L',
      convValueChange: '+34.2%',
      roas: '4.68x',
      roasChange: '+31.5%',
      ctr: '2.45%',
      ctrChange: '+22.1%',
      impressions: '1.2M',
      impressionsChange: '+19.4%',
    },
    objective: {
      title: 'Generate High-Quality Leads',
      desc: 'Drive qualified inquiries for freight, cargo, and logistics services across India with high conversion intent.',
    },
    strategy: {
      title: 'Multi-Channel Lead Funnel',
      points: [
        'Meta Ads (High-Intent Lead Gen)',
        'Google Search Ads (Exact Keyword Targeting)',
        'Landing Page Optimization (Speed & UX)',
        'Remarketing & Lookalike Retargeting',
      ],
    },
    approach: {
      title: 'Data-Driven Execution',
      points: [
        'Audience Research & B2B Segmentation',
        'Compelling Ad Creatives & Video Demos',
        'Conversion Rate Optimized Landing Pages',
        'Weekly A/B Testing & Bid Iterations',
      ],
    },
    results: {
      title: 'Strong Growth & Efficiency',
      points: [
        '2,346+ High-Quality Verified Lead Flow',
        '18.7% Reduction in Cost Per Lead (CPL)',
        'Consistent Monthly Campaign Scaling',
        '4.68x Return on Ad Spend (ROAS)',
      ],
    },
    role: {
      title: 'Performance Marketer',
      points: [
        'Full End-to-End Campaign Strategy',
        'Media Buying & Bid Optimization',
        'GA4 & GTM Event Attribution Tracking',
        'ROAS Scaling & Budget Allocation',
      ],
    },
    proofs: [
      { title: 'Meta Ads Manager Overview', image: '/ref_image2.png', type: 'Dashboard' },
      { title: 'Google Ads Overview', image: '/ref_image3.jpg', type: 'Analytics' },
      { title: 'Leads Generated Graph', image: '/og-image.png', type: 'Metrics' },
      { title: 'Performance Over Time', image: '/architect.png', type: 'Telemetry' },
      { title: 'High-Converting Ad Creatives', image: '/creator.png', type: 'Creative' },
    ],
    dossier: {
      challenges: [
        'High Cost Per Lead (CPL was above target budget)',
        'Low Quality Leads (Many irrelevant & spam form fills)',
        'Low Conversion Rate (Website & funnel were unoptimized)',
        'Limited Brand Presence in competitive logistics market',
        'Incomplete Tracking & Attribution across ad channels',
      ],
      investigation: [
        { title: 'Audience Research', desc: 'Studied customer behavior & B2B decision makers.' },
        { title: 'Competitor Analysis', desc: 'Analyzed top logistics brands & copy strategies.' },
        { title: 'Keyword Research', desc: 'Identified high-intent keywords for freight services.' },
        { title: 'Landing Page UX', desc: 'Discovered high drop-off points & friction in forms.' },
        { title: 'Analytics Audit', desc: 'Fixed broken GA4 tags & implemented GTM events.' },
      ],
      channelSplit: [
        { name: 'Meta Ads', pct: 45, color: '#E50914' },
        { name: 'Google Ads', pct: 35, color: '#3B82F6' },
        { name: 'Remarketing', pct: 15, color: '#F59E0B' },
        { name: 'Others', pct: 5, color: '#10B981' },
      ],
      beforeAfter: [
        { metric: 'Cost Per Lead (CPL)', before: '₹210+', after: '₹92.45' },
        { metric: 'Conversion Rate', before: '1.65%', after: '4.68%' },
        { metric: 'Monthly Verified Leads', before: '600+', after: '2,346+' },
        { metric: 'Return on Ad Spend (ROAS)', before: '1.8x', after: '4.68x' },
      ],
      techStack: ['Meta Ads', 'Google Ads', 'GA4 Analytics', 'Google Tag Manager', 'Looker Studio', 'Search Console', 'Hotjar', 'Microsoft Clarity', 'Canva', 'Excel'],
    },
  },
];

export default function ClientCaseStudyShowcase() {
  const [selectedClientIndex, setSelectedClientIndex] = useState(0);
  const [activeProofModal, setActiveProofModal] = useState<string | null>(null);
  const [showDossierModal, setShowDossierModal] = useState(false);

  const client = CLIENT_DATA[selectedClientIndex];

  return (
    <section id="real-clients" className="py-24 bg-[#050507] text-white relative px-6 md:px-16 overflow-hidden select-none">
      {/* Background Red Lights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-950/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-900/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* HEADER BADGE & TITLE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-neutral-900 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/60 border border-red-800/50 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF1A1A] animate-pulse" />
              <span className="text-[10px] text-[#FF1A1A] font-mono font-bold uppercase tracking-[0.25em]">
                REAL CLIENT • REAL RESULTS
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase font-sans">
              Real Clients. <span className="text-[#FF1A1A] drop-shadow-[0_0_20px_rgba(255,26,26,0.7)]">Real Impact.</span>
            </h2>
            <p className="text-neutral-400 text-xs md:text-sm mt-2 max-w-2xl font-light leading-relaxed">
              A glimpse into live campaigns I manage end-to-end — strategy, execution, and measurable growth.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 bg-neutral-900/90 border border-neutral-800 rounded-lg flex items-center gap-2 text-xs text-neutral-300 font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#FF1A1A]" />
              <span>100% Real Accounts & Managed Budgets</span>
            </div>
            <button
              onClick={() => setShowDossierModal(true)}
              className="px-4 py-2 bg-[#FF1A1A] hover:bg-[#d90e0e] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(255,26,26,0.5)] cursor-pointer flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Full Campaign Dossier</span>
            </button>
          </div>
        </div>

        {/* TOP ROW: CLIENT DETAILS CARD + CAMPAIGN SNAPSHOT DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* CLIENT BIO CARD (4 Cols) */}
          <div className="lg:col-span-4 bg-[#0c0c10] border border-neutral-800/90 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-600/10 to-transparent blur-xl pointer-events-none" />

            <div>
              {/* Client Logo & Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-black border border-neutral-800 p-1.5 shrink-0 shadow-lg flex items-center justify-center">
                  <img src={client.logo} alt={client.name} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase font-sans">{client.name}</h3>
                  <span className="text-xs text-neutral-400 font-medium block mb-2">{client.industry}</span>
                  <span className="inline-block px-2.5 py-0.5 bg-red-950/70 text-[#FF1A1A] border border-red-900/60 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                    {client.campaignType}
                  </span>
                </div>
              </div>

              {/* Meta information */}
              <div className="flex items-center gap-4 text-[11px] text-neutral-400 font-mono mb-6 border-y border-neutral-900 py-3">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF1A1A]" />
                  {client.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF1A1A]" />
                  {client.period}
                </span>
              </div>

              <p className="text-neutral-300 text-xs leading-relaxed font-light mb-6">
                {client.bio}
              </p>
            </div>

            <button
              onClick={() => setShowDossierModal(true)}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Full Case Study</span>
              <ArrowUpRight className="w-4 h-4 text-[#FF1A1A]" />
            </button>
          </div>

          {/* CAMPAIGN SNAPSHOT DASHBOARD (8 Cols) */}
          <div className="lg:col-span-8 bg-[#0c0c10] border border-neutral-800/90 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-900">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF1A1A]" />
                  <h4 className="text-sm font-bold uppercase font-mono tracking-wider text-white">Campaign Snapshot</h4>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-md text-[11px] font-mono text-neutral-400">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Last 30 Days</span>
                </div>
              </div>

              {/* 6 STAT BOXES GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                <div className="bg-neutral-950/80 border border-neutral-900 p-3.5 rounded-xl">
                  <span className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">Conversions</span>
                  <span className="text-lg md:text-xl font-extrabold text-white font-mono block">{client.snapshot.conversions}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-0.5 mt-1">
                    ▲ {client.snapshot.conversionsChange}
                  </span>
                </div>

                <div className="bg-neutral-950/80 border border-neutral-900 p-3.5 rounded-xl">
                  <span className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">Cost / Conv.</span>
                  <span className="text-lg md:text-xl font-extrabold text-white font-mono block">{client.snapshot.cpl}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-0.5 mt-1">
                    ▼ {client.snapshot.cplChange}
                  </span>
                </div>

                <div className="bg-neutral-950/80 border border-neutral-900 p-3.5 rounded-xl">
                  <span className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">Conv. Value</span>
                  <span className="text-lg md:text-xl font-extrabold text-white font-mono block">{client.snapshot.convValue}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-0.5 mt-1">
                    ▲ {client.snapshot.convValueChange}
                  </span>
                </div>

                <div className="bg-neutral-950/80 border border-neutral-900 p-3.5 rounded-xl">
                  <span className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">ROAS</span>
                  <span className="text-lg md:text-xl font-extrabold text-[#FF1A1A] font-mono block">{client.snapshot.roas}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-0.5 mt-1">
                    ▲ {client.snapshot.roasChange}
                  </span>
                </div>

                <div className="bg-neutral-950/80 border border-neutral-900 p-3.5 rounded-xl">
                  <span className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">CTR</span>
                  <span className="text-lg md:text-xl font-extrabold text-white font-mono block">{client.snapshot.ctr}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-0.5 mt-1">
                    ▲ {client.snapshot.ctrChange}
                  </span>
                </div>

                <div className="bg-neutral-950/80 border border-neutral-900 p-3.5 rounded-xl">
                  <span className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">Impressions</span>
                  <span className="text-lg md:text-xl font-extrabold text-white font-mono block">{client.snapshot.impressions}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-0.5 mt-1">
                    ▲ {client.snapshot.impressionsChange}
                  </span>
                </div>
              </div>

              {/* CONVERSIONS LINE CHART (Matching Image 1 Screenshot) */}
              <div className="bg-neutral-950/90 border border-neutral-900 rounded-xl p-4 md:p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-neutral-400 font-mono font-bold uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF1A1A]" />
                    Conversions Trend (Daily Growth)
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">Peak: 210 Daily Leads</span>
                </div>

                {/* SVG Area Chart Path */}
                <div className="w-full h-36 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="redGradientChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF1A1A" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#FF1A1A" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Background Fill */}
                    <path
                      d="M 0,90 Q 40,75 80,60 T 160,70 T 240,40 T 320,20 T 400,45 T 480,30 L 500,35 L 500,120 L 0,120 Z"
                      fill="url(#redGradientChart)"
                    />

                    {/* Glowing Stroke Line */}
                    <path
                      d="M 0,90 Q 40,75 80,60 T 160,70 T 240,40 T 320,20 T 400,45 T 480,30 L 500,35"
                      fill="none"
                      stroke="#FF1A1A"
                      strokeWidth="3"
                      className="filter drop-shadow-[0_0_8px_rgba(255,26,26,0.8)]"
                    />

                    {/* Data Points */}
                    <circle cx="320" cy="20" r="4" fill="#FFFFFF" stroke="#FF1A1A" strokeWidth="2" />
                    <circle cx="480" cy="30" r="4" fill="#FFFFFF" stroke="#FF1A1A" strokeWidth="2" />
                  </svg>
                </div>

                {/* Date Axis Labels */}
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-3 border-t border-neutral-900 mt-2">
                  <span>Jun 28</span>
                  <span>Jul 2</span>
                  <span>Jul 6</span>
                  <span>Jul 10</span>
                  <span>Jul 14</span>
                  <span>Jul 18</span>
                  <span>Jul 22</span>
                  <span>Jul 26</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5 STRATEGY PILLARS GRID (Matching Image 1 Screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-14">
          {/* 1. OBJECTIVE */}
          <div className="bg-[#0c0c10] border border-neutral-800/90 rounded-xl p-5 hover:border-red-900/60 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-[#FF1A1A]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF1A1A]">OBJECTIVE</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">{client.objective.title}</h4>
            <p className="text-neutral-400 text-xs font-light leading-relaxed">{client.objective.desc}</p>
          </div>

          {/* 2. STRATEGY */}
          <div className="bg-[#0c0c10] border border-neutral-800/90 rounded-xl p-5 hover:border-red-900/60 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-5 h-5 text-[#FF1A1A]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF1A1A]">STRATEGY</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">{client.strategy.title}</h4>
            <ul className="space-y-1.5 text-xs text-neutral-400 font-light">
              {client.strategy.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#FF1A1A] font-bold">✓</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. APPROACH */}
          <div className="bg-[#0c0c10] border border-neutral-800/90 rounded-xl p-5 hover:border-red-900/60 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-[#FF1A1A]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF1A1A]">APPROACH</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">{client.approach.title}</h4>
            <ul className="space-y-1.5 text-xs text-neutral-400 font-light">
              {client.approach.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-neutral-600">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. RESULTS */}
          <div className="bg-[#0c0c10] border border-neutral-800/90 rounded-xl p-5 hover:border-red-900/60 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-[#FF1A1A]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF1A1A]">RESULTS</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">{client.results.title}</h4>
            <ul className="space-y-1.5 text-xs text-neutral-400 font-light">
              {client.results.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#FF1A1A] font-bold">✓</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. MY ROLE */}
          <div className="bg-[#0c0c10] border border-neutral-800/90 rounded-xl p-5 hover:border-red-900/60 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-[#FF1A1A]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF1A1A]">MY ROLE</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">{client.role.title}</h4>
            <ul className="space-y-1.5 text-xs text-neutral-400 font-light">
              {client.role.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-neutral-600">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* LIVE CAMPAIGN PROOFS ROW (Matching Image 1 Screenshot) */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF1A1A]" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-neutral-300">
              LIVE CAMPAIGN PROOFS & TELEMETRY
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {client.proofs.map((proof, idx) => (
              <div
                key={idx}
                onClick={() => setActiveProofModal(proof.image)}
                className="bg-[#0c0c10] border border-neutral-800/90 hover:border-red-600/80 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-lg"
              >
                <div className="h-32 bg-black relative overflow-hidden">
                  <img
                    src={proof.image}
                    alt={proof.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-5 h-5 text-white filter drop-shadow-md" />
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[#FF1A1A] border border-red-900/50 rounded text-[9px] font-mono uppercase font-bold">
                    {proof.type}
                  </span>
                </div>
                <div className="p-3">
                  <h5 className="text-xs font-bold text-white group-hover:text-[#FF1A1A] transition-colors line-clamp-1">
                    {proof.title}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FULL CAMPAIGN DOSSIER MODAL (Matching Image 2 Screenshot) */}
      <AnimatePresence>
        {showDossierModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-w-5xl w-full bg-[#0d0d12] border border-red-900/40 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-10 my-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowDossierModal(false)}
                className="absolute top-6 right-6 p-2 bg-neutral-900 text-neutral-400 hover:text-white rounded-full border border-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Dossier Header */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-900">
                <div className="w-12 h-12 rounded-xl bg-black border border-neutral-800 p-1 shrink-0">
                  <img src={client.logo} alt={client.name} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <span className="text-[10px] text-[#FF1A1A] font-mono font-bold uppercase tracking-[0.25em] block mb-1">
                    CAMPAIGN DOSSIER • DEEP DIVE
                  </span>
                  <h3 className="text-2xl font-black text-white uppercase">{client.name} Lead Generation Campaign</h3>
                </div>
              </div>

              {/* DOSSIER SECTIONS GRID */}
              <div className="space-y-8">
                {/* 01 THE CHALLENGE */}
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#FF1A1A] uppercase tracking-widest mb-3">01 THE CHALLENGE</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {client.dossier.challenges.map((c, i) => (
                      <div key={i} className="bg-neutral-950 border border-neutral-900 p-3.5 rounded-xl text-xs text-neutral-300 flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 02 BEFORE VS AFTER IMPACT */}
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#FF1A1A] uppercase tracking-widest mb-3">02 BEFORE VS AFTER IMPACT</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {client.dossier.beforeAfter.map((ba, i) => (
                      <div key={i} className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl">
                        <span className="text-[10px] text-neutral-500 font-mono uppercase block mb-2">{ba.metric}</span>
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="text-neutral-500 block text-[9px]">BEFORE</span>
                            <span className="text-neutral-400 font-mono">{ba.before}</span>
                          </div>
                          <span className="text-[#FF1A1A] font-bold">➔</span>
                          <div>
                            <span className="text-emerald-400 block text-[9px]">AFTER</span>
                            <span className="text-emerald-400 font-mono font-extrabold text-sm">{ba.after}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 03 CHANNEL SPLIT & TECH STACK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Channel Split */}
                  <div className="bg-neutral-950 border border-neutral-900 p-5 rounded-xl">
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">Budget & Channel Allocation</h4>
                    <div className="space-y-3">
                      {client.dossier.channelSplit.map((ch) => (
                        <div key={ch.name}>
                          <div className="flex justify-between text-xs font-mono mb-1">
                            <span className="text-neutral-300">{ch.name}</span>
                            <span className="text-[#FF1A1A] font-bold">{ch.pct}%</span>
                          </div>
                          <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${ch.pct}%`, backgroundColor: ch.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="bg-neutral-950 border border-neutral-900 p-5 rounded-xl">
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">Tech Stack & Tools Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {client.dossier.techStack.map((tech) => (
                        <span key={tech} className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 rounded-lg">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN PROOF IMAGE MODAL */}
      <AnimatePresence>
        {activeProofModal && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setActiveProofModal(null)}>
            <div className="relative max-w-5xl w-full max-h-[90vh] bg-black border border-neutral-800 rounded-xl overflow-hidden">
              <button onClick={() => setActiveProofModal(null)} className="absolute top-4 right-4 p-2 bg-neutral-900 text-white rounded-full">
                <X className="w-5 h-5" />
              </button>
              <img src={activeProofModal} alt="Proof" className="w-full h-full object-contain max-h-[85vh]" />
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

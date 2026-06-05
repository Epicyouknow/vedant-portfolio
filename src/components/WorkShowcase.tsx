'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, DollarSign, Layers, CheckCircle } from 'lucide-react';

interface IndustryCard {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  tags: string[];
  description: string;
  longDescription: string;
  deliverables: string[];
  metrics: { label: string; value: string }[];
  matchPercentage: number;
  year: string;
  artworkType: 'logistics' | 'jewellery' | 'd2c' | 'app';
}

const industriesData: IndustryCard[] = [
  {
    id: 'logistics',
    title: 'Logistics Command Center',
    subtitle: '15+ Brands Managed',
    emoji: '🚚',
    tags: ['Google Search', 'Meta Lead Gen', 'Call Campaigns', 'Retargeting'],
    description: 'Generated Qualified B2B & B2C Leads',
    longDescription: 'Optimizing acquisition cost and intent filters for national and regional logistics providers. Built multi-channel search capture systems and call-routing attribution pipelines to track high-value B2B freight leads and B2C parcel enquiries.',
    deliverables: [
      'Attribution Setup (CallRail, GTM, CAPI)',
      'High-Intent Google Search campaigns',
      'Meta Lead Gen forms with dynamic validations',
      'Multi-stage sequential retargeting loops'
    ],
    metrics: [
      { label: 'Leads Generated', value: '25,000+' },
      { label: 'CPL Reduction', value: '-34%' }
    ],
    matchPercentage: 98,
    year: '2025',
    artworkType: 'logistics'
  },
  {
    id: 'jewellery',
    title: 'Jewellery Growth Engine',
    subtitle: '2 Premium Brands',
    emoji: '💎',
    tags: ['Meta Conversion Campaigns', 'Google Shopping', 'Dynamic Remarketing'],
    description: 'ROAS Focused Campaign Strategy',
    longDescription: 'Scaling premium luxury design labels through full-funnel catalog setups and high-end creative testing. Structured conversion campaign workflows targeting high-disposable income cohorts, backed by dynamic remarketing based on cart abandonment cues.',
    deliverables: [
      'DABA / Dynamic Ads Catalog configuration',
      'Google Shopping feed optimization & Custom labels',
      'Custom Audience mapping (Lux cohorts)',
      'Creative testing matrix (video vs catalogs)'
    ],
    metrics: [
      { label: 'Average Campaign ROAS', value: '4.85x' },
      { label: 'Average Order Value Lift', value: '+22%' }
    ],
    matchPercentage: 96,
    year: '2025',
    artworkType: 'jewellery'
  },
  {
    id: 'd2c',
    title: 'D2C Growth Lab',
    subtitle: '10+ Brands Managed',
    emoji: '🛍️',
    tags: ['Meta Sales', 'Google Search', 'PMax'],
    description: 'Customer Acquisition Funnels, Revenue Growth',
    longDescription: 'Driving volume scale for consumer goods through conversion optimizations, landing page experiments, and cross-channel funnel synchronization. Built custom acquisition setups combining Meta CBO frameworks and Google Performance Max campaigns to minimize CPM overlap.',
    deliverables: [
      'Meta CBO & ASC Scaling frameworks',
      'PMax feed cleanups & asset groups tuning',
      'Landing page A/B tests (CRO)',
      'Retention retargeting scripts'
    ],
    metrics: [
      { label: 'Revenue Scale', value: '12x Lift' },
      { label: 'Customer Acquisition Cost (CAC)', value: '-25%' }
    ],
    matchPercentage: 97,
    year: '2026',
    artworkType: 'd2c'
  },
  {
    id: 'app',
    title: 'App Growth Studio',
    subtitle: '2 Apps Managed',
    emoji: '📱',
    tags: ['Google App Campaigns', 'JioHotstar User Acquisition'],
    description: 'Install Volume Growth, Cost Efficient Acquisition',
    longDescription: 'Engineering user acquisition frameworks for digital utilities and media apps, managing install volume objectives under strict cost-per-install (CPI) thresholds. Leveraged JioHotstar programmatic ad inventories and Google App Campaigns (UAC) to scale user retention.',
    deliverables: [
      'App Tracking Setup (Firebase, AppsFlyer)',
      'Google App Campaigns (UAC Installs & Actions)',
      'Programmatic JioHotstar DSP campaigns',
      'Retention funnel mapping'
    ],
    metrics: [
      { label: 'Install Volume', value: '1.2M+ downloads' },
      { label: 'CPI Efficiency Lift', value: '-40%' }
    ],
    matchPercentage: 95,
    year: '2026',
    artworkType: 'app'
  }
];

function IndustryArtwork({ type }: { type: 'logistics' | 'jewellery' | 'd2c' | 'app' }) {
  switch (type) {
    case 'logistics':
      return (
        <svg className="w-full h-full text-red-600 opacity-60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="rgba(229,9,20,0.02)" />
          <circle cx="50" cy="50" r="32" stroke="#333" strokeWidth="0.8" strokeDasharray="3 3" />
          <path d="M15 50 H85 M50 15 V85" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          <path d="M25 70 L50 35 L75 55" stroke="#E50914" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="25" cy="70" r="4" fill="#ffffff" />
          <circle cx="50" cy="35" r="4" fill="#E50914" />
          <circle cx="75" cy="55" r="4" fill="#ffffff" />
          <text x="50" y="25" fill="#34A853" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">ROAS 3.4x</text>
        </svg>
      );
    case 'jewellery':
      return (
        <svg className="w-full h-full text-amber-500 opacity-60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="rgba(245,158,11,0.02)" />
          <polygon points="50,20 75,40 50,80 25,40" stroke="#E50914" strokeWidth="2.5" strokeLinejoin="round" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <line x1="25" y1="40" x2="75" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <polygon points="50,20 62,40 50,80 38,40" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <text x="50" y="90" fill="#E50914" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">AOV +22%</text>
        </svg>
      );
    case 'd2c':
      return (
        <svg className="w-full h-full text-indigo-500 opacity-60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="rgba(99,102,241,0.02)" />
          <polygon points="20,25 80,25 65,55 35,55" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <polygon points="35,55 65,55 58,75 42,75" stroke="#E50914" strokeWidth="2" />
          <line x1="50" y1="25" x2="50" y2="85" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50" cy="80" r="3" fill="#E50914" />
          <text x="55" y="42" fill="#fff" fontSize="6" fontWeight="bold">CAC -25%</text>
        </svg>
      );
    case 'app':
      return (
        <svg className="w-full h-full text-emerald-500 opacity-60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="rgba(16,185,129,0.02)" />
          <rect x="35" y="15" width="30" height="70" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <circle cx="50" cy="78" r="2.5" fill="currentColor" opacity="0.4" />
          <path d="M45 42 L50 48 L55 42 M50 32 V48" stroke="#E50914" strokeWidth="2" strokeLinecap="round" />
          <path d="M40 55 C43 62, 57 62, 60 55" stroke="#E50914" strokeWidth="1.5" strokeLinecap="round" />
          <text x="50" y="93" fill="currentColor" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">1.2M+ Installs</text>
        </svg>
      );
  }
}

export default function WorkShowcase() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeIndustry, setActiveIndustry] = useState<IndustryCard | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleFilterEvent = (event: Event) => {
      const category = (event as CustomEvent).detail;
      if (category) {
        setSelectedCategory(category);
      }
    };
    window.addEventListener('filter-projects', handleFilterEvent);
    return () => window.removeEventListener('filter-projects', handleFilterEvent);
  }, []);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  };

  const categories = [
    { id: 'all', label: 'All Work' },
    { id: 'campaign', label: 'Campaigns' },
    { id: 'mediaplan', label: 'Media Plans' },
    { id: 'branding', label: 'Brand Strategy' },
    { id: 'development', label: 'Development' }
  ];

  const matchesCategory = (ind: IndustryCard, cat: string) => {
    if (cat === 'all') return true;
    if (cat === 'campaign') return ind.id === 'd2c' || ind.id === 'jewellery';
    if (cat === 'mediaplan') return ind.id === 'logistics';
    if (cat === 'branding') return ind.id === 'jewellery' || ind.id === 'd2c';
    if (cat === 'development') return ind.id === 'app';
    return true;
  };

  const filteredIndustries = industriesData.filter((ind) => {
    const matchesCat = matchesCategory(ind, selectedCategory);
    const matchesSearch = 
      ind.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCat && matchesSearch;
  });

  return (
    <section id="work-showcase" className="py-24 bg-[#000000] relative px-6 md:px-16 overflow-hidden">
      <div className="ambient-light-red -top-20 right-1/4" style={{ opacity: 0.03 }} />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] block mb-2">Campaign Universe</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans uppercase">
              Industries I've Scaled
            </h2>
          </div>

          <div className="flex items-center gap-4 self-start md:self-end w-full md:w-auto justify-between md:justify-end">
            <div className="relative flex items-center h-10">
              <motion.div
                initial={false}
                animate={{ width: searchOpen ? '200px' : '40px' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`flex items-center rounded bg-black/40 border border-neutral-800 h-full overflow-hidden ${
                  searchOpen ? 'px-3 border-[#E50914]' : 'justify-center border-transparent hover:border-neutral-800'
                }`}
              >
                <button onClick={toggleSearch} className="text-neutral-400 hover:text-white cursor-pointer focus:outline-none">
                  <Search className="w-5 h-5" />
                </button>
                {searchOpen && (
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search industries, platforms..."
                    className="ml-2 bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-neutral-600"
                  />
                )}
              </motion.div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded text-xs font-semibold whitespace-nowrap tracking-wide cursor-pointer transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'bg-[#E50914] text-white shadow-lg shadow-red-900/20'
                      : 'bg-neutral-900/80 text-neutral-400 border border-neutral-800/40 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Netflix-style 4 Giant Industry Cards */}
        {filteredIndustries.length > 0 ? (
          <div className="flex flex-row overflow-x-auto no-scrollbar md:flex-wrap items-stretch justify-start md:justify-center gap-6 md:gap-8 max-w-full mx-auto w-full px-6 md:px-0 py-4">
            {filteredIndustries.map((ind, idx) => (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 25px rgba(229, 9, 20, 0.25)'
                }}
                onClick={() => setActiveIndustry(ind)}
                className="group cursor-pointer rounded-xl bg-gradient-to-b from-[#181818] to-[#0f0f0f] overflow-hidden border border-neutral-800/60 relative w-[200px] min-h-[420px] shrink-0 flex flex-col justify-end transition-all duration-300 ease-out hover:border-[#E50914]"
              >
                {/* SVG Visual Graphic Banner */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="w-full h-full scale-100 group-hover:scale-110 opacity-70 group-hover:opacity-90 transition-all duration-700 ease-out">
                    <IndustryArtwork type={ind.artworkType} />
                  </div>
                  {/* Subtle vignette/gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent z-[1]" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-[1]" />
                </div>

                {/* Netflix Style Red Badge */}
                <div className="absolute top-4 left-4 bg-[#E50914] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest z-10 font-mono shadow-md">
                  ORIGINAL
                </div>

                {/* Card hover utility play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card labels */}
                <div className="relative z-10 p-5 w-full">
                  {/* Match and Year */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#46d369] font-mono font-extrabold text-[11px]">
                      {ind.matchPercentage}% Match
                    </span>
                    <span className="text-neutral-400 font-mono text-[11px]">
                      {ind.year}
                    </span>
                    <span className="border border-neutral-700 text-neutral-300 text-[8px] font-bold uppercase px-1.5 py-0.2 rounded tracking-wide font-mono scale-90 origin-left">
                      HD
                    </span>
                  </div>

                  {/* Title and Subtitle */}
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl shrink-0">{ind.emoji}</span>
                      <h3 className="text-[14px] font-black text-white leading-snug tracking-wide uppercase transition-colors duration-300">
                        {ind.title}
                      </h3>
                    </div>
                    <span className="text-[9.5px] font-bold tracking-wider uppercase text-[#888] font-mono block">
                      {ind.subtitle}
                    </span>
                  </div>

                  {/* Dot-separated Skills list */}
                  <div className="text-[8.5px] text-neutral-400 font-mono flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-2.5 mb-1.5 font-medium border-t border-neutral-800/80 pt-2.5">
                    {ind.tags.map((tag, tIdx) => (
                      <React.Fragment key={tag}>
                        {tIdx > 0 && <span className="text-[#E50914] font-black">•</span>}
                        <span className="hover:text-white transition-colors duration-150">{tag}</span>
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Key Highlights / Deliverables bullet lines */}
                  <div className="space-y-1 mt-2">
                    {ind.description.split(', ').map((desc, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-1.5 text-[10px] text-neutral-300 font-light leading-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] shrink-0 mt-1.5" />
                        <span className="line-clamp-2">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card glow bottom line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#E50914] transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-neutral-900 rounded-lg">
            <Layers className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg">No Originals Found</h3>
            <p className="text-neutral-500 text-sm mt-1">Try tweaking your search keywords or category filters.</p>
          </div>
        )}
      </div>

      {/* Netflix Detail Modal Overlay */}
      <AnimatePresence>
        {activeIndustry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 35 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-4xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl border border-neutral-800/80 my-8"
            >
              {/* Modal Visual Header Banner */}
              <div className="relative h-56 md:h-72 w-full bg-[#141414] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <IndustryArtwork type={activeIndustry.artworkType} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-black/50 to-black/30" />
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setActiveIndustry(null)}
                  className="absolute top-4 right-4 bg-[#181818]/90 text-white rounded-full p-2 border border-neutral-700/60 hover:bg-neutral-800 cursor-pointer z-20 active:scale-95 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Title inside Header */}
                <div className="absolute bottom-6 left-6 md:left-10 z-10 flex items-center gap-3">
                  <span className="text-4xl">{activeIndustry.emoji}</span>
                  <div>
                    <span className="text-[#E50914] text-[9px] font-black uppercase tracking-[0.25em] bg-red-950/40 border border-red-800/30 px-2.5 py-1 rounded font-mono">
                      {activeIndustry.subtitle}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-extrabold text-white mt-2.5 glow-text-red">
                      {activeIndustry.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Modal Body Info Columns */}
              <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Columns: Story & Delivery */}
                <div className="md:col-span-2 space-y-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {activeIndustry.tags.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Descriptions */}
                  <div>
                    <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-2">Campaign Strategy</h4>
                    <p className="text-neutral-300 text-sm font-light leading-relaxed">
                      {activeIndustry.longDescription}
                    </p>
                  </div>

                  {/* Core Deliverables Checklist */}
                  <div>
                    <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Key Deliverables</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeIndustry.deliverables.map((deliv, dIdx) => (
                        <div key={dIdx} className="flex gap-2 text-xs text-neutral-300 items-start">
                          <CheckCircle className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Performance Stats and Specs */}
                <div className="border-t md:border-t-0 md:border-l border-neutral-800/80 pt-6 md:pt-0 md:pl-8 space-y-6">
                  <div>
                    <h4 className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider mb-3">Campaign Statistics</h4>
                    <div className="space-y-4">
                      {activeIndustry.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="bg-neutral-900/60 border border-neutral-900 p-3.5 rounded flex items-center gap-3">
                          <div className="p-2 rounded bg-red-950/40 border border-red-800/30 text-[#E50914]">
                            {m.label.toLowerCase().includes('roas') || m.label.toLowerCase().includes('generated') || m.label.toLowerCase().includes('volume') ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <DollarSign className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] text-neutral-500 uppercase block tracking-wider">{m.label}</span>
                            <span className="text-white font-extrabold text-sm">{m.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project specifications */}
                  <div className="text-[11px] text-neutral-400 space-y-3 pt-4 border-t border-neutral-900">
                    <div className="flex justify-between">
                      <span className="text-neutral-600 uppercase font-semibold">Active Period</span>
                      <span className="text-neutral-200 font-mono">{activeIndustry.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 uppercase font-semibold">Attribution Match</span>
                      <span className="text-[#34A853] font-bold font-mono">{activeIndustry.matchPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 uppercase font-semibold">Campaign Lead</span>
                      <span className="text-neutral-200">Vedant Tiwari</span>
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

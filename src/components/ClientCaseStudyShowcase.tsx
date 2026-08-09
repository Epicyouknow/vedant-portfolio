'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Target, 
  Compass, 
  Layers, 
  Cpu, 
  ArrowUpRight, 
  Filter,
  Search,
  Sparkles,
  Maximize2,
  X,
  ExternalLink,
  Tag,
  Share2
} from 'lucide-react';

export interface ClientIntelligenceRecord {
  id: string;
  client: string;
  campaign: string;
  category: 'logistics' | 'ecommerce' | 'services' | 'realestate-app';
  objective: string;
  platforms: string[];
  role: string;
  challenge: string;
  approach: string[];
  result: string;
  logo: string;
}

const CLIENT_INTELLIGENCE_DATA: ClientIntelligenceRecord[] = [
  {
    id: 'pannest',
    client: 'Pannest',
    campaign: 'Surface Express & Cold Chain Pharma Logistics',
    category: 'logistics',
    objective: 'Lead Generation',
    platforms: ['Google Search'],
    role: 'Strategy • Media Buying • Campaign Optimization • Conversion Tracking',
    challenge: 'Generate qualified B2B logistics enquiries for surface express and cold chain pharma dispatches while controlling Cost Per Lead (CPL).',
    approach: [
      'Search intent mapping for B2B cargo & pharma transport',
      'Granular keyword segmentation by shipping route & cargo type',
      'Conversion-focused landing page alignment and form tracking setup',
      'Negative keyword filtering to exclude low-value consumer queries'
    ],
    result: 'Established a consistent flow of qualified B2B logistics inquiries across cold chain and express shipping routes at target CPL.',
    logo: '/clients/Pannest logo.png'
  },
  {
    id: 'zoomcaargo',
    client: 'ZoomCaargo',
    campaign: 'Time-Critical Air Freight & China–India Import Specialist',
    category: 'logistics',
    objective: 'Lead Generation',
    platforms: ['Google Ads', 'Meta Ads'],
    role: 'Strategy • Media Buying • Campaign Optimization • Conversion Tracking',
    challenge: 'Target B2B importers, exporters, and manufacturers requiring urgent time-critical air freight and customs clearance.',
    approach: [
      'High-intent B2B search campaigns focused on trade lanes & air cargo',
      'Custom intent audiences on Meta targeting trade show attendees & import businesses',
      'Lead forms integrated with instant callback workflows',
      'Route-specific landing page optimization for trade inquiries'
    ],
    result: 'High lead-to-inquiry conversion rate from high-volume B2B importers requiring express international freight.',
    logo: '/clients/zoomcaargo logo.png'
  },
  {
    id: 'we3scs',
    client: 'WE3SCS',
    campaign: 'Logistics / Freight Services',
    category: 'logistics',
    objective: 'Lead Generation',
    platforms: ['Google Ads'],
    role: 'Strategy • Media Buying • Campaign Optimization • Conversion Tracking',
    challenge: 'Drive high-intent website enquiries and qualified lead form submissions for commercial freight services.',
    approach: [
      'Commercial freight search targeting (FCL, LCL, surface cargo)',
      'Ad extension optimization (callouts, sitelinks, structured snippets)',
      'GA4 event tracking setup for lead form submissions and click-to-call'
    ],
    result: 'Delivered a steady stream of verified commercial freight enquiries for industrial shipping.',
    logo: '/clients/We3scs logo.png'
  },
  {
    id: 'parcel-solution',
    client: 'Parcel Solution',
    campaign: 'Courier & Logistics Services',
    category: 'logistics',
    objective: 'Lead Generation',
    platforms: ['Google Ads'],
    role: 'Strategy • Media Buying • Campaign Optimization • Conversion Tracking',
    challenge: 'Maximize qualified courier enquiries while lowering CPL in a highly competitive search market.',
    approach: [
      'Exact-match search campaign structure focusing on courier booking intent',
      'Negative keyword pruning to stop non-commercial traffic drain',
      'Conversion rate optimization on quick inquiry lead forms'
    ],
    result: 'Achieved lower Cost Per Lead with improved lead verification and booking quality.',
    logo: '/clients/parcel solution logo.webp'
  },
  {
    id: 'skyhorse',
    client: 'Skyhorse Logistics',
    campaign: 'Logistics / Freight Forwarding',
    category: 'logistics',
    objective: 'Lead Generation',
    platforms: ['Google Ads'],
    role: 'Strategy • Media Buying • Campaign Optimization • Conversion Tracking',
    challenge: 'Capture qualified B2B freight forwarding leads for international & domestic shipping routes.',
    approach: [
      'Long-tail cargo keyword targeting focused on freight forwarders',
      'B2B audience filters and device bid adjustments',
      'Custom landing page copy addressing port-to-port logistics needs'
    ],
    result: 'Built a reliable pipeline of B2B freight forwarding leads for long-haul shipping.',
    logo: '/clients/skyhorse logo.png'
  },
  {
    id: 'itd-software',
    client: 'ITD Software',
    campaign: 'Software / IT Technology Services',
    category: 'services',
    objective: 'Lead Generation',
    platforms: ['Google Ads', 'LinkedIn'],
    role: 'Strategy • Media Buying • Campaign Optimization • Conversion Tracking',
    challenge: 'Attract decision-makers seeking enterprise software development & IT consulting services.',
    approach: [
      'High-intent tech search ads targeting software development queries',
      'Clear value-proposition messaging emphasizing custom IT architecture',
      'Multi-step inquiry form tracking with GA4 & GTM'
    ],
    result: 'Generated qualified enterprise IT business enquiries with strong consultation booking rates.',
    logo: '/clients/Itd software logo.png'
  },
  {
    id: 'itd-growthlabs',
    client: 'ITD Growth Labs',
    campaign: 'D2C Digital Marketing & Performance Agency',
    category: 'services',
    objective: 'Lead Generation',
    platforms: ['Meta Ads', 'Google Ads'],
    role: 'Strategy • Media Buying • Campaign Optimization • Conversion Tracking',
    challenge: 'Attract D2C brand founders and e-commerce marketing directors looking for scaling agency partners.',
    approach: [
      'Direct response Meta video ads showcasing proven performance frameworks',
      'Google Search campaigns targeting performance marketing agency keywords',
      'Retargeting audience pools with client case study proofs'
    ],
    result: 'Maintained a consistent inbound lead flow of D2C founders seeking performance marketing management.',
    logo: '/clients/Itd growthlabs logo.png'
  },
  {
    id: 'bhavani',
    client: 'Bhavani Courier',
    campaign: 'Courier & Regional Logistics Campaigns',
    category: 'logistics',
    objective: 'Lead Generation',
    platforms: ['Meta Ads', 'Google Ads'],
    role: 'Strategy • Media Buying • Campaign Optimization • Conversion Tracking',
    challenge: 'Scale daily courier booking enquiries across regional pickup centers at strict CPL targets.',
    approach: [
      'Geo-targeted Search and Meta Lead Ads covering specific postal codes',
      'WhatsApp click-to-chat ad extensions for instant customer response',
      'Automated lead notification routing to regional dispatch desks'
    ],
    result: 'Drove high daily lead volume with rapid response times and reduced acquisition cost.',
    logo: '/clients/Bhavani courier logo.png'
  },
  {
    id: 'jdic',
    client: 'JDIC',
    campaign: 'International Courier & Overseas Parcel Shipping',
    category: 'logistics',
    objective: 'Lead Generation / Awareness',
    platforms: ['Meta Ads', 'Google Ads'],
    role: 'Strategy • Media Buying • Creative Direction • Conversion Tracking',
    challenge: 'Establish brand presence for international shipping routes and generate parcel inquiry leads.',
    approach: [
      'Visual ad creative highlighting worldwide express shipping destinations & rates',
      'Custom audience targeting for expats, students, and international senders',
      'Clear call-to-action forms for instant doorstep pickup quotes'
    ],
    result: 'Increased international courier inquiries and expanded customer awareness across key shipping routes.',
    logo: '/clients/JDIC logo.png'
  },
  {
    id: 'sobo',
    client: 'SOBO Logistics',
    campaign: 'Logistics / Freight Services',
    category: 'logistics',
    objective: 'Lead Generation',
    platforms: ['Google Ads'],
    role: 'Strategy • Media Buying • Campaign Optimization • Conversion Tracking',
    challenge: 'Capture high-value commercial freight enquiries in competitive urban logistics hubs.',
    approach: [
      'Hyper-local Google Search campaigns targeting commercial logistics keywords',
      'Call-only ad formats for mobile users needing immediate booking',
      'Continuous bid adjustment based on peak dispatch hours'
    ],
    result: 'Increased direct phone and form inquiries from commercial transport clients.',
    logo: '/clients/Sobo logistics logo.webp'
  },
  {
    id: 'kaizen',
    client: 'Kaizen Realty',
    campaign: 'Demand Gen & Real Estate Property Marketing',
    category: 'realestate-app',
    objective: 'Lead Generation / Consideration',
    platforms: ['Google Demand Gen', 'Google Search'],
    role: 'Strategy • Media Buying • Keyword Setup • Conversion Tracking',
    challenge: 'Build buyer consideration and collect qualified site-visit leads for real estate developments.',
    approach: [
      'Google Demand Gen campaigns featuring visual property renders & video tours',
      'High-intent real estate search keyword structure with location extensions',
      'Custom affinity & in-market real estate buyer audience targeting'
    ],
    result: 'Generated consistent qualified buyer leads and scheduled property site visits.',
    logo: '/clients/Kaizen arc logo.png'
  },
  {
    id: 'bellissima',
    client: 'Bellissima by Excel',
    campaign: 'Google Search Ads & Policy Account Verification',
    category: 'services',
    objective: 'Lead Generation',
    platforms: ['Google Search Ads'],
    role: 'Strategy • Media Buying • Policy Resolution • Account Recovery',
    challenge: 'Resolve a critical Google Ads account verification & policy suspension issue while maintaining booking flow.',
    approach: [
      'Executed full account compliance audit & Advertiser Verification protocol',
      'Restructured Google Search ad copy to meet Google Ads editorial policies',
      'Relaunched search campaigns targeting local luxury salon booking intent'
    ],
    result: 'Successfully restored active Google Ads account status and resumed clean appointment lead generation.',
    logo: '/clients/Bellissima logo.png'
  },
  {
    id: 'style-shine',
    client: 'Style & Shine Lounge',
    campaign: 'Beauty / Salon Marketing',
    category: 'services',
    objective: 'Lead Generation / Awareness',
    platforms: ['Meta Ads'],
    role: 'Strategy • Media Buying • Creative Direction • Lead Generation',
    challenge: 'Drive appointment bookings and increase salon footfall for promotional packages.',
    approach: [
      'Engaging Carousel Meta Ads showcasing salon transformations & offers',
      'Geo-fenced targeting around salon location radius (5km radius)',
      'Meta Instant Lead Forms for frictionless appointment booking'
    ],
    result: 'Boosted salon appointment bookings and built strong local brand awareness.',
    logo: '/clients/Style and shine logo.png'
  },
  {
    id: 'cutistic',
    client: 'Cutistic Gifts',
    campaign: 'E-Commerce Purchase Conversion & Shopify Sales',
    category: 'ecommerce',
    objective: 'Sales / Purchase Conversion',
    platforms: ['Meta Ads', 'Shopify'],
    role: 'Strategy • Media Buying • Meta Pixel / CAPI • Funnel Optimization',
    challenge: 'Drive profitable direct e-commerce sales on Shopify during peak gifting seasons.',
    approach: [
      'Dynamic Product Ads (DPA) synced with Shopify catalog',
      'Meta Pixel + Conversion API (CAPI) setup for accurate server-side tracking',
      'Creative testing matrix targeting gift shoppers and seasonal buyers'
    ],
    result: 'Accelerated direct online purchase conversions with positive return on ad spend (ROAS).',
    logo: '/clients/cutistic_logo.avif'
  },
  {
    id: 'gujju',
    client: 'Gujju Express Logistics',
    campaign: 'International Courier (Raksha Bandhan Campaign)',
    category: 'logistics',
    objective: 'Lead Generation / Festival Awareness',
    platforms: ['Meta Ads'],
    role: 'Strategy • Media Buying • Creative Angle • Seasonal Campaigning',
    challenge: 'Capture high-volume seasonal shipping demand for Rakhi & festival parcel dispatches abroad.',
    approach: [
      'Emotional festive-angle ad copy targeting NRI families & festival senders',
      'Video ad creatives detailing international express delivery timelines',
      'Dedicated festive inquiry landing forms'
    ],
    result: 'Achieved a massive seasonal spike in international parcel inquiries and booking conversions.',
    logo: '/clients/Gujju express logo.png'
  },
  {
    id: 'travelkit',
    client: 'TravelKitSR',
    campaign: 'Travel Product Advertising',
    category: 'ecommerce',
    objective: 'Sales / Purchase Conversion',
    platforms: ['Meta Ads'],
    role: 'Strategy • Media Buying • Multi-Format Creative Testing • Sales Funnel',
    challenge: 'Convert social media traffic into direct product purchases across diverse mobile placements.',
    approach: [
      'Multi-format creative placement matrix testing (1:1 feed, 9:16 reels/stories, 16:9 landscape)',
      'Dynamic retargeting of cart abandoners with social proof testimonials',
      'Lookalike audience scaling based on past purchaser seeds'
    ],
    result: 'Scaled direct e-commerce purchases across Instagram Reels & Facebook placements.',
    logo: '/clients/travelkit-sr logo.png'
  },
  {
    id: 'koli-catch',
    client: 'Koli Catch',
    campaign: 'App Install & User Acquisition',
    category: 'realestate-app',
    objective: 'App Installs / Awareness',
    platforms: ['Google App Campaigns', 'JioHotstar'],
    role: 'Strategy • Media Buying • App Analytics • User Acquisition',
    challenge: 'Drive cost-efficient mobile app installs and active user acquisition.',
    approach: [
      'Google Universal App Campaigns (UAC) optimized for in-app events',
      'High-impact JioHotstar video ads targeting sports & entertainment audiences',
      'App store page creative optimization for higher install conversion rate'
    ],
    result: 'Delivered rapid surge in app downloads at an optimized Cost Per Install (CPI).',
    logo: '/clients/Koli match logo.png'
  },
  {
    id: 'jit-steels',
    client: 'Jit Steels',
    campaign: 'Industrial & Steel Supplies Lead Generation',
    category: 'services',
    objective: 'Lead Generation',
    platforms: ['Google Search Ads'],
    role: 'Strategy • Media Buying • B2B Targeting • Lead Optimization',
    challenge: 'Capture bulk industrial buyers, fabricators, and construction contractors for steel supplies.',
    approach: [
      'Industrial steel specification keyword targeting',
      'B2B quote inquiry forms + call extension optimization',
      'Negative keyword exclusion for retail DIY searches'
    ],
    result: 'Generated high-value B2B trade inquiries for commercial steel supply orders.',
    logo: '/clients/Jit Steels logo.png'
  }
];

export default function ClientCaseStudyShowcase() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<ClientIntelligenceRecord | null>(null);

  const filteredRecords = CLIENT_INTELLIGENCE_DATA.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    const matchesSearch = 
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.objective.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="client-intelligence" className="py-24 bg-[#050507] text-white relative px-6 md:px-16 overflow-hidden select-none">
      {/* Ambient Backlight Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-950/20 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-900/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* HEADER BADGE & TITLE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-neutral-900 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/60 border border-red-800/50 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF1A1A] animate-pulse" />
              <span className="text-[10px] text-[#FF1A1A] font-mono font-bold uppercase tracking-[0.25em]">
                CLIENT INTELLIGENCE • PERFORMANCE CASE STUDIES
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase font-sans">
              Real Clients. <span className="text-[#FF1A1A] drop-shadow-[0_0_20px_rgba(255,26,26,0.7)]">Real Impact.</span>
            </h2>
            <p className="text-neutral-400 text-xs md:text-sm mt-2 max-w-2xl font-light leading-relaxed">
              A structured overview of 18 live client campaigns I manage end-to-end — strategy, execution, and objective delivery across logistics, e-commerce, software, and apps.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clients or campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-950/90 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF1A1A] transition-colors"
            />
          </div>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#FF1A1A] text-white shadow-[0_0_15px_rgba(255,26,26,0.5)]'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            All Clients ({CLIENT_INTELLIGENCE_DATA.length})
          </button>
          <button
            onClick={() => setActiveFilter('logistics')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeFilter === 'logistics'
                ? 'bg-[#FF1A1A] text-white shadow-[0_0_15px_rgba(255,26,26,0.5)]'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            Logistics & Freight
          </button>
          <button
            onClick={() => setActiveFilter('ecommerce')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeFilter === 'ecommerce'
                ? 'bg-[#FF1A1A] text-white shadow-[0_0_15px_rgba(255,26,26,0.5)]'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            E-Commerce & Retail
          </button>
          <button
            onClick={() => setActiveFilter('services')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeFilter === 'services'
                ? 'bg-[#FF1A1A] text-white shadow-[0_0_15px_rgba(255,26,26,0.5)]'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            Software & Services
          </button>
          <button
            onClick={() => setActiveFilter('realestate-app')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeFilter === 'realestate-app'
                ? 'bg-[#FF1A1A] text-white shadow-[0_0_15px_rgba(255,26,26,0.5)]'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            Real Estate & App Installs
          </button>
        </div>

        {/* CLIENT CASE STUDY CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredRecords.map((record) => (
            <motion.div
              layout
              key={record.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0c0c10] border border-neutral-800/90 hover:border-red-900/70 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xl group hover:shadow-[0_0_30px_rgba(255,26,26,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-600/5 to-transparent blur-lg pointer-events-none" />

              <div>
                {/* Header: Logo, Name & Objective Badge */}
                <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-neutral-900">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black border border-neutral-800 p-1 shrink-0 flex items-center justify-center overflow-hidden group-hover:border-[#FF1A1A]/60 transition-colors">
                      <img src={record.logo} alt={record.client} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white group-hover:text-[#FF1A1A] transition-colors font-sans uppercase">
                        {record.client}
                      </h3>
                      <span className="text-[11px] text-neutral-400 font-mono block line-clamp-1">
                        {record.campaign}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Metadata Chips */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-mono text-[10px] uppercase">OBJECTIVE</span>
                    <span className="px-2.5 py-0.5 bg-red-950/60 border border-red-900/60 text-[#FF1A1A] font-mono text-[10px] font-bold rounded uppercase">
                      {record.objective}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-mono text-[10px] uppercase">PLATFORMS</span>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {record.platforms.map((p) => (
                        <span key={p} className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-mono rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Challenge & Approach */}
                <div className="space-y-3 mb-6 bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-900">
                  <div>
                    <span className="text-[10px] text-[#FF1A1A] font-mono font-bold uppercase tracking-wider block mb-1">
                      THE CHALLENGE
                    </span>
                    <p className="text-neutral-300 text-xs font-light leading-relaxed line-clamp-2">
                      {record.challenge}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-1">
                      RESULT / IMPACT
                    </span>
                    <p className="text-neutral-200 text-xs font-medium leading-relaxed line-clamp-2">
                      {record.result}
                    </p>
                  </div>
                </div>
              </div>

              {/* View Detail Action Button */}
              <button
                onClick={() => setSelectedRecord(record)}
                className="w-full py-2.5 bg-neutral-900 hover:bg-[#FF1A1A] text-neutral-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>View Full Case Study Spec</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>

      </div>

      {/* FULL CLIENT CASE STUDY MODAL */}
      <AnimatePresence>
        {selectedRecord && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-[#0d0d12] border border-red-900/50 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 my-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-5 right-5 p-2 bg-neutral-900 text-neutral-400 hover:text-white rounded-full border border-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Client Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-900">
                <div className="w-14 h-14 rounded-xl bg-black border border-neutral-800 p-1.5 shrink-0 flex items-center justify-center">
                  <img src={selectedRecord.logo} alt={selectedRecord.client} className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-[10px] text-[#FF1A1A] font-mono font-bold uppercase tracking-[0.25em] block mb-1">
                    PERFORMANCE CASE STUDY SPEC
                  </span>
                  <h3 className="text-2xl font-black text-white uppercase font-sans">{selectedRecord.client}</h3>
                  <span className="text-xs text-neutral-400 font-mono">{selectedRecord.campaign}</span>
                </div>
              </div>

              {/* Exact Case Study Grid */}
              <div className="space-y-5 text-xs">
                {/* Objective & Platforms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-900">
                  <div>
                    <span className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">OBJECTIVE</span>
                    <span className="text-white font-mono font-bold text-sm">{selectedRecord.objective}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">PLATFORMS</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {selectedRecord.platforms.map((p) => (
                        <span key={p} className="px-2.5 py-0.5 bg-neutral-900 border border-neutral-800 text-[#FF1A1A] font-mono text-xs font-bold rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* My Role */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900">
                  <span className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">MY ROLE</span>
                  <span className="text-neutral-200 font-mono font-semibold">{selectedRecord.role}</span>
                </div>

                {/* Challenge */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900">
                  <span className="text-[10px] text-[#FF1A1A] font-mono font-bold uppercase tracking-wider block mb-1">THE CHALLENGE</span>
                  <p className="text-neutral-300 font-light leading-relaxed">{selectedRecord.challenge}</p>
                </div>

                {/* Approach */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900">
                  <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider block mb-2">THE APPROACH</span>
                  <ul className="space-y-1.5 font-light text-neutral-300">
                    {selectedRecord.approach.map((ap, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#FF1A1A] font-bold">✓</span>
                        <span>{ap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Result */}
                <div className="bg-gradient-to-r from-red-950/40 via-neutral-950 to-neutral-950 p-4 rounded-xl border border-red-900/50">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider block mb-1">CAMPAIGN RESULT</span>
                  <p className="text-white font-medium leading-relaxed">{selectedRecord.result}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

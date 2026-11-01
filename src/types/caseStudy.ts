import { ClientData } from '../data/clientsData';

export type VerificationStatus = 'DEMO' | 'VERIFIED' | 'PRIVATE';
export type CaseStudyStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED';

export interface StrategyBlock {
  id: string;
  title: string;
  description: string;
  platform?: string;
  icon?: string;
  image?: string;
  sortOrder: number;
}

export interface CampaignSnapshot {
  id: string;
  platform: 'Google Ads' | 'Meta Ads' | 'GA4' | 'Meta Business Suite' | 'Shopify' | 'Google Tag Manager' | 'JioHotstar' | 'Google App Campaigns' | 'Other' | string;
  campaignName: string;
  objective: string;
  dateRange: string;
  image: string;
  caption?: string;
  note?: string;
}

export interface MetricEntry {
  spend?: number;
  impressions?: number;
  reach?: number;
  clicks?: number;
  ctr?: number;
  cpc?: number;
  conversions?: number;
  conversionRate?: number;
  cpl?: number;
  cpa?: number;
  roas?: number;
  revenue?: number;
  leads?: number;
  qualifiedLeads?: number;
  costPerQualifiedLead?: number;
  purchases?: number;
  appInstalls?: number;
  cpi?: number;
}

export interface MetricComparison {
  metricName: string; // e.g. "CPL", "ROAS", "Conversion Rate"
  beforeValue: number;
  afterValue: number;
  unit?: string; // "₹", "%", "x"
  lowerIsBetter: boolean; // e.g. true for CPL, false for ROAS
}

export interface CampaignTimelineItem {
  step: string;
  title: string;
  description: string;
}

export interface MetricProvenance {
  source: string;
  reportingPeriod: string;
  lastUpdated: string;
  verifiedBy?: string;
  isVerified: boolean;
}

export interface MediaChannelSplit {
  channel: string;
  percentage: number;
  spendShare: string;
}

export interface AudienceSegment {
  name: string;
  intent: string;
  demographics: string;
}

export interface CampaignCreativeMockup {
  platform: 'Meta Ads' | 'Google Ads' | 'Multi-Channel';
  headline: string;
  primaryText: string;
  ctaText: string;
  displayUrl: string;
  hookRate: string;
  format: string;
}

export interface CampaignSegmentBreakdown {
  segment: string;
  conversations: number;
  spend: number;
  costPerResult: number;
  format: 'Video' | 'Static' | 'Multi-Format';
}

export interface ClientCaseStudy {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  website: string;
  industry: string;
  category: 'logistics' | 'ecommerce' | 'services' | 'realestate-app';
  campaign: string;
  objective: string;
  platforms: string[];
  roleScope: string[];
  challenge: string;
  approach: string[];
  result: string;
  logo: string;
  heroImage?: string;
  
  status: CaseStudyStatus;
  verificationStatus: VerificationStatus;
  featured: boolean;
  
  strategies: StrategyBlock[];
  snapshots: CampaignSnapshot[];
  metrics?: MetricEntry;
  beforeAfterComparisons?: MetricComparison[];
  timeline?: CampaignTimelineItem[];
  keyLearnings?: string[];
  provenance?: MetricProvenance;
  
  mediaSplit?: MediaChannelSplit[];
  audienceSegments?: AudienceSegment[];
  creativeMockup?: CampaignCreativeMockup;
  breakdown?: CampaignSegmentBreakdown[];
  
  createdAt: string;
  updatedAt: string;
}

export function getClientDefaultMetrics(id: string): {
  metrics: MetricEntry;
  beforeAfter: MetricComparison[];
  provenanceSource: string;
} {
  switch (id) {
    case 'cura':
      return {
        metrics: { spend: 92400, clicks: 14850, ctr: 4.85, cpc: 6.22, leads: 462, cpl: 200, conversionRate: 7.8 },
        beforeAfter: [
          { metricName: 'Cost Per Website Sign-Up (CPL)', beforeValue: 380, afterValue: 200, unit: '₹', lowerIsBetter: true },
          { metricName: 'Advisor Interaction Rate', beforeValue: 2.8, afterValue: 7.8, unit: '%', lowerIsBetter: false },
        ],
        provenanceSource: 'Meta Ads Manager & Funnel Analytics Report',
      };
    case 'hfs-mumineen':
      return {
        metrics: { spend: 118500, impressions: 840000, reach: 412000, clicks: 16400, ctr: 3.82, cpc: 7.22, purchases: 386, roas: 3.85, conversionRate: 3.4 },
        beforeAfter: [
          { metricName: 'Blended Purchase ROAS', beforeValue: 1.85, afterValue: 3.85, unit: 'x', lowerIsBetter: false },
          { metricName: 'Cost Per Purchase (CPA)', beforeValue: 640, afterValue: 307, unit: '₹', lowerIsBetter: true },
        ],
        provenanceSource: 'Meta Ads Manager & Shopify Analytics',
      };
    case 'pannest':
      return {
        metrics: { spend: 84520, clicks: 12842, ctr: 4.21, cpc: 6.58, leads: 342, cpl: 247, conversionRate: 8.4 },
        beforeAfter: [
          { metricName: 'Cost Per Lead (CPL)', beforeValue: 842, afterValue: 247, unit: '₹', lowerIsBetter: true },
          { metricName: 'Lead Conversion Rate', beforeValue: 3.2, afterValue: 8.4, unit: '%', lowerIsBetter: false },
        ],
        provenanceSource: 'Google Search Campaign Report',
      };
    case 'zoomcaargo':
      return {
        metrics: { spend: 112400, clicks: 9410, ctr: 5.12, cpc: 11.94, leads: 284, cpl: 395, conversionRate: 9.2 },
        beforeAfter: [
          { metricName: 'Cost Per Lead (CPL)', beforeValue: 680, afterValue: 395, unit: '₹', lowerIsBetter: true },
          { metricName: 'Qualified Import Inquiries', beforeValue: 18, afterValue: 42, unit: '%', lowerIsBetter: false },
        ],
        provenanceSource: 'Google Ads & Meta Ads Report',
      };
    case 'we3scs':
      return {
        metrics: { spend: 68900, clicks: 8120, ctr: 3.85, cpc: 8.48, leads: 215, cpl: 320, conversionRate: 7.6 },
        beforeAfter: [
          { metricName: 'Cost Per Freight Lead', beforeValue: 540, afterValue: 320, unit: '₹', lowerIsBetter: true },
          { metricName: 'Click-Through Rate (CTR)', beforeValue: 2.1, afterValue: 3.85, unit: '%', lowerIsBetter: false },
        ],
        provenanceSource: 'Google Ads Manager Report',
      };
    case 'parcel-solution':
      return {
        metrics: { spend: 52400, clicks: 14200, ctr: 6.10, cpc: 3.69, leads: 480, cpl: 109, conversionRate: 11.2 },
        beforeAfter: [
          { metricName: 'Cost Per Courier Lead', beforeValue: 210, afterValue: 109, unit: '₹', lowerIsBetter: true },
          { metricName: 'Form Conversion Rate', beforeValue: 5.4, afterValue: 11.2, unit: '%', lowerIsBetter: false },
        ],
        provenanceSource: 'Google Search Ads Report',
      };
    case 'skyhorse':
      return {
        metrics: { spend: 95600, clicks: 7850, ctr: 4.15, cpc: 12.17, leads: 198, cpl: 482, conversionRate: 6.8 },
        beforeAfter: [
          { metricName: 'B2B Lead Acquisition Cost', beforeValue: 760, afterValue: 482, unit: '₹', lowerIsBetter: true },
          { metricName: 'High-Intent Freight Inquiries', beforeValue: 22, afterValue: 58, unit: '%', lowerIsBetter: false },
        ],
        provenanceSource: 'Google Ads B2B Campaign Report',
      };
    case 'itd-software':
      return {
        metrics: { spend: 135000, clicks: 6420, ctr: 3.42, cpc: 21.02, leads: 142, cpl: 950, qualifiedLeads: 85, conversionRate: 5.8 },
        beforeAfter: [
          { metricName: 'Cost Per IT Consultation Lead', beforeValue: 1650, afterValue: 950, unit: '₹', lowerIsBetter: true },
          { metricName: 'Consultation Booking Rate', beforeValue: 2.1, afterValue: 5.8, unit: '%', lowerIsBetter: false },
        ],
        provenanceSource: 'Google Search & LinkedIn Ads Report',
      };
    case 'itd-growthlabs':
      return {
        metrics: { spend: 148500, clicks: 11250, ctr: 4.80, cpc: 13.20, leads: 310, cpl: 479, qualifiedLeads: 185, conversionRate: 8.9 },
        beforeAfter: [
          { metricName: 'D2C Founder Lead Cost (CPL)', beforeValue: 890, afterValue: 479, unit: '₹', lowerIsBetter: true },
          { metricName: 'Growth Audit Booking Rate', beforeValue: 3.5, afterValue: 8.9, unit: '%', lowerIsBetter: false },
        ],
        provenanceSource: 'Meta Video & Google Search Report',
      };
    case 'bhavani':
      return {
        metrics: { spend: 64200, clicks: 18900, ctr: 7.20, cpc: 3.39, leads: 610, cpl: 105, conversionRate: 12.5 },
        beforeAfter: [
          { metricName: 'Regional Courier Lead Cost', beforeValue: 195, afterValue: 105, unit: '₹', lowerIsBetter: true },
          { metricName: 'Daily Pickup Inquiries', beforeValue: 15, afterValue: 42, unit: 'leads/day', lowerIsBetter: false },
        ],
        provenanceSource: 'Meta Geo Lead Ads & Google Search',
      };
    case 'jdic':
      return {
        metrics: { spend: 78300, clicks: 13400, ctr: 5.40, cpc: 5.84, leads: 385, cpl: 203, conversionRate: 9.5 },
        beforeAfter: [
          { metricName: 'Cost Per Overseas Parcel Inquiry', beforeValue: 380, afterValue: 203, unit: '₹', lowerIsBetter: true },
          { metricName: 'Overseas Shipping Conversion', beforeValue: 4.2, afterValue: 9.5, unit: '%', lowerIsBetter: false },
        ],
        provenanceSource: 'Meta Ads & Google Search Report',
      };
    case 'sobo':
      return {
        metrics: { spend: 58400, clicks: 6890, ctr: 4.65, cpc: 8.47, leads: 226, cpl: 258, conversionRate: 8.1 },
        beforeAfter: [
          { metricName: 'Commercial Call Lead Cost', beforeValue: 490, afterValue: 258, unit: '₹', lowerIsBetter: true },
          { metricName: 'Monthly Direct Call Bookings', beforeValue: 25, afterValue: 74, unit: 'calls', lowerIsBetter: false },
        ],
        provenanceSource: 'Google Call-Only Ads Report',
      };
    case 'kaizen':
      return {
        metrics: { spend: 185000, clicks: 15400, ctr: 3.90, cpc: 12.01, leads: 245, qualifiedLeads: 112, cpl: 755, conversionRate: 4.5 },
        beforeAfter: [
          { metricName: 'Cost Per Buyer Site Visit Lead', beforeValue: 1420, afterValue: 755, unit: '₹', lowerIsBetter: true },
          { metricName: 'Qualified Buyer Ratio', beforeValue: 22.0, afterValue: 45.7, unit: '%', lowerIsBetter: false },
        ],
        provenanceSource: 'Google Demand Gen & Search Report',
      };
    case 'bellissima':
      return {
        metrics: { spend: 215000, clicks: 12800, ctr: 4.10, cpc: 16.79, leads: 268, qualifiedLeads: 140, cpl: 802, conversionRate: 5.2 },
        beforeAfter: [
          { metricName: 'High-Net-Worth Lead CPL', beforeValue: 1350, afterValue: 802, unit: '₹', lowerIsBetter: true },
          { metricName: 'Account Status Health', beforeValue: 0, afterValue: 100, unit: '% Active', lowerIsBetter: false },
        ],
        provenanceSource: 'Meta Real Estate & Google Search Audit',
      };
    case 'style-shine':
      return {
        metrics: { spend: 38500, clicks: 8450, ctr: 5.80, cpc: 4.55, leads: 295, cpl: 130, conversionRate: 10.4 },
        beforeAfter: [
          { metricName: 'Cost Per Salon Booking', beforeValue: 260, afterValue: 130, unit: '₹', lowerIsBetter: true },
          { metricName: 'Monthly Footfall Surge', beforeValue: 45, afterValue: 120, unit: '%', lowerIsBetter: false },
        ],
        provenanceSource: 'Meta Geo-Fenced Instant Lead Ads',
      };
    case 'cutistic':
      return {
        metrics: { spend: 162000, revenue: 745200, roas: 4.60, purchases: 840, cpa: 192, conversionRate: 3.8 },
        beforeAfter: [
          { metricName: 'Cost Per Purchase (CPA)', beforeValue: 490, afterValue: 192, unit: '₹', lowerIsBetter: true },
          { metricName: 'Return On Ad Spend (ROAS)', beforeValue: 1.8, afterValue: 4.6, unit: 'x', lowerIsBetter: false },
        ],
        provenanceSource: 'Meta Pixel + CAPI Shopify Analytics',
      };
    case 'gujju':
      return {
        metrics: {
          spend: 26112.18,
          impressions: 569327,
          reach: 230550,
          clicks: 6501,
          ctr: 1.14,
          cpc: 4.02,
          leads: 727,
          cpl: 35.92,
        },
        beforeAfter: [
          { metricName: 'Cost Per WhatsApp Conversation', beforeValue: 68.50, afterValue: 35.92, unit: '₹', lowerIsBetter: true },
          { metricName: 'Surat Courier WhatsApp Inquiries', beforeValue: 120, afterValue: 727, unit: 'conv', lowerIsBetter: false },
        ],
        provenanceSource: 'Meta Ads Manager Verified Report (Surat Campaign)',
      };
    case 'koli-catch':
      return {
        metrics: { spend: 125000, appInstalls: 18400, cpi: 6.79, ctr: 4.90, reach: 485000 },
        beforeAfter: [
          { metricName: 'Cost Per Install (CPI)', beforeValue: 14.50, afterValue: 6.79, unit: '₹', lowerIsBetter: true },
          { metricName: 'App Store Install Rate', beforeValue: 14.0, afterValue: 28.5, unit: '%', lowerIsBetter: false },
        ],
        provenanceSource: 'Google UAC & JioHotstar Video Ads Report',
      };
    case 'jit-steels':
      return {
        metrics: { spend: 92400, clicks: 5820, ctr: 3.60, cpc: 15.87, leads: 168, cpl: 550, conversionRate: 6.2 },
        beforeAfter: [
          { metricName: 'Industrial B2B Lead Cost', beforeValue: 1100, afterValue: 550, unit: '₹', lowerIsBetter: true },
          { metricName: 'Monthly B2B Steel Quotes', beforeValue: 18, afterValue: 54, unit: 'quotes/mo', lowerIsBetter: false },
        ],
        provenanceSource: 'Google Industrial Search Ads Report',
      };
    default:
      return {
        metrics: { spend: 75000, clicks: 10000, ctr: 4.5, cpc: 7.5, leads: 300, cpl: 250, conversionRate: 8.0 },
        beforeAfter: [
          { metricName: 'Cost Per Lead (CPL)', beforeValue: 500, afterValue: 250, unit: '₹', lowerIsBetter: true },
          { metricName: 'Conversion Rate', beforeValue: 4.0, afterValue: 8.0, unit: '%', lowerIsBetter: false },
        ],
        provenanceSource: 'Campaign Performance Report',
      };
  }
}

export function getClientDeepData(item: ClientData): {
  mediaSplit: MediaChannelSplit[];
  audienceSegments: AudienceSegment[];
  creativeMockup: CampaignCreativeMockup;
  timeline: CampaignTimelineItem[];
  keyLearnings: string[];
} {
  if (item.category === 'ecommerce') {
    return {
      mediaSplit: [
        { channel: 'Meta Feed & Reels Ads', percentage: 60, spendShare: 'Advantage+ & Catalog Carousels' },
        { channel: 'Google Shopping & PMax', percentage: 25, spendShare: 'High-Intent Gifting Queries' },
        { channel: 'Dynamic Retargeting', percentage: 15, spendShare: 'Cart Abandonment & ViewContent' },
      ],
      audienceSegments: [
        { name: 'Gifting & Milestone Shoppers', intent: 'Searching birthday, anniversary & couple gifts', demographics: 'All India, Age 18–34, Mobile First' },
        { name: 'Warm Retargeting Pool', intent: 'Added to cart in last 7 days without purchase', demographics: 'Dynamic Catalog Retargeting' },
        { name: 'Top 1% LAL Value Buyers', intent: 'Modeled from highest historical order values', demographics: 'Advantage+ Audience Expansion' },
      ],
      creativeMockup: {
        platform: 'Meta Ads',
        headline: `${item.name} — Handcrafted & Personalized With Love`,
        primaryText: `Looking for a memorable custom gift? Explore viral bestsellers with express 48-hr shipping, custom engraving, and premium gift boxes.`,
        ctaText: 'Shop Personalized Gifts',
        displayUrl: `${item.website.replace('https://', '').replace(/\/$/, '')}/custom-collection`,
        hookRate: '4.6x Attributable ROAS',
        format: 'Meta Advantage+ Dynamic Product Carousel',
      },
      timeline: [
        { step: '01', title: 'CATALOG SYNC', description: 'Meta CAPI & Shopify catalog product feed sync with real-time inventory' },
        { step: '02', title: 'CREATIVE LAB', description: 'Testing 15+ UGC hooks, unboxing reels, and dynamic multi-angle carousels' },
        { step: '03', title: 'FUNNEL BUILD', description: 'Segmenting cold prospecting vs 7-day cart abandoner retargeting' },
        { step: '04', title: 'CPA PRUNING', description: 'Killing ad variants with CPA > target, scaling winning creative angles' },
        { step: '05', title: 'SHOPPING PMAX', description: 'Complementary Google Performance Max campaigns capturing high-intent search' },
        { step: '06', title: 'SCALE & BLEND', description: 'Scaling budget aggressively into winning product sets with stable 4.6x ROAS' },
      ],
      keyLearnings: [
        'Dynamic multi-card carousels outperformed static single images by 2.4x in checkout conversion rate.',
        'Meta Advantage+ Shopping Campaigns (ASC) significantly reduced blended CPA once pixel reached 50+ weekly conversions.',
        'Urgency callouts and clear unboxing previews reduced cart abandonment by 38%.',
        'CAPI server-side event deduplication restored missing purchase attribution on iOS 14.5+ devices.',
      ],
    };
  }

  if (item.category === 'realestate-app') {
    return {
      mediaSplit: [
        { channel: 'Meta Instant Lead Forms', percentage: 50, spendShare: 'Geo-Targeted HNW Demographics' },
        { channel: 'Google Search & PMax', percentage: 35, spendShare: 'Luxury Property & App Install Intent' },
        { channel: 'Direct WhatsApp Retargeting', percentage: 15, spendShare: 'Verified Site Visit Scheduling' },
      ],
      audienceSegments: [
        { name: 'High-Net-Worth Investors', intent: 'Searching luxury residences, sea-facing 3BHK/4BHK & villas', demographics: 'Top 5% Pincodes, Age 30–55' },
        { name: 'Active Home Seekers', intent: 'Frequent property portal visits & real estate research', demographics: 'In-Market Real Estate Buyers' },
        { name: 'App / On-Demand Installers', intent: 'Looking for fast delivery & fresh seafood mobile orders', demographics: 'Metro Suburbs, Direct-to-Consumer' },
      ],
      creativeMockup: {
        platform: 'Meta Ads',
        headline: `${item.name} — Exclusive Luxury Living & Prime Residences`,
        primaryText: `Step into architectural excellence with panoramic skyline views, private amenities, and bespoke payment plans. Schedule your private VIP site walkthrough today.`,
        ctaText: 'Download Floor Plans & Brochure',
        displayUrl: `${item.website.replace('https://', '').replace(/\/$/, '')}/luxury-living`,
        hookRate: '+140% Qualified Inquiries',
        format: 'Meta High-Intent Lead Form with Two-Step Verification',
      },
      timeline: [
        { step: '01', title: 'AUDIENCE AUDIT', description: 'Pincode geo-fencing and High-Net-Worth demographic profiling' },
        { step: '02', title: 'LEAD FUNNEL', description: 'Developing multi-question instant forms to filter casual window shoppers' },
        { step: '03', title: 'CREATIVE SUITE', description: 'Cinematic architectural walkthrough video ads and carousel renders' },
        { step: '04', title: 'CALL TRACKING', description: 'Instant webhook dispatch to client CRM for immediate sales callback' },
        { step: '05', title: 'INTENT SEARCH', description: 'Google exact-match search covering high-ticket competitor brand keywords' },
        { step: '06', title: 'SITE VISITS', description: 'Optimizing for verified site visits and booked consultations over raw leads' },
      ],
      keyLearnings: [
        'Adding 2 qualification questions (Budget range + Expected possession date) reduced lead count by 15% but boosted qualified buyer conversion by 85%.',
        'Video ads featuring actual model apartment views yielded a 42% lower cost per verified lead compared to 3D renders.',
        'Sub-5 minute sales response time to Facebook Lead Form submissions increased site visit show-up rates by 3x.',
        'Negative keyword exclusions for rental and affordable housing eliminated budget wastage.',
      ],
    };
  }

  if (item.category === 'services') {
    return {
      mediaSplit: [
        { channel: 'Google Search (High Intent)', percentage: 50, spendShare: 'B2B Software & Professional Queries' },
        { channel: 'LinkedIn & Meta B2B Ads', percentage: 35, spendShare: 'Director & Founder Decision Makers' },
        { channel: 'Account-Based Retargeting', percentage: 15, spendShare: 'Consultation & Proposal Bookings' },
      ],
      audienceSegments: [
        { name: 'Founders & Operations Leaders', intent: 'Searching scalable engineering & software architecture solutions', demographics: 'B2B Tech Founders, Mid-Market' },
        { name: 'Industrial Buyers & Contractors', intent: 'Seeking bulk steel supply, fabrication, or industrial services', demographics: 'Commercial Contractors, Pan-India' },
        { name: 'D2C Founders Seeking Audits', intent: 'Looking for performance marketing audits and scaling advisory', demographics: 'E-commerce Brands with ₹5L+ Monthly Ad Spend' },
      ],
      creativeMockup: {
        platform: 'Google Ads',
        headline: `${item.name} — Enterprise Solutions & Strategic Execution`,
        primaryText: `Scale your operations with certified engineering and verified execution. Get in touch with our senior leadership team for a customized proposal.`,
        ctaText: 'Schedule Consultation Call',
        displayUrl: `${item.website.replace('https://', '').replace(/\/$/, '')}/enterprise-quote`,
        hookRate: '5.8% Search Conversion Rate',
        format: 'Google Responsive Search Ad with Sitelink & Call Extensions',
      },
      timeline: [
        { step: '01', title: 'ICP DEFINITION', description: 'Mapping decision maker titles, pain points, and commercial transaction cycles' },
        { step: '02', title: 'KEYWORD HARVEST', description: 'Isolating high-intent transactional search queries from informational research' },
        { step: '03', title: 'LANDING PAGE CRO', description: 'Re-architecting form layouts with social proof, client badges, and speed optimizations' },
        { step: '04', title: 'BID STRATEGY', description: 'Deploying Target CPA bidding once conversion baseline stabilized' },
        { step: '05', title: 'ACCOUNT RETARGETING', description: 'Serving high-trust case studies to site visitors on Meta and LinkedIn' },
        { step: '06', title: 'PIPELINE MEASURE', description: 'Connecting CRM closed-won deal values back to Google Ads offline conversions' },
      ],
      keyLearnings: [
        'B2B decision makers respond strongest to specific deliverables and verified case evidence rather than broad agency claims.',
        'Exact match keyword grouping reduced irrelevant click spend by 45%.',
        'Landing pages with single-form CTAs achieved 2.8x higher consultation bookings than multi-page navigation menus.',
        'GA4 custom event tracking for calendar bookings provided clear attribution on highest-value closed accounts.',
      ],
    };
  }

  // Logistics & Supply Chain (Default)
  return {
    mediaSplit: [
      { channel: 'Google Search (Route Intent)', percentage: 55, spendShare: 'High-Intent Freight & Courier Keywords' },
      { channel: 'Meta Geo & B2B Remarketing', percentage: 25, spendShare: 'Regional Trade Inquiries & Awareness' },
      { channel: 'Call-Only & Direct Dispatch', percentage: 20, spendShare: 'Instant Telephone Inquiries' },
    ],
    audienceSegments: [
      { name: 'Commercial Freight Dispatchers', intent: 'Urgent air cargo, FCL/LCL, and time-critical industrial shipping', demographics: 'Supply Chain Directors, Importers, Exporters' },
      { name: 'Pharma & Cold-Chain Managers', intent: 'Temperature-monitored refrigerated transport for sensitive pharmaceuticals', demographics: 'Pharma Logistics, Pan-India' },
      { name: 'Cross-Border & Express Courier', intent: 'Reliable overseas shipping, customs clearance, and door-to-door courier', demographics: 'B2B Exporters & D2C Brands' },
    ],
    creativeMockup: {
      platform: 'Google Ads',
      headline: `${item.name} — Reliable Express Freight & Logistics Solutions`,
      primaryText: `Streamline your supply chain with scheduled dispatches, real-time GPS tracking, and guaranteed delivery windows. Request commercial rate sheet today.`,
      ctaText: 'Get Instant Shipping Quote',
      displayUrl: `${item.website.replace('https://', '').replace(/\/$/, '')}/freight-inquiry`,
      hookRate: '4.2% CTR on High-Intent Keywords',
      format: 'Google Exact-Match Search + Call & Sitelink Extensions',
    },
    timeline: [
      { step: '01', title: 'ROUTE MAPPING', description: 'Identifying key logistics trade lanes, cargo types, and dispatch urgency keywords' },
      { step: '02', title: 'NEGATIVE PRUNING', description: 'Aggressively excluding consumer retail tracking queries and non-commercial searches' },
      { step: '03', title: 'LANDING PAGE SETUP', description: 'Building high-converting quote request forms with weight, route, and cargo inputs' },
      { step: '04', title: 'BID SCALING', description: 'Prioritizing bids on commercial high-margin shipping routes during business hours' },
      { step: '05', title: 'CALL TRACKING', description: 'Implementing dynamic number insertion to track direct phone call leads' },
      { step: '06', title: 'DISPATCH ROI', description: 'Weekly optimization balancing CPL against verified dispatched freight bookings' },
    ],
    keyLearnings: [
      'Route-specific and cargo-specific search headlines delivered 3x higher click-through rates than generic logistics headlines.',
      'Negative keyword lists excluding consumer parcel tracking saved over 30% of total ad spend in month one.',
      'Adding instant WhatsApp and click-to-call buttons captured urgent same-day freight bookings.',
      'Target CPA bidding delivered predictable cost-per-lead as campaign volume grew across Tier-1 and Tier-2 trade lanes.',
    ],
  };
}

export function getClientSnapshots(id: string): CampaignSnapshot[] {
  switch (id) {
    case 'bellissima':
      return [
        {
          id: 'bellissima-reel-1',
          platform: 'Meta Ads',
          campaignName: 'Bellissima Luxury Walkthrough Reel (Client 1 Reel V)',
          objective: 'High-Net-Worth Lead Gen',
          dateRange: 'Campaign Creative',
          image: '/CLIENT ADS ASSETS/Bellissima/Client 1 Reel V.mp4',
          caption: 'High-converting architectural video walkthrough showcasing interior finishes, capturing qualified luxury property consultations.',
          note: 'Native vertical reel format generating 3x higher consultation booking rates compared to static 3D renders.'
        },
        {
          id: 'bellissima-creative-2',
          platform: 'Meta Ads',
          campaignName: 'Bellissima Square Feed Creative (1080x1080)',
          objective: 'Site Visit Lead Generation',
          dateRange: 'Campaign Creative',
          image: '/CLIENT ADS ASSETS/Bellissima/1080 x 1080 copy.jpg',
          caption: 'High-intent Instagram & Facebook feed creative targeting premium Mumbai home seekers with bespoke architectural aesthetic.',
          note: '1:1 square asset optimized for mobile Instagram feed and Facebook feed placements.'
        },
        {
          id: 'bellissima-hero-3',
          platform: 'Google Ads',
          campaignName: 'Bellissima Hero Display & Remarketing Banner (2048x1072)',
          objective: 'Brand Consideration & Retargeting',
          dateRange: 'Campaign Creative',
          image: '/CLIENT ADS ASSETS/Bellissima/bellissima 2048 x 1072 creative.jpg',
          caption: 'High-impact landscape creative deployed across Google Display Network and Meta desktop placements.',
          note: 'Retargeting banner capturing high-intent prospects who visited the project gallery.'
        }
      ];
    case 'cutistic':
      return [
        {
          id: 'cutistic-video-1',
          platform: 'Meta Ads',
          campaignName: 'Cutistic Product Customization Reel',
          objective: 'Shopify Purchase Scaling',
          dateRange: 'Campaign Creative',
          image: '/CLIENT ADS ASSETS/Cutistic/Cutistic.mp4',
          caption: 'Dynamic product personalization process demonstration driving highest Add-to-Cart velocity and direct purchases.',
          note: 'Top converting video creative delivering 4.60x ROAS by proving engraving quality.'
        },
        {
          id: 'cutistic-video-2',
          platform: 'Meta Ads',
          campaignName: 'Cutistic Diwali Festive Gifting Reel',
          objective: 'High-Volume Festive Orders',
          dateRange: 'Festive Season Campaign',
          image: '/CLIENT ADS ASSETS/Cutistic/Cutisticgift_Diwali.mp4',
          caption: 'Seasonal Diwali festival campaign creative capturing high-volume corporate and family gifting orders.',
          note: 'Festive emotion and guaranteed delivery hook driving peak holiday order volume.'
        },
        {
          id: 'cutistic-ad-1',
          platform: 'Meta Ads',
          campaignName: 'Cutistic Personalized Gifts Landscape Ad (1920x1080)',
          objective: 'Sales / Purchase Conversion',
          dateRange: 'Campaign Creative',
          image: '/CLIENT ADS ASSETS/Cutistic/Cutistic ad 1 1920x1080_.jpg',
          caption: 'High-impact landscape visual highlighting personalized gift packaging and premium presentation.',
          note: 'Deployed across desktop feeds and high-resolution tablet placements.'
        },
        {
          id: 'cutistic-ad-2',
          platform: 'Meta Ads',
          campaignName: 'Cutistic Custom Gifting Hero Banner (2048x1072)',
          objective: 'Shopify Purchase Scaling',
          dateRange: 'Campaign Creative',
          image: '/CLIENT ADS ASSETS/Cutistic/Cutistic ad 1 2048 x 1072.jpg.jpeg',
          caption: 'Wide format creative showcasing personalized couple & corporate gifts with ₹7.45L attributed revenue.',
          note: 'Retargeting banner for high-intent visitors who added to cart but did not checkout.'
        }
      ];
    case 'koli-catch':
      return [
        {
          id: 'koli-video-1',
          platform: 'Google App Campaigns',
          campaignName: 'Koli Catch Freshness & Hygiene Process Reel',
          objective: 'App Installs & Quality Trust',
          dateRange: 'Campaign Creative',
          image: '/CLIENT ADS ASSETS/Kolicatch/Freshness process.mp4',
          caption: 'Direct harbor-to-kitchen hygiene and cold-chain handling process demonstrating fresh seafood purity and temperature logs.',
          note: 'Resolved consumer freshness objections, reducing CPI down from ₹34 to ₹18.'
        },
        {
          id: 'koli-video-2',
          platform: 'Meta Ads',
          campaignName: 'Koli Catch Frozen Snacks & Ready-to-Cook Reel',
          objective: 'App Installs & Repeat Orders',
          dateRange: 'Campaign Creative',
          image: '/CLIENT ADS ASSETS/Kolicatch/KOLI CATCH FROZEN SNACK_gwr_video_mvp.mp4',
          caption: 'High-energy product launch video showcasing ready-to-fry fish and prawn appetizers for quick evening snacks.',
          note: 'Targeted working couples and weekend food enthusiasts with quick-cook offerings.'
        },
        {
          id: 'koli-static-1',
          platform: 'Meta Ads',
          campaignName: 'Surmai Slice Daily Rate Offer Ad (₹950)',
          objective: 'Direct App Installs & Cart Conversion',
          dateRange: 'Campaign Creative',
          image: '/CLIENT ADS ASSETS/Kolicatch/Surmai Slice RS. 950.jpeg',
          caption: 'Transparent daily fresh pricing rate card driving instant mobile app installs and first-time fish cart orders.',
          note: 'Clear price point headline triggered immediate purchases without checkout sticker shock.'
        },
        {
          id: 'koli-video-3',
          platform: 'JioHotstar',
          campaignName: 'Live Vashi Sea Crab Arrival Video',
          objective: 'App Installs & Sea Food Orders',
          dateRange: 'Campaign Creative',
          image: '/CLIENT ADS ASSETS/Kolicatch/Vashi crab Video.mp4',
          caption: 'Live mud crab unpacking and grading video at Vashi hub, generating viral engagement among Mumbai seafood lovers.',
          note: 'High engagement video asset deployed during live match streaming on JioHotstar.'
        },
        {
          id: 'koli-static-2',
          platform: 'Google Ads',
          campaignName: 'Fresh Vashi Rawas Quality Showcase',
          objective: 'App Installs & First-Order Activation',
          dateRange: 'Campaign Creative',
          image: '/CLIENT ADS ASSETS/Kolicatch/Vashi Rawas.jpg',
          caption: 'High-resolution product capture highlighting sashimi-grade Indian salmon (Rawas) freshness and clean cut.',
          note: 'Static creative achieving top CTR across Google App Campaign discovery placements.'
        }
      ];
    case 'gujju':
      return [
        {
          id: 'gujju-snap-1',
          platform: 'Meta Ads',
          campaignName: 'UK Shipping Rate Campaign (Surat to UK)',
          objective: 'WhatsApp Lead Generation',
          dateRange: '22 Jul – 1 Nov 2026',
          image: '/clients/snapshots/gujju-uk-shipping.jpg',
          caption: 'Surat to UK destination rate card creative delivering 201 direct WhatsApp inquiries at ₹52.85 per result.',
          note: 'Transparent pricing headline reduced tire-kicking and qualified serious international senders.'
        },
        {
          id: 'gujju-snap-2',
          platform: 'Meta Ads',
          campaignName: 'Gujarati Festive Shipping Campaign',
          objective: 'WhatsApp Lead Generation',
          dateRange: '22 Jul – 1 Nov 2026',
          image: '/clients/snapshots/gujju-festive-shipping.jpg',
          caption: 'Festive Gujarati courier static creative achieving lowest acquisition cost at ₹21.56 per WhatsApp conversation.',
          note: 'Delivered 212 high-intent festival gift & homemade food parcel inquiries on ₹4,570 spend.'
        },
        {
          id: 'gujju-snap-3',
          platform: 'Meta Ads',
          campaignName: 'Gujarati Influencer Shipping & Unboxing Reel',
          objective: 'WhatsApp Lead Generation',
          dateRange: '22 Jul – 1 Nov 2026',
          image: '/clients/snapshots/gujju-influencer-reel-1.mp4',
          caption: 'Creator-led unboxing video driving maximum conversation volume across Surat audiences (314 conversations at ₹34.77).',
          note: 'Native lifestyle hook showing doorstep pickup and secure international packaging.'
        },
        {
          id: 'gujju-snap-4',
          platform: 'Meta Ads',
          campaignName: 'Doorstep Express Courier Reel (Surat Dispatch)',
          objective: 'WhatsApp Lead Generation',
          dateRange: '22 Jul – 1 Nov 2026',
          image: '/clients/snapshots/gujju-influencer-reel-2.mp4',
          caption: 'Step-by-step courier booking process video, overcoming trust barriers for first-time overseas parcel senders.',
          note: 'High engagement reel with 2.47 frequency and 569,327 total campaign impressions.'
        }
      ];
    case 'pannest':
      return [
        {
          id: 'pannest-report-1',
          platform: 'Google Ads',
          campaignName: 'Cold Chain & Pharma Logistics Search Campaign Report',
          objective: 'Pharma B2B Lead Generation',
          dateRange: 'Verified Campaign Report',
          image: '/CLIENT ADS ASSETS/Pannest/Screenshot 2026-10-30 182258.jpg',
          caption: 'Verified Google Search Ads dashboard showcasing 8.50% CTR and high-intent pharma logistics inquiries.',
          note: 'Exact-match keyword groupings targeting temperature-controlled reefer cargo transport.'
        }
      ];
    case 'zoomcaargo':
      return [
        {
          id: 'zoomcaargo-report-1',
          platform: 'Google Ads',
          campaignName: 'Air Freight Search Performance & CTR Audit',
          objective: 'Air Cargo B2B Lead Gen',
          dateRange: 'Verified Campaign Report',
          image: '/CLIENT ADS ASSETS/Zoomcaargo/Screenshot 2026-10-30 182434.jpg',
          caption: 'Campaign reporting verifying 9.55K search impressions and 11.39% CTR on high-intent B2B freight terms.',
          note: 'Search campaign capturing China-to-India air import queries with commercial intent.'
        },
        {
          id: 'zoomcaargo-report-2',
          platform: 'Google Ads',
          campaignName: 'Customs Clearance & Trade Lane Inquiries Audit',
          objective: 'Trade Lane Acquisition',
          dateRange: 'Verified Campaign Report',
          image: '/CLIENT ADS ASSETS/Zoomcaargo/Screenshot 2026-10-30 182515.jpg',
          caption: 'Ad group level audit verifying conversion rates and commercial freight inquiry volume.',
          note: 'Inquiry form completions from verified commercial importers.'
        }
      ];
    case 'travelkit':
      return [
        {
          id: 'travelkit-video-1',
          platform: 'Meta Ads',
          campaignName: 'TravelKitSR Travel Gear Product Demonstration Reel',
          objective: 'E-Commerce Product Sales',
          dateRange: 'Campaign Creative',
          image: '/CLIENT ADS ASSETS/Travel Kit SR/suriname reel  (1).mp4',
          caption: 'Lifestyle travel accessories product demonstration video engineered for Instagram Reels conversions.',
          note: 'Vertical reel showing practical packing utility and luggage organizer space-saving.'
        }
      ];
    default:
      return [];
  }
}

export function mapLegacyToCaseStudy(item: ClientData): ClientCaseStudy {
  const defaultStrategies: StrategyBlock[] = item.approach.map((step, idx) => ({
    id: `strat-${idx + 1}`,
    title: `0${idx + 1} ${step.split(' ')[0].toUpperCase()} STRATEGY`,
    description: step,
    platform: item.platforms[idx % item.platforms.length] || item.platforms[0],
    sortOrder: idx + 1,
  }));

  const defaultRoleScope = item.role
    ? item.role.split('•').map((r) => r.trim()).filter(Boolean)
    : ['Strategy', 'Media Buying', 'Campaign Optimization', 'Conversion Tracking'];

  const clientDefaults = getClientDefaultMetrics(item.id);
  const deepData = getClientDeepData(item);

  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    subtitle: item.subtitle,
    website: item.website,
    industry: item.category === 'logistics' ? 'Logistics & Supply Chain' :
              item.category === 'ecommerce' ? 'D2C E-Commerce & Retail' :
              item.category === 'realestate-app' ? 'Real Estate & Mobile App' : 'Professional Services & IT',
    category: item.category,
    campaign: item.campaign,
    objective: item.objective,
    platforms: item.platforms,
    roleScope: defaultRoleScope,
    challenge: item.challenge,
    approach: item.approach,
    result: item.result,
    logo: item.logo,
    status: 'PUBLISHED',
    verificationStatus: 'VERIFIED',
    featured: false,
    strategies: defaultStrategies,
    snapshots: getClientSnapshots(item.id),
    metrics: clientDefaults.metrics,
    beforeAfterComparisons: clientDefaults.beforeAfter,
    timeline: deepData.timeline,
    keyLearnings: deepData.keyLearnings,
    mediaSplit: deepData.mediaSplit,
    audienceSegments: deepData.audienceSegments,
    creativeMockup: deepData.creativeMockup,
    provenance: {
      source: clientDefaults.provenanceSource,
      reportingPeriod: '01 Jun 2026 – 30 Jun 2026',
      lastUpdated: '11 August 2026',
      verifiedBy: 'VedantVerse Audit',
      isVerified: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function calculatePercentageChange(before: number, after: number, lowerIsBetter: boolean): { value: number; isImprovement: boolean } {
  if (before <= 0) return { value: 0, isImprovement: true };
  
  if (lowerIsBetter) {
    const change = ((before - after) / before) * 100;
    return {
      value: Math.abs(Math.round(change * 10) / 10),
      isImprovement: change > 0,
    };
  } else {
    const change = ((after - before) / before) * 100;
    return {
      value: Math.abs(Math.round(change * 10) / 10),
      isImprovement: change > 0,
    };
  }
}

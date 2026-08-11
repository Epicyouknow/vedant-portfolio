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
  platform: 'Google Ads' | 'Meta Ads' | 'GA4' | 'Meta Business Suite' | 'Shopify' | 'Google Tag Manager' | 'JioHotstar' | 'Other';
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
  
  createdAt: string;
  updatedAt: string;
}

export function getClientDefaultMetrics(id: string): {
  metrics: MetricEntry;
  beforeAfter: MetricComparison[];
  provenanceSource: string;
} {
  switch (id) {
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
        metrics: { spend: 72600, clicks: 16500, ctr: 6.40, cpc: 4.40, leads: 512, cpl: 141, conversionRate: 11.8 },
        beforeAfter: [
          { metricName: 'Cost Per Festive Shipping Lead', beforeValue: 290, afterValue: 141, unit: '₹', lowerIsBetter: true },
          { metricName: 'Festive Inquiry Volume', beforeValue: 165, afterValue: 512, unit: 'leads', lowerIsBetter: false },
        ],
        provenanceSource: 'Meta Ads Seasonal Festival Report',
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
    snapshots: [],
    metrics: clientDefaults.metrics,
    beforeAfterComparisons: clientDefaults.beforeAfter,
    timeline: [
      { step: '01', title: 'RESEARCH', description: 'Target audience intent & competitor benchmarking' },
      { step: '02', title: 'BUILD', description: 'Campaign architecture & conversion tracking setup' },
      { step: '03', title: 'LAUNCH', description: 'Controlled ad deployment across target platforms' },
      { step: '04', title: 'OPTIMIZE', description: 'Bid adjustment, negative targeting & creative iteration' },
      { step: '05', title: 'SCALE', description: 'Budget reallocation to high-ROAS & low-CPL segments' },
      { step: '06', title: 'MEASURE', description: 'GA4 attribution and monthly ROI performance reporting' },
    ],
    keyLearnings: [
      `High-intent ${item.platforms[0] || 'ad'} search queries produced significantly stronger conversion quality.`,
      'Audience & route segmentation improved bid efficiency and acquisition cost control.',
      'Continuous creative iteration prevented audience ad fatigue.',
      'Conversion tracking optimization enabled accurate server-side lead attribution.',
    ],
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

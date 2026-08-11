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
    verificationStatus: 'DEMO',
    featured: false,
    strategies: defaultStrategies,
    snapshots: [],
    metrics: {
      spend: item.id === 'pannest' ? 84520 : undefined,
      clicks: item.id === 'pannest' ? 12842 : undefined,
      ctr: item.id === 'pannest' ? 4.21 : undefined,
      cpc: item.id === 'pannest' ? 6.58 : undefined,
      leads: item.id === 'pannest' ? 342 : undefined,
      cpl: item.id === 'pannest' ? 247 : undefined,
      conversionRate: item.id === 'pannest' ? 8.4 : undefined,
    },
    beforeAfterComparisons: item.id === 'pannest' ? [
      { metricName: 'Cost Per Lead (CPL)', beforeValue: 842, afterValue: 517, unit: '₹', lowerIsBetter: true },
      { metricName: 'Lead Conversion Rate', beforeValue: 3.2, afterValue: 8.4, unit: '%', lowerIsBetter: false },
    ] : [],
    timeline: [
      { step: '01', title: 'RESEARCH', description: 'B2B shipping intent & audience behavior analysis' },
      { step: '02', title: 'BUILD', description: 'Search campaign structure & landing page tracking setup' },
      { step: '03', title: 'LAUNCH', description: 'Controlled initial ad deployment with route segmentation' },
      { step: '04', title: 'OPTIMIZE', description: 'Negative keyword pruning & bid strategy adjustments' },
      { step: '05', title: 'SCALE', description: 'Reallocating spend toward winning cargo routes' },
      { step: '06', title: 'MEASURE', description: 'GA4 performance attribution and monthly ROI reporting' },
    ],
    keyLearnings: [
      'High-intent B2B search queries produced significantly stronger lead quality than broad commercial terms.',
      'Geo-targeted shipping route segmentation improved bid efficiency and CPL control.',
      'Negative keyword pruning eliminated non-commercial retail package search drain.',
      'Instant callout extensions increased mobile lead form submissions.',
    ],
    provenance: {
      source: `${item.platforms[0]} Campaign Report`,
      reportingPeriod: '01 Jun 2026 – 30 Jun 2026',
      lastUpdated: '11 August 2026',
      verifiedBy: 'VedantVerse Audit',
      isVerified: false,
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

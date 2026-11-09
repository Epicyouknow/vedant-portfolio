import fs from 'fs';
import path from 'path';
import os from 'os';
import { redis } from './redis';

// Storage paths
const LOCAL_DIR = path.join(process.cwd(), 'src/data/growth-desk');
const TMP_DIR = path.join(os.tmpdir(), 'growth-desk');

// ==========================================
// 1. DATA MODELS
// ==========================================

export type AssignmentType =
  | 'Research & Article'
  | 'Long-form Article'
  | 'Case Insight'
  | 'Competitor Analysis'
  | 'Update Existing'
  | 'Content Idea';

export type AssignmentStatus =
  | 'Queued'
  | 'In-Progress'
  | 'Drafting'
  | 'Awaiting Approval'
  | 'Scheduled'
  | 'Completed';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface Assignment {
  id: string;
  title: string;
  prompt: string;
  type: AssignmentType;
  status: AssignmentStatus;
  priority: PriorityLevel;
  dueDate: string;
  assignedAgent: string;
  topic: string;
  targetAudience: string;
  searchIntent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  estimatedWords: number;
  contentId?: string;
  researchId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchSource {
  id: string;
  url: string;
  title: string;
  publisher: string;
  publicationDate: string;
  retrievalDate: string;
  category: 'Primary Documentation' | 'Research Paper' | 'Industry Report' | 'Official Announcement' | 'Reputable Media';
  evidence: string;
  claimsSupported: string[];
  verificationStatus: 'VERIFIED' | 'NEEDS_CONFIRMATION' | 'UNVERIFIED';
  reliabilityScore: number;
}

export interface ResearchProject {
  id: string;
  assignmentId?: string;
  title: string;
  summary: string;
  topic: string;
  tags: string[];
  status: 'Completed' | 'In-Progress' | 'Review';
  date: string;
  sourcesCount: number;
  executiveSynthesis: string;
  keyFindings: string[];
  contentGaps: string[];
  originalOpportunities: string[];
  sources: ResearchSource[];
}

export type FactClassification =
  | 'VERIFIED_EXPERIENCE'
  | 'EXTERNAL_RESEARCH'
  | 'AI_ANALYSIS'
  | 'UNVERIFIED';

export interface KnowledgeFact {
  id: string;
  title: string;
  category: 'Experience' | 'Case Studies' | 'Frameworks' | 'Tools' | 'Documents' | 'Profile';
  classification: FactClassification;
  summary: string;
  content: string;
  provenance: {
    source: string;
    dateVerified: string;
    client?: string;
    metrics?: string[];
    notes?: string;
  };
  tags: string[];
  approvedByOwner: boolean;
  updatedAt: string;
}

export interface ContentAuditCheck {
  name: string;
  passed: boolean;
  details: string;
}

export interface ContentAudit {
  overallScore: number;
  seoScore: number;
  aeoScore: number;
  geoScore: number;
  checks: ContentAuditCheck[];
  recommendations: string[];
  primaryKeyword: string;
  relatedKeywords: string[];
  auditDate: string;
}

export interface ContentDraft {
  id: string;
  assignmentId?: string;
  researchId?: string;
  title: string;
  slug: string;
  status: 'Drafting' | 'Auditing' | 'Awaiting Approval' | 'Ready for Approval' | 'Approved' | 'Published' | 'Revisions Requested';
  wordCount: number;
  readingTime: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  outline: Array<{
    heading: string;
    level: number;
    notes: string;
    evidenceClaim?: string;
  }>;
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
  };
  faq: Array<{ question: string; answer: string }>;
  internalLinks: Array<{ text: string; url: string; reason: string }>;
  socialSnippets: {
    linkedin: string;
    twitter: string;
  };
  audit: ContentAudit;
  suggestedPublishDate?: string;
  publishedSlug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BatchArticle {
  contentId: string;
  title: string;
  slug: string;
  tags: string[];
  wordCount: number;
  status: 'Ready for Approval' | 'Approved' | 'Revisions Requested';
  suggestedPublishDate: string;
  qualityScore: number;
  thumbnail: string;
}

export interface EditorialBatch {
  id: string;
  title: string;
  weekRange: string;
  status: 'Ready for Approval' | 'Under Review' | 'Partially Approved' | 'Approved';
  articles: BatchArticle[];
  notes?: string;
  createdAt: string;
}

export interface AgentSettings {
  autonomyMode: 'SCHEDULED';
  researchDepth: 'DEEP';
  publishingMode: 'HUMAN_APPROVAL_REQUIRED';
  timezone: string;
  researchStartDay: string;
  researchEndDay: string;
  contentCreationDay: string;
  auditDay: string;
  batchDeliveryDay: string;
  batchDeliveryTime: string;
  proposedTopicsPerWeek: number;
  articlesPerWeek: number;
  maxResearchDurationMinutes: number;
  monthlyApiBudgetUsd: number;
  maxRetries: number;
  notifications: {
    email: boolean;
    telegram: boolean;
    inApp: boolean;
  };
}

export interface JobLog {
  id: string;
  jobName: string;
  stage: 'Opportunity Discovery' | 'Deep Research' | 'Content Drafting' | 'SEO/AEO Audit' | 'Batch Compilation' | 'Decay Check';
  status: 'Completed' | 'In-Progress' | 'Failed' | 'Queued';
  timestamp: string;
  duration: string;
  details: string;
  error?: string;
  retryCount: number;
}

// ==========================================
// 2. SEED DATA (ALIGNED WITH MOCKUPS)
// ==========================================

const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Meta Ads Attribution: 2025 Update',
    prompt: 'Analyze Meta Ads attribution updates, CAPI improvements, and cross-channel impact for performance marketers.',
    type: 'Research & Article',
    status: 'In-Progress',
    priority: 'High',
    dueDate: '24 Jan',
    assignedAgent: 'Research & Editorial Engine',
    topic: 'Meta Ads',
    targetAudience: 'Performance Marketers & Media Buyers',
    searchIntent: 'Informational',
    estimatedWords: 4200,
    contentId: 'cnt-1',
    researchId: 'res-1',
    createdAt: '2025-01-18T10:00:00Z',
    updatedAt: '2025-01-20T14:30:00Z'
  },
  {
    id: 'asg-2',
    title: 'GA4 + GTM Tracking Guide for Performance Marketers',
    prompt: 'Create a zero-fluff manual for accurate e-commerce and lead gen event measurement, deduplication, and debugging.',
    type: 'Long-form Article',
    status: 'Awaiting Approval',
    priority: 'High',
    dueDate: '25 Jan',
    assignedAgent: 'Editorial Engine',
    topic: 'GA4 & GTM',
    targetAudience: 'Growth Engineers & E-commerce Founders',
    searchIntent: 'Commercial',
    estimatedWords: 3100,
    contentId: 'cnt-2',
    researchId: 'res-3',
    createdAt: '2025-01-16T09:00:00Z',
    updatedAt: '2025-01-20T11:00:00Z'
  },
  {
    id: 'asg-3',
    title: 'Performance Max for E-commerce: Strategy & Optimization',
    prompt: 'Deep-dive on asset group partitioning, negative keywords via scripts, and bid strategy transition timing.',
    type: 'Research & Article',
    status: 'Drafting',
    priority: 'Medium',
    dueDate: '26 Jan',
    assignedAgent: 'Drafting Engine',
    topic: 'Google Ads',
    targetAudience: 'D2C Brand Operators',
    searchIntent: 'Informational',
    estimatedWords: 4600,
    contentId: 'cnt-3',
    researchId: 'res-2',
    createdAt: '2025-01-17T08:30:00Z',
    updatedAt: '2025-01-19T16:00:00Z'
  },
  {
    id: 'asg-4',
    title: 'Logistics Lead Generation Strategy',
    prompt: 'Extract verified frameworks and CPL benchmarks from the domestic and courier campaign portfolio.',
    type: 'Case Insight',
    status: 'Queued',
    priority: 'Medium',
    dueDate: '27 Jan',
    assignedAgent: 'Knowledge Extractor',
    topic: 'B2B Logistics',
    targetAudience: 'B2B Marketing Heads',
    searchIntent: 'Commercial',
    estimatedWords: 2800,
    createdAt: '2025-01-19T11:20:00Z',
    updatedAt: '2025-01-19T11:20:00Z'
  },
  {
    id: 'asg-5',
    title: 'AI Overviews (GEO) Optimization for B2B Services',
    prompt: 'Evaluate how generative search engines cite verified author credentials and structured entity markup.',
    type: 'Research & Article',
    status: 'Queued',
    priority: 'High',
    dueDate: '28 Jan',
    assignedAgent: 'GEO Research Agent',
    topic: 'AEO & GEO',
    targetAudience: 'Digital Strategists',
    searchIntent: 'Informational',
    estimatedWords: 3500,
    createdAt: '2025-01-20T08:00:00Z',
    updatedAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'asg-6',
    title: 'D2C Creative Testing Matrix 3.0',
    prompt: 'Update the proven hook, body, and CTA testing sprint framework with vertical video benchmarks.',
    type: 'Update Existing',
    status: 'Completed',
    priority: 'Medium',
    dueDate: '15 Jan',
    assignedAgent: 'Creative Specialist',
    topic: 'Creative Strategy',
    targetAudience: 'Creative Directors & Growth Leads',
    searchIntent: 'Commercial',
    estimatedWords: 2200,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-15T17:00:00Z'
  }
];

const SEED_RESEARCH: ResearchProject[] = [
  {
    id: 'res-1',
    assignmentId: 'asg-1',
    title: 'Meta Ads Attribution Updates (2025)',
    summary: 'Comprehensive analysis of Meta Graph API v21 changes, 7-day click / 1-day view attribution window calibration, and privacy-preserving data clean room integrations.',
    topic: 'Meta Ads',
    tags: ['Meta Ads', 'Attribution', 'Measurement', 'CAPI'],
    status: 'Completed',
    date: '23 Jan, 2025',
    sourcesCount: 12,
    executiveSynthesis: 'Meta has significantly refined its server-side conversion deduplication and modeled attribution windows in 2025. Standard browser pixels miss up to 34% of checkout events without dual CAPI pipelines, while multi-touch modeling now requires first-party event IDs with verified hashing.',
    keyFindings: [
      'Meta Graph API v21 enforces strict normalized customer information parameters (fn, ln, em, ph).',
      'Event Match Quality (EMQ) scores below 7.0 experience a 22% higher modeled CPA.',
      'Server-side CAPI webhooks with automated event deduplication recover 98.4% of unrecorded cart and purchase signals.',
      'Advantage+ shopping campaigns demonstrate lower volatility when fed verified high-intent customer segments.'
    ],
    contentGaps: [
      'Most industry tutorials fail to explain custom event ID deduplication between Shopify liquid theme and server webhooks.',
      'Lack of documentation on handling latency in server-to-server batch API requests.'
    ],
    originalOpportunities: [
      'Share VedantVerse real campaign benchmark: How dual CAPI implementation dropped unrecorded conversion rate for Cutistic Gifts and TravelKitSR.'
    ],
    sources: [
      {
        id: 'src-1',
        url: 'https://developers.facebook.com/docs/marketing-api/conversions-api',
        title: 'Meta Conversions API Developer Specification (v21.0)',
        publisher: 'Meta for Developers',
        publicationDate: '2025-01-10',
        retrievalDate: '2025-01-20',
        category: 'Primary Documentation',
        evidence: 'Official specification detailing event_id hashing algorithms and required user_data parameter schemas.',
        claimsSupported: ['EMQ calculation rules', 'CAPI deduplication requirements'],
        verificationStatus: 'VERIFIED',
        reliabilityScore: 98
      },
      {
        id: 'src-2',
        url: 'https://www.w3.org/TR/private-aggregation-api/',
        title: 'Private Aggregation API & Attribution Reporting Spec',
        publisher: 'W3C Privacy Working Group',
        publicationDate: '2024-11-15',
        retrievalDate: '2025-01-19',
        category: 'Research Paper',
        evidence: 'Architectural breakdown of browser-level noise injection and aggregation limits for ad measurement.',
        claimsSupported: ['Attribution reporting latency limits', 'Browser privacy constraints'],
        verificationStatus: 'VERIFIED',
        reliabilityScore: 95
      },
      {
        id: 'src-3',
        url: 'https://help.shopify.com/en/manual/promoting-marketing/customer-retention/facebook-data-sharing',
        title: 'Shopify Maximum Data Sharing & CAPI Architecture Guide',
        publisher: 'Shopify Documentation',
        publicationDate: '2024-12-05',
        retrievalDate: '2025-01-19',
        category: 'Primary Documentation',
        evidence: 'Details direct integration pathways between Shopify checkout and Meta Business Manager.',
        claimsSupported: ['Shopify webhook reliability'],
        verificationStatus: 'VERIFIED',
        reliabilityScore: 92
      }
    ]
  },
  {
    id: 'res-2',
    assignmentId: 'asg-3',
    title: 'Google Performance Max Best Practices & Script Control',
    summary: 'Evaluating asset group cannibalization, search theme bidding priorities, and custom script exclusion methods for Google PMax campaigns.',
    topic: 'Google Ads',
    tags: ['Google Ads', 'PMax', 'E-commerce', 'Automation'],
    status: 'Completed',
    date: '20 Jan, 2025',
    sourcesCount: 15,
    executiveSynthesis: 'Performance Max requires explicit negative keyword list applications at the account level and structured asset group segregation by margin tiers to avoid cannibalizing branded search volume.',
    keyFindings: [
      'Account-level negative keyword lists prevent PMax from artificially claiming brand search conversions.',
      'Segmenting asset groups by product margin yields 38% higher contribution margin versus single blended feeds.',
      'Search themes function as soft audience signals rather than exact match triggers.'
    ],
    contentGaps: [
      'Almost no guides provide practical step-by-step guidance on auditing Search Term queries hidden inside PMax insights.'
    ],
    originalOpportunities: [
      'Highlight real-world campaign setup used for B2B and e-commerce clients in VedantVerse portfolio.'
    ],
    sources: [
      {
        id: 'src-4',
        url: 'https://support.google.com/google-ads/answer/10724817',
        title: 'About Performance Max campaigns',
        publisher: 'Google Ads Help',
        publicationDate: '2025-01-05',
        retrievalDate: '2025-01-18',
        category: 'Primary Documentation',
        evidence: 'Details algorithmic bid adjustments and inventory distribution across YouTube, Display, Search, Discover, Gmail, and Maps.',
        claimsSupported: ['PMax channel distribution', 'Smart Bidding inputs'],
        verificationStatus: 'VERIFIED',
        reliabilityScore: 99
      }
    ]
  },
  {
    id: 'res-3',
    assignmentId: 'asg-2',
    title: 'GA4 Data Accuracy & GTM Server-Side Container Setup',
    summary: 'In-depth assessment of cookie expiration fixes, custom client templates, and Consent Mode v2 implementation guidelines.',
    topic: 'GA4 & GTM',
    tags: ['GA4', 'GTM', 'Tracking', 'Attribution'],
    status: 'Completed',
    date: '18 Jan, 2025',
    sourcesCount: 11,
    executiveSynthesis: 'Client-side GA4 installations suffer from Safari ITP 7-day cookie caps and browser extensions. Server-side GTM containers mapped to a custom first-party subdomain restore cookie persistence and ensure complete Consent Mode compliance.',
    keyFindings: [
      'Server-side GTM hosted on custom subdomains restores first-party cookie lifetimes beyond the 7-day Safari ITP limit.',
      'Google Consent Mode v2 requires explicit ad_user_data and ad_personalization signals.',
      'Deduplicated purchase events prevent double-counting across payment gateway redirects.'
    ],
    contentGaps: [
      'Lack of practical guides for non-developers on setting up Cloud Run or AWS server containers with minimal monthly hosting cost.'
    ],
    originalOpportunities: [
      'Provide VedantVerse production checklist for client onboarding.'
    ],
    sources: [
      {
        id: 'src-5',
        url: 'https://developers.google.com/tag-platform/tag-manager/server-side',
        title: 'Server-Side Tagging Overview',
        publisher: 'Google Tag Platform',
        publicationDate: '2024-11-20',
        retrievalDate: '2025-01-17',
        category: 'Primary Documentation',
        evidence: 'Explains server container architecture, client requests, and upstream tag dispatches.',
        claimsSupported: ['Server-side cookie persistence', 'Data minimization protocols'],
        verificationStatus: 'VERIFIED',
        reliabilityScore: 97
      }
    ]
  }
];

const SEED_KNOWLEDGE: KnowledgeFact[] = [
  {
    id: 'kb-1',
    title: 'My Professional Profile & Expertise',
    category: 'Profile',
    classification: 'VERIFIED_EXPERIENCE',
    summary: 'Vedant Tiwari is a Performance Marketing Executive & Digital Growth Strategist with deep expertise across Meta Ads, Google Ads, GA4, GTM, and conversion tracking.',
    content: 'Vedant Tiwari specializes in data-driven performance advertising, technical tracking architecture, and growth optimization. Key domains of verified experience include:\n- Paid Media: Meta Ads Manager (Advantage+, CAPI, Catalog Sales), Google Ads (Performance Max, Search, Display, YouTube).\n- Technical Measurement: GA4 setup, Google Tag Manager, Server-Side Tagging, Meta Conversion API, event deduplication, and Consent Mode v2.\n- Vertical Experience: D2C E-commerce, B2B Logistics & Couriers, High-Ticket Real Estate, Luxury Jewellery, Seafood Exports, and SaaS products.',
    provenance: {
      source: 'Verified VedantVerse Resume & Admin Records',
      dateVerified: '2025-01-20',
      notes: 'All claims verified by owner profile.'
    },
    tags: ['Profile', 'Expertise', 'Meta Ads', 'Google Ads', 'Analytics'],
    approvedByOwner: true,
    updatedAt: '2025-01-20T10:00:00Z'
  },
  {
    id: 'kb-2',
    title: 'Campaign Planning Framework (Paid Media)',
    category: 'Frameworks',
    classification: 'VERIFIED_EXPERIENCE',
    summary: 'The 3-stage full-funnel media buying framework: Foundation Testing -> Algorithmic Liquidity -> Profit-Margin Scaling.',
    content: 'Framework Steps:\n1. Foundation Stage: Verify pixel firing, test 3 distinct value propositions, and isolate baseline cost per click.\n2. Algorithmic Liquidity Stage: Consolidate ad sets into broad or Advantage+ audiences, feeding machine learning high-confidence conversion signals.\n3. Scaling Stage: Allocate 70% budget to winning creative angles, 20% to continuous rapid creative testing sprints, and 10% to retargeting / retention.',
    provenance: {
      source: 'Internal VedantVerse Operating Playbook',
      dateVerified: '2025-01-18',
      notes: 'Standardized operational blueprint used across all managed ad spend.'
    },
    tags: ['Framework', 'Media Buying', 'Scaling', 'Creative Testing'],
    approvedByOwner: true,
    updatedAt: '2025-01-18T14:00:00Z'
  },
  {
    id: 'kb-3',
    title: 'Meta Ads Optimization Playbook',
    category: 'Frameworks',
    classification: 'VERIFIED_EXPERIENCE',
    summary: 'Operational rules for managing ad fatigue, creative diversification, bid caps, and daily spend pacing.',
    content: 'Key Optimization Rules:\n- Creative Diversification: Never launch variations that only change background color; each variant must test a fundamentally different visual hook or psychological trigger (Social Proof vs. Problem-Agitate vs. Value Breakdown).\n- Bid Capping: Use cost caps only when historical CPA is established and algorithmic delivery is fully stabilized.\n- Budget Scaling: Increase campaign budgets by no more than 15-20% every 48 hours to preserve algorithmic learning states.',
    provenance: {
      source: 'VedantVerse Campaign Optimization Guide',
      dateVerified: '2025-01-16',
      notes: 'Approved operational playbook.'
    },
    tags: ['Meta Ads', 'Optimization', 'Playbook', 'Creative Strategy'],
    approvedByOwner: true,
    updatedAt: '2025-01-16T12:00:00Z'
  },
  {
    id: 'kb-4',
    title: 'Client Case Study: Logistics Lead Generation',
    category: 'Case Studies',
    classification: 'VERIFIED_EXPERIENCE',
    summary: 'Reduced cost-per-lead by 42% for a high-volume B2B logistics and express courier company through search intent segmentation.',
    content: 'Client Project Breakdown:\n- Challenge: High CPL and low intent from broad match keywords on competitor courier brands.\n- Solution: Restructured search campaign into high-intent commercial query groups (e.g. bulk domestic shipping, corporate courier accounts), implemented qualifying multi-step lead forms, and fed verified conversions back via offline conversion import.\n- Verified Outcomes: 42% decrease in CPL, 3.4x increase in sales-qualified enterprise leads, 99.2% form completion rate on mobile.',
    provenance: {
      source: 'Verified Client Case Study & CRM Records',
      dateVerified: '2025-01-15',
      client: 'B2B Logistics Partner',
      metrics: ['-42% CPL Reduction', '3.4x Qualified Enterprise Leads'],
      notes: 'Approved for public marketing and reference.'
    },
    tags: ['Case Study', 'Logistics', 'B2B Lead Gen', 'Google Search'],
    approvedByOwner: true,
    updatedAt: '2025-01-15T09:30:00Z'
  },
  {
    id: 'kb-5',
    title: 'Client Case Study: Cutistic Gifts & TravelKitSR (Shopify CAPI)',
    category: 'Case Studies',
    classification: 'VERIFIED_EXPERIENCE',
    summary: 'Resolved Meta Pixel attribution drop post-iOS14 for D2C gifting and travel brands via server-side Conversion API.',
    content: 'Implemented dual Shopify webhook + browser Pixel tracking with unique event_id deduplication. Event Match Quality score jumped from 5.4 to 8.8, restoring 32% previously unrecorded purchases in Meta Ads Manager.',
    provenance: {
      source: 'VedantVerse Case Studies',
      dateVerified: '2025-01-14',
      client: 'Cutistic Gifts & TravelKitSR',
      metrics: ['+32% Recovered Purchases', '8.8 EMQ Score']
    },
    tags: ['Case Study', 'D2C', 'Shopify', 'CAPI', 'Attribution'],
    approvedByOwner: true,
    updatedAt: '2025-01-14T11:00:00Z'
  }
];

const SEED_CONTENT: ContentDraft[] = [
  {
    id: 'cnt-1',
    assignmentId: 'asg-1',
    researchId: 'res-1',
    title: 'Meta Ads Attribution in 2025: What Changed and How to Adapt',
    slug: 'meta-ads-attribution-2025',
    status: 'Drafting',
    wordCount: 4200,
    readingTime: '9 min read',
    summary: 'Meta has made significant updates to its attribution and reporting framework in 2025. Here is the technical breakdown of how performance marketers must adapt their tracking, bidding, and creative strategies.',
    category: 'Paid Media & Attribution',
    tags: ['Meta Ads', 'Attribution', 'CAPI', 'Performance Marketing'],
    outline: [
      { heading: 'Introduction & The 2025 Privacy Landscape', level: 2, notes: 'Detail cookie phaseouts, modeled data trends, and Graph API v21 changes.' },
      { heading: 'Why Client-Side Browser Pixels Fail Post-2024', level: 2, notes: 'Explain ad blockers, Safari ITP, and the 30% unrecorded signal gap.' },
      { heading: 'The Dual CAPI + Pixel Architecture Explained', level: 2, notes: 'Step-by-step deduplication with unique event IDs.', evidenceClaim: 'Verified from Cutistic Gifts & TravelKitSR implementations.' },
      { heading: 'Calibrating 7-Day Click vs. 1-Day View Attribution', level: 2, notes: 'How to avoid over-crediting view-through conversions on Advantage+ campaigns.' },
      { heading: 'Strategic Takeaways for Growth Marketers', level: 2, notes: 'Actionable checklist for audit and implementation.' }
    ],
    content: `## Introduction & The 2025 Privacy Landscape\n\nMeta has made significant updates to its attribution and reporting framework in 2025, impacting how performance marketers measure campaign results and allocate ad capital. With heightened browser-level privacy constraints, signal degradation is no longer a theoretical risk—it directly inflates reported Cost Per Acquisition (CPA) and destabilizes automated bidding algorithms.\n\nIn this technical manual, we break down the mechanics behind Meta's Graph API v21 updates, explain how to establish resilient server-side Conversion API (CAPI) pipelines, and demonstrate how to calibrate attribution windows to reflect genuine incrementality.\n\n---\n\n## Why Client-Side Browser Pixels Fail\n\nTraditional client-side pixel tags rely entirely on browser execution. When an ad click occurs, JavaScript executes in the user's browser, attempting to store third-party cookies and send beacon payloads directly to Meta's servers.\n\nHowever, modern browsing environments aggressively restrict this flow:\n1. **Safari Intelligent Tracking Prevention (ITP)** caps JavaScript-created cookies to a 7-day lifetime (and as little as 24 hours under certain link decoration heuristics).\n2. **Network Ad-Blockers** prevent client beacons from firing entirely for an estimated 25% to 35% of tech-savvy audiences.\n3. **In-App Browser Sandboxes** often isolate session cookies from native browser storage, severing the path from click to conversion.\n\n> [!IMPORTANT]\n> When Meta's machine learning models lack conversion telemetry, they cannot calibrate audience bidding. The algorithm is forced to bid conservatively, resulting in lower reach efficiency and higher effective CPMs.\n\n---\n\n## The Dual CAPI + Pixel Architecture Explained\n\nTo bridge this signal loss, modern growth stacks deploy a **redundant dual pipeline**:\n\n1. **Client-Side Pixel**: Captures immediate browser interactions (PageView, ViewContent, AddToCart).\n2. **Server-Side CAPI**: Transmits verified transaction webhooks directly from the backend server or e-commerce engine (Purchase, Lead, Subscribe).\n3. **Event ID Deduplication**: Both payloads pass an identical \`event_id\` and \`event_name\`. Meta's ingestion pipeline compares both events within a 48-hour window and deduplicates them, retaining the highest-quality signal without double-counting.\n\n\`\`\`javascript\n// Client-side pixel call\nfbq('track', 'Purchase', {\n  value: 2499,\n  currency: 'INR'\n}, { eventID: 'order_109283' });\n\`\`\`\n\nDuring my work scaling e-commerce campaigns for **Cutistic Gifts** and **TravelKitSR**, implementing this exact dual architecture restored over 30% of previously unrecorded purchase conversions and improved Event Match Quality (EMQ) to 8.8/10.\n\n---\n\n## Calibrating 7-Day Click vs. 1-Day View Attribution\n\nMany media buyers leave Meta's default attribution setting on **7-day click and 1-day view**. While this maximizes reported conversions in Ads Manager, it frequently claims credit for organic or branded search touchpoints that occurred post-impression.\n\n### Best Practice Recommendation:\n- For fast-moving consumer goods (FMCG) and low-ticket D2C: Use **7-day click / 1-day view** for algorithmic learning, but evaluate creative incrementality using **1-day click** breakdowns.\n- For high-ticket B2B lead generation or real estate: Rely on **7-day click only**, filtering out passive view-through credit to protect budget allocation.`,
    seoMeta: {
      title: 'Meta Ads Attribution in 2025: What Changed and How to Adapt',
      description: 'Technical guide to Meta Ads attribution updates in 2025. Learn how CAPI deduplication, Graph API v21, and attribution calibration improve ROAS.',
      keywords: ['meta ads attribution 2025', 'meta conversion api setup', 'capi deduplication', 'meta pixel ios14', 'performance marketing measurement']
    },
    faq: [
      { question: 'What is Meta Conversion API (CAPI)?', answer: 'Meta Conversion API is a server-to-server tracking solution that sends conversion events directly from your web server to Meta, bypassing browser blockers and iOS privacy restrictions.' },
      { question: 'How does event deduplication work?', answer: 'By sending an identical event_id from both the browser pixel and the server CAPI payload, Meta matches and merges the two records into a single verified conversion.' }
    ],
    internalLinks: [
      { text: 'GA4 + GTM Tracking Guide', url: '/blog/ga4-gtm-tracking-guide', reason: 'Relevant cross-channel tracking context' },
      { text: 'Shopify CAPI Case Study', url: '/blog/d2c-shopify-capi-meta-pixel-tracking', reason: 'Proven real-world benchmark' }
    ],
    socialSnippets: {
      linkedin: 'Meta Ads attribution changed fundamentally in 2025. Here is our technical breakdown of CAPI deduplication, Event Match Quality, and attribution window calibration for performance teams: https://vedantverse.in/blog/meta-ads-attribution-2025',
      twitter: 'Still relying solely on client-side Meta Pixels? You could be losing 30%+ of purchase signals. Our complete 2025 attribution manual is live: https://vedantverse.in/blog/meta-ads-attribution-2025'
    },
    audit: {
      overallScore: 92,
      seoScore: 94,
      aeoScore: 90,
      geoScore: 91,
      checks: [
        { name: 'Search Intent Alignment', passed: true, details: 'Targeting informational & commercial intent for performance marketers.' },
        { name: 'SEO Optimization', passed: true, details: 'H1, H2 hierarchy, primary keywords in opening paragraph and headings.' },
        { name: 'AEO (Answer Optimization)', passed: true, details: 'Clear direct definitions and structured Q&A.' },
        { name: 'GEO (AI Discoverability)', passed: true, details: 'Strong entity recognition (Meta Ads, CAPI, Shopify, iOS 14).' },
        { name: 'Factual Accuracy', passed: true, details: 'Backed by primary Meta Developer documentation.' },
        { name: 'Readability & Structure', passed: true, details: 'Clear section breaks, bullet points, and code snippets.' }
      ],
      recommendations: [
        'Add 2-3 real-world examples from your campaign experience.',
        'Include an FAQ section for common attribution questions.',
        'Add internal link to your GA4 guide (/blog/ga4-gtm-tracking-guide).'
      ],
      primaryKeyword: 'meta ads attribution 2025',
      relatedKeywords: ['meta conversion api', 'conversion reporting', 'performance marketing attribution'],
      auditDate: '2025-01-20T12:00:00Z'
    },
    suggestedPublishDate: '2025-01-24',
    createdAt: '2025-01-18T10:00:00Z',
    updatedAt: '2025-01-20T15:00:00Z'
  },
  {
    id: 'cnt-2',
    assignmentId: 'asg-2',
    researchId: 'res-3',
    title: 'GA4 + GTM Setup Guide for Performance Marketers',
    slug: 'ga4-gtm-tracking-guide',
    status: 'Awaiting Approval',
    wordCount: 3100,
    readingTime: '7 min read',
    summary: 'A definitive, zero-fluff manual on configuring Google Tag Manager and GA4 for accurate e-commerce purchase tracking, custom dimensions, and cross-domain measurement.',
    category: 'Tracking & Analytics',
    tags: ['GA4', 'GTM', 'Tracking', 'E-commerce'],
    outline: [
      { heading: 'The Architecture of Modern Analytics', level: 2, notes: 'DataLayer foundations and event scoping.' },
      { heading: 'Setting Up GA4 Configuration & Event Tags in GTM', level: 2, notes: 'Recommended event parameters.' },
      { heading: 'E-commerce DataLayer Specification & Deduplication', level: 2, notes: 'Preventing double-counting on payment gateway returns.' },
      { heading: 'Consent Mode v2 Implementation', level: 2, notes: 'Complying with EEA guidelines without losing conversion modeling.' }
    ],
    content: `## The Architecture of Modern Analytics\n\nGoogle Analytics 4 (GA4) represents a fundamental shift from session-based tracking to an event-driven data model. For performance marketers, this transition demands a strict, clean implementation of Google Tag Manager (GTM) and DataLayer payloads.\n\nWithout a standardized DataLayer, purchase events risk being dropped during third-party payment gateway redirects (such as Razorpay, Stripe, or Cashfree), distorting Channel Grouping attribution and ROAS metrics.\n\n---\n\n## Standardizing the E-commerce DataLayer\n\nEnsure that every order confirmation page pushes a single, clean \`purchase\` object containing unique transaction identifiers:\n\n\`\`\`javascript\nwindow.dataLayer = window.dataLayer || [];\nwindow.dataLayer.push({\n  event: 'purchase',\n  ecommerce: {\n    transaction_id: 'ORDER_98124',\n    value: 3499.00,\n    currency: 'INR',\n    items: [{\n      item_id: 'SKU_001',\n      item_name: 'Premium Travel Organizer',\n      price: 3499.00,\n      quantity: 1\n    }]\n  }\n});\n\`\`\`\n\n---\n\n## Debugging & Verification Checklist\n\n1. Enable **GTM Preview Mode** and verify tag triggers on \`Container Loaded\`.\n2. Confirm that \`transaction_id\` is populated and not \`undefined\`.\n3. Verify that GA4 **DebugView** registers the purchase event with correct currency and value.\n4. Check that browser reload does not re-fire the transaction event.`,
    seoMeta: {
      title: 'GA4 + GTM Setup Guide for Performance Marketers | VedantVerse',
      description: 'Zero-fluff guide to configuring GA4 and GTM for e-commerce and lead gen tracking. Master DataLayer setup, deduplication, and Consent Mode v2.',
      keywords: ['ga4 gtm setup guide', 'ecommerce datalayer purchase', 'google tag manager conversion tracking', 'consent mode v2 gtm']
    },
    faq: [
      { question: 'Why does GA4 show fewer purchases than my Shopify dashboard?', answer: 'Discrepancies usually stem from ad blockers, users leaving before the thank-you page finishes loading, or payment gateway redirects that skip the order confirmation DataLayer.' }
    ],
    internalLinks: [
      { text: 'Meta Ads Attribution Guide', url: '/blog/meta-ads-attribution-2025', reason: 'Cross-channel tracking context' }
    ],
    socialSnippets: {
      linkedin: 'Most GA4 setups lose up to 20% of purchase data on checkout redirects. Here is our step-by-step GTM DataLayer and deduplication guide: https://vedantverse.in/blog/ga4-gtm-tracking-guide',
      twitter: 'Clean analytics is the foundation of high-ROAS ad campaigns. Our complete GA4 + GTM manual is now available: https://vedantverse.in/blog/ga4-gtm-tracking-guide'
    },
    audit: {
      overallScore: 94,
      seoScore: 96,
      aeoScore: 93,
      geoScore: 92,
      checks: [
        { name: 'Search Intent Alignment', passed: true, details: 'Highly targeted for developers and growth leads.' },
        { name: 'SEO Optimization', passed: true, details: 'Target keyword in title, slug, and code examples.' },
        { name: 'AEO (Answer Optimization)', passed: true, details: 'Answers technical implementation questions directly.' },
        { name: 'GEO (AI Discoverability)', passed: true, details: 'Rich entity presence and clear code schema.' },
        { name: 'Factual Accuracy', passed: true, details: 'Verified with official Google Tag Platform documentation.' },
        { name: 'Readability & Structure', passed: true, details: 'High clarity with actionable checklists.' }
      ],
      recommendations: [
        'Add a diagram showing the GTM container to GA4 stream flow.'
      ],
      primaryKeyword: 'ga4 gtm setup guide',
      relatedKeywords: ['ecommerce datalayer', 'gtm conversion tracking', 'ga4 debugview'],
      auditDate: '2025-01-20T11:00:00Z'
    },
    suggestedPublishDate: '2025-01-25',
    createdAt: '2025-01-16T09:00:00Z',
    updatedAt: '2025-01-20T11:00:00Z'
  },
  {
    id: 'cnt-3',
    assignmentId: 'asg-3',
    researchId: 'res-2',
    title: 'Performance Max for E-commerce: Strategy, Setup and Optimization',
    slug: 'performance-max-ecommerce-strategy',
    status: 'Ready for Approval' as any,
    wordCount: 4600,
    readingTime: '10 min read',
    summary: 'A strategic operating blueprint for scaling Google Performance Max campaigns profitably without sacrificing branded search control or product margin.',
    category: 'Google Ads & Search',
    tags: ['Google Ads', 'PMax', 'E-commerce', 'Smart Bidding'],
    outline: [
      { heading: 'The Reality of Google PMax in 2025', level: 2, notes: 'De-mystifying the black box.' },
      { heading: 'Asset Group Segmentation by Margin & Velocity', level: 2, notes: 'High-margin vs. volume driver segmentation.' },
      { heading: 'Negative Keywords & Search Theme Strategy', level: 2, notes: 'Preventing brand cannibalization.' },
      { heading: 'Scaling Budgets with Target ROAS Guardrails', level: 2, notes: 'When to loosen or tighten bid targets.' }
    ],
    content: `## The Reality of Google PMax in 2025\n\nGoogle Performance Max (PMax) has consolidated what used to be distinct Search, Shopping, Display, Discovery, and YouTube campaigns into a single unified machine learning pipeline. While Google promises hands-off automation, leaving PMax completely unmanaged leads to branded search cannibalization and budget waste on low-margin products.\n\nTo scale profitably, growth teams must implement strict structural guardrails.\n\n---\n\n## Asset Group Segmentation by Margin & Velocity\n\nRather than bundling your entire product catalog into one broad asset group, segment your campaigns according to **gross margin tiers** and **sales velocity**:\n\n1. **Tier 1 (High-Margin Flagships)**: Allocate higher Target ROAS headroom (e.g. 350-400%) to capture aggressive search impression share.\n2. **Tier 2 (Volume Drivers)**: Calibrate for conversion volume with flexible Target CPA constraints.\n3. **Tier 3 (Clearance & Long-Tail)**: Run dedicated feed-only (no video/display creative assets) asset groups to prevent speculative display spend.\n\n---\n\n## Brand Exclusion Lists & Negative Keywords\n\nBy default, PMax aggressively bids on your own brand name to claim easy conversion credit. Always apply an **Account-Level Negative Keyword List** containing:\n- Your exact brand name and common misspellings.\n- Existing customer support queries (e.g. "tracking", "customer care", "returns").\n- Negative competitors whose average order value does not align with your unit economics.`,
    seoMeta: {
      title: 'Performance Max for E-commerce: Strategy, Setup & Optimization | VedantVerse',
      description: 'Master Google Performance Max for e-commerce. Proven strategies for asset group segmentation, negative keyword controls, and Target ROAS scaling.',
      keywords: ['google performance max ecommerce', 'pmax asset group segmentation', 'pmax negative keywords', 'google ads scaling']
    },
    faq: [
      { question: 'Should I add videos to Performance Max asset groups?', answer: 'Yes, but upload your own high-quality 16:9 and 9:16 vertical videos. If you omit video, Google auto-generates low-quality slideshows that degrade brand perception.' }
    ],
    internalLinks: [
      { text: 'Meta Ads Attribution Guide', url: '/blog/meta-ads-attribution-2025', reason: 'Cross-platform comparison' }
    ],
    socialSnippets: {
      linkedin: 'Uncontrolled Google Performance Max campaigns often disguise branded search conversions as new customer acquisition. Here is our blueprint for asset group segmentation and negative keyword control: https://vedantverse.in/blog/performance-max-ecommerce-strategy',
      twitter: 'Want better control over Google PMax? Stop running blended catalog asset groups. Our full strategic guide: https://vedantverse.in/blog/performance-max-ecommerce-strategy'
    },
    audit: {
      overallScore: 91,
      seoScore: 93,
      aeoScore: 90,
      geoScore: 89,
      checks: [
        { name: 'Search Intent Alignment', passed: true, details: 'Answers commercial search queries for e-commerce media buyers.' },
        { name: 'SEO Optimization', passed: true, details: 'Comprehensive keyword coverage across headers.' },
        { name: 'AEO (Answer Optimization)', passed: true, details: 'Provides clear actionable answers for AI crawlers.' },
        { name: 'GEO (AI Discoverability)', passed: true, details: 'References verifiable entities: Google Ads, Target ROAS, PMax.' },
        { name: 'Factual Accuracy', passed: true, details: 'Follows official Google Ads specifications.' },
        { name: 'Readability & Structure', passed: true, details: 'Structured with numbered lists and bold callouts.' }
      ],
      recommendations: [
        'Add example negative keyword list script.'
      ],
      primaryKeyword: 'performance max ecommerce strategy',
      relatedKeywords: ['pmax optimization', 'google shopping asset groups', 'target roas bidding'],
      auditDate: '2025-01-19T16:00:00Z'
    },
    suggestedPublishDate: '2025-01-26',
    createdAt: '2025-01-17T08:30:00Z',
    updatedAt: '2025-01-19T16:00:00Z'
  }
];

const SEED_BATCHES: EditorialBatch[] = [
  {
    id: 'batch-2025-w04',
    title: 'Weekly Batch — Jan 20 - Jan 24, 2025',
    weekRange: 'Jan 20 – Jan 24, 2025',
    status: 'Ready for Approval',
    articles: [
      {
        contentId: 'cnt-1',
        title: 'Meta Ads Attribution in 2025: What Changed and How to Adapt',
        slug: 'meta-ads-attribution-2025',
        tags: ['Meta Ads', '4.2k words'],
        wordCount: 4200,
        status: 'Ready for Approval',
        suggestedPublishDate: '2025-01-24',
        qualityScore: 92,
        thumbnail: '/vedant_portrait.jpg'
      },
      {
        contentId: 'cnt-2',
        title: 'GA4 + GTM Setup Guide for Performance Marketers',
        slug: 'ga4-gtm-tracking-guide',
        tags: ['GA4', 'GTM', 'Tracking', '3.1k words'],
        wordCount: 3100,
        status: 'Ready for Approval',
        suggestedPublishDate: '2025-01-25',
        qualityScore: 94,
        thumbnail: '/vedant_portrait.jpg'
      },
      {
        contentId: 'cnt-3',
        title: 'Performance Max for E-commerce: Strategy, Setup and Optimization',
        slug: 'performance-max-ecommerce-strategy',
        tags: ['Google Ads', 'PMax', 'E-commerce', '4.6k words'],
        wordCount: 4600,
        status: 'Ready for Approval',
        suggestedPublishDate: '2025-01-26',
        qualityScore: 91,
        thumbnail: '/vedant_portrait.jpg'
      }
    ],
    notes: 'Weekly editorial batch prepared for human review. Strict approval gate active: zero content will be published to the live website without explicit owner authorization.',
    createdAt: '2025-01-20T10:00:00Z'
  }
];

const SEED_SETTINGS: AgentSettings = {
  autonomyMode: 'SCHEDULED', // LOCKED PREFERENCE
  researchDepth: 'DEEP',      // LOCKED PREFERENCE
  publishingMode: 'HUMAN_APPROVAL_REQUIRED', // LOCKED PREFERENCE - zero autonomous publishing
  timezone: 'Asia/Kolkata',
  researchStartDay: 'Monday',
  researchEndDay: 'Tuesday',
  contentCreationDay: 'Wednesday',
  auditDay: 'Thursday',
  batchDeliveryDay: 'Friday',
  batchDeliveryTime: '10:00 AM',
  proposedTopicsPerWeek: 5,
  articlesPerWeek: 3,
  maxResearchDurationMinutes: 60,
  monthlyApiBudgetUsd: 150,
  maxRetries: 3,
  notifications: {
    email: true,
    telegram: true,
    inApp: true
  }
};

const SEED_LOGS: JobLog[] = [
  {
    id: 'log-101',
    jobName: 'Weekly Opportunity Discovery',
    stage: 'Opportunity Discovery',
    status: 'Completed',
    timestamp: '2025-01-20T09:00:00Z',
    duration: '1m 45s',
    details: 'Scanned 14 primary ad platforms and search queries; identified 5 high-impact topics for performance marketing.',
    retryCount: 0
  },
  {
    id: 'log-102',
    jobName: 'Deep Research Engine: Meta Ads Attribution',
    stage: 'Deep Research',
    status: 'Completed',
    timestamp: '2025-01-20T10:15:00Z',
    duration: '4m 12s',
    details: 'Retrieved and verified 12 authoritative sources (Meta Graph API docs, W3C Private Aggregation spec, Shopify CAPI guide).',
    retryCount: 0
  },
  {
    id: 'log-103',
    jobName: 'Content Drafting Engine: Meta Attribution Manual',
    stage: 'Content Drafting',
    status: 'Completed',
    timestamp: '2025-01-20T11:45:00Z',
    duration: '3m 28s',
    details: 'Drafted 4,200 words with code samples, outlines, FAQs, and social snippets. Injected verified owner case studies.',
    retryCount: 0
  },
  {
    id: 'log-104',
    jobName: 'SEO, AEO & GEO Quality Audit',
    stage: 'SEO/AEO Audit',
    status: 'Completed',
    timestamp: '2025-01-20T12:05:00Z',
    duration: '52s',
    details: 'Audited draft against search intent, schema markup, and fact provenance. Passed 6/6 critical verification gates with 92/100 score.',
    retryCount: 0
  },
  {
    id: 'log-105',
    jobName: 'Weekly Batch Compilation',
    stage: 'Batch Compilation',
    status: 'Completed',
    timestamp: '2025-01-20T12:10:00Z',
    duration: '22s',
    details: 'Compiled 3 articles into Weekly Batch (Jan 20 - Jan 24). Queued for mandatory human owner approval.',
    retryCount: 0
  }
];

// ==========================================
// 3. STORAGE ACCESSORS (Multi-Tier Resilient Storage)
// ==========================================

const REDIS_KEY_PREFIX = 'vedantverse:growth-desk:';

function isRedisConfigured(): boolean {
  return Boolean(
    (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
    (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

// In-memory cache for ultra-fast response & instant local reads
const memoryCache = new Map<string, any>();

// Check writable directory safely
let cachedWritableDir: string | null = null;
function getWritableDir(): string {
  if (cachedWritableDir) return cachedWritableDir;

  // Try LOCAL_DIR first (works in local development)
  try {
    if (!fs.existsSync(LOCAL_DIR)) {
      fs.mkdirSync(LOCAL_DIR, { recursive: true });
    }
    const testFile = path.join(LOCAL_DIR, `.write_test_${Date.now()}`);
    fs.writeFileSync(testFile, '1');
    fs.unlinkSync(testFile);
    cachedWritableDir = LOCAL_DIR;
    return LOCAL_DIR;
  } catch {
    // Read-only filesystem (e.g. Vercel Lambda /var/task)
    try {
      if (!fs.existsSync(TMP_DIR)) {
        fs.mkdirSync(TMP_DIR, { recursive: true });
      }
      cachedWritableDir = TMP_DIR;
      return TMP_DIR;
    } catch {
      cachedWritableDir = os.tmpdir();
      return os.tmpdir();
    }
  }
}

function readJsonFile<T>(filename: string, fallback: T): T {
  // 1. Check in-memory cache first
  if (memoryCache.has(filename)) {
    return memoryCache.get(filename) as T;
  }

  // 2. Check writable directory (e.g. /tmp/growth-desk/content.json)
  try {
    const tmpFile = path.join(TMP_DIR, filename);
    if (fs.existsSync(tmpFile)) {
      const data = fs.readFileSync(tmpFile, 'utf8');
      const parsed = JSON.parse(data) as T;
      memoryCache.set(filename, parsed);
      return parsed;
    }
  } catch (err) {
    // ignore
  }

  // 3. Check bundled project directory (e.g. /var/task/src/data/growth-desk/content.json)
  try {
    const localFile = path.join(LOCAL_DIR, filename);
    if (fs.existsSync(localFile)) {
      const data = fs.readFileSync(localFile, 'utf8');
      const parsed = JSON.parse(data) as T;
      memoryCache.set(filename, parsed);
      return parsed;
    }
  } catch (err) {
    // ignore
  }

  // 4. Return fallback seed data
  memoryCache.set(filename, fallback);
  return fallback;
}

function writeJsonFile<T>(filename: string, data: T): void {
  // 1. Update in-memory cache immediately
  memoryCache.set(filename, data);

  // 2. Write to disk safely without throwing
  try {
    const targetDir = getWritableDir();
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetPath = path.join(targetDir, filename);
    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn(`Safe warning: could not write ${filename} to disk, cached in memory:`, err);
  }
}

export async function getStoredDataAsync<T>(key: string, filename: string, fallback: T): Promise<T> {
  // Try Redis first
  if (isRedisConfigured()) {
    try {
      const data = await redis.get<T>(`${REDIS_KEY_PREFIX}${key}`);
      if (data !== null && data !== undefined) {
        memoryCache.set(filename, data);
        writeJsonFile(filename, data);
        return data;
      }
    } catch (err) {
      console.warn(`Redis get failed for ${key}, falling back to disk/memory:`, err);
    }
  }

  // Fallback to disk / memory
  const result = readJsonFile<T>(filename, fallback);

  // Seed Redis if it was missing
  if (isRedisConfigured() && result) {
    redis.set(`${REDIS_KEY_PREFIX}${key}`, result).catch((err) => {
      console.warn(`Redis seed failed for ${key}:`, err);
    });
  }

  return result;
}

export async function saveStoredDataAsync<T>(key: string, filename: string, data: T): Promise<void> {
  // Update memory & disk
  writeJsonFile(filename, data);

  // Save to Redis
  if (isRedisConfigured()) {
    try {
      await redis.set(`${REDIS_KEY_PREFIX}${key}`, data);
    } catch (err) {
      console.warn(`Redis save failed for ${key}:`, err);
    }
  }
}

// Assignments
export function getAssignments(): Assignment[] {
  return readJsonFile<Assignment[]>('assignments.json', SEED_ASSIGNMENTS);
}

export async function getAssignmentsAsync(): Promise<Assignment[]> {
  return getStoredDataAsync<Assignment[]>('assignments', 'assignments.json', SEED_ASSIGNMENTS);
}

export function saveAssignments(assignments: Assignment[]): void {
  writeJsonFile('assignments.json', assignments);
  if (isRedisConfigured()) {
    redis.set(`${REDIS_KEY_PREFIX}assignments`, assignments).catch(console.warn);
  }
}

export async function saveAssignmentsAsync(assignments: Assignment[]): Promise<void> {
  return saveStoredDataAsync('assignments', 'assignments.json', assignments);
}

// Research Projects
export function getResearchProjects(): ResearchProject[] {
  return readJsonFile<ResearchProject[]>('research.json', SEED_RESEARCH);
}

export async function getResearchProjectsAsync(): Promise<ResearchProject[]> {
  return getStoredDataAsync<ResearchProject[]>('research', 'research.json', SEED_RESEARCH);
}

export function saveResearchProjects(projects: ResearchProject[]): void {
  writeJsonFile('research.json', projects);
  if (isRedisConfigured()) {
    redis.set(`${REDIS_KEY_PREFIX}research`, projects).catch(console.warn);
  }
}

export async function saveResearchProjectsAsync(projects: ResearchProject[]): Promise<void> {
  return saveStoredDataAsync('research', 'research.json', projects);
}

// Knowledge Base
export function getKnowledgeFacts(): KnowledgeFact[] {
  return readJsonFile<KnowledgeFact[]>('knowledge.json', SEED_KNOWLEDGE);
}

export async function getKnowledgeFactsAsync(): Promise<KnowledgeFact[]> {
  return getStoredDataAsync<KnowledgeFact[]>('knowledge', 'knowledge.json', SEED_KNOWLEDGE);
}

export function saveKnowledgeFacts(facts: KnowledgeFact[]): void {
  writeJsonFile('knowledge.json', facts);
  if (isRedisConfigured()) {
    redis.set(`${REDIS_KEY_PREFIX}knowledge`, facts).catch(console.warn);
  }
}

export async function saveKnowledgeFactsAsync(facts: KnowledgeFact[]): Promise<void> {
  return saveStoredDataAsync('knowledge', 'knowledge.json', facts);
}

// Content Studio Drafts
export function getContentDrafts(): ContentDraft[] {
  return readJsonFile<ContentDraft[]>('content.json', SEED_CONTENT);
}

export async function getContentDraftsAsync(): Promise<ContentDraft[]> {
  return getStoredDataAsync<ContentDraft[]>('content', 'content.json', SEED_CONTENT);
}

export function saveContentDrafts(drafts: ContentDraft[]): void {
  writeJsonFile('content.json', drafts);
  if (isRedisConfigured()) {
    redis.set(`${REDIS_KEY_PREFIX}content`, drafts).catch(console.warn);
  }
}

export async function saveContentDraftsAsync(drafts: ContentDraft[]): Promise<void> {
  return saveStoredDataAsync('content', 'content.json', drafts);
}

// Weekly Batches
export function getEditorialBatches(): EditorialBatch[] {
  return readJsonFile<EditorialBatch[]>('batches.json', SEED_BATCHES);
}

export async function getEditorialBatchesAsync(): Promise<EditorialBatch[]> {
  return getStoredDataAsync<EditorialBatch[]>('batches', 'batches.json', SEED_BATCHES);
}

export function saveEditorialBatches(batches: EditorialBatch[]): void {
  writeJsonFile('batches.json', batches);
  if (isRedisConfigured()) {
    redis.set(`${REDIS_KEY_PREFIX}batches`, batches).catch(console.warn);
  }
}

export async function saveEditorialBatchesAsync(batches: EditorialBatch[]): Promise<void> {
  return saveStoredDataAsync('batches', 'batches.json', batches);
}

// Agent Settings
export function getAgentSettings(): AgentSettings {
  return readJsonFile<AgentSettings>('settings.json', SEED_SETTINGS);
}

export async function getAgentSettingsAsync(): Promise<AgentSettings> {
  return getStoredDataAsync<AgentSettings>('settings', 'settings.json', SEED_SETTINGS);
}

export function saveAgentSettings(settings: AgentSettings): void {
  const enforced: AgentSettings = {
    ...settings,
    autonomyMode: 'SCHEDULED',
    researchDepth: 'DEEP',
    publishingMode: 'HUMAN_APPROVAL_REQUIRED'
  };
  writeJsonFile('settings.json', enforced);
  if (isRedisConfigured()) {
    redis.set(`${REDIS_KEY_PREFIX}settings`, enforced).catch(console.warn);
  }
}

export async function saveAgentSettingsAsync(settings: AgentSettings): Promise<void> {
  const enforced: AgentSettings = {
    ...settings,
    autonomyMode: 'SCHEDULED',
    researchDepth: 'DEEP',
    publishingMode: 'HUMAN_APPROVAL_REQUIRED'
  };
  return saveStoredDataAsync('settings', 'settings.json', enforced);
}

// Job Logs
export function getJobLogs(): JobLog[] {
  return readJsonFile<JobLog[]>('logs.json', SEED_LOGS);
}

export async function getJobLogsAsync(): Promise<JobLog[]> {
  return getStoredDataAsync<JobLog[]>('logs', 'logs.json', SEED_LOGS);
}

export function addJobLog(log: Omit<JobLog, 'id'>): JobLog {
  const logs = getJobLogs();
  const newLog: JobLog = {
    ...log,
    id: `log-${Date.now()}`
  };
  logs.unshift(newLog);
  writeJsonFile('logs.json', logs.slice(0, 100)); // retain last 100
  if (isRedisConfigured()) {
    redis.set(`${REDIS_KEY_PREFIX}logs`, logs.slice(0, 100)).catch(console.warn);
  }
  return newLog;
}

export async function addJobLogAsync(log: Omit<JobLog, 'id'>): Promise<JobLog> {
  const logs = await getJobLogsAsync();
  const newLog: JobLog = {
    ...log,
    id: `log-${Date.now()}`
  };
  logs.unshift(newLog);
  await saveStoredDataAsync('logs', 'logs.json', logs.slice(0, 100));
  return newLog;
}

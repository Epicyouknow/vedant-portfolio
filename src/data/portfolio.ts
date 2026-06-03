export interface Profile {
  id: string;
  title: string;
  roleTitle: string;
  characterName: string;
  characterStyle: string;
  characterDesc: string;
  skills: string[];
  accentColor: string; // Dynamic CSS accent
  avatar: string; // Emoji avatar representation
}

export interface TimelineItem {
  id: string;
  year: string;
  role: string;
  company: string;
  period: string;
  description: string;
  points: string[];
  tools: string[];
  lessons: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'campaign' | 'mediaplan' | 'branding' | 'development';
  categoryLabel: string;
  description: string;
  longDescription: string;
  image: string;
  matchPercentage: number;
  year: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  deliverables: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  color: string;
  certId?: string;
}

export interface FutureGoal {
  id: string;
  title: string;
  episodeNum: string;
  description: string;
  expectedDate: string;
  tags: string[];
}

export interface MetaCampaign {
  name: string;
  status: 'active' | 'paused';
  budget: string;
  bidStrategy: string;
  conversions: number;
  cpa: string;
  roas: number;
  spend: string;
}

export interface GoogleCampaign {
  name: string;
  status: 'active' | 'paused';
  budget: string;
  impressions: number;
  clicks: number;
  ctr: string;
  cpc: string;
  conversions: number;
  spend: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    titles: string[];
    tagline: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    resumeUrl: string;
    about: string;
  };
  stats: {
    experience: string;
    adSpend: string;
    platforms: string;
    campaigns: string;
  };
  profiles: Profile[];
  timeline: TimelineItem[];
  projects: Project[];
  certifications: Certification[];
  futureGoals: FutureGoal[];
  dashboardMockData: {
    meta: MetaCampaign[];
    google: GoogleCampaign[];
  };
  easterEgg: {
    hobbies: string[];
    music: string[];
    funFacts: string[];
    journeySecret: string;
  };
  aiKnowledge: {
    questionKeywords: string[][];
    answer: string;
  }[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Vedant Tiwari",
    titles: [
      "Performance Marketing Executive",
      "Media Planner & Buyer",
      "Brand Strategist",
      "Growth Marketer"
    ],
    tagline: "Turning Data Into Growth.",
    location: "Mumbai, India",
    email: "tiwarivedant705@gmail.com",
    phone: "816372383",
    linkedin: "https://www.linkedin.com/in/vedant-tiwarii",
    resumeUrl: "https://docs.google.com/document/d/12P9AWWqzvAVxaXoW0IBKjojWK5Jzog2wSPqzaNrnH7s/edit?usp=sharing",
    about: "I am a high-impact Performance Marketing Executive and Media Planner based in Mumbai. I specialize in designing and executing cross-channel media strategies, managing significant budgets, and engineering data pipelines that turn clicks into measurable growth."
  },
  stats: {
    experience: "1.5+ Years",
    adSpend: "₹15L+",
    platforms: "7+ Platforms",
    campaigns: "50+ Campaigns"
  },
  profiles: [
    {
      id: "performance-marketing",
      title: "Performance Marketer Vedant",
      roleTitle: "Performance Marketing Specialist",
      characterName: "The ROAS Alchemist",
      accentColor: "#E50914", // Red
      avatar: "🎯",
      characterStyle: "Netflix Original Hero - A modern growth driver wearing a tactical hoodie and tracking jacket, flanked by glowing Meta & Google analytics dashboards.",
      characterDesc: "An expert at optimizing digital channels, balancing budgets, and driving low-CPA acquisition campaigns with high ROAS.",
      skills: [
        "Meta Ads", "Google Ads", "YouTube Ads", "Amazon Ads",
        "DV360", "CM360", "Reddit Ads", "Quick Commerce Ads",
        "Analytics", "Conversion Tracking", "Campaign Optimization"
      ]
    },
    {
      id: "media-planning",
      title: "Media Planner Vedant",
      roleTitle: "Media Planner & Buyer",
      characterName: "Digital Media Commander",
      accentColor: "#3B82F6", // Blue
      avatar: "📊",
      characterStyle: "Digital Commander - Standing in front of floating multi-screen dashboards, mapping target audiences, and running budget allocation holograms.",
      characterDesc: "Masters cross-platform audience targeting, channel planning, and data-backed budget forecasting to capture maximum share of voice.",
      skills: [
        "Media Planning", "Audience Segmentation", "Budget Forecasting",
        "Media Buying", "Platform Selection", "Campaign Strategy",
        "Cross Platform Execution"
      ]
    },
    {
      id: "branding-strategy",
      title: "Brand Strategist Vedant",
      roleTitle: "Creative Brand Strategist",
      characterName: "The Narrative Architect",
      accentColor: "#F59E0B", // Gold
      avatar: "🚀",
      characterStyle: "Creative Strategist - A modern brand designer visualising floating identity holograms, campaign storyboards, and interactive creative briefs.",
      characterDesc: "Blends creative storytelling with consumer insights to craft unique brand identities, positioning maps, and content plans.",
      skills: [
        "Brand Positioning", "Brand Strategy", "Content Strategy",
        "Creative Briefing", "Social Media Marketing", "Campaign Communication"
      ]
    },
    {
      id: "technical-skills",
      title: "Marketing Technologist Vedant",
      roleTitle: "Marketing Technologist",
      characterName: "The Data Pipeline Sage",
      accentColor: "#10B981", // Green
      avatar: "⚙️",
      characterStyle: "Futuristic Workstation Tech - Monitoring real-time server telemetry, custom GTM data layers, conversion APIs, and Looker Studio reports.",
      characterDesc: "Orchestrates technical marketing setups, custom events scripting, attribution models, and interactive dashboarding.",
      skills: [
        "GA4", "GTM", "Meta Pixel", "Looker Studio",
        "Advanced Excel", "Dashboard Reporting", "Automation Systems"
      ]
    },
    {
      id: "web-dev",
      title: "Developer Vedant",
      roleTitle: "Creative Developer",
      characterName: "The Future Builder",
      accentColor: "#8B5CF6", // Purple
      avatar: "💻",
      characterStyle: "Full-Stack Engineer - Sitting in front of transparent displays of live IDE code, React architecture maps, and mobile viewport wireframes.",
      characterDesc: "Integrates APIs and builds performant, high-converting landing pages, interactive utilities, and responsive web systems.",
      skills: [
        "Frontend Development", "Backend Development", "UI/UX",
        "Responsive Design", "Web Apps", "Mobile Apps", "API Integration"
      ]
    }
  ],
  timeline: [
    {
      id: "timeline-1",
      year: "May 2026 - Present",
      role: "Performance Marketing Executive",
      company: "ITD Growth Labs",
      period: "Present",
      description: "Plan, launch, and optimize paid advertising campaigns across Meta Ads and Google Ads with a focus on maximizing conversions, minimizing CPL, and achieving target ROAS for lead generation and brand growth mandates.",
      points: [
        "Develop and execute conversion-focused media strategies encompassing audience segmentation, creative testing, and funnel-specific campaign structuring across awareness, consideration, and conversion objectives.",
        "Monitor and analyze campaign KPIs including CTR, CPC, CPL, CPA, and ROAS on a daily basis; identify underperformance trends and execute data-driven optimizations to improve campaign efficiency.",
        "Collaborate cross-functionally with creative and strategy teams to develop high-performing ad creatives, refine messaging, and align campaign assets with brand communication objectives.",
        "Implement UTM tracking frameworks and conversion tracking setups to ensure accurate performance attribution across all active campaigns and channels."
      ],
      tools: ["Meta Ads", "Google Ads", "UTM Tracking", "Conversion Tracking", "Funnel Structuring"],
      lessons: "Full-funnel attribution and real-time optimization trends are essential to scale modern paid acquisitions."
    },
    {
      id: "timeline-2",
      year: "Mar 2025 - Apr 2026",
      role: "Jr. Performance Marketing Executive",
      company: "Mobligent Media",
      period: "1 Year 2 Months",
      description: "Promoted to full-time performance marketing role following consistent high performance during internship, managing an expanded portfolio of D2C and E-commerce brand campaigns across Meta, Google, Quick Commerce, and Marketplace platforms.",
      points: [
        "Independently planned, executed, and optimized paid media campaigns for multiple brand clients — driving measurable improvements in ROAS, conversion rates, and overall campaign profitability.",
        "Managed advertising budgets totalling ₹12,0,000+ across platforms, applying strategic budget allocation and real-time pacing adjustments to maximize media efficiency and minimize waste.",
        "Executed end-to-end Quick Commerce advertising campaigns on Zepto Ads, Blinkit Ads, and Instamart Ads to drive product visibility and sales uplift for FMCG and D2C brands.",
        "Built and optimized Amazon Ads and Flipkart Ads campaigns including Sponsored Products, Sponsored Brands, and Sponsored Display formats to improve marketplace visibility and organic rank.",
        "Designed and maintained weekly and monthly performance dashboards using Advanced Excel and Pivot Tables; delivered clear, actionable insights and campaign reports to clients and internal stakeholders.",
        "Conducted A/B testing on ad creatives, audience segments, bidding strategies, and landing page combinations to continuously improve campaign performance metrics.",
        "Coordinated with the creative team to provide structured ad creative briefs based on performance data, audience insights, and platform-specific best practices."
      ],
      tools: ["Meta Ads", "Google Ads", "Zepto Ads", "Blinkit Ads", "Amazon Ads", "Flipkart Ads", "Advanced Excel"],
      lessons: "Cross-channel budget scaling requires strict pacing discipline and real-time attribution loops."
    },
    {
      id: "timeline-3",
      year: "Oct 2024 - Mar 2025",
      role: "Digital Marketing Intern",
      company: "Mobligent Media",
      period: "6 Months",
      description: "Assisted senior performance marketers in planning and executing paid media campaigns across Meta Ads and Google Ads, gaining hands-on experience in campaign setup, audience targeting, and creative deployment.",
      points: [
        "Conducted in-depth audience research and competitor analysis to inform targeting strategies, ad copy directions, and campaign positioning for D2C and service-based brand clients.",
        "Supported social media management and content strategy activities including content calendar planning, post scheduling, and platform-specific content optimization across Instagram, Facebook, and LinkedIn.",
        "Analysed campaign performance metrics — CTR, CPC, CPM, CPA — and compiled daily and weekly performance reports to support optimization decision-making.",
        "Contributed to UTM tracking setup and performance monitoring activities, developing foundational skills in digital analytics and conversion attribution methodologies."
      ],
      tools: ["Meta Ads", "Google Ads", "UTM Tracking", "Instagram", "Facebook", "LinkedIn"],
      lessons: "Data hygiene in the setup phase is critical to downstream analytics and scaling decisions."
    },
    {
      id: "timeline-4",
      year: "Aug 2024 - Jan 2025",
      role: "Freelance Digital Marketing Executive",
      company: "Rishaan Media & Brand Buddies Media Pvt. Ltd.",
      period: "6 Months",
      description: "Independently managed end-to-end digital marketing campaigns for multiple brands across service, real estate, and lifestyle verticals — encompassing social media strategy, content creation, and paid media execution.",
      points: [
        "Designed brand-aligned performance creatives and marketing collaterals using Canva; developed visual communication frameworks tailored to each brand's positioning and campaign objectives.",
        "Created and managed social media content calendars, executing consistent multi-platform content strategies that improved brand engagement and community growth.",
        "Delivered performance reporting and campaign insights to brand owners, contributing to campaign refinement and ongoing strategy improvement."
      ],
      tools: ["Canva", "Social Media", "Paid Media", "Content Calendars"],
      lessons: "Visual storytelling paired with localized targeting is the fastest way to validate customer demand."
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "The Scale Project: D2C Performance Blitz",
      category: "campaign",
      categoryLabel: "Performance Campaign",
      description: "Full-funnel Meta and Google Ads strategy scaling monthly revenue for an e-commerce brand.",
      longDescription: "A comprehensive performance marketing campaign designed to scale a premium D2C apparel brand. By re-structuring the Meta Ad accounts into simplified CBO structures and launching hyper-segmented Google Shopping and PMax campaigns, we achieved consistent growth while maintaining target efficiency levels.",
      image: "d2c-performance-blitz",
      matchPercentage: 98,
      year: "2024",
      tags: ["Meta Ads", "Google Ads", "ROAS Optimization", "A/B Testing"],
      metrics: [
        { label: "ROAS Boost", value: "3.8x Average" },
        { label: "Ad Spend Managed", value: "₹5L+" },
        { label: "Cost Per Acquisition", value: "-22% Reduc." }
      ],
      deliverables: [
        "simplified Meta account architecture",
        "PMax audience signal modeling",
        "custom catalog dynamic ads layout",
        "weekly cohort reporting charts"
      ]
    },
    {
      id: "proj-2",
      title: "Omnichannel Q-Commerce Launch Blueprint",
      category: "mediaplan",
      categoryLabel: "Media Plan",
      description: "Comprehensive multi-channel budget allocation forecasting for a quick commerce product line.",
      longDescription: "A tactical media plan and budget forecasting model leveraging DV360, Meta Ads, and Quick Commerce platforms (Blinkit, Zepto) to launch a new FMCG product in metropolitan cities. The strategy focused on digital high-impact billboards coupled with hyper-local delivery range target circles.",
      image: "qcomm-launch-blueprint",
      matchPercentage: 95,
      year: "2024",
      tags: ["Media Planning", "DV360", "Budget Allocation", "Q-Commerce Ads"],
      metrics: [
        { label: "Reach Target", value: "2.4M Unique" },
        { label: "CPC Efficiency", value: "₹4.50" },
        { label: "Store Visits Lift", value: "+35%" }
      ],
      deliverables: [
        "media mix modeling sheet",
        "audience segmentation matrix",
        "frequency capping protocol",
        "interactive planning dashboard"
      ]
    },
    {
      id: "proj-3",
      title: "Identity Shift: Brand Strategy & Positioning",
      category: "branding",
      categoryLabel: "Brand Strategy",
      description: "Repositioning strategy for a traditional B2B service firm transitioning to digital product delivery.",
      longDescription: "A full brand strategy package comprising positioning maps, core values alignment, a redesigned creative copywriting style guide, and narrative storyboarding. We created a modern identity suited for an audience valuing rapid automation and premium customer-centric delivery.",
      image: "identity-shift-strategy",
      matchPercentage: 91,
      year: "2023",
      tags: ["Brand Identity", "Storyboarding", "Creative Briefs", "Positioning"],
      metrics: [
        { label: "Brand Recall Lift", value: "+18%", },
        { label: "Lead Gen Quality", value: "+45% High-Int" },
        { label: "Organic Inquiries", value: "+2.2x Growth" }
      ],
      deliverables: [
        "60-page brand playbook",
        "creative briefing guidelines",
        "competitor matrix analysis",
        "social communication framework"
      ]
    },
    {
      id: "proj-4",
      title: "High-Converting Custom Checkout Engine",
      category: "development",
      categoryLabel: "Web App Dev",
      description: "React-based landing pages and API integration optimized for direct-response marketing funnels.",
      longDescription: "A modular frontend landing page built with React, styled with Tailwind CSS, and hooked to server-side Google Tag Manager and Meta Conversions API. Designed to load under 1.2s to minimize traffic drop-offs, integrating a micro-checkout system.",
      image: "checkout-engine-dev",
      matchPercentage: 94,
      year: "2024",
      tags: ["Next.js", "API Integrations", "Conversion Optimization", "GTM Server-side"],
      metrics: [
        { label: "Load Speed", value: "98 Mobile Score" },
        { label: "Conversion Lift", value: "+4.2% Absolute" },
        { label: "Pixel Matching", value: "9.8/10 Score" }
      ],
      deliverables: [
        "fully responsive Next.js landing template",
        "GTM dataLayer tracking scripts",
        "direct webhook payment webhook integration",
        "Google PageSpeed optimization audit"
      ]
    }
  ],
  certifications: [
    { id: "cert-1", title: "Google Search Ads Certification", issuer: "Google", date: "2024", color: "#4285F4", certId: "G-SRCH-94301" },
    { id: "cert-2", title: "Google Analytics 4 Certification", issuer: "Google", date: "2024", color: "#EA4335", certId: "GA4-39401" },
    { id: "cert-3", title: "Display & Video 360 (DV360)", issuer: "Google", date: "2024", color: "#34A853", certId: "DV-360-19403" },
    { id: "cert-4", title: "Campaign Manager 360 (CM360)", issuer: "Google", date: "2024", color: "#FBBC05", certId: "CM-360-5942" },
    { id: "cert-5", title: "Amazon DSP Certification", issuer: "Amazon Web Services", date: "2023", color: "#FF9900", certId: "AMZ-DSP-4012" },
    { id: "cert-6", title: "Reddit Ads Professional", issuer: "Reddit", date: "2023", color: "#FF4500", certId: "RD-PRO-20419" }
  ],
  futureGoals: [
    {
      id: "goal-1",
      title: "Programmatic Advertising Mastery",
      episodeNum: "Episode 1",
      description: "Scale advanced DV360 and CM360 cross-publisher tracking schemas for high-traffic networks.",
      expectedDate: "Q3 2026",
      tags: ["DV360", "Programmatic Buying", "Attribution Models"]
    },
    {
      id: "goal-2",
      title: "Agency Leadership & Scaling",
      episodeNum: "Episode 2",
      description: "Assemble a high-performance squad of growth copywriters and tag engineers to drive client success pipelines.",
      expectedDate: "Q4 2026",
      tags: ["Leadership", "Operations", "Client Retention"]
    },
    {
      id: "goal-3",
      title: "SaaS Product Led Growth",
      episodeNum: "Episode 3",
      description: "Build acquisition loops for subscription products using viral loops and technical product funnels.",
      expectedDate: "Q1 2027",
      tags: ["Product Growth", "Referral Loops", "LTV Expansion"]
    }
  ],
  dashboardMockData: {
    meta: [
      { name: "CBO - Apparel Scale Blitz", status: "active", budget: "₹5,000/day", bidStrategy: "Highest Volume", conversions: 1240, cpa: "₹245", roas: 4.2, spend: "₹3,03,800" },
      { name: "ASC+ - Core Retargeting", status: "active", budget: "₹2,500/day", bidStrategy: "Highest Volume", conversions: 620, cpa: "₹180", roas: 5.6, spend: "₹1,11,600" },
      { name: "TOF - Lookalike Testing", status: "paused", budget: "₹1,500/day", bidStrategy: "Highest Volume", conversions: 180, cpa: "₹310", roas: 2.1, spend: "₹55,800" }
    ],
    google: [
      { name: "PMax - Core Product Catalog", status: "active", budget: "₹4,000/day", impressions: 185000, clicks: 12400, ctr: "6.7%", cpc: "₹4.50", conversions: 740, spend: "₹55,800" },
      { name: "Search - High-Intent Keywords", status: "active", budget: "₹2,000/day", impressions: 45000, clicks: 3800, ctr: "8.4%", cpc: "₹7.20", conversions: 410, spend: "₹27,360" }
    ]
  },
  easterEgg: {
    hobbies: ["Championship Chess Tournament Player", "Retro Arcade Gaming", "Premium Espresso Coffee Brewing"],
    music: ["Synthwave Chill (Com Truise, Timecop1983)", "Cinematic Orchestral (Hans Zimmer, Ludwig Göransson)"],
    funFacts: [
      "I programmatically synthesized a Netflix 'Tudum' sound effect using the browser's Web Audio API context.",
      "Once resolved a tracking loop error that had bloated a client's acquisition data by 250% in Meta Ads Manager.",
      "I built a React checkout framework that registers pixel transactions in under 1.2s."
    ],
    journeySecret: "Behind the Scenes Access Granted. Vedant blends quantitative advertising models with full-stack programming to build marketing infrastructure that operates like software."
  },
  aiKnowledge: [
    {
      questionKeywords: [["who", "vedant"], ["about", "profile"], ["introduce", "yourself"]],
      answer: "Vedant Tiwari is a results-driven Performance Marketing Executive, Media Planner, and Growth Strategist based in Mumbai, India. With 1.5+ years of experience and over ₹15L+ in managed ad spend across 7+ platforms, he specializes in turning data into business growth."
    },
    {
      questionKeywords: [["skills", "technologies"], ["ad", "platforms"], ["tools", "tech"]],
      answer: "Vedant is highly skilled in: (1) Ad Networks: Meta Ads, Google Ads, YouTube Ads, Amazon Ads, Reddit Ads, Quick Commerce Ads; (2) Programmatic: DV360, CM360; (3) Analytics: GA4, GTM (client & server-side), Meta Pixel, Looker Studio, Advanced Excel; (4) Web Dev: Frontend Dev, React, Next.js, API Integration."
    },
    {
      questionKeywords: [["experience", "career"], ["work", "jobs"], ["history", "timeline"]],
      answer: "Vedant's career journey consists of: (1) Performance Marketing Executive: Managing full-funnel digital campaigns (₹15L+ spends); (2) Jr. Performance Marketing Executive: Campaign structuring and automated Looker dashboards; (3) Digital Marketing Intern: Copywriting and organic search layouts; (4) Freelance Web Developer: Optimizing high-converting landing pages."
    },
    {
      questionKeywords: [["contact", "email"], ["hire", "recruit"], ["phone", "reach", "linkedin"]],
      answer: "You can reach Vedant Tiwari directly via Email at tiwarivedant705@gmail.com, via Phone at 816372383, or visit his LinkedIn profile (https://www.linkedin.com/in/vedant-tiwarii). He is based in Mumbai, India, and open to remote or on-site opportunities."
    },
    {
      questionKeywords: [["ad spend", "budget"], ["spend", "money", "managed"]],
      answer: "Vedant has managed over ₹15L+ in advertising spends across Meta Ads, Google PMax/Search, Amazon, and Display channels, delivering consistent increases in return on ad spend (ROAS) and reducing overall CPA."
    },
    {
      questionKeywords: [["certifications", "certified", "google ads"]],
      answer: "Vedant holds multiple premium certifications: Google Search Ads, Google Analytics 4 (GA4), DV360, CM360, Amazon DSP, and Reddit Ads Professional."
    },
    {
      questionKeywords: [["role", "recommend", "hire for"]],
      answer: "I recommend hiring Vedant for: (1) Performance Marketing Specialist (ROAS acquisition loops); (2) Digital Media Buyer & Planner (budget forecasting & omnichannel buying); (3) Marketing Technologist (tag architectures, pixel infrastructure, and custom pipelines); (4) Growth Hacker / Tech-Marketer."
    }
  ]
};

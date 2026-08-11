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
  image: string; // Path to cinematic portrait
  tagline: string; // Immersive tagline
  subPlatforms: { name: string; icon: string }[]; // Sub-technologies/specialties
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
    resumeUrl: "/Vedant_Tiwari_Resume.pdf",
    about: "I am a high-impact Performance Marketing Executive and Media Planner based in Mumbai. I specialize in designing and executing cross-channel media strategies, managing significant budgets, and engineering data pipelines that turn clicks into measurable growth."
  },
  stats: {
    experience: "2+",
    adSpend: "₹18L+",
    platforms: "7+",
    campaigns: "75+"
  },
  profiles: [
    {
      id: "performance-marketing",
      title: "Growth Hacker Vedant",
      roleTitle: "Performance Marketing Specialist",
      characterName: "THE GROWTH HACKER",
      accentColor: "#E50914", // Netflix Red
      avatar: "🎯",
      image: "/growth_hacker.png",
      tagline: "Data-driven. Growth-obsessed. I turn clicks into customers.",
      subPlatforms: [
        { name: "Meta Ads", icon: "Meta" },
        { name: "Google Ads", icon: "Google" },
        { name: "YouTube Ads", icon: "Play" }
      ],
      characterStyle: "Red neon environment, floating Meta Ads dashboards, Google Ads holograms, ROAS charts, conversion metrics, data streams.",
      characterDesc: "Analytical, Aggressive, Growth Focused, Results Driven. Elite strategist, master planner, and high-performance operator maximizing conversion efficiency.",
      skills: [
        "Meta Ads", "Google Ads", "YouTube Ads", "Amazon Ads",
        "DV360", "CM360", "Reddit Ads", "Quick Commerce Ads",
        "Analytics", "Conversion Tracking", "Campaign Optimization"
      ]
    },
    {
      id: "media-planning",
      title: "Commander Vedant",
      roleTitle: "Media Planner & Buyer",
      characterName: "THE COMMANDER",
      accentColor: "#3B82F6", // Electric Blue
      avatar: "📊",
      image: "/commander.png",
      tagline: "Strategic mind. Perfect planner. I place brands in front of the right eyes.",
      subPlatforms: [
        { name: "DV360", icon: "Target" },
        { name: "Google Marketing", icon: "Globe" },
        { name: "CM360", icon: "Activity" }
      ],
      characterStyle: "Blue command center, audience maps, media buying dashboards, campaign planning holograms, global targeting systems.",
      characterDesc: "Strategic, Organized, Visionary, Precise. Military-style campaign architect mastering omnichannel platforms and forecasting budgets.",
      skills: [
        "Media Planning", "Audience Segmentation", "Budget Forecasting",
        "Media Buying", "Platform Selection", "Campaign Strategy",
        "Cross Platform Execution"
      ]
    },
    {
      id: "branding-strategy",
      title: "Storyteller Vedant",
      roleTitle: "Creative Brand Strategist",
      characterName: "THE STORYTELLER",
      accentColor: "#F59E0B", // Gold
      avatar: "🚀",
      image: "/storyteller.png",
      tagline: "Creative thinker. Story builder. I build brands people remember.",
      subPlatforms: [
        { name: "Brand Strategy", icon: "Award" },
        { name: "Content Strategy", icon: "FileText" },
        { name: "Creative Direction", icon: "Lightbulb" }
      ],
      characterStyle: "Golden atmosphere, creative boards, brand identity walls, storytelling elements, marketing concepts floating around.",
      characterDesc: "Creative, Persuasive, Innovative, Brand Driven. Visionary storyteller and master brand builder designing core narrative playbooks.",
      skills: [
        "Brand Positioning", "Brand Strategy", "Content Strategy",
        "Creative Briefing", "Social Media Marketing", "Campaign Communication"
      ]
    },
    {
      id: "technical-skills",
      title: "Architect Vedant",
      roleTitle: "Marketing Technologist",
      characterName: "THE ARCHITECT",
      accentColor: "#10B981", // Neon Green
      avatar: "⚙️",
      image: "/architect.png",
      tagline: "Systems thinker. Automation lover. I build systems that scale growth.",
      subPlatforms: [
        { name: "GA4", icon: "TrendingUp" },
        { name: "Looker Studio", icon: "Layout" },
        { name: "Tag Manager", icon: "Tag" }
      ],
      characterStyle: "Green cyber environment, tracking systems, automation workflows, analytics dashboards, data networks.",
      characterDesc: "Logical, Efficient, Systematic, Technical. Cyber tech architect engineering server-side tag pipelines and conversion flow frameworks.",
      skills: [
        "GA4", "GTM", "Meta Pixel", "Looker Studio",
        "Advanced Excel", "Dashboard Reporting", "Automation Systems"
      ]
    },
    {
      id: "web-dev",
      title: "Creator Vedant",
      roleTitle: "Creative Developer",
      characterName: "THE CREATOR",
      accentColor: "#8B5CF6", // Purple
      avatar: "💻",
      image: "/creator.png",
      tagline: "Builder at heart. Problem solver. I code ideas into reality.",
      subPlatforms: [
        { name: "Web Development", icon: "Code" },
        { name: "UI/UX Design", icon: "PenTool" },
        { name: "App Development", icon: "Smartphone" }
      ],
      characterStyle: "Purple digital universe, floating code, website mockups, mobile app prototypes, UI systems.",
      characterDesc: "Builder, Problem Solver, Innovator, Creator. Future-focused application engineer building performant interfaces and functional API connections.",
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
      role: "Performance Marketing Executive (Paid Ads)",
      company: "ITD GrowthLabs",
      period: "Present · 4 mos (Full-time)",
      description: "Managing 15+ Logistics, D2C, and E-commerce brands across multiple industries.",
      points: [
        "Experienced in planning, executing, and optimizing campaigns across Google Ads, Meta Ads, LinkedIn Ads, Amazon Ads, Flipkart Ads, Zepto Ads, Blinkit Ads, Swiggy Instamart Ads, JioHotstar Self-Serve, and other biddable media platforms.",
        "Skilled in lead generation, performance marketing, conversion tracking, GTM, GA4, media planning, campaign automation, and ROI optimization.",
        "Also involved in website and app development projects, landing page creation, CRO, and end-to-end digital growth strategies."
      ],
      tools: ["Google Ads", "Meta Ads", "LinkedIn Ads", "Amazon Ads", "Flipkart Ads", "Zepto Ads", "Blinkit Ads", "Swiggy Instamart Ads", "JioHotstar", "GA4", "GTM", "CRO"],
      lessons: "Omnichannel paid ads execution with automated conversion tracking is key to scaling multi-industry accounts."
    },
    {
      id: "timeline-2",
      year: "Apr 2025 - Apr 2026",
      role: "Jr Performance Marketing Executive",
      company: "Mobligent Media",
      period: "1 yr 1 mo (Full-time)",
      description: "Developing media plans aligned with client objectives across Meta, Google, and other digital platforms.",
      points: [
        "Planned, launched, and managed cross-channel performance marketing campaigns on Meta Ads and Google Ads for D2C and service brand portfolios.",
        "Formulated data-driven media plans aligned with client lead generation and acquisition targets.",
        "Collaborated cross-functionally with creative and technical teams to optimize ad copy, audience segments, and CPL metrics."
      ],
      tools: ["Meta Ads", "Google Ads", "Media Planning", "Market Research", "Teamwork", "Conversion Optimization"],
      lessons: "Precision media planning aligned with target client KPIs creates sustainable campaign profitability."
    },
    {
      id: "timeline-3",
      year: "Oct 2024 - Apr 2025",
      role: "Digital Marketing Intern",
      company: "Mobligent Media",
      period: "7 mos (Internship)",
      description: "Gained hands-on experience in social media content creation, reel editing, lead generation, and performance reporting.",
      points: [
        "Gained experience in social media content creation to drive engagement.",
        "Explored marketing strategies by working on real client campaigns.",
        "Understood the process of lead generation through targeted digital efforts.",
        "Edited and created reels for Mobligent and its parent company Mahila, enhancing their digital presence.",
        "Learned to prepare performance reports and insights for reviews."
      ],
      tools: ["Social Media", "Reel Editing", "Content Creation", "Lead Generation", "Performance Reporting"],
      lessons: "Engaging visual content combined with consistent performance tracking builds brand authority."
    },
    {
      id: "timeline-4",
      year: "Aug 2024 - Oct 2024",
      role: "Freelance Performance Marketer & Digital Strategist",
      company: "Rishaan Media & Brand Buddies",
      period: "Freelance Work",
      description: "Independently executed digital marketing strategies, Meta/Google ad setups, and creative content campaigns for clients across Rishaan Media and Brand Buddies.",
      points: [
        "Managed freelance performance marketing campaigns for service, real estate, and lifestyle clients under Rishaan Media.",
        "Partnered with Brand Buddies on performance ad setups, creative brief design, and audience targeting.",
        "Built lead generation funnels, social media content calendars, and visual ad assets using Canva."
      ],
      tools: ["Meta Ads", "Google Ads", "Canva", "Content Strategy", "Freelance Media Buying"],
      lessons: "Agile creative iteration and direct-response ad copy accelerate early-stage campaign validation."
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
      answer: "Vedant has managed over ₹18L+ in advertising spends across Meta Ads, Google PMax/Search, Amazon, and Display channels, delivering consistent increases in return on ad spend (ROAS) and reducing overall CPA."
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

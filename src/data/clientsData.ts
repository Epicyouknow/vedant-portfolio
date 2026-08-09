export interface ClientData {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  website: string;
  category: 'logistics' | 'ecommerce' | 'services' | 'realestate-app';
  campaign: string;
  objective: string;
  platforms: string[];
  role: string;
  challenge: string;
  approach: string[];
  result: string;
  logo: string;
}

export const CLIENTS_DATA: ClientData[] = [
  {
    id: 'pannest',
    slug: 'pannest',
    name: 'Pannest',
    subtitle: 'Surface & Cold Chain Logistics',
    website: 'https://www.pannest.com/',
    category: 'logistics',
    campaign: 'Surface Express & Cold Chain Pharma Logistics',
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
    slug: 'zoomcaargo',
    name: 'ZoomCaargo',
    subtitle: 'Time-Critical Air Freight & Import Specialist',
    website: 'https://zoomcaargo.com/',
    category: 'logistics',
    campaign: 'Time-Critical Air Freight & China–India Import Specialist',
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
    slug: 'we3scs',
    name: 'WE3SCS',
    subtitle: 'Logistics / Freight Services',
    website: 'https://we3scs.com/',
    category: 'logistics',
    campaign: 'Logistics / Freight Services',
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
    slug: 'parcel-solution',
    name: 'Parcel Solution',
    subtitle: 'Courier & Logistics Services',
    website: 'https://parcelsolution.co.in/',
    category: 'logistics',
    campaign: 'Courier & Logistics Services',
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
    slug: 'skyhorse',
    name: 'Skyhorse Logistics',
    subtitle: 'Freight Forwarding',
    website: 'https://www.skyhorselogistics.com/',
    category: 'logistics',
    campaign: 'Logistics / Freight Forwarding',
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
    slug: 'itd-software',
    name: 'ITD Software',
    subtitle: 'Enterprise Software & IT Services',
    website: 'https://itdservices.in/',
    category: 'services',
    campaign: 'Software / IT Technology Services',
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
    slug: 'itd-growthlabs',
    name: 'ITD Growth Labs',
    subtitle: 'D2C Performance Marketing Agency',
    website: 'https://itdgrowthlabs.com/',
    category: 'services',
    campaign: 'D2C Digital Marketing & Performance Agency',
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
    slug: 'bhavani-courier',
    name: 'Bhavani Courier',
    subtitle: 'Regional Courier Services',
    website: 'https://bhavanicourier.com/',
    category: 'logistics',
    campaign: 'Courier & Regional Logistics Campaigns',
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
    slug: 'jdic',
    name: 'JDIC',
    subtitle: 'International Courier',
    website: 'https://www.jdic.in/',
    category: 'logistics',
    campaign: 'International Courier & Overseas Parcel Shipping',
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
    slug: 'sobo-logistics',
    name: 'SOBO Logistics',
    subtitle: 'Metropolitan Logistics',
    website: 'https://www.sobologistics.in/',
    category: 'logistics',
    campaign: 'Logistics / Freight Services',
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
    slug: 'kaizen-realty',
    name: 'Kaizen Realty',
    subtitle: 'Real Estate & Property Marketing',
    website: 'https://www.kaizenrealty.co/',
    category: 'realestate-app',
    campaign: 'Demand Gen & Real Estate Property Marketing',
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
    slug: 'bellissima-by-excel',
    name: 'Bellissima by Excel',
    subtitle: 'Premium Real Estate META & Google Search Ads',
    website: 'https://bellissimaexcel.com/',
    category: 'services',
    campaign: 'Google Search & META Real Estate Campaign',
    objective: 'Lead Generation',
    platforms: ['Google Search Ads', 'Meta Ads'],
    role: 'Strategy • Media Buying • Policy Resolution • Account Recovery',
    challenge: 'Resolve a critical Google Ads account verification & policy suspension issue while scaling premium buyer lead generation.',
    approach: [
      'Executed full account compliance audit & Advertiser Verification protocol',
      'Restructured Meta & Google Search campaigns for high-net-worth real estate buyers',
      'Configured high-converting landing page forms with instant CRM routing'
    ],
    result: 'Successfully restored active Google Ads account status and scaled premium property buyer lead flow.',
    logo: '/clients/Bellissima logo.png'
  },
  {
    id: 'style-shine',
    slug: 'style-and-shine-lounge',
    name: 'Style & Shine Lounge',
    subtitle: 'Salon & Beauty Marketing',
    website: 'https://www.instagram.com/ssloungebysamina/',
    category: 'services',
    campaign: 'Beauty / Salon Marketing',
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
    slug: 'cutistic-gifts',
    name: 'Cutistic Gifts',
    subtitle: 'E-Commerce & Shopify Sales',
    website: 'https://www.cutisticgifts.in/',
    category: 'ecommerce',
    campaign: 'E-Commerce Purchase Conversion & Shopify Sales',
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
    slug: 'gujju-express-logistics',
    name: 'Gujju Express Logistics',
    subtitle: 'International Courier & Rakhi Campaign',
    website: 'https://gujjuexpress.com/',
    category: 'logistics',
    campaign: 'International Courier (Raksha Bandhan Campaign)',
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
    slug: 'travelkitsr',
    name: 'TravelKitSR',
    subtitle: 'Travel Gear E-Commerce',
    website: 'http://travelkitsr.com/',
    category: 'ecommerce',
    campaign: 'Travel Product Advertising',
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
    slug: 'koli-catch',
    name: 'Koli Catch',
    subtitle: 'App Installs & JioHotstar',
    website: 'https://kolicatch.io/',
    category: 'realestate-app',
    campaign: 'App Install & User Acquisition',
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
    slug: 'jit-steels',
    name: 'Jit Steels',
    subtitle: 'Industrial Steel Supplies',
    website: 'https://www.pannest.com/', // B2B Industrial
    category: 'services',
    campaign: 'Industrial & Steel Supplies Lead Generation',
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

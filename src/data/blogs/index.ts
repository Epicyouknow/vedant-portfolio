import appUserAcquisition from './app-user-acquisition-cpi-optimization-jiohotstar.json';
import b2bLogistics from './b2b-logistics-cpl-reduction-search-intent.json';
import creativeTesting from './creative-testing-framework-20.json';
import curaScaling from './how-we-scaled-cura-meta-ads-cost-per-result.json';
import d2cShopify from './d2c-shopify-capi-meta-pixel-tracking.json';
import ga4Tracking from './ga4-gtm-tracking-guide.json';
import googleVerification from './google-ads-account-suspension-advertiser-verification-guide.json';
import googlePmax from './google-ads-performance-max-guide.json';
import metaAdsVsGoogleAds from './meta-ads-vs-google-ads-d2c-india.json';
import metaAttribution from './meta-ads-attribution-2025.json';
import metaAdvantage from './meta-advantage-plus-explained.json';
import pmaxEcommerce from './performance-max-ecommerce-strategy.json';
import realEstateLeads from './real-estate-demand-gen-high-net-worth-buyer-leads.json';
import scaleLeadsFramework from './how-to-scale-leads-slash-cost-per-result-framework.json';
import searchAds2026 from './search-ads-in-2026.json';
import seasonalCourier from './seasonal-festive-courier-ad-creative-matrix.json';
import travelTechMarketing from './travel-tech-performance-marketing-ai-itinerary-apps.json';

export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface SEOMeta {
  title: string;
  description: string;
  keywords: string[];
}

export interface BlogPost {
  title: string;
  slug: string;
  coverImage: string;
  seoMeta: SEOMeta;
  summary: string;
  content: string;
  tags: string[];
  category: string;
  author: Author;
  readingTime: string;
  publishDate: string;
  featured: boolean;
  views: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

const STATIC_BLOGS: BlogPost[] = [
  metaAdsVsGoogleAds as BlogPost,
  curaScaling as BlogPost,
  travelTechMarketing as BlogPost,
  scaleLeadsFramework as BlogPost,
  ga4Tracking as BlogPost,
  metaAttribution as BlogPost,
  pmaxEcommerce as BlogPost,
  googleVerification as BlogPost,
  b2bLogistics as BlogPost,
  d2cShopify as BlogPost,
  realEstateLeads as BlogPost,
  appUserAcquisition as BlogPost,
  seasonalCourier as BlogPost,
  googlePmax as BlogPost,
  searchAds2026 as BlogPost,
  metaAdvantage as BlogPost,
  creativeTesting as BlogPost,
];

export { STATIC_BLOGS };

/**
 * Returns static blogs with appropriate cover images. Safe for both client and server components.
 */
export function getAllBlogs(): BlogPost[] {
  return STATIC_BLOGS.map((blog) => ({
    ...blog,
    coverImage: blog.coverImage || `/covers/${blog.slug}.svg`,
  })).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

export function getBlogBySlug(slug: string): BlogPost | null {
  const all = getAllBlogs();
  const blog = all.find((b) => b.slug === slug);
  if (!blog) return null;
  return {
    ...blog,
    coverImage: blog.coverImage || `/covers/${blog.slug}.svg`,
  };
}

export function getFeaturedBlog(): BlogPost | null {
  const all = getAllBlogs();
  const featured = all.find((blog) => blog.featured) || all[0] || null;
  if (!featured) return null;
  return {
    ...featured,
    coverImage: featured.coverImage || `/covers/${featured.slug}.svg`,
  };
}


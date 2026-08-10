import appUserAcquisition from './app-user-acquisition-cpi-optimization-jiohotstar.json';
import b2bLogistics from './b2b-logistics-cpl-reduction-search-intent.json';
import creativeTesting from './creative-testing-framework-20.json';
import d2cShopify from './d2c-shopify-capi-meta-pixel-tracking.json';
import googleVerification from './google-ads-account-suspension-advertiser-verification-guide.json';
import googlePmax from './google-ads-performance-max-guide.json';
import metaAdvantage from './meta-advantage-plus-explained.json';
import realEstateLeads from './real-estate-demand-gen-high-net-worth-buyer-leads.json';
import searchAds2026 from './search-ads-in-2026.json';
import seasonalCourier from './seasonal-festive-courier-ad-creative-matrix.json';

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

const ALL_BLOGS: BlogPost[] = [
  googlePmax as BlogPost,
  googleVerification as BlogPost,
  b2bLogistics as BlogPost,
  d2cShopify as BlogPost,
  realEstateLeads as BlogPost,
  appUserAcquisition as BlogPost,
  seasonalCourier as BlogPost,
  metaAdvantage as BlogPost,
  creativeTesting as BlogPost,
  searchAds2026 as BlogPost,
];

export function getAllBlogs(): BlogPost[] {
  return ALL_BLOGS.map((blog) => ({ ...blog, coverImage: '' })).sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export function getBlogBySlug(slug: string): BlogPost | null {
  const blog = ALL_BLOGS.find((b) => b.slug === slug);
  if (!blog) return null;
  return { ...blog, coverImage: '' };
}

export function getFeaturedBlog(): BlogPost | null {
  const featured = ALL_BLOGS.find((blog) => blog.featured) || ALL_BLOGS[0] || null;
  if (!featured) return null;
  return { ...featured, coverImage: '' };
}

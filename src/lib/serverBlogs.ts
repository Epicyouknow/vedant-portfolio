import fs from 'fs';
import path from 'path';
import os from 'os';
import { STATIC_BLOGS, BlogPost } from '../data/blogs';
import { getContentDrafts } from './growthDeskStorage';

/**
 * Server-only blog loader.
 * Merges static predefined posts with dynamically published JSON files and published Growth Desk drafts.
 */
export function getServerBlogs(): BlogPost[] {
  const blogsMap = new Map<string, BlogPost>();

  // 1. Add static base blogs
  for (const blog of STATIC_BLOGS) {
    blogsMap.set(blog.slug, {
      ...blog,
      coverImage: blog.coverImage || `/covers/${blog.slug}.svg`,
    });
  }

  // 2. Scan disk on server runtime for dynamically published blog files
  const searchDirs = [
    path.join(process.cwd(), 'src', 'data', 'blogs'),
    path.join(os.tmpdir(), 'blogs'),
  ];

  for (const dir of searchDirs) {
    try {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.endsWith('.json') && !file.startsWith('.')) {
            try {
              const filePath = path.join(dir, file);
              const raw = fs.readFileSync(filePath, 'utf8');
              const parsed: BlogPost = JSON.parse(raw);
              if (parsed && parsed.slug && parsed.title && parsed.content) {
                blogsMap.set(parsed.slug, {
                  ...parsed,
                  coverImage: parsed.coverImage || `/covers/${parsed.slug}.svg`,
                });
              }
            } catch {
              // Ignore single file parse errors
            }
          }
        }
      }
    } catch {
      // Ignore directory access errors
    }
  }

  // 3. Scan Growth Desk storage for any drafts with status: 'Published'
  try {
    const drafts = getContentDrafts();
    for (const draft of drafts) {
      if (draft.status === 'Published' && draft.slug && !blogsMap.has(draft.slug)) {
        blogsMap.set(draft.slug, {
          title: draft.title,
          slug: draft.slug,
          coverImage: draft.coverImage || `/covers/${draft.slug}.svg`,
          seoMeta: {
            title: draft.seo?.title || draft.title,
            description: draft.seo?.description || draft.summary || '',
            keywords: draft.seo?.keywords || draft.tags || [],
          },
          summary: draft.summary || '',
          content: draft.content || '',
          tags: draft.tags || [],
          category: draft.category || 'Performance Marketing',
          author: {
            name: draft.author?.name || 'Vedant Tiwari',
            role: draft.author?.role || 'Founder & Performance Architect',
            avatar: draft.author?.avatar || '/images/vedant-avatar.jpg',
          },
          readingTime: `${draft.readingTime || 4} min read`,
          publishDate: draft.publishedAt || new Date().toISOString().split('T')[0],
          featured: false,
          views: 120,
        });
      }
    }
  } catch {
    // Graceful fallback
  }

  return Array.from(blogsMap.values()).sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export function getServerBlogBySlug(slug: string): BlogPost | null {
  const all = getServerBlogs();
  const blog = all.find((b) => b.slug === slug);
  if (!blog) return null;
  return {
    ...blog,
    coverImage: blog.coverImage || `/covers/${blog.slug}.svg`,
  };
}

export function getServerFeaturedBlog(): BlogPost | null {
  const all = getServerBlogs();
  const featured = all.find((blog) => blog.featured) || all[0] || null;
  if (!featured) return null;
  return {
    ...featured,
    coverImage: featured.coverImage || `/covers/${featured.slug}.svg`,
  };
}

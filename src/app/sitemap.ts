import { MetadataRoute } from 'next';
import { getAllCaseStudies } from '../lib/caseStudyStorage';
import { getAllBlogs } from '../data/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vedantverse.in';

  const clientPages: MetadataRoute.Sitemap = getAllCaseStudies().map((client) => ({
    url: `${baseUrl}/clients/${client.slug}`,
    lastModified: new Date(client.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const allBlogs = getAllBlogs();
  const blogPages: MetadataRoute.Sitemap = allBlogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.publishDate || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  return [...staticPages, ...clientPages, ...blogPages];
}

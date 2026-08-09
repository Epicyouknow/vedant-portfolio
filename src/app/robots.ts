import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Googlebot', 'Bingbot'],
        allow: '/',
      },
    ],
    sitemap: 'https://vedantverse.in/sitemap.xml',
  };
}

import React from 'react';
import { Metadata } from 'next';
import { getServerBlogs, getServerFeaturedBlog } from '../../lib/serverBlogs';
import BlogLandingClient from './BlogLandingClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'The Marketing Cinema | VedantVerse Content Universe',
  description: 'Explore blockbuster marketing strategies, campaign breakdowns, and real growth stories inside the VedantVerse.',
};

export default function BlogLandingPage() {
  const blogs = getServerBlogs();
  const featured = getServerFeaturedBlog();

  return (
    <BlogLandingClient
      initialBlogs={blogs}
      initialFeatured={featured}
    />
  );
}

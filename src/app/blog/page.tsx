import React from 'react';
import { Metadata } from 'next';
import { getAllBlogs, getFeaturedBlog } from '../../data/blogs';
import BlogLandingClient from './BlogLandingClient';

export const metadata: Metadata = {
  title: 'The Marketing Cinema | VedantVerse Content Universe',
  description: 'Explore blockbuster marketing strategies, campaign breakdowns, and real growth stories inside the VedantVerse.',
};

export default function BlogLandingPage() {
  const blogs = getAllBlogs();
  const featured = getFeaturedBlog();

  return (
    <BlogLandingClient
      initialBlogs={blogs}
      initialFeatured={featured}
    />
  );
}

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllBlogs, getBlogBySlug, BlogPost } from '../../../data/blogs';
import ArticleViewClient from './ArticleViewClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for Next.js build optimization (ISR/SSG)
export async function generateStaticParams() {
  const blogs = getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

// Dynamic SEO metadata generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Article Not Found | VedantVerse',
    };
  }

  return {
    title: blog.seoMeta.title,
    description: blog.seoMeta.description,
    keywords: blog.seoMeta.keywords,
    openGraph: {
      title: blog.seoMeta.title,
      description: blog.seoMeta.description,
      images: [{ url: blog.coverImage || '/og-image.png' }],
      type: 'article',
      publishedTime: blog.publishDate,
      authors: [blog.author.name],
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.seoMeta.title,
      description: blog.seoMeta.description,
      images: [blog.coverImage || '/og-image.png'],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  const allBlogs = getAllBlogs();

  if (!blog) {
    notFound();
  }

  // Inject automated structured schemas inside script tags
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    image: blog.coverImage,
    datePublished: blog.publishDate,
    author: {
      '@type': 'Person',
      name: blog.author.name,
      jobTitle: blog.author.role,
      image: 'https://vedantverse.in/vedant_portrait.png',
    },
    publisher: {
      '@type': 'Organization',
      name: 'VedantVerse',
      logo: 'https://vedantverse.in/favicon.png',
    },
    description: blog.summary,
    mainEntityOfPage: `https://vedantverse.in/blog/${blog.slug}`,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the primary takeaway of this campaign breakdown?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: blog.summary,
        },
      },
    ],
  };

  return (
    <section>
      {/* JSON-LD Schemas - Sanitized using unicode replacements */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* Render Client-Side Views */}
      <ArticleViewClient blog={blog} allBlogs={allBlogs} />
    </section>
  );
}

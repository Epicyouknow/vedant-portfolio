import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, getAllCaseStudies, ClientCaseStudy } from '../../../lib/caseStudyStorage';
import ClientCaseStudyView from './ClientCaseStudyView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const studies = getAllCaseStudies();
  return studies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return {
      title: 'Case Study Not Found | VedantVerse',
    };
  }

  return {
    title: `${study.name} Case Study | ${study.campaign} | VedantVerse`,
    description: `Performance marketing case study for ${study.name} by Vedant Tiwari. Objective: ${study.objective}. Industry: ${study.industry}. Platforms: ${study.platforms.join(', ')}.`,
    keywords: [
      `${study.name} performance marketing`,
      `${study.name} case study`,
      `${study.campaign}`,
      'Vedant Tiwari case study',
      'Performance Marketing Executive Mumbai',
      ...study.platforms,
    ],
    metadataBase: new URL('https://vedantverse.in'),
    alternates: {
      canonical: `https://vedantverse.in/clients/${study.slug}`,
    },
    openGraph: {
      title: `${study.name} Performance Case Study - ${study.campaign}`,
      description: `Strategy, campaign evidence & performance results for ${study.name}.`,
      url: `https://vedantverse.in/clients/${study.slug}`,
      siteName: 'VedantVerse',
      images: [
        {
          url: study.logo,
          alt: `${study.name} Logo`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${study.name} Case Study | VedantVerse`,
      description: `Growth case study for ${study.name} by Vedant Tiwari.`,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  const allStudies = getAllCaseStudies();

  if (!study) {
    notFound();
  }

  const otherStudies = allStudies.filter((s) => s.slug !== study.slug).slice(0, 6);

  // Structured Data (JSON-LD)
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${study.name} Performance Marketing Case Study`,
    image: study.logo,
    author: {
      '@type': 'Person',
      name: 'Vedant Tiwari',
      jobTitle: 'Performance Marketing Executive',
    },
    publisher: {
      '@type': 'Organization',
      name: 'VedantVerse',
      url: 'https://vedantverse.in',
    },
    description: study.challenge,
    mainEntityOfPage: `https://vedantverse.in/clients/${study.slug}`,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://vedantverse.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Clients',
        item: 'https://vedantverse.in/#client-intelligence',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: study.name,
        item: `https://vedantverse.in/clients/${study.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleLd).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c'),
        }}
      />
      <ClientCaseStudyView study={study} otherStudies={otherStudies} />
    </>
  );
}

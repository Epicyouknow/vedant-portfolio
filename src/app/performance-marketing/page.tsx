import type { Metadata } from 'next';
import PerformanceMarketingClient from './PerformanceMarketingClient';

export const metadata: Metadata = {
  title: 'Performance Marketing That Makes Business Sense | VedantVerse — Vedant Tiwari',
  description: 'Turn your business goals into a structured advertising strategy through media, creative, tracking and optimisation. Led by Vedant Tiwari, Performance Marketing Executive.',
  keywords: [
    'Performance Marketing Mumbai',
    'Meta Ads Specialist',
    'Google Ads Consultant',
    'CAPI and Pixel Setup',
    'Media Planning India',
    'B2B Lead Generation',
    'D2C ROAS Scaling',
    'Vedant Tiwari',
    'VedantVerse Growth'
  ],
  alternates: {
    canonical: 'https://vedantverse.in/performance-marketing',
  },
  openGraph: {
    title: 'Performance Marketing That Makes Business Sense | VedantVerse',
    description: 'Turn your business goals into a structured advertising strategy through media, creative, tracking and optimisation.',
    url: 'https://vedantverse.in/performance-marketing',
    siteName: 'VedantVerse',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Performance Marketing That Makes Business Sense — Vedant Tiwari',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Performance Marketing That Makes Business Sense | VedantVerse',
    description: 'Turn your business goals into a structured advertising strategy through media, creative, tracking and optimisation.',
    images: ['/og-image.png'],
  },
};

export default function PerformanceMarketingPage() {
  return <PerformanceMarketingClient />;
}


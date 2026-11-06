import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | VedantVerse',
  description: 'Terms of Service for VedantVerse portfolio and media growth operations.',
  alternates: {
    canonical: 'https://vedantverse.in/terms',
  },
  openGraph: {
    title: 'Terms of Service | VedantVerse',
    description: 'Terms of Service for VedantVerse portfolio and media growth operations.',
    url: 'https://vedantverse.in/terms',
    siteName: 'VedantVerse',
    type: 'website',
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Support | VedantVerse',
  description: 'Client desk and contact support for VedantVerse portfolio inquiries.',
  alternates: {
    canonical: 'https://vedantverse.in/support',
  },
  openGraph: {
    title: 'Contact Support | VedantVerse',
    description: 'Client desk and contact support for VedantVerse portfolio inquiries.',
    url: 'https://vedantverse.in/support',
    siteName: 'VedantVerse',
    type: 'website',
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

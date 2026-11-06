import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | VedantVerse',
  description: 'Privacy Policy for VedantVerse. Learn how visitor information, cookies, and analytics data are collected and handled.',
  alternates: {
    canonical: 'https://vedantverse.in/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | VedantVerse',
    description: 'Privacy Policy for VedantVerse. Learn how visitor information and analytics data are handled.',
    url: 'https://vedantverse.in/privacy',
    siteName: 'VedantVerse',
    type: 'website',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


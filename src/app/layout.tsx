import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnalyticsScripts from "../components/AnalyticsScripts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vedant Tiwari | Senior Performance Marketing Executive & Media Planner | VedantVerse",
  description: "Official portfolio of Vedant Tiwari — Performance Marketing Executive, Media Planner, and Growth Strategist based in Mumbai. Specialized in scaling ROAS, managing ₹18L+ ad budgets across Meta Ads, Google Ads, DV360, CM360, GA4, and JioHotstar.",
  keywords: [
    "Vedant Tiwari",
    "VedantVerse",
    "Performance Marketing Executive",
    "Media Planner Mumbai",
    "Digital Growth Marketer",
    "Meta Ads Specialist India",
    "Google Ads Expert Mumbai",
    "DV360 Media Buyer",
    "CM360 Ad Operations",
    "ROAS Optimization Portfolio",
    "Performance Marketing Portfolio",
    "Media Buying Portfolio",
  ],
  authors: [{ name: "Vedant Tiwari", url: "https://vedantverse.in" }],
  creator: "Vedant Tiwari",
  publisher: "VedantVerse",
  metadataBase: new URL("https://vedantverse.in"),
  alternates: {
    canonical: "https://vedantverse.in",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Vedant Tiwari | Senior Performance Marketing Executive & Media Planner",
    description: "Official portfolio of Vedant Tiwari — Performance Marketing Executive & Media Planner in Mumbai. Scaling ROAS across Meta, Google Ads, DV360, and CM360.",
    url: "https://vedantverse.in",
    siteName: "VedantVerse",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vedant Tiwari - Performance Marketing Executive & Media Planner",
      },
    ],
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vedant Tiwari | Senior Performance Marketing Executive & Media Planner",
    description: "Official portfolio of Vedant Tiwari — Performance Marketing Executive & Media Planner in Mumbai.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://vedantverse.in/#person",
      "name": "Vedant Tiwari",
      "jobTitle": "Performance Marketing Executive & Media Planner",
      "worksFor": {
        "@type": "Organization",
        "name": "VedantVerse Digital Strategy"
      },
      "url": "https://vedantverse.in",
      "sameAs": [
        "https://www.linkedin.com/in/vedant-tiwarii",
        "https://github.com/Epicyouknow/vedant-portfolio"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mumbai",
        "addressCountry": "India"
      },
      "knowsAbout": [
        "Performance Marketing",
        "Media Planning and Buying",
        "Meta Ads",
        "Google Ads",
        "DV360",
        "CM360",
        "GA4 Analytics",
        "Conversion Rate Optimization (CRO)",
        "ROAS Scaling"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://vedantverse.in/#website",
      "url": "https://vedantverse.in",
      "name": "VedantVerse",
      "description": "Portfolio of Vedant Tiwari — Performance Marketing Executive & Media Planner",
      "publisher": {
        "@id": "https://vedantverse.in/#person"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AnalyticsScripts />
        {children}
      </body>
    </html>
  );
}

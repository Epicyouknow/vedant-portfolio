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
  title: "VedantVerse | Growth Through Strategy, Media & Performance",
  description: "Performance Marketing Executive, Media Planner, Brand Strategist, and Growth Marketer. Explore VedantVerse — a cinematic portfolio showcasing campaigns, strategies, and digital growth journeys.",
  metadataBase: new URL("https://vedantverse.in"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "VedantVerse | Growth Through Strategy, Media & Performance",
    description: "Performance Marketing Executive, Media Planner, Brand Strategist, and Growth Marketer. Explore VedantVerse — a cinematic portfolio showcasing campaigns, strategies, and digital growth journeys.",
    url: "https://vedantverse.in",
    siteName: "VedantVerse",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VedantVerse - Growth Through Strategy, Media & Performance",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VedantVerse | Growth Through Strategy, Media & Performance",
    description: "Performance Marketing Executive, Media Planner, Brand Strategist, and Growth Marketer. Explore VedantVerse — a cinematic portfolio showcasing campaigns, strategies, and digital growth journeys.",
    images: ["/og-image.png"],
  },
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
      <body className="min-h-full flex flex-col">
        <AnalyticsScripts />
        {children}
      </body>
    </html>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import IndustriesScaled from '../../components/IndustriesScaled';
import ContactAndFooter from '../../components/ContactAndFooter';

export const metadata: Metadata = {
  title: "Industries We've Scaled | VedantVerse — Performance Marketing",
  description:
    'Explore how Vedant Tiwari scales logistics, jewellery, D2C, and app verticals with full-funnel Meta Ads, Google Ads, and high-converting acquisition funnels.',
};

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 w-full pt-16">
        <IndustriesScaled />
      </main>
      <ContactAndFooter />
    </div>
  );
}


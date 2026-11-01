import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import InteractiveCareerMap from '../../components/InteractiveCareerMap';
import ContactAndFooter from '../../components/ContactAndFooter';

export const metadata: Metadata = {
  title: 'Interactive Career Transit Map | VedantVerse — Vedant Tiwari',
  description:
    'An interactive transit journey through Vedant Tiwari’s performance marketing career from freelance media buying to scaling 15+ logistics, D2C, and e-commerce brands.',
};

export default function CareerMapPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 w-full pt-16">
        <InteractiveCareerMap />
      </main>
      <ContactAndFooter />
    </div>
  );
}


import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import UnlockedAchievements from '../../components/UnlockedAchievements';
import ContactAndFooter from '../../components/ContactAndFooter';

export const metadata: Metadata = {
  title: 'Unlocked Achievements & Certifications | VedantVerse — Vedant Tiwari',
  description:
    'Verified credentials and platform certifications in Google Search Ads, GA4, DV360, CM360, Amazon DSP, and Reddit Advertising held by Vedant Tiwari.',
};

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 w-full pt-16">
        <UnlockedAchievements />
      </main>
      <ContactAndFooter />
    </div>
  );
}


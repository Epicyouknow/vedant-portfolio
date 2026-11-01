'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Award, ExternalLink, CheckCircle2, X, Sparkles, TrendingUp, DollarSign, Layers } from 'lucide-react';
import { SlideScene } from './motion/MotionSystem';
import { portfolioData } from '../data/portfolio';

interface CertificationDetail {
  id: string;
  title: string;
  issuer: string;
  issuerGroup: 'google' | 'reddit' | 'amazon';
  date: string;
  color: string;
  certId: string;
  skills: string[];
  description: string;
  credentialUrl: string;
}

const detailedCertifications: CertificationDetail[] = [
  {
    id: 'cert-1',
    title: 'Google Ads Display Certification',
    issuer: 'Google Digital Academy (Skillshop)',
    issuerGroup: 'google',
    date: 'Issued Jun 2025 · Expires Jun 2026',
    color: '#4285F4',
    certId: '8301b3dc-e487',
    credentialUrl: 'https://skillshop.credential.net/8301b3dc-e487-48b2-adc4-6fb24f5e837c#acc.KA1LHhX2',
    skills: ['Display Network Strategy', 'Responsive Display Ads (RDA)', 'Smart Display Campaigns', 'In-Market & Custom Intent Audiences'],
    description: 'Certified in designing high-performing Google Display campaigns, dynamic creative testing, and automated smart bidding algorithms that drive brand lift and conversion volume.',
  },
  {
    id: 'cert-2',
    title: 'Campaign Manager 360 Certification',
    issuer: 'Google Marketing Platform',
    issuerGroup: 'google',
    date: 'Issued Jun 2025 · Expires Jun 2026',
    color: '#FBBC05',
    certId: 'defd58dc-f43f',
    credentialUrl: 'https://skillshop.credential.net/defd58dc-f43f-4c2d-8bbc-5651c104ebd3',
    skills: ['Floodlight Tag Architecture', 'Creative Trafficking', 'Enterprise Verification Protocols', 'Cross-Device Attribution'],
    description: 'Accredited in Google enterprise ad serving, Floodlight conversion tag implementation, creative asset trafficking, multi-publisher campaign verification, and reporting.',
  },
  {
    id: 'cert-3',
    title: 'Display & Video 360 Certification',
    issuer: 'Google Marketing Platform',
    issuerGroup: 'google',
    date: 'Issued Jun 2025 · Expires Jun 2026',
    color: '#34A853',
    certId: '3c2e0e98-2cce',
    credentialUrl: 'https://skillshop.credential.net/3c2e0e98-2cce-4ef5-ab54-fbcff9a1ec96',
    skills: ['Programmatic DSP Buying', 'Private Marketplace (PMP) Deals', 'Frequency Capping Protocols', 'Cross-Exchange Ad Inventory'],
    description: 'Enterprise DSP certification in managing end-to-end programmatic media campaigns, real-time bidding strategies, deal marketplace negotiations, and cross-channel audience targeting.',
  },
  {
    id: 'cert-4',
    title: 'Google Ads Creative Certification',
    issuer: 'Google Digital Academy (Skillshop)',
    issuerGroup: 'google',
    date: 'Issued Jan 2025 · Expires Jan 2026',
    color: '#EA4335',
    certId: '90936049-e0e9',
    credentialUrl: 'https://skillshop.credential.net/90936049-e0e9-4c27-929e-fb684ba63378',
    skills: ['Creative Asset Optimization', 'Video Action Campaigns (VAC)', 'ABCD Framework for Ads', 'Asset Quality Score Lift'],
    description: 'Expertise in building data-backed digital ad creative, optimizing YouTube Video Action Campaigns, testing dynamic visual assets, and maximizing Attention, Branding, Connection, and Direction.',
  },
  {
    id: 'cert-5',
    title: 'Reddit Ads Fundamentals Certification',
    issuer: 'Reddit for Business (Ads Formula)',
    issuerGroup: 'reddit',
    date: 'Issued Aug 2025 · Verified',
    color: '#FF4500',
    certId: 'HnHEMaGchQKF',
    credentialUrl: 'https://adsformula.redditforbusiness.com/student/award/HnHEMaGchQKFf2W9JnQCVk1x',
    skills: ['Reddit Ad Mechanics', 'Auction Bidding Dynamics', 'Community Interest Mapping', 'Conversation Placement Formats'],
    description: 'Accredited in Reddit advertising foundation, auction mechanics, campaign objective selection, community discovery, and conversation placement ad executions.',
  },
  {
    id: 'cert-6',
    title: 'Reddit Ads Boost Certification',
    issuer: 'Reddit for Business (Ads Formula)',
    issuerGroup: 'reddit',
    date: 'Issued Aug 2025 · Verified',
    color: '#FF5722',
    certId: 'LdNYZsE7kK1Y',
    credentialUrl: 'https://adsformula.redditforbusiness.com/student/award/LdNYZsE7kK1YFNyi7ZC22V9y',
    skills: ['Conversion Value Bidding', 'Reddit Conversions API (CAPI)', 'Full-Funnel Scaling', 'Audience Retargeting'],
    description: 'Advanced certification in performance scaling on Reddit, server-side Conversions API integration, conversion value bidding, and full-funnel customer acquisition.',
  },
  {
    id: 'cert-7',
    title: 'Reddit Ads Creative Micro-certification',
    issuer: 'Reddit for Business (Ads Formula)',
    issuerGroup: 'reddit',
    date: 'Issued Aug 2025 · Verified',
    color: '#D84315',
    certId: 'SqYoLtaKDzR9',
    credentialUrl: 'https://adsformula.redditforbusiness.com/student/award/SqYoLtaKDzR9i99pNVmFBLiz',
    skills: ['Native Copywriting', 'Reddit Conversational Tone', 'Visual Hook Engineering', 'Subreddit Contextualization'],
    description: 'Specialized credential in creating native, community-first Reddit ad creative, authentic comment responses, and visual storytelling aligned with subreddit community culture.',
  },
  {
    id: 'cert-8',
    title: 'Amazon DSP Certification',
    issuer: 'Amazon Ads Academy',
    issuerGroup: 'amazon',
    date: 'Issued Feb 2026 · Expires Feb 2028',
    color: '#FF9900',
    certId: 'AMZ-DSP-2026',
    credentialUrl: 'https://learningconsole.amazonadvertising.com/',
    skills: ['Retail Media Buying', 'In-Market Shopper Audiences', 'Amazon Retargeting Loops', 'Off-Amazon Programmatic Inventory'],
    description: 'Accreditation in programmatic retail media buying leveraging Amazon exclusive first-party shopper signals to reach high-intent buyers across Amazon and third-party web inventory.',
  },
];

const milestoneStats = [
  {
    label: 'Ad Spend Managed',
    value: '₹50L+',
    description: 'Across Meta, Google, Amazon, Blinkit & Zepto platforms',
  },
  {
    label: 'Campaigns Executed',
    value: '100+',
    description: 'Full-funnel lead gen, e-commerce purchases, and app installs',
  },
  {
    label: 'Qualified Leads Captured',
    value: '25,000+',
    description: 'High-intent B2B freight & B2C inquiries routed',
  },
  {
    label: 'Paid Channels Mastered',
    value: '7+',
    description: 'Google, Meta, LinkedIn, Amazon, Blinkit, Zepto & JioHotstar',
  },
];

export default function UnlockedAchievements() {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedCert, setSelectedCert] = useState<CertificationDetail | null>(null);

  const filterTabs = [
    { id: 'all', label: `All Credentials (${detailedCertifications.length})` },
    { id: 'google', label: 'Google Marketing (4)' },
    { id: 'reddit', label: 'Reddit Ads (3)' },
    { id: 'amazon', label: 'Amazon DSP (1)' },
  ];

  const filteredCerts = detailedCertifications.filter(
    (c) => selectedGroup === 'all' || c.issuerGroup === selectedGroup
  );

  return (
    <SlideScene id="unlocked-achievements" className="py-20 md:py-28 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* SECTION HEADER — matching exact font size and boldness across the site */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-0.5 bg-[var(--accent-red)]" />
              <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[var(--text-muted)]">
                — CREDENTIALS &amp; ACHIEVEMENTS
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.15]">
              Verified credentials and{' '}
              <span className="text-[var(--accent-red)]">proven milestones.</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-md">
            Official platform certifications and validated track record in full-funnel media buying, analytics architecture, and programmatic ad networks.
          </p>
        </div>

        {/* 4 CORE MILESTONES BANNER */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {milestoneStats.map((item, mIdx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: mIdx * 0.06 }}
              className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-red)]/40 transition-colors"
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                {item.label}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[var(--accent-red)] font-mono tracking-tight mb-1.5">
                {item.value}
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-snug">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ISSUER FILTER TABS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 pb-1">
          {filterTabs.map((tab) => {
            const isActive = selectedGroup === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedGroup(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#191919] text-white dark:bg-[#F7F5F0] dark:text-[#191919] shadow-xs'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]/30'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CERTIFICATIONS GRID (8 CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredCerts.map((cert, idx) => (
            <motion.article
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              onClick={() => setSelectedCert(cert)}
              className="group relative rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 sm:p-6 flex flex-col justify-between hover:border-[var(--accent-red)]/50 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Top Color Accent Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
                style={{ backgroundColor: cert.color }}
              />

              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3 mb-3.5 pt-1">
                  <div className="p-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                    <ShieldCheck className="w-5 h-5" style={{ color: cert.color }} />
                  </div>

                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-mono font-bold tracking-wider uppercase border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                    title="Click to view official credential verification"
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    <span>Verified</span>
                  </a>
                </div>

                {/* Issuer */}
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] block mb-1">
                  {cert.issuer}
                </span>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold tracking-tight text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-red)] transition-colors leading-snug">
                  {cert.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
                  {cert.description}
                </p>

                {/* Skills Preview */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {cert.skills.slice(0, 2).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded text-[9px] font-mono bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-secondary)] truncate max-w-[150px]"
                    >
                      {s}
                    </span>
                  ))}
                  {cert.skills.length > 2 && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-[var(--text-muted)]">
                      +{cert.skills.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer with Direct Verification Link */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono">
                <span className="text-[var(--text-muted)] truncate max-w-[110px]">
                  {cert.date.split('·')[0]}
                </span>

                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[var(--accent-red)] font-bold hover:underline shrink-0"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CERTIFICATION DETAIL MODAL */}
        <AnimatePresence>
          {selectedCert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25 }}
                className="relative w-full max-w-lg rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-2xl text-[var(--text-primary)]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Badge Icon & Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
                    <ShieldCheck className="w-6 h-6" style={{ color: selectedCert.color }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] block">
                      {selectedCert.issuer}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ID: {selectedCert.certId} · {selectedCert.date}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)] mb-3">
                  {selectedCert.title}
                </h3>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  {selectedCert.description}
                </p>

                {/* Tested Skill Competencies */}
                <div className="mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] block mb-2.5 font-bold">
                    VERIFIED TECHNICAL COMPETENCIES
                  </span>
                  <div className="space-y-2">
                    {selectedCert.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-red)] shrink-0" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action — Direct link to official registry */}
                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Issued to: <strong className="text-[var(--text-primary)]">Vedant Tiwari</strong>
                  </span>

                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[var(--accent-red)] text-white hover:opacity-90 transition-opacity"
                  >
                    <span>Verify on Official Registry</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </SlideScene>
  );
}

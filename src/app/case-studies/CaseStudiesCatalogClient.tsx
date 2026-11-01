'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowRight,
  TrendingUp,
  Target,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { ClientCaseStudy } from '../../types/caseStudy';

interface Props {
  initialStudies: ClientCaseStudy[];
}

const CATEGORIES = [
  { id: 'all', label: 'All Industries' },
  { id: 'logistics', label: 'Logistics & Freight' },
  { id: 'ecommerce', label: 'E-Commerce & D2C' },
  { id: 'realestate-app', label: 'Real Estate & Apps' },
  { id: 'services', label: 'Services & B2B' },
];

export default function CaseStudiesCatalogClient({ initialStudies }: Props) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return initialStudies.filter((study) => {
      // Category match
      if (selectedCat !== 'all') {
        if (study.category !== selectedCat) return false;
      }

      // Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = study.name.toLowerCase().includes(q);
        const subMatch = (study.subtitle || '').toLowerCase().includes(q);
        const campMatch = (study.campaign || '').toLowerCase().includes(q);
        const platMatch = (study.platforms || []).some((p) => p.toLowerCase().includes(q));
        if (!nameMatch && !subMatch && !campMatch && !platMatch) return false;
      }

      return true;
    });
  }, [initialStudies, selectedCat, searchQuery]);

  return (
    <div>
      {/* Controls: Category tabs & Search bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[var(--border-subtle)]">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                selectedCat === cat.id
                  ? 'bg-[var(--text-primary)] text-[var(--bg-base)] shadow-sm'
                  : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            placeholder="Search by client or platform..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[var(--accent-red)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all"
          />
        </div>
      </div>

      {/* Case studies count & active filter info */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
          SHOWING {filtered.length} OF {initialStudies.length} CASE STUDIES
        </span>
        {(selectedCat !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCat('all');
              setSearchQuery('');
            }}
            className="text-xs font-mono text-[var(--accent-red)] hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Grid of Case Studies */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
          <Filter className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
          <p className="text-sm font-bold text-[var(--text-primary)]">No case studies match your query</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Try searching for a different brand name or reset the category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((study, idx) => {
            const hero = study.heroImage || study.snapshots?.[0]?.image || study.logo;

            // Extract primary metric
            let metric1 = { label: 'RESULT', value: 'VERIFIED' };
            if (study.metrics?.roas) {
              metric1 = { label: 'ROAS', value: `${study.metrics.roas}x` };
            } else if (study.metrics?.leads) {
              metric1 = { label: study.objective?.includes('WhatsApp') ? 'CONVERSATIONS' : 'LEADS', value: `${study.metrics.leads}` };
            } else if (study.metrics?.impressions) {
              metric1 = { label: 'IMPRESSIONS', value: study.metrics.impressions > 1000 ? `${(study.metrics.impressions / 1000).toFixed(1)}k` : `${study.metrics.impressions}` };
            }

            // Extract secondary metric
            let metric2 = { label: 'CAMPAIGN', value: 'MANAGED' };
            if (study.metrics?.revenue) {
              metric2 = { label: 'REVENUE', value: `₹${(study.metrics.revenue / 100000).toFixed(2)}L` };
            } else if (study.metrics?.cpl) {
              metric2 = { label: 'CPL', value: `₹${study.metrics.cpl}` };
            } else if (study.beforeAfterComparisons?.[0]) {
              const comp = study.beforeAfterComparisons[0];
              metric2 = { label: comp.metricName.toUpperCase().slice(0, 10), value: `↓${Math.round(Math.abs((comp.afterValue - comp.beforeValue) / comp.beforeValue * 100))}%` };
            }

            return (
              <motion.div
                key={study.id || study.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--accent-red)]/50 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-lg group"
              >
                {/* Card Header */}
                <div className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] truncate">
                      {study.category?.replace('-', ' • ').toUpperCase()}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[var(--tag-bg)] text-[var(--tag-text)] shrink-0 font-medium">
                      {Array.isArray(study.platforms) ? study.platforms[0] : 'Meta Ads'}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight leading-snug group-hover:text-[var(--accent-red)] transition-colors">
                    {study.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                    {study.subtitle || study.campaign}
                  </p>
                </div>

                {/* Hero Creative Image */}
                <div className="relative mx-5 rounded-xl overflow-hidden bg-[var(--bg-base)]" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={hero}
                    alt={study.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Verified Metric Badges */}
                <div className="grid grid-cols-2 gap-2 p-5 pb-3">
                  <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                    <p className="text-[8px] font-mono font-bold uppercase text-[var(--text-muted)] truncate">{metric1.label}</p>
                    <p className="text-lg font-black font-mono text-[var(--accent-red)] mt-0.5">{metric1.value}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                    <p className="text-[8px] font-mono font-bold uppercase text-[var(--text-muted)] truncate">{metric2.label}</p>
                    <p className="text-lg font-black font-mono text-[var(--text-primary)] mt-0.5">{metric2.value}</p>
                  </div>
                </div>

                {/* Action button */}
                <div className="p-5 pt-2 mt-auto">
                  <Link
                    href={`/clients/${study.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl border border-[var(--border-subtle)] group-hover:border-[var(--accent-red)] bg-[var(--bg-base)] flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] transition-all"
                  >
                    <span>VIEW FULL CASE STUDY</span>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-red)] group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

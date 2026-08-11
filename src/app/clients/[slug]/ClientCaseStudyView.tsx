'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientCaseStudy, calculatePercentageChange } from '../../../lib/caseStudyStorage';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Target, 
  Compass, 
  Globe, 
  User, 
  Zap, 
  ChevronRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Maximize2,
  X,
  ChevronLeft,
  ShieldCheck,
  Calendar,
  Layers,
  Award,
  BookOpen
} from 'lucide-react';
import ParticleBackground from '../../../components/ParticleBackground';
import CreditsFooter from '../../../components/CreditsFooter';

interface ClientCaseStudyViewProps {
  study: ClientCaseStudy;
  otherStudies: ClientCaseStudy[];
}

export default function ClientCaseStudyView({ study, otherStudies }: ClientCaseStudyViewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Keyboard navigation for Lightbox (ESC to exit, Arrow keys for prev/next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        setLightboxIndex(null);
        setIsZoomed(false);
      } else if (e.key === 'ArrowRight' && study.snapshots.length > 0) {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % study.snapshots.length : 0));
        setIsZoomed(false);
      } else if (e.key === 'ArrowLeft' && study.snapshots.length > 0) {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + study.snapshots.length) % study.snapshots.length : 0));
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, study.snapshots]);

  // Formatted Metric Card helper
  const renderMetricCard = (label: string, value: string | number | undefined, unit: string = '', isBadge: boolean = false) => {
    if (value === undefined || value === null || value === '') return null;
    return (
      <div className="bg-[#0b0b0f] border border-neutral-800/80 rounded-xl p-4 flex flex-col gap-1 shadow-md hover:border-red-900/50 transition-colors">
        <span className="text-[10px] text-neutral-500 font-mono font-bold uppercase tracking-widest">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl md:text-2xl font-black text-white font-mono tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {unit && <span className="text-xs text-[#FF1A1A] font-mono font-bold">{unit}</span>}
        </div>
      </div>
    );
  };

  const hasMetrics = study.metrics && Object.values(study.metrics).some((v) => v !== undefined && v !== null);

  return (
    <div className="relative min-h-screen bg-[#050507] text-white overflow-hidden select-none font-sans flex flex-col justify-between">
      <ParticleBackground />
      <div className="vignette-overlay" />
      <div className="noise-overlay" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-10 w-full">
        
        {/* SECTION 01 — CASE STUDY HEADER */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link 
            href="/#client-intelligence" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors hover:border-[#FF1A1A]"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF1A1A]" />
            <span>BACK TO PORTFOLIO</span>
          </Link>

          <a 
            href={study.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF1A1A] hover:bg-[#d90e0e] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(255,26,26,0.4)]"
          >
            <span>VISIT LIVE CLIENT SITE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Header Main Hero Card */}
        <div className="bg-[#08080c] border border-red-900/40 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-950/20 blur-[120px] pointer-events-none rounded-full" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b border-neutral-900">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-black border border-neutral-800 p-2 shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
              <img src={study.logo} alt={study.name} className="w-full h-full object-contain" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-red-950/80 border border-red-800/60 text-[#FF1A1A] font-bold text-[10px] uppercase tracking-widest rounded-full">
                  PERFORMANCE MARKETING CASE STUDY
                </span>
                {study.provenance && (
                  <span className={`px-2.5 py-0.5 border font-bold text-[10px] uppercase tracking-widest rounded-full ${
                    study.verificationStatus === 'VERIFIED' 
                      ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400'
                      : 'bg-amber-950/60 border-amber-800/60 text-amber-400'
                  }`}>
                    {study.verificationStatus === 'VERIFIED' ? '✓ VERIFIED METRICS' : 'DEMO METRICS DATA'}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight font-sans">
                {study.name}
              </h1>
              <p className="text-neutral-400 text-xs md:text-sm mt-1 font-mono">{study.industry} — {study.subtitle}</p>
            </div>
          </div>

          {/* Compact Info Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-xs">
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900">
              <span className="text-[10px] text-neutral-500 font-mono font-bold uppercase tracking-wider block mb-1">CAMPAIGN FOCUS</span>
              <span className="text-white font-bold">{study.campaign}</span>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900">
              <span className="text-[10px] text-neutral-500 font-mono font-bold uppercase tracking-wider block mb-1">PRIMARY OBJECTIVE</span>
              <span className="text-[#FF1A1A] font-black uppercase">{study.objective}</span>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900">
              <span className="text-[10px] text-neutral-500 font-mono font-bold uppercase tracking-wider block mb-1">PLATFORMS USED</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {study.platforms.map((p) => (
                  <span key={p} className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-bold rounded">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 02 — MY ROLE & SCOPE */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-[#FF1A1A]" />
            <h2 className="text-sm font-extrabold text-neutral-300 uppercase tracking-widest">MY ROLE & SCOPE</h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap bg-[#08080b] p-5 rounded-2xl border border-neutral-800/80">
            {study.roleScope.map((scope) => (
              <span 
                key={scope} 
                className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 hover:border-red-900/60 text-neutral-200 text-xs font-mono font-semibold rounded-xl flex items-center gap-2 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A]" />
                {scope}
              </span>
            ))}
          </div>
        </div>

        {/* SECTION 03 — THE CHALLENGE */}
        <div className="mb-12">
          <div className="bg-[#0a0a0f] border border-red-900/40 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-[#FF1A1A]" />
              <h2 className="text-sm font-extrabold text-[#FF1A1A] uppercase tracking-widest">THE CHALLENGE</h2>
            </div>
            <p className="text-neutral-200 text-sm md:text-base font-normal leading-relaxed text-justify">
              {study.challenge}
            </p>
          </div>
        </div>

        {/* SECTION 04 — STRATEGY & APPROACH */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Compass className="w-4 h-4 text-[#FF1A1A]" />
            <h2 className="text-sm font-extrabold text-neutral-300 uppercase tracking-widest">THE STRATEGY & APPROACH</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {study.strategies.map((strat, idx) => (
              <div key={strat.id || idx} className="bg-[#08080b] border border-neutral-800/90 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-red-900/60 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#FF1A1A] font-mono font-black text-xs uppercase tracking-widest">{strat.title}</span>
                    {strat.platform && (
                      <span className="px-2 py-0.5 bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-400 font-mono rounded">
                        {strat.platform}
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-300 text-xs md:text-sm font-normal leading-relaxed">
                    {strat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 05 & 11 — CAMPAIGN SNAPSHOT GALLERY & LIGHTBOX */}
        {study.snapshots && study.snapshots.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FF1A1A]" />
                <h2 className="text-sm font-extrabold text-neutral-300 uppercase tracking-widest">CAMPAIGN SNAPSHOT EVIDENCE</h2>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">Click image to inspect</span>
            </div>
            <p className="text-neutral-400 text-xs mb-6 font-mono">Selected campaign evidence from the platforms used.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {study.snapshots.map((snap, idx) => (
                <div 
                  key={snap.id || idx} 
                  onClick={() => {
                    setLightboxIndex(idx);
                    setIsZoomed(false);
                  }}
                  className="bg-[#08080b] border border-neutral-800 rounded-2xl overflow-hidden cursor-pointer group hover:border-[#FF1A1A] transition-all shadow-xl flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-black overflow-hidden border-b border-neutral-900">
                    <img 
                      src={snap.image} 
                      alt={snap.campaignName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-neutral-800 text-[10px] text-[#FF1A1A] font-bold font-mono uppercase rounded">
                      {snap.platform}
                    </div>
                    <div className="absolute bottom-3 right-3 p-1.5 bg-black/80 backdrop-blur-md border border-neutral-800 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-neutral-300 font-bold">
                      <span className="truncate">{snap.campaignName}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-500">
                      <span>Obj: <strong className="text-white">{snap.objective}</strong></span>
                      <span>{snap.dateRange}</span>
                    </div>
                    {snap.note && <p className="text-[11px] text-neutral-400 pt-1 line-clamp-2">{snap.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {lightboxIndex !== null && study.snapshots[lightboxIndex] && (
            <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
              {/* Close Button */}
              <button 
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 p-3 bg-neutral-900/90 border border-neutral-800 hover:border-[#FF1A1A] text-white rounded-full cursor-pointer z-50 transition-colors"
                title="Press ESC to close"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev Button */}
              {study.snapshots.length > 1 && (
                <button 
                  onClick={() => {
                    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + study.snapshots.length) % study.snapshots.length : 0));
                    setIsZoomed(false);
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-neutral-900/90 border border-neutral-800 hover:border-[#FF1A1A] text-white rounded-full cursor-pointer z-50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {study.snapshots.length > 1 && (
                <button 
                  onClick={() => {
                    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % study.snapshots.length : 0));
                    setIsZoomed(false);
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-neutral-900/90 border border-neutral-800 hover:border-[#FF1A1A] text-white rounded-full cursor-pointer z-50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Main Lightbox Content */}
              <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center">
                <div className={`overflow-auto max-h-[75vh] max-w-full rounded-2xl border border-neutral-800 shadow-2xl transition-transform duration-300 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'}`} onClick={() => setIsZoomed(!isZoomed)}>
                  <img 
                    src={study.snapshots[lightboxIndex].image} 
                    alt={study.snapshots[lightboxIndex].campaignName} 
                    className="max-w-full h-auto object-contain rounded-2xl" 
                  />
                </div>

                {/* Lightbox Caption Footer */}
                <div className="mt-4 text-center text-xs font-mono text-neutral-300 space-y-1 bg-neutral-950/80 px-6 py-3 rounded-xl border border-neutral-900">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-[#FF1A1A] font-bold uppercase">{study.snapshots[lightboxIndex].platform}</span>
                    <span>•</span>
                    <span className="font-bold text-white">{study.snapshots[lightboxIndex].campaignName}</span>
                    <span>•</span>
                    <span className="text-neutral-400">{study.snapshots[lightboxIndex].dateRange}</span>
                  </div>
                  {study.snapshots[lightboxIndex].note && (
                    <p className="text-neutral-400 text-[11px] font-sans">{study.snapshots[lightboxIndex].note}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* SECTION 06 — REAL PERFORMANCE METRICS (PERFORMANCE INTELLIGENCE) */}
        {hasMetrics && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF1A1A]" />
                <h2 className="text-sm font-extrabold text-neutral-300 uppercase tracking-widest">PERFORMANCE INTELLIGENCE</h2>
              </div>
              
              {study.provenance && (
                <span className="text-[10px] font-mono text-neutral-400">
                  Source: <strong className="text-white">{study.provenance.source}</strong> ({study.provenance.reportingPeriod})
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {renderMetricCard('TOTAL SPEND', study.metrics?.spend, '₹')}
              {renderMetricCard('CLICKS', study.metrics?.clicks)}
              {renderMetricCard('IMPRESSIONS', study.metrics?.impressions)}
              {renderMetricCard('CTR', study.metrics?.ctr, '%')}
              {renderMetricCard('AVERAGE CPC', study.metrics?.cpc, '₹')}
              {renderMetricCard('LEADS GENERATED', study.metrics?.leads)}
              {renderMetricCard('COST PER LEAD (CPL)', study.metrics?.cpl, '₹')}
              {renderMetricCard('QUALIFIED LEADS', study.metrics?.qualifiedLeads)}
              {renderMetricCard('TOTAL CONVERSIONS', study.metrics?.conversions)}
              {renderMetricCard('CONVERSION RATE', study.metrics?.conversionRate, '%')}
              {renderMetricCard('ROAS SCALED', study.metrics?.roas, 'x')}
              {renderMetricCard('REVENUE GENERATED', study.metrics?.revenue, '₹')}
            </div>

            {study.provenance && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-500 bg-neutral-950 p-3 rounded-xl border border-neutral-900 gap-2">
                <span>Verified Data Source: <strong className="text-neutral-300">{study.provenance.source}</strong></span>
                <span>Reporting Period: <strong className="text-neutral-300">{study.provenance.reportingPeriod}</strong></span>
                <span>Last Updated: <strong className="text-neutral-300">{study.provenance.lastUpdated}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* SECTION 07 — BEFORE / AFTER (THE SHIFT) */}
        {study.beforeAfterComparisons && study.beforeAfterComparisons.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#FF1A1A]" />
              <h2 className="text-sm font-extrabold text-neutral-300 uppercase tracking-widest">THE SHIFT (BEFORE VS AFTER)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {study.beforeAfterComparisons.map((item, idx) => {
                const change = calculatePercentageChange(item.beforeValue, item.afterValue, item.lowerIsBetter);
                return (
                  <div key={idx} className="bg-[#08080c] border border-neutral-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                    <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-wider mb-3 block">
                      {item.metricName}
                    </span>

                    <div className="grid grid-cols-3 gap-2 items-center text-center">
                      <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-900">
                        <span className="text-[9px] text-neutral-500 font-mono block">BEFORE</span>
                        <span className="text-base font-bold text-neutral-400 font-mono">{item.beforeValue}{item.unit}</span>
                      </div>

                      <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-900">
                        <span className="text-[9px] text-neutral-500 font-mono block">AFTER</span>
                        <span className="text-base font-black text-white font-mono">{item.afterValue}{item.unit}</span>
                      </div>

                      <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center font-mono ${
                        change.isImprovement ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-400' : 'bg-red-950/40 border-red-900/60 text-red-400'
                      }`}>
                        <span className="text-[9px] font-bold block">IMPROVEMENT</span>
                        <span className="text-sm font-black flex items-center gap-0.5">
                          {change.isImprovement ? '↑' : '↓'} {change.value}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 08 — CAMPAIGN TIMELINE */}
        {study.timeline && study.timeline.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-4 h-4 text-[#FF1A1A]" />
              <h2 className="text-sm font-extrabold text-neutral-300 uppercase tracking-widest">CAMPAIGN EXECUTION TIMELINE</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {study.timeline.map((step, idx) => (
                <div key={idx} className="bg-[#08080c] border border-neutral-800 rounded-xl p-3.5 shadow-md flex flex-col justify-between text-left">
                  <div>
                    <span className="text-xs font-mono font-black text-[#FF1A1A] block mb-1">{step.step}</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">{step.title}</h3>
                    <p className="text-[10px] text-neutral-400 font-mono line-clamp-3">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 09 — CAMPAIGN RESULT & IMPACT */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-red-950/30 via-[#08080c] to-[#08080c] border border-red-900/50 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">PERFORMANCE RESULT & IMPACT</h2>
            </div>
            <p className="text-white text-base md:text-lg font-bold leading-relaxed">
              "{study.result}"
            </p>
          </div>
        </div>

        {/* SECTION 10 — KEY LEARNINGS */}
        {study.keyLearnings && study.keyLearnings.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-[#FF1A1A]" />
              <h2 className="text-sm font-extrabold text-neutral-300 uppercase tracking-widest">WHAT I LEARNED</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {study.keyLearnings.map((learning, idx) => (
                <div key={idx} className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 flex items-start gap-3 text-xs text-neutral-300">
                  <span className="text-[#FF1A1A] font-bold font-mono shrink-0">0{idx + 1}</span>
                  <span className="leading-relaxed font-normal">{learning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 12 — OTHER CLIENT CASE STUDIES */}
        {otherStudies.length > 0 && (
          <div className="pt-10 border-t border-neutral-900">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
                EXPLORE OTHER CLIENT CASE STUDIES
              </h2>
              <Link href="/#client-intelligence" className="text-xs font-mono text-[#FF1A1A] hover:underline uppercase">
                View All Clients →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherStudies.map((client) => (
                <Link
                  key={client.slug}
                  href={`/clients/${client.slug}`}
                  className="bg-[#08080b] border border-neutral-800 hover:border-red-900/60 rounded-xl p-4 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black border border-neutral-800 p-1 shrink-0 flex items-center justify-center">
                      <img src={client.logo} alt={client.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase group-hover:text-[#FF1A1A] transition-colors">{client.name}</h3>
                      <span className="text-[10px] text-neutral-500 block">{client.industry}</span>
                    </div>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-[#FF1A1A] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      <CreditsFooter />
    </div>
  );
}

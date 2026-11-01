'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Tag, MapPin, CheckCircle2, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { SlideScene } from './motion/MotionSystem';
import { portfolioData, TimelineItem } from '../data/portfolio';

export default function InteractiveCareerMap() {
  // Default to Station 1 (Current / most senior role)
  const [selectedStationId, setSelectedStationId] = useState<string>('timeline-1');

  // Chronological order for transit route: timeline-4 (2024) -> timeline-3 -> timeline-2 -> timeline-1 (Present)
  const stations = [...portfolioData.timeline].reverse();

  const selectedStation =
    portfolioData.timeline.find((t) => t.id === selectedStationId) || portfolioData.timeline[0];

  // Active track progress percentage calculation based on station index
  const activeStationIndex = stations.findIndex((s) => s.id === selectedStationId);
  const trackPercentage = stations.length > 1 ? (activeStationIndex / (stations.length - 1)) * 100 : 100;

  return (
    <SlideScene id="interactive-career-map" className="py-20 md:py-28 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* SECTION HEADER — matching exact font size and boldness across the site */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-0.5 bg-[var(--accent-red)]" />
              <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[var(--text-muted)]">
                — CAREER TRANSIT MAP
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.15]">
              An interactive transit map of{' '}
              <span className="text-[var(--accent-red)]">growth &amp; execution.</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-md">
            Click any station stop along the route to inspect performance statistics, tools deployed, and operating logs across my career.
          </p>
        </div>

        {/* METRO TRANSIT TRACK LINE CONTAINER */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs mb-10">
          
          <div className="relative py-4 max-w-4xl mx-auto">

            {/* Desktop Horizontal Track Line */}
            <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 bg-[var(--border-subtle)] hidden md:block rounded-full z-0" />
            <motion.div
              className="absolute top-1/2 left-4 h-1 -translate-y-1/2 bg-[var(--accent-red)] hidden md:block rounded-full z-0"
              animate={{ width: `calc(${trackPercentage}% * 0.94)` }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            />

            {/* Stations Row */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 md:gap-4 relative z-10">
              {stations.map((station, sIdx) => {
                const isActive = selectedStationId === station.id;

                return (
                  <button
                    key={station.id}
                    onClick={() => setSelectedStationId(station.id)}
                    className="flex md:flex-col items-center gap-4 md:gap-3 cursor-pointer group text-left md:text-center focus:outline-none"
                    aria-label={`View station ${station.company} - ${station.role}`}
                  >
                    {/* Node Dot Ring */}
                    <div
                      className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-[var(--bg-card)] ${
                        isActive
                          ? 'border-[var(--accent-red)] scale-110 shadow-lg shadow-[var(--accent-red)]/25'
                          : 'border-[var(--border-subtle)] group-hover:border-[var(--text-secondary)]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full transition-all duration-300 ${
                          isActive
                            ? 'bg-[var(--accent-red)] scale-100'
                            : 'bg-[var(--border-subtle)] group-hover:bg-[var(--text-muted)]'
                        }`}
                      />
                    </div>

                    {/* Station Labels */}
                    <div className="space-y-0.5">
                      <span
                        className={`text-[10px] font-mono tracking-widest uppercase block font-bold transition-colors ${
                          isActive ? 'text-[var(--accent-red)]' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {station.year.includes('Present') ? 'PRESENT · CURRENT' : station.year.split(' - ')[0]}
                      </span>

                      <span
                        className={`text-xs font-bold transition-colors block ${
                          isActive
                            ? 'text-[var(--text-primary)]'
                            : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {station.company}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* SELECTED STATION DETAILED BOARD */}
        <AnimatePresence mode="wait">
          {selectedStation && (
            <motion.div
              key={selectedStation.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left 2 Cols: Station Summary & Deliverables */}
              <div className="lg:col-span-2 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
                <div>
                  {/* Top Badge & Duration */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase bg-[var(--accent-red)]/10 text-[var(--accent-red)] border border-[var(--accent-red)]/20">
                      STATION LOG #{selectedStation.id.replace('timeline-', '0')}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {selectedStation.period}
                    </span>
                  </div>

                  {/* Role Title & Company */}
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] mb-1">
                    {selectedStation.role}
                  </h3>
                  <h4 className="text-sm font-bold text-[var(--accent-red)] font-mono mb-6">
                    {selectedStation.company}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 font-normal">
                    {selectedStation.description}
                  </p>

                  {/* Output Deliverables */}
                  <div className="space-y-3 mb-6">
                    <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      KEY OUTPUT DELIVERABLES
                    </h5>
                    {selectedStation.points.map((pt, ptIdx) => (
                      <div key={ptIdx} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-red)] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Growth Law / Lesson Takeaway */}
                {selectedStation.lessons && (
                  <div className="pt-4 mt-2 border-t border-[var(--border-subtle)] flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-[var(--accent-red)] shrink-0 mt-0.5" />
                    <p className="text-xs italic text-[var(--text-muted)]">
                      &ldquo;{selectedStation.lessons}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Right Col: Tools & Platform Stack */}
              <div className="space-y-6">
                {/* Tech Deployed Box */}
                <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 text-[var(--accent-red)]">
                    <Tag className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest font-mono text-[var(--text-primary)]">
                      TECHNOLOGIES DEPLOYED
                    </h4>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {selectedStation.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-semibold bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-red)]/50 transition-colors"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Station Quick Summary */}
                <div className="rounded-3xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] p-6 shadow-xs">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] block mb-2">
                    ACTIVE OPERATING RHYTHM
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                    Managing full-funnel media investments from hypothesis testing to automated Looker &amp; GA4 tracking dashboards.
                  </p>
                  <button
                    onClick={() => {
                      const contact = document.getElementById('contact-section');
                      if (contact) contact.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 rounded-full text-xs font-semibold bg-[#191919] text-white dark:bg-[#F7F5F0] dark:text-[#191919] hover:bg-[var(--accent-red)] transition-colors cursor-pointer text-center"
                  >
                    Discuss Campaign Strategy
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </SlideScene>
  );
}


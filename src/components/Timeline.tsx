'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronDown, Award } from 'lucide-react';
import { portfolioData, TimelineItem } from '../data/portfolio';

export default function Timeline() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="about-timeline" className="py-24 bg-[#0a0a0a] relative px-6 md:px-16 overflow-hidden">
      {/* Subtle red lights */}
      <div className="ambient-light-red -bottom-20 -right-20" style={{ opacity: 0.05 }} />

      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] block mb-2">My Journey</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Career Timeline
          </h2>
          <p className="text-neutral-500 text-sm md:text-base mt-2 max-w-lg mx-auto">
            A chronological timeline of my marketing roles, managed budgets, and key accomplishments.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative timeline-track pl-8 md:pl-0">
          {portfolioData.timeline.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            const isExpanded = expandedId === item.id;

            return (
              <div key={item.id} className="mb-12 relative md:flex md:justify-between md:items-center">
                {/* Timeline center node dot */}
                <div className="absolute left-[15px] top-6 md:left-1/2 md:-ml-3 w-6 h-6 rounded-full bg-black border-2 border-[#E50914] flex items-center justify-center z-10 shadow-lg">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E50914] animate-pulse" />
                </div>

                {/* Left side empty space helper on desktop */}
                <div className={`hidden md:block w-[45%] ${isLeft ? 'order-1 text-right' : 'order-3'}`}>
                  {isLeft && (
                    <div className="pr-8 text-neutral-500 font-bold text-lg flex items-center justify-end gap-2">
                      <Calendar className="w-4 h-4 text-[#E50914]" />
                      {item.year}
                    </div>
                  )}
                </div>

                {/* Main Card Content */}
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6 }}
                  className={`w-full md:w-[45%] order-2 glass-panel p-6 rounded-lg shadow-xl relative cursor-pointer border border-neutral-900 hover:border-[#E50914]/40 transition-colors ${
                    isLeft ? 'md:mr-auto' : 'md:ml-auto'
                  }`}
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#E50914] text-xs font-semibold tracking-wider flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      {item.period}
                    </span>
                    <span className="text-neutral-400 text-xs font-mono md:hidden flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#E50914]" />
                      {item.year}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#E50914] transition-colors">
                    {item.role}
                  </h3>
                  
                  <h4 className="text-neutral-400 text-sm font-medium mb-3">
                    {item.company}
                  </h4>

                  <p className="text-neutral-400 text-sm font-light leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Expansion handle */}
                  <div className="flex items-center gap-1 text-[#E50914] text-xs font-semibold uppercase tracking-wider">
                    <span>Key Metrics & Achievements</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </motion.div>
                  </div>

                  {/* Expanded Accomplishments */}
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-4 space-y-3"
                  >
                    <div className="pt-3 border-t border-neutral-900 space-y-2.5">
                      {item.points.map((point, pIdx) => (
                        <div key={pIdx} className="flex gap-2 text-neutral-300 text-xs leading-relaxed">
                          <Award className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right side empty space helper on desktop */}
                <div className={`hidden md:block w-[45%] ${isLeft ? 'order-3' : 'order-1 text-left'}`}>
                  {!isLeft && (
                    <div className="pl-8 text-neutral-500 font-bold text-lg flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#E50914]" />
                      {item.year}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Award, Activity, Compass, Code } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

// Skill percentages for the progress bars
const skillMetrics: Record<string, number> = {
  // Performance Marketing
  "Meta Ads": 95, "Google Ads": 92, "YouTube Ads": 90, "Amazon Ads": 85,
  "DV360": 80, "CM360": 78, "Reddit Ads": 85, "Quick Commerce Ads": 82,
  "Analytics": 90, "Conversion Tracking": 94, "Campaign Optimization": 96,
  // Media Planning & Buying
  "Media Planning": 92, "Audience Segmentation": 90, "Budget Forecasting": 88,
  "Media Buying": 90, "Platform Selection": 94, "Campaign Strategy": 92,
  "Cross Platform Execution": 90,
  // Branding & Strategy
  "Brand Positioning": 86, "Brand Strategy": 88, "Content Strategy": 85,
  "Creative Briefing": 90, "Social Media Marketing": 92, "Campaign Communication": 88,
  // Technical Marketing
  "GA4": 94, "GTM": 95, "Meta Pixel": 96, "Looker Studio": 92,
  "Advanced Excel": 90, "Dashboard Reporting": 94, "Automation Systems": 84,
  // Web & App Development
  "Frontend Development": 82, "Backend Development": 75, "UI/UX": 84,
  "Responsive Design": 90, "Web Apps": 80, "Mobile Apps": 70,
  "API Integration": 82
};

export default function SkillsMatrix() {
  const [activeTab, setActiveTab] = useState('performance-marketing');
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    setAnimateBars(true);
  }, [activeTab]);

  const activeProfile = portfolioData.profiles.find((p) => p.id === activeTab);

  // Custom Radar Chart Coordinates (center at 50, 50, radius 40)
  // Categories: Performance, Media Planning, Branding, Tech, Development
  const categories = [
    { name: "Performance", value: 95, angle: 0 },
    { name: "Media Planning", value: 90, angle: 72 },
    { name: "Branding", value: 85, angle: 144 },
    { name: "Tech Analytics", value: 94, angle: 216 },
    { name: "Development", value: 80, angle: 288 }
  ];

  const getCoordinates = (value: number, angle: number) => {
    const r = (value / 100) * 35; // scale factor
    const angleRad = (angle - 90) * (Math.PI / 180); // shift by 90 to start top
    const x = 50 + r * Math.cos(angleRad);
    const y = 50 + r * Math.sin(angleRad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  // Generate radar shapes
  const polygonPoints = categories.map((c) => getCoordinates(c.value, c.angle)).join(' ');
  const gridPoints80 = categories.map((c) => getCoordinates(80, c.angle)).join(' ');
  const gridPoints60 = categories.map((c) => getCoordinates(60, c.angle)).join(' ');
  const gridPoints40 = categories.map((c) => getCoordinates(40, c.angle)).join(' ');

  const getTabIcon = (id: string) => {
    switch (id) {
      case 'performance-marketing': return <TrendingUp className="w-4 h-4" />;
      case 'media-planning': return <Compass className="w-4 h-4" />;
      case 'branding-strategy': return <Award className="w-4 h-4" />;
      case 'technical-skills': return <Activity className="w-4 h-4" />;
      case 'web-dev': return <Code className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <section id="skills-matrix" className="py-24 bg-[#050505] relative px-6 md:px-16 overflow-hidden">
      {/* Dynamic Red Glow Ambient Light */}
      <div className="ambient-light-red bottom-10 left-10" style={{ opacity: 0.03 }} />

      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="mb-16 text-center">
          <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] block mb-2">Metrics</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Interactive Skills Matrix
          </h2>
          <p className="text-neutral-500 text-sm md:text-base mt-2 max-w-xl mx-auto">
            An overview of marketing and technical core capabilities. Click the radar shape or selection tabs to inspect detailed skill levels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Custom SVG Radar Chart */}
          <div className="flex flex-col items-center justify-center bg-[#0e0e0e]/50 border border-neutral-900 rounded-xl p-8 shadow-2xl relative">
            
            {/* Watermark background label */}
            <div className="absolute top-4 left-4 text-[10px] text-neutral-600 uppercase tracking-widest font-mono">
              Vector Telemetry Map
            </div>

            <div className="w-72 h-72 md:w-80 md:h-80 relative">
              <svg className="w-full h-full text-neutral-800" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background grids */}
                <polygon points={gridPoints80} stroke="#222" strokeWidth="0.5" fill="none" />
                <polygon points={gridPoints60} stroke="#222" strokeWidth="0.5" fill="none" />
                <polygon points={gridPoints40} stroke="#222" strokeWidth="0.5" fill="none" />

                {/* Grid axis lines */}
                {categories.map((c, idx) => {
                  const [x, y] = getCoordinates(100, c.angle).split(',');
                  return (
                    <line
                      key={idx}
                      x1="50"
                      y1="50"
                      x2={x}
                      y2={y}
                      stroke="#222"
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                    />
                  );
                })}

                {/* Radar Values Shape (glowing red polygon) */}
                <polygon
                  points={polygonPoints}
                  stroke="#E50914"
                  strokeWidth="1.5"
                  fill="rgba(229, 9, 20, 0.15)"
                  className="transition-all duration-500"
                />

                {/* Radar vertices dots */}
                {categories.map((c, idx) => {
                  const [x, y] = getCoordinates(c.value, c.angle).split(',');
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="1.8"
                      fill="#ffffff"
                      stroke="#E50914"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>

              {/* Radar Labels positioned outside the SVG */}
              {categories.map((c, idx) => {
                const angleRad = (c.angle - 90) * (Math.PI / 180);
                // Push labels further out
                const labelRadius = 45;
                const labelX = 50 + labelRadius * Math.cos(angleRad);
                const labelY = 50 + labelRadius * Math.sin(angleRad);

                return (
                  <div
                    key={idx}
                    className="absolute text-[9px] md:text-[10px] text-neutral-400 font-bold uppercase tracking-wider text-center"
                    style={{
                      left: `${labelX}%`,
                      top: `${labelY}%`,
                      transform: 'translate(-50%, -50%)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span className="block text-white font-extrabold">{c.value}%</span>
                    {c.name}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 flex gap-4 text-[10px] text-neutral-500 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-red-600/30 border border-red-600 rounded-sm" />
                Growth Capability Area
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-1.5 border-t border-dashed border-[#222]" />
                Standard Target Limits
              </span>
            </div>
          </div>

          {/* Right Column: Tabbed Progress Bars */}
          <div className="space-y-6">
            
            {/* Tab buttons selection bar */}
            <div className="flex flex-wrap gap-2 border-b border-neutral-900 pb-4">
              {portfolioData.profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveTab(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded cursor-pointer transition-all ${
                    activeTab === p.id
                      ? 'bg-neutral-900 border border-neutral-800 text-white shadow-md'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {getTabIcon(p.id)}
                  {p.title}
                </button>
              ))}
            </div>

            {/* Active Tab Skills Breakdown */}
            <div className="space-y-5 min-h-[300px]">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-6">
                {activeProfile?.roleTitle} Telemetry
              </h4>

              <AnimatePresence mode="wait">
                {activeProfile && (
                  <motion.div
                    key={activeProfile.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {activeProfile.skills.map((skill) => {
                      const level = skillMetrics[skill] || 80;

                      return (
                        <div key={skill} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-neutral-200">{skill}</span>
                            <span className="text-[#E50914] font-mono">{level}%</span>
                          </div>
                          
                          {/* Progress bar line container */}
                          <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-900/50">
                            {animateBars && (
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${level}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-[#B20710] to-[#E50914] rounded-full"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

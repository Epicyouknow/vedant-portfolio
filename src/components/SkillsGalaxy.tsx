'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, ShieldCheck, Tag, TrendingUp, Layers, CheckCircle } from 'lucide-react';
import { portfolioData, Profile } from '../data/portfolio';

// Skill levels matching individual profiles
const skillLevels: Record<string, number> = {
  "Meta Ads": 95, "Google Ads": 92, "YouTube Ads": 90, "Amazon Ads": 85,
  "DV360": 80, "CM360": 78, "Reddit Ads": 85, "Quick Commerce Ads": 82,
  "Analytics": 90, "Conversion Tracking": 94, "Campaign Optimization": 96,
  "Media Planning": 92, "Audience Segmentation": 90, "Budget Forecasting": 88,
  "Media Buying": 90, "Platform Selection": 94, "Campaign Strategy": 92,
  "Cross Platform Execution": 90,
  "Brand Positioning": 86, "Brand Strategy": 88, "Content Strategy": 85,
  "Creative Briefing": 90, "Social Media Marketing": 92, "Campaign Communication": 88,
  "GA4": 94, "GTM": 95, "Meta Pixel": 96, "Looker Studio": 92,
  "Advanced Excel": 90, "Dashboard Reporting": 94, "Automation Systems": 84,
  "Frontend Development": 82, "Backend Development": 75, "UI/UX": 84,
  "Responsive Design": 90, "Web Apps": 80, "Mobile Apps": 70,
  "API Integration": 82
};

export default function SkillsGalaxy() {
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('performance-marketing');

  const selectedPlanet = portfolioData.profiles.find((p) => p.id === selectedPlanetId) || portfolioData.profiles[0];

  // Orbit planet specifications (radii and CSS positions to create orbital offset spacing)
  const orbits = [
    { id: 'performance-marketing', r: 52, color: 'text-red-500', bg: 'bg-red-500', left: '15%', top: '25%', avatar: '🎯', label: 'Performance' },
    { id: 'media-planning', r: 68, color: 'text-blue-500', bg: 'bg-blue-500', left: '78%', top: '20%', avatar: '📊', label: 'Media Planning' },
    { id: 'branding-strategy', r: 84, color: 'text-amber-500', bg: 'bg-amber-500', left: '22%', top: '75%', avatar: '🚀', label: 'Branding' },
    { id: 'technical-skills', r: 96, color: 'text-emerald-500', bg: 'bg-emerald-500', left: '74%', top: '70%', avatar: '⚙️', label: 'Analytics' },
    { id: 'web-dev', r: 110, color: 'text-purple-500', bg: 'bg-purple-500', left: '50%', top: '85%', avatar: '💻', label: 'Development' }
  ];

  return (
    <section id="skills-galaxy" className="py-24 bg-[#050505] relative px-6 md:px-16 overflow-hidden">
      {/* Light glow effects */}
      <div className="ambient-light-red bottom-10 left-10" style={{ opacity: 0.03 }} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] block mb-2">Capabilities</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans uppercase">
            Interactive Skills Galaxy
          </h2>
          <p className="text-neutral-500 text-sm md:text-base mt-2 max-w-xl mx-auto">
            A dynamic orbital solar system representing core disciplines. Click any orbiting planet to read specific telemetry reports.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Orbital Solar System (interactive SVG) */}
          <div className="bg-[#0e0e0e]/30 border border-neutral-900 rounded-xl p-8 flex items-center justify-center relative min-h-[400px] shadow-2xl overflow-hidden">
            
            {/* Solar System Core Sun Node */}
            <div className="relative w-80 h-80 flex items-center justify-center">
              
              {/* Concentric SVG path rings */}
              <svg className="absolute inset-0 w-full h-full text-neutral-900 pointer-events-none" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="16" stroke="#222" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="26" stroke="#222" strokeWidth="0.5" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="36" stroke="#222" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="44" stroke="#222" strokeWidth="0.5" strokeDasharray="4 2" />
              </svg>

              {/* Central Core Sun Node representing VEDANT */}
              <div 
                className="w-16 h-16 rounded-full bg-black border-2 border-red-600 flex flex-col items-center justify-center z-20 shadow-2xl relative cursor-pointer"
                style={{ boxShadow: '0 0 30px rgba(229, 9, 20, 0.4)' }}
              >
                <span className="text-[9px] font-black text-red-500 tracking-widest uppercase">VEDANT</span>
                <span className="text-[8px] text-white/50 tracking-tighter uppercase">CORE</span>
              </div>

              {/* Planet Nodes Orbiting */}
              {orbits.map((orb) => {
                const isActive = selectedPlanetId === orb.id;
                
                return (
                  <button
                    key={orb.id}
                    onClick={() => setSelectedPlanetId(orb.id)}
                    className="absolute z-20 flex flex-col items-center justify-center focus:outline-none cursor-pointer group"
                    style={{
                      left: orb.left,
                      top: orb.top,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full bg-neutral-950 border-2 flex items-center justify-center text-lg transition-all duration-300 ${
                        isActive 
                          ? 'scale-115 border-white shadow-lg' 
                          : 'border-neutral-800 group-hover:border-neutral-400'
                      }`}
                      style={{ 
                        boxShadow: isActive ? `0 0 20px ${selectedPlanet.accentColor}40` : 'none',
                        borderColor: isActive ? selectedPlanet.accentColor : 'rgba(255,255,255,0.08)'
                      }}
                    >
                      {orb.avatar}
                    </div>
                    <span 
                      className={`text-[8px] md:text-[9px] font-bold uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded transition-all duration-300 ${
                        isActive ? 'text-white bg-white/10' : 'text-neutral-500 group-hover:text-neutral-300'
                      }`}
                      style={{ color: isActive ? selectedPlanet.accentColor : '' }}
                    >
                      {orb.label}
                    </span>
                  </button>
                );
              })}

            </div>

          </div>

          {/* Right Column: Dynamic Planet Skills telemetry display */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {selectedPlanet && (
                <motion.div
                  key={selectedPlanet.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 min-h-[350px] bg-[#0e0e0e]/30 border border-neutral-900 rounded-xl p-8"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: `${selectedPlanet.accentColor}15`, border: `1px solid ${selectedPlanet.accentColor}30` }}
                    >
                      {selectedPlanet.avatar}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest font-mono block" style={{ color: selectedPlanet.accentColor }}>
                        {selectedPlanet.characterName}
                      </span>
                      <h3 className="text-xl font-extrabold text-white uppercase tracking-wide">
                        {selectedPlanet.roleTitle}
                      </h3>
                    </div>
                  </div>

                  <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed">
                    {selectedPlanet.characterDesc}
                  </p>

                  <div className="pt-4 border-t border-neutral-900 space-y-4">
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-3">Orbit Skill Scores</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedPlanet.skills.map((skill) => {
                        const level = skillLevels[skill] || 80;
                        return (
                          <div key={skill} className="bg-neutral-950/80 border border-neutral-900/60 p-3 rounded-lg flex items-center justify-between">
                            <span className="text-xs text-neutral-300 font-semibold">{skill}</span>
                            <span 
                              className="text-xs font-bold font-mono"
                              style={{ color: selectedPlanet.accentColor }}
                            >
                              {level}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

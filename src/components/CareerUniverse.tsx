'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, VolumeX, Plus, ThumbsUp, CircleDot } from 'lucide-react';
import { portfolioData, Profile } from '../data/portfolio';

// SVG Character Graphic Generator based on Profile ID
function CharacterSVG({ id, animate = false }: { id: string; animate?: boolean }) {
  const motionClass = animate ? "animate-pulse" : "";
  
  switch (id) {
    case 'performance-marketing':
      return (
        <svg className={`w-full h-full text-red-500 ${motionClass}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"/>
          <path d="M20 70 L40 50 L60 60 L80 30" stroke="#E50914" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="20" cy="70" r="3" fill="#ffffff" />
          <circle cx="40" cy="50" r="3" fill="#ffffff" />
          <circle cx="60" cy="60" r="3" fill="#ffffff" />
          <circle cx="80" cy="30" r="4" fill="#E50914" className="animate-ping origin-center" />
          {/* Floating dashboard elements */}
          <rect x="25" y="25" width="20" height="12" rx="2" fill="rgba(229,9,20,0.15)" stroke="rgba(229,9,20,0.4)" strokeWidth="1"/>
          <line x1="28" y1="31" x2="42" y2="31" stroke="#fff" strokeWidth="1"/>
          <line x1="28" y1="34" x2="36" y2="34" stroke="#fff" strokeWidth="1" opacity="0.6"/>
          {/* Ad symbols */}
          <text x="65" y="75" fill="rgba(255,255,255,0.4)" fontSize="8" fontWeight="bold" fontFamily="monospace">ROAS 4.1</text>
        </svg>
      );
    case 'media-planning':
      return (
        <svg className={`w-full h-full text-indigo-400 ${motionClass}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.7" opacity="0.2"/>
          <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3"/>
          {/* Targeting radar circles */}
          <circle cx="50" cy="50" r="25" stroke="#E50914" strokeWidth="1.5" opacity="0.6"/>
          <circle cx="50" cy="50" r="12" stroke="#ffffff" strokeWidth="1" />
          {/* Audiences node map */}
          <line x1="25" y1="25" x2="50" y2="50" stroke="currentColor" strokeWidth="1"/>
          <line x1="75" y1="30" x2="50" y2="50" stroke="currentColor" strokeWidth="1"/>
          <line x1="65" y1="75" x2="50" y2="50" stroke="currentColor" strokeWidth="1"/>
          <circle cx="25" cy="25" r="5" fill="#E50914"/>
          <circle cx="75" cy="30" r="4" fill="#ffffff"/>
          <circle cx="65" cy="75" r="5" fill="#E50914"/>
          {/* Floating budget hologram */}
          <path d="M45 40 L55 40 L50 32 Z" fill="#ffffff" opacity="0.8"/>
        </svg>
      );
    case 'branding-strategy':
      return (
        <svg className={`w-full h-full text-pink-400 ${motionClass}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Abstract overlapping brand rings */}
          <circle cx="42" cy="45" r="20" stroke="#E50914" strokeWidth="2"/>
          <circle cx="58" cy="45" r="20" stroke="#ffffff" strokeWidth="2"/>
          <circle cx="50" cy="58" r="18" stroke="#B20710" strokeWidth="1.5" strokeDasharray="3 2"/>
          {/* Brand positioning points */}
          <line x1="15" y1="80" x2="85" y2="80" stroke="currentColor" strokeWidth="1"/>
          <polygon points="50,22 53,28 47,28" fill="#E50914"/>
          <text x="32" y="92" fill="#fff" fontSize="7" opacity="0.6" className="tracking-wider">POSITIONING</text>
        </svg>
      );
    case 'technical-skills':
      return (
        <svg className={`w-full h-full text-emerald-400 ${motionClass}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Data pipelines grid */}
          <rect x="15" y="15" width="70" height="70" rx="4" stroke="currentColor" strokeWidth="0.8" opacity="0.2"/>
          <path d="M25 35 H75 M25 50 H75 M25 65 H75" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4"/>
          {/* Analytics telemetry graphs */}
          <path d="M30 45 L45 35 L60 55 L70 40 L80 48" stroke="#34A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="45" cy="35" r="2.5" fill="#fff"/>
          <circle cx="60" cy="55" r="2.5" fill="#fff"/>
          <circle cx="70" cy="40" r="2.5" fill="#E50914"/>
          {/* GA4/GTM Floating tag node */}
          <rect x="35" y="68" width="30" height="10" rx="2" fill="#E50914" opacity="0.8"/>
          <text x="41" y="76" fill="#fff" fontSize="6" fontWeight="bold" fontFamily="monospace">TAG ACTIVE</text>
        </svg>
      );
    case 'web-dev':
      return (
        <svg className={`w-full h-full text-amber-400 ${motionClass}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Full stack developer viewport */}
          <rect x="15" y="20" width="70" height="50" rx="3" fill="rgba(0,0,0,0.4)" stroke="#fff" strokeWidth="1"/>
          {/* Browser header */}
          <line x1="15" y1="28" x2="85" y2="28" stroke="#fff" strokeWidth="0.8"/>
          <circle cx="20" cy="24" r="1.5" fill="#E50914"/>
          <circle cx="24" cy="24" r="1.5" fill="#FBBC05"/>
          <circle cx="28" cy="24" r="1.5" fill="#34A853"/>
          {/* Floating UI blocks */}
          <rect x="22" y="34" width="20" height="28" rx="1" fill="#E50914" opacity="0.7"/>
          <rect x="48" y="34" width="30" height="6" rx="1" fill="#ffffff" opacity="0.6"/>
          <rect x="48" y="44" width="22" height="6" rx="1" fill="#ffffff" opacity="0.4"/>
          {/* Floating Code Tags */}
          <path d="M5 45 L10 40 L5 35" stroke="#E50914" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M95 35 L90 40 L95 45" stroke="#E50914" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return null;
  }
}

export default function CareerUniverse() {
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [muted, setMuted] = useState(true);

  const openProfile = (profile: Profile) => {
    setActiveProfile(profile);
  };

  const closeProfile = () => {
    setActiveProfile(null);
  };

  const handlePlaySeries = (id: string) => {
    closeProfile();
    // Scroll to showcase section
    const showcase = document.getElementById('work-showcase');
    if (showcase) {
      showcase.scrollIntoView({ behavior: 'smooth' });
    }
    // Dispatch custom event to tell Showcase to filter by category
    // performance-marketing -> campaign
    // media-planning -> mediaplan
    // branding-strategy -> branding
    // technical-skills -> campaign / analytical tags
    // web-dev -> development
    let category = '';
    if (id === 'performance-marketing') category = 'campaign';
    if (id === 'media-planning') category = 'mediaplan';
    if (id === 'branding-strategy') category = 'branding';
    if (id === 'web-dev') category = 'development';
    
    if (category) {
      setTimeout(() => {
        const event = new CustomEvent('filter-projects', { detail: category });
        window.dispatchEvent(event);
      }, 500);
    }
  };

  return (
    <section id="career-universe" className="py-24 bg-[#000000] relative px-6 md:px-16 overflow-hidden">
      {/* Light glow effects */}
      <div className="ambient-light-red bottom-10 left-1/3" style={{ opacity: 0.04 }} />

      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-10">
          <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] block mb-2">Original Series</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Vedant's Career Universe
          </h2>
          <p className="text-neutral-500 text-sm md:text-base mt-2 max-w-xl">
            Click into each series profile to watch skills analytics, creative strategies, and interactive telemetry charts.
          </p>
        </div>

        {/* Series Horizontal Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {portfolioData.profiles.map((profile, idx) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => openProfile(profile)}
              className="group cursor-pointer rounded-md bg-[#141414] overflow-hidden border border-neutral-900/60 shadow-xl relative aspect-[2/3] flex flex-col justify-end p-6 glass-panel-hover"
            >
              {/* V Logo Watermark */}
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md w-7 h-7 rounded flex items-center justify-center border border-neutral-800/40 text-[#E50914] font-bold text-xs font-sans">
                V
              </div>

              {/* Graphic container */}
              <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-t from-black via-black/30 to-transparent">
                <CharacterSVG id={profile.id} />
              </div>

              {/* Card Label info */}
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-1.5 h-1.5 bg-[#E50914] rounded-full animate-ping" />
                  <span className="text-[10px] text-[#E50914] font-extrabold uppercase tracking-widest">
                    Vedant's Original
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white leading-tight group-hover:text-[#E50914] transition-colors">
                  {profile.title}
                </h3>
                <p className="text-[11px] text-neutral-500 mt-1 font-light line-clamp-2">
                  {profile.characterName}
                </p>
              </div>

              {/* Glowing Bottom Border on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#E50914] transition-all" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Netflix Cinematic Detailed Modal Overlay */}
      <AnimatePresence>
        {activeProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-4xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl border border-neutral-800/60 my-8"
            >
              {/* Modal Banner Graphic Section */}
              <div className="relative h-64 md:h-80 w-full bg-gradient-to-t from-[#181818] via-black/80 to-[#2a0408] flex items-center justify-center p-8 overflow-hidden">
                {/* Visual Glow Ambient Background */}
                <div className="absolute top-10 w-96 h-96 rounded-full bg-red-900/10 blur-[80px] pointer-events-none" />
                
                {/* Giant custom character SVG illustration */}
                <div className="w-40 h-40 md:w-56 md:h-56 relative z-10 opacity-80">
                  <CharacterSVG id={activeProfile.id} animate />
                </div>

                {/* Close Button */}
                <button
                  onClick={closeProfile}
                  className="absolute top-4 right-4 bg-[#181818]/90 text-white rounded-full p-2 border border-neutral-700/60 hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Play controls float bar */}
                <div className="absolute bottom-6 left-6 md:left-10 z-10 flex items-center gap-3">
                  <button
                    onClick={() => handlePlaySeries(activeProfile.id)}
                    className="flex items-center gap-2 bg-[#E50914] text-white font-semibold px-6 py-2.5 rounded hover:bg-red-700 active:scale-95 transition-all cursor-pointer text-sm shadow-md"
                  >
                    <Play className="w-4 h-4 fill-white stroke-none" />
                    Play Series
                  </button>
                  <button
                    onClick={() => setMuted(!muted)}
                    className="p-2.5 rounded-full border border-neutral-600/80 bg-neutral-900/50 hover:bg-neutral-800 text-white cursor-pointer active:scale-95 transition-all"
                  >
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Modal Content Info */}
              <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Columns: Story & Skills */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#34A853] font-bold text-sm">98% Match</span>
                    <span className="text-neutral-500 text-xs">2024</span>
                    <span className="border border-neutral-700 text-neutral-400 text-[10px] px-1 rounded uppercase tracking-wider font-bold">HD</span>
                    <span className="border border-neutral-700 text-neutral-400 text-[10px] px-1 rounded uppercase tracking-wider font-bold">5.1</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-none">
                    {activeProfile.roleTitle}
                  </h3>
                  
                  <p className="text-[#E50914] text-xs font-semibold uppercase tracking-wider mb-6 flex items-center gap-1.5">
                    <CircleDot className="w-3.5 h-3.5 fill-[#E50914] stroke-none animate-pulse" />
                    Character Type: {activeProfile.characterName}
                  </p>

                  <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed mb-8">
                    {activeProfile.characterDesc}
                  </p>

                  {/* Skills Grid */}
                  <div>
                    <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Core Competencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeProfile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 text-xs text-neutral-200 border border-neutral-800 bg-neutral-900/50 rounded-full hover:border-[#E50914] hover:text-[#E50914] transition-all duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Series Attributes / Specs */}
                <div className="border-t md:border-t-0 md:border-l border-neutral-800/80 pt-6 md:pt-0 md:pl-8 text-xs text-neutral-400 space-y-4">
                  <div>
                    <span className="text-neutral-600 block uppercase font-bold tracking-wider mb-1">Created By</span>
                    <span className="text-white font-medium">Vedant Tiwari</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block uppercase font-bold tracking-wider mb-1">Genre</span>
                    <span className="text-white font-medium">Growth Marketing, Data Science</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block uppercase font-bold tracking-wider mb-1">Series Length</span>
                    <span className="text-white font-medium">1.5+ Years Experience</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block uppercase font-bold tracking-wider mb-1">Base Location</span>
                    <span className="text-white font-medium">{portfolioData.personal.location}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block uppercase font-bold tracking-wider mb-1">Subtitles</span>
                    <span className="text-white font-medium">English (IN), Hindi (IN)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

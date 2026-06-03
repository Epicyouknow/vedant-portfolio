'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Calendar, TrendingUp, DollarSign, Layers, CheckCircle } from 'lucide-react';
import { portfolioData, Project } from '../data/portfolio';

// SVG Artwork Generator based on Project Image identifier
function ProjectArtwork({ image, category }: { image: string; category: string }) {
  switch (image) {
    case 'd2c-performance-blitz':
      return (
        <svg className="w-full h-full text-red-600 opacity-70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="rgba(229,9,20,0.03)" />
          {/* Ad analytics board mock */}
          <path d="M10 80 H90 M15 80 V20" stroke="#333" strokeWidth="1" />
          <path d="M15 65 Q30 50 45 60 T75 30 T90 20" stroke="#E50914" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="45" cy="60" r="3" fill="#ffffff" />
          <circle cx="75" cy="30" r="3" fill="#ffffff" />
          <text x="50" y="45" fill="#34A853" fontSize="8" fontWeight="bold">ROAS 3.8x</text>
          <rect x="20" y="25" width="20" height="10" rx="1" fill="rgba(66,133,244,0.15)" stroke="#4285F4" strokeWidth="0.5" />
          <text x="23" y="32" fill="#4285F4" fontSize="5" fontWeight="bold">Meta Ads</text>
        </svg>
      );
    case 'qcomm-launch-blueprint':
      return (
        <svg className="w-full h-full text-indigo-500 opacity-70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="rgba(99,102,241,0.03)" />
          {/* Map networks and delivery radii */}
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3"/>
          <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.5"/>
          <line x1="50" y1="50" x2="70" y2="30" stroke="#E50914" strokeWidth="1.5" />
          <circle cx="70" cy="30" r="4" fill="#E50914" />
          <circle cx="50" cy="50" r="3" fill="#ffffff" />
          {/* Floating budget nodes */}
          <rect x="15" y="65" width="25" height="12" rx="2" fill="rgba(255,255,255,0.05)" stroke="#fff" strokeWidth="0.5" />
          <text x="18" y="73" fill="#fff" fontSize="5">Blinkit / Zepto</text>
          <text x="55" y="80" fill="currentColor" fontSize="7" fontWeight="bold">2.4M Reach</text>
        </svg>
      );
    case 'identity-shift-strategy':
      return (
        <svg className="w-full h-full text-pink-500 opacity-70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="rgba(236,72,153,0.03)" />
          {/* Narrative storyboard frame panels */}
          <rect x="12" y="20" width="34" height="26" rx="2" stroke="currentColor" strokeWidth="1" />
          <rect x="54" y="20" width="34" height="26" rx="2" stroke="currentColor" strokeWidth="1" />
          <rect x="33" y="54" width="34" height="26" rx="2" stroke="#E50914" strokeWidth="1.5" />
          {/* Small placeholder lines inside panels */}
          <line x1="16" y1="36" x2="42" y2="36" stroke="#555" strokeWidth="1.5"/>
          <line x1="58" y1="36" x2="84" y2="36" stroke="#555" strokeWidth="1.5"/>
          <line x1="38" y1="70" x2="62" y2="70" stroke="#E50914" strokeWidth="1.5"/>
          <circle cx="50" cy="70" r="1.5" fill="#fff" />
          <text x="38" y="78" fill="#fff" fontSize="5" fontWeight="bold">STORYBOARD</text>
        </svg>
      );
    case 'checkout-engine-dev':
      return (
        <svg className="w-full h-full text-amber-500 opacity-70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="rgba(245,158,11,0.03)" />
          {/* Modular code layout */}
          <rect x="15" y="20" width="70" height="60" rx="3" fill="#141414" stroke="#444" strokeWidth="1"/>
          {/* Code tags lines */}
          <line x1="22" y1="32" x2="45" y2="32" stroke="#E50914" strokeWidth="2" strokeLinecap="round"/>
          <line x1="22" y1="42" x2="65" y2="42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="22" y1="52" x2="55" y2="52" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="30" y1="62" x2="70" y2="62" stroke="#34A853" strokeWidth="2" strokeLinecap="round"/>
          {/* Mini mobile screen overlay */}
          <rect x="68" y="42" width="22" height="42" rx="2" fill="#000" stroke="#E50914" strokeWidth="0.8" />
          <circle cx="79" cy="80" r="1" fill="#fff" />
        </svg>
      );
    default:
      return (
        <div className="w-full h-full bg-gradient-to-br from-red-950/20 to-black flex items-center justify-center">
          <Layers className="w-8 h-8 text-neutral-800" />
        </div>
      );
  }
}

export default function WorkShowcase() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Listen to cross-component triggers from CareerUniverse modal play
  useEffect(() => {
    const handleFilterEvent = (event: Event) => {
      const category = (event as CustomEvent).detail;
      if (category) {
        setSelectedCategory(category);
      }
    };
    window.addEventListener('filter-projects', handleFilterEvent);
    return () => window.removeEventListener('filter-projects', handleFilterEvent);
  }, []);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  };

  // Filter Categories
  const categories = [
    { id: 'all', label: 'All Work' },
    { id: 'campaign', label: 'Campaigns' },
    { id: 'mediaplan', label: 'Media Plans' },
    { id: 'branding', label: 'Brand Strategy' },
    { id: 'development', label: 'Development' }
  ];

  // Filtered project list
  const filteredProjects = portfolioData.projects.filter((project) => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="work-showcase" className="py-24 bg-[#000000] relative px-6 md:px-16 overflow-hidden">
      {/* Dynamic Red Glow Ambient Light */}
      <div className="ambient-light-red -top-20 right-1/4" style={{ opacity: 0.03 }} />

      <div className="max-w-7xl mx-auto">
        
        {/* Row Header: Section Title + Search & Category controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] block mb-2">Showcase</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans">
              Vedant's Originals Showcase
            </h2>
          </div>

          {/* Filtering & Search Controls */}
          <div className="flex items-center gap-4 self-start md:self-end w-full md:w-auto justify-between md:justify-end">
            {/* Search Bar */}
            <div className="relative flex items-center h-10">
              <motion.div
                initial={false}
                animate={{ width: searchOpen ? '200px' : '40px' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`flex items-center rounded bg-black/40 border border-neutral-800 h-full overflow-hidden ${
                  searchOpen ? 'px-3 border-[#E50914]' : 'justify-center border-transparent hover:border-neutral-800'
                }`}
              >
                <button onClick={toggleSearch} className="text-neutral-400 hover:text-white cursor-pointer focus:outline-none">
                  <Search className="w-5 h-5" />
                </button>
                {searchOpen && (
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Titles, skills, platforms..."
                    className="ml-2 bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-neutral-600"
                  />
                )}
              </motion.div>
            </div>

            {/* Category selection chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded text-xs font-semibold whitespace-nowrap tracking-wide cursor-pointer transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'bg-[#E50914] text-white shadow-lg shadow-red-900/20'
                      : 'bg-neutral-900/80 text-neutral-400 border border-neutral-800/40 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Project Originals Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ scale: 1.04, y: -4 }}
                onClick={() => setActiveProject(project)}
                className="group cursor-pointer rounded-lg bg-[#141414] overflow-hidden border border-neutral-900 shadow-xl relative aspect-[16/10] flex flex-col justify-end glass-panel-hover"
              >
                {/* SVG Visual Graphic Banner */}
                <div className="absolute inset-0 z-0">
                  <ProjectArtwork image={project.image} category={project.category} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Match badge float */}
                <div className="absolute top-3 left-3 bg-[#E50914] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-widest z-10">
                  {project.categoryLabel}
                </div>

                {/* Card labels */}
                <div className="relative z-10 p-5">
                  <span className="text-[#34A853] font-bold text-xs block mb-1">
                    {project.matchPercentage}% Match
                  </span>
                  
                  <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-[#E50914] transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  
                  <p className="text-[11px] text-neutral-500 mt-1 font-light line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Card glow outline */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#E50914] transition-all" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-neutral-900 rounded-lg">
            <Layers className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg">No Originals Found</h3>
            <p className="text-neutral-500 text-sm mt-1">Try tweaking your search keywords or category filters.</p>
          </div>
        )}
      </div>

      {/* Project Detail Modal Overlay */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 35 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-4xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl border border-neutral-800/80 my-8"
            >
              {/* Modal Visual Header Banner */}
              <div className="relative h-56 md:h-72 w-full bg-[#141414] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <ProjectArtwork image={activeProject.image} category={activeProject.category} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-black/50 to-black/30" />
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setActiveProject(null)}
                  className="absolute top-4 right-4 bg-[#181818]/90 text-white rounded-full p-2 border border-neutral-700/60 hover:bg-neutral-800 cursor-pointer z-20 active:scale-95 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Title inside Header */}
                <div className="absolute bottom-6 left-6 md:left-10 z-10">
                  <span className="text-[#E50914] text-[10px] font-extrabold uppercase tracking-[0.25em] bg-red-950/40 border border-red-800/30 px-2 py-0.5 rounded">
                    {activeProject.categoryLabel}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-extrabold text-white mt-2 glow-text-red">
                    {activeProject.title}
                  </h3>
                </div>
              </div>

              {/* Modal Body Info Columns */}
              <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Columns: Story & Delivery */}
                <div className="md:col-span-2 space-y-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.tags.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Descriptions */}
                  <div>
                    <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-2">Campaign Strategy</h4>
                    <p className="text-neutral-300 text-sm font-light leading-relaxed">
                      {activeProject.longDescription}
                    </p>
                  </div>

                  {/* Core Deliverables Checklist */}
                  <div>
                    <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Key Deliverables</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeProject.deliverables.map((deliv, dIdx) => (
                        <div key={dIdx} className="flex gap-2 text-xs text-neutral-300 items-start">
                          <CheckCircle className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Performance Stats and Specs */}
                <div className="border-t md:border-t-0 md:border-l border-neutral-800/80 pt-6 md:pt-0 md:pl-8 space-y-6">
                  <div>
                    <h4 className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider mb-3">Campaign Statistics</h4>
                    <div className="space-y-4">
                      {activeProject.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="bg-neutral-900/60 border border-neutral-900 p-3.5 rounded flex items-center gap-3">
                          <div className="p-2 rounded bg-red-950/40 border border-red-800/30 text-[#E50914]">
                            {m.label.toLowerCase().includes('spend') ? <DollarSign className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="text-[10px] text-neutral-500 uppercase block tracking-wider">{m.label}</span>
                            <span className="text-white font-extrabold text-sm">{m.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project specifications */}
                  <div className="text-[11px] text-neutral-400 space-y-3 pt-4 border-t border-neutral-900">
                    <div className="flex justify-between">
                      <span className="text-neutral-600 uppercase font-semibold">Release Year</span>
                      <span className="text-neutral-200 font-mono">{activeProject.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 uppercase font-semibold">Target ROAS Match</span>
                      <span className="text-[#34A853] font-bold font-mono">{activeProject.matchPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 uppercase font-semibold">Architect</span>
                      <span className="text-neutral-200">Vedant Tiwari</span>
                    </div>
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

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Plus, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { BlogPost } from '../../data/blogs';
import ParticleBackground from '../../components/ParticleBackground';

// Reusable Netflix Card Component
function MoviePosterCard({ blog }: { blog: BlogPost }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex-shrink-0 w-[180px] sm:w-[220px] aspect-[2/3] rounded-md overflow-visible cursor-pointer z-10"
    >
      {/* Normal Poster View */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#140b0d] via-[#09090c] to-[#050505] rounded-md overflow-hidden border border-neutral-800 hover:border-red-900/80 transition-all duration-300 p-4 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono font-bold tracking-widest text-[#E50914] bg-red-950/40 px-2 py-0.5 border border-red-900/30 rounded uppercase">
            {blog.category}
          </span>
          <span className="text-[8px] font-mono text-neutral-500">{blog.readingTime}</span>
        </div>

        <div className="my-auto">
          <h3 className="text-xs font-extrabold text-white uppercase leading-snug tracking-tight font-sans group-hover:text-[#E50914] transition-colors">
            {blog.title}
          </h3>
          <p className="text-[9px] text-neutral-400 font-light line-clamp-2 mt-1.5 leading-normal">
            {blog.summary}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-900/80 pt-2 text-[8px] font-mono text-neutral-500">
          <span>{blog.difficulty || 'Advanced'}</span>
          <span className="text-[#E50914] font-bold">READ ARTICLE →</span>
        </div>
      </div>

      {/* Expanded Hover Overlay - Netflix Style popout */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1.08, opacity: 1, y: -20 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute left-1/2 -translate-x-1/2 w-[240px] sm:w-[280px] bg-[#0d0708] border border-red-900/50 rounded-lg shadow-2xl overflow-hidden z-50 pointer-events-auto"
            style={{ top: '10%' }}
          >
            {/* Hover Header */}
            <div className="relative p-4 bg-gradient-to-b from-red-950/30 to-[#0d0708] border-b border-neutral-900">
              <span className="text-[8px] font-mono font-bold tracking-wider text-[#E50914] uppercase block mb-1">
                {blog.category}
              </span>
              <h4 className="text-xs font-black text-white uppercase leading-tight">
                {blog.title}
              </h4>
            </div>

            {/* Hover Details Panel */}
            <div className="p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="w-8 h-8 rounded-full bg-white hover:bg-neutral-200 flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-black text-black stroke-none ml-0.5" />
                  </Link>
                  <button className="w-8 h-8 rounded-full bg-[#1b1b1b] border border-neutral-700 hover:border-white flex items-center justify-center transition-all cursor-pointer text-white">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="w-8 h-8 rounded-full bg-[#1b1b1b] border border-neutral-700 hover:border-white flex items-center justify-center transition-all cursor-pointer text-white"
                >
                  <Info className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-neutral-400 font-mono">
                <span className="text-[#E50914] font-extrabold">{blog.difficulty || 'Advanced'}</span>
                <span>•</span>
                <span className="text-white">{blog.readingTime}</span>
                <span>•</span>
                <span>{new Date(blog.publishDate).getFullYear()}</span>
              </div>

              <h4 className="text-xs font-bold text-white uppercase leading-tight line-clamp-1">
                {blog.title}
              </h4>
              <p className="text-[10px] text-neutral-400 font-light leading-relaxed line-clamp-2">
                {blog.summary}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable Netflix Row Component
function MovieRow({ title, blogs }: { title: string; blogs: BlogPost[] }) {
  const rowRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  if (!blogs || blogs.length === 0) return null;

  return (
    <div className="relative flex flex-col gap-3 group px-6 md:px-16 overflow-visible mb-10 select-none">
      <h2 className="text-sm md:text-lg font-black text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
        <span className="w-1.5 h-4 bg-[#E50914] rounded-sm" />
        {title}
      </h2>

      {/* Row Scroll Container */}
      <div className="relative w-full overflow-visible">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 md:-ml-12 z-30 w-8 h-12 md:w-10 md:h-16 bg-black/75 hover:bg-black/95 text-white flex items-center justify-center rounded-r border-y border-r border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scroll Tracks */}
        <div
          ref={rowRef}
          className="w-full flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-4 overflow-y-visible"
        >
          {blogs.map((blog) => (
            <MoviePosterCard key={blog.slug} blog={blog} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 md:-mr-12 z-30 w-8 h-12 md:w-10 md:h-16 bg-black/75 hover:bg-black/95 text-white flex items-center justify-center rounded-l border-y border-l border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default function BlogLandingClient({
  initialBlogs,
  initialFeatured,
}: {
  initialBlogs: BlogPost[];
  initialFeatured: BlogPost | null;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter logic
  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDifficulty =
        selectedDifficulty === 'All' || blog.difficulty === selectedDifficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [initialBlogs, searchQuery, selectedDifficulty]);

  // Categories rows
  const googleAdsBlogs = useMemo(() => filteredBlogs.filter((b) => b.category === 'Google Ads Originals'), [filteredBlogs]);
  const metaAdsBlogs = useMemo(() => filteredBlogs.filter((b) => b.category === 'Meta Ads Collection'), [filteredBlogs]);
  const campaignBreakdowns = useMemo(() => filteredBlogs.filter((b) => b.category === 'Campaign Breakdowns' || b.category === 'Case Studies'), [filteredBlogs]);
  const aiAutomationBlogs = useMemo(() => filteredBlogs.filter((b) => b.category === 'AI & Automation'), [filteredBlogs]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden select-none font-sans flex flex-col">
      <ParticleBackground />
      <div className="vignette-overlay" />
      <div className="noise-overlay" />

      {/* Header Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-b from-black/95 via-black/50 to-transparent z-40 px-6 md:px-16 flex items-center justify-between backdrop-blur-[2px] border-b border-neutral-900/10">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 focus:outline-none cursor-pointer group shrink-0">
            <img 
              src="/logo-icon-exact.png" 
              alt="VedantVerse" 
              className="w-7 h-7 md:w-8 md:h-8 rounded-lg border border-[#E50914]/50 shadow-[0_0_10px_rgba(229,9,20,0.5)] group-hover:scale-105 group-hover:shadow-[0_0_16px_rgba(229,9,20,0.8)] transition-all duration-300 object-cover" 
            />
            <span className="text-sm md:text-base font-black uppercase tracking-widest text-[#E50914] drop-shadow-[0_0_10px_rgba(229,9,20,0.6)] group-hover:text-white transition-colors duration-300 leading-none font-sans">
              VEDANTVERSE
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs text-neutral-400 font-semibold tracking-wider">
            <Link href="/#command-center" className="hover:text-white uppercase">HUD</Link>
            <Link href="/#career-universe" className="hover:text-white uppercase">Universe</Link>
            <Link href="/#career-map" className="hover:text-white uppercase">Transit Map</Link>
            <Link href="/#campaign-dashboards" className="hover:text-white uppercase">Dashboards</Link>
            <Link href="/#marketing-lab" className="hover:text-white uppercase">Lab</Link>
            <Link href="/blog" className="text-white font-extrabold uppercase">Blogs</Link>
            <Link href="/#skills-galaxy" className="hover:text-white uppercase">Galaxy</Link>
            <Link href="/#contact" className="text-[#E50914] hover:text-white font-extrabold uppercase">Contact Me</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white cursor-pointer focus:outline-none"
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-72 bg-[#0e0e0e]/95 border-l border-neutral-900 z-50 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md lg:hidden"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                  <span className="text-[#E50914] font-black text-lg tracking-tight">VEDANTVERSE</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-neutral-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <Link href="/#command-center" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 text-xs font-semibold uppercase">HUD</Link>
                  <Link href="/#career-universe" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 text-xs font-semibold uppercase">Universe</Link>
                  <Link href="/#career-map" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 text-xs font-semibold uppercase">Transit Map</Link>
                  <Link href="/#campaign-dashboards" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 text-xs font-semibold uppercase">Dashboards</Link>
                  <Link href="/#marketing-lab" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 text-xs font-semibold uppercase">Lab</Link>
                  <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-white font-bold text-xs uppercase">Blogs</Link>
                  <Link href="/#skills-galaxy" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 text-xs font-semibold uppercase">Galaxy</Link>
                  <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="text-[#E50914] font-bold text-xs uppercase">Contact Me</Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full pt-20">
        
        {/* Cinematic Featured Poster Section */}
        {initialFeatured && (
          <div 
            style={{ backgroundImage: 'none', backgroundColor: '#050505' }}
            className="relative w-full py-12 sm:py-20 bg-gradient-to-b from-[#0e0708] via-[#050505] to-[#050505] border-b border-neutral-900/60 overflow-hidden flex items-end"
          >
            <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-red-950/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Featured Info Container */}
            <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-16 pb-12 sm:pb-20 flex flex-col gap-4 text-left">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] bg-red-950/40 text-[#E50914] px-3 py-1 border border-red-900/30 rounded-md">
                  ★ FEATURED ORIGINAL RELEASE
                </span>
                <span className="text-xs text-neutral-400 font-mono font-bold">
                  {initialFeatured.readingTime}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[0.95] max-w-3xl">
                {initialFeatured.title}
              </h1>

              <p className="text-neutral-400 text-xs sm:text-base font-light leading-relaxed max-w-xl">
                {initialFeatured.summary}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2">
                <Link
                  href={`/blog/${initialFeatured.slug}`}
                  className="flex items-center gap-2 bg-white text-black font-bold text-xs sm:text-sm px-8 py-4 rounded hover:bg-neutral-200 transition-colors shadow-2xl animate-pulse-slow"
                >
                  <Play className="w-4 h-4 fill-black text-black stroke-none" />
                  Watch Strategy
                </Link>
                <Link
                  href={`/blog/${initialFeatured.slug}`}
                  className="flex items-center gap-2 bg-neutral-900/85 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-6 py-4 rounded border border-neutral-700/50 transition-colors"
                >
                  <Info className="w-4 h-4" />
                  Details
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Global Toolbar: Search & Filters */}
        <div className="w-full max-w-7xl mx-auto px-6 md:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-30">
          {/* Live Search */}
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search strategy codes, topics, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-neutral-800/80 rounded-lg text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]/80 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-4 py-2.5 rounded-lg text-[10px] uppercase font-mono font-bold border transition-all cursor-pointer whitespace-nowrap ${
                  selectedDifficulty === diff
                    ? 'bg-[#E50914] text-white border-[#E50914]'
                    : 'bg-[#0a0a0a]/50 text-neutral-400 border-neutral-800/80 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Netflix Category Rows */}
        <div className="pb-20 overflow-visible relative z-30">
          {searchQuery ? (
            <div className="px-6 md:px-16 mb-10">
              <h2 className="text-sm md:text-lg font-black text-white uppercase tracking-wider font-mono mb-6">
                🔍 Search Results ({filteredBlogs.length})
              </h2>
              {filteredBlogs.length > 0 ? (
                <div className="flex flex-wrap gap-6 justify-start">
                  {filteredBlogs.map((blog) => (
                    <MoviePosterCard key={blog.slug} blog={blog} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-neutral-500 text-xs font-mono">
                  No blockbuster strategies found matching your search.
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Row 1: 🔥 Latest Releases */}
              <MovieRow title="🔥 Latest Releases" blogs={filteredBlogs} />

              {/* Row 2: 📈 Google Ads Originals */}
              <MovieRow title="📈 Google Ads Originals" blogs={googleAdsBlogs} />

              {/* Row 3: 🎯 Meta Ads Collection */}
              <MovieRow title="🎯 Meta Ads Collection" blogs={metaAdsBlogs} />

              {/* Row 4: 🎬 Campaign Breakdowns */}
              <MovieRow title="🎬 Campaign Breakdowns" blogs={campaignBreakdowns} />

              {/* Row 5: 🤖 AI & Automation */}
              <MovieRow title="🤖 AI & Automation" blogs={aiAutomationBlogs} />
            </>
          )}
        </div>

      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Plus, ChevronLeft, Bookmark, Share2, MessageSquare, Award, Clock, ArrowLeft, Send, X } from 'lucide-react';
import { BlogPost } from '../../../data/blogs';
import ParticleBackground from '../../../components/ParticleBackground';

// Local storage helper for comments
interface Comment {
  author: string;
  avatar: string;
  text: string;
  date: string;
}

// Custom Markdown Parser to render articles beautifully
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="prose prose-invert max-w-none font-sans text-neutral-300 leading-relaxed text-sm sm:text-base space-y-6">
      {lines.map((line, idx) => {
        // H1 header
        if (line.startsWith('# ')) {
          const text = line.replace('# ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
            <h1 key={idx} id={id} className="text-2xl sm:text-3xl lg:text-4xl font-black text-white pt-6 border-b border-neutral-900 pb-2 uppercase tracking-tight">
              {text}
            </h1>
          );
        }
        // H2 header
        if (line.startsWith('## ')) {
          const text = line.replace('## ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
            <h2 key={idx} id={id} className="text-xl sm:text-2xl font-bold text-white pt-4 uppercase tracking-tight flex items-center gap-2">
              <span className="w-1 h-5 bg-[#E50914] rounded-sm" />
              {text}
            </h2>
          );
        }
        // H3 header
        if (line.startsWith('### ')) {
          const text = line.replace('### ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
            <h3 key={idx} id={id} className="text-lg font-bold text-neutral-200 uppercase tracking-tight">
              {text}
            </h3>
          );
        }
        // Quote callouts
        if (line.startsWith('> ')) {
          return (
            <blockquote key={idx} className="border-l-4 border-[#E50914] bg-red-950/10 px-6 py-4 rounded-r font-mono italic text-neutral-400">
              {line.replace('> ', '')}
            </blockquote>
          );
        }
        // Bullet points
        if (line.startsWith('* ')) {
          return (
            <li key={idx} className="ml-6 list-disc text-neutral-400">
              {line.replace('* ', '')}
            </li>
          );
        }
        // Code Blocks
        if (line.startsWith('```')) {
          const codeLines = [];
          let currentIdx = idx + 1;
          while (currentIdx < lines.length && !lines[currentIdx].startsWith('```')) {
            codeLines.push(lines[currentIdx]);
            currentIdx++;
          }
          // Fast-forward line mapping index
          lines.splice(idx, currentIdx - idx);
          return (
            <pre key={idx} className="bg-[#0c0c0c] border border-neutral-800/80 rounded-lg p-5 overflow-x-auto font-mono text-xs sm:text-sm text-red-500/90 shadow-inner">
              <code>{codeLines.join('\n')}</code>
            </pre>
          );
        }
        // Skip empty lines
        if (!line.trim()) return null;

        // Render standard paragraphs
        return (
          <p key={idx} className="text-neutral-400/90 font-light leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default function ArticleViewClient({ blog, allBlogs }: { blog: BlogPost; allBlogs: BlogPost[] }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load related posts (Continue watching)
  const relatedPosts = useMemo(() => {
    return allBlogs
      .filter((b) => b.slug !== blog.slug && b.category === blog.category)
      .slice(0, 6);
  }, [allBlogs, blog]);

  // Load mock comments from localStorage
  useEffect(() => {
    const key = `comments_${blog.slug}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setComments(JSON.parse(saved));
    } else {
      // Default starting comments
      const defaults: Comment[] = [
        {
          author: 'Rohit Sharma',
          avatar: '🦁',
          text: 'This is gold! The PMax asset group structuring tip solved our budget bleed issues.',
          date: '2026-07-02',
        },
      ];
      setComments(defaults);
      localStorage.setItem(key, JSON.stringify(defaults));
    }
  }, [blog]);

  // Scroll and TOC tracking logic
  useEffect(() => {
    const handleScroll = () => {
      // Progress Bar tracker
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }

      // TOC Active heading detection
      if (headings.length > 0) {
        let currentActive = headings[0].id;
        for (const h of headings) {
          const el = document.getElementById(h.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 120) {
              currentActive = h.id;
            } else {
              break;
            }
          }
        }
        setActiveHeadingId(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // Parse headings for floating TOC
  useEffect(() => {
    const list: { id: string; text: string; level: number }[] = [];
    const lines = blog.content.split('\n');
    lines.forEach((line) => {
      if (line.startsWith('# ')) {
        const text = line.replace('# ', '');
        list.push({ id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-'), text, level: 1 });
      } else if (line.startsWith('## ')) {
        const text = line.replace('## ', '');
        list.push({ id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-'), text, level: 2 });
      }
    });
    setHeadings(list);
  }, [blog]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newComment: Comment = {
      author: newCommentName,
      avatar: '🎬',
      text: newCommentText,
      date: new Date().toISOString().split('T')[0],
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`comments_${blog.slug}`, JSON.stringify(updated));
    setNewCommentName('');
    setNewCommentText('');
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden select-none font-sans flex flex-col">
      <ParticleBackground />
      <div className="vignette-overlay" />
      <div className="noise-overlay" />

      {/* Header Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-b from-black/95 via-black/50 to-transparent z-45 px-6 md:px-16 flex items-center justify-between backdrop-blur-[2px] border-b border-neutral-900/10">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 text-2xl font-extrabold text-[#E50914] focus:outline-none cursor-pointer group">
            <svg className="w-8 h-8 overflow-visible filter drop-shadow-[0_0_8px_rgba(229,9,20,0.6)] group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(229,9,20,0.85)] transition-all duration-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="vFacet1-blog-detail" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff1e27" />
                  <stop offset="100%" stopColor="#b20710" />
                </linearGradient>
                <linearGradient id="vFacet2-blog-detail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e50914" />
                  <stop offset="100%" stopColor="#600104" />
                </linearGradient>
                <linearGradient id="vFacet3-blog-detail" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff4148" />
                  <stop offset="100%" stopColor="#800206" />
                </linearGradient>
              </defs>
              <path d="M 20 15 L 42 15 L 50 85 L 35 85 Z" fill="url(#vFacet1-blog-detail)" />
              <path d="M 42 15 L 50 15 L 50 85 Z" fill="url(#vFacet2-blog-detail)" opacity="0.9" />
              <path d="M 50 85 L 50 15 L 58 15 L 80 15 L 65 85 Z" fill="url(#vFacet3-blog-detail)" />
              <path d="M 50 85 L 50 15 L 58 15 Z" fill="url(#vFacet2-blog-detail)" opacity="0.6" />
            </svg>
            <span className="text-sm text-neutral-300 font-bold uppercase tracking-[0.25em] font-sans hidden sm:inline group-hover:text-white transition-colors duration-300">
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

      {/* Mobile Menu */}
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

      {/* Netflix Red Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-[#E50914] z-50 transition-all duration-75"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <main className="flex-1 w-full pt-16 md:pt-20">
        
        {/* Back navigation */}
        <div className="max-w-7xl mx-auto px-6 md:px-16 pt-6">
          <Link href="/blog" className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white uppercase transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to marketing catalog
          </Link>
        </div>

        {/* Cinematic Cover Banner */}
        <div className="relative w-full h-[45vh] sm:h-[55vh] min-h-[380px] bg-black flex items-end">
          <div className="absolute inset-0 z-0">
            <img
              src={blog.coverImage || '/ref_image2.png'}
              alt={blog.title}
              className="w-full h-full object-cover brightness-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-16 pb-12 flex flex-col gap-4 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[9px] font-mono font-black uppercase tracking-wider bg-red-950/40 text-[#E50914] px-3 py-1 border border-red-900/30 rounded">
                {blog.category}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {blog.readingTime}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {blog.views} views
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.0] max-w-4xl">
              {blog.title}
            </h1>
            <p className="text-neutral-400 text-xs sm:text-base font-light max-w-2xl leading-relaxed">
              {blog.summary}
            </p>
          </div>
        </div>

        {/* Article Layout split */}
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 flex flex-col lg:flex-row gap-12 relative z-30">
          
          {/* Main content body (Left / Center) */}
          <div ref={contentRef} className="flex-1 max-w-[800px] border-r border-neutral-900/30 pr-0 lg:pr-8">
            
            {/* Quick takeaways TL;DR panel */}
            <div className="bg-[#090909] border border-red-500/10 rounded-xl p-6 sm:p-8 mb-10 flex flex-col gap-3 select-none text-left">
              <h3 className="text-xs font-mono font-black text-[#E50914] uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] animate-pulse" />
                TL;DR QUICK SUMMARY & KEY TAKEAWAYS
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                {blog.summary}
              </p>
            </div>

            <MarkdownRenderer content={blog.content} />

            {/* Meet the Creator Bio Box */}
            <div className="border-t border-neutral-900 pt-16 mt-16 text-left">
              <h3 className="text-xs font-mono font-black text-[#E50914] uppercase tracking-widest mb-6">
                Meet the Creator
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#080808] border border-neutral-900 p-6 rounded-xl">
                <img
                  src="/vedant_portrait.png"
                  alt="Vedant Tiwari"
                  className="w-20 h-20 rounded-full border border-[#E50914]/30 object-cover object-top shadow-lg"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <h4 className="text-base font-black text-white uppercase tracking-tight">
                    {blog.author.name}
                  </h4>
                  <p className="text-xs text-neutral-400 font-mono">
                    {blog.author.role} • 1.5+ Years Experience
                  </p>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    I design, audit, and scale search & social ad campaigns for eCommerce brands. I help leverage high-margin performance marketing strategies to build sustainable digital growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Community Discussion Forums (Comments) */}
            <div className="border-t border-neutral-900 pt-16 mt-16 text-left">
              <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#E50914]" />
                Community Discussion ({comments.length})
              </h3>

              {/* Form */}
              <form onSubmit={handleAddComment} className="flex flex-col gap-3.5 mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]/80 transition-colors"
                  />
                </div>
                <textarea
                  placeholder="Join the discussion... Share your query or feedback."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914]/80 transition-colors resize-none"
                />
                <button
                  type="submit"
                  className="self-end flex items-center gap-2 bg-[#E50914] text-white font-bold text-xs px-6 py-3 rounded hover:bg-[#b20710] cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post Comment
                </button>
              </form>

              {/* List */}
              <div className="space-y-4">
                {comments.map((c, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-[#080808]/50 border border-neutral-900/60 rounded-lg">
                    <span className="text-xl p-2 bg-neutral-900 rounded-full">{c.avatar}</span>
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{c.author}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">{c.date}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Table of Contents sidebar (Right - Desktop only) */}
          {headings.length > 0 && (
            <div className="hidden lg:block w-[260px] shrink-0">
              <div className="sticky top-28 bg-[#080808]/85 border border-neutral-900 p-6 rounded-xl text-left select-none">
                <h4 className="text-[10px] font-mono font-black text-[#E50914] uppercase tracking-[0.25em] mb-4">
                  ★ EPISODE SCENES
                </h4>
                <ul className="space-y-3 font-mono text-[10px]">
                  {headings.map((h, i) => (
                    <li
                      key={i}
                      className="transition-colors"
                      style={{ paddingLeft: h.level === 2 ? '12px' : '0' }}
                    >
                      <a
                        href={`#${h.id}`}
                        className={`hover:text-white transition-colors capitalize ${
                          activeHeadingId === h.id ? 'text-white font-bold' : 'text-neutral-500'
                        }`}
                      >
                        {activeHeadingId === h.id ? '▶ ' : ''}
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Continue Watching Section (Related Releases) */}
        {relatedPosts.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 border-t border-neutral-900 text-left select-none mb-20">
            <h3 className="text-xs font-mono font-black text-[#E50914] uppercase tracking-widest mb-8 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Continue Watching (Related Releases)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {relatedPosts.map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/blog/${blog.slug}`}
                  className="flex flex-col gap-2 group cursor-pointer"
                >
                  <div className="relative aspect-[2/3] bg-neutral-900 rounded overflow-hidden border border-neutral-800 group-hover:border-white transition-all duration-300 shadow-lg">
                    <img
                      src={blog.coverImage || '/ref_image2.png'}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-[10px] font-bold text-neutral-400 group-hover:text-white uppercase leading-tight line-clamp-2 transition-colors">
                    {blog.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

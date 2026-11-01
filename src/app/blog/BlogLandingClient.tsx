'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { BlogPost } from '../../data/blogs';
import Navbar from '../../components/Navbar';
import ContactAndFooter from '../../components/ContactAndFooter';

export default function BlogLandingClient({
  initialBlogs,
  initialFeatured,
}: {
  initialBlogs: BlogPost[];
  initialFeatured: BlogPost | null;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories list
  const categories = useMemo(() => {
    const cats = Array.from(new Set(initialBlogs.map((b) => b.category)));
    return ['All', ...cats];
  }, [initialBlogs]);

  // Filter logic
  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'All' || blog.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [initialBlogs, searchQuery, selectedCategory]);

  const featured = initialFeatured || initialBlogs[0];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-24 w-full">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO PORTFOLIO</span>
          </Link>

          <div className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--text-muted)] mb-3">
            — FIELD NOTES &amp; ESSAYS
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1] mb-6">
            Clear thinking for<br />
            <span className="text-[var(--accent-red)]">better growth.</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl font-normal leading-relaxed">
            Practical perspectives on performance marketing, creative testing matrices, Google Ads architectures, and the decisions behind sustainable scale.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-12 pb-6 border-b border-[var(--border-subtle)]">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap border ${
                  selectedCategory === cat
                    ? 'bg-[#191919] text-white dark:bg-[#F7F5F0] dark:text-[#191919] border-transparent font-semibold shadow-xs'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--text-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search field notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full text-xs bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-red)] transition-colors"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className="surface-card rounded-2xl p-7 flex flex-col justify-between shadow-xs hover:border-[var(--border-strong)] transition-all duration-300 group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider uppercase mb-4">
                  <span className="text-[var(--accent-red)]">{blog.category}</span>
                  <span className="text-[var(--text-muted)]">{blog.readingTime}</span>
                </div>

                <h2 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors leading-snug mb-3">
                  {blog.title}
                </h2>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-6">
                  {blog.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-mono">{blog.publishDate}</span>
                </div>
                <div className="flex items-center gap-1 text-[var(--accent-red)]">
                  <span>Read article</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-20 text-[var(--text-muted)]">
            <p className="text-sm">No articles found matching &quot;{searchQuery}&quot;.</p>
          </div>
        )}

      </main>

      <ContactAndFooter />
    </div>
  );
}

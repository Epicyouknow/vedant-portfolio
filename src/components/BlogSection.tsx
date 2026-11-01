'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllBlogs } from '../data/blogs';
import { TextMaskReveal, FadeUpStagger, FadeUpItem, SlideScene } from './motion/MotionSystem';

export default function BlogSection() {
  const allBlogs = getAllBlogs();

  // Primary featured post
  const featuredPost = allBlogs.find(b => b.slug === 'creative-testing-framework-20') || allBlogs[0];
  
  // Supporting posts
  const supportingPosts = [
    {
      category: 'PAID MEDIA',
      readTime: '28 MIN READ',
      title: 'Why better reporting starts before the campaign launches',
      slug: 'google-ads-performance-max-guide',
    },
    {
      category: 'CREATIVE STRATEGY',
      readTime: '16 MIN READ',
      title: 'The creative testing system that protects your learning',
      slug: 'creative-testing-framework-20',
    },
    {
      category: 'GROWTH NOTES',
      readTime: '12 MIN READ',
      title: 'What "scaling" should actually mean for your brand',
      slug: 'b2b-logistics-cpl-reduction-search-intent',
    },
  ];

  return (
    <SlideScene id="blog-section" className="py-24 md:py-32 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header with Line-by-Line Reveal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <div className="text-[11px] md:text-xs font-semibold tracking-[0.24em] uppercase text-[var(--text-muted)] mb-4">
              — FIELD NOTES
            </div>
            <div className="mb-2">
              <TextMaskReveal delay={0.1}>
                <span className="block text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1]">
                  Clear thinking for
                </span>
              </TextMaskReveal>
              <TextMaskReveal delay={0.25}>
                <span className="block text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--accent-red)] leading-[1.1]">
                  better growth.
                </span>
              </TextMaskReveal>
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              Practical perspectives on performance marketing, creative testing, and the decisions behind sustainable scale.
            </p>
          </div>
        </div>

        {/* 2-Column Editorial Blog Grid with Staggered Motion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Large Featured Article Card */}
          <div className="lg:col-span-7 surface-card rounded-2xl overflow-hidden p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:border-[var(--border-strong)] transition-all duration-300 group">
            <div>
              
              {/* Graphic Visual Block: Bold black surface with red circle & "Signal over noise." */}
              <div className="w-full h-56 sm:h-64 bg-[#171716] text-[#F7F5F0] rounded-xl mb-8 p-8 flex flex-col justify-between relative overflow-hidden shadow-inner">
                
                {/* Red accent circle graphic element with hover pulse */}
                <div className="absolute right-[-20px] top-[-20px] w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-[var(--accent-red)] pointer-events-none opacity-90 transition-transform duration-700 group-hover:scale-110" />

                {/* Top tag in graphic */}
                <div className="relative z-10 text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                  01 // FIELD NOTE #1
                </div>

                {/* Editorial statement in graphic */}
                <div className="relative z-10 text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-white">
                  Signal<br />over noise.
                </div>
              </div>

              {/* Category & Read Time */}
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-[var(--accent-red)] mb-3">
                <span>STRATEGY</span>
                <span>•</span>
                <span className="text-[var(--text-muted)]">4 MIN READ</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4 tracking-tight leading-snug">
                A practical framework for turning campaign data into your next best decision.
              </h3>

              {/* Summary */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                Dashboards show what happened. Good reporting helps you decide what to do next. Learn how to systematically decouple creative hooks and audience signals.
              </p>
            </div>

            {/* Read Insight CTA */}
            <div className="pt-6 border-t border-[var(--border-subtle)]">
              <Link
                href={`/blog/${featuredPost?.slug || 'creative-testing-framework-20'}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors"
              >
                <span>Read insight</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

          </div>

          {/* Right Column: 3 Supporting Article Cards Staggered */}
          <FadeUpStagger delay={0.2} stagger={0.12} className="lg:col-span-5 flex flex-col gap-6">
            {supportingPosts.map((post, idx) => (
              <FadeUpItem key={idx}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="surface-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[var(--border-strong)] transition-all duration-300 group cursor-pointer block h-full"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider uppercase mb-3">
                      <span className="text-[var(--accent-red)]">{post.category}</span>
                      <span className="text-[var(--text-muted)]">{post.readTime}</span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors leading-snug">
                      {post.title}
                    </h4>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                    <span>Read field note</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-[var(--accent-red)]" />
                  </div>
                </Link>
              </FadeUpItem>
            ))}
          </FadeUpStagger>

        </div>

      </div>
    </SlideScene>
  );
}

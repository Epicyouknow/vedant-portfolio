'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, Share2, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../../data/blogs';
import Navbar from '../../../components/Navbar';
import ContactAndFooter from '../../../components/ContactAndFooter';

// Custom Markdown Parser to render articles in editorial style
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-6 font-sans text-[var(--text-secondary)] leading-relaxed text-base">
      {lines.map((line, idx) => {
        // H1 header
        if (line.startsWith('# ')) {
          const text = line.replace('# ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
            <h1 key={idx} id={id} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] pt-6 border-b border-[var(--border-subtle)] pb-3 tracking-tight">
              {text}
            </h1>
          );
        }
        // H2 header
        if (line.startsWith('## ')) {
          const text = line.replace('## ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
            <h2 key={idx} id={id} className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] pt-6 tracking-tight flex items-center gap-2">
              <span className="w-1 h-5 bg-[var(--accent-red)] rounded-full shrink-0" />
              {text}
            </h2>
          );
        }
        // H3 header
        if (line.startsWith('### ')) {
          const text = line.replace('### ', '');
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
            <h3 key={idx} id={id} className="text-lg font-bold text-[var(--text-primary)] pt-2 tracking-tight">
              {text}
            </h3>
          );
        }
        // Quote callouts
        if (line.startsWith('> ')) {
          return (
            <blockquote key={idx} className="border-l-3 border-[var(--accent-red)] bg-[var(--bg-card)] px-6 py-4 rounded-r-xl italic text-[var(--text-primary)] my-4">
              {line.replace('> ', '')}
            </blockquote>
          );
        }
        // Bullet points
        if (line.startsWith('* ') || line.startsWith('- ')) {
          return (
            <li key={idx} className="ml-6 list-disc text-[var(--text-secondary)] leading-relaxed">
              {line.replace(/^(\* |- )/, '')}
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
          lines.splice(idx, currentIdx - idx);
          return (
            <pre key={idx} className="bg-[#171716] text-[#F7F5F0] border border-[#2E2D2B] rounded-xl p-5 overflow-x-auto font-mono text-xs sm:text-sm my-4">
              <code>{codeLines.join('\n')}</code>
            </pre>
          );
        }
        // Skip empty lines
        if (!line.trim()) return null;

        // Render standard paragraphs
        return (
          <p key={idx} className="text-[var(--text-secondary)] leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default function ArticleViewClient({ blog, allBlogs }: { blog: BlogPost; allBlogs: BlogPost[] }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const relatedPosts = useMemo(() => {
    return allBlogs.filter((b) => b.slug !== blog.slug).slice(0, 3);
  }, [allBlogs, blog]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col justify-between">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-[var(--accent-red)] z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-12 pt-36 pb-24 w-full">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO FIELD NOTES</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12 pb-8 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3 text-xs font-mono font-bold tracking-wider uppercase mb-4">
            <span className="text-[var(--accent-red)]">{blog.category}</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-[var(--text-muted)]">{blog.readingTime}</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-[var(--text-muted)]">{blog.publishDate}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.15] mb-6">
            {blog.title}
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
            {blog.summary}
          </p>

          {/* Author Badge */}
          <div className="flex items-center gap-3.5 pt-4">
            <div className="w-10 h-10 rounded-full bg-[var(--arch-bg)] overflow-hidden border border-[var(--border-subtle)] shrink-0 flex items-center justify-center">
              <Image
                src="/vedant_portrait.png"
                alt="Vedant Tiwari"
                width={40}
                height={40}
                className="object-cover object-top"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">
                {blog.author?.name || 'Vedant Tiwari'}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] font-mono">
                {blog.author?.role || 'Senior Performance Marketing Executive'}
              </div>
            </div>
          </div>
        </header>

        {/* Article Body Content */}
        <article className="mb-20">
          <MarkdownRenderer content={blog.content} />
        </article>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="pt-6 pb-12 border-t border-[var(--border-subtle)] mb-16 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-[var(--text-muted)] mr-2">Tags:</span>
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="pt-12 border-t border-[var(--border-subtle)] mb-12">
            <div className="text-[11px] font-mono font-bold tracking-widest uppercase text-[var(--text-muted)] mb-6">
              RELATED FIELD NOTES
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="surface-card rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-[var(--border-strong)] transition-all group cursor-pointer"
                >
                  <div>
                    <span className="text-[9px] font-mono font-bold text-[var(--accent-red)] uppercase block mb-2">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors leading-snug">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                    <span>{rel.readingTime}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-red)]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      <ContactAndFooter />
    </div>
  );
}

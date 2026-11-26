'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, Share2, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../../data/blogs';
import Navbar from '../../../components/Navbar';
import ContactAndFooter from '../../../components/ContactAndFooter';

// Inline markdown formatter (bold, code, links)
function renderInline(text: string) {
  // Regex to match **bold**, `code`, [link](url)
  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-[var(--text-primary)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--accent-red)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (match) {
        const [, linkText, url] = match;
        const isExternal = url.startsWith('http');
        return (
          <a
            key={i}
            href={url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-[var(--accent-red)] hover:underline font-semibold"
          >
            {linkText}
          </a>
        );
      }
    }
    return <span key={i}>{part}</span>;
  });
}

// Block-level custom Markdown Parser with full table, list, and formatting support
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      blocks.push(
        <hr key={`hr-${i}`} className="my-8 border-[var(--border-subtle)]" />
      );
      i++;
      continue;
    }

    // Code Block
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push(
        <pre
          key={`code-${i}`}
          className="bg-[#171716] text-[#F7F5F0] border border-[#2E2D2B] rounded-2xl p-5 overflow-x-auto font-mono text-xs sm:text-sm my-6 leading-relaxed"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // Markdown Table
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        // Skip separator row (tableLines[1])
        const bodyRows = tableLines.slice(2).map((rowStr) =>
          rowStr
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim())
        );

        blocks.push(
          <div
            key={`table-${i}`}
            className="overflow-x-auto my-6 surface-card rounded-2xl border border-[var(--border-subtle)] p-2 shadow-xs"
          >
            <table className="w-full text-xs sm:text-sm font-mono text-left">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] text-[var(--text-primary)]">
                  {headerRow.map((col, cIdx) => (
                    <th key={cIdx} className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">
                      {renderInline(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[var(--bg-card-subtle)] transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-3 px-4">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Headings
    if (line.startsWith('# ')) {
      const text = line.replace('# ', '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      blocks.push(
        <h1
          key={`h1-${i}`}
          id={id}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] pt-6 border-b border-[var(--border-subtle)] pb-3 tracking-tight"
        >
          {text}
        </h1>
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      const text = line.replace('## ', '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      blocks.push(
        <h2
          key={`h2-${i}`}
          id={id}
          className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] pt-8 pb-1 tracking-tight flex items-center gap-2"
        >
          <span className="w-1.5 h-5 bg-[var(--accent-red)] rounded-full shrink-0" />
          {text}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      const text = line.replace('### ', '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      blocks.push(
        <h3
          key={`h3-${i}`}
          id={id}
          className="text-base sm:text-lg font-bold text-[var(--text-primary)] pt-4 tracking-tight"
        >
          {text}
        </h3>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      blocks.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-3 border-[var(--accent-red)] bg-[var(--bg-card)] px-6 py-4 rounded-r-2xl italic text-[var(--text-primary)] my-4 text-sm sm:text-base leading-relaxed"
        >
          {renderInline(line.replace('> ', '').trim())}
        </blockquote>
      );
      i++;
      continue;
    }

    // Bulleted Lists
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].startsWith('* ') || lines[i].startsWith('- '))) {
        listItems.push(lines[i].replace(/^(\* |- )/, '').trim());
        i++;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="space-y-2 my-4 ml-6 list-disc text-[var(--text-secondary)]">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered Lists
    if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s/, '').trim());
        i++;
      }
      blocks.push(
        <ol key={`ol-${i}`} className="space-y-2 my-4 ml-6 list-decimal text-[var(--text-secondary)]">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph
    blocks.push(
      <p key={`p-${i}`} className="text-[var(--text-secondary)] leading-relaxed text-base">
        {renderInline(line.trim())}
      </p>
    );
    i++;
  }

  return <div className="space-y-6 font-sans text-base">{blocks}</div>;
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

        {/* Dedicated 16:9 Editorial Cover Hero Graphic */}
        <div className="mb-12 rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-sm bg-[#121211] aspect-[16/9] relative">
          <img
            src={blog.coverImage || `/covers/${blog.slug}.svg`}
            alt={blog.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

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

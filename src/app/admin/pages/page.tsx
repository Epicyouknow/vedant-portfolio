'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Eye, ExternalLink, ArrowRight } from 'lucide-react';

export default function PagesManagerPage() {
  const pages = [
    { title: 'Homepage', path: '/', status: 'Published', type: 'Static · App Router', lastModified: 'Today' },
    { title: 'Case Studies Directory', path: '/case-studies', status: 'Published', type: 'Static · App Router', lastModified: 'Today' },
    { title: 'Dedicated Case Study Pages', path: '/clients/[slug]', status: 'Published', type: 'Dynamic SSG (23 routes)', lastModified: 'Today' },
    { title: 'Blog & Field Notes', path: '/blog', status: 'Published', type: 'Dynamic SSG (10 articles)', lastModified: 'Today' },
    { title: 'Unlocked Achievements', path: '/achievements', status: 'Published', type: 'Static · App Router', lastModified: 'Today' },
    { title: 'Interactive Career Transit Map', path: '/career-map', status: 'Published', type: 'Static · App Router', lastModified: 'Today' },
    { title: 'Industries We\'ve Scaled', path: '/industries', status: 'Published', type: 'Static · App Router', lastModified: 'Today' },
    { title: 'Privacy Policy', path: '/privacy', status: 'Published', type: 'Static · Legal', lastModified: 'Verified' },
    { title: 'Support & FAQ', path: '/support', status: 'Published', type: 'Static · Legal', lastModified: 'Verified' },
    { title: 'Terms of Engagement', path: '/terms', status: 'Published', type: 'Static · Legal', lastModified: 'Verified' },
  ];

  return (
    <div className="space-y-7">
      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
          PAGE ARCHITECTURE • SITE DIRECTORY
        </div>
        <h1 className="vv-h1">Pages manager</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
          Manage, inspect, and preview all public-facing pages, routing nodes, and canonical URL structures.
        </p>
      </div>

      <div className="vv-card overflow-hidden">
        <div className="vv-table-head grid-cols-[1.5fr_140px_140px_100px_80px]">
          <span>PAGE NAME &amp; ROUTE</span>
          <span>STATUS</span>
          <span>TYPE</span>
          <span>MODIFIED</span>
          <span className="text-right">VIEW</span>
        </div>

        <div className="divide-y divide-[var(--line)]">
          {pages.map((p) => (
            <div key={p.path} className="vv-table-row grid-cols-[1.5fr_140px_140px_100px_80px]">
              <div>
                <div className="text-sm font-semibold text-[var(--ink)]">{p.title}</div>
                <div className="text-xs font-mono text-[var(--muted)] mt-0.5">{p.path}</div>
              </div>

              <div>
                <span className="vv-badge vv-badge--success">
                  {p.status}
                </span>
              </div>

              <div className="text-xs font-mono text-[var(--muted)]">{p.type}</div>

              <div className="text-xs font-mono text-[var(--muted)]">{p.lastModified}</div>

              <div className="text-right">
                <Link
                  href={p.path.includes('[slug]') ? '/case-studies' : p.path}
                  target="_blank"
                  className="vv-button vv-button--ghost p-1.5"
                  title="Open live page"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

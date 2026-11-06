'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GrowthDeskHeader from '../../../../components/growth-desk/GrowthDeskHeader';
import {
  PenTool,
  Plus,
  Search,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { ContentDraft } from '../../../../lib/growthDeskStorage';

export default function GrowthDeskContentListPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/growth-desk/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDrafts(data.drafts);
      })
      .catch(console.error);
  }, []);

  const handleCreateNew = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/growth-desk/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Editorial Article Draft',
          category: 'Paid Media & Growth'
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/admin/growth-desk/content/${data.draft.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = drafts.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <GrowthDeskHeader
        currentModule="Content Studio"
        subtitle="Write, refine, audit and optimize high-authority articles with AI"
        actions={
          <button
            onClick={handleCreateNew}
            disabled={loading}
            className="vv-button-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            {loading ? 'Creating...' : 'New Article Draft'}
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs font-mono font-bold uppercase text-[var(--muted)]">
          Article Drafts & Productions ({filtered.length})
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search article titles..."
            className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-hidden focus:ring-1 focus:ring-[#ED463B]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="vv-card p-5 flex flex-col justify-between hover:border-[var(--muted)] transition-all space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface-2)] text-[var(--muted)] font-semibold">
                  {d.category}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    d.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : d.status === 'Ready for Approval' || d.status === 'Awaiting Approval'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                  }`}
                >
                  ● {d.status}
                </span>
              </div>

              <Link
                href={`/admin/growth-desk/content/${d.id}`}
                className="text-base font-bold text-[var(--ink)] hover:text-[#ED463B] transition-colors line-clamp-2 block"
              >
                {d.title}
              </Link>

              <p className="text-xs text-[var(--muted)] line-clamp-2">
                {d.summary}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-[var(--line)]">
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                <span>{d.wordCount} words • {d.readingTime}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Score: {d.audit?.overallScore || 90}/100
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/admin/growth-desk/content/${d.id}`}
                  className="vv-button-secondary w-full py-1.5 text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Open in Content Studio
                </Link>
                {d.status === 'Published' && (
                  <a
                    href={`/blog/${d.publishedSlug || d.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-[var(--line)] hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]"
                    title="View live article"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit,
  ExternalLink,
  Upload,
  Calendar,
  Tag,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  Save,
  Send,
} from 'lucide-react';
import { BlogPost } from '../../../data/blogs';

export default function BlogManagerPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Draft' | 'Scheduled'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editor modal state
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [editorTab, setEditorTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchBlogs = () => {
    setLoading(true);
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching blogs:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const categories = useMemo(() => {
    const set = new Set(blogs.map((b) => b.category).filter(Boolean));
    return Array.from(set);
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      if (statusFilter !== 'all' && (b.status || 'Published') !== statusFilter) return false;
      if (categoryFilter !== 'all' && b.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (b.title || '').toLowerCase().includes(q);
        const slugMatch = (b.slug || '').toLowerCase().includes(q);
        const catMatch = (b.category || '').toLowerCase().includes(q);
        if (!titleMatch && !slugMatch && !catMatch) return false;
      }
      return true;
    });
  }, [blogs, statusFilter, categoryFilter, searchQuery]);

  // Open editor for a new article
  const handleNewPost = () => {
    setIsNew(true);
    setEditingPost({
      title: '',
      slug: '',
      category: 'Performance Marketing',
      status: 'Draft',
      publishDate: new Date().toISOString().split('T')[0],
      readingTime: '5 min read',
      featured: false,
      coverImage: '/vedant_editorial.jpg',
      summary: '',
      content: '',
      tags: ['Strategy', 'Performance', 'Growth'],
      author: {
        name: 'Vedant Tiwari',
        role: 'Performance Marketing Executive',
        avatar: '/vedant_editorial.jpg',
      },
      seoMeta: {
        title: '',
        description: '',
        keywords: ['Performance Marketing', 'VedantVerse'],
      },
      views: 0,
    });
    setEditorTab('content');
  };

  // Open editor for existing article
  const handleEditPost = (postSummary: any) => {
    setIsNew(false);
    fetch(`/api/blog?slug=${postSummary.slug}`)
      .then((res) => res.json())
      .then((fullData) => {
        setEditingPost(fullData);
        setEditorTab('content');
      })
      .catch(() => {
        setEditingPost(postSummary);
        setEditorTab('content');
      });
  };

  // Delete article
  const handleDeletePost = (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    fetch(`/api/blog?slug=${slug}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        showToast('Article deleted successfully');
        fetchBlogs();
      })
      .catch((err) => alert('Error deleting post: ' + err.message));
  };

  // Save / Publish
  const handleSave = (publishNow = false) => {
    if (!editingPost.title || !editingPost.slug) {
      alert('Please provide both Title and Slug.');
      return;
    }

    setSaving(true);
    const postToSave = {
      ...editingPost,
      status: publishNow ? 'Published' : editingPost.status || 'Draft',
      publishDate: publishNow && editingPost.status !== 'Published' ? new Date().toISOString().split('T')[0] : editingPost.publishDate,
    };

    fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postToSave),
    })
      .then((res) => res.json())
      .then(() => {
        setSaving(false);
        setEditingPost(null);
        showToast(publishNow ? 'Article published live to website!' : 'Draft saved successfully.');
        fetchBlogs();
      })
      .catch((err) => {
        setSaving(false);
        alert('Error saving article: ' + err.message);
      });
  };

  // Handle image upload for featured cover
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setEditingPost((prev: any) => ({ ...prev, coverImage: data.url }));
        showToast('Featured image uploaded!');
      }
    } catch (err) {
      alert('Failed to upload image');
    }
  };

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
            CONTENT • EDITORIAL SYSTEM
          </div>
          <h1 className="vv-h1">Blog Manager</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
            Create, schedule, draft, and publish high-ranking thought leadership articles directly to the live VedantVerse blog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            target="_blank"
            className="vv-button vv-button--secondary"
            title="Open live blog in new tab"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View live blog</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>
          <button onClick={handleNewPost} className="vv-button vv-button--primary">
            <Plus className="w-4 h-4" />
            <span>New post</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar (From Figma Reference) */}
      <div className="vv-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search posts by title, slug, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="vv-input pl-10"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'Published', 'Draft', 'Scheduled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[var(--ink)] text-white dark:bg-white dark:text-black'
                  : 'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {st === 'all' ? 'All statuses' : st}
            </button>
          ))}

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="vv-input py-1.5 text-xs w-auto min-h-0"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Blog Posts Table (Figma Design) */}
      <div className="vv-card overflow-hidden">
        <div className="vv-table-head grid-cols-[1.5fr_140px_110px_140px_90px]">
          <span>TITLE &amp; SLUG</span>
          <span>CATEGORY</span>
          <span>STATUS</span>
          <span>UPDATED / DATE</span>
          <span className="text-right">ACTIONS</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[var(--muted)]">
            Loading articles...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[var(--muted)]">
            No blog articles found matching your criteria.
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)]">
            {filteredBlogs.map((b) => {
              const status = b.status || 'Published';
              return (
                <div
                  key={b.slug}
                  className="vv-table-row grid-cols-[1.5fr_140px_110px_140px_90px] cursor-pointer"
                  onClick={() => handleEditPost(b)}
                >
                  {/* Title & Slug */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid h-10 w-12 shrink-0 place-items-center rounded-lg bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]">
                      <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[var(--ink)] truncate">
                        {b.title}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--muted)] truncate mt-0.5">
                        /blog/{b.slug}
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-xs text-[var(--muted)] font-medium truncate">
                    {b.category || 'General'}
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span className={`vv-badge ${
                      status === 'Published'
                        ? 'vv-badge--success'
                        : status === 'Draft'
                        ? 'vv-badge--warning'
                        : 'vv-badge--accent'
                    }`}>
                      {status}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="text-xs font-mono text-[var(--muted)] truncate">
                    {b.publishDate || 'Recent'}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/blog/${b.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-2)]"
                      title="View public article"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleEditPost(b)}
                      className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] cursor-pointer"
                      title="Edit article"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(b.slug, b.title)}
                      className="p-1.5 rounded-lg text-[var(--muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                      title="Delete article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Article Editor Drawer / Modal ── */}
      {editingPost && (
        <div className="vv-modal-backdrop">
          <div className="vv-modal max-w-4xl max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] p-5 shrink-0">
              <div className="flex items-center gap-3">
                <span className={`vv-badge ${
                  editingPost.status === 'Published' ? 'vv-badge--success' : 'vv-badge--warning'
                }`}>
                  {editingPost.status || 'Draft'}
                </span>
                <div>
                  <h3 className="text-base font-bold text-[var(--ink)]">
                    {isNew ? 'Create New Blog Post' : `Edit: ${editingPost.title || 'Untitled'}`}
                  </h3>
                  <p className="text-[11px] text-[var(--muted)] font-mono">
                    Changes sync immediately with the live website upon publishing
                  </p>
                </div>
              </div>
              <button onClick={() => setEditingPost(null)} className="vv-icon-button">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-6 px-6 pt-3 border-b border-[var(--line)] shrink-0 bg-[var(--surface-2)]/40 font-mono text-xs">
              {(['content', 'seo', 'settings'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setEditorTab(t)}
                  className={`pb-2.5 font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
                    editorTab === t
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {t === 'content' ? '01 // Content & Layout' : t === 'seo' ? '02 // SEO & Social' : '03 // Publishing Settings'}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {editorTab === 'content' && (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        ARTICLE TITLE *
                      </label>
                      <input
                        type="text"
                        value={editingPost.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingPost((prev: any) => ({
                            ...prev,
                            title: val,
                            slug: isNew ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
                          }));
                        }}
                        placeholder="e.g. Scaling D2C Brand Revenue with Meta CAPI"
                        className="vv-input font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        URL SLUG *
                      </label>
                      <input
                        type="text"
                        value={editingPost.slug}
                        onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                        placeholder="e.g. scaling-d2c-brand-revenue"
                        className="vv-input font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        CATEGORY
                      </label>
                      <input
                        type="text"
                        value={editingPost.category}
                        onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                        placeholder="e.g. Strategy, Meta Ads, B2B Logistics"
                        className="vv-input"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        READING TIME
                      </label>
                      <input
                        type="text"
                        value={editingPost.readingTime || '5 min read'}
                        onChange={(e) => setEditingPost({ ...editingPost, readingTime: e.target.value })}
                        className="vv-input"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        STATUS
                      </label>
                      <select
                        value={editingPost.status || 'Draft'}
                        onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value })}
                        className="vv-input"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                        <option value="Scheduled">Scheduled</option>
                      </select>
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                      FEATURED COVER IMAGE
                    </label>
                    <div className="flex items-center gap-4">
                      {editingPost.coverImage && (
                        <div className="relative w-28 aspect-video rounded-lg overflow-hidden border border-[var(--line)] bg-[var(--surface-2)]">
                          <img src={editingPost.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editingPost.coverImage || ''}
                          onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                          placeholder="/vedant_editorial.jpg or URL"
                          className="vv-input text-xs font-mono mb-1.5"
                        />
                        <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-xs font-mono text-[var(--ink)] cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload new cover</span>
                          <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                      ARTICLE SUMMARY (EXCERPT)
                    </label>
                    <textarea
                      rows={3}
                      value={editingPost.summary || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                      placeholder="Concise 2-line summary shown on blog cards and search snippets..."
                      className="vv-input"
                    />
                  </div>

                  {/* Full Article Content */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)]">
                        ARTICLE BODY (MARKDOWN / HTML)
                      </label>
                      <span className="text-[10px] font-mono text-[var(--muted)]">
                        {editingPost.content?.length || 0} characters
                      </span>
                    </div>
                    <textarea
                      rows={14}
                      value={editingPost.content || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                      placeholder="Write your article body here in Markdown or HTML..."
                      className="vv-input font-mono text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {editorTab === 'seo' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <div className="text-[10px] font-mono font-bold uppercase text-[var(--accent)] mb-1">
                      SERP PREVIEW
                    </div>
                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 truncate">
                      {editingPost.seoMeta?.title || editingPost.title || 'Article Title'} | VedantVerse
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                      https://vedantverse.in/blog/{editingPost.slug || 'slug'}
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-1 line-clamp-2">
                      {editingPost.seoMeta?.description || editingPost.summary || 'Meta description preview snippet...'}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                      SEO META TITLE
                    </label>
                    <input
                      type="text"
                      value={editingPost.seoMeta?.title || ''}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          seoMeta: { ...editingPost.seoMeta, title: e.target.value },
                        })
                      }
                      placeholder="Target keyword title under 60 chars"
                      className="vv-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                      SEO META DESCRIPTION
                    </label>
                    <textarea
                      rows={3}
                      value={editingPost.seoMeta?.description || ''}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          seoMeta: { ...editingPost.seoMeta, description: e.target.value },
                        })
                      }
                      placeholder="Compelling click-through summary under 160 chars"
                      className="vv-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                      KEYWORDS (COMMA SEPARATED)
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(editingPost.seoMeta?.keywords) ? editingPost.seoMeta.keywords.join(', ') : ''}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          seoMeta: {
                            ...editingPost.seoMeta,
                            keywords: e.target.value.split(',').map((k: string) => k.trim()),
                          },
                        })
                      }
                      placeholder="Meta Ads, Google Search, ROAS Scaling"
                      className="vv-input font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {editorTab === 'settings' && (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        AUTHOR NAME
                      </label>
                      <input
                        type="text"
                        value={editingPost.author?.name || 'Vedant Tiwari'}
                        onChange={(e) =>
                          setEditingPost({
                            ...editingPost,
                            author: { ...editingPost.author, name: e.target.value },
                          })
                        }
                        className="vv-input"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        AUTHOR ROLE
                      </label>
                      <input
                        type="text"
                        value={editingPost.author?.role || 'Performance Marketing Executive'}
                        onChange={(e) =>
                          setEditingPost({
                            ...editingPost,
                            author: { ...editingPost.author, role: e.target.value },
                          })
                        }
                        className="vv-input"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-2)]">
                    <input
                      type="checkbox"
                      id="feat-check"
                      checked={editingPost.featured || false}
                      onChange={(e) => setEditingPost({ ...editingPost, featured: e.target.checked })}
                      className="w-4 h-4 accent-[var(--accent)]"
                    />
                    <label htmlFor="feat-check" className="text-xs font-semibold cursor-pointer">
                      Mark as Featured Post (Pinned to Homepage &amp; Top of Blog Archive)
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Action Footer */}
            <div className="border-t border-[var(--line)] p-4 flex items-center justify-between shrink-0 bg-[var(--surface)]">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="vv-button vv-button--ghost"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(false)}
                  className="vv-button vv-button--secondary"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Draft'}</span>
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(true)}
                  className="vv-button vv-button--primary"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to Live Site</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="vv-toast">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)] font-bold text-xs">
            ✓
          </span>
          <div className="text-xs font-semibold text-[var(--ink)]">{toastMessage}</div>
        </div>
      )}
    </div>
  );
}


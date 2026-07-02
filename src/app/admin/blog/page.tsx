'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Trash2, Edit3, ArrowLeft, LogOut, CheckCircle, RefreshCw, Eye, Save } from 'lucide-react';
import ParticleBackground from '../../../components/ParticleBackground';

interface BlogPostSummary {
  title: string;
  slug: string;
  category: string;
  publishDate: string;
  featured: boolean;
  views: number;
}

export default function AdminBlogCMS() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Administrator' | 'Editor'>('Administrator');

  const [articles, setArticles] = useState<BlogPostSummary[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [coverImage, setCoverImage] = useState('/ref_image2.png');
  const [category, setCategory] = useState('Google Ads Originals');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Advanced');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('Google Ads, Media Buying');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('google ads, pmax');
  const [featured, setFeatured] = useState(false);

  const [statusMessage, setStatusMessage] = useState('');

  // Fetch blogs list
  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      if (res.ok) {
        setArticles(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchArticles();
    }
  }, [isLoggedIn]);

  // Sync slug on title change
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    const generatedSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'tiwarivedant705@gmail.com' && password === 'vedant123') {
      setIsLoggedIn(true);
      setStatusMessage('');
    } else if (email === 'editor@friend.com' && password === 'editor123') {
      setIsLoggedIn(true);
      setRole('Editor');
      setStatusMessage('');
    } else {
      setStatusMessage('Invalid marketing diagnostic credentials.');
    }
  };

  const handleEditClick = async (item: BlogPostSummary) => {
    try {
      const res = await fetch(`/api/blog?slug=${item.slug}`);
      const data = await res.json();
      if (res.ok) {
        setEditingArticle(data);
        setTitle(data.title);
        setSlug(data.slug);
        setCoverImage(data.coverImage);
        setCategory(data.category);
        setDifficulty(data.difficulty || 'Advanced');
        setSummary(data.summary);
        setTags(data.tags.join(', '));
        setContent(data.content);
        setSeoTitle(data.seoMeta.title);
        setSeoDesc(data.seoMeta.description);
        setSeoKeywords(data.seoMeta.keywords.join(', '));
        setFeatured(data.featured);
        setEditorOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateNew = () => {
    setEditingArticle(null);
    setTitle('');
    setSlug('');
    setCoverImage('/ref_image2.png');
    setCategory('Google Ads Originals');
    setDifficulty('Advanced');
    setSummary('');
    setTags('Google Ads, Strategy');
    setContent('');
    setSeoTitle('');
    setSeoDesc('');
    setSeoKeywords('google ads');
    setFeatured(false);
    setEditorOpen(true);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      slug,
      coverImage,
      category,
      difficulty,
      summary,
      tags: tags.split(',').map((t) => t.trim()),
      content,
      seoMeta: {
        title: seoTitle || `${title} | VedantVerse`,
        description: seoDesc || summary,
        keywords: seoKeywords.split(',').map((k) => k.trim()),
      },
      featured,
      author: {
        name: 'Vedant Tiwari',
        role: 'Growth Marketer',
        avatar: '/vedant_portrait.png',
      },
      readingTime: `${Math.max(3, Math.ceil(content.split(/\s+/).length / 200))} Min`,
      publishDate: editingArticle ? editingArticle.publishDate : new Date().toISOString().split('T')[0],
      views: editingArticle ? editingArticle.views : 1,
    };

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMessage('Blockbuster article published to disk successfully!');
        setEditorOpen(false);
        fetchArticles();
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        const err = await res.json();
        setStatusMessage(`Error: ${err.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Network configuration error publishing.');
    }
  };

  const handleDelete = async (slugToDelete: string) => {
    if (role !== 'Administrator') {
      alert('Forbidden: Only Administrators can delete entries.');
      return;
    }
    if (!confirm('Are you sure you want to delete this campaign breakdown? This cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/blog?slug=${slugToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage('Article removed from disk successfully.');
        fetchArticles();
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        alert('Failed to delete file.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden select-none font-sans flex flex-col justify-center items-center px-4">
      <ParticleBackground />
      <div className="vignette-overlay" />
      <div className="noise-overlay" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-40">
        <Link href="/blog" className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white uppercase">
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
      </div>

      {/* LOGIN PANEL */}
      {!isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md bg-[#080808]/90 border border-neutral-900 rounded-xl p-8 shadow-2xl backdrop-blur-md"
        >
          <div className="text-center mb-8">
            <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.2em] font-mono block mb-2">
              SECURITY ACCESS HUD
            </span>
            <h2 className="text-2xl font-black uppercase text-white tracking-tight">
              VedantVerse CMS
            </h2>
            <p className="text-neutral-500 text-xs mt-1">
              Enter diagnostic parameters to publish strategy files.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">Email Coordinate</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#E50914]/80 transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">Access Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#E50914]/80 transition-colors"
                required
              />
            </div>

            {statusMessage && (
              <p className="text-xs text-red-500 font-mono text-center">
                {statusMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-4 py-3.5 bg-[#E50914] hover:bg-[#b20710] text-white font-bold text-xs uppercase rounded cursor-pointer transition-colors shadow-[0_0_15px_rgba(229,9,20,0.35)]"
            >
              Verify Security Profile
            </button>
          </form>
        </motion.div>
      )}

      {/* DASHBOARD VIEW */}
      {isLoggedIn && !editorOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 w-full max-w-5xl bg-[#080808]/90 border border-neutral-900 rounded-xl p-8 shadow-2xl backdrop-blur-md text-left"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-6 mb-6">
            <div>
              <span className="text-[#E50914] text-[10px] font-bold uppercase tracking-[0.25em] font-mono block mb-1">
                CMS CONTROL CONSOLE
              </span>
              <h2 className="text-3xl font-black uppercase text-white tracking-tight">
                Blockbuster Catalog Manager
              </h2>
              <p className="text-neutral-500 text-xs">
                Logged in as <span className="text-white font-bold font-mono">{role}</span> ({email})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-[#E50914] text-white font-bold text-xs px-5 py-3.5 rounded hover:bg-[#b20710] cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                CREATE RELEASE
              </button>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white font-bold text-xs px-4 py-3.5 rounded cursor-pointer transition-all"
              >
                <LogOut className="w-4 h-4" />
                EXIT
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="mb-4 p-4 bg-red-950/20 border border-red-500/10 rounded-lg text-xs font-mono text-red-500 animate-pulse">
              {statusMessage}
            </div>
          )}

          {/* Catalog Table */}
          <div className="overflow-x-auto border border-neutral-900 rounded-lg">
            <table className="w-full text-xs font-mono text-neutral-400">
              <thead className="bg-[#0b0b0b] text-neutral-500 border-b border-neutral-900">
                <tr>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Release Title</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Release Date</th>
                  <th className="px-6 py-4 text-center font-bold uppercase tracking-wider">Featured</th>
                  <th className="px-6 py-4 text-center font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 bg-black/40">
                {articles.map((item) => (
                  <tr key={item.slug} className="hover:bg-neutral-900/25 transition-colors">
                    <td className="px-6 py-4 font-bold text-white max-w-xs truncate">{item.title}</td>
                    <td className="px-6 py-4 text-neutral-500">{item.category}</td>
                    <td className="px-6 py-4">{item.publishDate}</td>
                    <td className="px-6 py-4 text-center">
                      {item.featured ? (
                        <span className="text-green-500 text-[10px] font-bold bg-green-950/20 border border-green-900/30 px-2.5 py-0.5 rounded">
                          YES
                        </span>
                      ) : (
                        <span className="text-neutral-600 text-[10px] bg-neutral-950/20 border border-neutral-900 px-2 py-0.5 rounded">
                          NO
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 text-neutral-400 hover:text-white rounded border border-neutral-800 hover:border-neutral-700 cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.slug)}
                          className="p-2 text-red-500/80 hover:text-red-500 rounded border border-neutral-800 hover:border-red-900/30 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                      No strategy releases found in data storage catalog.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* WRITER / EDITOR VIEW */}
      {isLoggedIn && editorOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-5xl bg-[#080808]/95 border border-neutral-900 rounded-xl p-8 shadow-2xl backdrop-blur-md text-left"
        >
          <div className="flex items-center justify-between border-b border-neutral-900 pb-6 mb-6">
            <div>
              <span className="text-[#E50914] text-[10px] font-bold uppercase tracking-[0.25em] font-mono block mb-1">
                MARKETING CREATIVE EDITOR
              </span>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                {editingArticle ? `Edit: ${editingArticle.title}` : 'Create Brand Strategy Release'}
              </h2>
            </div>
            <button
              onClick={() => setEditorOpen(false)}
              className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-mono uppercase cursor-pointer rounded"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handlePublish} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side: Main Fields */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">Strategy Title</label>
                <input
                  type="text"
                  placeholder="e.g. Google Ads Performance Max Guide"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#E50914]/80 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">Release Slug (Auto-generated)</label>
                <input
                  type="text"
                  placeholder="google-ads-performance-max-guide"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#E50914]/80 transition-colors"
                  required
                  disabled={!!editingArticle}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#E50914]/80 transition-colors"
                  >
                    <option value="Google Ads Originals">Google Ads Originals</option>
                    <option value="Meta Ads Collection">Meta Ads Collection</option>
                    <option value="Campaign Breakdowns">Campaign Breakdowns</option>
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Ultimate Guides">Ultimate Guides</option>
                    <option value="Case Studies">Case Studies</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#E50914]/80 transition-colors"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">Cover Image URL</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#E50914]/80 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">Blockbuster Summary</label>
                <textarea
                  placeholder="e.g. Master Performance Max campaigns with this strategy guide..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#E50914]/80 transition-colors resize-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Google Ads, Strategy, Media Buying"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#E50914]/80 transition-colors"
                />
              </div>
            </div>

            {/* Right side: Editor Content, SEO Metadata & Switches */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">Article Content (Markdown)</label>
                <textarea
                  placeholder="# Enter your header scene... \n\n Write strategy content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#E50914]/80 transition-colors resize-none flex-1 min-h-[220px]"
                  required
                />
              </div>

              {/* SEO Sub-section */}
              <div className="bg-[#0b0b0b] border border-neutral-900 rounded-lg p-4 space-y-3">
                <span className="text-[9px] text-[#E50914] font-bold uppercase tracking-widest font-mono block">
                  ★ Search Optimization Settings (SEO)
                </span>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">SEO Title Tag</label>
                  <input
                    type="text"
                    placeholder="google-ads-guide"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="px-3 py-2 bg-black border border-neutral-800 rounded text-[11px] font-mono text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">SEO Description Meta</label>
                  <input
                    type="text"
                    placeholder="description tag..."
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    className="px-3 py-2 bg-black border border-neutral-800 rounded text-[11px] font-mono text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">Focus Keywords (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="google, ads, pmax"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    className="px-3 py-2 bg-black border border-neutral-800 rounded text-[11px] font-mono text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 bg-black border border-neutral-800 text-[#E50914] focus:ring-0 focus:ring-offset-0 rounded cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-[11px] font-mono text-neutral-400 cursor-pointer">
                    Set as Featured Blockbuster Release
                  </label>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#E50914] hover:bg-[#b20710] text-white font-bold text-xs uppercase px-6 py-3.5 rounded cursor-pointer transition-colors"
                >
                  <Save className="w-4 h-4" />
                  PUBLISH TO DISK
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}

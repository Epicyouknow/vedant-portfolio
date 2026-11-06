'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import GrowthDeskHeader from '../../../../../components/growth-desk/GrowthDeskHeader';
import {
  Save,
  Eye,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2,
  ExternalLink,
  ChevronRight,
  List,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Quote,
  Link2,
  Code,
  Image as ImageIcon,
  Check,
  Copy,
  Plus,
  RefreshCw,
  Search,
  BookOpen
} from 'lucide-react';
import { ContentDraft } from '../../../../../lib/growthDeskStorage';

export default function ContentStudioEditorPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const [draft, setDraft] = useState<ContentDraft | null>(null);
  const [activeTab, setActiveTab] = useState<'Write' | 'Outline' | 'Research' | 'SEO & AEO' | 'Media'>('Write');
  const [auditSubTab, setAuditSubTab] = useState<'Detail View' | 'Keywords' | 'FAQs' | 'Structured Data'>('Detail View');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState('');
  const [aiActionName, setAiActionName] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);

  const fetchDraft = () => {
    fetch(`/api/growth-desk/content?id=${contentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.draft) {
          const d: ContentDraft = data.draft;
          setDraft(d);
          setTitle(d.title);
          setSlug(d.slug);
          setContent(d.content);
          setMetaTitle(d.seoMeta?.title || '');
          setMetaDesc(d.seoMeta?.description || '');
          setKeywords(d.seoMeta?.keywords || []);
          setFaqs(d.faq || []);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchDraft();
  }, [contentId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/growth-desk/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: contentId,
          title,
          slug,
          content,
          seoMeta: {
            title: metaTitle,
            description: metaDesc,
            keywords
          },
          faq: faqs
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage('Saved successfully');
        setTimeout(() => setSaveMessage(''), 2500);
        // Refresh audit after save
        handleRunAudit();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleRunAudit = async () => {
    try {
      const res = await fetch('/api/growth-desk/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: contentId,
          title,
          content,
          seoMeta: { title: metaTitle, description: metaDesc },
          faq: faqs
        })
      });
      const data = await res.json();
      if (data.success && draft) {
        setDraft({ ...draft, audit: data.audit });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAiAction = async (action: string) => {
    setAiLoading(true);
    setAiActionName(action);
    setAiOutput('');
    try {
      const res = await fetch('/api/growth-desk/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          id: contentId,
          content: content.slice(0, 3000),
          title
        })
      });
      const data = await res.json();
      if (data.success) {
        if (action === 'create-faq' && data.faq) {
          setFaqs([...faqs, ...data.faq]);
          setAiOutput(`Generated ${data.faq.length} FAQs and added to FAQ list:\n\n` + data.faq.map((f: any) => `**Q: ${f.question}**\nA: ${f.answer}`).join('\n\n'));
        } else if (action === 'suggest-links' && data.links) {
          setAiOutput('Suggested Internal Links:\n\n' + data.links.map((l: any) => `- [${l.text}](${l.url}) — *${l.reason}*`).join('\n'));
        } else if (action === 'generate-summary' && data.summary) {
          setAiOutput(`Generated Summary:\n\n${data.summary}`);
        } else {
          setAiOutput(data.result || 'AI action completed.');
        }
      }
    } catch (err) {
      console.error(err);
      setAiOutput('An error occurred while executing the AI writing action.');
    } finally {
      setAiLoading(false);
    }
  };

  const insertTextAtCursor = (textToInsert: string) => {
    setContent((prev) => prev + '\n\n' + textToInsert);
  };

  const insertToolbarTag = (prefix: string, suffix: string = '') => {
    setContent((prev) => prev + `\n${prefix} ` + suffix);
  };

  if (!draft) {
    return (
      <div className="space-y-6">
        <GrowthDeskHeader currentModule="Content Studio" />
        <div className="vv-card p-12 text-center text-xs font-mono text-[var(--muted)]">
          Loading editorial workspace...
        </div>
      </div>
    );
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = `${Math.max(1, Math.ceil(wordCount / 250))} min read`;

  return (
    <div className="space-y-6">
      <GrowthDeskHeader
        currentModule="Content Studio"
        subtitle="Write, refine and optimize high-authority articles with AI"
        actions={
          <div className="flex items-center gap-2">
            {saveMessage && (
              <span className="text-xs font-mono text-emerald-600 font-semibold animate-pulse">
                {saveMessage}
              </span>
            )}
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="vv-button-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              {previewMode ? 'Editor View' : 'Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="vv-button-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        }
      />

      {/* Title & Slug Header Inputs */}
      <div className="vv-card p-4 space-y-3">
        <div>
          <label className="text-[10px] font-mono uppercase text-[var(--muted)] font-bold block mb-1">
            Article Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-base sm:text-lg font-bold text-[var(--ink)] bg-transparent border-b border-[var(--line)] pb-1 focus:outline-hidden focus:border-[#ED463B]"
            placeholder="Enter article title..."
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <span>Slug:</span>
            <span className="text-[var(--ink)] font-semibold">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-[var(--surface-2)] border border-[var(--line)] rounded-md px-2 py-0.5 text-xs text-[var(--ink)] font-mono"
            />
          </div>

          <div className="flex items-center gap-4">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{readingTime}</span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">
              Score: {draft.audit?.overallScore || 90}/100
            </span>
          </div>
        </div>
      </div>

      {/* Two Columns: Left Editor & Sub-tabs (8 cols) | Right AI Assistant (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Content Tabs & Editor Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Subtabs Bar */}
          <div className="flex items-center gap-1 border-b border-[var(--line)] pb-2 overflow-x-auto scrollbar-none">
            {(['Write', 'Outline', 'Research', 'SEO & AEO', 'Media'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-[var(--ink)] text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB 1: WRITE */}
          {activeTab === 'Write' && (
            <div className="vv-card p-4 space-y-3">
              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--line)] text-xs text-[var(--ink)]">
                <button
                  type="button"
                  onClick={() => insertToolbarTag('## ')}
                  className="p-1.5 rounded-sm hover:bg-[var(--surface)] hover:text-[#ED463B]"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToolbarTag('### ')}
                  className="p-1.5 rounded-sm hover:bg-[var(--surface)] hover:text-[#ED463B]"
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-[var(--line)] mx-1" />
                <button
                  type="button"
                  onClick={() => insertToolbarTag('**Bold Text**')}
                  className="p-1.5 rounded-sm hover:bg-[var(--surface)]"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToolbarTag('*Italic Text*')}
                  className="p-1.5 rounded-sm hover:bg-[var(--surface)]"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToolbarTag('> ')}
                  className="p-1.5 rounded-sm hover:bg-[var(--surface)]"
                  title="Quote Callout"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToolbarTag('- ')}
                  className="p-1.5 rounded-sm hover:bg-[var(--surface)]"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertToolbarTag('```javascript\n// code\n```')}
                  className="p-1.5 rounded-sm hover:bg-[var(--surface)]"
                  title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </button>
                <div className="ml-auto text-[11px] font-mono text-[var(--muted)]">
                  Markdown Enabled
                </div>
              </div>

              {/* Textarea or Preview */}
              {previewMode ? (
                <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--line)] min-h-[500px] prose dark:prose-invert max-w-none text-xs leading-relaxed space-y-4">
                  <div className="whitespace-pre-wrap">{content}</div>
                </div>
              ) : (
                <textarea
                  rows={24}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Draft your long-form article here in clean markdown..."
                  className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4 text-xs sm:text-sm font-mono text-[var(--ink)] leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-[#ED463B] resize-y"
                />
              )}
            </div>
          )}

          {/* TAB 2: OUTLINE */}
          {activeTab === 'Outline' && (
            <div className="vv-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <h3 className="text-sm font-bold text-[var(--ink)] font-mono uppercase">
                  Article Outline & Hierarchy
                </h3>
                <span className="text-xs font-mono text-[var(--muted)]">
                  {draft.outline?.length || 0} Key Sections
                </span>
              </div>

              <div className="space-y-3">
                {draft.outline?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[var(--surface)] text-[var(--muted)]">
                        H{item.level}
                      </span>
                      <span className="text-xs font-bold text-[var(--ink)]">
                        {item.heading}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted)] pl-8">
                      {item.notes}
                    </p>
                    {item.evidenceClaim && (
                      <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 pl-8 pt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified: {item.evidenceClaim}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RESEARCH & CITATIONS */}
          {activeTab === 'Research' && (
            <div className="vv-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <h3 className="text-sm font-bold text-[var(--ink)] font-mono uppercase">
                  Linked Research Sources
                </h3>
                <Link
                  href="/admin/growth-desk/research"
                  className="text-xs font-semibold text-[#ED463B] hover:underline flex items-center gap-1"
                >
                  View Research Library
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--ink)]">
                      Meta Conversions API Developer Specification (v21.0)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-bold">
                      VERIFIED (98%)
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)]">
                    Official specification detailing event_id hashing algorithms and required user_data parameter schemas.
                  </p>
                  <a
                    href="https://developers.facebook.com/docs/marketing-api/conversions-api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#ED463B] font-mono flex items-center gap-1 hover:underline"
                  >
                    https://developers.facebook.com/docs/marketing-api/conversions-api
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--ink)]">
                      Shopify Maximum Data Sharing & CAPI Architecture Guide
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-bold">
                      VERIFIED (92%)
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)]">
                    Details direct integration pathways between Shopify checkout and Meta Business Manager.
                  </p>
                  <a
                    href="https://help.shopify.com/en/manual/promoting-marketing/customer-retention/facebook-data-sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#ED463B] font-mono flex items-center gap-1 hover:underline"
                  >
                    https://help.shopify.com/en/manual/...
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO, AEO & GEO AUDIT (SCREEN 5!) */}
          {activeTab === 'SEO & AEO' && (
            <div className="space-y-6">
              {/* Circular Gauge & Audit Overview (Matching Screen 5 Mockup) */}
              <div className="vv-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Quality Score Gauge (4 cols) */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      {/* SVG Gauge */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[var(--line)]"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-500"
                          strokeDasharray={`${draft.audit?.overallScore || 92}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-black text-[var(--ink)]">
                          {draft.audit?.overallScore || 92}
                        </span>
                        <span className="text-[9px] font-mono uppercase text-[var(--muted)]">/ 100</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[var(--ink)] mt-2 font-mono">
                      Content Quality
                    </span>
                  </div>

                  {/* Right: Key Checklist (8 cols) */}
                  <div className="md:col-span-8 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {draft.audit?.checks?.map((chk, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-semibold text-[var(--ink)] truncate">
                              {chk.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Key Recommendations Box (Screen 5) */}
                    <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-50/40 dark:bg-amber-950/20 mt-3 space-y-1.5">
                      <div className="text-xs font-bold text-amber-900 dark:text-amber-300 font-mono flex items-center justify-between">
                        <span>Key Recommendations ({draft.audit?.recommendations?.length || 3})</span>
                        <button
                          onClick={handleRunAudit}
                          className="text-[10px] text-[#ED463B] font-semibold hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Re-run Audit
                        </button>
                      </div>
                      <ol className="text-xs text-[var(--ink)] list-decimal pl-4 space-y-1">
                        {draft.audit?.recommendations?.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtabs Below (Detail View, Keywords, FAQs, Structured Data) */}
              <div className="vv-card p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2 overflow-x-auto">
                  {(['Detail View', 'Keywords', 'FAQs', 'Structured Data'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAuditSubTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        auditSubTab === tab
                          ? 'bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line)] font-bold'
                          : 'text-[var(--muted)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {auditSubTab === 'Detail View' && (
                  <div className="vv-table-container">
                    <div className="vv-table-head grid-cols-12 text-[10px] font-mono uppercase font-bold">
                      <div className="col-span-3">Area</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-7">Details</div>
                    </div>
                    <div className="divide-y divide-[var(--line)] text-xs">
                      {draft.audit?.checks?.map((chk, i) => (
                        <div key={i} className="vv-table-row grid-cols-12 py-3 items-center">
                          <div className="col-span-3 font-semibold text-[var(--ink)]">
                            {chk.name}
                          </div>
                          <div className="col-span-2 font-mono text-[11px] text-emerald-600 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Passed
                          </div>
                          <div className="col-span-7 text-[var(--muted)]">
                            {chk.details}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {auditSubTab === 'Keywords' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-[var(--surface-2)]">
                      <span className="font-bold text-[var(--ink)]">Primary Keyword:</span>{' '}
                      <span className="font-mono text-[#ED463B] font-semibold">{draft.audit?.primaryKeyword}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--surface-2)]">
                      <span className="font-bold text-[var(--ink)]">Related Semantic Entities:</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {draft.audit?.relatedKeywords?.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--line)] text-xs font-mono">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {auditSubTab === 'FAQs' && (
                  <div className="space-y-3">
                    {faqs.map((f, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-xs space-y-1">
                        <div className="font-bold text-[var(--ink)] flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-[#ED463B]" />
                          {f.question}
                        </div>
                        <div className="text-[var(--muted)] pl-5">{f.answer}</div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAiAction('create-faq')}
                      className="vv-button-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Generate FAQs with AI
                    </button>
                  </div>
                )}

                {auditSubTab === 'Structured Data' && (
                  <div className="p-4 rounded-xl bg-[var(--surface-2)] font-mono text-xs text-[var(--ink)] overflow-x-auto">
                    <pre>{JSON.stringify({
                      '@context': 'https://schema.org',
                      '@type': 'TechArticle',
                      'headline': title,
                      'author': {
                        '@type': 'Person',
                        'name': 'Vedant Tiwari',
                        'url': 'https://vedantverse.in'
                      },
                      'keywords': keywords.join(', ')
                    }, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA */}
          {activeTab === 'Media' && (
            <div className="vv-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-[var(--ink)] font-mono uppercase">
                Visual Assets & Cover Image
              </h3>
              <div className="p-6 border-2 border-dashed border-[var(--line)] rounded-xl text-center space-y-2">
                <ImageIcon className="w-8 h-8 text-[var(--muted)] mx-auto" />
                <div className="text-xs font-semibold text-[var(--ink)]">
                  Primary Cover Image / Technical Diagram
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  Suggested schema: 1200x630px high-contrast editorial graphic
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: AI Writing Assistant Sidebar (4 cols) (Screen 4 Sidebar) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="vv-card p-4 space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#ED463B]/10 grid place-items-center text-[#ED463B]">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[var(--ink)] font-mono uppercase">
                  AI Writing Assistant
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-bold">
                Active
              </span>
            </div>

            {/* Quick Prompt Action Buttons (Screen 4) */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-[var(--muted)] font-bold">
                Editorial Transformation
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAiAction('rewrite')}
                  disabled={aiLoading}
                  className="p-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--ink)] text-left text-xs font-medium text-[var(--ink)] transition-colors"
                >
                  Rewrite
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAction('expand')}
                  disabled={aiLoading}
                  className="p-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--ink)] text-left text-xs font-medium text-[var(--ink)] transition-colors"
                >
                  Expand
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAction('shorten')}
                  disabled={aiLoading}
                  className="p-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--ink)] text-left text-xs font-medium text-[var(--ink)] transition-colors"
                >
                  Shorten
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAction('improve-seo')}
                  disabled={aiLoading}
                  className="p-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--ink)] text-left text-xs font-medium text-[var(--ink)] transition-colors"
                >
                  Improve SEO/GEO
                </button>
              </div>

              <div className="pt-2 space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleAiAction('create-faq')}
                  disabled={aiLoading}
                  className="w-full p-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--ink)] text-left text-xs font-medium text-[var(--ink)] transition-colors flex items-center justify-between"
                >
                  <span>Create FAQ Schema</span>
                  <HelpCircle className="w-3.5 h-3.5 text-[var(--muted)]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAction('suggest-links')}
                  disabled={aiLoading}
                  className="w-full p-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--ink)] text-left text-xs font-medium text-[var(--ink)] transition-colors flex items-center justify-between"
                >
                  <span>Suggest Internal Links</span>
                  <Link2 className="w-3.5 h-3.5 text-[var(--muted)]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAction('generate-summary')}
                  disabled={aiLoading}
                  className="w-full p-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--ink)] text-left text-xs font-medium text-[var(--ink)] transition-colors flex items-center justify-between"
                >
                  <span>Generate Summary</span>
                  <Share2 className="w-3.5 h-3.5 text-[var(--muted)]" />
                </button>
              </div>
            </div>

            {/* AI Assistant Output Area */}
            <div className="pt-3 border-t border-[var(--line)] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[var(--muted)] font-bold">
                <span>Assistant Output</span>
                {aiActionName && <span className="text-[#ED463B]">{aiActionName}</span>}
              </div>

              {aiLoading ? (
                <div className="p-4 rounded-xl bg-[var(--surface-2)] text-center text-xs font-mono text-[var(--muted)] animate-pulse">
                  Processing with AI engine...
                </div>
              ) : aiOutput ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] text-xs text-[var(--ink)] whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed border border-[var(--line)] font-mono">
                    {aiOutput}
                  </div>
                  <button
                    type="button"
                    onClick={() => insertTextAtCursor(aiOutput)}
                    className="vv-button-secondary w-full py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Insert into Editor
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[var(--surface-2)] text-center text-[11px] text-[var(--muted)]">
                  Click any action above to generate, refine or format article sections.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

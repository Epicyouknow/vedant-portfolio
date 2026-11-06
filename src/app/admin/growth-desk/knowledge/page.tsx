'use client';

import React, { useState, useEffect } from 'react';
import GrowthDeskHeader from '../../../../components/growth-desk/GrowthDeskHeader';
import {
  Folder,
  FileText,
  Plus,
  Search,
  CheckCircle2,
  ShieldCheck,
  Edit,
  Trash2,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { KnowledgeFact, FactClassification } from '../../../../lib/growthDeskStorage';

export default function GrowthDeskKnowledgeBase() {
  const [facts, setFacts] = useState<KnowledgeFact[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFact, setSelectedFact] = useState<KnowledgeFact | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Experience' as const,
    classification: 'VERIFIED_EXPERIENCE' as FactClassification,
    summary: '',
    content: '',
    source: 'Verified Campaign Record',
    client: '',
    tags: 'Meta Ads, Google Ads'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchFacts = () => {
    fetch('/api/growth-desk/knowledge')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFacts(data.facts);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchFacts();
  }, []);

  const handleSaveFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        classification: formData.classification,
        summary: formData.summary || formData.title,
        content: formData.content,
        provenance: {
          source: formData.source,
          dateVerified: new Date().toISOString().split('T')[0],
          client: formData.client || undefined,
          notes: 'Submitted via Knowledge Base UI'
        },
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      };

      const res = await fetch('/api/growth-desk/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData({
          title: '',
          category: 'Experience',
          classification: 'VERIFIED_EXPERIENCE',
          summary: '',
          content: '',
          source: 'Verified Campaign Record',
          client: '',
          tags: 'Meta Ads, Google Ads'
        });
        fetchFacts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this knowledge fact?')) return;
    try {
      await fetch(`/api/growth-desk/knowledge?id=${id}`, { method: 'DELETE' });
      fetchFacts();
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['All', 'Experience', 'Case Studies', 'Frameworks', 'Tools', 'Documents'];

  const filteredFacts = facts.filter((f) => {
    const matchesCategory =
      activeCategory === 'All' || f.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getBadgeForClassification = (classification: FactClassification) => {
    switch (classification) {
      case 'VERIFIED_EXPERIENCE':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20">
            VERIFIED_EXPERIENCE
          </span>
        );
      case 'EXTERNAL_RESEARCH':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-500/20">
            EXTERNAL_RESEARCH
          </span>
        );
      case 'AI_ANALYSIS':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-500/20">
            AI_ANALYSIS
          </span>
        );
      case 'UNVERIFIED':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/20">
            UNVERIFIED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <GrowthDeskHeader
        currentModule="Knowledge Base"
        subtitle="Your verified experience, frameworks and approved facts that power the AI agent"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="vv-button-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Knowledge
          </button>
        }
      />

      {/* Filter Tabs & Search Bar (Screen 7) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === c
                  ? 'bg-[var(--ink)] text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                  : 'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified knowledge..."
            className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-hidden focus:ring-1 focus:ring-[#ED463B]"
          />
        </div>
      </div>

      {/* Knowledge Fact Cards Grid (Screen 7) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFacts.map((fact) => (
          <div
            key={fact.id}
            className="vv-card p-5 space-y-3 flex flex-col justify-between hover:border-[var(--muted)] transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--surface-2)] grid place-items-center text-[var(--ink)]">
                    <Folder className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--muted)] block">
                      {fact.category}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--ink)] leading-snug">
                      {fact.title}
                    </h3>
                  </div>
                </div>

                {getBadgeForClassification(fact.classification)}
              </div>

              <p className="text-xs text-[var(--muted)] line-clamp-3 leading-relaxed">
                {fact.content}
              </p>
            </div>

            {/* Provenance & Meta Footer */}
            <div className="space-y-2 pt-3 border-t border-[var(--line)] text-[11px] font-mono">
              <div className="flex items-center justify-between text-[var(--muted)]">
                <span>Source: {fact.provenance?.source}</span>
                <span>Verified: {fact.provenance?.dateVerified}</span>
              </div>

              {fact.provenance?.metrics && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {fact.provenance.metrics.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-bold"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-wrap gap-1">
                  {fact.tags.map((t) => (
                    <span key={t} className="text-[10px] text-[var(--muted)]">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(fact.id)}
                    className="p-1 rounded-md text-[var(--muted)] hover:text-red-600"
                    title="Archive fact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Knowledge */}
      {isModalOpen && (
        <div className="vv-modal-backdrop">
          <div className="vv-card w-full max-w-lg p-6 space-y-4 shadow-xl border-2 border-[var(--line)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-base font-bold text-[var(--ink)]">Add Verified Knowledge</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFact} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Title or Framework Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Meta Ads Creative Testing Matrix"
                  className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)] focus:outline-hidden focus:border-[#ED463B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)]"
                  >
                    <option value="Experience">Experience</option>
                    <option value="Case Studies">Case Studies</option>
                    <option value="Frameworks">Frameworks</option>
                    <option value="Tools">Tools</option>
                    <option value="Documents">Documents</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Classification
                  </label>
                  <select
                    value={formData.classification}
                    onChange={(e) => setFormData({ ...formData, classification: e.target.value as any })}
                    className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)]"
                  >
                    <option value="VERIFIED_EXPERIENCE">VERIFIED_EXPERIENCE</option>
                    <option value="EXTERNAL_RESEARCH">EXTERNAL_RESEARCH</option>
                    <option value="AI_ANALYSIS">AI_ANALYSIS</option>
                    <option value="UNVERIFIED">UNVERIFIED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Verified Fact Details / Operational Procedures
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Provide precise details, methods, benchmarks, and outcomes..."
                  className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)] focus:outline-hidden focus:border-[#ED463B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Source Provenance
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="e.g. Verified Client CRM / Ads Manager"
                    className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Client Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Cutistic Gifts, TravelKitSR"
                    className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="vv-button-primary px-4 py-2 text-xs font-bold"
                >
                  {submitting ? 'Saving...' : 'Add Knowledge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

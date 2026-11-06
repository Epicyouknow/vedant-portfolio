'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GrowthDeskHeader from '../../../../components/growth-desk/GrowthDeskHeader';
import {
  Search,
  Filter,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  ChevronRight,
  X,
  Plus,
  Sparkles
} from 'lucide-react';
import { ResearchProject, ResearchSource } from '../../../../lib/growthDeskStorage';

export default function GrowthDeskResearchLibrary() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchResearch = () => {
    fetch('/api/growth-desk/research')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.projects);
          if (data.projects.length > 0 && !selectedProject) {
            setSelectedProject(data.projects[0]);
          }
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const handleCreateResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle) return;

    setCreating(true);
    try {
      const res = await fetch('/api/growth-desk/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTopicTitle,
          topic: 'Performance Marketing',
          tags: ['Research', 'Analysis']
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsNewModalOpen(false);
        setNewTopicTitle('');
        fetchResearch();
        setSelectedProject(data.project);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const topics = ['All', 'Meta Ads', 'Google Ads', 'GA4 & GTM', 'Creative Strategy'];

  const filteredProjects = projects.filter((p) => {
    const matchesTopic = selectedTopic === 'All' || p.topic.toLowerCase().includes(selectedTopic.toLowerCase());
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <GrowthDeskHeader
        currentModule="Research Library"
        subtitle="Authoritative primary sources, evidence logs and competitive research"
        actions={
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="vv-button-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Deep Research
          </button>
        }
      />

      {/* Search & Topic Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTopic === t
                  ? 'bg-[var(--ink)] text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                  : 'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports or sources..."
            className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-hidden focus:ring-1 focus:ring-[#ED463B]"
          />
        </div>
      </div>

      {/* Main Grid: Research Cards & Evidence Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Project Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-[var(--muted)]">
            Research Reports ({filteredProjects.length})
          </div>

          <div className="space-y-3">
            {filteredProjects.map((p) => {
              const isSelected = selectedProject?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#ED463B] bg-[var(--surface)] shadow-md ring-1 ring-[#ED463B]'
                      : 'border-[var(--line)] bg-[var(--surface)] hover:border-[var(--muted)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface-2)] text-[var(--ink)] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--muted)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {p.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--ink)] mb-1 leading-snug">
                    {p.title}
                  </h3>

                  <p className="text-xs text-[var(--muted)] line-clamp-2 mb-3">
                    {p.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--line)] text-[11px] font-mono">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {p.sourcesCount} verified sources
                    </span>
                    <span className="text-[#ED463B] flex items-center gap-1 font-semibold">
                      Inspect Dossier
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Evidence Dossier (7 cols) */}
        <div className="lg:col-span-7">
          {selectedProject ? (
            <div className="vv-card p-6 space-y-6">
              {/* Header */}
              <div className="border-b border-[var(--line)] pb-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono uppercase text-[#ED463B] font-bold tracking-wider">
                    Deep Research Dossier
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold">
                    {selectedProject.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[var(--ink)]">
                  {selectedProject.title}
                </h2>
                <div className="text-xs text-[var(--muted)] mt-1">
                  Compiled on {selectedProject.date} • {selectedProject.sourcesCount} authoritative citations
                </div>
              </div>

              {/* Executive Synthesis */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase font-bold text-[var(--muted)]">
                  Executive Synthesis
                </h4>
                <div className="p-3.5 rounded-xl bg-[var(--surface-2)] text-xs text-[var(--ink)] leading-relaxed">
                  {selectedProject.executiveSynthesis}
                </div>
              </div>

              {/* Key Findings */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase font-bold text-[var(--muted)]">
                  Key Factual Findings
                </h4>
                <ul className="space-y-2 text-xs text-[var(--ink)]">
                  {selectedProject.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gaps & Original Opportunities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/20 space-y-1">
                  <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300 font-mono flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Market Content Gaps
                  </div>
                  <ul className="text-[11px] text-[var(--muted)] list-disc pl-4 space-y-1">
                    {selectedProject.contentGaps.map((gap, i) => (
                      <li key={i}>{gap}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-1">
                  <div className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    VedantVerse Edge
                  </div>
                  <ul className="text-[11px] text-[var(--muted)] list-disc pl-4 space-y-1">
                    {selectedProject.originalOpportunities.map((op, i) => (
                      <li key={i}>{op}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Authoritative Sources Log */}
              <div className="space-y-3 pt-3 border-t border-[var(--line)]">
                <h4 className="text-xs font-mono uppercase font-bold text-[var(--muted)] flex items-center justify-between">
                  <span>Primary Sources & Citation Registry</span>
                  <span className="text-emerald-600 font-semibold lowercase">strict verification</span>
                </h4>

                <div className="space-y-2.5">
                  {selectedProject.sources.map((src) => (
                    <div
                      key={src.id}
                      className="p-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[var(--ink)] hover:text-[#ED463B] flex items-center gap-1"
                        >
                          {src.title}
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {src.verificationStatus} ({src.reliabilityScore}%)
                        </span>
                      </div>

                      <div className="text-[11px] text-[var(--muted)] font-mono flex items-center gap-3">
                        <span>Publisher: {src.publisher}</span>
                        <span>•</span>
                        <span>Category: {src.category}</span>
                      </div>

                      <div className="p-2 rounded-lg bg-[var(--surface-2)] text-[11px] text-[var(--ink)]">
                        <strong>Evidence:</strong> {src.evidence}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="vv-card p-12 text-center text-xs text-[var(--muted)]">
              Select a research report on the left to view evidence citations.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Research */}
      {isNewModalOpen && (
        <div className="vv-modal-backdrop">
          <div className="vv-card w-full max-w-md p-6 space-y-4 shadow-xl border-2 border-[var(--line)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-base font-bold text-[var(--ink)]">Start Deep Research Project</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateResearch} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Topic or Query
                </label>
                <input
                  type="text"
                  required
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="e.g. Meta Ads Advantage+ Shopping vs Manual Bidding 2025"
                  className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)] focus:outline-hidden focus:border-[#ED463B]"
                />
              </div>

              <p className="text-[11px] text-[var(--muted)] leading-normal">
                The Deep Research Engine prioritizes primary documentation, developer specifications, official platforms, and research papers before synthesizing evidence.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="vv-button-primary px-4 py-2 text-xs font-bold"
                >
                  {creating ? 'Researching...' : 'Run Deep Research'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

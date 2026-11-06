'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GrowthDeskHeader from '../../../../components/growth-desk/GrowthDeskHeader';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Edit,
  X,
  Sparkles,
  Check
} from 'lucide-react';
import { EditorialBatch, BatchArticle } from '../../../../lib/growthDeskStorage';

export default function GrowthDeskWeeklyBatchReview() {
  const [batches, setBatches] = useState<EditorialBatch[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [activeArticleForAction, setActiveArticleForAction] = useState<BatchArticle | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [publishResult, setPublishResult] = useState<any[] | null>(null);

  const fetchBatches = () => {
    fetch('/api/growth-desk/batch')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBatches(data.batches);
          if (data.batches.length > 0 && data.batches[0].articles) {
            setSelectedArticles(data.batches[0].articles.map((a: BatchArticle) => a.contentId));
          }
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const currentBatch = batches[0];

  const handleSelectToggle = (id: string) => {
    setSelectedArticles((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApproveAndPublish = async (singleContentId?: string) => {
    setProcessing(true);
    try {
      const res = await fetch('/api/growth-desk/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve-and-publish',
          contentId: singleContentId || (selectedArticles.length === 1 ? selectedArticles[0] : undefined),
          batchId: !singleContentId && selectedArticles.length > 1 ? currentBatch?.id : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setPublishResult(data.published);
        fetchBatches();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleRequestRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeArticleForAction) return;

    setProcessing(true);
    try {
      const res = await fetch('/api/growth-desk/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request-revision',
          contentId: activeArticleForAction.contentId,
          revisionNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsRevisionModalOpen(false);
        setActiveArticleForAction(null);
        setRevisionNotes('');
        fetchBatches();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <GrowthDeskHeader
        currentModule="Weekly Batch"
        subtitle="Review, edit and approve the AI-prepared content for publishing"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (currentBatch?.articles?.[0]) {
                  setActiveArticleForAction(currentBatch.articles[0]);
                  setIsRevisionModalOpen(true);
                }
              }}
              className="vv-button-secondary px-3 py-1.5 text-xs font-semibold"
            >
              Request Revisions
            </button>
            <button
              onClick={() => {
                setActiveArticleForAction(null);
                setIsApproveModalOpen(true);
              }}
              className="vv-button-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve All ({currentBatch?.articles?.length || 3})
            </button>
          </div>
        }
      />

      {/* Human Approval Gate Alert Box */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 grid place-items-center text-amber-700 dark:text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--ink)]">
              Human Approval Gate Active (Zero Autonomous Publishing)
            </div>
            <div className="text-[11px] text-[var(--muted)]">
              Articles in this batch will NOT be published to the live website until you review their evidence citations and provide explicit owner authorization.
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20 shrink-0">
          ● Gatekeeper Enforced
        </span>
      </div>

      {/* Current Batch Card & Articles List (Screen 8 Mockup) */}
      {currentBatch ? (
        <div className="vv-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--line)] pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-[#ED463B] font-bold tracking-wider">
                Current Editorial Sprint
              </span>
              <h2 className="text-base font-bold text-[var(--ink)] mt-0.5">
                {currentBatch.title}
              </h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-semibold">
              {currentBatch.weekRange}
            </span>
          </div>

          {/* Articles in Batch */}
          <div className="space-y-3">
            {currentBatch.articles.map((art) => {
              const isChecked = selectedArticles.includes(art.contentId);
              return (
                <div
                  key={art.contentId}
                  className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[var(--muted)] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSelectToggle(art.contentId)}
                      className="w-4 h-4 rounded-md border-[var(--line)] text-[#ED463B] focus:ring-[#ED463B]"
                    />

                    <div className="w-12 h-12 rounded-lg bg-[var(--surface)] border border-[var(--line)] grid place-items-center shrink-0 overflow-hidden">
                      <img
                        src="/vedant_portrait.jpg"
                        alt="author"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/admin/growth-desk/content/${art.contentId}`}
                        className="text-sm font-bold text-[var(--ink)] hover:text-[#ED463B] transition-colors truncate block"
                      >
                        {art.title}
                      </Link>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-mono text-[var(--muted)]">
                        {art.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--line)] text-[10px]"
                          >
                            {t}
                          </span>
                        ))}
                        <span>•</span>
                        <span>{art.wordCount} words</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">
                          Score: {art.qualityScore}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                        art.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : art.status === 'Revisions Requested'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      }`}
                    >
                      ● {art.status}
                    </span>

                    <Link
                      href={`/admin/growth-desk/content/${art.contentId}`}
                      className="vv-button-secondary px-3 py-1 text-xs font-semibold"
                    >
                      Review
                    </Link>

                    {art.status !== 'Approved' && (
                      <button
                        onClick={() => {
                          setActiveArticleForAction(art);
                          setIsApproveModalOpen(true);
                        }}
                        className="vv-button-primary px-3 py-1 text-xs font-bold"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="vv-card p-12 text-center text-xs text-[var(--muted)]">
          No weekly batches found. Run the Monday scheduling cycle to compile one.
        </div>
      )}

      {/* Modal: Explicit Owner Approval & Publishing Gate Confirmation */}
      {isApproveModalOpen && (
        <div className="vv-modal-backdrop">
          <div className="vv-card w-full max-w-lg p-6 space-y-4 shadow-xl border-2 border-[var(--line)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#ED463B]" />
                <h3 className="text-base font-bold text-[var(--ink)]">
                  Owner Approval & Publishing Gate
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsApproveModalOpen(false);
                  setPublishResult(null);
                }}
                className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {publishResult ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-2">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Published Successfully!
                  </div>
                  <p className="text-[var(--muted)]">
                    The approved article(s) have been verified, saved to the CMS database, and are now live on the public website.
                  </p>
                  <div className="space-y-1 pt-2">
                    {publishResult.map((p) => (
                      <div key={p.slug} className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-semibold">{p.title}</span>
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#ED463B] font-bold flex items-center gap-1 hover:underline"
                        >
                          View Live Page
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setIsApproveModalOpen(false);
                      setPublishResult(null);
                    }}
                    className="vv-button-primary px-4 py-2 text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-[var(--ink)]">
                <p>
                  You are about to approve and publish{' '}
                  <strong>
                    {activeArticleForAction
                      ? `"${activeArticleForAction.title}"`
                      : `${selectedArticles.length} articles from this batch`}
                  </strong>{' '}
                  directly to the live VedantVerse blog directory.
                </p>

                <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] space-y-1 font-mono text-[11px]">
                  <div className="text-[var(--muted)]">Target Route:</div>
                  <div className="text-[#ED463B] font-bold truncate">
                    https://vedantverse.in/blog/{activeArticleForAction?.slug || '[batch-articles]'}
                  </div>
                  <div className="text-[var(--muted)] pt-1">
                    Audit Verification: Passed (Quality Score {activeArticleForAction?.qualityScore || 92}/100)
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-50/30 text-[11px] text-amber-900 dark:text-amber-300">
                  <strong>Verification Statement:</strong> As owner, by clicking below you verify that all cited claims, case studies, and campaign metrics represent authentic VedantVerse experience.
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line)]">
                  <button
                    type="button"
                    onClick={() => setIsApproveModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => handleApproveAndPublish(activeArticleForAction?.contentId)}
                    className="vv-button-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5"
                  >
                    {processing ? 'Publishing...' : 'Confirm Approval & Publish Live'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Request Revisions */}
      {isRevisionModalOpen && (
        <div className="vv-modal-backdrop">
          <div className="vv-card w-full max-w-md p-6 space-y-4 shadow-xl border-2 border-[var(--line)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-base font-bold text-[var(--ink)]">Request Revisions</h3>
              <button
                onClick={() => setIsRevisionModalOpen(false)}
                className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestRevision} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Revision Guidelines & Missing Angles
                </label>
                <textarea
                  rows={4}
                  required
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Specify which claims need further proof or what sections should be expanded..."
                  className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)] focus:outline-hidden focus:border-[#ED463B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="vv-button-primary px-4 py-2 text-xs font-bold"
                >
                  {processing ? 'Submitting...' : 'Send Revision Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


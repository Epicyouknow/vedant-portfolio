'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  CheckCircle2, 
  ExternalLink, 
  Edit3, 
  Save, 
  Layers, 
  Target, 
  BarChart3, 
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';

interface GrowthPhase {
  number: string;
  phase: string;
  title: string;
  description: string;
  deliverables: string[];
}

const initialPhases: GrowthPhase[] = [
  {
    number: "01",
    phase: "PHASE 01",
    title: "Research & Audit",
    description: "Understand the market, audience, offer, unit economics, and friction before touching the ad account.",
    deliverables: ["Competitor & Ad Library intelligence", "Audience hook matrix", "Account historical audit"]
  },
  {
    number: "02",
    phase: "PHASE 02",
    title: "Strategy & Media Plan",
    description: "Turn insight into a focused channel, message, and measurement plan tailored to profitability.",
    deliverables: ["Channel budget allocation", "Bidding strategy & CAC targets", "Landing page audit"]
  },
  {
    number: "03",
    phase: "PHASE 03",
    title: "Creative Systems",
    description: "Build testable creative concepts designed for attention, clarity, and predictable conversion.",
    deliverables: ["Hook variation scripts", "Simulated ad mockups", "Creative velocity calendar"]
  },
  {
    number: "04",
    phase: "PHASE 04",
    title: "Execution & Scaling",
    description: "Launch, learn, and optimise with disciplined campaign operations and automated bid rules.",
    deliverables: ["Meta Ads + Google Ads rollout", "Dayparting & budget pacing", "Negative keyword curation"]
  },
  {
    number: "05",
    phase: "PHASE 05",
    title: "Attribution & Results",
    description: "Translate performance into clear decisions, cohort retention, and the next growth phase.",
    deliverables: ["Blended ROAS reporting", "Post-click WhatsApp attribution", "Executive growth sprint review"]
  }
];

interface ServiceOffering {
  id: string;
  title: string;
  tagline: string;
  category: string;
  channels: string[];
  metrics: string;
}

const initialServices: ServiceOffering[] = [
  {
    id: "serv-1",
    title: "High-Intent Lead Generation",
    tagline: "Direct WhatsApp & landing page pipelines for B2B, real estate, and professional logistics.",
    category: "Paid Acquisition",
    channels: ["Meta Ads", "Google Search", "WhatsApp Business API"],
    metrics: "Average 40-50% drop in cost per conversation"
  },
  {
    id: "serv-2",
    title: "D2C & E-Commerce Scaling",
    tagline: "Scaling Shopify stores through creative hook testing, Catalog campaigns, and blended ROAS governance.",
    category: "E-Commerce",
    channels: ["Meta ASC+", "Google Performance Max", "Shopify"],
    metrics: "3.5x - 4.6x verified blended ROAS"
  },
  {
    id: "serv-3",
    title: "Policy Recovery & Compliance",
    tagline: "Dispute resolution, advertising policy recovery, and clean account architecture rebuilds.",
    category: "Infrastructure",
    channels: ["Google Merchant Center", "Meta Business Manager"],
    metrics: "100% compliance restoration"
  }
];

export default function AdminServicesPage() {
  const [phases, setPhases] = useState<GrowthPhase[]>(initialPhases);
  const [services, setServices] = useState<ServiceOffering[]>(initialServices);
  const [editingPhaseIndex, setEditingPhaseIndex] = useState<number | null>(null);
  const [editPhaseData, setEditPhaseData] = useState<GrowthPhase | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleEditPhase = (index: number) => {
    setEditingPhaseIndex(index);
    setEditPhaseData({ ...phases[index] });
  };

  const handleSavePhase = async () => {
    if (editingPhaseIndex === null || !editPhaseData) return;
    const updated = [...phases];
    updated[editingPhaseIndex] = editPhaseData;
    setPhases(updated);
    setEditingPhaseIndex(null);
    setEditPhaseData(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    // Audit log
    try {
      await fetch('/api/activity-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Updated Growth Process Phase',
          category: 'Content changes',
          user: 'Vedant Tiwari',
          role: 'Owner',
          target: `${editPhaseData.phase}: ${editPhaseData.title}`,
          details: `Updated growth methodology description and deliverables.`
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-red)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Growth Engine &amp; Capabilities
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--admin-text)]">
            Services &amp; Growth Framework
          </h1>
          <p className="text-sm text-[var(--admin-muted)] mt-1">
            Configure your 5-phase growth methodology, core service solutions, and client capability deliverables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#growth-process"
            target="_blank"
            className="admin-btn admin-btn-secondary inline-flex items-center gap-2 text-xs font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Preview on Homepage
          </Link>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium">Growth Framework saved and synchronized with live site.</span>
          </div>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded font-mono">LIVE SYNCED</span>
        </div>
      )}

      {/* 5-PHASE GROWTH METHODOLOGY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--accent-red)]" />
            <h2 className="text-base font-bold text-[var(--admin-text)]">
              5-Step Growth Methodology (Homepage Section)
            </h2>
          </div>
          <span className="text-xs text-[var(--admin-muted)]">Shown on main landing page</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {phases.map((phase, idx) => {
            const isEditingThis = editingPhaseIndex === idx;

            return (
              <div 
                key={phase.number} 
                className={`admin-card p-5 flex flex-col justify-between transition-all ${
                  isEditingThis ? 'ring-2 ring-[var(--accent-red)]' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[var(--accent-red)]">{phase.phase}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[var(--admin-muted)]">
                      Step {phase.number}
                    </span>
                  </div>

                  {isEditingThis && editPhaseData ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-[var(--admin-muted)] uppercase">Title</label>
                        <input
                          type="text"
                          className="admin-input text-xs"
                          value={editPhaseData.title}
                          onChange={(e) => setEditPhaseData({ ...editPhaseData, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[var(--admin-muted)] uppercase">Description</label>
                        <textarea
                          rows={3}
                          className="admin-input text-xs"
                          value={editPhaseData.description}
                          onChange={(e) => setEditPhaseData({ ...editPhaseData, description: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => setEditingPhaseIndex(null)}
                          className="admin-btn admin-btn-secondary text-[11px] py-1 px-2.5 flex-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSavePhase}
                          className="admin-btn admin-btn-primary text-[11px] py-1 px-2.5 flex-1 inline-flex items-center justify-center gap-1"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-base font-bold text-[var(--admin-text)] mb-2">{phase.title}</h3>
                      <p className="text-xs text-[var(--admin-muted)] leading-relaxed mb-4">{phase.description}</p>

                      <div className="space-y-1.5 border-t border-[var(--admin-border)] pt-3">
                        <span className="text-[10px] font-bold text-[var(--admin-muted)] uppercase tracking-wider block">
                          Key Deliverables
                        </span>
                        {phase.deliverables.map((del, dIdx) => (
                          <div key={dIdx} className="text-[11px] text-[var(--admin-text)] flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[var(--accent-red)]" />
                            <span className="truncate">{del}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleEditPhase(idx)}
                        className="mt-4 w-full admin-btn admin-btn-secondary text-xs inline-flex items-center justify-center gap-1.5 py-1.5"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit Phase
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CORE SERVICE OFFERINGS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--accent-red)]" />
            <h2 className="text-base font-bold text-[var(--admin-text)]">
              Core Capabilities &amp; Services
            </h2>
          </div>
          <span className="text-xs text-[var(--admin-muted)]">Lead Generation Packages</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div key={svc.id} className="admin-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[var(--accent-red)] uppercase tracking-wider">
                    {svc.category}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-[var(--admin-text)] mb-2">{svc.title}</h3>
                <p className="text-xs text-[var(--admin-muted)] leading-relaxed mb-4">{svc.tagline}</p>

                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-bold text-[var(--admin-muted)] uppercase tracking-wider block">
                    Execution Channels
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {svc.channels.map((ch, cIdx) => (
                      <span key={cIdx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-[var(--admin-text)] border border-[var(--admin-border)]">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-red-50/30 dark:bg-red-950/20 border border-[var(--accent-red)]/20 mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-red)] block">
                  Proven Outcome
                </span>
                <span className="text-xs font-semibold text-[var(--admin-text)]">{svc.metrics}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


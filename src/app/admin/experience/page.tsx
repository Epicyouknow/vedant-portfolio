'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Plus, 
  Save, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  Layers, 
  Compass, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Edit3
} from 'lucide-react';
import { portfolioData, TimelineItem } from '@/data/portfolio';

export default function AdminExperiencePage() {
  const [timeline, setTimeline] = useState<TimelineItem[]>(portfolioData.timeline);
  const [selectedStation, setSelectedStation] = useState<TimelineItem>(timeline[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<TimelineItem>(timeline[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelectStation = (item: TimelineItem) => {
    setSelectedStation(item);
    setEditForm(item);
    setIsEditing(false);
  };

  const handleSaveStation = async () => {
    const updated = timeline.map(t => t.id === editForm.id ? editForm : t);
    setTimeline(updated);
    setSelectedStation(editForm);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    // Audit log
    try {
      await fetch('/api/activity-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Updated Career Station',
          category: 'Content changes',
          user: 'Vedant Tiwari',
          role: 'Owner',
          target: `${editForm.role} at ${editForm.company}`,
          details: `Updated transit station (${editForm.year}). Added/updated ${editForm.points?.length || 0} accomplishments and ${editForm.tools?.length || 0} tools.`
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
              Interactive Transit Framework
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--admin-text)]">
            Career Map &amp; Experience
          </h1>
          <p className="text-sm text-[var(--admin-muted)] mt-1">
            Manage your career stations, company positions, deployed ad tools, and milestones rendered on the interactive transit map.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/career-map"
            target="_blank"
            className="admin-btn admin-btn-secondary inline-flex items-center gap-2 text-xs font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Transit Map
          </Link>
          <button
            onClick={() => {
              const newStation: TimelineItem = {
                id: `timeline-${Date.now()}`,
                year: '2026 - Present',
                role: 'Senior Growth & Performance Lead',
                company: 'Independent Practice',
                period: 'Current (Full-time)',
                description: 'Scaling enterprise performance marketing and paid acquisition systems.',
                points: ['Managed $100K+ ad budgets', 'Achieved 4.2x blended ROAS'],
                tools: ['Meta Ads', 'Google Ads', 'GA4', 'Looker Studio'],
                lessons: 'Structured creative testing beats volume.'
              };
              setTimeline([newStation, ...timeline]);
              setSelectedStation(newStation);
              setEditForm(newStation);
              setIsEditing(true);
            }}
            className="admin-btn admin-btn-primary inline-flex items-center gap-2 text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Station Stop
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium">Career station updated successfully and logged in CMS Audit Trail.</span>
          </div>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded font-mono">LIVE SYNCED</span>
        </div>
      )}

      {/* TRANSIT LINE VISUAL PREVIEW BAR */}
      <div className="admin-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[var(--accent-red)]" />
            <h3 className="text-sm font-bold text-[var(--admin-text)]">Active Metro Transit Route</h3>
          </div>
          <span className="text-xs text-[var(--admin-muted)] font-mono">{timeline.length} Station Stops</span>
        </div>

        <div className="flex items-center justify-between gap-3 overflow-x-auto py-4">
          {timeline.map((station, idx) => {
            const isSelected = selectedStation.id === station.id;
            return (
              <div 
                key={station.id}
                onClick={() => handleSelectStation(station)}
                className={`flex-1 min-w-[200px] p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-[var(--accent-red)] bg-red-50/30 dark:bg-red-950/20 shadow-sm' 
                    : 'border-[var(--admin-border)] hover:border-[var(--admin-text)] bg-white dark:bg-stone-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-red)]">
                    Station #{timeline.length - idx}
                  </span>
                  <span className="text-[10px] text-[var(--admin-muted)]">{station.period}</span>
                </div>
                <div className="font-semibold text-sm text-[var(--admin-text)] truncate">{station.company}</div>
                <div className="text-xs text-[var(--admin-muted)] truncate">{station.role}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL INSPECTION & EDITING GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: LIST */}
        <div className="lg:col-span-4 space-y-4">
          <div className="admin-card p-5">
            <h3 className="text-sm font-bold text-[var(--admin-text)] mb-3 flex items-center justify-between">
              <span>All Career Stops</span>
              <span className="text-xs text-[var(--admin-muted)] font-normal">Click to edit</span>
            </h3>
            <div className="space-y-2">
              {timeline.map((item) => {
                const isSelected = selectedStation.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectStation(item)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[var(--accent-red)] bg-red-50/20 dark:bg-red-950/20'
                        : 'border-[var(--admin-border)] hover:bg-stone-50 dark:hover:bg-stone-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--admin-text)]">{item.company}</span>
                      <span className="text-[10px] font-mono text-[var(--admin-muted)]">{item.year.split(' - ')[0]}</span>
                    </div>
                    <div className="text-xs text-[var(--admin-muted)] truncate mt-0.5">{item.role}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INSPECTOR & EDITOR */}
        <div className="lg:col-span-8">
          <div className="admin-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--admin-border)] pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[var(--accent-red)] uppercase tracking-wider">
                  Station Inspector
                </span>
                <h2 className="text-lg font-bold text-[var(--admin-text)] mt-0.5">
                  {isEditing ? 'Edit Station Details' : selectedStation.company}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="admin-btn admin-btn-secondary text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveStation}
                      className="admin-btn admin-btn-primary inline-flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save &amp; Sync Live
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditForm(selectedStation);
                      setIsEditing(true);
                    }}
                    className="admin-btn admin-btn-secondary inline-flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Station
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              /* FORM MODE */
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">Company / Organization</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">Role Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">Time Horizon (e.g. May 2026 - Present)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editForm.year}
                      onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">Period Details (e.g. 4 mos (Full-time))</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editForm.period}
                      onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">Executive Summary / Scope</label>
                  <textarea
                    rows={3}
                    className="admin-input"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">Operating Lessons Learned</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editForm.lessons || ''}
                    onChange={(e) => setEditForm({ ...editForm, lessons: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--admin-text)] mb-1">
                    Tools &amp; Channels (comma separated)
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={(editForm.tools || []).join(', ')}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      tools: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                  />
                </div>
              </div>
            ) : (
              /* VIEW MODE */
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-[var(--admin-muted)] uppercase tracking-wider font-semibold">Position &amp; Timeline</span>
                  <h3 className="text-xl font-bold text-[var(--admin-text)] mt-1">{selectedStation.role}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[var(--admin-muted)]">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedStation.year}</span>
                    <span>•</span>
                    <span className="font-medium text-[var(--admin-text)]">{selectedStation.period}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-[var(--admin-border)]">
                  <div className="text-xs font-semibold text-[var(--admin-muted)] uppercase tracking-wider mb-2">Scope of Responsibility</div>
                  <p className="text-sm text-[var(--admin-text)] leading-relaxed">{selectedStation.description}</p>
                </div>

                {selectedStation.points && selectedStation.points.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-muted)] mb-3">
                      Verified Accomplishments
                    </h4>
                    <ul className="space-y-2">
                      {selectedStation.points.map((acc: string, aIdx: number) => (
                        <li key={aIdx} className="flex items-start gap-2.5 text-xs text-[var(--admin-text)]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{acc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedStation.tools && selectedStation.tools.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--admin-muted)] mb-3">
                      Tools &amp; Technologies Deployed
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStation.tools.map((tool, tIdx) => (
                        <span key={tIdx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 dark:bg-stone-800 text-[var(--admin-text)] border border-[var(--admin-border)]">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedStation.lessons && (
                  <div className="p-4 rounded-xl bg-red-50/30 dark:bg-red-950/20 border border-[var(--accent-red)]/20">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-red)]">
                      Key Takeaway / Operating Principle
                    </span>
                    <p className="text-xs text-[var(--admin-text)] mt-1 italic">
                      &quot;{selectedStation.lessons}&quot;
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

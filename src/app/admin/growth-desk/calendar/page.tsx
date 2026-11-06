'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GrowthDeskHeader from '../../../../components/growth-desk/GrowthDeskHeader';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  X
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  day: number;
  title: string;
  type: 'Research' | 'Draft Review' | 'Approval' | 'Publish';
  color: 'blue' | 'amber' | 'green' | 'red';
  contentId?: string;
}

export default function GrowthDeskEditorialCalendar() {
  const [view, setView] = useState<'Month' | 'Week' | 'List'>('Month');
  const [currentMonth, setCurrentMonth] = useState('January 2025');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    day: 24,
    type: 'Publish' as const
  });

  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', day: 2, title: 'Research PMax Guide', type: 'Research', color: 'blue' },
    { id: '2', day: 8, title: 'Draft Review Meta Attribution', type: 'Draft Review', color: 'amber', contentId: 'cnt-1' },
    { id: '3', day: 15, title: 'Weekly Approval (2 Articles)', type: 'Approval', color: 'green' },
    { id: '4', day: 19, title: 'Publish GA4 Tracking', type: 'Publish', color: 'red', contentId: 'cnt-2' },
    { id: '5', day: 24, title: 'Publish Meta Ads Attribution', type: 'Publish', color: 'red', contentId: 'cnt-1' },
    { id: '6', day: 27, title: 'Publish Logistics Growth Case', type: 'Publish', color: 'amber' }
  ]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const colorMap: Record<string, 'blue' | 'amber' | 'green' | 'red'> = {
      Research: 'blue',
      'Draft Review': 'amber',
      Approval: 'green',
      Publish: 'red'
    };

    setEvents([
      ...events,
      {
        id: String(Date.now()),
        day: Number(newEvent.day),
        title: newEvent.title,
        type: newEvent.type,
        color: colorMap[newEvent.type] || 'blue'
      }
    ]);

    setIsModalOpen(false);
    setNewEvent({ title: '', day: 24, type: 'Publish' });
  };

  // Generate 31 days for January
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <GrowthDeskHeader
        currentModule="Editorial Calendar"
        subtitle="Plan, review and schedule your upcoming content and research sprints"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="vv-button-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add to Calendar
          </button>
        }
      />

      {/* Calendar Bar & View Toggles (Screen 6) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--surface-2)] border border-[var(--line)]">
            <button className="p-1 rounded-sm text-[var(--muted)] hover:text-[var(--ink)]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold font-mono px-2 text-[var(--ink)]">
              {currentMonth}
            </span>
            <button className="p-1 rounded-sm text-[var(--muted)] hover:text-[var(--ink)]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--surface-2)] border border-[var(--line)]">
          {(['Week', 'Month', 'List'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                view === v
                  ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs font-bold'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Month View Grid (Matching Screen 6) */}
      {view === 'Month' && (
        <div className="vv-card overflow-hidden">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-[var(--line)] bg-[var(--surface-2)] text-[10px] font-mono uppercase font-bold text-[var(--muted)] text-center py-2.5">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[var(--line)] bg-[var(--surface)] min-h-[560px]">
            {daysInMonth.map((day) => {
              const dayEvents = events.filter((e) => e.day === day);
              return (
                <div
                  key={day}
                  className="p-2 min-h-[100px] flex flex-col justify-between hover:bg-[var(--surface-2)]/50 transition-colors"
                >
                  <div className="text-xs font-mono font-bold text-[var(--muted)] mb-1">
                    {day}
                  </div>

                  <div className="space-y-1 flex-1">
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className={`p-1.5 rounded-md text-[10px] font-semibold leading-tight line-clamp-2 ${
                          evt.color === 'blue'
                            ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                            : evt.color === 'amber'
                            ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                            : evt.color === 'green'
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                            : 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900'
                        }`}
                      >
                        {evt.contentId ? (
                          <Link href={`/admin/growth-desk/content/${evt.contentId}`}>
                            {evt.title}
                          </Link>
                        ) : (
                          evt.title
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'List' && (
        <div className="vv-card overflow-hidden divide-y divide-[var(--line)]">
          {events.map((evt) => (
            <div key={evt.id} className="p-4 flex items-center justify-between hover:bg-[var(--surface-2)]">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[var(--surface-2)] font-mono font-black text-sm grid place-items-center text-[var(--ink)]">
                  {evt.day}
                </span>
                <div>
                  <div className="text-xs font-bold text-[var(--ink)]">{evt.title}</div>
                  <div className="text-[10px] font-mono text-[var(--muted)]">January 2025 • {evt.type}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase bg-[var(--surface-2)] text-[var(--ink)]">
                {evt.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add to Calendar */}
      {isModalOpen && (
        <div className="vv-modal-backdrop">
          <div className="vv-card w-full max-w-md p-6 space-y-4 shadow-xl border-2 border-[var(--line)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-base font-bold text-[var(--ink)]">Add Calendar Milestone</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Milestone Title
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Publish GA4 Tracking Guide"
                  className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)] focus:outline-hidden focus:border-[#ED463B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Day of Month
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={newEvent.day}
                    onChange={(e) => setNewEvent({ ...newEvent, day: Number(e.target.value) })}
                    className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Event Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                    className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)]"
                  >
                    <option value="Publish">Publish</option>
                    <option value="Approval">Approval</option>
                    <option value="Draft Review">Draft Review</option>
                    <option value="Research">Research</option>
                  </select>
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
                  className="vv-button-primary px-4 py-2 text-xs font-bold"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


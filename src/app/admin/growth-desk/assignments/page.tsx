'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GrowthDeskHeader from '../../../../components/growth-desk/GrowthDeskHeader';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  MoreVertical,
  X,
  ArrowRight,
  Trash2,
  Edit,
  ExternalLink
} from 'lucide-react';
import { Assignment } from '../../../../lib/growthDeskStorage';

export default function GrowthDeskAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    prompt: '',
    type: 'Research & Article',
    priority: 'High',
    topic: 'Meta Ads',
    dueDate: '28 Jan'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = () => {
    fetch('/api/growth-desk/assignments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAssignments(data.assignments);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/growth-desk/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData({
          title: '',
          prompt: '',
          type: 'Research & Article',
          priority: 'High',
          topic: 'Meta Ads',
          dueDate: '28 Jan'
        });
        fetchAssignments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch('/api/growth-desk/assignments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await fetch(`/api/growth-desk/assignments?id=${id}`, { method: 'DELETE' });
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { label: 'All', count: assignments.length },
    { label: 'Queued', count: assignments.filter((a) => a.status === 'Queued').length },
    { label: 'In-Progress', count: assignments.filter((a) => a.status === 'In-Progress' || a.status === 'Drafting').length },
    { label: 'Review', count: assignments.filter((a) => a.status === 'Awaiting Approval').length },
    { label: 'Scheduled', count: assignments.filter((a) => a.status === 'Scheduled').length },
    { label: 'Completed', count: assignments.filter((a) => a.status === 'Completed').length },
  ];

  const filteredAssignments = assignments.filter((a) => {
    const matchesTab =
      activeTab === 'All'
        ? true
        : activeTab === 'In-Progress'
        ? a.status === 'In-Progress' || a.status === 'Drafting'
        : activeTab === 'Review'
        ? a.status === 'Awaiting Approval'
        : a.status === activeTab;

    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.topic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <GrowthDeskHeader
        currentModule="Assignments"
        subtitle="Create, manage and track your research and content tasks"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="vv-button-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Assignment
          </button>
        }
      />

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.label
                  ? 'bg-[var(--ink)] text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                  : 'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === tab.label ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black' : 'bg-[var(--line)] text-[var(--muted)]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assignments..."
            className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-hidden focus:ring-1 focus:ring-[#ED463B]"
          />
        </div>
      </div>

      {/* Task Table (Matching Screen 2) */}
      <div className="vv-card overflow-hidden">
        <div className="vv-table-container">
          <div className="vv-table-head grid-cols-12 text-[10px] uppercase font-mono font-bold">
            <div className="col-span-5">Assignment</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Due Date</div>
            <div className="col-span-1">Priority</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          <div className="divide-y divide-[var(--line)]">
            {filteredAssignments.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--muted)]">
                No assignments match the selected criteria.
              </div>
            ) : (
              filteredAssignments.map((a) => (
                <div
                  key={a.id}
                  className="vv-table-row grid-cols-12 text-xs py-3.5 hover:bg-[var(--surface-2)] transition-colors items-center"
                >
                  <div className="col-span-5 min-w-0 pr-3">
                    <Link
                      href={`/admin/growth-desk/content/${a.contentId || 'cnt-1'}`}
                      className="font-bold text-[var(--ink)] hover:text-[#ED463B] transition-colors truncate block text-sm"
                    >
                      {a.title}
                    </Link>
                    <div className="text-[11px] text-[var(--muted)] truncate font-mono mt-0.5">
                      {a.prompt}
                    </div>
                  </div>

                  <div className="col-span-2 font-mono text-[11px] text-[var(--muted)] truncate">
                    {a.type}
                  </div>

                  <div className="col-span-2">
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      className={`text-[10px] font-mono font-bold px-2 py-1 rounded-full border border-transparent focus:outline-hidden cursor-pointer ${
                        a.status === 'In-Progress'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : a.status === 'Awaiting Approval'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          : a.status === 'Drafting'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      <option value="Queued">Queued</option>
                      <option value="In-Progress">In-Progress</option>
                      <option value="Drafting">Drafting</option>
                      <option value="Awaiting Approval">Awaiting Approval</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="col-span-1 font-mono text-[11px] text-[var(--muted)]">
                    {a.dueDate}
                  </div>

                  <div className="col-span-1">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm uppercase ${
                        a.priority === 'High'
                          ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {a.priority}
                    </span>
                  </div>

                  <div className="col-span-1 text-right flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/growth-desk/content/${a.contentId || 'cnt-1'}`}
                      className="p-1.5 rounded-md hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]"
                      title="Open in Studio"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 text-[var(--muted)] hover:text-red-600"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal: New Assignment */}
      {isModalOpen && (
        <div className="vv-modal-backdrop">
          <div className="vv-card w-full max-w-lg p-6 space-y-4 shadow-xl border-2 border-[var(--line)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-base font-bold text-[var(--ink)]">Create New Assignment</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Meta Ads Attribution 2025 Updates"
                  className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)] focus:outline-hidden focus:border-[#ED463B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Objective & Brief
                </label>
                <textarea
                  rows={3}
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  placeholder="Detailed guidelines on audience, evidence requirements, and angles..."
                  className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)] focus:outline-hidden focus:border-[#ED463B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Assignment Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)]"
                  >
                    <option value="Research & Article">Research & Article</option>
                    <option value="Long-form Article">Long-form Article</option>
                    <option value="Case Insight">Case Insight</option>
                    <option value="Competitor Analysis">Competitor Analysis</option>
                    <option value="Update Existing">Update Existing</option>
                    <option value="Content Idea">Content Idea</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Topic Domain
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g. Meta Ads, GA4, E-commerce"
                    className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs text-[var(--ink)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Due Date
                  </label>
                  <input
                    type="text"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    placeholder="e.g. 28 Jan"
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
                  {submitting ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

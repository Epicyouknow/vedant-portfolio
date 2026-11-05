'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, MessageSquare, Phone, 
  Mail, Star, Trash2, CheckCircle2, AlertCircle, Clock, 
  Search, Download, Bell, ExternalLink, Send, 
  FileText, ChevronDown, Sparkles, MessageCircle, BarChart2
} from 'lucide-react';
import { Inquiry, InquiryStatus } from '../../../lib/inquiries';

const STATUS_CONFIG: Record<InquiryStatus, { label: string; badgeClass: string }> = {
  new: {
    label: 'New Lead',
    badgeClass: 'vv-badge vv-badge--accent'
  },
  contacted: {
    label: 'Contacted',
    badgeClass: 'vv-badge vv-badge--warning'
  },
  in_discussion: {
    label: 'In Discussion',
    badgeClass: 'vv-badge bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
  },
  converted: {
    label: 'Converted (Won)',
    badgeClass: 'vv-badge vv-badge--success'
  },
  archived: {
    label: 'Archived',
    badgeClass: 'vv-badge'
  }
};

export default function AdminCRMPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');

  // Expanded notes & editing
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Notification Testing Modal
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [channelStatus, setChannelStatus] = useState<any>(null);
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Active admin pin (default 8520 for backend inquiry verification)
  const activePin = '8520';

  // Fetch inquiries
  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch(`/api/inquiries?pin=${activePin}`);
      if (res.ok) {
        const list = await res.json();
        setInquiries(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  // Fetch Notification Config
  const fetchNotificationStatus = async () => {
    try {
      const res = await fetch(`/api/notifications/test?pin=${activePin}`);
      if (res.ok) {
        const data = await res.json();
        setChannelStatus(data.channels);
      }
    } catch (err) {
      console.error('Failed to fetch notification status:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchInquiries();
    fetchNotificationStatus();
  }, []);

  // Send Test Notification
  const handleSendTestNotification = async () => {
    setIsTestingNotification(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: activePin })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setIsTestingNotification(false);
    }
  };

  // Update Status
  const handleUpdateStatus = async (id: string, newStatus: InquiryStatus) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': activePin
        },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Toggle Starred
  const handleToggleStar = async (id: string, currentStarred?: boolean) => {
    const newStarred = !currentStarred;
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': activePin
        },
        body: JSON.stringify({ id, starred: newStarred })
      });

      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, starred: newStarred } : inq));
      }
    } catch (err) {
      console.error('Error toggling star:', err);
    }
  };

  // Save Notes
  const handleSaveNotes = async (id: string) => {
    setIsSavingNote(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': activePin
        },
        body: JSON.stringify({ id, notes: tempNotes })
      });

      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, notes: tempNotes } : inq));
        setEditingNotesId(null);
      }
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setIsSavingNote(false);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string, index: number) => {
    if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;

    try {
      const res = await fetch(`/api/inquiries?pin=${activePin}&id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setInquiries(prev => prev.filter(inq => inq.id !== id));
      } else {
        const fallbackRes = await fetch(`/api/inquiries?pin=${activePin}&index=${index}`, {
          method: 'DELETE'
        });
        if (fallbackRes.ok) {
          fetchInquiries();
        } else {
          alert('Failed to delete inquiry');
        }
      }
    } catch (err) {
      console.error('Error deleting inquiry:', err);
    }
  };

  // Export CSV
  const exportToCSV = () => {
    if (inquiries.length === 0) {
      alert('No inquiries to export');
      return;
    }

    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Budget', 'Status', 'Message', 'Notes'];
    const rows = inquiries.map(i => [
      i.id || '',
      new Date(i.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.budget || '').replace(/"/g, '""')}"`,
      i.status || 'new',
      `"${(i.message || '').replace(/"/g, '""')}"`,
      `"${(i.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VedantVerse_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Manual refresh
  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchInquiries();
    await fetchNotificationStatus();
    setIsRefreshing(false);
  };

  // Filtered List
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (inq.name || '').toLowerCase().includes(q);
        const matchesEmail = (inq.email || '').toLowerCase().includes(q);
        const matchesPhone = (inq.phone || '').toLowerCase().includes(q);
        const matchesMessage = (inq.message || '').toLowerCase().includes(q);
        const matchesNotes = (inq.notes || '').toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesMessage && !matchesNotes) {
          return false;
        }
      }

      // Status
      if (selectedStatus !== 'all') {
        const inqStatus = inq.status || 'new';
        if (inqStatus !== selectedStatus) return false;
      }

      // Budget
      if (selectedBudget !== 'all') {
        if (inq.budget !== selectedBudget) return false;
      }

      return true;
    });
  }, [inquiries, searchQuery, selectedStatus, selectedBudget]);

  // Metrics
  const metrics = useMemo(() => {
    const total = inquiries.length;
    const newLeads = inquiries.filter(i => !i.status || i.status === 'new').length;
    const inDiscussion = inquiries.filter(i => i.status === 'in_discussion').length;
    const converted = inquiries.filter(i => i.status === 'converted').length;
    const starred = inquiries.filter(i => i.starred).length;
    const highBudget = inquiries.filter(i => (i.budget || '').includes('15L') || (i.budget || '').includes('5L - 15L')).length;

    return { total, newLeads, inDiscussion, converted, starred, highBudget };
  }, [inquiries]);

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
            DISCOVERABILITY • INBOUND LEADS
          </div>
          <h1 className="vv-h1">Form Inquiries & CRM</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
            Review, qualify, and respond to incoming inquiries from your website lead popups and contact forms in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/analytics"
            className="vv-button vv-button--secondary"
            title="Open traffic telemetry"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Traffic Telemetry</span>
          </Link>

          <button
            onClick={() => setShowNotificationModal(true)}
            className="vv-button vv-button--secondary relative"
          >
            <Bell className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Phone & Mail Alerts</span>
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping absolute -top-1 -right-1" />
          </button>

          <button
            onClick={exportToCSV}
            className="vv-button vv-button--secondary"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="vv-button vv-button--primary"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Leads'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
        <div className="vv-card p-4 space-y-1">
          <span className="text-[10px] uppercase font-mono text-[var(--muted)] font-bold block">Total Leads</span>
          <div className="text-2xl font-black text-[var(--ink)]">{metrics.total}</div>
          <span className="text-[10px] text-[var(--muted)]">All submissions</span>
        </div>

        <div className="vv-card p-4 space-y-1 border-[var(--accent)]/30 bg-[var(--accent-soft)]/20 relative overflow-hidden">
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-[10px] uppercase font-mono text-[var(--accent)] font-bold block">New / Unread</span>
          <div className="text-2xl font-black text-[var(--accent)]">{metrics.newLeads}</div>
          <span className="text-[10px] text-[var(--accent)]/80">Needs response</span>
        </div>

        <div className="vv-card p-4 space-y-1">
          <span className="text-[10px] uppercase font-mono text-purple-600 dark:text-purple-400 font-bold block">In Discussion</span>
          <div className="text-2xl font-black text-[var(--ink)]">{metrics.inDiscussion}</div>
          <span className="text-[10px] text-[var(--muted)]">Active talks</span>
        </div>

        <div className="vv-card p-4 space-y-1">
          <span className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400 font-bold block">Converted</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{metrics.converted}</div>
          <span className="text-[10px] text-[var(--muted)]">Won campaigns</span>
        </div>

        <div className="vv-card p-4 space-y-1">
          <span className="text-[10px] uppercase font-mono text-amber-600 dark:text-amber-400 font-bold block">Starred VIPs</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{metrics.starred}</div>
          <span className="text-[10px] text-[var(--muted)]">Bookmarked</span>
        </div>

        <div className="vv-card p-4 space-y-1">
          <span className="text-[10px] uppercase font-mono text-[var(--muted)] font-bold block">High Budget</span>
          <div className="text-2xl font-black text-[var(--ink)]">{metrics.highBudget}</div>
          <span className="text-[10px] text-[var(--muted)]">₹5L+ inquiries</span>
        </div>
      </div>

      {/* Search, Filter & Tabs Bar */}
      <div className="vv-card p-3 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email, phone, message, or notes..."
            className="w-full h-9 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] pl-10 pr-4 text-xs text-[var(--ink)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-lg border border-[var(--line)] text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'new', label: 'New' },
              { id: 'contacted', label: 'Contacted' },
              { id: 'in_discussion', label: 'Active' },
              { id: 'converted', label: 'Won' },
              { id: 'archived', label: 'Archived' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
                  selectedStatus === tab.id
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Budget filter */}
          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className="h-9 bg-[var(--surface-2)] border border-[var(--line)] rounded-lg px-3 text-xs text-[var(--ink)] font-mono focus:outline-none cursor-pointer"
          >
            <option value="all">All Budgets</option>
            <option value="₹15L+">₹15L+</option>
            <option value="₹5L - ₹15L">₹5L - ₹15L</option>
            <option value="₹1L - ₹5L">₹1L - ₹5L</option>
            <option value="< ₹1L">&lt; ₹1L</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      <div className="vv-card overflow-hidden">
        {loadingInquiries ? (
          <div className="py-20 text-center text-[var(--muted)] font-mono text-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-[var(--accent)] mx-auto mb-2" />
            Loading portfolio leads...
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="py-20 text-center text-[var(--muted)] space-y-2">
            <MessageSquare className="w-10 h-10 mx-auto text-[var(--muted)] opacity-40" />
            <p className="text-sm font-semibold text-[var(--ink)]">No inquiries found matching criteria</p>
            <p className="text-xs text-[var(--muted)]">When visitors submit forms on your website, they appear here instantly.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)]">
            {filteredInquiries.map((inq, idx) => {
              const currentStatus = inq.status || 'new';
              const statusMeta = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new;
              const isEditingNotes = editingNotesId === inq.id;
              const hasPhone = Boolean(inq.phone && inq.phone.trim() && !inq.phone.includes('@') && inq.phone.replace(/\D/g, '').length >= 10);

              return (
                <div key={inq.id || idx} className="p-5 hover:bg-[var(--surface-2)]/50 transition-colors space-y-4">
                  {/* Top Row: Client Info, Star, Status Dropdown, Actions */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleStar(inq.id, inq.starred)}
                        title="Star / VIP Client"
                        className="cursor-pointer text-[var(--muted)] hover:text-amber-500 transition-colors mt-0.5"
                      >
                        <Star className={`w-5 h-5 ${inq.starred ? 'text-amber-500 fill-amber-500' : ''}`} />
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-[var(--ink)]">{inq.name}</h3>
                          <span className="vv-badge vv-badge--accent">
                            {inq.budget || 'Not specified'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)] mt-1 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(inq.timestamp).toLocaleString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {inq.email && !inq.email.includes('@whatsapp.lead') && (
                            <>
                              <span>•</span>
                              <a href={`mailto:${inq.email}`} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" />
                                {inq.email}
                              </a>
                            </>
                          )}
                          {hasPhone && (
                            <>
                              <span>•</span>
                              <a 
                                href={`https://wa.me/${inq.phone?.replace(/[^0-9]/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                {inq.phone}
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Selector & Quick Actions */}
                    <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                      {/* Status selector */}
                      <div className="relative">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleUpdateStatus(inq.id, e.target.value as InquiryStatus)}
                          className={`h-8 rounded-lg text-xs font-bold uppercase border cursor-pointer appearance-none pl-3 pr-8 focus:outline-none ${statusMeta.badgeClass}`}
                        >
                          <option value="new">🔴 New Lead</option>
                          <option value="contacted">🟡 Contacted</option>
                          <option value="in_discussion">🟣 In Discussion</option>
                          <option value="converted">🟢 Converted (Won)</option>
                          <option value="archived">⚪ Archived</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]" />
                      </div>

                      {/* Quick Email Reply */}
                      {inq.email && !inq.email.includes('@whatsapp.lead') && (
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inq.email)}&su=${encodeURIComponent('Re: Campaign Inquiry - VedantVerse')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Reply via Gmail"
                          className="vv-button vv-button--secondary text-xs h-8 text-blue-600 dark:text-blue-400"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email</span>
                        </a>
                      )}

                      {/* Quick WhatsApp Chat */}
                      {hasPhone && (
                        <a
                          href={`https://wa.me/${inq.phone?.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(inq.name)},%20Vedant%20here%20from%20VedantVerse.%20I%20received%20your%20campaign%20inquiry!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Chat on WhatsApp"
                          className="vv-button vv-button--secondary text-xs h-8 text-emerald-600 dark:text-emerald-400"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteInquiry(inq.id, idx)}
                        title="Delete Lead"
                        className="vv-button vv-button--danger text-xs h-8 px-2.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Message Box */}
                  <div className="bg-[var(--surface-2)] border border-[var(--line)] rounded-lg p-3 text-xs text-[var(--ink)] leading-relaxed whitespace-pre-wrap">
                    <span className="text-[10px] text-[var(--muted)] font-bold uppercase font-mono block mb-1">Inquiry Message:</span>
                    {inq.message}
                  </div>

                  {/* Internal CRM Notes Section */}
                  <div>
                    {isEditingNotes ? (
                      <div className="space-y-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-lg p-3">
                        <label className="text-[10px] font-mono text-[var(--muted)] font-bold uppercase block">
                          Internal Follow-up Notes:
                        </label>
                        <textarea
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          rows={3}
                          placeholder="e.g. Sent introductory deck on WhatsApp; promised to follow up on Friday with ad audit..."
                          className="w-full bg-[var(--surface)] border border-[var(--line)] rounded px-3 py-2 text-xs text-[var(--ink)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="vv-button vv-button--ghost text-xs h-7"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(inq.id)}
                            disabled={isSavingNote}
                            className="vv-button vv-button--primary text-xs h-7"
                          >
                            {isSavingNote ? 'Saving...' : 'Save Note'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-[var(--muted)] bg-[var(--surface-2)] border border-[var(--line)] rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
                          {inq.notes ? (
                            <span className="text-[var(--ink)] font-mono text-[11px]">{inq.notes}</span>
                          ) : (
                            <span className="text-[var(--muted)] italic text-[11px]">No internal notes yet.</span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setEditingNotesId(inq.id);
                            setTempNotes(inq.notes || '');
                          }}
                          className="text-[var(--accent)] hover:underline text-[11px] font-mono cursor-pointer shrink-0 font-bold"
                        >
                          {inq.notes ? 'Edit Note' : '+ Add Note'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notification Testing & Setup Modal */}
      <AnimatePresence>
        {showNotificationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="vv-card max-w-2xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl bg-[var(--surface)] border-[var(--line)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[var(--accent)]" />
                  <h2 className="text-base font-bold text-[var(--ink)]">
                    Live Notification Channels
                  </h2>
                </div>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="vv-button vv-button--ghost text-xs h-7 px-2"
                >
                  ✕ Close
                </button>
              </div>

              <p className="text-xs text-[var(--muted)] leading-relaxed">
                When a lead submits any form on your portfolio, alerts are dispatched simultaneously across configured channels:
              </p>

              {/* Channel List Status */}
              <div className="space-y-3">
                {/* Telegram */}
                <div className="border border-[var(--line)] bg-[var(--surface-2)] rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[var(--ink)]">📱 Telegram Inquiries Bot (@Inquiryvedantversebot)</span>
                      <span className="vv-badge vv-badge--success">ACTIVE & LINKED</span>
                    </div>
                    <p className="text-[11px] text-[var(--muted)]">
                      Instant message delivered directly to your Telegram chat with one-click WhatsApp and Gmail response buttons.
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="border border-[var(--line)] bg-[var(--surface-2)] rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[var(--ink)]">✉️ Direct Gmail Delivery (contactvedantverse@gmail.com)</span>
                      <span className="vv-badge vv-badge--success">ACTIVE & LINKED</span>
                    </div>
                    <p className="text-[11px] text-[var(--muted)]">
                      Sends full branded lead notifications to contactvedantverse@gmail.com with instant reply buttons.
                    </p>
                  </div>
                </div>
              </div>

              {/* Test button & Live Response */}
              <div className="pt-4 border-t border-[var(--line)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--ink)] uppercase">Live Notification Test</h4>
                    <p className="text-[11px] text-[var(--muted)]">Send a simulated lead ping to verify your mobile and email reception.</p>
                  </div>
                  <button
                    onClick={handleSendTestNotification}
                    disabled={isTestingNotification}
                    className="vv-button vv-button--primary"
                  >
                    {isTestingNotification ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Test Lead
                      </>
                    )}
                  </button>
                </div>

                {testResult && (
                  <div className="bg-[var(--surface-2)] border border-[var(--line)] rounded-lg p-4 space-y-2 text-xs font-mono">
                    <div className="font-bold text-[var(--ink)]">Test Dispatch Results:</div>
                    {testResult.summary?.results?.map((r: any) => (
                      <div key={r.channel} className="flex items-center justify-between py-1 border-b border-[var(--line)] last:border-0">
                        <span className="capitalize text-[var(--ink)]">{r.channel}:</span>
                        <span>
                          {r.configured ? (
                            r.success ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ DELIVERED</span>
                            ) : (
                              <span className="text-red-600 dark:text-red-400 font-bold">✗ FAILED ({r.error?.slice(0, 40)})</span>
                            )
                          ) : (
                            <span className="text-[var(--muted)]">Unconfigured</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Unlock, RefreshCw, LogOut, MessageSquare, Phone, 
  Mail, Star, Trash2, CheckCircle2, AlertCircle, Clock, 
  Search, Filter, Download, Bell, ExternalLink, Send, 
  FileText, Check, ChevronDown, Sparkles, User, DollarSign,
  TrendingUp, BarChart2, MessageCircle
} from 'lucide-react';
import { Inquiry, InquiryStatus } from '../../../lib/inquiries';

const STATUS_CONFIG: Record<InquiryStatus, { label: string; color: string; bg: string; border: string }> = {
  new: {
    label: 'New Lead',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30'
  },
  contacted: {
    label: 'Contacted',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30'
  },
  in_discussion: {
    label: 'In Discussion',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30'
  },
  converted: {
    label: 'Converted (Won)',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30'
  },
  archived: {
    label: 'Archived',
    color: 'text-neutral-400',
    bg: 'bg-neutral-800/40',
    border: 'border-neutral-700/40'
  }
};

export default function AdminCRMPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
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

  // Fetch inquiries
  const fetchInquiries = async (activePin: string) => {
    setLoadingInquiries(true);
    try {
      const res = await fetch(`/api/inquiries?pin=${activePin}`);
      if (res.ok) {
        const list = await res.json();
        setInquiries(list);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  // Fetch Notification Config
  const fetchNotificationStatus = async (activePin: string) => {
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

  // Send Test Notification
  const handleSendTestNotification = async () => {
    const activePin = pin || sessionStorage.getItem('admin_pin') || '';
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

  // Authenticate PIN
  const handlePinSubmit = async (enteredPin: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/analytics?pin=${enteredPin}`);
      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_pin', enteredPin);
        fetchInquiries(enteredPin);
        fetchNotificationStatus(enteredPin);
      } else {
        setError('Incorrect PIN. Access Denied.');
        setPin('');
      }
    } catch (err) {
      setError('Connection failed. Try again.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedPin = sessionStorage.getItem('admin_pin');
    if (savedPin) {
      handlePinSubmit(savedPin);
    }
  }, []);

  // Update Status
  const handleUpdateStatus = async (id: string, newStatus: InquiryStatus) => {
    const activePin = pin || sessionStorage.getItem('admin_pin') || '';
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
    const activePin = pin || sessionStorage.getItem('admin_pin') || '';
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
    const activePin = pin || sessionStorage.getItem('admin_pin') || '';
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
      } else {
        alert('Failed to save notes');
      }
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setIsSavingNote(false);
    }
  };

  // Delete Lead
  const handleDeleteInquiry = async (id: string, index: number) => {
    const activePin = pin || sessionStorage.getItem('admin_pin') || '';
    if (!confirm('Are you sure you want to permanently delete this lead?')) return;
    try {
      const res = await fetch(`/api/inquiries?pin=${activePin}&id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setInquiries(prev => prev.filter(inq => inq.id !== id));
      } else {
        // Fallback to index
        const fallbackRes = await fetch(`/api/inquiries?pin=${activePin}&index=${index}`, {
          method: 'DELETE'
        });
        if (fallbackRes.ok) {
          fetchInquiries(activePin);
        } else {
          alert('Failed to delete lead');
        }
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  // Refresh
  const refreshData = async () => {
    setIsRefreshing(true);
    const activePin = pin || sessionStorage.getItem('admin_pin') || '';
    await fetchInquiries(activePin);
    await fetchNotificationStatus(activePin);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem('admin_pin');
    setIsAuthenticated(false);
    setInquiries([]);
    setPin('');
  };

  // Export CSV
  const exportToCSV = () => {
    if (inquiries.length === 0) return alert('No inquiries to export');
    
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Budget', 'Status', 'Message', 'Notes'];
    const rows = inquiries.map(inq => [
      `"${new Date(inq.timestamp).toLocaleString()}"`,
      `"${inq.name.replace(/"/g, '""')}"`,
      `"${inq.email.replace(/"/g, '""')}"`,
      `"${(inq.phone || '').replace(/"/g, '""')}"`,
      `"${(inq.budget || '').replace(/"/g, '""')}"`,
      `"${inq.status || 'new'}"`,
      `"${inq.message.replace(/"/g, '""')}"`,
      `"${(inq.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vedantverse_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = inq.name.toLowerCase().includes(q);
        const matchesEmail = inq.email.toLowerCase().includes(q);
        const matchesPhone = inq.phone?.toLowerCase().includes(q);
        const matchesMessage = inq.message.toLowerCase().includes(q);
        const matchesNotes = inq.notes?.toLowerCase().includes(q);
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
    const highBudget = inquiries.filter(i => i.budget === '₹15L+' || i.budget === '₹5L - ₹15L').length;

    return { total, newLeads, inDiscussion, converted, starred, highBudget };
  }, [inquiries]);

  // Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#090909] text-white flex flex-col items-center justify-center font-sans z-50 select-none">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-red-950/20 blur-[120px] pointer-events-none" />
        
        <div className="text-center space-y-6 max-w-sm z-10 px-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.35em] block mb-2 font-mono">
              / VEDANTVERSE SECURITY /
            </span>
            <Lock className="w-8 h-8 text-[#E50914] animate-pulse" />
            <h1 className="text-xl font-bold tracking-widest uppercase mt-4">
              Enter Admin CRM PIN
            </h1>
            <p className="text-neutral-500 text-xs tracking-wide">
              Protected pipeline & client inquiries vault.
            </p>
          </div>

          <div className="flex justify-center gap-3 py-2">
            {[0, 1, 2, 3].map((idx) => (
              <div 
                key={idx} 
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                  pin.length > idx 
                    ? 'bg-[#E50914] border-[#E50914] scale-110 shadow-[0_0_10px_rgba(229,9,20,0.8)]' 
                    : 'border-neutral-700 bg-neutral-900/50'
                }`}
              />
            ))}
          </div>

          {error && <div className="text-red-500 text-xs font-mono">{error}</div>}

          <div className="grid grid-cols-3 gap-3 w-56 mx-auto pt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                onClick={() => {
                  if (pin.length < 4) {
                    const next = pin + digit;
                    setPin(next);
                    if (next.length === 4) handlePinSubmit(next);
                  }
                }}
                disabled={loading}
                className="w-16 h-16 rounded-full border border-neutral-800 bg-neutral-950/60 hover:bg-[#E50914]/20 hover:border-[#E50914] flex items-center justify-center text-lg font-bold transition-all duration-200 active:scale-90 cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <div className="w-16 h-16" />
            <button
              onClick={() => {
                if (pin.length < 4) {
                  const next = pin + '0';
                  setPin(next);
                  if (next.length === 4) handlePinSubmit(next);
                }
              }}
              disabled={loading}
              className="w-16 h-16 rounded-full border border-neutral-800 bg-neutral-950/60 hover:bg-[#E50914]/20 hover:border-[#E50914] flex items-center justify-center text-lg font-bold transition-all duration-200 active:scale-90 cursor-pointer"
            >
              0
            </button>
            <button
              onClick={() => pin.length > 0 && setPin(pin.slice(0, -1))}
              disabled={loading}
              className="w-16 h-16 text-neutral-500 hover:text-white flex items-center justify-center text-xs font-semibold tracking-wider cursor-pointer"
            >
              DEL
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans p-4 md:p-10 selection:bg-[#E50914] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-neutral-900 pb-6 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] font-mono">
                / CLIENT RELATIONSHIP MANAGEMENT /
              </span>
              <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[#E50914] text-[10px] font-mono font-bold">
                LIVE PIPELINE
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight uppercase flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-[#E50914]" />
              VEDANTVERSE CRM & LEADS
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/analytics"
              className="flex items-center gap-1.5 px-3.5 py-2 border border-neutral-800 hover:border-neutral-600 bg-neutral-900/60 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
            >
              <BarChart2 className="w-3.5 h-3.5 text-neutral-400" />
              Analytics
            </Link>

            <button
              onClick={() => setShowNotificationModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-red-900/40 hover:border-[#E50914] bg-red-950/20 text-[#E50914] hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer relative"
            >
              <Bell className="w-3.5 h-3.5" />
              Phone / Mail Alerts
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute -top-0.5 -right-0.5" />
            </button>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-neutral-800 hover:border-neutral-600 bg-neutral-900/60 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              Export CSV
            </button>

            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-neutral-800 hover:border-white bg-neutral-950/80 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#E50914] ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-red-900/30 hover:border-red-600 bg-red-950/10 text-red-500 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Lock
            </button>
          </div>
        </header>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
          <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-4 space-y-1">
            <span className="text-[10px] uppercase font-mono text-neutral-500 font-bold block">Total Leads</span>
            <div className="text-2xl font-black text-white">{metrics.total}</div>
            <span className="text-[10px] text-neutral-500">All submissions</span>
          </div>

          <div className="bg-neutral-950/60 border border-red-900/30 rounded-xl p-4 space-y-1 relative overflow-hidden">
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] uppercase font-mono text-red-400 font-bold block">New / Unread</span>
            <div className="text-2xl font-black text-white">{metrics.newLeads}</div>
            <span className="text-[10px] text-red-400/80">Pending review</span>
          </div>

          <div className="bg-neutral-950/60 border border-purple-900/30 rounded-xl p-4 space-y-1">
            <span className="text-[10px] uppercase font-mono text-purple-400 font-bold block">In Discussion</span>
            <div className="text-2xl font-black text-white">{metrics.inDiscussion}</div>
            <span className="text-[10px] text-purple-400/80">Active talks</span>
          </div>

          <div className="bg-neutral-950/60 border border-emerald-900/30 rounded-xl p-4 space-y-1">
            <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">Converted</span>
            <div className="text-2xl font-black text-emerald-400">{metrics.converted}</div>
            <span className="text-[10px] text-emerald-500/80">Closed campaigns</span>
          </div>

          <div className="bg-neutral-950/60 border border-amber-900/30 rounded-xl p-4 space-y-1">
            <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block">Starred VIPs</span>
            <div className="text-2xl font-black text-amber-400">{metrics.starred}</div>
            <span className="text-[10px] text-amber-500/80">Bookmarked</span>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-4 space-y-1">
            <span className="text-[10px] uppercase font-mono text-neutral-500 font-bold block">High Budget</span>
            <div className="text-2xl font-black text-white">{metrics.highBudget}</div>
            <span className="text-[10px] text-neutral-500">₹5L+ inquiries</span>
          </div>
        </div>

        {/* Search, Filter & Tabs Bar */}
        <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2 w-full md:w-80 bg-neutral-900/60 border border-neutral-800 rounded-lg px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-neutral-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, phone, message..."
              className="w-full bg-transparent text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Pills */}
            <div className="flex items-center gap-1 bg-neutral-900/50 p-1 rounded-lg border border-neutral-800 text-[11px] font-mono">
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
                  className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                    selectedStatus === tab.id
                      ? 'bg-[#E50914] text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
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
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300 font-mono focus:outline-none cursor-pointer"
            >
              <option value="all">All Budgets</option>
              <option value="₹15L+">₹15L+</option>
              <option value="₹5L - ₹15L">₹5L - ₹15L</option>
              <option value="₹1L - ₹5L">₹1L - ₹5L</option>
              <option value="< ₹1L">&lt; ₹1L</option>
            </select>
          </div>
        </div>

        {/* Lead Table / Cards */}
        <section className="bg-neutral-950/60 border border-neutral-900 rounded-xl overflow-hidden shadow-2xl">
          {loadingInquiries ? (
            <div className="py-20 text-center text-neutral-500 font-mono text-xs">
              <RefreshCw className="w-6 h-6 animate-spin text-[#E50914] mx-auto mb-2" />
              Loading portfolio leads...
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="py-20 text-center text-neutral-500 space-y-2">
              <MessageSquare className="w-10 h-10 mx-auto text-neutral-700" />
              <p className="text-sm font-semibold text-neutral-400">No inquiries found matching criteria</p>
              <p className="text-xs text-neutral-600">When visitors fill your Contact Me form, they appear here instantly.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-900">
              {filteredInquiries.map((inq, idx) => {
                const currentStatus = inq.status || 'new';
                const statusMeta = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new;
                const isEditingNotes = editingNotesId === inq.id;

                return (
                  <div key={inq.id || idx} className="p-5 hover:bg-neutral-900/20 transition-colors space-y-4">
                    {/* Top Row: Client Info, Star, Status Dropdown, Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleStar(inq.id, inq.starred)}
                          title="Star / VIP Client"
                          className="cursor-pointer text-neutral-600 hover:text-amber-400 transition-colors"
                        >
                          <Star className={`w-5 h-5 ${inq.starred ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-base text-white tracking-wide">{inq.name}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/20">
                              {inq.budget}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-0.5 font-mono">
                            <span className="flex items-center gap-1 text-neutral-500">
                              <Clock className="w-3 h-3" />
                              {new Date(inq.timestamp).toLocaleString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span>•</span>
                            <a href={`mailto:${inq.email}`} className="text-blue-400 hover:underline flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {inq.email}
                            </a>
                            {inq.phone && (
                              <>
                                <span>•</span>
                                <a 
                                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  {inq.phone}
                                </a>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Selector & Quick Actions */}
                      <div className="flex items-center gap-2 self-start md:self-auto">
                        {/* Status selector */}
                        <div className="relative">
                          <select
                            value={currentStatus}
                            onChange={(e) => handleUpdateStatus(inq.id, e.target.value as InquiryStatus)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border cursor-pointer appearance-none pr-8 ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border} focus:outline-none`}
                          >
                            <option value="new" className="bg-neutral-900 text-white">🔴 New Lead</option>
                            <option value="contacted" className="bg-neutral-900 text-white">🟡 Contacted</option>
                            <option value="in_discussion" className="bg-neutral-900 text-white">🟣 In Discussion</option>
                            <option value="converted" className="bg-neutral-900 text-white">🟢 Converted (Won)</option>
                            <option value="archived" className="bg-neutral-900 text-white">⚪ Archived</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
                        </div>

                        {/* Quick Email Reply */}
                        <a
                          href={`mailto:${inq.email}?subject=Re:%20Media%20Buying%20/%20Campaign%20Inquiry%20-%20VedantVerse&body=Hi%20${encodeURIComponent(inq.name)},%0A%0AThank%20you%20for%20reaching%20out%20through%20my%20portfolio!%20I%20reviewed%20your%20campaign%20requirements%20(${encodeURIComponent(inq.budget)}%20monthly%20budget)%20and%20would%20love%20to%20schedule%20a%20quick%20intro%20call.`}
                          title="Reply via Email"
                          className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Email</span>
                        </a>

                        {/* Quick WhatsApp Chat */}
                        {inq.phone && (
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(inq.name)},%20Vedant%20here%20from%20VedantVerse.%20I%20received%20your%20campaign%20inquiry!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </a>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteInquiry(inq.id, idx)}
                          title="Delete Lead"
                          className="p-2 rounded-lg bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 hover:border-red-600 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Message Box */}
                    <div className="bg-neutral-900/40 border border-neutral-900 rounded-lg p-3.5 text-xs text-neutral-300 font-light leading-relaxed whitespace-pre-wrap">
                      <span className="text-[10px] text-neutral-500 font-bold uppercase font-mono block mb-1">Inquiry Message:</span>
                      {inq.message}
                    </div>

                    {/* Internal CRM Notes Section */}
                    <div className="pt-1">
                      {isEditingNotes ? (
                        <div className="space-y-2 bg-neutral-900/70 border border-neutral-800 rounded-lg p-3">
                          <label className="text-[10px] font-mono text-neutral-400 font-bold uppercase block">
                            Internal Follow-up Notes:
                          </label>
                          <textarea
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            rows={3}
                            placeholder="e.g. Sent introductory deck on WhatsApp; promised to follow up on Friday with ad audit..."
                            className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E50914]"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-3 py-1 text-xs text-neutral-400 hover:text-white cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNotes(inq.id)}
                              disabled={isSavingNote}
                              className="px-4 py-1 bg-[#E50914] text-white text-xs font-bold rounded cursor-pointer hover:bg-red-600 active:scale-95 transition-all"
                            >
                              {isSavingNote ? 'Saving...' : 'Save Note'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-neutral-400 bg-neutral-950/40 border border-neutral-900/80 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                            {inq.notes ? (
                              <span className="text-neutral-300 font-mono text-[11px]">{inq.notes}</span>
                            ) : (
                              <span className="text-neutral-600 italic text-[11px]">No internal notes yet.</span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setEditingNotesId(inq.id);
                              setTempNotes(inq.notes || '');
                            }}
                            className="text-[#E50914] hover:underline text-[11px] font-mono cursor-pointer shrink-0 font-bold"
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
        </section>

        {/* Notification Testing & Setup Modal */}
        <AnimatePresence>
          {showNotificationModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                  <div className="flex items-center gap-2">
                    <Bell className="w-6 h-6 text-[#E50914]" />
                    <h2 className="text-lg font-black uppercase tracking-wider text-white">
                      Instant Notification Channels
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowNotificationModal(false)}
                    className="text-neutral-500 hover:text-white text-xs font-mono cursor-pointer"
                  >
                    [CLOSE]
                  </button>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  When someone submits your Contact Me form, the system dispatches instant alerts across all enabled channels below. Configure your credentials in <code className="text-[#E50914] font-mono bg-neutral-900 px-1 py-0.5 rounded">.env.local</code>.
                </p>

                {/* Channel List Status */}
                <div className="space-y-3">
                  {/* Telegram */}
                  <div className="border border-neutral-900 bg-neutral-900/30 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">📱 Telegram Bot (Direct to Phone)</span>
                        {channelStatus?.telegram?.configured ? (
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] rounded font-mono font-bold">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-800 text-neutral-500 text-[10px] rounded font-mono">
                            NOT CONFIGURED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        Sends instant message directly to your Telegram chat with one-click reply links. (Env: <code className="text-neutral-400">TELEGRAM_BOT_TOKEN</code>, <code className="text-neutral-400">TELEGRAM_CHAT_ID</code>)
                      </p>
                    </div>
                  </div>

                  {/* Discord */}
                  <div className="border border-neutral-900 bg-neutral-900/30 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">💬 Discord Webhook (Mobile / Desktop)</span>
                        {channelStatus?.discord?.configured ? (
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] rounded font-mono font-bold">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-800 text-neutral-500 text-[10px] rounded font-mono">
                            NOT CONFIGURED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        Pings your private Discord channel with a rich embed card. (Env: <code className="text-neutral-400">DISCORD_WEBHOOK_URL</code>)
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="border border-neutral-900 bg-neutral-900/30 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">✉️ Email Alerts (via Resend)</span>
                        {channelStatus?.email?.configured ? (
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] rounded font-mono font-bold">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-800 text-neutral-500 text-[10px] rounded font-mono">
                            NOT CONFIGURED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        Sends branded HTML email to your inbox with direct Reply-To. (Env: <code className="text-neutral-400">RESEND_API_KEY</code>, <code className="text-neutral-400">NOTIFICATION_EMAIL</code>)
                      </p>
                    </div>
                  </div>

                  {/* ntfy.sh */}
                  <div className="border border-neutral-900 bg-neutral-900/30 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">🔔 ntfy.sh (Zero-Account Phone Push)</span>
                        {channelStatus?.ntfy?.configured ? (
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] rounded font-mono font-bold">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-800 text-neutral-500 text-[10px] rounded font-mono">
                            NOT CONFIGURED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        Free iOS/Android push notifications with sound. (Env: <code className="text-neutral-400">NTFY_TOPIC</code>)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Test button & Live Response */}
                <div className="pt-4 border-t border-neutral-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-white">Live Notification Tester</h4>
                      <p className="text-[11px] text-neutral-500">Send a simulated lead ping to verify your mobile/mail reception.</p>
                    </div>
                    <button
                      onClick={handleSendTestNotification}
                      disabled={isTestingNotification}
                      className="px-5 py-2.5 bg-[#E50914] hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isTestingNotification ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Send Test Ping
                        </>
                      )}
                    </button>
                  </div>

                  {testResult && (
                    <div className="bg-neutral-900/80 border border-neutral-800 rounded-lg p-4 space-y-2 text-xs font-mono">
                      <div className="font-bold text-neutral-300">Test Dispatch Results:</div>
                      {testResult.summary?.results?.map((r: any) => (
                        <div key={r.channel} className="flex items-center justify-between py-1 border-b border-neutral-800/60 last:border-0">
                          <span className="capitalize">{r.channel}:</span>
                          <span>
                            {r.configured ? (
                              r.success ? (
                                <span className="text-emerald-400 font-bold">✓ DELIVERED</span>
                              ) : (
                                <span className="text-red-400 font-bold">✗ FAILED ({r.error?.slice(0, 40)})</span>
                              )
                            ) : (
                              <span className="text-neutral-600">Skipped (No Key)</span>
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
    </div>
  );
}

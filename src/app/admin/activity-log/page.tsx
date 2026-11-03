'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Search,
  Filter,
  FileEdit,
  Send,
  Lock,
  Server,
  Calendar,
  User,
  ArrowRight,
  Eye,
  RefreshCw,
  Download,
  X,
} from 'lucide-react';
import { AuditLogEntry } from '../../../lib/auditLog';

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'content' | 'publishing' | 'access' | 'system'>('all');
  const [userFilter, setUserFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const fetchLogs = () => {
    setLoading(true);
    fetch('/api/activity-log')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching logs:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const counts = useMemo(() => {
    return {
      content: logs.filter((l) => l.category === 'content').length,
      publishing: logs.filter((l) => l.category === 'publishing').length,
      access: logs.filter((l) => l.category === 'access').length,
      system: logs.filter((l) => l.category === 'system').length,
    };
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;
      if (userFilter !== 'all' && log.user !== userFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const actionMatch = log.action.toLowerCase().includes(q);
        const detailsMatch = (log.details || '').toLowerCase().includes(q);
        const userMatch = log.user.toLowerCase().includes(q);
        const targetMatch = (log.targetTitle || '').toLowerCase().includes(q);
        if (!actionMatch && !detailsMatch && !userMatch && !targetMatch) return false;
      }
      return true;
    });
  }, [logs, categoryFilter, userFilter, searchQuery]);

  const uniqueUsers = useMemo(() => {
    const set = new Set(logs.map((l) => l.user));
    return Array.from(set);
  }, [logs]);

  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vedantverse-audit-log-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
            VEDANTVERSE CMS • AUDIT TRAIL
          </div>
          <h1 className="vv-h1">Activity log</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
            A complete, tamper-resistant audit trail across content changes, publishing events, user access, and system deployments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchLogs} className="vv-button vv-button--secondary">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button onClick={exportJson} className="vv-button vv-button--secondary">
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* 4 Category Summary Cards (From Figma Design) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            id: 'content',
            title: 'Content changes',
            icon: <FileEdit className="w-5 h-5 text-amber-600" />,
            bg: 'bg-amber-50 dark:bg-amber-950/40',
            border: 'border-amber-200 dark:border-amber-900',
            desc: `${counts.content} edits recorded`,
          },
          {
            id: 'publishing',
            title: 'Publishing events',
            icon: <Send className="w-5 h-5 text-emerald-600" />,
            bg: 'bg-emerald-50 dark:bg-emerald-950/40',
            border: 'border-emerald-200 dark:border-emerald-900',
            desc: `${counts.publishing} live releases`,
          },
          {
            id: 'access',
            title: 'User access',
            icon: <Lock className="w-5 h-5 text-blue-600" />,
            bg: 'bg-blue-50 dark:bg-blue-950/40',
            border: 'border-blue-200 dark:border-blue-900',
            desc: `${counts.access} session events`,
          },
          {
            id: 'system',
            title: 'System events',
            icon: <Server className="w-5 h-5 text-purple-600" />,
            bg: 'bg-purple-50 dark:bg-purple-950/40',
            border: 'border-purple-200 dark:border-purple-900',
            desc: `${counts.system} operational logs`,
          },
        ].map((cat) => {
          const isSelected = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(isSelected ? 'all' : (cat.id as any))}
              className={`vv-card p-5 text-left transition-all cursor-pointer ${
                isSelected ? 'ring-2 ring-[var(--accent)] border-transparent' : 'hover:-translate-y-0.5'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.border} border flex items-center justify-center mb-6`}>
                {cat.icon}
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">{cat.title}</h3>
              <p className="text-xs text-[var(--muted)] mt-1">{cat.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">
                <span>{isSelected ? 'Filter active' : 'Filter by this'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="vv-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search action, details, user, or target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="vv-input pl-10"
          />
        </div>

        {/* User filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--muted)]" />
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="vv-input py-2 text-xs w-auto min-h-0"
            >
              <option value="all">All contributors</option>
              {uniqueUsers.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="vv-input py-2 text-xs w-auto min-h-0"
          >
            <option value="all">All categories</option>
            <option value="content">Content changes</option>
            <option value="publishing">Publishing events</option>
            <option value="access">User access</option>
            <option value="system">System events</option>
          </select>

          {(categoryFilter !== 'all' || userFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setCategoryFilter('all');
                setUserFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-mono text-[var(--accent)] hover:underline whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="vv-card overflow-hidden">
        <div className="vv-table-head grid-cols-[1.5fr_120px_140px_140px_70px]">
          <span>ACTION / EVENT</span>
          <span>CATEGORY</span>
          <span>CONTRIBUTOR</span>
          <span>TIMESTAMP</span>
          <span className="text-right">DIFF</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[var(--muted)]">
            Loading audit records...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[var(--muted)]">
            No audit records matching criteria.
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)]">
            {filteredLogs.map((log) => {
              const dateStr = new Date(log.timestamp).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="vv-table-row grid-cols-[1.5fr_120px_140px_140px_70px] cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[var(--ink)] truncate">{log.action}</div>
                    {log.details && (
                      <div className="text-xs text-[var(--muted)] truncate mt-0.5">{log.details}</div>
                    )}
                  </div>

                  <div>
                    <span className={`vv-badge ${
                      log.category === 'publishing'
                        ? 'vv-badge--success'
                        : log.category === 'content'
                        ? 'vv-badge--warning'
                        : log.category === 'access'
                        ? 'vv-badge--accent'
                        : ''
                    }`}>
                      {log.category}
                    </span>
                  </div>

                  <div className="text-xs font-mono">
                    <div className="font-semibold text-[var(--ink)] truncate">{log.user}</div>
                    <div className="text-[10px] text-[var(--muted)]">{log.userRole}</div>
                  </div>

                  <div className="text-xs font-mono text-[var(--muted)]">{dateStr}</div>

                  <div className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(log);
                      }}
                      className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--accent)]"
                      title="Inspect record"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail & Diff Modal */}
      {selectedLog && (
        <div className="vv-modal-backdrop">
          <div className="vv-modal">
            <div className="flex items-center justify-between border-b border-[var(--line)] p-5">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-[var(--accent)]" />
                <h3 className="text-base font-bold text-[var(--ink)]">Audit Log Inspection</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="vv-icon-button">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">ACTION</div>
                <div className="text-base font-bold text-[var(--ink)] mt-1">{selectedLog.action}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[var(--surface-2)] p-4 rounded-xl border border-[var(--line)]">
                <div>
                  <span className="text-[var(--muted)]">Category:</span>
                  <span className="ml-2 font-bold uppercase">{selectedLog.category}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Target Type:</span>
                  <span className="ml-2 font-bold">{selectedLog.targetType}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Contributor:</span>
                  <span className="ml-2 font-bold">{selectedLog.user} ({selectedLog.userRole})</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Timestamp:</span>
                  <span className="ml-2 font-bold">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {selectedLog.details && (
                <div>
                  <div className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider mb-1">AUDIT SUMMARY</div>
                  <p className="text-xs text-[var(--ink)] leading-relaxed bg-[var(--surface)] p-3 rounded-lg border border-[var(--line)]">
                    {selectedLog.details}
                  </p>
                </div>
              )}

              {(selectedLog.beforeState || selectedLog.afterState) && (
                <div className="space-y-2">
                  <div className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">STATE COMPARISON</div>
                  <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                    <div className="p-3 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                      <div className="font-bold text-red-600 mb-1">PREVIOUS STATE</div>
                      <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(selectedLog.beforeState, null, 2)}</pre>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                      <div className="font-bold text-emerald-600 mb-1">UPDATED STATE</div>
                      <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(selectedLog.afterState, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button onClick={() => setSelectedLog(null)} className="vv-button vv-button--secondary">
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


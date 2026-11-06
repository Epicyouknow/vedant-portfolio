'use client';

import React, { useState, useEffect } from 'react';
import GrowthDeskHeader from '../../../../components/growth-desk/GrowthDeskHeader';
import {
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  RotateCcw,
  Search,
  RefreshCw,
  Layers
} from 'lucide-react';
import { JobLog } from '../../../../lib/growthDeskStorage';

export default function GrowthDeskLogsPage() {
  const [logs, setLogs] = useState<JobLog[]>([]);
  const [running, setRunning] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const fetchLogs = () => {
    fetch('/api/growth-desk/logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.logs);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleTriggerCycle = async () => {
    setRunning(true);
    try {
      const res = await fetch('/api/growth-desk/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger-cycle' })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Scheduled cycle executed successfully.');
        setTimeout(() => setMessage(''), 3000);
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.jobName.toLowerCase().includes(search.toLowerCase()) ||
      l.stage.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <GrowthDeskHeader
        currentModule="Logs"
        subtitle="Persistent audit trail of automated scheduled tasks, research executions and publishing gates"
        actions={
          <button
            onClick={handleTriggerCycle}
            disabled={running}
            className="vv-button-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            {running ? 'Executing...' : 'Trigger Cycle Run'}
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase text-[var(--muted)]">
            Execution Trail ({filteredLogs.length} Records)
          </span>
          {message && (
            <span className="text-xs font-mono text-emerald-600 font-bold animate-pulse">
              • {message}
            </span>
          )}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job logs..."
            className="w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-hidden focus:ring-1 focus:ring-[#ED463B]"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="vv-card overflow-hidden">
        <div className="vv-table-container">
          <div className="vv-table-head grid-cols-12 text-[10px] font-mono uppercase font-bold">
            <div className="col-span-3">Timestamp & Task</div>
            <div className="col-span-3">Pipeline Stage</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Duration</div>
            <div className="col-span-3">Execution Details</div>
          </div>

          <div className="divide-y divide-[var(--line)]">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--muted)]">
                No logs recorded yet.
              </div>
            ) : (
              filteredLogs.map((l) => (
                <div
                  key={l.id}
                  className="vv-table-row grid-cols-12 text-xs py-3.5 hover:bg-[var(--surface-2)] transition-colors items-center"
                >
                  <div className="col-span-3 min-w-0 pr-2">
                    <div className="font-bold text-[var(--ink)] truncate">
                      {l.jobName}
                    </div>
                    <div className="text-[10px] font-mono text-[var(--muted)]">
                      {new Date(l.timestamp).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <div className="col-span-3 font-mono text-[11px] text-[var(--muted)] truncate">
                    {l.stage}
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        l.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : l.status === 'In-Progress'
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                      }`}
                    >
                      ● {l.status}
                    </span>
                  </div>

                  <div className="col-span-1 font-mono text-[11px] text-[var(--muted)]">
                    {l.duration}
                  </div>

                  <div className="col-span-3 text-[11px] text-[var(--muted)] truncate pr-2">
                    {l.details}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

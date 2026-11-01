'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Plus,
  Eye,
  ExternalLink,
  Briefcase,
  CheckCircle2,
  X,
  Upload,
} from 'lucide-react';
import { CLIENTS_DATA } from '../../../data/clientsData';

export default function ClientDirectoryPage() {
  const [clients, setClients] = useState(CLIENTS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filtered = clients.filter((c) => {
    if (!searchQuery.trim()) return true;
    return c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
            SHARED SOURCE OF TRUTH • CLIENT ROSTER
          </div>
          <h1 className="vv-h1">Client directory</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
            Client brand profiles, verified logos, marquee ticker presence, and linked performance case studies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/case-studies" className="vv-button vv-button--primary">
            <Plus className="w-4 h-4" />
            <span>Add client case study</span>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="vv-card p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search clients by brand, industry, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="vv-input pl-10"
          />
        </div>
      </div>

      {/* Grid of Clients */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((client) => (
          <div
            key={client.slug}
            className="vv-card p-5 flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-12 rounded-xl bg-[var(--surface-2)] p-1.5 border border-[var(--line)] flex items-center justify-center">
                  <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain" />
                </div>
                <span className="vv-badge vv-badge--success">
                  Marquee Visible
                </span>
              </div>

              <h3 className="text-base font-bold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                {client.name}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">
                {client.subtitle || client.campaign}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--muted)] capitalize">{client.category}</span>
              <Link
                href={`/clients/${client.slug}`}
                target="_blank"
                className="text-[var(--accent)] font-bold flex items-center gap-1 hover:underline"
              >
                <span>Case study</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {toastMessage && (
        <div className="vv-toast">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)] font-bold text-xs">
            ✓
          </span>
          <div className="text-xs font-semibold text-[var(--ink)]">{toastMessage}</div>
        </div>
      )}
    </div>
  );
}

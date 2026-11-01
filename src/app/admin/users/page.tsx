'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  ShieldCheck,
  Lock,
  Mail,
  UserCheck,
  MoreVertical,
  X,
  CheckCircle2,
} from 'lucide-react';
import { AdminRole, AdminUser, DEFAULT_USERS } from '../../../lib/adminAuth';

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>(DEFAULT_USERS);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('Editor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      name: newName || newEmail.split('@')[0],
      email: newEmail,
      role: newRole,
      status: 'Invited',
      lastActive: 'Pending response',
    };

    setUsers([...users, newUser]);
    setInviteOpen(false);
    setNewEmail('');
    setNewName('');
    showToast(`Invitation sent to ${newEmail} as ${newRole}`);
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
            ACCESS CONTROL • PERMISSION MATRIX
          </div>
          <h1 className="vv-h1">User management</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
            Manage authorized collaborators, role boundaries, and editorial access rights across the VedantVerse CMS.
          </p>
        </div>

        <button onClick={() => setInviteOpen(true)} className="vv-button vv-button--primary">
          <Plus className="w-4 h-4" />
          <span>Invite collaborator</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="vv-card overflow-hidden">
        <div className="vv-table-head grid-cols-[1.5fr_140px_110px_140px_50px]">
          <span>CONTRIBUTOR</span>
          <span>ROLE</span>
          <span>STATUS</span>
          <span>LAST ACTIVE</span>
          <span />
        </div>

        <div className="divide-y divide-[var(--line)]">
          {users.map((u) => (
            <div key={u.id} className="vv-table-row grid-cols-[1.5fr_140px_110px_140px_50px]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)] font-mono">
                  {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[var(--ink)] truncate">{u.name}</div>
                  <div className="text-xs text-[var(--muted)] font-mono truncate">{u.email}</div>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-[var(--ink)]">
                  {u.role}
                </span>
              </div>

              <div>
                <span className={`vv-badge ${
                  u.status === 'Active' ? 'vv-badge--success' : 'vv-badge--warning'
                }`}>
                  {u.status}
                </span>
              </div>

              <div className="text-xs font-mono text-[var(--muted)]">{u.lastActive}</div>

              <div className="text-right">
                <button className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--surface-2)]">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Boundaries Reference */}
      <section className="vv-card p-6 space-y-4">
        <h2 className="vv-h2">Role permission boundaries</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { role: 'Owner', desc: 'Full authority over code, publishing, settings, users, and deployments.' },
            { role: 'Admin', desc: 'Content and publishing authority; cannot delete primary system owners.' },
            { role: 'Editor', desc: 'Can create and edit case studies, blogs, and media. Saves drafts.' },
            { role: 'Blog Contributor', desc: 'Can create and draft assigned blog posts only. Cannot publish.' },
            { role: 'Viewer', desc: 'Read-only access to campaign analytics, reports, and content.' },
          ].map((r) => (
            <div key={r.role} className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] space-y-1">
              <div className="text-xs font-bold font-mono text-[var(--accent)] uppercase">{r.role}</div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Invite Modal */}
      {inviteOpen && (
        <div className="vv-modal-backdrop">
          <div className="vv-modal">
            <div className="flex items-center justify-between border-b border-[var(--line)] p-5">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--accent)]" />
                <h3 className="text-base font-bold text-[var(--ink)]">Invite Contributor</h3>
              </div>
              <button onClick={() => setInviteOpen(false)} className="vv-icon-button">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="vv-input"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="collaborator@brand.com"
                  className="vv-input font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1">
                  ASSIGNED ROLE
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminRole)}
                  className="vv-input"
                >
                  <option value="Editor">Editor</option>
                  <option value="Blog Contributor">Blog Contributor</option>
                  <option value="Viewer">Viewer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteOpen(false)}
                  className="vv-button vv-button--ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="vv-button vv-button--primary">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

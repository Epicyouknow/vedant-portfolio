'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './admin.css';
import {
  LayoutDashboard,
  Globe,
  Activity,
  Home,
  Briefcase,
  BookOpen,
  FileText,
  Users,
  Image as ImageIcon,
  MessageSquareQuote,
  Milestone,
  Sparkles,
  Search,
  Settings,
  ShieldCheck,
  Eye,
  Bell,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  ExternalLink,
  Lock,
  LogOut,
  ChevronRight,
  TrendingUp,
  Inbox,
  BarChart3,
} from 'lucide-react';
import { AdminRole, DEFAULT_USERS } from '../../lib/adminAuth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [currentRole, setCurrentRole] = useState<AdminRole>('Owner');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ message: string; tone?: 'success' | 'danger' } | null>(null);

  // Initialize theme from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('vedant_admin_theme');
      if (savedTheme === 'dark') {
        setDark(true);
      }
      const savedRole = localStorage.getItem('vedant_admin_role');
      if (savedRole) {
        setCurrentRole(savedRole as AdminRole);
      }
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem('vedant_admin_theme', next ? 'dark' : 'light');
    } catch (e) {}
  };

  const selectRole = (role: AdminRole) => {
    setCurrentRole(role);
    setShowRoleModal(false);
    try {
      localStorage.setItem('vedant_admin_role', role);
    } catch (e) {}
    showToast(`Switched active role to ${role}`);
  };

  const showToast = (message: string, tone: 'success' | 'danger' = 'success') => {
    setNotification({ message, tone });
    setTimeout(() => setNotification(null), 3500);
  };

  const navGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
        { label: 'Website Overview', href: '/admin/website-overview', icon: <Globe className="w-4 h-4 shrink-0" /> },
        { label: 'Activity Log', href: '/admin/activity-log', icon: <Activity className="w-4 h-4 shrink-0" />, badge: 'Audit' },
      ],
    },
    {
      label: 'Content Management',
      items: [
        { label: 'Homepage Editor', href: '/admin/homepage', icon: <Home className="w-4 h-4 shrink-0" /> },
        { label: 'Case Studies', href: '/admin/case-studies', icon: <Briefcase className="w-4 h-4 shrink-0" />, badge: 'Core' },
        { label: 'Blog Manager', href: '/admin/blogs', icon: <BookOpen className="w-4 h-4 shrink-0" />, badge: 'Core' },
        { label: 'Pages Manager', href: '/admin/pages', icon: <FileText className="w-4 h-4 shrink-0" /> },
        { label: 'Client Directory', href: '/admin/clients', icon: <Users className="w-4 h-4 shrink-0" /> },
        { label: 'Media Library', href: '/admin/media', icon: <ImageIcon className="w-4 h-4 shrink-0" /> },
        { label: 'Testimonials', href: '/admin/testimonials', icon: <MessageSquareQuote className="w-4 h-4 shrink-0" /> },
        { label: 'Experience & Journey', href: '/admin/experience', icon: <Milestone className="w-4 h-4 shrink-0" /> },
        { label: 'Services', href: '/admin/services', icon: <Sparkles className="w-4 h-4 shrink-0" /> },
      ],
    },
    {
      label: 'Discoverability & Leads',
      items: [
        { label: 'SEO & AEO Dashboard', href: '/admin/seo', icon: <Search className="w-4 h-4 shrink-0" /> },
        { label: 'Form Inquiries', href: '/admin/crm', icon: <Inbox className="w-4 h-4 shrink-0" /> },
        { label: 'Traffic Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4 shrink-0" /> },
      ],
    },
    {
      label: 'System & Security',
      items: [
        { label: 'User Management', href: '/admin/users', icon: <ShieldCheck className="w-4 h-4 shrink-0" /> },
        { label: 'System Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4 shrink-0" /> },
      ],
    },
  ];

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="vv-admin-root">
        {/* ── Sidebar (Desktop) ── */}
        <aside className={`vv-sidebar hidden lg:flex ${collapsed ? 'is-collapsed' : ''}`}>
          {/* Logo & Workspace Brand */}
          <div className="flex h-16 items-center gap-3 border-b border-[var(--line)] px-5">
            <Link href="/admin/dashboard" className="flex items-center gap-3 min-w-0">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--ink)] text-sm font-black text-white dark:bg-white dark:text-black shadow-xs">
                V
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="text-[13px] font-extrabold tracking-wider text-[var(--ink)]">
                    VEDANTVERSE
                  </div>
                  <div className="text-[10px] text-[var(--muted)] font-mono">
                    CMS Command Centre
                  </div>
                </div>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="ml-auto rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="vv-sidebar-scroll px-3 space-y-6">
            {navGroups.map((group) => (
              <div key={group.label}>
                {!collapsed && (
                  <div className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--muted)] font-mono">
                    {group.label}
                  </div>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={`vv-nav-item ${isActive ? 'is-active' : ''}`}
                      >
                        {item.icon}
                        {!collapsed && (
                          <span className="truncate flex-1">{item.label}</span>
                        )}
                        {!collapsed && item.badge && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--muted)]">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* User profile footer */}
          <div className="border-t border-[var(--line)] p-3">
            <button
              onClick={() => setShowRoleModal(true)}
              className="vv-nav-item w-full justify-between"
              title="Switch user role"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[10px] font-bold text-[var(--accent)]">
                  VT
                </div>
                {!collapsed && (
                  <div className="min-w-0 text-left">
                    <div className="text-xs font-semibold truncate text-[var(--ink)]">Vedant Tiwari</div>
                    <div className="text-[10px] text-[var(--muted)] font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                      {currentRole}
                    </div>
                  </div>
                )}
              </div>
              {!collapsed && <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)]" />}
            </button>
          </div>
        </aside>

        {/* ── Mobile Sidebar Drawer ── */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-[var(--surface)] h-full border-r border-[var(--line)] flex flex-col z-10">
              <div className="flex h-16 items-center justify-between border-b border-[var(--line)] px-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--ink)] text-xs font-black text-white dark:bg-white dark:text-black">
                    V
                  </div>
                  <div>
                    <div className="text-xs font-extrabold tracking-wider">VEDANTVERSE</div>
                    <div className="text-[9px] text-[var(--muted)] font-mono">CMS Command Centre</div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--surface-2)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-5">
                {navGroups.map((group) => (
                  <div key={group.label}>
                    <div className="mb-2 px-3 text-[9px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono">
                      {group.label}
                    </div>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`vv-nav-item ${isActive ? 'is-active' : ''}`}
                          >
                            {item.icon}
                            <span className="truncate flex-1">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Main Content Area ── */}
        <div className="min-w-0 flex-1 flex flex-col">
          {/* Top Header */}
          <header className="vv-header">
            {/* Breadcrumb & mobile menu */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg text-[var(--muted)] hover:bg-[var(--surface-2)] cursor-pointer"
                aria-label="Open navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--muted)] font-mono">
                <span>VedantVerse</span>
                <span className="text-[var(--line-strong)]">/</span>
                <span className="text-[var(--ink)] font-semibold truncate capitalize">
                  {pathname?.replace('/admin/', '').replace('/admin', 'Dashboard') || 'Command Centre'}
                </span>
              </div>
            </div>

            {/* Quick Actions & Header Controls */}
            <div className="flex items-center gap-2.5">
              {/* Live Website Status pill */}
              <Link
                href="/admin/website-overview"
                className="vv-site-status hidden md:inline-flex"
                title="View website infrastructure status"
              >
                <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                <span>Website live</span>
              </Link>

              {/* View Public Site button */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="vv-button vv-button--secondary"
                title="Open live public portfolio in new tab"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View site</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="vv-icon-button"
                aria-label="Toggle theme"
                title="Switch dark / light theme"
              >
                {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </header>

          {/* Main Module Content */}
          <main className="vv-main flex-1">
            {children}
          </main>
        </div>

        {/* Role Switcher Modal */}
        {showRoleModal && (
          <div className="vv-modal-backdrop">
            <div className="vv-modal">
              <div className="flex items-center justify-between border-b border-[var(--line)] p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[var(--accent)]" />
                  <h3 className="text-base font-bold">Switch Access Role</h3>
                </div>
                <button onClick={() => setShowRoleModal(false)} className="vv-icon-button">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Test role-based access control (RBAC) boundaries directly in the Command Centre:
                </p>

                <div className="space-y-2">
                  {(['Owner', 'Admin', 'Editor', 'Blog Contributor', 'Viewer'] as AdminRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => selectRole(role)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                        currentRole === role
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]/40 text-[var(--accent)]'
                          : 'border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--ink)]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold font-mono">{role}</div>
                        <div className="text-[11px] text-[var(--muted)] mt-0.5">
                          {role === 'Owner' && 'Full access to all modules, publishing, settings, and users.'}
                          {role === 'Admin' && 'Content and publishing authority; cannot delete primary owners.'}
                          {role === 'Editor' && 'Create and edit case studies, blogs, and media. Save drafts.'}
                          {role === 'Blog Contributor' && 'Create and draft blog articles only. Cannot publish.'}
                          {role === 'Viewer' && 'Read-only visibility across analytics and content.'}
                        </div>
                      </div>
                      {currentRole === role && <span className="text-xs font-bold">Active</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {notification && (
          <div className={`vv-toast ${notification.tone === 'danger' ? 'is-danger' : ''}`}>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)] shrink-0 font-bold text-xs">
              ✓
            </span>
            <div className="text-xs font-semibold text-[var(--ink)]">{notification.message}</div>
          </div>
        )}
      </div>
    </div>
  );
}


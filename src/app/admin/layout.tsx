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
  UserCheck,
} from 'lucide-react';
import { AdminRole, AdminUser, DEFAULT_USERS } from '../../lib/adminAuth';

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

  const isLoginPage = pathname === '/admin/login';

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [currentRole, setCurrentRole] = useState<AdminRole>('Owner');
  const [authLoading, setAuthLoading] = useState(!isLoginPage);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string; tone?: 'success' | 'danger' } | null>(null);

  const applyTheme = (isDark: boolean) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  };

  // Initialize theme & check session
  useEffect(() => {
    try {
      const savedAdmin = localStorage.getItem('vedant_admin_theme');
      const savedGlobal = localStorage.getItem('vedant_theme');
      let isDark = false;
      if (savedAdmin === 'dark' || savedAdmin === 'light') {
        isDark = savedAdmin === 'dark';
      } else if (savedGlobal === 'dark' || savedGlobal === 'light') {
        isDark = savedGlobal === 'dark';
      } else if (typeof document !== 'undefined') {
        isDark =
          document.documentElement.classList.contains('dark') ||
          document.documentElement.getAttribute('data-theme') === 'dark';
      }

      setDark(isDark);
      applyTheme(isDark);
    } catch (e) {}

    // Skip auth verification on login page
    if (isLoginPage) {
      setAuthLoading(false);
      return;
    }

    // Verify session from server
    fetch('/api/admin/session')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated || !data.user) {
          window.location.href = '/admin/login';
        } else {
          setCurrentUser(data.user);
          setCurrentRole(data.user.role);
          setAuthLoading(false);
        }
      })
      .catch(() => {
        window.location.href = '/admin/login';
      });
  }, [pathname, isLoginPage]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    applyTheme(next);
    try {
      localStorage.setItem('vedant_admin_theme', next ? 'dark' : 'light');
      localStorage.setItem('vedant_theme', next ? 'dark' : 'light');
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    try {
      localStorage.removeItem('vedant_admin_user');
      localStorage.removeItem('vedant_admin_role');
    } catch (e) {}
    window.location.href = '/admin/login';
  };

  const showToast = (message: string, tone: 'success' | 'danger' = 'success') => {
    setNotification({ message, tone });
    setTimeout(() => setNotification(null), 3500);
  };

  // If on Login Page, render directly without admin frame
  if (isLoginPage) {
    return (
      <div className={dark ? 'dark' : ''} data-theme={dark ? 'dark' : 'light'}>
        {children}
      </div>
    );
  }

  // If verifying authentication, show clean full-page loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F2EC] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#191919] flex items-center justify-center text-white font-black text-lg shadow-md animate-pulse">
          V
        </div>
        <div className="text-xs font-mono text-[#737373] tracking-widest uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ED463B] animate-ping" />
          Verifying authorized session...
        </div>
      </div>
    );
  }

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
        { label: 'VV Growth Desk', href: '/admin/growth-desk', icon: <TrendingUp className="w-4 h-4 shrink-0 text-[#ED463B]" />, badge: 'AI Ops' },
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

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'VT';

  return (
    <div className={dark ? 'dark' : ''} data-theme={dark ? 'dark' : 'light'}>
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
              className="ml-auto text-[var(--muted)] hover:text-[var(--ink)] p-1 rounded-md transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Groups */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {navGroups.map((group) => (
              <div key={group.label}>
                {!collapsed && (
                  <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] font-mono">
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

          {/* Authenticated User Profile & Sign Out Footer */}
          <div className="border-t border-[var(--line)] p-3 space-y-2">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#191919] text-[10px] font-bold text-white dark:bg-white dark:text-black">
                  {userInitials}
                </div>
                {!collapsed && (
                  <div className="min-w-0 text-left">
                    <div className="text-xs font-semibold truncate text-[var(--ink)]">
                      {currentUser?.name || 'Vedant Tiwari'}
                    </div>
                    <div className="text-[10px] text-[var(--muted)] font-mono truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {currentUser?.role || currentRole}
                    </div>
                  </div>
                )}
              </div>

              {!collapsed && (
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[#ED463B] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Sign out of administration"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
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

              {/* Mobile logout */}
              <div className="border-t border-[var(--line)] p-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-red-200 text-red-600 bg-red-50 text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
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
              {/* Authenticated user pill */}
              {currentUser && (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--line)] text-xs text-[var(--ink)]">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">{currentUser.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black text-white dark:bg-white dark:text-black font-bold">
                    {currentUser.role}
                  </span>
                </div>
              )}

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
                {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[var(--muted)]" />}
              </button>

              {/* Sign out button */}
              <button
                onClick={handleLogout}
                className="vv-button vv-button--secondary text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                title="Sign out of Command Centre"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </header>

          {/* Main Module Content */}
          <main className="vv-main flex-1">
            {children}
          </main>
        </div>
      </div>

      {/* Global Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium animate-fadeIn ${
            notification.tone === 'danger'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}

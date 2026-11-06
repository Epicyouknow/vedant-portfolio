'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  PenTool,
  Calendar,
  Layers,
  Database,
  BarChart3,
  Settings,
  History,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface GrowthDeskHeaderProps {
  currentModule: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function GrowthDeskHeader({ currentModule, subtitle, actions }: GrowthDeskHeaderProps) {
  const pathname = usePathname();

  const navTabs = [
    { label: 'Overview', href: '/admin/growth-desk', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { label: 'Assignments', href: '/admin/growth-desk/assignments', icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { label: 'Research Library', href: '/admin/growth-desk/research', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: 'Content Studio', href: '/admin/growth-desk/content', icon: <PenTool className="w-3.5 h-3.5" /> },
    { label: 'Editorial Calendar', href: '/admin/growth-desk/calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
    { label: 'Weekly Batch', href: '/admin/growth-desk/batch', icon: <Layers className="w-3.5 h-3.5" /> },
    { label: 'Knowledge Base', href: '/admin/growth-desk/knowledge', icon: <Database className="w-3.5 h-3.5" /> },
    { label: 'SEO & Analytics', href: '/admin/growth-desk/analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { label: 'Settings', href: '/admin/growth-desk/settings', icon: <Settings className="w-3.5 h-3.5" /> },
    { label: 'Logs', href: '/admin/growth-desk/logs', icon: <History className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Top Breadcrumb & Status Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] font-mono">
            <Link href="/admin/growth-desk" className="hover:text-[var(--ink)] transition-colors">
              VV Growth Desk
            </Link>
            <span>/</span>
            <span className="text-[var(--ink)] font-semibold">{currentModule}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[var(--ink)]">
                {currentModule === 'Overview' ? (
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#ED463B] font-black">VV</span> Growth Desk
                  </span>
                ) : (
                  currentModule
                )}
              </span>
            </div>
            {subtitle && (
              <span className="hidden sm:inline-block text-xs text-[var(--muted)] border-l border-[var(--line)] pl-3">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Operating Preference Status Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Scheduled Mode
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold border border-indigo-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Deep Research
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Human Approval Required
          </span>
          {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
        </div>
      </div>

      {/* Module Horizontal Navigation Tabs */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <nav className="flex items-center gap-1 min-w-max border-b border-[var(--line)] pb-2">
          {navTabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href !== '/admin/growth-desk' && pathname?.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#191919] text-white dark:bg-white dark:text-black shadow-xs font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}


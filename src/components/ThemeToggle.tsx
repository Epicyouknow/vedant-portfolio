'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { trackThemeChange } from '@/lib/tracking';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => {
        const next = isDark ? 'light' : 'dark';
        trackThemeChange(next);
        toggleTheme();
      }}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D94035] ${
        isDark
          ? 'bg-[#222120] border-[#2E2D2B] text-[#F7F5F0] hover:border-neutral-600'
          : 'bg-[#EAE6DC] border-[#E4E0D7] text-[#191919] hover:border-neutral-400'
      } ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? (
        <Sun className="w-4 h-4 text-[#F5C542] transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#57544F] transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}

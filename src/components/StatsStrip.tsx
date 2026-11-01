'use client';

import React from 'react';
import { portfolioData } from '../data/portfolio';
import { FadeUpStagger, FadeUpItem, AnimatedCounter } from './motion/MotionSystem';

interface StatsStripProps {
  className?: string;
}

export default function StatsStrip({ className = '' }: StatsStripProps) {
  const stats = [
    {
      value: portfolioData.stats.experience || '3+',
      label: 'YEARS EXPERIENCE',
      isRed: true,
      sublabel: 'Performance & Media Buying',
    },
    {
      value: portfolioData.stats.adSpend || '₹50L+',
      label: 'AD BUDGET MANAGED',
      isRed: false,
      sublabel: 'Meta, Google & DV360',
    },
    {
      value: portfolioData.stats.platforms || '7+',
      label: 'AD PLATFORMS',
      isRed: true,
      sublabel: 'Cross-Channel Acquisition',
    },
    {
      value: portfolioData.stats.campaigns || '100+',
      label: 'CAMPAIGNS EXECUTED',
      isRed: false,
      sublabel: 'D2C, B2B & Lead Generation',
    },
  ];

  return (
    <div className={`w-full max-w-7xl mx-auto px-6 md:px-12 ${className}`}>
      {/* Outer Container with subtle dark border and ambient glow matching screenshot */}
      <div className="surface-card rounded-2xl md:rounded-3xl p-3 sm:p-4 border border-[var(--border-subtle)] shadow-xs relative overflow-hidden backdrop-blur-md">
        
        {/* Subtle Ambient Red Glow matching screenshot */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-[var(--accent-red)]/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-[var(--accent-red)]/10 blur-3xl pointer-events-none rounded-full" />

        <FadeUpStagger delay={0.15} stagger={0.08} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10">
          {stats.map((stat) => (
            <FadeUpItem key={stat.label}>
              <div className="bg-[var(--bg-elevated)] dark:bg-[#1A1918] rounded-xl md:rounded-2xl p-3.5 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center border border-[var(--border-subtle)] hover:border-[var(--accent-red)] transition-all duration-300 group shadow-xs hover:shadow-md">
                
                {/* Large Metric Value with AnimatedCounter and Alternating Red / Primary styling */}
                <div 
                  className={`text-2xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight transition-transform duration-300 group-hover:scale-105 ${
                    stat.isRed 
                      ? 'text-[var(--accent-red)] dark:drop-shadow-[0_0_12px_rgba(217,64,53,0.3)]' 
                      : 'text-[var(--text-primary)]'
                  }`}
                >
                  <AnimatedCounter value={stat.value} />
                </div>

                {/* Uppercase Metric Label */}
                <div className="text-[9.5px] sm:text-xs font-mono font-bold tracking-[0.16em] uppercase text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors mt-2 sm:mt-3">
                  {stat.label}
                </div>

                {/* Subtext */}
                <div className="text-[10px] text-[var(--text-muted)] font-normal mt-1 hidden sm:block opacity-80 group-hover:opacity-100 transition-opacity">
                  {stat.sublabel}
                </div>

              </div>
            </FadeUpItem>
          ))}
        </FadeUpStagger>

      </div>
    </div>
  );
}

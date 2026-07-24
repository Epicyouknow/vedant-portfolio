'use client';

import React from 'react';
import { motion } from 'framer-motion';

const platforms = [
  { name: 'Meta Ads', tag: '₹8L+ Spend', color: '#E50914' },
  { name: 'Google Ads', tag: 'High ROAS', color: '#4285F4' },
  { name: 'DV360', tag: 'Programmatic', color: '#34A853' },
  { name: 'CM360', tag: 'Ad Serving', color: '#FBBC05' },
  { name: 'YouTube Ads', tag: 'Brand Awareness', color: '#FF0000' },
  { name: 'Amazon Ads', tag: 'E-commerce', color: '#FF9900' },
  { name: 'GA4 Analytics', tag: 'Server-side', color: '#F25D27' },
  { name: 'Looker Studio', tag: 'BI Dashboards', color: '#00C853' },
  { name: 'Next.js 16', tag: 'Frontend Dev', color: '#000000' },
  { name: 'Framer Motion', tag: 'Animations', color: '#0055FF' },
];

export default function VelocityMarquee() {
  return (
    <div className="w-full overflow-hidden bg-neutral-950 py-8 border-y border-neutral-900/80 relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

      {/* Row 1: Leftward Infinite Scroll */}
      <div className="flex gap-6 whitespace-nowrap overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
          className="flex gap-6 shrink-0 items-center"
        >
          {[...platforms, ...platforms].map((platform, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-neutral-900/80 border border-neutral-800 backdrop-blur-md shadow-lg group hover:border-[#E50914] transition-all duration-300"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: platform.color, color: platform.color }}
              />
              <span className="text-sm font-bold text-white uppercase tracking-wider">{platform.name}</span>
              <span className="text-[10px] font-mono font-semibold text-neutral-400 bg-black/60 px-2 py-0.5 rounded border border-neutral-800">
                {platform.tag}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Row 2: Rightward Infinite Scroll */}
      <div className="flex gap-6 whitespace-nowrap overflow-hidden mt-4">
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
          className="flex gap-6 shrink-0 items-center"
        >
          {[...platforms, ...platforms].reverse().map((platform, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-md group hover:border-neutral-700 transition-all duration-300"
            >
              <span className="text-xs font-mono font-bold text-neutral-400">⚡</span>
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">{platform.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

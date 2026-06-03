'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Zap, RefreshCw, Cpu, Layers } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

export default function JarvisCommandCenter() {
  const [activeSystem, setActiveSystem] = useState<'attribution' | 'spending' | 'funnels'>('attribution');

  return (
    <section id="command-center" className="py-24 bg-black relative px-6 md:px-16 overflow-hidden select-none">
      {/* Light glow effects */}
      <div className="ambient-light-red top-10 left-10" style={{ opacity: 0.04 }} />
      <div className="ambient-light-red bottom-10 right-10" style={{ opacity: 0.04 }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Title */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] block mb-2">Systems HUD</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans uppercase">
              Campaign Command Center
            </h2>
            <p className="text-neutral-500 text-sm md:text-base mt-2 max-w-xl">
              Jarvis-inspired holographic dashboard monitoring key budget metrics, conversion signals, and diagnostic tags.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-neutral-900/40 border border-neutral-800/40 rounded px-3 py-2 text-xs font-mono text-[#E50914] animate-pulse">
            <Cpu className="w-4 h-4" />
            <span>JARVIS v2.6.3 ONLINE</span>
          </div>
        </div>

        {/* Central HUD Matrix Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Col 1: Concentric Rotating SVG Holographic Dials */}
          <div className="bg-[#0e0e0e]/50 border border-neutral-900 rounded-xl p-8 flex flex-col items-center justify-center relative min-h-[350px] overflow-hidden animate-scan">
            
            {/* Holographic Concentric Circles */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Outer rotating scale circle */}
              <div className="absolute inset-0 border border-dashed border-[#E50914]/20 rounded-full animate-spin-slow" />
              
              {/* Mid rotating telemetry path */}
              <div className="absolute inset-4 border border-double border-neutral-800 rounded-full animate-spin-reverse-slow">
                <div className="absolute top-0 left-1/2 -ml-1.5 w-3 h-3 rounded-full bg-[#E50914] glow-box" />
                <div className="absolute bottom-0 left-1/2 -ml-1.5 w-2 h-2 rounded-full bg-white" />
              </div>

              {/* Inner core radar grid */}
              <div className="absolute inset-10 border border-dashed border-red-500/10 rounded-full animate-pulse" />

              {/* Central Core Dial statistics readout */}
              <div className="relative z-10 text-center space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold block">Ad Spend</span>
                <span className="text-4xl font-black text-white tracking-tight glow-text">{portfolioData.stats.adSpend}</span>
                <span className="text-[9px] text-[#E50914] font-mono font-bold block uppercase tracking-wider bg-red-950/30 px-2 py-0.5 rounded border border-red-800/20">
                  Target Match: 98%
                </span>
              </div>
            </div>

            <div className="w-full text-center mt-6">
              <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest block">
                Integrated Conversion Sensors Active
              </span>
            </div>
          </div>

          {/* Col 2: Telemetry readout parameter cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Stat Box 1: Managed Campaigns */}
            <div className="bg-[#0e0e0e]/50 border border-neutral-900 rounded-xl p-6 flex items-start gap-4 relative overflow-hidden group hover:border-[#E50914]/30 transition-all duration-300">
              <div className="p-3 bg-red-950/40 border border-red-800/30 text-[#E50914] rounded">
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold block">Active Campaigns</span>
                <span className="text-3xl font-extrabold text-white">{portfolioData.stats.campaigns.split(' ')[0]}</span>
                <span className="text-xs text-neutral-400 block font-light">Cross-funnel deployments optimized for acquisitions.</span>
              </div>
            </div>

            {/* Stat Box 2: Platforms Managed */}
            <div className="bg-[#0e0e0e]/50 border border-neutral-900 rounded-xl p-6 flex items-start gap-4 relative overflow-hidden group hover:border-[#E50914]/30 transition-all duration-300">
              <div className="p-3 bg-red-950/40 border border-red-800/30 text-[#E50914] rounded">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold block">Engineered Platforms</span>
                <span className="text-3xl font-extrabold text-white">{portfolioData.stats.platforms.split(' ')[0]}</span>
                <span className="text-xs text-neutral-400 block font-light">Omnichannel tag connections including DV360 programmatic.</span>
              </div>
            </div>

            {/* Stat Box 3: Certified Dials */}
            <div className="bg-[#0e0e0e]/50 border border-neutral-900 rounded-xl p-6 flex items-start gap-4 relative overflow-hidden group hover:border-[#E50914]/30 transition-all duration-300">
              <div className="p-3 bg-red-950/40 border border-red-800/30 text-[#E50914] rounded">
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold block">Security & Credentials</span>
                <span className="text-3xl font-extrabold text-white">{portfolioData.certifications.length} Credentials</span>
                <span className="text-xs text-neutral-400 block font-light">Verified search network, analytics & programmatic DSP badges.</span>
              </div>
            </div>

            {/* Stat Box 4: Average Conversion Growth Lift */}
            <div className="bg-[#0e0e0e]/50 border border-neutral-900 rounded-xl p-6 flex items-start gap-4 relative overflow-hidden group hover:border-[#E50914]/30 transition-all duration-300">
              <div className="p-3 bg-red-950/40 border border-red-800/30 text-[#E50914] rounded">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold block">Conversion Optimization Lift</span>
                <span className="text-3xl font-extrabold text-white">+28% Avg ROAS</span>
                <span className="text-xs text-neutral-400 block font-light">Engineered landing layouts minimizing pixel discrepancy.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Lower Diagnostic Readout Console */}
        <div className="mt-8 bg-[#0e0e0e]/30 border border-neutral-900 rounded-xl p-6">
          <div className="flex flex-wrap gap-3 border-b border-neutral-900 pb-4 mb-6">
            <button
              onClick={() => setActiveSystem('attribution')}
              className={`px-4 py-2 text-xs font-mono rounded cursor-pointer transition-all ${
                activeSystem === 'attribution'
                  ? 'bg-red-950/50 border border-red-800/30 text-white shadow-md'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              [SYSTEM_TAG_ATTRIBUTION]
            </button>
            
            <button
              onClick={() => setActiveSystem('spending')}
              className={`px-4 py-2 text-xs font-mono rounded cursor-pointer transition-all ${
                activeSystem === 'spending'
                  ? 'bg-red-950/50 border border-red-800/30 text-white shadow-md'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              [SYSTEM_BUDGET_WEIGHTS]
            </button>
          </div>

          <div className="font-mono text-xs text-neutral-400 leading-relaxed min-h-[100px] bg-black/40 border border-neutral-950 p-4 rounded">
            {activeSystem === 'attribution' ? (
              <div className="space-y-2">
                <p className="text-green-500 font-bold">&gt;&gt; TAG DIAGNOSTIC INITIATED...</p>
                <p>&gt; GTM Server-Side Tagging Container: ACTIVE [sgtm.vedant.mkt]</p>
                <p>&gt; Conversions API Webhook Protocol: SYNCED [Success Rate: 99.8%]</p>
                <p>&gt; GA4 Measurement Protocol Schema: MATCHED [Pixel disparity resolved]</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-500 font-bold">&gt;&gt; BUDGET DISTRIBUTION ALLOCATIONS:</p>
                <p>&gt; Meta Ads CBO Acquisition Mix: 60% [ROAS Target 3.5x]</p>
                <p>&gt; Google Search PMax Engine: 25% [Intent acquisition cycles]</p>
                <p>&gt; Programmatic DSP & Retargeting Hubs: 15% [CM360 deduplication enabled]</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

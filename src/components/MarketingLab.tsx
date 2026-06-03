'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, Cpu, ChevronRight, BarChart3, Users, DollarSign, ArrowRight } from 'lucide-react';

export default function MarketingLab() {
  const [activeTab, setActiveTab] = useState<'funnel' | 'media-mix'>('funnel');

  // Funnel Simulator states
  const [budget, setBudget] = useState(100000); // ₹1L budget
  const [cpc, setCpc] = useState(10); // ₹10 CPC
  const [ctr, setCtr] = useState(3.5); // 3.5% CTR
  const [cvr, setCvr] = useState(2.2); // 2.2% Conversion Rate
  const [aov, setAov] = useState(1500); // ₹1500 Average Order Value

  // Derived funnel parameters
  const clicks = Math.round(budget / cpc);
  const reach = Math.round(clicks / (ctr / 100));
  const conversions = Math.round(clicks * (cvr / 100));
  const revenue = conversions * aov;
  const roas = revenue > 0 && budget > 0 ? (revenue / budget).toFixed(2) : '0.00';
  const cpa = conversions > 0 ? Math.round(budget / conversions) : 0;

  // Media mix state weights (total must equal 100)
  const [mix, setMix] = useState({
    meta: 50,
    google: 25,
    amazon: 15,
    programmatic: 10
  });

  const handleMixChange = (channel: keyof typeof mix, val: number) => {
    // Basic weight cap, user can adjust
    setMix((prev) => {
      const updated = { ...prev, [channel]: Math.max(0, Math.min(100, val)) };
      return updated;
    });
  };

  return (
    <section id="marketing-lab" className="py-24 bg-black relative px-6 md:px-16 overflow-hidden">
      {/* Dynamic Red Glow Ambient Light */}
      <div className="ambient-light-red bottom-10 right-10" style={{ opacity: 0.03 }} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Title */}
        <div className="mb-12">
          <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] block mb-2">Simulation Sandbox</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans uppercase">
            Marketing Simulation Lab
          </h2>
          <p className="text-neutral-500 text-sm md:text-base mt-2 max-w-xl">
            Futuristic innovation sandbox. Tweak CTR parameters, audience flows, and budget ratios to watch growth output calculations in real-time.
          </p>
        </div>

        {/* Layout tab selectors */}
        <div className="flex gap-4 border-b border-neutral-900 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('funnel')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded cursor-pointer transition-all ${
              activeTab === 'funnel'
                ? 'bg-red-950/50 border border-red-800/30 text-white shadow-md'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            [FUNNEL_SIMULATOR]
          </button>
          
          <button
            onClick={() => setActiveTab('media-mix')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded cursor-pointer transition-all ${
              activeTab === 'media-mix'
                ? 'bg-red-950/50 border border-red-800/30 text-white shadow-md'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            [MEDIA_MIX_PLANNER]
          </button>
        </div>

        {/* Dynamic Sandbox Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Panel (left column) */}
          <div className="bg-[#0e0e0e]/50 border border-neutral-900 rounded-xl p-6 space-y-6">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#E50914]" />
              Telemetry Adjusters
            </h3>

            {activeTab === 'funnel' ? (
              <div className="space-y-4 text-xs font-mono text-neutral-400">
                <div className="space-y-1">
                  <label className="flex justify-between">
                    <span>Ad Budget:</span>
                    <span className="text-white">₹{budget.toLocaleString()}</span>
                  </label>
                  <input type="range" min="10000" max="500000" step="10000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-red-600 cursor-pointer h-1 rounded-lg" />
                </div>

                <div className="space-y-1">
                  <label className="flex justify-between">
                    <span>Click-Through Rate (CTR):</span>
                    <span className="text-white">{ctr}%</span>
                  </label>
                  <input type="range" min="0.5" max="10" step="0.1" value={ctr} onChange={(e) => setCtr(Number(e.target.value))} className="w-full accent-red-600 cursor-pointer h-1 rounded-lg" />
                </div>

                <div className="space-y-1">
                  <label className="flex justify-between">
                    <span>Average CPC:</span>
                    <span className="text-white">₹{cpc}</span>
                  </label>
                  <input type="range" min="2" max="50" step="1" value={cpc} onChange={(e) => setCpc(Number(e.target.value))} className="w-full accent-red-600 cursor-pointer h-1 rounded-lg" />
                </div>

                <div className="space-y-1">
                  <label className="flex justify-between">
                    <span>Conversion Rate (CVR):</span>
                    <span className="text-white">{cvr}%</span>
                  </label>
                  <input type="range" min="0.1" max="8" step="0.1" value={cvr} onChange={(e) => setCvr(Number(e.target.value))} className="w-full accent-red-600 cursor-pointer h-1 rounded-lg" />
                </div>

                <div className="space-y-1">
                  <label className="flex justify-between">
                    <span>Avg Order Value (AOV):</span>
                    <span className="text-white">₹{aov}</span>
                  </label>
                  <input type="range" min="500" max="5000" step="100" value={aov} onChange={(e) => setAov(Number(e.target.value))} className="w-full accent-red-600 cursor-pointer h-1 rounded-lg" />
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs font-mono text-neutral-400">
                <div className="space-y-1">
                  <label className="flex justify-between">
                    <span>Meta Ads Share:</span>
                    <span className="text-white">{mix.meta}%</span>
                  </label>
                  <input type="range" min="0" max="100" step="5" value={mix.meta} onChange={(e) => handleMixChange('meta', Number(e.target.value))} className="w-full accent-red-600 cursor-pointer h-1 rounded-lg" />
                </div>

                <div className="space-y-1">
                  <label className="flex justify-between">
                    <span>Google Ads Share:</span>
                    <span className="text-white">{mix.google}%</span>
                  </label>
                  <input type="range" min="0" max="100" step="5" value={mix.google} onChange={(e) => handleMixChange('google', Number(e.target.value))} className="w-full accent-red-600 cursor-pointer h-1 rounded-lg" />
                </div>

                <div className="space-y-1">
                  <label className="flex justify-between">
                    <span>Amazon Ads Share:</span>
                    <span className="text-white">{mix.amazon}%</span>
                  </label>
                  <input type="range" min="0" max="100" step="5" value={mix.amazon} onChange={(e) => handleMixChange('amazon', Number(e.target.value))} className="w-full accent-red-600 cursor-pointer h-1 rounded-lg" />
                </div>

                <div className="space-y-1">
                  <label className="flex justify-between">
                    <span>Programmatic DSP:</span>
                    <span className="text-white">{mix.programmatic}%</span>
                  </label>
                  <input type="range" min="0" max="100" step="5" value={mix.programmatic} onChange={(e) => handleMixChange('programmatic', Number(e.target.value))} className="w-full accent-red-600 cursor-pointer h-1 rounded-lg" />
                </div>

                <p className="text-[10px] text-neutral-500 block leading-relaxed uppercase border-t border-neutral-900 pt-4">
                  Adjust ratios to allocate budget across channels and evaluate spend mapping.
                </p>
              </div>
            )}
          </div>

          {/* Visual Output Display (right columns) */}
          <div className="lg:col-span-2 bg-[#0e0e0e]/50 border border-neutral-900 rounded-xl p-8 flex flex-col justify-between min-h-[350px]">
            
            {activeTab === 'funnel' ? (
              <div className="space-y-6 w-full">
                
                {/* Simulated metrics layout */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-neutral-950 p-4 border border-neutral-900 rounded-lg text-center space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Simulated CPA</span>
                    <h4 className="text-xl font-bold text-white font-mono">₹{cpa}</h4>
                  </div>
                  <div className="bg-neutral-950 p-4 border border-neutral-900 rounded-lg text-center space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Target ROAS</span>
                    <h4 className="text-xl font-bold text-[#E50914] font-mono glow-text">{roas}x</h4>
                  </div>
                  <div className="bg-neutral-950 p-4 border border-neutral-900 rounded-lg text-center space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Revenue Output</span>
                    <h4 className="text-xl font-bold text-white font-mono">₹{revenue.toLocaleString()}</h4>
                  </div>
                </div>

                {/* Simulated funnel shape */}
                <div className="space-y-3 pt-6 border-t border-neutral-900">
                  <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-3">Telemetry Funnel Node Flow</h4>
                  
                  {/* Reach node */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                      <span>1. IMPRESSIONS / REACH</span>
                      <span className="text-white font-bold">{reach.toLocaleString()} Unique</span>
                    </div>
                    <div className="h-5 bg-red-950/20 border border-red-800/10 rounded flex items-center justify-center text-[10px] text-white/50 w-full">
                      TOP OF FUNNEL (100%)
                    </div>
                  </div>

                  {/* Click node */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                      <span>2. TRAFFIC / CLICKS</span>
                      <span className="text-white font-bold">{clicks.toLocaleString()} Users</span>
                    </div>
                    <div className="h-5 bg-red-950/40 border border-red-800/20 rounded flex items-center justify-center text-[10px] text-white/70 w-3/4 mx-auto">
                      CONSIDERATION ({ctr}% CTR)
                    </div>
                  </div>

                  {/* Purchase node */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                      <span>3. PURCHASES / CONVERSIONS</span>
                      <span className="text-white font-bold">{conversions.toLocaleString()} Orders</span>
                    </div>
                    <div className="h-5 bg-[#E50914] rounded flex items-center justify-center text-[10px] text-white font-bold w-2/4 mx-auto glow-box">
                      CONVERSION ({cvr}% CVR)
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="space-y-6 w-full">
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Channel Allocation Matrix</h4>
                
                {/* Visual bar allocations */}
                <div className="space-y-4">
                  
                  {/* Meta */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono font-semibold">
                      <span className="text-neutral-300">Meta Ads CBO Mix</span>
                      <span className="text-red-500">{mix.meta}%</span>
                    </div>
                    <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
                      <div className="h-full bg-[#E50914] rounded-full" style={{ width: `${mix.meta}%` }} />
                    </div>
                  </div>

                  {/* Google */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono font-semibold">
                      <span className="text-neutral-300">Google Search & PMax</span>
                      <span className="text-blue-500">{mix.google}%</span>
                    </div>
                    <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${mix.google}%` }} />
                    </div>
                  </div>

                  {/* Amazon */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono font-semibold">
                      <span className="text-neutral-300">Amazon Retail & DSP</span>
                      <span className="text-amber-500">{mix.amazon}%</span>
                    </div>
                    <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${mix.amazon}%` }} />
                    </div>
                  </div>

                  {/* Programmatic */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono font-semibold">
                      <span className="text-neutral-300">Programmatic Exchanges (DV360)</span>
                      <span className="text-purple-500">{mix.programmatic}%</span>
                    </div>
                    <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${mix.programmatic}%` }} />
                    </div>
                  </div>

                </div>

                <div className="pt-4 border-t border-neutral-900 flex justify-between items-center text-xs text-neutral-500 font-mono">
                  <span>Total Calculated Ratio Weights:</span>
                  <span className="text-white font-bold">{mix.meta + mix.google + mix.amazon + mix.programmatic}%</span>
                </div>
              </div>
            )}
            
          </div>

        </div>

      </div>
    </section>
  );
}

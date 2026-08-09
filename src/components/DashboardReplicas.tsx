'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Table2, ShieldAlert, CheckCircle, RefreshCw, BarChart3, Database } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

export default function DashboardReplicas() {
  const [activePlatform, setActivePlatform] = useState<'meta' | 'google' | 'ga4'>('meta');
  const [loading, setLoading] = useState(false);
  const [ga4ActiveUsers, setGa4ActiveUsers] = useState(42);

  // Simulate active user updates for GA4
  useEffect(() => {
    if (activePlatform !== 'ga4') return;
    const interval = setInterval(() => {
      setGa4ActiveUsers((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(15, Math.min(95, prev + delta));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [activePlatform]);

  const handleReload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <section id="campaign-dashboards" className="py-24 bg-[#050505] relative px-6 md:px-16 overflow-hidden">
      {/* Light glow effects */}
      <div className="ambient-light-red top-10 right-10" style={{ opacity: 0.03 }} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] block mb-2">Metrics Console</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans uppercase">
              Realistic Ad Dashboards
            </h2>
            <p className="text-neutral-500 text-sm md:text-base mt-2 max-w-xl">
              Simulated campaign diagnostics loaded directly from client records, demonstrating structural conversion tracking.
            </p>
          </div>

          {/* Console platform selector tabs */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={() => setActivePlatform('meta')}
              className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all ${
                activePlatform === 'meta' ? 'bg-neutral-900 text-white border border-neutral-850' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Meta Ads Manager
            </button>
            <button
              onClick={() => setActivePlatform('google')}
              className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all ${
                activePlatform === 'google' ? 'bg-neutral-900 text-white border border-neutral-850' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Google Ads Console
            </button>
            <button
              onClick={() => setActivePlatform('ga4')}
              className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all ${
                activePlatform === 'ga4' ? 'bg-neutral-900 text-white border border-neutral-850' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Google Analytics 4
            </button>
          </div>
        </div>

        {/* Dashboard Shell Box */}
        <div className="bg-[#0e0e0e]/50 border border-neutral-900 rounded-xl overflow-hidden shadow-2xl relative">
          
          {/* Dashboard Header Bar */}
          <div className="bg-neutral-950 border-b border-neutral-900 px-6 py-4 flex items-center justify-between font-mono text-[10px] text-neutral-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle className="w-3.5 h-3.5" />
                SECURE CONSOLE DATA SYNC
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">LAST REFRESH: 2 MINS AGO</span>
            </div>
            
            <button 
              onClick={handleReload}
              className={`flex items-center gap-1 text-[#E50914] hover:text-white cursor-pointer active:scale-95 transition-all focus:outline-none ${
                loading ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              REFRESH
            </button>
          </div>

          {/* Dashboard Body Panel */}
          <div className="p-6 overflow-x-auto min-h-[300px]">
            {loading ? (
              <div className="h-60 flex flex-col items-center justify-center space-y-3 font-mono text-xs text-neutral-500">
                <span className="w-8 h-8 rounded-full border-2 border-red-800 border-t-red-500 animate-spin" />
                <span>SYNCING ACTIVE SERVER PIPELINES...</span>
              </div>
            ) : (
              <>
                {/* 1. Meta Ads Manager Mockup Dashboard */}
                {activePlatform === 'meta' && (
                  <table className="w-full text-left font-mono text-xs text-neutral-300 border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-neutral-900 text-neutral-500 text-[10px]">
                        <th className="pb-3 pr-4">CAMPAIGN NAME</th>
                        <th className="pb-3">BUDGET</th>
                        <th className="pb-3">BID STRATEGY</th>
                        <th className="pb-3">CONVERSIONS</th>
                        <th className="pb-3">COST / CONV</th>
                        <th className="pb-3">SPEND</th>
                        <th className="pb-3 text-right">ROAS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-950">
                      {portfolioData.dashboardMockData.meta.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-neutral-900/20">
                          <td className="py-4 pr-4 font-sans font-bold text-white flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-neutral-600'}`} />
                            {row.name}
                          </td>
                          <td className="py-4">{row.budget}</td>
                          <td className="py-4 text-neutral-400">{row.bidStrategy}</td>
                          <td className="py-4 font-bold">{row.conversions}</td>
                          <td className="py-4 text-red-400">{row.cpa}</td>
                          <td className="py-4">{row.spend}</td>
                          <td className="py-4 text-right text-green-400 font-bold">{row.roas}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* 2. Google Ads Mockup Dashboard */}
                {activePlatform === 'google' && (
                  <table className="w-full text-left font-mono text-xs text-neutral-300 border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-neutral-900 text-neutral-500 text-[10px]">
                        <th className="pb-3 pr-4">CAMPAIGN NAME</th>
                        <th className="pb-3">DAILY BUDGET</th>
                        <th className="pb-3">IMPRESSIONS</th>
                        <th className="pb-3">CLICKS</th>
                        <th className="pb-3">CTR</th>
                        <th className="pb-3">AVG CPC</th>
                        <th className="pb-3">CONVERSIONS</th>
                        <th className="pb-3 text-right">SPEND</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-950">
                      {portfolioData.dashboardMockData.google.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-neutral-900/20">
                          <td className="py-4 pr-4 font-sans font-bold text-white flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-neutral-600'}`} />
                            {row.name}
                          </td>
                          <td className="py-4">{row.budget}</td>
                          <td className="py-4">{row.impressions.toLocaleString()}</td>
                          <td className="py-4">{row.clicks.toLocaleString()}</td>
                          <td className="py-4 text-neutral-400">{row.ctr}</td>
                          <td className="py-4 text-neutral-400">{row.cpc}</td>
                          <td className="py-4 font-bold">{row.conversions}</td>
                          <td className="py-4 text-right">{row.spend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* 3. GA4 Real-time Telemetry Dashboard */}
                {activePlatform === 'ga4' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Active users dial */}
                    <div className="bg-neutral-950 p-6 border border-neutral-900 rounded-lg flex flex-col justify-center items-center text-center space-y-4">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">Real-time Telemetry</span>
                      <div className="text-5xl font-black text-green-500 font-mono glow-text">{ga4ActiveUsers}</div>
                      <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-mono">Users Active on site</span>
                    </div>

                    {/* Active charts visualization */}
                    <div className="md:col-span-2 space-y-4">
                      <h4 className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4 text-green-500" />
                        Traffic Pageviews Spikes (Last 30 Mins)
                      </h4>

                      {/* Flex vertical graph bars */}
                      <div className="h-32 flex items-end gap-2.5 bg-neutral-950/40 border border-neutral-900 rounded p-4 relative overflow-hidden">
                        {[45, 60, 52, 70, 85, 40, 65, 80, 55, 90, 75, 82, 60, 72, 88].map((barVal, bIdx) => (
                          <div 
                            key={bIdx}
                            className="flex-1 bg-green-500/80 hover:bg-green-400 transition-colors rounded-t-sm"
                            style={{ 
                              height: `${(barVal / 90) * 100}%`,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-neutral-600 block uppercase font-mono text-right">
                        Interval sampling: 2 minute updates
                      </span>
                    </div>

                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

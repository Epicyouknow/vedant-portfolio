'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CLIENTS_DATA, ClientData } from '../data/clientsData';
import { 
  CheckCircle2, 
  Target, 
  Compass, 
  Layers, 
  Cpu, 
  ArrowUpRight, 
  Search, 
  Maximize2, 
  X, 
  ExternalLink, 
  Globe, 
  User, 
  Zap 
} from 'lucide-react';

export default function ClientCaseStudyShowcase() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<ClientData | null>(null);

  // Filter out TravelKitSR and Daakiyawala as per prompt specifications
  const validClients = CLIENTS_DATA.filter(
    (c) => c.slug !== 'travelkitsr' && c.slug !== 'daakiyawala'
  );

  const filteredRecords = validClients.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.objective.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="client-intelligence" className="py-24 bg-[#050507] text-white relative px-4 md:px-16 overflow-hidden select-none font-sans">
      {/* Ambient Backlight Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-950/20 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-900/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* HEADER BADGE & TITLE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-neutral-900 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/60 border border-red-800/50 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF1A1A] animate-pulse" />
              <span className="text-[10px] text-[#FF1A1A] font-bold uppercase tracking-[0.2em]">
                CLIENT INTELLIGENCE • PERFORMANCE CASE STUDIES
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase font-sans">
              Real Clients. <span className="text-[#FF1A1A] drop-shadow-[0_0_20px_rgba(255,26,26,0.7)]">Real Impact.</span>
            </h2>
            <p className="text-neutral-400 text-xs md:text-sm mt-2 max-w-2xl font-normal leading-relaxed">
              A structured overview of 18 real client campaigns I manage end-to-end — strategy, execution, and objective delivery with direct links to live client websites.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clients or campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-950/90 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FF1A1A] transition-colors font-sans"
            />
          </div>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#FF1A1A] text-white shadow-[0_0_15px_rgba(255,26,26,0.5)]'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            All Clients ({validClients.length})
          </button>
          <button
            onClick={() => setActiveFilter('logistics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeFilter === 'logistics'
                ? 'bg-[#FF1A1A] text-white shadow-[0_0_15px_rgba(255,26,26,0.5)]'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            Logistics & Freight
          </button>
          <button
            onClick={() => setActiveFilter('ecommerce')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeFilter === 'ecommerce'
                ? 'bg-[#FF1A1A] text-white shadow-[0_0_15px_rgba(255,26,26,0.5)]'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            E-Commerce & Retail
          </button>
          <button
            onClick={() => setActiveFilter('services')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeFilter === 'services'
                ? 'bg-[#FF1A1A] text-white shadow-[0_0_15px_rgba(255,26,26,0.5)]'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            Software & Services
          </button>
          <button
            onClick={() => setActiveFilter('realestate-app')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeFilter === 'realestate-app'
                ? 'bg-[#FF1A1A] text-white shadow-[0_0_15px_rgba(255,26,26,0.5)]'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            Real Estate & App Installs
          </button>
        </div>

        {/* CLIENT CASE STUDY CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {filteredRecords.map((record) => (
            <motion.div
              layout
              key={record.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0c0c10] border border-neutral-800/90 hover:border-red-900/70 rounded-xl md:rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl group hover:shadow-[0_0_30px_rgba(255,26,26,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-600/5 to-transparent blur-lg pointer-events-none" />

              <div>
                {/* Header: Logo, Name & Website Link */}
                <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-neutral-900">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-black border border-neutral-800 p-1 shrink-0 flex items-center justify-center overflow-hidden group-hover:border-[#FF1A1A]/60 transition-colors">
                      <img src={record.logo} alt={record.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <Link href={`/clients/${record.slug}`} className="text-base font-black text-white group-hover:text-[#FF1A1A] transition-colors uppercase block">
                        {record.name}
                      </Link>
                      <span className="text-[11px] text-neutral-400 block line-clamp-1">
                        {record.subtitle}
                      </span>
                    </div>
                  </div>

                  <a
                    href={record.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 md:p-2 bg-neutral-900 hover:bg-[#FF1A1A] text-neutral-400 hover:text-white rounded-lg transition-colors border border-neutral-800 shrink-0"
                    title="Visit Live Client Website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Key Metadata Chips */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-bold text-[10px] uppercase tracking-wider">OBJECTIVE</span>
                    <span className="px-2 py-0.5 bg-red-950/60 border border-red-900/60 text-[#FF1A1A] font-bold text-[10px] rounded uppercase">
                      {record.objective}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-bold text-[10px] uppercase tracking-wider">PLATFORMS</span>
                    <div className="flex items-center gap-1 flex-wrap justify-end">
                      {record.platforms.map((p) => (
                        <span key={p} className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-semibold rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Challenge & Approach */}
                <div className="space-y-2.5 mb-5 bg-neutral-950/80 p-3 rounded-xl border border-neutral-900">
                  <div>
                    <span className="text-[10px] text-[#FF1A1A] font-bold uppercase tracking-wider block mb-0.5">
                      THE CHALLENGE
                    </span>
                    <p className="text-neutral-300 text-xs font-normal leading-relaxed line-clamp-2">
                      {record.challenge}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-0.5">
                      RESULT / IMPACT
                    </span>
                    <p className="text-neutral-200 text-xs font-medium leading-relaxed line-clamp-2">
                      {record.result}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedRecord(record)}
                  className="flex-1 py-2.5 bg-neutral-900 hover:bg-[#FF1A1A] text-neutral-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Quick Spec</span>
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <Link
                  href={`/clients/${record.slug}`}
                  className="px-3 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white rounded-xl transition-colors flex items-center justify-center"
                  title="View Dedicated Case Study Page"
                >
                  <ArrowUpRight className="w-4 h-4 text-[#FF1A1A]" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* FULL CLIENT CASE STUDY QUICK MODAL */}
      <AnimatePresence>
        {selectedRecord && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-[#0d0d12] border border-red-900/50 rounded-2xl overflow-hidden shadow-2xl p-5 md:p-8 my-auto font-sans"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-5 right-5 p-2 bg-neutral-900 text-neutral-400 hover:text-white rounded-full border border-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Client Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-900">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-black border border-neutral-800 p-1.5 shrink-0 flex items-center justify-center">
                    <img src={selectedRecord.logo} alt={selectedRecord.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#FF1A1A] font-bold uppercase tracking-widest block mb-0.5">
                      PERFORMANCE CASE STUDY SPEC
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase font-sans">{selectedRecord.name}</h3>
                    <span className="text-xs text-neutral-400">{selectedRecord.subtitle}</span>
                  </div>
                </div>

                <a
                  href={selectedRecord.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#FF1A1A] hover:bg-[#d90e0e] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 shrink-0 transition-colors shadow-md"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Visit Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Exact Case Study Grid */}
              <div className="space-y-4 text-xs">
                {/* Objective & Platforms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-950 p-3.5 rounded-xl border border-neutral-900">
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">OBJECTIVE</span>
                    <span className="text-white font-bold text-sm">{selectedRecord.objective}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">PLATFORMS</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {selectedRecord.platforms.map((p) => (
                        <span key={p} className="px-2.5 py-0.5 bg-neutral-900 border border-neutral-800 text-[#FF1A1A] text-xs font-bold rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* My Role */}
                <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">MY ROLE</span>
                  <span className="text-neutral-200 font-semibold">{selectedRecord.role}</span>
                </div>

                {/* Challenge */}
                <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900">
                  <span className="text-[10px] text-[#FF1A1A] font-bold uppercase tracking-wider block mb-1">THE CHALLENGE</span>
                  <p className="text-neutral-300 font-normal leading-relaxed">{selectedRecord.challenge}</p>
                </div>

                {/* Approach */}
                <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-2">THE APPROACH</span>
                  <ul className="space-y-1.5 font-normal text-neutral-300">
                    {selectedRecord.approach.map((ap, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#FF1A1A] font-bold">✓</span>
                        <span>{ap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Result */}
                <div className="bg-gradient-to-r from-red-950/40 via-neutral-950 to-neutral-950 p-3.5 rounded-xl border border-red-900/50">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-1">CAMPAIGN RESULT</span>
                  <p className="text-white font-semibold leading-relaxed">{selectedRecord.result}</p>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    href={`/clients/${selectedRecord.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors border border-neutral-800"
                  >
                    <span>Open Dedicated Case Study Page</span>
                    <ArrowUpRight className="w-4 h-4 text-[#FF1A1A]" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ShieldCheck, MapPin, Award, ArrowRight, Tag, BookOpen } from 'lucide-react';
import { portfolioData, TimelineItem } from '../data/portfolio';

export default function CareerMap() {
  const [selectedStationId, setSelectedStationId] = useState<string>('timeline-1');

  const selectedStation = portfolioData.timeline.find((t) => t.id === selectedStationId) || portfolioData.timeline[0];

  return (
    <section id="career-map" className="py-24 bg-[#0a0a0a] relative px-6 md:px-16 overflow-hidden">
      {/* Light glow effects */}
      <div className="ambient-light-red bottom-0 right-1/4" style={{ opacity: 0.03 }} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] block mb-2">Transit Map</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans uppercase">
            Interactive Career Map
          </h2>
          <p className="text-neutral-500 text-sm md:text-base mt-2 max-w-xl mx-auto">
            Click on any subway transit station node to check performance statistics, tools deployed, and execution logs.
          </p>
        </div>

        {/* Metro transit SVG Track Line (Horizontal on desktop, stacked on mobile) */}
        <div className="bg-[#0e0e0e]/40 border border-neutral-900 rounded-xl p-8 mb-10 flex flex-col items-center justify-center relative overflow-hidden">
          
          <div className="w-full flex flex-col md:flex-row items-center justify-between relative py-8 max-w-4xl mx-auto gap-12 md:gap-4">
            
            {/* SVG Track line in background (desktop only) */}
            <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-neutral-800 z-0 hidden md:block" />
            <div 
              className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-[#E50914] z-0 hidden md:block transition-all duration-500" 
              style={{
                width: selectedStationId === 'timeline-4' ? '10%' :
                       selectedStationId === 'timeline-3' ? '35%' :
                       selectedStationId === 'timeline-2' ? '68%' : '100%'
              }}
            />

            {/* Render Stations (reversed to show chronological order left-to-right) */}
            {[...portfolioData.timeline].reverse().map((station, sIdx) => {
              const isActive = selectedStationId === station.id;
              
              return (
                <button
                  key={station.id}
                  onClick={() => setSelectedStationId(station.id)}
                  className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 focus:outline-none cursor-pointer group text-left md:text-center w-full md:w-auto"
                >
                  {/* Station node dot ring */}
                  <div 
                    className={`w-10 h-10 rounded-full bg-black border-2 flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'border-[#E50914] scale-110 shadow-lg shadow-red-900/40' 
                        : 'border-neutral-700 group-hover:border-white'
                    }`}
                  >
                    {/* Inner glowing core */}
                    <div 
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        isActive ? 'bg-[#E50914]' : 'bg-neutral-800 group-hover:bg-neutral-400'
                      }`} 
                    />
                  </div>

                  {/* Station Labels */}
                  <div className="md:mt-1 space-y-0.5">
                    <span className={`text-[10px] font-mono tracking-widest uppercase block ${isActive ? 'text-[#E50914] font-bold' : 'text-neutral-500'}`}>
                      {station.year.split(' - ')[0]}
                    </span>
                    <span className={`text-xs font-bold transition-colors ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
                      {station.role.split(' ')[0]} {station.role.split(' ')[1] || ''}
                    </span>
                  </div>
                </button>
              );
            })}

          </div>

        </div>

        {/* Selected Station detailed board */}
        <AnimatePresence mode="wait">
          {selectedStation && (
            <motion.div
              key={selectedStation.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              
              {/* Col 1 & 2: Project overview & Accomplishments */}
              <div className="lg:col-span-2 bg-[#0e0e0e]/50 border border-neutral-900 rounded-xl p-8 glass-panel flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 border border-red-800/40 bg-red-950/20 text-[#E50914] text-[10px] font-mono uppercase rounded tracking-wider">
                      STATION LOGS
                    </span>
                    <span className="text-neutral-500 text-xs font-mono">{selectedStation.period}</span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-white mb-1 uppercase tracking-wide">
                    {selectedStation.role}
                  </h3>
                  <h4 className="text-[#E50914] text-sm font-semibold mb-6">
                    {selectedStation.company}
                  </h4>

                  <p className="text-neutral-300 text-sm font-light leading-relaxed mb-6">
                    {selectedStation.description}
                  </p>

                  <div className="space-y-3">
                    <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-3">Key Output Deliverables</h5>
                    {selectedStation.points.map((pt, ptIdx) => (
                      <div key={ptIdx} className="flex gap-2.5 items-start text-neutral-400 text-xs leading-relaxed">
                        <Award className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Col 3: Tools & Lessons Learned */}
              <div className="space-y-6">
                
                {/* Tools box */}
                <div className="bg-[#0e0e0e]/50 border border-neutral-900 rounded-xl p-6 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 text-[#E50914]">
                    <Tag className="w-4 h-4" />
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest">Technologies Deployed</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedStation.tools.map((tool) => (
                      <span key={tool} className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-900 hover:border-neutral-800 text-[10px] text-neutral-300 rounded font-mono">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Lessons Learned Box */}
                <div className="bg-[#0e0e0e]/50 border border-neutral-900 rounded-xl p-6 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 text-[#E50914]">
                    <BookOpen className="w-4 h-4" />
                    <h4 className="text-white text-xs font-bold uppercase tracking-widest">Core Insights</h4>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed italic font-light font-sans">
                    "{selectedStation.lessons}"
                  </p>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

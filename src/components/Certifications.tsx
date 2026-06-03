'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, ExternalLink } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

export default function Certifications() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="certifications" className="py-24 bg-[#0a0a0a] relative px-6 md:px-16 overflow-hidden">
      {/* Subtle red lights */}
      <div className="ambient-light-red bottom-0 right-10" style={{ opacity: 0.04 }} />

      <div className="max-w-6xl mx-auto">
        
        {/* Section Title */}
        <div className="mb-12">
          <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] block mb-2">Credentials</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Unlocked Achievements
          </h2>
          <p className="text-neutral-500 text-sm md:text-base mt-2 max-w-xl">
            Professional certifications and verified badges in media planning, analytics, and advertising channels.
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.certifications.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ 
                duration: 0.6, 
                delay: idx * 0.05,
                type: 'spring',
                stiffness: 100 
              }}
              whileHover={{ 
                scale: 1.03
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                borderColor: hoveredIdx === idx ? cert.color : '#171717',
                boxShadow: hoveredIdx === idx ? `0 0 20px ${cert.color}25` : 'none',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
              }}
              className="group rounded-lg p-5 bg-[#141414]/90 border flex items-start gap-4 relative overflow-hidden"
            >
              {/* Achievement unlock glow line on mount */}
              <div 
                className="absolute top-0 left-0 w-1 h-full opacity-60" 
                style={{ backgroundColor: cert.color }} 
              />
              
              {/* Badge Icon */}
              <div 
                className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0 text-neutral-400 group-hover:text-white transition-colors relative"
              >
                <ShieldCheck className="w-6 h-6" style={{ color: cert.color }} />
                {/* Micro notification active dot */}
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1 select-none">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                  {cert.issuer}
                </span>
                <h3 className="text-sm font-extrabold text-neutral-200 leading-snug group-hover:text-white transition-colors">
                  {cert.title}
                </h3>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Completed: {cert.date}
                  </span>
                  
                  <span className="text-[10px] text-[#E50914] font-semibold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 ml-8">
                    Verified <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>

              {/* Gold/Sheen animation overlay on hover */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

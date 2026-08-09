'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CLIENTS_DATA, ClientData } from '../data/clientsData';
import { ExternalLink, Pause, Play, MoveRight } from 'lucide-react';

export default function BrandsMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-16 bg-[#050507] border-y border-neutral-900/80 relative overflow-hidden select-none">
      {/* Background Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-[#FF1A1A]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-950/40 border border-red-800/40 rounded-full mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A] animate-ping" />
          <span className="text-[10px] text-[#FF1A1A] font-mono font-bold uppercase tracking-[0.25em]">
            PAUSE / DRAG TO BROWSE
          </span>
        </div>

        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white uppercase font-sans">
          BRANDS <span className="text-[#FF1A1A] drop-shadow-[0_0_15px_rgba(255,26,26,0.6)]">TRUST ME</span>
        </h2>
        <p className="text-neutral-400 text-xs md:text-sm mt-2 max-w-xl mx-auto font-light">
          Click any brand card to view their dedicated performance marketing case study & live website. Hover or drag to pause & scroll manually.
        </p>
      </div>

      {/* Marquee Container with Drag & Hover Pause Controls */}
      <div 
        className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] py-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          animate={isPaused ? {} : { x: ['0%', '-50%'] }}
          transition={{
            ease: 'linear',
            duration: 38,
            repeat: Infinity,
          }}
          className="flex items-center gap-5 shrink-0 pr-5"
        >
          {/* Double array loop for continuous seamless ticker effect */}
          {[...CLIENTS_DATA, ...CLIENTS_DATA].map((brand, idx) => (
            <Link
              key={`${brand.id}-${idx}`}
              href={`/clients/${brand.slug}`}
              className="group shrink-0 focus:outline-none"
            >
              {/* Rounded Rectangular Card matching User Screenshot */}
              <div className="w-80 px-5 py-4 bg-[#0a0a0c] hover:bg-[#121217] border border-[#1e1e24] group-hover:border-red-600/70 rounded-2xl transition-all duration-300 flex items-center gap-4 shadow-xl group-hover:shadow-[0_0_25px_rgba(255,26,26,0.2)] cursor-pointer relative overflow-hidden">
                {/* Logo Image Container */}
                <div className="w-12 h-12 rounded-xl bg-black border border-neutral-800 p-1 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#FF1A1A]/70 transition-colors shadow-inner">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Brand Name & Subtitle */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-extrabold text-white tracking-wider group-hover:text-[#FF1A1A] transition-colors font-sans uppercase truncate">
                      {brand.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-[#FF1A1A] transition-colors shrink-0" />
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono tracking-wide line-clamp-1 mt-0.5">
                    {brand.subtitle}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

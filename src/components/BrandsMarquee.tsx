'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Default sample brand client list (easily replaced or extended by placing logos in public/clients/)
const BRAND_LOGOS = [
  { id: 'zoom-cargo', name: 'Zoom Cargo', subtitle: 'Logistics & Cargo', logo: '/logo-icon-exact.png', textLogo: 'ZOOM CARGO' },
  { id: 'aura-fitness', name: 'Aura Fitness', subtitle: 'Health & Wellness', textLogo: 'AURA FITNESS' },
  { id: 'apex-ecommerce', name: 'Apex Athletics', subtitle: 'D2C Performance Wear', textLogo: 'APEX ATHLETICS' },
  { id: 'nova-tech', name: 'Nova Commerce', subtitle: 'E-Commerce Brand', textLogo: 'NOVA COMMERCE' },
  { id: 'veloce-motors', name: 'Veloce Mobility', subtitle: 'Automotive EV', textLogo: 'VELOCE' },
  { id: 'zenith-living', name: 'Zenith Real Estate', subtitle: 'Luxury Properties', textLogo: 'ZENITH REALTY' },
  { id: 'lumina-health', name: 'Lumina Care', subtitle: 'Pharma & Biotech', textLogo: 'LUMINA CARE' },
];

export default function BrandsMarquee() {
  return (
    <section className="py-16 bg-[#070709] border-y border-neutral-900/80 relative overflow-hidden select-none">
      {/* Background Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-[#FF1A1A]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-800/40 rounded-full mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A] animate-ping" />
          <span className="text-[10px] text-[#FF1A1A] font-mono font-bold uppercase tracking-[0.25em]">
            TRUSTED BY INDUSTRY LEADERS
          </span>
        </div>

        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white uppercase font-sans">
          BRANDS <span className="text-[#FF1A1A] drop-shadow-[0_0_15px_rgba(255,26,26,0.6)]">TRUST ME</span>
        </h2>
        <p className="text-neutral-400 text-xs md:text-sm mt-2 max-w-xl mx-auto font-light">
          Partnered with ambitious businesses to scale ROAS, optimize acquisition channels, and drive performance growth.
        </p>
      </div>

      {/* Infinite Rolling Marquee Track (Right to Left) */}
      <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            ease: 'linear',
            duration: 25,
            repeat: Infinity,
          }}
          className="flex items-center gap-6 md:gap-10 shrink-0 pr-6 md:pr-10"
        >
          {/* Double array loop for continuous seamless ticker effect */}
          {[...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="px-6 py-4 bg-neutral-900/40 hover:bg-neutral-900/90 border border-neutral-800/80 hover:border-red-900/60 rounded-xl transition-all duration-300 flex items-center gap-4 shrink-0 shadow-lg group cursor-pointer"
            >
              {/* Brand Logo Container */}
              <div className="w-10 h-10 rounded-lg bg-black border border-neutral-800 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#FF1A1A]/60 transition-colors">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#FF1A1A] font-black text-xs font-mono">
                    {brand.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Brand Name & Tagline */}
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-wider group-hover:text-[#FF1A1A] transition-colors font-sans uppercase">
                  {brand.textLogo || brand.name}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono tracking-wide">
                  {brand.subtitle}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

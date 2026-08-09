'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Real client list with exact logo file paths from public/clients/
const REAL_CLIENT_LOGOS = [
  { id: 'pannest', name: 'Pannest', subtitle: 'Surface & Cold Chain Logistics', logo: '/clients/Pannest logo.png' },
  { id: 'zoomcaargo', name: 'ZoomCaargo', subtitle: 'Time-Critical Air Freight', logo: '/clients/zoomcaargo logo.png' },
  { id: 'we3scs', name: 'WE3SCS', subtitle: 'Logistics & Freight Services', logo: '/clients/We3scs logo.png' },
  { id: 'parcel-solution', name: 'Parcel Solution', subtitle: 'Courier & Logistics', logo: '/clients/parcel solution logo.webp' },
  { id: 'skyhorse', name: 'Skyhorse Logistics', subtitle: 'Freight Forwarding', logo: '/clients/skyhorse logo.png' },
  { id: 'itd-software', name: 'ITD Software', subtitle: 'Enterprise Software & IT', logo: '/clients/Itd software logo.png' },
  { id: 'itd-growthlabs', name: 'ITD Growth Labs', subtitle: 'D2C Performance Marketing', logo: '/clients/Itd growthlabs logo.png' },
  { id: 'bhavani', name: 'Bhavani Courier', subtitle: 'Regional Courier Services', logo: '/clients/Bhavani courier logo.png' },
  { id: 'jdic', name: 'JDIC', subtitle: 'International Courier', logo: '/clients/JDIC logo.png' },
  { id: 'sobo', name: 'SOBO Logistics', subtitle: 'Metropolitan Logistics', logo: '/clients/Sobo logistics logo.webp' },
  { id: 'kaizen', name: 'Kaizen Realty', subtitle: 'Real Estate & Property', logo: '/clients/Kaizen arc logo.png' },
  { id: 'bellissima', name: 'Bellissima by Excel', subtitle: 'Beauty & Salon Search Ads', logo: '/clients/Bellissima logo.png' },
  { id: 'style-shine', name: 'Style & Shine Lounge', subtitle: 'Salon & Beauty Marketing', logo: '/clients/Style and shine logo.png' },
  { id: 'cutistic', name: 'Cutistic Gifts', subtitle: 'E-Commerce & Shopify Sales', logo: '/clients/cutistic_logo.avif' },
  { id: 'gujju', name: 'Gujju Express Logistics', subtitle: 'International Courier', logo: '/clients/Gujju express logo.png' },
  { id: 'travelkit', name: 'TravelKitSR', subtitle: 'Travel Gear E-Commerce', logo: '/clients/travelkit-sr logo.png' },
  { id: 'koli-catch', name: 'Koli Catch', subtitle: 'App Installs & JioHotstar', logo: '/clients/Koli match logo.png' },
  { id: 'jit-steels', name: 'Jit Steels', subtitle: 'Industrial Steel Supplies', logo: '/clients/Jit Steels logo.png' },
];

export default function BrandsMarquee() {
  return (
    <section className="py-16 bg-[#060608] border-y border-neutral-900/80 relative overflow-hidden select-none">
      {/* Background Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-[#FF1A1A]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-800/40 rounded-full mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A] animate-ping" />
          <span className="text-[10px] text-[#FF1A1A] font-mono font-bold uppercase tracking-[0.25em]">
            PROVEN PERFORMANCE PARTNERS
          </span>
        </div>

        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white uppercase font-sans">
          BRANDS <span className="text-[#FF1A1A] drop-shadow-[0_0_15px_rgba(255,26,26,0.6)]">TRUST ME</span>
        </h2>
        <p className="text-neutral-400 text-xs md:text-sm mt-2 max-w-xl mx-auto font-light">
          Managing campaigns across logistics, e-commerce, real estate, software, app installs, and consumer brands.
        </p>
      </div>

      {/* Infinite Rolling Marquee Track (Right to Left) */}
      <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            ease: 'linear',
            duration: 35,
            repeat: Infinity,
          }}
          className="flex items-center gap-6 md:gap-8 shrink-0 pr-6 md:pr-8"
        >
          {/* Double array loop for continuous seamless ticker effect */}
          {[...REAL_CLIENT_LOGOS, ...REAL_CLIENT_LOGOS].map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="px-5 py-3.5 bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800/90 hover:border-red-900/60 rounded-xl transition-all duration-300 flex items-center gap-3.5 shrink-0 shadow-lg group cursor-pointer"
            >
              {/* Brand Logo Image Box */}
              <div className="w-10 h-10 rounded-lg bg-black border border-neutral-800 p-1 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#FF1A1A]/60 transition-colors">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform" 
                />
              </div>

              {/* Brand Name & Subtitle */}
              <div className="flex flex-col">
                <span className="text-xs md:text-sm font-extrabold text-white tracking-wider group-hover:text-[#FF1A1A] transition-colors font-sans uppercase">
                  {brand.name}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono tracking-wide">
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

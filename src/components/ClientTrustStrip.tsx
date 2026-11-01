'use client';

import React from 'react';
import Link from 'next/link';
import { CLIENTS_DATA } from '../data/clientsData';

// All 20 verified brand partners in clean presentation order
const MARQUEE_CLIENTS = [
  'pannest',
  'we3scs',
  'zoomcaargo',
  'parcel-solution',
  'skyhorse',
  'itd-software',
  'itd-growthlabs',
  'bhavani-courier',
  'jdic',
  'sobo-logistics',
  'kaizen-realty',
  'bellissima-by-excel',
  'style-and-shine-lounge',
  'cutistic-gifts',
  'gujju-express-logistics',
  'travelkitsr',
  'koli-catch',
  'jit-steels',
  'cura',
  'hfs-mumineen',
]
  .map((slug) => CLIENTS_DATA.find((c) => c.slug === slug))
  .filter(Boolean) as typeof CLIENTS_DATA;

export default function ClientTrustStrip() {
  return (
    <section
      aria-label="Brands I've Worked With"
      className="py-14 md:py-18 bg-[var(--bg-base)] border-y border-[var(--border-subtle)] relative overflow-hidden select-none"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/20 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[var(--accent-red)]">
            BRAND PARTNERS
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[var(--text-primary)] uppercase">
          BRANDS I&apos;VE WORKED WITH
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] font-normal max-w-xl mx-auto">
          Building growth across industries, businesses and digital platforms.
        </p>
      </div>

      {/* 
        INFINITE CONTINUOUS FLOATING LOGO MARQUEE
        NO CARDS, NO BOXES, NO BORDERS, NO INDIVIDUAL CONTAINERS.
        Logos float directly on the page background.
      */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex items-center gap-12 sm:gap-16 md:gap-20 w-max animate-marquee motion-reduce:animate-none">
          {/* First Sequence */}
          {MARQUEE_CLIENTS.map((client, idx) => (
            <Link
              key={`marquee-1-${client.id}-${idx}`}
              href={`/clients/${client.slug}`}
              aria-label={`View ${client.name} case study`}
              className="group shrink-0 inline-flex items-center justify-center cursor-pointer transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)] rounded-md"
              title={`${client.name} — ${client.subtitle}`}
            >
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                loading="lazy"
                className="h-7 sm:h-8 md:h-10 w-auto max-w-[120px] sm:max-w-[140px] md:max-w-[160px] object-contain opacity-65 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-250"
              />
            </Link>
          ))}

          {/* Second Identical Sequence for Perfectly Seamless Infinite Loop */}
          {MARQUEE_CLIENTS.map((client, idx) => (
            <Link
              key={`marquee-2-${client.id}-${idx}`}
              href={`/clients/${client.slug}`}
              aria-label={`View ${client.name} case study`}
              className="group shrink-0 inline-flex items-center justify-center cursor-pointer transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)] rounded-md"
              title={`${client.name} — ${client.subtitle}`}
            >
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                loading="lazy"
                className="h-7 sm:h-8 md:h-10 w-auto max-w-[120px] sm:max-w-[140px] md:max-w-[160px] object-contain opacity-65 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-250"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

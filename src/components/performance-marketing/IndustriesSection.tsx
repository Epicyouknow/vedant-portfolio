'use client';

import React from 'react';
import { 
  Truck, 
  ShoppingBag, 
  Gem, 
  Building, 
  UtensilsCrossed, 
  Code2, 
  Factory,
  ArrowRight
} from 'lucide-react';

export default function IndustriesSection() {
  const industries = [
    {
      id: 'logistics',
      title: 'Logistics & Courier',
      scope: 'B2B Surface Express • Air Freight • Cold Chain',
      model: 'High-ticket B2B inquiry generation & route-specific intent mapping.',
      icon: Truck,
      tag: 'B2B Lead Gen'
    },
    {
      id: 'ecommerce',
      title: 'D2C & E-commerce',
      scope: 'Shopify • D2C Essentials • Apparel • Custom Goods',
      model: 'Full-funnel Meta catalogues, dynamic retargeting & purchase ROAS.',
      icon: ShoppingBag,
      tag: 'E-commerce Sales'
    },
    {
      id: 'jewellery',
      title: 'Jewellery & Lifestyle',
      scope: '925 Silver • Fine Jewellery • Luxury Lifestyle',
      model: 'Visual storytelling, collection launches & high Average Order Value (AOV).',
      icon: Gem,
      tag: 'High AOV Brand'
    },
    {
      id: 'realestate',
      title: 'Real Estate & Interiors',
      scope: 'Luxury Wallpaper • Interior Architects • Spaces',
      model: 'Geo-targeted lead generation for premium homeowners & interior designers.',
      icon: Building,
      tag: 'Premium Inquiry'
    },
    {
      id: 'food',
      title: 'Food & Delivery',
      scope: 'Specialty Packaged Foods • Gourmet • Regional Delivery',
      model: 'Hyper-local geographic ad sets, repeat purchase loops & seasonal promos.',
      icon: UtensilsCrossed,
      tag: 'Hyper-Local & D2C'
    },
    {
      id: 'saas',
      title: 'SaaS & Technology',
      scope: 'Travel-Tech • Multi-Market Platforms • Digital Portals',
      model: 'User acquisition, advisor interactions & conversion funnel debugging.',
      icon: Code2,
      tag: 'Platform Growth'
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing',
      scope: 'Industrial Equipment • Commercial Packaging • Exports',
      model: 'Exact-match Google Search for industrial buyers and commercial contracts.',
      icon: Factory,
      tag: 'Industrial B2B'
    }
  ];

  return (
    <section id="industries" className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[#ED463B] text-[11px] font-mono font-bold tracking-widest uppercase mb-3">
              CROSS-INDUSTRY OPERATING EXPERIENCE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] font-outfit">
              Diverse Business Models. One Strategic Discipline.
            </h2>
          </div>
          <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-md font-normal leading-relaxed">
            Performance marketing calibrated to your gross margins, sales velocity, and customer decision cycles.
          </p>
        </div>

        {/* 7 Compact Industry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {industries.map((ind, index) => {
            const Icon = ind.icon;
            const isFeatured = index === 0; // Logistics first card
            return (
              <div
                key={ind.id}
                className={`p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs hover:border-[#ED463B]/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${
                  isFeatured ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] flex items-center justify-center text-[#ED463B]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] px-2.5 py-1 rounded-full bg-[var(--bg-card-subtle)]">
                      {ind.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 font-outfit">
                    {ind.title}
                  </h3>
                  <div className="text-xs font-mono text-[#ED463B] mb-3">
                    {ind.scope}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                    {ind.model}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
                  <span>Custom Strategy</span>
                  <span className="text-[#ED463B]">&bull; Active Scope</span>
                </div>
              </div>
            );
          })}

          {/* Quick Consultation Prompt Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#191919] to-[#121211] text-white border border-neutral-800 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#ED463B] font-bold">
                DIFFERENT INDUSTRY?
              </span>
              <h3 className="text-lg font-bold text-white mt-2 mb-2 font-outfit">
                Your Market Has Unique Levers
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed font-normal">
                Let&apos;s map your customer journey, pricing elasticity, and margin structure into a bespoke media plan.
              </p>
            </div>

            <a
              href="#enquiry"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ED463B] hover:text-white transition-colors"
            >
              <span>Discuss Your Niche &rarr;</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}


'use client';

import React, { useState } from 'react';
import { MessageSquareQuote, Plus, Star, CheckCircle2, X } from 'lucide-react';

interface Testimonial {
  id: string;
  author: string;
  company: string;
  role: string;
  quote: string;
  rating: number;
  featured: boolean;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    author: 'Aarav Mehta',
    company: 'Cutistic Gifts',
    role: 'Founder & CEO',
    quote: 'Vedant took our Meta Ads ROAS from 1.8x to 4.60x within our peak Diwali gifting window. His creative testing structure completely transformed our direct-to-consumer acquisition profitability.',
    rating: 5,
    featured: true,
  },
  {
    id: 't2',
    author: 'Rajesh Patel',
    company: 'Gujju Express Logistics',
    role: 'Managing Director',
    quote: 'Over 720 verified international courier WhatsApp inquiries generated in Surat at under ₹36 each. The Gujarati video creative testing was brilliantly localized.',
    rating: 5,
    featured: true,
  },
  {
    id: 't3',
    author: 'Siddharth Roy',
    company: 'Bellissima by Excel',
    role: 'VP Marketing',
    quote: 'Our Google Ads suspension was halted and resolved within days, bringing CPL down 42% on multi-crore luxury residential units.',
    rating: 5,
    featured: true,
  },
];

export default function TestimonialsManagerPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
            SOCIAL PROOF • CLIENT ENDORSEMENTS
          </div>
          <h1 className="vv-h1">Testimonials manager</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
            Verified client recommendations, quotes, founder feedback, and social proof showcase.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="vv-card p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="vv-badge vv-badge--success">Verified</span>
              </div>
              <p className="text-xs text-[var(--ink)] leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--line)]">
              <div className="text-xs font-bold text-[var(--ink)]">{t.author}</div>
              <div className="text-[11px] text-[var(--muted)]">{t.role} · {t.company}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


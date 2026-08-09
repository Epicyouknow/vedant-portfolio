import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CLIENTS_DATA, ClientData } from '../../../data/clientsData';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Target, 
  Compass, 
  Layers, 
  Cpu, 
  Globe, 
  User, 
  Zap, 
  ShieldCheck, 
  Share2 
} from 'lucide-react';
import ParticleBackground from '../../../components/ParticleBackground';
import CreditsFooter from '../../../components/CreditsFooter';

interface ClientPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CLIENTS_DATA.map((client) => ({
    slug: client.slug,
  }));
}

export default async function ClientCaseStudyPage({ params }: ClientPageProps) {
  const resolvedParams = await params;
  const client = CLIENTS_DATA.find((c) => c.slug === resolvedParams.slug);

  if (!client) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-[#050507] text-white overflow-hidden select-none font-sans flex flex-col justify-between">
      <ParticleBackground />
      <div className="vignette-overlay" />
      <div className="noise-overlay" />

      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 z-40 px-6 md:px-16 flex items-center justify-between border-b border-neutral-900 bg-black/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 text-[#FF1A1A] font-black tracking-wider text-sm hover:text-white transition-colors uppercase">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to VedantVerse Portfolio</span>
        </Link>

        <a
          href={client.website}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-[#FF1A1A] hover:bg-[#d90e0e] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(255,26,26,0.5)] flex items-center gap-2"
        >
          <span>Visit Live Client Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20 w-full flex-1">
        
        {/* CLIENT HERO TITLE CARD */}
        <div className="bg-[#0c0c10] border border-neutral-800 rounded-2xl p-8 md:p-12 shadow-2xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-950/20 blur-[100px] pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-900 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-black border border-neutral-800 p-2 shrink-0 flex items-center justify-center shadow-xl">
                <img src={client.logo} alt={client.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-[10px] text-[#FF1A1A] font-mono font-bold uppercase tracking-[0.25em] block mb-1">
                  PERFORMANCE MARKETING CASE STUDY
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase font-sans tracking-tight">
                  {client.name}
                </h1>
                <p className="text-neutral-400 text-sm font-mono mt-1">{client.subtitle}</p>
              </div>
            </div>

            <a
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white font-bold text-xs font-mono uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center gap-2 shrink-0"
            >
              <Globe className="w-4 h-4 text-[#FF1A1A]" />
              <span>{client.website.replace('https://', '').replace('http://', '').replace('www.', '').replace('/', '')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </a>
          </div>

          {/* QUICK SPEC GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900">
              <span className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">CAMPAIGN FOCUS</span>
              <span className="text-white font-mono font-bold text-sm">{client.campaign}</span>
            </div>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900">
              <span className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">PRIMARY OBJECTIVE</span>
              <span className="text-[#FF1A1A] font-mono font-bold text-sm">{client.objective}</span>
            </div>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900">
              <span className="text-[10px] text-neutral-500 font-mono uppercase block mb-1">PLATFORMS USED</span>
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                {client.platforms.map((p) => (
                  <span key={p} className="px-2.5 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-mono rounded">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CASE STUDY DETAILS */}
        <div className="space-y-8">
          {/* MY ROLE */}
          <div className="bg-[#0c0c10] border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-[#FF1A1A]" />
              <h3 className="text-xs font-mono font-bold text-[#FF1A1A] uppercase tracking-widest">MY ROLE & SCOPE</h3>
            </div>
            <p className="text-white font-mono text-sm md:text-base font-semibold">{client.role}</p>
          </div>

          {/* THE CHALLENGE */}
          <div className="bg-[#0c0c10] border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-[#FF1A1A]" />
              <h3 className="text-xs font-mono font-bold text-[#FF1A1A] uppercase tracking-widest">THE CHALLENGE</h3>
            </div>
            <p className="text-neutral-300 text-sm md:text-base font-light leading-relaxed">{client.challenge}</p>
          </div>

          {/* THE APPROACH */}
          <div className="bg-[#0c0c10] border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-5 h-5 text-[#FF1A1A]" />
              <h3 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-widest">THE STRATEGY & APPROACH</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {client.approach.map((step, idx) => (
                <div key={idx} className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 flex items-start gap-3 text-xs text-neutral-300">
                  <span className="w-5 h-5 rounded-full bg-red-950 text-[#FF1A1A] font-mono font-bold flex items-center justify-center shrink-0 border border-red-900/60">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RESULT / IMPACT */}
          <div className="bg-gradient-to-r from-red-950/40 via-[#0c0c10] to-[#0c0c10] border border-red-900/60 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">PERFORMANCE RESULT & IMPACT</h3>
            </div>
            <p className="text-white text-base md:text-lg font-medium leading-relaxed">{client.result}</p>
          </div>
        </div>

        {/* Back Link Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/#client-intelligence"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 shadow-xl"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF1A1A]" />
            <span>Explore All Client Intelligence Case Studies</span>
          </Link>
        </div>
      </main>

      <CreditsFooter />
    </div>
  );
}

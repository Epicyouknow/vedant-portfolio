import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CLIENTS_DATA, ClientData } from '../../../data/clientsData';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Target, 
  Compass, 
  Globe, 
  User, 
  Zap, 
  ChevronRight,
  ArrowUpRight
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

export async function generateMetadata({ params }: ClientPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const client = CLIENTS_DATA.find((c) => c.slug === resolvedParams.slug);

  if (!client) {
    return {
      title: 'Case Study Not Found | VedantVerse',
    };
  }

  return {
    title: `${client.name} Case Study | ${client.campaign} | VedantVerse`,
    description: `Performance marketing case study for ${client.name} by Vedant Tiwari. Objective: ${client.objective}. Strategy: ${client.challenge} Platforms: ${client.platforms.join(', ')}.`,
    keywords: [
      `${client.name} performance marketing`,
      `${client.name} case study`,
      `${client.campaign}`,
      'Vedant Tiwari case study',
      'Performance Marketing Executive Mumbai',
      ...client.platforms,
    ],
    metadataBase: new URL('https://vedantverse.in'),
    alternates: {
      canonical: `https://vedantverse.in/clients/${client.slug}`,
    },
    openGraph: {
      title: `${client.name} Case Study - ${client.campaign} | VedantVerse`,
      description: `Performance marketing strategy & growth results for ${client.name}. Objective: ${client.objective}.`,
      url: `https://vedantverse.in/clients/${client.slug}`,
      siteName: 'VedantVerse',
      images: [
        {
          url: client.logo,
          alt: `${client.name} Logo`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${client.name} Performance Case Study | VedantVerse`,
      description: `Growth case study for ${client.name} by Vedant Tiwari.`,
    },
  };
}

export default async function ClientCaseStudyPage({ params }: ClientPageProps) {
  const resolvedParams = await params;
  const client = CLIENTS_DATA.find((c) => c.slug === resolvedParams.slug);

  if (!client) {
    notFound();
  }

  const otherClients = CLIENTS_DATA.filter((c) => c.slug !== client.slug).slice(0, 6);

  return (
    <div className="relative min-h-screen bg-[#050507] text-white overflow-hidden select-none font-sans flex flex-col justify-between">
      <ParticleBackground />
      <div className="vignette-overlay" />
      <div className="noise-overlay" />

      {/* Responsive Fixed Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 md:h-18 z-40 px-4 md:px-12 flex items-center justify-between border-b border-neutral-900 bg-black/90 backdrop-blur-md">
        <Link 
          href="/#client-intelligence" 
          className="flex items-center gap-2 text-[#FF1A1A] font-bold tracking-wider text-xs md:text-sm hover:text-white transition-colors uppercase shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Portfolio</span>
          <span className="sm:hidden">Portfolio</span>
        </Link>

        <a
          href={client.website}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 md:px-4 md:py-2 bg-[#FF1A1A] hover:bg-[#d90e0e] text-white font-bold text-[11px] md:text-xs uppercase tracking-wider rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(255,26,26,0.5)] flex items-center gap-1.5 shrink-0"
        >
          <span className="hidden sm:inline">Visit Live Client Site</span>
          <span className="sm:hidden">Visit Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-20 md:pt-28 pb-16 w-full flex-1">
        
        {/* CLIENT HERO TITLE CARD */}
        <div className="bg-[#0c0c10] border border-neutral-800/90 rounded-xl md:rounded-2xl p-5 md:p-8 shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-950/20 blur-[100px] pointer-events-none rounded-full" />

          {/* Logo & Name Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-900 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-black border border-neutral-800 p-1.5 shrink-0 flex items-center justify-center shadow-xl">
                <img src={client.logo} alt={client.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-[10px] md:text-xs text-[#FF1A1A] font-bold uppercase tracking-widest block mb-0.5">
                  PERFORMANCE MARKETING CASE STUDY
                </span>
                <h1 className="text-2xl md:text-4xl font-black text-white uppercase font-sans tracking-tight leading-tight">
                  {client.name}
                </h1>
                <p className="text-neutral-400 text-xs md:text-sm font-sans mt-0.5">{client.subtitle}</p>
              </div>
            </div>

            <a
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shrink-0 shadow-md"
            >
              <Globe className="w-3.5 h-3.5 text-[#FF1A1A]" />
              <span className="truncate max-w-[200px]">{client.website.replace('https://', '').replace('http://', '').replace('www.', '').replace('/', '')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </a>
          </div>

          {/* QUICK SPEC GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block mb-1">CAMPAIGN FOCUS</span>
              <span className="text-white font-bold text-xs md:text-sm">{client.campaign}</span>
            </div>
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block mb-1">PRIMARY OBJECTIVE</span>
              <span className="text-[#FF1A1A] font-bold text-xs md:text-sm">{client.objective}</span>
            </div>
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block mb-1">PLATFORMS USED</span>
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                {client.platforms.map((p) => (
                  <span key={p} className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-200 text-[11px] font-semibold rounded">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CASE STUDY DETAILS */}
        <div className="space-y-6 mb-12">
          {/* MY ROLE */}
          <div className="bg-[#0c0c10] border border-neutral-800/90 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-[#FF1A1A]" />
              <h3 className="text-xs font-bold text-[#FF1A1A] uppercase tracking-widest">MY ROLE & SCOPE</h3>
            </div>
            <p className="text-white text-xs md:text-sm font-semibold leading-relaxed">{client.role}</p>
          </div>

          {/* THE CHALLENGE */}
          <div className="bg-[#0c0c10] border border-neutral-800/90 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-[#FF1A1A]" />
              <h3 className="text-xs font-bold text-[#FF1A1A] uppercase tracking-widest">THE CHALLENGE</h3>
            </div>
            <p className="text-neutral-300 text-xs md:text-sm font-normal leading-relaxed">{client.challenge}</p>
          </div>

          {/* THE APPROACH */}
          <div className="bg-[#0c0c10] border border-neutral-800/90 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-[#FF1A1A]" />
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">THE STRATEGY & APPROACH</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {client.approach.map((step, idx) => (
                <div key={idx} className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900 flex items-start gap-2.5 text-xs text-neutral-300">
                  <span className="w-5 h-5 rounded-full bg-red-950 text-[#FF1A1A] font-bold text-[11px] flex items-center justify-center shrink-0 border border-red-900/60">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-normal">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RESULT / IMPACT */}
          <div className="bg-gradient-to-r from-red-950/40 via-[#0c0c10] to-[#0c0c10] border border-red-900/60 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">PERFORMANCE RESULT & IMPACT</h3>
            </div>
            <p className="text-white text-sm md:text-base font-semibold leading-relaxed">{client.result}</p>
          </div>
        </div>

        {/* OTHER CLIENT CASE STUDIES ROW */}
        <div className="border-t border-neutral-900 pt-10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base md:text-lg font-extrabold text-white uppercase tracking-tight">
              Explore Other Client Case Studies
            </h3>
            <Link href="/#client-intelligence" className="text-xs text-[#FF1A1A] hover:text-white uppercase font-bold flex items-center gap-1">
              <span className="hidden sm:inline">View All 18 Clients</span>
              <span className="sm:hidden">All 18</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {otherClients.map((oc) => (
              <Link
                key={oc.id}
                href={`/clients/${oc.slug}`}
                className="bg-[#0c0c10] hover:bg-[#13131a] border border-neutral-800/90 hover:border-red-900/70 p-3.5 rounded-xl transition-all duration-300 flex items-center gap-3 group shadow-md"
              >
                <div className="w-9 h-9 rounded-lg bg-black border border-neutral-800 p-1 shrink-0 flex items-center justify-center">
                  <img src={oc.logo} alt={oc.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white group-hover:text-[#FF1A1A] transition-colors truncate uppercase">
                    {oc.name}
                  </h4>
                  <span className="text-[10px] text-neutral-500 truncate block">
                    {oc.subtitle}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-[#FF1A1A] shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Back Link Footer */}
        <div className="mt-10 text-center">
          <Link
            href="/#client-intelligence"
            className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 shadow-xl"
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

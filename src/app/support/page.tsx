'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Mail, Clock, HelpCircle, Terminal } from 'lucide-react';
import CreditsFooter from '../../components/CreditsFooter';

export default function ContactSupport() {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans flex flex-col justify-between selection:bg-[#E50914] selection:text-white">
      {/* Background Red Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-red-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-red-600/5 blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 h-16 md:h-20 bg-black/90 backdrop-blur-md border-b border-neutral-900/50 z-40 px-6 md:px-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-widest transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 text-[#E50914]" />
          Back to Portfolio
        </Link>
        <span className="text-[#E50914] font-black text-lg tracking-wider font-sans select-none" style={{ fontFamily: 'var(--netflix-title-font)' }}>
          VEDANTVERSE
        </span>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 md:py-24 relative z-10 w-full">
        <div className="space-y-12">
          {/* Header Title */}
          <div className="border-b border-neutral-900 pb-8 space-y-3">
            <span className="text-[#E50914] text-[10px] font-bold uppercase tracking-[0.3em] font-mono flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Support & Helpdesk
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
              Contact Support
            </h1>
            <p className="text-neutral-400 text-xs md:text-sm font-light">
              Need assistance or want to connect? I'd be happy to hear from you.
            </p>
          </div>

          {/* Support Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* General Enquiries */}
            <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-6 space-y-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm"></span>
                General Enquiries
              </h2>
              <p className="text-neutral-400 text-xs font-light leading-relaxed">
                For collaborations, freelance opportunities, hiring discussions, or questions:
              </p>
              
              <div className="space-y-3">
                <a
                  href="mailto:tiwarivedant705@gmail.com"
                  className="flex items-center gap-3 p-3 bg-neutral-900/40 border border-neutral-900 rounded-lg text-xs font-mono hover:border-white transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 text-[#E50914]" />
                  tiwarivedant705@gmail.com
                </a>
                
                <a
                  href="https://linkedin.com/in/vedant-tiwarii"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-neutral-900/40 border border-neutral-900 rounded-lg text-xs font-bold hover:border-white transition-colors duration-200"
                >
                  <svg className="w-4 h-4 fill-current text-[#E50914]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Vedant Tiwari (LinkedIn)
                </a>

                <a
                  href="https://github.com/Epicyouknow"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-neutral-900/40 border border-neutral-900 rounded-lg text-xs font-bold hover:border-white transition-colors duration-200"
                >
                  <svg className="w-4 h-4 fill-current text-[#E50914]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  VedantVerse (GitHub)
                </a>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
                <Clock className="w-3.5 h-3.5" />
                Response Time: Typically within 24–48 hours.
              </div>
            </div>

            {/* Business Enquiries */}
            <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm"></span>
                Business Enquiries
              </h2>
              <p className="text-neutral-400 text-xs font-light leading-relaxed">
                Available for contract roles and strategic growth consultations in:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-neutral-300 font-mono">
                <span className="p-2 bg-neutral-900/30 rounded border border-neutral-900">• Performance Marketing</span>
                <span className="p-2 bg-neutral-900/30 rounded border border-neutral-900">• Google Ads</span>
                <span className="p-2 bg-neutral-900/30 rounded border border-neutral-900">• Meta Ads</span>
                <span className="p-2 bg-neutral-900/30 rounded border border-neutral-900">• Media Planning & Buying</span>
                <span className="p-2 bg-neutral-900/30 rounded border border-neutral-900">• Growth Marketing</span>
                <span className="p-2 bg-neutral-900/30 rounded border border-neutral-900">• Branding Strategy</span>
                <span className="p-2 bg-neutral-900/30 rounded border border-neutral-900">• Website Consulting</span>
                <span className="p-2 bg-neutral-900/30 rounded border border-neutral-900">• Marketing Audits</span>
              </div>
            </div>

          </div>

          {/* Technical Support guidelines */}
          <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-6 space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#E50914]" />
              Technical Support
            </h2>
            <p className="text-neutral-400 text-xs font-light leading-relaxed">
              If you encounter any issues while loading/using the website dashboards or AI features, please send a report to the email above containing:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-900 flex flex-col justify-between">
                <span className="text-neutral-500 font-bold block mb-1">01. DEVICE</span>
                <span className="text-neutral-300 font-normal">e.g. iPhone 15</span>
              </div>
              <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-900 flex flex-col justify-between">
                <span className="text-neutral-500 font-bold block mb-1">02. BROWSER</span>
                <span className="text-neutral-300 font-normal">e.g. Chrome 125</span>
              </div>
              <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-900 flex flex-col justify-between">
                <span className="text-neutral-500 font-bold block mb-1">03. OS VERSION</span>
                <span className="text-neutral-300 font-normal">e.g. iOS 17.4</span>
              </div>
              <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-900 flex flex-col justify-between">
                <span className="text-neutral-500 font-bold block mb-1">04. DETAIL</span>
                <span className="text-neutral-300 font-normal">e.g. Text overlap</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <CreditsFooter />
    </div>
  );
}

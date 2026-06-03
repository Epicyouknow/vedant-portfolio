'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Play, SkipForward, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

interface IntroAnimationProps {
  onComplete: (profileId: string) => void;
}

interface VLogoStepProps {
  onComplete: () => void;
}

function VLogoStep({ onComplete }: VLogoStepProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const leftStemRef = useRef<SVGPathElement>(null);
  const rightStemRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Background barcode particles
    const container = particlesContainerRef.current;
    if (container) {
      container.innerHTML = '';
      for (let i = 0; i < 20; i++) {
        const line = document.createElement('div');
        line.className = 'absolute bg-red-600 opacity-0';
        line.style.width = `${1 + Math.random() * 2}px`;
        line.style.height = `${80 + Math.random() * 100}vh`;
        line.style.left = `${Math.random() * 100}%`;
        line.style.top = `${-40 + Math.random() * 40}%`;
        line.style.filter = 'blur(1px)';
        container.appendChild(line);
      }
    }

    if (!leftStemRef.current || !rightStemRef.current || !svgRef.current || !glowRef.current) {
      onComplete();
      return;
    }

    const t = gsap.timeline({
      onComplete: onComplete
    });

    t.fromTo(leftStemRef.current, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' });
    t.fromTo(rightStemRef.current, { strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.6');
    
    t.to(glowRef.current, { opacity: 1, filter: 'drop-shadow(0 0 35px #E50914) drop-shadow(0 0 70px #B20710)', duration: 0.4 }, '-=0.3');

    if (container) {
      t.to(container.children, {
        opacity: () => 0.1 + Math.random() * 0.4,
        y: () => 250 + Math.random() * 350,
        stagger: 0.02,
        duration: 1.0,
        ease: 'power3.in'
      }, '-=0.6');
    }

    t.to(svgRef.current, { scale: 30, x: -30, opacity: 0, duration: 1.0, ease: 'power4.in' });
    t.to(glowRef.current, { opacity: 0, duration: 0.3 }, '-=0.4');
  }, [onComplete]);

  return (
    <div key="v-logo-draw" className="relative w-full h-full flex items-center justify-center bg-black">
      <div ref={particlesContainerRef} className="absolute inset-0 z-10 overflow-hidden pointer-events-none" />
      <div ref={glowRef} className="absolute w-[500px] h-[500px] rounded-full bg-red-700/10 blur-[100px] opacity-0 z-0 pointer-events-none" />
      
      <svg
        ref={svgRef}
        className="w-48 h-48 md:w-60 md:h-60 z-20 overflow-visible"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="leftV" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E50914" />
            <stop offset="100%" stopColor="#800206" />
          </linearGradient>
          <linearGradient id="rightV" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B20710" />
            <stop offset="100%" stopColor="#E50914" />
          </linearGradient>
          <filter id="vglow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path ref={leftStemRef} d="M15 10 L50 85" stroke="url(#leftV)" strokeWidth="15" strokeLinecap="square" strokeDasharray="1000" strokeDashoffset="1000" filter="url(#vglow)" />
        <path ref={rightStemRef} d="M50 85 L85 10" stroke="url(#rightV)" strokeWidth="15" strokeLinecap="square" strokeDasharray="1000" strokeDashoffset="1000" filter="url(#vglow)" />
      </svg>
    </div>
  );
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [step, setStep] = useState<'profile' | 'v-logo' | 'trailer'>('profile');
  const [selectedProfileId, setSelectedProfileId] = useState('performance-marketing');
  


  // Trailer slide states
  const [trailerSlide, setTrailerSlide] = useState(0);

  // Voiceover captions matching each trailer slide
  const voiceovers = [
    "From building brands...",
    "...to scaling campaigns and driving measurable growth...",
    "...leveraging technical tracking APIs and data-driven targeting...",
    "...this is the journey of Vedant Tiwari."
  ];

  // Synthesize classic Netflix thud 'Tudum' audio
  const playTudum = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Lower deep thud oscillator
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(60, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.8);
      gain1.gain.setValueAtTime(0.001, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.1);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      // Mid transient oscillator
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110, ctx.currentTime + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8);
      gain2.gain.setValueAtTime(0.001, ctx.currentTime + 0.08);
      gain2.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      // High metallic chime filter
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc3.type = 'square';
      osc3.frequency.setValueAtTime(220, ctx.currentTime + 0.1);
      osc3.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
      filter.type = 'bandpass';
      filter.Q.value = 5;
      filter.frequency.value = 800;
      gain3.gain.setValueAtTime(0.001, ctx.currentTime + 0.1);
      gain3.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.18);
      gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      // Connect and run
      osc1.connect(gain1); gain1.connect(ctx.destination);
      osc2.connect(gain2); gain2.connect(ctx.destination);
      osc3.connect(filter); filter.connect(gain3); gain3.connect(ctx.destination);

      osc1.start(); osc2.start(); osc3.start();
      osc1.stop(ctx.currentTime + 1.4); osc2.stop(ctx.currentTime + 1.4); osc3.stop(ctx.currentTime + 1.4);
    } catch (e) {
      console.warn("Tudum AudioContext synthesis blocked", e);
    }
  };

  const handleProfileSelect = (id: string) => {
    setSelectedProfileId(id);
    playTudum();
    setStep('v-logo');
  };



  // Cinematic Trailer Slideshow sequence (runs for ~16s)
  useEffect(() => {
    if (step !== 'trailer') return;

    const interval = setInterval(() => {
      setTrailerSlide((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          onComplete(selectedProfileId);
          return prev;
        }
        return prev + 1;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [step, onComplete, selectedProfileId]);

  const triggerSkip = () => {
    onComplete(selectedProfileId);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden font-sans select-none">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: Who's Watching Vedant Profile Selection */}
        {step === 'profile' && (
          <motion.div
            key="profile-selection"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            className="text-center px-4 max-w-5xl"
          >
            <h1 className="text-3xl md:text-5xl font-medium tracking-wide mb-12 text-neutral-100 uppercase font-sans">
              Who's Watching Vedant?
            </h1>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              {portfolioData.profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProfileSelect(p.id)}
                  className="group flex flex-col items-center focus:outline-none"
                >
                  {/* Glowing dynamic watcher profile avatar card */}
                  <div 
                    className="w-24 h-24 md:w-28 md:h-28 rounded-md flex items-center justify-center text-4xl border-2 border-transparent transition-all duration-300 transform group-hover:scale-105 shadow-xl relative overflow-hidden bg-neutral-900"
                    style={{ 
                      boxShadow: `0 8px 30px rgba(0,0,0,0.5)`,
                    }}
                  >
                    {/* Unique watcher profile border highlights on hover */}
                    <div 
                      className="absolute inset-0 border-2 border-transparent group-hover:border-white transition-colors duration-300 rounded-md z-20"
                      style={{ 
                        borderColor: `transparent`,
                      }}
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10" />
                    <span className="relative z-10 filter drop-shadow-md group-hover:animate-bounce">
                      {p.avatar}
                    </span>
                  </div>
                  
                  <span className="mt-4 text-xs md:text-sm text-neutral-400 group-hover:text-white transition-colors tracking-wide max-w-[140px] font-semibold text-center">
                    {p.title.split(' ')[0]} {p.title.split(' ')[1] || ''}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-20">
              <button
                onClick={triggerSkip}
                className="px-6 py-2 border border-neutral-700 text-neutral-500 hover:border-neutral-300 hover:text-neutral-200 transition-colors uppercase tracking-widest text-xs font-semibold cursor-pointer"
              >
                Skip Preview & Enter Site
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: GSAP Cinematic Red V Logo Draw */}
        {step === 'v-logo' && (
          <div className="relative w-full h-full">
            <VLogoStep onComplete={() => setStep('trailer')} />
            <button
              onClick={triggerSkip}
              className="absolute top-6 right-6 z-30 flex items-center gap-2 px-4 py-2 border border-neutral-800 bg-black/60 hover:bg-white hover:text-black hover:border-white text-neutral-500 hover:text-neutral-200 font-semibold uppercase tracking-widest text-[10px] transition-all duration-300 shadow-lg cursor-pointer rounded"
            >
              Skip Preview
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* STEP 3: Netflix Original Career Trailer (Slideshow) */}
        {step === 'trailer' && (
          <div key="career-trailer" className="relative w-full h-full bg-black flex flex-col justify-between p-8 md:p-16 z-20">
            {/* Ambient Background Light matching selected color */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-red-950/10 blur-[130px] pointer-events-none z-0" />
            
            {/* Header: Series Brand watermark */}
            <div className="flex items-center justify-between relative z-10 w-full">
              <div className="flex items-center gap-2">
                <span className="text-[#E50914] text-xl font-bold tracking-tighter glow-text-red">V</span>
                <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-[0.2em]">Vedantverse Series Trailer</span>
              </div>
              <span className="text-[10px] text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded font-mono uppercase tracking-widest">
                Original Preview
              </span>
            </div>

            {/* Middle: Video-Trailer Motion Graphics slides */}
            <div className="flex-1 w-full flex items-center justify-center relative max-w-4xl mx-auto z-10">
              <AnimatePresence mode="wait">
                
                {/* Slide 1: General Introduction title card */}
                {trailerSlide === 0 && (
                  <motion.div
                    key="ts-0"
                    initial={{ opacity: 0, scale: 0.92, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                  >
                    <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.3em] block">Now Streaming</span>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white uppercase font-sans">
                      THE VEDANT TIWARI ORIGINAL
                    </h2>
                    <p className="text-neutral-500 text-sm tracking-widest font-light">SEASON 1: GROWTH COMMANDER</p>
                  </motion.div>
                )}

                {/* Slide 2: Campaign Spend stats card */}
                {trailerSlide === 1 && (
                  <motion.div
                    key="ts-1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full"
                  >
                    <div className="space-y-4 text-left">
                      <span className="text-red-500 text-xs font-bold uppercase tracking-[0.2em] block">Campaign Telemetry</span>
                      <h3 className="text-3xl md:text-5xl font-extrabold text-white leading-tight uppercase">
                        SCALING MARKETING ACQUISITIONS
                      </h3>
                      <p className="text-neutral-400 text-sm font-light">
                        Deploying strategic budgets across Meta Ads, Google Ads, and Programmatic exchanges to drive high ROAS metrics.
                      </p>
                    </div>
                    <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-lg glass-panel flex flex-col justify-center items-center text-center space-y-4 h-48 glow-box-red">
                      <span className="text-5xl font-black text-white glow-text">₹15L+</span>
                      <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold">Total Ad Budget Engineered</span>
                    </div>
                  </motion.div>
                )}

                {/* Slide 3: Cross-channel platform nodes card */}
                {trailerSlide === 2 && (
                  <motion.div
                    key="ts-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-6"
                  >
                    <span className="text-red-500 text-xs font-bold uppercase tracking-[0.2em] block">Platform Command</span>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-white uppercase max-w-xl mx-auto leading-none">
                      7+ ADVERTISING PLATFORMS INTEGRATED
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
                      {["Meta Ads", "Google Ads", "Amazon Ads", "DV360", "CM360", "Reddit Ads", "Q-Commerce"].map((tag) => (
                        <span key={tag} className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 rounded font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Slide 4: Closing visual */}
                {trailerSlide === 3 && (
                  <motion.div
                    key="ts-3"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-5"
                  >
                    <div className="w-16 h-16 bg-red-950/40 border border-red-800/40 rounded-full flex items-center justify-center text-white mx-auto animate-pulse">
                      <ShieldCheck className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-white uppercase">
                      CREDENTIALS FULLY VERIFIED
                    </h3>
                    <p className="text-neutral-500 text-xs uppercase tracking-widest max-w-sm mx-auto font-light">
                      GA4, GTM Tag Pipelines, DV360 programmatic configurations ready for deployment.
                    </p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Bottom: Caption track / skip button */}
            <div className="w-full relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              
              {/* Voiceover Captions */}
              <div className="max-w-xl text-left border-l-2 border-red-600 pl-4 h-16 flex items-center bg-black/40">
                <p className="text-neutral-200 text-xs md:text-sm italic font-light font-sans tracking-wide leading-relaxed animate-pulse">
                  "{voiceovers[trailerSlide] || voiceovers[0]}"
                </p>
              </div>

              {/* Skip Intro controls */}
              <div className="flex items-center justify-end">
                <button
                  onClick={triggerSkip}
                  className="flex items-center gap-2 px-6 py-3 border border-neutral-700 bg-black/40 hover:bg-white hover:text-black hover:border-white text-neutral-400 font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-lg cursor-pointer rounded"
                >
                  Skip Preview
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

      </AnimatePresence>
    </div>
  );
}

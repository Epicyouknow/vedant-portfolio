'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Play, SkipForward, Volume2, ShieldCheck, Target, Globe, Activity, Award, FileText, Lightbulb, TrendingUp, Layout, Tag, Code, PenTool, Smartphone } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

interface IntroAnimationProps {
  onComplete: (profileId: string) => void;
}

function PlatformIcon({ name }: { name: string }) {
  const className = "w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors";
  if (name === "Meta Ads") {
    return (
      <svg className="w-3.5 h-3.5 text-[#3B82F6]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 6C15.12 6 13.9 6.88 13.5 8.12C12.92 6.8 11.53 6 10 6C7.51 6 5.5 8.01 5.5 10.5C5.5 12.99 7.51 15 10 15C11.53 15 12.92 14.2 13.5 12.88C13.9 14.12 15.12 15 16.5 15C18.99 15 21 12.99 21 10.5C21 8.01 18.99 6 16.5 6ZM10 13.5C8.34 13.5 7 12.16 7 10.5C7 8.84 8.34 7.5 10 7.5C11.66 7.5 13 8.84 13 10.5C13 12.16 11.66 13.5 10 13.5ZM16.5 13.5C14.84 13.5 13.5 12.16 13.5 10.5C13.5 8.84 14.84 7.5 16.5 7.5C18.16 7.5 19.5 8.84 19.5 10.5C19.5 12.16 18.16 13.5 16.5 13.5Z" />
      </svg>
    );
  }
  if (name === "Google Ads" || name === "Google Marketing") {
    return (
      <svg className="w-3.5 h-3.5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 7.16 1 3 5.16 3 10.25s4.16 9.25 9.24 9.25c5.3 0 8.827-3.725 8.827-8.988 0-.604-.066-1.066-.145-1.527H12.24z" />
      </svg>
    );
  }
  
  switch (name) {
    case "YouTube Ads":
      return <Play className="w-3.5 h-3.5 text-[#FF0000]" />;
    case "DV360":
      return <Target className="w-3.5 h-3.5 text-[#34A853]" />;
    case "CM360":
      return <Activity className="w-3.5 h-3.5 text-[#FBBC05]" />;
    case "Brand Strategy":
      return <Award className="w-3.5 h-3.5 text-[#F59E0B]" />;
    case "Content Strategy":
      return <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />;
    case "Creative Direction":
      return <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B]" />;
    case "GA4":
      return <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />;
    case "Looker Studio":
      return <Layout className="w-3.5 h-3.5 text-[#10B981]" />;
    case "Tag Manager":
      return <Tag className="w-3.5 h-3.5 text-[#10B981]" />;
    case "Web Development":
      return <Code className="w-3.5 h-3.5 text-[#8B5CF6]" />;
    case "UI/UX Design":
      return <PenTool className="w-3.5 h-3.5 text-[#8B5CF6]" />;
    case "App Development":
      return <Smartphone className="w-3.5 h-3.5 text-[#8B5CF6]" />;
    default:
      return <Globe className={className} />;
  }
}

interface VLogoStepProps {
  onComplete: () => void;
}

function VLogoStep({ onComplete }: VLogoStepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<SVGLineElement>(null);
  const leftStemRef = useRef<SVGPathElement>(null);
  const rightStemRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [sparks, setSparks] = useState<{ id: number; tx: number; ty: number }[]>([]);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const durationMultiplier = isMobile ? 0.65 : 1.0;

    const t = gsap.timeline({
      onComplete: onComplete
    });

    // Step 1: Red Light Beam appears in center
    t.fromTo(beamRef.current, 
      { strokeDashoffset: 100, opacity: 0 }, 
      { strokeDashoffset: 0, opacity: 1, duration: 0.4 * durationMultiplier, ease: 'power1.out' }
    );

    // Step 2: Splits and forms the V
    t.to(beamRef.current, { opacity: 0, duration: 0.2 * durationMultiplier }, 'split');
    t.fromTo(leftStemRef.current, 
      { strokeDashoffset: 100 }, 
      { strokeDashoffset: 0, duration: 0.6 * durationMultiplier, ease: 'power2.inOut' }, 
      'split'
    );
    t.fromTo(rightStemRef.current, 
      { strokeDashoffset: 100 }, 
      { strokeDashoffset: 0, duration: 0.6 * durationMultiplier, ease: 'power2.inOut' }, 
      'split+=0.1'
    );

    // Step 3 & 4: Energy Glow/Burst & pulsing background red ambient light
    t.add(() => {
      const sparkCount = isMobile ? 8 : 12;
      const sparkList = Array.from({ length: sparkCount }).map((_, i) => {
        const angle = (i / sparkCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const dist = isMobile ? 40 + Math.random() * 40 : 60 + Math.random() * 80;
        return {
          id: i,
          tx: Math.cos(angle) * dist,
          ty: Math.sin(angle) * dist - 15
        };
      });
      setSparks(sparkList);
    }, 'split+=0.6');

    t.to(glowRef.current, 
      { opacity: 0.75, scale: 1.1, duration: 0.4 * durationMultiplier, ease: 'power2.out' }, 
      'split+=0.6'
    );

    // Step 5: Quick cinematic zoom through V
    t.to(containerRef.current, 
      { scale: 22, opacity: 0, duration: 0.6 * durationMultiplier, ease: 'power3.in' }, 
      'split+=1.1'
    );
    t.to(glowRef.current, 
      { opacity: 0, scale: 2, duration: 0.5 * durationMultiplier, ease: 'power3.in' }, 
      'split+=1.1'
    );

    return () => {
      t.kill();
    };
  }, [onComplete]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none pointer-events-none">
      {/* Red ambient halo glow behind logo */}
      <div 
        ref={glowRef} 
        className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full bg-red-600/20 blur-[60px] sm:blur-[80px] opacity-0 z-0" 
      />

      <div ref={containerRef} className="relative w-36 h-36 sm:w-48 sm:h-48 z-10 flex items-center justify-center overflow-visible will-change-transform">
        <svg
          className="w-full h-full overflow-visible filter drop-shadow-[0_0_12px_rgba(229,9,20,0.65)]"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="vLightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E50914" />
              <stop offset="100%" stopColor="#300103" />
            </linearGradient>
            <linearGradient id="leftStemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF1E27" />
              <stop offset="100%" stopColor="#800206" />
            </linearGradient>
            <linearGradient id="rightStemGradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B20710" />
              <stop offset="100%" stopColor="#FF1E27" />
            </linearGradient>
          </defs>

          {/* Vertical central beam line */}
          <line
            ref={beamRef}
            x1="50"
            y1="15"
            x2="50"
            y2="85"
            stroke="url(#vLightGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="100"
            strokeDashoffset="100"
            className="z-0"
          />

          {/* Left and right stems of the V */}
          <path
            ref={leftStemRef}
            d="M 22 15 L 50 85"
            stroke="url(#leftStemGradient)"
            strokeWidth="15"
            strokeLinecap="square"
            strokeDasharray="100"
            strokeDashoffset="100"
          />
          <path
            ref={rightStemRef}
            d="M 50 85 L 78 15"
            stroke="url(#rightStemGradient)"
            strokeWidth="15"
            strokeLinecap="square"
            strokeDasharray="100"
            strokeDashoffset="100"
          />
        </svg>

        {/* GPU Accelerated Sparks burst absolute container */}
        <div className="absolute inset-0 z-20 flex items-center justify-center overflow-visible pointer-events-none">
          {sparks.map((s) => (
            <motion.div
              key={s.id}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#E50914] will-change-transform"
              style={{
                left: '50%',
                top: 'calc(50% + 50px)',
                boxShadow: '0 0 6px #E50914, 0 0 12px #ff4d52',
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: s.tx, y: s.ty, opacity: 0, scale: 0.15 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [step, setStep] = useState<'profile' | 'intro'>('profile');
  const [selectedProfileId, setSelectedProfileId] = useState('performance-marketing');
  const [hoveredProfileId, setHoveredProfileId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playHoverChime = (id: string) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      
      let freq = 220;
      if (id === 'performance-marketing') freq = 180;
      if (id === 'media-planning') freq = 260;
      if (id === 'branding-strategy') freq = 330;
      if (id === 'technical-skills') freq = 290;
      if (id === 'web-dev') freq = 390;

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      // Ignored
    }
  };

  const handleProfileSelect = (id: string) => {
    setSelectedProfileId(id);
    
    // Play the official high-quality Netflix Tudum sound effect
    const audio = new Audio('/tudum.mp3');
    audio.volume = 0.55;
    audioRef.current = audio;
    audio.play().catch((err) => {
      console.warn("Tudum play failed:", err);
    });

    // Show the logo drawing animation
    setStep('intro');
  };

  const triggerSkip = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    onComplete(selectedProfileId);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden font-sans select-none">
      {/* Dynamic Background React & Lighting */}
      <div 
        className="absolute inset-0 transition-all duration-700 ease-out pointer-events-none opacity-30 z-0"
        style={{
          background: hoveredProfileId 
            ? `radial-gradient(circle 600px at center, ${
                hoveredProfileId === 'performance-marketing' ? 'rgba(229,9,20,0.2)' :
                hoveredProfileId === 'media-planning' ? 'rgba(59,130,246,0.2)' :
                hoveredProfileId === 'branding-strategy' ? 'rgba(245,158,11,0.2)' :
                hoveredProfileId === 'technical-skills' ? 'rgba(16,185,129,0.2)' : 'rgba(139,92,246,0.2)'
              } 0%, transparent 80%)` 
            : 'radial-gradient(circle 600px at center, rgba(30,30,30,0.1) 0%, transparent 80%)'
        }}
      />

      <AnimatePresence mode="wait">
        
        {/* STEP 1: Choose Your Vedant Selection (Who's Watching?) */}
        {step === 'profile' && (
          <motion.div
            key="profile-selection"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="text-center px-4 w-full max-w-7xl relative z-10 py-6 sm:py-12"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#E50914] block mb-2 font-mono">
              / WELCOME TO VEDANTVERSE /
            </span>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-3 text-white uppercase font-sans">
              CHOOSE YOUR <span className="text-[#E50914] glow-text-red">VEDANT</span>
            </h1>
            
            <p className="text-neutral-400 text-xs md:text-sm font-medium tracking-wide mb-8 sm:mb-14 max-w-md mx-auto">
              Every version of me. Every expertise you need.
            </p>
            
            {/* Side-by-side cards layout */}
            <div className="flex flex-row overflow-x-auto no-scrollbar md:flex-wrap items-stretch justify-start md:justify-center gap-6 max-w-full mx-auto w-full px-6 md:px-0 py-4">
              {portfolioData.profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProfileSelect(p.id)}
                  onMouseEnter={() => {
                    setHoveredProfileId(p.id);
                    playHoverChime(p.id);
                  }}
                  onMouseLeave={() => setHoveredProfileId(null)}
                  className="group relative flex flex-col items-center justify-between p-5 rounded-xl border transition-all duration-500 ease-out bg-neutral-950/80 backdrop-blur-sm w-[200px] min-h-[420px] shrink-0 text-left cursor-pointer focus:outline-none overflow-hidden select-none hover:scale-102"
                  style={{
                    borderColor: hoveredProfileId === p.id ? p.accentColor : 'rgb(38 38 38)',
                    boxShadow: hoveredProfileId === p.id 
                      ? `0 10px 40px -10px ${p.accentColor}33, 0 0 25px -5px ${p.accentColor}44` 
                      : 'none',
                  }}
                >
                  {/* Card Background image with gradient fading */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={p.characterName} 
                      className="w-full h-full object-cover object-center transition-all duration-700 ease-out opacity-30 group-hover:opacity-65 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500" 
                      style={{ backgroundColor: p.accentColor }}
                    />
                  </div>

                  {/* Top category label & badge */}
                  <div className="relative z-10 w-full flex items-center justify-between">
                    <span 
                      className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded border bg-neutral-950/90 font-mono"
                      style={{
                        color: p.accentColor,
                        borderColor: `${p.accentColor}33`
                      }}
                    >
                      {p.avatar} {p.title.split(' ')[0]}
                    </span>
                  </div>

                  {/* Character Name, Role, Tagline, & Sub-icons */}
                  <div className="relative z-10 w-full mt-auto pt-4 flex flex-col items-center text-center">
                    <h3 className="text-sm font-black text-white tracking-wide uppercase transition-colors">
                      {p.characterName}
                    </h3>
                    <span 
                      className="text-[9.5px] font-bold tracking-wider uppercase mt-1 transition-colors font-mono"
                      style={{ color: hoveredProfileId === p.id ? p.accentColor : '#888' }}
                    >
                      {p.roleTitle.split(' ')[0]} {p.roleTitle.split(' ')[1] || ''}
                    </span>

                    <p className="text-[10px] text-neutral-400 font-light leading-relaxed mt-3.5 mb-5 max-w-[160px] min-h-[40px] line-clamp-3">
                      {p.tagline}
                    </p>

                    {/* Sub-icons horizontal list */}
                    <div className="flex items-center justify-center gap-3 w-full pt-4 border-t border-neutral-900/60">
                      {p.subPlatforms.map((sub, sIdx) => (
                        <div key={sIdx} className="group/item flex flex-col items-center gap-1">
                          <div className="p-1.5 rounded-md bg-neutral-900/80 border border-neutral-800/40 group-hover/item:border-neutral-700 transition-colors">
                            <PlatformIcon name={sub.name} />
                          </div>
                          <span className="text-[7.5px] text-neutral-500 font-mono tracking-tighter scale-90 group-hover/item:text-neutral-300">
                            {sub.name.split(' ')[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Slogan & instant skip button */}
            <div className="mt-10 sm:mt-16 flex flex-col items-center gap-4 sm:gap-6">
              <button
                onClick={triggerSkip}
                className="px-8 py-3 border border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-white hover:text-white transition-all duration-300 uppercase tracking-widest text-xs font-black cursor-pointer rounded-md hover:scale-105 active:scale-95"
              >
                EXPLORE MY UNIVERSE
              </button>
              
              <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-neutral-500 font-medium uppercase mt-4">
                "DIFFERENT ROLES. ONE MISSION — <span className="text-[#E50914]">DRIVING GROWTH</span>."
              </span>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Cinematic V Draw Intro (Runs after profile selection) */}
        {step === 'intro' && (
          <motion.div
            key="cinematic-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black"
          >
            <VLogoStep onComplete={() => onComplete(selectedProfileId)} />
            
            {/* Skip Preview Button (highly visible, well contrast, top-right) */}
            <button
              onClick={triggerSkip}
              className="absolute top-6 right-6 z-30 flex items-center gap-1.5 px-4 py-2 border border-neutral-700 hover:border-white bg-black/60 hover:bg-white text-neutral-400 hover:text-black font-bold uppercase tracking-widest text-[10px] transition-all duration-300 shadow-xl cursor-pointer rounded-md hover:scale-105 active:scale-95"
            >
              Skip Preview
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

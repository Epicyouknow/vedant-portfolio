'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert, Award, Play, Info, Eye, Briefcase, Zap, Bell, CheckCircle, RefreshCw, X } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import IntroAnimation from '../components/IntroAnimation';
import Hero from '../components/Hero';
import CareerUniverse from '../components/CareerUniverse';
import CareerMap from '../components/CareerMap'; // Upgraded metro journey
import WorkShowcase from '../components/WorkShowcase';
import Certifications from '../components/Certifications';
import SkillsGalaxy from '../components/SkillsGalaxy'; // Upgraded skills galaxy
import JarvisCommandCenter from '../components/JarvisCommandCenter'; // Jarvis command center
import MarketingLab from '../components/MarketingLab'; // Simulation sandbox
import DashboardReplicas from '../components/DashboardReplicas'; // Ads manager mockups
import VedantAI from '../components/VedantAI'; // Vedant GPT
import CreditsFooter from '../components/CreditsFooter';
import { portfolioData } from '../data/portfolio';
import { useAnalytics } from '../hooks/useAnalytics';

export default function Home() {
  const { trackPageView, trackEvent } = useAnalytics();
  const [showIntro, setShowIntro] = useState(true);
  const [watchingProfileId, setWatchingProfileId] = useState('performance-marketing');

  // Interactive View Modes
  const [viewMode, setViewMode] = useState<'standard' | 'recruiter' | 'client'>('standard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Easter Egg states
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [keysTyped, setKeysTyped] = useState<string[]>([]);

  // Achievement unlock indicators
  const [unlockedAchievement, setUnlockedAchievement] = useState<string | null>(null);
  const [unlockedAchievementsCount, setUnlockedAchievementsCount] = useState<string[]>([]);

  // Coming Soon Notification Toggle
  const [remindMeList, setRemindMeList] = useState<string[]>([]);

  // Listen to profile selection and dynamically inject CSS Accent Color Variables
  useEffect(() => {
    if (showIntro) return;
    const root = document.documentElement;

    const profileColors: Record<string, { hex: string; rgb: string }> = {
      'performance-marketing': { hex: '#E50914', rgb: '229, 9, 20' }, // Red
      'media-planning': { hex: '#3B82F6', rgb: '59, 130, 246' }, // Blue
      'branding-strategy': { hex: '#F59E0B', rgb: '245, 158, 11' }, // Gold
      'technical-skills': { hex: '#10B981', rgb: '16, 185, 129' }, // Green
      'web-dev': { hex: '#8B5CF6', rgb: '139, 92, 246' } // Purple
    };

    const targetColor = profileColors[watchingProfileId] || profileColors['performance-marketing'];
    
    root.style.setProperty('--accent-color', targetColor.hex);
    root.style.setProperty('--accent-color-rgb', targetColor.rgb);
  }, [watchingProfileId, showIntro]);

  // Keyboard listener for typing 'vedant' to unlock easter egg Behind The Scenes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const char = e.key.toLowerCase();
      if (/^[a-z]$/.test(char)) {
        setKeysTyped((prev) => {
          const next = [...prev, char].slice(-6); // track last 6 keys
          const word = next.join('');
          if (word === 'vedant') {
            setShowEasterEgg(true);
            triggerAchievement('🏆 Secret Unlocked: Behind the Scenes Portal!');
            return [];
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll depth listener to trigger game-style achievement rewards
  useEffect(() => {
    if (showIntro) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      
      // Trigger 1: Spend milestone (trigger early)
      if (scrollPos > 300 && !unlockedAchievementsCount.includes('spend')) {
        triggerAchievement('🏆 Achievement Unlocked: managed ₹15L+ ad spends!');
        setUnlockedAchievementsCount((prev) => [...prev, 'spend']);
      }
      // Trigger 2: Command Center unlocked (trigger mid)
      if (scrollPos > 1200 && !unlockedAchievementsCount.includes('command')) {
        triggerAchievement('🏆 System Unlocked: Jarvis Telemetry Active!');
        setUnlockedAchievementsCount((prev) => [...prev, 'command']);
      }
      // Trigger 3: Certifications check (trigger deep)
      if (scrollPos > 2400 && !unlockedAchievementsCount.includes('certified')) {
        triggerAchievement('🏆 Credential Unlocked: Google Search & DV360 Certified!');
        setUnlockedAchievementsCount((prev) => [...prev, 'certified']);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showIntro, unlockedAchievementsCount]);

  const triggerAchievement = (text: string) => {
    setUnlockedAchievement(text);
    trackEvent('achievement_unlock', { achievement: text });
    setTimeout(() => setUnlockedAchievement(null), 4000);
  };

  const handleIntroComplete = (profileId: string) => {
    setWatchingProfileId(profileId);
    setShowIntro(false);
    
    // Track page load and profile choice
    trackPageView('/');
    trackEvent('profile_select', { profileId });

    // Map profileId to project category to pre-filter portfolio content
    let category = '';
    if (profileId === 'performance-marketing') category = 'campaign';
    if (profileId === 'media-planning') category = 'mediaplan';
    if (profileId === 'branding-strategy') category = 'branding';
    if (profileId === 'web-dev') category = 'development';

    if (category) {
      setTimeout(() => {
        const event = new CustomEvent('filter-projects', { detail: category });
        window.dispatchEvent(event);
      }, 350);
    }
  };

  const toggleRemindMe = (id: string) => {
    setRemindMeList((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (!remindMeList.includes(id)) {
      triggerAchievement('🔔 Notification Set: Season 2 Launch alert updated!');
      trackEvent('coming_soon_reminder', { goalId: id });
    }
  };

  const handleViewModeChange = (mode: 'standard' | 'recruiter' | 'client') => {
    setViewMode(mode);
    trackEvent('change_view_mode', { mode });
  };

  const scrollSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      trackEvent('section_view', { section: id });
    }
  };

  const getProfileName = (id: string) => {
    const profile = portfolioData.profiles.find((p) => p.id === id);
    return profile ? profile.title : 'Guest';
  };

  const getProfileAvatar = (id: string) => {
    const profile = portfolioData.profiles.find((p) => p.id === id);
    return profile ? profile.avatar : '🍿';
  };

  return (
    <div className="relative min-h-screen bg-[#000000] text-white overflow-hidden select-none font-sans">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroAnimation onComplete={handleIntroComplete} />
        ) : (
          <div className="relative z-10 w-full min-h-screen flex flex-col">
            <ParticleBackground />
            <div className="vignette-overlay" />

            {/* Netflix Header Navbar */}
            <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-b from-black/95 via-black/50 to-transparent z-40 px-6 md:px-16 flex items-center justify-between backdrop-blur-[2px] border-b border-neutral-900/10">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center gap-2.5 text-2xl font-extrabold text-[#E50914] focus:outline-none cursor-pointer group"
                  style={{ fontFamily: 'var(--netflix-title-font)' }}
                >
                  <svg className="w-8 h-8 overflow-visible filter drop-shadow-[0_0_8px_rgba(229,9,20,0.6)] group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(229,9,20,0.85)] transition-all duration-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="vFacet1-nav" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ff1e27" />
                        <stop offset="100%" stopColor="#b20710" />
                      </linearGradient>
                      <linearGradient id="vFacet2-nav" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e50914" />
                        <stop offset="100%" stopColor="#600104" />
                      </linearGradient>
                      <linearGradient id="vFacet3-nav" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff4148" />
                        <stop offset="100%" stopColor="#800206" />
                      </linearGradient>
                    </defs>
                    <path d="M 20 15 L 42 15 L 50 85 L 35 85 Z" fill="url(#vFacet1-nav)" />
                    <path d="M 42 15 L 50 15 L 50 85 Z" fill="url(#vFacet2-nav)" opacity="0.9" />
                    <path d="M 50 85 L 50 15 L 58 15 L 80 15 L 65 85 Z" fill="url(#vFacet3-nav)" />
                    <path d="M 50 85 L 50 15 L 58 15 Z" fill="url(#vFacet2-nav)" opacity="0.6" />
                  </svg>
                  <span className="text-sm text-neutral-300 font-bold uppercase tracking-[0.25em] font-sans hidden sm:inline group-hover:text-white transition-colors duration-300">
                    VEDANTVERSE
                  </span>
                </button>

                {/* Primary Nav Links */}
                <nav className="hidden lg:flex items-center gap-6 text-xs text-neutral-400 font-semibold tracking-wider">
                  <button onClick={() => scrollSection('command-center')} className="hover:text-white cursor-pointer uppercase">HUD</button>
                  <button onClick={() => scrollSection('career-universe')} className="hover:text-white cursor-pointer uppercase">Universe</button>
                  <button onClick={() => scrollSection('career-map')} className="hover:text-white cursor-pointer uppercase">Transit Map</button>
                  <button onClick={() => scrollSection('campaign-dashboards')} className="hover:text-white cursor-pointer uppercase">Dashboards</button>
                  <button onClick={() => scrollSection('marketing-lab')} className="hover:text-white cursor-pointer uppercase">Lab</button>
                  <button onClick={() => scrollSection('skills-galaxy')} className="hover:text-white cursor-pointer uppercase">Galaxy</button>
                </nav>
              </div>

              {/* Toolbar: Recruiter Mode / Client Mode Toggles */}
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-1 bg-neutral-950/80 border border-neutral-900 px-2 py-1 rounded">
                  <button
                    onClick={() => handleViewModeChange('standard')}
                    className={`px-3 py-1 text-[10px] uppercase font-mono rounded cursor-pointer transition-all ${
                      viewMode === 'standard' ? 'bg-[#E50914] text-white' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => handleViewModeChange('recruiter')}
                    className={`px-3 py-1 text-[10px] uppercase font-mono rounded cursor-pointer transition-all ${
                      viewMode === 'recruiter' ? 'bg-[#E50914] text-white' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    Recruiter
                  </button>
                  <button
                    onClick={() => handleViewModeChange('client')}
                    className={`px-3 py-1 text-[10px] uppercase font-mono rounded cursor-pointer transition-all ${
                      viewMode === 'client' ? 'bg-[#E50914] text-white' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    Client
                  </button>
                </div>

                {/* Profile Watching Badge */}
                <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg">
                  <span className="text-xs shrink-0 select-none">{getProfileAvatar(watchingProfileId)}</span>
                  <span className="text-[10px] text-white font-bold uppercase tracking-wider hidden sm:inline">
                    {getProfileName(watchingProfileId).split(' ')[0]}
                  </span>
                </div>

                {/* Hamburger Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 text-neutral-400 hover:text-white cursor-pointer focus:outline-none"
                  aria-label="Open navigation menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
                  />
                  {/* Sidebar Drawer */}
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 right-0 w-72 bg-[#0e0e0e]/95 border-l border-neutral-900 z-50 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md lg:hidden"
                  >
                    <div className="space-y-8">
                      <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-6 h-6 filter drop-shadow-[0_0_6px_rgba(229,9,20,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="vFacet1-mob" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#ff1e27" />
                                <stop offset="100%" stopColor="#b20710" />
                              </linearGradient>
                              <linearGradient id="vFacet2-mob" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#e50914" />
                                <stop offset="100%" stopColor="#600104" />
                              </linearGradient>
                              <linearGradient id="vFacet3-mob" x1="1" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ff4148" />
                                <stop offset="100%" stopColor="#800206" />
                              </linearGradient>
                            </defs>
                            <path d="M 20 15 L 42 15 L 50 85 L 35 85 Z" fill="url(#vFacet1-mob)" />
                            <path d="M 42 15 L 50 15 L 50 85 Z" fill="url(#vFacet2-mob)" opacity="0.9" />
                            <path d="M 50 85 L 50 15 L 58 15 L 80 15 L 65 85 Z" fill="url(#vFacet3-mob)" />
                            <path d="M 50 85 L 50 15 L 58 15 Z" fill="url(#vFacet2-mob)" opacity="0.6" />
                          </svg>
                          <span className="text-[#E50914] font-black text-lg tracking-tight" style={{ fontFamily: 'var(--netflix-title-font)' }}>
                            VEDANTVERSE
                          </span>
                        </div>
                        <button
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-neutral-500 hover:text-white cursor-pointer focus:outline-none"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Mobile Nav Links */}
                      <div className="flex flex-col gap-4">
                        <span className="text-[10px] text-neutral-600 uppercase tracking-widest font-bold font-mono">Navigation</span>
                        <button
                          onClick={() => {
                            scrollSection('command-center');
                            setMobileMenuOpen(false);
                          }}
                          className="text-neutral-300 hover:text-white text-left font-semibold text-xs uppercase cursor-pointer"
                        >
                          HUD (Command Center)
                        </button>
                        <button
                          onClick={() => {
                            scrollSection('career-universe');
                            setMobileMenuOpen(false);
                          }}
                          className="text-neutral-300 hover:text-white text-left font-semibold text-xs uppercase cursor-pointer"
                        >
                          Universe
                        </button>
                        <button
                          onClick={() => {
                            scrollSection('career-map');
                            setMobileMenuOpen(false);
                          }}
                          className="text-neutral-300 hover:text-white text-left font-semibold text-xs uppercase cursor-pointer"
                        >
                          Transit Map
                        </button>
                        <button
                          onClick={() => {
                            scrollSection('campaign-dashboards');
                            setMobileMenuOpen(false);
                          }}
                          className="text-neutral-300 hover:text-white text-left font-semibold text-xs uppercase cursor-pointer"
                        >
                          Dashboards
                        </button>
                        <button
                          onClick={() => {
                            scrollSection('marketing-lab');
                            setMobileMenuOpen(false);
                          }}
                          className="text-neutral-300 hover:text-white text-left font-semibold text-xs uppercase cursor-pointer"
                        >
                          Lab
                        </button>
                        <button
                          onClick={() => {
                            scrollSection('skills-galaxy');
                            setMobileMenuOpen(false);
                          }}
                          className="text-neutral-300 hover:text-white text-left font-semibold text-xs uppercase cursor-pointer"
                        >
                          Galaxy
                        </button>
                      </div>

                      {/* Mobile View Mode selectors */}
                      <div className="flex flex-col gap-3">
                        <span className="text-[10px] text-neutral-600 uppercase tracking-widest font-bold font-mono">Experience Mode</span>
                        <div className="grid grid-cols-1 gap-2 bg-neutral-950/80 p-2 border border-neutral-900 rounded-md">
                          <button
                            onClick={() => {
                              handleViewModeChange('standard');
                              setMobileMenuOpen(false);
                            }}
                            className={`py-2 text-[10px] uppercase font-mono rounded cursor-pointer transition-all ${
                              viewMode === 'standard' ? 'bg-[#E50914] text-white' : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                          >
                            Standard
                          </button>
                          <button
                            onClick={() => {
                              handleViewModeChange('recruiter');
                              setMobileMenuOpen(false);
                            }}
                            className={`py-2 text-[10px] uppercase font-mono rounded cursor-pointer transition-all ${
                              viewMode === 'recruiter' ? 'bg-[#E50914] text-white' : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                          >
                            Recruiter
                          </button>
                          <button
                            onClick={() => {
                              handleViewModeChange('client');
                              setMobileMenuOpen(false);
                            }}
                            className={`py-2 text-[10px] uppercase font-mono rounded cursor-pointer transition-all ${
                              viewMode === 'client' ? 'bg-[#E50914] text-white' : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                          >
                            Client
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-neutral-900 pt-4 text-center text-[9px] text-neutral-600 uppercase tracking-widest font-mono">
                      SYSTEM_JARVIS_NAV_v2.0
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main Section */}
            <main className="flex-1 w-full relative pt-16 md:pt-20">
              
              {/* Dynamic Content Rendering based on ViewMode Toggles */}
              {viewMode === 'standard' && (
                <>
                  <Hero />
                  <JarvisCommandCenter />
                  <CareerUniverse />
                  <CareerMap />
                  <WorkShowcase />
                  <DashboardReplicas />
                  <MarketingLab />
                  <SkillsGalaxy />
                  <Certifications />
                </>
              )}

              {viewMode === 'recruiter' && (
                <div className="space-y-4">
                  {/* Recruiter Optimized Layout (condenses timeline and statistics maps) */}
                  <Hero />
                  <JarvisCommandCenter />
                  <SkillsGalaxy />
                  <Certifications />
                  <CareerMap />
                </div>
              )}

              {viewMode === 'client' && (
                <div className="space-y-4">
                  {/* Client Mode Layout (Focuses on case studies, results, simulated funnel specs) */}
                  <Hero />
                  <JarvisCommandCenter />
                  <WorkShowcase />
                  <MarketingLab />
                  <DashboardReplicas />
                </div>
              )}

              {/* COMING SOON: SEASON 2 (Future Goals Category Row) */}
              <section id="coming-soon" className="py-24 bg-[#0a0a0a] relative px-6 md:px-16 overflow-hidden">
                <div className="max-w-6xl mx-auto">
                  <div className="mb-12">
                    <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] block mb-2">Streaming Soon</span>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans uppercase">
                      Season 2: Up Next
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {portfolioData.futureGoals.map((goal) => {
                      const isReminded = remindMeList.includes(goal.id);
                      return (
                        <div key={goal.id} className="bg-neutral-900/40 border border-neutral-900 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[#E50914] text-xs font-mono font-bold tracking-wider">{goal.episodeNum}</span>
                              <span className="text-neutral-500 text-[10px] font-mono">{goal.expectedDate}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 uppercase">{goal.title}</h3>
                            <p className="text-neutral-400 text-xs font-light leading-relaxed mb-4">{goal.description}</p>
                          </div>
                          <button
                            onClick={() => toggleRemindMe(goal.id)}
                            className={`w-full py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border ${
                              isReminded 
                                ? 'bg-white text-black border-white' 
                                : 'bg-transparent text-neutral-400 border-neutral-700 hover:text-white hover:border-white'
                            }`}
                          >
                            <Bell className="w-3.5 h-3.5" />
                            {isReminded ? 'Reminder Set' : 'Remind Me'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

            </main>

            <VedantAI />
            <CreditsFooter />

            {/* Achievement Lock Toast Notification Grid */}
            <div className="fixed bottom-24 left-6 z-50 pointer-events-none space-y-3">
              <AnimatePresence>
                {unlockedAchievement && (
                  <motion.div
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -50 }}
                    className="p-4 bg-neutral-900/95 border border-red-800/40 rounded shadow-2xl glass-panel flex items-center gap-3 text-xs text-white"
                  >
                    <span className="shrink-0 text-lg">🎖️</span>
                    <div>
                      <span className="text-[#E50914] font-bold block uppercase tracking-wider text-[9px] mb-0.5">Notification</span>
                      <span className="font-semibold">{unlockedAchievement}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Easter Egg Modal - Behind The Scenes access */}
            <AnimatePresence>
              {showEasterEgg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-2xl bg-[#141414] rounded-xl overflow-hidden shadow-2xl border border-red-900/30 p-8 md:p-10"
                  >
                    <button 
                      onClick={() => setShowEasterEgg(false)}
                      className="absolute top-4 right-4 bg-neutral-900 text-white rounded-full p-2 border border-neutral-800 hover:bg-neutral-800 cursor-pointer focus:outline-none"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl animate-spin-slow">🍿</span>
                      <div>
                        <span className="text-[#E50914] text-[10px] font-bold uppercase tracking-[0.25em] block">Unlocked Sector</span>
                        <h3 className="text-2xl font-extrabold text-white uppercase">Behind The Scenes</h3>
                      </div>
                    </div>

                    <p className="text-neutral-400 text-xs leading-relaxed italic mb-8 font-mono border-l-2 border-red-600 pl-4 py-1">
                      "{portfolioData.easterEgg.journeySecret}"
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2">My Hobbies</h4>
                        <div className="flex flex-wrap gap-2">
                          {portfolioData.easterEgg.hobbies.map((h) => (
                            <span key={h} className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-900 text-xs rounded text-neutral-300">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2">Music Playlist</h4>
                        <div className="flex flex-wrap gap-2">
                          {portfolioData.easterEgg.music.map((m) => (
                            <span key={m} className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-900 text-xs rounded text-neutral-300">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Fun Facts</h4>
                        <div className="space-y-2 text-xs text-neutral-400 font-light">
                          {portfolioData.easterEgg.funFacts.map((fact, fIdx) => (
                            <p key={fIdx} className="flex gap-2">
                              <span className="text-red-500">•</span>
                              {fact}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

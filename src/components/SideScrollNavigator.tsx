'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, MapPin, BarChart3, FlaskConical, Globe, Mail } from 'lucide-react';

interface NavNode {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navNodes: NavNode[] = [
  { id: 'career-universe', label: 'Universe', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'career-map', label: 'Map', icon: <MapPin className="w-3.5 h-3.5" /> },
  { id: 'campaign-dashboards', label: 'Dashboards', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: 'marketing-lab', label: 'Lab', icon: <FlaskConical className="w-3.5 h-3.5" /> },
  { id: 'skills-galaxy', label: 'Galaxy', icon: <Globe className="w-3.5 h-3.5" /> },
  { id: 'contact', label: 'Contact', icon: <Mail className="w-3.5 h-3.5" /> },
];

export default function SideScrollNavigator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('career-universe');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    navNodes.forEach((node) => {
      const el = document.getElementById(node.id);
      if (el) observer.observe(el);
    });

    return () => {
      navNodes.forEach((node) => {
        const el = document.getElementById(node.id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4">
      {/* Scroll Progress Tube */}
      <div className="relative h-64 w-1 bg-neutral-900/80 rounded-full overflow-hidden border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.8)]">
        <motion.div
          className="w-full bg-gradient-to-b from-[#E50914] via-[#ff3b44] to-[#E50914] rounded-full shadow-[0_0_12px_rgba(229,9,20,0.9)]"
          style={{ height: `${scrollProgress}%` }}
          transition={{ ease: 'easeOut', duration: 0.1 }}
        />
      </div>

      {/* Chapter Nodes */}
      <div className="flex flex-col items-center gap-3 bg-black/60 backdrop-blur-md p-2 rounded-full border border-neutral-800 shadow-2xl">
        {navNodes.map((node) => {
          const isActive = activeSection === node.id;
          const isHovered = hoveredNode === node.id;

          return (
            <div key={node.id} className="relative flex items-center">
              {/* Tooltip on Hover or Active */}
              {(isHovered || isActive) && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-10 whitespace-nowrap bg-neutral-900 border border-neutral-800 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow-xl pointer-events-none flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
                  {node.label}
                </motion.div>
              )}

              <button
                onClick={() => scrollTo(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                aria-label={`Scroll to ${node.label}`}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#E50914] text-white shadow-[0_0_14px_rgba(229,9,20,0.8)] scale-110'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {node.icon}
              </button>
            </div>
          );
        })}
      </div>

      {/* Percentage Pill */}
      <div className="text-[10px] font-mono font-bold text-neutral-400 bg-neutral-950/90 border border-neutral-800 px-2 py-0.5 rounded-md tracking-wider">
        {Math.round(scrollProgress)}%
      </div>
    </div>
  );
}

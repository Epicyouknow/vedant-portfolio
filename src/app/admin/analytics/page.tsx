'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Unlock, RefreshCw, LogOut, Users, Download, Phone, 
  MessageSquare, Globe, Laptop, MapPin, TrendingUp, ShieldAlert,
  ChevronRight, Calendar, Eye
} from 'lucide-react';

interface KPIStats {
  todayVisitors: number;
  weeklyVisitors: number;
  monthlyVisitors: number;
  totalVisitors: number;
  uniqueVisitors: number;
  returningVisitors: number;
  resumeDownloads: number;
  linkedInClicks: number;
  contactClicks: number;
  aiQueriesCount: number;
  bounceRate: number;
}

interface AnalyticsData {
  kpis: KPIStats;
  topCountries: { name: string; count: number }[];
  topCities: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  browsers: { name: string; count: number }[];
  operatingSystems: { name: string; count: number }[];
  trafficSources: { name: string; count: number }[];
  topProjects: { name: string; count: number }[];
  topSections: { name: string; count: number }[];
  recentQueries: string[];
  kvConnected?: boolean;
}

export default function AdminAnalytics() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const fetchInquiries = async (activePin: string) => {
    setLoadingInquiries(true);
    try {
      const res = await fetch(`/api/inquiries?pin=${activePin}`);
      if (res.ok) {
        const list = await res.json();
        setInquiries(list);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleDeleteInquiry = async (index: number) => {
    const activePin = pin || sessionStorage.getItem('admin_pin') || '';
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/inquiries?pin=${activePin}&index=${index}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchInquiries(activePin);
      } else {
        alert('Failed to delete inquiry');
      }
    } catch (err) {
      console.error('Error deleting inquiry:', err);
    }
  };

  // Authenticate PIN
  const handlePinSubmit = async (enteredPin: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/analytics?pin=${enteredPin}`);
      if (res.ok) {
        const stats = await res.json();
        setData(stats);
        setIsAuthenticated(true);
        // Save PIN in session storage for quick reloads
        sessionStorage.setItem('admin_pin', enteredPin);
        fetchInquiries(enteredPin);
      } else {
        setError('Incorrect Profile PIN. Access Denied.');
        setPin('');
      }
    } catch (err) {
      setError('Connection failed. Try again.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  // Check session storage on mount
  useEffect(() => {
    const savedPin = sessionStorage.getItem('admin_pin');
    if (savedPin) {
      handlePinSubmit(savedPin);
    }
  }, []);

  // Fetch updated data
  const refreshData = async () => {
    setIsRefreshing(true);
    const activePin = pin || sessionStorage.getItem('admin_pin') || '';
    try {
      const res = await fetch(`/api/analytics?pin=${activePin}`);
      if (res.ok) {
        const stats = await res.json();
        setData(stats);
      }
      await fetchInquiries(activePin);
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  // Log out admin session
  const handleLogout = () => {
    sessionStorage.removeItem('admin_pin');
    setIsAuthenticated(false);
    setData(null);
    setInquiries([]);
    setPin('');
    setError('');
  };

  // PIN keyboard digit handler
  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError('');
      if (nextPin.length === 4) {
        handlePinSubmit(nextPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  // Render Lock Screen Gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#090909] text-white flex flex-col items-center justify-center font-sans z-50 select-none">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-red-950/20 blur-[120px] pointer-events-none" />
        
        <div className="text-center space-y-6 max-w-sm z-10 px-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.35em] block mb-2 font-mono">
              / VEDANTVERSE SECURITY /
            </span>
            <Lock className="w-8 h-8 text-[#E50914] animate-pulse" />
            <h1 className="text-xl font-bold tracking-widest uppercase mt-4">
              Enter Admin Profile PIN
            </h1>
            <p className="text-neutral-500 text-xs tracking-wide">
              Only authorized viewers may access telemetry data.
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-4 py-6">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border border-neutral-700 transition-all duration-200 ${
                  pin.length > idx ? 'bg-[#E50914] border-[#E50914] scale-110 shadow-[0_0_10px_#e50914]' : 'bg-transparent'
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          <div className="h-6">
            {error && (
              <motion.span 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 font-semibold text-xs uppercase font-mono block"
              >
                {error}
              </motion.span>
            )}
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-4 mx-auto w-64 pt-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => handleKeyPress(digit)}
                disabled={loading}
                className="w-16 h-16 rounded-full border border-neutral-800 hover:border-white bg-neutral-950/50 flex items-center justify-center text-lg font-bold transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none hover:bg-neutral-900"
              >
                {digit}
              </button>
            ))}
            <button
              onClick={() => setPin('')}
              disabled={loading}
              className="w-16 h-16 text-neutral-500 hover:text-white flex items-center justify-center text-xs font-semibold tracking-wider cursor-pointer active:scale-95 focus:outline-none"
            >
              CLEAR
            </button>
            <button
              onClick={() => handleKeyPress('0')}
              disabled={loading}
              className="w-16 h-16 rounded-full border border-neutral-800 hover:border-white bg-neutral-950/50 flex items-center justify-center text-lg font-bold transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none hover:bg-neutral-900"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-16 h-16 text-neutral-500 hover:text-white flex items-center justify-center text-xs font-semibold tracking-wider cursor-pointer active:scale-95 focus:outline-none"
            >
              DELETE
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans p-6 md:p-12 overflow-x-hidden selection:bg-[#E50914] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Dashboard Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-900 pb-6 gap-6">
          <div>
            <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.25em] block mb-2 font-mono">
              / TELEMETRY & SYSTEM ANALYTICS /
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase flex items-center gap-3">
              <Unlock className="w-7 h-7 text-[#E50914]" />
              VEDANTVERSE COMMAND CENTER
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-800 hover:border-white bg-neutral-950/60 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer rounded-md active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-[#E50914] ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Feed
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-red-900/30 hover:border-red-600 bg-red-950/10 hover:bg-red-950/30 text-red-500 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer rounded-md active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Lock Session
            </button>
          </div>
        </header>

        {data.kvConnected === false && (
          <div className="bg-amber-950/20 border border-amber-500/30 text-amber-400 p-4 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs leading-relaxed">
              <p className="font-extrabold uppercase tracking-wider">⚠️ Vercel KV Database Not Linked</p>
              <p className="text-neutral-400">
                Your live portfolio is currently using an ephemeral local filesystem fallback. Because Vercel serverless containers are stateless, visitor stats and form submissions will reset and get lost. To enable persistent analytics and contact form leads, you must connect **Vercel KV** in your Vercel Project Dashboard.
              </p>
            </div>
          </div>
        )}

        {/* KPI Cards Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Today's Visitors</span>
            <span className="text-3xl font-black text-white block glow-text">{data.kpis.todayVisitors}</span>
            <div className="absolute top-2 right-4 text-neutral-800"><Users className="w-12 h-12" /></div>
          </div>
          <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Weekly Active</span>
            <span className="text-3xl font-black text-white block glow-text">{data.kpis.weeklyVisitors}</span>
            <div className="absolute top-2 right-4 text-neutral-800"><Calendar className="w-12 h-12" /></div>
          </div>
          <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Unique Visitors</span>
            <span className="text-3xl font-black text-white block glow-text">{data.kpis.uniqueVisitors}</span>
            <div className="absolute top-2 right-4 text-neutral-800"><Users className="w-12 h-12" /></div>
          </div>
          <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-5 space-y-2 relative overflow-hidden">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Resume Downloads</span>
            <span className="text-3xl font-black text-[#E50914] block glow-text-red">{data.kpis.resumeDownloads}</span>
            <div className="absolute top-2 right-4 text-neutral-800/40"><Download className="w-12 h-12 text-[#E50914]" /></div>
          </div>
          <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-5 space-y-2 col-span-2 md:col-span-1 relative overflow-hidden">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Contact & Inquiries</span>
            <span className="text-3xl font-black text-white block">{data.kpis.contactClicks + data.kpis.linkedInClicks}</span>
            <div className="absolute top-2 right-4 text-neutral-800"><Phone className="w-12 h-12" /></div>
          </div>
        </section>

        {/* Traffic Sources & Locations Block */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traffic Referrer Channels */}
          <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
              <TrendingUp className="w-5 h-5 text-[#E50914]" />
              <h2 className="text-sm font-black uppercase tracking-wider">Top Traffic Sources</h2>
            </div>
            
            <div className="space-y-4">
              {data.trafficSources.map((src) => {
                const maxVal = Math.max(...data.trafficSources.map(t => t.count), 1);
                const percent = Math.round((src.count / maxVal) * 100);
                return (
                  <div key={src.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-neutral-300">{src.name}</span>
                      <span className="text-[#E50914]">{src.count} clicks</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-900 rounded overflow-hidden">
                      <div 
                        className="h-full bg-[#E50914] rounded transition-all duration-500 shadow-[0_0_10px_#e50914]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visitor Geolocation Locations */}
          <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
              <Globe className="w-5 h-5 text-[#E50914]" />
              <h2 className="text-sm font-black uppercase tracking-wider">Top Geolocations</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Countries */}
              <div className="space-y-3">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Countries</span>
                {data.topCountries.length > 0 ? (
                  <ul className="space-y-2">
                    {data.topCountries.map((c, i) => (
                      <li key={c.name} className="flex justify-between items-center text-xs py-1.5 border-b border-neutral-900/60">
                        <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                          <span className="text-[10px] text-neutral-600 font-mono">0{i+1}.</span>
                          {c.name}
                        </span>
                        <span className="text-white font-bold bg-neutral-900 px-2.5 py-0.5 rounded font-mono">{c.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-neutral-600 italic block py-4">No data logged.</span>
                )}
              </div>

              {/* Cities */}
              <div className="space-y-3">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Cities (approximate)</span>
                {data.topCities.length > 0 ? (
                  <ul className="space-y-2">
                    {data.topCities.map((c, i) => (
                      <li key={c.name} className="flex justify-between items-center text-xs py-1.5 border-b border-neutral-900/60">
                        <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                          <span className="text-[10px] text-neutral-600 font-mono">0{i+1}.</span>
                          {c.name.split(',')[0]}
                        </span>
                        <span className="text-white font-bold bg-neutral-900 px-2.5 py-0.5 rounded font-mono">{c.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-neutral-600 italic block py-4">No data logged.</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* engagement & chatbot queries */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Most Viewed Projects */}
          <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
              <Eye className="w-5 h-5 text-[#E50914]" />
              <h2 className="text-sm font-black uppercase tracking-wider">Most Viewed Projects</h2>
            </div>
            
            {data.topProjects.length > 0 ? (
              <div className="space-y-4">
                {data.topProjects.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between py-2 border-b border-neutral-900/50">
                    <div className="flex items-center gap-3">
                      <span className="text-[#E50914] font-black text-sm font-mono">0{i+1}</span>
                      <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide">{p.name}</span>
                    </div>
                    <span className="text-xs text-neutral-500 font-bold bg-neutral-900 px-3 py-1 rounded-md">{p.count} views</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-neutral-600 italic block py-4">No projects viewed yet.</span>
            )}
          </div>

          {/* Jarvis AI Chatbot Queries */}
          <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
              <MessageSquare className="w-5 h-5 text-[#E50914]" />
              <h2 className="text-sm font-black uppercase tracking-wider">Jarvis AI Queries ({data.kpis.aiQueriesCount} total)</h2>
            </div>

            {data.recentQueries.length > 0 ? (
              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-2">
                {data.recentQueries.map((q, i) => (
                  <div key={i} className="flex gap-2 p-3 bg-neutral-900/40 border border-neutral-900 rounded-lg text-xs leading-relaxed">
                    <ChevronRight className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
                    <p className="text-neutral-300 font-light italic">"{q}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-neutral-600 italic block py-4">No chatbot interactions logged.</span>
            )}
          </div>
        </section>

        {/* Contact & Inquiries List Section */}
        <section className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-900 pb-3 justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#E50914]" />
              <h2 className="text-sm font-black uppercase tracking-wider">Incoming Campaign Enquiries ({inquiries.length})</h2>
            </div>
          </div>

          {loadingInquiries ? (
            <div className="text-center py-6 text-neutral-500 text-xs font-mono">Loading enquiries...</div>
          ) : inquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-900 text-neutral-500 uppercase text-[10px] font-mono">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">Message</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/60">
                  {inquiries.map((inq, idx) => (
                    <tr key={idx} className="hover:bg-neutral-900/30 transition-colors">
                      <td className="py-3.5 px-4 text-neutral-400 font-mono shrink-0 whitespace-nowrap">
                        {new Date(inq.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">{inq.name}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <a href={`mailto:${inq.email}`} className="text-[#3B82F6] hover:underline font-mono">
                          {inq.email}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded bg-[#E50914]/10 text-[#E50914] font-extrabold uppercase text-[10px] border border-[#E50914]/15">
                          {inq.budget}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-300 font-light leading-relaxed min-w-[280px] max-w-sm break-words">
                        {inq.message}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteInquiry(idx)}
                          className="px-2.5 py-1 bg-red-950/20 hover:bg-red-900/30 text-red-500 border border-red-900/30 hover:border-red-600 rounded text-[10px] font-bold uppercase transition-all active:scale-95 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-neutral-900 rounded-lg text-xs text-neutral-500 italic">
              No inquiries received yet.
            </div>
          )}
        </section>

        {/* System & Telemetry Breakdown */}
        <section className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-6 space-y-8">
          <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
            <Laptop className="w-5 h-5 text-[#E50914]" />
            <h2 className="text-sm font-black uppercase tracking-wider">Devices, Browsers & Operating Systems</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Devices */}
            <div className="space-y-4">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Device Types</span>
              <div className="space-y-3">
                {data.devices.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs py-1">
                    <span className="text-neutral-400 font-medium">{d.name}</span>
                    <span className="font-mono bg-neutral-900 px-2 py-0.5 rounded text-white">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Browsers */}
            <div className="space-y-4">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Web Browsers</span>
              <div className="space-y-3">
                {data.browsers.map(b => (
                  <div key={b.name} className="flex items-center justify-between text-xs py-1">
                    <span className="text-neutral-400 font-medium">{b.name}</span>
                    <span className="font-mono bg-neutral-900 px-2 py-0.5 rounded text-white">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Systems */}
            <div className="space-y-4">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Operating Systems</span>
              <div className="space-y-3">
                {data.operatingSystems.map(o => (
                  <div key={o.name} className="flex items-center justify-between text-xs py-1">
                    <span className="text-neutral-400 font-medium">{o.name}</span>
                    <span className="font-mono bg-neutral-900 px-2 py-0.5 rounded text-white">{o.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-[10px] text-neutral-600 uppercase tracking-widest font-mono pt-6">
          SYSTEM_TELEMETRY_LOG_V2.0 // NO GPS DATA LOGGED // SECURE
        </footer>
      </div>
    </div>
  );
}

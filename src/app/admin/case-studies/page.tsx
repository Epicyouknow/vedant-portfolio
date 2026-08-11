'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  LogOut, 
  Save, 
  Upload, 
  ImageIcon, 
  Loader2,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Eye,
  ShieldCheck
} from 'lucide-react';
import ParticleBackground from '../../../components/ParticleBackground';
import { ClientCaseStudy, VerificationStatus, CaseStudyStatus, StrategyBlock, CampaignSnapshot, MetricComparison } from '../../../lib/caseStudyStorage';

export default function AdminCaseStudiesCMS() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Administrator' | 'Editor'>('Administrator');

  const [studies, setStudies] = useState<ClientCaseStudy[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<Partial<ClientCaseStudy> | null>(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [category, setCategory] = useState<'logistics' | 'ecommerce' | 'services' | 'realestate-app'>('logistics');
  const [campaign, setCampaign] = useState('');
  const [objective, setObjective] = useState('Lead Generation');
  const [platformsStr, setPlatformsStr] = useState('Google Ads, Meta Ads');
  const [roleScopeStr, setRoleScopeStr] = useState('Strategy, Media Buying, Campaign Optimization, Conversion Tracking');
  const [logo, setLogo] = useState('/clients/Pannest logo.png');
  const [challenge, setChallenge] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<CaseStudyStatus>('PUBLISHED');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('VERIFIED');
  const [featured, setFeatured] = useState(false);

  // Performance Metrics State
  const [spend, setSpend] = useState<string>('');
  const [impressions, setImpressions] = useState<string>('');
  const [clicks, setClicks] = useState<string>('');
  const [ctr, setCtr] = useState<string>('');
  const [cpc, setCpc] = useState<string>('');
  const [leads, setLeads] = useState<string>('');
  const [qualifiedLeads, setQualifiedLeads] = useState<string>('');
  const [conversions, setConversions] = useState<string>('');
  const [cpl, setCpl] = useState<string>('');
  const [cpa, setCpa] = useState<string>('');
  const [roas, setRoas] = useState<string>('');
  const [revenue, setRevenue] = useState<string>('');
  
  // Provenance State
  const [dataSource, setDataSource] = useState('Google Ads Campaign Report');
  const [reportingPeriod, setReportingPeriod] = useState('01 Jun 2026 – 30 Jun 2026');

  // Strategy & Screenshots
  const [strategies, setStrategies] = useState<StrategyBlock[]>([]);
  const [snapshots, setSnapshots] = useState<CampaignSnapshot[]>([]);
  const [beforeAfters, setBeforeAfters] = useState<MetricComparison[]>([]);

  // CSV Import State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[] | null>(null);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Fetch list
  const fetchCaseStudies = async () => {
    try {
      const res = await fetch('/api/case-studies');
      const data = await res.json();
      if (res.ok) {
        setStudies(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCaseStudies();
    }
  }, [isLoggedIn]);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'tiwarivedant705@gmail.com' && password === 'vedant123') {
      setIsLoggedIn(true);
      setStatusMessage('');
    } else if (email === 'editor@friend.com' && password === 'editor123') {
      setIsLoggedIn(true);
      setRole('Editor');
      setStatusMessage('');
    } else {
      setStatusMessage('Invalid marketing security credentials.');
    }
  };

  // Auto calculations
  useEffect(() => {
    const s = parseFloat(spend);
    const c = parseFloat(clicks);
    const i = parseFloat(impressions);
    const l = parseFloat(leads);
    const r = parseFloat(revenue);

    if (c > 0 && i > 0 && !ctr) {
      setCtr(((c / i) * 100).toFixed(2));
    }
    if (s > 0 && c > 0 && !cpc) {
      setCpc((s / c).toFixed(2));
    }
    if (s > 0 && l > 0 && !cpl) {
      setCpl((s / l).toFixed(0));
    }
    if (r > 0 && s > 0 && !roas) {
      setRoas((r / s).toFixed(2));
    }
  }, [spend, clicks, impressions, leads, revenue]);

  // Open Edit
  const handleEditClick = (item: ClientCaseStudy) => {
    setEditingStudy(item);
    setName(item.name);
    setSlug(item.slug);
    setSubtitle(item.subtitle);
    setWebsite(item.website);
    setIndustry(item.industry);
    setCategory(item.category);
    setCampaign(item.campaign);
    setObjective(item.objective);
    setPlatformsStr(item.platforms.join(', '));
    setRoleScopeStr(item.roleScope.join(', '));
    setLogo(item.logo);
    setChallenge(item.challenge);
    setResult(item.result);
    setStatus(item.status);
    setVerificationStatus(item.verificationStatus);
    setFeatured(item.featured);

    if (item.metrics) {
      setSpend(item.metrics.spend?.toString() || '');
      setImpressions(item.metrics.impressions?.toString() || '');
      setClicks(item.metrics.clicks?.toString() || '');
      setCtr(item.metrics.ctr?.toString() || '');
      setCpc(item.metrics.cpc?.toString() || '');
      setLeads(item.metrics.leads?.toString() || '');
      setQualifiedLeads(item.metrics.qualifiedLeads?.toString() || '');
      setConversions(item.metrics.conversions?.toString() || '');
      setCpl(item.metrics.cpl?.toString() || '');
      setCpa(item.metrics.cpa?.toString() || '');
      setRoas(item.metrics.roas?.toString() || '');
      setRevenue(item.metrics.revenue?.toString() || '');
    } else {
      setSpend(''); setImpressions(''); setClicks(''); setCtr(''); setCpc(''); setLeads(''); setQualifiedLeads(''); setConversions(''); setCpl(''); setCpa(''); setRoas(''); setRevenue('');
    }

    if (item.provenance) {
      setDataSource(item.provenance.source);
      setReportingPeriod(item.provenance.reportingPeriod);
    }

    setStrategies(item.strategies || []);
    setSnapshots(item.snapshots || []);
    setBeforeAfters(item.beforeAfterComparisons || []);
    setEditorOpen(true);
  };

  // Open Create
  const handleCreateNew = () => {
    setEditingStudy(null);
    setName('');
    setSlug('');
    setSubtitle('');
    setWebsite('https://');
    setIndustry('Logistics & Transport');
    setCategory('logistics');
    setCampaign('');
    setObjective('Lead Generation');
    setPlatformsStr('Google Search, Meta Ads');
    setRoleScopeStr('Strategy, Media Buying, Campaign Optimization, Conversion Tracking');
    setLogo('/clients/Pannest logo.png');
    setChallenge('');
    setResult('');
    setStatus('PUBLISHED');
    setVerificationStatus('VERIFIED');
    setFeatured(false);
    setSpend(''); setImpressions(''); setClicks(''); setCtr(''); setCpc(''); setLeads(''); setQualifiedLeads(''); setConversions(''); setCpl(''); setCpa(''); setRoas(''); setRevenue('');
    setStrategies([
      { id: 'st-1', title: '01 AUDIENCE STRATEGY', description: 'Intent mapping for target buyers', platform: 'Google Ads', sortOrder: 1 },
      { id: 'st-2', title: '02 CAMPAIGN ARCHITECTURE', description: 'Search campaign structure & bidding setup', platform: 'Google Ads', sortOrder: 2 },
    ]);
    setSnapshots([]);
    setBeforeAfters([]);
    setEditorOpen(true);
  };

  // Handle Logo Upload via FileReader
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogo(event.target.result as string);
        setStatusMessage('Logo loaded successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
      }
      setUploadingLogo(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle Snapshot File Upload
  const handleSnapshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const newSnapshot: CampaignSnapshot = {
          id: `snap-${Date.now()}`,
          platform: 'Google Ads',
          campaignName: 'New Campaign Evidence',
          objective: objective,
          dateRange: reportingPeriod,
          image: event.target.result as string,
          note: 'Verified dashboard evidence',
        };
        setSnapshots((prev) => [...prev, newSnapshot]);
      }
    };
    reader.readAsDataURL(file);
  };

  // CSV Import Parser
  const handleCsvSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const lines = text.split('\n').filter((l) => l.trim());
        if (lines.length > 1) {
          const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
          const firstRow = lines[1].split(',').map((r) => r.trim());

          const previewMap: any = {};
          headers.forEach((h, idx) => {
            previewMap[h] = firstRow[idx] || '';
          });
          setCsvPreview([previewMap]);
        }
      }
    };
    reader.readAsText(file);
  };

  const applyCsvData = () => {
    if (!csvPreview || csvPreview.length === 0) return;
    const row = csvPreview[0];
    if (row.spend) setSpend(row.spend);
    if (row.impressions) setImpressions(row.impressions);
    if (row.clicks) setClicks(row.clicks);
    if (row.ctr) setCtr(row.ctr);
    if (row.cpc) setCpc(row.cpc);
    if (row.leads) setLeads(row.leads);
    if (row.cpl) setCpl(row.cpl);
    if (row.roas) setRoas(row.roas);
    if (row.revenue) setRevenue(row.revenue);
    setStatusMessage('CSV metric values imported into editor fields!');
    setTimeout(() => setStatusMessage(''), 4000);
    setCsvPreview(null);
  };

  // Submit Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const generatedSlug = slug || name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

    const payload: ClientCaseStudy = {
      id: editingStudy?.id || generatedSlug,
      slug: generatedSlug,
      name,
      subtitle,
      website,
      industry,
      category,
      campaign,
      objective,
      platforms: platformsStr.split(',').map((p) => p.trim()).filter(Boolean),
      roleScope: roleScopeStr.split(',').map((r) => r.trim()).filter(Boolean),
      challenge,
      approach: strategies.map((s) => s.description),
      result,
      logo,
      status,
      verificationStatus,
      featured,
      strategies,
      snapshots,
      metrics: {
        spend: spend ? parseFloat(spend) : undefined,
        impressions: impressions ? parseInt(impressions) : undefined,
        clicks: clicks ? parseInt(clicks) : undefined,
        ctr: ctr ? parseFloat(ctr) : undefined,
        cpc: cpc ? parseFloat(cpc) : undefined,
        leads: leads ? parseInt(leads) : undefined,
        qualifiedLeads: qualifiedLeads ? parseInt(qualifiedLeads) : undefined,
        conversions: conversions ? parseInt(conversions) : undefined,
        cpl: cpl ? parseFloat(cpl) : undefined,
        cpa: cpa ? parseFloat(cpa) : undefined,
        roas: roas ? parseFloat(roas) : undefined,
        revenue: revenue ? parseFloat(revenue) : undefined,
      },
      beforeAfterComparisons: beforeAfters,
      provenance: {
        source: dataSource,
        reportingPeriod: reportingPeriod,
        lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        verifiedBy: 'VedantVerse Security Audit',
        isVerified: verificationStatus === 'VERIFIED',
      },
      createdAt: editingStudy?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/case-studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMessage('Case study catalog updated successfully!');
        setEditorOpen(false);
        fetchCaseStudies();
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        const err = await res.json();
        setStatusMessage(`Error: ${err.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Network error saving case study.');
    }
  };

  const handleDelete = async (slugToDelete: string) => {
    if (role !== 'Administrator') {
      alert('Forbidden: Administrator access required.');
      return;
    }
    if (!confirm('Are you sure you want to delete this case study?')) return;

    try {
      const res = await fetch(`/api/case-studies?slug=${slugToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage('Case study deleted.');
        fetchCaseStudies();
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden select-none font-sans flex flex-col justify-center items-center px-4 py-8">
      <ParticleBackground />
      <div className="vignette-overlay" />
      <div className="noise-overlay" />

      {/* Top Back Link */}
      <div className="absolute top-6 left-6 z-40">
        <Link href="/#client-intelligence" className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white uppercase">
          <ArrowLeft className="w-4 h-4 text-[#E50914]" />
          Back to Portfolio
        </Link>
      </div>

      {/* LOGIN HUD */}
      {!isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md bg-[#080808]/90 border border-neutral-900 rounded-2xl p-8 shadow-2xl backdrop-blur-md"
        >
          <div className="text-center mb-8">
            <span className="text-[#E50914] text-xs font-bold uppercase tracking-[0.2em] font-mono block mb-2">
              SECURITY ACCESS HUD
            </span>
            <h2 className="text-2xl font-black uppercase text-white tracking-tight">
              Case Study CMS Control
            </h2>
            <p className="text-neutral-500 text-xs mt-1 font-mono">
              Enter diagnostic security key to manage verified campaign data.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">Email Coordinate</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#E50914]/80 transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">Access Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#E50914]/80 transition-colors"
                required
              />
            </div>

            {statusMessage && (
              <p className="text-xs text-red-500 font-mono text-center">{statusMessage}</p>
            )}

            <button
              type="submit"
              className="w-full mt-4 py-3.5 bg-[#E50914] hover:bg-[#b20710] text-white font-bold text-xs uppercase rounded cursor-pointer transition-colors shadow-[0_0_15px_rgba(229,9,20,0.35)] font-mono"
            >
              Verify Security Profile
            </button>
          </form>
        </motion.div>
      )}

      {/* DASHBOARD TABLE VIEW */}
      {isLoggedIn && !editorOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 w-full max-w-6xl bg-[#080808]/95 border border-neutral-900 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-left my-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-6 mb-6">
            <div>
              <span className="text-[#E50914] text-[10px] font-bold uppercase tracking-[0.25em] font-mono block mb-1">
                CAMPAIGN EVIDENCE MANAGER
              </span>
              <h2 className="text-3xl font-black uppercase text-white tracking-tight font-sans">
                Real Client Case Studies
              </h2>
              <p className="text-neutral-500 text-xs font-mono">
                Logged in as <span className="text-white font-bold">{role}</span> ({email})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-[#E50914] text-white font-bold text-xs px-5 py-3.5 rounded hover:bg-[#b20710] cursor-pointer transition-colors font-mono uppercase shadow-md"
              >
                <Plus className="w-4 h-4" />
                CREATE CASE STUDY
              </button>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white font-bold text-xs px-4 py-3.5 rounded cursor-pointer transition-all font-mono"
              >
                <LogOut className="w-4 h-4" />
                EXIT
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="mb-4 p-4 bg-red-950/20 border border-red-500/20 rounded-lg text-xs font-mono text-red-500">
              {statusMessage}
            </div>
          )}

          {/* Catalog Table */}
          <div className="overflow-x-auto border border-neutral-900 rounded-xl">
            <table className="w-full text-xs font-mono text-neutral-400">
              <thead className="bg-[#0b0b0b] text-neutral-500 border-b border-neutral-900 uppercase">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Client Name</th>
                  <th className="px-6 py-4 text-left font-bold">Industry</th>
                  <th className="px-6 py-4 text-left font-bold">Objective</th>
                  <th className="px-6 py-4 text-center font-bold">Status</th>
                  <th className="px-6 py-4 text-center font-bold">Verification</th>
                  <th className="px-6 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 bg-black/40">
                {studies.map((item) => (
                  <tr key={item.slug} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                      <img src={item.logo} alt={item.name} className="w-7 h-7 object-contain bg-black p-0.5 rounded border border-neutral-800" />
                      <span>{item.name}</span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">{item.industry}</td>
                    <td className="px-6 py-4 text-[#E50914] font-bold">{item.objective}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] rounded">
                        {item.status || 'PUBLISHED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                        item.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-400'
                          : 'bg-amber-950/40 border-amber-900/60 text-amber-400'
                      }`}>
                        {item.verificationStatus || 'DEMO'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/clients/${item.slug}`}
                          target="_blank"
                          className="p-2 text-neutral-400 hover:text-white rounded border border-neutral-800 hover:border-neutral-700"
                          title="View Live Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 text-neutral-400 hover:text-white rounded border border-neutral-800 hover:border-neutral-700 cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.slug)}
                          className="p-2 text-red-500/80 hover:text-red-500 rounded border border-neutral-800 hover:border-red-900/30 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* FULL EDITOR FORM VIEW */}
      {isLoggedIn && editorOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-5xl bg-[#080808]/95 border border-neutral-900 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-left my-10 font-sans"
        >
          <div className="flex items-center justify-between border-b border-neutral-900 pb-6 mb-6">
            <div>
              <span className="text-[#E50914] text-[10px] font-bold uppercase tracking-[0.25em] font-mono block mb-1">
                CASE STUDY EDITOR HUD
              </span>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                {editingStudy ? `Edit: ${editingStudy.name}` : 'Create Client Case Study'}
              </h2>
            </div>
            <button
              onClick={() => setEditorOpen(false)}
              className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-mono uppercase cursor-pointer rounded"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            
            {/* 1. General Metadata */}
            <div className="bg-[#0b0b0f] border border-neutral-900 rounded-xl p-5 space-y-4">
              <span className="text-xs font-mono font-bold text-[#E50914] uppercase tracking-wider block">
                ★ SECTION 01 — CLIENT METADATA
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-bold">Client Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3 py-2.5 bg-black border border-neutral-800 rounded text-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-bold">Slug (Auto-generated)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="px-3 py-2.5 bg-black border border-neutral-800 rounded text-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-bold">Industry / Type</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="px-3 py-2.5 bg-black border border-neutral-800 rounded text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-bold">Subtitle / Descriptor</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="px-3 py-2.5 bg-black border border-neutral-800 rounded text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-bold">Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="px-3 py-2.5 bg-black border border-neutral-800 rounded text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-bold">Primary Objective</label>
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="px-3 py-2.5 bg-black border border-neutral-800 rounded text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-bold">Platforms Used (Comma-separated)</label>
                  <input
                    type="text"
                    value={platformsStr}
                    onChange={(e) => setPlatformsStr(e.target.value)}
                    className="px-3 py-2.5 bg-black border border-neutral-800 rounded text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-bold">Role Scope Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={roleScopeStr}
                    onChange={(e) => setRoleScopeStr(e.target.value)}
                    className="px-3 py-2.5 bg-black border border-neutral-800 rounded text-white"
                  />
                </div>
              </div>

              {/* Logo File Selector */}
              <div className="flex flex-col gap-1.5 text-xs font-mono">
                <label className="text-neutral-500 font-bold">Client Logo Path / Device Upload</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-black border border-neutral-800 rounded text-white"
                  />
                  <label className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-white font-bold text-xs cursor-pointer rounded flex items-center gap-2 hover:bg-[#E50914]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* 2. Challenge & Result Narrative */}
            <div className="bg-[#0b0b0f] border border-neutral-900 rounded-xl p-5 space-y-4">
              <span className="text-xs font-mono font-bold text-[#E50914] uppercase tracking-wider block">
                ★ SECTION 02 — CAMPAIGN STORY & IMPACT
              </span>

              <div className="flex flex-col gap-1.5 text-xs font-mono">
                <label className="text-neutral-500 font-bold">The Challenge Narrative</label>
                <textarea
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  rows={3}
                  className="px-3 py-2.5 bg-black border border-neutral-800 rounded text-white resize-none"
                  placeholder="Describe the acquisition problem, target goals, or tracking hurdles..."
                />
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-mono">
                <label className="text-neutral-500 font-bold">Performance Result & Impact Statement</label>
                <textarea
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  rows={2}
                  className="px-3 py-2.5 bg-black border border-neutral-800 rounded text-white resize-none"
                  placeholder="Describe verified outcomes, CPL reduction, or ROAS scaling..."
                />
              </div>
            </div>

            {/* 3. CSV Import & Metrics Grid */}
            <div className="bg-[#0b0b0f] border border-neutral-900 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#E50914] uppercase tracking-wider">
                  ★ SECTION 03 — VERIFIED PERFORMANCE METRICS
                </span>

                <label className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono rounded cursor-pointer">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Import Campaign CSV</span>
                  <input type="file" accept=".csv" onChange={handleCsvSelect} className="hidden" />
                </label>
              </div>

              {csvPreview && (
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-xs font-mono space-y-2">
                  <span className="text-emerald-400 font-bold block">CSV Columns Parsed Successfully!</span>
                  <div className="flex gap-4 overflow-x-auto text-[11px] text-neutral-300">
                    {Object.entries(csvPreview[0]).map(([k, v]) => (
                      <span key={k}><strong>{k}:</strong> {String(v)}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={applyCsvData}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[11px] uppercase"
                  >
                    Confirm Import Values
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <label className="text-neutral-500 block mb-1">Total Spend (₹)</label>
                  <input type="number" value={spend} onChange={(e) => setSpend(e.target.value)} className="w-full px-3 py-2 bg-black border border-neutral-800 rounded text-white" />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Clicks</label>
                  <input type="number" value={clicks} onChange={(e) => setClicks(e.target.value)} className="w-full px-3 py-2 bg-black border border-neutral-800 rounded text-white" />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Impressions</label>
                  <input type="number" value={impressions} onChange={(e) => setImpressions(e.target.value)} className="w-full px-3 py-2 bg-black border border-neutral-800 rounded text-white" />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">CTR (%)</label>
                  <input type="number" step="0.01" value={ctr} onChange={(e) => setCtr(e.target.value)} className="w-full px-3 py-2 bg-black border border-neutral-800 rounded text-white" />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Average CPC (₹)</label>
                  <input type="number" step="0.01" value={cpc} onChange={(e) => setCpc(e.target.value)} className="w-full px-3 py-2 bg-black border border-neutral-800 rounded text-white" />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Leads</label>
                  <input type="number" value={leads} onChange={(e) => setLeads(e.target.value)} className="w-full px-3 py-2 bg-black border border-neutral-800 rounded text-white" />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Cost Per Lead (CPL ₹)</label>
                  <input type="number" value={cpl} onChange={(e) => setCpl(e.target.value)} className="w-full px-3 py-2 bg-black border border-neutral-800 rounded text-white" />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">ROAS (x)</label>
                  <input type="number" step="0.01" value={roas} onChange={(e) => setRoas(e.target.value)} className="w-full px-3 py-2 bg-black border border-neutral-800 rounded text-white" />
                </div>
              </div>

              {/* Provenance Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono pt-3 border-t border-neutral-900">
                <div>
                  <label className="text-neutral-500 block mb-1">Data Source Label</label>
                  <input type="text" value={dataSource} onChange={(e) => setDataSource(e.target.value)} className="w-full px-3 py-2 bg-black border border-neutral-800 rounded text-white" />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Reporting Period</label>
                  <input type="text" value={reportingPeriod} onChange={(e) => setReportingPeriod(e.target.value)} className="w-full px-3 py-2 bg-black border border-neutral-800 rounded text-white" />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Verification Status</label>
                  <select value={verificationStatus} onChange={(e) => setVerificationStatus(e.target.value as any)} className="w-full px-3 py-2 bg-black border border-neutral-800 rounded text-white">
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="DEMO">DEMO</option>
                    <option value="PRIVATE">PRIVATE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Screenshots Evidence Manager */}
            <div className="bg-[#0b0b0f] border border-neutral-900 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#E50914] uppercase tracking-wider">
                  ★ SECTION 04 — CAMPAIGN EVIDENCE SCREENSHOTS
                </span>

                <label className="px-3 py-1.5 bg-[#E50914] hover:bg-[#b20710] text-white text-xs font-mono rounded cursor-pointer font-bold uppercase flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Screenshot</span>
                  <input type="file" accept="image/*" onChange={handleSnapshotUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {snapshots.map((snap, idx) => (
                  <div key={snap.id || idx} className="bg-black p-3 rounded-lg border border-neutral-800 flex items-center justify-between gap-3">
                    <img src={snap.image} alt="Preview" className="w-16 h-10 object-cover rounded border border-neutral-800" />
                    <div className="flex-1 truncate">
                      <span className="text-white font-bold block truncate">{snap.campaignName}</span>
                      <span className="text-[10px] text-neutral-500">{snap.platform} • {snap.dateRange}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSnapshots((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-1 text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-900">
              <div className="flex items-center gap-3">
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="px-3 py-2 bg-black border border-neutral-800 text-xs font-mono text-white rounded">
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="REVIEW">REVIEW</option>
                </select>

                <label className="flex items-center gap-2 text-xs font-mono text-neutral-400 cursor-pointer">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 rounded text-[#E50914]" />
                  <span>Featured Case Study</span>
                </label>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 bg-[#E50914] hover:bg-[#b20710] text-white font-bold text-xs uppercase px-7 py-3.5 rounded cursor-pointer transition-colors shadow-lg font-mono"
              >
                <Save className="w-4 h-4" />
                <span>SAVE CASE STUDY TO DISK</span>
              </button>
            </div>

          </form>
        </motion.div>
      )}

    </div>
  );
}

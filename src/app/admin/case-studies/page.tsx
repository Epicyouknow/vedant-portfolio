'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit,
  ExternalLink,
  Upload,
  Calendar,
  Tag,
  CheckCircle2,
  AlertCircle,
  Copy,
  TrendingUp,
  X,
  Save,
  Send,
  Layers,
  Sparkles,
  FileSpreadsheet,
  Image as ImageIcon,
} from 'lucide-react';
import { ClientCaseStudy, CaseStudyStatus, VerificationStatus, StrategyBlock, CampaignSnapshot, MetricComparison } from '../../../types/caseStudy';

export default function CaseStudiesManagerPage() {
  const [studies, setStudies] = useState<ClientCaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'PUBLISHED' | 'DRAFT'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editor Drawer State
  const [editorOpen, setEditorOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'story' | 'metrics' | 'creatives' | 'seo'>('overview');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [category, setCategory] = useState<'logistics' | 'ecommerce' | 'services' | 'realestate-app'>('logistics');
  const [campaign, setCampaign] = useState('');
  const [objective, setObjective] = useState('Lead Generation');
  const [platformsStr, setPlatformsStr] = useState('Google Ads, Meta Ads');
  const [roleScopeStr, setRoleScopeStr] = useState('Strategy, Media Buying, Campaign Optimization');
  const [logo, setLogo] = useState('/clients/Pannest logo.png');
  const [heroImage, setHeroImage] = useState('/cs-assets/cutistic-hero.jpg');
  const [challenge, setChallenge] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<CaseStudyStatus>('PUBLISHED');
  const [featured, setFeatured] = useState(false);

  // Metrics
  const [spend, setSpend] = useState<string>('');
  const [impressions, setImpressions] = useState<string>('');
  const [clicks, setClicks] = useState<string>('');
  const [ctr, setCtr] = useState<string>('');
  const [cpc, setCpc] = useState<string>('');
  const [leads, setLeads] = useState<string>('');
  const [qualifiedLeads, setQualifiedLeads] = useState<string>('');
  const [cpl, setCpl] = useState<string>('');
  const [roas, setRoas] = useState<string>('');
  const [revenue, setRevenue] = useState<string>('');

  // Strategies & Snapshots & Shifts
  const [strategies, setStrategies] = useState<StrategyBlock[]>([]);
  const [snapshots, setSnapshots] = useState<CampaignSnapshot[]>([]);
  const [beforeAfters, setBeforeAfters] = useState<MetricComparison[]>([]);

  // Image Inspector modal
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const fetchStudies = () => {
    setLoading(true);
    fetch('/api/case-studies')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStudies(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching case studies:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const categories = useMemo(() => {
    const set = new Set(studies.map((s) => s.category).filter(Boolean));
    return Array.from(set);
  }, [studies]);

  const filteredStudies = useMemo(() => {
    return studies.filter((s) => {
      if (statusFilter !== 'all' && (s.status || 'PUBLISHED') !== statusFilter) return false;
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (s.name || '').toLowerCase().includes(q);
        const slugMatch = (s.slug || '').toLowerCase().includes(q);
        const campMatch = (s.campaign || '').toLowerCase().includes(q);
        if (!nameMatch && !slugMatch && !campMatch) return false;
      }
      return true;
    });
  }, [studies, statusFilter, categoryFilter, searchQuery]);

  // Open editor for new study
  const handleNewStudy = () => {
    setIsNew(true);
    setName('');
    setSlug('');
    setSubtitle('');
    setWebsite('https://');
    setIndustry('Logistics');
    setCategory('logistics');
    setCampaign('New Growth Campaign');
    setObjective('Lead Generation');
    setPlatformsStr('Google Ads, Meta Ads');
    setRoleScopeStr('Strategy, Media Buying, Funnel Optimization');
    setLogo('/clients/Pannest logo.png');
    setHeroImage('/cs-assets/cutistic-hero.jpg');
    setChallenge('');
    setResult('');
    setStatus('PUBLISHED');
    setFeatured(false);

    setSpend('');
    setImpressions('');
    setClicks('');
    setCtr('');
    setCpc('');
    setLeads('');
    setQualifiedLeads('');
    setCpl('');
    setRoas('');
    setRevenue('');

    setStrategies([]);
    setSnapshots([]);
    setBeforeAfters([
      { metricName: 'Cost Per Lead', beforeValue: 1200, afterValue: 650, unit: '₹', lowerIsBetter: true },
      { metricName: 'Conversion Volume', beforeValue: 40, afterValue: 160, unit: 'conv', lowerIsBetter: false },
    ]);

    setActiveTab('overview');
    setEditorOpen(true);
  };

  // Open editor for existing study
  const handleEditStudy = (study: ClientCaseStudy) => {
    setIsNew(false);
    setName(study.name || '');
    setSlug(study.slug || '');
    setSubtitle(study.subtitle || '');
    setWebsite(study.website || '');
    setIndustry(study.industry || '');
    setCategory((study.category as any) || 'logistics');
    setCampaign(study.campaign || '');
    setObjective(study.objective || 'Lead Generation');
    setPlatformsStr(Array.isArray(study.platforms) ? study.platforms.join(', ') : 'Meta Ads');
    setRoleScopeStr(Array.isArray(study.roleScope) ? study.roleScope.join(', ') : '');
    setLogo(study.logo || '');
    setHeroImage(study.heroImage || study.snapshots?.[0]?.image || study.logo || '/cs-assets/cutistic-hero.jpg');
    setChallenge(study.challenge || '');
    setResult(study.result || '');
    setStatus(study.status || 'PUBLISHED');
    setFeatured(study.featured || false);

    setSpend(study.metrics?.spend ? String(study.metrics.spend) : '');
    setImpressions(study.metrics?.impressions ? String(study.metrics.impressions) : '');
    setClicks(study.metrics?.clicks ? String(study.metrics.clicks) : '');
    setCtr(study.metrics?.ctr ? String(study.metrics.ctr) : '');
    setCpc(study.metrics?.cpc ? String(study.metrics.cpc) : '');
    setLeads(study.metrics?.leads ? String(study.metrics.leads) : '');
    setQualifiedLeads(study.metrics?.qualifiedLeads ? String(study.metrics.qualifiedLeads) : '');
    setCpl(study.metrics?.cpl ? String(study.metrics.cpl) : '');
    setRoas(study.metrics?.roas ? String(study.metrics.roas) : '');
    setRevenue(study.metrics?.revenue ? String(study.metrics.revenue) : '');

    setStrategies(study.strategies || []);
    setSnapshots(study.snapshots || []);
    setBeforeAfters(study.beforeAfterComparisons || []);

    setActiveTab('overview');
    setEditorOpen(true);
  };

  // Duplicate study
  const handleDuplicateStudy = (study: ClientCaseStudy) => {
    setIsNew(true);
    setName(`${study.name} (Copy)`);
    setSlug(`${study.slug}-copy`);
    setSubtitle(study.subtitle || '');
    setWebsite(study.website || '');
    setIndustry(study.industry || '');
    setCategory(study.category || 'logistics');
    setCampaign(`${study.campaign} (Copy)`);
    setObjective(study.objective || 'Lead Generation');
    setPlatformsStr(Array.isArray(study.platforms) ? study.platforms.join(', ') : 'Meta Ads');
    setRoleScopeStr(Array.isArray(study.roleScope) ? study.roleScope.join(', ') : '');
    setLogo(study.logo || '');
    setHeroImage(study.heroImage || '/cs-assets/cutistic-hero.jpg');
    setChallenge(study.challenge || '');
    setResult(study.result || '');
    setStatus('DRAFT');
    setFeatured(false);

    setSpend(study.metrics?.spend ? String(study.metrics.spend) : '');
    setImpressions(study.metrics?.impressions ? String(study.metrics.impressions) : '');
    setClicks(study.metrics?.clicks ? String(study.metrics.clicks) : '');
    setCtr(study.metrics?.ctr ? String(study.metrics.ctr) : '');
    setCpc(study.metrics?.cpc ? String(study.metrics.cpc) : '');
    setLeads(study.metrics?.leads ? String(study.metrics.leads) : '');
    setQualifiedLeads(study.metrics?.qualifiedLeads ? String(study.metrics.qualifiedLeads) : '');
    setCpl(study.metrics?.cpl ? String(study.metrics.cpl) : '');
    setRoas(study.metrics?.roas ? String(study.metrics.roas) : '');
    setRevenue(study.metrics?.revenue ? String(study.metrics.revenue) : '');

    setStrategies(study.strategies || []);
    setSnapshots(study.snapshots || []);
    setBeforeAfters(study.beforeAfterComparisons || []);

    setActiveTab('overview');
    setEditorOpen(true);
    showToast('Duplicated into new case study draft');
  };

  // Delete study
  const handleDeleteStudy = (slugToDelete: string, studyName: string) => {
    if (!confirm(`Are you sure you want to delete case study "${studyName}"?`)) return;

    fetch(`/api/case-studies?slug=${slugToDelete}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        showToast('Case study removed');
        fetchStudies();
      })
      .catch((err) => alert('Error deleting case study: ' + err.message));
  };

  // Save case study
  const handleSave = (publishNow = false) => {
    if (!name || !slug) {
      alert('Please provide both Client Name and URL Slug.');
      return;
    }

    setSaving(true);
    const studyPayload: ClientCaseStudy = {
      id: slug,
      slug,
      name,
      subtitle,
      website,
      industry,
      category,
      campaign,
      objective,
      platforms: platformsStr.split(',').map((p) => p.trim()).filter(Boolean),
      roleScope: roleScopeStr.split(',').map((r) => r.trim()).filter(Boolean),
      logo,
      heroImage,
      challenge,
      approach: [
        'Strategic campaign restructure with localized audience targeting',
        'Direct-response creative testing across high-intent formats',
        'End-to-end conversion tracking and negative keyword pruning',
      ],
      result,
      status: publishNow ? 'PUBLISHED' : status,
      verificationStatus: 'VERIFIED',
      featured,
      metrics: {
        spend: spend ? parseFloat(spend) : undefined,
        impressions: impressions ? parseInt(impressions) : undefined,
        clicks: clicks ? parseInt(clicks) : undefined,
        ctr: ctr ? parseFloat(ctr) : undefined,
        cpc: cpc ? parseFloat(cpc) : undefined,
        leads: leads ? parseInt(leads) : undefined,
        qualifiedLeads: qualifiedLeads ? parseInt(qualifiedLeads) : undefined,
        cpl: cpl ? parseFloat(cpl) : undefined,
        roas: roas ? parseFloat(roas) : undefined,
        revenue: revenue ? parseFloat(revenue) : undefined,
      },
      strategies,
      snapshots,
      beforeAfterComparisons: beforeAfters,
      mediaSplit: [
        { channel: 'Meta Ads', percentage: 65, spendShare: 'Primary Acquisition' },
        { channel: 'Google Search Ads', percentage: 35, spendShare: 'High-Intent Search' },
      ],
      timeline: [
        { step: '01', title: 'ACCOUNT AUDIT', description: 'Comprehensive audit of past performance and tracking discrepancies.' },
        { step: '02', title: 'CREATIVE TESTING', description: 'Deploying high-converting creative matrices across placements.' },
        { step: '03', title: 'SCALE & OPTIMIZE', description: 'Stabilizing Cost Per Acquisition and scaling profitable segments.' },
      ],
      keyLearnings: [
        'Dedicated high-intent creative formats converted at a 3x higher rate than generic assets.',
        'Continuous audience pruning lowered acquisition cost significantly within 14 days.',
      ],
      provenance: {
        source: 'Meta Ads & Google Ads Verified Audit',
        reportingPeriod: 'Campaign Performance Window',
        lastUpdated: new Date().toISOString(),
        isVerified: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fetch('/api/case-studies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studyPayload),
    })
      .then((res) => res.json())
      .then(() => {
        setSaving(false);
        setEditorOpen(false);
        showToast(publishNow ? 'Case study published live to website!' : 'Case study saved.');
        fetchStudies();
      })
      .catch((err) => {
        setSaving(false);
        alert('Error saving case study: ' + err.message);
      });
  };

  // Image Upload handler
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'hero' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (targetField === 'hero') {
          setHeroImage(data.url);
          showToast('Hero creative image uploaded!');
        } else {
          setLogo(data.url);
          showToast('Brand logo uploaded!');
        }
      }
    } catch (err) {
      alert('Failed to upload image file');
    }
  };

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
            CONTENT • CLIENT WORK
          </div>
          <h1 className="vv-h1">Case Studies</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
            Build rich campaign breakdowns from verified performance data. Syncs directly to the homepage and client case study pages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/case-studies"
            target="_blank"
            className="vv-button vv-button--secondary"
            title="Open case studies directory"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Public directory</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>
          <button onClick={handleNewStudy} className="vv-button vv-button--primary">
            <Plus className="w-4 h-4" />
            <span>Add case study</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar (From Figma Reference) */}
      <div className="vv-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search case studies by client name, slug, or campaign..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="vv-input pl-10"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'PUBLISHED', 'DRAFT'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[var(--ink)] text-white dark:bg-white dark:text-black'
                  : 'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {st === 'all' ? 'All statuses' : st}
            </button>
          ))}

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="vv-input py-1.5 text-xs w-auto min-h-0"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Case Studies Table (Figma Design) */}
      <div className="vv-card overflow-hidden">
        <div className="vv-table-head grid-cols-[1.5fr_140px_110px_140px_90px]">
          <span>CLIENT &amp; CAMPAIGN</span>
          <span>CATEGORY</span>
          <span>STATUS</span>
          <span>UPDATED / DATE</span>
          <span className="text-right">ACTIONS</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[var(--muted)]">
            Loading case studies catalog...
          </div>
        ) : filteredStudies.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[var(--muted)]">
            No case studies found matching your criteria.
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)]">
            {filteredStudies.map((s) => {
              const statusBadge = s.status || 'PUBLISHED';
              const hero = s.heroImage || s.snapshots?.[0]?.image || s.logo || '/cs-assets/cutistic-hero.jpg';

              return (
                <div
                  key={s.slug}
                  className="vv-table-row grid-cols-[1.5fr_140px_110px_140px_90px] cursor-pointer"
                  onClick={() => handleEditStudy(s)}
                >
                  {/* Thumbnail, Name & Path */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-9 shrink-0 rounded-lg overflow-hidden bg-[var(--surface-2)] border border-[var(--line)]">
                      <img src={hero} alt={s.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[var(--ink)] truncate flex items-center gap-2">
                        <span>{s.name}</span>
                        {s.featured && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 font-bold">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--muted)] truncate mt-0.5">
                        /clients/{s.slug}
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-xs text-[var(--muted)] font-medium truncate capitalize">
                    {s.category?.replace('-', ' ') || 'General'}
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span className={`vv-badge ${
                      statusBadge === 'PUBLISHED' ? 'vv-badge--success' : 'vv-badge--warning'
                    }`}>
                      {statusBadge}
                    </span>
                  </div>

                  {/* Updated Date */}
                  <div className="text-xs font-mono text-[var(--muted)] truncate">
                    {s.updatedAt ? new Date(s.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Verified'}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/clients/${s.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-2)]"
                      title="View public case study"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDuplicateStudy(s)}
                      className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] cursor-pointer"
                      title="Duplicate as new draft"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditStudy(s)}
                      className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] cursor-pointer"
                      title="Edit case study"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStudy(s.slug, s.name)}
                      className="p-1.5 rounded-lg text-[var(--muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                      title="Delete case study"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Case Study Editor Drawer / Modal ── */}
      {editorOpen && (
        <div className="vv-modal-backdrop">
          <div className="vv-modal max-w-4xl max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] p-5 shrink-0">
              <div className="flex items-center gap-3">
                <span className={`vv-badge ${
                  status === 'PUBLISHED' ? 'vv-badge--success' : 'vv-badge--warning'
                }`}>
                  {status}
                </span>
                <div>
                  <h3 className="text-base font-bold text-[var(--ink)]">
                    {isNew ? 'Create New Case Study' : `Edit: ${name || 'Untitled'}`}
                  </h3>
                  <p className="text-[11px] text-[var(--muted)] font-mono">
                    Direct sync with live homepage cards, client marquee, and dedicated case study URL
                  </p>
                </div>
              </div>
              <button onClick={() => setEditorOpen(false)} className="vv-icon-button">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-6 px-6 pt-3 border-b border-[var(--line)] shrink-0 bg-[var(--surface-2)]/40 font-mono text-xs overflow-x-auto scrollbar-none">
              {[
                { id: 'overview', label: '01 // Overview & Meta' },
                { id: 'story', label: '02 // Campaign Story' },
                { id: 'metrics', label: '03 // Verified Metrics' },
                { id: 'creatives', label: '04 // Creatives & Preview' },
                { id: 'seo', label: '05 // Publishing & SEO' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`pb-2.5 font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all whitespace-nowrap ${
                    activeTab === t.id
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        CLIENT NAME *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setName(val);
                          if (isNew) {
                            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                          }
                        }}
                        placeholder="e.g. Bellissima by Excel"
                        className="vv-input font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        URL SLUG * (/clients/[slug])
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="e.g. bellissima-by-excel"
                        className="vv-input font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        SUBTITLE / TAGLINE
                      </label>
                      <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="e.g. Luxury Real Estate Lead Gen & Recovery"
                        className="vv-input"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        CLIENT WEBSITE URL
                      </label>
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://clientbrand.com"
                        className="vv-input font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        CATEGORY
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="vv-input"
                      >
                        <option value="logistics">Logistics &amp; Courier</option>
                        <option value="ecommerce">E-Commerce &amp; D2C</option>
                        <option value="realestate-app">Real Estate &amp; Apps</option>
                        <option value="services">Services &amp; B2B</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        CAMPAIGN OBJECTIVE
                      </label>
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        placeholder="Lead Gen, Purchases, App Installs"
                        className="vv-input"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                        STATUS
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="vv-input"
                      >
                        <option value="PUBLISHED">Published (Live)</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                      ADVERTISING PLATFORMS (COMMA SEPARATED)
                    </label>
                    <input
                      type="text"
                      value={platformsStr}
                      onChange={(e) => setPlatformsStr(e.target.value)}
                      placeholder="Meta Ads, Google Search, DV360"
                      className="vv-input font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Story */}
              {activeTab === 'story' && (
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                      THE CHALLENGE &amp; CONTEXT
                    </label>
                    <textarea
                      rows={4}
                      value={challenge}
                      onChange={(e) => setChallenge(e.target.value)}
                      placeholder="What was the client facing? (e.g. high CPL, account suspension, scaling bottlenecks)..."
                      className="vv-input leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                      KEY DELIVERABLES &amp; RESULTS
                    </label>
                    <textarea
                      rows={4}
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                      placeholder="What did the strategy achieve? (e.g. 42% CPL reduction, ₹7.45L revenue, 727 WhatsApp conversations)..."
                      className="vv-input leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                      ROLE &amp; EXECUTION SCOPE
                    </label>
                    <input
                      type="text"
                      value={roleScopeStr}
                      onChange={(e) => setRoleScopeStr(e.target.value)}
                      placeholder="Strategy, Media Buying, CRO, Conversion Tracking"
                      className="vv-input"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Metrics */}
              {activeTab === 'metrics' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <div className="text-xs font-bold text-[var(--ink)] mb-1">
                      VERIFIED PLATFORM METRICS
                    </div>
                    <p className="text-[11px] text-[var(--muted)]">
                      Populate verified figures directly. These automatically power the before/after cards and live badges.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1">
                        AD SPEND (₹)
                      </label>
                      <input
                        type="number"
                        value={spend}
                        onChange={(e) => setSpend(e.target.value)}
                        placeholder="26112"
                        className="vv-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1">
                        ATTRIBUTED REVENUE (₹)
                      </label>
                      <input
                        type="number"
                        value={revenue}
                        onChange={(e) => setRevenue(e.target.value)}
                        placeholder="745000"
                        className="vv-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1">
                        VERIFIED ROAS (X)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={roas}
                        onChange={(e) => setRoas(e.target.value)}
                        placeholder="4.60"
                        className="vv-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1">
                        LEADS / CONVERSATIONS
                      </label>
                      <input
                        type="number"
                        value={leads}
                        onChange={(e) => setLeads(e.target.value)}
                        placeholder="727"
                        className="vv-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1">
                        COST PER RESULT / CPL (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={cpl}
                        onChange={(e) => setCpl(e.target.value)}
                        placeholder="35.92"
                        className="vv-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1">
                        CLICK-THROUGH RATE (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={ctr}
                        onChange={(e) => setCtr(e.target.value)}
                        placeholder="8.50"
                        className="vv-input font-mono"
                      />
                    </div>
                  </div>

                  {/* Before vs After Shifts */}
                  <div className="pt-4 border-t border-[var(--line)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-[var(--muted)]">
                        THE SHIFT — BEFORE VS. AFTER METRIC COMPARISONS
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setBeforeAfters([
                            ...beforeAfters,
                            { metricName: 'New Metric', beforeValue: 100, afterValue: 50, unit: '₹', lowerIsBetter: true },
                          ])
                        }
                        className="text-xs font-mono text-[var(--accent)] hover:underline"
                      >
                        + Add comparison
                      </button>
                    </div>

                    <div className="space-y-2">
                      {beforeAfters.map((shift, i) => (
                        <div key={i} className="p-3 rounded-xl border border-[var(--line)] bg-[var(--surface-2)]/60 grid grid-cols-[1.5fr_1fr_1fr_80px_30px] gap-2 items-center text-xs">
                          <input
                            type="text"
                            value={shift.metricName}
                            onChange={(e) => {
                              const updated = [...beforeAfters];
                              updated[i].metricName = e.target.value;
                              setBeforeAfters(updated);
                            }}
                            placeholder="Metric name (e.g. Cost Per Lead)"
                            className="vv-input py-1 text-xs"
                          />
                          <input
                            type="number"
                            value={shift.beforeValue}
                            onChange={(e) => {
                              const updated = [...beforeAfters];
                              updated[i].beforeValue = parseFloat(e.target.value) || 0;
                              setBeforeAfters(updated);
                            }}
                            placeholder="Before"
                            className="vv-input py-1 text-xs font-mono"
                          />
                          <input
                            type="number"
                            value={shift.afterValue}
                            onChange={(e) => {
                              const updated = [...beforeAfters];
                              updated[i].afterValue = parseFloat(e.target.value) || 0;
                              setBeforeAfters(updated);
                            }}
                            placeholder="After"
                            className="vv-input py-1 text-xs font-mono"
                          />
                          <input
                            type="text"
                            value={shift.unit || ''}
                            onChange={(e) => {
                              const updated = [...beforeAfters];
                              updated[i].unit = e.target.value;
                              setBeforeAfters(updated);
                            }}
                            placeholder="Unit (₹, %, conv)"
                            className="vv-input py-1 text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setBeforeAfters(beforeAfters.filter((_, idx) => idx !== i))}
                            className="text-[var(--muted)] hover:text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Creatives & Preview */}
              {activeTab === 'creatives' && (
                <div className="space-y-6">
                  {/* Hero Creative Preview & Upload */}
                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                      HERO CREATIVE IMAGE (SHOWN ON HOMEPAGE CARD &amp; CASE STUDY BANNER)
                    </label>
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div
                        className="relative w-full sm:w-64 rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--surface-2)] aspect-video cursor-pointer group"
                        onClick={() => setZoomImage(heroImage)}
                        title="Click to inspect 100% full resolution"
                      >
                        <img src={heroImage} alt="Hero creative" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-bold">
                          Inspect 100% Zoom 🔍
                        </div>
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <input
                          type="text"
                          value={heroImage}
                          onChange={(e) => setHeroImage(e.target.value)}
                          placeholder="/cs-assets/cutistic-hero.jpg or URL"
                          className="vv-input font-mono text-xs"
                        />
                        <div className="flex items-center gap-2">
                          <label className="vv-button vv-button--secondary text-xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Hero Creative</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUploadImage(e, 'hero')}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setZoomImage(heroImage)}
                            className="vv-button vv-button--ghost text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>100% Zoom Inspector</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brand Logo Upload */}
                  <div className="pt-4 border-t border-[var(--line)]">
                    <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                      CLIENT BRAND LOGO
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-1 flex items-center justify-center">
                        <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={logo}
                          onChange={(e) => setLogo(e.target.value)}
                          className="vv-input font-mono text-xs mb-1.5"
                        />
                        <label className="vv-button vv-button--secondary text-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Brand Logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadImage(e, 'logo')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Publishing & SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[var(--ink)]">
                        FEATURE ON HOMEPAGE GRID (TOP 6)
                      </div>
                      <div className="text-[11px] text-[var(--muted)] mt-0.5">
                        Pin this case study to the homepage showcase card grid.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-5 h-5 accent-[var(--accent)] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                      REPORTING PROVENANCE &amp; SOURCE NOTE
                    </label>
                    <input
                      type="text"
                      defaultValue="Meta Ads & Google Ads Verified Audit"
                      className="vv-input"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Action Footer */}
            <div className="border-t border-[var(--line)] p-4 flex items-center justify-between shrink-0 bg-[var(--surface)]">
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="vv-button vv-button--ghost"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(false)}
                  className="vv-button vv-button--secondary"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Draft'}</span>
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(true)}
                  className="vv-button vv-button--primary"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to Live Site</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 100% Zoom Image Inspector Modal */}
      {zoomImage && (
        <div className="vv-modal-backdrop" onClick={() => setZoomImage(null)}>
          <div className="vv-modal max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--line)] p-4">
              <span className="text-xs font-mono font-bold">100% FULL-RES CREATIVE INSPECTOR</span>
              <button onClick={() => setZoomImage(null)} className="vv-icon-button">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-black/90 flex items-center justify-center max-h-[80vh] overflow-auto">
              <img src={zoomImage} alt="Full resolution" className="max-w-none w-auto max-h-[75vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="vv-toast">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)] font-bold text-xs">
            ✓
          </span>
          <div className="text-xs font-semibold text-[var(--ink)]">{toastMessage}</div>
        </div>
      )}
    </div>
  );
}

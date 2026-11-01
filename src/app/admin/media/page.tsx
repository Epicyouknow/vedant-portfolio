'use client';

import React, { useState, useEffect } from 'react';
import {
  Upload,
  Crop,
  Search,
  Filter,
  Eye,
  Trash2,
  ZoomIn,
  RotateCw,
  Undo,
  Save,
  CheckCircle2,
  X,
  Copy,
  Layers,
} from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  dimensions: string;
  size: string;
  category: string;
  altText: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  { id: 'm1', name: 'bellissima-hero.jpg', url: '/cs-assets/bellissima-hero.jpg', dimensions: '2048 × 1072', size: '350 KB', category: 'Case Study Creatives', altText: 'Bellissima luxury real estate walkthrough' },
  { id: 'm2', name: 'cutistic-hero.jpg', url: '/cs-assets/cutistic-hero.jpg', dimensions: '1920 × 1080', size: '1.2 MB', category: 'Case Study Creatives', altText: 'Cutistic Gifts Diwali festive hamper packaging' },
  { id: 'm3', name: 'gujju-hero.jpg', url: '/cs-assets/gujju-hero.jpg', dimensions: '1200 × 675', size: '139 KB', category: 'Case Study Creatives', altText: 'Gujju Express UK international shipping rates' },
  { id: 'm4', name: 'pannest-hero.jpg', url: '/cs-assets/pannest-hero.jpg', dimensions: '1280 × 720', size: '65 KB', category: 'Case Study Creatives', altText: 'Pannest B2B cold chain logistics ad search' },
  { id: 'm5', name: 'we3scs-hero.jpg', url: '/cs-assets/we3scs-hero.jpg', dimensions: '1280 × 720', size: '98 KB', category: 'Case Study Creatives', altText: 'WE3SCS commercial freight Google search campaigns' },
  { id: 'm6', name: 'kaizen-hero.jpg', url: '/cs-assets/kaizen-hero.jpg', dimensions: '1080 × 1080', size: '142 KB', category: 'Case Study Creatives', altText: 'Kaizen Realty modern residential apartment' },
  { id: 'm7', name: 'vedant_editorial.jpg', url: '/vedant_editorial.jpg', dimensions: '1200 × 1600', size: '420 KB', category: 'Portraits', altText: 'Vedant Tiwari editorial studio portrait' },
  { id: 'm8', name: 'vedant_sunglasses.jpg', url: '/vedant_sunglasses.jpg', dimensions: '1200 × 1600', size: '390 KB', category: 'Portraits', altText: 'Vedant Tiwari outdoor sunglasses portrait' },
];

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1' | '4:5' | '9:16' | 'Free'>('16:9');
  const [zoomLevel, setZoomLevel] = useState(50);
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        const newItem: MediaItem = {
          id: `m-${Date.now()}`,
          name: file.name,
          url: data.url,
          dimensions: 'Original High-Res',
          size: `${(file.size / 1024).toFixed(0)} KB`,
          category: 'Uploaded Assets',
          altText: file.name.replace(/[^a-zA-Z0-9 ]/g, ' '),
        };
        setMediaList([newItem, ...mediaList]);
        showToast('Media uploaded to server!');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    if (!searchQuery.trim()) return true;
    return m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)] font-mono">
            ASSETS • ASSET HUB &amp; CROPPING
          </div>
          <h1 className="vv-h1">Media library</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
            Original files are strictly preserved. Crop presets and aspect ratio adjustments are stored independently for each placement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="vv-button vv-button--primary cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload media'}</span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="vv-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search media by filename or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="vv-input pl-10"
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[var(--muted)] shrink-0">
          <span>{filteredMedia.length} assets indexed</span>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredMedia.map((m) => (
          <div
            key={m.id}
            className="vv-media-card group cursor-pointer flex flex-col"
            onClick={() => {
              setSelectedMedia(m);
              setCropOpen(true);
            }}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-[var(--surface-2)] overflow-hidden">
              <img
                src={m.url}
                alt={m.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
                  <Crop className="w-3.5 h-3.5" />
                  <span>Crop &amp; Edit</span>
                </span>
              </div>
            </div>

            {/* Meta */}
            <div className="p-3.5 space-y-1">
              <div className="text-xs font-bold text-[var(--ink)] truncate" title={m.name}>
                {m.name}
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted)]">
                <span>{m.dimensions}</span>
                <span>{m.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Image Crop Editor Modal (Figma Screenshot) ── */}
      {cropOpen && selectedMedia && (
        <div className="vv-modal-backdrop">
          <div className="vv-modal max-w-5xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[var(--line)] p-5 shrink-0">
              <div>
                <div className="text-xs font-mono font-bold text-[var(--accent)] uppercase">
                  IMAGE CROP ENGINE · ORIGINAL PRESERVED
                </div>
                <h3 className="text-base font-bold text-[var(--ink)] mt-0.5">{selectedMedia.name}</h3>
              </div>
              <button onClick={() => setCropOpen(false)} className="vv-icon-button">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid lg:grid-cols-[1fr_320px] gap-6">
              {/* Crop Stage */}
              <div className="vv-crop-stage flex items-center justify-center relative min-h-[420px] rounded-2xl overflow-hidden bg-black/90 p-6">
                <div
                  className="relative overflow-hidden rounded-xl border-2 border-white/80 shadow-2xl transition-all"
                  style={{
                    aspectRatio:
                      aspectRatio === '16:9' ? '16/9' :
                      aspectRatio === '1:1' ? '1/1' :
                      aspectRatio === '4:5' ? '4/5' :
                      aspectRatio === '9:16' ? '9/16' : 'auto',
                    width: `${zoomLevel + 40}%`,
                    maxWidth: '100%',
                    maxHeight: '400px',
                  }}
                >
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Grid overlay */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/40">
                    <div className="border-r border-b border-white/20" />
                    <div className="border-r border-b border-white/20" />
                    <div className="border-b border-white/20" />
                    <div className="border-r border-b border-white/20" />
                    <div className="border-r border-b border-white/20" />
                    <div className="border-b border-white/20" />
                    <div className="border-r border-white/20" />
                    <div className="border-r border-white/20" />
                    <div />
                  </div>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-[11px] font-mono text-white backdrop-blur">
                  Aspect ratio: {aspectRatio}
                </div>
              </div>

              {/* Crop Settings Controls */}
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                    PLACEMENT PRESET
                  </label>
                  <select className="vv-input text-xs">
                    <option>Homepage featured case study (16:9)</option>
                    <option>Square ad feed snapshot (1:1)</option>
                    <option>Social &amp; Story format (9:16)</option>
                    <option>Editorial portrait (4:5)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-2">
                    ASPECT RATIO
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['16:9', '1:1', '4:5', '9:16', 'Free'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setAspectRatio(r as any)}
                        className={`p-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                          aspectRatio === r
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                            : 'border-[var(--line)] hover:bg-[var(--surface-2)] text-[var(--muted)]'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[var(--muted)] uppercase font-bold">ZOOM &amp; SCALE</span>
                    <span className="font-bold">{zoomLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold uppercase text-[var(--muted)] block mb-1.5">
                    ACCESSIBILITY ALT TEXT
                  </label>
                  <input
                    type="text"
                    value={selectedMedia.altText}
                    onChange={(e) => {
                      const updated = mediaList.map((m) =>
                        m.id === selectedMedia.id ? { ...m, altText: e.target.value } : m
                      );
                      setMediaList(updated);
                      setSelectedMedia({ ...selectedMedia, altText: e.target.value });
                    }}
                    className="vv-input text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-[var(--line)] space-y-2">
                  <button
                    onClick={() => {
                      setCropOpen(false);
                      showToast(`Crop preset saved for ${selectedMedia.name}`);
                    }}
                    className="vv-button vv-button--primary w-full"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Crop Settings</span>
                  </button>
                  <button
                    onClick={() => setCropOpen(false)}
                    className="vv-button vv-button--ghost w-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
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

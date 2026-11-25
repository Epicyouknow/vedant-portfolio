import fs from 'fs';
import path from 'path';

export interface CoverGeneratorParams {
  title: string;
  slug: string;
  category?: string;
  tags?: string[];
  theme?: 'dark' | 'cream' | 'editorial';
}

/**
 * Escapes characters for safe SVG XML insertion.
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Splits title text into multiple lines for crisp SVG rendering.
 */
function splitTitleToLines(title: string, maxCharsPerLine = 38): string[] {
  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines.slice(0, 3);
}

/**
 * Detects visual archetype based on topic keywords to generate
 * dedicated, highly tailored technical diagrams.
 */
function detectArchetype(text: string): 'logistics' | 'meta' | 'google' | 'attribution' | 'ecommerce' | 'general' {
  const lower = text.toLowerCase();
  if (lower.includes('logistic') || lower.includes('freight') || lower.includes('courier') || lower.includes('supply') || lower.includes('transport') || lower.includes('b2b')) {
    return 'logistics';
  }
  if (lower.includes('meta') || lower.includes('facebook') || lower.includes('instagram') || lower.includes('advantage') || lower.includes('creative testing')) {
    return 'meta';
  }
  if (lower.includes('google') || lower.includes('pmax') || lower.includes('performance max') || lower.includes('search ads') || lower.includes('bidding')) {
    return 'google';
  }
  if (lower.includes('attribution') || lower.includes('ga4') || lower.includes('capi') || lower.includes('tracking') || lower.includes('gtm') || lower.includes('pixel')) {
    return 'attribution';
  }
  if (lower.includes('shopify') || lower.includes('d2c') || lower.includes('e-commerce') || lower.includes('roas') || lower.includes('app acquisition')) {
    return 'ecommerce';
  }
  return 'general';
}

/**
 * Generates an ultra-clean, 16:9 (1200x675) SVG editorial cover image.
 * Designed to strictly adhere to VedantVerse guidelines:
 * - Warm/Dark editorial aesthetic
 * - Clean Swiss typography and subtle geometric grids
 * - Dedicated technical schematic/chart per topic
 * - Zero artificial AI distortion, looks 100% intentional and human-designed
 */
export function generateCoverSvg(params: CoverGeneratorParams): string {
  const { title, category = 'Performance Marketing', theme = 'dark', tags = [] } = params;
  const safeTitle = escapeXml(title);
  const safeCategory = escapeXml(category.toUpperCase());
  const archetype = detectArchetype(title + ' ' + category + ' ' + tags.join(' '));
  const titleLines = splitTitleToLines(safeTitle, 36);

  // Palette configurations
  const isCream = theme === 'cream';
  const bgFill = isCream ? '#F5F2EC' : '#121211';
  const cardBg = isCream ? '#FFFFFF' : '#1A1918';
  const cardBorder = isCream ? '#E5E0D6' : '#2A2927';
  const textPrimary = isCream ? '#191919' : '#F5F2EC';
  const textMuted = isCream ? '#737373' : '#8C887F';
  const accentRed = '#ED463B';
  const accentEmerald = '#10B981';
  const gridLine = isCream ? 'rgba(0,0,0,0.035)' : 'rgba(255,255,255,0.035)';

  // Archetype-specific graphic schematic (Right Column, 16:9 layout)
  let graphicSvg = '';

  if (archetype === 'logistics') {
    // Technical B2B Logistics Route & Telemetry Grid
    graphicSvg = `
      <!-- Logistics Pipeline Schematic -->
      <g transform="translate(680, 110)">
        <!-- Container Card -->
        <rect width="470" height="455" rx="20" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.5" />
        
        <!-- Header Strip -->
        <rect x="0" y="0" width="470" height="48" rx="20" fill="${isCream ? '#EFEBE4' : '#232220'}" />
        <circle cx="28" cy="24" r="5" fill="${accentRed}" />
        <circle cx="44" cy="24" r="5" fill="#EAB308" />
        <circle cx="60" cy="24" r="5" fill="${accentEmerald}" />
        <text x="80" y="29" fill="${textMuted}" font-family="monospace" font-size="11" font-weight="700" letter-spacing="1">FREIGHT PIPELINE &amp; CPL TELEMETRY</text>
        <rect x="365" y="14" width="85" height="20" rx="10" fill="${isCream ? '#FFFFFF' : '#121211'}" />
        <text x="407" y="28" fill="${accentEmerald}" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle">ACTIVE 99.4%</text>

        <!-- Route Nodes & Freight Network -->
        <g transform="translate(30, 75)">
          <!-- Node 1: Ingestion -->
          <rect x="0" y="0" width="115" height="75" rx="12" fill="${isCream ? '#F7F5F0' : '#141413'}" stroke="${cardBorder}" />
          <text x="14" y="24" fill="${textMuted}" font-family="sans-serif" font-size="10" font-weight="700">TIER-1 HUBS</text>
          <text x="14" y="48" fill="${textPrimary}" font-family="sans-serif" font-size="18" font-weight="800">14 Cities</text>
          <text x="14" y="64" fill="${accentEmerald}" font-family="monospace" font-size="9" font-weight="600">Verified Routes</text>

          <!-- Connecting line -->
          <path d="M 115 37 L 145 37" stroke="${accentRed}" stroke-width="2" stroke-dasharray="4 4" />

          <!-- Node 2: Qualification Funnel -->
          <rect x="145" y="0" width="120" height="75" rx="12" fill="${isCream ? '#F7F5F0' : '#141413'}" stroke="${cardBorder}" />
          <text x="160" y="24" fill="${textMuted}" font-family="sans-serif" font-size="10" font-weight="700">SQL GATEWAY</text>
          <text x="160" y="48" fill="${textPrimary}" font-family="sans-serif" font-size="18" font-weight="800">42.8%</text>
          <text x="160" y="64" fill="${accentEmerald}" font-family="monospace" font-size="9" font-weight="600">+14% vs Index</text>

          <!-- Connecting line -->
          <path d="M 265 37 L 295 37" stroke="${accentRed}" stroke-width="2" stroke-dasharray="4 4" />

          <!-- Node 3: Target Output -->
          <rect x="295" y="0" width="115" height="75" rx="12" fill="${isCream ? '#F7F5F0' : '#141413'}" stroke="${accentRed}" stroke-width="1.5" />
          <text x="310" y="24" fill="${accentRed}" font-family="sans-serif" font-size="10" font-weight="700">AVG CPL</text>
          <text x="310" y="48" fill="${textPrimary}" font-family="sans-serif" font-size="18" font-weight="800">₹248</text>
          <text x="310" y="64" fill="${accentEmerald}" font-family="monospace" font-size="9" font-weight="600">-38% Ad Spend</text>
        </g>

        <!-- Dynamic Chart Bars -->
        <g transform="translate(30, 185)">
          <text x="0" y="0" fill="${textPrimary}" font-family="sans-serif" font-size="12" font-weight="700">Qualified Freight Pipeline Volume</text>
          <text x="410" y="0" fill="${textMuted}" font-family="monospace" font-size="10" text-anchor="end">Monthly Run-Rate</text>
          
          <g transform="translate(0, 18)">
            <!-- Axis lines -->
            <line x1="0" y1="120" x2="410" y2="120" stroke="${cardBorder}" stroke-width="1" />
            <line x1="0" y1="60" x2="410" y2="60" stroke="${cardBorder}" stroke-dasharray="2 4" stroke-width="0.8" />

            <!-- Bars -->
            <rect x="20" y="70" width="40" height="50" rx="4" fill="${isCream ? '#D7D0C5' : '#33302B'}" />
            <rect x="85" y="55" width="40" height="65" rx="4" fill="${isCream ? '#D7D0C5' : '#33302B'}" />
            <rect x="150" y="40" width="40" height="80" rx="4" fill="${isCream ? '#D7D0C5' : '#33302B'}" />
            <rect x="215" y="30" width="40" height="90" rx="4" fill="${isCream ? '#D7D0C5' : '#33302B'}" />
            <rect x="280" y="18" width="40" height="102" rx="4" fill="${accentRed}" />
            <rect x="345" y="8" width="40" height="112" rx="4" fill="${accentEmerald}" />

            <!-- Labels -->
            <text x="40" y="135" fill="${textMuted}" font-family="monospace" font-size="9" text-anchor="middle">W1</text>
            <text x="105" y="135" fill="${textMuted}" font-family="monospace" font-size="9" text-anchor="middle">W2</text>
            <text x="170" y="135" fill="${textMuted}" font-family="monospace" font-size="9" text-anchor="middle">W3</text>
            <text x="235" y="135" fill="${textMuted}" font-family="monospace" font-size="9" text-anchor="middle">W4</text>
            <text x="300" y="135" fill="${textPrimary}" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">SCALE</text>
            <text x="365" y="135" fill="${accentEmerald}" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">PEAK</text>
          </g>
        </g>

        <!-- Bottom Status Bar -->
        <g transform="translate(30, 395)">
          <rect x="0" y="0" width="410" height="34" rx="8" fill="${isCream ? '#F7F5F0' : '#141413'}" border="${cardBorder}" />
          <circle cx="16" cy="17" r="4" fill="${accentEmerald}" />
          <text x="28" y="21" fill="${textPrimary}" font-family="monospace" font-size="10" font-weight="600">Enterprise CRM Webhook Active (HubSpot / Salesforce)</text>
          <text x="395" y="21" fill="${textMuted}" font-family="monospace" font-size="10" text-anchor="end">&lt;60s</text>
        </g>
      </g>
    `;
  } else if (archetype === 'meta') {
    // Meta Ads & Creative Matrix Visualizer
    graphicSvg = `
      <g transform="translate(680, 110)">
        <rect width="470" height="455" rx="20" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.5" />
        <rect x="0" y="0" width="470" height="48" rx="20" fill="${isCream ? '#EFEBE4' : '#232220'}" />
        <circle cx="28" cy="24" r="5" fill="${accentRed}" />
        <circle cx="44" cy="24" r="5" fill="#EAB308" />
        <circle cx="60" cy="24" r="5" fill="${accentEmerald}" />
        <text x="80" y="29" fill="${textMuted}" font-family="monospace" font-size="11" font-weight="700" letter-spacing="1">META ADVANTAGE+ &amp; CAPI ENGINE</text>
        
        <!-- 3x3 Creative Matrix Representation -->
        <g transform="translate(30, 75)">
          <text x="0" y="0" fill="${textPrimary}" font-family="sans-serif" font-size="12" font-weight="700">Dynamic Hook &amp; Creative Iteration Matrix</text>
          
          <g transform="translate(0, 18)">
            <!-- Matrix Cards -->
            <rect x="0" y="0" width="125" height="90" rx="10" fill="${isCream ? '#F7F5F0' : '#141413'}" stroke="${cardBorder}" />
            <text x="14" y="24" fill="${accentRed}" font-family="monospace" font-size="9" font-weight="700">CONCEPT A1</text>
            <text x="14" y="44" fill="${textPrimary}" font-family="sans-serif" font-size="12" font-weight="700">Pain-Point Hook</text>
            <text x="14" y="64" fill="${accentEmerald}" font-family="monospace" font-size="10">ROAS 4.82x</text>

            <rect x="142" y="0" width="125" height="90" rx="10" fill="${isCream ? '#F7F5F0' : '#141413'}" stroke="${accentRed}" stroke-width="1.5" />
            <text x="156" y="24" fill="${accentRed}" font-family="monospace" font-size="9" font-weight="700">CONCEPT A2 ★</text>
            <text x="156" y="44" fill="${textPrimary}" font-family="sans-serif" font-size="12" font-weight="700">Founder Story</text>
            <text x="156" y="64" fill="${accentEmerald}" font-family="monospace" font-size="10" font-weight="700">ROAS 7.94x</text>

            <rect x="284" y="0" width="125" height="90" rx="10" fill="${isCream ? '#F7F5F0' : '#141413'}" stroke="${cardBorder}" />
            <text x="298" y="24" fill="${textMuted}" font-family="monospace" font-size="9" font-weight="700">CONCEPT B1</text>
            <text x="298" y="44" fill="${textPrimary}" font-family="sans-serif" font-size="12" font-weight="700">Social Proof UGC</text>
            <text x="298" y="64" fill="${textMuted}" font-family="monospace" font-size="10">ROAS 3.20x</text>
          </g>
        </g>

        <!-- Telemetry Breakdown -->
        <g transform="translate(30, 220)">
          <rect x="0" y="0" width="410" height="135" rx="12" fill="${isCream ? '#F7F5F0' : '#141413'}" stroke="${cardBorder}" />
          <text x="20" y="28" fill="${textPrimary}" font-family="sans-serif" font-size="12" font-weight="700">Conversion Telemetry &amp; CAPI Match Rate</text>
          
          <g transform="translate(20, 48)">
            <!-- Progress 1: Event Quality -->
            <text x="0" y="0" fill="${textMuted}" font-family="monospace" font-size="10">Event Match Quality (EMQ)</text>
            <text x="370" y="0" fill="${accentEmerald}" font-family="monospace" font-size="10" font-weight="700" text-anchor="end">9.4 / 10</text>
            <rect x="0" y="8" width="370" height="6" rx="3" fill="${isCream ? '#E5E0D6' : '#2A2927'}" />
            <rect x="0" y="8" width="347" height="6" rx="3" fill="${accentEmerald}" />

            <!-- Progress 2: Deduplication -->
            <text x="0" y="36" fill="${textMuted}" font-family="monospace" font-size="10">Browser + CAPI Deduplication Rate</text>
            <text x="370" y="36" fill="${accentRed}" font-family="monospace" font-size="10" font-weight="700" text-anchor="end">99.8% Verified</text>
            <rect x="0" y="44" width="370" height="6" rx="3" fill="${isCream ? '#E5E0D6' : '#2A2927'}" />
            <rect x="0" y="44" width="369" height="6" rx="3" fill="${accentRed}" />
          </g>
        </g>

        <!-- Footer Tag -->
        <g transform="translate(30, 395)">
          <text x="0" y="18" fill="${textMuted}" font-family="monospace" font-size="10">Meta Marketing API v21.0 · CAPI Server-to-Server Ready</text>
        </g>
      </g>
    `;
  } else if (archetype === 'google') {
    // Google Ads Performance Max & Search Architecture
    graphicSvg = `
      <g transform="translate(680, 110)">
        <rect width="470" height="455" rx="20" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.5" />
        <rect x="0" y="0" width="470" height="48" rx="20" fill="${isCream ? '#EFEBE4' : '#232220'}" />
        <circle cx="28" cy="24" r="5" fill="${accentRed}" />
        <circle cx="44" cy="24" r="5" fill="#EAB308" />
        <circle cx="60" cy="24" r="5" fill="${accentEmerald}" />
        <text x="80" y="29" fill="${textMuted}" font-family="monospace" font-size="11" font-weight="700" letter-spacing="1">GOOGLE PERFORMANCE MAX ARCHITECTURE</text>
        
        <!-- Asset Groups Breakdown -->
        <g transform="translate(30, 75)">
          <rect x="0" y="0" width="410" height="110" rx="12" fill="${isCream ? '#F7F5F0' : '#141413'}" stroke="${cardBorder}" />
          <text x="18" y="26" fill="${textPrimary}" font-family="sans-serif" font-size="12" font-weight="700">Asset Group Value Segmentation</text>
          
          <g transform="translate(18, 44)">
            <rect x="0" y="0" width="115" height="50" rx="6" fill="${isCream ? '#FFFFFF' : '#1E1D1B'}" stroke="${cardBorder}" />
            <text x="12" y="18" fill="${textMuted}" font-family="monospace" font-size="8" font-weight="700">GROUP 1 (HERO)</text>
            <text x="12" y="36" fill="${textPrimary}" font-family="sans-serif" font-size="12" font-weight="800">High Margin</text>

            <rect x="128" y="0" width="115" height="50" rx="6" fill="${isCream ? '#FFFFFF' : '#1E1D1B'}" stroke="${cardBorder}" />
            <text x="140" y="18" fill="${textMuted}" font-family="monospace" font-size="8" font-weight="700">GROUP 2</text>
            <text x="140" y="36" fill="${textPrimary}" font-family="sans-serif" font-size="12" font-weight="800">New Arrivals</text>

            <rect x="256" y="0" width="115" height="50" rx="6" fill="${isCream ? '#FFFFFF' : '#1E1D1B'}" stroke="${accentEmerald}" />
            <text x="268" y="18" fill="${accentEmerald}" font-family="monospace" font-size="8" font-weight="700">ROAS TARGET</text>
            <text x="268" y="36" fill="${accentEmerald}" font-family="sans-serif" font-size="12" font-weight="800">620% tROAS</text>
          </g>
        </g>

        <!-- Search Intent & Exclusion Rules -->
        <g transform="translate(30, 210)">
          <rect x="0" y="0" width="410" height="150" rx="12" fill="${isCream ? '#F7F5F0' : '#141413'}" stroke="${cardBorder}" />
          <text x="18" y="28" fill="${textPrimary}" font-family="sans-serif" font-size="12" font-weight="700">Conversion Value Rules &amp; Negative Filtering</text>
          
          <g transform="translate(18, 48)">
            <rect x="0" y="0" width="374" height="34" rx="6" fill="${isCream ? '#FFFFFF' : '#1E1D1B'}" />
            <text x="14" y="22" fill="${accentRed}" font-family="monospace" font-size="10" font-weight="700">RULE A:</text>
            <text x="70" y="22" fill="${textPrimary}" font-family="monospace" font-size="10">Brand Cannibalization Exclusions (Active)</text>

            <rect x="0" y="44" width="374" height="34" rx="6" fill="${isCream ? '#FFFFFF' : '#1E1D1B'}" />
            <text x="14" y="66" fill="${accentEmerald}" font-family="monospace" font-size="10" font-weight="700">RULE B:</text>
            <text x="70" y="66" fill="${textPrimary}" font-family="monospace" font-size="10">High-LTV Geo Lift Multiplier (+25%)</text>
          </g>
        </g>

        <!-- Bottom Tag -->
        <g transform="translate(30, 395)">
          <text x="0" y="18" fill="${textMuted}" font-family="monospace" font-size="10">Google Ads API v18 · Smart Bidding Architecture Verified</text>
        </g>
      </g>
    `;
  } else {
    // General Performance & Attribution Telemetry
    graphicSvg = `
      <g transform="translate(680, 110)">
        <rect width="470" height="455" rx="20" fill="${cardBg}" stroke="${cardBorder}" stroke-width="1.5" />
        <rect x="0" y="0" width="470" height="48" rx="20" fill="${isCream ? '#EFEBE4' : '#232220'}" />
        <circle cx="28" cy="24" r="5" fill="${accentRed}" />
        <circle cx="44" cy="24" r="5" fill="#EAB308" />
        <circle cx="60" cy="24" r="5" fill="${accentEmerald}" />
        <text x="80" y="29" fill="${textMuted}" font-family="monospace" font-size="11" font-weight="700" letter-spacing="1">GROWTH MATRIX &amp; SCALE METRICS</text>
        
        <!-- Metric Cards Grid -->
        <g transform="translate(30, 75)">
          <g>
            <rect x="0" y="0" width="195" height="110" rx="12" fill="${isCream ? '#F7F5F0' : '#141413'}" stroke="${cardBorder}" />
            <text x="20" y="32" fill="${textMuted}" font-family="monospace" font-size="10" font-weight="700">PORTFOLIO AD SPEND</text>
            <text x="20" y="68" fill="${textPrimary}" font-family="sans-serif" font-size="28" font-weight="900">₹50L+</text>
            <text x="20" y="92" fill="${accentEmerald}" font-family="monospace" font-size="10">Audited &amp; Managed</text>
          </g>
          <g transform="translate(215, 0)">
            <rect x="0" y="0" width="195" height="110" rx="12" fill="${isCream ? '#F7F5F0' : '#141413'}" stroke="${accentRed}" stroke-width="1.5" />
            <text x="20" y="32" fill="${accentRed}" font-family="monospace" font-size="10" font-weight="700">AVERAGE ROAS LIFT</text>
            <text x="20" y="68" fill="${textPrimary}" font-family="sans-serif" font-size="28" font-weight="900">4.85x</text>
            <text x="20" y="92" fill="${accentEmerald}" font-family="monospace" font-size="10">Blended Benchmark</text>
          </g>
        </g>

        <!-- Wave / Trend Curve -->
        <g transform="translate(30, 215)">
          <rect x="0" y="0" width="410" height="150" rx="12" fill="${isCream ? '#F7F5F0' : '#141413'}" stroke="${cardBorder}" />
          <text x="20" y="28" fill="${textPrimary}" font-family="sans-serif" font-size="12" font-weight="700">Predictive Scale &amp; CAC Compression</text>
          
          <path d="M 20 120 Q 120 110, 200 70 T 390 35" fill="none" stroke="${accentRed}" stroke-width="3" />
          <circle cx="390" cy="35" r="5" fill="${accentRed}" />
          <text x="390" y="20" fill="${accentRed}" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle">PEAK EFFICIENCY</text>
          
          <line x1="20" y1="130" x2="390" y2="130" stroke="${cardBorder}" stroke-width="1" />
        </g>

        <!-- Bottom Tag -->
        <g transform="translate(30, 395)">
          <text x="0" y="18" fill="${textMuted}" font-family="monospace" font-size="10">Empirical Media Planning &amp; Conversion Telemetry</text>
        </g>
      </g>
    `;
  }

  // Generate full 16:9 SVG document
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&amp;family=Inter:wght@400;600;700;800&amp;display=swap');
      text { font-family: 'DM Sans', 'Inter', -apple-system, sans-serif; }
    </style>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgFill}" />
      <stop offset="100%" stop-color="${isCream ? '#EFEBE4' : '#0B0B0A'}" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${gridLine}" stroke-width="1" />
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="675" fill="url(#bgGrad)" />
  <rect width="1200" height="675" fill="url(#grid)" />

  <!-- Accent Edge Glow -->
  <circle cx="1100" cy="80" r="320" fill="${accentRed}" opacity="${isCream ? '0.04' : '0.08'}" filter="blur(60px)" />
  <circle cx="100" cy="600" r="280" fill="${accentEmerald}" opacity="${isCream ? '0.03' : '0.06'}" filter="blur(50px)" />

  <!-- LEFT COLUMN: Brand, Category, Title & Author Metadata -->
  <g transform="translate(70, 75)">
    <!-- Brand Monogram & Label -->
    <g>
      <rect width="36" height="36" rx="10" fill="#191919" />
      <text x="18" y="24" fill="#FFFFFF" font-size="16" font-weight="900" text-anchor="middle">V</text>
      <text x="48" y="23" fill="${textPrimary}" font-size="14" font-weight="800" letter-spacing="-0.3">VedantVerse</text>
      <text x="145" y="23" fill="${textMuted}" font-size="12" font-weight="500">· Growth Studio</text>
    </g>

    <!-- Category Pill -->
    <g transform="translate(0, 70)">
      <rect width="${Math.max(120, safeCategory.length * 9 + 30)}" height="26" rx="13" fill="${isCream ? '#FFFFFF' : '#1C1B19'}" stroke="${accentRed}" stroke-width="1.2" />
      <circle cx="14" cy="13" r="3.5" fill="${accentRed}" />
      <text x="24" y="17" fill="${accentRed}" font-family="monospace" font-size="10.5" font-weight="800" letter-spacing="1">${safeCategory}</text>
    </g>

    <!-- Main Editorial Title -->
    <g transform="translate(0, 150)">
      ${titleLines.map((line, idx) => `
        <text x="0" y="${idx * 46}" fill="${textPrimary}" font-size="36" font-weight="800" letter-spacing="-0.8">
          ${line}
        </text>
      `).join('')}
    </g>

    <!-- Subtitle / Meta Description Gist -->
    <g transform="translate(0, ${170 + titleLines.length * 46})">
      <text x="0" y="0" fill="${textMuted}" font-size="15" font-weight="500" letter-spacing="-0.2">
        Authoritative media planning architecture &amp; empirical conversion benchmarks.
      </text>
    </g>

    <!-- Author & Reading Metadata Box -->
    <g transform="translate(0, 445)">
      <line x1="0" y1="0" x2="520" y2="0" stroke="${cardBorder}" stroke-width="1" />
      
      <!-- Author Pill -->
      <g transform="translate(0, 20)">
        <circle cx="18" cy="18" r="18" fill="${isCream ? '#FFFFFF' : '#2A2927'}" />
        <text x="18" y="23" fill="${textPrimary}" font-size="12" font-weight="800" text-anchor="middle">VT</text>
        
        <text x="46" y="15" fill="${textPrimary}" font-size="13" font-weight="700">Vedant Tiwari</text>
        <text x="46" y="29" fill="${textMuted}" font-size="11" font-weight="500">Senior Performance Marketing Executive</text>

        <!-- Right Side Badge -->
        <rect x="400" y="6" width="115" height="24" rx="6" fill="${isCream ? '#FFFFFF' : '#1A1918'}" stroke="${cardBorder}" />
        <text x="457" y="22" fill="${textMuted}" font-family="monospace" font-size="10.5" font-weight="700" text-anchor="middle">16:9 HD HERO</text>
      </g>
    </g>
  </g>

  <!-- RIGHT COLUMN: Technical Archetype Schematic -->
  ${graphicSvg}
</svg>
`;
}

/**
 * Saves generated cover image directly to /public/covers/{slug}.svg and returns URL path.
 */
export async function saveCoverImage(params: CoverGeneratorParams): Promise<string> {
  const { slug } = params;
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const svgContent = generateCoverSvg({ ...params, slug: cleanSlug });

  try {
    const coversDir = path.join(process.cwd(), 'public/covers');
    if (!fs.existsSync(coversDir)) {
      fs.mkdirSync(coversDir, { recursive: true });
    }
    const filePath = path.join(coversDir, `${cleanSlug}.svg`);
    fs.writeFileSync(filePath, svgContent, 'utf8');
    return `/covers/${cleanSlug}.svg`;
  } catch (err) {
    console.warn(`Could not save cover image to disk for ${cleanSlug}, returning data URI:`, err);
    // Safe data URL fallback
    const base64 = Buffer.from(svgContent).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  }
}

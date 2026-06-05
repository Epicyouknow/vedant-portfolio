import fs from 'fs';
import path from 'path';

// Define data structures
export interface VisitRecord {
  ip: string;
  country: string;
  city: string;
  browser: string;
  os: string;
  device: string;
  screenResolution: string;
  referrer: string;
  path: string;
  timestamp: string; // ISO String
}

export interface EventRecord {
  ip: string; // Map back to visit by IP + Date
  eventName: string;
  metadata?: Record<string, any>;
  timestamp: string; // ISO String
}

export interface AnalyticsData {
  visits: VisitRecord[];
  events: EventRecord[];
}

const dbPath = path.join(process.cwd(), 'analytics.json');

// Ensure database file exists
function initDb(): AnalyticsData {
  try {
    if (!fs.existsSync(dbPath)) {
      const initial: AnalyticsData = { visits: [], events: [] };
      fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data) as AnalyticsData;
  } catch (err) {
    console.error('Error initializing analytics database:', err);
    return { visits: [], events: [] };
  }
}

// Write database data
function writeDb(data: AnalyticsData) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to analytics database:', err);
  }
}

// User-Agent parser helpers
export function parseUserAgent(uaString: string) {
  const ua = uaString.toLowerCase();
  
  // 1. Device Type
  let device = 'Desktop';
  if (/mobi|android|iphone|ipad|ipod/i.test(ua)) {
    if (/ipad|tablet/i.test(ua)) {
      device = 'Tablet';
    } else {
      device = 'Mobile';
    }
  }

  // 2. Operating System
  let os = 'Unknown OS';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  else if (ua.includes('linux')) os = 'Linux';

  // 3. Browser
  let browser = 'Unknown Browser';
  if (ua.includes('chrome') && !ua.includes('chromium') && !ua.includes('edg') && !ua.includes('opr')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium')) browser = 'Safari';
  else if (ua.includes('firefox') && !ua.includes('seamonkey')) browser = 'Firefox';
  else if (ua.includes('edg') || ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opr') || ua.includes('opera')) browser = 'Opera';

  return { device, os, browser };
}

// Referrer parser helper
export function parseReferrer(ref: string): string {
  if (!ref || ref === 'direct') return 'Direct';
  const url = ref.toLowerCase();
  if (url.includes('linkedin.com')) return 'LinkedIn';
  if (url.includes('google.com')) return 'Google';
  if (url.includes('facebook.com') || url.includes('instagram.com') || url.includes('twitter.com') || url.includes('t.co') || url.includes('reddit.com')) return 'Social Media';
  return 'Referral / Other';
}

// Log a page view (visit)
export function logVisit(record: Omit<VisitRecord, 'timestamp'>) {
  const db = initDb();
  const newVisit: VisitRecord = {
    ...record,
    timestamp: new Date().toISOString(),
  };
  db.visits.push(newVisit);
  writeDb(db);
}

// Log a custom action event
export function logEvent(record: Omit<EventRecord, 'timestamp'>) {
  const db = initDb();
  const newEvent: EventRecord = {
    ...record,
    timestamp: new Date().toISOString(),
  };
  db.events.push(newEvent);
  writeDb(db);
}

// Retrieve aggregated stats for the dashboard
export function getAnalyticsStats() {
  const db = initDb();
  const now = new Date();
  
  const oneDay = 24 * 60 * 60 * 1000;
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekAgo = now.getTime() - (7 * oneDay);
  const monthAgo = now.getTime() - (30 * oneDay);

  // Helper to filter visits by time range
  const visitsToday = db.visits.filter(v => new Date(v.timestamp).getTime() >= todayStart);
  const visitsWeekly = db.visits.filter(v => new Date(v.timestamp).getTime() >= weekAgo);
  const visitsMonthly = db.visits.filter(v => new Date(v.timestamp).getTime() >= monthAgo);

  // Visitors KPI
  const totalVisitors = db.visits.length;
  const todayCount = visitsToday.length;
  const weeklyCount = visitsWeekly.length;
  const monthlyCount = visitsMonthly.length;

  // Hashed IP groupings to identify Unique / Returning
  const ipCounts: Record<string, number> = {};
  db.visits.forEach(v => {
    ipCounts[v.ip] = (ipCounts[v.ip] || 0) + 1;
  });

  const uniqueCount = Object.keys(ipCounts).length;
  const returningCount = Object.values(ipCounts).filter(c => c > 1).length;

  // Locations Aggregation (Countries & Cities)
  const countryCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};
  db.visits.forEach(v => {
    if (v.country) countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
    if (v.city && v.country) {
      const label = `${v.city}, ${v.country}`;
      cityCounts[label] = (cityCounts[label] || 0) + 1;
    }
  });

  const topCountries = Object.entries(countryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topCities = Object.entries(cityCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Devices, Browsers, OSs
  const deviceCounts: Record<string, number> = {};
  const browserCounts: Record<string, number> = {};
  const osCounts: Record<string, number> = {};

  db.visits.forEach(v => {
    deviceCounts[v.device] = (deviceCounts[v.device] || 0) + 1;
    browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
    osCounts[v.os] = (osCounts[v.os] || 0) + 1;
  });

  // Traffic Sources Referrers
  const trafficCounts: Record<string, number> = {
    'Direct': 0,
    'LinkedIn': 0,
    'Google': 0,
    'Social Media': 0,
    'Referral / Other': 0
  };

  db.visits.forEach(v => {
    const source = v.referrer;
    trafficCounts[source] = (trafficCounts[source] || 0) + 1;
  });

  const trafficSources = Object.entries(trafficCounts).map(([name, count]) => ({ name, count }));

  // Event Counters (Downloads, LinkedIn clicks, Contact clicks, Chatbot queries, Section interactions)
  let resumeDownloads = 0;
  let linkedInClicks = 0;
  let contactClicks = 0;
  let aiQueriesCount = 0;
  const projectViews: Record<string, number> = {};
  const sectionInteractions: Record<string, number> = {};
  const recentQueries: string[] = [];

  db.events.forEach(e => {
    if (e.eventName === 'resume_download') resumeDownloads++;
    else if (e.eventName === 'linkedin_click') linkedInClicks++;
    else if (e.eventName === 'contact_click') contactClicks++;
    else if (e.eventName === 'ai_query') {
      aiQueriesCount++;
      if (e.metadata?.query) recentQueries.push(e.metadata.query);
    } else if (e.eventName === 'project_view' && e.metadata?.project) {
      projectViews[e.metadata.project] = (projectViews[e.metadata.project] || 0) + 1;
    } else if (e.eventName === 'section_view' && e.metadata?.section) {
      sectionInteractions[e.metadata.section] = (sectionInteractions[e.metadata.section] || 0) + 1;
    }
  });

  const topProjects = Object.entries(projectViews)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topSections = Object.entries(sectionInteractions)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate approximate Bounce Rate
  // Bounce: visits that only had 1 pageview and did not trigger any custom events
  const ipActions: Record<string, { pageviews: number; events: number }> = {};
  db.visits.forEach(v => {
    if (!ipActions[v.ip]) ipActions[v.ip] = { pageviews: 0, events: 0 };
    ipActions[v.ip].pageviews++;
  });
  db.events.forEach(e => {
    if (!ipActions[e.ip]) ipActions[e.ip] = { pageviews: 0, events: 0 };
    ipActions[e.ip].events++;
  });

  let bounces = 0;
  const totalUniqueSessions = Object.keys(ipActions).length;
  Object.values(ipActions).forEach(act => {
    if (act.pageviews === 1 && act.events === 0) {
      bounces++;
    }
  });

  const bounceRate = totalUniqueSessions > 0 ? Math.round((bounces / totalUniqueSessions) * 100) : 0;

  return {
    kpis: {
      todayVisitors: todayCount,
      weeklyVisitors: weeklyCount,
      monthlyVisitors: monthlyCount,
      totalVisitors,
      uniqueVisitors: uniqueCount,
      returningVisitors: returningCount,
      resumeDownloads,
      linkedInClicks,
      contactClicks,
      aiQueriesCount,
      bounceRate,
    },
    topCountries,
    topCities,
    devices: Object.entries(deviceCounts).map(([name, count]) => ({ name, count })),
    browsers: Object.entries(browserCounts).map(([name, count]) => ({ name, count })),
    operatingSystems: Object.entries(osCounts).map(([name, count]) => ({ name, count })),
    trafficSources,
    topProjects,
    topSections,
    recentQueries: recentQueries.slice(-10).reverse()
  };
}

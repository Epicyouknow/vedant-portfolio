import fs from 'fs';
import path from 'path';

export type InquiryStatus = 'new' | 'contacted' | 'in_discussion' | 'converted' | 'archived';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  budget: string;
  message: string;
  timestamp: string; // ISO string
  status: InquiryStatus;
  notes?: string;
  starred?: boolean;
  businessName?: string;
  website?: string;
  serviceHelp?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
  firstTouch?: any;
  latestTouch?: any;
  eventId?: string;
  capiStatus?: 'delivered' | 'skipped' | 'failed';
  capiEventId?: string;
  capiTraceId?: string;
}

const dbPath = path.join(process.cwd(), 'inquiries.json');

// Ensure an inquiry has an id and valid status (backwards-compatibility migration)
function normalizeInquiry(item: any, index: number): Inquiry {
  return {
    id: item.id || `inq_${new Date(item.timestamp || Date.now()).getTime()}_${index}`,
    name: item.name || 'Anonymous',
    email: item.email || '',
    phone: item.phone || '',
    budget: item.budget || 'Not specified',
    message: item.message || '',
    timestamp: item.timestamp || new Date().toISOString(),
    status: item.status || 'new',
    notes: item.notes || '',
    starred: Boolean(item.starred),
    businessName: item.businessName || '',
    website: item.website || '',
    serviceHelp: item.serviceHelp || '',
    utmSource: item.utmSource || '',
    utmMedium: item.utmMedium || '',
    utmCampaign: item.utmCampaign || '',
    utmContent: item.utmContent || '',
    utmTerm: item.utmTerm || '',
    fbclid: item.fbclid || '',
    fbc: item.fbc || '',
    fbp: item.fbp || '',
    firstTouch: item.firstTouch || null,
    latestTouch: item.latestTouch || null,
    eventId: item.eventId || '',
    capiStatus: item.capiStatus,
    capiEventId: item.capiEventId,
    capiTraceId: item.capiTraceId,
  };
}

// Load inquiries from Vercel KV or local fallback
export async function loadInquiries(): Promise<Inquiry[]> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/get/vedantverse_inquiries`, {
        headers: {
          Authorization: `Bearer ${kvToken}`
        },
        cache: 'no-store'
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.result) {
          const raw = JSON.parse(json.result) as any[];
          return raw.map(normalizeInquiry);
        }
      }
    } catch (err) {
      console.error('Vercel KV fetch failed for inquiries, falling back to local JSON:', err);
    }
  }

  try {
    if (!fs.existsSync(dbPath)) {
      const initial: Inquiry[] = [];
      fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(dbPath, 'utf-8');
    const raw = JSON.parse(data) as any[];
    return raw.map(normalizeInquiry);
  } catch (err) {
    console.error('Error loading inquiries database:', err);
    return [];
  }
}

// Write inquiries to Vercel KV or local fallback
export async function saveInquiries(data: Inquiry[]): Promise<void> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const res = await fetch(kvUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['SET', 'vedantverse_inquiries', JSON.stringify(data)])
      });
      if (res.ok) {
        return;
      }
      console.error('Vercel KV inquiries write failed, status:', res.status);
    } catch (err) {
      console.error('Error writing inquiries to Vercel KV database:', err);
    }
  }

  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing inquiries database:', err);
  }
}

// Add a single inquiry and return the full saved record
export async function saveInquiry(
  record: Omit<Inquiry, 'id' | 'timestamp' | 'status'> & { id?: string; status?: InquiryStatus }
): Promise<Inquiry> {
  const inquiries = await loadInquiries();
  const newInquiry: Inquiry = {
    id: record.id || `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: record.name,
    email: record.email,
    phone: record.phone || '',
    budget: record.budget || 'Not specified',
    message: record.message,
    timestamp: new Date().toISOString(),
    status: record.status || 'new',
    notes: record.notes || '',
    starred: Boolean(record.starred),
    businessName: record.businessName || '',
    website: record.website || '',
    serviceHelp: record.serviceHelp || '',
    utmSource: record.utmSource || '',
    utmMedium: record.utmMedium || '',
    utmCampaign: record.utmCampaign || '',
    utmContent: record.utmContent || '',
    utmTerm: record.utmTerm || '',
    fbclid: record.fbclid || '',
    fbc: record.fbc || '',
    fbp: record.fbp || '',
    firstTouch: record.firstTouch || null,
    latestTouch: record.latestTouch || null,
    eventId: record.eventId || '',
    capiStatus: record.capiStatus,
    capiEventId: record.capiEventId,
    capiTraceId: record.capiTraceId,
  };
  inquiries.push(newInquiry);
  await saveInquiries(inquiries);
  return newInquiry;
}

// Update an existing inquiry (e.g. status, notes, starred)
export async function updateInquiry(
  id: string,
  updates: Partial<Pick<Inquiry, 'status' | 'notes' | 'starred'>>
): Promise<Inquiry | null> {
  const inquiries = await loadInquiries();
  const index = inquiries.findIndex(i => i.id === id);
  if (index === -1) {
    return null;
  }

  inquiries[index] = {
    ...inquiries[index],
    ...updates
  };

  await saveInquiries(inquiries);
  return inquiries[index];
}

// Delete an inquiry by ID or by legacy index
export async function deleteInquiry(idOrIndex: string | number): Promise<boolean> {
  const inquiries = await loadInquiries();

  if (typeof idOrIndex === 'number') {
    if (idOrIndex >= 0 && idOrIndex < inquiries.length) {
      inquiries.splice(idOrIndex, 1);
      await saveInquiries(inquiries);
      return true;
    }
    return false;
  }

  const initialLength = inquiries.length;
  const filtered = inquiries.filter(i => i.id !== idOrIndex);
  if (filtered.length !== initialLength) {
    await saveInquiries(filtered);
    return true;
  }

  // If not found by id, maybe it's a numeric index as string
  const num = parseInt(idOrIndex, 10);
  if (!isNaN(num) && num >= 0 && num < inquiries.length) {
    inquiries.splice(num, 1);
    await saveInquiries(inquiries);
    return true;
  }

  return false;
}

import fs from 'fs';
import path from 'path';

export interface Inquiry {
  name: string;
  email: string;
  budget: string;
  message: string;
  timestamp: string; // ISO string
}

const dbPath = path.join(process.cwd(), 'inquiries.json');

// Load inquiries from Vercel KV or local fallback
export async function loadInquiries(): Promise<Inquiry[]> {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

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
          return JSON.parse(json.result) as Inquiry[];
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
    return JSON.parse(data) as Inquiry[];
  } catch (err) {
    console.error('Error loading inquiries database:', err);
    return [];
  }
}

// Write inquiries to Vercel KV or local fallback
export async function saveInquiries(data: Inquiry[]): Promise<void> {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

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

// Add a single inquiry
export async function saveInquiry(record: Omit<Inquiry, 'timestamp'>): Promise<void> {
  const inquiries = await loadInquiries();
  const newInquiry: Inquiry = {
    ...record,
    timestamp: new Date().toISOString(),
  };
  inquiries.push(newInquiry);
  await saveInquiries(inquiries);
}

// Delete an inquiry by index
export async function deleteInquiry(index: number): Promise<void> {
  const inquiries = await loadInquiries();
  if (index >= 0 && index < inquiries.length) {
    inquiries.splice(index, 1);
    await saveInquiries(inquiries);
  }
}

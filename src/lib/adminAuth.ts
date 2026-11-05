export type AdminRole = 'Owner' | 'Admin' | 'Editor' | 'Blog Contributor' | 'Viewer';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  title?: string;
  avatar?: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}

export const AUTHORIZED_ADMIN_USERS: (AdminUser & { password: string })[] = [
  {
    id: 'user-owner',
    name: 'Vedant Tiwari',
    email: 'Owner@vedantverse.in',
    role: 'Owner',
    title: 'Founder & Performance Director',
    status: 'Active',
    lastActive: 'Just now',
    password: 'vedaarya.in#1',
  },
  {
    id: 'user-partner',
    name: 'Partner',
    email: 'Partner@vedantverse.in',
    role: 'Admin',
    title: 'Co-Managing Partner',
    status: 'Active',
    lastActive: 'Just now',
    password: 'vedaarya.in#1',
  },
];

export const DEFAULT_USERS: AdminUser[] = AUTHORIZED_ADMIN_USERS.map(({ password, ...user }) => user);

export const ADMIN_COOKIE_NAME = 'vedant_admin_session';
const SESSION_SECRET = process.env.ADMIN_AUTH_SECRET || 'vedantverse-command-centre-auth-2026-prod';

/**
 * Validate credentials against authorized CMS accounts.
 * Case-insensitive email comparison for convenience.
 */
export function validateAdminCredentials(email: string, password: string): { valid: boolean; user?: AdminUser; error?: string } {
  if (!email || !password) {
    return { valid: false, error: 'Email and password are required.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const matched = AUTHORIZED_ADMIN_USERS.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === password
  );

  if (!matched) {
    return {
      valid: false,
      error: 'Invalid email or password. Access restricted to authorized accounts (Owner@vedantverse.in / Partner@vedantverse.in).',
    };
  }

  const { password: _, ...safeUser } = matched;
  return { valid: true, user: safeUser };
}

/**
 * Generate a signed session token.
 */
export async function createSessionToken(user: AdminUser, durationDays = 30): Promise<string> {
  const expiresAt = Date.now() + durationDays * 24 * 60 * 60 * 1000;
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt,
  };

  const payloadString = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadString, 'utf-8').toString('base64url');

  const signature = await generateHmac(base64Payload, SESSION_SECRET);
  return `${base64Payload}.${signature}`;
}

/**
 * Verify session token validity and expiration.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<{ valid: boolean; user?: AdminUser }> {
  if (!token || typeof token !== 'string') {
    return { valid: false };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false };
  }

  const [base64Payload, providedSig] = parts;

  try {
    const expectedSig = await generateHmac(base64Payload, SESSION_SECRET);
    if (providedSig !== expectedSig) {
      return { valid: false };
    }

    const jsonStr = Buffer.from(base64Payload, 'base64url').toString('utf-8');
    const data = JSON.parse(jsonStr);

    if (Date.now() > data.expiresAt) {
      return { valid: false };
    }

    // Verify user is in authorized list
    const matched = AUTHORIZED_ADMIN_USERS.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );

    if (!matched) {
      return { valid: false };
    }

    const { password: _, ...safeUser } = matched;
    return { valid: true, user: safeUser };
  } catch {
    return { valid: false };
  }
}

async function generateHmac(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function canPublish(role: AdminRole): boolean {
  return role === 'Owner' || role === 'Admin';
}

export function canEditCaseStudies(role: AdminRole): boolean {
  return role === 'Owner' || role === 'Admin' || role === 'Editor';
}

export function canEditBlogs(role: AdminRole): boolean {
  return role === 'Owner' || role === 'Admin' || role === 'Editor' || role === 'Blog Contributor';
}

export function canManageUsers(role: AdminRole): boolean {
  return role === 'Owner';
}

export function canManageSettings(role: AdminRole): boolean {
  return role === 'Owner' || role === 'Admin';
}

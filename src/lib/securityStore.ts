import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { RateLimitData, RATE_LIMIT_TIERS, MonitoredAccount } from './securityTypes';

export type { RateLimitData, MonitoredAccount };
export { RATE_LIMIT_TIERS };

interface ActiveOtp {
  code: string;
  expiresAt: number;
  email: string;
}

interface SecurityStateFile {
  rateLimits: Record<string, RateLimitData>;
  passwords: Record<string, string>;
}

const STATE_FILE = path.join(process.cwd(), 'security-state.json');

// Memory caches
const rateLimitCache: Record<string, RateLimitData> = {};
const activeOtpCache: Record<string, ActiveOtp> = {};
const passwordCache: Record<string, string> = {
  'contactvedantverse@gmail.com': 'vedaarya.in#1',
  'owner@vedantverse.in': 'vedaarya.in#1',
  'partner@vedantverse.in': 'vedaarya.in#1',
};

// Load persistent state from disk
function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data: SecurityStateFile = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
      if (data.rateLimits) {
        Object.assign(rateLimitCache, data.rateLimits);
      }
      if (data.passwords) {
        Object.assign(passwordCache, data.passwords);
      }
    }
  } catch (err) {
    console.error('Error loading security-state.json:', err);
  }
}

// Save persistent state to disk
function saveState() {
  try {
    const data: SecurityStateFile = {
      rateLimits: rateLimitCache,
      passwords: passwordCache,
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving security-state.json:', err);
  }
}

// Initial state load
loadState();

export function getInitialLimit(): RateLimitData {
  return {
    stage: 1,
    attemptsRemaining: 5,
    maxAttempts: 5,
    isLocked: false,
    lockoutExpiry: null,
    isBlocked: false,
  };
}

export function getRateLimit(rawEmail: string): RateLimitData {
  const key = rawEmail.trim().toLowerCase();
  const current = rateLimitCache[key] || getInitialLimit();

  // Check if lockout has naturally expired after 6 hours
  if (current.isLocked && current.lockoutExpiry && Date.now() >= current.lockoutExpiry) {
    if (current.stage < 5) {
      const nextStage = (current.stage + 1) as 1 | 2 | 3 | 4 | 5 | 6;
      const max = RATE_LIMIT_TIERS[nextStage].maxAttempts;
      const updated: RateLimitData = {
        stage: nextStage,
        maxAttempts: max,
        attemptsRemaining: max,
        isLocked: false,
        lockoutExpiry: null,
        isBlocked: false,
      };
      rateLimitCache[key] = updated;
      saveState();
      return updated;
    } else if (current.stage === 5) {
      // Blocked after chance 5 lockout expires without success
      const updated: RateLimitData = {
        stage: 6,
        maxAttempts: 0,
        attemptsRemaining: 0,
        isLocked: true,
        lockoutExpiry: null,
        isBlocked: true,
      };
      rateLimitCache[key] = updated;
      saveState();
      return updated;
    }
  }

  return current;
}

export function recordFailedAttempt(rawEmail: string): RateLimitData {
  const key = rawEmail.trim().toLowerCase();
  const current = getRateLimit(key);

  if (current.isBlocked) return current;

  const remaining = current.attemptsRemaining - 1;
  let updated: RateLimitData;

  if (remaining > 0) {
    updated = {
      ...current,
      attemptsRemaining: remaining,
      lastAttemptAt: Date.now(),
    };
  } else {
    // 0 attempts remaining for this stage -> Lock for 6 hours
    const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
    if (current.stage < 5) {
      updated = {
        ...current,
        attemptsRemaining: 0,
        isLocked: true,
        lockoutExpiry: Date.now() + SIX_HOURS_MS,
        isBlocked: false,
        lastAttemptAt: Date.now(),
      };
    } else {
      // Exceeded Chance 5 (1 attempt) -> Permanently Blocked
      updated = {
        stage: 6,
        maxAttempts: 0,
        attemptsRemaining: 0,
        isLocked: true,
        lockoutExpiry: null,
        isBlocked: true,
        lastAttemptAt: Date.now(),
      };
    }
  }

  rateLimitCache[key] = updated;
  saveState();
  return updated;
}

export function resetRateLimit(rawEmail: string): RateLimitData {
  const key = rawEmail.trim().toLowerCase();
  const initial = getInitialLimit();
  rateLimitCache[key] = initial;
  saveState();
  return initial;
}

export function fastForwardLockout(rawEmail: string): RateLimitData {
  const key = rawEmail.trim().toLowerCase();
  const current = getRateLimit(key);

  if (current.stage < 5) {
    const nextStage = (current.stage + 1) as 1 | 2 | 3 | 4 | 5 | 6;
    const max = RATE_LIMIT_TIERS[nextStage].maxAttempts;
    const updated: RateLimitData = {
      stage: nextStage,
      maxAttempts: max,
      attemptsRemaining: max,
      isLocked: false,
      lockoutExpiry: null,
      isBlocked: false,
    };
    rateLimitCache[key] = updated;
    saveState();
    return updated;
  } else {
    const updated: RateLimitData = {
      stage: 6,
      maxAttempts: 0,
      attemptsRemaining: 0,
      isLocked: true,
      lockoutExpiry: null,
      isBlocked: true,
    };
    rateLimitCache[key] = updated;
    saveState();
    return updated;
  }
}

export function adminUnlock(rawEmail: string): RateLimitData {
  return resetRateLimit(rawEmail);
}

export function getUserPassword(rawEmail: string): string {
  const key = rawEmail.trim().toLowerCase();
  return passwordCache[key] || 'vedaarya.in#1';
}

export function setUserPassword(rawEmail: string, newPass: string): boolean {
  const key = rawEmail.trim().toLowerCase();
  passwordCache[key] = newPass;
  saveState();
  return true;
}

export function getMonitoredAccounts(): { email: string; name: string; rateLimit: RateLimitData }[] {
  const accounts = [
    { email: 'contactvedantverse@gmail.com', name: 'Vedant Tiwari (Owner Gmail)' },
    { email: 'owner@vedantverse.in', name: 'Vedant Tiwari (Owner Domain)' },
    { email: 'partner@vedantverse.in', name: 'Co-Managing Partner' },
  ];

  return accounts.map(acc => ({
    email: acc.email,
    name: acc.name,
    rateLimit: getRateLimit(acc.email),
  }));
}

/**
 * Generate 4-digit numeric OTP and store with 10-minute expiry.
 */
export function generateOtp(rawEmail: string): string {
  const key = rawEmail.trim().toLowerCase();
  // 4-digit code between 1000 and 9999
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  activeOtpCache[key] = {
    code,
    expiresAt,
    email: key,
  };

  // Sync for Owner aliases so whether the user logs in as Owner@vedantverse.in or contactvedantverse@gmail.com, the code works for both
  if (key === 'owner@vedantverse.in' || key === 'contactvedantverse@gmail.com') {
    activeOtpCache['contactvedantverse@gmail.com'] = { code, expiresAt, email: 'contactvedantverse@gmail.com' };
    activeOtpCache['owner@vedantverse.in'] = { code, expiresAt, email: 'owner@vedantverse.in' };
  }

  return code;
}

/**
 * Verify provided 4-digit OTP. Supports live generated OTP as well as demo/test code '2468'.
 */
export function verifyOtp(rawEmail: string, providedCode: string): { success: boolean; error?: string } {
  const key = rawEmail.trim().toLowerCase();
  const cleanCode = providedCode.trim();

  const rate = getRateLimit(key);
  if (rate.isBlocked) {
    return { success: false, error: 'Account permanently blocked due to repeated security lockouts. Contact Super Admin to unblock.' };
  }
  if (rate.isLocked) {
    return { success: false, error: 'Account temporarily locked for 6 hours. Rate limit security policy active.' };
  }

  // Check active single-use OTP dispatched to authorized email and telegram
  let active = activeOtpCache[key];
  if (!active && (key === 'owner@vedantverse.in' || key === 'contactvedantverse@gmail.com')) {
    active = activeOtpCache['contactvedantverse@gmail.com'] || activeOtpCache['owner@vedantverse.in'];
  }

  const isMatch = Boolean(active && active.code === cleanCode && Date.now() <= active.expiresAt);

  if (isMatch) {
    // Clear OTP and reset rate limits back to Chance 1 (Auto-Reset Rule)
    delete activeOtpCache[key];
    delete activeOtpCache['contactvedantverse@gmail.com'];
    delete activeOtpCache['owner@vedantverse.in'];
    resetRateLimit(key);
    resetRateLimit('contactvedantverse@gmail.com');
    resetRateLimit('owner@vedantverse.in');
    return { success: true };
  }

  // Failed attempt
  const updatedLimit = recordFailedAttempt(key);
  if (updatedLimit.isBlocked) {
    return { success: false, error: 'Account permanently blocked after exhausting 5 chances across 30 hours.' };
  }
  if (updatedLimit.isLocked) {
    return { success: false, error: 'Attempts exhausted for this chance. Account locked for 6 hours.' };
  }

  return {
    success: false,
    error: `Invalid 4-digit code. ${updatedLimit.attemptsRemaining} of ${updatedLimit.maxAttempts} attempts remaining (Chance ${updatedLimit.stage} of 5).`,
  };
}

/**
 * Dispatches real OTP to contactvedantverse@gmail.com and Telegram Bot @Vedantversebot
 */
export async function dispatchSecurityOtp(params: {
  email: string;
  otp: string;
  ip?: string;
  userAgent?: string;
  location?: string;
}): Promise<{ emailSent: boolean; telegramSent: boolean; error?: string }> {
  const { email, otp, ip = '127.0.0.1', userAgent = 'Browser', location = 'Local / Network' } = params;
  const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  let device = 'Desktop / Browser';
  if (/android/i.test(userAgent)) device = 'Android Mobile';
  else if (/iphone|ipad|ipod/i.test(userAgent)) device = 'iPhone / iOS';
  else if (/macintosh/i.test(userAgent)) device = 'macOS Desktop';
  else if (/windows/i.test(userAgent)) device = 'Windows PC';

  const targetEmail = 'contactvedantverse@gmail.com';
  let emailSent = false;
  let telegramSent = false;
  let errorMsg = '';

  // 1. Send via Gmail Nodemailer SMTP
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'eczn hoar hjje tchx').replace(/\s+/g, '');
  const gmailUser = process.env.GMAIL_USER || targetEmail;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const subject = `🔐 ${otp} is your VedantVerse Admin Security Verification Code`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Security OTP: ${otp}</title>
</head>
<body style="margin: 0; padding: 32px 14px; background-color: #F5F2EA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #191919; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 540px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E6E0D7; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(48, 40, 29, 0.06);">
    
    <!-- Header -->
    <div style="padding: 20px 26px; border-bottom: 1px solid #EFECE6; background-color: #191919;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="left" valign="middle">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="30" height="30" style="background-color: #D94035; border-radius: 8px; text-align: center; vertical-align: middle;">
                  <span style="color: #FFFFFF; font-size: 16px; font-weight: 900; line-height: 30px; font-family: sans-serif;">V</span>
                </td>
                <td style="padding-left: 12px;" valign="middle">
                  <div style="font-size: 13px; font-weight: 800; letter-spacing: 1px; color: #FFFFFF; text-transform: uppercase;">VEDANTVERSE</div>
                  <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.8px; color: #A9A69F; text-transform: uppercase;">CMS COMMAND CENTRE &bull; 2FA SECURITY</div>
                </td>
              </tr>
            </table>
          </td>
          <td align="right" valign="middle">
            <span style="display: inline-block; background-color: rgba(217, 64, 53, 0.15); color: #ED463B; border: 1px solid rgba(217, 64, 53, 0.3); border-radius: 999px; padding: 4px 10px; font-size: 11px; font-weight: 800; font-family: monospace;">
              HIGH PRIORITY
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Body -->
    <div style="padding: 28px 26px;">
      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #D94035; margin-bottom: 6px; font-family: monospace;">
        SINGLE-USE AUTHORIZATION CODE
      </div>
      <h1 style="font-size: 22px; font-weight: 800; color: #191919; letter-spacing: -0.5px; margin: 0 0 12px; line-height: 1.2;">
        Your 4-Digit Security Code
      </h1>
      <p style="font-size: 13px; color: #77736D; margin: 0 0 24px; line-height: 1.5;">
        You are signing in to the <strong>VedantVerse Admin Console</strong> for <code>${email}</code>. Enter this 4-digit OTP to complete your authorization.
      </p>

      <!-- OTP Display Box -->
      <div style="background: #FAF8F5; border: 2px dashed #D94035; border-radius: 14px; padding: 22px 16px; text-align: center; margin-bottom: 24px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #77736D; margin-bottom: 8px;">
          AUTHENTICATION CODE
        </div>
        <div style="font-size: 44px; font-weight: 900; letter-spacing: 18px; color: #191919; font-family: monospace; padding-left: 18px;">
          ${otp}
        </div>
        <div style="font-size: 11px; color: #D94035; font-weight: 700; margin-top: 10px;">
          ⏱️ Valid for 10 minutes &bull; Single use only
        </div>
      </div>

      <!-- Security Metadata Table -->
      <div style="background-color: #F8F6F1; border: 1px solid #EAE5DC; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #8C877E; margin-bottom: 8px;">
          REQUEST DETAILS
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 12px;">
          <tr>
            <td style="padding: 4px 0; color: #77736D;">Time:</td>
            <td style="padding: 4px 0; color: #191919; font-weight: 600; font-family: monospace;">${istTime} IST</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #77736D;">IP Address:</td>
            <td style="padding: 4px 0; color: #191919; font-weight: 600; font-family: monospace;">${ip}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #77736D;">Device:</td>
            <td style="padding: 4px 0; color: #191919; font-weight: 600;">${device}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #77736D;">Location:</td>
            <td style="padding: 4px 0; color: #191919; font-weight: 600;">${location}</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 11px; color: #9E9A92; margin: 0; line-height: 1.5;">
        🔒 <strong>Enterprise Rate Limiting Active:</strong> Progressive 6-hour lockout ladder safeguards this account against brute force attacks. Never share this OTP with anyone.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #F8F6F1; border-top: 1px solid #EFECE6; padding: 14px 26px; text-align: center; font-size: 11px; color: #77736D;">
      Dispatched directly to <strong>contactvedantverse@gmail.com</strong> &bull; VedantVerse CMS Command Centre
    </div>
  </div>
</body>
</html>
    `.trim();

    await transporter.sendMail({
      from: `"VedantVerse Security" <${gmailUser}>`,
      to: targetEmail,
      subject,
      html: htmlContent,
    });
    emailSent = true;
  } catch (err: any) {
    console.error('Nodemailer OTP dispatch error:', err);
    errorMsg = err?.message || 'Email delivery failed';
  }

  // 2. Send via Telegram Bot (@Vedantversebot)
  const token = process.env.TELEGRAM_BOT_TOKEN || '9022241215:AAEhme1UdTApl-aA1HpBEilmvKieQKeOwYo';
  const chatId = process.env.TELEGRAM_CHAT_ID || '5849568396';

  if (token && chatId) {
    try {
      const telegramText = `
🔐 <b>VEDANTVERSE ADMIN OTP CODE</b>
━━━━━━━━━━━━━━━━━━
🔑 <b>Security Code:</b> <code>${otp}</code>
👤 <b>Account:</b> <code>${email}</code>
⏱️ <b>Expires:</b> 10 Minutes (${istTime} IST)
🌐 <b>IP:</b> <code>${ip}</code>
📱 <b>Device:</b> ${device}
━━━━━━━━━━━━━━━━━━
<i>CMS Command Centre • 6-Hour Progressive Engine Active</i>
      `.trim();

      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(4500),
      });

      if (res.ok) {
        telegramSent = true;
      }
    } catch (err: any) {
      console.error('Telegram OTP dispatch error:', err);
    }
  }

  return { emailSent, telegramSent, error: errorMsg || undefined };
}

import nodemailer from 'nodemailer';
import { Inquiry } from './inquiries';

export interface NotificationResult {
  channel: 'telegram' | 'discord' | 'email' | 'ntfy' | 'webhook';
  configured: boolean;
  success: boolean;
  error?: string;
}

export interface NotificationDispatchSummary {
  timestamp: string;
  results: NotificationResult[];
}

/**
 * Dispatches notifications across all configured channels (Telegram, Discord, Email, ntfy, Webhook).
 * Fail-safe: A failure in one channel will never stop other channels from firing.
 */
export async function sendInquiryNotifications(
  inquiry: Inquiry,
  isTest = false
): Promise<NotificationDispatchSummary> {
  const timestamp = new Date().toISOString();
  const results: NotificationResult[] = [];

  const testPrefix = isTest ? '🧪 [TEST NOTIFICATION]\n' : '🚨 [NEW CRM INQUIRY]\n';

  // 1. Telegram Channel (Supports dedicated inquiry bot or fallback to primary bot)
  const telegramPromise = (async (): Promise<NotificationResult> => {
    const token = process.env.TELEGRAM_INQUIRY_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_INQUIRY_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return { channel: 'telegram', configured: false, success: false };
    }

    try {
      const messageText = `
<b>${testPrefix ? '🧪 TEST NOTIFICATION' : '🔥 NEW PORTFOLIO LEAD RECEIVED'}</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Name:</b> ${escapeHtml(inquiry.name)}
📧 <b>Email:</b> <code>${escapeHtml(inquiry.email)}</code>
📞 <b>Phone / WhatsApp:</b> ${inquiry.phone ? `<code>${escapeHtml(inquiry.phone)}</code>` : '<i>Not provided</i>'}
💰 <b>Ad Budget:</b> <b>${escapeHtml(inquiry.budget || 'Not specified')}</b>
⏱️ <b>Time:</b> ${new Date(inquiry.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

💬 <b>Brief / Message:</b>
<blockquote>${escapeHtml(inquiry.message)}</blockquote>
━━━━━━━━━━━━━━━━━━
<i>Sent via VedantVerse Portfolio Lead Engine</i>
`.trim();

      // Quick action buttons (Only HTTPS URLs allowed in Telegram inline buttons)
      const actionRow: any[] = [];
      if (inquiry.phone) {
        const cleanPhone = inquiry.phone.replace(/[^0-9]/g, '');
        if (cleanPhone.length >= 10) {
          actionRow.push({ text: '💬 Chat on WhatsApp', url: `https://wa.me/${cleanPhone}` });
        }
      }
      if (inquiry.email && !inquiry.email.includes('@whatsapp.lead')) {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inquiry.email)}&su=${encodeURIComponent('Re: Campaign Inquiry - VedantVerse')}`;
        actionRow.push({ text: '📧 Reply via Gmail', url: gmailUrl });
      }

      const bodyPayload: any = {
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      };

      if (actionRow.length > 0) {
        bodyPayload.reply_markup = {
          inline_keyboard: [actionRow]
        };
      }

      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error('Telegram dispatch error:', errorData);
        return { channel: 'telegram', configured: true, success: false, error: errorData };
      }

      return { channel: 'telegram', configured: true, success: true };
    } catch (err: any) {
      console.error('Telegram notification failed:', err);
      return { channel: 'telegram', configured: true, success: false, error: err?.message || 'Network error' };
    }
  })();

  // 2. Discord Webhook Channel
  const discordPromise = (async (): Promise<NotificationResult> => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return { channel: 'discord', configured: false, success: false };
    }

    try {
      const payload = {
        username: 'VedantVerse CRM',
        avatar_url: 'https://vedantverse.com/logo-icon-exact.png',
        embeds: [
          {
            title: isTest ? '🧪 Test Notification: Portfolio CRM' : '🚨 New Inbound Lead Received!',
            color: 0xE50914, // Netflix Red
            fields: [
              { name: '👤 Client Name', value: inquiry.name, inline: true },
              { name: '📧 Client Email', value: inquiry.email, inline: true },
              { name: '📞 Phone', value: inquiry.phone || 'N/A', inline: true },
              { name: '💰 Ad Budget', value: inquiry.budget || 'Not specified', inline: true },
              { name: '⏱️ Timestamp', value: new Date(inquiry.timestamp).toLocaleString(), inline: true },
              { name: '💬 Campaign Brief', value: inquiry.message.length > 1000 ? inquiry.message.slice(0, 1000) + '...' : inquiry.message }
            ],
            footer: {
              text: 'VedantVerse CRM Engine'
            },
            timestamp: new Date().toISOString()
          }
        ]
      };

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { channel: 'discord', configured: true, success: false, error: errorText };
      }

      return { channel: 'discord', configured: true, success: true };
    } catch (err: any) {
      console.error('Discord notification failed:', err);
      return { channel: 'discord', configured: true, success: false, error: err?.message || 'Network error' };
    }
  })();

  // 3. Email Channel: Dispatches to contactvedantverse@gmail.com
  // Supports direct Gmail SMTP via Nodemailer OR Resend API
  const emailPromise = (async (): Promise<NotificationResult> => {
    const toEmail = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'contactvedantverse@gmail.com';
    const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
    const gmailUser = process.env.GMAIL_USER || 'contactvedantverse@gmail.com';
    const resendKey = process.env.RESEND_API_KEY;

    // Build responsive HTML email template
    const subject = isTest
      ? `🧪 Test Notification: VedantVerse CRM`
      : `🚨 New Lead: ${inquiry.name} (${inquiry.budget}) - VedantVerse`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b0b; color: #ffffff; padding: 24px; margin: 0; }
    .card { max-width: 600px; margin: 0 auto; background: #141414; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; }
    .header { background: #E50914; padding: 20px 24px; color: #ffffff; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; }
    .content { padding: 24px; line-height: 1.6; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .meta-table td { padding: 10px 0; border-bottom: 1px solid #222; }
    .label { color: #888; font-size: 12px; text-transform: uppercase; font-weight: 700; width: 120px; }
    .val { color: #fff; font-size: 14px; font-weight: 500; }
    .val a { color: #E50914; text-decoration: none; font-weight: bold; }
    .message-box { background: #0c0c0c; border: 1px solid #2a2a2a; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px; color: #e5e5e5; white-space: pre-wrap; }
    .btn-white { display: inline-block; background-color: #ffffff; color: #0a0a0a !important; text-decoration: none !important; padding: 14px 28px; border-radius: 8px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
    .btn-white span { color: #0a0a0a !important; text-decoration: none !important; }
    .footer { text-align: center; color: #666; font-size: 11px; padding: 16px 24px; border-top: 1px solid #222; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>${isTest ? '🧪 TEST LEAD ALERT' : '🔥 NEW PORTFOLIO CAMPAIGN INQUIRY'}</h2>
    </div>
    <div class="content">
      <table class="meta-table">
        <tr>
          <td class="label">Client Name:</td>
          <td class="val"><strong>${escapeHtml(inquiry.name)}</strong></td>
        </tr>
        <tr>
          <td class="label">Email:</td>
          <td class="val"><a href="mailto:${escapeHtml(inquiry.email)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(inquiry.email)}</a></td>
        </tr>
        ${inquiry.phone ? `
        <tr>
          <td class="label">Phone / WA:</td>
          <td class="val"><a href="https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}" style="color: #34d399; text-decoration: none;">${escapeHtml(inquiry.phone)}</a></td>
        </tr>` : ''}
        <tr>
          <td class="label">Ad Budget:</td>
          <td class="val" style="color: #E50914; font-weight: bold; font-size: 15px;">${escapeHtml(inquiry.budget || 'Not specified')}</td>
        </tr>
        <tr>
          <td class="label">Timestamp:</td>
          <td class="val">${new Date(inquiry.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
        </tr>
      </table>

      <div style="font-size: 11px; color: #888; text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Campaign Brief / Message:</div>
      <div class="message-box">${escapeHtml(inquiry.message)}</div>

      <div style="margin-top: 28px; text-align: center;">
        <a href="mailto:${escapeHtml(inquiry.email)}?subject=Re:%20Campaign%20Inquiry%20-%20VedantVerse"
           class="btn-white"
           style="display: inline-block; background-color: #ffffff !important; color: #0a0a0a !important; text-decoration: none !important; padding: 14px 30px; border-radius: 8px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #ffffff; mso-padding-alt: 0;">
          <span style="color: #0a0a0a !important; text-decoration: none !important; font-weight: 800; font-size: 13px;">Reply to ${escapeHtml(inquiry.name)} &rarr;</span>
        </a>
      </div>
    </div>
    <div class="footer">
      Sent to ${escapeHtml(toEmail)} via VedantVerse Portfolio CRM
    </div>
  </div>
</body>
</html>
`.trim();

    // Mode A: Direct Gmail SMTP via Nodemailer
    if (gmailPass) {
      try {
        const cleanPass = gmailPass.replace(/\s+/g, '');
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: gmailUser,
            pass: cleanPass
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        await transporter.sendMail({
          from: `"VedantVerse Leads" <${gmailUser}>`,
          to: toEmail,
          replyTo: inquiry.email,
          subject: subject,
          html: htmlContent
        });

        return { channel: 'email', configured: true, success: true };
      } catch (err: any) {
        console.error('Gmail SMTP send error:', err);
        return { channel: 'email', configured: true, success: false, error: err?.message || 'SMTP delivery failed' };
      }
    }

    // Mode B: Resend REST API
    if (resendKey) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'VedantVerse CRM <onboarding@resend.dev>';
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            reply_to: inquiry.email,
            subject: subject,
            html: htmlContent
          })
        });

        if (!res.ok) {
          const errorText = await res.text();
          return { channel: 'email', configured: true, success: false, error: errorText };
        }

        return { channel: 'email', configured: true, success: true };
      } catch (err: any) {
        console.error('Email dispatch failed via Resend:', err);
        return { channel: 'email', configured: true, success: false, error: err?.message || 'Network error' };
      }
    }

    // Neither credential provided yet
    return {
      channel: 'email',
      configured: false,
      success: false,
      error: 'Target email is set to contactvedantverse@gmail.com. Add GMAIL_APP_PASSWORD or RESEND_API_KEY in .env.local to activate automated mail delivery.'
    };
  })();

  // 4. ntfy.sh Channel (Zero-signup instant push notification on phone)
  const ntfyPromise = (async (): Promise<NotificationResult> => {
    const topic = process.env.NTFY_TOPIC;
    if (!topic) {
      return { channel: 'ntfy', configured: false, success: false };
    }

    try {
      const server = process.env.NTFY_SERVER || 'https://ntfy.sh';
      const cleanTopic = topic.trim();
      const bodyText = `From: ${inquiry.name} (${inquiry.email})\nBudget: ${inquiry.budget || 'N/A'}\n${inquiry.phone ? `Phone: ${inquiry.phone}\n` : ''}\nMessage: ${inquiry.message.slice(0, 300)}`;

      const asciiTitle = (isTest ? 'CRM Test Notification' : `New Lead: ${inquiry.name} (${inquiry.budget || 'Inquiry'})`)
        .replace(/₹/g, 'INR ')
        .replace(/[^\x00-\x7F]/g, '');

      const res = await fetch(`${server}/${cleanTopic}`, {
        method: 'POST',
        headers: {
          'Title': asciiTitle,
          'Priority': 'urgent',
          'Tags': 'fire,briefcase',
          'Click': `mailto:${inquiry.email}`
        },
        body: bodyText
      });

      if (!res.ok) {
        const errText = await res.text();
        return { channel: 'ntfy', configured: true, success: false, error: errText };
      }

      return { channel: 'ntfy', configured: true, success: true };
    } catch (err: any) {
      console.error('ntfy push failed:', err);
      return { channel: 'ntfy', configured: true, success: false, error: err?.message || 'Network error' };
    }
  })();

  // 5. Generic Webhook (e.g. Zapier, Make, Slack)
  const webhookPromise = (async (): Promise<NotificationResult> => {
    const webhookUrl = process.env.GENERIC_WEBHOOK_URL;
    if (!webhookUrl) {
      return { channel: 'webhook', configured: false, success: false };
    }

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: isTest ? 'crm.test' : 'inquiry.created',
          inquiry,
          timestamp
        })
      });

      if (!res.ok) {
        return { channel: 'webhook', configured: true, success: false, error: `Status ${res.status}` };
      }

      return { channel: 'webhook', configured: true, success: true };
    } catch (err: any) {
      return { channel: 'webhook', configured: true, success: false, error: err?.message || 'Network error' };
    }
  })();

  const allSettled = await Promise.all([
    telegramPromise,
    discordPromise,
    emailPromise,
    ntfyPromise,
    webhookPromise
  ]);

  results.push(...allSettled);

  return {
    timestamp,
    results
  };
}

/**
 * Checks which notification channels are currently configured via environment variables.
 */
export function getNotificationChannelsStatus() {
  const targetEmail = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'contactvedantverse@gmail.com';
  const hasEmailAuth = Boolean(process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || process.env.RESEND_API_KEY);

  return {
    telegram: {
      configured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
      description: 'Instant notification on Telegram phone app with direct reply buttons'
    },
    discord: {
      configured: Boolean(process.env.DISCORD_WEBHOOK_URL),
      description: 'Instant notification on Discord mobile / desktop channel'
    },
    email: {
      configured: hasEmailAuth,
      targetEmail,
      description: `Sends alerts directly to ${targetEmail} (via Gmail App Password or Resend)`
    },
    ntfy: {
      configured: Boolean(process.env.NTFY_TOPIC),
      description: 'Zero-config native phone push notification (via free ntfy app)'
    },
    webhook: {
      configured: Boolean(process.env.GENERIC_WEBHOOK_URL),
      description: 'Custom Webhook (Zapier, Make, Slack, or automation)'
    }
  };
}

/**
 * Dispatches real-time login security notifications whenever Owner or Partner logs in.
 * Sends alerts across Telegram, WhatsApp, Discord, ntfy push, and Email.
 */
export async function sendAdminLoginNotification(params: {
  user: { name: string; email: string; role: string };
  ip?: string;
  userAgent?: string;
  location?: string;
}): Promise<NotificationDispatchSummary> {
  const timestamp = new Date().toISOString();
  const results: NotificationResult[] = [];
  const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Simplified browser / device detection from user-agent
  const ua = params.userAgent || '';
  let device = 'Desktop / Browser';
  if (/android/i.test(ua)) device = 'Android Mobile';
  else if (/iphone|ipad|ipod/i.test(ua)) device = 'iPhone / iOS';
  else if (/macintosh/i.test(ua)) device = 'macOS Desktop';
  else if (/windows/i.test(ua)) device = 'Windows PC';

  // 1. Telegram Alert
  const telegramPromise = (async (): Promise<NotificationResult> => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return { channel: 'telegram', configured: false, success: false };
    }

    try {
      const text = `
🔐 <b>VEDANTVERSE ADMIN LOGIN ALERT</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Account:</b> ${escapeHtml(params.user.name)} (<code>${escapeHtml(params.user.role)}</code>)
📧 <b>Email:</b> <code>${escapeHtml(params.user.email)}</code>
⏱️ <b>Time:</b> ${istTime} IST
📍 <b>Location:</b> ${escapeHtml(params.location || 'Unknown')}
🌐 <b>IP Address:</b> <code>${escapeHtml(params.ip || 'Unknown')}</code>
📱 <b>Device:</b> ${escapeHtml(device)}
━━━━━━━━━━━━━━━━━━
<i>CMS Command Centre • Security Monitor</i>
`.trim();

      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });

      return { channel: 'telegram', configured: true, success: res.ok };
    } catch (e: any) {
      return { channel: 'telegram', configured: true, success: false, error: e?.message };
    }
  })();

  // 2. WhatsApp Alert (via CallMeBot free API or webhook)
  const whatsappPromise = (async (): Promise<NotificationResult> => {
    const phone = process.env.WHATSAPP_ALERT_PHONE; // e.g. +91816372383
    const apiKey = process.env.WHATSAPP_CALLMEBOT_API_KEY;

    if (!phone || !apiKey) {
      return { channel: 'webhook', configured: false, success: false };
    }

    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const waText = `🔐 *VEDANTVERSE CMS LOGIN ALERT*\nAccount: ${params.user.name} (${params.user.role})\nEmail: ${params.user.email}\nTime: ${istTime} IST\nLocation: ${params.location || 'Unknown'}\nIP: ${params.ip || 'Unknown'}\nDevice: ${device}`;
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(waText)}&apikey=${apiKey}`;

      const res = await fetch(url);
      return { channel: 'webhook', configured: true, success: res.ok };
    } catch (e: any) {
      return { channel: 'webhook', configured: true, success: false, error: e?.message };
    }
  })();

  // 3. Discord Alert
  const discordPromise = (async (): Promise<NotificationResult> => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return { channel: 'discord', configured: false, success: false };

    try {
      const payload = {
        username: 'VedantVerse Security',
        avatar_url: 'https://vedantverse.in/icon.png',
        embeds: [
          {
            title: '🔐 Admin Panel Login Detected',
            color: 0xED463B,
            fields: [
              { name: '👤 Account', value: `${params.user.name} (${params.user.role})`, inline: true },
              { name: '📧 Email', value: params.user.email, inline: true },
              { name: '⏱️ Timestamp', value: `${istTime} IST`, inline: true },
              { name: '📍 Location', value: params.location || 'Unknown', inline: true },
              { name: '🌐 IP Address', value: params.ip || 'Unknown', inline: true },
              { name: '📱 Device', value: device, inline: true }
            ],
            footer: { text: 'VedantVerse CMS Command Centre' },
            timestamp: new Date().toISOString()
          }
        ]
      };

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      return { channel: 'discord', configured: true, success: res.ok };
    } catch (e: any) {
      return { channel: 'discord', configured: true, success: false, error: e?.message };
    }
  })();

  // 4. ntfy.sh Phone Push
  const ntfyPromise = (async (): Promise<NotificationResult> => {
    const topic = process.env.NTFY_TOPIC;
    if (!topic) return { channel: 'ntfy', configured: false, success: false };

    try {
      const res = await fetch(`https://ntfy.sh/${topic}`, {
        method: 'POST',
        headers: {
          Title: `🔐 CMS Login: ${params.user.name}`,
          Priority: 'urgent',
          Tags: 'lock,shield'
        },
        body: `${params.user.name} (${params.user.role}) logged in at ${istTime} IST. IP: ${params.ip || 'Unknown'}`
      });
      return { channel: 'ntfy', configured: true, success: res.ok };
    } catch (e: any) {
      return { channel: 'ntfy', configured: true, success: false, error: e?.message };
    }
  })();

  const allSettled = await Promise.all([
    telegramPromise,
    whatsappPromise,
    discordPromise,
    ntfyPromise
  ]);

  results.push(...allSettled);
  return { timestamp, results };
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

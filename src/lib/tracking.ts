'use client';

/**
 * ============================================================================
 * VEDANTVERSE UNIFIED TRACKING ARCHITECTURE
 * Meta Pixel + Meta Conversions API (CAPI) + GA4 + Internal Telemetry
 * ============================================================================
 */

export interface AttributionData {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  fbclid: string;
  fbp: string;
  fbc: string;
  landingUrl: string;
  referrer: string;
  firstTouch?: Record<string, string>;
  latestTouch?: Record<string, string>;
}

export interface ButtonTrackingOptions {
  buttonName: string;
  label: string;
  sectionName: string;
  destination?: string;
  metadata?: Record<string, any>;
}

/**
 * Generates a unique, high-entropy event ID for Meta deduplication.
 * Shared between client-side Pixel and server-side CAPI.
 */
export function generateEventId(prefix: string = 'vv'): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${ts}_${rand}`;
}

/**
 * Reads a specific cookie value from document.cookie
 */
export function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : '';
}

/**
 * Sets a first-party cookie with secure defaults
 */
export function setCookie(name: string, value: string, days: number = 90): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const domain = window.location.hostname.includes('vedantverse.in') ? '; domain=.vedantverse.in' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${domain}; SameSite=Lax`;
}

/**
 * Captures campaign attribution, UTM parameters, fbclid, fbc, and fbp cookies.
 * Preserves first-touch and latest-touch separately.
 */
export function getAttributionData(): AttributionData {
  if (typeof window === 'undefined') {
    return {
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmContent: '',
      utmTerm: '',
      fbclid: '',
      fbp: '',
      fbc: '',
      landingUrl: '',
      referrer: '',
    };
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source') || '';
  const utmMedium = params.get('utm_medium') || '';
  const utmCampaign = params.get('utm_campaign') || '';
  const utmContent = params.get('utm_content') || '';
  const utmTerm = params.get('utm_term') || '';
  const fbclid = params.get('fbclid') || '';

  // Extract or synthesize fbp (Facebook browser cookie)
  let fbp = getCookie('_fbp');

  // Extract or synthesize fbc (Facebook click cookie)
  let fbc = getCookie('_fbc');
  if (!fbc && fbclid) {
    // Standard Meta fbc format: fb.1.{creationTime}.{fbclid}
    fbc = `fb.1.${Date.now()}.${fbclid}`;
    setCookie('_fbc', fbc, 90);
  }

  const currentTouch: Record<string, string> = {
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    fbclid,
    landingUrl: window.location.href,
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    timestamp: new Date().toISOString(),
  };

  // Manage First-Touch attribution
  let firstTouch: Record<string, string> | undefined;
  try {
    const existingFirst = localStorage.getItem('vv_attr_first_touch');
    if (existingFirst) {
      firstTouch = JSON.parse(existingFirst);
    } else if (utmSource || utmCampaign || fbclid) {
      localStorage.setItem('vv_attr_first_touch', JSON.stringify(currentTouch));
      firstTouch = currentTouch;
    }
  } catch (e) {
    // Ignore storage restrictions
  }

  // Manage Latest-Touch attribution
  let latestTouch: Record<string, string> | undefined;
  try {
    if (utmSource || utmCampaign || fbclid) {
      sessionStorage.setItem('vv_attr_latest_touch', JSON.stringify(currentTouch));
      latestTouch = currentTouch;
    } else {
      const existingLatest = sessionStorage.getItem('vv_attr_latest_touch');
      if (existingLatest) {
        latestTouch = JSON.parse(existingLatest);
      }
    }
  } catch (e) {
    // Ignore storage restrictions
  }

  return {
    utmSource: utmSource || latestTouch?.utmSource || firstTouch?.utmSource || '',
    utmMedium: utmMedium || latestTouch?.utmMedium || firstTouch?.utmMedium || '',
    utmCampaign: utmCampaign || latestTouch?.utmCampaign || firstTouch?.utmCampaign || '',
    utmContent: utmContent || latestTouch?.utmContent || firstTouch?.utmContent || '',
    utmTerm: utmTerm || latestTouch?.utmTerm || firstTouch?.utmTerm || '',
    fbclid: fbclid || latestTouch?.fbclid || firstTouch?.fbclid || '',
    fbp,
    fbc,
    landingUrl: window.location.href,
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    firstTouch,
    latestTouch,
  };
}

/**
 * Dispatches a standard Meta Pixel event with eventID deduplication support
 */
export function trackPixelEvent(
  eventName: string,
  params: Record<string, any> = {},
  eventId?: string
): void {
  if (typeof window === 'undefined') return;

  const resolvedEventId = eventId || generateEventId(eventName.toLowerCase());

  // 1. Meta Pixel
  if ((window as any).fbq) {
    try {
      (window as any).fbq('track', eventName, params, { eventID: resolvedEventId });
    } catch (err) {
      console.warn('Meta Pixel dispatch warning:', err);
    }
  }

  // 2. Google Analytics 4
  if ((window as any).gtag) {
    try {
      (window as any).gtag('event', eventName, {
        ...params,
        event_id: resolvedEventId,
      });
    } catch (err) {
      console.warn('GA4 dispatch warning:', err);
    }
  }
}

/**
 * Dispatches a custom Meta Pixel event with eventID deduplication support
 */
export function trackPixelCustom(
  eventName: string,
  params: Record<string, any> = {},
  eventId?: string
): void {
  if (typeof window === 'undefined') return;

  const resolvedEventId = eventId || generateEventId(eventName.toLowerCase());

  // 1. Meta Pixel
  if ((window as any).fbq) {
    try {
      (window as any).fbq('trackCustom', eventName, params, { eventID: resolvedEventId });
    } catch (err) {
      console.warn('Meta Pixel custom dispatch warning:', err);
    }
  }

  // 2. GA4 & DataLayer
  if ((window as any).dataLayer) {
    try {
      (window as any).dataLayer.push({
        event: eventName,
        event_id: resolvedEventId,
        ...params,
      });
    } catch (err) {
      // ignore
    }
  }
}

/**
 * Phase 4: Track button interactions across the site
 */
export function trackButtonClick(opts: ButtonTrackingOptions): void {
  if (typeof window === 'undefined') return;

  const params = {
    button_name: opts.buttonName,
    label: opts.label,
    section_name: opts.sectionName,
    destination: opts.destination || '',
    page_path: window.location.pathname,
    page_url: window.location.href,
    ...opts.metadata,
  };

  trackPixelCustom('VV_ButtonClick', params);
}

/**
 * Phase 4: Track navigation link clicks
 */
export function trackNavigationClick(navItem: string, destination: string): void {
  if (typeof window === 'undefined') return;

  const params = {
    nav_item: navItem,
    destination,
    page_path: window.location.pathname,
    page_url: window.location.href,
  };

  trackPixelCustom('VV_NavigationClick', params);
}

/**
 * Phase 4: Track contact interactions (WhatsApp, Email, Phone, Telegram, LinkedIn)
 */
export function trackContactClick(
  channel: 'email' | 'whatsapp' | 'phone' | 'telegram' | 'linkedin',
  value: string,
  sectionName: string = 'footer'
): void {
  if (typeof window === 'undefined') return;

  const params = {
    contact_channel: channel,
    contact_value: value,
    section_name: sectionName,
    page_path: window.location.pathname,
  };

  // Standard Meta Contact event
  trackPixelEvent('Contact', {
    content_name: channel,
    status: 'initiated',
  });

  // Custom Meta Contact event
  trackPixelCustom('VV_ContactClick', params);
}

/**
 * Phase 4: Track external outbound link clicks
 */
export function trackExternalLinkClick(destination: string, label: string): void {
  if (typeof window === 'undefined') return;

  trackPixelCustom('VV_ExternalLinkClick', {
    destination,
    label,
    page_path: window.location.pathname,
  });
}

/**
 * Phase 4 & 7: Track form open / first interaction
 */
export function trackFormStart(formName: string): void {
  if (typeof window === 'undefined') return;

  trackPixelCustom('VV_FormStart', {
    form_name: formName,
    page_path: window.location.pathname,
  });
}

/**
 * Phase 4 & 7: Track dropdown and qualification selections
 */
export function trackFormQualification(
  formName: string,
  dimension: string,
  value: string
): void {
  if (typeof window === 'undefined') return;

  trackPixelCustom('VV_FormQualification', {
    form_name: formName,
    dimension,
    value,
    page_path: window.location.pathname,
  });
}

/**
 * Phase 4 & 7: Track form submission attempt
 */
export function trackFormSubmitAttempt(formName: string): void {
  if (typeof window === 'undefined') return;

  trackPixelCustom('VV_FormSubmitAttempt', {
    form_name: formName,
    page_path: window.location.pathname,
  });
}

/**
 * Phase 4 & 7: Track form validation errors
 */
export function trackFormError(formName: string, errorMessage: string): void {
  if (typeof window === 'undefined') return;

  trackPixelCustom('VV_FormError', {
    form_name: formName,
    error_message: errorMessage,
    page_path: window.location.pathname,
  });
}

/**
 * Phase 4: Track theme change (Dark <-> Light)
 */
export function trackThemeChange(newTheme: string): void {
  if (typeof window === 'undefined') return;

  trackPixelCustom('VV_ThemeChange', {
    new_theme: newTheme,
    page_path: window.location.pathname,
  });
}

/**
 * Phase 4: Track thank-you page view without duplicate Lead event
 */
export function trackThankYouView(leadId?: string): void {
  if (typeof window === 'undefined') return;

  trackPixelCustom('VV_ThankYouView', {
    lead_id: leadId || '',
    page_path: window.location.pathname,
  });
}


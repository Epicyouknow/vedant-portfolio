'use client';

import { useCallback } from 'react';

export interface AnalyticsEvent {
  eventName: string;
  metadata?: Record<string, any>;
}

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, metadata?: Record<string, any>) => {
    // 1. Send to Google Analytics 4 (GA4) if loaded
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, metadata);
    }

    // 2. Send to our Custom Admin Analytics API
    if (typeof window !== 'undefined') {
      const payload = {
        eventName,
        metadata,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        referrer: document.referrer || 'direct',
        path: window.location.pathname,
      };

      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.warn('Custom analytics dispatch failed:', err);
      });
    }
  }, []);

  const trackPageView = useCallback((path: string) => {
    // 1. Send to GA4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-50KTBS74YJ';
      if (gaId) {
        (window as any).gtag('config', gaId, { page_path: path });
      }
    }

    // 2. Send to custom endpoint
    trackEvent('page_view', { path });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
  };
}

'use client';

import { useCallback } from 'react';
import { 
  trackPixelEvent, 
  trackPixelCustom, 
  trackButtonClick, 
  trackNavigationClick, 
  trackContactClick,
  trackFormStart,
  trackFormQualification,
  trackFormSubmitAttempt,
  trackFormError,
  generateEventId,
  getAttributionData
} from '@/lib/tracking';

export interface AnalyticsEvent {
  eventName: string;
  metadata?: Record<string, any>;
}

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, metadata?: Record<string, any>) => {
    // 1. Send to Meta Pixel & GA4 through unified engine
    trackPixelCustom(eventName, metadata);

    // 2. Send to Custom Admin Analytics API
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
    // 1. Meta Pixel Standard PageView
    trackPixelEvent('PageView', { page_path: path });

    // 2. GA4 Page View
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-50KTBS74YJ';
      if (gaId) {
        (window as any).gtag('config', gaId, { page_path: path });
      }
    }

    // 3. Custom telemetry endpoint
    trackEvent('page_view', { path });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackButtonClick,
    trackNavigationClick,
    trackContactClick,
    trackFormStart,
    trackFormQualification,
    trackFormSubmitAttempt,
    trackFormError,
    generateEventId,
    getAttributionData,
  };
}

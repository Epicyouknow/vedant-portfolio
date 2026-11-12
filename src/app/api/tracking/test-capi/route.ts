import { NextRequest, NextResponse } from 'next/server';
import { sendMetaCapiEvent } from '@/lib/metaCapi';

/**
 * Diagnostic endpoint for verifying Meta Conversions API (CAPI) connectivity
 * and sending a Test Event to Meta Events Manager.
 * Protected by ADMIN_PIN.
 */
export async function GET(req: NextRequest) {
  try {
    const pin = req.nextUrl.searchParams.get('pin') || req.headers.get('x-admin-pin');
    const expectedPin = process.env.ADMIN_PIN || '8520';

    if (pin !== expectedPin) {
      return NextResponse.json({ error: 'Unauthorized. Provide valid pin parameter.' }, { status: 401 });
    }

    const pixelId = process.env.META_PIXEL_ID;
    const hasToken = Boolean(process.env.META_CAPI_ACCESS_TOKEN);
    const apiVersion = process.env.META_GRAPH_API_VERSION || 'v21.0';
    const testCode = process.env.META_CAPI_TEST_EVENT_CODE;

    const testEventId = `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || '127.0.0.1';
    const clientUserAgent = req.headers.get('user-agent') || 'VedantVerse-Diagnostic-Agent/1.0';

    // Dispatch diagnostic test event to Meta CAPI
    const capiResult = await sendMetaCapiEvent({
      event_name: 'Lead',
      event_id: testEventId,
      event_source_url: 'https://vedantverse.in/performance-marketing?test=1',
      user_data: {
        email: 'test@vedantverse.in',
        phone: '919876543210',
        firstName: 'Test',
        lastName: 'Lead',
        clientIpAddress: clientIp,
        clientUserAgent: clientUserAgent,
      },
      custom_data: {
        content_name: 'Performance Marketing Test Lead',
        content_category: 'Diagnostic Verification',
        value: 50000,
        currency: 'INR',
        status: 'test_event',
      },
    });

    return NextResponse.json({
      status: 'diagnostic_complete',
      environment: {
        metaPixelConfigured: Boolean(pixelId),
        pixelIdLast4: pixelId ? `...${pixelId.slice(-4)}` : 'missing',
        capiTokenConfigured: hasToken,
        graphApiVersion: apiVersion,
        testEventCodeConfigured: Boolean(testCode),
      },
      testEvent: {
        eventId: testEventId,
        eventName: 'Lead',
        testCodeSent: testCode || null,
      },
      metaApiResponse: capiResult,
    });
  } catch (err: any) {
    return NextResponse.json({
      error: 'CAPI test execution failed',
      details: err.message,
    }, { status: 500 });
  }
}


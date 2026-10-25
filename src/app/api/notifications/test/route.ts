import { NextRequest, NextResponse } from 'next/server';
import { getNotificationChannelsStatus, sendInquiryNotifications } from '../../../../lib/notifications';
import { Inquiry } from '../../../../lib/inquiries';

export async function GET(req: NextRequest) {
  try {
    const pin = req.nextUrl.searchParams.get('pin') || req.headers.get('x-admin-pin');
    const expectedPin = process.env.ADMIN_PIN || '8520';

    if (pin !== expectedPin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const channels = getNotificationChannelsStatus();
    return NextResponse.json({ success: true, channels });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pin = body.pin || req.headers.get('x-admin-pin');
    const expectedPin = process.env.ADMIN_PIN || '8520';

    if (pin !== expectedPin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sampleInquiry: Inquiry = {
      id: `test_${Date.now()}`,
      name: 'Elon Musk (Test Lead)',
      email: 'elon@x.com',
      phone: '+91 98765 43210',
      budget: '₹15L+',
      message: 'This is a test notification from your VedantVerse CRM system. If you see this on your phone or email, your notification pipeline is operating with 100% precision!',
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    const dispatchResult = await sendInquiryNotifications(sampleInquiry, true);

    return NextResponse.json({
      success: true,
      summary: dispatchResult
    });
  } catch (error) {
    console.error('Error in notification test:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

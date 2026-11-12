import { NextRequest, NextResponse } from 'next/server';
import { loadInquiries, saveInquiry, updateInquiry, deleteInquiry } from '../../../lib/inquiries';
import { sendInquiryNotifications, sendProspectAcknowledgement } from '../../../lib/notifications';
import { sendMetaCapiEvent } from '../../../lib/metaCapi';

function parseBudgetNumeric(budgetStr?: string): number {
  if (!budgetStr) return 50000;
  const lower = budgetStr.toLowerCase();
  if (lower.includes('15l+')) return 1500000;
  if (lower.includes('5l') || lower.includes('5 lakh')) return 500000;
  if (lower.includes('2–5') || lower.includes('2-5')) return 350000;
  if (lower.includes('1–2') || lower.includes('1-2')) return 150000;
  if (lower.includes('50,000–₹1') || lower.includes('50000')) return 75000;
  if (lower.includes('25,000')) return 35000;
  const digits = budgetStr.replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : 50000;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      budget,
      message,
      growthObjective,
      businessName,
      website,
      serviceHelp,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      fbclid,
      fbc,
      fbp,
      firstTouch,
      latestTouch,
      landingUrl,
      eventId,
    } = body;

    const contactInput = String(email || phone || '').trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInput);
    const digitsOnly = contactInput.replace(/\D/g, '');
    const isPhone = digitsOnly.length >= 10;

    if (!name || (!isEmail && !isPhone)) {
      return NextResponse.json({ error: 'Please provide a valid email address or WhatsApp phone number' }, { status: 400 });
    }

    const cleanEmail = isEmail 
      ? contactInput.toLowerCase() 
      : (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim()) ? String(email).trim().toLowerCase() : `${digitsOnly}@whatsapp.lead`);
    
    const cleanPhone = isPhone 
      ? contactInput 
      : (phone && !phone.includes('@') && phone.replace(/\D/g, '').length >= 10 ? String(phone).trim() : '');

    const incomingEventId = eventId ? String(eventId).trim() : '';

    // Server-Side Idempotency & Deduplication
    const existingInquiries = await loadInquiries();
    const existingMatch = existingInquiries.find(inq => {
      if (incomingEventId && inq.eventId === incomingEventId) return true;
      if (inq.email === cleanEmail && (Date.now() - new Date(inq.timestamp).getTime()) < 45000) return true;
      return false;
    });

    if (existingMatch) {
      return NextResponse.json({
        success: true,
        id: existingMatch.id,
        eventId: existingMatch.eventId || incomingEventId || `lead_${existingMatch.id}`,
        deduplicated: true,
        capiStatus: existingMatch.capiStatus || 'skipped',
        message: 'Inquiry already processed successfully',
      });
    }

    const stableEventId = incomingEventId || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const compiledMessage = [
      businessName ? `[Business: ${businessName}]` : '',
      serviceHelp ? `[Service: ${serviceHelp}]` : '',
      growthObjective ? `[Objective: ${growthObjective}]` : '',
      website ? `[Website: ${website}]` : '',
      message ? String(message).trim() : 'Performance Marketing Consultation Request',
    ].filter(Boolean).join(' \n');

    // 1. Save inquiry record
    const savedInquiry = await saveInquiry({
      name: String(name).trim(),
      email: cleanEmail,
      phone: cleanPhone,
      budget: budget || 'Not specified',
      message: compiledMessage,
      businessName: businessName ? String(businessName).trim() : '',
      website: website ? String(website).trim() : '',
      serviceHelp: serviceHelp ? String(serviceHelp).trim() : '',
      utmSource: utmSource ? String(utmSource).trim() : '',
      utmMedium: utmMedium ? String(utmMedium).trim() : '',
      utmCampaign: utmCampaign ? String(utmCampaign).trim() : '',
      utmContent: utmContent ? String(utmContent).trim() : '',
      utmTerm: utmTerm ? String(utmTerm).trim() : '',
      fbclid: fbclid ? String(fbclid).trim() : '',
      fbc: fbc ? String(fbc).trim() : '',
      fbp: fbp ? String(fbp).trim() : '',
      firstTouch: firstTouch || null,
      latestTouch: latestTouch || null,
      eventId: stableEventId,
      capiStatus: 'skipped',
    });

    // 2. Dispatch Meta CAPI Lead Event (Server-side)
    let capiStatus: 'delivered' | 'skipped' | 'failed' = 'skipped';
    let capiTraceId: string | undefined;

    try {
      const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || undefined;
      const clientUserAgent = req.headers.get('user-agent') || undefined;
      const resolvedFbp = fbp || req.cookies.get('_fbp')?.value;
      const resolvedFbc = fbc || req.cookies.get('_fbc')?.value || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

      const nameParts = String(name).trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

      const capiResult = await sendMetaCapiEvent({
        event_name: 'Lead',
        event_id: stableEventId,
        event_source_url: landingUrl || req.headers.get('referer') || 'https://vedantverse.in/performance-marketing',
        user_data: {
          email: cleanEmail,
          phone: cleanPhone,
          firstName,
          lastName,
          clientIpAddress: clientIp,
          clientUserAgent: clientUserAgent,
          fbp: resolvedFbp,
          fbc: resolvedFbc,
        },
        custom_data: {
          content_name: serviceHelp || 'Performance Marketing',
          content_category: 'Lead Generation',
          value: parseBudgetNumeric(budget),
          currency: 'INR',
          status: 'qualified_lead',
        },
      });

      if (capiResult.success) {
        capiStatus = 'delivered';
        capiTraceId = capiResult.fbtrace_id;
      } else if (capiResult.skipped) {
        capiStatus = 'skipped';
      } else {
        capiStatus = 'failed';
        capiTraceId = capiResult.fbtrace_id;
      }

      // Update inquiry record with CAPI result
      await updateInquiry(savedInquiry.id, {
        notes: `[CAPI: ${capiStatus}${capiTraceId ? ` | trace: ${capiTraceId}` : ''}]`,
      });
    } catch (capiErr) {
      console.warn('Meta CAPI execution warning:', capiErr);
      capiStatus = 'failed';
    }

    // 3. Await notification dispatch across channels (Telegram, Email, etc.)
    try {
      await Promise.allSettled([
        sendInquiryNotifications(savedInquiry),
        sendProspectAcknowledgement(savedInquiry),
      ]);
    } catch (notifErr) {
      console.error('Notification dispatch error:', notifErr);
    }

    return NextResponse.json({ 
      success: true, 
      id: savedInquiry.id,
      eventId: stableEventId,
      capiStatus,
      message: 'Inquiry received successfully' 
    });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const pin = req.nextUrl.searchParams.get('pin') || req.headers.get('x-admin-pin');
    const expectedPin = process.env.ADMIN_PIN || '8520';

    if (pin !== expectedPin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const inquiries = await loadInquiries();
    
    // Optional status filter
    const statusFilter = req.nextUrl.searchParams.get('status');
    let filtered = inquiries;
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter);
    }

    // Return newest inquiries first
    return NextResponse.json([...filtered].reverse());
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const pin = req.nextUrl.searchParams.get('pin') || req.headers.get('x-admin-pin');
    const expectedPin = process.env.ADMIN_PIN || '8520';

    if (pin !== expectedPin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, notes, starred } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing inquiry ID' }, { status: 400 });
    }

    const updated = await updateInquiry(id, {
      ...(status !== undefined && { status }),
      ...(notes !== undefined && { notes }),
      ...(starred !== undefined && { starred })
    });

    if (!updated) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const pin = req.nextUrl.searchParams.get('pin') || req.headers.get('x-admin-pin');
    const expectedPin = process.env.ADMIN_PIN || '8520';

    if (pin !== expectedPin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    const indexStr = req.nextUrl.searchParams.get('index');

    if (id) {
      const deleted = await deleteInquiry(id);
      return NextResponse.json({ success: deleted });
    }

    if (indexStr !== null) {
      const index = parseInt(indexStr, 10);
      if (isNaN(index)) {
        return NextResponse.json({ error: 'Invalid index format' }, { status: 400 });
      }

      // Since GET reverses the array, client index maps back to real index
      const inquiries = await loadInquiries();
      const realIndex = inquiries.length - 1 - index;

      if (realIndex < 0 || realIndex >= inquiries.length) {
        return NextResponse.json({ error: 'Index out of bounds' }, { status: 400 });
      }

      const deleted = await deleteInquiry(realIndex);
      return NextResponse.json({ success: deleted });
    }

    return NextResponse.json({ error: 'Missing id or index parameter' }, { status: 400 });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

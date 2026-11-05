import { NextRequest, NextResponse } from 'next/server';
import { loadInquiries, saveInquiry, updateInquiry, deleteInquiry } from '../../../lib/inquiries';
import { sendInquiryNotifications } from '../../../lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, budget, message, growthObjective, website } = body;

    const contactInput = String(email || phone || '').trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInput);
    const digitsOnly = contactInput.replace(/\D/g, '');
    const isPhone = digitsOnly.length >= 10;

    if (!name || (!isEmail && !isPhone)) {
      return NextResponse.json({ error: 'Please provide a valid email address or WhatsApp phone number' }, { status: 400 });
    }

    const compiledMessage = [
      message ? String(message).trim() : 'Lead Consultation Request',
      growthObjective ? `[Objective: ${growthObjective}]` : '',
      website ? `[Website: ${website}]` : '',
    ].filter(Boolean).join(' ');

    const savedInquiry = await saveInquiry({
      name: String(name).trim(),
      email: isEmail ? contactInput.toLowerCase() : (email ? String(email).trim().toLowerCase() : `${digitsOnly}@whatsapp.lead`),
      phone: isPhone ? contactInput : (phone ? String(phone).trim() : ''),
      budget: budget || 'Not specified',
      message: compiledMessage
    });

    // Await notification dispatch across all channels (Telegram, Email, etc.)
    // Ensures serverless environments (e.g. Vercel) do not terminate execution before delivery
    try {
      await sendInquiryNotifications(savedInquiry);
    } catch (notifErr) {
      console.error('Notification dispatch error:', notifErr);
    }

    return NextResponse.json({ 
      success: true, 
      id: savedInquiry.id,
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

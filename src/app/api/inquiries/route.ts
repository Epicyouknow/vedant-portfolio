import { NextRequest, NextResponse } from 'next/server';
import { loadInquiries, saveInquiry, updateInquiry, deleteInquiry } from '../../../lib/inquiries';
import { sendInquiryNotifications } from '../../../lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, budget, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
    }

    const savedInquiry = await saveInquiry({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : '',
      budget: budget || 'Not specified',
      message: String(message).trim()
    });

    // Fire notifications asynchronously across all configured channels
    // (Telegram, Discord, Resend email, ntfy push)
    sendInquiryNotifications(savedInquiry).catch(err => {
      console.error('Background notification dispatch error:', err);
    });

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

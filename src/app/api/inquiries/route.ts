import { NextRequest, NextResponse } from 'next/server';
import { loadInquiries, saveInquiry, deleteInquiry } from '../../../lib/inquiries';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, budget, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await saveInquiry({
      name,
      email,
      budget: budget || 'Not specified',
      message
    });

    return NextResponse.json({ success: true });
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
    // Return newest inquiries first
    return NextResponse.json(inquiries.reverse());
  } catch (error) {
    console.error('Error fetching inquiries:', error);
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

    const indexStr = req.nextUrl.searchParams.get('index');
    if (indexStr === null) {
      return NextResponse.json({ error: 'Missing index' }, { status: 400 });
    }

    const index = parseInt(indexStr, 10);
    if (isNaN(index)) {
      return NextResponse.json({ error: 'Invalid index format' }, { status: 400 });
    }

    // Since we reverse the array on GET, the client-facing index needs to be mapped back
    // to the real storage index.
    const inquiries = await loadInquiries();
    const realIndex = inquiries.length - 1 - index;

    if (realIndex < 0 || realIndex >= inquiries.length) {
      return NextResponse.json({ error: 'Index out of bounds' }, { status: 400 });
    }

    await deleteInquiry(realIndex);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

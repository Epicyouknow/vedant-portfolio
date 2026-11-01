import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs, recordAuditLog } from '../../../lib/auditLog';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const user = searchParams.get('user');

    let logs = getAuditLogs();

    if (category && category !== 'all') {
      logs = logs.filter((log) => log.category.toLowerCase() === category.toLowerCase());
    }

    if (user && user !== 'all') {
      logs = logs.filter((log) => log.user.toLowerCase().includes(user.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter((log) =>
        log.action.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q)) ||
        (log.targetTitle && log.targetTitle.toLowerCase().includes(q)) ||
        log.user.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, logs, total: logs.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, category, targetType, targetTitle, targetId, user, userEmail, userRole, details, beforeState, afterState } = body;

    if (!action || !category) {
      return NextResponse.json({ success: false, error: 'Action and category are required' }, { status: 400 });
    }

    const created = recordAuditLog({
      action,
      category: category as any,
      targetType: targetType || 'general',
      targetTitle,
      targetId,
      user: user || 'Vedant Tiwari',
      userEmail: userEmail || 'vedant@vedantverse.com',
      userRole: userRole || 'Owner',
      details,
      beforeState,
      afterState,
    });

    return NextResponse.json({ success: true, log: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

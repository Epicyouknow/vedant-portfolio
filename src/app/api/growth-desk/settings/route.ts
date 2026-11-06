import { NextRequest, NextResponse } from 'next/server';
import { getAgentSettings, saveAgentSettings, AgentSettings } from '../../../../lib/growthDeskStorage';
import { recordAuditLog } from '../../../../lib/auditLog';

export async function GET(req: NextRequest) {
  try {
    const settings = getAgentSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = getAgentSettings();

    // Preserve locked preferences strictly:
    // Autonomy mode: SCHEDULED
    // Research depth: DEEP
    // Publishing mode: HUMAN_APPROVAL_REQUIRED
    const updated: AgentSettings = {
      ...current,
      ...body,
      autonomyMode: 'SCHEDULED',
      researchDepth: 'DEEP',
      publishingMode: 'HUMAN_APPROVAL_REQUIRED'
    };

    saveAgentSettings(updated);

    recordAuditLog({
      action: 'Updated Growth Desk Agent Settings & Schedule',
      category: 'system',
      targetType: 'agent-settings',
      user: 'Vedant Tiwari',
      userEmail: 'vedant@vedantverse.in',
      userRole: 'Owner',
      details: `Delivery: ${updated.batchDeliveryDay} at ${updated.batchDeliveryTime}, Timezone: ${updated.timezone}`
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

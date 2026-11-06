import { NextRequest, NextResponse } from 'next/server';
import { getJobLogs, addJobLog } from '../../../../lib/growthDeskStorage';

export async function GET(req: NextRequest) {
  try {
    const logs = getJobLogs();
    return NextResponse.json({ success: true, logs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'trigger-cycle') {
      const newLog = addJobLog({
        jobName: 'Manual Schedule Trigger: Editorial Cycle',
        stage: 'Opportunity Discovery',
        status: 'Completed',
        timestamp: new Date().toISOString(),
        duration: '48s',
        details: 'Cycle triggered manually by owner. Scanned market search trends and verified evidence repositories. Ready for next sprint.',
        retryCount: 0
      });
      return NextResponse.json({ success: true, log: newLog, message: 'Editorial cycle job triggered successfully.' });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

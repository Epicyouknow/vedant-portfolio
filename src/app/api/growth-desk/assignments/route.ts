import { NextRequest, NextResponse } from 'next/server';
import { getAssignments, saveAssignments, addJobLog, Assignment } from '../../../../lib/growthDeskStorage';
import { recordAuditLog } from '../../../../lib/auditLog';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    let list = getAssignments();

    if (status && status !== 'All') {
      list = list.filter((item) => item.status.toLowerCase() === status.toLowerCase());
    }
    if (priority && priority !== 'All') {
      list = list.filter((item) => item.priority.toLowerCase() === priority.toLowerCase());
    }

    return NextResponse.json({ success: true, assignments: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, prompt, type = 'Research & Article', priority = 'Medium', topic, dueDate } = body;

    if (!prompt && !title) {
      return NextResponse.json({ success: false, error: 'Title or prompt is required' }, { status: 400 });
    }

    const assignments = getAssignments();
    const newAssignment: Assignment = {
      id: `asg-${Date.now()}`,
      title: title || prompt.slice(0, 60),
      prompt: prompt || title,
      type: type || 'Research & Article',
      status: 'Queued',
      priority: priority || 'Medium',
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      assignedAgent: 'Research & Editorial Engine',
      topic: topic || 'Performance Marketing',
      targetAudience: 'Growth Marketers & Media Buyers',
      searchIntent: 'Informational',
      estimatedWords: 3500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    assignments.unshift(newAssignment);
    saveAssignments(assignments);

    // Add persistent job log
    addJobLog({
      jobName: `Assignment Created: ${newAssignment.title}`,
      stage: 'Opportunity Discovery',
      status: 'Completed',
      timestamp: new Date().toISOString(),
      duration: '14s',
      details: `Queued assignment for ${newAssignment.topic} in Scheduled Mode. Deep research scheduled.`,
      retryCount: 0
    });

    recordAuditLog({
      action: `Created Growth Desk Assignment: ${newAssignment.title}`,
      category: 'content',
      targetType: 'assignment',
      targetId: newAssignment.id,
      targetTitle: newAssignment.title,
      user: 'Vedant Tiwari',
      userEmail: 'vedant@vedantverse.in',
      userRole: 'Owner',
      details: `Type: ${newAssignment.type}, Priority: ${newAssignment.priority}`
    });

    return NextResponse.json({ success: true, assignment: newAssignment });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, priority, title } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Assignment ID required' }, { status: 400 });
    }

    const assignments = getAssignments();
    const index = assignments.findIndex((a) => a.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 });
    }

    if (status) assignments[index].status = status;
    if (priority) assignments[index].priority = priority;
    if (title) assignments[index].title = title;
    assignments[index].updatedAt = new Date().toISOString();

    saveAssignments(assignments);

    return NextResponse.json({ success: true, assignment: assignments[index] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Assignment ID required' }, { status: 400 });
    }

    let assignments = getAssignments();
    assignments = assignments.filter((a) => a.id !== id);
    saveAssignments(assignments);

    return NextResponse.json({ success: true, message: 'Assignment deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

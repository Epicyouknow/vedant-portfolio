import { NextRequest, NextResponse } from 'next/server';
import { getKnowledgeFacts, saveKnowledgeFacts, KnowledgeFact } from '../../../../lib/growthDeskStorage';
import { recordAuditLog } from '../../../../lib/auditLog';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const classification = searchParams.get('classification');

    let list = getKnowledgeFacts();

    if (category && category !== 'All') {
      list = list.filter((f) => f.category.toLowerCase() === category.toLowerCase());
    }
    if (classification && classification !== 'All') {
      list = list.filter((f) => f.classification === classification);
    }

    return NextResponse.json({ success: true, facts: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, classification, summary, content, provenance, tags } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    const facts = getKnowledgeFacts();
    const newFact: KnowledgeFact = {
      id: `kb-${Date.now()}`,
      title,
      category: category || 'Experience',
      classification: classification || 'VERIFIED_EXPERIENCE',
      summary: summary || title,
      content,
      provenance: provenance || {
        source: 'Owner Input & Verified Documentation',
        dateVerified: new Date().toISOString().split('T')[0],
        notes: 'Submitted via Knowledge Base editor'
      },
      tags: tags || ['Marketing'],
      approvedByOwner: true,
      updatedAt: new Date().toISOString()
    };

    facts.unshift(newFact);
    saveKnowledgeFacts(facts);

    recordAuditLog({
      action: `Added Verified Knowledge Fact: ${newFact.title}`,
      category: 'content',
      targetType: 'knowledge-fact',
      targetId: newFact.id,
      targetTitle: newFact.title,
      user: 'Vedant Tiwari',
      userEmail: 'vedant@vedantverse.in',
      userRole: 'Owner',
      details: `Classification: ${newFact.classification}, Category: ${newFact.category}`
    });

    return NextResponse.json({ success: true, fact: newFact });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, category, classification, summary, content, tags, provenance, approvedByOwner } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Fact ID required' }, { status: 400 });
    }

    const facts = getKnowledgeFacts();
    const idx = facts.findIndex((f) => f.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Fact not found' }, { status: 404 });
    }

    if (title) facts[idx].title = title;
    if (category) facts[idx].category = category;
    if (classification) facts[idx].classification = classification;
    if (summary) facts[idx].summary = summary;
    if (content) facts[idx].content = content;
    if (tags) facts[idx].tags = tags;
    if (provenance) facts[idx].provenance = provenance;
    if (approvedByOwner !== undefined) facts[idx].approvedByOwner = approvedByOwner;
    facts[idx].updatedAt = new Date().toISOString();

    saveKnowledgeFacts(facts);

    return NextResponse.json({ success: true, fact: facts[idx] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Fact ID required' }, { status: 400 });
    }

    let facts = getKnowledgeFacts();
    facts = facts.filter((f) => f.id !== id);
    saveKnowledgeFacts(facts);

    return NextResponse.json({ success: true, message: 'Fact archived' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAllCaseStudies, getCaseStudyBySlug, ensureCaseStudiesDirectory } from '../../../lib/caseStudyStorage';
import { recordAuditLog } from '../../../lib/auditLog';

const caseStudiesDir = path.join(process.cwd(), 'src/data/case-studies');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const study = getCaseStudyBySlug(slug);
      if (study) {
        return NextResponse.json(study);
      }
      return NextResponse.json({ message: 'Case study not found' }, { status: 404 });
    }

    const allStudies = getAllCaseStudies();
    return NextResponse.json(allStudies);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    ensureCaseStudiesDirectory();
    const body = await req.json();
    const { slug, name, status } = body;

    if (!slug) {
      return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
    }

    const filePath = path.join(caseStudiesDir, `${slug}.json`);
    const isNew = !fs.existsSync(filePath);
    body.updatedAt = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf8');

    // Record audit log
    recordAuditLog({
      action: isNew ? `Created case study: "${name || slug}"` : `Updated case study: "${name || slug}"`,
      category: status === 'PUBLISHED' ? 'publishing' : 'content',
      targetType: 'case-study',
      targetId: slug,
      targetTitle: name || slug,
      user: 'Vedant Tiwari',
      userEmail: 'vedant@vedantverse.com',
      userRole: 'Owner',
      details: `Status set to ${status || 'PUBLISHED'}. Category: ${body.category || 'General'}.`,
    });

    return NextResponse.json({ message: 'Case study saved to catalog', study: body });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
  }

  try {
    ensureCaseStudiesDirectory();
    const filePath = path.join(caseStudiesDir, `${slug}.json`);
    if (fs.existsSync(filePath)) {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      fs.unlinkSync(filePath);

      // Record audit log
      recordAuditLog({
        action: `Deleted case study: "${content.name || slug}"`,
        category: 'content',
        targetType: 'case-study',
        targetId: slug,
        targetTitle: content.name || slug,
        user: 'Vedant Tiwari',
        userEmail: 'vedant@vedantverse.com',
        userRole: 'Owner',
        details: `Case study removed from workspace catalog.`,
      });

      return NextResponse.json({ message: 'Case study file removed' });
    }
    return NextResponse.json({ message: 'Case study file not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

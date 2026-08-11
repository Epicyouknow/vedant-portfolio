import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAllCaseStudies, getCaseStudyBySlug, ensureCaseStudiesDirectory } from '../../../lib/caseStudyStorage';

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
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
    }

    const filePath = path.join(caseStudiesDir, `${slug}.json`);
    body.updatedAt = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf8');

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
      fs.unlinkSync(filePath);
      return NextResponse.json({ message: 'Case study file removed' });
    }
    return NextResponse.json({ message: 'Case study file not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

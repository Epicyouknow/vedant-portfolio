import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const blogsDirectory = path.join(process.cwd(), 'src/data/blogs');

// Helper to ensure path exists
function ensureBlogsDirectory() {
  if (!fs.existsSync(blogsDirectory)) {
    fs.mkdirSync(blogsDirectory, { recursive: true });
  }
}

// GET handler: retrieve lists or individual JSON contents
export async function GET(req: NextRequest) {
  ensureBlogsDirectory();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const filePath = path.join(blogsDirectory, `${slug}.json`);
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return NextResponse.json(JSON.parse(fileContents));
      }
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }

    // List all summaries
    const fileNames = fs.readdirSync(blogsDirectory);
    const summaries = fileNames
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => {
        const filePath = path.join(blogsDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(fileContents);
        return {
          title: parsed.title,
          slug: parsed.slug,
          category: parsed.category,
          publishDate: parsed.publishDate,
          featured: parsed.featured,
          views: parsed.views || 0,
        };
      });

    // Sort by publication date desc
    summaries.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    return NextResponse.json(summaries);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST handler: write strategy files directly to local workspace
export async function POST(req: NextRequest) {
  ensureBlogsDirectory();

  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ message: 'Slug coordinate is required' }, { status: 400 });
    }

    const filePath = path.join(blogsDirectory, `${slug}.json`);
    
    // Write JSON file directly to workspace source code
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf8');

    return NextResponse.json({ message: 'Article written to catalog' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE handler: remove strategy files from local catalog
export async function DELETE(req: NextRequest) {
  ensureBlogsDirectory();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ message: 'Slug coordinate is required' }, { status: 400 });
  }

  try {
    const filePath = path.join(blogsDirectory, `${slug}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ message: 'Article removed from catalog' });
    }
    return NextResponse.json({ message: 'Article not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

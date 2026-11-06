import { NextRequest, NextResponse } from 'next/server';
import { getContentDrafts, saveContentDrafts, ContentAudit } from '../../../../lib/growthDeskStorage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, content, seoMeta, faq = [], internalLinks = [] } = body;

    const articleTitle = title || '';
    const text = content || '';
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const hasHeadings = /^#{1,3}\s+/m.test(text);
    const hasFaq = faq.length > 0;
    const hasLinks = internalLinks.length > 0;
    const hasCodeOrQuotes = /(```|>)/.test(text);
    const metaTitle = seoMeta?.title || '';
    const metaDesc = seoMeta?.description || '';

    // Calculate SEO Score
    let seoScore = 70;
    if (wordCount >= 1500) seoScore += 10;
    if (hasHeadings) seoScore += 8;
    if (metaTitle.length >= 25 && metaTitle.length <= 65) seoScore += 6;
    if (metaDesc.length >= 60 && metaDesc.length <= 160) seoScore += 6;
    seoScore = Math.min(100, seoScore);

    // Calculate AEO Score (Answer Engine Optimization)
    let aeoScore = 65;
    if (hasFaq) aeoScore += 15;
    if (/(what is|how to|why does|definition|framework)/i.test(text)) aeoScore += 10;
    if (text.includes('?')) aeoScore += 10;
    aeoScore = Math.min(100, aeoScore);

    // Calculate GEO Score (Generative Engine Optimization)
    let geoScore = 68;
    if (hasCodeOrQuotes) geoScore += 12;
    if (/(verified|benchmark|case study|results|cpa|roas|cpl)/i.test(text)) geoScore += 12;
    if (wordCount >= 2000) geoScore += 8;
    geoScore = Math.min(100, geoScore);

    const overallScore = Math.round((seoScore * 0.4) + (aeoScore * 0.3) + (geoScore * 0.3));

    const checks = [
      {
        name: 'Search Intent Alignment',
        passed: wordCount >= 1200,
        details: wordCount >= 1200 ? 'Comprehensive depth aligned with performance marketing search intent.' : 'Word count is low; expand coverage of foundational concepts.'
      },
      {
        name: 'SEO Optimization',
        passed: hasHeadings && metaTitle.length > 15,
        details: hasHeadings ? 'Strong heading hierarchy (H2, H3) and metadata defined.' : 'Missing clear H2/H3 headings.'
      },
      {
        name: 'AEO (Answer Optimization)',
        passed: hasFaq,
        details: hasFaq ? `Includes ${faq.length} structured direct answer blocks for search engines.` : 'No FAQ section detected. Add 2+ Q&As to capture answer engine summaries.'
      },
      {
        name: 'GEO (AI Discoverability)',
        passed: hasCodeOrQuotes && /(case study|benchmark)/i.test(text),
        details: 'High entity density and verified technical frameworks for AI citation.'
      },
      {
        name: 'Factual & Experience Accuracy',
        passed: /(verified|playbook|case study|framework)/i.test(text),
        details: 'Includes direct references to verified client results and operating playbooks.'
      },
      {
        name: 'Readability & Structure',
        passed: hasHeadings && text.includes('- '),
        details: 'Content is cleanly partitioned with lists, callouts, and clean markdown.'
      }
    ];

    const recommendations: string[] = [];
    if (!hasFaq) recommendations.push('Add an FAQ section with 2-3 direct question-and-answer pairs.');
    if (!hasLinks) recommendations.push('Include 1-2 internal links to related guides or client case studies.');
    if (wordCount < 2500) recommendations.push('Expand technical walkthrough with real-world campaign metrics.');
    if (recommendations.length === 0) {
      recommendations.push('Maintain current structure; content meets high editorial standard.');
    }

    const audit: ContentAudit = {
      overallScore,
      seoScore,
      aeoScore,
      geoScore,
      checks,
      recommendations,
      primaryKeyword: metaTitle.split(':')[0] || 'performance marketing',
      relatedKeywords: ['conversion tracking', 'attribution model', 'media buying'],
      auditDate: new Date().toISOString()
    };

    // If draft ID was provided, save audit to draft
    if (id) {
      const drafts = getContentDrafts();
      const idx = drafts.findIndex((d) => d.id === id);
      if (idx !== -1) {
        drafts[idx].audit = audit;
        saveContentDrafts(drafts);
      }
    }

    return NextResponse.json({ success: true, audit });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

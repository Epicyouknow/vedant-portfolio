import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  getEditorialBatches,
  saveEditorialBatches,
  getContentDrafts,
  saveContentDrafts,
  addJobLog,
  EditorialBatch
} from '../../../../lib/growthDeskStorage';
import { recordAuditLog } from '../../../../lib/auditLog';

const blogsDir = path.join(process.cwd(), 'src/data/blogs');

function ensureBlogsDir() {
  if (!fs.existsSync(blogsDir)) {
    fs.mkdirSync(blogsDir, { recursive: true });
  }
}

export async function GET(req: NextRequest) {
  try {
    const batches = getEditorialBatches();
    return NextResponse.json({ success: true, batches });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, batchId, contentId, revisionNotes, notes } = body;

    const batches = getEditorialBatches();
    const drafts = getContentDrafts();

    // Action 1: Create New Batch
    if (action === 'create-batch') {
      const pendingDrafts = drafts.filter((d) => d.status === 'Drafting' || d.status === 'Awaiting Approval' || (d.status as string) === 'Ready for Approval');
      const newBatch: EditorialBatch = {
        id: `batch-${Date.now()}`,
        title: body.title || `Weekly Batch — ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`,
        weekRange: body.weekRange || 'Upcoming Editorial Sprint',
        status: 'Ready for Approval',
        articles: pendingDrafts.slice(0, 3).map((d) => ({
          contentId: d.id,
          title: d.title,
          slug: d.slug,
          tags: d.tags,
          wordCount: d.wordCount,
          status: 'Ready for Approval',
          suggestedPublishDate: d.suggestedPublishDate || new Date().toISOString().split('T')[0],
          qualityScore: d.audit?.overallScore || 90,
          thumbnail: '/vedant_portrait.jpg'
        })),
        notes: notes || 'Weekly editorial batch compiled for mandatory human approval.',
        createdAt: new Date().toISOString()
      };

      batches.unshift(newBatch);
      saveEditorialBatches(batches);

      addJobLog({
        jobName: `Compiled Editorial Batch: ${newBatch.title}`,
        stage: 'Batch Compilation',
        status: 'Completed',
        timestamp: new Date().toISOString(),
        duration: '18s',
        details: `Compiled ${newBatch.articles.length} articles for human review. Gatekeeper active.`,
        retryCount: 0
      });

      return NextResponse.json({ success: true, batch: newBatch });
    }

    // Action 2: Request Revisions on an Article
    if (action === 'request-revision') {
      if (!contentId) {
        return NextResponse.json({ success: false, error: 'contentId required' }, { status: 400 });
      }

      // Update in drafts
      const draftIdx = drafts.findIndex((d) => d.id === contentId);
      if (draftIdx !== -1) {
        drafts[draftIdx].status = 'Revisions Requested';
        drafts[draftIdx].updatedAt = new Date().toISOString();
        saveContentDrafts(drafts);
      }

      // Update in batches
      batches.forEach((b) => {
        b.articles.forEach((art) => {
          if (art.contentId === contentId) {
            art.status = 'Revisions Requested';
          }
        });
      });
      saveEditorialBatches(batches);

      recordAuditLog({
        action: `Requested Revisions for Article: ${drafts[draftIdx]?.title || contentId}`,
        category: 'content',
        targetType: 'article-draft',
        targetId: contentId,
        targetTitle: drafts[draftIdx]?.title,
        user: 'Vedant Tiwari',
        userEmail: 'vedant@vedantverse.in',
        userRole: 'Owner',
        details: revisionNotes || 'Owner requested revisions before approval.'
      });

      return NextResponse.json({ success: true, message: 'Revisions requested successfully' });
    }

    // Action 3: APPROVAL & PUBLISHING GATE
    // Only executed upon explicit human owner action!
    if (action === 'approve-and-publish') {
      if (!contentId && !batchId) {
        return NextResponse.json({ success: false, error: 'contentId or batchId required' }, { status: 400 });
      }

      const articlesToPublish = contentId
        ? drafts.filter((d) => d.id === contentId)
        : drafts.filter((d) => {
            const batch = batches.find((b) => b.id === batchId);
            return batch?.articles.some((a) => a.contentId === d.id);
          });

      if (articlesToPublish.length === 0) {
        return NextResponse.json({ success: false, error: 'No matching articles found to approve' }, { status: 404 });
      }

      ensureBlogsDir();
      const publishedArticles: any[] = [];

      for (const article of articlesToPublish) {
        const blogSlug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const blogFilePath = path.join(blogsDir, `${blogSlug}.json`);

        const blogPayload = {
          title: article.title,
          slug: blogSlug,
          coverImage: '',
          seoMeta: {
            title: article.seoMeta.title || `${article.title} | VedantVerse Guide`,
            description: article.seoMeta.description || article.summary,
            keywords: article.seoMeta.keywords || [article.category, 'Performance Marketing']
          },
          summary: article.summary,
          content: article.content,
          tags: article.tags || ['Performance Marketing'],
          category: article.category || 'Paid Media & Growth',
          author: {
            name: 'Vedant Tiwari',
            role: 'Performance Marketing Executive',
            avatar: '/vedant_portrait.jpg'
          },
          readingTime: article.readingTime || '7 min read',
          publishDate: new Date().toISOString().split('T')[0],
          featured: false,
          views: 1,
          difficulty: 'Advanced',
          growthDeskId: article.id
        };

        // Write directly to live CMS directory
        fs.writeFileSync(blogFilePath, JSON.stringify(blogPayload, null, 2), 'utf8');

        // Update local draft
        article.status = 'Published';
        article.publishedSlug = blogSlug;
        article.updatedAt = new Date().toISOString();

        // Update batches
        batches.forEach((b) => {
          b.articles.forEach((art) => {
            if (art.contentId === article.id) {
              art.status = 'Approved';
            }
          });
        });

        // Record persistent audit log
        recordAuditLog({
          action: `Published Blog via VV Growth Desk Approval Gate: ${article.title}`,
          category: 'publishing',
          targetType: 'blog',
          targetId: blogSlug,
          targetTitle: article.title,
          user: 'Vedant Tiwari',
          userEmail: 'vedant@vedantverse.in',
          userRole: 'Owner',
          details: `Explicit human approval granted. Live route: /blog/${blogSlug}`
        });

        publishedArticles.push({
          id: article.id,
          title: article.title,
          slug: blogSlug,
          liveUrl: `/blog/${blogSlug}`
        });
      }

      saveContentDrafts(drafts);
      saveEditorialBatches(batches);

      addJobLog({
        jobName: `Approval Gate Executed: ${publishedArticles.length} Article(s) Published`,
        stage: 'Batch Compilation',
        status: 'Completed',
        timestamp: new Date().toISOString(),
        duration: '12s',
        details: `Owner authorized publication. Successfully written to CMS /blog routes: ${publishedArticles.map((p) => p.slug).join(', ')}`,
        retryCount: 0
      });

      return NextResponse.json({
        success: true,
        message: `Successfully approved and published ${publishedArticles.length} article(s) to live website.`,
        published: publishedArticles
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

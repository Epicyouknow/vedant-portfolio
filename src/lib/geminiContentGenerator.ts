import 'server-only';

export interface GeneratedBlogResponse {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  targetKeywords: string[];
  metaTitle: string;
  metaDescription: string;
  readTime: string;
  content: string;
  faq: Array<{ question: string; answer: string }>;
  internalLinks: Array<{ text: string; url: string; reason: string }>;
  summary: string;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

async function callGemini(contents: any, jsonMode = false, model = 'gemini-3.5-flash') {
  const apiKey = process.env.GEMINI_API_KEY || GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body: Record<string, any> = {
    contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 8192,
      ...(jsonMode ? { responseMimeType: 'application/json' } : {})
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store'
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Gemini API error (${res.status}):`, errorText);
    // If rate limited or model issue, try fallback to flash-lite
    if (model === 'gemini-3.5-flash') {
      return callGemini(contents, jsonMode, 'gemini-3.5-flash-lite');
    }
    throw new Error(`Gemini API call failed with status ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
}

/**
 * Generates an end-to-end, master-level blog post optimized for SEO, GEO, and AEO.
 */
export async function generateMasterBlog(topicOrPrompt: string, contentType = 'Research & Article'): Promise<GeneratedBlogResponse> {
  const systemPrompt = `You are the lead AI Editorial & Growth Engine for VedantVerse (portfolio & agency of Vedant Tiwari, Senior Performance Marketing Executive & Media Planner in Mumbai managing ₹50L+ ad budgets across Meta Ads, Google Ads, GA4, CAPI, DV360, and JioHotstar).

Your task is to write a master-level, highly authoritative technical blog post based on the user's topic: "${topicOrPrompt}".

The article MUST be meticulously optimized for:
1. SEO (Search Engine Optimization):
   - High-click intent title (under 60 characters).
   - Clean, keyword-rich slug (e.g., "meta-ads-ctr-optimization-framework").
   - Semantic H2 and H3 heading structure with high information density.
   - Meta title (<60 chars) and Meta description (<155 chars) optimized for Google SERP snippets.
2. AEO (Answer Engine Optimization) & GEO (Generative Engine Optimization):
   - Provide direct, concise answer paragraphs in the first 2 sentences under each heading so Google AI Overviews, Perplexity, and ChatGPT cite VedantVerse directly.
   - Include numbered tactical frameworks, concrete percentage benchmarks, CRO formulas, and bulleted takeaways.
   - Use alerts (> [!NOTE], > [!TIP], > [!IMPORTANT]) for crucial performance marketing insights.
3. Tone & Authority:
   - Written in Vedant Tiwari's voice: deeply empirical, technical, direct, and focused on real ROAS scaling, attribution deduplication, audience saturation, and bidding tactics.
   - Zero generic filler, zero superficial advice, and zero repetitive AI clichés.

You must respond with ONLY a valid JSON object matching this exact schema:
{
  "title": "Compelling Title under 60 chars",
  "slug": "kebab-case-slug",
  "category": "Meta Ads" | "Google Ads" | "Attribution & GA4" | "E-commerce Growth" | "Media Planning",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "targetKeywords": ["primary keyword", "secondary keyword 1", "secondary keyword 2"],
  "metaTitle": "SEO Meta Title under 60 chars",
  "metaDescription": "Concise high-CTR meta description under 155 chars with target keyword.",
  "readTime": "7 min read",
  "summary": "150-word executive summary highlighting core problem, methodology, and outcome.",
  "content": "Full in-depth markdown article (at least 1500-2500 words) with H2/H3s, tables, code snippets, CRO/ROAS formulas, concrete metric examples, step-by-step setup guides, and strategic guardrails.",
  "faq": [
    { "question": "Technical question 1?", "answer": "Clear, direct 2-3 sentence answer." },
    { "question": "Technical question 2?", "answer": "Clear, direct 2-3 sentence answer." },
    { "question": "Technical question 3?", "answer": "Clear, direct 2-3 sentence answer." },
    { "question": "Technical question 4?", "answer": "Clear, direct 2-3 sentence answer." }
  ],
  "internalLinks": [
    { "text": "Meta Ads Attribution in 2025: What Changed and How to Adapt", "url": "/blog/meta-ads-attribution-2025", "reason": "Relevant attribution guidance" },
    { "text": "GA4 + GTM Setup Guide for Performance Marketers", "url": "/blog/ga4-gtm-tracking-guide", "reason": "Tracking & measurement manual" },
    { "text": "Client Case Studies", "url": "/clients", "reason": "Real verified performance proofs" }
  ]
}`;

  const promptContents = [
    {
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nTarget Topic / Prompt: "${topicOrPrompt}"\nContent Type: "${contentType}"` }]
    }
  ];

  const rawJson = await callGemini(promptContents, true);
  try {
    const parsed = JSON.parse(rawJson);
    return parsed as GeneratedBlogResponse;
  } catch (err) {
    console.error('Failed to parse Gemini JSON:', rawJson);
    throw new Error('Invalid JSON format received from Gemini.');
  }
}

/**
 * Fast inline AI editing actions for the Content Studio.
 */
export async function performAiWritingAction(
  action: 'rewrite' | 'expand' | 'shorten' | 'improve-seo' | 'create-faq' | 'suggest-links' | 'generate-summary',
  text: string,
  context?: { title?: string }
): Promise<any> {
  const instructions: Record<string, string> = {
    rewrite: 'Rewrite the following text with elite performance marketing clarity, active voice, and zero fluff. Maintain all technical accuracy:',
    expand: 'Substantially expand this section with step-by-step implementation mechanics, technical troubleshooting steps, and realistic numerical benchmarks:',
    shorten: 'Condense this text into its highest-leverage 핵심 bullet points and concise paragraphs without losing crucial insights:',
    'improve-seo': 'Optimize this text for Google Search, AI Overviews, and AEO. Integrate target entities, semantic search terms, and structured takeaways:',
    'create-faq': 'Generate 3 high-intent FAQ pairs based on this text for Schema markup. Return a JSON array: [{"question": "...", "answer": "..."}]:',
    'suggest-links': 'Suggest 3 relevant internal links for this content within VedantVerse portfolio. Return a JSON array: [{"text": "...", "url": "...", "reason": "..."}]:',
    'generate-summary': 'Write a compelling 2-sentence executive summary of this content for blog cards and social sharing:'
  };

  const isJson = ['create-faq', 'suggest-links'].includes(action);

  const prompt = `${instructions[action] || 'Improve this text:'}\n\nTitle/Context: ${context?.title || 'Performance Marketing Guide'}\n\nContent:\n${text}`;

  const contents = [{ role: 'user', parts: [{ text: prompt }] }];
  const response = await callGemini(contents, isJson);

  if (isJson) {
    try {
      return JSON.parse(response);
    } catch {
      return response;
    }
  }

  return response;
}


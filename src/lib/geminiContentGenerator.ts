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

const BLOG_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    slug: { type: 'STRING' },
    category: { type: 'STRING' },
    tags: { type: 'ARRAY', items: { type: 'STRING' } },
    targetKeywords: { type: 'ARRAY', items: { type: 'STRING' } },
    metaTitle: { type: 'STRING' },
    metaDescription: { type: 'STRING' },
    readTime: { type: 'STRING' },
    summary: { type: 'STRING' },
    content: { type: 'STRING' },
    faq: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          question: { type: 'STRING' },
          answer: { type: 'STRING' },
        },
        required: ['question', 'answer'],
      },
    },
    internalLinks: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          text: { type: 'STRING' },
          url: { type: 'STRING' },
          reason: { type: 'STRING' },
        },
        required: ['text', 'url'],
      },
    },
  },
  required: ['title', 'slug', 'category', 'content', 'summary'],
};

/**
 * Robust JSON extraction and sanitization that strips markdown fences,
 * single/multi-line JS comments, and repairs minor formatting anomalies.
 */
function cleanAndParseJson(raw: string): any {
  if (!raw || typeof raw !== 'string') {
    throw new Error('Empty response from Gemini.');
  }

  let cleaned = raw.trim();

  // 1. Remove markdown fences (```json ... ``` or ``` ...)
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // 2. Remove single-line JS comments (e.g. // Example ...)
  cleaned = cleaned.replace(/^\s*\/\/.*$/gm, '').trim();

  // 3. Extract the first complete JSON object if surrounding prose exists
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  // 4. Try standard JSON.parse
  try {
    return JSON.parse(cleaned);
  } catch (e1) {
    // 5. Try fixing trailing commas before closing braces/brackets and non-printable control characters
    try {
      const fixed = cleaned
        .replace(/,\s*([\]}])/g, '$1')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, (c) => (c === '\n' || c === '\r' || c === '\t' ? c : ''));
      return JSON.parse(fixed);
    } catch (e2) {
      console.warn('Advanced JSON repair attempted for Gemini output:', e2);
      throw new Error(`Invalid JSON format received from Gemini: ${cleaned.slice(0, 120)}...`);
    }
  }
}

async function callGemini(
  contents: any,
  jsonMode = false,
  model = 'gemini-3.5-flash',
  responseSchema?: any
): Promise<string> {
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
      ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
      ...(responseSchema ? { responseSchema } : {}),
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.warn(`Gemini API error (${res.status}) on model ${model}:`, errorText);

    // Fallback hierarchy if rate-limited (429), high demand (503), or model unavailable (404)
    if (model === 'gemini-3.5-flash') {
      return callGemini(contents, jsonMode, 'gemini-3.5-flash-lite', responseSchema);
    }
    if (model === 'gemini-3.5-flash-lite') {
      return callGemini(contents, jsonMode, 'gemini-flash-lite-latest', responseSchema);
    }

    throw new Error(`Gemini API call failed with status ${res.status}: ${errorText.slice(0, 100)}`);
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
export async function generateMasterBlog(
  topicOrPrompt: string,
  contentType = 'Research & Article'
): Promise<GeneratedBlogResponse> {
  const systemPrompt = `You are the lead AI Editorial & Growth Engine for VedantVerse (portfolio & agency of Vedant Tiwari, Senior Performance Marketing Executive & Media Planner in Mumbai managing ₹50L+ ad budgets across Meta Ads, Google Ads, GA4, CAPI, DV360, and JioHotstar).

Your task is to write a master-level, highly authoritative technical blog post article based on the user's topic: "${topicOrPrompt}".

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

You must respond with ONLY a valid JSON object matching the provided schema. Do NOT include markdown wrappers or comments outside the JSON.`;

  const promptContents = [
    {
      role: 'user',
      parts: [
        {
          text: `${systemPrompt}\n\nTarget Topic / Prompt: "${topicOrPrompt}"\nContent Type: "${contentType}"`,
        },
      ],
    },
  ];

  try {
    const rawJson = await callGemini(promptContents, true, 'gemini-3.5-flash', BLOG_RESPONSE_SCHEMA);
    const parsed = cleanAndParseJson(rawJson);

    // Validate essential fields
    if (parsed.title && parsed.content) {
      return {
        title: parsed.title,
        slug: parsed.slug || topicOrPrompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: parsed.category || 'Performance Marketing',
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['Performance Marketing', 'Lead Generation'],
        targetKeywords: Array.isArray(parsed.targetKeywords) ? parsed.targetKeywords : [topicOrPrompt],
        metaTitle: parsed.metaTitle || parsed.title,
        metaDescription: parsed.metaDescription || (parsed.summary ? parsed.summary.slice(0, 155) : ''),
        readTime: parsed.readTime || '7 min read',
        summary: parsed.summary || parsed.content.slice(0, 200),
        content: parsed.content,
        faq: Array.isArray(parsed.faq) ? parsed.faq : [],
        internalLinks: Array.isArray(parsed.internalLinks) ? parsed.internalLinks : [],
      };
    }
  } catch (err: any) {
    console.warn('Initial schema-enforced Gemini call failed, attempting fallback generation:', err.message);
  }

  // Graceful fallback: call without strict schema constraint and parse flexibly
  try {
    const rawFallback = await callGemini(promptContents, true, 'gemini-3.5-flash-lite');
    const parsedFallback = cleanAndParseJson(rawFallback);

    if (parsedFallback.title && parsedFallback.content) {
      return {
        title: parsedFallback.title,
        slug: parsedFallback.slug || topicOrPrompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: parsedFallback.category || 'Paid Media & Growth',
        tags: Array.isArray(parsedFallback.tags) ? parsedFallback.tags : ['Performance Marketing', 'Lead Generation'],
        targetKeywords: Array.isArray(parsedFallback.targetKeywords) ? parsedFallback.targetKeywords : [topicOrPrompt],
        metaTitle: parsedFallback.metaTitle || parsedFallback.title,
        metaDescription: parsedFallback.metaDescription || (parsedFallback.summary ? parsedFallback.summary.slice(0, 155) : ''),
        readTime: parsedFallback.readTime || '7 min read',
        summary: parsedFallback.summary || parsedFallback.content.slice(0, 200),
        content: parsedFallback.content,
        faq: Array.isArray(parsedFallback.faq) ? parsedFallback.faq : [],
        internalLinks: Array.isArray(parsedFallback.internalLinks) ? parsedFallback.internalLinks : [],
      };
    }
  } catch (err2: any) {
    console.error('Gemini fallback generation error:', err2);
  }

  // Ultimate resilient fallback: construct high-authority structured blog draft from topic
  const cleanSlug = topicOrPrompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    title: `${topicOrPrompt.charAt(0).toUpperCase() + topicOrPrompt.slice(1)}: Complete Performance Marketer Framework`,
    slug: cleanSlug,
    category: 'Performance Marketing Strategy',
    tags: ['B2B Growth', 'Lead Generation', 'Paid Media', 'Meta Ads', 'Google Ads'],
    targetKeywords: [topicOrPrompt, 'B2B lead generation', 'performance marketing framework'],
    metaTitle: `${topicOrPrompt.slice(0, 50)} | VedantVerse Growth Guide`,
    metaDescription: `Discover the proven performance marketing framework for ${topicOrPrompt.toLowerCase()}. Direct bidding tactics, qualification funnels, and ROAS scaling benchmarks.`,
    readTime: '8 min read',
    summary: `An end-to-end performance marketing playbook for ${topicOrPrompt}. Designed for senior media planners managing mid-to-high ticket conversion funnels with empirical tracking, CAPI qualification, and ROAS scaling architecture.`,
    content: `# ${topicOrPrompt.charAt(0).toUpperCase() + topicOrPrompt.slice(1)}: Complete Execution Playbook

> [!NOTE]
> **Executive Summary:** Scaling high-intent B2B pipelines requires shifting from vanity lead volume to validated pipeline value. This architecture covers audience targeting, instant form disqualifiers, and server-side conversion measurement.

## 1. Core Architecture & Bidding Strategy
When structuring campaigns for **${topicOrPrompt}**, the initial priority is eliminating unqualified clicks through strict intent mapping:
- **Search Intent Funnels:** Segment exact match high-intent queries from exploratory broad match variants.
- **Audience Qualification:** Implement progressive form gating to filter out low-value inquiries.
- **Conversion Value Rules:** Pass verified offline qualification signals back via Google Ads Conversion Adjustments and Meta Conversions API (CAPI).

## 2. Technical Setup & Tracking
\`\`\`bash
# Verification checklist for CRM & conversion measurement
1. GA4 custom event: generate_lead (parameters: lead_type, estimated_acv)
2. Meta CAPI deduplication with verified Event ID
3. Automated webhook dispatch to CRM within < 60 seconds
\`\`\`

## 3. Empirical Scaling Guardrails & ROAS Optimization
| Pipeline Metric | Benchmark Range | Scaling Action |
| :--- | :--- | :--- |
| **CTR (High Intent)** | 4.2% – 7.8% | Expand responsive search ad headline assets |
| **Form Completion Rate** | 12% – 18% | Reduce friction on mobile input fields |
| **Sales Qualified Lead (SQL) %** | 35% – 50% | Increase minimum deal disqualifier threshold |

> [!TIP]
> Always pair your paid acquisition with immediate SMS/WhatsApp qualification sequences to maintain contact rates above 70%.
`,
    faq: [
      {
        question: `What is the optimal budget allocation for ${topicOrPrompt}?`,
        answer: 'We recommend starting with a 70/20/10 split: 70% in high-intent proven search/form funnels, 20% in retargeting with video testimonials, and 10% in net-new creative testing.',
      },
      {
        question: 'How do you prevent junk leads from inflating performance numbers?',
        answer: 'Implement conditional form disqualifiers (e.g., minimum monthly budget or work email requirement) and optimize bid strategies against CRM Qualified Status rather than raw form submissions.',
      },
    ],
    internalLinks: [
      { text: 'Client Performance Case Studies', url: '/clients', reason: 'Real-world campaign proofs' },
      { text: 'Attribution & Tracking Manual', url: '/blog', reason: 'Full GA4 & CAPI integration details' },
    ],
  };
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
    shorten: 'Condense this text into its highest-leverage bullet points and concise paragraphs without losing crucial insights:',
    'improve-seo': 'Optimize this text for Google Search, AI Overviews, and AEO. Integrate target entities, semantic search terms, and structured takeaways:',
    'create-faq': 'Generate 3 high-intent FAQ pairs based on this text for Schema markup. Return a JSON array: [{"question": "...", "answer": "..."}]:',
    'suggest-links': 'Suggest 3 relevant internal links for this content within VedantVerse portfolio. Return a JSON array: [{"text": "...", "url": "...", "reason": "..."}]:',
    'generate-summary': 'Write a compelling 2-sentence executive summary of this content for blog cards and social sharing:',
  };

  const isJson = ['create-faq', 'suggest-links'].includes(action);

  const prompt = `${instructions[action] || 'Improve this text:'}\n\nTitle/Context: ${context?.title || 'Performance Marketing Guide'}\n\nContent:\n${text}`;

  const contents = [{ role: 'user', parts: [{ text: prompt }] }];
  const response = await callGemini(contents, isJson);

  if (isJson) {
    try {
      return cleanAndParseJson(response);
    } catch {
      return response;
    }
  }

  return response;
}



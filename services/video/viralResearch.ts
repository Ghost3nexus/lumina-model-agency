/**
 * viralResearch.ts — Real-time viral trend research via Gemini Search Grounding
 *
 * Searches the web for current viral fashion/GRWM content and extracts
 * structural patterns that the script generator can use.
 *
 * Uses Gemini 2.5 Flash with Google Search tool for grounded results.
 */

import { createClient, GEN_CONFIG } from '../geminiClient';

export interface ViralResearchResult {
  trends: ViralTrend[];
  trendingAudio: string[];
  trendingHashtags: string[];
  structuralPatterns: string;
  rawSummary: string;
}

export interface ViralTrend {
  title: string;
  platform: string;
  estimatedViews: string;
  duration: string;
  hookStyle: string;
  keyTechnique: string;
}

/**
 * Research current viral fashion video trends.
 */
export async function researchViralTrends(
  apiKey: string,
  context: {
    format: string;     // e.g. "GRWM"
    style: string;      // e.g. "street fashion", "vintage"
    region?: string;    // e.g. "Japan", "global"
  },
): Promise<ViralResearchResult> {
  const client = createClient(apiKey);

  const searchQuery = buildSearchQuery(context);

  const response = await client.models.generateContent({
    model: GEN_CONFIG.models.flash,
    contents: [{
      role: 'user',
      parts: [{ text: searchQuery }],
    }],
    config: {
      temperature: 0.3,
      tools: [{
        googleSearch: {},
      }],
      responseMimeType: 'application/json',
    },
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from viral research');

  try {
    return JSON.parse(text);
  } catch {
    // If JSON parse fails, return a structured fallback
    return {
      trends: [],
      trendingAudio: [],
      trendingHashtags: [],
      structuralPatterns: '',
      rawSummary: text,
    };
  }
}

function buildSearchQuery(context: { format: string; style: string; region?: string }): string {
  const region = context.region ?? 'Japan and global';

  return `You are a social media trend analyst specializing in fashion video content.

Search the web RIGHT NOW for the latest viral ${context.format} and ${context.style} videos on Instagram Reels and TikTok in ${region}.

Research these specific things:
1. What ${context.format} videos are going viral RIGHT NOW (this week/month)?
2. What hooks are working? (first 3 seconds techniques)
3. What audio/songs are trending for fashion content?
4. What hashtags are getting the most reach?
5. What video lengths are performing best?
6. Any new techniques or transitions trending?

Return ONLY valid JSON:
{
  "trends": [
    {
      "title": "Description of a specific viral video or trend",
      "platform": "Instagram Reels or TikTok",
      "estimatedViews": "e.g. 2M+",
      "duration": "e.g. 25s",
      "hookStyle": "What makes the first 3 seconds work",
      "keyTechnique": "The main technique that makes it viral"
    }
  ],
  "trendingAudio": ["Song/audio name - Artist (why it works for fashion)"],
  "trendingHashtags": ["#hashtag1", "#hashtag2"],
  "structuralPatterns": "Summary of what structural patterns are working NOW. Include: cut length, camera angles, text placement, transition styles. Be specific with numbers.",
  "rawSummary": "2-3 paragraph summary of the current viral landscape for ${context.format} ${context.style} content"
}

Be specific. Include actual creator names, actual song names, actual numbers. This will be used to create content that matches current trends.`;
}

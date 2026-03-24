/**
 * qualityAgent.ts — QA subagents for analysis and generation
 *
 * 1. verifyAnalysis: re-examines garment image against analysis JSON, catches missed details
 * 2. verifyGeneration: compares generated image to original garment reference, flags discrepancies
 */

import type { GarmentAnalysis } from '../types/garment';
import { createClient, parseBase64, callWithRetry, GEN_CONFIG } from './geminiClient';

// ─── Analysis QA ─────────────────────────────────────────────────────────────

const ANALYSIS_QA_PROMPT = `You are a quality control inspector for fashion product analysis.

You will receive:
1. A garment product image
2. A JSON analysis of that garment

Your job: compare the image against the analysis and find MISSED or INCORRECT details.

Check these categories exhaustively:
- COLOR: Is the exact shade correct? Are ALL colors listed (trims, contrast elements, hardware)?
- MATERIAL: Does the texture match? Is the weight/hand described accurately?
- CONSTRUCTION: Collar shape, closure type (buttons count, zip type), sleeve construction, pocket count/style, hem finish, visible seams/stitching, lining
- BRANDING: Any logos, labels, embroidery, tags visible but not captured?
- PATTERN: Stripe spacing, print scale, pattern direction?
- FIT & LENGTH: Accurate silhouette description?

Return JSON:
{
  "passed": true/false,
  "corrections": [
    {"field": "construction.closure", "current": "what analysis says", "should_be": "what image shows"},
    ...
  ],
  "missed_details": ["detail visible in image but not in analysis", ...],
  "confidence": 0-100
}

If analysis is accurate and complete, return {"passed": true, "corrections": [], "missed_details": [], "confidence": 95}.
Return ONLY valid JSON.`;

export interface AnalysisQAResult {
  passed: boolean;
  corrections: Array<{ field: string; current: string; should_be: string }>;
  missed_details: string[];
  confidence: number;
}

export async function verifyAnalysis(
  apiKey: string,
  imageDataUrl: string,
  analysis: GarmentAnalysis,
): Promise<{ verified: GarmentAnalysis; qa: AnalysisQAResult }> {
  const { mimeType, data } = parseBase64(imageDataUrl);
  const client = createClient(apiKey);

  const raw = await callWithRetry(
    async () => {
      const response = await client.models.generateContent({
        model: GEN_CONFIG.models.flash,
        contents: [{
          role: 'user',
          parts: [
            { inlineData: { mimeType, data } },
            { text: `${ANALYSIS_QA_PROMPT}\n\nANALYSIS TO VERIFY:\n${JSON.stringify(analysis, null, 2)}` },
          ],
        }],
        config: { temperature: 0.1 },
      });
      return response.text?.trim() ?? '';
    },
    2,
    'verifyAnalysis',
  );

  let qa: AnalysisQAResult;
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    qa = JSON.parse(cleaned);
  } catch {
    // If QA parse fails, pass through original
    qa = { passed: true, corrections: [], missed_details: [], confidence: 50 };
  }

  // Apply corrections to analysis
  const verified = { ...analysis };
  if (!qa.passed && qa.corrections.length > 0) {
    for (const c of qa.corrections) {
      applyCorrection(verified, c.field, c.should_be);
    }
    // Add missed details
    if (qa.missed_details.length > 0) {
      verified.details = [...verified.details, ...qa.missed_details];
    }
  }

  return { verified, qa };
}

function applyCorrection(analysis: GarmentAnalysis, field: string, value: string): void {
  const parts = field.split('.');
  if (parts.length === 2 && parts[0] === 'construction') {
    const key = parts[1];
    if (key in analysis.construction) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (analysis.construction as any)[key] = value;
    }
  } else if (parts.length === 1) {
    const key = parts[0];
    if (key in analysis && typeof (analysis as unknown as Record<string, unknown>)[key] === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (analysis as any)[key] = value;
    }
  }
}

// ─── Generation QA ───────────────────────────────────────────────────────────

const GENERATION_QA_PROMPT = `You are a fashion EC quality control inspector.

You will receive:
1. Original garment product photo(s) — the REFERENCE
2. An AI-generated model wearing the garment — the OUTPUT

Compare the garment in the OUTPUT against the REFERENCE and check:

- COLOR: Same shade? No color shift?
- SILHOUETTE: Same shape, proportions, length?
- CLOSURE: Same buttons/zips count, placement, type?
- COLLAR/NECKLINE: Same shape and size?
- SLEEVES: Same length, cuff style?
- PATTERN: Same pattern, scale, direction?
- POCKETS: Same count, position, style?
- MATERIAL TEXTURE: Same apparent fabric?
- BRANDING: Logo in correct position?
- OVERALL: Would a customer recognize this as the same product?

Return JSON:
{
  "match_score": 0-100,
  "pass": true if score >= 80,
  "discrepancies": [
    {"element": "collar", "reference": "band collar", "generated": "spread collar", "severity": "high"},
    ...
  ],
  "summary": "one sentence overall assessment"
}

Severity levels: "critical" (wrong product), "high" (noticeable difference), "medium" (minor), "low" (negligible)
Return ONLY valid JSON.`;

export interface GenerationQAResult {
  match_score: number;
  pass: boolean;
  discrepancies: Array<{
    element: string;
    reference: string;
    generated: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>;
  summary: string;
}

export async function verifyGeneration(
  apiKey: string,
  referenceImageUrls: string[],
  generatedImageUrl: string,
): Promise<GenerationQAResult> {
  const client = createClient(apiKey);

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  parts.push({ text: 'REFERENCE PRODUCT PHOTOS:' });
  for (const url of referenceImageUrls) {
    try {
      const { mimeType, data } = parseBase64(url);
      parts.push({ inlineData: { mimeType, data } });
    } catch { /* skip */ }
  }

  parts.push({ text: 'AI-GENERATED OUTPUT:' });
  const { mimeType: genMime, data: genData } = parseBase64(generatedImageUrl);
  parts.push({ inlineData: { mimeType: genMime, data: genData } });

  parts.push({ text: GENERATION_QA_PROMPT });

  const raw = await callWithRetry(
    async () => {
      const response = await client.models.generateContent({
        model: GEN_CONFIG.models.flash,
        contents: [{ role: 'user', parts }],
        config: { temperature: 0.1 },
      });
      return response.text?.trim() ?? '';
    },
    2,
    'verifyGeneration',
  );

  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { match_score: 50, pass: false, discrepancies: [], summary: 'QA parse failed' };
  }
}

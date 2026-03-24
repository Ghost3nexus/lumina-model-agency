/**
 * qualityAgent.ts — Specialized subagents for the generation pipeline
 *
 * 1. verifyAnalysis: re-examines garment image against analysis JSON, catches missed details
 * 2. verifyGeneration: compares generated image to original garment reference, flags discrepancies
 * 3. createStylingDirective: pro stylist agent — decides exact wearing details for all angles
 * 4. createHairMakeupDirective: hair & makeup agent — locks look across all angles
 * 5. calculateFitting: sizing agent — computes how garment fits on model's body
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

// ─── Styling Agent ───────────────────────────────────────────────────────────

const STYLING_AGENT_PROMPT = `You are a professional fashion stylist for EC product photography.

YOUR MISSION: Make the garment look EXACTLY like the product photo, but on a living model.
You are NOT a creative stylist. You are a PRODUCT stylist. Your job is ACCURACY, not fashion.

For each garment, decide how it should be worn so that:
1. The garment's SHAPE (silhouette, hem line, collar, sleeves) is clearly visible
2. The garment's KEY DETAILS (buttons, pockets, seams, closures) are not hidden
3. The HERO product is fully visible and not obscured by other items
4. The styling is IDENTICAL across front, back, side, and bust shots

Return JSON:
{
  "per_garment": [
    {
      "category": "tops/pants/outer/dress/skirt",
      "how_to_wear": "exactly how this specific garment should be worn (e.g. 'worn naturally, untucked, falling to mid-hip, all buttons closed, sleeves at natural length showing cuffs')",
      "shape_priority": "what part of the garment's shape must be clearly visible (e.g. 'hem line must be visible, not tucked or bunched')",
      "do_not": "what to avoid (e.g. 'do not tuck in — would hide the hem detail and expose waistband of pants')"
    }
  ],
  "garment_interaction": "how the garments relate to each other (e.g. 'top falls over pants waistband, waistband not visible, top hem at mid-hip level')",
  "pose": "natural standing, arms relaxed at sides, weight evenly distributed",
  "consistency_rule": "description that locks the exact same wearing across all 4 angles"
}

CRITICAL RULES:
- If a top is not meant to be tucked (t-shirt, sweater, hoodie) → DO NOT TUCK. Let it fall naturally.
- The top's hem line and the bottom's waistband relationship must be FIXED: decide whether waistband is visible or hidden, and keep it the same in every angle
- Never create situations where the AI needs to invent details (exposed waistbands, inner labels, belt loops that weren't in the photo)
- SIMPLICITY: the most natural, clean wearing is almost always correct for EC
- Think about what a real model would do in a real studio: put the clothes on normally and stand

Return ONLY valid JSON.`;

export interface StylingDirective {
  per_garment: Array<{
    category: string;
    how_to_wear: string;
    shape_priority: string;
    do_not: string;
  }>;
  garment_interaction: string;
  pose: string;
  consistency_rule: string;
}

export async function createStylingDirective(
  apiKey: string,
  analyses: GarmentAnalysis[],
  modelDescription: string,
  heroSlot: string | null,
): Promise<StylingDirective> {
  const client = createClient(apiKey);

  const outfitDesc = analyses.map(a =>
    `${a.category}: ${a.subcategory}, ${a.color}, ${a.fit}, closure: ${a.construction?.closure ?? 'unknown'}`
  ).join('\n');

  const raw = await callWithRetry(
    async () => {
      const response = await client.models.generateContent({
        model: GEN_CONFIG.models.flash,
        contents: [{
          role: 'user',
          parts: [{ text: `${STYLING_AGENT_PROMPT}\n\nMODEL: ${modelDescription}\nHERO ITEM: ${heroSlot ?? 'none'}\n\nOUTFIT:\n${outfitDesc}` }],
        }],
        config: { temperature: 0.1 },
      });
      return response.text?.trim() ?? '';
    },
    2,
    'createStylingDirective',
  );

  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      per_garment: analyses.map(a => ({
        category: a.category,
        how_to_wear: 'worn naturally, as shown in product reference',
        shape_priority: 'full garment shape visible',
        do_not: 'do not add any details not in reference',
      })),
      garment_interaction: 'top falls naturally over bottom, waistband not exposed',
      pose: 'natural standing, arms relaxed at sides',
      consistency_rule: 'identical wearing in all angles',
    };
  }
}

// ─── Hair & Makeup Agent ─────────────────────────────────────────────────────

const HAIRMAKEUP_AGENT_PROMPT = `You are a professional hair and makeup artist for a fashion EC shoot.

Given the model's reference photos and the outfit, define the EXACT hair and makeup look
that must be IDENTICAL in every single generated image (front, back, side, bust).

Return JSON:
{
  "hair": {
    "style": "specific style (e.g. 'center-parted straight, tucked behind both ears')",
    "length_visibility": "how hair falls in relation to shoulders/face (e.g. 'past shoulders, covering collarbones')",
    "texture": "straight / wavy / curly / coily",
    "accessories": "none / hair tie / clip — with position",
    "back_view_note": "how hair appears from behind (e.g. 'falling straight down center back to mid-scapula')"
  },
  "makeup": {
    "skin": "natural / dewy / matte",
    "eyes": "minimal / soft smoky / clean liner",
    "lips": "nude / natural pink / bold red",
    "brows": "natural / groomed / bold"
  },
  "nails": "natural / nude polish / dark polish / not visible",
  "consistency_locks": [
    "hair parting must stay center in all angles",
    "no hair covering the face in any angle",
    "earrings visible in front and side views"
  ]
}

The goal is CONSISTENCY across all angles — if hair is behind ears in front, it must be behind ears in side and back too.
Return ONLY valid JSON.`;

export interface HairMakeupDirective {
  hair: Record<string, string>;
  makeup: Record<string, string>;
  nails: string;
  consistency_locks: string[];
}

export async function createHairMakeupDirective(
  apiKey: string,
  modelDescription: string,
  modelRefImageUrl?: string,
): Promise<HairMakeupDirective> {
  const client = createClient(apiKey);

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  if (modelRefImageUrl) {
    try {
      const { mimeType, data } = parseBase64(modelRefImageUrl);
      parts.push({ text: 'MODEL REFERENCE PHOTO:' });
      parts.push({ inlineData: { mimeType, data } });
    } catch { /* skip */ }
  }

  parts.push({ text: `${HAIRMAKEUP_AGENT_PROMPT}\n\nMODEL: ${modelDescription}` });

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
    'createHairMakeupDirective',
  );

  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      hair: { style: 'natural', length_visibility: 'as shown in reference', texture: 'as reference', accessories: 'none', back_view_note: 'natural fall' },
      makeup: { skin: 'natural', eyes: 'minimal', lips: 'natural', brows: 'natural' },
      nails: 'natural',
      consistency_locks: ['maintain hair and makeup identical across all angles'],
    };
  }
}

// ─── Sizing / Fitting Agent ──────────────────────────────────────────────────

const SIZING_AGENT_PROMPT = `You are a professional fashion stylist and pattern maker.

Given a garment's brand, product name, category, and a model's body measurements,
calculate EXACTLY how the garment will fit and fall on this specific model.

Use your knowledge of the brand's sizing standards. If you know the brand, use their
actual size charts. If not, use standard Japanese/international sizing.

Return JSON:
{
  "recommended_size": "S" | "M" | "L" | "XL" | etc.,
  "size_reasoning": "why this size (e.g. 'model bust 82cm, brand M chest 88-92cm = relaxed fit')",
  "fit_on_model": {
    "shoulder_fit": "how shoulders align (e.g. 'natural shoulder seam at shoulder point' or 'dropped 3cm past shoulder')",
    "chest_fit": "how chest fits (e.g. 'relaxed with 6cm ease' or 'fitted, slight pull')",
    "waist_fit": "how waist fits (e.g. 'sits at natural waist with 4cm ease')",
    "length_position": "EXACT position of hem on model's body (e.g. 'hem falls at mid-hip, 8cm below waist' or 'hits at mid-thigh')",
    "sleeve_position": "where sleeves end (e.g. 'at wrist bone' or '3cm above wrist')",
    "overall_silhouette": "how it looks on this body (e.g. 'slightly oversized through torso, skimming at hip')"
  },
  "bottom_fit": {
    "waist_rise": "where waistband sits (e.g. 'mid-rise, 3cm below navel')",
    "thigh_fit": "how thighs fit (e.g. 'relaxed with room')",
    "knee_to_hem": "leg shape below knee (e.g. 'straight from knee to ankle')",
    "hem_position": "where hem hits (e.g. 'full break at shoe, pooling slightly' or 'no break, clean at ankle')",
    "inseam_visual": "visual inseam appearance on this model's leg length"
  },
  "visual_description": "2-3 sentence description a photographer could use: how does this outfit LOOK on this specific model?"
}

Be PRECISE with measurements and positions. A stylist looking at your output should be able
to dress a mannequin identically.
Return ONLY valid JSON.`;

export interface FittingResult {
  recommended_size: string;
  size_reasoning: string;
  fit_on_model: Record<string, string>;
  bottom_fit: Record<string, string>;
  visual_description: string;
}

export async function calculateFitting(
  apiKey: string,
  analyses: GarmentAnalysis[],
  modelDescription: string,
  modelMeasurements: { height: number; bust: number; waist: number; hips: number },
  productInfo: Array<{ category: string; brandName?: string; productName?: string }>,
): Promise<FittingResult> {
  const client = createClient(apiKey);

  const garmentDesc = analyses.map((a, i) => {
    const info = productInfo[i];
    return `${a.category}: ${a.subcategory}
  brand: ${info?.brandName || 'unknown'}
  product: ${info?.productName || 'unknown'}
  fit: ${a.fit}
  length: ${a.length ?? 'unknown'}
  material: ${a.material}
  construction: collar=${a.construction?.collar}, closure=${a.construction?.closure}`;
  }).join('\n\n');

  const modelBody = `Height: ${modelMeasurements.height}cm, Bust: ${modelMeasurements.bust}cm, Waist: ${modelMeasurements.waist}cm, Hips: ${modelMeasurements.hips}cm`;

  const raw = await callWithRetry(
    async () => {
      const response = await client.models.generateContent({
        model: GEN_CONFIG.models.flash,
        contents: [{
          role: 'user',
          parts: [{ text: `${SIZING_AGENT_PROMPT}\n\nMODEL: ${modelDescription}\nBODY: ${modelBody}\n\nGARMENTS:\n${garmentDesc}` }],
        }],
        config: { temperature: 0.1 },
      });
      return response.text?.trim() ?? '';
    },
    2,
    'calculateFitting',
  );

  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      recommended_size: 'M',
      size_reasoning: 'default',
      fit_on_model: {},
      bottom_fit: {},
      visual_description: 'worn naturally as shown in product reference',
    };
  }
}

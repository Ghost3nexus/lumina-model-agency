/**
 * garmentAnalyzer.ts — Analyzes garment images using Gemini Flash
 *
 * Exported functions:
 *   analyzeGarment(apiKey, imageDataUrl) => Promise<GarmentAnalysis>
 *   analyzeOutfit(apiKey, slots) => Promise<GarmentAnalysis[]>
 */

import type { GarmentAnalysis, OutfitSlot, SlotUpload } from '../types/garment';
import {
  createClient,
  parseBase64,
  compressImage,
  callWithRetry,
  GEN_CONFIG,
} from './geminiClient';

// ─── Prompt ───────────────────────────────────────────────────────────────────

const ANALYSIS_PROMPT = `You are a professional fashion product analyst.
Analyze this garment image and return a JSON object with the following fields:

{
  "category": one of "tops" | "pants" | "dress" | "outer" | "skirt" | "shoes" | "accessories",
  "subcategory": a specific garment type (e.g. "t-shirt", "wide-leg trousers", "trench coat"),
  "color": the primary color as a single descriptive string (e.g. "ivory white", "navy blue"),
  "colors": array of all colors present (e.g. ["ivory white", "beige"]),
  "material": primary fabric/material (e.g. "100% cotton", "silk blend", "denim"),
  "pattern": surface pattern (e.g. "solid", "striped", "floral", "plaid", "graphic print"),
  "details": array of notable design details (e.g. ["patch pockets", "contrast stitching", "hidden zip"]),
  "fit": silhouette/fit description (e.g. "relaxed", "slim", "oversized", "A-line"),
  "description": a 1-2 sentence product description suitable for an EC listing
}

Return ONLY valid JSON with no markdown, no code fences, no commentary.`;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Analyzes a single garment image and returns structured metadata.
 */
export async function analyzeGarment(
  apiKey: string,
  imageDataUrl: string,
): Promise<GarmentAnalysis> {
  const compressedDataUrl = await compressImage(imageDataUrl);
  const { mimeType, data } = parseBase64(compressedDataUrl);

  const client = createClient(apiKey);

  const raw = await callWithRetry(
    async () => {
      const response = await client.models.generateContent({
        model: GEN_CONFIG.models.flash,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data,
                },
              },
              { text: ANALYSIS_PROMPT },
            ],
          },
        ],
        config: {
          temperature: GEN_CONFIG.ANALYSIS_TEMPERATURE,
        },
      });

      const text = response.text?.trim() ?? '';
      if (!text) {
        throw new Error('Gemini returned an empty response for garment analysis');
      }
      return text;
    },
    3,
    'analyzeGarment',
  );

  return parseAnalysis(raw);
}

/**
 * Analyzes all garments in the outfit slots.
 * Returns an array of GarmentAnalysis, one per filled slot.
 */
export async function analyzeOutfit(
  apiKey: string,
  slots: Partial<Record<OutfitSlot, SlotUpload>>,
): Promise<GarmentAnalysis[]> {
  const entries = Object.values(slots).filter(Boolean) as SlotUpload[];

  if (entries.length === 0) {
    throw new Error('No garment images provided for analysis');
  }

  // Analyze all slots in parallel
  const results = await Promise.allSettled(
    entries.map(entry => analyzeGarment(apiKey, entry.compressed)),
  );

  const analyses: GarmentAnalysis[] = [];
  const errors: string[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === 'fulfilled') {
      analyses.push(result.value);
    } else {
      errors.push(`${entries[i].slot}: ${result.reason instanceof Error ? result.reason.message : 'Analysis failed'}`);
    }
  }

  // If all failed, throw
  if (analyses.length === 0) {
    throw new Error(`All garment analyses failed: ${errors.join('; ')}`);
  }

  return analyses;
}

// ─── Parser ───────────────────────────────────────────────────────────────────

function parseAnalysis(raw: string): GarmentAnalysis {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Garment analysis returned invalid JSON: ${cleaned.slice(0, 200)}`);
  }

  assertGarmentAnalysis(parsed);
  return parsed;
}

// ─── Type guard ───────────────────────────────────────────────────────────────

const VALID_CATEGORIES = new Set([
  'tops', 'pants', 'dress', 'outer', 'skirt', 'shoes', 'accessories',
]);

function assertGarmentAnalysis(value: unknown): asserts value is GarmentAnalysis {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Garment analysis result is not an object');
  }

  const obj = value as Record<string, unknown>;

  if (typeof obj.category !== 'string' || !VALID_CATEGORIES.has(obj.category)) {
    throw new Error(`Invalid garment category: ${String(obj.category)}`);
  }
  if (typeof obj.subcategory !== 'string') throw new Error('Missing subcategory');
  if (typeof obj.color !== 'string') throw new Error('Missing color');
  if (!Array.isArray(obj.colors)) throw new Error('Missing colors array');
  if (typeof obj.material !== 'string') throw new Error('Missing material');
  if (typeof obj.pattern !== 'string') throw new Error('Missing pattern');
  if (!Array.isArray(obj.details)) throw new Error('Missing details array');
  if (typeof obj.fit !== 'string') throw new Error('Missing fit');
  if (typeof obj.description !== 'string') throw new Error('Missing description');
}

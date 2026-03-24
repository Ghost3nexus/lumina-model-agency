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

const ANALYSIS_PROMPT = `You are a veteran fashion product photographer and merchandiser.
Examine this garment image with extreme precision — every visible detail matters for reproduction fidelity.

Return a JSON object:

{
  "category": one of "tops" | "pants" | "dress" | "outer" | "skirt" | "shoes" | "accessories",
  "subcategory": specific garment type (e.g. "band-collar shirt", "wide-leg pleated trousers", "double-breasted trench coat"),
  "color": primary color with precise shade (e.g. "warm ivory", "deep navy", "charcoal heather grey"),
  "colors": ALL colors visible including trims, linings, contrast elements (e.g. ["charcoal grey", "cream trim", "silver hardware"]),
  "material": fabric with texture description (e.g. "heavyweight brushed cotton twill", "lightweight silk crepe de chine", "rigid selvedge denim"),
  "pattern": surface pattern with specifics (e.g. "solid", "thin navy/white pinstripe 3mm spacing", "allover micro floral on cream base"),
  "construction": {
    "collar": collar/neckline type (e.g. "spread collar with stays", "crew neck ribbed 2cm", "notch lapel 7cm width"),
    "closure": closure type and details (e.g. "7 pearl shell buttons center front", "hidden zip at left side", "double-breasted 6 buttons"),
    "sleeves": sleeve construction (e.g. "set-in long sleeve with single button cuff", "raglan 3/4 sleeve", "sleeveless"),
    "pockets": pocket details (e.g. "2 flap pockets at chest, 2 welt pockets at hip", "no visible pockets"),
    "hem": hem finish (e.g. "straight hem with side slits 8cm", "curved shirttail hem", "raw edge"),
    "seams": visible seam details (e.g. "contrast topstitching in gold thread", "French seams", "flatlock seams"),
    "lining": if visible (e.g. "fully lined", "half-lined in cupro", "unlined")
  },
  "branding": visible logos, labels, tags, embroidery text — describe position and style (e.g. "small embroidered logo left chest in tonal thread", "none visible"),
  "fit": silhouette with proportions (e.g. "relaxed straight fit, drops 2cm past natural shoulder, body skimming through torso"),
  "length": garment length description (e.g. "hip length ending at mid-hip", "midi length hitting mid-calf", "cropped at natural waist"),
  "details": array of EVERY notable design element not covered above (e.g. ["bar tacks at stress points", "interior grosgrain waistband", "horn buttons"]),
  "description": 2-3 sentence product description capturing the garment's character and key selling points
}

Be EXHAUSTIVE. If a detail is visible in the image, it MUST be in the output.
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
  // construction — accept even if missing (backward compat), fill defaults
  if (typeof obj.construction !== 'object' || obj.construction === null) {
    (obj as Record<string, unknown>).construction = {
      collar: 'unknown', closure: 'unknown', sleeves: 'unknown',
      pockets: 'unknown', hem: 'unknown', seams: 'unknown', lining: 'unknown',
    };
  }
  if (typeof obj.branding !== 'string') (obj as Record<string, unknown>).branding = 'none visible';
  if (typeof obj.length !== 'string') (obj as Record<string, unknown>).length = 'unknown';
  if (!Array.isArray(obj.details)) throw new Error('Missing details array');
  if (typeof obj.fit !== 'string') throw new Error('Missing fit');
  if (typeof obj.description !== 'string') throw new Error('Missing description');
}

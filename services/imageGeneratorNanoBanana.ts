/**
 * imageGeneratorNanoBanana.ts — Gemini-backed 2-step image generation
 *
 * Parallel implementation to the default (single-step) services/imageGenerator.ts.
 * Uses the SAME Gemini API and existing prompt engineering for step 1, then adds a
 * head-shrink edit pass to lift proportion to runway 8-to-9-head standard.
 *
 * Pipeline per call:
 *   1. Call existing generateFront/Angle → base image (7.5-head typical)
 *   2. Edit pass with the base image + "head to 85%" prompt → 8.5-head runway image
 *
 * No Replicate dependency. No extra credit. Uses the same Gemini API key as the rest
 * of the Studio, going through the existing createClient / callWithRetry helpers.
 */

import {
  createClient,
  GEN_CONFIG,
  callWithRetry,
  imageToBase64,
  parseBase64,
} from './geminiClient';
import {
  generateFront as baseGenerateFront,
  generateAngle as baseGenerateAngle,
} from './imageGenerator';
import type { GarmentAnalysis, OutfitSlot, SlotUpload } from '../types/garment';
import type { AgencyModel } from '../data/agencyModels';
import type { AngleType } from '../types/generation';
import type { StylingDirective, HairMakeupDirective, FittingResult } from './qualityAgent';

/** Fraction to shrink the head region on the runway-proportion edit pass. */
const HEAD_SHRINK_RATIO = 0.85;

const HEAD_SHRINK_PROMPT = `Edit this photograph with two linked corrections:

1. HEAD: reduce the head (including hair) to ${Math.round(
  HEAD_SHRINK_RATIO * 100,
)} percent of its current size, keeping the head centered on the same neck position. The head should appear smaller and more compact relative to the body for a natural 8.5-to-9-head runway-model proportion.

2. NECK — SHORT AND SLIGHTLY SLIM (anatomically normal, NOT elongated):
   - WIDTH: slightly narrower than the face (approximately 65-70 percent of face width).
   - LENGTH: SHORT. The visible bare neck column between the chin and the shirt collar must be NO MORE THAN 1/3 OF THE FACE HEIGHT. The chin should sit close to the shoulders and shirt collar. DO NOT elongate the neck. DO NOT increase the distance between chin and clavicle. DO NOT stretch the neck column taller. The neck should read as a normal masculine anatomical neck — NOT a long swan column, NOT a giraffe, NOT a fashion stretch.
   - Trapezius flat, shoulders drop smoothly. Keep the neck tattoo (if any) as flat ink on a slim silhouette.

Keep everything else EXACTLY the same: face identity, hair style, skin tone and texture, eyes, facial hair, tattoos, piercings, body silhouette, outfit, pose, hands, background, lighting, shadows, film grain, photographic quality. 3:4 aspect ratio.

HARD NEGATIVES: NO neck wider than face, NO bull neck, NO thick muscular neck, NO trapezius bulge, NO shrugged shoulders, NO elongated neck, NO stretched neck, NO giraffe neck, NO long swan neck, NO extra space between chin and clavicle, NO neck column longer than 1/3 of face height, NO chin floating above the collar, NO plastic skin, NO identity drift.`;

/**
 * Runs the Gemini head-shrink edit on a source image (data URL) and returns a new data URL.
 */
async function shrinkHead(apiKey: string, sourceDataUrl: string): Promise<string> {
  const base64 = await imageToBase64(sourceDataUrl);
  const { mimeType, data } = parseBase64(base64);

  const client = createClient(apiKey);
  const response = await callWithRetry(
    () =>
      client.models.generateContent({
        model: GEN_CONFIG.models.proImage,
        contents: [
          {
            role: 'user',
            parts: [
              { text: HEAD_SHRINK_PROMPT },
              { inlineData: { mimeType, data } },
            ],
          },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          temperature: GEN_CONFIG.GENERATION_TEMPERATURE,
        },
      }),
    3,
    'shrinkHead',
  );

  if (response.candidates?.[0]?.content) {
    for (const part of response.candidates[0].content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  // If the edit pass fails or returns no image, fall back to the source.
  console.warn('[nanoBanana] head-shrink returned no image; falling back to base output');
  return sourceDataUrl;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Generates a full-body front photo, then applies the head-shrink edit pass.
 */
export async function generateFront(
  apiKey: string,
  slots: Partial<Record<OutfitSlot, SlotUpload>>,
  analyses: GarmentAnalysis[],
  model: AgencyModel,
  heroSlot?: OutfitSlot | null,
  styling?: StylingDirective | null,
  hairMakeup?: HairMakeupDirective | null,
  fitting?: FittingResult | null,
  pose?: string | null,
): Promise<string> {
  const base = await baseGenerateFront(
    apiKey,
    slots,
    analyses,
    model,
    heroSlot,
    styling,
    hairMakeup,
    fitting,
    pose,
  );
  return await shrinkHead(apiKey, base);
}

/**
 * Generates an alternate-angle view. No head-shrink on angles — the front anchor
 * already has the corrected proportion which this call inherits by design.
 */
export async function generateAngle(
  apiKey: string,
  frontImageUrl: string,
  slots: Partial<Record<OutfitSlot, SlotUpload>>,
  analyses: GarmentAnalysis[],
  angle: Exclude<AngleType, 'front'>,
  styling?: StylingDirective | null,
  hairMakeup?: HairMakeupDirective | null,
  fitting?: FittingResult | null,
  heroSlot?: OutfitSlot | null,
): Promise<string> {
  return await baseGenerateAngle(
    apiKey,
    frontImageUrl,
    slots,
    analyses,
    angle,
    styling,
    hairMakeup,
    fitting,
    heroSlot,
  );
}

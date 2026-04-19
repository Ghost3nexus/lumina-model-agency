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

/** Fraction to shrink the head region on the runway-proportion edit pass.
 *  0.80 = ~20% smaller head, which lifts a typical 7-head base to ~8 heads
 *  (runway standard) while staying anatomically natural. */
const HEAD_SHRINK_RATIO = 0.80;

const HEAD_SHRINK_PROMPT = `Edit image #1 (the source photograph). TWO mandatory corrections:

1. HEAD SHRINK (PRIMARY GOAL — MUST HAPPEN): reduce the model's head (including hair) to **${Math.round(
  HEAD_SHRINK_RATIO * 100,
)} percent of its current size**. The new head MUST be visibly smaller than in the source — compare the source and render side-by-side mentally, the new head should be ${Math.round(
  (1 - HEAD_SHRINK_RATIO) * 100,
)} percent smaller. Keep the head centered above the neck. Target proportion: 8.5-to-9-head runway model silhouette. This shrink is non-negotiable — if the head in the output looks the same size as the source, the edit has failed.

2. NECK — short and slightly slim (anatomically normal, NOT elongated):
   - WIDTH: slightly narrower than the face (~65-70 percent of face width).
   - LENGTH: keep SHORT. Bare neck column between chin and shirt collar ≤ 1/3 of face height. Chin sits close to shoulders. NO elongated / stretched / giraffe neck.
   - Trapezius flat, shoulders drop smoothly.

PRESERVE FROM SOURCE (do NOT alter):
- Body from clavicles down: shirt, pants, shoes, pose, waist area, tuck/untuck state, hands, fingers, tattoos below neck
- Background, lighting, shadows, film grain, color grade
- Face identity (same person), facial hair, eye color, freckles, piercings
- Neck tattoo design: copy pixel-for-pixel from source — same silhouette, colors, ink style, placement

IMAGE #2 (when supplied) = identity reference. Use it to confirm the neck tattoo design matches the character's canon.

HARD NEGATIVES:
NO head the same size as source (must be smaller)
NO outfit restyling, NO shirt tucked in if source was untucked, NO waist changes
NO new tattoo design, NO generic bird tattoo, NO loss of colored accents
NO neck wider than face, NO bull neck, NO elongated / stretched / giraffe neck
NO plastic skin, NO identity drift, NO background changes.

3:4 aspect ratio, preserve source film grain and tone.`;

/**
 * Runs the Gemini head-shrink edit on a source image (data URL) and returns a new data URL.
 * Optionally accepts an identity reference (face-ref) to help preserve neck tattoo design.
 */
async function shrinkHead(
  apiKey: string,
  sourceDataUrl: string,
  identityRefUrl?: string,
): Promise<string> {
  const sourceBase64 = await imageToBase64(sourceDataUrl);
  const { mimeType: srcMime, data: srcData } = parseBase64(sourceBase64);

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: HEAD_SHRINK_PROMPT },
    { text: '[IMAGE #1 — SOURCE photograph to edit]:' },
    { inlineData: { mimeType: srcMime, data: srcData } },
  ];

  if (identityRefUrl) {
    try {
      const idBase64 = await imageToBase64(identityRefUrl);
      const { mimeType: idMime, data: idData } = parseBase64(idBase64);
      parts.push({ text: '[IMAGE #2 — IDENTITY REFERENCE for tattoo design canon]:' });
      parts.push({ inlineData: { mimeType: idMime, data: idData } });
    } catch {
      /* Identity ref optional; skip on load failure */
    }
  }

  const client = createClient(apiKey);
  const response = await callWithRetry(
    () =>
      client.models.generateContent({
        model: GEN_CONFIG.models.proImage,
        contents: [{ role: 'user', parts }],
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
  const identityRef = model.studioRefs?.[0] ?? model.images.main;
  return await shrinkHead(apiKey, base, identityRef);
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

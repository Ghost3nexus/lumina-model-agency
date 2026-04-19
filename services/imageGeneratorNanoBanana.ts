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

const HEAD_SHRINK_PROMPT = `Edit image #1 (the source photograph) to achieve an **8.5-to-9-head runway model proportion**.

PRIMARY GOAL — STRETCH THE BODY, KEEP THE HEAD:
Keep the head (including hair) at the SAME SIZE as in the source image — do NOT shrink the head in absolute pixels.
**Extend the body downward**: make the torso and legs proportionally LONGER so the total figure reads as 8.5-to-9 heads tall. Shoulders-to-floor distance should be roughly 7.5 head-heights. Legs alone (crotch to floor) should be roughly 50 percent of the full figure — visibly LONGER than in the source.
Recompose the frame so the extended figure fills 90 percent of the frame height (top of head at 5 percent from top, feet at 95 percent from top). The model must read as a tall slender runway model, not average human.

NECK — short and slightly slim:
- WIDTH: ~65-70 percent of face width. Slightly narrower than face.
- LENGTH: keep SHORT. Bare neck column between chin and shirt collar ≤ 1/3 of face height.
- Trapezius flat, shoulders drop smoothly. NO elongated / giraffe neck.

PRESERVE FROM SOURCE (do NOT alter, just scale vertically with the body):
- Face identity (same person), facial hair, eye color, freckles, piercings
- Shirt style + tuck state + hem position relative to waistband — if untucked in source, stay untucked
- Pants style + waistband position, shoes, pose, hands
- Neck tattoo design pixel-for-pixel (same silhouette, colors, ink style, right-side placement)
- Background, lighting, shadows, film grain, color grade

IMAGE #2 (when supplied) = identity reference. Use it to confirm face + neck tattoo design match the character canon.

HARD NEGATIVES:
NO same proportions as source (figure MUST be taller/slimmer — if result still looks 7-head like the source, the edit failed)
NO head visibly shrunken in isolation (approach is body-stretch, not head-shrink)
NO short legs, NO 短足, NO average human proportion
NO outfit restyling, NO shirt tucked in if source was untucked
NO new tattoo design, NO generic bird, NO loss of color accents
NO bull neck, NO elongated / stretched / giraffe neck
NO plastic skin, NO identity drift, NO background changes, NO subject smaller in frame than source.

3:4 aspect ratio, preserve source film grain and Kodak Portra tone.`;

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

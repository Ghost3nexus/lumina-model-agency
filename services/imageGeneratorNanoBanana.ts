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

const HEAD_SHRINK_PROMPT = `Edit image #1 (the source photograph) with ONLY these two head-region corrections. **Do NOT regenerate, alter, or restyle anything from the neck down — shirt, pants, shoes, pose, waist area, outfit, tattoos below the neck, hands, background, lighting, grain — all must be pixel-level identical to the source.**

1. HEAD: reduce the head (including hair) to ${Math.round(
  HEAD_SHRINK_RATIO * 100,
)} percent of its current size, keeping the head centered on the same neck position. The head should appear smaller and more compact relative to the body for a natural 8.5-to-9-head runway-model proportion.

2. NECK — SHORT AND SLIGHTLY SLIM (anatomically normal, NOT elongated):
   - WIDTH: slightly narrower than the face (approximately 65-70 percent of face width).
   - LENGTH: SHORT. The visible bare neck column between the chin and the shirt collar must be NO MORE THAN 1/3 OF THE FACE HEIGHT. The chin should sit close to the shoulders and shirt collar. DO NOT elongate the neck. DO NOT increase the distance between chin and clavicle. DO NOT stretch the neck column taller.
   - Trapezius flat, shoulders drop smoothly.

NECK TATTOO PRESERVATION:
If the source image shows a tattoo on the neck, **copy that exact tattoo design from image #1 pixel-for-pixel onto the resized neck — same silhouette, same colors, same ink style, same placement on the right side**. Image #2 (when supplied) is the identity reference: use it to double-check the tattoo design matches the character's canon. Do NOT invent a new tattoo. Do NOT change the bird species. Do NOT change ink colors. Do NOT redraw the design in a generic style.

SHIRT/OUTFIT PRESERVATION:
Keep the shirt exactly as it appears in image #1. If it is UNTUCKED in image #1 it MUST remain UNTUCKED (hem loose over waistband). If it is open-collar, stays open-collar. Do not tuck it in. Do not restyle the waist. The body from the clavicles down must be indistinguishable from the source image.

Final constraints: 3:4 aspect ratio, same film grain, same Kodak Portra tone curve as the source.

HARD NEGATIVES: NO outfit restyling, NO shirt tucked in (if source was untucked), NO waistline changes, NO new tattoo design, NO generic bird tattoo, NO loss of yellow/color accents in the neck tattoo, NO neck wider than face, NO bull neck, NO elongated neck, NO giraffe neck, NO plastic skin, NO identity drift.`;

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

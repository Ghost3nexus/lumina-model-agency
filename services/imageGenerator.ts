/**
 * imageGenerator.ts — EC fashion photography generation
 *
 * Generates professional EC product images using Gemini 3 Pro Image Preview.
 * Supports full outfit coordination with multiple garment reference images.
 * - generateFront: produces a full-body front shot from outfit slots + model profile
 * - generateAngle: produces back / side / bust from the front anchor + outfit
 */

import { createClient, GEN_CONFIG, callWithRetry, imageToBase64, parseBase64 } from './geminiClient';
import type { GarmentAnalysis, OutfitSlot, SlotUpload } from '../types/garment';
import type { AgencyModel } from '../data/agencyModels';
import type { AngleType } from '../types/generation';
import type { StylingDirective, HairMakeupDirective, FittingResult } from './qualityAgent';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function buildModelDescription(model: AgencyModel): string {
  return [
    `height ${model.height}cm`,
    `B${model.measurements.bust}/W${model.measurements.waist}/H${model.measurements.hips}`,
    `${model.hair} hair`,
    `${model.eyes} eyes`,
    `vibe: ${model.vibe}`,
  ].join(', ');
}

function buildGarmentDescription(analysis: GarmentAnalysis): string {
  const c = analysis.construction;
  const constructionDetails = c ? [
    c.collar !== 'unknown' ? `collar: ${c.collar}` : '',
    c.closure !== 'unknown' ? `closure: ${c.closure}` : '',
    c.sleeves !== 'unknown' ? `sleeves: ${c.sleeves}` : '',
    c.pockets !== 'unknown' ? `pockets: ${c.pockets}` : '',
    c.hem !== 'unknown' ? `hem: ${c.hem}` : '',
    c.seams !== 'unknown' ? `seams: ${c.seams}` : '',
    c.lining !== 'unknown' ? `lining: ${c.lining}` : '',
  ].filter(Boolean).join('; ') : '';

  const extras = analysis.details.length > 0 ? `details: ${analysis.details.join(', ')}` : '';
  const branding = analysis.branding && analysis.branding !== 'none visible' ? `branding (front only): ${analysis.branding}` : '';

  return [
    analysis.description,
    `color: ${analysis.color} (all colors: ${analysis.colors.join(', ')})`,
    `material: ${analysis.material}`,
    `pattern: ${analysis.pattern}`,
    `fit: ${analysis.fit}`,
    `length: ${analysis.length ?? ''}`,
    constructionDetails,
    extras,
    branding,
  ].filter(Boolean).join('\n  ');
}

export function buildOutfitDescription(analyses: GarmentAnalysis[]): string {
  if (analyses.length === 1) {
    return buildGarmentDescription(analyses[0]);
  }
  return analyses.map((a, i) => `Item ${i + 1} (${a.category}): ${buildGarmentDescription(a)}`).join('\n');
}

type ImagePart = { text: string } | { inlineData: { mimeType: string; data: string } };

/**
 * Collect slot images as labeled parts for the API.
 *
 * @param includeExtras - If false (default), only primary (front) images are sent.
 *   Set to true ONLY for back-angle generation where back/detail views are relevant.
 *   Sending back-view images during front generation causes tags/labels to bleed through.
 */
export async function buildSlotImageParts(
  slots: Partial<Record<OutfitSlot, SlotUpload>>,
  includeExtras = false,
): Promise<ImagePart[]> {
  const entries = Object.values(slots).filter(Boolean) as SlotUpload[];
  const parts: ImagePart[] = [];

  for (const entry of entries) {
    // Primary image — always the FRONT view
    parts.push({ text: `[${entry.slot.toUpperCase()} — FRONT VIEW (primary reference)]` });
    const base64 = await imageToBase64(entry.compressed);
    const { mimeType, data } = parseBase64(base64);
    parts.push({ inlineData: { mimeType, data } });

    // Extra images — ONLY included for back-angle generation
    if (includeExtras) {
      for (let i = 0; i < (entry.extraImages ?? []).length; i++) {
        const extra = entry.extraImages![i];
        parts.push({ text: `[${entry.slot.toUpperCase()} — BACK/DETAIL VIEW #${i + 1}]` });
        const extraBase64 = await imageToBase64(extra.compressed);
        const { mimeType: eMime, data: eData } = parseBase64(extraBase64);
        parts.push({ inlineData: { mimeType: eMime, data: eData } });
      }
    }
  }

  return parts;
}

/** Load model reference images for face consistency */
export async function buildModelRefParts(
  model: AgencyModel,
): Promise<Array<{ inlineData: { mimeType: string; data: string } }>> {
  const refUrls = Object.values(model.images);
  const parts: Array<{ inlineData: { mimeType: string; data: string } }> = [];

  for (const url of refUrls) {
    try {
      const base64 = await imageToBase64(url);
      const { mimeType, data } = parseBase64(base64);
      parts.push({ inlineData: { mimeType, data } });
    } catch {
      // Skip if reference image can't be loaded
    }
  }

  return parts;
}

// ─── Styling Rules (hero-based) ──────────────────────────────────────────────

const HERO_STYLING: Record<string, string> = {
  tops: `STYLING — TOP is the HERO product:
- Shirt/top worn naturally, NOT tucked in
- Buttons as shown in reference (do not change)
- Full top visible from collar to hem
- Bottom: simple complementary pants, not the focus`,

  pants: `STYLING — PANTS are the HERO product:
- Full leg silhouette visible from waist to ankle/hem
- Shoes visible at bottom
- Top worn UNTUCKED, falling naturally over the waistband
- DO NOT tuck the top into the pants. NEVER. No exceptions.
- Show pants silhouette through the natural drape of the untucked top`,

  outer: `STYLING — OUTERWEAR is the HERO product:
- Jacket/coat worn CLOSED (buttoned/zipped) to show silhouette
- Collar, shoulders, and structure clearly visible
- Inner layers should not distract from outerwear shape`,

  dress: `STYLING — DRESS is the HERO product:
- Dress shown in full from neckline to hem
- Natural drape and silhouette visible
- No heavy layering that obscures the dress`,

  skirt: `STYLING — SKIRT is the HERO product:
- Full skirt length and silhouette shown
- Top worn UNTUCKED, falling naturally
- DO NOT tuck the top into the skirt`,
};

const SUPPORTING_STYLING: Record<string, string> = {
  tops: 'Supporting top: worn naturally, untucked, not the focus',
  pants: 'Supporting pants: simple styling, waist can be partially hidden',
  outer: 'Supporting outerwear: worn OPEN to show hero item underneath',
};

/** Extract back-only details from analyses for injection into ABSOLUTE PROHIBITIONS */
function buildBackOnlyProhibitions(analyses: GarmentAnalysis[]): string {
  const items: string[] = [];
  for (const a of analyses) {
    const backOnly = (a as unknown as Record<string, unknown>).back_only_details;
    if (Array.isArray(backOnly) && backOnly.length > 0) {
      items.push(`${a.category}: ${backOnly.join(', ')}`);
    }
  }
  if (items.length === 0) return '';
  return `- THESE SPECIFIC DETAILS EXIST ONLY ON THE BACK/INSIDE AND MUST NOT APPEAR ON THE FRONT:\n  ${items.join('\n  ')}`;
}

/** Always-on styling rule regardless of heroSlot */
const UNIVERSAL_STYLING = `UNIVERSAL STYLING RULE:
- The top is ALWAYS worn UNTUCKED. The hem falls naturally over the waistband.
- NEVER tuck the top into pants or skirt. Not for hoodies, not for shirts, not for any garment.
- The waistband of the bottom garment should NOT be visible — it is covered by the top's natural drape.`;

function buildStylingPrompt(heroSlot: OutfitSlot | null, analyses: GarmentAnalysis[]): string {
  if (!heroSlot) return UNIVERSAL_STYLING;

  const heroRule = HERO_STYLING[heroSlot] || '';
  const supportingRules = analyses
    .filter(a => a.category !== heroSlot)
    .map(a => SUPPORTING_STYLING[a.category] || '')
    .filter(Boolean)
    .join('\n');

  return `${UNIVERSAL_STYLING}

${heroRule}
${supportingRules ? '\n' + supportingRules : ''}

IMPORTANT: The ${heroSlot.toUpperCase()} is the HERO PRODUCT being sold. All styling prioritizes showcasing this item.`;
}

function buildDirectivePrompt(
  styling?: StylingDirective | null,
  hairMakeup?: HairMakeupDirective | null,
): string {
  const sections: string[] = [];

  if (styling) {
    const lines: string[] = ['STYLING DIRECTIVE (IDENTICAL in every angle — this is calculated, not guessed):'];

    if (styling.per_garment?.length) {
      for (const g of styling.per_garment) {
        lines.push(`  [${g.category}]`);
        lines.push(`    How to wear: ${g.how_to_wear}`);
        lines.push(`    Shape priority: ${g.shape_priority}`);
        lines.push(`    DO NOT: ${g.do_not}`);
      }
    }
    if (styling.garment_interaction) {
      lines.push(`  Garment interaction: ${styling.garment_interaction}`);
    }
    if (styling.pose) {
      lines.push(`  Pose: ${styling.pose}`);
    }
    if (styling.consistency_rule) {
      lines.push(`  Lock: ${styling.consistency_rule}`);
    }
    sections.push(lines.join('\n'));
  }

  if (hairMakeup) {
    const lines: string[] = ['HAIR & MAKEUP LOCK (must be IDENTICAL in every angle):'];
    if (hairMakeup.hair) {
      for (const [key, val] of Object.entries(hairMakeup.hair)) {
        lines.push(`  Hair ${key}: ${val}`);
      }
    }
    if (hairMakeup.makeup) {
      for (const [key, val] of Object.entries(hairMakeup.makeup)) {
        lines.push(`  Makeup ${key}: ${val}`);
      }
    }
    if (hairMakeup.nails) lines.push(`  Nails: ${hairMakeup.nails}`);
    if (hairMakeup.consistency_locks?.length) {
      lines.push('  CONSISTENCY RULES:');
      for (const lock of hairMakeup.consistency_locks) {
        lines.push(`    - ${lock}`);
      }
    }
    sections.push(lines.join('\n'));
  }

  return sections.join('\n\n');
}

const ANGLE_INSTRUCTIONS: Record<Exclude<AngleType, 'front'>, string> = {
  back: 'Model turned 180 degrees, complete back view',
  side: 'Model at 3/4 angle (~45 degrees), show silhouette',
  bust: 'Upper body close-up from chest to head, show fabric texture and face',
};

/** When pants/skirt is the hero, the "bust" slot becomes a lower-body detail shot */
const BOTTOM_HERO_SLOTS = new Set(['pants', 'skirt']);

function getAngleInstruction(angle: Exclude<AngleType, 'front'>, heroSlot?: OutfitSlot | null): string {
  if (angle === 'bust' && heroSlot && BOTTOM_HERO_SLOTS.has(heroSlot)) {
    return 'Lower body close-up from waist to shoes — show waistband, fabric texture, pocket details, hem, and leg silhouette. This is a PRODUCT DETAIL shot of the pants/skirt. Face is NOT required.';
  }
  return ANGLE_INSTRUCTIONS[angle];
}

// ─── generateFront ────────────────────────────────────────────────────────────

/**
 * Generates a professional full-body front EC photo for the given outfit and model.
 *
 * @param apiKey    - Gemini API key
 * @param slots     - All outfit slot uploads (garment reference images)
 * @param analyses  - Structured garment analyses for each slot
 * @param model     - Model profile to use
 * @returns         - Data URL of the generated front image (PNG)
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
): Promise<string> {
  const [garmentParts, modelRefParts] = await Promise.all([
    buildSlotImageParts(slots),
    buildModelRefParts(model),
  ]);

  const modelDesc = buildModelDescription(model);
  const outfitDesc = buildOutfitDescription(analyses);

  const slotCount = Object.keys(slots).length;

  const stylingPrompt = buildStylingPrompt(heroSlot ?? null, analyses);
  const directivePrompt = buildDirectivePrompt(styling, hairMakeup);
  const fittingPrompt = fitting ? `
FITTING CALCULATION (computed from brand sizing × model body measurements):
Size: ${fitting.recommended_size} (${fitting.size_reasoning})
${Object.entries(fitting.fit_on_model).map(([k, v]) => `  ${k}: ${v}`).join('\n')}
${Object.entries(fitting.bottom_fit).map(([k, v]) => `  ${k}: ${v}`).join('\n')}
Visual: ${fitting.visual_description}
These measurements are CALCULATED, not guessed. The garment MUST fall exactly as described.` : '';

  const prompt = `Professional EC fashion photography, ZARA / NET-A-PORTER quality.

MODEL IDENTITY (LOCKED — use the EXACT person shown in the model reference photos below):
${modelDesc}
The model reference photos establish the face, bone structure, skin, and hair. Every facial feature must match precisely.

OUTFIT (match garment reference images EXACTLY):
${outfitDesc}

${stylingPrompt}

PHOTOGRAPHY DIRECTION:
- OUTPUT IMAGE MUST BE 3:4 PORTRAIT ASPECT RATIO (e.g. 768x1024 or 1536x2048). This is non-negotiable.
- FULL BODY shot — head to toe, including feet and shoes. DO NOT crop at ankles or calves.
- Leave breathing room above the head and below the feet
- Clean studio background
- DIRECTIONAL studio lighting from 45 degrees with visible shadows — shadow ratio 1:2.5 to 1:3
- Light must create visible shadows on the body and garments that reveal fabric folds and 3D shape
- NO flat/uniform lighting. NO shadowless setup.
- NO blown highlights — fabric texture must remain visible
- Natural, confident standing pose
- The top is ALWAYS worn UNTUCKED — hem falls naturally over the waistband. NEVER tuck the top in.
- Each garment must match its FRONT VIEW reference image in color, material, pattern, and silhouette
- Unfilled outfit pieces: complement with neutral basics
- Photorealistic, commercial EC quality

ABSOLUTE PROHIBITIONS:
- DO NOT add ANY logos, text, graphics, prints, branding, waistband tapes, belt loops, or decorative elements that are NOT visible in the FRONT reference images
- If the garment is plain/solid in the FRONT reference, it MUST remain plain/solid
- DO NOT hallucinate brand names, tags, labels, inner waistbands, or surface decoration
- DO NOT render back-side elements on the front: neck tags, care labels, back yoke details, back prints — these belong ONLY on back views
- The waist area between top and bottom garments must be clean — no invented tapes, stripes, or bands
- If a detail is not in the FRONT reference photo, it does not exist on the front. Period.
- NEVER tuck the top into the pants/skirt. The top hem must fall naturally over the waistband.
${buildBackOnlyProhibitions(analyses)}

CRITICAL: The person must be IDENTICAL to the model reference photos. Garments must match product reference images exactly — add nothing, remove nothing. The image MUST show the COMPLETE body from head to toe.
${fittingPrompt}
${directivePrompt}`;

  const client = createClient(apiKey);

  // Build parts: prompt → model references → garment references
  const allParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: prompt },
  ];

  if (modelRefParts.length > 0) {
    allParts.push({ text: `MODEL REFERENCE PHOTOS (${modelRefParts.length} images — this is the person):` });
    allParts.push(...modelRefParts);
  }

  allParts.push({ text: `GARMENT REFERENCE PHOTOS (${slotCount} items — these are the products):` });
  allParts.push(...garmentParts);

  const response = await callWithRetry(
    () =>
      client.models.generateContent({
        model: GEN_CONFIG.models.proImage,
        contents: [{ role: 'user', parts: allParts }],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          temperature: GEN_CONFIG.GENERATION_TEMPERATURE,
        },
      }),
    3,
    'generateFront',
  );

  if (response.candidates?.[0]?.content) {
    for (const part of response.candidates[0].content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  throw new Error('No image returned from generateFront');
}

// ─── generateAngle ────────────────────────────────────────────────────────────

/**
 * Generates an alternate angle view using the front image as an anchor.
 *
 * @param apiKey        - Gemini API key
 * @param frontImageUrl - Data URL of the already-generated front image (anchor)
 * @param slots         - All outfit slot uploads (garment reference images)
 * @param analyses      - Structured garment analyses
 * @param angle         - Which angle to generate: 'back' | 'side' | 'bust'
 * @returns             - Data URL of the generated angle image (PNG)
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
  const [frontBase64Url, slotImageParts] = await Promise.all([
    imageToBase64(frontImageUrl),
    buildSlotImageParts(slots, angle === 'back'),  // Only include back/detail images for back angle
  ]);
  const { mimeType: frontMime, data: frontData } = parseBase64(frontBase64Url);

  const outfitDesc = buildOutfitDescription(analyses);
  const angleInstruction = getAngleInstruction(angle, heroSlot);

  // Build branding info from analyses to prevent hallucinated logos
  const brandingInfo = analyses.map(a => {
    const b = a.branding ?? 'none visible';
    return `${a.category}: branding=${b}`;
  }).join('; ');

  const prompt = `Generate the ${angle.toUpperCase()} view of the SAME model wearing the SAME outfit.

FRONT VIEW ANCHOR (first image): Same model, same outfit, same studio.
GARMENT REFERENCES (remaining images): Match each garment exactly — ${outfitDesc}

ANGLE: ${angleInstruction}

PHOTOGRAPHY:
- OUTPUT IMAGE MUST BE 3:4 PORTRAIT ASPECT RATIO (e.g. 768x1024 or 1536x2048). Same ratio as the front image.
- Same studio background as front reference
- Same directional lighting, shadow ratio 1:2.5 to 1:3
- NO flat lighting, NO blown highlights
- Photorealistic EC quality

ABSOLUTE PROHIBITIONS:
- DO NOT add ANY logos, text, graphics, branding, waistband tapes, belt loops, or decorative elements that are NOT in the reference images
- DO NOT invent back prints, tags, labels, embroidery, or inner waistbands that don't exist in the product photos
- If the garment is plain in the reference, it MUST be plain in ALL angles — front, back, side, bust
- The waist area between top and bottom must be clean — no invented tapes, stripes, or bands
- Branding from analysis: ${brandingInfo}
- If branding says "none visible", the garment must have ZERO logos/text/decoration from every angle
- If a detail is not in the reference photo, it does not exist. Period.

STYLING RULE: The top MUST be worn UNTUCKED in every angle, exactly as shown in the front view. DO NOT tuck the top into pants or skirt. The styling must be IDENTICAL to the front image.

CRITICAL: Model identity and outfit must be consistent with the front view. Every garment detail must match the reference photos EXACTLY — add nothing, remove nothing.
${fitting ? `\nFITTING (same as front — computed, not guessed): ${fitting.visual_description}` : ''}
${buildDirectivePrompt(styling, hairMakeup)}`;

  const client = createClient(apiKey);

  const response = await callWithRetry(
    () =>
      client.models.generateContent({
        model: GEN_CONFIG.models.proImage,
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            { text: '[FRONT VIEW ANCHOR — same model, same outfit]:' },
            { inlineData: { mimeType: frontMime, data: frontData } },
            ...slotImageParts,
          ],
        }],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          temperature: GEN_CONFIG.GENERATION_TEMPERATURE,
        },
      }),
    3,
    `generateAngle:${angle}`,
  );

  if (response.candidates?.[0]?.content) {
    for (const part of response.candidates[0].content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  throw new Error(`No image returned from generateAngle:${angle}`);
}

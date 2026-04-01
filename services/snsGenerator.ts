/**
 * snsGenerator.ts — SNS Creative Mode image generation
 *
 * Generates one SNS creative image per variation using a scene preset and
 * variation-specific camera/composition rules. Uses a higher temperature
 * (SNS_TEMPERATURE = 0.6) than EC generation to allow more creative diversity.
 */

import { createClient, GEN_CONFIG, callWithRetry, parseBase64 } from './geminiClient';
import {
  buildModelDescription,
  buildOutfitDescription,
  buildSlotImageParts,
  buildModelRefParts,
} from './imageGenerator';
import type { GarmentAnalysis, OutfitSlot, SlotUpload } from '../types/garment';
import type { AgencyModel } from '../data/agencyModels';
import type { StylingDirective, HairMakeupDirective, FittingResult } from './qualityAgent';
import {
  VARIATION_CAMERAS,
  ASPECT_RATIO_PIXELS,
  type SNSCreativeConfig,
  type VariationType,
} from '../types/sns';

// ─── Prompt injection filter ──────────────────────────────────────────────────

const INJECTION_PATTERNS = [
  /ignore\s+previous/i,
  /system\s+prompt/i,
  /you\s+are\s+/i,
  /forget\s+your\s+instructions/i,
  /disregard\s+(all|previous|prior)/i,
  /act\s+as\s+/i,
  /jailbreak/i,
  /override\s+/i,
];

const MAX_CUSTOM_PROMPT_CHARS = 500;

function sanitizeCustomPrompt(input: string): string {
  const trimmed = input.slice(0, MAX_CUSTOM_PROMPT_CHARS);
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      throw new Error('Custom prompt contains disallowed content.');
    }
  }
  return trimmed;
}

// ─── Main generator ───────────────────────────────────────────────────────────

/**
 * Generates a single SNS creative image for the given variation.
 *
 * @returns `data:image/png;base64,{data}` string
 */
export async function generateSNSCreative(
  apiKey: string,
  slots: Partial<Record<OutfitSlot, SlotUpload>>,
  analyses: GarmentAnalysis[],
  model: AgencyModel,
  config: SNSCreativeConfig,
  variation: VariationType,
  styling?: StylingDirective | null,
  hairMakeup?: HairMakeupDirective | null,
  fitting?: FittingResult | null,
): Promise<string> {
  const { scene, customPrompt, aspectRatio } = config;
  const pixels = ASPECT_RATIO_PIXELS[aspectRatio];
  const varCamera = VARIATION_CAMERAS[variation];

  // Sanitize optional user prompt
  const safeCustomPrompt = customPrompt ? sanitizeCustomPrompt(customPrompt) : null;

  // Build text sections
  const modelDesc = buildModelDescription(model);
  const outfitDesc = buildOutfitDescription(analyses);

  // Fitting description if available
  const fittingSection =
    fitting?.visual_description
      ? `\nFITTING NOTES:\n${fitting.visual_description}`
      : '';

  // Styling directive section
  let stylingSection = '';
  if (styling || hairMakeup) {
    const lines: string[] = [];
    if (styling?.pose) lines.push(`Pose: ${styling.pose}`);
    if (styling?.garment_interaction) lines.push(`Garment interaction: ${styling.garment_interaction}`);
    if (hairMakeup?.hair) lines.push(`Hair: ${hairMakeup.hair}`);
    if (hairMakeup?.makeup) lines.push(`Makeup: ${hairMakeup.makeup}`);
    if (lines.length > 0) {
      stylingSection = `\nSTYLING & BEAUTY:\n${lines.join('\n')}`;
    }
  }

  const promptText = [
    `Professional fashion photography. ${scene.name} style.`,
    '',
    'MODEL IDENTITY (LOCKED — use the EXACT person shown in the model reference photos below):',
    modelDesc,
    '',
    'OUTFIT (match garment reference images EXACTLY):',
    outfitDesc,
    '',
    'SCENE DIRECTION:',
    scene.direction,
    safeCustomPrompt ? `Additional direction: ${safeCustomPrompt}` : null,
    '',
    'CAMERA & COMPOSITION:',
    `${varCamera.camera}. ${varCamera.composition}.`,
    '',
    'PHOTOGRAPHY:',
    `- Output image MUST be ${aspectRatio} aspect ratio (${pixels.width}x${pixels.height} pixels)`,
    '- Photorealistic, indistinguishable from real photography',
    '- Model must be naturally integrated into the scene',
    '- Garment colors, materials, patterns must match reference exactly',
    '- Natural shadows and reflections consistent with the scene environment',
    '',
    'ABSOLUTE PROHIBITIONS:',
    '- DO NOT add ANY logos, text, graphics, prints, branding not in the reference images',
    '- DO NOT hallucinate brand names, tags, labels, decoration',
    '- DO NOT render back-side elements (neck tags, care labels) on visible surfaces',
    '- If a detail is not in the reference photo, it does not exist',
    stylingSection || null,
    fittingSection || null,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');

  // Build image parts: model refs first, then garment refs
  const [modelRefParts, garmentRefParts] = await Promise.all([
    buildModelRefParts(model),
    buildSlotImageParts(slots),
  ]);

  const contents = [
    { text: promptText },
    ...modelRefParts,
    ...garmentRefParts,
  ];

  const ai = createClient(apiKey);

  const result = await callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: GEN_CONFIG.models.proImage,
      contents: [{ role: 'user', parts: contents }],
      config: {
        temperature: GEN_CONFIG.SNS_TEMPERATURE,
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    const candidates = response.candidates ?? [];
    for (const candidate of candidates) {
      for (const part of candidate.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType ?? 'image/png';
          const { data } = parseBase64(`data:${mimeType};base64,${part.inlineData.data}`);
          return `data:image/png;base64,${data}`;
        }
      }
    }

    throw new Error('No image data returned from Gemini API');
  });

  return result;
}

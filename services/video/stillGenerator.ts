/**
 * stillGenerator.ts — Still image generation for Video Studio
 *
 * Thin wrapper around Gemini for generating video-oriented stills.
 * Does NOT modify existing imageGenerator.ts — uses Gemini client directly.
 */

import { createClient, GEN_CONFIG, callWithRetry, parseBase64 } from '../geminiClient';
import type { AgencyModel } from '../../data/agencyModels';
import { buildModelDescription } from '../imageGenerator';

function getApiKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('VITE_GEMINI_API_KEY not configured');
  return key;
}

export interface StillInput {
  model: AgencyModel;
  scenePrompt: string;
  garmentImage?: string; // base64 data URL
  aspectRatio?: '16:9' | '9:16' | '1:1';
}

/**
 * Generate a high-quality still image for I2V conversion.
 * Optimized for video: natural pose, motion-ready composition.
 */
export async function generateStill(input: StillInput): Promise<string> {
  const client = createClient(getApiKey());
  const modelDesc = buildModelDescription(input.model);

  const prompt = buildVideoStillPrompt(modelDesc, input.scenePrompt, input.aspectRatio);

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: prompt },
  ];

  // Include model reference images for face consistency
  for (const url of Object.values(input.model.images)) {
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('FileReader failed'));
        reader.readAsDataURL(blob);
      });
      const { mimeType, data } = parseBase64(base64);
      parts.push({ inlineData: { mimeType, data } });
    } catch {
      // skip if ref image not loadable
    }
  }

  // Include garment image if provided
  if (input.garmentImage) {
    parts.push({ text: '[GARMENT REFERENCE]' });
    const { mimeType, data } = parseBase64(input.garmentImage);
    parts.push({ inlineData: { mimeType, data } });
  }

  const result = await callWithRetry(async () => {
    const response = await client.models.generateContent({
      model: GEN_CONFIG.models.proImage,
      contents: [{ role: 'user', parts }],
      config: {
        temperature: GEN_CONFIG.GENERATION_TEMPERATURE,
        responseModalities: ['image', 'text'],
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error('No content in Gemini response');
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error('No image in Gemini response');
  }, 2, 'Video still generation');

  return result;
}

function buildVideoStillPrompt(
  modelDesc: string,
  scenePrompt: string,
  aspectRatio?: string,
): string {
  const ratio = aspectRatio ?? '9:16';
  const orientation = ratio === '9:16' ? 'vertical/portrait' : ratio === '16:9' ? 'horizontal/landscape' : 'square';

  return `Generate a photorealistic fashion photograph for video conversion.

MODEL: ${modelDesc}
SCENE: ${scenePrompt}
ORIENTATION: ${orientation} (${ratio})

REQUIREMENTS:
- Photorealistic, NOT AI-looking
- Natural pose that implies motion (not stiff or robotic)
- Directional lighting with shadow ratio 1:2.5-1:3
- No blown highlights, fabric texture must be visible
- Composition leaves room for natural movement
- Expression with life and energy
- High resolution, sharp focus on the model

This still will be converted to video — the pose should feel like a frozen moment in motion, not a static portrait.`;
}

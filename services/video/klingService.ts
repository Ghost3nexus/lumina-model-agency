/**
 * klingService.ts — Kling v2.1 I2V (Image-to-Video) via Replicate
 *
 * Converts a still image into a 5/10-second video clip.
 * Routes through Replicate (US) to avoid direct access to Chinese services.
 */

import { createPrediction, pollPrediction, cancelPrediction } from './replicateClient';
import { DEFAULT_NEGATIVE_PROMPT } from '../../data/video/motionPresets';

const KLING_MODEL = 'kwaivgi/kling-v2.1';

export interface KlingInput {
  /** Base64 data URL of the source still image */
  startImage: string;
  /** Motion/action prompt */
  prompt: string;
  /** Negative prompt */
  negativePrompt?: string;
  /** Duration in seconds (5 or 10) */
  duration?: 5 | 10;
  /** Aspect ratio */
  aspectRatio?: '16:9' | '9:16' | '1:1';
}

export interface KlingResult {
  videoUrl: string;
  predictionId: string;
}

/**
 * Start I2V generation and poll until complete.
 */
export async function generateVideo(
  input: KlingInput,
  onProgress?: (status: string) => void,
): Promise<KlingResult> {
  const prediction = await createPrediction(KLING_MODEL, {
    start_image: input.startImage,
    prompt: input.prompt,
    negative_prompt: input.negativePrompt ?? DEFAULT_NEGATIVE_PROMPT,
    duration: input.duration ?? 5,
    aspect_ratio: input.aspectRatio ?? '9:16',
  });

  if (prediction.error) {
    throw new Error(`Kling API error: ${prediction.error}`);
  }

  onProgress?.('submitted');

  const result = await pollPrediction(prediction.id, {
    intervalMs: 5000,
    timeoutMs: 300_000,
    onProgress,
  });

  const videoUrl = typeof result.output === 'string'
    ? result.output
    : result.output?.[0];

  if (!videoUrl) {
    throw new Error('No video URL in Kling response');
  }

  return { videoUrl, predictionId: prediction.id };
}

export { cancelPrediction };

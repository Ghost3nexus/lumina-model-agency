/**
 * seedanceService.ts — Seedance 2.0 I2V via Runway API
 *
 * Cinematic-grade image-to-video generation.
 * ByteDance's Seedance 2.0 hosted on Runway (released 2026-04-17).
 *
 * Positioning vs klingService:
 *   - Seedance: movie-grade tone, 4-15s, $0.13/sec → Hero videos, campaign keyframes
 *   - Kling:    volume-friendly, 5 or 10s, lower cost → SNS shorts, iteration
 *
 * Interface mirrors klingService.generateVideo so pipeline.ts can swap via a flag.
 */

import {
  createImageToVideoTask,
  pollTask,
  cancelTask,
  type RunwayTaskStatus,
} from './runwayClient';
import { DEFAULT_NEGATIVE_PROMPT } from '../../data/video/motionDictionary';

const SEEDANCE_MODEL = 'seedance2';

/**
 * Runway's image_to_video only accepts a whitelisted set of ratio strings.
 * Source: API validation error + docs (2026-04). Max HD class = 1470:630 / 1280:720.
 */
const RATIO_MAP: Record<'16:9' | '9:16' | '1:1', string> = {
  '16:9': '1280:720',
  '9:16': '720:1280',
  '1:1':  '960:960',
};

/**
 * Runway data-URL limit: 5,242,880 chars (~3.75MB raw). Large portraits
 * (e.g. BEDWIN muse at 5.8MB) exceed this. We re-encode to JPEG via canvas,
 * capping at 1536px on the long edge — still well above Seedance's 720p input.
 */
const MAX_LONG_EDGE = 1536;
const JPEG_QUALITY = 0.92;

async function compressDataUrl(dataUrl: string): Promise<string> {
  // Already small and not PNG? Pass through.
  if (dataUrl.length < 4_500_000 && dataUrl.startsWith('data:image/jpeg')) {
    return dataUrl;
  }

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Failed to load image for compression'));
    el.src = dataUrl;
  });

  const scale = Math.min(1, MAX_LONG_EDGE / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(img, 0, 0, w, h);

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

export interface SeedanceInput {
  /** URL or base64 data URL of the source still */
  startImage: string;
  /** Cinematic prompt — can include camera direction, film references */
  prompt: string;
  /**
   * Optional negative prompt. Seedance has no separate negative field,
   * so this is appended to promptText as `| Avoid: ...`.
   */
  negativePrompt?: string;
  /** Duration in seconds (Seedance: 4-15). Default 8 for Hero. */
  duration?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  seed?: number;
}

export interface SeedanceResult {
  videoUrl: string;
  taskId: string;
}

export async function generateVideo(
  input: SeedanceInput,
  onProgress?: (status: string) => void,
): Promise<SeedanceResult> {
  const ratio = RATIO_MAP[input.aspectRatio ?? '16:9'];
  const duration = input.duration ?? 8;

  if (duration < 4 || duration > 15) {
    throw new Error(`Seedance duration must be 4-15s, got ${duration}`);
  }

  const negative = input.negativePrompt ?? DEFAULT_NEGATIVE_PROMPT;
  const promptText = negative
    ? `${input.prompt} | Avoid: ${negative}`
    : input.prompt;

  const promptImage = input.startImage.startsWith('data:')
    ? await compressDataUrl(input.startImage)
    : input.startImage;

  const { id } = await createImageToVideoTask({
    model: SEEDANCE_MODEL,
    promptImage,
    promptText,
    ratio,
    duration,
    seed: input.seed,
  });

  onProgress?.('submitted');

  const task = await pollTask(id, {
    intervalMs: 5000,
    timeoutMs: 600_000,
    onProgress: (status: RunwayTaskStatus) => onProgress?.(status.toLowerCase()),
  });

  const videoUrl = task.output?.[0];
  if (!videoUrl) {
    throw new Error('No video URL in Seedance response');
  }

  return { videoUrl, taskId: id };
}

export { cancelTask as cancelPrediction };

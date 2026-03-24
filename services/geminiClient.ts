/**
 * geminiClient.ts — Shared Gemini API utilities
 *
 * Provides:
 * - GEN_CONFIG: shared constants (temperatures, thresholds, model names)
 * - createClient: creates a GoogleGenAI instance
 * - parseBase64: extracts mimeType + data from a data URL
 * - imageToBase64: converts a blob URL or data URL to base64
 * - compressImage: compresses a data URL to JPEG if over maxBytes
 * - callWithRetry: retries an async fn with exponential backoff (skips 400/401/403)
 */

import { GoogleGenAI } from '@google/genai';

// ─── Constants ────────────────────────────────────────────────────────────────

export const GEN_CONFIG = {
  /** Maximum allowed image size in bytes (10 MB) */
  MAX_IMAGE_BYTES: 10 * 1024 * 1024,

  /** JPEG quality for compression (0–1) */
  JPEG_QUALITY: 0.93,

  /** Quality score threshold — results below this trigger a retry */
  QUALITY_THRESHOLD: 70,

  /** Temperature used for analysis prompts (deterministic) */
  ANALYSIS_TEMPERATURE: 0.1,

  /** Temperature used for image generation prompts */
  GENERATION_TEMPERATURE: 0.7,

  models: {
    /** Fast text/vision model for analysis */
    flash: 'gemini-2.5-flash',
    /** High-quality image generation model */
    proImage: 'gemini-3.1-flash-image-preview',
  },
} as const;

// ─── Client factory ───────────────────────────────────────────────────────────

/**
 * Creates a GoogleGenAI client for the given API key.
 */
export function createClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey });
}

// ─── Image utilities ──────────────────────────────────────────────────────────

/**
 * Parses a base64 data URL into { mimeType, data }.
 * Handles both bare base64 strings and full data URLs.
 */
export function parseBase64(dataUrl: string): { mimeType: string; data: string } {
  if (dataUrl.includes(',')) {
    const [header, data] = dataUrl.split(',');
    const mimeMatch = header.match(/^data:(.*?);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    return { mimeType, data };
  }
  return { mimeType: 'image/png', data: dataUrl };
}

/**
 * Converts a blob URL or data URL to a base64 data URL.
 * - blob: URL → fetched and converted via FileReader
 * - data: URL → returned as-is
 * - Anything else → treated as a remote URL and fetched
 */
export async function imageToBase64(imageUrl: string): Promise<string> {
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  const response = await fetch(imageUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`FileReader failed for URL: ${imageUrl}`));
    reader.readAsDataURL(blob);
  });
}

/**
 * Compresses a base64 data URL to JPEG if it exceeds maxBytes.
 * Uses an HTML canvas — must be called in a browser environment.
 *
 * @param dataUrl  - Source image as a data URL
 * @param maxBytes - Byte limit (defaults to GEN_CONFIG.MAX_IMAGE_BYTES)
 * @returns        - Possibly compressed data URL
 */
export async function compressImage(
  dataUrl: string,
  maxBytes: number = GEN_CONFIG.MAX_IMAGE_BYTES,
): Promise<string> {
  // Estimate size: base64 encodes 3 bytes → 4 chars
  const { data } = parseBase64(dataUrl);
  const estimatedBytes = (data.length * 3) / 4;

  if (estimatedBytes <= maxBytes) {
    return dataUrl;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Try progressively lower quality until within limit
      let quality = GEN_CONFIG.JPEG_QUALITY;
      let result = canvas.toDataURL('image/jpeg', quality);

      while (result.length * 0.75 > maxBytes && quality > 0.3) {
        quality -= 0.05;
        result = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(result);
    };

    img.onerror = () => reject(new Error('Image load failed during compression'));
    img.src = dataUrl;
  });
}

// ─── Retry helper ─────────────────────────────────────────────────────────────

/** HTTP status codes that should not be retried */
const NON_RETRYABLE_STATUSES = [400, 401, 403] as const;

/**
 * Calls an async function with exponential backoff on failure.
 * Skips retries for 400 / 401 / 403 errors.
 *
 * @param fn         - Async function to call
 * @param maxRetries - Maximum number of attempts after the first (default: 3)
 * @param label      - Human-readable label used in error messages
 */
export async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  label = 'Gemini call',
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;

      // Do not retry on non-retryable HTTP errors
      if (isNonRetryable(error)) {
        throw error;
      }

      if (attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s, …
        console.warn(
          `[geminiClient] ${label} failed (attempt ${attempt + 1}/${maxRetries + 1}). ` +
            `Retrying in ${delayMs}ms…`,
          error,
        );
        await sleep(delayMs);
      }
    }
  }

  throw lastError;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isNonRetryable(error: unknown): boolean {
  if (error instanceof Error) {
    // GoogleGenAI errors often embed the HTTP status in the message
    if (NON_RETRYABLE_STATUSES.some(s => error.message.includes(String(s)))) {
      return true;
    }
  }
  // Check for objects with a status property (e.g., fetch Response-like errors)
  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as Record<string, unknown>).status === 'number'
  ) {
    return NON_RETRYABLE_STATUSES.includes((error as { status: 400 | 401 | 403 }).status);
  }
  return false;
}

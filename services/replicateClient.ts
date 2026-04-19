/**
 * replicateClient.ts — Replicate API utilities for nano-banana-pro
 *
 * Wraps the Replicate REST API:
 * - uploadFile: base64 data URL → Replicate-hosted file URL
 * - runPrediction: submit + poll prediction to completion
 * - dataUrlToBlob: helper for upload
 */

// In browser context, use the Vite/Vercel proxy path to avoid CORS (api.replicate.com blocks
// cross-origin requests). Server-side callers can override by passing the full URL.
const BROWSER_PROXY_BASE = '/api/replicate/v1';
const DIRECT_BASE = 'https://api.replicate.com/v1';

export const REPLICATE_CONFIG = {
  baseUrl: typeof window !== 'undefined' ? BROWSER_PROXY_BASE : DIRECT_BASE,
  models: {
    nanoBananaPro: 'google/nano-banana-pro',
  },
  /** Fraction to shrink head on the runway-proportion edit pass */
  HEAD_SHRINK_RATIO: 0.85,
  /** Polling interval for prediction status in ms */
  POLL_INTERVAL_MS: 2500,
  /** Max polling attempts (~ 2.5s * 120 = 5 min) */
  MAX_POLL_ATTEMPTS: 120,
} as const;

function authHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
  };
}

/**
 * Converts a data URL to a Blob for multipart upload.
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',');
  const mimeMatch = header.match(/^data:(.*?);base64/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

/**
 * Uploads a data URL to Replicate Files API. Returns a Replicate-hosted URL.
 */
export async function uploadFile(apiKey: string, dataUrl: string): Promise<string> {
  const blob = dataUrlToBlob(dataUrl);
  const form = new FormData();
  form.append('content', blob);

  const res = await fetch(`${REPLICATE_CONFIG.baseUrl}/files`, {
    method: 'POST',
    headers: authHeaders(apiKey),
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    const keyPreview = apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : '(empty)';
    console.error('[replicate] upload failed', { status: res.status, baseUrl: REPLICATE_CONFIG.baseUrl, keyPreview, body: txt });
    throw new Error(`Replicate file upload failed (${res.status}): ${txt}`);
  }
  const json = await res.json() as { urls?: { get?: string } };
  const url = json.urls?.get;
  if (!url) throw new Error('Replicate file upload returned no URL');
  return url;
}

export interface PredictionInput {
  prompt: string;
  image_input: string[];
  aspect_ratio?: string;
  resolution?: string;
  output_format?: string;
  seed?: number;
}

/**
 * Runs a nano-banana-pro prediction to completion and returns the output image URL.
 */
export async function runPrediction(
  apiKey: string,
  input: PredictionInput,
): Promise<string> {
  // Submit
  const body = {
    version: REPLICATE_CONFIG.models.nanoBananaPro,
    input: {
      aspect_ratio: '3:4',
      resolution: '2K',
      output_format: 'jpg',
      ...input,
    },
  };
  const submit = await fetch(`${REPLICATE_CONFIG.baseUrl}/predictions`, {
    method: 'POST',
    headers: { ...authHeaders(apiKey), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!submit.ok) {
    const txt = await submit.text().catch(() => '');
    console.error('[replicate] submit failed', { status: submit.status, body: txt });
    throw new Error(`Replicate prediction submit failed (${submit.status}): ${txt}`);
  }
  const submitJson = await submit.json() as { id?: string };
  const id = submitJson.id;
  if (!id) throw new Error('Replicate prediction submit returned no id');

  // Poll
  for (let attempt = 0; attempt < REPLICATE_CONFIG.MAX_POLL_ATTEMPTS; attempt++) {
    await sleep(REPLICATE_CONFIG.POLL_INTERVAL_MS);
    const poll = await fetch(`${REPLICATE_CONFIG.baseUrl}/predictions/${id}`, {
      headers: authHeaders(apiKey),
    });
    if (!poll.ok) continue;
    const data = await poll.json() as {
      status?: string;
      output?: string | string[] | null;
      error?: string | null;
    };
    if (data.status === 'succeeded') {
      const out = data.output;
      if (Array.isArray(out)) return out[0];
      if (typeof out === 'string') return out;
      throw new Error('Prediction succeeded but returned no output');
    }
    if (data.status === 'failed' || data.status === 'canceled') {
      throw new Error(`Prediction ${data.status}: ${data.error ?? 'unknown'}`);
    }
  }
  throw new Error('Prediction polling timed out');
}

/**
 * Fetches a remote image URL and converts to a data URL.
 */
export async function urlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

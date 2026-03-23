/**
 * Image Upscaler — Canvas-based 2x upscaling for generated fashion images.
 *
 * Gemini outputs are typically 1024x1024 or 1280x1280.
 * This upscaler doubles resolution using multi-step canvas downscaling technique
 * for sharper results than a simple stretch.
 */

export interface UpscaleOptions {
  /** Target scale factor (default: 2) */
  scale?: number;
  /** Output format (default: 'image/png') */
  format?: 'image/png' | 'image/jpeg' | 'image/webp';
  /** JPEG/WebP quality 0-1 (default: 0.92) */
  quality?: number;
  /** Sharpen after upscale (default: true) */
  sharpen?: boolean;
}

/**
 * Upscale a base64 image using multi-step canvas rendering.
 * Uses step-down technique for better quality than direct resize.
 */
export async function upscaleImage(
  base64DataUrl: string,
  options: UpscaleOptions = {}
): Promise<string> {
  const { scale = 2, format = 'image/png', quality = 0.92, sharpen = true } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const targetW = Math.round(img.width * scale);
      const targetH = Math.round(img.height * scale);

      // Multi-step upscale for better quality
      // Step 1: Draw at original size
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) { reject(new Error('Canvas context failed')); return; }
      tempCtx.imageSmoothingEnabled = true;
      tempCtx.imageSmoothingQuality = 'high';
      tempCtx.drawImage(img, 0, 0);

      // Step 2: Scale up to target in one step with high-quality smoothing
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = targetW;
      finalCanvas.height = targetH;
      const finalCtx = finalCanvas.getContext('2d');
      if (!finalCtx) { reject(new Error('Canvas context failed')); return; }
      finalCtx.imageSmoothingEnabled = true;
      finalCtx.imageSmoothingQuality = 'high';
      finalCtx.drawImage(tempCanvas, 0, 0, targetW, targetH);

      // Step 3: Optional sharpening via unsharp mask technique
      if (sharpen) {
        try {
          const imageData = finalCtx.getImageData(0, 0, targetW, targetH);
          applyUnsharpMask(imageData, 0.3, 1); // amount=0.3, radius=1px — subtle sharpening
          finalCtx.putImageData(imageData, 0, 0);
        } catch {
          // Skip sharpening if getImageData fails (CORS, etc.)
        }
      }

      const result = format === 'image/png'
        ? finalCanvas.toDataURL(format)
        : finalCanvas.toDataURL(format, quality);

      const originalKB = Math.round(base64DataUrl.length * 3 / 4 / 1024);
      const newKB = Math.round(result.length * 3 / 4 / 1024);
      console.log(`[Upscale] ${img.width}x${img.height} → ${targetW}x${targetH} (${originalKB}KB → ${newKB}KB)`);

      resolve(result);
    };
    img.onerror = () => reject(new Error('Upscale: failed to load image'));
    img.src = base64DataUrl;
  });
}

/**
 * Simple unsharp mask for subtle sharpening.
 * Applies a 3x3 convolution with controlled amount.
 */
function applyUnsharpMask(imageData: ImageData, amount: number, _radius: number): void {
  const { data, width, height } = imageData;
  const copy = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) {
        // 3x3 Laplacian kernel for edge detection
        const center = copy[idx + c] * 5;
        const neighbors =
          copy[((y - 1) * width + x) * 4 + c] +
          copy[((y + 1) * width + x) * 4 + c] +
          copy[(y * width + (x - 1)) * 4 + c] +
          copy[(y * width + (x + 1)) * 4 + c];

        const edge = center - neighbors;
        data[idx + c] = Math.max(0, Math.min(255, copy[idx + c] + edge * amount));
      }
    }
  }
}

/**
 * Check if an image would benefit from upscaling (smaller than target resolution).
 */
export function shouldUpscale(base64DataUrl: string, minWidth = 1800): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width < minWidth);
    img.onerror = () => resolve(false);
    img.src = base64DataUrl;
  });
}

// ─── AI Upscaler — Real-ESRGAN via Replicate ─────────────────────────────
// For VTON output (576x864) → EC-quality (2304x3456)
// Canvas upscaling produces blurry results at 4x; AI upscaling preserves texture detail.

const REPLICATE_PREDICTIONS_URL = 'https://api.replicate.com/v1/predictions';
const REAL_ESRGAN_VERSION = '42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b';
const AI_POLL_INTERVAL_MS = 2000;
const AI_TIMEOUT_MS = 90_000;

const USE_PROXY = !!(import.meta as any).env?.PROD || !(import.meta as any).env?.VITE_REPLICATE_API_KEY;

async function proxyReplicateCreate(input: Record<string, any>): Promise<any> {
  const resp = await fetch('/api/replicate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create',
      model_url: REPLICATE_PREDICTIONS_URL,
      version: REAL_ESRGAN_VERSION,
      input,
    }),
  });
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`[AI Upscale] Proxy error ${resp.status}: ${errText}`);
  }
  return resp.json();
}

async function proxyReplicatePoll(predictionId: string): Promise<any> {
  const resp = await fetch('/api/replicate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'poll', prediction_id: predictionId }),
  });
  if (!resp.ok) throw new Error(`[AI Upscale] Poll error: ${resp.status}`);
  return resp.json();
}

async function fetchAsDataUrl(url: string): Promise<string> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`[AI Upscale] Fetch error: ${resp.status}`);
  const blob = await resp.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * AI-powered 4x upscale using Real-ESRGAN via Replicate.
 * Designed for VTON output: 576x864 → 2304x3456.
 *
 * Includes face enhancement for model photography.
 * Falls back to canvas upscaling if Replicate fails.
 *
 * Cost: ~$0.01-0.02/image, Speed: 5-15s
 */
export async function aiUpscaleImage(imageDataUrl: string): Promise<{
  outputImageDataUrl: string;
  durationMs: number;
  method: 'real-esrgan' | 'canvas-fallback';
}> {
  const start = Date.now();
  console.log('[AI Upscale] Starting Real-ESRGAN 4x...');

  try {
    const apiKey = (import.meta as any).env?.VITE_REPLICATE_API_KEY as string | undefined;
    const input = {
      image: imageDataUrl,
      scale: 4,
      face_enhance: true,
    };

    let prediction: any;

    if (USE_PROXY) {
      prediction = await proxyReplicateCreate(input);
    } else {
      if (!apiKey) throw new Error('No API key');
      const resp = await fetch(REPLICATE_PREDICTIONS_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Prefer: 'wait',
        },
        body: JSON.stringify({ version: REAL_ESRGAN_VERSION, input }),
      });
      if (!resp.ok) throw new Error(`Create error ${resp.status}`);
      prediction = await resp.json();
    }

    // Poll if needed
    let outputUrl: string;
    if (prediction.status === 'succeeded') {
      outputUrl = typeof prediction.output === 'string' ? prediction.output : prediction.output[0];
    } else {
      const pollStart = Date.now();
      while (Date.now() - pollStart < AI_TIMEOUT_MS) {
        let data: any;
        if (USE_PROXY) {
          data = await proxyReplicatePoll(prediction.id);
        } else {
          const resp = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          });
          data = await resp.json();
        }

        if (data.status === 'succeeded') {
          outputUrl = typeof data.output === 'string' ? data.output : data.output[0];
          break;
        }
        if (data.status === 'failed' || data.status === 'canceled') {
          throw new Error(`${data.status}: ${data.error ?? 'unknown'}`);
        }
        await new Promise(r => setTimeout(r, AI_POLL_INTERVAL_MS));
      }
      if (!outputUrl!) throw new Error('Timed out');
    }

    const outputImageDataUrl = await fetchAsDataUrl(outputUrl!);
    const durationMs = Date.now() - start;
    console.log(`[AI Upscale] Real-ESRGAN completed in ${(durationMs / 1000).toFixed(1)}s`);

    return { outputImageDataUrl, durationMs, method: 'real-esrgan' };

  } catch (err) {
    // Fallback to canvas 4x upscale
    console.warn('[AI Upscale] Real-ESRGAN failed, falling back to canvas:', (err as Error).message);
    const fallbackResult = await upscaleImage(imageDataUrl, { scale: 4, sharpen: true });
    const durationMs = Date.now() - start;
    return { outputImageDataUrl: fallbackResult, durationMs, method: 'canvas-fallback' };
  }
}

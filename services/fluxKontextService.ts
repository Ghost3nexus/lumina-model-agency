/**
 * FLUX Kontext Generation Service
 *
 * Conditional image generation: takes a garment reference image + prompt,
 * generates a complete new image of a model wearing the garment.
 *
 * This replaces the VTON approach (which swaps clothes on existing models).
 * botika, Uwear, Photoroom all use this conditional generation approach.
 *
 * Pipeline:
 *   1. Upload garment image to fal CDN (get URL)
 *   2. Submit FLUX Kontext generation (garment URL + prompt)
 *   3. Poll until complete
 *   4. Return generated image
 */

const POLL_INTERVAL = 3000;
const MAX_POLL = 120_000; // 2 minutes

// Lumina EC LoRA — trained on 56 SSENSE garment→model pairs (2026-03-19)
export const LUMINA_EC_LORA_URL = 'https://v3b.fal.media/files/b/0a92ae9e/m9OysCn5ZtI-2zASnuleD_adapter_model.safetensors';
export const LUMINA_EC_LORA_SCALE = 0.5;

export interface KontextInput {
    garmentImageDataUrl: string;
    prompt: string;
    guidanceScale?: number;
    seed?: number;
    aspectRatio?: string;
    loraUrl?: string;
    loraScale?: number;
}

export interface KontextResult {
    outputImageUrl: string;
    outputImageDataUrl: string;
    durationMs: number;
    seed?: number;
}

/**
 * Upload a base64 image to fal CDN via our Vercel proxy.
 * Returns a public URL that can be passed to FLUX Kontext.
 */
export async function uploadToFalCdn(dataUrl: string): Promise<string> {
    console.log(`[Kontext] Uploading image (${(dataUrl.length / 1024).toFixed(0)}KB)...`);

    const resp = await fetch('/api/flux-kontext', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'upload',
            imageBase64: dataUrl,
            contentType: 'image/jpeg',
        }),
    });

    if (!resp.ok) {
        const t = await resp.text();
        throw new Error(`Upload failed ${resp.status}: ${t.slice(0, 200)}`);
    }

    const d = await resp.json();
    if (!d.ok || !d.url) {
        throw new Error(`Upload failed: ${JSON.stringify(d).slice(0, 200)}`);
    }

    console.log(`[Kontext] Uploaded → ${d.url.slice(0, 80)}...`);
    return d.url;
}

/**
 * Convert a remote URL to a base64 data URL.
 */
async function urlToDataUrl(url: string): Promise<string> {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Fetch output failed: ${resp.status}`);
    const blob = await resp.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Run FLUX Kontext generation.
 *
 * Takes a garment image (as data URL) and a prompt describing the desired output.
 * Returns a generated image of a model wearing the garment.
 */
export async function runFluxKontext(input: KontextInput): Promise<KontextResult> {
    const start = Date.now();

    // Step 1: Upload garment image to fal CDN
    const garmentUrl = await uploadToFalCdn(input.garmentImageDataUrl);

    // Step 2: Submit generation
    console.log(`[Kontext] Submitting generation...`);

    const submitResp = await fetch('/api/flux-kontext', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'submit',
            image_url: garmentUrl,
            prompt: input.prompt,
            guidance_scale: input.guidanceScale || 4.0,
            aspect_ratio: input.aspectRatio || '2:3',
            ...(input.seed && { seed: input.seed }),
            ...(input.loraUrl && {
                lora_url: input.loraUrl,
                lora_scale: input.loraScale ?? 0.8,
            }),
        }),
    });

    if (!submitResp.ok) {
        const t = await submitResp.text();
        throw new Error(`Submit failed ${submitResp.status}: ${t.slice(0, 200)}`);
    }

    const sd = await submitResp.json();
    if (!sd.ok || !sd.request_id) {
        throw new Error(`No request_id: ${JSON.stringify(sd).slice(0, 200)}`);
    }

    console.log(`[Kontext] Queued: ${sd.request_id}`);

    // Step 3: Poll from browser until complete
    const pollStart = Date.now();

    while (Date.now() - pollStart < MAX_POLL) {
        await new Promise(r => setTimeout(r, POLL_INTERVAL));

        const pr = await fetch('/api/flux-kontext', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'poll',
                request_id: sd.request_id,
                status_url: sd.status_url,
                response_url: sd.response_url,
            }),
        });

        if (!pr.ok) {
            console.warn(`[Kontext] Poll ${pr.status}, retrying...`);
            continue;
        }

        const pd = await pr.json();
        const elapsed = ((Date.now() - start) / 1000).toFixed(0);
        console.log(`[Kontext] ${pd.status} (${elapsed}s)`);

        if (pd.status === 'COMPLETED' && pd.images?.length > 0) {
            const outputUrl = pd.images[0].url;
            console.log(`[Kontext] Done → ${outputUrl.slice(0, 80)}...`);

            const dataUrl = await urlToDataUrl(outputUrl);
            const dur = Date.now() - start;
            console.log(`[Kontext] Total: ${(dur / 1000).toFixed(1)}s`);

            return {
                outputImageUrl: outputUrl,
                outputImageDataUrl: dataUrl,
                durationMs: dur,
                seed: pd.seed,
            };
        }

        if (pd.status === 'FAILED') {
            throw new Error(`Generation failed: ${pd.error || 'Unknown error'}`);
        }
    }

    throw new Error(`Timeout after ${MAX_POLL / 1000}s`);
}

/**
 * Post-process: replace near-white/gray background with pure white.
 * Uses Canvas API (browser-side, zero cost).
 * Only touches pixels that are light and low-saturation (background areas).
 */
export async function enforceWhiteBackground(dataUrl: string): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                // Detect background: light pixels with low saturation
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const lightness = (max + min) / 2;
                const saturation = max === 0 ? 0 : (max - min) / max;

                // Background threshold: light (>190) and low saturation (<0.12)
                if (lightness > 190 && saturation < 0.12) {
                    data[i] = 255;
                    data[i + 1] = 255;
                    data[i + 2] = 255;
                }
            }

            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(dataUrl); // fallback to original
        img.src = dataUrl;
    });
}

/**
 * Build a prompt for FLUX Kontext garment-to-model generation.
 *
 * Takes garment analysis results and model/scene preferences,
 * returns a prompt optimized for FLUX Kontext.
 */
export function buildKontextPrompt(opts: {
    garmentDescription: string;
    garmentCategory: string;
    modelDescription?: string;
    pose?: string;
    background?: string;
    lighting?: string;
    outputPurpose?: string;
}): string {
    const {
        garmentDescription,
        garmentCategory,
        modelDescription = 'a high-end fashion model, refined bone structure, understated elegance, sophisticated neutral expression, luminous skin, styled hair',
        pose = 'standing with relaxed confidence, weight on one leg, one hand in pocket',
        background = 'clean white studio background, seamless',
        lighting = 'premium studio lighting, beauty dish key light for soft wrap-around illumination, subtle rim light for separation, shadow ratio 1:2.5',
        outputPurpose = 'ec',
    } = opts;

    // FLUX Kontext needs explicit "a person wearing this" framing
    // to convert flat-lay/product images into model-on shots.
    // Keep prompt natural and descriptive — avoid technical jargon overload.
    const isEC = outputPurpose.startsWith('ec');

    if (isEC) {
        return [
            `Full-length fashion e-commerce photograph showing the entire body from head to feet of ${modelDescription} wearing this ${garmentCategory}.`,
            garmentDescription !== garmentCategory ? `The ${garmentCategory}: ${garmentDescription}.` : '',
            `${pose}.`,
            `Pure white seamless studio backdrop, bright and clean.`,
            `${lighting}. Visible soft shadows on the ground and clothing folds for depth and dimension.`,
            `Full body shot including shoes, shot at 85mm f/2.8, tack sharp.`,
        ].filter(Boolean).join(' ');
    }

    // Editorial/Instagram/Campaign
    return [
        `A photograph of ${modelDescription} wearing this ${garmentCategory}.`,
        garmentDescription !== garmentCategory ? `The ${garmentCategory}: ${garmentDescription}.` : '',
        `${pose}.`,
        `${background}.`,
        `${lighting}.`,
        `Professional fashion photography, photorealistic.`,
    ].filter(Boolean).join(' ');
}

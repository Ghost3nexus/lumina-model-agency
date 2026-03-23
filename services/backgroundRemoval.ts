/**
 * Background Removal Service — Replicate rembg
 *
 * Removes background from garment product images before VTON processing.
 * Clean garment-only images improve VTON accuracy significantly.
 *
 * Uses: lucataco/remove-bg on Replicate
 * Cost: ~$0.01/image
 */

/** Strip the data-URL prefix and return raw base64 */
function stripDataUrlPrefix(dataUrl: string): string {
    return dataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
}

/** Fetch an image URL and convert to base64 data URL */
async function urlToDataUrl(url: string): Promise<string> {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to fetch image: ${resp.status}`);
    const blob = await resp.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Remove background from a garment image via server-side proxy (/api/bg-remove).
 * API key is stored server-side only — never exposed to browser.
 * Falls back to the original image if the API is unavailable.
 */
export async function removeBackground(imageDataUrl: string): Promise<string> {
    const start = Date.now();
    console.log('[BG-Remove] Removing garment background via server proxy...');

    try {
        const resp = await fetch('/api/bg-remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: `data:image/png;base64,${stripDataUrlPrefix(imageDataUrl)}`,
            }),
        });

        if (!resp.ok) {
            const errData = await resp.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`BG remove error ${resp.status}: ${errData.error}`);
        }

        const data = await resp.json();
        if (!data.ok || !data.outputUrl) {
            throw new Error('BG remove returned empty result');
        }

        const result = await urlToDataUrl(data.outputUrl);
        console.log(`[BG-Remove] Done in ${((Date.now() - start) / 1000).toFixed(1)}s`);
        return result;
    } catch (err) {
        console.warn('[BG-Remove] Failed, using original image:', err);
        return imageDataUrl;
    }
}

/**
 * Remove backgrounds from all garment images in parallel.
 * Skips non-garment keys (model, anchor_model, campaign_style_ref, alt images).
 */
export async function removeBackgroundsFromGarments(
    images: Record<string, string>,
): Promise<Record<string, string>> {
    const garmentKeys = ['tops', 'pants', 'outer', 'inner', 'dress', 'allinone', 'shoes', 'belt'];
    const result = { ...images };

    const tasks = Object.entries(images)
        .filter(([key]) => garmentKeys.includes(key))
        .map(async ([key, dataUrl]) => {
            const cleaned = await removeBackground(dataUrl);
            result[key] = cleaned;
        });

    await Promise.all(tasks);
    return result;
}

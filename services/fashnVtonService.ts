/**
 * Virtual Try-On Service — fal.ai FASHN v1.5 via Vercel proxy
 *
 * Submit/Poll pattern:
 *   1. POST /api/vton {action:'submit'} → request_id + status_url
 *   2. POST /api/vton {action:'poll', request_id, status_url} → status
 *   3. Repeat from browser until COMPLETED
 */

export type VtonCategory = 'tops' | 'bottoms' | 'one-pieces';

export interface VtonInput {
    garmentImageDataUrl: string;
    modelImageDataUrl: string;
    category: VtonCategory;
    garmentDescription?: string;
    longTop?: boolean;
}

export interface VtonResult {
    outputImageDataUrl: string;
    durationMs: number;
    usedVton: true;
    modelUsed: 'fashn';
}

async function urlToDataUrl(url: string): Promise<string> {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Fetch VTON output failed: ${resp.status}`);
    const blob = await resp.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

const POLL_INTERVAL = 3000;
const MAX_POLL = 300_000;

export async function runFashnVton(input: VtonInput): Promise<VtonResult | null> {
    const start = Date.now();

    try {
        // ── Submit ──
        console.log(`[VTON] Submitting ${input.category}...`);

        const submitBody = JSON.stringify({
            action: 'submit',
            modelImage: input.modelImageDataUrl,
            garmentImage: input.garmentImageDataUrl,
            category: input.category,
            garmentPhotoType: 'auto',
        });

        console.log(`[VTON] Body: ${(submitBody.length / 1024 / 1024).toFixed(2)}MB`);

        const sr = await fetch('/api/vton', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: submitBody,
        });

        if (!sr.ok) {
            const t = await sr.text();
            console.error(`[VTON] Submit ${sr.status}: ${t.slice(0, 300)}`);
            throw new Error(`Submit ${sr.status}: ${t.slice(0, 200)}`);
        }

        const sd = await sr.json();
        if (!sd.ok || !sd.request_id) {
            throw new Error(`No request_id: ${JSON.stringify(sd).slice(0, 200)}`);
        }

        console.log(`[VTON] Queued: ${sd.request_id}`);

        // ── Poll ──
        const pollStart = Date.now();

        while (Date.now() - pollStart < MAX_POLL) {
            await new Promise(r => setTimeout(r, POLL_INTERVAL));

            const pr = await fetch('/api/vton', {
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
                console.warn(`[VTON] Poll ${pr.status}, retrying...`);
                continue;
            }

            const pd = await pr.json();
            const elapsed = ((Date.now() - start) / 1000).toFixed(0);
            console.log(`[VTON] ${pd.status} (${elapsed}s)`);

            if (pd.status === 'COMPLETED' && pd.images?.length > 0) {
                const outputUrl = pd.images[0].url;
                console.log(`[VTON] Done → ${outputUrl.slice(0, 80)}...`);
                const dataUrl = await urlToDataUrl(outputUrl);
                const dur = Date.now() - start;
                console.log(`[VTON] Total: ${(dur / 1000).toFixed(1)}s`);
                return { outputImageDataUrl: dataUrl, durationMs: dur, usedVton: true, modelUsed: 'fashn' };
            }

            if (pd.status === 'FAILED') {
                throw new Error('VTON generation failed');
            }
        }

        throw new Error(`Timeout after ${MAX_POLL / 1000}s`);

    } catch (err) {
        console.error('[VTON] Failed:', (err as Error).message);
        return null;
    }
}

export function detectVtonCategory(analysisKeys: string[]): VtonCategory {
    if (analysisKeys.includes('dress') || analysisKeys.includes('allinone')) return 'one-pieces';
    if (analysisKeys.includes('pants') || analysisKeys.includes('skirt')) return 'bottoms';
    return 'tops';
}

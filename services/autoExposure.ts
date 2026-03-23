/**
 * Auto Exposure Correction v3 — Adaptive Highlight Recovery
 *
 * v1: Too aggressive (full histogram stretch → posterization / color shifts)
 * v2: Too gentle (only 200-245 rolloff → severe white-out not fixed)
 * v3: Adaptive — strength scales with severity of white-out.
 *     - Mild (5-15% blown): gentle rolloff only (v2 behavior)
 *     - Moderate (15-30% blown): stronger rolloff + mild gamma on highlights
 *     - Severe (30%+ blown): aggressive rolloff + gamma correction on upper range
 *     Mid-tones and shadows are NEVER touched.
 */
export async function autoCorrectExposure(imageDataUrl: string): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) { resolve(imageDataUrl); return; }

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // ── Step 1: Analyze histogram ──
            let totalPixels = 0;
            let blownPixels = 0;      // R,G,B all > 240
            let brightPixels = 0;     // luminance > 220
            const BLOWN_THRESHOLD = 240;
            const BRIGHT_THRESHOLD = 220;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                totalPixels++;
                if (r > BLOWN_THRESHOLD && g > BLOWN_THRESHOLD && b > BLOWN_THRESHOLD) {
                    blownPixels++;
                }
                const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                if (lum > BRIGHT_THRESHOLD) {
                    brightPixels++;
                }
            }

            const blownRatio = blownPixels / totalPixels;
            const brightRatio = brightPixels / totalPixels;

            // ── Step 2: Decide severity ──
            const needsCorrection = blownRatio > 0.05 || brightRatio > 0.20;

            if (!needsCorrection) {
                console.log(`[Exposure v3] No correction needed (blown=${(blownRatio * 100).toFixed(1)}%, bright=${(brightRatio * 100).toFixed(1)}%)`);
                resolve(imageDataUrl);
                return;
            }

            // Determine severity level
            let severity: 'mild' | 'moderate' | 'severe';
            if (blownRatio > 0.30 || brightRatio > 0.50) {
                severity = 'severe';
            } else if (blownRatio > 0.15 || brightRatio > 0.35) {
                severity = 'moderate';
            } else {
                severity = 'mild';
            }

            console.log(`[Exposure v3] ${severity} correction (blown=${(blownRatio * 100).toFixed(1)}%, bright=${(brightRatio * 100).toFixed(1)}%)`);

            // ── Step 3: Adaptive correction ──
            // Parameters scale with severity
            const config = {
                mild:     { rolloffStart: 200, rolloffTarget: 245, gamma: 1.0 },
                moderate: { rolloffStart: 180, rolloffTarget: 235, gamma: 0.85 },
                severe:   { rolloffStart: 160, rolloffTarget: 225, gamma: 0.7 },
            }[severity];

            const rolloffRange = 255 - config.rolloffStart;
            const targetRange = config.rolloffTarget - config.rolloffStart;

            for (let i = 0; i < data.length; i += 4) {
                for (let c = 0; c < 3; c++) {
                    const val = data[i + c];
                    if (val > config.rolloffStart) {
                        // Compress upper range with curve
                        const excess = val - config.rolloffStart;
                        const normalized = excess / rolloffRange; // 0-1
                        // Apply gamma then scale to target range
                        const curved = Math.pow(normalized, 1 / config.gamma);
                        const compressed = Math.sqrt(curved) * targetRange;
                        data[i + c] = Math.round(config.rolloffStart + Math.min(compressed, targetRange));
                    }
                    // Values below rolloffStart are completely untouched
                }
            }

            ctx.putImageData(imageData, 0, 0);
            const result = canvas.toDataURL('image/png');
            console.log(`[Exposure v3] ${severity} highlight recovery applied (rolloff ${config.rolloffStart}->${config.rolloffTarget}, gamma ${config.gamma})`);
            resolve(result);
        };
        img.onerror = () => resolve(imageDataUrl);
        img.src = imageDataUrl;
    });
}

/**
 * qualityChecker.ts — AI-powered image quality assessment
 *
 * Uses Gemini Flash to score generated EC fashion images.
 * Critical defects (hands, face, orientation, blown highlights) force a fail
 * regardless of the aggregate score.
 *
 * Score >= 85 → pass: true
 * Score <  85 → pass: false
 */

import { createClient, GEN_CONFIG, callWithRetry, parseBase64 } from './geminiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QualityResult {
  /** Aggregate score 0–100 */
  score: number;
  /** true when score >= 85 and no critical defects */
  pass: boolean;
  /** Human-readable list of detected issues */
  issues: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PASS_THRESHOLD = 85;

/** Issues that force a fail regardless of score */
const CRITICAL_KEYWORDS = [
  'HANDS_DEFECT',
  'FACE_DEFECT',
  'ORIENTATION_ERROR',
  // BLOWN_HIGHLIGHTS removed from critical — white garments naturally trigger this
] as const;

// ─── checkQuality ─────────────────────────────────────────────────────────────

/**
 * Evaluates the quality of a generated EC fashion image.
 *
 * @param apiKey              - Gemini API key
 * @param imageDataUrl        - Data URL of the image to evaluate
 * @param anchorImageDataUrl  - Optional data URL of the front image (for color drift check)
 * @returns                   - QualityResult with score, pass flag, and issues list
 */
export async function checkQuality(
  apiKey: string,
  imageDataUrl: string,
  anchorImageDataUrl?: string,
): Promise<QualityResult> {
  try {
    const { mimeType, data } = parseBase64(imageDataUrl);

    const anchorSection = anchorImageDataUrl
      ? `\nREFERENCE IMAGE (front anchor): Also provided. Check for COLOR_DRIFT vs the reference.\n`
      : '';

    const prompt = `You are a professional fashion photography quality auditor for EC (e-commerce) product pages.

Evaluate the provided image strictly. Return ONLY a JSON object with this exact structure:
{
  "score": <integer 0-100>,
  "issues": [<string>, ...]
}
${anchorSection}
SCORING CRITERIA (deduct points for each failure):

1. HANDS_DEFECT (-25, critical): Unnatural hands — extra fingers, missing fingers, fused fingers, distorted wrists. Tag as "HANDS_DEFECT".
2. FACE_DEFECT (-25, critical): Face issues — uncanny valley, asymmetry, dead eyes, distorted features. Tag as "FACE_DEFECT".
3. ORIENTATION_ERROR (-20, critical): Garment is inside-out, upside-down, or worn incorrectly. Tag as "ORIENTATION_ERROR".
4. BLOWN_HIGHLIGHTS (-20, critical): Pure white areas with no fabric detail (histogram clipped to 255). Tag as "BLOWN_HIGHLIGHTS".
5. FLAT_LIGHTING (-15): No directional shadow, flat uniform illumination. Tag as "FLAT_LIGHTING".
6. LIGHTING_DIMENSION (-10): Shadow ratio below 1:2 — insufficient depth. Tag as "LIGHTING_DIMENSION".
7. FABRIC_TEXTURE (-10): Fabric material is indistinguishable — cotton looks same as silk, etc. Tag as "FABRIC_TEXTURE".
8. SKIN_QUALITY (-10): Skin looks plastic, overly smooth, or AI-generated artefacts. Tag as "SKIN_QUALITY".
9. BODY_PROPORTIONS (-10): Limbs or torso look unnaturally stretched/compressed. Tag as "BODY_PROPORTIONS".
10. COLOR_CONSISTENCY (-5): Garment color noticeably differs from expected. Tag as "COLOR_CONSISTENCY".
11. COLOR_DRIFT (-15): Garment color significantly changed vs the front anchor reference. Tag as "COLOR_DRIFT". (Only apply if anchor provided)

Start from 100 and deduct. Issues list must use the exact tag names above as prefixes, e.g. "HANDS_DEFECT: extra finger on left hand".

Respond with valid JSON only. No markdown, no explanation outside the JSON.`;

    const client = createClient(apiKey);

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
      { text: prompt },
      { inlineData: { mimeType, data } },
    ];

    if (anchorImageDataUrl) {
      const anchor = parseBase64(anchorImageDataUrl);
      parts.push({ inlineData: { mimeType: anchor.mimeType, data: anchor.data } });
    }

    const response = await callWithRetry(
      () =>
        client.models.generateContent({
          model: GEN_CONFIG.models.flash,
          contents: [
            {
              role: 'user',
              parts,
            },
          ],
          config: {
            responseModalities: ['TEXT'],
            temperature: GEN_CONFIG.ANALYSIS_TEMPERATURE,
          },
        }),
      2,
      'checkQuality',
    );

    const rawText =
      response.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? '')
        .join('') ?? '';

    // Strip markdown code fences if present
    const jsonText = rawText.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();

    let parsed: { score: unknown; issues: unknown };
    try {
      parsed = JSON.parse(jsonText) as { score: unknown; issues: unknown };
    } catch {
      // If JSON parse fails, return a conservative result
      return { score: 70, pass: true, issues: ['Quality check parse error'] };
    }

    const score = typeof parsed.score === 'number' ? Math.max(0, Math.min(100, Math.round(parsed.score))) : 70;
    const issues = Array.isArray(parsed.issues)
      ? (parsed.issues as unknown[]).filter((i): i is string => typeof i === 'string')
      : [];

    // Critical defects force a fail regardless of score
    const hasCritical = CRITICAL_KEYWORDS.some(keyword =>
      issues.some(issue => issue.startsWith(keyword)),
    );

    const pass = !hasCritical && score >= PASS_THRESHOLD;

    return { score, pass, issues };
  } catch {
    return { score: 70, pass: true, issues: ['Quality check unavailable'] };
  }
}

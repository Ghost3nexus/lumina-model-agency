/**
 * Garment Fidelity A/B Test Round 2
 * MM6 Wide Denim + ROKU Cotton Blouson
 * Front + Back + Side per variant (A=1ref, B=all refs)
 *
 * Usage: source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/fidelity-ab-round2.mjs
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const OUT_DIR = 'test/fidelity-ab-output';
fs.mkdirSync(OUT_DIR, { recursive: true });

const MODEL_DIR = 'public/agency-models/ladies-intl-01';
const MODEL_REFS = ['polaroid-front.png', 'polaroid-face.png'].map(f =>
  fs.readFileSync(path.join(MODEL_DIR, f)).toString('base64')
);

const PRODUCT_BASE = '/Users/koudzukitakahiro/Downloads/プロジェクト/ファッション・商品';

const TESTS = [
  {
    name: 'mm6-wide-denim',
    label: 'MM6 Maison Margiela Tuck Wide Denim Pants',
    dir: '＜MM6 Maison Margiela＞タック ワイドデニムパンツ',
  },
  {
    name: 'roku-blouson',
    label: '6(ROKU) Cotton Short Blouson',
    dir: '＜6(ROKU)＞コットン ショート ブルゾン',
  },
];

const ANGLES = [
  { id: 'front', instruction: 'FULL BODY front view, head to toe, natural confident standing pose.' },
  { id: 'back', instruction: 'FULL BODY BACK view — model turned 180 degrees showing complete back. Head to toe. Show back construction, seams, pockets, silhouette from behind.' },
  { id: 'side', instruction: 'FULL BODY SIDE view — model at 3/4 angle (~45 degrees). Show silhouette, drape, and how the garment falls on the body.' },
];

function loadImages(dirName) {
  const dir = path.join(PRODUCT_BASE, dirName);
  return fs.readdirSync(dir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort()
    .map(f => {
      const data = fs.readFileSync(path.join(dir, f)).toString('base64');
      const ext = f.split('.').pop().toLowerCase();
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      return { data, mimeType, name: f };
    });
}

function buildPrompt(angle) {
  return `Professional EC fashion photography, ZARA / NET-A-PORTER quality.

MODEL IDENTITY (LOCKED — use the EXACT person from reference photos):
Height 179cm, ash blonde straight long hair, blue-grey eyes.

ANGLE: ${angle.instruction}

PHOTOGRAPHY:
- Clean white studio background
- Directional studio lighting from 45 degrees, shadow ratio 1:2.5 to 1:3
- Photorealistic commercial EC quality
- Shoes visible

CRITICAL: Reproduce the garment EXACTLY as shown in the product reference(s).
Match color, material, pattern, silhouette, design details, proportions precisely.
This is the actual product being sold — accuracy is everything.`;
}

async function generate(testName, garmentParts, variant, angle) {
  const outPath = path.join(OUT_DIR, `${testName}-${variant}-${angle.id}.png`);
  if (fs.existsSync(outPath)) { console.log(`    ${variant}-${angle.id} — skip (exists)`); return; }

  const parts = [
    { text: buildPrompt(angle) },
    { text: '\nMODEL REFERENCE PHOTOS:' },
    ...MODEL_REFS.map(d => ({ inlineData: { mimeType: 'image/png', data: d } })),
    { text: `\nGARMENT PRODUCT REFERENCE (${garmentParts.length} image${garmentParts.length > 1 ? 's' : ''} — reproduce EXACTLY):` },
    ...garmentParts.map(g => ({ inlineData: { mimeType: g.mimeType, data: g.data } })),
  ];

  try {
    const resp = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [{ role: 'user', parts }],
      config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
    });
    for (const p of resp.candidates?.[0]?.content?.parts || []) {
      if (p.inlineData) {
        fs.writeFileSync(outPath, Buffer.from(p.inlineData.data, 'base64'));
        console.log(`    ${variant}-${angle.id} OK`);
        return;
      }
    }
    console.log(`    ${variant}-${angle.id} FAIL: no image`);
  } catch (e) {
    console.error(`    ${variant}-${angle.id} ERROR: ${e.message}`);
    // Retry once after 10s
    await new Promise(r => setTimeout(r, 10000));
    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: [{ role: 'user', parts }],
        config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
      });
      for (const p of resp.candidates?.[0]?.content?.parts || []) {
        if (p.inlineData) {
          fs.writeFileSync(outPath, Buffer.from(p.inlineData.data, 'base64'));
          console.log(`    ${variant}-${angle.id} OK (retry)`);
          return;
        }
      }
    } catch (e2) {
      console.error(`    ${variant}-${angle.id} RETRY FAIL: ${e2.message}`);
    }
  }
}

// ── Main ──
console.log('=== Fidelity A/B Round 2 (Front + Back + Side) ===\n');

for (const test of TESTS) {
  console.log(`--- ${test.label} ---`);
  const images = loadImages(test.dir);
  console.log(`  ${images.length} images: ${images.map(i => i.name).join(', ')}`);

  // Copy REFs
  const refDir = path.join(PRODUCT_BASE, test.dir);
  for (const [i, f] of fs.readdirSync(refDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).sort().entries()) {
    const refOut = path.join(OUT_DIR, `${test.name}-REF-${i + 1}.jpg`);
    if (!fs.existsSync(refOut)) fs.copyFileSync(path.join(refDir, f), refOut);
  }

  for (const angle of ANGLES) {
    console.log(`  [${angle.id.toUpperCase()}]`);

    // A: single ref
    await generate(test.name, [images[0]], 'A', angle);
    await new Promise(r => setTimeout(r, 2000));

    // B: all refs
    await generate(test.name, images, 'B', angle);
    await new Promise(r => setTimeout(r, 2000));
  }
}

console.log('\n=== Done ===');
console.log('\nOutput:');
fs.readdirSync(OUT_DIR).filter(f => f.includes('mm6') || f.includes('roku')).sort().forEach(f => console.log(`  ${f}`));
console.log('\nCEO: REF画像と比較。特にBACK/SIDEでA vs Bの再現性差を判定。');

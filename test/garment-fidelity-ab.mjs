/**
 * Garment Fidelity A/B Test
 *
 * Purpose: Does sending multiple product images improve garment reproduction?
 *
 * Test A: 1 product image (current behavior)
 * Test B: 3 product images (proposed multi-ref)
 *
 * Same model, same prompt, only difference is number of garment references.
 * CEO目視判定: A vs B、どちらが商品を正確に再現しているか。
 *
 * Usage: source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/garment-fidelity-ab.mjs
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const OUT_DIR = 'test/fidelity-ab-output';
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Model: ELENA (ladies-intl-01) ──
const MODEL_DIR = 'public/agency-models/ladies-intl-01';
const MODEL_REFS = ['polaroid-front.png', 'polaroid-face.png'].map(f =>
  fs.readFileSync(path.join(MODEL_DIR, f)).toString('base64')
);

// ── Product images ──
const PRODUCT_BASE = '/Users/koudzukitakahiro/Downloads/プロジェクト/ファッション・商品';

const TESTS = [
  {
    name: 'miumiu-pants',
    label: 'Miu Miu Grey Cotton Fleece Pants',
    dir: 'グレー コットンフリース パンツ _ Miu Miu',
    // First image = single ref (Test A), First 3 = multi ref (Test B)
  },
  {
    name: 'steven-alan-trench',
    label: 'Steven Alan Cotton Trench Coat',
    dir: '＜Steven Alan＞コットン トレンチ コート',
  },
  {
    name: 'zara-denim',
    label: 'ZARA Wide Leg High Waist Denim',
    dir: 'TRF EXTRA ワイドレッグハイウエストデニムパンツ - ブラック _ ZARA Japan _ 日本',
  },
];

function loadImages(dirName) {
  const dir = path.join(PRODUCT_BASE, dirName);
  const files = fs.readdirSync(dir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();
  return files.map(f => {
    const data = fs.readFileSync(path.join(dir, f)).toString('base64');
    const ext = f.split('.').pop().toLowerCase();
    const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    return { data, mimeType, name: f };
  });
}

const PROMPT_BASE = `Professional EC fashion photography, ZARA / NET-A-PORTER quality.

MODEL IDENTITY (LOCKED — use the EXACT person from reference photos):
Height 179cm, ash blonde straight long hair, blue-grey eyes.

PHOTOGRAPHY:
- FULL BODY shot head to toe, shoes visible
- Clean white studio background
- Directional studio lighting from 45 degrees, shadow ratio 1:2.5 to 1:3
- Natural confident standing pose
- Photorealistic commercial EC quality

CRITICAL: Reproduce the garment EXACTLY as shown in the product reference(s).
Match color, material, pattern, silhouette, design details, proportions precisely.
This is the actual product being sold — accuracy is everything.`;

async function generateWithRefs(testName, label, garmentParts, suffix) {
  const outPath = path.join(OUT_DIR, `${testName}-${suffix}.png`);
  if (fs.existsSync(outPath)) {
    console.log(`  ${suffix} — already exists, skip`);
    return;
  }

  const parts = [
    { text: PROMPT_BASE },
    { text: `\nMODEL REFERENCE PHOTOS:` },
    ...MODEL_REFS.map(d => ({ inlineData: { mimeType: 'image/png', data: d } })),
    { text: `\nGARMENT PRODUCT REFERENCE (${garmentParts.length} image${garmentParts.length > 1 ? 's' : ''} — reproduce this EXACT product):` },
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
        console.log(`  ${suffix} OK`);
        return;
      }
    }
    console.log(`  ${suffix} FAIL: no image`);
  } catch (e) {
    console.error(`  ${suffix} ERROR: ${e.message}`);
  }
}

// ── Main ──
console.log('=== Garment Fidelity A/B Test ===');
console.log(`Output: ${OUT_DIR}/\n`);

for (const test of TESTS) {
  console.log(`\n--- ${test.label} ---`);
  const images = loadImages(test.dir);
  console.log(`  ${images.length} product images: ${images.map(i => i.name).join(', ')}`);

  // Also copy first product image to output for comparison
  const refOutPath = path.join(OUT_DIR, `${test.name}-REF.jpg`);
  if (!fs.existsSync(refOutPath)) {
    const refDir = path.join(PRODUCT_BASE, test.dir);
    const refFile = fs.readdirSync(refDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).sort()[0];
    fs.copyFileSync(path.join(refDir, refFile), refOutPath);
  }

  // Test A: 1 image only (current behavior)
  console.log('  [A] Single ref...');
  await generateWithRefs(test.name, test.label, [images[0]], 'A-single');
  await new Promise(r => setTimeout(r, 3000));

  // Test B: 3 images (multi-ref proposed)
  const multiRefs = images.slice(0, Math.min(3, images.length));
  console.log(`  [B] Multi ref (${multiRefs.length} images)...`);
  await generateWithRefs(test.name, test.label, multiRefs, 'B-multi3');
  await new Promise(r => setTimeout(r, 3000));
}

console.log('\n=== Done ===');
console.log('Output files:');
fs.readdirSync(OUT_DIR).sort().forEach(f => console.log(`  ${f}`));
console.log('\nCEO判定: 各商品のREF画像と比較して、A vs B どちらが商品を忠実に再現しているか。');
console.log('再現性に差がなければ、複数枚対応は不要（UIの複雑さが増すだけ）。');

/**
 * Generate sample outfit images for all Agency models
 * Uses BEDWIN garment images as product references
 *
 * GEMINI_API_KEY=xxx node test/generate-samples.mjs
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }
const ai = new GoogleGenAI({ apiKey: API_KEY });

function loadImage(filePath) {
  const buf = fs.readFileSync(path.resolve(filePath));
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
  return { data: buf.toString('base64'), mimeType };
}

// All models with their reference image folders
const MODELS = [
  { id: 'model-test', name: 'YUKI', gender: 'female', refDir: 'test/agency-models/model-test', refFiles: ['polaroid-front.png', 'polaroid-face.png', 'editorial-beauty.png'] },
  { id: 'ladies-asia-2', name: 'AIKO', gender: 'female', refDir: 'test/agency-models/ladies-asia-2', refFiles: ['polaroid-front.png', 'polaroid-face.png', 'beauty.png'] },
  { id: 'ladies-asia-3', name: 'SAKURA', gender: 'female', refDir: 'test/agency-models/ladies-asia-3', refFiles: ['polaroid-front.png', 'polaroid-face.png', 'beauty.png'] },
  { id: 'rinka', name: 'RINKA', gender: 'female', refDir: 'test/agency-models/rinka', refFiles: ['ref-front.png', 'ref-three-quarter.png', 'ref-smiling.png'] },
  { id: 'ladies-intl-clean', name: 'GEORGIAN', gender: 'female', refDir: 'test/agency-models/ladies-intl-clean', refFiles: ['polaroid-front.png', 'polaroid-face.png', 'beauty.png'] },
  { id: 'ladies-intl-2', name: 'ADARA', gender: 'female', refDir: 'test/agency-models/ladies-intl-2', refFiles: ['polaroid-front.png', 'polaroid-face.png', 'beauty.png'] },
  { id: 'nova', name: 'NOVA', gender: 'female', refDir: 'test/agency-models/nova', refFiles: ['ref-front.png', 'ref-three-quarter.png', 'ref-smiling.png'] },
  { id: 'men-asia-clean', name: 'KENJI T.', gender: 'male', refDir: 'test/agency-models/men-asia-clean', refFiles: ['polaroid-front.png', 'polaroid-face.png', 'beauty.png'] },
  { id: 'ren', name: 'REN', gender: 'male', refDir: 'test/agency-models/ren', refFiles: ['ref-front.png', 'ref-three-quarter.png', 'ref-smiling.png'] },
  { id: 'men-intl-clean', name: 'MARCUS', gender: 'male', refDir: 'test/agency-models/men-intl-clean', refFiles: ['polaroid-front.png', 'polaroid-face.png', 'beauty.png'] },
];

// 3 outfit combinations using BEDWIN garments
const OUTFITS = [
  { shirt: 'test/bedwin-demo/shirt/A.jpg', pants: 'test/bedwin-demo/pants/A.jpg', desc: 'plaid shirt + khaki chinos' },
  { shirt: 'test/bedwin-demo/shirt/B.jpg', pants: 'test/bedwin-demo/pants/B.jpg', desc: 'shirt B + pants B' },
  { shirt: 'test/bedwin-demo/shirt/C.jpg', pants: 'test/bedwin-demo/pants/C.jpg', desc: 'shirt C + pants C' },
];

async function generateSample(model, outfit, outfitIndex) {
  const outDir = `public/agency-models/${model.id}`;
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `sample-${outfitIndex + 1}.png`);

  // Skip if already exists
  if (fs.existsSync(outPath)) {
    console.log(`  ⏭️ ${model.name} sample-${outfitIndex + 1} exists, skipping`);
    return;
  }

  // Load references
  const refs = model.refFiles.map(f => loadImage(path.join(model.refDir, f)));
  const shirtImg = loadImage(outfit.shirt);
  const pantsImg = loadImage(outfit.pants);

  const parts = [];
  parts.push({ text: `FACE IDENTITY — These reference photos show the model. Generate an image of this EXACT person:` });
  for (const ref of refs) {
    parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.data } });
  }

  parts.push({ text: `GARMENT REFERENCES — The model must wear these exact garments:` });
  parts.push({ inlineData: { mimeType: shirtImg.mimeType, data: shirtImg.data } });
  parts.push({ inlineData: { mimeType: pantsImg.mimeType, data: pantsImg.data } });

  parts.push({ text: `Generate a professional e-commerce fashion photograph.

MODEL: The EXACT person from the reference photos above. Same face, same features.
OUTFIT: Wearing the exact garments from the garment references — ${outfit.desc}. Match colors, patterns, materials exactly.

STYLING:
- Shirt worn naturally, untucked
- Natural confident standing pose
- Full body, head to toe

PHOTOGRAPHY:
- Clean studio background
- Directional lighting, shadow ratio 1:2.5 to 1:3
- NO flat lighting, NO blown highlights
- Photorealistic, ZARA / NET-A-PORTER quality

CRITICAL: Face must match references. Garments must match product images.` });

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.35 },
  });

  if (resp.candidates?.[0]?.content) {
    for (const part of resp.candidates[0].content.parts || []) {
      if (part.inlineData) {
        fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
        console.log(`  ✅ ${model.name} sample-${outfitIndex + 1}`);
        return;
      }
    }
  }
  console.error(`  ❌ ${model.name} sample-${outfitIndex + 1} — no image returned`);
}

async function main() {
  console.log('=== Generating Sample Outfit Images ===');
  console.log(`Models: ${MODELS.length} | Outfits: ${OUTFITS.length} each\n`);

  for (const model of MODELS) {
    console.log(`── ${model.name} (${model.id}) ──`);
    for (let i = 0; i < OUTFITS.length; i++) {
      await generateSample(model, OUTFITS[i], i);
      await new Promise(r => setTimeout(r, 3000));
    }
    console.log('');
  }

  console.log('=== Done ===');
}

main().catch(err => { console.error('Failed:', err); process.exit(1); });

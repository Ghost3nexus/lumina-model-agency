/**
 * Generate magazine shots for remaining 4 models (interrupt-safe)
 *
 * Processes ONE model at a time. Run repeatedly if interrupted.
 * Skips models that already have all 4 magazine shots.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-magazine-remaining.mjs
 *   # or specific model:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-magazine-remaining.mjs men-asia-02
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });

const REMAINING = ['men-asia-02', 'men-asia-03', 'influencer-girl-01', 'influencer-boy-01'];
const target = process.argv[2]; // optional: specific model

const PORTRAIT = `\nCRITICAL: Image MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio). Vertical like a magazine page.`;

const MAGAZINE_SHOTS = [
  { name: 'verve-cover', prompt: `VERVE Magazine cover photo. High-fashion editorial portrait. Dramatic architectural designer outfit (avant-garde couture — structured shoulders, unusual silhouette). Dramatic directional studio lighting with deep shadows. Powerful, intimate mood. Clean dark or gradient background.${PORTRAIT}` },
  { name: 'form-editorial', prompt: `FORM Magazine editorial. Full body fashion photograph focusing on STRUCTURE and CONSTRUCTION of clothing. Beautifully tailored designer look — visible seams, interesting textures, architectural cut. Sculptural geometric pose. Clean studio, concrete grey or paper white background.${PORTRAIT}` },
  { name: 'muse-portrait', prompt: `MUSE Magazine intimate portrait. Cinematic film-like style with warm grain and slightly faded tones (Kodak Portra 400 feel). Beautiful but understated outfit. Vulnerable, real, authentic expression — genuine moment captured. Soft natural window light. Intimate storytelling mood.${PORTRAIT}` },
  { name: 'campaign', prompt: `Luxury brand campaign photograph. Full body, elegant coordinated outfit for high-end brand ad (Bottega Veneta, Celine, Prada level). Impeccable styling, minimal accessories. Strong editorial lighting, clean background. Full-page Vogue ad quality. Confident assured pose.${PORTRAIT}` },
];

function modelDone(modelId) {
  const dir = `public/agency-models/${modelId}`;
  return MAGAZINE_SHOTS.every(s => fs.existsSync(path.join(dir, `${s.name}.png`)));
}

async function generateForModel(modelId) {
  const dir = `public/agency-models/${modelId}`;
  if (!fs.existsSync(dir)) { console.error(`Dir not found: ${dir}`); return; }

  // Load identity refs
  const refFiles = ['polaroid-front.png', 'polaroid-face.png'];
  const refs = [];
  for (const f of refFiles) {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) refs.push(fs.readFileSync(p).toString('base64'));
  }
  console.log(`\n=== ${modelId} (${refs.length} identity refs) ===`);

  for (const shot of MAGAZINE_SHOTS) {
    const outPath = path.join(dir, `${shot.name}.png`);

    // Skip if already generated (interrupt-safe)
    if (fs.existsSync(outPath)) {
      console.log(`  ${shot.name} -- already exists, skip`);
      continue;
    }

    console.log(`  ${shot.name}...`);
    const parts = [];
    if (refs.length > 0) {
      parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME person shown in these reference photos. Match every facial feature precisely:' });
      for (const r of refs) parts.push({ inlineData: { mimeType: 'image/png', data: r } });
    }
    parts.push({ text: shot.prompt });

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const resp = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: [{ role: 'user', parts }],
          config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
        });
        for (const p of resp.candidates?.[0]?.content?.parts || []) {
          if (p.inlineData) {
            fs.writeFileSync(outPath, Buffer.from(p.inlineData.data, 'base64'));
            console.log(`  OK (attempt ${attempt})`);
            break;
          }
        }
        if (fs.existsSync(outPath)) break;
      } catch (e) {
        console.error(`  FAIL attempt ${attempt}: ${e.message}`);
        if (attempt < 2) await new Promise(r => setTimeout(r, 10000));
      }
    }
    // Rate limit pause
    await new Promise(r => setTimeout(r, 3000));
  }

  if (modelDone(modelId)) {
    console.log(`  === ${modelId} COMPLETE ===`);
  } else {
    const missing = MAGAZINE_SHOTS.filter(s => !fs.existsSync(path.join(dir, `${s.name}.png`))).map(s => s.name);
    console.log(`  === ${modelId} INCOMPLETE (missing: ${missing.join(', ')}) ===`);
  }
}

// ── Main ──
const todo = target ? [target] : REMAINING.filter(id => !modelDone(id));

if (todo.length === 0) {
  console.log('All 4 models already have magazine shots. Nothing to do.');
  process.exit(0);
}

console.log(`Models to process: ${todo.join(', ')}`);
console.log(`Time: ${new Date().toLocaleString('ja-JP')}`);

for (const id of todo) {
  await generateForModel(id);
  await new Promise(r => setTimeout(r, 5000));
}

// Final summary
console.log('\n=== SUMMARY ===');
for (const id of REMAINING) {
  const done = modelDone(id);
  console.log(`  ${id}: ${done ? 'COMPLETE' : 'INCOMPLETE'}`);
}
console.log(`Finished: ${new Date().toLocaleString('ja-JP')}`);

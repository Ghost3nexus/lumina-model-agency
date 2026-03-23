/**
 * Regenerate all v2 model images in PORTRAIT orientation (2:3)
 * + Add VERVE/FORM/MUSE magazine looks
 *
 * GEMINI_API_KEY=xxx node test/regenerate-portrait.mjs ladies-intl-01
 * GEMINI_API_KEY=xxx node test/regenerate-portrait.mjs all
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }
const target = process.argv[2];
if (!target) { console.error('Usage: node test/regenerate-portrait.mjs <model-id|all>'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Import model descriptions from v2 script
const { execSync } = await import('child_process');

// ── Model descriptions (same as generate-v2-models.mjs) ─────────────────────
// We'll read them dynamically from the existing script
const v2Script = fs.readFileSync('test/generate-v2-models.mjs', 'utf8');
const modelsMatch = v2Script.match(/const MODELS = \{([\s\S]*?)\n\};/);

// Since dynamic import is complex, just define the model IDs we need to regenerate
const V2_MODEL_IDS = [
  'ladies-intl-01', 'ladies-intl-02', 'ladies-intl-03',
  'ladies-asia-01', 'ladies-asia-02', 'ladies-asia-03',
  'men-intl-01', 'men-intl-02', 'men-intl-03',
  'men-asia-01', 'men-asia-02', 'men-asia-03',
  'influencer-girl-01', 'influencer-boy-01',
];

const PORTRAIT_INSTRUCTION = `
CRITICAL FRAMING REQUIREMENT:
- Image MUST be in PORTRAIT orientation (taller than wide, approximately 2:3 ratio)
- DO NOT generate landscape/horizontal images
- The image should be vertical, like a magazine page or model card`;

// ── Shots to regenerate ──────────────────────────────────────────────────────

const SHOTS = [
  { name: 'polaroid-front', prompt: `Agency polaroid/digitals. Full body, white tank/tee + simple pants, flat even lighting, white background, arms at sides, no styling. Clean test shot showing proportions and bone structure.${PORTRAIT_INSTRUCTION}` },
  { name: 'polaroid-face', prompt: `Agency digitals close-up. Head and shoulders, no makeup, hair natural, flat lighting, white background, neutral expression. Show bone structure clearly.${PORTRAIT_INSTRUCTION}` },
  { name: 'editorial', prompt: `Studio editorial portfolio shot. Full body, wearing simple well-cut black clothing (blazer or coat + trousers), professional directional lighting from 45 degrees, clean grey background, natural confident pose. High-fashion agency portfolio quality.${PORTRAIT_INSTRUCTION}` },
  { name: 'beauty', prompt: `Beauty editorial close-up. Face and upper shoulders, minimal makeup, soft beauty dish lighting with catchlights in eyes, warm tone, serene expression, skin texture visible. Magazine beauty page quality.${PORTRAIT_INSTRUCTION}` },
  // ── Magazine looks ──
  { name: 'verve-cover', prompt: `VERVE Magazine cover photo. A high-fashion editorial portrait. The model is wearing a dramatic, architectural designer outfit (avant-garde couture — structured shoulders, unusual silhouette). Dramatic directional studio lighting with deep shadows creating contrast on the face and body. The mood is powerful, intimate, and luminous. Shot as if for the cover of a luxury fashion magazine focused on light and shadow. Clean dark or gradient background.${PORTRAIT_INSTRUCTION}` },
  { name: 'form-editorial', prompt: `FORM Magazine editorial. Full body fashion photograph focusing on the STRUCTURE and CONSTRUCTION of clothing. The model is wearing a beautifully tailored designer look — visible seams, interesting fabric textures, architectural cut. The pose is sculptural, geometric. Shot style: clean, precise, showing how the garment is built. Studio setting, concrete grey or paper white background. The focus is on the FORM of the clothing, not just the model.${PORTRAIT_INSTRUCTION}` },
  { name: 'muse-portrait', prompt: `MUSE Magazine intimate portrait. The model is photographed in a cinematic, film-like style with warm grain and slightly faded tones (like Kodak Portra 400 film). They are wearing a beautiful but understated outfit. The expression is vulnerable, real, authentic — not a fashion pose but a genuine moment captured. Soft natural-looking light (window light feel). The mood is intimate and storytelling. As if this is the moment between poses when the model's real personality shows through.${PORTRAIT_INSTRUCTION}` },
  { name: 'campaign', prompt: `Luxury brand campaign photograph. Full body, wearing an elegant coordinated outfit suitable for a high-end fashion brand advertisement (think Bottega Veneta, Celine, or Prada campaign). Impeccable styling, minimal accessories. Strong editorial lighting, clean background. The image should look like it could appear as a full-page ad in Vogue or Harper's Bazaar. Confident, assured pose.${PORTRAIT_INSTRUCTION}` },
];

async function regenerateModel(modelId) {
  const outputDir = `public/agency-models/${modelId}`;

  // Read existing images as reference for face consistency
  const refFiles = ['polaroid-front.png', 'polaroid-face.png', 'beauty.png', 'editorial.png'];
  const existingRefs = [];
  for (const f of refFiles) {
    const p = path.join(outputDir, f);
    if (fs.existsSync(p)) {
      existingRefs.push(fs.readFileSync(p).toString('base64'));
    }
  }

  // Use first 2 existing refs for identity lock, then regenerate all
  const identityRefs = existingRefs.slice(0, 2);

  console.log(`\n=== ${modelId} (${identityRefs.length} identity refs) ===`);

  // Backup old images
  const backupDir = `test/agency-models-backup/${modelId}`;
  fs.mkdirSync(backupDir, { recursive: true });
  for (const f of fs.readdirSync(outputDir)) {
    if (f.endsWith('.png')) {
      fs.copyFileSync(path.join(outputDir, f), path.join(backupDir, f));
    }
  }

  const newRefs = [];

  for (const shot of SHOTS) {
    console.log(`  ${shot.name}...`);

    const parts = [];

    // Identity lock from existing + newly generated refs
    const allRefs = [...identityRefs, ...newRefs];
    if (allRefs.length > 0) {
      parts.push({ text: `IDENTITY LOCK — Generate the EXACT SAME person shown in these reference photos. Match every facial feature precisely:` });
      for (const refData of allRefs.slice(0, 4)) { // max 4 refs to avoid token limit
        parts.push({ inlineData: { mimeType: 'image/png', data: refData } });
      }
    }

    parts.push({ text: shot.prompt });

    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: [{ role: 'user', parts }],
        config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
      });

      for (const p of resp.candidates?.[0]?.content?.parts || []) {
        if (p.inlineData) {
          const outPath = path.join(outputDir, `${shot.name}.png`);
          fs.writeFileSync(outPath, Buffer.from(p.inlineData.data, 'base64'));
          // Add to refs for consistency
          if (newRefs.length < 3) newRefs.push(p.inlineData.data);
          console.log(`  ✅`);
          break;
        }
      }
    } catch (e) {
      console.error(`  ❌ ${e.message}`);
      await new Promise(r => setTimeout(r, 10000));
      // Retry once
      try {
        const resp = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: [{ role: 'user', parts }],
          config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
        });
        for (const p of resp.candidates?.[0]?.content?.parts || []) {
          if (p.inlineData) {
            fs.writeFileSync(path.join(outputDir, `${shot.name}.png`), Buffer.from(p.inlineData.data, 'base64'));
            if (newRefs.length < 3) newRefs.push(p.inlineData.data);
            console.log(`  ✅ (retry)`);
            break;
          }
        }
      } catch (e2) {
        console.error(`  ❌ retry failed: ${e2.message}`);
      }
    }

    await new Promise(r => setTimeout(r, 3000));
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

const modelsToProcess = target === 'all' ? V2_MODEL_IDS : [target];

for (const modelId of modelsToProcess) {
  await regenerateModel(modelId);
  await new Promise(r => setTimeout(r, 5000));
}

console.log('\n=== All done ===');

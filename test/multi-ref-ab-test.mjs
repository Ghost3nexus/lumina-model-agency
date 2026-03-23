/**
 * A/B Test: Single garment image vs Multi-angle garment images
 *
 * Tests whether sending multiple reference images of the SAME garment
 * improves Gemini's garment reproduction fidelity.
 *
 * Approach: Use an existing model's look-01 as "garment front",
 * then generate with:
 *   A) 1 garment ref only (current behavior)
 *   B) 1 garment ref + explicit "reproduce this garment exactly" emphasis
 *
 * Since we don't have separate front/back/detail product photos,
 * we test whether PROMPT EMPHASIS on garment fidelity improves output.
 * The real multi-image test needs actual product photos from the user.
 *
 * Usage: source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/multi-ref-ab-test.mjs
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const OUT_DIR = 'test/multi-ref-output';
fs.mkdirSync(OUT_DIR, { recursive: true });

// Use ELENA (ladies-intl-01) as our test model
const MODEL_DIR = 'public/agency-models/ladies-intl-01';
const MODEL_REFS = ['polaroid-front.png', 'polaroid-face.png'].map(f =>
  fs.readFileSync(path.join(MODEL_DIR, f)).toString('base64')
);

// Use one of the look images as our "garment" — pretend it's a product photo
// In reality users would upload their own product flat-lay
const GARMENT_REF = fs.readFileSync(path.join(MODEL_DIR, 'look-01.png')).toString('base64');

const BASE_PROMPT = `Professional EC fashion photography, ZARA / NET-A-PORTER quality.
Full body shot, head to toe. Clean studio background.
Directional studio lighting from 45 degrees, shadow ratio 1:2.5.
Natural confident standing pose. Photorealistic.`;

// ── Test A: Current approach (1 garment ref, standard prompt) ──

async function testA() {
  console.log('Test A: Single garment ref, standard prompt...');

  const parts = [
    { text: `${BASE_PROMPT}

MODEL IDENTITY — match this person exactly:` },
    ...MODEL_REFS.map(d => ({ inlineData: { mimeType: 'image/png', data: d } })),
    { text: `GARMENT — put this exact outfit on the model:` },
    { inlineData: { mimeType: 'image/png', data: GARMENT_REF } },
  ];

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.7 },
  });

  for (const p of resp.candidates?.[0]?.content?.parts || []) {
    if (p.inlineData) {
      fs.writeFileSync(path.join(OUT_DIR, 'test-A-standard.png'), Buffer.from(p.inlineData.data, 'base64'));
      console.log('  OK -> test-A-standard.png');
      return;
    }
  }
  console.log('  FAIL: no image returned');
}

// ── Test B: Enhanced garment fidelity prompt ──

async function testB() {
  console.log('Test B: Single garment ref, ENHANCED fidelity prompt...');

  const parts = [
    { text: `${BASE_PROMPT}

MODEL IDENTITY — match this person exactly:` },
    ...MODEL_REFS.map(d => ({ inlineData: { mimeType: 'image/png', data: d } })),
    { text: `GARMENT REFERENCE — CRITICAL REPRODUCTION REQUIREMENTS:
The following image shows the EXACT product to reproduce on the model.
You MUST match:
- EXACT color and shade (no color shifts)
- EXACT material texture (cotton vs silk vs denim must be distinguishable)
- EXACT pattern/print (if striped, match stripe width and spacing)
- EXACT silhouette and fit (oversized vs slim vs relaxed)
- EXACT design details (buttons, pockets, seams, collar shape, hem style)
- EXACT proportions (sleeve length, body length, neckline depth)
Do NOT stylize or reinterpret the garment. Reproduce it as if photographing the SAME physical item.` },
    { inlineData: { mimeType: 'image/png', data: GARMENT_REF } },
  ];

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
  });

  for (const p of resp.candidates?.[0]?.content?.parts || []) {
    if (p.inlineData) {
      fs.writeFileSync(path.join(OUT_DIR, 'test-B-enhanced.png'), Buffer.from(p.inlineData.data, 'base64'));
      console.log('  OK -> test-B-enhanced.png');
      return;
    }
  }
  console.log('  FAIL: no image returned');
}

// ── Test C: Lower temperature for more faithful reproduction ──

async function testC() {
  console.log('Test C: Single garment ref, enhanced prompt, temp=0.2...');

  const parts = [
    { text: `${BASE_PROMPT}

MODEL IDENTITY — match this person exactly:` },
    ...MODEL_REFS.map(d => ({ inlineData: { mimeType: 'image/png', data: d } })),
    { text: `GARMENT — Reproduce this EXACT product on the model. Match every detail: color, material, pattern, silhouette, buttons, seams, proportions. This is the actual product being sold — accuracy is critical.` },
    { inlineData: { mimeType: 'image/png', data: GARMENT_REF } },
  ];

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.2 },
  });

  for (const p of resp.candidates?.[0]?.content?.parts || []) {
    if (p.inlineData) {
      fs.writeFileSync(path.join(OUT_DIR, 'test-C-lowtemp.png'), Buffer.from(p.inlineData.data, 'base64'));
      console.log('  OK -> test-C-lowtemp.png');
      return;
    }
  }
  console.log('  FAIL: no image returned');
}

// ── Test D: Same garment image sent 3 times (simulating multi-angle) ──

async function testD() {
  console.log('Test D: Same garment sent 3x (multi-ref simulation)...');

  const parts = [
    { text: `${BASE_PROMPT}

MODEL IDENTITY — match this person exactly:` },
    ...MODEL_REFS.map(d => ({ inlineData: { mimeType: 'image/png', data: d } })),
    { text: `GARMENT REFERENCE IMAGES — 3 views of the SAME product. Reproduce this EXACT garment:
View 1 (front):` },
    { inlineData: { mimeType: 'image/png', data: GARMENT_REF } },
    { text: `View 2 (detail — same garment, focus on texture and construction):` },
    { inlineData: { mimeType: 'image/png', data: GARMENT_REF } },
    { text: `View 3 (alternate angle — same garment):` },
    { inlineData: { mimeType: 'image/png', data: GARMENT_REF } },
    { text: `CRITICAL: All 3 images show the SAME product. Match it exactly on the model.` },
  ];

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
  });

  for (const p of resp.candidates?.[0]?.content?.parts || []) {
    if (p.inlineData) {
      fs.writeFileSync(path.join(OUT_DIR, 'test-D-multiref.png'), Buffer.from(p.inlineData.data, 'base64'));
      console.log('  OK -> test-D-multiref.png');
      return;
    }
  }
  console.log('  FAIL: no image returned');
}

// ── Run all ──

console.log('=== Multi-ref A/B Test ===');
console.log(`Model: ELENA (ladies-intl-01)`);
console.log(`Garment: look-01.png`);
console.log(`Output: ${OUT_DIR}/\n`);

await testA();
await new Promise(r => setTimeout(r, 3000));
await testB();
await new Promise(r => setTimeout(r, 3000));
await testC();
await new Promise(r => setTimeout(r, 3000));
await testD();

console.log('\n=== Done. Compare outputs in test/multi-ref-output/ ===');
console.log('CEO: 目視でA/B/C/Dを比較。garment再現性が一番高いのはどれか判定してください。');

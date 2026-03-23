#!/usr/bin/env node
/**
 * Creative Campaign: Imagen 4.0 Ultra — Vans BEDWIN × Racing
 * 最高品質モデル。テキストプロンプト + 参照画像
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'test', 'creative-output');

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1); }

const REF_IMAGE_PATH = '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png';

const SCENES = [
  {
    id: 'ultra-shibuya-drift-side',
    prompt: `Photorealistic CGI photograph: A giant navy blue Vans Authentic sneaker with white bandana paisley print pattern, white rubber sole, and white laces — the exact BEDWIN & THE HEARTBREAKERS x Vans OTW collaboration shoe — scaled up to the size of a sports car. It is drifting sideways in parallel with a black Porsche 911 GT3 through the Shibuya scramble crossing in Tokyo during a bright sunny afternoon. Both the giant sneaker and the Porsche are sliding sideways at high speed, thick white tire smoke billowing behind them. The Shibuya 109 building and Starbucks are visible in the background. Pedestrians on the sidewalks watch in shock. The crosswalk lines are visible on the road. Shot from street level, wide angle lens, dramatic action photography, cinematic, 8K detail.`,
  },
  {
    id: 'ultra-shibuya-drift-aerial',
    prompt: `Aerial drone photograph looking straight down at Shibuya scramble crossing in Tokyo during a sunny day. A massive navy blue Vans Authentic sneaker with white bandana paisley pattern (BEDWIN x Vans OTW collab), scaled to the size of a car, is drifting in parallel with a black Porsche 911 through the intersection. Long curved tire smoke trails follow both of them across the white crosswalk lines. The famous Shibuya 109 building is visible at the corner. Tiny pedestrians scatter. Bright daylight, short shadows. Photorealistic CGI, hyper-detailed, overhead shot.`,
  },
  {
    id: 'ultra-shibuya-drift-dynamic',
    prompt: `Intense action shot at Shibuya scramble crossing, Tokyo, bright afternoon sunlight. A car-sized navy blue Vans Authentic sneaker with white bandana/paisley print (BEDWIN & THE HEARTBREAKERS x Vans OTW) is in a tandem drift battle with a black Porsche 911. They are side by side, both completely sideways, massive tire smoke clouds, the sneaker's white rubber sole scraping the asphalt with orange sparks flying. The Porsche's headlights are on. Background shows Shibuya buildings with Japanese signage, blue sky with scattered clouds. Low angle tracking shot from the side, motion blur on background, subjects sharp. Like a scene from Fast and Furious but in broad daylight. Photorealistic CGI photograph.`,
  },
  {
    id: 'ultra-shibuya-pair-race',
    prompt: `Photorealistic CGI: Two giant navy blue Vans Authentic sneakers with white bandana paisley print (BEDWIN x Vans OTW collaboration) racing through Shibuya scramble crossing in daylight, one in each lane, like two race cars. A black Porsche 911 trails behind them in the middle. All three are at full speed, tire smoke everywhere, the crosswalk lines visible beneath. Sunny day, Shibuya 109 and neon billboards in background. Epic wide angle shot from ground level. The shoes have their white soles and white laces clearly visible. Cinematic, blockbuster movie feel.`,
  },
];

// Try Imagen 4.0 Ultra (generateImages API)
async function tryImagen4Ultra(scene) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-ultra-generate-001:generateImages?key=${GEMINI_KEY}`;

  const body = {
    prompt: scene.prompt,
    config: {
      numberOfImages: 1,
    },
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const t = await resp.text();
    return { ok: false, error: `Imagen4 ${resp.status}: ${t.slice(0, 300)}` };
  }

  const data = await resp.json();
  const images = data.generatedImages || data.images || [];
  if (images.length > 0) {
    const imgData = images[0].image?.imageBytes || images[0].imageBytes;
    if (imgData) {
      return { ok: true, imageBase64: imgData, mimeType: 'image/png' };
    }
  }
  return { ok: false, error: `No image in response: ${JSON.stringify(data).slice(0, 300)}` };
}

// Fallback: Gemini 3 Pro Image Preview (generateContent with image output)
async function tryGemini3Pro(scene) {
  const imageData = fs.readFileSync(REF_IMAGE_PATH);
  const base64Image = imageData.toString('base64');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_KEY}`;

  const body = {
    contents: [{
      parts: [
        { inlineData: { mimeType: 'image/png', data: base64Image } },
        { text: `This is a BEDWIN & THE HEARTBREAKERS x Vans OTW collaboration sneaker. Generate a photorealistic CGI image based on this exact shoe design:\n\n${scene.prompt}` },
      ],
    }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const t = await resp.text();
    return { ok: false, error: `Gemini3Pro ${resp.status}: ${t.slice(0, 300)}` };
  }

  const data = await resp.json();
  for (const candidate of (data.candidates || [])) {
    for (const part of (candidate.content?.parts || [])) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        return { ok: true, imageBase64: part.inlineData.data, mimeType: part.inlineData.mimeType };
      }
    }
  }
  return { ok: false, error: 'No image in Gemini3Pro response' };
}

// Fallback 2: Gemini 2.5 Flash Image (what worked before)
async function tryGemini25Flash(scene) {
  const imageData = fs.readFileSync(REF_IMAGE_PATH);
  const base64Image = imageData.toString('base64');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_KEY}`;

  const body = {
    contents: [{
      parts: [
        { inlineData: { mimeType: 'image/png', data: base64Image } },
        { text: `This is a BEDWIN & THE HEARTBREAKERS x Vans OTW collaboration sneaker. Generate a photorealistic CGI image based on this exact shoe design:\n\n${scene.prompt}` },
      ],
    }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    return { ok: false, error: `Flash ${resp.status}` };
  }

  const data = await resp.json();
  for (const candidate of (data.candidates || [])) {
    for (const part of (candidate.content?.parts || [])) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        return { ok: true, imageBase64: part.inlineData.data, mimeType: part.inlineData.mimeType };
      }
    }
  }
  return { ok: false, error: 'No image' };
}

async function generate(scene) {
  console.log(`\n[${scene.id}]`);
  const start = Date.now();

  // Try models in order: Imagen 4 Ultra → Gemini 3 Pro → Gemini 2.5 Flash
  const strategies = [
    { name: 'Imagen 4.0 Ultra', fn: tryImagen4Ultra },
    { name: 'Gemini 3 Pro Image', fn: tryGemini3Pro },
    { name: 'Gemini 2.5 Flash Image', fn: tryGemini25Flash },
  ];

  for (const strategy of strategies) {
    console.log(`  Trying ${strategy.name}...`);
    const result = await strategy.fn(scene);

    if (result.ok) {
      const elapsed = ((Date.now() - start) / 1000).toFixed(0);
      const ext = result.mimeType === 'image/png' ? 'png' : 'jpg';
      const buf = Buffer.from(result.imageBase64, 'base64');
      const outPath = path.join(OUTPUT_DIR, `${scene.id}.${ext}`);
      fs.writeFileSync(outPath, buf);
      console.log(`  ✓ ${strategy.name} — ${elapsed}s, ${(buf.length / 1024).toFixed(0)}KB`);
      return outPath;
    }

    console.log(`  ✗ ${result.error.slice(0, 150)}`);
  }

  console.error(`  ✗ All strategies failed`);
  return null;
}

async function main() {
  console.log('=== Imagen 4.0 Ultra — Vans BEDWIN × Shibuya Drift ===');
  console.log(`Strategy: Ultra → Gemini 3 Pro → 2.5 Flash fallback`);
  console.log(`Scenes: ${SCENES.length}\n`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const scene of SCENES) await generate(scene);

  console.log('\n\nDone. Check test/creative-output/ultra-*');
}

main().catch(e => { console.error(e); process.exit(1); });

#!/usr/bin/env node
/**
 * Model quality A/B test — compare model descriptions
 * Goal: Move from "SHEIN-level" to "ZARA/NAP-level" model appearance
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(BASE_DIR, 'test', 'kontext-output');
const API_BASE = process.env.API_URL || 'https://llumina-fashion-studio.vercel.app';

const IMAGE_FILE = 'training/data/prepared/images/acnestudios_1ed1f7f59496.jpg';

// A/B: different model descriptions
const VARIANTS = [
  {
    id: 'model-a-editorial',
    label: 'A: Editorial high-fashion model',
    modelDesc: 'a tall, slender high-fashion editorial model with sharp cheekbones, effortless confidence, minimal makeup, strong jawline',
    lighting: 'Dramatic studio lighting, strong key light from upper-left creating sculpted shadows on face and garment, shadow ratio 1:3',
  },
  {
    id: 'model-b-zara',
    label: 'B: ZARA EC style',
    modelDesc: 'a professional fashion model with clean natural beauty, subtle confident expression, clear skin, styled hair, elegant posture',
    lighting: 'Bright clean studio lighting, soft directional key light camera-left 45°, gentle fill light, shadow ratio 1:2.5, no harsh shadows',
  },
  {
    id: 'model-c-nap',
    label: 'C: NET-A-PORTER luxury',
    modelDesc: 'a high-end luxury fashion model, refined bone structure, understated elegance, sophisticated neutral expression, luminous skin',
    lighting: 'Premium studio lighting setup, beauty dish key light for soft wrap-around illumination, subtle rim light for separation, shadow ratio 1:2.5',
  },
];

function buildPrompt(variant) {
  return [
    `Full-length fashion e-commerce photograph showing the entire body from head to feet of ${variant.modelDesc} wearing this jacket.`,
    `The jacket: navy cropped jacket with leather collar and zip pockets.`,
    `Standing with relaxed confidence, weight on one leg, one hand in pocket.`,
    `Pure white seamless studio backdrop.`,
    `${variant.lighting}.`,
    `Full body shot including shoes, shot at 85mm f/2.8, tack sharp, high-end fashion photography.`,
  ].join(' ');
}

async function apiCall(action, body) {
  const resp = await fetch(`${API_BASE}/api/flux-kontext`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...body }),
  });
  if (!resp.ok) throw new Error(`API ${action} failed ${resp.status}`);
  return resp.json();
}

async function generate(variant) {
  const filePath = path.join(BASE_DIR, IMAGE_FILE);
  const imageData = fs.readFileSync(filePath);
  const base64 = `data:image/jpeg;base64,${imageData.toString('base64')}`;
  const prompt = buildPrompt(variant);

  console.log(`\n[${variant.id}] ${variant.label}`);
  console.log(`  Model: ${variant.modelDesc.slice(0, 80)}...`);

  const upload = await apiCall('upload', { imageBase64: base64, contentType: 'image/jpeg' });
  const submit = await apiCall('submit', {
    image_url: upload.url, prompt, guidance_scale: 4.0, aspect_ratio: '2:3',
  });

  const start = Date.now();
  while (Date.now() - start < 180000) {
    await new Promise(r => setTimeout(r, 4000));
    const poll = await apiCall('poll', {
      request_id: submit.request_id,
      status_url: submit.status_url,
      response_url: submit.response_url,
    });
    if (poll.status === 'COMPLETED' && poll.images?.length > 0) {
      const resp = await fetch(poll.images[0].url);
      const buf = Buffer.from(await resp.arrayBuffer());
      const outPath = path.join(OUTPUT_DIR, `${variant.id}.png`);
      fs.writeFileSync(outPath, buf);
      console.log(`  ✓ Done ${((Date.now() - start) / 1000).toFixed(0)}s → ${(buf.length/1024).toFixed(0)}KB`);
      return;
    }
    if (poll.status === 'FAILED') throw new Error('Failed');
  }
  throw new Error('Timeout');
}

async function main() {
  console.log('Model Quality A/B/C Test');
  console.log('Goal: SHEIN → ZARA/NAP level model appearance');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const v of VARIANTS) await generate(v);
  console.log('\nDone. Compare model-a/b/c images for model quality.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });

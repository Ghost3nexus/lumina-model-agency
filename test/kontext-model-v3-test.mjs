#!/usr/bin/env node
/**
 * Model v3 test — improved high-end model description with Japanese ethnicity
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(BASE_DIR, 'test', 'kontext-output');
const API_BASE = process.env.API_URL || 'https://llumina-fashion-studio.vercel.app';

const TESTS = [
  {
    id: 'v3-jacket-jp',
    file: 'training/data/prepared/images/acnestudios_1ed1f7f59496.jpg',
    category: 'jacket',
    description: 'navy cropped jacket with leather collar and zip pockets',
    modelDesc: 'a high-end Japanese female fashion model, refined bone structure, understated elegance, slender, medium-length styled dark hair, sophisticated neutral expression, luminous skin',
  },
  {
    id: 'v3-whitetee-jp',
    file: 'training/data/prepared/images/acnestudios_5e53925ae16e.jpg',
    category: 'long-sleeve top',
    description: 'white cotton long-sleeve top with logo print',
    modelDesc: 'a high-end Japanese female fashion model, refined bone structure, understated elegance, slender, medium-length styled dark hair, sophisticated neutral expression, luminous skin',
  },
  {
    id: 'v3-pattern-western',
    file: 'training/data/prepared/images/acnestudios_3269fdab3a7c.jpg',
    category: 'T-shirt',
    description: 'oversized T-shirt with cave-themed graphic print',
    modelDesc: 'a high-end caucasian female fashion model, refined bone structure, understated elegance, slender, long styled brown hair, sophisticated neutral expression, luminous skin',
  },
];

function buildPrompt(t) {
  return [
    `Full-length fashion e-commerce photograph showing the entire body from head to feet of ${t.modelDesc} wearing this ${t.category}.`,
    `The ${t.category}: ${t.description}.`,
    `Standing with relaxed confidence, weight on one leg, one hand in pocket.`,
    `Pure white seamless studio backdrop, bright and clean.`,
    `Premium studio lighting, beauty dish key light for soft wrap-around illumination, subtle rim light for separation, shadow ratio 1:2.5. Visible soft shadows on the ground and clothing folds for depth and dimension.`,
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

async function generate(t) {
  const imageData = fs.readFileSync(path.join(BASE_DIR, t.file));
  const base64 = `data:image/jpeg;base64,${imageData.toString('base64')}`;

  console.log(`\n[${t.id}] ${t.category} — ${t.modelDesc.slice(0, 50)}...`);

  const upload = await apiCall('upload', { imageBase64: base64, contentType: 'image/jpeg' });
  const submit = await apiCall('submit', {
    image_url: upload.url, prompt: buildPrompt(t), guidance_scale: 4.0, aspect_ratio: '2:3',
  });

  const start = Date.now();
  while (Date.now() - start < 180000) {
    await new Promise(r => setTimeout(r, 4000));
    const poll = await apiCall('poll', {
      request_id: submit.request_id, status_url: submit.status_url, response_url: submit.response_url,
    });
    if (poll.status === 'COMPLETED' && poll.images?.length > 0) {
      const resp = await fetch(poll.images[0].url);
      const buf = Buffer.from(await resp.arrayBuffer());
      fs.writeFileSync(path.join(OUTPUT_DIR, `${t.id}.png`), buf);
      console.log(`  ✓ ${((Date.now()-start)/1000).toFixed(0)}s, ${(buf.length/1024).toFixed(0)}KB`);
      return;
    }
    if (poll.status === 'FAILED') throw new Error('Failed');
  }
}

async function main() {
  console.log('Model v3 — High-end model descriptions');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const t of TESTS) await generate(t);
  console.log('\nDone.');
}
main().catch(e => { console.error(e); process.exit(1); });

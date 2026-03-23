#!/usr/bin/env node
/**
 * Quick re-test with improved prompt — 2 images only
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
    id: 'white-tshirt-v2',
    file: 'training/data/prepared/images/acnestudios_5e53925ae16e.jpg',
    category: 'long-sleeve top',
    description: 'white cotton long-sleeve top with logo print',
  },
  {
    id: 'black-jacket-v2',
    file: 'training/data/prepared/images/acnestudios_1ed1f7f59496.jpg',
    category: 'jacket',
    description: 'navy cropped jacket with leather collar and zip pockets',
  },
];

function buildPromptV2(garment) {
  const model = 'a Japanese female fashion model, natural expression, natural skin texture, age 25-30';
  const pose = 'standing naturally with slight angle, one hand relaxed at side';
  const lighting = 'Soft key light camera-left 45°, fill light camera-right 40%, shadow ratio 1:2.5';

  return [
    `Full-length fashion e-commerce photograph showing the entire body from head to feet of ${model} wearing this ${garment.category}.`,
    `The ${garment.category}: ${garment.description}.`,
    `${pose}.`,
    `Pure white seamless studio backdrop, bright and clean.`,
    `${lighting}. Visible soft shadows on the ground and clothing folds for depth and dimension.`,
    `Full body shot including shoes, shot at 85mm f/2.8, tack sharp.`,
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

async function generate(garment) {
  const filePath = path.join(BASE_DIR, garment.file);
  const imageData = fs.readFileSync(filePath);
  const base64 = `data:image/jpeg;base64,${imageData.toString('base64')}`;
  const prompt = buildPromptV2(garment);

  console.log(`\n[${garment.id}] Prompt: ${prompt.slice(0, 150)}...`);

  const upload = await apiCall('upload', { imageBase64: base64, contentType: 'image/jpeg' });
  console.log(`  Uploaded`);

  const submit = await apiCall('submit', {
    image_url: upload.url, prompt, guidance_scale: 4.0, aspect_ratio: '2:3',
  });
  console.log(`  Queued: ${submit.request_id}`);

  const start = Date.now();
  while (Date.now() - start < 180000) {
    await new Promise(r => setTimeout(r, 4000));
    const poll = await apiCall('poll', {
      request_id: submit.request_id,
      status_url: submit.status_url,
      response_url: submit.response_url,
    });
    const elapsed = ((Date.now() - start) / 1000).toFixed(0);
    if (poll.status === 'COMPLETED' && poll.images?.length > 0) {
      const url = poll.images[0].url;
      const resp = await fetch(url);
      const buf = Buffer.from(await resp.arrayBuffer());
      const outPath = path.join(OUTPUT_DIR, `${garment.id}.png`);
      fs.writeFileSync(outPath, buf);
      console.log(`  ✓ Done ${elapsed}s → ${outPath} (${(buf.length/1024).toFixed(0)}KB)`);
      return;
    }
    if (poll.status === 'FAILED') throw new Error('Failed');
    console.log(`  ${poll.status} (${elapsed}s)`);
  }
  throw new Error('Timeout');
}

async function main() {
  console.log('Re-test with improved full-body prompt v2');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const t of TESTS) await generate(t);
  console.log('\nDone. Check kontext-output/ for v2 images.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });

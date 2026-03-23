#!/usr/bin/env node
/**
 * Lighting A/B test — compare guidance_scale 3.0 vs 5.0 vs 7.0
 * Using the black jacket image which had decent results
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(BASE_DIR, 'test', 'kontext-output');
const API_BASE = process.env.API_URL || 'https://llumina-fashion-studio.vercel.app';

const IMAGE_FILE = 'training/data/prepared/images/acnestudios_1ed1f7f59496.jpg';

const PROMPT = [
  'Full-length fashion e-commerce photograph showing the entire body from head to feet of a Japanese female fashion model, natural expression, natural skin texture, age 25-30 wearing this jacket.',
  'The jacket: navy cropped jacket with leather collar and zip pockets.',
  'Standing naturally with slight angle, one hand relaxed at side.',
  'Pure white seamless studio backdrop, bright and clean.',
  'Professional studio lighting with visible directional shadows. Strong key light from camera-left at 45 degrees creating defined shadow contours on the fabric. Fill light at 40% for detail in shadows. Shadow ratio 1:2.5.',
  'Full body shot including shoes, shot at 85mm f/2.8, tack sharp.',
].join(' ');

const GUIDANCE_SCALES = [3.0, 5.0, 7.0];

async function apiCall(action, body) {
  const resp = await fetch(`${API_BASE}/api/flux-kontext`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...body }),
  });
  if (!resp.ok) throw new Error(`API ${action} failed ${resp.status}`);
  return resp.json();
}

async function generate(guidanceScale) {
  const filePath = path.join(BASE_DIR, IMAGE_FILE);
  const imageData = fs.readFileSync(filePath);
  const base64 = `data:image/jpeg;base64,${imageData.toString('base64')}`;

  console.log(`\n[guidance=${guidanceScale}] Generating...`);

  const upload = await apiCall('upload', { imageBase64: base64, contentType: 'image/jpeg' });
  const submit = await apiCall('submit', {
    image_url: upload.url, prompt: PROMPT, guidance_scale: guidanceScale, aspect_ratio: '2:3',
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
      const outPath = path.join(OUTPUT_DIR, `lighting-gs${guidanceScale}.png`);
      fs.writeFileSync(outPath, buf);
      console.log(`  ✓ Done ${((Date.now() - start) / 1000).toFixed(0)}s → ${outPath} (${(buf.length/1024).toFixed(0)}KB)`);
      return;
    }
    if (poll.status === 'FAILED') throw new Error('Failed');
  }
  throw new Error('Timeout');
}

async function main() {
  console.log('Lighting A/B test — guidance_scale comparison');
  console.log('Prompt includes stronger directional lighting language');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const gs of GUIDANCE_SCALES) await generate(gs);
  console.log('\nDone. Compare lighting-gs*.png files for shadow depth differences.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });

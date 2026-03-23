#!/usr/bin/env node
/**
 * v5: 昼の渋谷スクランブル交差点でポルシェと並列ドリフト
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'test', 'creative-output');
const API_BASE = 'https://llumina-fashion-studio.vercel.app';
const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) { console.error('FAL_KEY not set'); process.exit(1); }

const FAL_MAX_URL = 'https://queue.fal.run/fal-ai/flux-pro/kontext/max';

const SCENES = [
  {
    id: 'v5-shibuya-drift-side',
    src: '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png',
    prompt: `Keep this exact sneaker unchanged — same navy bandana paisley pattern, same white rubber sole, same white laces. The sneaker is car-sized and drifting sideways in parallel with a black Porsche 911 GT3 through Shibuya scramble crossing in broad daylight. Both are sliding sideways at the same speed, side by side, thick white tire smoke trailing behind them. Bright sunny day, blue sky, the iconic Shibuya buildings and billboards visible in the background. Pedestrians frozen in shock on the sidewalks. Shot from street level, dramatic wide angle. Photorealistic CGI.`,
    aspect: '16:9',
    guidance: 5.0,
  },
  {
    id: 'v5-shibuya-drift-aerial',
    src: '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png',
    prompt: `Keep this exact sneaker unchanged — same navy bandana pattern, white sole, white laces. Aerial drone shot looking straight down at Shibuya scramble crossing during daytime. This car-sized sneaker and a black Porsche 911 are drifting side by side through the intersection, leaving long curved tire smoke trails on the white crosswalk lines. Bright midday sunlight casting short shadows. The famous Shibuya 109 building and Starbucks visible at the edges. Crowds of people scattered around. Photorealistic CGI, overhead shot.`,
    aspect: '1:1',
    guidance: 5.0,
  },
  {
    id: 'v5-shibuya-drift-behind',
    src: '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png',
    prompt: `Keep this exact sneaker unchanged — same navy bandana paisley print, white sole, white laces. Shot from behind: this car-sized sneaker and a black Porsche 911 GT3 RS are drifting in parallel through Shibuya scramble crossing, both going the same direction, sideways, kicking up massive clouds of white tire smoke. Bright sunny afternoon, warm golden sunlight, the Shibuya cityscape ahead of them with tall buildings and digital billboards. Motion blur on the background. Chase camera angle from behind, like a racing game screenshot. Photorealistic CGI.`,
    aspect: '16:9',
    guidance: 5.0,
  },
  {
    id: 'v5-shibuya-drift-closeup',
    src: '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png',
    prompt: `Keep this exact sneaker unchanged — navy bandana pattern, white rubber sole, white laces. Tight close-up action shot at Shibuya scramble crossing in daylight. The car-sized sneaker's white sole is grinding the asphalt, orange sparks flying. Right next to it, the front wheel of a black Porsche 911 is visible, also drifting. Both machines side by side in extreme close-up. Bright daylight, you can see the crosswalk paint marks and the Shibuya buildings reflected in the Porsche's body. Shallow depth of field, the sneaker's bandana texture in sharp focus. Photorealistic CGI action photography.`,
    aspect: '16:9',
    guidance: 5.0,
  },
];

async function uploadImage(filePath) {
  const fileData = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
  const base64 = `data:${mimeType};base64,${fileData.toString('base64')}`;
  const resp = await fetch(`${API_BASE}/api/flux-kontext`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'upload', imageBase64: base64, contentType: mimeType }),
  });
  if (!resp.ok) throw new Error(`Upload failed: ${resp.status}`);
  const d = await resp.json();
  if (!d.ok) throw new Error(`Upload failed: ${JSON.stringify(d)}`);
  return d.url;
}

async function falGet(url) {
  const resp = await fetch(url, { headers: { 'Authorization': `Key ${FAL_KEY}` } });
  if (!resp.ok) throw new Error(`GET ${resp.status}`);
  return resp.json();
}

async function generate(scene) {
  console.log(`\n[${scene.id}]`);
  const imageUrl = await uploadImage(scene.src);
  console.log(`  Uploaded. Generating...`);

  const resp = await fetch(FAL_MAX_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Key ${FAL_KEY}` },
    body: JSON.stringify({
      image_url: imageUrl, prompt: scene.prompt, guidance_scale: scene.guidance,
      num_images: 1, output_format: 'png', aspect_ratio: scene.aspect, safety_tolerance: '5',
    }),
  });
  if (!resp.ok) throw new Error(`Submit failed: ${resp.status}`);
  const submit = await resp.json();
  console.log(`  Queued: ${submit.request_id}`);

  const start = Date.now();
  while (Date.now() - start < 180000) {
    await new Promise(r => setTimeout(r, 4000));
    try {
      const status = await falGet(submit.status_url);
      const elapsed = ((Date.now() - start) / 1000).toFixed(0);
      if (status.status === 'COMPLETED') {
        const result = await falGet(submit.response_url);
        if (result.images?.length > 0) {
          const imgResp = await fetch(result.images[0].url);
          const buf = Buffer.from(await imgResp.arrayBuffer());
          const outPath = path.join(OUTPUT_DIR, `${scene.id}.png`);
          fs.writeFileSync(outPath, buf);
          console.log(`  ✓ ${elapsed}s, ${(buf.length / 1024).toFixed(0)}KB`);
          return outPath;
        }
      }
      if (status.status === 'FAILED') { console.error(`  ✗ Failed`); return null; }
      process.stdout.write(`  ${status.status} ${elapsed}s\r`);
    } catch (e) { console.warn(`  retry...`); }
  }
  return null;
}

async function main() {
  console.log('=== v5: 昼・渋谷スクランブル・ポルシェ並列ドリフト ===\n');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const scene of SCENES) await generate(scene);
  console.log('\n\nDone.');
}

main().catch(e => { console.error(e); process.exit(1); });

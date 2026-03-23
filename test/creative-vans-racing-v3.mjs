#!/usr/bin/env node
/**
 * Creative Campaign v3: Vans BEDWIN × Racing
 *
 * Strategy: Keep the shoe as the hero. Don't transform it.
 * "Place this exact shoe in a scene" rather than "turn this shoe into a car"
 *
 * Key learning: FLUX Kontext preserves the reference image best when the prompt
 * says "place/put this shoe" rather than "transform/turn this into"
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'test', 'creative-output');

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) { console.error('FAL_KEY not set'); process.exit(1); }

const FAL_BASE = 'https://queue.fal.run/fal-ai/flux-pro/kontext';

const SCENES = [
  {
    id: 'v3-shibuya-race',
    src: '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png',
    prompt: `Place this exact sneaker, enormous and towering over cars, in the middle of Shibuya crossing Tokyo at night. The shoe must stay exactly as it is — same navy bandana pattern, same white sole, same laces — but scaled up to the size of a building. A black Porsche 911 is drifting around the shoe with tire smoke. Tiny people with umbrellas scatter. Rain-soaked road reflects neon signs. Low dramatic angle looking up at the giant shoe. Photorealistic CGI composite.`,
    aspect: '3:4',
  },
  {
    id: 'v3-drag-race',
    src: '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png',
    prompt: `This exact sneaker on a drag racing strip at night, car-sized, sitting on the starting line next to a Porsche 911 GT3. The shoe is identical — navy bandana print, white sole, white laces — just scaled to car size. Green Christmas tree lights are lit. Tire smoke from the Porsche. Stadium lights overhead. Shot from behind showing both competitors about to launch. Wet tarmac reflecting lights. Cinematic photorealistic.`,
    aspect: '16:9',
  },
  {
    id: 'v3-drift-sparks',
    src: '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png',
    prompt: `This exact sneaker sliding sideways on wet asphalt at night like a drifting car, its white rubber sole grinding the road creating a massive shower of orange sparks. The shoe is car-sized. A Porsche 911 is right behind it in tandem drift, headlights piercing through thick tire smoke. Side angle action shot. The sneaker's navy bandana pattern and white laces clearly visible. Tokyo highway at night. Photorealistic CGI action photography.`,
    aspect: '16:9',
  },
  {
    id: 'v3-pair-starting-grid',
    src: '/Users/koudzukitakahiro/Downloads/0068_D.JPG',
    prompt: `This exact pair of sneakers seen from above, placed on a rain-soaked racing starting grid at night. The two shoes sit in lane positions like two race cars. Painted grid lines and numbers visible on the wet asphalt. Stadium lights creating dramatic reflections. The shoes are oversized, each one the size of a race car. A checkered flag pattern on the ground echoing the bandana print. Aerial drone shot, photorealistic.`,
    aspect: '1:1',
  },
  {
    id: 'v3-burnout-rear',
    src: '/Users/koudzukitakahiro/Downloads/0069_C_enhanced.png',
    prompt: `This exact sneaker seen from behind, car-sized, doing a burnout on a dark wet street. Massive white tire smoke billowing from underneath the sole. The red Vans labels on the heel clearly visible through the smoke. Orange sparks flying. A Porsche 911 ahead of it in the distance, red taillights glowing through the haze. Night city street, neon reflections on wet ground. Low rear angle shot. Photorealistic CGI.`,
    aspect: '3:4',
  },
];

async function falRequest(url, body) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Key ${FAL_KEY}` },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`fal.ai ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  return resp.json();
}

async function falGet(url) {
  const resp = await fetch(url, { headers: { 'Authorization': `Key ${FAL_KEY}` } });
  if (!resp.ok) throw new Error(`fal.ai GET ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  return resp.json();
}

async function uploadToFal(filePath) {
  const fileData = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
  const initResp = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate', {
    method: 'POST',
    headers: { 'Authorization': `Key ${FAL_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_type: contentType, file_name: path.basename(filePath) }),
  });
  if (!initResp.ok) throw new Error(`Upload init failed: ${initResp.status}`);
  const { upload_url, file_url } = await initResp.json();
  await fetch(upload_url, { method: 'PUT', headers: { 'Content-Type': contentType }, body: fileData });
  return file_url;
}

async function generate(scene) {
  console.log(`\n[${scene.id}]`);
  console.log(`  src: ${path.basename(scene.src)}`);

  const imageUrl = await uploadToFal(scene.src);
  console.log(`  Uploaded. Generating...`);

  const submit = await falRequest(FAL_BASE, {
    image_url: imageUrl,
    prompt: scene.prompt,
    guidance_scale: 4.0,
    aspect_ratio: scene.aspect,
    output_format: 'png',
    safety_tolerance: '5',
  });

  const statusUrl = submit.status_url || `${FAL_BASE}/requests/${submit.request_id}/status`;
  const responseUrl = submit.response_url || `${FAL_BASE}/requests/${submit.request_id}`;

  const start = Date.now();
  while (Date.now() - start < 180000) {
    await new Promise(r => setTimeout(r, 4000));
    try {
      const status = await falGet(statusUrl);
      const elapsed = ((Date.now() - start) / 1000).toFixed(0);
      if (status.status === 'COMPLETED') {
        const result = await falGet(responseUrl);
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
  console.log('=== Vans BEDWIN × Racing v3 — Shoe as Hero ===');
  console.log(`Strategy: "Place this shoe" not "transform this shoe"`);
  console.log(`Scenes: ${SCENES.length} | guidance: 4.0\n`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const results = [];
  for (const scene of SCENES) {
    const out = await generate(scene);
    results.push({ id: scene.id, path: out });
  }

  console.log('\n\n=== Results ===');
  results.forEach(r => console.log(`  ${r.path ? '✓' : '✗'} ${r.id}`));
}

main().catch(e => { console.error(e); process.exit(1); });

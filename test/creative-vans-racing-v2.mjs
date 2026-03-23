#!/usr/bin/env node
/**
 * Creative Campaign v2: Vans × Fast & Furious Racing
 *
 * ワイルドスピード的なレースシーン — 渋谷交差点でポルシェとガチレース
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(BASE_DIR, 'test', 'creative-output');

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) { console.error('FAL_KEY not set'); process.exit(1); }

const FAL_BASE = 'https://queue.fal.run/fal-ai/flux-pro/kontext';

const SCENES = [
  {
    id: 'v2-shibuya-race-01',
    prompt: `Transform this sneaker into a giant racing machine. A massive oversized version of this exact sneaker, 10 times the size of a car, is aggressively racing side-by-side with a black Porsche 911 GT3 through Shibuya crossing at night. The sneaker has wheels attached to its sole and is drifting hard, thick white tire smoke billowing from underneath. The Porsche is right next to it, both going at extreme speed. Motion blur on the background, neon signs streaking. Wet road reflecting all the lights. Shot from a low dramatic angle like a Fast & Furious movie poster. Cinematic, photorealistic, anamorphic lens flare`,
    aspect: '16:9',
  },
  {
    id: 'v2-shibuya-race-02',
    prompt: `This sneaker transformed into a giant street racing vehicle on Shibuya crossing Tokyo at night. The shoe is enormous, towering over buildings, with glowing wheels on its sole, drifting at high speed around the corner. A silver Porsche 911 is racing underneath it trying to overtake. Massive tire smoke, sparks flying from the sole scraping the road, rain-soaked streets reflecting neon lights in pink and blue. Aerial cinematic shot from above, Fast and Furious style action scene. Photorealistic CGI, dramatic lighting, motion blur`,
    aspect: '16:9',
  },
  {
    id: 'v2-shibuya-race-03',
    prompt: `A head-on dramatic shot of this exact sneaker, blown up to the size of a building, charging straight toward the camera down a Tokyo street at night alongside a white Porsche 911 Turbo. Both are neck and neck in an intense street race. The sneaker has chunky racing wheels bolted to its sole. Tire smoke everywhere, sparks shower from the grinding sole, puddles splashing, Japanese neon signs blurring on both sides. Rain falling. Headlights from the Porsche cutting through the smoke. Photorealistic, cinematic, low angle hero shot, Fast and Furious energy`,
    aspect: '9:16',
  },
  {
    id: 'v2-drift-battle',
    prompt: `Split-second action shot: this sneaker, scaled up to be as large as a sports car, is in a tandem drift battle with a black Porsche 911 on a wet touge mountain road at night. The shoe is sideways, sole grinding the asphalt with a shower of orange sparks. The Porsche is drifting right behind it with headlights blazing through tire smoke. JDM street racing atmosphere, guardrails visible, mountain curve. Rain, reflections, dramatic side angle. Photorealistic, Initial D meets Fast and Furious, cinematic`,
    aspect: '16:9',
  },
  {
    id: 'v2-starting-line',
    prompt: `Intense drag race starting line scene. This exact sneaker, supersized to the scale of a race car, sits on the starting grid next to a matte black Porsche 911 GT3 RS. Both are revving — the sneaker has visible exhaust smoke from its heel, the Porsche has glowing red taillights. Night time, wet tarmac, dramatic stadium lighting from above, crowd silhouettes in the background. Christmas tree drag racing lights turning green. Shot from behind at a low angle showing both competitors about to launch. Photorealistic CGI, Fast and Furious energy, cinematic`,
    aspect: '16:9',
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
  const contentType = path.extname(filePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
  const initResp = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate', {
    method: 'POST',
    headers: { 'Authorization': `Key ${FAL_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_type: contentType, file_name: path.basename(filePath) }),
  });
  if (!initResp.ok) throw new Error(`Upload init failed: ${initResp.status}`);
  const { upload_url, file_url } = await initResp.json();
  const uploadResp = await fetch(upload_url, { method: 'PUT', headers: { 'Content-Type': contentType }, body: fileData });
  if (!uploadResp.ok) throw new Error(`Upload PUT failed: ${uploadResp.status}`);
  console.log(`  Uploaded → ${file_url.slice(0, 60)}...`);
  return file_url;
}

async function generate(scene, imageUrl) {
  console.log(`\n[${scene.id}] Generating...`);
  const submit = await falRequest(FAL_BASE, {
    image_url: imageUrl,
    prompt: scene.prompt,
    guidance_scale: 4.5,
    aspect_ratio: scene.aspect,
    output_format: 'png',
    safety_tolerance: '5',
  });
  const statusUrl = submit.status_url || `${FAL_BASE}/requests/${submit.request_id}/status`;
  const responseUrl = submit.response_url || `${FAL_BASE}/requests/${submit.request_id}`;
  console.log(`  Queued: ${submit.request_id}`);

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
    } catch (e) { console.warn(`  Poll error: ${e.message.slice(0, 80)}`); }
  }
  return null;
}

async function main() {
  console.log('=== Vans × Fast & Furious Racing v2 ===');
  console.log(`Scenes: ${SCENES.length} | guidance_scale: 4.5\n`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const imageUrl = await uploadToFal('/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png');
  const results = [];
  for (const scene of SCENES) {
    const out = await generate(scene, imageUrl);
    results.push({ id: scene.id, path: out });
  }

  console.log('\n\n=== Results ===');
  results.filter(r => r.path).forEach(r => console.log(`  ✓ ${r.id}`));
  results.filter(r => !r.path).forEach(r => console.log(`  ✗ ${r.id}`));
}

main().catch(e => { console.error(e); process.exit(1); });

#!/usr/bin/env node
/**
 * Creative Campaign v4: FLUX Kontext MAX via Vercel proxy
 * Uses the deployed API at llumina-fashion-studio.vercel.app
 * but targets Kontext MAX directly via fal.ai after upload
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'test', 'creative-output');
const API_BASE = 'https://llumina-fashion-studio.vercel.app';

// For MAX model, we call fal.ai directly after getting the uploaded URL via proxy
const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) { console.error('FAL_KEY not set'); process.exit(1); }

const FAL_MAX_URL = 'https://queue.fal.run/fal-ai/flux-pro/kontext/max';

const SCENES = [
  {
    id: 'v4-shibuya-giant',
    src: '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png',
    prompt: `Keep this exact sneaker unchanged — same navy bandana pattern, same white rubber sole, same white laces, same red Vans logo. Scale it up to be 50 meters tall and place it standing upright in the center of Shibuya crossing, Tokyo, at night during heavy rain. A black Porsche 911 GT3 RS is drifting around the base of the giant shoe, white tire smoke swirling. Hundreds of tiny people with colorful umbrellas look up in awe. Neon billboard lights reflect off the wet road in pinks and blues. Dramatic low angle looking up at the massive shoe towering over buildings. Hyper-realistic CGI photograph, 8K detail.`,
    aspect: '3:4',
    guidance: 5.0,
  },
  {
    id: 'v4-tandem-drift',
    src: '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png',
    prompt: `Keep this exact sneaker perfectly preserved — same navy bandana paisley pattern, white sole, white laces. The sneaker is now the size of a Porsche 911, sliding sideways in a high-speed tandem drift on a wet Tokyo highway at night. Its white rubber sole is scraping the asphalt, creating a massive fan of bright orange sparks. A yellow Porsche 911 Turbo is drifting right alongside it, bumper to sole, both at extreme sideways angle. Thick clouds of white tire smoke fill the air. Highway guardrails and city lights streak in the background from motion blur. Side-on action shot, shutter speed 1/250, photorealistic CGI, Fast and Furious cinematography.`,
    aspect: '16:9',
    guidance: 5.0,
  },
  {
    id: 'v4-head-on-charge',
    src: '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png',
    prompt: `This exact sneaker, unchanged in every detail — navy bandana print, white sole, white laces — but enlarged to the size of a truck, charging directly toward the camera on a rain-soaked Tokyo street at night. A white Porsche 911 races neck-and-neck right beside it. Both are going full speed, water spraying up from the wet road, headlight glare from the Porsche cutting through rain and mist. The sneaker's front toe is aimed at the camera like the nose of a race car. Dramatic head-on low angle shot from ground level. Anamorphic lens flare, cinematic rain, photorealistic.`,
    aspect: '16:9',
    guidance: 5.0,
  },
  {
    id: 'v4-starting-line-pair',
    src: '/Users/koudzukitakahiro/Downloads/0068_D.JPG',
    prompt: `This exact pair of sneakers from above, placed on a professional drag racing strip at night. Each shoe is the size of a race car, sitting in separate lanes at the starting line. Painted lane markings, yellow center line, and a checkered start pattern visible on the wet black asphalt. Green starting lights glowing. Tire smoke rising from behind both shoes. Stadium floodlights creating dramatic pools of light. Rain droplets on the ground surface. Overhead drone shot looking straight down. Photorealistic CGI, cinematic.`,
    aspect: '1:1',
    guidance: 5.0,
  },
  {
    id: 'v4-burnout-smoke',
    src: '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png',
    prompt: `This exact sneaker, same navy bandana pattern, same everything, car-sized, doing a massive burnout at a standing start. The white rubber sole is spinning on wet asphalt, creating an enormous cloud of white smoke that engulfs the entire background. Through the smoke, the red taillights of a Porsche 911 are barely visible ahead. Orange sparks spray from under the sole. Night scene, dramatic single spotlight from above illuminating the shoe through the smoke. The sneaker is the clear hero of the frame, centered, sharp, dominant. Low angle, photorealistic CGI.`,
    aspect: '3:4',
    guidance: 5.0,
  },
];

// Upload via Vercel proxy (base64)
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

// Submit to Kontext MAX directly via fal.ai
async function submitMax(imageUrl, prompt, guidance, aspect) {
  const resp = await fetch(FAL_MAX_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Key ${FAL_KEY}` },
    body: JSON.stringify({
      image_url: imageUrl,
      prompt,
      guidance_scale: guidance,
      num_images: 1,
      output_format: 'png',
      aspect_ratio: aspect,
      safety_tolerance: '5',
    }),
  });
  if (!resp.ok) throw new Error(`Submit failed: ${resp.status} ${(await resp.text()).slice(0, 200)}`);
  return resp.json();
}

async function falGet(url) {
  const resp = await fetch(url, { headers: { 'Authorization': `Key ${FAL_KEY}` } });
  if (!resp.ok) throw new Error(`GET ${resp.status}`);
  return resp.json();
}

async function generate(scene) {
  console.log(`\n[${scene.id}]`);

  // Upload via Vercel proxy
  const imageUrl = await uploadImage(scene.src);
  console.log(`  Uploaded. Submitting to Kontext MAX (gs=${scene.guidance})...`);

  // Submit to MAX model
  const submit = await submitMax(imageUrl, scene.prompt, scene.guidance, scene.aspect);
  const statusUrl = submit.status_url;
  const responseUrl = submit.response_url;
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
    } catch (e) { console.warn(`  retry...`); }
  }
  return null;
}

async function main() {
  console.log('=== Vans BEDWIN × Racing v4 — KONTEXT MAX ===');
  console.log(`Upload: Vercel proxy | Generate: fal.ai MAX direct`);
  console.log(`Scenes: ${SCENES.length} | Cost: ~$${(SCENES.length * 0.08).toFixed(2)}\n`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const scene of SCENES) await generate(scene);
  console.log('\n\nDone. Check test/creative-output/v4-*');
}

main().catch(e => { console.error(e); process.exit(1); });

#!/usr/bin/env node
/**
 * Creative Campaign: Vans Bandana x Racing — "Shoes in Unlikely Places"
 *
 * Generates surrealist CGI visuals of a giant Vans sneaker in racing/drift scenes.
 * Inspired by Carlos Jiménez Varela / metcha / Jacquemus style.
 *
 * Uses fal.ai FLUX Kontext Pro directly (not via Vercel proxy).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(BASE_DIR, 'test', 'creative-output');

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  console.error('FAL_KEY not set. Run: source .env.local or export FAL_KEY=...');
  process.exit(1);
}

const FAL_BASE = 'https://queue.fal.run/fal-ai/flux-pro/kontext';

const SCENES = [
  {
    id: 'vans-drift-asphalt',
    prompt: `A giant oversized navy blue bandana-print Vans Authentic sneaker drifting on wet asphalt at night, tire smoke and sparks flying from beneath the shoe, a tiny white drift car chasing behind it, dramatic overhead angle, cinematic lighting with orange streetlights reflecting on wet ground, photorealistic CGI, hyper-detailed product photography meets surrealism`,
    aspect: '4:3',
  },
  {
    id: 'vans-shibuya-crossing',
    prompt: `A colossal navy blue bandana-print Vans Authentic sneaker sitting in the middle of Shibuya crossing Tokyo at night in the rain, tiny people with colorful umbrellas walking around it, neon signs reflecting on wet pavement, aerial drone shot looking down, photorealistic CGI, dramatic scale contrast, cinematic moody lighting`,
    aspect: '3:4',
  },
  {
    id: 'vans-highway-speed',
    prompt: `A massive navy blue bandana-print Vans Authentic sneaker speeding down a highway at night, motion blur on the road, headlight trails streaming behind, sparks flying from the sole grinding on asphalt, side angle shot like a car commercial, cinematic wide lens, photorealistic CGI`,
    aspect: '16:9',
  },
  {
    id: 'vans-desert-dust',
    prompt: `A giant navy blue bandana-print Vans Authentic sneaker racing through a desert landscape kicking up massive dust clouds, golden hour sunlight, tiny rally cars in the background, dramatic low angle shot, photorealistic CGI, epic scale, cinematic color grading warm tones`,
    aspect: '16:9',
  },
  {
    id: 'vans-rain-puddle',
    prompt: `A huge navy blue bandana-print Vans Authentic sneaker splashing through a giant rain puddle on a dark city street, water explosion frozen in mid-air, reflections of city lights in the water, dramatic flash photography feel, photorealistic CGI, hyper-detailed water droplets, dark moody atmosphere`,
    aspect: '1:1',
  },
];

async function falRequest(url, body) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Key ${FAL_KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`fal.ai ${resp.status}: ${t.slice(0, 300)}`);
  }
  return resp.json();
}

async function falGet(url) {
  const resp = await fetch(url, {
    headers: { 'Authorization': `Key ${FAL_KEY}` },
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`fal.ai GET ${resp.status}: ${t.slice(0, 300)}`);
  }
  return resp.json();
}

async function uploadToFal(filePath) {
  // Upload via fal CDN
  const fileData = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';

  // Step 1: Get upload URL
  const initResp = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content_type: contentType,
      file_name: path.basename(filePath),
    }),
  });
  if (!initResp.ok) throw new Error(`Upload init failed: ${initResp.status}`);
  const { upload_url, file_url } = await initResp.json();

  // Step 2: Upload file
  const uploadResp = await fetch(upload_url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: fileData,
  });
  if (!uploadResp.ok) throw new Error(`Upload PUT failed: ${uploadResp.status}`);

  console.log(`  Uploaded → ${file_url.slice(0, 60)}...`);
  return file_url;
}

async function generate(scene, imageUrl) {
  console.log(`\n[${scene.id}] Generating...`);
  console.log(`  Prompt: ${scene.prompt.slice(0, 80)}...`);

  // Submit to queue
  const submit = await falRequest(FAL_BASE, {
    image_url: imageUrl,
    prompt: scene.prompt,
    guidance_scale: 3.5,
    aspect_ratio: scene.aspect,
    output_format: 'png',
    safety_tolerance: '5',
  });

  const requestId = submit.request_id;
  const statusUrl = submit.status_url || `${FAL_BASE}/requests/${requestId}/status`;
  const responseUrl = submit.response_url || `${FAL_BASE}/requests/${requestId}`;

  console.log(`  Queued: ${requestId}`);

  // Poll
  const start = Date.now();
  while (Date.now() - start < 180000) {
    await new Promise(r => setTimeout(r, 4000));

    try {
      const status = await falGet(statusUrl);
      const elapsed = ((Date.now() - start) / 1000).toFixed(0);

      if (status.status === 'COMPLETED') {
        const result = await falGet(responseUrl);
        if (result.images?.length > 0) {
          const imgUrl = result.images[0].url;
          const imgResp = await fetch(imgUrl);
          const buf = Buffer.from(await imgResp.arrayBuffer());
          const outPath = path.join(OUTPUT_DIR, `${scene.id}.png`);
          fs.writeFileSync(outPath, buf);
          console.log(`  ✓ ${elapsed}s, ${(buf.length / 1024).toFixed(0)}KB → ${outPath}`);
          return outPath;
        }
      }

      if (status.status === 'FAILED') {
        console.error(`  ✗ Failed: ${JSON.stringify(status).slice(0, 200)}`);
        return null;
      }

      process.stdout.write(`  ${status.status} ${elapsed}s\r`);
    } catch (e) {
      // Retry on transient errors
      console.warn(`  Poll error: ${e.message.slice(0, 80)}, retrying...`);
    }
  }

  console.error(`  ✗ Timeout`);
  return null;
}

async function main() {
  console.log('=== Vans Bandana × Racing — Creative Campaign ===');
  console.log(`Scenes: ${SCENES.length}`);
  console.log(`Cost estimate: $${(SCENES.length * 0.04).toFixed(2)}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Upload source image
  const srcImage = '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png';
  console.log('Uploading source image...');
  const imageUrl = await uploadToFal(srcImage);

  // Generate all scenes
  const results = [];
  for (const scene of SCENES) {
    const out = await generate(scene, imageUrl);
    results.push({ id: scene.id, path: out, prompt: scene.prompt });
  }

  // Summary
  console.log('\n\n=== Results ===');
  const success = results.filter(r => r.path);
  console.log(`${success.length}/${results.length} generated`);
  success.forEach(r => console.log(`  ${r.id}: ${r.path}`));

  // Write manifest
  const manifest = {
    description: 'Vans Bandana × Racing — Surrealist CGI Campaign Visuals',
    source_image: srcImage,
    tool: 'FLUX Kontext Pro (fal.ai)',
    cost_per_image: '$0.04',
    created: new Date().toISOString().split('T')[0],
    assets: results.map(r => ({
      file: r.path ? path.basename(r.path) : null,
      purpose: 'SNS campaign visual — shoes in unlikely places',
      prompt: r.prompt,
      tool: 'fal-ai/flux-pro/kontext',
      status: r.path ? 'success' : 'failed',
    })),
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nManifest: ${OUTPUT_DIR}/manifest.json`);
}

main().catch(e => { console.error(e); process.exit(1); });

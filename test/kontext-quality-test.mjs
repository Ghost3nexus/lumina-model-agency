#!/usr/bin/env node
/**
 * FLUX Kontext 5-Garment Quality Test
 *
 * Tests the full pipeline: upload → submit → poll → output
 * for 5 garment categories per CLAUDE.md quality checklist:
 *   1. White T-shirt
 *   2. Black jacket
 *   3. Patterned (graphic tee)
 *   4. Denim
 *   5. Knit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(BASE_DIR, 'test', 'kontext-output');

// Use production API or local dev
const API_BASE = process.env.API_URL || 'https://llumina-fashion-studio.vercel.app';
const POLL_INTERVAL = 4000;
const MAX_POLL = 180_000; // 3 min

// Test garments
const TEST_GARMENTS = [
  {
    id: 'white-tshirt',
    label: '白Tシャツ (White T-shirt)',
    file: 'training/data/prepared/images/acnestudios_5e53925ae16e.jpg',
    category: 'long-sleeve top',
    material: 'cotton jersey',
    description: 'white cotton long-sleeve top with logo print',
  },
  {
    id: 'black-jacket',
    label: '黒ジャケット (Black Jacket)',
    file: 'training/data/prepared/images/acnestudios_1ed1f7f59496.jpg',
    category: 'jacket',
    material: 'cotton twill with leather collar',
    description: 'navy cropped jacket with leather collar and zip pockets',
  },
  {
    id: 'patterned-tee',
    label: '柄物 (Patterned)',
    file: 'training/data/prepared/images/acnestudios_3269fdab3a7c.jpg',
    category: 'T-shirt',
    material: 'printed cotton',
    description: 'oversized T-shirt with cave-themed graphic print in brown and black tones',
  },
  {
    id: 'denim',
    label: 'デニム (Denim)',
    file: 'training/data/prepared/images/driesvannoten_0b4d28be5009.jpg',
    category: 'full outfit',
    material: 'cotton with embroidery',
    description: 'black double-breasted textured top with decorative buttons and olive embroidered shorts',
  },
  {
    id: 'knit',
    label: 'ニット (Knit)',
    file: 'training/data/prepared/images/driesvannoten_1226d3655495.jpg',
    category: 'shirt',
    material: 'striped cotton',
    description: 'navy and red striped shirt with white collar detail',
  },
];

function buildPrompt(garment) {
  const modelDesc = 'a Japanese female fashion model, natural expression, natural skin texture, age 25-30';
  const pose = 'standing naturally with slight angle, one hand relaxed at side';
  const bg = 'Clean seamless white studio background';
  const lighting = 'Soft key light camera-left 45°, fill light camera-right 40%, shadow ratio 1:2.5';

  return [
    `A full body photograph of ${modelDesc} wearing this ${garment.category}.`,
    `The ${garment.category}: ${garment.description}.`,
    `${pose}.`,
    `Professional fashion photography in a studio with ${bg.toLowerCase()}.`,
    `${lighting}. Well-lit with soft directional shadows.`,
    `Shot from head to shoes, sharp focus, 85mm f/2.8.`,
  ].join(' ');
}

async function apiCall(action, body) {
  const resp = await fetch(`${API_BASE}/api/flux-kontext`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...body }),
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`API ${action} failed ${resp.status}: ${t.slice(0, 300)}`);
  }
  return resp.json();
}

async function generateImage(garment) {
  const filePath = path.join(BASE_DIR, garment.file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const imageData = fs.readFileSync(filePath);
  const base64 = `data:image/jpeg;base64,${imageData.toString('base64')}`;
  const prompt = buildPrompt(garment);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`[${garment.id}] ${garment.label}`);
  console.log(`  File: ${garment.file}`);
  console.log(`  Image size: ${(imageData.length / 1024).toFixed(0)}KB`);
  console.log(`  Prompt: ${prompt.slice(0, 120)}...`);
  console.log(`${'='.repeat(60)}`);

  // Step 1: Upload
  console.log(`  [1/3] Uploading to fal CDN...`);
  const start = Date.now();
  const uploadResult = await apiCall('upload', {
    imageBase64: base64,
    contentType: 'image/jpeg',
  });
  if (!uploadResult.ok) throw new Error(`Upload failed: ${JSON.stringify(uploadResult)}`);
  console.log(`  [1/3] Uploaded: ${uploadResult.url.slice(0, 60)}... (${((Date.now() - start) / 1000).toFixed(1)}s)`);

  // Step 2: Submit
  console.log(`  [2/3] Submitting generation...`);
  const submitResult = await apiCall('submit', {
    image_url: uploadResult.url,
    prompt,
    guidance_scale: 4.0,
    aspect_ratio: '2:3',
  });
  if (!submitResult.ok) throw new Error(`Submit failed: ${JSON.stringify(submitResult)}`);
  console.log(`  [2/3] Queued: ${submitResult.request_id}`);

  // Step 3: Poll
  console.log(`  [3/3] Polling...`);
  const pollStart = Date.now();
  while (Date.now() - pollStart < MAX_POLL) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL));
    const elapsed = ((Date.now() - start) / 1000).toFixed(0);

    const pollResult = await apiCall('poll', {
      request_id: submitResult.request_id,
      status_url: submitResult.status_url,
      response_url: submitResult.response_url,
    });

    console.log(`  [3/3] Status: ${pollResult.status} (${elapsed}s)`);

    if (pollResult.status === 'COMPLETED' && pollResult.images?.length > 0) {
      const outputUrl = pollResult.images[0].url;
      const totalMs = Date.now() - start;
      console.log(`  ✓ Done in ${(totalMs / 1000).toFixed(1)}s`);
      console.log(`  Output: ${outputUrl}`);

      // Download output image
      const imgResp = await fetch(outputUrl);
      if (imgResp.ok) {
        const buffer = Buffer.from(await imgResp.arrayBuffer());
        const outPath = path.join(OUTPUT_DIR, `${garment.id}.png`);
        fs.writeFileSync(outPath, buffer);
        console.log(`  Saved: ${outPath} (${(buffer.length / 1024).toFixed(0)}KB)`);

        return {
          id: garment.id,
          label: garment.label,
          success: true,
          outputUrl,
          localPath: outPath,
          durationMs: totalMs,
          outputSizeKB: (buffer.length / 1024).toFixed(0),
          seed: pollResult.seed,
        };
      }
    }

    if (pollResult.status === 'FAILED') {
      throw new Error(`Generation failed: ${pollResult.error || 'Unknown'}`);
    }
  }

  throw new Error(`Timeout after ${MAX_POLL / 1000}s`);
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  FLUX Kontext 5-Garment Quality Test                    ║');
  console.log('║  Target: botika-level EC product photography            ║');
  console.log(`║  API: ${API_BASE.slice(0, 48).padEnd(48)} ║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  // Ensure output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const results = [];
  const errors = [];

  for (const garment of TEST_GARMENTS) {
    try {
      const result = await generateImage(garment);
      results.push(result);
    } catch (err) {
      console.error(`  ✗ FAILED: ${err.message}`);
      errors.push({ id: garment.id, label: garment.label, error: err.message });
    }
  }

  // Summary
  console.log('\n\n' + '═'.repeat(60));
  console.log('QUALITY TEST SUMMARY');
  console.log('═'.repeat(60));
  console.log(`\nTotal: ${results.length} success / ${errors.length} failed`);
  console.log(`\nSuccessful generations:`);
  for (const r of results) {
    console.log(`  ${r.id}: ${(r.durationMs / 1000).toFixed(1)}s, ${r.outputSizeKB}KB, seed=${r.seed || 'N/A'}`);
  }
  if (errors.length > 0) {
    console.log(`\nFailed:`);
    for (const e of errors) {
      console.log(`  ${e.id}: ${e.error.slice(0, 100)}`);
    }
  }

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    apiBase: API_BASE,
    results,
    errors,
    qualityCriteria: {
      lighting: 'Shadow ratio 1:2.5-1:3, no white blowout, directional light visible',
      texture: 'Fabric material identifiable (cotton/silk/denim/knit distinction)',
      model: 'Natural pose, lifelike expression, natural proportions',
      background: 'Pure white (#FFFFFF) for EC, clean seamless',
      resolution: 'Current: ~832x1248, target: 2048+',
    },
    benchmark: 'botika.com gallery images (minimum quality bar)',
  };

  const reportPath = path.join(OUTPUT_DIR, 'quality-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport saved: ${reportPath}`);
  console.log('\n⚠ NEXT STEP: Visually inspect output images and compare with botika.com gallery');
  console.log(`  Output dir: ${OUTPUT_DIR}/`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

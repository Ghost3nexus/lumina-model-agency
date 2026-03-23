#!/usr/bin/env node
/**
 * Creative Campaign: Gemini Imagen 3 — Vans BEDWIN × Racing
 *
 * Text-to-image with Gemini's native image generation.
 * No reference image — pure prompt. Higher creative freedom for surreal scenes.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'test', 'creative-output');

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1); }

// Read the reference image to send along with the prompt
const REF_IMAGE_PATH = '/Users/koudzukitakahiro/Downloads/0069_B_enhanced.png';

const SCENES = [
  {
    id: 'gem-shibuya-drift-side',
    prompt: `Photorealistic CGI photograph: A giant navy blue Vans Authentic sneaker with white bandana paisley print pattern, white rubber sole, and white laces — the exact BEDWIN & THE HEARTBREAKERS x Vans OTW collaboration shoe — scaled up to the size of a sports car. It is drifting sideways in parallel with a black Porsche 911 GT3 through the Shibuya scramble crossing in Tokyo during a bright sunny afternoon. Both the giant sneaker and the Porsche are sliding sideways at high speed, thick white tire smoke billowing behind them. The Shibuya 109 building and Starbucks are visible in the background. Pedestrians on the sidewalks watch in shock. The crosswalk lines are visible on the road. Shot from street level, wide angle lens, dramatic action photography, cinematic, 8K detail.`,
  },
  {
    id: 'gem-shibuya-drift-aerial',
    prompt: `Aerial drone photograph looking straight down at Shibuya scramble crossing in Tokyo during a sunny day. A massive navy blue Vans Authentic sneaker with white bandana paisley pattern (BEDWIN x Vans OTW collab), scaled to the size of a car, is drifting in parallel with a black Porsche 911 through the intersection. Long curved tire smoke trails follow both of them across the white crosswalk lines. The famous Shibuya 109 building is visible at the corner. Tiny pedestrians scatter. Bright daylight, short shadows. Photorealistic CGI, hyper-detailed, overhead shot.`,
  },
  {
    id: 'gem-shibuya-drift-dynamic',
    prompt: `Intense action shot at Shibuya scramble crossing, Tokyo, bright afternoon sunlight. A car-sized navy blue Vans Authentic sneaker with white bandana/paisley print (BEDWIN & THE HEARTBREAKERS x Vans OTW) is in a tandem drift battle with a black Porsche 911. They are side by side, both completely sideways, massive tire smoke clouds, the sneaker's white rubber sole scraping the asphalt with orange sparks flying. The Porsche's headlights are on. Background shows Shibuya buildings with Japanese signage, blue sky with scattered clouds. Low angle tracking shot from the side, motion blur on background, subjects sharp. Like a scene from Fast and Furious but in broad daylight. Photorealistic CGI photograph.`,
  },
  {
    id: 'gem-shibuya-pair-race',
    prompt: `Photorealistic CGI: Two giant navy blue Vans Authentic sneakers with white bandana paisley print (BEDWIN x Vans OTW collaboration) racing through Shibuya scramble crossing in daylight, one in each lane, like two race cars. A black Porsche 911 trails behind them in the middle. All three are at full speed, tire smoke everywhere, the crosswalk lines visible beneath. Sunny day, Shibuya 109 and neon billboards in background. Epic wide angle shot from ground level. The shoes have their white soles and white laces clearly visible. Cinematic, blockbuster movie feel.`,
  },
];

async function generateWithGemini(scene) {
  console.log(`\n[${scene.id}]`);

  // Read reference image
  const imageData = fs.readFileSync(REF_IMAGE_PATH);
  const base64Image = imageData.toString('base64');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-ultra-generate-001:generateImages?key=${GEMINI_KEY}`;

  const body = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Image,
            },
          },
          {
            text: `This is a BEDWIN & THE HEARTBREAKERS x Vans OTW collaboration sneaker. Generate a photorealistic CGI image based on this exact shoe design:\n\n${scene.prompt}`,
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  };

  console.log(`  Generating with Gemini...`);
  const start = Date.now();

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const t = await resp.text();
    console.error(`  ✗ Gemini ${resp.status}: ${t.slice(0, 300)}`);
    return null;
  }

  const data = await resp.json();
  const elapsed = ((Date.now() - start) / 1000).toFixed(0);

  // Extract image from response
  const candidates = data.candidates || [];
  for (const candidate of candidates) {
    const parts = candidate.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        const imgBuf = Buffer.from(part.inlineData.data, 'base64');
        const ext = part.inlineData.mimeType === 'image/png' ? 'png' : 'jpg';
        const outPath = path.join(OUTPUT_DIR, `${scene.id}.${ext}`);
        fs.writeFileSync(outPath, imgBuf);
        console.log(`  ✓ ${elapsed}s, ${(imgBuf.length / 1024).toFixed(0)}KB → ${path.basename(outPath)}`);
        return outPath;
      }
    }
  }

  // No image found — check for text response
  for (const candidate of candidates) {
    const parts = candidate.content?.parts || [];
    for (const part of parts) {
      if (part.text) {
        console.log(`  Text response: ${part.text.slice(0, 200)}`);
      }
    }
  }

  console.error(`  ✗ No image in response (${elapsed}s)`);
  return null;
}

async function main() {
  console.log('=== Gemini Imagen 3 — Vans BEDWIN × Shibuya Drift ===');
  console.log(`Scenes: ${SCENES.length} | Model: gemini-2.5-flash-image\n`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const scene of SCENES) {
    await generateWithGemini(scene);
  }

  console.log('\n\nDone. Check test/creative-output/gem-*');
}

main().catch(e => { console.error(e); process.exit(1); });

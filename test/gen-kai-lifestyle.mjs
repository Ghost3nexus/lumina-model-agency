/**
 * KAI (influencer-boy-01) — Lifestyle Shots
 *
 * Japanese-Australian mixed heritage. Surfer. Vegan, yoga.
 * Sustainable swimwear brand. Golden retriever personality. Bilingual with Aussie slang.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-kai-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-kai-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/influencer-boy-01';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `MALE model named KAI. Japanese-Australian mixed heritage, dark brown curly-wavy hair with natural sun-bleached highlights, light brown eyes (distinctive), 178cm, lean athletic surfer build, light-medium warm olive sun-kissed skin. Easy effortless charisma.`;

const LIFESTYLE_SHOTS = [
  {
    name: 'surf-01',
    prompt: `${IDENTITY}
SCENE: Emerging from the ocean carrying a surfboard under one arm, walking through shallow surf toward the beach. His wetsuit is half-peeled down, the top hanging at his waist, showing his lean athletic torso — surfer's build, natural, not bodybuilder. Water droplets on his skin and hair. The surfboard is a classic shortboard, slightly worn from use.
Morning light — early golden sun low on the horizon, creating beautiful backlight through the ocean spray. The beach is Kamakura or Shonan — Japanese coastline visible, perhaps Enoshima island in the far background. The ocean is alive — waves breaking behind him.
Athletic, joyful, completely in his element. His expression is relaxed, happy — the post-surf glow. Salt water in his curly hair. This is where KAI is most himself. Color palette: ocean blues, golden morning light, wet sand, warm skin tones.${PORTRAIT}`,
  },
  {
    name: 'yoga-01',
    prompt: `${IDENTITY}
SCENE: Doing yoga on a beach or outdoor wooden deck at sunrise. He is in tree pose (Vrksasana) or warrior pose (Virabhadrasana) — a strong, balanced posture. Wearing simple shorts (earth tone or navy), no shirt. His lean athletic body shows natural muscle definition, not strained.
Golden warm morning light — the sun is just above the horizon, creating a beautiful warm rim light around his silhouette. Shot from the side or slight angle to capture the pose's geometry. The ocean or sky is the background — expansive, minimal.
Peaceful, centered — this is daily practice, not performance. His eyes are closed or gazing steadily ahead. His breath is visible in the cool morning air perhaps. The mood is meditative, grounded, connected to the earth and ocean.
Color palette: sunrise golds and pinks, warm skin, ocean blue, the simplicity of sand or weathered wood.${PORTRAIT}`,
  },
  {
    name: 'kamakura-01',
    prompt: `${IDENTITY}
SCENE: Walking through old Kamakura streets near temples. Ancient stone steps, temple gates (torii or sanmon) visible in the background, tall trees creating a canopy overhead. He is walking casually — mid-stride, relaxed posture, perhaps one hand holding a green smoothie in a reusable cup.
Wearing relaxed Stussy-style — a graphic t-shirt (simple, not loud), wide khaki or olive shorts, Birkenstock Arizona sandals. A simple canvas tote bag over one shoulder. The outfit is effortless California-meets-Japan.
Dappled sunlight through the ancient trees — creating beautiful light and shadow patterns on the stone path and on him. The contrast between his casual contemporary style and the ancient temple setting. Sacred meets casual — he respects the space but is completely natural in it.
Color palette: deep greens of temple forest, warm stone grey, earth tones of his outfit, dappled golden light.${PORTRAIT}`,
  },
  {
    name: 'workshop-01',
    prompt: `${IDENTITY}
SCENE: Working on his sustainable swimwear brand in a bright, airy studio space. He is examining fabric samples spread on a large work table — holding up a piece of recycled ocean fabric to the light, or comparing swatches. Or packing orders: neatly folding swimwear pieces, kraft paper packaging, handwritten thank-you notes visible.
Wearing a simple white cotton t-shirt, shorts. Barefoot on a clean concrete or wood floor. The studio is bright and clean: white walls, large windows, a few potted plants, sustainable/eco materials visible — recycled fabric rolls, organic cotton samples, eco-packaging.
The entrepreneur side — purpose-driven, hands-on. His expression is focused but relaxed — he genuinely enjoys this work. The studio reflects his values: minimal waste, natural materials, ocean-inspired color palette on the swimwear pieces.
Color palette: bright whites, natural light, ocean blues and greens on fabric, kraft brown, plant green.${PORTRAIT}`,
  },
];

// Load identity reference images
function loadRefs() {
  const refs = [];
  for (const f of ['polaroid-front.png', 'beauty.png', 'editorial.png']) {
    const p = path.join(MODEL_DIR, f);
    if (fs.existsSync(p)) refs.push(fs.readFileSync(p).toString('base64'));
  }
  return refs;
}

async function generateShot(shot, refs) {
  const outPath = path.join(MODEL_DIR, `${shot.name}.png`);
  if (!force && fs.existsSync(outPath)) {
    console.log(`  ⏭️  ${shot.name} exists, skip`);
    return;
  }

  console.log(`  🎬 ${shot.name}...`);
  const parts = [];
  if (refs.length > 0) {
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME man shown in these reference photos. Match every facial feature precisely: dark brown curly-wavy hair with natural sun-bleached highlights, light brown distinctive eyes, lean athletic surfer build, light-medium warm olive sun-kissed skin, Japanese-Australian mixed features.' });
    for (const r of refs) parts.push({ inlineData: { mimeType: 'image/png', data: r } });
  }
  parts.push({ text: shot.prompt });

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: [{ role: 'user', parts }],
        config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
      });
      for (const p of resp.candidates?.[0]?.content?.parts || []) {
        if (p.inlineData) {
          fs.writeFileSync(outPath, Buffer.from(p.inlineData.data, 'base64'));
          const stats = fs.statSync(outPath);
          console.log(`  ✅ ${shot.name} — ${(stats.size / 1024).toFixed(0)}KB`);
          return;
        }
      }
      // Log text response if no image
      const textParts = (resp.candidates?.[0]?.content?.parts || []).filter(p => p.text);
      if (textParts.length) console.log(`  ⚠️  ${shot.name} text response: ${textParts[0].text.slice(0, 200)}`);
      else console.log(`  ⚠️  ${shot.name} no image (attempt ${attempt})`);
    } catch (e) {
      console.error(`  ❌ ${shot.name} error (attempt ${attempt}): ${e.message}`);
      if (attempt < 2) await new Promise(r => setTimeout(r, 10000));
    }
  }
}

async function main() {
  console.log('=== KAI Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

/**
 * LARS (men-intl-02) — Lifestyle Shots
 *
 * Copenhagen born, Amsterdam based. Industrial design student.
 * Designs furniture. Cycles everywhere. Nordic food. Kinfolk aesthetic.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-lars-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-lars-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/men-intl-02';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `MALE model named LARS. Dutch heritage, sandy blonde medium-length hair pushed back naturally, light blue eyes, 187cm, lean runner's build, slight stubble, fair skin with light freckling. Easy confidence.`;

const LIFESTYLE_SHOTS = [
  {
    name: 'design-01',
    prompt: `${IDENTITY}
SCENE: In his design studio/workshop. He is sanding a wooden chair prototype with focused attention, or sketching furniture designs on large paper with a pencil. Wearing a simple grey cotton crewneck sweater, dark work apron over it. Sawdust visible on his hands and the workbench. Natural north-light pouring from large industrial windows, creating beautiful directional shadows across the workspace.
Workshop details: raw wood surfaces, clamps, tools hung on pegboard, half-finished furniture pieces. The space is functional, lived-in, creative.
Kinfolk magazine aesthetic — understated, tactile, craft-focused. Warm neutral color palette: greys, natural wood tones, cream. The mood is quiet concentration, the satisfaction of making things with your hands.${PORTRAIT}`,
  },
  {
    name: 'bike-01',
    prompt: `${IDENTITY}
SCENE: Cycling through Amsterdam canal streets on a classic Dutch city bike (opafiets). He is in motion — pedaling casually, one hand on handlebars, looking ahead with relaxed confidence. Wearing a COS-style camel wool coat (mid-length, beautiful drape), cream chunky knit scarf, dark navy trousers, leather boots.
Morning light — soft golden, slightly misty Amsterdam atmosphere. Canal water reflecting the light and bridge arches visible. Classic Amsterdam townhouses in soft background. Shot from slightly low angle to capture the movement and the canal street context.
The feeling is effortless European style — someone who looks this good without trying. Cinematic quality, like a still from a Scandinavian film set in Amsterdam.${PORTRAIT}`,
  },
  {
    name: 'cafe-01',
    prompt: `${IDENTITY}
SCENE: Sitting at a minimal Scandinavian-style cafe. He is reading Kinfolk or Monocle magazine, absorbed in the pages. A simple white ceramic cup of coffee beside him on a clean wood table. Wearing an Our Legacy cable-knit sweater in ecru/cream — the knit texture clearly visible, quality material.
Clean Scandinavian cafe interior: light wood furniture, white walls, simple pendant lamp, a few green plants. Natural window light flooding in from the side, creating soft directional lighting on his face and the magazine pages.
The mood is calm, content, unhurried. A man completely comfortable in solitude. Shot feels like Cereal Magazine — minimal, warm, quietly luxurious. Warm neutral palette: creams, light woods, whites.${PORTRAIT}`,
  },
  {
    name: 'cook-01',
    prompt: `${IDENTITY}
SCENE: Cooking in a minimal apartment kitchen. Open wooden shelving with simple ceramics — handmade bowls, mugs, plates in neutral tones. He is making something simple — kneading bread dough or stirring a pot of soup. Wearing a white cotton t-shirt with a linen apron over it. Flour or ingredients visible on the counter.
Warm kitchen lighting — a combination of overhead pendant light and natural light from a window. The kitchen is minimal but warm: light wood countertops, white tile, a few herbs in pots, copper or cast iron cookware.
Nordic domestic bliss — the beauty of everyday rituals. The mood is meditative, grounded. He is present in the moment, focused on the simple pleasure of cooking. Color palette: warm whites, natural wood, cream, touches of green from herbs.${PORTRAIT}`,
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME man shown in these reference photos. Match every facial feature precisely: sandy blonde medium-length hair pushed back naturally, light blue eyes, lean build, slight stubble, fair skin with light freckling.' });
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
  console.log('=== LARS Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

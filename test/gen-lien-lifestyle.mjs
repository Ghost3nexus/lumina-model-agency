/**
 * LIEN (ladies-asia-03) — Lifestyle Shots
 *
 * Vietnamese-French. Born HCMC, raised Paris 11ème.
 * Photographer with father's 1983 Nikon FM2. Zine-maker. Flea market obsessive.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-lien-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-lien-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/ladies-asia-03';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `FEMALE fashion model named LIEN. Vietnamese-French woman, dark brown (almost black) sharp modern shag haircut with choppy layers and side-swept bangs, dark brown wide-set almond eyes, 176cm, light olive warm golden skin.`;

const LIFESTYLE_SHOTS = [
  {
    name: 'camera-01',
    prompt: `${IDENTITY}
SCENE: On the streets of Paris, shooting with her vintage Nikon FM2 film camera. Eye pressed to the viewfinder, focused on something down the street. Her shag haircut framing her face, bangs swept to one side. The photographer becomes the subject.
Wearing a Dior-inspired trench coat in classic khaki (belted, collar popped), over a simple black turtleneck, dark straight-leg jeans. The camera's black body and chrome details visible in her hands.
Autumn Parisian light — soft, slightly golden, the leaves of plane trees overhead creating dappled light patterns on the sidewalk. Haussmann buildings in soft focus behind. Her posture is focused and slightly crouched, the stance of someone who knows cameras intimately. Shot feels like a Magnum photographer's portrait — the tool and the eye, inseparable.${PORTRAIT}`,
  },
  {
    name: 'flea-01',
    prompt: `${IDENTITY}
SCENE: At a Paris flea market (Marché aux Puces de Saint-Ouen). She is digging through a bin of vintage photographs and postcards, or holding up a found object to examine it in the light. Stalls overflowing with antiques, vintage clothing, old cameras, books, and curiosities behind her.
Wearing a vintage denim jacket (slightly oversized, worn-in medium wash), classic Breton stripe top (navy and cream), wide khaki high-waisted trousers, white canvas sneakers. Hair choppy and textured, moving naturally.
Bright but diffused morning light under the market's partial cover — creating interesting shadows. The market is colorful and cluttered, full of visual texture. Her expression is one of excited discovery — the joy of finding something nobody else saw. Shot feels like a Purple magazine street style capture — cool, cultured, authentically Parisian.${PORTRAIT}`,
  },
  {
    name: 'zine-01',
    prompt: `${IDENTITY}
SCENE: In her messy apartment-studio in the 11th arrondissement. She is on the floor, working on a zine — cutting photographs with scissors, arranging layouts, prints and contact sheets spread everywhere. Glue stick, X-Acto knife, washi tape, scattered Polaroids, and a light box nearby.
Wearing an oversized chunky knit sweater (cream or oatmeal, sleeves pushed up), hair clipped up messily with a claw clip, stray pieces framing her face. Cross-legged on a worn wooden floor.
Shot from floor-level perspective — we see her world spread out around her. Warm interior light from a desk lamp and the ambient glow of the apartment. The space is creative chaos — film negatives hanging from a string on the wall, stacked zines on a shelf, a French press coffee on the floor beside her. NOT curated or aesthetic — genuinely messy. Shot feels like a DAZED studio visit feature — the artist in their element.${PORTRAIT}`,
  },
  {
    name: 'belleville-01',
    prompt: `${IDENTITY}
SCENE: Eating pho at a small authentic Vietnamese restaurant in Belleville, Paris. Seated at a simple formica table, chopsticks in her right hand, lifting noodles from a large bowl. Steam rising from the pho, lime wedges and herbs on a side plate. She is mid-bite or blowing on the noodles, a natural candid moment.
Wearing a Maison Kitsuné cardigan in navy blue (unbuttoned, relaxed), simple white crew-neck tee underneath. Hair down with bangs swept to the side. The restaurant interior is small and authentic — not trendy, not renovated. Fluorescent lights mixing with daylight from the window. Vietnamese signage, other diners blurred in the background.
A taste of home in Paris. Her expression is comfortable, relaxed — this is her neighborhood spot. Shot feels like a Monocle city guide photograph — local life, cultural identity, the beauty of the everyday.${PORTRAIT}`,
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME woman shown in these reference photos. Match every facial feature precisely: Vietnamese-French woman, sharp modern shag haircut with choppy layers and side-swept bangs, dark brown wide-set almond eyes, light olive warm golden skin.' });
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
  console.log('=== LIEN Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

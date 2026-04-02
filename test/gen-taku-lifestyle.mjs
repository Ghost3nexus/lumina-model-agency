/**
 * TAKU (men-asia-03) — Lifestyle Shots
 *
 * Age 38. Former Popeye editor. Runs gallery-cafe in Kuramae.
 * Divorced, daughter (8) on weekends. First-edition book collector. Pour-over coffee scientist.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-taku-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-taku-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/men-asia-03';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `MALE model named TAKU. Japanese man in his late 30s/early 40s, black hair with premature grey at temples (distinguished), dark brown eyes with smile lines, 180cm, athletic solid build, medium warm skin with texture and reality, 2-day stubble.`;

const LIFESTYLE_SHOTS = [
  {
    name: 'cafe-01',
    prompt: `${IDENTITY}
SCENE: Behind the counter of his gallery-cafe in Kuramae. Making pour-over coffee with scientific precision — a Hario V60 dripper on a glass server, gooseneck kettle pouring a thin precise stream of water in a spiral pattern, a digital scale underneath showing the weight. He is focused intently on the pour, timing it.
Wearing a COMOLI cotton-linen shirt in natural/ecru, a simple canvas apron. Sleeves rolled to forearms. Reading glasses pushed up on his forehead or hanging from the shirt collar.
Warm wood and concrete interior — the cafe is an aesthetic space: poured concrete counter, warm wood shelves, exposed bulb pendant lights, artwork on the walls. Coffee equipment is beautifully arranged.
The craftsman — pour-over as meditation. His expression is focused, precise, present. The care he puts into every cup is visible. Color palette: warm wood, concrete grey, cream, copper of the kettle, dark coffee.${PORTRAIT}`,
  },
  {
    name: 'books-01',
    prompt: `${IDENTITY}
SCENE: In his apartment, surrounded by floor-to-ceiling bookshelves packed with books — art books, literature, photography collections, vintage magazines. He is sitting in a worn leather reading chair (cognac or dark brown, well-loved), reading a hardcover book with complete absorption. One leg crossed over the other.
Wearing a visvim noragi jacket (indigo, textured fabric) over a simple grey t-shirt. Reading glasses on. Perhaps a whiskey glass on the side table.
Warm lamp light — a single floor lamp or desk lamp creating a pool of warm golden light in an otherwise softly dim room. The bookshelves recede into gentle shadow. The leather of the chair glows in the lamplight.
The intellectual at home — this is his sanctuary. The accumulated wisdom of all these books surrounds him. His expression is absorbed, peaceful, content. Color palette: warm indigo, cognac leather, golden lamplight, book spines in various colors.${PORTRAIT}`,
  },
  {
    name: 'daughter-01',
    prompt: `${IDENTITY}
SCENE: Walking in a park with his young daughter (8 years old, shown from behind or partially — we see her small figure but not her full face). They are holding hands, walking along a tree-lined path. Autumn leaves on the ground and in the trees. Perhaps she is looking up at him, or they are both looking ahead at something.
He is wearing casual BEAMS F weekend style — a navy unstructured blazer, light blue oxford shirt (untucked or slightly untucked), khaki chinos, white sneakers. Relaxed, approachable, the weekend father.
Autumn afternoon light — warm, golden, filtering through the tree canopy creating dappled light patterns on the path. The park is peaceful, maybe a Tokyo park like Inokashira or Yoyogi.
A tender, private moment — the love between father and daughter expressed in the simple act of walking together. His expression is soft, warm, present. NOT sentimental — quiet, real, grounded. Color palette: autumn golds, navy, warm greens, dappled sunlight.${PORTRAIT}`,
  },
  {
    name: 'gallery-01',
    prompt: `${IDENTITY}
SCENE: In his gallery space, hanging or arranging artwork on clean white walls. He is positioning a framed piece — stepping back to check alignment, or carefully placing it on a hook. The gallery is minimal: polished concrete floor, white walls, track lighting.
Wearing an Auralee wool crewneck sweater in dark charcoal or navy — the quality of the knit visible, luxurious but understated. Dark trousers, simple leather shoes. No apron — this is the curator, not the barista.
Natural overhead lighting supplemented by gallery track lights — clean, even, designed to show art at its best. A few other pieces already hung on the walls. Perhaps a stepladder nearby, packing materials on the floor.
The curator at work — the same precision he brings to coffee, applied to visual composition. His eye for placement, balance, space. His expression is analytical, aesthetic, satisfied. Color palette: white walls, charcoal knitwear, warm wood frames, concrete grey.${PORTRAIT}`,
  },
];

// Load identity reference images
function loadRefs() {
  const refs = [];
  for (const f of ['polaroid-front.png', 'muse-portrait.png', 'campaign.png']) {
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME man shown in these reference photos. Match every facial feature precisely: black hair with premature grey at temples, dark brown eyes with smile lines, athletic solid build, medium warm skin with texture, 2-day stubble. Late 30s/early 40s distinguished appearance.' });
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
  console.log('=== TAKU Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

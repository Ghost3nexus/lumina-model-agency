/**
 * MIKU (ladies-asia-01) — Lifestyle shots
 *
 * CEO direction: gallery, Koenji backstreet, tea ceremony, reading in minimal apartment.
 * Character: Lives in Koenji, works at contemporary art gallery SIDE 2.
 * Obsessed with brutalist architecture, Noh theater. Reads Murakami. Secretly loves taiyaki.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-miku-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-miku-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/ladies-asia-01';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `FEMALE model. Professional high-fashion Japanese female model, age 21, height 175cm. FACE: Striking angular face — diamond-shaped with high sharp cheekbones. Single-lid monolid eyes that are narrow and intense. Small refined nose, thin precise lips. Strong defined jaw. HAIR: Black, blunt cut at chin level. Geometric, architectural. Glossy like lacquer. SKIN: Porcelain fair, cool undertone. Matte, even, flawless.`;

const LIFESTYLE_SHOTS = [
  {
    name: 'gallery-01',
    prompt: `${IDENTITY}
SCENE: Standing in a white-cube contemporary art gallery, contemplating a large minimalist installation (abstract geometric sculpture or monochrome canvas). Wearing all-black Comme des Garçons — oversized deconstructed blazer with asymmetric hem, slim black trousers, pointed black leather shoes. Arms crossed. Expression: intense intellectual focus, slight furrowed brow.
Clean gallery lighting — directional spots creating defined shadows on the white walls. Shadow ratio 1:2.5. The space is vast, minimal, almost sacred. She IS the art — her angular silhouette and geometric hair echo the installation. Shot from a slight distance to show the scale of the gallery space. Museum-quality atmosphere.
NO heavy makeup. Natural skin. WOMENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'koenji-01',
    prompt: `${IDENTITY}
SCENE: Walking through a narrow Koenji backstreet at dusk. Small vintage shops with hand-painted signs and warm izakaya lanterns creating bokeh in the background. Old concrete buildings, tangled overhead cables, a parked bicycle. Wearing Sacai layered outfit — MA-1 bomber hybrid jacket (navy/black with exposed seams and fabric panels), relaxed black trousers, chunky black boots. A small black leather shoulder bag.
Shot from behind at a 3/4 angle — we see her profile and the geometric hair silhouette against the warm glow of the street. She walks with purpose, alone. The mood is atmospheric, cinematic, melancholic. Natural ambient light mixing with warm artificial light from shops. Slight motion blur on the edges. This is HER neighborhood.
NO heavy makeup. Natural skin. WOMENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'tea-01',
    prompt: `${IDENTITY}
SCENE: Practicing tea ceremony in an authentic tatami room. NOT cosplay — real chadou. Kneeling in proper seiza position on tatami. Wearing simple dark indigo kimono (understated, no flashy patterns — wabi-sabi aesthetic) or alternatively just her black clothing adapted to the setting. Whisking matcha in a ceramic chawan (tea bowl) with a bamboo chasen. A mizusashi water container and natsume tea caddy nearby.
Natural soft light filtering through shoji screens — warm, diffused, creating gentle gradients across the room. Shadow ratio 1:3. The light catches the steam rising from the matcha. Meditative stillness. Her angular features and precise movements mirror the discipline of the ceremony. The room is spare — tatami, shoji, a single hanging scroll (kakejiku). Absolute quiet in the image.
NO heavy makeup. Natural skin.${PORTRAIT}`,
  },
  {
    name: 'reading-01',
    prompt: `${IDENTITY}
SCENE: Sitting on the floor of her minimal Tokyo apartment. Legs tucked to one side or cross-legged. Books stacked in small towers around her — Murakami, architecture monographs, Noh theater texts. She is reading, completely absorbed, holding a paperback. Wearing an oversized CFCL knit dress in charcoal grey — fluid, sculptural ribbed knit that pools around her on the floor.
A single warm pendant light overhead creates a cone of light around her reading spot. The apartment is almost empty — bare concrete or white walls, wooden floor, a single potted monstera plant, nothing else. The minimalism is deliberate, not poverty. This is how she chooses to live. Evening atmosphere. Intimate, private, quiet. Shot from slightly above, looking down at her world.
NO heavy makeup. Natural skin. WOMENSWEAR only.${PORTRAIT}`,
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME woman shown in these reference photos. Match every facial feature precisely — the diamond-shaped face, sharp cheekbones, monolid eyes, chin-length geometric black hair, porcelain skin:' });
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
          const stat = fs.statSync(outPath);
          console.log(`  ✅ ${shot.name} — ${(stat.size / 1024).toFixed(0)} KB`);
          return;
        }
      }
      console.log(`  ⚠️  ${shot.name} no image (attempt ${attempt})`);
    } catch (e) {
      console.error(`  ❌ ${shot.name} error (attempt ${attempt}): ${e.message}`);
      if (attempt < 2) await new Promise(r => setTimeout(r, 10000));
    }
  }
}

async function main() {
  console.log('=== MIKU (ladies-asia-01) Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

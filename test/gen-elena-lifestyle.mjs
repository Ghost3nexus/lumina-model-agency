/**
 * ELENA (ladies-intl-01) — Lifestyle Shots
 *
 * Architecture student at KTH Stockholm. Minimalist. Brutalist architecture lover.
 * Dieter Rams, Peter Zumthor. Georg Jensen bracelet. Södermalm.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-elena-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-elena-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/ladies-intl-01';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `FEMALE model. Professional high-fashion female model, Scandinavian heritage (Swedish-Danish), age 23, height 179cm. FACE: Elongated oval face, razor-sharp cheekbones, large blue-grey eyes with heavy lids giving a sleepy-editorial quality, straight refined nose, thin lips with defined cupid's bow, strong jaw softened by feminine proportions. Barely-there blonde eyebrows. HAIR: Pale ash blonde, straight, long, center-parted. Almost white-blonde. SKIN: Very fair, translucent quality, cool pink undertone. ACCESSORY: Slim Georg Jensen silver bracelet on left wrist (always present).`;

const LIFESTYLE_SHOTS = [
  {
    name: 'arch-01',
    prompt: `${IDENTITY}
SCENE: Standing in front of brutalist concrete architecture (Tadao Ando-inspired raw concrete walls with precise geometric formwork patterns). She is studying the space — looking upward at the architecture, one hand lightly touching the concrete surface. Wearing an oversized camel coat (The Row silhouette — luxurious, unstructured), crisp white cotton shirt underneath with collar visible, high-waisted black wide-leg trousers, minimal black leather loafers.
Natural overcast Scandinavian light — soft, diffused, grey sky. Cool color temperature. The concrete textures are prominent. Composition places her off-center, architectural lines creating strong geometry. The overall mood is contemplative, intellectual, quiet power.
Shot feels like Kinfolk magazine — understated luxury meets architectural appreciation. NO heavy makeup, natural beauty. Hair down, slightly wind-touched.${PORTRAIT}`,
  },
  {
    name: 'studio-01',
    prompt: `${IDENTITY}
SCENE: At her architecture desk in a studio workspace. She is sketching on tracing paper with a fine mechanical pencil, focused and absorbed. Architectural scale models (white cardboard/foam board, minimalist forms) visible on the desk. Rolls of drawings, a metal ruler, and an architecture book open nearby.
Wearing a simple grey cashmere crewneck sweater (relaxed fit, quality visible in the knit texture), hair pulled back in a low bun revealing her sharp bone structure. Georg Jensen bracelet visible on her wrist as she draws.
Warm desk lamp lighting (single source, creating gentle shadows across her face and hands). The rest of the studio falls into soft darkness. Intimate, focused atmosphere. Shot captures the beauty of creative concentration.
Color palette: warm greys, whites, natural wood desk. NOT sterile — lived-in creative workspace.${PORTRAIT}`,
  },
  {
    name: 'cafe-01',
    prompt: `${IDENTITY}
SCENE: Sitting alone at a minimal Scandinavian cafe. She is reading an open architecture book (large format, visible architectural drawings on the pages). An oat milk coffee in a simple ceramic cup beside her. Sitting at a clean wood table near a large window.
Wearing a white Jil Sander-style shirt (crisp cotton, perfect collar, slightly oversized), tailored trousers in dark navy or charcoal. Hair down, tucked behind one ear. Minimal expression — serene, absorbed in thought.
Natural light flooding from the window, creating beautiful directional light on her face and the book pages. Clean Scandinavian interior: light wood, white walls, plants, simple pendant lamp. The atmosphere is one of serene solitude — she is completely comfortable alone.
This should feel like a Cereal Magazine photograph — minimal, warm, quietly luxurious.${PORTRAIT}`,
  },
  {
    name: 'city-01',
    prompt: `${IDENTITY}
SCENE: Walking along Stockholm waterfront (Södermalm area) at golden hour. She is mid-stride, walking toward camera at a slight angle. Hair catching the wind and golden light — strands of pale blonde lit up by the sun. She is in her own world, not looking at camera, gaze somewhere in the distance.
Wearing a COS oversized grey wool coat (slightly below knee, beautiful drape), white minimalist leather sneakers, dark trousers visible underneath. Hands in coat pockets or one hand holding the coat closed against the breeze.
Golden hour light — warm and directional, creating long shadows. Stockholm waterfront visible in background: calm water reflecting golden sky, distant buildings in soft focus. The city is quiet, end of day atmosphere.
The composition captures movement and solitude. She is the only figure in frame. Shot has a cinematic quality — like a still from a Scandinavian film.${PORTRAIT}`,
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME woman shown in these reference photos. Match every facial feature precisely: elongated oval face, razor-sharp cheekbones, large blue-grey eyes with heavy lids, straight refined nose, thin lips, pale ash blonde center-parted hair, very fair translucent skin.' });
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
  console.log('=== ELENA Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

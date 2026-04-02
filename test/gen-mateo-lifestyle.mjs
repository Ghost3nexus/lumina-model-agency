/**
 * MATEO (men-intl-03) — Lifestyle Shots
 *
 * Buenos Aires born, Barcelona at 10. Former semi-pro footballer.
 * Wine/oenology. Mediterranean lifestyle. Tango.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-mateo-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-mateo-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/men-intl-03';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `MALE model named MATEO. Argentine-Spanish heritage, dark brown thick wavy hair styled back with natural movement, dark brown eyes with thick lashes, 185cm, athletic well-proportioned build, medium olive warm skin, Mediterranean tan, 2-3 days intentional stubble.`;

const LIFESTYLE_SHOTS = [
  {
    name: 'wine-01',
    prompt: `${IDENTITY}
SCENE: At a wine tasting in an atmospheric wine cellar. He is holding a glass of red wine up to the light, examining the color with an expert's eye — tilting the glass slightly, looking through it with focused appreciation. Wearing a Brunello Cucinelli-style unstructured linen blazer in warm sand/beige, open-collar white linen shirt underneath showing a hint of chest. Sleeves slightly pushed up.
Warm ambient cellar lighting — golden tones from overhead fixtures, stone walls and wooden wine barrels visible in the background. Wine bottles racked along walls. The atmosphere is rich, warm, sophisticated.
The mood is the connoisseur at work — quiet expertise, sensory appreciation. Mediterranean elegance without trying. Color palette: warm golds, deep reds of the wine, stone greys, cream linen.${PORTRAIT}`,
  },
  {
    name: 'football-01',
    prompt: `${IDENTITY}
SCENE: Playing casual football (soccer) on a Barcelona beach or a sun-drenched park pitch. He is in motion — mid-kick, dribbling, or celebrating a goal with arms wide. Wearing a simple white cotton t-shirt (slightly sweat-dampened, clinging to his athletic build), navy shorts. Barefoot on sand or in cleats on grass.
Late afternoon golden light — warm, directional, creating long dramatic shadows. The sun is low, backlighting him with a golden rim. Other players implied but he is the clear subject. The scene feels spontaneous, real, joyful.
Athletic, joyful, completely in his element. NOT posed — this is authentic movement. The energy is pure: the love of the game, the Mediterranean sun, physical freedom. Color palette: golden light, white, navy, warm sand/green.${PORTRAIT}`,
  },
  {
    name: 'dinner-01',
    prompt: `${IDENTITY}
SCENE: Hosting dinner on a beautiful Mediterranean terrace. A long wooden table is set with Mediterranean food — grilled fish, salads, bread, olive oil, wine bottles, candles beginning to glow. He is pouring red wine into a glass or laughing warmly with implied guests just out of frame. Wearing a navy linen shirt with sleeves rolled up to the elbows, showing tanned forearms.
Warm evening golden hour — the sky is deep amber and blue behind him. String lights or lanterns add warm points of light. Terracotta pots, climbing vines, and stone walls frame the scene. The terrace overlooks something beautiful (implied sea or garden).
La dolce vita — the art of living well. Generosity, warmth, celebration. This is a man who brings people together around food and wine. Color palette: warm amber, navy, terracotta, deep greens, candlelight gold.${PORTRAIT}`,
  },
  {
    name: 'tango-01',
    prompt: `${IDENTITY}
SCENE: Dancing Argentine tango in a Buenos Aires milonga or practice studio. He is mid-movement — a precise, dramatic step. One arm extended in classic tango embrace, body turned with controlled tension. Wearing sharp black trousers with perfect drape, white dress shirt open at the collar, sleeves rolled slightly. Black leather dance shoes.
Dramatic warm lighting — a single warm spotlight or golden ambient light from the side, creating strong shadows across his face and body. A partner is implied but the focus is entirely on him. Wooden dance floor, mirrors or a vintage milonga interior in soft background.
Passion and precision — the duality of tango. Control and fire. His expression is intense, focused, present. This is where his Argentine roots come alive. Color palette: black, white, warm gold light, dark wood.${PORTRAIT}`,
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME man shown in these reference photos. Match every facial feature precisely: dark brown thick wavy hair styled back, dark brown eyes with thick lashes, athletic build, medium olive warm skin, Mediterranean tan, 2-3 days intentional stubble.' });
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
  console.log('=== MATEO Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

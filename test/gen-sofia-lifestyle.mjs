/**
 * SOFIA (ladies-intl-03) — Lifestyle Shots
 *
 * Brazilian-Italian heritage. Milan-born, grew up between Rome and São Paulo.
 * Film student. Loves Fellini. Cooks for 8 without asking.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-sofia-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-sofia-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/ladies-intl-03';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `FEMALE fashion model named SOFIA. Brazilian-Italian heritage, dark chestnut thick wavy hair past shoulders, brown eyes with golden amber flecks, 177cm, medium olive warm golden skin, light freckling across nose.`;

const LIFESTYLE_SHOTS = [
  {
    name: 'kitchen-01',
    prompt: `${IDENTITY}
SCENE: Cooking in a beautiful Italian kitchen — terracotta tiles, copper pots hanging on the wall, open shelves with ceramic dishes. She is making fresh pasta or stirring a large pot on the stove. Wearing a simple white linen blouse with sleeves rolled up to the elbows, a vintage patterned apron tied at the waist. Flour on her hands and forearms.
Warm golden interior light — late afternoon sun streaming through a kitchen window, mixing with the warm glow of the stove. She is laughing, or tasting from a wooden spoon with eyes closed in pleasure. The Mediterranean warmth incarnate. Steam rising, ingredients on the wooden counter — tomatoes, basil, olive oil. The freckling across her nose visible in the warm light. Shot feels like a Bon Appétit Italia editorial — real cooking, real joy, genuine warmth.${PORTRAIT}`,
  },
  {
    name: 'cinema-01',
    prompt: `${IDENTITY}
SCENE: Sitting alone in an old-style Italian cinema. Red velvet seats, ornate gilded ceiling, art deco wall sconces providing dim warm light. She is the only person in the theater, watching the screen (not visible). The projected light from the screen illuminates her face in soft shifting tones.
Wearing a Bottega Veneta-style oversized chunky knit sweater in rich chocolate brown, pushing the sleeves up. Hair loose and wavy around her shoulders. Her expression is contemplative, slightly emotional — absorbed in whatever she is watching. Fellini on screen perhaps.
The cinema interior is atmospheric — dust motes in the projector beam, worn velvet, the romance of old European cinema. Shot feels like a Paolo Sorrentino film still — beauty in solitude, Italian melancholy, cinematic light.${PORTRAIT}`,
  },
  {
    name: 'market-01',
    prompt: `${IDENTITY}
SCENE: At an Italian outdoor market (Mercato). She is holding a bunch of fresh sunflowers or selecting ripe peaches from a fruit stall. Bright Mediterranean sunlight, colorful market stalls overflowing with produce, flowers, and artisan goods behind her.
Wearing a Jacquemus-style summer look — slightly oversized natural linen blazer with sleeves pushed up, flowing midi skirt in a warm earth tone, a woven straw basket bag on her arm. Minimal gold jewelry. Sandals. Hair catching the sunlight, wavy and sun-warmed.
The light is bright but not harsh — warm midday Mediterranean sun with natural shade from market awnings creating dappled patterns. Colors are rich and saturated: reds, oranges, greens of the produce. She is smiling at a vendor or examining produce with genuine interest. Shot feels like a The Sartorialist in Italy — effortless European style in a real setting.${PORTRAIT}`,
  },
  {
    name: 'terrace-01',
    prompt: `${IDENTITY}
SCENE: On a rooftop terrace at golden hour. Milan or Rome skyline stretching out behind her — terracotta rooftops, distant domes and bell towers. She is seated at a small wrought iron table with a glass of red wine and a plate of cheese and figs.
Wearing a Max Mara camel coat draped over her shoulders (not through the sleeves — the Italian way), a simple black knit dress underneath. Hair loose, wind-touched. She is looking out at the view with a quiet half-smile — the Italian art of dolce far niente.
Golden hour light — warm, honey-toned, painting everything in amber. The sky behind is graduating from gold to soft pink. Terrace has potted olive trees or terracotta planters with herbs. The moment is unhurried, luxurious, timeless. Shot feels like a Massimo Vitali meets fashion editorial — the beauty of Italian leisure.${PORTRAIT}`,
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME woman shown in these reference photos. Match every facial feature precisely: dark chestnut thick wavy hair, brown eyes with golden amber flecks, medium olive warm golden skin, light freckling across nose, Brazilian-Italian heritage.' });
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
  console.log('=== SOFIA Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

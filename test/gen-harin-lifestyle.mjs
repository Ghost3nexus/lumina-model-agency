/**
 * HARIN (ladies-asia-02) — Lifestyle Shots
 *
 * Seoul → Paris. Art dealer's daughter. Sorbonne curation student.
 * 45-min skincare routine. Tea ceremony in Saint-Germain apartment.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-harin-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-harin-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/ladies-asia-02';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `FEMALE fashion model named HARIN. Korean woman, black long straight sleek hair center-parted, dark brown double-lid almond eyes, 174cm, light-medium warm neutral skin, dewy luminous glass skin.`;

const LIFESTYLE_SHOTS = [
  {
    name: 'museum-01',
    prompt: `${IDENTITY}
SCENE: At a Musée d'Orsay-style museum. Standing before a large impressionist painting (Monet water lilies or similar — soft blues, greens, purples), studying it with professional attention. One hand slightly raised as if tracing the brushwork from a distance.
Wearing Celine-style tailored black blazer (sharp shoulders, perfect fit), white silk shirt with subtle sheen visible at the collar, cream wide-leg trousers, pointed black leather flats. Hair perfectly straight and sleek, center-parted, falling past her shoulders. Minimal jewelry — perhaps small gold studs.
Natural museum lighting — soft diffused overhead light, the painting casting gentle reflected color onto her face. Quiet gallery, marble floor, ornate gold frame around the painting. Her posture is impeccable — the daughter of an art dealer who grew up in these rooms. Shot feels like a Celine campaign — intellectual, precise, quietly luxurious.${PORTRAIT}`,
  },
  {
    name: 'skincare-01',
    prompt: `${IDENTITY}
SCENE: Morning skincare ritual in her Parisian apartment bathroom. She is reflected in a clean, well-lit mirror, applying essence with both hands pressed gently to her cheeks. The focus is on her dewy, luminous glass skin — the 45-minute routine made visible.
Wearing a simple white cotton robe, loosely tied. Hair pulled back with a simple clip or headband. Clean bright bathroom — marble counter, brass fixtures, natural daylight from a frosted window. On the counter: carefully arranged Sulwhasoo and Amorepacific products in their distinctive packaging, a jade gua sha stone, cotton pads.
The light is clean and flattering — soft morning light that shows her skin texture beautifully. Intimate, editorial beauty content — the kind of behind-the-scenes ritual that makes glass skin aspirational. Shot feels like a Vogue Korea beauty editorial — intimate yet polished.${PORTRAIT}`,
  },
  {
    name: 'paris-01',
    prompt: `${IDENTITY}
SCENE: Walking through Saint-Germain-des-Prés, Paris. Classic Haussmann architecture behind her — cream stone facades, black iron balconies, green shutters. She is mid-stride on a wide sidewalk, carrying a small Lemaire bag in taupe and an art catalog or book tucked under her arm.
Wearing a Lemaire-style earth-tone outfit — oatmeal linen oversized shirt (slightly open at the collar), wide caramel linen trousers with a beautiful drape, minimal tan leather sandals. Hair straight and sleek, swaying slightly with her walk. No sunglasses, natural minimal makeup.
Soft Parisian light — slightly overcast, the diffused grey-white sky that makes everything look like a film still. She is not performing for the camera — caught naturally, perhaps looking at a storefront or down the street. Effortless, unhurried, cultured. Shot feels like The Gentlewoman magazine — real style, no artifice.${PORTRAIT}`,
  },
  {
    name: 'tea-01',
    prompt: `${IDENTITY}
SCENE: Tea ceremony in her Parisian apartment. A low wooden table with a simple Korean or Japanese tea setting — a handmade ceramic teapot (celadon or rough stoneware), matching cups, a bamboo tea scoop, dried tea leaves in a small vessel. She is kneeling or seated on the floor, pouring tea with precise, deliberate gestures. Both hands on the teapot, the movement captured mid-pour.
Wearing a muted soft knit in warm oatmeal or soft grey (Low Classic style — oversized, luxurious cashmere or merino). Hair tucked behind one ear, falling forward slightly. Expression is serene, focused on the ritual.
Warm afternoon light filtering through sheer linen curtains — creating a soft, golden glow in the room. The apartment is minimalist — light wood floors, a single botanical print on the wall, neutral tones. The moment is meditative, intimate, a Seoul tradition transplanted to Paris. Shot feels like a Kinfolk Korea editorial — warmth, ritual, quiet beauty.${PORTRAIT}`,
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME woman shown in these reference photos. Match every facial feature precisely: Korean woman, black long straight sleek center-parted hair, dark brown double-lid almond eyes, light-medium warm neutral skin, dewy luminous glass skin.' });
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
  console.log('=== HARIN Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

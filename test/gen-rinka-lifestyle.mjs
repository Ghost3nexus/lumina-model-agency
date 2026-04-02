/**
 * RINKA (influencer-girl-01) — Lifestyle shots
 *
 * CEO direction: DJ culture, vintage Vivienne Westwood, Shimokitazawa life,
 * Instagram-native aesthetic, chaotic creative energy
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-rinka-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-rinka-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/influencer-girl-01';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `FEMALE model. Japanese woman, age 22, height 165cm. FACE: Cute-beautiful hybrid — round-ish face with youthful proportions, large expressive double-lid eyes, small nose, full lips with natural pink. Light makeup always — gloss lips, subtle blush, mascara. HAIR: Pink-ash colored, shoulder length, layered with effortless texture. Her signature color. SKIN: Fair, warm undertone. Healthy glow.`;

const LIFESTYLE_SHOTS = [
  {
    name: 'dj-01',
    prompt: `${IDENTITY}
SCENE: Behind a DJ booth at a small intimate Tokyo bar/club. Wearing an oversized vintage band tee (faded, authentic wear), mini skirt (black), platform boots. Headphones around her neck, one hand resting on the mixer/CDJ. Colorful club lighting — warm pink and orange gels washing over her. She is having fun, natural genuine smile, caught mid-moment of mixing.
Instagram-native aesthetic — the kind of photo her friend takes from the dance floor. NOT a professional photoshoot. Warm, slightly hazy club atmosphere. Neon signage or fairy lights in the background blur. Vinyl records or drink on the booth. Authentic Tokyo underground club vibes.
WOMENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'vintage-01',
    prompt: `${IDENTITY}
SCENE: Inside a small vintage clothing shop in Shimokitazawa, Tokyo. She works here. Surrounded by densely packed clothing racks full of character. She is holding up a vintage Vivienne Westwood piece (orb logo visible) toward the camera, showing it off excitedly. Wearing a denim jacket over a graphic tee, cargo pants, sneakers. Warm cluttered shop interior — wooden shelves, accessories, old magazines stacked.
Lifestyle content creator feel — natural daylight mixed with warm interior lighting. The frame feels like a story post or vlog screenshot. Genuine excitement on her face. Shimokitazawa vintage shop authenticity — small, packed, full of treasures.
WOMENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'shimokita-01',
    prompt: `${IDENTITY}
SCENE: Walking through Shimokitazawa's narrow streets during golden hour daytime. Independent shops, small cafes, and tiny theaters visible in the background. She is mid-stride, candid walking shot. Wearing a HUMAN MADE cardigan (pastel color with heart logo), vintage band tee underneath, plaid skirt, Dr. Martens boots. Carrying a canvas tote bag overflowing with vinyl records and vintage finds.
The street has the signature Shimokitazawa character — hand-painted signs, bicycles parked outside, potted plants, narrow alleyway charm. Warm afternoon light. She looks back at the camera mid-laugh, natural and unposed. Street photography aesthetic — NOT a fashion editorial, more like a candid taken by a friend walking behind her.
WOMENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'selfie-01',
    prompt: `${IDENTITY}
SCENE: Mirror selfie in her own messy apartment bedroom. The mirror has stickers and photo booth strips stuck to the edges. Behind her: vintage band posters on the wall (Blondie, Pizzicato Five), a vinyl record player on a shelf with records scattered around, clothes draped over a chair, fairy lights. She is wearing a colorful chaotic mix — striped crop top, patterned wide pants, mismatched socks, layered necklaces.
Phone visible in her hand taking the photo. She makes a playful expression — peace sign or tongue out, natural fun energy. The room is authentically messy-creative, not styled. Instagram selfie energy — the kind of photo that gets 10k likes because it is real and relatable. LOW angle from phone, mirror reflection composition. Warm bedroom lighting.
WOMENSWEAR only.${PORTRAIT}`,
  },
];

// Load identity reference images
function loadRefs() {
  const refs = [];
  for (const f of ['polaroid-front.png', 'beauty.png', 'form-editorial.png']) {
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME woman shown in these reference photos. Match every facial feature, hair color (pink-ash), and overall appearance precisely:' });
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
          console.log(`  ✅ ${shot.name} (${(stats.size / 1024).toFixed(0)} KB)`);
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
  console.log('=== RINKA Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

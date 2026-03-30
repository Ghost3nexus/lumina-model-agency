/**
 * RYO — SNS Lifestyle Content Shots
 *
 * 6 shots: skate, kissaten, vinyl shop, mirror selfie, izakaya night, LA trip
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-ryo-sns.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-ryo-sns.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/men-street-01';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `MALE model. Japanese-American mixed heritage man, 22 years old, BLACK medium wavy hair falling into eyes, dark brown hooded sleepy eyes, warm wheat sun-kissed skin, lean skater build, slight stubble. LEFT ARM: full sleeve tattoo (Japanese wave/koi in Horiyoshi III tradition merging into American Traditional eagle/roses). RIGHT WRIST: small kanji "風". Silver Chrome Hearts rings on fingers, silver hoop in left ear.`;

const SNS_SHOTS = [
  {
    name: 'skate-01',
    prompt: `${IDENTITY}
SCENE: Skateboarding at Komazawa Olympic Park, Tokyo. Riding or doing a kickflip on smooth concrete, surrounded by trees and park scenery. Wearing a simple white crew-neck t-shirt, black Dickies 874 work pants, Vans Old Skool black/white on feet. Tattoo sleeve visible on left arm.
Natural outdoor daylight, slightly warm afternoon sun. Shot by a friend — the aesthetic of a disposable film camera or Contax T2. Slight grain, natural color, candid energy. NOT a professional photoshoot. He's genuinely skating, caught mid-action or mid-ride. Motion blur on the board is fine.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'cafe-01',
    prompt: `${IDENTITY}
SCENE: Sitting at a tiny kissaten (old-school Japanese coffee shop, 純喫茶). Dark wood paneling, red velvet booth seating, warm amber lighting from vintage pendant lamps. A ceramic coffee cup and saucer in front of him on the table. He's reading a paperback book or gazing out the window with a contemplative expression.
Wearing an oversized vintage crewneck sweatshirt (heather grey, slightly faded), relaxed fit. Hair slightly messy, morning vibe. The atmosphere is quiet, intimate, nostalgic. Shot feels like a Film Fuji Pro 400H color palette — warm greens and soft amber tones.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'vinyl-01',
    prompt: `${IDENTITY}
SCENE: Inside a Japanese record shop (like Disk Union or Face Records). Flipping through vinyl bins, or holding up a record sleeve to examine the cover art. Rows of records filling the background. Warm interior fluorescent-mixed-with-daylight lighting.
Wearing a classic Levi's Type III trucker jacket (faded indigo, natural wear) over a black band t-shirt with white graphic print, dark jeans. Chrome Hearts rings visible on hands as he handles the records. The shot feels like a Popeye magazine or BRUTUS lifestyle feature — candid, warm, culturally rich.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'selfie-01',
    prompt: `${IDENTITY}
SCENE: Mirror selfie in his apartment. Full-length mirror, slightly dirty or with stickers on the edge. Room behind him is lived-in: vinyl records on a wooden shelf, a skateboard deck leaning against the wall, vintage band posters (punk/rock aesthetic) on the wall, clothes draped over a chair.
Wearing just a white ribbed tank top (wife beater style), showing full left arm tattoo sleeve clearly. Low-rise jeans or sweatpants. Phone held up covering part of his face (one eye and mouth visible). The image should feel like an authentic Instagram story selfie — slightly dim room lighting, phone flash reflection in mirror, casual and unpolished. NOT professional photography. Real, raw, personal.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'night-01',
    prompt: `${IDENTITY}
SCENE: Standing outside a Tokyo izakaya or tachinomi (standing bar) at night. Narrow alley, warm yellow and red neon signage glowing behind and above him (Japanese text on signs). Holding a glass of beer casually. He's laughing or caught mid-conversation with someone off-camera, genuine candid expression.
Wearing a black MA-1 bomber jacket (Alpha Industries style), grey hoodie underneath with hood slightly visible at neck, dark indigo slim jeans, black boots. The lighting is mixed — warm neon from signs, cool ambient from the street. Shot feels like Tokyo night street photography (Daido Moriyama meets modern Instagram). Slightly contrasty, grain acceptable.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'travel-01',
    prompt: `${IDENTITY}
SCENE: Venice Beach boardwalk, Los Angeles, California. Walking along the boardwalk or standing near the beach with palm trees and the ocean visible behind. Skateboard tucked under his right arm. Golden hour West Coast sunlight, warm and hazy.
Wearing a vintage Hawaiian shirt (open/unbuttoned, muted tropical print in earth tones) over a plain white crew-neck tee, khaki drawstring shorts above the knee, Vans slip-ons or Old Skool. Sunglasses pushed up on head. The vibe is relaxed California — a Japanese kid on an LA trip, totally in his element. Shot feels like an iPhone photo posted to Instagram with slight VSCO warm filter.
NO makeup. MENSWEAR only.${PORTRAIT}`,
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME man shown in these reference photos. Match every facial feature, hair, tattoos, skin tone, and accessories precisely:' });
    for (const r of refs) parts.push({ inlineData: { mimeType: 'image/png', data: r } });
  }
  parts.push({ text: shot.prompt });

  for (let attempt = 1; attempt <= 4; attempt++) {
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
      // Log text response if no image
      const textParts = (resp.candidates?.[0]?.content?.parts || []).filter(p => p.text);
      if (textParts.length > 0) console.log(`  ⚠️  ${shot.name} text response: ${textParts[0].text.slice(0, 200)}`);
      else console.log(`  ⚠️  ${shot.name} no image (attempt ${attempt})`);
    } catch (e) {
      console.error(`  ❌ ${shot.name} error (attempt ${attempt}): ${e.message}`);
      if (attempt < 4) {
        const wait = attempt * 15000;
        console.log(`     waiting ${wait/1000}s before retry...`);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }
}

async function main() {
  console.log('=== RYO SNS Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of SNS_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

/**
 * RYO — Lifestyle / Culture shots
 *
 * CEO direction: band activity, vintage fashion, motorcycle (vintage Harley),
 * car culture (narrow Porsche), American culture vibes
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-ryo-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-ryo-lifestyle.mjs --force
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

const IDENTITY = `MALE model. Japanese-American mixed heritage man, 22 years old, black medium wavy hair falling into eyes, dark brown hooded sleepy eyes, warm wheat sun-kissed skin, lean skater build, slight stubble. LEFT ARM: full sleeve tattoo (Japanese wave merging into American Traditional eagle and roses). RIGHT WRIST: small kanji tattoo. Silver rings on fingers (Chrome Hearts style, worn), silver hoop in left ear.`;

const LIFESTYLE_SHOTS = [
  {
    name: 'look-01',
    prompt: `${IDENTITY}
SCENE: Band rehearsal / album jacket photo concept. Standing in a dimly lit garage studio space, holding an electric guitar (vintage Fender Telecaster, sunburst). Wearing a worn-in black leather vest over bare chest showing tattoo sleeve, faded black jeans ripped at knee, black Converse Chuck Taylor (beaten up). Silver chain necklace.
Moody warm tungsten lighting from a single overhead bulb. Amplifiers and cables visible in background blur. Sweat on skin. Raw, authentic garage rock energy. NOT posed — caught mid-moment. This should look like a behind-the-scenes shot from a band's recording session.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'look-02',
    prompt: `${IDENTITY}
SCENE: Vintage clothing lifestyle. Standing inside a curated vintage shop or his own apartment closet. Wearing a perfectly broken-in 1960s Levi's Type III trucker jacket (faded indigo, natural wear patterns), plain white pocket tee, vintage military cargo pants in olive, Red Wing Irish Setter boots (well-worn leather patina).
Browsing through a rack of vintage clothes, or holding up a vintage Hawaiian shirt to inspect it. Natural daylight from a window. Warm, lived-in interior. Stacks of vinyl records visible nearby. The aesthetic of a Popeye magazine lifestyle feature.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'look-03',
    prompt: `${IDENTITY}
SCENE: Motorcycle culture. Sitting on or standing next to a vintage Harley-Davidson Shovelhead (1970s era, black with chrome, patina and character — NOT a brand new bike). Wearing a black NEIGHBORHOOD-style motorcycle jacket (broken-in, not shiny new), white thermal henley, raw selvedge denim jeans, black engineer boots. Cigarette smoke optional.
Setting: outdoor, early morning light, empty industrial road or warehouse district. The bike is the co-star. Shot feels like a Lightning magazine photo essay. Authentic American motorcycle culture filtered through Japanese sensibility.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'look-04',
    prompt: `${IDENTITY}
SCENE: Car culture — classic narrow-body Porsche 911 (1970s era, in dark green or silver metallic, air-cooled, original aesthetic with Fuchs wheels). RYO leaning against the car or crouching beside it. Wearing a vintage racing-inspired look: cream-colored Steve McQueen-style harrington jacket, plain navy tee, tan chinos, white leather low-top sneakers. Sunglasses pushed up on head.
Setting: golden hour light, open coastal road or quiet Tokyo backstreet. The Porsche has patina and character — a driver's car, not a collector's garage queen. The composition should feel like a 1970s car magazine photograph given a modern editorial treatment.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
];

// Load identity reference images
function loadRefs() {
  const refs = [];
  for (const f of ['polaroid-front.png', 'polaroid-face.png', 'beauty.png']) {
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME man shown in these reference photos. Match every facial feature, tattoos, and accessories precisely:' });
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
          console.log(`  ✅ ${shot.name}`);
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
  console.log('=== RYO Lifestyle / Culture Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

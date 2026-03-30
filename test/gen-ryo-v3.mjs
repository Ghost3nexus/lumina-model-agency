/**
 * RYO v3 — Fix fake-looking shots
 *
 * Re-generate:
 * - look-01: Guitarist (not vocalist), 90s garage band, tattoo consistency
 * - v3-form-editorial: BEDWIN style (more authentic)
 * - v3-muse-portrait: NEIGHBORHOOD style (fix hair color, face consistency)
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-ryo-v3.mjs
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });

const MODEL_DIR = 'public/agency-models/men-street-01';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `The EXACT SAME man from the reference photos. Japanese-American mixed heritage, 22, BLACK medium wavy hair (NOT blonde, NOT brown — BLACK hair), dark brown hooded sleepy eyes, warm wheat sun-kissed skin, lean build, slight stubble. LEFT ARM: full sleeve tattoo — Japanese traditional wave/koi (Horiyoshi III tradition, bold outlines, rich shading) merging into American Traditional eagle/roses on forearm (Sailor Jerry lineage, bold lines, saturated color). RIGHT WRIST: small kanji "風". Silver Chrome Hearts rings on fingers (worn, scratched). Silver hoop left ear.`;

const SHOTS = [
  // ── look-01: Guitarist in 90s garage band ──
  {
    name: 'look-01',
    prompt: `MALE named RYO. ${IDENTITY}
SCENE: 90s garage band — RYO is the GUITARIST, not the singer. Playing a vintage Fender Jazzmaster guitar on a small stage in a dark Tokyo live house. Eyes focused on the fretboard, body leaning into the music.
Wearing: thin, faded, threadbare vintage band tee with holes (the kind that's been washed 200 times), unbuttoned flannel shirt in muted red plaid hanging open, black slim jeans (not skinny — just slim), beaten black Converse high-tops. Tattoo sleeve fully visible on the guitar-playing arm.
Lighting: harsh overhead tungsten + one side fill creating deep shadows. Warm amber tones. Sweat on skin. Slightly hazy atmosphere (stage heat).
Shot feels like it was taken by a friend in the audience on film — slightly grainy, natural, NOT a professional concert photograph. The energy of early Nirvana at the Crocodile Cafe, Sonic Youth at CBGB.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },

  // ── v3-form-editorial: BEDWIN (more natural, not catalog) ──
  {
    name: 'v3-form-editorial',
    prompt: `MALE named RYO. ${IDENTITY}
SCENE: Casual street snap — shot as if a photographer spotted him walking in Daikanyama and asked for a quick photo. NOT a studio shot. NOT a lookbook. A real street snap.
Wearing BEDWIN & THE HEARTBREAKERS style: unstructured navy cotton sport coat with soft shoulders (slightly rumpled, sleeves pushed up showing tattoo sleeve), underneath a faded vintage rock tee (thin cotton, lived-in), classic khaki chinos with a relaxed straight fit, white canvas sneakers (Jack Purcell or similar, slightly dirty). No accessories except his usual silver rings.
Setting: Tokyo backstreet — quiet residential Daikanyama or Nakameguro side street, afternoon light filtering through trees. Shallow depth of field, the background is soft and organic.
His posture is relaxed — weight on one leg, maybe one hand in pocket. Expression: natural, not performing for the camera. Like he stopped walking for 3 seconds and this is what you got.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },

  // ── v3-muse-portrait: NEIGHBORHOOD (fix hair, fix face) ──
  {
    name: 'v3-muse-portrait',
    prompt: `MALE named RYO. ${IDENTITY}
IMPORTANT: His hair is BLACK. Not blonde, not light brown. BLACK wavy hair.
SCENE: Motorcycle culture editorial. RYO sitting on a vintage motorcycle (1970s style, dark metal, chrome details, patina — a machine with history). NOT riding — stationary, engine off. One foot on the ground, one on the peg. Looking off to the side, profile or three-quarter angle.
Wearing NEIGHBORHOOD style: well-worn black double rider leather jacket (the leather has creases and patina from years of use, NOT shiny new), plain white heavyweight crew tee, raw indigo selvedge denim jeans (straight fit, slight stacking at boots), black engineer boots (worn leather). Silver wallet chain.
Setting: early morning, empty industrial area or quiet docks. Cool blue-grey natural light with slight warmth breaking through. The motorcycle and RYO are both subjects — the image tells a story of a man and his machine.
This should feel like a page from Lightning magazine or a NEIGHBORHOOD campaign — authentic, never forced.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
];

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
  console.log(`  🎬 ${shot.name}...`);

  const parts = [];
  if (refs.length > 0) {
    parts.push({ text: 'IDENTITY LOCK — This is RYO. Generate the EXACT SAME person. BLACK hair, same face, same tattoos. Match every detail from these references:' });
    for (const r of refs) parts.push({ inlineData: { mimeType: 'image/png', data: r } });
  }
  parts.push({ text: shot.prompt });

  for (let attempt = 1; attempt <= 3; attempt++) {
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
      console.log(`  ⚠️  no image (attempt ${attempt})`);
    } catch (e) {
      console.error(`  ❌ error (attempt ${attempt}): ${e.message}`);
      if (attempt < 3) await new Promise(r => setTimeout(r, 10000));
    }
  }
}

async function main() {
  console.log('=== RYO v3 — Authenticity Fixes ===\n');
  const refs = loadRefs();
  console.log(`Identity refs: ${refs.length}\n`);

  for (const shot of SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

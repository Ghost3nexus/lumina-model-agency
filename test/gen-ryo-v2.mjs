/**
 * RYO v2 — CEO direction fixes
 *
 * Fixes:
 * 1. Polaroid name: RYO (not KENJI)
 * 2. Tattoo: by famous tattoo artists (Horiyoshi III lineage Japanese side,
 *    American Traditional by a known artist)
 * 3. look-01: 90s garage band style
 * 4. look-02: Levi's XX + high brand + Nirvana-style + cigarette
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-ryo-v2.mjs
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });

const MODEL_DIR = 'public/agency-models/men-street-01';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

// Updated tattoo description — famous artist lineage
const TATTOO_DESC = `LEFT ARM: full sleeve tattoo — Japanese side by a master in the Horiyoshi III tradition (bold black outlines, rich color, traditional Japanese wave/koi motifs with impeccable shading, the kind of work that takes years to complete). Merging seamlessly into American Traditional work on the forearm (bold eagle, roses, dagger — clean lines, saturated color, the style of Sailor Jerry lineage). The sleeve tells a story of his dual heritage — Japanese precision meets American boldness. The tattoos are aged and settled into the skin, not fresh. RIGHT WRIST: small kanji "風" (wind) in brushstroke style.`;

const IDENTITY = `MALE model named RYO. Japanese-American mixed heritage man, 22 years old, black medium wavy hair falling into eyes, dark brown hooded sleepy eyes, warm wheat sun-kissed skin, lean skater build, slight stubble. ${TATTOO_DESC} Silver rings on fingers (Chrome Hearts style, scratched and worn from years of skating), silver hoop in left ear.`;

const SHOTS = [
  // ── Polaroid fix (name = RYO) ──
  {
    name: 'polaroid-front',
    prompt: `${IDENTITY}
Agency polaroid photo. Full body shot. Wearing a white ribbed tank top and simple black jeans, bare feet or simple shoes. Arms at sides, relaxed natural stance. Flat even lighting, plain white background.
At the bottom of the polaroid frame, handwritten text reads: "RYO, 22, 181cm."
The text must say RYO — not any other name. This is critical.
NO makeup.${PORTRAIT}`,
  },

  // ── look-01: 90s Garage Band ──
  {
    name: 'look-01',
    prompt: `${IDENTITY}
SCENE: 1990s garage band aesthetic. RYO as the frontman of a raw, lo-fi garage rock band. Standing at a microphone in a small, sweaty live house venue. Wearing a shredded vintage band tee (thin, faded, holes — the kind you find at a flea market), unbuttoned flannel shirt in red/black plaid tied around waist, ripped black skinny jeans, beaten-up black Converse Chuck Taylor high-tops. Silver chain wallet chain hanging from belt loop.
Harsh overhead stage lighting with warm amber tones and deep shadows. Sweat glistening on skin. The energy of Nirvana's early Sub Pop era, Mudhoney, The Melvins. A dimly lit venue with exposed brick walls. Guitar amplifier (vintage Fender Twin Reverb) visible behind him.
This should look like a gritty concert photograph from 1993. Shot on film, slightly grainy. Raw energy, not posed.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },

  // ── look-02: Levi's XX + High brand + Nirvana + cigarette ──
  {
    name: 'look-02',
    prompt: `${IDENTITY}
SCENE: Street style portrait with Nirvana-era grunge influence. RYO standing against a weathered concrete wall or old Tokyo building exterior. Smoking a cigarette held loosely between fingers.
Wearing: vintage Levi's 501 XX (1950s reproduction, raw selvedge denim, slightly faded with natural whiskers and honeycombs from actual wear — the jeans tell a story). On top: an oversized mohair cardigan in muted olive green (the Kurt Cobain signature silhouette), layered over a thin vintage band tee. On feet: worn-in Dr. Martens 1460 boots (cherry red, scuffed). A single silver pendant necklace.
The styling mixes genuine vintage Americana (the Levi's XX) with high-fashion sensibility (the mohair cardigan quality, the way everything drapes). He looks like he raided both a Tokyo vintage shop and a designer archive.
Natural overcast daylight, slightly desaturated colors. The mood of a 1990s fashion editorial that feels more documentary than fashion. Cigarette smoke adding atmosphere.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
];

function loadRefs() {
  const refs = [];
  // Use beauty and editorial as refs (not the old polaroid we're replacing)
  for (const f of ['beauty.png', 'editorial.png', 'polaroid-face.png']) {
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME man named RYO shown in these reference photos. Match every facial feature, tattoo details, and accessories precisely. His name is RYO:' });
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
  console.log('=== RYO v2 — CEO Direction Fixes ===\n');
  const refs = loadRefs();
  console.log(`Identity refs: ${refs.length}\n`);

  for (const shot of SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

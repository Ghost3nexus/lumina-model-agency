/**
 * IDRIS (men-intl-01) — Lifestyle shots
 *
 * CEO direction: Chess player, Savile Row tailoring, London street style,
 * vintage watch collector. British-Ghanaian heritage. Intellectual sophistication.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-idris-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-idris-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/men-intl-01';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `MALE model. British-Ghanaian heritage man, 27 years old, height 189cm. FACE: Carved angular face — strong jaw, high cheekbones, deep-set dark brown eyes with intensity, broad nose, full well-defined lips. Clean-shaven. HAIR: Black, very short fade, immaculate lineup. SKIN: Rich deep brown, even, healthy.`;

const LIFESTYLE_SHOTS = [
  {
    name: 'chess-01',
    prompt: `${IDENTITY}
SCENE: Playing chess in a sophisticated private London members' club or his own refined apartment study. Dark wood table with a beautiful wooden chess set, deep leather wingback chair. Wearing a Tom Ford-style navy cashmere V-neck sweater over a crisp white Oxford shirt, collar visible. One hand resting on chin in deep concentration, the other hovering over a chess piece. Warm interior lighting — amber desk lamp and soft background glow. Bookshelves or dark wood paneling behind. The intellectual side of this man. Quiet intensity. Shot feels like a portrait in The Economist or Financial Times Weekend Magazine.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'tailor-01',
    prompt: `${IDENTITY}
SCENE: Savile Row bespoke tailoring fitting. Standing on a low wooden fitting platform in a classic British tailoring atelier. A tailor (older gentleman, partially visible) adjusting the shoulder of a half-finished bespoke suit jacket — fabric pinned with tailor's chalk marks visible. Full-length mirror behind him reflecting the fitting. The suit is mid-grey wool, unfinished with basting stitches. Underneath wearing a crisp white dress shirt, no tie. Measuring tape draped over tailor's neck. Classic atelier atmosphere — rolls of fabric on shelves, natural daylight from large windows. The ritual of Savile Row craftsmanship. Shot feels like a GQ Style feature on bespoke tailoring.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'london-01',
    prompt: `${IDENTITY}
SCENE: Walking through Mayfair or along the South Bank at dusk. Wearing a Prada-style structured black wool overcoat (knee-length, impeccable cut), white fine-gauge turtleneck sweater underneath, slim-fit dark navy trousers, polished black leather Chelsea boots. London architecture in the background — Georgian townhouses or Thames embankment with city lights beginning to glow. Confident, purposeful stride. One hand in coat pocket. The golden-blue light of London dusk. Street photography feel — candid, not posed. Shot feels like a Jonathan Daniel Pryce street style photograph.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
  {
    name: 'watch-01',
    prompt: `${IDENTITY}
SCENE: Close-up lifestyle shot of a vintage watch collector at his desk. Sitting at a dark mahogany desk, examining a vintage timepiece (classic chronograph style, steel case, patina on dial) through a jeweler's loupe held to his eye. His collection of 5-6 vintage watches displayed on an unrolled leather watch roll on the desk nearby — varying sizes and styles, all with character and patina. His hands prominent in frame — strong, well-groomed. Face partially visible, showing concentration and reverence for the craft. Warm brass desk lamp creating pools of light. Background is softly out of focus — his study or home office. The intimate world of a serious collector. Shot feels like a Hodinkee editorial feature.
NO makeup. MENSWEAR only.${PORTRAIT}`,
  },
];

// Load identity reference images
function loadRefs() {
  const refs = [];
  for (const f of ['polaroid-front.png', 'beauty.png', 'v3-campaign.png']) {
    const p = path.join(MODEL_DIR, f);
    if (fs.existsSync(p)) refs.push(fs.readFileSync(p).toString('base64'));
  }
  return refs;
}

async function generateShot(shot, refs) {
  const outPath = path.join(MODEL_DIR, `${shot.name}.png`);
  if (!force && fs.existsSync(outPath)) {
    console.log(`  skip ${shot.name} exists`);
    return;
  }

  console.log(`  generating ${shot.name}...`);
  const parts = [];
  if (refs.length > 0) {
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME man shown in these reference photos. Match every facial feature precisely. Same face, same skin tone, same bone structure, same hair:' });
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
          const kb = Math.round(fs.statSync(outPath).size / 1024);
          console.log(`  done ${shot.name} (${kb} KB)`);
          return;
        }
      }
      console.log(`  warn ${shot.name} no image (attempt ${attempt})`);
    } catch (e) {
      console.error(`  error ${shot.name} (attempt ${attempt}): ${e.message}`);
      if (attempt < 2) await new Promise(r => setTimeout(r, 10000));
    }
  }
}

async function main() {
  console.log('=== IDRIS Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

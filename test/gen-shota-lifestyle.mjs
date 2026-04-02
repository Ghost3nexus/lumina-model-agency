/**
 * SHOTA (men-asia-01) — Lifestyle Shots
 *
 * Kyoto born, Tokyo based. Father is ceramic artist. Tama Art grad (product design).
 * Runs along Sumida River. Tea ceremony. 30-item apartment.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-shota-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-shota-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/men-asia-01';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `MALE model named SHOTA. Japanese man, black medium-length hair with natural texture side-parted, dark brown monolid eyes with calm intensity, 183cm, lean clean-line build, light-medium neutral skin, clean-shaven, matte clear skin.`;

const LIFESTYLE_SHOTS = [
  {
    name: 'run-01',
    prompt: `${IDENTITY}
SCENE: Running along the Sumida River at dawn. Tokyo skyline visible in the background — Tokyo Skytree silhouette against the early morning sky. He is mid-stride, running with clean efficient form. Wearing a simple black running top (technical fabric, fitted), black running shorts. Running shoes visible.
Early morning blue-pink light — the sky transitions from deep blue to soft pink and gold at the horizon. The river reflects these colors. The path is empty — he is alone. Mist or haze gives the scene depth and atmosphere.
Solitary, meditative — this is the daily ritual, the discipline. Not a performance, just the quiet commitment of a morning run. The mood is contemplative, focused, peaceful. Color palette: pre-dawn blues, soft pinks, black, silver river reflections.${PORTRAIT}`,
  },
  {
    name: 'ceramics-01',
    prompt: `${IDENTITY}
SCENE: Visiting his father's pottery workshop in Kyoto. He is examining a tea bowl (chawan) — holding it carefully in both hands, turning it slowly, studying the glaze and form with quiet reverence. Or watching his father work at the potter's wheel, standing slightly behind with respectful attention.
Wearing a COMOLI-style relaxed linen shirt in natural/ecru, wide relaxed trousers in dark indigo. Barefoot or in simple house slippers on the workshop floor.
Warm workshop lighting — natural light from high windows mixed with the warm glow of a kiln or work lamp. Shelves of pottery, clay dust, tools, finished and unfinished pieces visible. The workshop is decades-old, well-used, beautiful in its functionality.
Respect, concentration, the passing of craft between generations. The mood is reverent, quiet, connected. Color palette: warm earth tones, clay reds, natural linen, indigo.${PORTRAIT}`,
  },
  {
    name: 'minimal-01',
    prompt: `${IDENTITY}
SCENE: In his ultra-minimal Tokyo apartment. Sitting on the floor on a zabuton (Japanese floor cushion) in natural navy or grey. The apartment is extreme minimalism: natural wood flooring, one small plant (single stem in a ceramic vase), one low shelf with exactly a few books, nothing else. White walls. A futon rolled in the corner perhaps.
Wearing HOMME PLISSE Issey Miyake pleated set in grey — the distinctive micro-pleated texture clearly visible. Sitting cross-legged or in seiza, perhaps reading or simply being still.
Morning light through a sheer white curtain — soft, diffused, peaceful. The light creates gentle shadows across the pleated fabric and the minimal space. The 30-item life — everything in this frame is intentional.
The mood is radical simplicity, calm, presence. Japanese ma (negative space) as a lifestyle. Color palette: whites, warm greys, natural wood, one green accent from the plant.${PORTRAIT}`,
  },
  {
    name: 'tea-01',
    prompt: `${IDENTITY}
SCENE: Performing tea ceremony (chado/sado). Traditional tatami room — clean tatami mats, tokonoma (alcove) with a single scroll or flower arrangement visible. He is kneeling in seiza, whisking matcha with a chasen (bamboo whisk) in a chawan (tea bowl) with precise, practiced movements. Or presenting the completed tea.
Wearing dark samue (traditional Japanese work clothing) — dark indigo or black, simple, functional. Clean lines. The clothing complements the setting perfectly.
Natural soft light — entering from a shoji screen (paper sliding door), creating the characteristic diffused Japanese light. Warm but restrained. The light catches the green of the matcha and the steam rising from the bowl.
Zen stillness — total presence, no wasted movement. The ritual is meditation in action. His expression is serene, focused, at peace. Color palette: tatami gold, dark indigo, matcha green, warm paper-white light, dark wood.${PORTRAIT}`,
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME man shown in these reference photos. Match every facial feature precisely: black medium-length hair with natural texture side-parted, dark brown monolid eyes with calm intensity, lean clean-line build, light-medium neutral skin, clean-shaven.' });
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
  console.log('=== SHOTA Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

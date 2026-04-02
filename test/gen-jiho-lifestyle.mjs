/**
 * JIHO (men-asia-02) — Lifestyle Shots
 *
 * Busan born, Seoul then Tokyo. Ex K-pop trainee (quit for creative control).
 * Electronic music producer. Paints watercolors. Cat named Yves. Gender-fluid fashion.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-jiho-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-jiho-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/men-asia-02';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `MALE model named JIHO. Korean man, black medium-long soft hair sometimes falling over one eye, dark brown large double-lid eyes with gentle curve, 182cm, slim elongated androgynous build, fair cool-neutral glass skin, clean-shaven, delicate features but clearly male.`;

const LIFESTYLE_SHOTS = [
  {
    name: 'music-01',
    prompt: `${IDENTITY}
SCENE: At his home music production setup. Seated at a desk with synthesizers, a MIDI controller, laptop with production software on screen, studio monitors. He is focused — hands on the MIDI controller or adjusting a synth parameter. Wearing an oversized Raf Simons-style sweater (dark navy or black with slightly elongated sleeves). Headphones around his neck (high-end, over-ear).
Soft blue LED ambient light from the monitors and screens, creating a cool atmospheric glow in the otherwise dim room. The setup is creative but not cluttered — intentional arrangement. Perhaps vinyl records or album art on the wall.
Creative flow — he is lost in the music, in his zone. The mood is intimate, nocturnal, focused. This is the private creative world. Color palette: deep blues, black, screen glow, occasional warm LED accent.${PORTRAIT}`,
  },
  {
    name: 'cat-01',
    prompt: `${IDENTITY}
SCENE: In his apartment with his cat Yves — a white or cream-colored cat. The cat is on his lap or curled up beside him on a sofa. He is sitting with legs crossed on a comfortable sofa or daybed, one hand gently resting on the cat. Wearing a simple oversized knit sweater in soft cream or light grey — the knit texture visible, cozy.
Warm cozy interior — soft warm lighting from a floor lamp, books and vinyl scattered nearby, perhaps a throw blanket. The apartment is stylish but lived-in: a mix of Korean and Japanese design sensibility, minimal but warm.
Soft, vulnerable, the private JIHO. His expression is gentle, relaxed, unguarded — the face he shows only at home. The cat completes the scene of domestic intimacy. Color palette: warm creams, soft greys, warm lamp light, white fur.${PORTRAIT}`,
  },
  {
    name: 'paint-01',
    prompt: `${IDENTITY}
SCENE: Painting watercolors at a small table by a window. Abstract washes of color on watercolor paper — blues, pinks, soft greens bleeding into each other. He is mid-stroke with a brush, or pausing to study the painting with tilted head. Paint-stained fingers — watercolor pigment visible on his hands. A palette with mixed colors, a jar of water, brushes scattered.
Wearing a loose white linen shirt — slightly oversized, sleeves pushed up past the wrists. The white fabric catches the light beautifully.
Natural daylight from the window — soft, even, clear. The light illuminates the watercolors and makes them glow. Simple white walls, perhaps one finished painting pinned to the wall.
Quiet creativity — the meditative quality of watercolor. His expression is contemplative, absorbed. The art side of JIHO that few see. Color palette: white, watercolor blues and pinks, natural light, bare wood table.${PORTRAIT}`,
  },
  {
    name: 'tokyo-01',
    prompt: `${IDENTITY}
SCENE: Walking through Shimokitazawa or Daikanyama at dusk. He is mid-stride on a narrow street lined with small boutiques and cafes. Shot from behind or from the side at three-quarter angle — we see his profile and the street ahead. Wearing a Loewe-style butter-soft leather jacket (black or dark brown, luxurious drape), wide-leg trousers, platform shoes that add to his already tall frame.
Atmospheric city lights beginning to glow — neon signs, warm shop windows, street lamps creating pools of warm light. The sky is deep blue twilight. The street is characterfully Tokyo — electric poles, small buildings, vintage signage.
The mood is cinematic solitude in the city — beautiful, slightly melancholic, effortlessly cool. He belongs to this street. The fashion is statement-making but not loud. Color palette: dusk blues, warm neon, black leather, warm shop light.${PORTRAIT}`,
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME man shown in these reference photos. Match every facial feature precisely: black medium-long soft hair sometimes falling over one eye, dark brown large double-lid eyes with gentle curve, slim elongated androgynous build, fair cool-neutral glass skin, clean-shaven, delicate features.' });
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
  console.log('=== JIHO Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

/**
 * AMARA (ladies-intl-02) — Lifestyle Shots
 *
 * Performance artist in London Deptford. Goldsmiths alumna.
 * Wears father's Somali ivory-colored bangle on right wrist.
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-amara-lifestyle.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-amara-lifestyle.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const MODEL_DIR = 'public/agency-models/ladies-intl-02';
const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

const IDENTITY = `FEMALE fashion model named AMARA. Black woman, Somali heritage, buzz cut (2mm all over), dark brown eyes, 181cm, striking angular bone structure, deep rich dark brown skin. Powerful regal presence. ACCESSORY: Father's Somali ivory-colored bangle on right wrist (always present).`;

const LIFESTYLE_SHOTS = [
  {
    name: 'performance-01',
    prompt: `${IDENTITY}
SCENE: In a raw performance space/studio, mid-movement of a dance/performance piece. Wearing all-black flowing garment (Rick Owens aesthetic — draped, asymmetric, fabric catching air). Dramatic side lighting from a single source, sweat glistening on her skin and buzz-cut scalp. The power of a body in motion — arms extended, torso twisting. Artistic, not fashion.
Concrete floor, exposed brick or industrial walls visible in the background. Deep shadows, high contrast. The ivory bangle catches the light on her right wrist. The mood is raw, visceral, contemporary dance meets performance art. Shot feels like documentation from a Serpentine Gallery performance — captured mid-breath, not posed.${PORTRAIT}`,
  },
  {
    name: 'gallery-01',
    prompt: `${IDENTITY}
SCENE: At a Tate Modern-style gallery opening. Standing in front of a large-scale contemporary artwork (abstract, bold colors or monochrome). Wearing Balenciaga-style oversized structured coat in black, simple black turtleneck underneath. Wine glass held casually in left hand. She commands the space — other visitors are blurred or absent.
Cool fluorescent gallery lighting — the kind that flattens everything but somehow makes her bone structure even more striking. White gallery walls, polished concrete floor. Her expression is contemplative, studying the work with professional attention. The ivory bangle visible on her right wrist against the black sleeve. Shot feels like a Frieze Art Fair portrait — culture, fashion, and intellect in one frame.${PORTRAIT}`,
  },
  {
    name: 'studio-01',
    prompt: `${IDENTITY}
SCENE: In her artist studio in Deptford, South London. Paint-stained work table, large canvases leaning against raw brick walls, mixed-media materials scattered around. She is working on a sculpture or assemblage piece — hands engaged with materials, focused.
Wearing a simple black tank top showing her arms, shoulders, and the definition of her physique. Loose natural linen trousers. Bare feet on paint-splattered concrete floor. The ivory bangle on her right wrist as she works.
Natural north-facing window light — soft, even, the light artists crave. Warm afternoon quality. The studio is lived-in, creative, authentic. NOT clean or curated. This is where the work happens. Shot captures the beauty of creative concentration — her angular face in profile or three-quarter view, completely absorbed.${PORTRAIT}`,
  },
  {
    name: 'london-01',
    prompt: `${IDENTITY}
SCENE: Walking through South Bank London at dusk. Brutalist concrete of the National Theatre behind her — raw concrete, geometric lines, dramatic angles. She is mid-stride, confident, owning the space.
Wearing Marine Serre crescent-moon print bodysuit visible at the neckline under a deconstructed trench coat in dark khaki — asymmetric hem, raw edges, avant-garde silhouette. Dark boots. The ivory bangle on her right wrist.
Dusk light — deep blue sky transitioning to warm artificial light from the theatre's interior glow. The Thames reflected light in the background. Her dark skin against the grey concrete creates a powerful contrast. Urban editorial feel — London as a stage. Shot feels like an i-D magazine street style moment — movement, architecture, attitude.${PORTRAIT}`,
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
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME woman shown in these reference photos. Match every facial feature precisely: striking angular bone structure, buzz cut (2mm), dark brown eyes, deep rich dark brown skin, Somali heritage, powerful regal presence.' });
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
  console.log('=== AMARA Lifestyle Shots ===\n');
  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const shot of LIFESTYLE_SHOTS) {
    await generateShot(shot, refs);
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n=== Done ===');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

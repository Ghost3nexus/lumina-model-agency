/**
 * RINKA GRWM #01 — 「朝5時に寝たDJの支度」
 *
 * 10カットの静止画を生成（9:16 / Instagram Reels用）
 * 各カット2枚生成 → ベストをCEOが選定
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-rinka-grwm.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/gen-rinka-grwm.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const force = process.argv.includes('--force');

const REF_DIR = 'public/agency-models/influencer-girl-01';
const OUT_DIR = 'docs/sns-shorts/rinka-grwm-01/stills';

// Shared blocks
const CHAR = `Young Japanese woman, 23 years old. Round face, large expressive eyes. Pink-ash shoulder-length hair. Small star tattoo on right collarbone. Fair skin, petite build, 165cm. Natural beauty, minimal base makeup.`;

const TECH = `9:16 vertical composition. Photorealistic, not AI-looking. iPhone camera aesthetic, slight film grain, warm tone.`;

const ROOM = `Old Japanese wooden apartment room in Shimokitazawa. Morning sunlight from window on left, warm golden tone. Band flyers and polaroid photos on wall. Magazines stacked on floor. Records leaning against wall. Full-length mirror with wooden frame. Clothes rack packed with garments.`;

const OUTFIT_FULL = `Navy x grey sacai hybrid MA-1 bomber jacket over white HUMAN MADE graphic t-shirt with heart logo. Beige Dickies 874 work pants worn low on hips with cuffs rolled up. Black Dr. Martens 1460 boots with pink replacement laces. Gold Vivienne Westwood orb pendant necklace. Colorful handmade beaded bracelet on left wrist.`;

const CUTS = [
  {
    name: '01-hook',
    prompt: `${CHAR} Hair messy and tangled from sleep. No makeup, bare face.

Close-up selfie shot from slightly above. She just woke up, lying in a messy single bed with wrinkled white sheets. Sleepy, half-closed eyes, slightly annoyed expression. One hand loosely holding phone. ${ROOM}

Wearing an oversized vintage t-shirt as pajama. Hair falling across face.

${TECH} Shallow depth of field on face.`,
  },
  {
    name: '02-hair-set',
    prompt: `${CHAR} Light natural makeup applied. Hair being styled with fingers.

Sitting at a low wooden table covered with cosmetics and skincare bottles. Looking into a small mirror propped on the table. Both hands in hair, tousling and arranging pink-ash strands. Slightly more awake expression, still relaxed. Seen through a full-length mirror with wooden frame leaning against wall.

${ROOM} Wearing the same oversized vintage t-shirt.

${TECH} Mid-shot framing from waist up.`,
  },
  {
    name: '03-dr-martens',
    prompt: `Young Japanese woman's hands picking up black Dr. Martens 1460 boots from the floor. The boots have pink replacement laces threaded through all eyelets. One hand grips the pull tab, the other holds the sole.

Close-up shot of hands and boots only. Floor is old wooden planks. A pair of other shoes visible nearby. Morning sunlight from left casting warm directional light with soft shadows.

${TECH} Sharp focus on the pink laces and leather texture.`,
  },
  {
    name: '04-dickies',
    prompt: `${CHAR} Hair loosely styled.

Standing in front of a full-length mirror with wooden frame in old Japanese apartment. Pulling up beige Dickies 874 work pants, wearing them low on hips. Cuffs rolled up twice showing ankles. White HUMAN MADE graphic t-shirt tucked loosely into the pants.

Shot framed from waist down in mirror reflection. Morning sun from left window. Warm directional light. ${ROOM}

${TECH}`,
  },
  {
    name: '05-human-made',
    prompt: `Young Japanese woman's hands holding up a white graphic t-shirt against her chest. The t-shirt has a large heart logo print on the front (HUMAN MADE style). She is displaying it to the camera with both hands spread wide, showing the full graphic.

Close-up of hands and t-shirt. Background is a hanging clothes rack packed with various garments in an old Japanese apartment. Morning sunlight from left creates warm directional shadows on the fabric.

${TECH} Sharp focus on the t-shirt graphic and cotton fabric texture.`,
  },
  {
    name: '06-sacai',
    prompt: `${CHAR} Hair loosely styled. Star tattoo on right collarbone.

Standing in front of full-length mirror with wooden frame. Putting on a navy and grey sacai hybrid MA-1 bomber jacket over a white graphic t-shirt. The jacket has visible mixed-material paneling where bomber nylon meets wool knit. Beige Dickies 874 pants worn low, cuffs rolled.

Mirror reflection shot, upper body framing. She is adjusting the jacket collar with one hand, looking at herself. Slight satisfied expression.

${ROOM}

${TECH}`,
  },
  {
    name: '07-accessory',
    prompt: `${CHAR} Close-up of neck and collarbone area. Star tattoo visible on right collarbone. Fingers clasping a gold Vivienne Westwood orb pendant necklace behind her neck.

Also showing: left wrist wearing a colorful handmade beaded bracelet with mixed pastel and bright colored beads. The sacai jacket sleeve pushed up slightly to show the bracelet.

Tight close-up framing. Soft warm morning light from left. Background softly blurred apartment interior.

${TECH} Shallow depth of field, focus on jewelry details.`,
  },
  {
    name: '08-full-look',
    prompt: `${CHAR} Hair styled loosely. Star tattoo on right collarbone.

Full body shot reflected in a full-length mirror with wooden frame. She is mid-turn, body angled 3/4 to the mirror, looking back over her shoulder at her reflection with a cool, slightly pleased expression.

Complete outfit: ${OUTFIT_FULL}

${ROOM} Full room visible.

${TECH}`,
  },
  {
    name: '09-street-walk',
    prompt: `${CHAR} Walking naturally down a narrow Shimokitazawa shopping street. Shot from behind at waist height, following her.

She walks with relaxed confident stride, hands in jacket pockets. ${OUTFIT_FULL}

Shimokitazawa backstreet: small vintage shops, hand-painted signs, potted plants on sidewalk, old buildings, narrow alley. Late morning natural daylight, slightly overcast, soft shadows. A few people in background, out of focus.

9:16 vertical composition. Photorealistic, not AI-looking. Natural street photography aesthetic, slight film grain, warm tone.`,
  },
  {
    name: '10-look-back',
    prompt: `${CHAR} Hair catching the light.

She has turned around on a Shimokitazawa backstreet, facing the camera. Relaxed smile, eyes slightly narrowed, one hand doing a casual peace sign near her face. Hair slightly blown by breeze.

Full outfit visible: ${OUTFIT_FULL}

Shimokitazawa street background: vintage shop fronts, greenery, warm daylight. Depth of field with blurred background.

9:16 vertical composition. Photorealistic, not AI-looking. Street snapshot aesthetic, slight film grain, warm tone. Candid natural moment, not posed-looking.`,
  },
];

// Load identity reference images
function loadRefs() {
  const refs = [];
  for (const f of ['beauty.png', 'polaroid-front.png']) {
    const p = path.join(REF_DIR, f);
    if (fs.existsSync(p)) refs.push(fs.readFileSync(p).toString('base64'));
  }
  return refs;
}

async function generateCut(cut, refs, variant) {
  const filename = `${cut.name}-v${variant}.png`;
  const outPath = path.join(OUT_DIR, filename);
  if (!force && fs.existsSync(outPath)) {
    console.log(`  ⏭️  ${filename} exists, skip`);
    return;
  }

  console.log(`  🎬 ${filename}...`);
  const parts = [];
  if (refs.length > 0) {
    parts.push({ text: 'IDENTITY LOCK — Generate the EXACT SAME woman shown in these reference photos. Match every facial feature, hair color (pink-ash), and overall appearance precisely:' });
    for (const r of refs) parts.push({ inlineData: { mimeType: 'image/png', data: r } });
  }
  parts.push({ text: cut.prompt });

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: [{ role: 'user', parts }],
        config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.4 },
      });
      for (const p of resp.candidates?.[0]?.content?.parts || []) {
        if (p.inlineData) {
          fs.writeFileSync(outPath, Buffer.from(p.inlineData.data, 'base64'));
          const stats = fs.statSync(outPath);
          console.log(`  ✅ ${filename} (${(stats.size / 1024).toFixed(0)} KB)`);
          return;
        }
      }
      console.log(`  ⚠️  ${filename} no image (attempt ${attempt})`);
    } catch (e) {
      console.error(`  ❌ ${filename} error (attempt ${attempt}): ${e.message}`);
      if (attempt < 2) await new Promise(r => setTimeout(r, 10000));
    }
  }
}

async function main() {
  console.log('=== RINKA GRWM #01 — 朝5時に寝たDJの支度 ===\n');

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const refs = loadRefs();
  console.log(`Identity refs loaded: ${refs.length}\n`);

  for (const cut of CUTS) {
    // Generate 2 variants per cut
    for (let v = 1; v <= 2; v++) {
      await generateCut(cut, refs, v);
      await new Promise(r => setTimeout(r, 3000));
    }
    console.log('');
  }

  console.log('\n=== Done — 20 images generated (10 cuts × 2 variants) ===');
  console.log(`Output: ${OUT_DIR}/`);
  console.log('\nNext: CEO selects best variant per cut → rename to 01-hook.png etc.');
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

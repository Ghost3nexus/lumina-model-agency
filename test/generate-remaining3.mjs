import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }
const ai = new GoogleGenAI({ apiKey: API_KEY });

const MODELS = {
  'ladies-asia-3': {
    dir: 'test/agency-models/ladies-asia-3',
    desc: `A professional high-fashion Japanese female model, age 20, height 171cm, B78/W57/H85.
FACE: Delicate heart-shaped face. Large round eyes with natural double eyelids — doe-eyed innocence but with editorial edge. Small refined nose, softly full lips. Subtle dimples when expression changes. Fresh-faced youth combined with the bone structure that cameras love.
BODY: Petite but perfectly proportioned for her height. Slim, youthful.
HAIR: Black, long, straight with subtle layers. Parted slightly off-center. Natural, glossy, healthy.
SKIN: Clear, bright, dewy. Fair with neutral undertone. Youthful glow.
EXPRESSION: Fresh, present, subtly curious. The new face that every agency wants to sign.
REFERENCE: Think of a new face at a Tokyo agency — raw potential, clean beauty, the girl who gets scouted on the street in Daikanyama.`,
  },
  'ladies-intl-2': {
    dir: 'test/agency-models/ladies-intl-2',
    desc: `A professional high-fashion female model, Nigerian heritage raised in London, age 24, height 180cm, B82/W61/H89.
FACE: Sculpted oval face, razor-sharp cheekbones, large expressive dark brown eyes with long natural lashes. Broad elegant nose, full defined lips. Regal bone structure — the kind of face that stops you in a crowd. Flawless dark brown skin with warm undertone.
BODY: Tall, statuesque, commanding presence. Long neck, elegant shoulders.
HAIR: Natural 4C hair, worn in a short cropped TWA (teeny weeny afro) — clean and architectural.
SKIN: Deep rich brown, even, luminous. Beautiful undertone that catches studio lighting.
EXPRESSION: Composed, powerful, effortlessly regal. Commands the frame without trying.
REFERENCE: Think Adut Akech or Alek Wek — the kind of beauty that redefines standards. Born for Prada and Balenciaga.`,
  },
  'men-intl-clean': {
    dir: 'test/agency-models/men-intl-clean',
    desc: `A professional male fashion model, British-Nigerian heritage, age 26, height 188cm, C92/W74/H90.
FACE: Strong angular face with defined jawline, high cheekbones, deep-set intelligent dark brown eyes. Straight broad nose, full well-shaped lips. Clean-shaven, immaculate grooming. Classically handsome with editorial edge.
BODY: Tall, athletic but lean. The build of a runway model — broad shoulders, narrow waist, long legs.
HAIR: Black, very short fade, crisp clean lineup.
SKIN: Rich deep brown, clear and healthy. Natural sheen without being oily.
EXPRESSION: Quiet confidence. Aristocratic composure. The man who makes a simple white shirt look like it costs a thousand dollars.
REFERENCE: Think of the men who walk for Prada, Dior Homme, Bottega Veneta — elevated, refined, powerful without being aggressive.`,
  },
};

const SHOTS = [
  { name: 'polaroid-front', dir: 'Agency polaroid: full body, plain white tank/t-shirt + simple pants, flat lighting, white bg, arms at sides, no styling. Include model name and measurements as text overlay in the style of real agency polaroids.' },
  { name: 'polaroid-face', dir: 'Agency polaroid: head+shoulders close-up, no makeup, hair natural, flat lighting, neutral expression, show bone structure' },
  { name: 'editorial', dir: 'Studio editorial: full body, wearing simple well-cut black clothing, professional 45-degree key lighting, clean grey bg, natural standing pose, fashion agency portfolio quality' },
  { name: 'beauty', dir: 'Beauty close-up: face and upper shoulders, minimal makeup, soft beauty lighting, warm tone, serene expression, skin texture visible' },
];

async function run(id, config) {
  fs.mkdirSync(config.dir, { recursive: true });
  console.log(`\n=== ${id} ===`);
  const refs = [];
  for (const shot of SHOTS) {
    if (refs.length > 0) await new Promise(r => setTimeout(r, 2000));
    console.log(`  ${shot.name}...`);
    const parts = [];
    if (refs.length > 0) {
      parts.push({ text: 'IDENTITY LOCK — match this exact person:' });
      for (const r of refs) parts.push({ inlineData: { mimeType: 'image/png', data: r } });
    }
    parts.push({ text: `${config.desc}\n\nSHOT: ${shot.dir}` });
    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: [{ role: 'user', parts }],
        config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
      });
      for (const p of resp.candidates?.[0]?.content?.parts || []) {
        if (p.inlineData) {
          fs.writeFileSync(path.join(config.dir, `${shot.name}.png`), Buffer.from(p.inlineData.data, 'base64'));
          refs.push(p.inlineData.data);
          console.log(`  ✅`);
          break;
        }
      }
    } catch (e) {
      console.error(`  ❌ ${e.message}`);
      await new Promise(r => setTimeout(r, 10000));
    }
  }
}

for (const [id, config] of Object.entries(MODELS)) {
  await run(id, config);
  await new Promise(r => setTimeout(r, 3000));
}
console.log('\n=== All done ===');

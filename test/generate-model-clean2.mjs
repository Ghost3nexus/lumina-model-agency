import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }
const ai = new GoogleGenAI({ apiKey: API_KEY });

const MODELS = {
  'ladies-asia-2': {
    dir: 'test/agency-models/ladies-asia-2',
    desc: `A professional high-fashion Japanese female model, age 23, height 174cm, B80/W58/H86.
FACE: Diamond-shaped face with extremely high, sculpted cheekbones that catch light dramatically. Slightly upturned almond-shaped single-lid eyes with dark brown irises — mysterious and magnetic. Small, refined nose. Lips are thin but perfectly shaped with a natural mauve tone. Strong defined brow with natural arch. A face that fashion photographers describe as "editorial" — angular, striking, not conventionally cute.
BODY: Classic runway proportions — long neck, elongated limbs, narrow frame. Moves like a dancer.
HAIR: Dark brown, almost black. Blunt bob cut at jawline. Sleek, glossy, architectural.
SKIN: Porcelain with cool undertone. Flawless. The kind of skin that makes foundation unnecessary.
EXPRESSION: The quiet intensity of a model between takes. Not performing. Present. Aware.
REFERENCE: Think Fei Fei Sun, Du Juan, or the Asian models who walk Celine and The Row. Bone structure over prettiness. Architecture of the face.`,
  },
  'men-asia-clean': {
    dir: 'test/agency-models/men-asia-clean',
    desc: `A professional male fashion model, Japanese-Korean heritage, age 24, height 184cm, C88/W70/H88.
FACE: Defined angular jawline, high cheekbones, slightly hooded eyes with clear dark brown irises. Straight nose with refined bridge. Lips are balanced — neither thin nor full. Clean-shaven with immaculate skin. The face has the androgynous quality that high fashion prizes — beautiful bone structure that transcends gender norms without trying.
BODY: Tall, lean, proportional. Broad shoulders tapering to narrow waist. Long legs. Built for clothes.
HAIR: Black, medium length, natural texture with slight wave. Effortlessly styled — pushed back or side-swept. Never looks "done."
SKIN: Clear, even, healthy glow. Light-medium warm tone. Visible pores at close range — photorealistic, not plastic.
EXPRESSION: Composed. Still. The kind of quiet confidence that reads as elegance on camera. Not brooding, not smiling — just there.
REFERENCE: Think Kohei Takabatake at IMG, or the men who walk for Lemaire and Jil Sander. Understated magnetism.`,
  },
  'ladies-intl-clean': {
    dir: 'test/agency-models/ladies-intl-clean',
    desc: `A professional female fashion model, mixed Eastern European heritage (Ukrainian-Georgian), age 22, height 178cm, B80/W60/H88.
FACE: Oval face with exotic proportions — wide-set green eyes (unusual deep emerald shade), dramatic dark eyebrows that contrast with lighter hair, high cheekbones, aquiline nose that gives the profile dramatic character, full lips. The face is arresting — you can't look away. Not symmetrically perfect, which makes it more interesting.
BODY: Long, lean, graceful. The proportions of a Parisian runway girl — everything is elongated.
HAIR: Dark honey blonde, long, natural wave. Looks like she just walked off a beach and into a casting.
SKIN: Light olive, warm golden undertone. Sun-kissed without being tan. Light freckling across the nose bridge.
EXPRESSION: Simultaneously vulnerable and powerful. Eyes that hold stories. The editorial gaze — looking through the camera, not at it.
REFERENCE: Think Natalia Vodianova's early work, or Bianca Balti. Eastern European bone structure with Mediterranean warmth. The girl who books both Valentino and Celine.`,
  },
};

const SHOTS = [
  { name: 'polaroid-front', dir: 'Agency polaroid: full body, plain white tank + jeans, flat lighting, white bg, arms at sides, no styling' },
  { name: 'polaroid-face', dir: 'Agency polaroid: head+shoulders close-up, no makeup, hair tucked back, flat lighting, neutral expression, show bone structure' },
  { name: 'editorial', dir: 'Studio editorial: full body, wearing a simple well-cut black outfit, professional lighting (45 degree key, fill), clean grey bg, natural standing pose, fashion agency portfolio quality' },
  { name: 'beauty', dir: 'Beauty close-up: face and upper shoulders, minimal makeup, soft beauty lighting, warm tone, serene expression, skin texture visible, clean bg' },
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
    } catch (e) { console.error(`  ❌ ${e.message}`); }
  }
}

for (const [id, config] of Object.entries(MODELS)) {
  await run(id, config);
  await new Promise(r => setTimeout(r, 3000));
}
console.log('\n=== All done ===');

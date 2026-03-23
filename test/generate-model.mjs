/**
 * LUMINA MODEL AGENCY — AIモデル生成スクリプト
 *
 * Usage:
 *   GEMINI_API_KEY=xxx node test/generate-model.mjs rinka
 *   GEMINI_API_KEY=xxx node test/generate-model.mjs nova
 *   GEMINI_API_KEY=xxx node test/generate-model.mjs ren
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const modelId = process.argv[2];
if (!modelId) { console.error('Usage: node test/generate-model.mjs <model-id>'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ── Model Profiles ───────────────────────────────────────────────────────────

const MODELS = {
  rinka: {
    name: 'RINKA',
    category: 'ladies_asia',
    description: `Japanese female, age 22, height 172cm, slim build (B78/W58/H86).
Face: Heart-shaped face, large expressive almond eyes with double eyelids, small nose with soft bridge, full lips with natural pink tint, high cheekbones.
Hair: Shoulder-length pink-ash colored hair, layered with soft texture, slightly messy styling.
Skin: Porcelain fair with warm undertone, flawless.
Expression base: Confident with a hint of playfulness. Street-cool attitude.
Vibe: Tokyo nightlife meets high street fashion. Harajuku edge with editorial polish. Think imma meets Blackpink Lisa's style energy.
Distinctive features: The pink-ash hair is her signature. Slightly cat-eye shaped eyes. A tiny beauty mark below her left eye.`,
  },

  nova: {
    name: 'NOVA',
    category: 'ladies_international',
    description: `Mixed-race female (Eastern European × East Asian features), age 24, height 178cm, athletic slim build (B80/W60/H88).
Face: Striking angular bone structure — sharp jawline, high prominent cheekbones, deep-set almond eyes with unusual light grey-green irises. Perfectly symmetrical features with an almost otherworldly beauty.
Hair: Platinum silver-white, slicked back or wet-look styling, medium length.
Skin: Cool-toned porcelain, almost luminous quality, like polished marble.
Expression base: Intense, penetrating gaze. Zero warmth — pure futuristic editorial cool.
Vibe: Y3K cyborg beauty. As if a human and AI merged. Think Sasha Pivovarova meets Blade Runner. Fashion-forward to the extreme.
Distinctive features: The grey-green eyes against platinum hair create an alien-beautiful effect. Sharp cupid's bow lips. Barely-there eyebrows bleached to match hair.`,
  },

  ren: {
    name: 'REN',
    category: 'men_asia',
    description: `Japanese-Korean male, age 23, height 181cm, lean athletic build (C86/W68/H88).
Face: Oval face with soft yet defined jawline, monolid eyes that are slightly upturned (fox-eye shape), straight nose with refined bridge, full lips. Clean-shaven, glass skin.
Hair: Black, medium length, curtain bangs style with slight wave, effortlessly styled.
Skin: Clear, luminous "glass skin" — smooth with healthy glow, light-medium warm tone.
Expression base: Soft charisma. Approachable yet mysterious. The "cold on the outside, warm on the inside" K-drama lead energy.
Vibe: K-POP idol beauty meets Tokyo editorial. BTS Taehyung's ethereal quality crossed with Japanese minimalism. Gender-fluid beauty — wears makeup naturally.
Distinctive features: The fox-eye shape is his signature. Perfect skin that looks retouched even in real life. A small mole on his right jaw.`,
  },

  sora: {
    name: 'SORA',
    category: 'ladies_asia',
    description: `Japanese non-binary/androgynous female, age 25, height 175cm, lean build (B76/W60/H85).
Face: Strong angular jawline, sharp cheekbones, narrow monolid eyes with intense gaze, straight nose, thin lips. Androgynous beauty — could pass as male or female.
Hair: Jet black, buzzcut on sides with longer top swept back. Architectural, geometric haircut.
Skin: Matte, even-toned, medium-light with cool undertone.
Expression base: Stoic, powerful, unflinching. Zero softness — pure editorial authority.
Vibe: Comme des Garçons meets Yohji Yamamoto. Deconstructed gender. Rei Kawakubo would cast this person. Anti-pretty, anti-conventional. Power in androgyny.
Distinctive features: The jawline and buzzcut create immediate visual impact. A geometric tattoo behind the left ear.`,
  },

  mei: {
    name: 'MEI',
    category: 'ladies_asia',
    description: `Chinese-Japanese mixed female, age 23, height 174cm, slim build (B79/W59/H87).
Face: Round-to-oval face blending Chinese and Japanese features. Large doe eyes with subtle double eyelids, small button nose, full rosy lips, softly defined cheekbones. Youthful but sophisticated.
Hair: Long black hair with blunt bangs (Chinese princess style), sleek and glossy, reaching mid-back.
Skin: Luminous fair, glass-skin texture, pink undertone.
Expression base: Serene elegance with quiet confidence. Traditional beauty with modern edge.
Vibe: New Chinese aesthetic (新中式) meets Tokyo minimalism. Fan Bingbing's regal beauty crossed with Japanese restraint. Silk and structure.
Distinctive features: The blunt bangs framing large eyes is her signature. A small cinnabar-red beauty mark on her right temple (traditional Chinese beauty mark placement).`,
  },

  hana: {
    name: 'HANA',
    category: 'ladies_asia',
    description: `Japanese female, age 27, height 169cm, athletic build (B81/W61/H88).
Face: Oval face, sharp almond eyes with single eyelids, defined nose bridge, full lips with natural color, strong brow bone. Beautiful but with edge — not the "safe" pretty.
Hair: Long black hair, often worn loose and slightly wild. Natural texture, not perfectly styled.
Skin: Golden warm tone, naturally tanned. Visible tattoos — a Japanese traditional-style (和彫り) sleeve on the left arm featuring peonies and waves. Small script tattoo on the right collarbone.
Expression base: Defiant, unapologetic. She looks like she has stories to tell. A warrior softness.
Vibe: Traditional Japanese tattooing meets Alexander McQueen. The beauty of rebellion. Aoi Yu's intensity meets tattoo culture.
Distinctive features: The 和彫り sleeve tattoo is her signature. It must be visible and detailed in every image. A nose ring (small gold hoop) on the right nostril.`,
  },

  zara: {
    name: 'ZARA',
    category: 'ladies_international',
    description: `West African female, age 25, height 180cm, statuesque slim build (B82/W62/H90).
Face: Sculpted oval face, high dramatic cheekbones, large expressive dark brown eyes, full lips, broad refined nose. Regal bone structure — Nefertiti-like proportions.
Hair: Natural 4C hair, styled in a structured updo or architectural shapes. Sometimes in tight cornrows with geometric patterns.
Skin: Deep rich dark brown, flawless with beautiful undertone that catches light like polished wood.
Expression base: Royal composure. She looks like she descends from queens. Commanding without effort.
Vibe: Afrofuturism meets haute couture. Adut Akech's grace meets Wakanda's aesthetic. Future African royalty in a fashion context.
Distinctive features: The architectural hair styling changes but always makes a statement. Gold jewelry — always wearing at least one bold gold piece (ear cuff, nose ring, or stacked rings).`,
  },

  mila: {
    name: 'MILA',
    category: 'ladies_international',
    description: `Eastern European (Ukrainian-French mix) female, age 26, height 176cm, classic model build (B80/W60/H88).
Face: Classic European beauty — high cheekbones, oval face, green eyes with golden flecks, straight refined nose, naturally pink lips, defined but soft jawline.
Hair: Honey-brown, shoulder length, natural wave, effortlessly tousled Parisian style.
Skin: Fair with warm olive undertone, light freckling across nose and cheeks in natural light.
Expression base: Effortless French cool. The Parisienne who doesn't try but always looks right.
Vibe: Daria Werbowy meets French Vogue. Understated luxury. The girl who wears Celine and rides a bicycle. Anti-glamour glamour.
Distinctive features: The green eyes with gold flecks and the freckles create a "real but impossibly beautiful" effect. She looks photorealistic — the hardest to identify as AI.`,
  },

  elena: {
    name: 'ELENA',
    category: 'ladies_international',
    description: `Scandinavian (Norwegian-Finnish mix) female, age 24, height 179cm, lean athletic build (B79/W60/H87).
Face: Angular Nordic face structure, high wide cheekbones, pale blue-grey eyes, straight narrow nose, thin defined lips, strong jaw.
Hair: Vivid natural red (copper-auburn), long and straight, often worn center-parted.
Skin: Very fair, porcelain, visible light freckles especially on cheeks and shoulders. Cool pink undertone.
Expression base: Ice-queen exterior with flashes of warmth. A Scandinavian noir protagonist.
Vibe: Karen Elson meets Tilda Swinton. The redhead who commands attention in any room. Nordic noir editorial.
Distinctive features: The vivid red hair against porcelain freckled skin is instantly recognizable. Pale blue-grey eyes that look almost transparent in certain light.`,
  },

  kaito: {
    name: 'KAITO',
    category: 'men_asia',
    description: `Japanese male, age 26, height 178cm, lean muscular build (C90/W72/H90).
Face: Square jaw with defined chin, slightly hooded double-lid eyes, strong straight nose, medium-full lips. Handsome in a rugged, street way — not pretty-boy.
Hair: Black, medium length, messy textured styling with undercut sides. Sometimes bleached tips.
Skin: Medium warm tone, sun-kissed. Visible tattoos — geometric/tribal patterns on both forearms, a small traditional Japanese wave tattoo on the neck (behind right ear).
Expression base: Laid-back confidence. The guy who doesn't care what you think but somehow makes you want his approval.
Vibe: NEIGHBORHOOD × Supreme. Nigo's aesthetic meets skate culture. 90s Ura-Harajuku energy in 2026. The cool kid at the skatepark who's also in a fashion editorial.
Distinctive features: The forearm tattoos and neck tattoo are his signatures. A silver chain necklace always worn. Slightly chipped front tooth (adds character).`,
  },

  stephen: {
    name: 'STEPHEN',
    category: 'men_international',
    description: `Nigerian-British male, age 27, height 188cm, athletic model build (C92/W74/H92).
Face: Chiseled angular face, razor-sharp jawline, deep-set dark brown eyes with intense gaze, broad nose, full defined lips, prominent Adam's apple. Classically handsome in a high-fashion way.
Hair: Black, very short fade cut, crisp lineup.
Skin: Rich deep brown, even and clear, with a natural healthy sheen.
Expression base: Aristocratic cool. He looks like he belongs on a Prada runway or a British GQ cover.
Vibe: Adonis Bosso meets David Gandy — African heritage with British tailoring sensibility. High fashion × menswear editorial. The man who makes a simple white shirt look like couture.
Distinctive features: The jawline and bone structure are his calling card. A small scar on the left eyebrow (adds rugged character). Perfectly groomed always.`,
  },

  axel: {
    name: 'AXEL',
    category: 'men_international',
    description: `Brazilian male, age 25, height 183cm, athletic toned build (C94/W76/H92).
Face: Warm masculine features — strong jaw softened by full cheeks, dark brown eyes with golden-amber tint, broad nose, wide easy smile, slight stubble.
Hair: Dark brown, curly/wavy, medium length, naturally tousled with sun-bleached highlights at the tips.
Skin: Golden brown, sun-kissed, warm undertone. Visible tattoos — a full sleeve of botanical/tropical illustrations on the right arm, a compass rose on the left forearm, script across upper chest.
Expression base: Warm, open, magnetic. The guy everyone wants to hang out with. Joy comes naturally to his face.
Vibe: Brazilian surfer meets international fashion. Marlon Teixeira's energy meets tattoo culture. Sun, salt water, and style.
Distinctive features: The botanical sleeve tattoo is his signature — detailed tropical flowers, leaves, and birds. The sun-bleached curls and golden-amber eyes create a "golden hour" quality to his face.`,
  },
};

const model = MODELS[modelId];
if (!model) {
  console.error(`Unknown model: ${modelId}. Available: ${Object.keys(MODELS).join(', ')}`);
  process.exit(1);
}

const OUTPUT_DIR = `test/agency-models/${modelId}`;
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── Reference Image Generation ───────────────────────────────────────────────

const REFERENCE_SHOTS = [
  {
    name: 'front',
    direction: `Front-facing portrait, head and shoulders, looking directly into camera.
Soft beauty dish lighting with catchlights in eyes. Clean light gray studio background.
Sharp focus on eyes and facial features. 8K portrait quality.`,
  },
  {
    name: 'three-quarter',
    direction: `Three-quarter angle (45 degrees), head and shoulders.
Slight natural expression. Studio lighting from the left. Clean light gray background.
Show the face shape and profile partially. 8K quality.`,
  },
  {
    name: 'side',
    direction: `Side profile (90 degrees), showing jawline and profile silhouette.
Rim light from behind highlighting hair and face contour. Fill from front.
Clean light gray background. 8K quality.`,
  },
  {
    name: 'smiling',
    direction: `Front-facing, genuine warm smile. Eyes crinkling naturally.
Bright cheerful lighting. Clean light gray background. 8K quality.
The smile should feel authentic, not forced.`,
  },
  {
    name: 'editorial',
    direction: `Editorial fashion portrait. Dramatic directional lighting, strong shadows.
Dark studio background. High-contrast, moody.
Expression should match this model's editorial vibe — intense, fashion-forward.
8K editorial photography quality.`,
  },
];

async function generateReference(shot, existingRefs) {
  console.log(`  Generating: ${shot.name}...`);

  const parts = [];

  // Pass existing references for face consistency
  if (existingRefs.length > 0) {
    parts.push({ text: `FACE IDENTITY LOCK — The following ${existingRefs.length} images show the EXACT person you must reproduce. Study every facial detail: bone structure, eye shape, nose, lips, skin tone, distinctive marks.` });
    for (const ref of existingRefs) {
      parts.push({ inlineData: { mimeType: 'image/png', data: ref.data } });
    }
  }

  parts.push({
    text: `Generate a professional portrait photograph of this specific person:

${model.description}

SHOT: ${shot.direction}

${existingRefs.length > 0 ? 'CRITICAL: This MUST be the EXACT SAME PERSON shown in the reference images above. Every facial feature must match precisely.' : 'CRITICAL: This is ESTABLISHING the identity of this model. Every facial detail must be distinctive, memorable, and reproducible in future images.'}`,
  });

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
  });

  if (resp.candidates?.[0]?.content) {
    for (const part of resp.candidates[0].content.parts || []) {
      if (part.inlineData) {
        const outPath = path.join(OUTPUT_DIR, `ref-${shot.name}.png`);
        fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
        console.log(`  ✅ ${outPath}`);
        return { name: shot.name, data: part.inlineData.data };
      }
    }
  }
  throw new Error(`No image for ${shot.name}`);
}

// ── Sample Outfit Images ─────────────────────────────────────────────────────

const SAMPLE_OUTFITS = [
  'Wearing a white oversized t-shirt and straight-leg blue jeans. White sneakers. Casual street style.',
  'Wearing a tailored black blazer over a white shirt with grey slim trousers. Dress shoes. Business editorial.',
  'Wearing a colorful patterned streetwear hoodie and cargo pants. High-top sneakers. Urban street style.',
];

async function generateSample(outfit, index, references) {
  console.log(`  Sample ${index + 1}/3: ${outfit.slice(0, 50)}...`);

  const parts = [];
  parts.push({ text: `FACE IDENTITY — These ${references.length} reference photos show the model. This EXACT person must appear in the output.` });
  for (const ref of references) {
    parts.push({ inlineData: { mimeType: 'image/png', data: ref.data } });
  }

  parts.push({
    text: `Generate a professional full-body e-commerce fashion photograph of this EXACT person:

${model.description}

OUTFIT: ${outfit}

PHOTOGRAPHY:
- Full body, head to toe, natural confident pose
- Clean studio background
- Directional studio lighting, shadow ratio 1:2.5 to 1:3
- NO flat lighting, NO blown highlights
- Photorealistic, ZARA/NET-A-PORTER commercial quality

ABSOLUTE REQUIREMENT: The face must be IDENTICAL to the reference photos.`,
  });

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.35 },
  });

  if (resp.candidates?.[0]?.content) {
    for (const part of resp.candidates[0].content.parts || []) {
      if (part.inlineData) {
        const outPath = path.join(OUTPUT_DIR, `sample-${String(index + 1).padStart(2, '0')}.png`);
        fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
        console.log(`  ✅ ${outPath}`);
        return;
      }
    }
  }
  throw new Error(`No image for sample ${index + 1}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`=== LUMINA MODEL AGENCY — ${model.name} ===`);
  console.log(`Category: ${model.category}`);
  console.log(`Output: ${OUTPUT_DIR}/\n`);

  // Phase 1: Reference images (sequential, building consistency)
  console.log('── Phase 1: Reference Images (5 shots) ──');
  const references = [];
  for (const shot of REFERENCE_SHOTS) {
    if (references.length > 0) {
      await new Promise(r => setTimeout(r, 2000));
    }
    const ref = await generateReference(shot, references);
    references.push(ref);
  }
  console.log(`\n✅ ${references.length} reference images generated\n`);

  // Phase 2: Sample outfit images
  console.log('── Phase 2: Sample Outfit Images (3 shots) ──');
  for (let i = 0; i < SAMPLE_OUTFITS.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, 3000));
    try {
      await generateSample(SAMPLE_OUTFITS[i], i, references);
    } catch (err) {
      console.error(`  ❌ Sample ${i + 1} failed:`, err.message);
      await new Promise(r => setTimeout(r, 10000));
      try { await generateSample(SAMPLE_OUTFITS[i], i, references); }
      catch (e) { console.error(`  ❌ Retry failed:`, e.message); }
    }
  }

  console.log(`\n=== ${model.name} Complete ===`);
  console.log(`Output: ${OUTPUT_DIR}/`);
  console.log('  ref-*.png    = 5 reference images (face identity)');
  console.log('  sample-*.png = 3 sample outfit images');
}

main().catch(err => { console.error('Failed:', err); process.exit(1); });

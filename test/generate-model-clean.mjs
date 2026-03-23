/**
 * クリーンなファッションモデル生成テスト
 * Wizard Models 的な正統派エディトリアルモデル
 *
 * GEMINI_API_KEY=xxx node test/generate-model-clean.mjs
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const OUTPUT_DIR = 'test/agency-models/model-test';
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── ファッションモデルとして正しいプロンプト ──────────────────────────────

const MODEL_DESCRIPTION = `A professional high-fashion female model, age 21, height 176cm, measurements B79/W59/H87, shoe size 25cm.

FACE: Elongated oval face with striking bone structure — prominent cheekbones sit high on the face creating elegant shadows beneath. Clean jawline that tapers to a refined chin. Large, slightly deep-set eyes with clear dark brown irises — the kind of eyes that photograph beautifully from any angle. Straight nose with a defined bridge. Naturally full lips with a subtle asymmetry (slightly fuller lower lip). Minimal eyebrows, naturally shaped and well-groomed. No makeup or very minimal — the beauty is structural, not cosmetic.

BODY: Fashion model proportions — long neck, narrow shoulders that slope elegantly, long limbs relative to torso. Lean without being athletic. The body is a hanger for clothes — proportions that make garments look their best.

HAIR: Black, straight, long (past shoulders), center-parted. Clean, glossy, well-conditioned. Simple and un-styled — the hair doesn't compete with the face or the clothes.

SKIN: Clear, healthy, even-toned. Light-medium with neutral undertone. No blemishes. Natural texture visible — not airbrushed looking. Photorealistic skin that shows pores at close range.

EXPRESSION: Neutral to subtly intense. NOT smiling. NOT pouting. NOT trying to be "cool." The vacant, focused gaze of a professional model on set — present but not performing. Think: the expression between shots when the model is just standing there and somehow looks more beautiful than when she's posing.

VIBE: She is a working fashion model. Not a celebrity. Not an actress. Not an influencer. She has the specific, hard-to-define quality that makes fashion editors and casting directors stop scrolling. Unconventionally striking rather than conventionally pretty. The camera loves her bone structure.

REFERENCE: Think of the aesthetic of models at agencies like Wizard Models Tokyo, Women Management, or IMG — editorial girls who book Vogue and walk for Prada. Clean, structural beauty. No gimmicks.`;

const SHOTS = [
  {
    name: 'polaroid-front',
    prompt: `${MODEL_DESCRIPTION}

SHOT TYPE: Model agency polaroid / digitals — the industry standard test shot.
- Front facing, arms at sides, standing straight
- Wearing a simple white tank top and blue jeans (or similar plain clothing)
- NO styling, NO accessories, NO makeup
- Flat, even lighting (no dramatic shadows — this is a test shot, not an editorial)
- Plain white or light grey background
- Full body, head to toe
- The image should look like what a model scout would take on a phone or a simple digital camera
- This is about bone structure, proportions, and raw potential — not production value

The purpose of this image is to show: "This is what she actually looks like." Agencies use these to evaluate models without the distraction of styling, lighting, or retouching.`,
  },
  {
    name: 'polaroid-face',
    prompt: `${MODEL_DESCRIPTION}

SHOT TYPE: Model agency polaroid / digitals — close-up face shot.
- Head and shoulders, front facing
- No makeup or very minimal (concealer only)
- Hair pulled back or tucked behind ears to show face shape and bone structure
- Flat even lighting, plain background
- Neutral expression — mouth slightly parted, relaxed face
- This is the "can the camera see your bone structure" test
- Sharp focus on facial features

Industry standard: scouts and casting directors look at this shot to evaluate cheekbones, jawline, eye shape, and skin quality.`,
  },
  {
    name: 'editorial-studio',
    prompt: `${MODEL_DESCRIPTION}

SHOT TYPE: Professional studio editorial — the kind of image that goes in a model's portfolio book.
- Full body, natural standing pose (weight on one leg, slight hip tilt)
- Wearing simple, elevated clothing: a well-cut black blazer, white shirt, tailored trousers
- Minimal styling — the clothes are simple so the model is the focus
- Professional studio lighting: key light from 45 degrees, fill light, clean shadows
- Shadow ratio approximately 1:2.5 — dimensional but not dramatic
- Clean studio background (light grey or white)
- Shot by a professional fashion photographer for a model agency's website
- ZARA / COS / Uniqlo campaign quality

This should look like it belongs on wizardmodels.com or any reputable Tokyo model agency's portfolio page.`,
  },
  {
    name: 'editorial-beauty',
    prompt: `${MODEL_DESCRIPTION}

SHOT TYPE: Beauty editorial close-up — the kind of image used for skincare or beauty campaigns.
- Close-up face and upper shoulders
- Minimal to no makeup — "no makeup" makeup at most
- Skin texture visible and beautiful — this celebrates real skin
- Soft, flattering beauty lighting (beauty dish or ring light quality)
- Slightly warm tone
- Expression: serene, calm, eyes engaging with camera
- Hair naturally falling, not overly styled
- Clean background

The focus is entirely on skin quality, bone structure, and natural beauty. This shot sells the idea that this face is compelling enough to carry a beauty campaign.`,
  },
  {
    name: 'walking',
    prompt: `${MODEL_DESCRIPTION}

SHOT TYPE: Movement/walking shot — showing how the model moves and carries herself.
- Full body, mid-stride walking toward camera
- Natural, confident walk — not a runway stomp, more of an editorial stride
- Wearing a simple long coat or trench over basic clothing
- The coat should move with the walk, showing fabric motion
- Studio or minimal background
- Slightly lower angle (camera at waist height) to elongate proportions
- Professional lighting with slight drama

This shot shows: she can move. The garments look alive on her. She has presence even in motion.`,
  },
];

async function generateShot(shot, existingRefs) {
  console.log(`  Generating: ${shot.name}...`);

  const parts = [];
  if (existingRefs.length > 0) {
    parts.push({ text: `IDENTITY LOCK — The following images show the EXACT person. Match every facial feature precisely.` });
    for (const ref of existingRefs) {
      parts.push({ inlineData: { mimeType: 'image/png', data: ref.data } });
    }
    parts.push({ text: `Now generate a new image of this EXACT SAME PERSON:` });
  }
  parts.push({ text: shot.prompt });

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
  });

  if (resp.candidates?.[0]?.content) {
    for (const part of resp.candidates[0].content.parts || []) {
      if (part.inlineData) {
        const outPath = path.join(OUTPUT_DIR, `${shot.name}.png`);
        fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
        console.log(`  ✅ ${outPath}`);
        return { name: shot.name, data: part.inlineData.data };
      }
    }
  }
  throw new Error(`No image for ${shot.name}`);
}

async function main() {
  console.log('=== Fashion Model Test — Clean Editorial ===\n');

  const refs = [];
  for (const shot of SHOTS) {
    if (refs.length > 0) await new Promise(r => setTimeout(r, 2000));
    try {
      const ref = await generateShot(shot, refs);
      refs.push(ref);
    } catch (err) {
      console.error(`  ❌ ${shot.name} failed:`, err.message);
      await new Promise(r => setTimeout(r, 10000));
      try {
        const ref = await generateShot(shot, refs);
        refs.push(ref);
      } catch (e) { console.error(`  ❌ Retry failed:`, e.message); }
    }
  }

  console.log('\n=== Done ===');
  console.log(`Output: ${OUTPUT_DIR}/`);
}

main().catch(err => { console.error('Failed:', err); process.exit(1); });

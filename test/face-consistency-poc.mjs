/**
 * Face Consistency PoC — Gemini単体で顔の一貫性を検証
 *
 * Phase 1: リファレンス画像5枚を生成（1体のAIモデルの「顔」を確立）
 * Phase 2: そのリファレンスを毎回渡して着用画像10枚生成
 * Phase 3: 目視評価（S/A/B）
 *
 * Usage:
 *   GEMINI_API_KEY=xxx node test/face-consistency-poc.mjs
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const OUTPUT_DIR = 'test/face-poc';
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── Model Definition ─────────────────────────────────────────────────────────

const MODEL_PROFILE = {
  name: 'Yuki',
  category: 'ladies_asia',
  description: `Japanese female model, age 24, height 170cm, slim build.
Face: Oval face shape, high cheekbones, defined jawline, almond-shaped dark brown eyes, straight black hair (shoulder length), natural eyebrows, clear smooth skin with warm undertone.
Expression: Confident yet approachable. Subtle smile.
Vibe: Modern, editorial, clean beauty.`,
};

// ── Phase 1: Generate Reference Images ───────────────────────────────────────

const REFERENCE_PROMPTS = [
  {
    name: 'front',
    prompt: `Generate a professional headshot/portrait photograph of this specific person:

${MODEL_PROFILE.description}

SHOT: Front-facing portrait, head and shoulders, looking directly at camera.
LIGHTING: Soft studio lighting, beauty dish, catchlights in eyes.
BACKGROUND: Clean light gray studio background.
QUALITY: 8K portrait photography quality, sharp focus on eyes, natural skin texture visible.

CRITICAL: This is establishing the IDENTITY of this model. Every detail of her face must be distinctive and memorable — this exact face will need to be reproduced in future images.`,
  },
  {
    name: 'three-quarter',
    prompt: `Generate a professional portrait photograph of this EXACT SAME person:

${MODEL_PROFILE.description}

SHOT: Three-quarter angle (45 degrees), head and shoulders.
EXPRESSION: Slight confident smile, eyes engaging with camera.
LIGHTING: Soft studio lighting from the left side.
BACKGROUND: Clean light gray studio background.
QUALITY: 8K portrait photography quality.

CRITICAL: This must be the EXACT SAME PERSON as all other reference images. Same face shape, same eyes, same features.`,
  },
  {
    name: 'side',
    prompt: `Generate a professional profile portrait of this EXACT SAME person:

${MODEL_PROFILE.description}

SHOT: Side profile (90 degrees), showing jawline and profile silhouette.
LIGHTING: Rim light from behind, fill light from front.
BACKGROUND: Clean light gray studio background.
QUALITY: 8K portrait photography quality.

CRITICAL: This must be the EXACT SAME PERSON. Same nose shape, jawline, ear position.`,
  },
  {
    name: 'smiling',
    prompt: `Generate a professional portrait of this EXACT SAME person:

${MODEL_PROFILE.description}

SHOT: Front-facing, head and shoulders.
EXPRESSION: Genuine warm smile, showing teeth slightly, eyes crinkling naturally.
LIGHTING: Bright, cheerful studio lighting.
BACKGROUND: Clean light gray studio background.
QUALITY: 8K portrait photography quality.

CRITICAL: EXACT SAME PERSON smiling. Face structure, eyes, and all features must match.`,
  },
  {
    name: 'cool',
    prompt: `Generate a professional editorial portrait of this EXACT SAME person:

${MODEL_PROFILE.description}

SHOT: Slightly looking down, chin tilted, editorial fashion pose.
EXPRESSION: Cool, serious, high-fashion editorial expression. No smile.
LIGHTING: Dramatic directional lighting, strong shadows.
BACKGROUND: Dark studio background.
QUALITY: 8K editorial photography quality.

CRITICAL: EXACT SAME PERSON in editorial mood. Every facial feature must match the other references.`,
  },
];

async function generateReference(promptConfig, existingRefs = []) {
  console.log(`  Generating reference: ${promptConfig.name}...`);

  const parts = [{ text: promptConfig.prompt }];

  // Pass existing references for consistency
  for (const ref of existingRefs) {
    parts.push({
      text: `REFERENCE — this is the same person (${ref.name} view):`
    });
    parts.push({
      inlineData: { mimeType: 'image/png', data: ref.data }
    });
  }

  if (existingRefs.length > 0) {
    parts.push({
      text: 'Generate the new image of this EXACT SAME PERSON shown in the reference images above.'
    });
  }

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
  });

  if (resp.candidates?.[0]?.content) {
    for (const part of resp.candidates[0].content.parts || []) {
      if (part.inlineData) {
        const outPath = path.join(OUTPUT_DIR, `ref-${promptConfig.name}.png`);
        fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
        console.log(`  ✅ Saved: ${outPath}`);
        return { name: promptConfig.name, data: part.inlineData.data, path: outPath };
      }
    }
  }
  throw new Error(`No image for reference: ${promptConfig.name}`);
}

// ── Phase 2: Generate Test Images with References ────────────────────────────

const TEST_SCENARIOS = [
  'Full body, wearing a white t-shirt and blue jeans, standing naturally in a studio',
  'Full body, wearing a black blazer over white shirt with grey trousers, professional pose',
  'Full body, wearing a casual oversized hoodie and jogger pants, relaxed pose',
  'Full body, wearing a summer dress (floral pattern), walking pose',
  'Bust-up shot, wearing a denim jacket, looking at camera',
  'Full body, wearing a long trench coat (beige), standing with hands in pockets',
  'Full body, wearing athletic wear (sports bra + leggings), active pose',
  'Full body, wearing an elegant evening dress (black), sophisticated pose',
  'Full body, wearing a knit sweater and wide-leg pants, cozy autumn vibe',
  'Bust-up shot, wearing a leather jacket, edgy editorial expression',
];

async function generateTestImage(scenario, index, references) {
  console.log(`  Test ${index + 1}/10: ${scenario.slice(0, 50)}...`);

  const parts = [];

  // All reference images first
  parts.push({
    text: `You must generate an image of this EXACT person. Here are 5 reference photos of her face from different angles and expressions. Study every detail: face shape, eye shape, nose, jawline, skin tone, hair.`
  });

  for (const ref of references) {
    parts.push({
      inlineData: { mimeType: 'image/png', data: ref.data }
    });
  }

  parts.push({
    text: `Now generate a NEW professional fashion photograph of this EXACT SAME PERSON:

MODEL IDENTITY (LOCKED — do not change ANY facial features):
${MODEL_PROFILE.description}

SCENE: ${scenario}

PHOTOGRAPHY:
- Clean studio background
- Professional lighting, shadow ratio 1:2.5
- Photorealistic, ZARA/NET-A-PORTER commercial quality
- Natural pose, confident expression

ABSOLUTE REQUIREMENT: The person in the output must be IDENTICAL to the person in the 5 reference photos. Same face, same eyes, same features. A viewer looking at the reference photos and this new photo must conclude it is the SAME person.`
  });

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.35 },
  });

  if (resp.candidates?.[0]?.content) {
    for (const part of resp.candidates[0].content.parts || []) {
      if (part.inlineData) {
        const outPath = path.join(OUTPUT_DIR, `test-${String(index + 1).padStart(2, '0')}.png`);
        fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
        console.log(`  ✅ Saved: ${outPath}`);
        return outPath;
      }
    }
  }
  throw new Error(`No image for test ${index + 1}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Face Consistency PoC ===');
  console.log(`Model: ${MODEL_PROFILE.name} (${MODEL_PROFILE.category})`);
  console.log(`Output: ${OUTPUT_DIR}/\n`);

  // Phase 1: Generate references (sequentially, each building on previous)
  console.log('── Phase 1: Generating 5 reference images ──');
  const references = [];

  for (const promptConfig of REFERENCE_PROMPTS) {
    // Wait between calls to avoid rate limits
    if (references.length > 0) {
      await new Promise(r => setTimeout(r, 2000));
    }
    const ref = await generateReference(promptConfig, references);
    references.push(ref);
  }

  console.log(`\n✅ ${references.length} reference images generated\n`);

  // Phase 2: Generate 10 test images
  console.log('── Phase 2: Generating 10 test images with face references ──');

  for (let i = 0; i < TEST_SCENARIOS.length; i++) {
    // Rate limit spacing
    if (i > 0) {
      console.log('  (waiting 3s for rate limit...)');
      await new Promise(r => setTimeout(r, 3000));
    }

    try {
      await generateTestImage(TEST_SCENARIOS[i], i, references);
    } catch (err) {
      console.error(`  ❌ Test ${i + 1} failed:`, err.message);
      // Wait longer on error (likely rate limit)
      console.log('  (waiting 10s after error...)');
      await new Promise(r => setTimeout(r, 10000));
      // Retry once
      try {
        await generateTestImage(TEST_SCENARIOS[i], i, references);
      } catch (retryErr) {
        console.error(`  ❌ Test ${i + 1} retry failed:`, retryErr.message);
      }
    }
  }

  console.log('\n=== PoC Complete ===');
  console.log(`\nOutput: ${OUTPUT_DIR}/`);
  console.log('  ref-*.png  = 5 reference images');
  console.log('  test-*.png = 10 test images');
  console.log('\n── Evaluation ──');
  console.log('Open the folder and compare test images to references:');
  console.log('  S = 誰が見ても同じ人');
  console.log('  A = よく見ると違うが同一人物として通用');
  console.log('  B = 別人に見える');
  console.log('\n合格基準: 10枚中8枚以上が S or A');
}

main().catch(err => { console.error('PoC failed:', err); process.exit(1); });

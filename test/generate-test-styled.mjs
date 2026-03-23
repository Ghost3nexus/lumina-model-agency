/**
 * CLI test: Lumina generation pipeline with styling rules
 *
 * Usage:
 *   GEMINI_API_KEY=xxx node test/generate-test-styled.mjs --hero=tops test/bedwin-demo/shirt/A.jpg test/bedwin-demo/pants/A.jpg
 *   GEMINI_API_KEY=xxx node test/generate-test-styled.mjs --hero=pants test/bedwin-demo/shirt/A.jpg test/bedwin-demo/pants/A.jpg
 *   GEMINI_API_KEY=xxx node test/generate-test-styled.mjs --hero=outer --gender=male test/bedwin-demo/shirt/A.jpg test/bedwin-demo/pants/A.jpg
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY env var required'); process.exit(1); }

// Parse args
const flags = {};
const inputFiles = [];
for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('--')) {
    const [key, val] = arg.slice(2).split('=');
    flags[key] = val;
  } else {
    inputFiles.push(arg);
  }
}

const heroCategory = flags.hero || 'tops';
const gender = flags.gender || 'female';

if (inputFiles.length === 0) {
  console.error('Usage: node test/generate-test-styled.mjs --hero=tops <file1> [file2] ...');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const OUTPUT_DIR = 'test/generation-output';
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── Styling rules ────────────────────────────────────────────────────────────

const STYLING_RULES = {
  // When this category is the HERO (main product being sold)
  hero: {
    tops: `STYLING for HERO TOP:
- Shirt/top worn naturally, not tucked in
- Buttons as-is (do not change button state from reference)
- Sleeves as shown in reference image
- Bottom half: simple complementary pants/jeans, NOT the focus
- The TOP is the star — ensure it's fully visible and well-presented`,

    pants: `STYLING for HERO PANTS:
- Waistband and rise MUST be visible — this is a key selling point
- Top should be tucked in OR cropped/short to show the waist area
- Full leg silhouette visible from waist to hem
- The PANTS are the star — ensure fit, rise, and leg shape are clearly shown`,

    outer: `STYLING for HERO OUTERWEAR:
- Jacket/coat worn CLOSED (buttoned/zipped) to show silhouette and shape
- Collar, shoulders, and overall structure must be clearly visible
- Inner layers should not distract from the outerwear shape
- The OUTERWEAR is the star — show its form and proportions`,

    dress: `STYLING for HERO DRESS:
- Dress shown in full from neckline to hem
- Natural drape and silhouette visible
- No heavy layering that obscures the dress shape
- The DRESS is the star — show its cut, length, and flow`,

    skirt: `STYLING for HERO SKIRT:
- Waistband visible, top tucked in or cropped
- Full skirt length and silhouette shown
- The SKIRT is the star — show its shape and movement`,
  },

  // When this category is a SUPPORTING item (not the hero)
  supporting: {
    tops: `Supporting top: worn naturally, untucked, not the focus`,
    pants: `Supporting pants: simple styling, waist can be partially hidden by top`,
    outer: `Supporting outerwear: worn OPEN to show the hero item underneath`,
    dress: `Supporting dress: simple, complementary`,
    skirt: `Supporting skirt: simple styling`,
  }
};

function getStylingPrompt(heroCategory, items) {
  const heroRule = STYLING_RULES.hero[heroCategory] || STYLING_RULES.hero.tops;

  const supportingRules = items
    .filter(item => item.category !== heroCategory)
    .map(item => STYLING_RULES.supporting[item.category] || '')
    .filter(Boolean)
    .join('\n');

  return `${heroRule}
${supportingRules ? '\n' + supportingRules : ''}

IMPORTANT: The ${heroCategory.toUpperCase()} is the HERO PRODUCT being sold.
All styling decisions should prioritize showcasing this item.`;
}

// ── Load images ──────────────────────────────────────────────────────────────

function loadImage(filePath) {
  const abs = path.resolve(filePath);
  const buf = fs.readFileSync(abs);
  const ext = path.extname(abs).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  return { data: buf.toString('base64'), mimeType };
}

const garmentImages = inputFiles.map(f => {
  console.log(`Loading: ${f}`);
  return { path: f, ...loadImage(f) };
});

// ── Step 1: Analyze ──────────────────────────────────────────────────────────

async function analyzeGarments() {
  console.log('\n─── Step 1: Analyze garments ───');

  const imageParts = garmentImages.map(img => ({
    inlineData: { mimeType: img.mimeType, data: img.data }
  }));

  const prompt = `Analyze these ${garmentImages.length} garment image(s) as a coordinated outfit. Return JSON:
{
  "items": [
    {
      "category": "tops" | "pants" | "dress" | "outer" | "skirt" | "shoes" | "accessories",
      "subcategory": "specific type",
      "color": "primary color",
      "material": "fabric type",
      "pattern": "solid|striped|plaid|etc",
      "fit": "regular|oversized|slim|etc",
      "description": "1-2 sentence product description"
    }
  ],
  "outfit_description": "Overall coordination description",
  "missing_items": "What basics would complement (shoes, belt, etc)"
}
Return ONLY valid JSON.`;

  const resp = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }, ...imageParts] }],
    config: { temperature: 0.1 },
  });

  const text = resp.text?.trim() ?? '';
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const analysis = JSON.parse(cleaned);
  console.log('Analysis:', JSON.stringify(analysis, null, 2));
  return analysis;
}

// ── Step 2: Generate Front ───────────────────────────────────────────────────

async function generateFront(analysis) {
  console.log('\n─── Step 2: Generate front image ───');
  console.log(`Hero: ${heroCategory} | Gender: ${gender}`);

  const imageParts = garmentImages.map(img => ({
    inlineData: { mimeType: img.mimeType, data: img.data }
  }));

  const items = analysis.items || [];
  const itemDescriptions = items.map(i =>
    `- ${i.category}: ${i.description} (${i.color}, ${i.material}, ${i.pattern}, ${i.fit})`
  ).join('\n');

  const modelDesc = gender === 'male'
    ? 'Japanese male, late 20s, 180cm, athletic build, black short hair, confident expression'
    : 'Japanese female, mid 20s, 170cm, slim build, black hair, confident natural expression';

  const stylingPrompt = getStylingPrompt(heroCategory, items);
  const missingItems = analysis.missing_items || '';

  const prompt = `Professional e-commerce fashion photography. ZARA / NET-A-PORTER quality.

MODEL: ${modelDesc}

OUTFIT (match reference images EXACTLY):
${itemDescriptions}

${missingItems ? `AUTO-COMPLEMENT (for unspecified items): ${missingItems}` : ''}

${stylingPrompt}

PHOTOGRAPHY:
- Full body shot, head to toe, natural standing pose
- Clean studio background
- Directional lighting, shadow ratio 1:2.5 to 1:3
- NO flat lighting, NO blown highlights
- Fabric texture must be clearly visible
- Garment colors, patterns, materials must match reference images exactly
- Photorealistic, commercial EC quality`;

  console.log('Prompt length:', prompt.length, 'chars');

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts: [{ text: prompt }, ...imageParts] }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.35 },
  });

  if (resp.candidates?.[0]?.content) {
    for (const part of resp.candidates[0].content.parts || []) {
      if (part.inlineData) {
        const tag = `${heroCategory}-${gender}`;
        const outPath = path.join(OUTPUT_DIR, `front-${tag}-${Date.now()}.png`);
        fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
        console.log(`✅ Front saved: ${outPath}`);
        return { path: outPath, data: part.inlineData.data, mimeType: 'image/png' };
      }
    }
  }
  throw new Error('No image returned for front');
}

// ── Step 3: Generate angle ───────────────────────────────────────────────────

async function generateAngle(frontImage, analysis, angle) {
  console.log(`\n─── Step 3: Generate ${angle} ───`);

  const angleInstructions = {
    back: 'Model turned 180 degrees, complete back view.',
    side: 'Model at 3/4 angle (~45 degrees). Show silhouette.',
    bust: 'Upper body close-up, chest to head. Show fabric texture and face.',
  };

  const imageParts = [
    { inlineData: { mimeType: frontImage.mimeType, data: frontImage.data } },
    ...garmentImages.map(img => ({ inlineData: { mimeType: img.mimeType, data: img.data } })),
  ];

  const items = analysis.items || [];
  const itemDescriptions = items.map(i => `${i.category}: ${i.color} ${i.material}`).join(', ');

  const prompt = `Generate the ${angle.toUpperCase()} view of the SAME model wearing the SAME outfit.

REFERENCE IMAGE 1: Front view anchor
REFERENCE IMAGES 2+: Original garment images

ANGLE: ${angleInstructions[angle]}

OUTFIT: ${itemDescriptions}

CRITICAL: Same model, same garment styling, same studio. Photorealistic EC quality.`;

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts: [{ text: prompt }, ...imageParts] }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.35 },
  });

  if (resp.candidates?.[0]?.content) {
    for (const part of resp.candidates[0].content.parts || []) {
      if (part.inlineData) {
        const tag = `${heroCategory}-${gender}`;
        const outPath = path.join(OUTPUT_DIR, `${angle}-${tag}-${Date.now()}.png`);
        fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
        console.log(`✅ ${angle} saved: ${outPath}`);
        return outPath;
      }
    }
  }
  throw new Error(`No image returned for ${angle}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Lumina Styled Generation Test ===');
  console.log(`Input: ${inputFiles.join(', ')}`);
  console.log(`Hero: ${heroCategory} | Gender: ${gender}`);

  const startTime = Date.now();
  const analysis = await analyzeGarments();
  const frontImage = await generateFront(analysis);

  const angles = ['back', 'side', 'bust'];
  const results = await Promise.allSettled(
    angles.map(angle => generateAngle(frontImage, analysis, angle))
  );

  for (let i = 0; i < angles.length; i++) {
    if (results[i].status === 'rejected') {
      console.error(`❌ ${angles[i]} failed:`, results[i].reason?.message);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=== Done in ${elapsed}s ===`);
}

main().catch(err => { console.error('Failed:', err); process.exit(1); });

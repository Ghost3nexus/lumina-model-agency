/**
 * CLI test: Lumina generation pipeline
 *
 * Usage:
 *   GEMINI_API_KEY=xxx node test/generate-test.mjs test/bedwin-demo/shirt/A.jpg
 *   GEMINI_API_KEY=xxx node test/generate-test.mjs test/bedwin-demo/shirt/A.jpg test/bedwin-demo/pants/A.jpg
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY env var required');
  process.exit(1);
}

const inputFiles = process.argv.slice(2);
if (inputFiles.length === 0) {
  console.error('Usage: node test/generate-test.mjs <garment1.jpg> [garment2.jpg] ...');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const OUTPUT_DIR = 'test/generation-output';
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

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

  const prompt = garmentImages.length === 1
    ? `Analyze this garment image. Return JSON:
{
  "items": [{
    "category": "tops|pants|dress|outer|skirt|shoes|accessories",
    "subcategory": "specific type",
    "color": "primary color",
    "material": "fabric type",
    "pattern": "solid|striped|plaid|etc",
    "fit": "regular|oversized|slim|etc",
    "description": "1-2 sentence description"
  }]
}`
    : `Analyze these ${garmentImages.length} garment images as a coordinated outfit. Return JSON:
{
  "items": [
    {
      "category": "tops|pants|dress|outer|skirt|shoes|accessories",
      "subcategory": "specific type",
      "color": "primary color",
      "material": "fabric type",
      "pattern": "solid|striped|plaid|etc",
      "fit": "regular|oversized|slim|etc",
      "description": "1-2 sentence description"
    }
  ],
  "outfit_description": "Overall outfit description — styling, coordination, vibe",
  "missing_items": "What basic items would complement this outfit (e.g. if only top uploaded, suggest pants)"
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

  const imageParts = garmentImages.map(img => ({
    inlineData: { mimeType: img.mimeType, data: img.data }
  }));

  const items = analysis.items || [];
  const itemDescriptions = items.map(i =>
    `- ${i.category}: ${i.description} (${i.color}, ${i.material}, ${i.pattern}, ${i.fit})`
  ).join('\n');

  const outfitDesc = analysis.outfit_description || 'Single garment styling';
  const missingItems = analysis.missing_items || '';

  const prompt = `Professional e-commerce fashion photography. ZARA / NET-A-PORTER quality.

MODEL: Japanese male, late 20s, 180cm, athletic build, black short hair, confident natural expression.

OUTFIT (match reference images EXACTLY):
${itemDescriptions}

${missingItems ? `AUTO-COMPLEMENT (for items not in reference): ${missingItems}` : ''}

OVERALL STYLING: ${outfitDesc}

PHOTOGRAPHY:
- Full body shot, head to toe, natural standing pose
- Clean studio background
- Directional lighting, shadow ratio 1:2.5 to 1:3
- NO flat lighting, NO blown highlights
- Fabric texture must be clearly visible
- Garment colors, patterns, materials must match reference images exactly
- Photorealistic, commercial EC quality`;

  console.log('Prompt length:', prompt.length, 'chars');
  console.log('Reference images:', garmentImages.length);

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts: [{ text: prompt }, ...imageParts] }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.35 },
  });

  if (resp.candidates?.[0]?.content) {
    for (const part of resp.candidates[0].content.parts || []) {
      if (part.inlineData) {
        const outPath = path.join(OUTPUT_DIR, `front-${Date.now()}.png`);
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
    back: 'Model turned 180 degrees, complete back view. Same pose energy.',
    side: 'Model at 3/4 angle (~45 degrees). Show silhouette and garment drape.',
    bust: 'Upper body close-up, chest to head. Show fabric texture and face clearly.',
  };

  const imageParts = [
    { inlineData: { mimeType: frontImage.mimeType, data: frontImage.data } },
    ...garmentImages.map(img => ({ inlineData: { mimeType: img.mimeType, data: img.data } })),
  ];

  const items = analysis.items || [];
  const itemDescriptions = items.map(i => `${i.category}: ${i.color} ${i.material}`).join(', ');

  const prompt = `Generate the ${angle.toUpperCase()} view of the SAME model wearing the SAME outfit.

REFERENCE IMAGE 1: Front view anchor (same model, same outfit)
REFERENCE IMAGES 2+: Original garment images (match exactly)

ANGLE: ${angleInstructions[angle]}

OUTFIT: ${itemDescriptions}

CRITICAL:
- Same model identity (face, body, skin, hair)
- Same garment colors, materials, patterns
- Same studio lighting and background
- Photorealistic EC quality`;

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts: [{ text: prompt }, ...imageParts] }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.35 },
  });

  if (resp.candidates?.[0]?.content) {
    for (const part of resp.candidates[0].content.parts || []) {
      if (part.inlineData) {
        const outPath = path.join(OUTPUT_DIR, `${angle}-${Date.now()}.png`);
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
  console.log('=== Lumina Generation Pipeline Test ===');
  console.log(`Input: ${inputFiles.join(', ')}`);
  console.log(`Output: ${OUTPUT_DIR}/`);

  const startTime = Date.now();

  // Step 1
  const analysis = await analyzeGarments();

  // Step 2
  const frontImage = await generateFront(analysis);

  // Step 3: parallel
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
  console.log(`Output files in: ${OUTPUT_DIR}/`);
}

main().catch(err => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});

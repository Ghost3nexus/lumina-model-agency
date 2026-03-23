#!/usr/bin/env node
/**
 * Creative Visual Generator — CLI tool
 * Generates photorealistic CGI visuals from product photos using Gemini 3 Pro Image Preview.
 *
 * Usage:
 *   node test/creative-gen.mjs <image_path> [options]
 *
 * Options:
 *   --scene <id>        Specific scene only
 *   --category <cat>    Category filter (racing|surreal_city|editorial|all) default: racing
 *   --product <desc>    Product description
 *   --output <dir>      Output directory (default: test/creative-output)
 *   --model <name>      Gemini model (default: gemini-3-pro-image-preview)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Scene templates (self-contained, mirrors data/creativeScenes.ts)
// ---------------------------------------------------------------------------
const SCENES = [
  {
    id: 'shibuya-drift-side',
    name: 'Shibuya Drift — Street Level',
    category: 'racing',
    aspect: '16:9',
    promptTemplate: `Photorealistic CGI photograph: {product}, scaled up to the size of a sports car. It is drifting sideways in parallel with a black Porsche 911 GT3 through Shibuya scramble crossing in Tokyo during a bright sunny afternoon. Both sliding sideways, thick white tire smoke. Shibuya 109 and Starbucks visible. Pedestrians in shock. Street level wide angle, cinematic, 8K.`,
  },
  {
    id: 'shibuya-drift-aerial',
    name: 'Shibuya Drift — Aerial',
    category: 'racing',
    aspect: '1:1',
    promptTemplate: `Aerial drone shot straight down at Shibuya scramble crossing Tokyo, sunny day. {product}, car-sized, drifting parallel with a black Porsche 911. Long tire smoke trails across crosswalk lines. 109 building at corner. Tiny pedestrians. Photorealistic CGI.`,
  },
  {
    id: 'shibuya-drift-dynamic',
    name: 'Shibuya Drift — Action Close',
    category: 'racing',
    aspect: '16:9',
    promptTemplate: `Intense action: {product}, car-sized, tandem drift with black Porsche 911 at Shibuya crossing, bright afternoon. Side by side sideways, massive tire smoke, sole scraping asphalt with orange sparks. Shibuya buildings, blue sky. Low angle tracking shot, motion blur background. Fast and Furious. Photorealistic CGI.`,
  },
  {
    id: 'shibuya-pair-race',
    name: 'Shibuya Pair Race',
    category: 'racing',
    aspect: '16:9',
    promptTemplate: `Photorealistic CGI: Two giant {product} racing through Shibuya scramble crossing in daylight, one per lane. Black Porsche 911 behind them. Full speed, tire smoke, crosswalk lines visible. Sunny, 109 in background. Wide angle ground level. Blockbuster.`,
  },
  {
    id: 'paris-monument',
    name: 'Paris Arc de Triomphe',
    category: 'surreal_city',
    aspect: '3:4',
    promptTemplate: `Photorealistic CGI: Colossal {product} next to Arc de Triomphe, same height. Sunny afternoon, autumn Champs-Élysées, tiny cars for scale. Long shadow across roundabout. Aerial perspective. 8K.`,
  },
  {
    id: 'dubai-water',
    name: 'Dubai Creek',
    category: 'surreal_city',
    aspect: '4:3',
    promptTemplate: `Photorealistic CGI: Massive {product} floating on Dubai Creek like a ship. Wooden boats pass by. Old Dubai skyline, minarets. Seagulls. Golden hour. Waterfront shot. Hyper-realistic.`,
  },
  {
    id: 'desert-rally',
    name: 'Desert Rally',
    category: 'racing',
    aspect: '16:9',
    promptTemplate: `Photorealistic CGI: Giant {product} racing through desert dunes, massive dust clouds. Rally cars behind. Golden hour, dramatic shadows. Low angle, epic scale. Cinematic.`,
  },
  {
    id: 'concrete-minimal',
    name: 'Concrete Minimal',
    category: 'editorial',
    aspect: '3:4',
    promptTemplate: `Minimalist editorial: {product} on raw concrete. Single dramatic directional light, deep shadows. Brutalist architecture. Real-sized, close range, shallow DOF. High contrast, desaturated. Dazed/i-D editorial. Photorealistic.`,
  },
];

const DEFAULT_PRODUCT = 'A giant navy blue Vans Authentic sneaker with white bandana paisley print, white rubber sole, white laces — BEDWIN & THE HEARTBREAKERS x Vans OTW collaboration';

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    imagePath: null,
    scene: null,
    category: 'racing',
    product: DEFAULT_PRODUCT,
    output: path.join(BASE_DIR, 'test', 'creative-output'),
    model: 'gemini-3-pro-image-preview',
  };

  let i = 0;
  while (i < args.length) {
    const a = args[i];
    if (a === '--scene') { opts.scene = args[++i]; }
    else if (a === '--category') { opts.category = args[++i]; }
    else if (a === '--product') { opts.product = args[++i]; }
    else if (a === '--output') { opts.output = args[++i]; }
    else if (a === '--model') { opts.model = args[++i]; }
    else if (a === '--help' || a === '-h') { printUsage(); process.exit(0); }
    else if (!a.startsWith('--') && !opts.imagePath) { opts.imagePath = a; }
    else { console.error(`Unknown argument: ${a}`); printUsage(); process.exit(1); }
    i++;
  }

  if (!opts.imagePath) {
    console.error('Error: image_path is required.\n');
    printUsage();
    process.exit(1);
  }

  return opts;
}

function printUsage() {
  console.log(`
Usage: node test/creative-gen.mjs <image_path> [options]

Options:
  --scene <id>        Specific scene only (e.g. shibuya-drift-side)
  --category <cat>    Category filter (racing|surreal_city|editorial|all) default: racing
  --product <desc>    Product description
  --output <dir>      Output directory (default: test/creative-output)
  --model <name>      Gemini model (default: gemini-3-pro-image-preview)

Available scenes:
${SCENES.map(s => `  ${s.id.padEnd(26)} [${s.category}] ${s.aspect}  ${s.name}`).join('\n')}
`);
}

// ---------------------------------------------------------------------------
// Scene selection
// ---------------------------------------------------------------------------
function selectScenes(opts) {
  if (opts.scene) {
    const found = SCENES.find(s => s.id === opts.scene);
    if (!found) {
      console.error(`Scene not found: ${opts.scene}`);
      console.error(`Available: ${SCENES.map(s => s.id).join(', ')}`);
      process.exit(1);
    }
    return [found];
  }
  if (opts.category === 'all') return [...SCENES];
  return SCENES.filter(s => s.category === opts.category);
}

// ---------------------------------------------------------------------------
// Image loading
// ---------------------------------------------------------------------------
function loadImage(imagePath) {
  const resolved = path.isAbsolute(imagePath) ? imagePath : path.resolve(process.cwd(), imagePath);
  if (!fs.existsSync(resolved)) {
    console.error(`Image not found: ${resolved}`);
    process.exit(1);
  }
  const buffer = fs.readFileSync(resolved);
  const ext = path.extname(resolved).toLowerCase();
  const mimeMap = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
  const mimeType = mimeMap[ext] || 'image/jpeg';
  return { base64: buffer.toString('base64'), mimeType };
}

// ---------------------------------------------------------------------------
// Gemini API call
// ---------------------------------------------------------------------------
async function generateImage(scene, imageData, opts) {
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable is not set.');
    process.exit(1);
  }

  const prompt = scene.promptTemplate.replace(/\{product\}/g, opts.product);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:generateContent?key=${GEMINI_KEY}`;

  const body = {
    contents: [{
      parts: [
        { inlineData: { mimeType: imageData.mimeType, data: imageData.base64 } },
        { text: `This is a product photo. Generate a photorealistic CGI image based on this exact product:\n\n${prompt}` },
      ],
    }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`Gemini API ${resp.status}: ${errText.slice(0, 300)}`);
  }

  const data = await resp.json();

  // Extract image from response
  const candidates = data.candidates || [];
  for (const candidate of candidates) {
    const parts = candidate.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType || 'image/png',
        };
      }
    }
  }

  // No image in response — check for text feedback
  const textParts = [];
  for (const candidate of candidates) {
    for (const part of (candidate.content?.parts || [])) {
      if (part.text) textParts.push(part.text);
    }
  }
  if (textParts.length > 0) {
    throw new Error(`No image returned. Model response: ${textParts.join(' ').slice(0, 300)}`);
  }
  throw new Error('No image or text returned from Gemini API.');
}

// ---------------------------------------------------------------------------
// Save output & manifest
// ---------------------------------------------------------------------------
function saveImage(outputDir, sceneId, imageResult) {
  const ext = imageResult.mimeType === 'image/png' ? 'png' : imageResult.mimeType === 'image/webp' ? 'webp' : 'jpg';
  const filename = `${sceneId}.${ext}`;
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, Buffer.from(imageResult.base64, 'base64'));
  const stats = fs.statSync(filePath);
  return { filename, size: stats.size };
}

function updateManifest(outputDir, assets) {
  const manifestPath = path.join(outputDir, 'manifest.json');
  let manifest = { description: 'Creative visual generation output — Gemini 3 Pro', assets: [] };
  if (fs.existsSync(manifestPath)) {
    try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch { /* start fresh */ }
  }

  for (const asset of assets) {
    // Remove existing entry for same file to avoid duplicates
    manifest.assets = manifest.assets.filter(a => a.file !== asset.file);
    manifest.assets.push(asset);
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const opts = parseArgs();
  const scenes = selectScenes(opts);

  console.log('=== Creative Visual Generator ===');
  console.log(`Image:    ${opts.imagePath}`);
  console.log(`Model:    ${opts.model}`);
  console.log(`Category: ${opts.category}`);
  console.log(`Scenes:   ${scenes.length} (${scenes.map(s => s.id).join(', ')})`);
  console.log(`Output:   ${opts.output}`);
  console.log(`Product:  ${opts.product.slice(0, 80)}${opts.product.length > 80 ? '...' : ''}`);
  console.log('');

  // Load source image
  const imageData = loadImage(opts.imagePath);
  console.log(`Source image loaded: ${imageData.mimeType}, ${formatSize(Buffer.from(imageData.base64, 'base64').length)}`);

  // Ensure output directory exists
  fs.mkdirSync(opts.output, { recursive: true });

  const manifestAssets = [];
  const results = { success: 0, failed: 0, total: scenes.length };
  const startAll = Date.now();

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const idx = `[${i + 1}/${scenes.length}]`;
    console.log(`\n${idx} ${scene.id} (${scene.name}) — ${scene.aspect}`);

    const start = Date.now();
    try {
      const imageResult = await generateImage(scene, imageData, opts);
      const { filename, size } = saveImage(opts.output, scene.id, imageResult);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);

      console.log(`  -> ${filename} (${formatSize(size)}) in ${elapsed}s`);
      results.success++;

      manifestAssets.push({
        file: filename,
        size: formatSize(size),
        purpose: `Creative visual: ${scene.name}`,
        prompt: scene.promptTemplate.replace(/\{product\}/g, opts.product).slice(0, 200) + '...',
        tool: `Gemini ${opts.model}`,
        created: new Date().toISOString().slice(0, 10),
        used_in: 'BEDWIN x Vans creative campaign',
        scene_id: scene.id,
        aspect: scene.aspect,
        category: scene.category,
      });
    } catch (err) {
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.error(`  !! FAILED (${elapsed}s): ${err.message}`);
      results.failed++;
    }
  }

  // Write manifest
  if (manifestAssets.length > 0) {
    updateManifest(opts.output, manifestAssets);
    console.log(`\nManifest updated: ${path.join(opts.output, 'manifest.json')}`);
  }

  // Summary
  const totalElapsed = ((Date.now() - startAll) / 1000).toFixed(1);
  console.log('\n=== Summary ===');
  console.log(`Total: ${results.total} | Success: ${results.success} | Failed: ${results.failed} | Time: ${totalElapsed}s`);
  console.log(`Output: ${opts.output}`);

  if (results.failed > 0) process.exit(1);
}

main().catch(err => {
  console.error(`Fatal error: ${err.message}`);
  process.exit(1);
});

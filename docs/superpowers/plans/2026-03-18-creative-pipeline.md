# Creative Pipeline — 商品画像→クリエイティブビジュアル生成

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 商品画像を入力として、Gemini 3 Pro Image Previewで「Shoes in Unlikely Places」スタイルのクリエイティブビジュアルを生成するCLIツール + 将来的にUI統合可能なサービス層を構築する。

**Architecture:**
- `services/creativeService.ts` — Gemini 3 Pro Image呼び出しのコアロジック（参照画像 + プロンプト → 生成画像）
- `api/creative.ts` — Vercel Functionプロキシ（APIキー保護）
- `test/creative-gen.mjs` — CLIツール（商品画像パス + シーンテンプレート → 出力）
- シーンテンプレートは `data/creativeScenes.ts` に定義し、拡張可能にする

**Tech Stack:** Gemini 3 Pro Image Preview API, Vercel Functions, Node.js

---

## File Structure

| ファイル | 役割 | 新規/既存 |
|---------|------|----------|
| `api/creative.ts` | Geminiプロキシ（APIキー保護） | 新規 |
| `services/creativeService.ts` | クリエイティブ生成コアロジック | 新規 |
| `data/creativeScenes.ts` | シーンテンプレート定義 | 新規 |
| `test/creative-gen.mjs` | CLIツール（本体） | 新規 |
| `test/creative-output/manifest.json` | 生成物トラッキング | 更新 |

---

## Task 1: APIプロキシ `api/creative.ts`

**Files:**
- Create: `api/creative.ts`

既存の `api/generate.ts`（Gemini汎用プロキシ）はSDK経由のリクエストを転送する設計。クリエイティブ生成は参照画像付きの直接API呼び出しなので、専用エンドポイントを作る。

- [ ] **Step 1: `api/creative.ts` を作成**

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const MODEL = 'gemini-3-pro-image-preview';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export const config = { maxDuration: 60 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!GEMINI_KEY) return res.status(503).json({ error: 'GEMINI_API_KEY missing' });

  const { prompt, referenceImageBase64, referenceImageMimeType } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  try {
    const parts: any[] = [];

    // 参照画像があれば送信
    if (referenceImageBase64) {
      const base64Data = referenceImageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: referenceImageMimeType || 'image/png',
          data: base64Data,
        },
      });
    }

    parts.push({ text: prompt });

    const body = {
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    };

    const r = await fetch(`${API_URL}?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: `Gemini ${r.status}: ${t.slice(0, 300)}` });
    }

    const data = await r.json();

    // 画像とテキストを抽出
    const results: { type: string; data?: string; mimeType?: string; text?: string }[] = [];
    for (const candidate of data.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          results.push({
            type: 'image',
            data: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
          });
        }
        if (part.text) {
          results.push({ type: 'text', text: part.text });
        }
      }
    }

    return res.json({ ok: true, results });
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message.slice(0, 200) });
  }
}
```

- [ ] **Step 2: ローカルでビルド確認**

Run: `npx tsc api/creative.ts --noEmit --esModuleInterop --moduleResolution node`
Expected: エラーなし

- [ ] **Step 3: Commit**

```bash
git add api/creative.ts
git commit -m "feat: add creative generation API proxy for Gemini 3 Pro Image"
```

---

## Task 2: シーンテンプレート `data/creativeScenes.ts`

**Files:**
- Create: `data/creativeScenes.ts`

シーンテンプレートは「シーンの世界観」を定義し、商品情報を動的に埋め込む設計。
新しいシーンの追加は配列に1エントリ追加するだけ。

- [ ] **Step 1: シーンテンプレート定義**

```typescript
export interface CreativeScene {
  id: string;
  name: string;
  nameJa: string;
  category: 'racing' | 'surreal_city' | 'nature' | 'editorial' | 'abstract';
  /** {product} はビルド時に商品説明で置換される */
  promptTemplate: string;
  aspect: '16:9' | '9:16' | '1:1' | '3:4' | '4:3';
  tags: string[];
}

export const CREATIVE_SCENES: CreativeScene[] = [
  // ── Racing ──
  {
    id: 'shibuya-drift-side',
    name: 'Shibuya Drift — Street Level',
    nameJa: '渋谷ドリフト（横から）',
    category: 'racing',
    promptTemplate: `Photorealistic CGI photograph: {product}, scaled up to the size of a sports car. It is drifting sideways in parallel with a black Porsche 911 GT3 through Shibuya scramble crossing in Tokyo during a bright sunny afternoon. Both are sliding sideways at high speed, thick white tire smoke billowing behind them. The Shibuya 109 building and Starbucks visible in background. Pedestrians watch in shock. Crosswalk lines visible. Street level wide angle, dramatic action photography, cinematic, 8K.`,
    aspect: '16:9',
    tags: ['racing', 'shibuya', 'porsche', 'drift'],
  },
  {
    id: 'shibuya-drift-aerial',
    name: 'Shibuya Drift — Aerial',
    nameJa: '渋谷ドリフト（俯瞰）',
    category: 'racing',
    promptTemplate: `Aerial drone photograph looking straight down at Shibuya scramble crossing Tokyo, sunny day. {product}, scaled to car-size, drifting in parallel with a black Porsche 911 through the intersection. Long curved tire smoke trails across the white crosswalk lines. Shibuya 109 building visible at corner. Tiny pedestrians scatter. Bright daylight, short shadows. Photorealistic CGI, overhead shot.`,
    aspect: '1:1',
    tags: ['racing', 'shibuya', 'aerial', 'drift'],
  },
  {
    id: 'shibuya-drift-dynamic',
    name: 'Shibuya Drift — Action Close',
    nameJa: '渋谷ドリフト（アクション）',
    category: 'racing',
    promptTemplate: `Intense action shot at Shibuya scramble crossing, Tokyo, bright afternoon sunlight. {product}, car-sized, in a tandem drift with a black Porsche 911. Side by side, both completely sideways, massive tire smoke, the product's sole scraping asphalt with orange sparks. Shibuya buildings with Japanese signage, blue sky. Low angle tracking shot, motion blur on background, subjects sharp. Fast and Furious energy in broad daylight. Photorealistic CGI.`,
    aspect: '16:9',
    tags: ['racing', 'shibuya', 'action', 'sparks'],
  },
  {
    id: 'shibuya-pair-race',
    name: 'Shibuya Pair Race',
    nameJa: '渋谷ペアレース',
    category: 'racing',
    promptTemplate: `Photorealistic CGI: Two giant {product} racing through Shibuya scramble crossing in daylight, one in each lane, like two race cars. A black Porsche 911 trails behind them. All at full speed, tire smoke everywhere, crosswalk lines beneath. Sunny day, Shibuya 109 in background. Epic wide angle from ground level. Cinematic blockbuster feel.`,
    aspect: '16:9',
    tags: ['racing', 'shibuya', 'pair'],
  },

  // ── Surreal City ──
  {
    id: 'paris-monument',
    name: 'Paris Arc de Triomphe',
    nameJa: 'パリ凱旋門',
    category: 'surreal_city',
    promptTemplate: `Photorealistic CGI: A colossal {product} placed next to the Arc de Triomphe in Paris, same height as the monument. Sunny afternoon, autumn trees along Champs-Élysées, tiny cars and people for scale. The product casts a long shadow across the roundabout. Aerial perspective from above. 8K detail.`,
    aspect: '3:4',
    tags: ['surreal', 'paris', 'landmark', 'giant'],
  },
  {
    id: 'dubai-water',
    name: 'Dubai Creek',
    nameJa: 'ドバイ・クリーク',
    category: 'surreal_city',
    promptTemplate: `Photorealistic CGI: A massive {product} floating on Dubai Creek like a cargo ship, water rippling around it. Traditional wooden boats pass by. Old Dubai skyline with minarets in background. Seagulls flying. Warm golden hour light. Shot from the waterfront. Hyper-realistic.`,
    aspect: '4:3',
    tags: ['surreal', 'dubai', 'water', 'giant'],
  },
  {
    id: 'desert-rally',
    name: 'Desert Rally',
    nameJa: '砂漠ラリー',
    category: 'racing',
    promptTemplate: `Photorealistic CGI: A giant {product} racing through desert sand dunes, kicking up massive dust clouds. Rally cars chase behind it. Golden hour sunlight, dramatic long shadows on the sand. Low angle shot, epic scale. Cinematic warm color grading.`,
    aspect: '16:9',
    tags: ['racing', 'desert', 'rally', 'giant'],
  },

  // ── Editorial / Minimal ──
  {
    id: 'concrete-minimal',
    name: 'Concrete Minimal',
    nameJa: 'コンクリートミニマル',
    category: 'editorial',
    promptTemplate: `Minimalist editorial photograph: {product} centered on raw concrete surface. Single dramatic directional light from upper left creating deep shadows. Brutalist architecture background, clean lines. The product is real-sized, shot at close range with shallow depth of field. High contrast, desaturated tones. Fashion editorial for Dazed or i-D magazine. Photorealistic.`,
    aspect: '3:4',
    tags: ['editorial', 'minimal', 'concrete'],
  },
];

/**
 * Build a complete prompt by injecting product description into a scene template.
 */
export function buildCreativePrompt(scene: CreativeScene, productDescription: string): string {
  return scene.promptTemplate.replace(/\{product\}/g, productDescription);
}

/**
 * Get scenes by category.
 */
export function getScenesByCategory(category: CreativeScene['category']): CreativeScene[] {
  return CREATIVE_SCENES.filter(s => s.category === category);
}

/**
 * Get scene by ID.
 */
export function getSceneById(id: string): CreativeScene | undefined {
  return CREATIVE_SCENES.find(s => s.id === id);
}
```

- [ ] **Step 2: Commit**

```bash
git add data/creativeScenes.ts
git commit -m "feat: add creative scene templates with racing/surreal/editorial presets"
```

---

## Task 3: クリエイティブ生成サービス `services/creativeService.ts`

**Files:**
- Create: `services/creativeService.ts`

ブラウザ側からもCLIからも使える共通ロジック。
ブラウザからは `/api/creative` プロキシ経由、CLIからは直接Gemini API呼び出し。

- [ ] **Step 1: サービス作成**

```typescript
/**
 * Creative Image Generation Service
 *
 * Generates surrealist / editorial / campaign visuals from product photos.
 * Uses Gemini 3 Pro Image Preview for maximum creative freedom.
 *
 * Usage:
 *   Browser: calls /api/creative proxy (API key protected)
 *   CLI:     calls Gemini API directly with GEMINI_API_KEY env var
 */

import { buildCreativePrompt, type CreativeScene } from '../data/creativeScenes';

export interface CreativeInput {
  /** 商品画像 base64 (data:image/...;base64,...) */
  productImageBase64: string;
  /** 商品の説明（プロンプトの {product} に埋め込まれる） */
  productDescription: string;
  /** シーンテンプレート */
  scene: CreativeScene;
}

export interface CreativeResult {
  imageBase64: string;
  mimeType: string;
  prompt: string;
  durationMs: number;
  model: string;
}

/**
 * Generate a creative visual via Vercel proxy (browser use).
 */
export async function generateCreative(input: CreativeInput): Promise<CreativeResult> {
  const prompt = buildCreativePrompt(input.scene, input.productDescription);
  const start = Date.now();

  const resp = await fetch('/api/creative', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: `This is a product photo. Generate a photorealistic CGI image based on this exact product design:\n\n${prompt}`,
      referenceImageBase64: input.productImageBase64,
      referenceImageMimeType: 'image/png',
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Creative API ${resp.status}: ${t.slice(0, 200)}`);
  }

  const data = await resp.json();
  if (!data.ok) throw new Error(`Creative API error: ${JSON.stringify(data).slice(0, 200)}`);

  const imageResult = data.results.find((r: any) => r.type === 'image');
  if (!imageResult) throw new Error('No image in response');

  return {
    imageBase64: imageResult.data,
    mimeType: imageResult.mimeType,
    prompt,
    durationMs: Date.now() - start,
    model: 'gemini-3-pro-image-preview',
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add services/creativeService.ts
git commit -m "feat: add creative generation service with Gemini 3 Pro Image"
```

---

## Task 4: CLIツール `test/creative-gen.mjs`

**Files:**
- Create: `test/creative-gen.mjs`

実際に使うメインツール。コマンドラインから商品画像 + シーン指定で生成。

- [ ] **Step 1: CLIツール作成**

```javascript
#!/usr/bin/env node
/**
 * Creative Visual Generator CLI
 *
 * Usage:
 *   node test/creative-gen.mjs <image_path> [options]
 *
 * Options:
 *   --scene <id>        特定シーンのみ (default: all racing)
 *   --category <cat>    カテゴリ指定 (racing|surreal_city|editorial|all)
 *   --product <desc>    商品説明 (default: 画像から自動推定)
 *   --output <dir>      出力先 (default: test/creative-output)
 *   --model <name>      モデル (default: gemini-3-pro-image-preview)
 *
 * Examples:
 *   node test/creative-gen.mjs ~/Downloads/0069_B_enhanced.png
 *   node test/creative-gen.mjs ~/Downloads/0069_B_enhanced.png --scene shibuya-drift-aerial
 *   node test/creative-gen.mjs ~/Downloads/belt.jpg --category surreal_city --product "black leather studded belt with turquoise gems"
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Scene templates (inline to keep CLI self-contained) ──
const SCENES = {
  'shibuya-drift-side': {
    name: '渋谷ドリフト（横から）',
    category: 'racing',
    aspect: '16:9',
    prompt: `Photorealistic CGI photograph: {product}, scaled up to the size of a sports car. It is drifting sideways in parallel with a black Porsche 911 GT3 through Shibuya scramble crossing in Tokyo during a bright sunny afternoon. Both sliding sideways, thick white tire smoke. Shibuya 109 and Starbucks visible. Pedestrians in shock. Street level wide angle, cinematic, 8K.`,
  },
  'shibuya-drift-aerial': {
    name: '渋谷ドリフト（俯瞰）',
    category: 'racing',
    aspect: '1:1',
    prompt: `Aerial drone shot straight down at Shibuya scramble crossing Tokyo, sunny day. {product}, car-sized, drifting parallel with a black Porsche 911. Long tire smoke trails across crosswalk lines. 109 building at corner. Tiny pedestrians. Photorealistic CGI.`,
  },
  'shibuya-drift-dynamic': {
    name: '渋谷ドリフト（アクション）',
    category: 'racing',
    aspect: '16:9',
    prompt: `Intense action: {product}, car-sized, tandem drift with black Porsche 911 at Shibuya crossing, bright afternoon. Side by side sideways, massive tire smoke, sole scraping asphalt with orange sparks. Shibuya buildings, blue sky. Low angle tracking shot, motion blur background. Fast and Furious. Photorealistic CGI.`,
  },
  'shibuya-pair-race': {
    name: '渋谷ペアレース',
    category: 'racing',
    aspect: '16:9',
    prompt: `Photorealistic CGI: Two giant {product} racing through Shibuya scramble crossing in daylight, one per lane. Black Porsche 911 behind them. Full speed, tire smoke, crosswalk lines visible. Sunny, 109 in background. Wide angle ground level. Blockbuster.`,
  },
  'paris-monument': {
    name: 'パリ凱旋門',
    category: 'surreal_city',
    aspect: '3:4',
    prompt: `Photorealistic CGI: Colossal {product} next to Arc de Triomphe, same height. Sunny afternoon, autumn Champs-Élysées, tiny cars for scale. Long shadow across roundabout. Aerial perspective. 8K.`,
  },
  'dubai-water': {
    name: 'ドバイ・クリーク',
    category: 'surreal_city',
    aspect: '4:3',
    prompt: `Photorealistic CGI: Massive {product} floating on Dubai Creek like a ship. Wooden boats pass by. Old Dubai skyline, minarets. Seagulls. Golden hour. Waterfront shot. Hyper-realistic.`,
  },
  'desert-rally': {
    name: '砂漠ラリー',
    category: 'racing',
    aspect: '16:9',
    prompt: `Photorealistic CGI: Giant {product} racing through desert dunes, massive dust clouds. Rally cars behind. Golden hour, dramatic shadows. Low angle, epic scale. Cinematic.`,
  },
  'concrete-minimal': {
    name: 'コンクリートミニマル',
    category: 'editorial',
    aspect: '3:4',
    prompt: `Minimalist editorial: {product} on raw concrete. Single dramatic directional light, deep shadows. Brutalist architecture. Real-sized, close range, shallow DOF. High contrast, desaturated. Dazed/i-D editorial. Photorealistic.`,
  },
};

// ── Args ──
const args = process.argv.slice(2);
const imagePath = args.find(a => !a.startsWith('--'));
if (!imagePath) {
  console.error('Usage: node test/creative-gen.mjs <image_path> [--scene id] [--category cat] [--product desc]');
  process.exit(1);
}

function getArg(name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : null;
}

const sceneId = getArg('scene');
const category = getArg('category') || 'racing';
const productDesc = getArg('product') || 'A giant navy blue Vans Authentic sneaker with white bandana paisley print, white rubber sole, white laces — BEDWIN & THE HEARTBREAKERS x Vans OTW collaboration';
const outputDir = getArg('output') || path.join(__dirname, 'creative-output');
const modelName = getArg('model') || 'gemini-3-pro-image-preview';

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1); }

// ── Select scenes ──
let selectedScenes;
if (sceneId) {
  if (!SCENES[sceneId]) { console.error(`Unknown scene: ${sceneId}. Available: ${Object.keys(SCENES).join(', ')}`); process.exit(1); }
  selectedScenes = { [sceneId]: SCENES[sceneId] };
} else if (category === 'all') {
  selectedScenes = SCENES;
} else {
  selectedScenes = Object.fromEntries(Object.entries(SCENES).filter(([, s]) => s.category === category));
}

// ── Generate ──
async function generate(id, scene) {
  const prompt = scene.prompt.replace(/\{product\}/g, productDesc);
  const imageData = fs.readFileSync(path.resolve(imagePath));
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
  const base64Image = imageData.toString('base64');

  console.log(`\n[${id}] ${scene.name}`);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_KEY}`;
  const body = {
    contents: [{
      parts: [
        { inlineData: { mimeType, data: base64Image } },
        { text: `This is a product photo. Generate a photorealistic CGI image based on this exact product:\n\n${prompt}` },
      ],
    }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
  };

  const start = Date.now();
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    console.error(`  ✗ ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
    return null;
  }

  const data = await resp.json();
  const elapsed = ((Date.now() - start) / 1000).toFixed(0);

  for (const candidate of (data.candidates || [])) {
    for (const part of (candidate.content?.parts || [])) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        const buf = Buffer.from(part.inlineData.data, 'base64');
        const outExt = part.inlineData.mimeType === 'image/png' ? 'png' : 'jpg';
        const outPath = path.join(outputDir, `${id}.${outExt}`);
        fs.writeFileSync(outPath, buf);
        console.log(`  ✓ ${elapsed}s, ${(buf.length / 1024).toFixed(0)}KB → ${path.basename(outPath)}`);
        return { id, path: outPath, prompt, elapsed };
      }
    }
  }

  console.error(`  ✗ No image in response (${elapsed}s)`);
  return null;
}

async function main() {
  const sceneCount = Object.keys(selectedScenes).length;
  console.log(`=== Creative Generator ===`);
  console.log(`Image: ${path.basename(imagePath)}`);
  console.log(`Model: ${modelName}`);
  console.log(`Scenes: ${sceneCount} (${category})`);
  console.log(`Product: ${productDesc.slice(0, 60)}...`);
  console.log(`Output: ${outputDir}\n`);

  fs.mkdirSync(outputDir, { recursive: true });

  const results = [];
  for (const [id, scene] of Object.entries(selectedScenes)) {
    const r = await generate(id, scene);
    if (r) results.push(r);
  }

  // Manifest
  const manifest = {
    description: 'Creative campaign visuals',
    source_image: path.resolve(imagePath),
    product: productDesc,
    tool: `Gemini ${modelName}`,
    created: new Date().toISOString().split('T')[0],
    assets: results.map(r => ({
      file: path.basename(r.path),
      scene: r.id,
      prompt: r.prompt,
      tool: modelName,
      duration: r.elapsed + 's',
    })),
  };
  fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`\n=== Done: ${results.length}/${sceneCount} ===`);
  console.log(`Output: ${outputDir}`);
}

main().catch(e => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: テスト実行 — Vansで全racingシーン生成**

```bash
export $(grep GEMINI_API_KEY .env.local | tr -d '"')
node test/creative-gen.mjs ~/Downloads/0069_B_enhanced.png
```

Expected: `test/creative-output/` に4-5枚のracingシーン画像

- [ ] **Step 3: テスト実行 — 特定シーン指定**

```bash
node test/creative-gen.mjs ~/Downloads/0069_B_enhanced.png --scene paris-monument --category surreal_city
```

Expected: `paris-monument.jpg` が生成される

- [ ] **Step 4: テスト実行 — BEDWIN ベルトで全カテゴリ**

```bash
node test/creative-gen.mjs training/bedwin-htc/01-cartier-burgundy.jpg --category all --product "black leather studded belt with gold pyramid studs and turquoise gemstones — BEDWIN x HTC collaboration"
```

Expected: 8シーン全部生成

- [ ] **Step 5: Commit**

```bash
git add test/creative-gen.mjs
git commit -m "feat: add creative visual generator CLI with scene templates"
```

---

## Task 5: 動作確認 + manifest更新

- [ ] **Step 1: 全ファイルのビルド確認**

```bash
npx tsc --noEmit
```

- [ ] **Step 2: Finderで出力を目視確認**

```bash
open test/creative-output/
```

- [ ] **Step 3: manifest.jsonの内容確認**

`test/creative-output/manifest.json` が正しくアセットを記録していることを確認。

- [ ] **Step 4: 最終Commit**

```bash
git add api/creative.ts services/creativeService.ts data/creativeScenes.ts test/creative-gen.mjs
git commit -m "feat: complete creative pipeline — Gemini 3 Pro Image + scene templates + CLI"
```

---

## 今後の拡張（この計画には含めない）

- UI統合: `NewGenerationPage.tsx` にクリエイティブモード追加
- 動画化: ベストカットをKling/Runwayで動画に変換
- シーン追加: ユーザーがカスタムシーンを定義可能に
- バッチ処理: 複数商品 × 複数シーンの一括生成
- アップスケール: Real-ESRGAN統合

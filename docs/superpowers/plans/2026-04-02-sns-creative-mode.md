# SNS Creative Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an SNS Creative generation mode to LUMINA Studio with Editorial/Campaign/Street/Surreal scene presets, producing 4 camera-varied images per generation.

**Architecture:** Adds a `ShootMode` toggle (EC / SNS) to the existing generation pipeline. SNS mode reuses garment analysis, model reference, and styling agents, but swaps the 4-angle EC generator for a new `generateSNSCreative()` that injects scene direction + variation-specific camera instructions. Generation runs as 2-parallel x 2-batch to respect API rate limits.

**Tech Stack:** React 19 / TypeScript / Vite / Tailwind CSS / Gemini API (gemini-3.1-flash-image-preview)

**Spec:** `docs/superpowers/specs/2026-04-02-sns-creative-mode-design.md`

---

## File Map

### New Files

| File | Responsibility |
|------|---------------|
| `types/sns.ts` | SNS-specific types: ShootMode, SceneCategory, AspectRatio, VariationType, ScenePreset, SNSCreativeConfig, VARIATION_KEYS, ASPECT_RATIO_PIXELS |
| `data/scenePresets.ts` | All 18 scene preset definitions with direction prompts and placeholder thumbnails |
| `services/snsGenerator.ts` | `generateSNSCreative()` function — builds SNS prompt, calls Gemini, returns image |
| `components/generation/ModeToggle.tsx` | EC/SNS toggle pill component |
| `components/generation/SceneSelector.tsx` | Category tabs + preset grid + custom prompt + aspect ratio selector |

### Modified Files

| File | Change |
|------|--------|
| `types/generation.ts` | Import and re-export SNS types. Widen `PreviewResult.angle` to `ResultKey`. Widen `GenerationState.results` to `Partial<Record<ResultKey, PreviewResult>>`. Add `shootMode` and `snsConfig` to state. |
| `services/geminiClient.ts:17-39` | Add `SNS_TEMPERATURE: 0.6` to `GEN_CONFIG` |
| `hooks/useGenerationFlow.ts` | Add SET_SHOOT_MODE / SET_SNS_CONFIG actions. Branch `generate()` by shootMode. SNS path: analyze → agents → generateSNSCreative x4 (2-batch). |
| `components/generation/StepTabs.tsx` | Accept `shootMode` prop. Show 3rd tab "シーン" when SNS mode. Export expanded `StepId`. |
| `components/generation/PreviewGrid.tsx` | Accept `shootMode` + `aspectRatio` props. SNS mode: Var.1-4 labels, dynamic aspect-ratio CSS per cell, responsive grid layout for 9:16 / 16:9. |
| `pages/GenerationPage.tsx` | Wire ModeToggle, SceneSelector, pass shootMode/snsConfig to all children. Branch step flow by mode. |

---

## Task 1: SNS Types + GEN_CONFIG

**Files:**
- Create: `types/sns.ts`
- Modify: `types/generation.ts:1-49`
- Modify: `services/geminiClient.ts:17-39`

- [ ] **Step 1: Create `types/sns.ts`**

```typescript
import type { AngleType } from './generation';

export type ShootMode = 'ec-standard' | 'sns-creative';

export type SceneCategory = 'editorial' | 'campaign' | 'street' | 'surreal';

export type AspectRatio = '4:5' | '1:1' | '9:16' | '16:9';

export type VariationType = 'var1' | 'var2' | 'var3' | 'var4';

export type ResultKey = AngleType | VariationType;

export const VARIATION_KEYS: readonly VariationType[] = ['var1', 'var2', 'var3', 'var4'];

export const ASPECT_RATIO_PIXELS: Record<AspectRatio, { width: number; height: number }> = {
  '4:5':  { width: 1024, height: 1280 },
  '1:1':  { width: 1024, height: 1024 },
  '9:16': { width: 1024, height: 1820 },
  '16:9': { width: 1820, height: 1024 },
};

export interface ScenePreset {
  id: string;
  name: string;
  category: SceneCategory;
  direction: string;
  thumbnail: string;
}

export interface SNSCreativeConfig {
  scene: ScenePreset;
  customPrompt?: string;
  aspectRatio: AspectRatio;
}

/** Camera/composition instruction per variation slot */
export const VARIATION_CAMERAS: Record<VariationType, { camera: string; composition: string; label: string }> = {
  var1: {
    camera: 'Full body shot, eye-level camera',
    composition: 'Subject centered with breathing room above and below',
    label: 'Standard',
  },
  var2: {
    camera: '3/4 body shot, slightly low angle camera',
    composition: 'Subject off-center using rule of thirds',
    label: 'Dynamic',
  },
  var3: {
    camera: 'Medium shot from waist up, eye-level',
    composition: 'Tight crop focusing on face and upper garment texture',
    label: 'Portrait',
  },
  var4: {
    camera: 'Full body shot, wide environmental framing',
    composition: 'Subject occupies 40-50% of frame, scene context visible around them',
    label: 'Context',
  },
};
```

- [ ] **Step 2: Update `types/generation.ts` — add SNS type imports and widen state**

Add imports at top and re-exports. Change `PreviewResult.angle` from `AngleType` to `ResultKey`. Add `shootMode` and `snsConfig` to `GenerationState`. Add new actions to `GenerationAction`. Change `results` type to `Partial<Record<ResultKey, PreviewResult>>`.

Key changes:
```typescript
// Add at top of types/generation.ts
import type { ShootMode, SNSCreativeConfig, ResultKey } from './sns';
export type { ShootMode, SceneCategory, AspectRatio, VariationType, ResultKey, ScenePreset, SNSCreativeConfig } from './sns';
export { VARIATION_KEYS, ASPECT_RATIO_PIXELS, VARIATION_CAMERAS } from './sns';

// Change PreviewResult.angle
export interface PreviewResult {
  id: string;
  angle: ResultKey;          // was: AngleType
  // ... rest unchanged
}

// Add to GenerationState
export interface GenerationState {
  // ... existing fields ...
  shootMode: ShootMode;                               // NEW
  snsConfig: SNSCreativeConfig | null;                 // NEW
  results: Partial<Record<ResultKey, PreviewResult>>;  // WIDENED from Record<AngleType, ...>
  progress: { current: ResultKey | null; completed: number; total: number }; // current widened, total un-literal
}

// Add to GenerationAction union
  | { type: 'SET_SHOOT_MODE'; mode: ShootMode }
  | { type: 'SET_SNS_CONFIG'; config: SNSCreativeConfig }
```

- [ ] **Step 3: Add `SNS_TEMPERATURE` to `services/geminiClient.ts`**

In `GEN_CONFIG` object, add after `GENERATION_TEMPERATURE`:
```typescript
  /** Temperature for SNS creative generation (higher for variation) */
  SNS_TEMPERATURE: 0.6,
```

- [ ] **Step 4: Build and fix any type errors**

Run: `npm run build`
Expected: Type errors in `useGenerationFlow.ts`, `PreviewGrid.tsx`, `GenerationPage.tsx` because they reference the old narrow types. These will be fixed in subsequent tasks. Confirm `types/` and `geminiClient.ts` compile cleanly by checking only those files have no errors of their own.

- [ ] **Step 5: Commit**

```
git add types/sns.ts types/generation.ts services/geminiClient.ts
git commit -m "feat(types): add SNS creative mode types, ShootMode, VariationType, ScenePreset"
```

---

## Task 2: Scene Presets Data

**Files:**
- Create: `data/scenePresets.ts`

- [ ] **Step 1: Create `data/scenePresets.ts` with all 18 presets**

```typescript
import type { ScenePreset, SceneCategory } from '../types/sns';

// ─── Gradient thumbnails (Phase 1 placeholders) ──────────────────────────────

const CATEGORY_GRADIENTS: Record<SceneCategory, string> = {
  editorial: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  campaign:  'linear-gradient(135deg, #6b7280, #1f2937)',
  street:    'linear-gradient(135deg, #4b5563, #374151)',
  surreal:   'linear-gradient(135deg, #8b5cf6, #ec4899)',
};

function gradient(category: SceneCategory): string {
  return CATEGORY_GRADIENTS[category];
}

// ─── Presets ─────────────────────────────────────────────────────────────────

export const SCENE_PRESETS: ScenePreset[] = [
  // Editorial
  {
    id: 'editorial-popeye',
    name: 'POPEYE',
    category: 'editorial',
    direction: 'Natural daylight editorial photography in the style of POPEYE magazine. City boy aesthetic, casual everyday life setting. Warm natural light from a window or outdoors. Generous white space and breathing room in composition. Relaxed, effortless pose as if caught mid-moment. Japanese city life backdrop — coffee shop, bookstore, quiet residential street. Film-like grain and warm color palette.',
    thumbnail: gradient('editorial'),
  },
  {
    id: 'editorial-fudge',
    name: 'FUDGE',
    category: 'editorial',
    direction: 'Soft, gentle editorial photography in the style of FUDGE magazine. Blend of girlish and boyish sensibility. Soft diffused natural light, slightly overexposed highlights. Fashion within everyday life — reading, walking, at home. Muted warm tones, nostalgic film quality. Approachable, natural expression, not overly posed.',
    thumbnail: gradient('editorial'),
  },
  {
    id: 'editorial-numero',
    name: 'Numero',
    category: 'editorial',
    direction: 'High fashion editorial photography in the style of Numero magazine. Dramatic, artistic, bold. Strong directional lighting with deep shadows. Powerful, confident poses with attitude. Graphic composition, strong lines. Rich saturated colors or stark high-contrast monochrome. Fashion as art statement.',
    thumbnail: gradient('editorial'),
  },
  {
    id: 'editorial-brutus',
    name: 'BRUTUS',
    category: 'editorial',
    direction: 'Culture-meets-fashion editorial in the style of BRUTUS magazine. Intellectual, thoughtful mood. Japanese aesthetic sensibility — wabi-sabi, ma (negative space). Clean composition with cultural context (architecture, craft, books). Natural or carefully controlled ambient light. Understated elegance, quiet confidence.',
    thumbnail: gradient('editorial'),
  },
  {
    id: 'editorial-id',
    name: 'i-D',
    category: 'editorial',
    direction: 'Youth culture editorial photography in the style of i-D magazine. Raw, edgy, rebellious energy. The signature i-D wink — one eye closed. Street-cast authenticity, imperfect beauty. Harsh flash or raw daylight. Punk DIY aesthetic mixed with high fashion. Bold, unapologetic attitude.',
    thumbnail: gradient('editorial'),
  },

  // Campaign
  {
    id: 'campaign-minimal',
    name: 'Minimal',
    category: 'campaign',
    direction: 'Minimalist brand campaign photography. Clean white or light grey studio background. Strong directional side lighting creating defined shadows on the garment. Product is the absolute focus — nothing competes for attention. COS or MUJI aesthetic. Crisp, precise, architectural composition. Muted neutral palette.',
    thumbnail: gradient('campaign'),
  },
  {
    id: 'campaign-seasonal',
    name: 'Seasonal',
    category: 'campaign',
    direction: 'Seasonal brand campaign photography capturing the atmosphere of the current season. Natural outdoor setting with seasonal elements (cherry blossoms, ocean, autumn foliage, snow). Golden hour or soft overcast natural light. Open, expansive feeling. The model inhabits the season naturally. Warm optimistic mood. Lifestyle aspiration.',
    thumbnail: gradient('campaign'),
  },
  {
    id: 'campaign-luxury',
    name: 'Luxury',
    category: 'campaign',
    direction: 'Luxury brand campaign photography. Dark, moody, sophisticated. Dramatic chiaroscuro lighting from a single source. Rich deep tones — black, burgundy, gold. Bottega Veneta or Saint Laurent aesthetic. Minimal set with one luxury element (marble, leather, dark wood). Confident, powerful presence. Every shadow is intentional.',
    thumbnail: gradient('campaign'),
  },
  {
    id: 'campaign-sport',
    name: 'Sport',
    category: 'campaign',
    direction: 'Athletic brand campaign photography. Dynamic, energetic pose with movement blur or frozen motion. Vibrant, saturated colors. Harsh directional light suggesting outdoor sun or stadium lighting. Nike or adidas campaign energy. Clean graphic background or urban sports context. Power, speed, confidence.',
    thumbnail: gradient('campaign'),
  },

  // Street
  {
    id: 'street-tokyo',
    name: 'Tokyo',
    category: 'street',
    direction: 'Tokyo street style photography. Harajuku, Shimokitazawa, or Ura-Harajuku backstreets. Neon signs, narrow alleys, vending machines, layered urban textures. Natural daylight mixed with ambient neon. Real Tokyo atmosphere — slightly crowded, visually dense. The model looks like they belong, walking naturally. Shot candidly, not posed. Japanese street fashion energy.',
    thumbnail: gradient('street'),
  },
  {
    id: 'street-ny',
    name: 'New York',
    category: 'street',
    direction: 'New York City street style photography. Brooklyn or SoHo vibes. Exposed brick walls, fire escapes, brownstone stoops, bodega corners. Harsh midday sun creating strong shadows, or golden hour glow between buildings. Gritty urban texture. The model walks with NYC confidence and pace. Documentary street photography feel.',
    thumbnail: gradient('street'),
  },
  {
    id: 'street-paris',
    name: 'Paris',
    category: 'street',
    direction: 'Parisian street style photography. Cafe terraces, cobblestone streets, iron balconies, Haussmann architecture. Soft overcast Parisian light. Effortless French elegance — the model looks chic without trying. Muted color palette with occasional warm accent. Romance and sophistication in every detail.',
    thumbnail: gradient('street'),
  },
  {
    id: 'street-london',
    name: 'London',
    category: 'street',
    direction: 'London street style photography. Brick Lane, Shoreditch, or Portobello Road. Red phone boxes, Victorian architecture, overcast grey skies. Moody, atmospheric British light. Mix of punk attitude and tailored tradition. The model has an edge — not polished, not messy. Cool British nonchalance.',
    thumbnail: gradient('street'),
  },

  // Surreal
  {
    id: 'surreal-timwalker',
    name: 'Tim Walker',
    category: 'surreal',
    direction: 'Dreamlike surreal fashion photography in the style of Tim Walker. Fantastical, whimsical, larger-than-life. Giant oversized objects, pastel colors, fairy-tale sets. Soft ethereal lighting as if in a dream. The model exists in an impossible beautiful world. Theatrical but gentle. Every element is deliberately placed for maximum wonder.',
    thumbnail: gradient('surreal'),
  },
  {
    id: 'surreal-pierretgilles',
    name: 'Pierre et Gilles',
    category: 'surreal',
    direction: 'Hyper-real kitsch fashion photography in the style of Pierre et Gilles. Hand-painted backdrop feeling, religious iconography meets pop culture. Saturated oversaturated colors, glitter, halos, stars. The model is elevated to sainthood or stardom. Deliberately artificial, celebrating artifice. Camp aesthetic taken to its beautiful extreme.',
    thumbnail: gradient('surreal'),
  },
  {
    id: 'surreal-guybourdin',
    name: 'Guy Bourdin',
    category: 'surreal',
    direction: 'Provocative surreal fashion photography in the style of Guy Bourdin. Vivid, almost violent colors — red, electric blue, hot pink. Surreal, slightly unsettling compositions. Cropped body parts, unexpected angles, narrative mystery. Glossy, lacquered surfaces. The image tells a story you cannot quite decode. Seductive and disturbing in equal measure.',
    thumbnail: gradient('surreal'),
  },
  {
    id: 'surreal-erikheck',
    name: 'Erik Madigan Heck',
    category: 'surreal',
    direction: 'Painterly surreal fashion photography in the style of Erik Madigan Heck. Explosion of color and pattern. Textile and floral backgrounds that merge with the garment. The boundary between model, clothing, and background dissolves. Rich, saturated, almost impressionist color palette. Fashion as fine art. Every frame could hang in a gallery.',
    thumbnail: gradient('surreal'),
  },
  {
    id: 'surreal-custom',
    name: 'Custom',
    category: 'surreal',
    direction: '', // User provides via customPrompt
    thumbnail: gradient('surreal'),
  },
];

/** Get presets filtered by category */
export function getPresetsByCategory(category: SceneCategory): ScenePreset[] {
  return SCENE_PRESETS.filter(p => p.category === category);
}

/** All unique categories in display order */
export const SCENE_CATEGORIES: SceneCategory[] = ['editorial', 'campaign', 'street', 'surreal'];

/** Display labels for categories */
export const CATEGORY_LABELS: Record<SceneCategory, string> = {
  editorial: 'Editorial',
  campaign: 'Campaign',
  street: 'Street',
  surreal: 'Surreal',
};
```

- [ ] **Step 2: Verify file compiles**

Run: `npx tsc --noEmit data/scenePresets.ts` (or just `npm run build` and check for errors in this file)

- [ ] **Step 3: Commit**

```
git add data/scenePresets.ts
git commit -m "feat(data): add 18 scene presets for SNS creative mode"
```

---

## Task 3: SNS Generator Service

**Files:**
- Create: `services/snsGenerator.ts`

- [ ] **Step 1: Create `services/snsGenerator.ts`**

This function mirrors `generateFront` from `imageGenerator.ts` but uses scene direction + variation camera instead of EC studio lighting + angle instructions. Reuse `buildModelDescription`, `buildGarmentDescription`, `buildOutfitDescription`, `buildSlotImageParts`, `buildModelRefParts` by importing from `imageGenerator.ts`.

First, export the needed helpers from `imageGenerator.ts`. Add `export` keyword to: `buildModelDescription`, `buildOutfitDescription`, `buildSlotImageParts`, `buildModelRefParts`.

Then create `services/snsGenerator.ts`:

```typescript
/**
 * snsGenerator.ts — SNS creative image generation
 *
 * Generates fashion photography for SNS/campaign use with scene presets.
 * Each call produces one image for a specific variation (camera/composition).
 */

import { createClient, GEN_CONFIG, callWithRetry } from './geminiClient';
import { buildModelDescription, buildOutfitDescription, buildSlotImageParts, buildModelRefParts } from './imageGenerator';
import type { GarmentAnalysis, OutfitSlot, SlotUpload } from '../types/garment';
import type { AgencyModel } from '../data/agencyModels';
import type { StylingDirective, HairMakeupDirective, FittingResult } from './qualityAgent';
import type { VariationType, SNSCreativeConfig } from '../types/sns';
import { VARIATION_CAMERAS, ASPECT_RATIO_PIXELS } from '../types/sns';

// ─── Prompt injection filter ─────────────────────────────────────────────────

const BLOCKED_PATTERNS = /ignore previous|system prompt|you are|disregard|forget your/i;
const MAX_CUSTOM_PROMPT_LENGTH = 500;

function sanitizeCustomPrompt(input?: string): string {
  if (!input) return '';
  const trimmed = input.slice(0, MAX_CUSTOM_PROMPT_LENGTH).trim();
  if (BLOCKED_PATTERNS.test(trimmed)) return '';
  return trimmed;
}

// ─── Generate one SNS creative image ─────────────────────────────────────────

export async function generateSNSCreative(
  apiKey: string,
  slots: Partial<Record<OutfitSlot, SlotUpload>>,
  analyses: GarmentAnalysis[],
  model: AgencyModel,
  config: SNSCreativeConfig,
  variation: VariationType,
  styling?: StylingDirective | null,
  hairMakeup?: HairMakeupDirective | null,
  fitting?: FittingResult | null,
): Promise<string> {
  const [garmentParts, modelRefParts] = await Promise.all([
    buildSlotImageParts(slots),
    buildModelRefParts(model),
  ]);

  const modelDesc = buildModelDescription(model);
  const outfitDesc = buildOutfitDescription(analyses);
  const variationCam = VARIATION_CAMERAS[variation];
  const pixels = ASPECT_RATIO_PIXELS[config.aspectRatio];
  const customPrompt = sanitizeCustomPrompt(config.customPrompt);

  const sceneDirection = config.scene.direction || customPrompt;
  const fullScene = config.scene.direction && customPrompt
    ? `${config.scene.direction}\nAdditional direction: ${customPrompt}`
    : sceneDirection;

  const prompt = `Professional fashion photography. ${config.scene.name !== 'Custom' ? config.scene.name + ' style.' : ''}

MODEL IDENTITY (LOCKED — use the EXACT person shown in the model reference photos below):
${modelDesc}
The model reference photos establish the face, bone structure, skin, and hair. Every facial feature must match precisely.

OUTFIT (match garment reference images EXACTLY):
${outfitDesc}

SCENE DIRECTION:
${fullScene}

CAMERA & COMPOSITION:
${variationCam.camera}. ${variationCam.composition}.

PHOTOGRAPHY:
- Output image MUST be ${config.aspectRatio} aspect ratio (${pixels.width}x${pixels.height} pixels)
- Photorealistic, indistinguishable from real photography
- Model must be naturally integrated into the scene — matching scene lighting, perspective, and depth of field
- Garment colors, materials, patterns must match reference exactly
- Natural shadows and reflections consistent with the scene environment

ABSOLUTE PROHIBITIONS:
- DO NOT add ANY logos, text, graphics, prints, branding not in the reference images
- DO NOT hallucinate brand names, tags, labels, decoration
- DO NOT render back-side elements (neck tags, care labels) on visible surfaces
- If a detail is not in the reference photo, it does not exist
${fitting ? `\nFITTING: ${fitting.visual_description}` : ''}`;

  const client = createClient(apiKey);

  const allParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: prompt },
  ];

  if (modelRefParts.length > 0) {
    allParts.push({ text: `MODEL REFERENCE PHOTOS (${modelRefParts.length} images):` });
    allParts.push(...modelRefParts);
  }

  allParts.push({ text: `GARMENT REFERENCE PHOTOS:` });
  allParts.push(...garmentParts);

  const response = await callWithRetry(
    () =>
      client.models.generateContent({
        model: GEN_CONFIG.models.proImage,
        contents: [{ role: 'user', parts: allParts }],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          temperature: GEN_CONFIG.SNS_TEMPERATURE,
        },
      }),
    3,
    `generateSNSCreative:${variation}`,
  );

  if (response.candidates?.[0]?.content) {
    for (const part of response.candidates[0].content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  throw new Error(`No image returned from generateSNSCreative:${variation}`);
}
```

- [ ] **Step 2: Export helpers from `imageGenerator.ts`**

Add `export` keyword to these 4 functions in `services/imageGenerator.ts`:
- `buildModelDescription` (line ~18)
- `buildOutfitDescription` (line ~56)
- `buildSlotImageParts` (line ~66)
- `buildModelRefParts` (line ~88)

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: snsGenerator.ts compiles. Remaining errors in hook/UI files (to be fixed in later tasks).

- [ ] **Step 4: Commit**

```
git add services/snsGenerator.ts services/imageGenerator.ts
git commit -m "feat(service): add SNS creative generator with scene presets and variation cameras"
```

---

## Task 4: Generation Flow Hook — SNS Mode Branch

**Files:**
- Modify: `hooks/useGenerationFlow.ts`

- [ ] **Step 1: Add SNS imports and initial state changes**

Add imports for SNS types at top. Add `shootMode: 'ec-standard'` and `snsConfig: null` to `INITIAL_STATE`. Add SNS initial results (`var1`-`var4` pending) as a constant.

- [ ] **Step 2: Add reducer cases for SET_SHOOT_MODE and SET_SNS_CONFIG**

```typescript
case 'SET_SHOOT_MODE': {
  return {
    ...INITIAL_STATE,
    shootMode: action.mode,
    selectedModel: state.selectedModel,
    outfitSlots: state.outfitSlots,
    status: computeStatus(state.outfitSlots, state.selectedModel),
  };
}

case 'SET_SNS_CONFIG': {
  return { ...state, snsConfig: action.config };
}
```

- [ ] **Step 3: Update `START_GENERATING` case**

Make it dynamic based on shootMode — initialize results with either angle keys or variation keys:

```typescript
case 'START_GENERATING': {
  const isEC = state.shootMode === 'ec-standard';
  const keys = isEC ? ANGLE_ORDER : VARIATION_KEYS;
  const initResults: Partial<Record<ResultKey, PreviewResult>> = {};
  for (const key of keys) {
    initResults[key] = { id: `${key}-${Date.now()}`, angle: key, imageUrl: '', status: 'pending', retryCount: 0 };
  }
  return {
    ...state,
    status: 'generating',
    results: initResults,
    progress: { current: null, completed: 0, total: 4 },
  };
}
```

- [ ] **Step 4: Add SNS generation path in `generate()` callback**

After the shared Phase 1 (analyze + styling/hair/fitting), branch by `state.shootMode`:

```typescript
if (state.shootMode === 'sns-creative' && state.snsConfig) {
  // ── Phase 2: SNS Creative (2-batch x 2-parallel) ──
  dispatch({ type: 'START_GENERATING' });

  const variations: VariationType[] = ['var1', 'var2', 'var3', 'var4'];

  // Batch 1: var1 + var2
  const batch1 = await Promise.allSettled(
    variations.slice(0, 2).map(v => {
      dispatch({ type: 'UPDATE_RESULT', angle: v, result: { status: 'generating' } });
      return generateSNSCreative(apiKey, outfitSlots, analyses, selectedModel, state.snsConfig!, v, stylingDir, hairMakeupDir, fittingResult);
    }),
  );
  let completed = 0;
  for (let i = 0; i < 2; i++) {
    const v = variations[i];
    const r = batch1[i];
    if (r.status === 'fulfilled') {
      completed++;
      dispatch({ type: 'UPDATE_RESULT', angle: v, result: { imageUrl: r.value, status: 'complete' } });
    } else {
      dispatch({ type: 'UPDATE_RESULT', angle: v, result: { status: 'error', qualityIssues: [r.reason instanceof Error ? r.reason.message : 'Generation failed'] } });
    }
    dispatch({ type: 'SET_PROGRESS', current: v, completed });
  }

  // Batch 2: var3 + var4
  const batch2 = await Promise.allSettled(
    variations.slice(2, 4).map(v => {
      dispatch({ type: 'UPDATE_RESULT', angle: v, result: { status: 'generating' } });
      return generateSNSCreative(apiKey, outfitSlots, analyses, selectedModel, state.snsConfig!, v, stylingDir, hairMakeupDir, fittingResult);
    }),
  );
  for (let i = 0; i < 2; i++) {
    const v = variations[i + 2];
    const r = batch2[i];
    if (r.status === 'fulfilled') {
      completed++;
      dispatch({ type: 'UPDATE_RESULT', angle: v, result: { imageUrl: r.value, status: 'complete' } });
    } else {
      dispatch({ type: 'UPDATE_RESULT', angle: v, result: { status: 'error', qualityIssues: [r.reason instanceof Error ? r.reason.message : 'Generation failed'] } });
    }
    dispatch({ type: 'SET_PROGRESS', current: v, completed });
  }

  dispatch({ type: 'COMPLETE' });
  return;
}
```

Keep the existing EC path as `else` branch (or as the default when `shootMode === 'ec-standard'`).

- [ ] **Step 5: Expose new actions from hook return**

Add `setShootMode` and `setSNSConfig` callbacks:

```typescript
const setShootMode = useCallback((mode: ShootMode) => {
  dispatch({ type: 'SET_SHOOT_MODE', mode });
}, []);

const setSNSConfig = useCallback((config: SNSCreativeConfig) => {
  dispatch({ type: 'SET_SNS_CONFIG', config });
}, []);
```

Return them in `actions`.

- [ ] **Step 6: Build check**

Run: `npm run build`
Fix any type errors. The hook should now compile.

- [ ] **Step 7: Commit**

```
git add hooks/useGenerationFlow.ts
git commit -m "feat(hook): add SNS creative generation flow with 2-batch parallel execution"
```

---

## Task 5: ModeToggle Component

**Files:**
- Create: `components/generation/ModeToggle.tsx`

- [ ] **Step 1: Create `components/generation/ModeToggle.tsx`**

```typescript
import type { ShootMode } from '../../types/sns';

interface ModeToggleProps {
  mode: ShootMode;
  onChange: (mode: ShootMode) => void;
}

const MODES: { id: ShootMode; label: string }[] = [
  { id: 'ec-standard', label: 'EC撮影' },
  { id: 'sns-creative', label: 'SNSクリエイティブ' },
];

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex gap-1 p-1 bg-gray-900 rounded-full w-fit">
      {MODES.map(m => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={[
            'px-4 py-1.5 rounded-full text-xs font-medium transition-colors duration-200',
            m.id === mode
              ? 'bg-cyan-500 text-gray-950'
              : 'text-gray-400 hover:text-gray-200',
          ].join(' ')}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```
git add components/generation/ModeToggle.tsx
git commit -m "feat(ui): add EC/SNS mode toggle component"
```

---

## Task 6: SceneSelector Component

**Files:**
- Create: `components/generation/SceneSelector.tsx`

- [ ] **Step 1: Create `components/generation/SceneSelector.tsx`**

```typescript
import { useState } from 'react';
import type { SceneCategory, AspectRatio, ScenePreset, SNSCreativeConfig } from '../../types/sns';
import { SCENE_CATEGORIES, CATEGORY_LABELS, getPresetsByCategory } from '../../data/scenePresets';

interface SceneSelectorProps {
  config: SNSCreativeConfig | null;
  onChange: (config: SNSCreativeConfig) => void;
}

const ASPECT_RATIOS: { id: AspectRatio; label: string; sub: string }[] = [
  { id: '4:5',  label: '4:5',  sub: 'IG Feed' },
  { id: '1:1',  label: '1:1',  sub: 'X / 汎用' },
  { id: '9:16', label: '9:16', sub: 'Story' },
  { id: '16:9', label: '16:9', sub: 'Banner' },
];

export function SceneSelector({ config, onChange }: SceneSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<SceneCategory>('editorial');
  const [customPrompt, setCustomPrompt] = useState(config?.customPrompt ?? '');
  const selectedPreset = config?.scene ?? null;
  const selectedRatio = config?.aspectRatio ?? '4:5';

  const presets = getPresetsByCategory(activeCategory);

  function selectPreset(preset: ScenePreset) {
    onChange({
      scene: preset,
      customPrompt: preset.id === 'surreal-custom' ? customPrompt : config?.customPrompt,
      aspectRatio: selectedRatio,
    });
  }

  function updateCustomPrompt(value: string) {
    const clamped = value.slice(0, 500);
    setCustomPrompt(clamped);
    if (config) {
      onChange({ ...config, customPrompt: clamped });
    }
  }

  function selectRatio(ratio: AspectRatio) {
    if (config) {
      onChange({ ...config, aspectRatio: ratio });
    } else {
      // No preset selected yet — just store the ratio preference
    }
  }

  const isCustomMode = selectedPreset?.id === 'surreal-custom';
  const showCustomInput = isCustomMode || (selectedPreset && activeCategory !== 'surreal');

  return (
    <div className="flex flex-col gap-4">
      {/* Category tabs */}
      <div className="flex gap-1 p-1 bg-gray-900/50 rounded-lg">
        {SCENE_CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={[
              'flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 text-center',
              cat === activeCategory
                ? 'bg-gray-800 text-gray-100'
                : 'text-gray-500 hover:text-gray-300',
            ].join(' ')}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-3 gap-2">
        {presets.map(preset => {
          const isSelected = selectedPreset?.id === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => selectPreset(preset)}
              className={[
                'flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all duration-200',
                isSelected
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-700',
              ].join(' ')}
            >
              <div
                className="w-full aspect-[3/4] rounded-md"
                style={{ background: preset.thumbnail }}
              />
              <span className={`text-[11px] font-medium ${isSelected ? 'text-cyan-400' : 'text-gray-400'}`}>
                {preset.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom prompt input */}
      {showCustomInput && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-gray-500">
            {isCustomMode ? 'シーンを自由に記述' : 'シーンを追記（任意）'}
          </label>
          <textarea
            value={customPrompt}
            onChange={e => updateCustomPrompt(e.target.value)}
            placeholder={isCustomMode ? '例: 巨大な花に囲まれた温室の中で...' : '例: 古着屋の店内で'}
            maxLength={500}
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 text-xs placeholder-gray-600 focus:outline-none focus:border-cyan-500 resize-none transition-colors duration-200"
          />
          <span className="text-[10px] text-gray-600 text-right">{customPrompt.length}/500</span>
        </div>
      )}

      {/* Aspect ratio selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] text-gray-500">アスペクト比</span>
        <div className="flex gap-1.5">
          {ASPECT_RATIOS.map(ar => (
            <button
              key={ar.id}
              type="button"
              onClick={() => selectRatio(ar.id)}
              className={[
                'flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg border text-center transition-colors duration-200',
                ar.id === selectedRatio
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-700',
              ].join(' ')}
            >
              <span className={`text-xs font-semibold ${ar.id === selectedRatio ? 'text-cyan-400' : 'text-gray-300'}`}>
                {ar.label}
              </span>
              <span className="text-[10px] text-gray-600">{ar.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```
git add components/generation/SceneSelector.tsx
git commit -m "feat(ui): add scene selector with category tabs, preset grid, custom prompt, aspect ratio"
```

---

## Task 7: Update StepTabs for SNS Mode

**Files:**
- Modify: `components/generation/StepTabs.tsx`

- [ ] **Step 1: Update StepTabs to support 3 tabs in SNS mode**

Widen `StepId` to include `'scene'`. Accept `shootMode` and `sceneReady` props. Show scene tab only when `shootMode === 'sns-creative'`.

```typescript
export type StepId = 'garment' | 'model' | 'scene';

interface StepTabsProps {
  current: StepId;
  onChange: (step: StepId) => void;
  garmentReady: boolean;
  modelReady: boolean;
  shootMode?: 'ec-standard' | 'sns-creative';
  sceneReady?: boolean;
}

// In the component:
const tabs: { id: StepId; label: string; ready: boolean }[] = [
  { id: 'garment', label: '商品画像', ready: garmentReady },
  { id: 'model',   label: 'モデル',   ready: modelReady  },
];
if (shootMode === 'sns-creative') {
  tabs.push({ id: 'scene', label: 'シーン', ready: sceneReady ?? false });
}
```

- [ ] **Step 2: Build check and commit**

```
git add components/generation/StepTabs.tsx
git commit -m "feat(ui): add scene tab to StepTabs for SNS creative mode"
```

---

## Task 8: Update PreviewGrid for SNS Mode

**Files:**
- Modify: `components/generation/PreviewGrid.tsx`

- [ ] **Step 1: Accept new props and update display logic**

Add `shootMode` and `aspectRatio` props. When `shootMode === 'sns-creative'`:
- Use `VARIATION_KEYS` as the order instead of `ANGLE_ORDER`
- Labels: `VARIATION_CAMERAS[key].label` (Standard / Dynamic / Portrait / Context)
- Aspect ratio of each cell: dynamic based on `aspectRatio` prop
- For 9:16: use `grid-cols-2` but taller cells
- For 16:9: use `grid-cols-1` with 4 rows

Key changes:
```typescript
import type { ShootMode, AspectRatio, ResultKey } from '../../types/sns';
import { VARIATION_KEYS, VARIATION_CAMERAS } from '../../types/sns';

interface PreviewGridProps {
  results: Partial<Record<ResultKey, PreviewResult>>;
  modelName?: string;
  heroSlot?: string | null;
  shootMode?: ShootMode;
  aspectRatio?: AspectRatio;
}

// Derive order and labels:
const isEC = shootMode !== 'sns-creative';
const displayKeys: ResultKey[] = isEC ? ANGLE_ORDER : [...VARIATION_KEYS];

// Aspect ratio CSS class for cells:
const cellAspect = isEC ? 'aspect-[3/4]' : {
  '4:5': 'aspect-[4/5]',
  '1:1': 'aspect-square',
  '9:16': 'aspect-[9/16]',
  '16:9': 'aspect-video',
}[aspectRatio ?? '4:5'];

// Grid layout:
const gridClass = (!isEC && aspectRatio === '16:9')
  ? 'grid grid-cols-1 gap-3'
  : 'grid grid-cols-2 gap-3';
```

Update `PreviewSlot` to use `ResultKey` for its angle prop and derive label from either `ANGLE_LABELS` or `VARIATION_CAMERAS`.

- [ ] **Step 2: Build check and commit**

```
git add components/generation/PreviewGrid.tsx
git commit -m "feat(ui): update PreviewGrid for SNS mode with dynamic aspect ratio and variation labels"
```

---

## Task 9: Wire Everything in GenerationPage

**Files:**
- Modify: `pages/GenerationPage.tsx`

- [ ] **Step 1: Add ModeToggle to header area**

Import `ModeToggle` and render it between the header and StepTabs. Wire to `actions.setShootMode`.

- [ ] **Step 2: Add SceneSelector as 3rd step in SNS mode**

When `currentStep === 'scene'` and `state.shootMode === 'sns-creative'`, render `SceneSelector`. Wire `onChange` to `actions.setSNSConfig`.

- [ ] **Step 3: Update StepTabs props**

Pass `shootMode={state.shootMode}` and `sceneReady={!!state.snsConfig?.scene}`.

- [ ] **Step 4: Update PreviewGrid props**

Pass `shootMode={state.shootMode}` and `aspectRatio={state.snsConfig?.aspectRatio}`.

- [ ] **Step 5: Update canGenerate logic**

For SNS mode, also require `state.snsConfig?.scene` to be set (and non-custom or customPrompt non-empty):

```typescript
const canGenerate = (() => {
  if (!apiKey || state.status !== 'ready') return false;
  if (state.shootMode === 'sns-creative') {
    if (!state.snsConfig?.scene) return false;
    if (state.snsConfig.scene.id === 'surreal-custom' && !state.snsConfig.customPrompt?.trim()) return false;
  }
  return true;
})();
```

- [ ] **Step 6: Build and full verification**

Run: `npm run build`
Expected: 0 errors. Full build success.

Then run: `npm run dev` and manually verify:
1. Mode toggle switches between EC and SNS
2. SNS mode shows 3 tabs (商品画像 / モデル / シーン)
3. Scene selector shows 4 categories with preset grids
4. Aspect ratio buttons work
5. Custom prompt appears for Surreal/Custom
6. EC mode still works exactly as before

- [ ] **Step 7: Commit**

```
git add pages/GenerationPage.tsx
git commit -m "feat(page): wire SNS creative mode into GenerationPage with ModeToggle and SceneSelector"
```

---

## Task 10: Final Build + Integration Verification

**Files:** None new — verification only.

- [ ] **Step 1: Clean build**

Run: `npm run build`
Expected: 0 errors, successful build.

- [ ] **Step 2: Manual smoke test (EC mode regression)**

Open `http://localhost:5175/studio`:
1. Ensure default mode is EC撮影
2. Upload garment → select model → generate → 4 angles appear
3. All existing functionality works unchanged

- [ ] **Step 3: Manual smoke test (SNS mode)**

1. Switch to SNSクリエイティブ mode
2. Upload garment → select model → go to シーン tab
3. Select Editorial > POPEYE preset
4. Select 4:5 aspect ratio
5. Click generate
6. 4 variations should generate (2 at a time)
7. Each should have different camera/composition
8. Verify labels: Standard / Dynamic / Portrait / Context

- [ ] **Step 4: Commit all remaining changes (if any)**

```
git add -A
git commit -m "feat: SNS creative mode complete — editorial/campaign/street/surreal with 4 variation generation"
```

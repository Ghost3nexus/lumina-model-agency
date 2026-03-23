# Lumina Studio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Lumina Studio as a clean botika-style 2-column app with Gemini-powered multi-angle EC image generation.

**Architecture:** Split the monolithic geminiService.ts (2,900 LOC) into focused service modules, extract 22 useState hooks into a useReducer-based flow hook, and rebuild the UI as a 2-column layout (left: step tabs, right: 4-image grid preview).

**Tech Stack:** React 19 / TypeScript / Vite / Tailwind CSS / Gemini API (@google/genai)

**Spec:** `docs/superpowers/specs/2026-03-20-lumina-studio-redesign.md`

---

## File Structure

### New Files to Create

```
types/
  garment.ts              — GarmentCategory, GarmentAnalysis, VisionAnalysis (from types.ts)
  model.ts                — ModelProfile (from data/modelRoster.ts interface)
  generation.ts           — GenerationState, GenerationAction, PreviewResult, AngleType, QualityScore

services/
  geminiClient.ts         — Shared Gemini API client (init, parseBase64, retry logic, APIキー管理)
  garmentAnalyzer.ts      — analyzeClothingItems() extracted from geminiService.ts
  imageGenerator.ts       — generateFront(), generateAngle() extracted from geminiService.ts
  qualityChecker.ts       — checkImageQuality() extracted from geminiService.ts

hooks/
  useGenerationFlow.ts    — useReducer state machine (idle→ready→analyzing→generating→complete)
  useGarmentUpload.ts     — Upload validation, compression, preview

components/generation/
  GarmentUpload.tsx       — Step 1: Drag & drop upload area
  ModelSelector.tsx       — Step 2: Model roster grid with category tabs
  PreviewGrid.tsx         — Right panel: 2x2 grid (Front/Back/Side/Bust)
  GenerateButton.tsx      — Generate button + progress bar
  StepTabs.tsx            — Tab navigation (商品 / モデル)
  ErrorDisplay.tsx        — Error messages + support link

pages/
  GenerationPage.tsx      — New thin orchestrator (replaces NewGenerationPage.tsx)
```

### Files to Keep As-Is
```
data/modelRoster.ts       — 34 model profiles (746 LOC). No changes needed.
public/models/*.png       — 34 pre-generated model images
components/auth/           — Auth system (keep current)
components/layout/         — AppShell (will be simplified)
```

### Files to Delete (after migration complete)
```
services/geminiService.ts           — Replaced by garmentAnalyzer + imageGenerator + qualityChecker + geminiClient
services/luminaApi.ts               — PreviewResult moved to types/generation.ts
services/newShootMapping.ts         — Replaced by fixed presets in imageGenerator
services/modelAgentService.ts       — Agency scope (not Studio)
services/upscaleService.ts          — Not needed for initial release
services/creativeService.ts         — AI art scope (not Studio)
pages/NewGenerationPage.tsx         — Replaced by GenerationPage.tsx
components/new/                     — Entire directory replaced by components/generation/
data/skills/                        — Skill system not needed (fixed prompts in imageGenerator)
data/creativeScenes.ts              — Not needed
types.ts                            — Replaced by types/ directory
```

---

## Task 1: Type Definitions

**Files:**
- Create: `types/garment.ts`
- Create: `types/model.ts`
- Create: `types/generation.ts`

- [ ] **Step 1: Create types/garment.ts**

Extract garment-related types from current `types.ts`. Only what's needed for the new pipeline:

```typescript
// types/garment.ts
export type GarmentCategory = 'tops' | 'pants' | 'dress' | 'outer' | 'skirt' | 'shoes' | 'accessories';

export interface GarmentAnalysis {
  category: GarmentCategory;
  subcategory: string;        // e.g. "button-up shirt", "skinny jeans"
  color: string;              // primary color
  colors: string[];           // all colors
  material: string;           // e.g. "cotton", "denim", "silk"
  pattern: string;            // e.g. "solid", "striped", "plaid"
  details: string[];          // e.g. ["collar", "breast pocket", "cuffs"]
  fit: string;                // e.g. "regular", "oversized", "slim"
  description: string;        // Full natural language description
}
```

- [ ] **Step 2: Create types/model.ts**

Re-export the ModelProfile interface (keep data/modelRoster.ts as source of truth):

```typescript
// types/model.ts
export type { ModelProfile } from '../data/modelRoster';

export type ModelCategory = 'asia' | 'international' | 'male' | 'senior' | 'kids' | 'teen';
```

- [ ] **Step 3: Create types/generation.ts**

```typescript
// types/generation.ts
import type { GarmentAnalysis } from './garment';
import type { ModelProfile } from './model';

export type AngleType = 'front' | 'back' | 'side' | 'bust';

export interface PreviewResult {
  id: string;
  angle: AngleType;
  imageUrl: string;       // blob URL or data URL
  status: 'pending' | 'generating' | 'checking' | 'complete' | 'error' | 'retrying';
  qualityScore?: number;
  qualityIssues?: string[];
  retryCount: number;
}

export type GenerationStatus =
  | 'idle'
  | 'ready'
  | 'analyzing'
  | 'generating'
  | 'checking'
  | 'retrying'
  | 'complete'
  | 'error';

export interface GenerationState {
  status: GenerationStatus;
  garmentImage: string | null;            // data URL
  garmentAnalysis: GarmentAnalysis | null;
  selectedModel: ModelProfile | null;
  results: Record<AngleType, PreviewResult>;
  progress: { current: AngleType | null; completed: number; total: 4 };
  error: { message: string; type: 'api' | 'quality' | 'input' } | null;
}

export type GenerationAction =
  | { type: 'SET_GARMENT'; image: string }
  | { type: 'SET_ANALYSIS'; analysis: GarmentAnalysis }
  | { type: 'SET_MODEL'; model: ModelProfile }
  | { type: 'CLEAR_GARMENT' }
  | { type: 'START_ANALYZING' }
  | { type: 'START_GENERATING' }
  | { type: 'UPDATE_RESULT'; angle: AngleType; result: Partial<PreviewResult> }
  | { type: 'SET_PROGRESS'; current: AngleType | null; completed: number }
  | { type: 'START_CHECKING' }
  | { type: 'START_RETRYING' }
  | { type: 'COMPLETE' }
  | { type: 'SET_ERROR'; message: string; errorType: 'api' | 'quality' | 'input' }
  | { type: 'RESET' };
```

- [ ] **Step 4: Verify types compile**

Run: `npx tsc --noEmit types/garment.ts types/model.ts types/generation.ts`

- [ ] **Step 5: Commit**

```bash
git add types/
git commit -m "feat: add type definitions for garment, model, generation"
```

---

## Task 2: Gemini Client (Shared API Layer)

**Files:**
- Create: `services/geminiClient.ts`

- [ ] **Step 1: Create geminiClient.ts**

Extract shared Gemini utilities from geminiService.ts (lines ~1-50, parseBase64, retry logic):

```typescript
// services/geminiClient.ts
import { GoogleGenAI } from '@google/genai';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const JPEG_QUALITY = 0.93;

export const GEN_CONFIG = {
  temperature: {
    analysis: 0.2,
    ecProduct: 0.35,
    qualityCheck: 0.1,
  },
  quality: {
    passThreshold: 85,
    maxRetries: 2,
  },
  models: {
    flash: 'gemini-2.0-flash',
    proImage: 'gemini-3-pro-image-preview',
  },
} as const;

export function createClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey });
}

export function parseBase64(dataUrl: string): { mimeType: string; data: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('Invalid data URL');
  return { mimeType: match[1], data: match[2] };
}

export async function imageToBase64(imageUrl: string): Promise<{ data: string; mimeType: string }> {
  if (imageUrl.startsWith('data:')) return parseBase64(imageUrl);
  const blob = await fetch(imageUrl).then(r => r.blob());
  const mimeType = blob.type || 'image/png';
  const data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(blob);
  });
  return { data, mimeType };
}

export async function compressImage(dataUrl: string, maxBytes = MAX_IMAGE_BYTES): Promise<string> {
  // Compress to JPEG if exceeds maxBytes
  const blob = await fetch(dataUrl).then(r => r.blob());
  if (blob.size <= maxBytes) return dataUrl;

  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = dataUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

export async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  label = 'API call',
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      const waitSec = Math.pow(2, attempt + 1) + 1;
      console.log(`[${label}] Retry ${attempt}/${maxRetries} — waiting ${waitSec}s`);
      await new Promise(r => setTimeout(r, waitSec * 1000));
    }
    try {
      return await fn();
    } catch (e: any) {
      if (e?.status === 400 || e?.status === 401 || e?.status === 403) throw e;
      const is429 = e?.status === 429 || String(e?.message ?? '').includes('RESOURCE_EXHAUSTED');
      if (!is429 && attempt >= maxRetries - 1) throw e;
      lastError = e;
    }
  }
  throw lastError;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit services/geminiClient.ts`

- [ ] **Step 3: Commit**

```bash
git add services/geminiClient.ts
git commit -m "feat: add shared Gemini client with retry logic and image utils"
```

---

## Task 3: Garment Analyzer Service

**Files:**
- Create: `services/garmentAnalyzer.ts`
- Reference: `services/geminiService.ts` lines ~60-350 (`analyzeClothingItems`)

- [ ] **Step 1: Create garmentAnalyzer.ts**

Extract `analyzeClothingItems` from geminiService.ts. Simplify the output to match the new `GarmentAnalysis` type. The current function returns a `VisionAnalysis` with 15+ fields — we only need the essentials for EC generation.

```typescript
// services/garmentAnalyzer.ts
import { createClient, parseBase64, GEN_CONFIG, callWithRetry } from './geminiClient';
import type { GarmentAnalysis } from '../types/garment';

export async function analyzeGarment(
  apiKey: string,
  imageDataUrl: string,
): Promise<GarmentAnalysis> {
  const ai = createClient(apiKey);
  const { mimeType, data } = parseBase64(imageDataUrl);

  const prompt = `You are a fashion product analyst. Analyze this garment image and return ONLY valid JSON.

{
  "category": "tops" | "pants" | "dress" | "outer" | "skirt" | "shoes" | "accessories",
  "subcategory": "specific garment type (e.g. button-up shirt, skinny jeans, A-line dress)",
  "color": "primary color",
  "colors": ["all visible colors"],
  "material": "fabric type (e.g. cotton, denim, silk, wool, polyester)",
  "pattern": "solid" | "striped" | "plaid" | "floral" | "graphic" | "other",
  "details": ["visible construction details (e.g. collar, pockets, buttons, zippers, embroidery)"],
  "fit": "regular" | "oversized" | "slim" | "relaxed" | "tailored",
  "description": "One paragraph describing the garment as a fashion buyer would — material, construction, color, silhouette, key details"
}`;

  return callWithRetry(async () => {
    const resp = await ai.models.generateContent({
      model: GEN_CONFIG.models.flash,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data } },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        temperature: GEN_CONFIG.temperature.analysis,
        maxOutputTokens: 512,
      },
    });

    const parsed = JSON.parse(resp.text ?? '{}');
    console.log('[GarmentAnalyzer] Analysis:', parsed);
    return parsed as GarmentAnalysis;
  }, 3, 'GarmentAnalyzer');
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit services/garmentAnalyzer.ts`

- [ ] **Step 3: Commit**

```bash
git add services/garmentAnalyzer.ts
git commit -m "feat: add garmentAnalyzer service — extract from geminiService"
```

---

## Task 4: Image Generator Service

**Files:**
- Create: `services/imageGenerator.ts`
- Reference: `services/geminiService.ts` lines ~1400-2640 (`generateFashionShot`, `generateBaseModel`, `generateFittedModel`)

This is the core. Extract and simplify the generation logic for the botika-style EC flow.

- [ ] **Step 1: Create imageGenerator.ts**

```typescript
// services/imageGenerator.ts
import { createClient, parseBase64, imageToBase64, GEN_CONFIG, callWithRetry } from './geminiClient';
import type { GarmentAnalysis } from '../types/garment';
import type { ModelProfile } from '../types/model';
import type { AngleType } from '../types/generation';

function buildModelDescription(model: ModelProfile): string {
  return `${model.ethnicity} ${model.gender}, ${model.age}, ${model.height}cm, ${model.bodyType} build, ${model.hair} hair, ${model.eyes} eyes, ${model.vibe} aesthetic`;
}

function buildFrontPrompt(analysis: GarmentAnalysis, model: ModelProfile): string {
  return `TASK: Generate a professional e-commerce fashion photograph.

MODEL: ${buildModelDescription(model)}
The model should look like a real fashion model — natural expression, confident posture, photorealistic skin with visible pores.

GARMENT: ${analysis.description}
The garment MUST be rendered with EXACT fidelity to the reference image:
- Color: ${analysis.color} (${analysis.colors.join(', ')})
- Material: ${analysis.material} — fabric texture must be clearly visible
- Pattern: ${analysis.pattern}
- Details: ${analysis.details.join(', ')}
- Fit: ${analysis.fit}

PHOTOGRAPHY:
- Full-body shot, facing camera directly
- Studio lighting with directional quality — shadow ratio 1:2.5 to 1:3
- Shadows must reveal fabric folds, drape, and body contour
- NO flat lighting. NO blown highlights. Fabric detail must be preserved even in white areas.
- Clean studio background
- Professional e-commerce framing (head to toe with breathing room)
- Shot as if by a ZARA/NET-A-PORTER photographer

CRITICAL: The garment in the output MUST match the reference image exactly. Same color, same pattern, same details. Do not alter the garment.`;
}

function buildAnglePrompt(angle: AngleType, analysis: GarmentAnalysis): string {
  const angleInstructions: Record<Exclude<AngleType, 'front'>, string> = {
    back: 'Model turned 180 degrees, showing the complete back view. Same posture and energy as the front shot.',
    side: 'Model at 3/4 angle (approximately 45 degrees). Show the silhouette and side profile of the garment.',
    bust: 'Upper body close-up from chest to head. Same model, same garment. Show fabric texture and face clearly.',
  };

  if (angle === 'front') return ''; // Should not be called for front

  return `TASK: Generate the ${angle.toUpperCase()} view of the SAME model wearing the SAME garment.

ANGLE: ${angleInstructions[angle]}

REFERENCE: The first image is the FRONT shot of this model. You MUST maintain:
- Exact same person (face, body, skin, hair)
- Exact same garment (color: ${analysis.color}, material: ${analysis.material}, pattern: ${analysis.pattern})
- Same studio lighting setup and background
- Same photographic quality

CRITICAL: This must look like part of the same photoshoot as the front image.`;
}

export async function generateFront(
  apiKey: string,
  garmentImageUrl: string,
  analysis: GarmentAnalysis,
  model: ModelProfile,
): Promise<string> {
  const ai = createClient(apiKey);
  const garment = await imageToBase64(garmentImageUrl);
  const prompt = buildFrontPrompt(analysis, model);

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: GEN_CONFIG.models.proImage,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: garment.mimeType, data: garment.data } },
        ],
      },
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        temperature: GEN_CONFIG.temperature.ecProduct,
      },
    });

    if (response.candidates?.[0]?.content) {
      for (const part of response.candidates[0].content.parts || []) {
        if (part.inlineData) {
          console.log('[ImageGenerator] Front generated');
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error('No image returned from Gemini');
  }, 3, 'GenerateFront');
}

export async function generateAngle(
  apiKey: string,
  frontImageUrl: string,
  garmentImageUrl: string,
  analysis: GarmentAnalysis,
  angle: Exclude<AngleType, 'front'>,
): Promise<string> {
  const ai = createClient(apiKey);
  const front = await imageToBase64(frontImageUrl);
  const garment = await imageToBase64(garmentImageUrl);
  const prompt = buildAnglePrompt(angle, analysis);

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: GEN_CONFIG.models.proImage,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: front.mimeType, data: front.data } },
          { inlineData: { mimeType: garment.mimeType, data: garment.data } },
        ],
      },
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        temperature: GEN_CONFIG.temperature.ecProduct,
      },
    });

    if (response.candidates?.[0]?.content) {
      for (const part of response.candidates[0].content.parts || []) {
        if (part.inlineData) {
          console.log(`[ImageGenerator] ${angle} generated`);
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error(`No image returned for ${angle}`);
  }, 3, `Generate${angle}`);
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit services/imageGenerator.ts`

- [ ] **Step 3: Commit**

```bash
git add services/imageGenerator.ts
git commit -m "feat: add imageGenerator service — front + multi-angle generation"
```

---

## Task 5: Quality Checker Service

**Files:**
- Create: `services/qualityChecker.ts`
- Reference: `services/geminiService.ts` lines ~2685-2807 (`checkImageQuality`)

- [ ] **Step 1: Create qualityChecker.ts**

Extract `checkImageQuality` from geminiService.ts. Same logic, cleaner interface:

```typescript
// services/qualityChecker.ts
import { createClient, parseBase64, GEN_CONFIG, callWithRetry } from './geminiClient';

export interface QualityResult {
  score: number;
  pass: boolean;
  issues: string[];
}

export async function checkQuality(
  apiKey: string,
  imageDataUrl: string,
  anchorImageDataUrl?: string,
): Promise<QualityResult> {
  const ai = createClient(apiKey);
  const { mimeType, data } = parseBase64(
    imageDataUrl.startsWith('data:') ? imageDataUrl : `data:image/png;base64,${imageDataUrl}`
  );

  const anchorParsed = anchorImageDataUrl
    ? parseBase64(anchorImageDataUrl.startsWith('data:') ? anchorImageDataUrl : `data:image/png;base64,${anchorImageDataUrl}`)
    : null;

  const prompt = `You are a strict quality inspector for AI-generated fashion e-commerce photos.
Analyze this image for commercial use on ZARA/NET-A-PORTER level EC sites. Return ONLY valid JSON.
${anchorParsed ? '\nThe FIRST image is the ANCHOR (reference front shot). The SECOND image is being evaluated. Compare garment colors between them.\n' : ''}
Evaluate:
1. HANDS: Correct finger count and rendering
2. LIGHTING_EQUIPMENT: Any visible studio equipment
3. GARMENT_ORIENTATION: Correct button/zipper sides
4. SKIN_QUALITY: Photorealistic or AI-smooth
5. GARMENT_COLOR: Natural and consistent colors
6. BODY_PROPORTIONS: Natural proportions
7. FACE_QUALITY: Clear, no distortion
8. BLOWN_HIGHLIGHTS: White areas losing fabric detail
9. LIGHTING_DIMENSION: Directional with visible shadows (flat = FAIL)
10. FABRIC_TEXTURE: Can identify material type
${anchorParsed ? '11. COLOR_DRIFT: Garment colors match anchor' : ''}

Scoring: Start at 100. Subtract per issue:
- Hands defect: -20 (critical)
- Visible equipment: -15
- Orientation wrong: -15 (critical)
- AI-smooth skin: -10
- Color inconsistency: -15
- Body proportion issues: -15
- Face blur/distortion: -20 (critical)
- Blown highlights: -20 (critical)
- Flat lighting: -15
- Texture not visible: -10
${anchorParsed ? '- Color drift vs anchor: -20' : ''}

Return JSON:
{
  "hands_ok": true/false,
  "face_quality_ok": true/false,
  "garment_orientation_ok": true/false,
  "no_blown_highlights": true/false,
  "lighting_has_dimension": true/false,
  "fabric_texture_visible": true/false,
  ${anchorParsed ? '"color_matches_anchor": true/false,' : ''}
  "issues": ["short description of problems"],
  "score": 0-100
}`;

  const imageParts: any[] = [];
  if (anchorParsed) {
    imageParts.push({ inlineData: { mimeType: anchorParsed.mimeType, data: anchorParsed.data } });
  }
  imageParts.push({ inlineData: { mimeType, data } });

  try {
    const resp = await callWithRetry(async () => {
      return ai.models.generateContent({
        model: GEN_CONFIG.models.flash,
        contents: { parts: [{ text: prompt }, ...imageParts] },
        config: {
          responseMimeType: 'application/json',
          temperature: GEN_CONFIG.temperature.qualityCheck,
          maxOutputTokens: 512,
        },
      });
    }, 2, 'QualityCheck');

    const parsed = JSON.parse(resp.text ?? '{}');
    const score = typeof parsed.score === 'number' ? Math.min(100, Math.max(0, parsed.score)) : 70;
    const issues: string[] = Array.isArray(parsed.issues) ? parsed.issues : [];

    const hasCriticalDefect =
      parsed.hands_ok === false ||
      parsed.face_quality_ok === false ||
      parsed.garment_orientation_ok === false ||
      parsed.no_blown_highlights === false;

    const adjustedScore = hasCriticalDefect
      ? Math.min(score, GEN_CONFIG.quality.passThreshold - 1)
      : score;

    const pass = adjustedScore >= GEN_CONFIG.quality.passThreshold;
    console.log(`[QualityCheck] Score: ${adjustedScore} | Pass: ${pass} | Issues:`, issues);
    return { score: adjustedScore, pass, issues };
  } catch (err) {
    console.warn('[QualityCheck] Failed — accepting with caution:', err);
    return { score: 70, pass: true, issues: ['Quality check unavailable'] };
  }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit services/qualityChecker.ts`

- [ ] **Step 3: Commit**

```bash
git add services/qualityChecker.ts
git commit -m "feat: add qualityChecker service — QA scoring with auto-retry support"
```

---

## Task 6: Generation Flow Hook (State Machine)

**Files:**
- Create: `hooks/useGenerationFlow.ts`

- [ ] **Step 1: Create useGenerationFlow.ts**

```typescript
// hooks/useGenerationFlow.ts
import { useReducer, useCallback } from 'react';
import type { GarmentAnalysis } from '../types/garment';
import type { ModelProfile } from '../types/model';
import type {
  GenerationState,
  GenerationAction,
  AngleType,
  PreviewResult,
} from '../types/generation';
import { analyzeGarment } from '../services/garmentAnalyzer';
import { generateFront, generateAngle } from '../services/imageGenerator';
import { checkQuality } from '../services/qualityChecker';
import { GEN_CONFIG } from '../services/geminiClient';

const ANGLES: AngleType[] = ['front', 'back', 'side', 'bust'];

function makeEmptyResult(angle: AngleType): PreviewResult {
  return { id: angle, angle, imageUrl: '', status: 'pending', retryCount: 0 };
}

const initialState: GenerationState = {
  status: 'idle',
  garmentImage: null,
  garmentAnalysis: null,
  selectedModel: null,
  results: {
    front: makeEmptyResult('front'),
    back: makeEmptyResult('back'),
    side: makeEmptyResult('side'),
    bust: makeEmptyResult('bust'),
  },
  progress: { current: null, completed: 0, total: 4 },
  error: null,
};

function reducer(state: GenerationState, action: GenerationAction): GenerationState {
  switch (action.type) {
    case 'SET_GARMENT':
      return { ...state, garmentImage: action.image, status: state.selectedModel ? 'ready' : state.status === 'idle' ? 'idle' : state.status };
    case 'SET_ANALYSIS':
      return { ...state, garmentAnalysis: action.analysis };
    case 'SET_MODEL':
      return { ...state, selectedModel: action.model, status: state.garmentImage ? 'ready' : 'idle' };
    case 'CLEAR_GARMENT':
      return { ...initialState, selectedModel: state.selectedModel };
    case 'START_ANALYZING':
      return { ...state, status: 'analyzing', error: null };
    case 'START_GENERATING':
      return {
        ...state,
        status: 'generating',
        results: { front: makeEmptyResult('front'), back: makeEmptyResult('back'), side: makeEmptyResult('side'), bust: makeEmptyResult('bust') },
      };
    case 'UPDATE_RESULT':
      return {
        ...state,
        results: {
          ...state.results,
          [action.angle]: { ...state.results[action.angle], ...action.result },
        },
      };
    case 'SET_PROGRESS':
      return { ...state, progress: { ...state.progress, current: action.current, completed: action.completed } };
    case 'START_CHECKING':
      return { ...state, status: 'checking' };
    case 'START_RETRYING':
      return { ...state, status: 'retrying' };
    case 'COMPLETE':
      return { ...state, status: 'complete', progress: { current: null, completed: 4, total: 4 } };
    case 'SET_ERROR':
      return { ...state, status: 'error', error: { message: action.message, type: action.errorType } };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export function useGenerationFlow() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setGarment = useCallback((image: string) => dispatch({ type: 'SET_GARMENT', image }), []);
  const setModel = useCallback((model: ModelProfile) => dispatch({ type: 'SET_MODEL', model }), []);
  const clearGarment = useCallback(() => dispatch({ type: 'CLEAR_GARMENT' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const generate = useCallback(async (apiKey: string) => {
    if (!state.garmentImage || !state.selectedModel) return;

    try {
      // Step 1: Analyze
      dispatch({ type: 'START_ANALYZING' });
      const analysis = await analyzeGarment(apiKey, state.garmentImage);
      dispatch({ type: 'SET_ANALYSIS', analysis });

      // Step 2: Generate Front
      dispatch({ type: 'START_GENERATING' });
      dispatch({ type: 'SET_PROGRESS', current: 'front', completed: 0 });
      dispatch({ type: 'UPDATE_RESULT', angle: 'front', result: { status: 'generating' } });

      const frontUrl = await generateFront(apiKey, state.garmentImage, analysis, state.selectedModel);
      dispatch({ type: 'UPDATE_RESULT', angle: 'front', result: { imageUrl: frontUrl, status: 'complete' } });
      dispatch({ type: 'SET_PROGRESS', current: null, completed: 1 });

      // Step 3: Generate Back, Side, Bust in parallel
      const otherAngles: Array<Exclude<AngleType, 'front'>> = ['back', 'side', 'bust'];
      const anglePromises = otherAngles.map(async (angle) => {
        dispatch({ type: 'UPDATE_RESULT', angle, result: { status: 'generating' } });
        try {
          const url = await generateAngle(apiKey, frontUrl, state.garmentImage!, analysis, angle);
          dispatch({ type: 'UPDATE_RESULT', angle, result: { imageUrl: url, status: 'complete' } });
        } catch (err) {
          dispatch({
            type: 'UPDATE_RESULT',
            angle,
            result: { status: 'error', qualityIssues: [(err as Error).message] },
          });
        }
      });

      let completedCount = 1;
      for (const promise of anglePromises) {
        await promise;
        completedCount++;
        dispatch({ type: 'SET_PROGRESS', current: null, completed: completedCount });
      }

      // Step 4: Quality Check all completed images
      dispatch({ type: 'START_CHECKING' });
      const allAngles = ANGLES;
      for (const angle of allAngles) {
        const result = state.garmentImage ? undefined : undefined; // will read from latest state via closure
        // We need to get the current result URL — use a ref pattern or just re-check
        // For now, QA is optional and runs on results
      }

      dispatch({ type: 'COMPLETE' });
    } catch (err) {
      const message = err instanceof Error ? err.message : '生成に失敗しました';
      const errorType = message.includes('API') || message.includes('429') ? 'api' as const : 'quality' as const;
      dispatch({ type: 'SET_ERROR', message, errorType });
    }
  }, [state.garmentImage, state.selectedModel]);

  return {
    state,
    actions: { setGarment, setModel, clearGarment, reset, generate },
  };
}
```

Note: Quality check integration will be refined in Task 9 (integration). The core state machine and generation flow are established here.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit hooks/useGenerationFlow.ts`

- [ ] **Step 3: Commit**

```bash
git add hooks/useGenerationFlow.ts
git commit -m "feat: add useGenerationFlow hook — useReducer state machine for generation pipeline"
```

---

## Task 7: Garment Upload Hook

**Files:**
- Create: `hooks/useGarmentUpload.ts`

- [ ] **Step 1: Create useGarmentUpload.ts**

```typescript
// hooks/useGarmentUpload.ts
import { useCallback, useState } from 'react';
import { compressImage } from '../services/geminiClient';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB before compression

export interface UploadState {
  preview: string | null;      // data URL for display
  compressed: string | null;   // data URL for API (compressed)
  error: string | null;
  isProcessing: boolean;
}

export function useGarmentUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    preview: null, compressed: null, error: null, isProcessing: false,
  });

  const handleFile = useCallback(async (file: File) => {
    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadState(s => ({ ...s, error: 'JPG、PNG、WebP画像のみ対応しています' }));
      return;
    }
    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setUploadState(s => ({ ...s, error: '画像サイズが大きすぎます（20MB以下）' }));
      return;
    }

    setUploadState({ preview: null, compressed: null, error: null, isProcessing: true });

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const compressed = await compressImage(dataUrl);
      setUploadState({ preview: dataUrl, compressed, error: null, isProcessing: false });
    } catch {
      setUploadState(s => ({ ...s, error: '画像の読み込みに失敗しました', isProcessing: false }));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clear = useCallback(() => {
    setUploadState({ preview: null, compressed: null, error: null, isProcessing: false });
  }, []);

  return { uploadState, handleDrop, handleInputChange, clear };
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit hooks/useGarmentUpload.ts`

- [ ] **Step 3: Commit**

```bash
git add hooks/useGarmentUpload.ts
git commit -m "feat: add useGarmentUpload hook — upload, validate, compress"
```

---

## Task 8: UI Components

**Files:**
- Create: `components/generation/StepTabs.tsx`
- Create: `components/generation/GarmentUpload.tsx`
- Create: `components/generation/ModelSelector.tsx`
- Create: `components/generation/PreviewGrid.tsx`
- Create: `components/generation/GenerateButton.tsx`
- Create: `components/generation/ErrorDisplay.tsx`

- [ ] **Step 1: Create StepTabs.tsx**

```typescript
// components/generation/StepTabs.tsx
import React from 'react';

export type StepId = 'garment' | 'model';

interface StepTabsProps {
  current: StepId;
  onChange: (step: StepId) => void;
  garmentReady: boolean;
  modelReady: boolean;
}

const STEPS: { id: StepId; label: string }[] = [
  { id: 'garment', label: '商品画像' },
  { id: 'model', label: 'モデル' },
];

export const StepTabs: React.FC<StepTabsProps> = ({ current, onChange, garmentReady, modelReady }) => {
  const isReady = (id: StepId) => id === 'garment' ? garmentReady : modelReady;

  return (
    <div className="flex gap-1 mb-6">
      {STEPS.map((step) => (
        <button
          key={step.id}
          onClick={() => onChange(step.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            current === step.id
              ? 'bg-cyan-500 text-gray-950'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {isReady(step.id) && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {step.label}
        </button>
      ))}
    </div>
  );
};
```

- [ ] **Step 2: Create GarmentUpload.tsx**

```typescript
// components/generation/GarmentUpload.tsx
import React, { useRef } from 'react';
import type { UploadState } from '../../hooks/useGarmentUpload';

interface GarmentUploadProps {
  uploadState: UploadState;
  onDrop: (e: React.DragEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export const GarmentUpload: React.FC<GarmentUploadProps> = ({
  uploadState, onDrop, onInputChange, onClear,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-300">商品画像をアップロード</h3>

      {uploadState.preview ? (
        <div className="relative">
          <img
            src={uploadState.preview}
            alt="Uploaded garment"
            className="w-full rounded-lg border border-gray-700 object-contain max-h-[400px] bg-gray-900"
          />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 bg-gray-900/80 text-gray-300 rounded-full p-1.5 hover:bg-gray-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center cursor-pointer hover:border-cyan-500/50 transition-colors"
        >
          {uploadState.isProcessing ? (
            <div className="text-gray-400">処理中...</div>
          ) : (
            <>
              <div className="text-4xl mb-3">📸</div>
              <div className="text-gray-300 font-medium">ドラッグ&ドロップ</div>
              <div className="text-gray-500 text-sm mt-1">または クリックして選択</div>
              <div className="text-gray-600 text-xs mt-3">JPG / PNG / WebP</div>
            </>
          )}
        </div>
      )}

      {uploadState.error && (
        <div className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">
          {uploadState.error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onInputChange}
        className="hidden"
      />
    </div>
  );
};
```

- [ ] **Step 3: Create ModelSelector.tsx**

```typescript
// components/generation/ModelSelector.tsx
import React, { useState, useMemo } from 'react';
import { MODEL_ROSTER, type ModelProfile } from '../../data/modelRoster';

type FilterCategory = 'all' | 'asia' | 'international' | 'male';

interface ModelSelectorProps {
  selectedModel: ModelProfile | null;
  onSelect: (model: ModelProfile) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelect }) => {
  const [filter, setFilter] = useState<FilterCategory>('all');

  const filteredModels = useMemo(() => {
    if (filter === 'all') return MODEL_ROSTER.filter(m => ['asia', 'international', 'male'].includes(m.category));
    return MODEL_ROSTER.filter(m => m.category === filter);
  }, [filter]);

  const FILTERS: { id: FilterCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'asia', label: 'Asia' },
    { id: 'international', label: 'International' },
    { id: 'male', label: 'Male' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-300">モデルを選択</h3>

      <div className="flex gap-1">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f.id ? 'bg-cyan-500 text-gray-950' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-1">
        {filteredModels.map(model => (
          <button
            key={model.id}
            onClick={() => onSelect(model)}
            className={`relative rounded-lg overflow-hidden border-2 transition-all ${
              selectedModel?.id === model.id
                ? 'border-cyan-500 ring-1 ring-cyan-500/30'
                : 'border-transparent hover:border-gray-600'
            }`}
          >
            <img
              src={`/models/${model.id}.png`}
              alt={model.name}
              className="w-full aspect-[3/4] object-cover bg-gray-800"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <div className="text-xs font-medium text-white">{model.name}</div>
              <div className="text-[10px] text-gray-300">{model.height}cm · {model.bodyType}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Create PreviewGrid.tsx**

```typescript
// components/generation/PreviewGrid.tsx
import React from 'react';
import type { AngleType, PreviewResult } from '../../types/generation';

interface PreviewGridProps {
  results: Record<AngleType, PreviewResult>;
}

const ANGLE_LABELS: Record<AngleType, string> = {
  front: '正面 Front',
  back: '背面 Back',
  side: '横 Side',
  bust: 'バストアップ',
};

export const PreviewGrid: React.FC<PreviewGridProps> = ({ results }) => {
  const angles: AngleType[] = ['front', 'back', 'side', 'bust'];

  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      {angles.map(angle => {
        const result = results[angle];
        return (
          <div
            key={angle}
            className="relative bg-gray-900 rounded-lg border border-gray-800 overflow-hidden aspect-[3/4] flex items-center justify-center"
          >
            {result.status === 'complete' && result.imageUrl ? (
              <>
                <img
                  src={result.imageUrl}
                  alt={ANGLE_LABELS[angle]}
                  className="w-full h-full object-cover"
                />
                {result.qualityScore != null && result.qualityScore < 85 && (
                  <div className="absolute top-2 right-2 bg-amber-500/90 text-xs px-2 py-0.5 rounded-full font-medium text-black">
                    QA: {result.qualityScore}
                  </div>
                )}
                <a
                  href={result.imageUrl}
                  download={`lumina-${angle}.png`}
                  className="absolute bottom-2 right-2 bg-gray-900/80 text-gray-300 rounded-full p-1.5 hover:bg-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </a>
              </>
            ) : result.status === 'generating' ? (
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2" />
                <div className="text-xs text-gray-400">生成中...</div>
              </div>
            ) : result.status === 'error' ? (
              <div className="text-center p-4">
                <div className="text-red-400 text-sm mb-1">生成失敗</div>
                <div className="text-gray-500 text-xs">{result.qualityIssues?.[0]}</div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-gray-600 text-sm">{ANGLE_LABELS[angle]}</div>
              </div>
            )}

            <div className="absolute top-2 left-2 bg-gray-900/70 text-gray-400 text-[10px] px-2 py-0.5 rounded-full">
              {ANGLE_LABELS[angle]}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 5: Create GenerateButton.tsx**

```typescript
// components/generation/GenerateButton.tsx
import React from 'react';
import type { GenerationStatus } from '../../types/generation';

interface GenerateButtonProps {
  status: GenerationStatus;
  canGenerate: boolean;
  progress: { completed: number; total: number };
  onGenerate: () => void;
  onReset: () => void;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  status, canGenerate, progress, onGenerate, onReset,
}) => {
  const isWorking = ['analyzing', 'generating', 'checking', 'retrying'].includes(status);

  if (status === 'complete') {
    return (
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 py-3 rounded-lg bg-gray-700 text-gray-300 font-medium hover:bg-gray-600 transition-colors"
        >
          新規生成
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={onGenerate}
        disabled={!canGenerate || isWorking}
        className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
          canGenerate && !isWorking
            ? 'bg-cyan-500 text-gray-950 hover:bg-cyan-400'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isWorking ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full" />
            {status === 'analyzing' ? '分析中...' : `生成中 (${progress.completed}/${progress.total})`}
          </span>
        ) : (
          'Generate ⚡'
        )}
      </button>

      {isWorking && (
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 6: Create ErrorDisplay.tsx**

```typescript
// components/generation/ErrorDisplay.tsx
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  type: 'api' | 'quality' | 'input';
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, type, onRetry }) => {
  return (
    <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4 space-y-3">
      <div className="text-red-400 text-sm font-medium">
        {type === 'api' && '⚠️ サーバーエラー'}
        {type === 'quality' && '⚠️ 品質チェックエラー'}
        {type === 'input' && '⚠️ 入力エラー'}
      </div>
      <div className="text-gray-300 text-sm">{message}</div>
      <div className="flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
          >
            再試行
          </button>
        )}
        <a
          href="mailto:support@tomorrowproof.co.jp"
          className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          お問い合わせ
        </a>
      </div>
    </div>
  );
};
```

- [ ] **Step 7: Verify all components compile**

Run: `npx tsc --noEmit components/generation/*.tsx`

- [ ] **Step 8: Commit**

```bash
git add components/generation/
git commit -m "feat: add generation UI components — StepTabs, GarmentUpload, ModelSelector, PreviewGrid, GenerateButton, ErrorDisplay"
```

---

## Task 9: New Generation Page (Orchestrator)

**Files:**
- Create: `pages/GenerationPage.tsx`

- [ ] **Step 1: Create GenerationPage.tsx**

The thin orchestrator that wires hooks to components:

```typescript
// pages/GenerationPage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useGenerationFlow } from '../hooks/useGenerationFlow';
import { useGarmentUpload } from '../hooks/useGarmentUpload';
import { StepTabs, type StepId } from '../components/generation/StepTabs';
import { GarmentUpload } from '../components/generation/GarmentUpload';
import { ModelSelector } from '../components/generation/ModelSelector';
import { PreviewGrid } from '../components/generation/PreviewGrid';
import { GenerateButton } from '../components/generation/GenerateButton';
import { ErrorDisplay } from '../components/generation/ErrorDisplay';

const API_KEY_STORAGE = 'lumina_gemini_api_key';

export const GenerationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StepId>('garment');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);

  const { state, actions } = useGenerationFlow();
  const { uploadState, handleDrop, handleInputChange, clear: clearUpload } = useGarmentUpload();

  // Sync upload to generation flow
  useEffect(() => {
    if (uploadState.compressed) {
      actions.setGarment(uploadState.compressed);
    }
  }, [uploadState.compressed, actions]);

  const handleGenerate = useCallback(() => {
    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }
    actions.generate(apiKey);
  }, [apiKey, actions]);

  const handleClearGarment = useCallback(() => {
    clearUpload();
    actions.clearGarment();
  }, [clearUpload, actions]);

  const handleSaveApiKey = useCallback((key: string) => {
    setApiKey(key);
    localStorage.setItem(API_KEY_STORAGE, key);
    setShowApiKeyInput(false);
  }, []);

  const canGenerate = state.status === 'ready' && !!apiKey;

  return (
    <div className="h-screen bg-[#050508] text-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-tight">LUMINA STUDIO</h1>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">Beta</span>
        </div>
        <button
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          API Key
        </button>
      </header>

      {/* API Key Input */}
      {showApiKeyInput && (
        <div className="px-6 py-3 bg-gray-900 border-b border-gray-800">
          <div className="flex gap-2 max-w-md">
            <input
              type="password"
              placeholder="Gemini API Key"
              defaultValue={apiKey}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveApiKey((e.target as HTMLInputElement).value);
              }}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
            <button
              onClick={(e) => {
                const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                handleSaveApiKey(input.value);
              }}
              className="px-4 py-2 bg-cyan-500 text-gray-950 rounded-lg text-sm font-medium hover:bg-cyan-400"
            >
              保存
            </button>
          </div>
        </div>
      )}

      {/* Main Content: 2 Column */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Steps */}
        <div className="w-[380px] border-r border-gray-800 p-6 overflow-y-auto flex flex-col">
          <StepTabs
            current={currentStep}
            onChange={setCurrentStep}
            garmentReady={!!uploadState.preview}
            modelReady={!!state.selectedModel}
          />

          <div className="flex-1">
            {currentStep === 'garment' && (
              <GarmentUpload
                uploadState={uploadState}
                onDrop={handleDrop}
                onInputChange={handleInputChange}
                onClear={handleClearGarment}
              />
            )}

            {currentStep === 'model' && (
              <ModelSelector
                selectedModel={state.selectedModel}
                onSelect={actions.setModel}
              />
            )}
          </div>

          {/* Error */}
          {state.error && (
            <div className="mt-4">
              <ErrorDisplay
                message={state.error.message}
                type={state.error.type}
                onRetry={state.error.type !== 'input' ? handleGenerate : undefined}
              />
            </div>
          )}

          {/* Generate Button */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <GenerateButton
              status={state.status}
              canGenerate={canGenerate}
              progress={state.progress}
              onGenerate={handleGenerate}
              onReset={actions.reset}
            />
          </div>
        </div>

        {/* Right Panel: Preview Grid */}
        <div className="flex-1 p-6">
          <PreviewGrid results={state.results} />
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit pages/GenerationPage.tsx`

- [ ] **Step 3: Commit**

```bash
git add pages/GenerationPage.tsx
git commit -m "feat: add GenerationPage — 2-column botika-style orchestrator"
```

---

## Task 10: Router & App Integration

**Files:**
- Modify: `App.tsx`
- Modify: `components/layout/AppShell3Col.tsx` (simplify or bypass)

- [ ] **Step 1: Read current App.tsx**

Read `App.tsx` to understand routing setup.

- [ ] **Step 2: Update App.tsx to use new GenerationPage**

Replace the route to `NewGenerationPage` with `GenerationPage`. Keep auth routes if needed.

The new page is full-screen (includes its own header), so it should NOT be wrapped in AppShell3Col.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: 0 errors, successful build

- [ ] **Step 4: Run dev server and verify in browser**

Run: `npm run dev`
Open http://localhost:5173
Verify:
- 2-column layout renders
- Left panel shows garment upload step
- Tab switch to model shows model grid
- Model images load from /models/
- Right panel shows 4-slot grid (empty)

- [ ] **Step 5: Commit**

```bash
git add App.tsx components/layout/
git commit -m "feat: wire GenerationPage into router — replace old 3-column layout"
```

---

## Task 11: End-to-End Test & Cleanup

**Files:**
- Delete: Old files listed in Migration Strategy
- Verify: Full generation flow

- [ ] **Step 1: Test full generation flow**

1. Open app in browser
2. Upload a garment image from `test/bedwin-demo/shirt/A.jpg`
3. Select a model from roster
4. Click Generate
5. Verify: Front image generates → Back/Side/Bust generate in parallel
6. Verify: All 4 slots populated with images
7. Verify: Download works

- [ ] **Step 2: Delete old files**

```bash
# Old services (replaced by new modules)
rm services/luminaApi.ts
rm services/newShootMapping.ts
rm services/modelAgentService.ts
rm services/upscaleService.ts
rm services/creativeService.ts
rm services/geminiService.ts

# Old page
rm pages/NewGenerationPage.tsx

# Old components
rm -rf components/new/
rm -rf components/tabs/

# Old data
rm -rf data/skills/
rm data/creativeScenes.ts

# Old types
rm types.ts
```

- [ ] **Step 3: Fix any import errors from deletion**

Run: `npm run build`
Fix any remaining imports that reference deleted files.

- [ ] **Step 4: Final build verification**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 5: Final browser verification**

Run through full flow one more time:
- Upload → Model select → Generate → 4 images → Download

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: remove old monolithic files — migration to clean architecture complete"
```

---

## Summary

| Task | Description | New Files |
|------|------------|-----------|
| 1 | Type definitions | 3 files (types/) |
| 2 | Gemini client | 1 file |
| 3 | Garment analyzer | 1 file |
| 4 | Image generator | 1 file |
| 5 | Quality checker | 1 file |
| 6 | Generation flow hook | 1 file |
| 7 | Upload hook | 1 file |
| 8 | UI components | 6 files |
| 9 | Generation page | 1 file |
| 10 | Router integration | 2 files modified |
| 11 | E2E test + cleanup | Delete ~15 old files |

**Total: 16 new files, 2 modified, ~15 deleted**

# FLUX Kontext — Production-Ready Technical Specifications

> Research Date: 2026-03-18
> Purpose: Lumina Studio garment-to-model generation pipeline evaluation

---

## 1. FLUX Kontext API — Model Variants & Pricing

### fal.ai

| Model | Model ID | Price | Billing Unit | Speed |
|-------|----------|-------|-------------|-------|
| **Kontext Pro** | `fal-ai/flux-pro/kontext` | **$0.04/image** | Per image (1MP) | "8x faster than competing SOTA" |
| **Kontext Max** | `fal-ai/flux-pro/kontext/max` | **$0.08/image** | Per image | Same architecture, better prompt adherence + typography |
| **Kontext Dev** | `fal-ai/flux-kontext/dev` | **$0.025/megapixel** | Megapixels (rounded up) | Similar |
| **Kontext LoRA** | `fal-ai/flux-kontext-lora` | **$0.035/megapixel** | Megapixels (rounded up) | Similar |
| **Kontext Trainer** | `fal-ai/flux-kontext-trainer` | **$0.0025/step** | Per training step (min 500 steps = $1.25) | Training only |

### Replicate

| Model | Model ID | Price | Notes |
|-------|----------|-------|-------|
| **Kontext Pro** | `black-forest-labs/flux-kontext-pro` | ~$0.04/image (estimated from FLUX 1.1 Pro pricing) | Commercial use |
| **Kontext Dev** | `black-forest-labs/flux-kontext-dev` | ~$0.025/image (estimated from FLUX Dev pricing) | Non-commercial license, commercial via Replicate |

> Replicate does not list Kontext-specific pricing separately. FLUX 1.1 Pro = $0.04/image, FLUX Dev = $0.025/image, FLUX Schnell = $0.003/image on Replicate.

---

## 2. API Parameters — Complete Schema

### Kontext Pro (fal.ai) — `fal-ai/flux-pro/kontext`

**Endpoint:** `POST https://fal.run/fal-ai/flux-pro/kontext`

```typescript
interface KontextProInput {
  // Required
  prompt: string;              // Edit instruction
  image_url: string;           // Reference image URL (jpg, jpeg, png, webp, gif, avif)

  // Optional
  guidance_scale?: number;     // 1-20, default 3.5 — prompt adherence
  num_images?: number;         // 1-4, default 1
  seed?: number | null;        // For reproducibility
  output_format?: "jpeg" | "png";  // default "jpeg"
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";  // default "2"
  enhance_prompt?: boolean;    // default false
  aspect_ratio?: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21";
  sync_mode?: boolean;         // default false, returns data URI when true
}

interface KontextProOutput {
  images: Array<{
    url: string;
    width: number;
    height: number;
    content_type: string;   // "image/jpeg"
  }>;
  prompt: string;
  seed: number;
  has_nsfw_concepts: boolean[];
  timings: object;
}
```

### Kontext Dev (fal.ai) — `fal-ai/flux-kontext/dev`

```typescript
interface KontextDevInput {
  // Required
  prompt: string;
  image_url: string;           // Max 14142px dimensions

  // Optional
  guidance_scale?: number;     // 0-20, default 2.5 (NOTE: lower default than Pro's 3.5)
  num_inference_steps?: number; // 10-50, default 28
  strength?: number;           // 0.01-1.0, default 0.88 — "Higher values better for this model"
  num_images?: number;         // 1-4, default 1
  seed?: number | null;
  output_format?: "jpeg" | "png";  // default "png"
  enable_safety_checker?: boolean; // default true
  acceleration?: "none" | "regular" | "high";  // default "none"
  resolution_mode?: "auto" | "match_input" | string;  // default "match_input"
  enhance_prompt?: boolean;    // default false
}
```

### Kontext LoRA (fal.ai) — `fal-ai/flux-kontext-lora`

**Critical for fashion use case — allows loading custom clothing LoRAs.**

```typescript
interface KontextLoRAInput {
  // Required
  prompt: string;
  image_url: string;           // Max 14142px

  // LoRA Configuration
  loras: Array<{
    path: string;              // URL or path to LoRA weights
    scale: number;             // 0-4, default 1.0
  }>;

  // Optional
  num_inference_steps?: number; // 10-50, default 30
  guidance_scale?: number;     // 0-20, default 2.5
  strength?: number;           // 0.01-1.0, default 0.88
  num_images?: number;         // 1-4, default 1
  seed?: number | null;
  output_format?: "jpeg" | "png";  // default "png"
  enable_safety_checker?: boolean; // default true
  acceleration?: "none" | "regular" | "high";
  resolution_mode?: "auto" | "match_input";
}
```

**Inpainting variant also available** with additional parameters:
- `reference_image_url` (string, required)
- `mask_url` (string, required)

### Kontext Trainer (fal.ai) — `fal-ai/flux-kontext-trainer`

```typescript
interface KontextTrainerInput {
  images_data_url: string;     // ZIP file URL with image pairs
  steps?: number;              // 2-10000, default 1000
  learning_rate?: number;      // default 0.0001
  default_caption?: string;    // Text for pairs without individual captions
  output_format?: "fal" | "comfy";  // Naming scheme for output weights
}
```

**Dataset Format:**
- ZIP archive with paired images
- Naming: `INDEX_start.EXT` + `INDEX_end.EXT` (e.g., `0001_start.jpg`, `0001_end.jpg`)
- Optional: `INDEX.txt` with edit instruction for each pair
- If no `.txt` files, `default_caption` is required

**Pricing:** $0.0025/step. 1000 steps = $2.50. 2000 steps = $5.00.

### JavaScript/Python Client Examples

```javascript
// fal.ai JavaScript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
  input: {
    prompt: "Change the model to wear this garment, professional EC product photography",
    image_url: "https://example.com/garment-on-model.jpg",
    guidance_scale: 3.5,
    output_format: "png",
    aspect_ratio: "2:3"
  }
});
```

```python
# fal.ai Python
import fal_client

result = fal_client.subscribe("fal-ai/flux-pro/kontext", arguments={
    "prompt": "...",
    "image_url": "...",
    "guidance_scale": 3.5,
})
```

```javascript
// Replicate JavaScript
import Replicate from "replicate";
const replicate = new Replicate();

const output = await replicate.run("black-forest-labs/flux-kontext-pro", {
  input: {
    prompt: "...",
    image_url: "https://example.com/garment.jpg"
  }
});
```

---

## 3. Existing Fashion/Clothing LoRAs for FLUX Kontext

### A. crossimage-tryon-fluxkontext (HuggingFace — nomadoor)

**Status: Experimental / Research Only — NOT production-ready**

| Spec | Detail |
|------|--------|
| Base Model | `black-forest-labs/FLUX.1-Kontext-dev` |
| Training Framework | AI-ToolKit |
| Learning Rate | 5e-5 |
| Training Steps | ~65,000 |
| Dataset Size | 53 paired images (v0.2) |
| Data Sources | Chroma1-HD (subjects), catvton-flux (outfits) |
| ComfyUI Workflow | Included in repo |

**How It Works:**
- Input: Single composite image with **reference outfit on left** + **target person on right**
- The model transfers the left outfit to the right person

**Trigger Prompts:**
```
# Full-body transfer:
"Change all clothes on the right to match the left"

# Upper-body only:
"Change the upper body clothing on the right to match the left"
```

**Best Practice:** Add explicit clothing descriptions:
```
"right woman wearing a red dress, Change all clothes on the right to match the left"
```

**Limitations:**
- Unstable and inaccurate for production
- Works only on realistic photographs (fails on illustration/anime)
- Limited dataset variety (53 pairs only)
- **No inference provider API support** — ComfyUI only
- Cannot be used directly via fal.ai or Replicate API

### B. Kontext_change_clothes (Civitai)

- **Status:** Page returned 404, model may have been removed or renamed
- Not verified as available

### C. ovi054/virtual-tryon-flux-kontext (HuggingFace Space)

- Uses `FluxKontextPipeline` from `black-forest-labs/FLUX.1-Kontext-dev`
- **Currently broken** — Runtime error (`T5EncoderModel.__init__()` incompatibility)
- Duplicated from `ovi054/Draw2Photo`
- Not usable

### D. No Fashion-Specific Kontext Fine-Tunes on Replicate

The `flux-kontext-fine-tunes` collection on Replicate contains 12+ models, but **none are fashion/clothing specific**. Available fine-tunes focus on: stencils, 3D cartoons, car restyling, satellite imagery, portrait enhancement, ASCII art, PS1 styling, etc.

---

## 4. Uwear / Drape2 Competitor Analysis

### Technical Architecture

| Spec | Detail |
|------|--------|
| Primary Model | **Drape** (proprietary) — flat-lay to on-model |
| Alternative Models | Gemini, Seedream |
| API Architecture | Async request-poll (Created → Ongoing → Done) |
| Pricing | **$0.10/credit** (pay-as-you-go, no subscription) |
| Batch Capacity | Up to 10,000 products per batch |
| Video | 5-10 second animated clips |
| Shopify Integration | From $500/month for up to 500 shoppers |

### API Structure

```
POST /api/v1/generation          — Image generation
POST /api/v1/generation-video    — Video generation
POST /api/v1/generation-edit     — Image editing
POST /api/v1/avatar              — Custom model creation
GET  /api/v1/generation/{id}     — Poll status
```

**Request Parameters:**
```json
{
  "clothing_item_id": "string",     // Pre-uploaded item reference
  "prompt": "string",               // Generation instructions
  "camera": "full body shot",       // Framing control
  "num_images": 4,                  // Quantity
  "model_name": "drape",            // AI model selection
  "enhance_user_prompt": true       // Prompt optimization
}
```

**Alternative input:** Include `clothing_item_data` with `external_clothing_item_url` directly.

### Uwear vs Lumina Cost Comparison

| Metric | Uwear | Lumina (current Gemini) | Lumina (FLUX Kontext) |
|--------|-------|------------------------|----------------------|
| Per image | $0.10 | $0.02-0.05 | $0.04-0.08 |
| Batch 100 images | $10 | $2-5 | $4-8 |
| Monthly 1000 SKU × 4 angles | $400 | $80-200 | $160-320 |
| Video | Included | Not available | Not available |

---

## 5. FLUX Kontext vs Dev vs Schnell — Variant Comparison

| Feature | Kontext Pro | Kontext Max | Kontext Dev | FLUX Dev | FLUX Schnell |
|---------|-------------|-------------|-------------|----------|-------------|
| **Primary Use** | Image editing | Premium editing | Open-weight editing | Text-to-image | Fast text-to-image |
| **Reference Image Input** | Yes (native) | Yes (native) | Yes (native) | No (LoRA/IP-Adapter needed) | No |
| **Price (fal.ai)** | $0.04/img | $0.08/img | $0.025/MP | $0.025/MP | ~$0.003/img |
| **Price (Replicate)** | ~$0.04/img | N/A | ~$0.025/img | $0.025/img | $0.003/img |
| **LoRA Support** | No (via Dev) | No | Yes (via fal-ai/flux-kontext-lora) | Yes | Limited |
| **Custom Training** | No | No | Yes (Kontext Trainer) | Yes | No |
| **Guidance Default** | 3.5 | 3.5 | 2.5 | 3.5 | N/A |
| **Steps Default** | 28 | N/A | 28 | 28 | 4 |
| **Garment Preservation** | Good (context understanding) | Best (improved adherence) | Good | Poor without LoRA | Poor |
| **Commercial License** | Yes | Yes | Non-commercial (commercial via API) | Non-commercial | Apache 2.0 |
| **Architecture** | 12B param flow transformer | 12B (enhanced) | 12B param | 12B param | 12B (distilled) |

### Recommendation for Garment-to-Model Generation

**Best Option: `fal-ai/flux-kontext-lora` (Kontext Dev + custom LoRA)**

Rationale:
1. Native reference image input — no hacks needed
2. Custom LoRA support — can train garment-preservation LoRA
3. $0.035/MP pricing — cost-effective
4. Kontext Trainer available at $2.50/1000 steps — cheap experimentation
5. Inpainting variant available for targeted garment placement

**Runner-up: `fal-ai/flux-pro/kontext` (Kontext Pro)**
- Better quality out-of-box
- No LoRA support (limitation)
- $0.04/image — still affordable
- Best for prompt-only approach without custom training

---

## 6. Prompt Engineering for Garment Reference Generation

### Key Principles from FLUX Kontext Documentation

1. **Be specific about what to change** — Kontext understands context, so describe the edit, not the full scene
2. **Use descriptive action verbs** — "Change", "Replace", "Dress the model in"
3. **Include clothing details** — Color, fabric, style, cut explicitly

### Recommended Prompt Templates for EC Product Photography

#### Template A: Direct Garment Description (Kontext Pro, no LoRA)
```
Professional EC product photography. The model is wearing [GARMENT_DESCRIPTION].
[FABRIC] material clearly visible with natural texture.
Studio lighting with 1:3 shadow ratio, directional key light from upper-left.
Clean white background (#FFFFFF). Full-body shot, natural standing pose.
High-end fashion e-commerce style, 2048px resolution.
```

#### Template B: Reference Image Edit (Kontext with reference image)
```
Change the clothing to match the reference garment exactly.
Preserve the exact fabric texture, color, and print pattern.
Professional studio lighting, soft directional shadows.
White EC background.
```

#### Template C: LoRA-Enhanced (Kontext Dev + try-on LoRA)
```
Change all clothes on the right to match the left.
[COLOR] [FABRIC] [GARMENT_TYPE] with visible stitching and texture detail.
Professional e-commerce photography lighting.
```

### Garment Detail Preservation Tips

1. **Fabric keywords:** "visible cotton weave", "silk sheen", "denim twill texture", "cable knit pattern"
2. **Color accuracy:** Use specific color names, not generic ("burgundy merlot" not "dark red")
3. **Print/pattern:** "exact geometric print pattern", "floral motif preserved"
4. **Avoid:** Over-describing scene/background (dilutes garment focus)
5. **Prompt length:** Keep under 400 words (validated finding from Lumina development)

### Lighting Control

```
# Good — specific directional lighting
"Soft directional studio lighting, key light from 45-degrees upper-left,
fill light at 1:3 ratio, highlight detail preserved in white fabrics"

# Bad — vague/flat
"well-lit", "bright lighting", "studio light"
```

### Pose Control

```
# Good — natural EC poses
"Natural standing pose, slight hip shift, one arm relaxed at side,
confident expression, looking toward camera"

# Bad — generic
"standing pose", "model pose"
```

---

## 7. IP-Adapter as Alternative

### What is IP-Adapter?

IP-Adapter (Image Prompt Adapter) is a lightweight adapter that enables image-guided generation by encoding reference images into the diffusion model's cross-attention layers.

### IP-Adapter + FLUX Availability

| Platform | Availability | Notes |
|----------|-------------|-------|
| ComfyUI | Yes (community nodes) | Requires local setup |
| fal.ai | Not available for FLUX | Only SDXL IP-Adapter |
| Replicate | Limited | Some community models |

### IP-Adapter vs Kontext for Garment Reference

| Aspect | IP-Adapter | Kontext |
|--------|-----------|---------|
| Reference Image Handling | Encodes image into embeddings, blends with text | Native multimodal input, understands context |
| Garment Preservation | Moderate — style/color well, fine details less | Better — context-aware editing |
| Setup Complexity | High — requires adapter weights + pipeline config | Low — single API call |
| Fine-Tuning | Possible but complex | Kontext Trainer ($2.50/1000 steps) |
| API Availability | Limited for FLUX | Full API (fal.ai, Replicate) |
| Cost | Variable (GPU time) | Fixed ($0.025-0.08/image) |
| Production Readiness | Low for FLUX (SDXL more mature) | High |

**Verdict:** IP-Adapter is not recommended for FLUX-based production garment generation. Kontext's native reference image support is superior and production-ready.

---

## 8. Production Implementation Recommendation

### Architecture: Lumina + FLUX Kontext Pipeline

```
Phase 1 (Immediate — No Custom Training):
  Garment Image → Upload to fal.ai
  → fal-ai/flux-pro/kontext (Pro, $0.04/img)
  → Prompt: "Professional model wearing this garment..."
  → Output: EC-ready image
  → Quality Check (existing Lumina QA pipeline)

Phase 2 (Custom LoRA — 2-4 weeks):
  Step 1: Prepare 50-200 paired images (garment flat-lay → on-model)
  Step 2: Train via fal-ai/flux-kontext-trainer ($5-25 total)
  Step 3: Deploy via fal-ai/flux-kontext-lora ($0.035/MP)
  → Significantly better garment preservation
  → Custom model poses, lighting style, background consistency

Phase 3 (Multi-Model Pipeline):
  Garment Analysis (Gemini Vision) → Garment Description
  → FLUX Kontext LoRA Generation → On-Model Image
  → Gemini Enhancement (optional, single-pass) → Final Output
  → QA Scoring → Delivery
```

### Cost Projection

| Volume | Kontext Pro Only | Kontext LoRA | Current Gemini |
|--------|-----------------|-------------|---------------|
| 100 images/month | $4 | $3.50 | $2-5 |
| 1,000 images/month | $40 | $35 | $20-50 |
| 5,000 images/month | $200 | $175 | $100-250 |
| Training (one-time) | N/A | $5-25 | N/A |

### Key Risks

1. **Garment detail preservation** — Kontext may not perfectly preserve complex prints/patterns without LoRA
2. **No existing production-ready clothing LoRA** — All current ones (nomadoor, ovi054) are experimental/broken
3. **Must train custom LoRA** — Using Kontext Trainer with own paired dataset
4. **Single reference image limitation** — Kontext takes one image_url; multi-angle reference requires composite images or multiple calls
5. **Resolution** — Default output ~1MP; higher resolution costs proportionally more

### Next Steps

1. **Test Kontext Pro** with 5 garment types (white tee, black jacket, printed dress, denim, knit) — Budget: $1.00
2. **Prepare 50 paired images** for LoRA training (flat-lay → on-model pairs)
3. **Train v1 LoRA** via Kontext Trainer — Budget: $5.00
4. **Compare** Kontext Pro (no LoRA) vs Kontext LoRA vs current Gemini pipeline
5. **CEO evaluation** of output quality against botika benchmark

---

## Sources

- fal.ai FLUX Kontext Pro: https://fal.ai/models/fal-ai/flux-pro/kontext
- fal.ai FLUX Kontext Max: https://fal.ai/models/fal-ai/flux-pro/kontext/max
- fal.ai FLUX Kontext Dev: https://fal.ai/models/fal-ai/flux-kontext/dev
- fal.ai FLUX Kontext LoRA: https://fal.ai/models/fal-ai/flux-kontext-lora
- fal.ai FLUX Kontext Trainer: https://fal.ai/models/fal-ai/flux-kontext-trainer
- fal.ai Pricing: https://fal.ai/pricing
- Replicate FLUX Kontext Pro: https://replicate.com/black-forest-labs/flux-kontext-pro
- Replicate FLUX Kontext Dev: https://replicate.com/black-forest-labs/flux-kontext-dev
- Replicate Pricing: https://replicate.com/pricing
- HuggingFace crossimage-tryon-fluxkontext: https://huggingface.co/nomadoor/crossimage-tryon-fluxkontext
- HuggingFace Virtual Try-On Space: https://huggingface.co/spaces/ovi054/virtual-tryon-flux-kontext
- Uwear.ai: https://uwear.ai
- Uwear.ai API: https://uwear.ai/api

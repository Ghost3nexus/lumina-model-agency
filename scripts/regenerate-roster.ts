/**
 * Roster Model Regeneration Script
 *
 * Regenerates all roster model base images at high quality using Gemini 3 Pro Image.
 * Current roster images are 640x640 JPEG — this script generates 1024x1365 (3:4) PNG.
 *
 * Usage:
 *   GEMINI_API_KEY=AIza... npx tsx scripts/regenerate-roster.ts
 *   GEMINI_API_KEY=AIza... npx tsx scripts/regenerate-roster.ts --model asia_01
 *   GEMINI_API_KEY=AIza... npx tsx scripts/regenerate-roster.ts --category asia
 *
 * Output: public/models/{model_id}.png (overwrites existing)
 * Backup: public/models/backup/{model_id}_old.png (saves original before overwrite)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inline the roster data to avoid ESM/CJS issues
interface ModelProfile {
    id: string;
    name: string;
    category: string;
    gender: 'female' | 'male';
    height: number;
    bust: number;
    waist: number;
    hips: number;
    shoes: number;
    hair: string;
    eyes: string;
    ethnicity: string;
    skinTone: string;
    age: string;
    bodyType: string;
    vibe: string;
    image: string;
}

// ─── Prompt Builder ────────────────────────────────────────────────────────

function buildModelPrompt(model: ModelProfile): string {
    const genderDesc = model.gender === 'female' ? 'female' : 'male';

    const ethnicityMap: Record<string, string> = {
        east_asian: 'East Asian',
        southeast_asian: 'Southeast Asian',
        south_asian: 'South Asian',
        japanese: 'Japanese',
        korean: 'Korean',
        chinese: 'Chinese',
        european: 'European / Caucasian',
        eastern_european: 'Eastern European',
        african: 'African',
        latin: 'Latin / Hispanic',
        latin_american: 'Latin American',
        mixed: 'Mixed ethnicity',
        middle_eastern: 'Middle Eastern',
    };

    const skinToneMap: Record<string, string> = {
        fair: 'fair/porcelain skin with neutral-cool undertone',
        light: 'light skin with warm-neutral undertone, subtle golden luminosity',
        medium: 'medium/olive skin with warm undertone',
        medium_dark: 'medium-dark warm brown skin with golden undertone',
        tan: 'tan/warm brown skin',
        deep: 'deep/rich dark brown skin with warm undertone',
    };

    const hairDescMap: Record<string, string> = {
        'Black': 'jet black, straight with natural volume, healthy blue-black sheen under light',
        'Dark Brown': 'dark brown with warm chestnut undertone, natural body',
        'Brown': 'medium brown with warm highlights, natural movement',
        'Light Brown': 'light brown with natural honey highlights, soft texture',
        'Blonde': 'natural blonde, Nordic cool-toned, strand separation visible',
        'Platinum': 'platinum ash blonde, deliberately styled, editorial edge',
        'Auburn': 'auburn red-brown, rich warm tones',
        'Silver': 'distinguished silver-grey, naturally salt-and-pepper transition, well-groomed',
        'Silver White': 'pure silver-white, elegant and luminous, healthy thickness',
        'Salt & Pepper': 'salt-and-pepper grey-brown mix, rugged and distinguished, natural transition',
        'Black Curly': 'jet black, natural curly texture with defined coils, volume and bounce',
        'Red': 'natural red, warm copper tones',
    };

    const agePrompt = (() => {
        if (model.age.includes('8-10')) return 'a child around 8-10 years old with bright, youthful features';
        if (model.age.includes('16-18')) return 'a teenager around 16-18 years old with youthful features and emerging adult bone structure';
        if (model.age.includes('20s')) return 'in their early-to-mid 20s with youthful, defined features';
        if (model.age.includes('30s')) return 'in their early 30s with refined, mature features';
        if (model.age.includes('40s-50s')) return 'in their late 40s to early 50s with distinguished, weathered features — subtle lines around eyes and mouth that add character';
        if (model.age.includes('60s-70s')) return 'in their 60s-70s with graceful aging — visible laugh lines, refined bone structure, wisdom in the eyes';
        return `age: ${model.age}`;
    })();

    return `
GENERATE A MODEL AGENCY COMP CARD / DIGITALS PHOTO — REAL AGENCY STANDARD.

REFERENCE: This must look IDENTICAL to digitals from Tokyo model agencies like
TOKYO REBELS, WIZARD MODELS, DONNA MODELS, BARK IN STYLE.
NOT a product shot. NOT a mannequin. This is a REAL MODEL'S agency portfolio photo.

OBJECTIVE: Create a full-body "digitals" photo — the standard test shot that model agencies
use on their website roster pages. Clean, simple, but the model looks ALIVE and REAL.
This will be used as a base for virtual try-on garment fitting.

MODEL — "${model.name}":
- Gender: ${genderDesc}
- Ethnicity: ${ethnicityMap[model.ethnicity] ?? model.ethnicity}
- Age: ${agePrompt}
- Skin: ${skinToneMap[model.skinTone] ?? model.skinTone}
- Hair: ${hairDescMap[model.hair] ?? model.hair}
- Eyes: ${model.eyes} eyes
- Body: ${model.bodyType} build, ${model.height}cm tall
- Measurements: B${model.bust} / W${model.waist} / H${model.hips}
- Character: ${model.vibe}

FACE & EXPRESSION (THIS MAKES OR BREAKS THE IMAGE):
- Expression: NATURAL and ALIVE — like a real person standing in front of a camera
  NOT a dead stare. NOT a mannequin face. NOT an AI-generated "perfect" face.
  Slight warmth in the eyes. Quiet confidence. The look of someone who models professionally.
  Think: the relaxed-but-aware expression you see on agency digitals pages.
- ${model.age.includes('60') || model.age.includes('70') ? 'AGING: Natural wrinkles, laugh lines, age spots — these are BEAUTIFUL features. Do NOT smooth or youth-ify.' : ''}
- Skin: REAL skin texture — visible pores, subtle T-zone sheen, natural sebum
  NOT airbrushed. NOT plastic. NOT porcelain-smooth.
  Tiny natural imperfections: a subtle mole, slight skin variation, micro-texture
- Eyes: Clear iris with natural catchlight. Individual eyelash separation.
  Eyes should have LIFE in them — not empty AI-generated stare.
- Lips: Natural color, subtle moisture. No heavy lipstick.
- Hair: Styled but natural — like the model walked in for a test shoot.
  Natural movement, not stiff. Some flyaways are fine — they look real.
  Visible strand detail, natural scalp line and part.
- Minimal makeup: ${model.gender === 'female' ? 'Light foundation, natural brows, maybe subtle mascara. NO heavy contour, NO bold lip, NO smoky eye. Agency digitals are about showing the model, not the makeup.' : 'Clean face, well-groomed brows. Natural skin.'}

CLOTHING (MINIMAL — SHOWS THE BODY):
- ${model.gender === 'female' ? 'Simple fitted light grey TANK TOP or CAMISOLE + light grey fitted BIKE SHORTS (ending 2-3 inches above the knee, mid-thigh length)' : 'Simple fitted light grey CREW-NECK T-SHIRT + light grey SWEAT SHORTS (ending at mid-thigh, 5-6 inch inseam — like Nike or Champion athletic shorts. NOT underwear, NOT boxer briefs, NOT compression shorts. Real casual cotton shorts with visible hem and slightly loose fit around the thigh.)'}
- Barefoot (standard for agency digitals)
- NO accessories, NO jewelry, NO watches, NO bags
- Clothing is TIGHT-FITTING to show body silhouette clearly
- Clothing color: light warm grey (RGB 200, 198, 195)
- Clothing should look like real fabric — not painted on, visible fabric texture

BODY & PROPORTIONS:
- Natural proportions for ${model.height}cm / ${model.bodyType} build
- B${model.bust} W${model.waist} H${model.hips} reflected naturally in silhouette
- Natural shoulder line, visible collarbone
- Hands: anatomically correct (5 fingers each), fingers naturally relaxed
- Feet: barefoot, natural positioning on floor
- Skin tone consistent from face to body

POSE — AGENCY DIGITALS STYLE (NOT STIFF):
- Facing camera, body angled very slightly (5-10° — NOT perfectly symmetrical robot pose)
- Weight shifted naturally to one leg — subtle S-curve in the body
  (like a model waiting between shots, not a military "attention" stance)
- Arms relaxed at sides, one arm slightly more bent than the other
  Fingers naturally curled, not rigidly pointing down
- Head: looking at camera, chin very slightly lifted (confidence, not arrogance)
  Head can be tilted 1-2° — adds life vs. perfectly centered
- Overall: the pose should look EFFORTLESS. Like the model just stopped and looked at the camera.
  NOT posed. NOT stiff. NOT symmetrical. Natural asymmetry is KEY.

PHOTOGRAPHY:
- BACKGROUND: Clean light grey seamless paper (RGB 228, 228, 226) — standard agency studio
  The background must be COMPLETELY CLEAN — NO equipment, NO softboxes, NO light stands,
  NO reflectors, NO studio gear visible ANYWHERE in the frame. Just smooth seamless paper.
- LIGHTING: Soft, flattering, natural-looking studio light
  The lighting should look natural and professional, but NO lighting equipment should be visible.
  All lights, softboxes, reflectors must be OUTSIDE the frame.
  Fill light to keep shadows soft but present (NOT flat/shadowless)
  Subtle separation from background — model doesn't look "pasted on"
- Color: Neutral 5500K daylight. No color cast. Skin tones must be accurate.
- Exposure: Well-exposed — skin at proper mid-tone brightness
  NO blown highlights. NO underexposure. Natural tonal range.
- FRAMING: CRITICAL — FULL BODY must be visible from TOP OF HEAD to TOES.
  Portrait orientation (3:4 aspect ratio).
  GENEROUS headroom: at least 8-10% space above the crown of the head.
  GENEROUS floor space: at least 5-8% space below the feet.
  Model fills 65-75% of frame height — do NOT crop tight.
  The ENTIRE head (including hair top) and BOTH feet must be fully visible.
- DEPTH OF FIELD: f/5.6-f/8 — model sharp, background slightly soft
- Camera: Medium format quality. Sharp but not clinical.

CRITICAL — WHAT MAKES AGENCY DIGITALS LOOK REAL:
1. ASYMMETRY: Real people are NOT perfectly symmetrical. Slight differences between left/right.
2. WEIGHT SHIFT: Nobody stands with weight perfectly even. One hip slightly higher.
3. MICRO-EXPRESSIONS: Eyes alive, slight muscle tension around mouth. Not blank.
4. SKIN TEXTURE: Real skin has texture, variation, subtle imperfections. Not smooth plastic.
5. HAIR IMPERFECTION: A few flyaways, natural part, not helmet-perfect.
6. FABRIC FOLDS: Real clothing wrinkles at joints, gathers at waist. Not skin-painted.
7. NATURAL SHADOWS: Soft shadow under chin, between fingers, under arms. Light has direction.

DO NOT:
- Make it look AI-generated, CGI, or digitally painted
- Over-smooth skin or remove all texture
- Create a symmetrical robot pose
- Make the expression blank or dead
- Over-light (flat lighting kills dimensionality)
- Make it look like a 3D render or video game character
- Add any artistic filters or color grading
- Show ANY studio equipment (softboxes, light stands, reflectors, umbrellas) in the frame
- Make male shorts look like underwear or boxer briefs — they must be REAL athletic shorts`;
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Error: Set GEMINI_API_KEY environment variable');
        process.exit(1);
    }

    // Parse args
    const args = process.argv.slice(2);
    let filterModel: string | null = null;
    let filterCategory: string | null = null;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--model' && args[i + 1]) filterModel = args[++i];
        if (args[i] === '--category' && args[i + 1]) filterCategory = args[++i];
    }

    // Import roster data dynamically
    const rosterModule = await import('../data/modelRoster');
    let models: ModelProfile[] = rosterModule.MODEL_ROSTER;

    if (filterModel) {
        models = models.filter(m => m.id === filterModel);
    } else if (filterCategory) {
        models = models.filter(m => m.category === filterCategory);
    }

    if (models.length === 0) {
        console.error('No models found matching filter');
        process.exit(1);
    }

    console.log(`\n🎬 Regenerating ${models.length} roster models...\n`);

    const outDir = path.resolve(__dirname, '../public/models');
    const backupDir = path.join(outDir, 'backup');
    fs.mkdirSync(backupDir, { recursive: true });

    // Dynamic import of Google GenAI
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    let success = 0;
    let failed = 0;

    for (const model of models) {
        const outFile = path.join(outDir, `${model.id}.png`);
        const backupFile = path.join(backupDir, `${model.id}_old.png`);

        console.log(`📸 [${model.id}] ${model.name} (${model.category}) — generating...`);

        // Backup existing
        if (fs.existsSync(outFile) && !fs.existsSync(backupFile)) {
            fs.copyFileSync(outFile, backupFile);
            console.log(`   💾 Backed up original to backup/${model.id}_old.png`);
        }

        const prompt = buildModelPrompt(model);

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    responseModalities: ['IMAGE', 'TEXT'],
                    temperature: 0.6,
                },
            });

            let imageData: string | null = null;
            if (response.candidates?.[0]?.content) {
                for (const part of response.candidates[0].content.parts || []) {
                    if (part.inlineData?.data) {
                        imageData = part.inlineData.data;
                        break;
                    }
                }
            }

            if (!imageData) {
                console.log(`   ❌ No image returned`);
                failed++;
                continue;
            }

            // Save as PNG
            const buffer = Buffer.from(imageData, 'base64');
            fs.writeFileSync(outFile, buffer);

            const sizeKB = Math.round(buffer.length / 1024);
            console.log(`   ✅ Saved ${model.id}.png (${sizeKB}KB)`);
            success++;

            // Rate limit — wait 3 seconds between requests
            if (models.indexOf(model) < models.length - 1) {
                console.log(`   ⏳ Waiting 3s...`);
                await new Promise(r => setTimeout(r, 3000));
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.log(`   ❌ Failed: ${msg}`);
            failed++;

            // On rate limit, wait longer
            if (msg.includes('429') || msg.includes('rate')) {
                console.log(`   ⏳ Rate limited — waiting 30s...`);
                await new Promise(r => setTimeout(r, 30000));
            }
        }
    }

    console.log(`\n📊 Results: ${success} succeeded, ${failed} failed out of ${models.length} total\n`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});

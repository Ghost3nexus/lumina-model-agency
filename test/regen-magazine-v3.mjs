/**
 * Magazine shot regeneration v3 — Gender & character-aware
 *
 * Each model gets prompts tailored to their:
 * - Gender (MALE/FEMALE explicitly stated)
 * - Vibe/brand world (from agencyModels data)
 * - Ethnicity/look (from hair/eyes description)
 *
 * Interrupt-safe: skips existing files unless --force flag
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/regen-magazine-v3.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/regen-magazine-v3.mjs men-intl-01
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/regen-magazine-v3.mjs --force
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });
const args = process.argv.slice(2);
const force = args.includes('--force');
const targetId = args.find(a => !a.startsWith('--'));

const PORTRAIT = `\nCRITICAL: Image MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio). Vertical like a magazine page.`;

// ── Model definitions with gender + styling direction ──

const MODELS = {
  // ─── Ladies International ───
  'ladies-intl-01': {
    gender: 'female', name: 'ELENA',
    desc: 'Scandinavian woman, ash blonde straight long hair, blue-grey eyes, 179cm',
    brands: 'Jil Sander, The Row, Totême',
    menswear: false,
  },
  'ladies-intl-02': {
    gender: 'female', name: 'AMARA',
    desc: 'Black woman, buzz cut hair, dark brown eyes, 181cm, striking bone structure',
    brands: 'Balenciaga, Rick Owens, Comme des Garçons',
    menswear: false,
  },
  'ladies-intl-03': {
    gender: 'female', name: 'SOFIA',
    desc: 'Mediterranean woman, dark chestnut natural wave hair, brown amber eyes, 177cm',
    brands: 'Valentino, Bottega Veneta, Loewe',
    menswear: false,
  },
  // ─── Ladies Asia ───
  'ladies-asia-01': {
    gender: 'female', name: 'MIKU',
    desc: 'Japanese woman, black blunt bob hair, dark brown monolid eyes, 175cm',
    brands: 'Comme des Garçons, Sacai, Issey Miyake',
    menswear: false,
  },
  'ladies-asia-02': {
    gender: 'female', name: 'HARIN',
    desc: 'Korean woman, black long straight hair, dark brown double lid eyes, 174cm, elegant',
    brands: 'Celine, The Row, quiet luxury',
    menswear: false,
  },
  'ladies-asia-03': {
    gender: 'female', name: 'LIEN',
    desc: 'Vietnamese-French woman, dark brown modern shag hair, dark brown almond eyes, 176cm',
    brands: 'Dior, Loewe, Mame Kurogouchi',
    menswear: false,
  },
  // ─── Men International ───
  'men-intl-01': {
    gender: 'male', name: 'IDRIS',
    desc: 'Black man, short fade haircut, dark brown eyes, 189cm, strong jawline, athletic build',
    brands: 'Prada, Dior Homme, Louis Vuitton Men',
    menswear: true,
  },
  'men-intl-02': {
    gender: 'male', name: 'LARS',
    desc: 'Scandinavian man, sandy blonde medium hair, light blue eyes, 187cm, lean build',
    brands: 'COS, Lemaire, Our Legacy',
    menswear: true,
  },
  'men-intl-03': {
    gender: 'male', name: 'MATEO',
    desc: 'Mediterranean man, dark brown wavy hair, dark brown eyes, 185cm, olive skin',
    brands: 'Tom Ford, Zegna, Brunello Cucinelli',
    menswear: true,
  },
  // ─── Men Asia ───
  'men-asia-01': {
    gender: 'male', name: 'SHOTA',
    desc: 'Japanese man, black medium natural hair, dark brown monolid eyes, 183cm, clean-cut',
    brands: 'Issey Miyake, HOMME PLISSÉ, Auralee',
    menswear: true,
  },
  'men-asia-02': {
    gender: 'male', name: 'JIHO',
    desc: 'Korean man, black medium-long soft hair, dark brown double lid eyes, 182cm, androgynous features',
    brands: 'Raf Simons, Loewe, Wooyoungmi',
    menswear: true,
  },
  'men-asia-03': {
    gender: 'male', name: 'TAKU',
    desc: 'Japanese man, black with grey temples short hair, dark brown eyes, 180cm, mature distinguished look',
    brands: 'Auralee, COMOLI, Markaware',
    menswear: true,
  },
  // ─── Influencer ───
  'influencer-girl-01': {
    gender: 'female', name: 'RINKA',
    desc: 'Japanese woman, pink-ash shoulder length hair, dark brown eyes, 165cm, creative style',
    brands: 'AMBUSH, sacai, Harajuku creative',
    menswear: false,
  },
  'influencer-boy-01': {
    gender: 'male', name: 'KAI',
    desc: 'Mixed-heritage man, dark brown curly-wavy hair, light brown eyes, 178cm, relaxed surfer vibe',
    brands: 'Stüssy, BEAMS, Ron Herman',
    menswear: true,
  },
};

// ── Shot templates (gender-aware) ──

function getShots(model) {
  const { gender, brands, menswear, desc } = model;
  const genderWord = gender === 'male' ? 'MALE' : 'FEMALE';
  const heShePronoun = gender === 'male' ? 'He' : 'She';
  const hisHer = gender === 'male' ? 'his' : 'her';

  // Gender-appropriate outfit descriptions
  const outfitVerve = menswear
    ? `a sharp, architectural ${brands.split(',')[0]} menswear look — structured blazer or coat with strong shoulders, tailored trousers, leather boots`
    : `a dramatic, architectural designer outfit — avant-garde couture with structured shoulders, unusual silhouette, from brands like ${brands}`;

  const outfitForm = menswear
    ? `a beautifully constructed menswear look — visible topstitching, raw selvedge denim or tailored wool trousers, unlined jacket showing construction. Brands like ${brands}`
    : `a beautifully tailored designer look — visible seams, interesting fabric textures, architectural cut. Brands like ${brands}`;

  const outfitMuse = menswear
    ? `a relaxed but considered menswear outfit — worn-in leather jacket or soft knit, well-fitting jeans or chinos. The kind of outfit ${hisHer} ${brands.split(',')[0]} customer wears on a day off`
    : `a beautiful but understated outfit — something elegant yet relaxed from ${brands}. The kind of outfit worn to a private gallery opening`;

  const outfitCampaign = menswear
    ? `an elegant menswear look for a ${brands.split(',')[0]} campaign — tailored suit or separates, impeccable fit, minimal accessories. Think GQ or Esquire full-page ad`
    : `an elegant coordinated look for a ${brands.split(',')[0]} campaign — impeccable styling, minimal accessories. Think Vogue or Harper's Bazaar full-page ad`;

  return [
    {
      name: 'verve-cover',
      prompt: `VERVE Magazine cover photo. A ${genderWord} high-fashion model. ${desc}.
${heShePronoun} is wearing ${outfitVerve}.
Dramatic directional studio lighting with deep shadows creating contrast on the face and body.
The mood is powerful, intimate, and luminous. Clean dark or gradient background.
CRITICAL: This is a ${genderWord} model. ${menswear ? 'MENSWEAR only. No makeup, no feminine styling.' : 'Feminine styling appropriate for a luxury fashion magazine.'}${PORTRAIT}`
    },
    {
      name: 'form-editorial',
      prompt: `FORM Magazine editorial. A ${genderWord} fashion model. ${desc}.
Full body photograph focusing on the STRUCTURE and CONSTRUCTION of clothing.
${heShePronoun} is wearing ${outfitForm}.
The pose is sculptural, geometric. Studio setting, concrete grey or paper white background.
CRITICAL: This is a ${genderWord} model. ${menswear ? 'MENSWEAR only. Strong masculine pose. No makeup.' : 'Feminine but architectural pose.'}${PORTRAIT}`
    },
    {
      name: 'muse-portrait',
      prompt: `MUSE Magazine intimate portrait. A ${genderWord} model. ${desc}.
Cinematic film-like style with warm grain and slightly faded tones (Kodak Portra 400 feel).
${heShePronoun} is wearing ${outfitMuse}.
The expression is vulnerable, real, authentic — a genuine moment captured.
Soft natural window light. Intimate storytelling mood.
CRITICAL: This is a ${genderWord} model. ${menswear ? 'MENSWEAR only. Natural masculine appearance, no makeup, no feminine accessories.' : 'Natural feminine beauty, minimal makeup.'}${PORTRAIT}`
    },
    {
      name: 'campaign',
      prompt: `Luxury brand campaign photograph. A ${genderWord} fashion model. ${desc}.
Full body, wearing ${outfitCampaign}.
Strong editorial lighting, clean background. Confident, assured pose.
CRITICAL: This is a ${genderWord} model. ${menswear ? 'MENSWEAR campaign. Masculine styling only. No makeup, no feminine elements.' : 'Womenswear campaign. Elegant feminine styling.'}${PORTRAIT}`
    },
  ];
}

async function regenerateModel(modelId) {
  const model = MODELS[modelId];
  if (!model) { console.error(`Unknown model: ${modelId}`); return; }

  const dir = `public/agency-models/${modelId}`;
  if (!fs.existsSync(dir)) { console.error(`Dir not found: ${dir}`); return; }

  // Load identity refs
  const refFiles = ['polaroid-front.png', 'polaroid-face.png'];
  const refs = [];
  for (const f of refFiles) {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) refs.push(fs.readFileSync(p).toString('base64'));
  }

  const shots = getShots(model);
  console.log(`\n=== ${model.name} (${modelId}) — ${model.gender.toUpperCase()} — ${model.brands} ===`);
  console.log(`  ${refs.length} identity refs`);

  for (const shot of shots) {
    const outPath = path.join(dir, `${shot.name}.png`);

    if (!force && fs.existsSync(outPath)) {
      console.log(`  ${shot.name} — exists, skip (use --force to override)`);
      continue;
    }

    console.log(`  ${shot.name}...`);

    const parts = [];
    if (refs.length > 0) {
      parts.push({ text: `IDENTITY LOCK — Generate the EXACT SAME ${model.gender === 'male' ? 'man' : 'woman'} shown in these reference photos. Match every facial feature precisely. This is a ${model.gender.toUpperCase()} model:` });
      for (const r of refs) parts.push({ inlineData: { mimeType: 'image/png', data: r } });
    }
    parts.push({ text: shot.prompt });

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const resp = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: [{ role: 'user', parts }],
          config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
        });
        for (const p of resp.candidates?.[0]?.content?.parts || []) {
          if (p.inlineData) {
            fs.writeFileSync(outPath, Buffer.from(p.inlineData.data, 'base64'));
            console.log(`  OK (attempt ${attempt})`);
            break;
          }
        }
        if (fs.existsSync(outPath) && fs.statSync(outPath).mtimeMs > Date.now() - 30000) break;
      } catch (e) {
        console.error(`  FAIL attempt ${attempt}: ${e.message}`);
        if (attempt < 2) await new Promise(r => setTimeout(r, 10000));
      }
    }
    await new Promise(r => setTimeout(r, 3000));
  }
}

// ── Main ──

const modelIds = targetId ? [targetId] : Object.keys(MODELS);
console.log(`Models to process: ${modelIds.length}`);
console.log(`Force: ${force}`);
console.log(`Time: ${new Date().toLocaleString('ja-JP')}\n`);

for (const id of modelIds) {
  await regenerateModel(id);
  await new Promise(r => setTimeout(r, 5000));
}

console.log(`\n=== Done: ${new Date().toLocaleString('ja-JP')} ===`);

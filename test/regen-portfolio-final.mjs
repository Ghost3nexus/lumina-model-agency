/**
 * Portfolio generation — CEO-approved direction per model
 *
 * Rules:
 * - NO magazine names in prompts (VOGUE, GQ, etc.)
 * - Each model has unique shots matching their character/brands
 * - Gender explicitly stated
 * - Interrupt-safe: skip existing unless --force
 *
 * Usage:
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/regen-portfolio-final.mjs
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/regen-portfolio-final.mjs men-intl-01
 *   source .env.local && GEMINI_API_KEY=$GEMINI_API_KEY node test/regen-portfolio-final.mjs --force
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

const PORTRAIT = `\nImage MUST be PORTRAIT orientation (taller than wide, ~2:3 ratio).`;

// ── Per-model portfolio definitions (CEO approved 2026-03-22) ──

const ROSTER = {
  // ═══ Ladies International ═══
  'ladies-intl-01': {
    gender: 'female', name: 'ELENA',
    identity: 'Scandinavian woman, ash blonde straight long hair, blue-grey eyes, 179cm',
    shots: [
      { name: 'campaign', prompt: `FEMALE fashion model. Scandinavian woman, ash blonde straight long hair, blue-grey eyes.
Wearing an all-black minimal outfit in the world of The Row / Jil Sander — oversized wool coat, slim black trousers, leather boots. Clean, architectural.
Full body, white studio background, soft directional lighting. Cool, intellectual expression. No smile.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `FEMALE fashion model. Scandinavian woman, ash blonde straight long hair, blue-grey eyes.
Wearing a structured ivory wool coat, high collar, belt at waist. Jil Sander aesthetic — pure minimalism.
Half body portrait, light grey background, dramatic side lighting creating strong shadows. Powerful gaze.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `FEMALE fashion model. Scandinavian woman, ash blonde straight long hair, blue-grey eyes.
Byredo / Aesop aesthetic beauty close-up. Bare skin, no visible makeup, natural texture. Hair pulled back showing bone structure.
Face and shoulders, warm neutral background, soft beauty dish lighting with catchlights in eyes. Serene, contemplative.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `FEMALE fashion model. Scandinavian woman, ash blonde straight long hair, blue-grey eyes.
Wearing a relaxed cream cashmere knit and high-waist indigo jeans. COS / Arket everyday elegance.
Full body, natural window light, minimal apartment interior. Candid, at-ease moment.${PORTRAIT}` },
    ],
  },

  'ladies-intl-02': {
    gender: 'female', name: 'AMARA',
    identity: 'Black woman, buzz cut hair, dark brown eyes, 181cm, striking bone structure',
    shots: [
      { name: 'campaign', prompt: `FEMALE fashion model. Black woman, buzz cut, dark brown eyes, 181cm, striking angular bone structure.
Wearing head-to-toe black Rick Owens — draped asymmetric dress with leather harness, platform boots. Dark sculptural fashion.
Full body, dark grey gradient background, dramatic directional lighting. Powerful, defiant pose.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `FEMALE fashion model. Black woman, buzz cut, dark brown eyes, striking bone structure.
Wearing a Balenciaga-style oversized padded jacket in electric blue, paired with bodycon leggings and chunky sneakers. Street meets haute couture.
Full body, concrete urban backdrop, overcast daylight feel. Confident stride.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `FEMALE fashion model. Black woman, buzz cut, dark brown eyes, striking bone structure.
Art-fashion portrait. Wearing a sculptural white Comme des Garçons piece with exaggerated volume.
Upper body, pure white background, high-contrast studio flash. The clothing is architecture.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `FEMALE fashion model. Black woman, buzz cut, dark brown eyes.
Marine Serre-inspired sustainable fashion — crescent moon print bodysuit layered under deconstructed trench coat.
Full body, industrial space with raw concrete, warm tungsten light. Raw, editorial.${PORTRAIT}` },
    ],
  },

  'ladies-intl-03': {
    gender: 'female', name: 'SOFIA',
    identity: 'Mediterranean woman, dark chestnut natural wave hair, brown amber eyes, 177cm',
    shots: [
      { name: 'campaign', prompt: `FEMALE fashion model. Mediterranean woman, dark chestnut wavy hair, brown amber eyes, 177cm, warm olive skin.
Wearing Bottega Veneta aesthetic — rich chocolate brown leather coat, woven leather bag, earth-tone knit underneath.
Full body, warm beige studio background, golden-hour directional lighting. Elegant, assured.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `FEMALE fashion model. Mediterranean woman, dark chestnut wavy hair, brown amber eyes.
Wearing a flowing Valentino-red silk dress, cinched waist, dramatic movement in fabric. Glamour and power.
Full body, deep grey background, theatrical lighting from above. Hair in motion.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `FEMALE fashion model. Mediterranean woman, dark chestnut wavy hair, brown amber eyes.
Summer Jacquemus feeling — oversized cream linen blazer, nothing underneath, high-waist wide white trousers, straw hat.
Full body, bright white background, harsh summer sunlight feel. Effortless sensuality.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `FEMALE fashion model. Mediterranean woman, dark chestnut wavy hair, brown amber eyes.
Max Mara campaign style — camel double-breasted wool coat, black turtleneck, tailored trousers, leather gloves.
Full body, clean grey background, crisp autumn lighting. Urban sophistication.${PORTRAIT}` },
    ],
  },

  // ═══ Ladies Asia ═══
  'ladies-asia-01': {
    gender: 'female', name: 'MIKU',
    identity: 'Japanese woman, black blunt bob, dark brown monolid eyes, 175cm',
    shots: [
      { name: 'campaign', prompt: `FEMALE fashion model. Japanese woman, black blunt bob, dark brown monolid eyes, 175cm. Sharp features.
Wearing Sacai-style layered outfit — hybrid MA-1 bomber spliced with pleated skirt panel, deconstructed knitwear underneath, chunky sole boots.
Full body, white studio, directional lighting. Composed, confident.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `FEMALE fashion model. Japanese woman, black blunt bob, dark brown monolid eyes.
Wearing all-black Comme des Garçons — oversized deconstructed blazer, raw-edge hems, asymmetric draping. Monochrome severity.
Full body, dark background, single hard light source from side. Architectural pose.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `FEMALE fashion model. Japanese woman, black blunt bob, dark brown monolid eyes.
NARS beauty campaign style. Close-up portrait. Sharp graphic eye makeup with bold red lip. Flawless matte skin. Hair slicked.
Face and shoulders, neutral grey background, ring light with dramatic shadow. Striking.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `FEMALE fashion model. Japanese woman, black blunt bob, dark brown monolid eyes.
Hyke / CFCL-style modern Tokyo look — technical knit dress in muted sage green, clean lines, minimal.
Full body, white background, soft even lighting. Walking pose, natural movement. Contemporary Tokyo.${PORTRAIT}` },
    ],
  },

  'ladies-asia-02': {
    gender: 'female', name: 'HARIN',
    identity: 'Korean woman, black long straight hair, dark brown double lid eyes, 174cm',
    shots: [
      { name: 'campaign', prompt: `FEMALE fashion model. Korean woman, black long straight hair, dark brown double lid eyes, 174cm. Refined, elegant.
Wearing Celine minimal style — tailored black blazer, white silk shirt, high-waist cream trousers, polished leather loafers. Quiet luxury.
Full body, clean white background, soft studio lighting. Poised, understated confidence.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `FEMALE fashion model. Korean woman, black long straight hair, dark brown double lid eyes.
K-beauty editorial close-up. Dewy glass skin, soft gradient lip, luminous highlight on cheekbones. Sulwhasoo / Hera aesthetic.
Face and shoulders, soft peach-toned background, beauty dish lighting. Serene, glowing.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `FEMALE fashion model. Korean woman, black long straight hair, dark brown double lid eyes.
Lemaire-style natural dressing — oversized oatmeal linen shirt, wide caramel trousers, leather belt, flat sandals. Earth tones.
Full body, warm neutral background, soft natural window light feel. Relaxed elegance.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `FEMALE fashion model. Korean woman, black long straight hair, dark brown double lid eyes.
Modern Korean fashion — Low Classic style. Structured shoulder blazer in dusty pink, matching wide trousers, minimal gold jewelry.
Full body, light grey background, clean studio lighting. Contemporary Seoul elegance.${PORTRAIT}` },
    ],
  },

  'ladies-asia-03': {
    gender: 'female', name: 'LIEN',
    identity: 'Vietnamese-French woman, dark brown modern shag hair, dark brown almond eyes, 176cm',
    shots: [
      { name: 'campaign', prompt: `FEMALE fashion model. Vietnamese-French woman, dark brown modern shag hair, dark brown almond eyes, 176cm.
Wearing Dior feminine aesthetic — structured Bar jacket in navy, high-waist pleated midi skirt, pointed slingback heels. Parisian couture.
Full body, elegant light grey background, classic fashion studio lighting. Graceful, refined.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `FEMALE fashion model. Vietnamese-French woman, dark brown modern shag hair, dark brown almond eyes.
Loewe craft-meets-fashion — oversized woven leather jacket in tan, flowing silk print dress underneath. Artisanal luxury.
Full body, earthy warm background, soft directional lighting. Thoughtful, artistic expression.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `FEMALE fashion model. Vietnamese-French woman, dark brown modern shag hair, dark brown almond eyes.
Mame Kurogouchi Japanese delicacy — sheer knit top with intricate weave pattern, midi skirt in muted lavender, minimal.
Full body, white background, soft diffused lighting. The garment texture is the focus. Gentle pose.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `FEMALE fashion model. Vietnamese-French woman, dark brown modern shag hair, dark brown almond eyes.
Casual Parisian street style — vintage-wash denim jacket, Breton stripe top, pleated khaki trousers, canvas sneakers.
Full body, natural daylight, simple clean background. Easy confidence, slight smile.${PORTRAIT}` },
    ],
  },

  // ═══ Men International ═══
  'men-intl-01': {
    gender: 'male', name: 'IDRIS',
    identity: 'Black man, short fade haircut, dark brown eyes, 189cm, strong jawline, athletic build',
    shots: [
      { name: 'campaign', prompt: `MALE fashion model. Black man, short fade haircut, dark brown eyes, 189cm, strong jaw, athletic build.
Wearing a sharp Prada-style double-breasted navy suit, white dress shirt, no tie, polished black leather shoes. Power tailoring.
Full body, clean grey background, hard directional studio lighting. Commanding presence, direct gaze. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `MALE fashion model. Black man, short fade haircut, dark brown eyes, strong jaw, athletic build.
Wearing Dior Homme monochrome — slim black wool coat, black turtleneck, narrow trousers, Chelsea boots. All black, sharp silhouette.
Full body, dark background, dramatic chiaroscuro lighting. Intense, editorial. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `MALE fashion model. Black man, short fade haircut, dark brown eyes, athletic build.
Wearing relaxed Fear of God / ESSENTIALS style — oversized stone-grey hoodie, relaxed black trousers, white chunky sneakers. Elevated streetwear.
Full body, white background, clean even lighting. Hands in pockets, relaxed confident stance. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `MALE fashion model. Black man, short fade haircut, dark brown eyes, strong jaw.
Menswear magazine portrait. Wearing charcoal suit jacket, open-collar white linen shirt. No tie.
Head and upper body, warm studio lighting, shallow depth of field feel. Confident half-smile. NO makeup. MENSWEAR only.${PORTRAIT}` },
    ],
  },

  'men-intl-02': {
    gender: 'male', name: 'LARS',
    identity: 'Scandinavian man, sandy blonde medium hair, light blue eyes, 187cm, lean build',
    shots: [
      { name: 'campaign', prompt: `MALE fashion model. Scandinavian man, sandy blonde medium hair, light blue eyes, 187cm, lean build.
Wearing COS aesthetic — oversized camel wool coat, cream knit underneath, wide charcoal trousers, white leather sneakers. Nordic minimalism.
Full body, white background, soft diffused studio light. Effortless, calm. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `MALE fashion model. Scandinavian man, sandy blonde medium hair, light blue eyes, lean build.
Wearing Lemaire relaxed tailoring — unstructured beige linen suit, collarless shirt in off-white, suede loafers. Soft construction.
Full body, warm neutral background, warm natural lighting feel. Easy posture, slight lean. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `MALE fashion model. Scandinavian man, sandy blonde medium hair, light blue eyes.
Wearing Our Legacy texture-focused look — chunky cable-knit sweater in ecru, raw selvedge indigo denim, Paraboot leather shoes.
Full body, concrete grey background, cool studio lighting emphasizing fabric texture. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `MALE fashion model. Scandinavian man, sandy blonde medium hair, light blue eyes.
Lifestyle portrait. Wearing simple navy cotton crewneck, well-worn khaki chinos, white canvas sneakers.
Full body, natural window light, minimal bright interior. Holding a coffee cup. Relaxed, candid. NO makeup. MENSWEAR only.${PORTRAIT}` },
    ],
  },

  'men-intl-03': {
    gender: 'male', name: 'MATEO',
    identity: 'Mediterranean man, dark brown wavy hair, dark brown eyes, 185cm, olive skin',
    shots: [
      { name: 'campaign', prompt: `MALE fashion model. Mediterranean man, dark brown wavy hair, dark brown eyes, 185cm, olive skin.
Wearing Tom Ford evening style — midnight navy peak-lapel tuxedo jacket, black silk shirt open one button, slim trousers, patent leather shoes. Sophisticated.
Full body, dark background, golden warm studio lighting. Suave, magnetic. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `MALE fashion model. Mediterranean man, dark brown wavy hair, dark brown eyes, olive skin.
Brunello Cucinelli casual luxury — unstructured grey cashmere blazer, cream linen shirt, tan chinos, suede desert boots. Relaxed Italian elegance.
Full body, warm beige background, soft golden light. Easy smile. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `MALE fashion model. Mediterranean man, dark brown wavy hair, dark brown eyes, olive skin.
Summer Mediterranean style — open-collar white linen camp shirt, navy swim shorts, leather sandals, sunglasses pushed up on head.
Full body, bright white background, harsh high-sun lighting creating strong shadows. Vacation energy. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `MALE fashion model. Mediterranean man, dark brown wavy hair, dark brown eyes, olive skin.
Smart casual editorial — navy double-breasted blazer, white crewneck T-shirt, grey flannel trousers, brown suede Chelsea boots.
Full body, clean grey background, crisp studio lighting. Hands casually arranged. Assured. NO makeup. MENSWEAR only.${PORTRAIT}` },
    ],
  },

  // ═══ Men Asia ═══
  'men-asia-01': {
    gender: 'male', name: 'SHOTA',
    identity: 'Japanese man, black medium natural hair, dark brown monolid eyes, 183cm, clean-cut',
    shots: [
      { name: 'campaign', prompt: `MALE fashion model. Japanese man, black medium natural hair, dark brown monolid eyes, 183cm, clean-cut.
Wearing HOMME PLISSÉ Issey Miyake — full pleated set in charcoal grey, the signature micro-pleat fabric creating texture and movement. Minimal white sneakers.
Full body, pure white background, clean even lighting showing the pleat texture. Upright posture, arms at sides. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `MALE fashion model. Japanese man, black medium natural hair, dark brown monolid eyes, clean-cut.
Wearing NEIGHBORHOOD military style — olive M-65 field jacket, black heavyweight pocket tee, dark indigo selvedge jeans, black combat boots. Tokyo street meets military.
Full body, dark grey background, hard directional light. Strong stance. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `MALE fashion model. Japanese man, black medium natural hair, dark brown monolid eyes.
Wearing Auralee quiet luxury — oversized brushed wool crewneck in pale blue, relaxed wide-leg trousers in stone, leather sandals. Soft, considered.
Full body, warm neutral background, soft diffused light. Gentle, contemplative expression. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `MALE fashion model. Japanese man, black medium natural hair, dark brown monolid eyes.
Tokyo city boy style — navy coach jacket, white Oxford button-down, beige chinos, white Jack Purcell sneakers, tote bag.
Full body, white background, clean lighting. Casual walking pose. Popeye magazine energy. NO makeup. MENSWEAR only.${PORTRAIT}` },
    ],
  },

  'men-asia-02': {
    gender: 'male', name: 'JIHO',
    identity: 'Korean man, black medium-long soft hair, dark brown double lid eyes, 182cm, androgynous features',
    shots: [
      { name: 'campaign', prompt: `MALE fashion model. Korean man, black medium-long soft hair, dark brown double lid eyes, 182cm. Delicate androgynous features but clearly MALE.
Wearing Raf Simons oversized aesthetic — huge graphic-print sweater falling off one shoulder, slim black trousers, chunky sole Derby shoes. Youth rebellion meets high fashion.
Full body, stark white background, flat even lighting. Slouchy posture, looking away from camera. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `MALE fashion model. Korean man, black medium-long soft hair, dark brown double lid eyes. Androgynous but clearly MALE.
Wearing Loewe menswear — butter-soft brown leather jacket, white tank top underneath, wide pleated trousers in khaki. Craft meets luxury.
Full body, warm terracotta background, golden directional light. Thoughtful, looking down slightly. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `MALE fashion model. Korean man, black medium-long soft hair, dark brown double lid eyes.
Wearing WE11DONE Korean street fashion — oversized denim jacket with distressing, logo hoodie, wide cargo pants, platform sneakers.
Full body, concrete grey background, cool fluorescent-style lighting. Urban Seoul energy. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `MALE fashion model. Korean man, black medium-long soft hair, dark brown double lid eyes.
Gentle Monster eyewear campaign style. Wearing minimal black turtleneck, architectural black-frame sunglasses.
Upper body and face, clean grey gradient background, studio lighting. Cool, enigmatic. NO makeup. MENSWEAR only.${PORTRAIT}` },
    ],
  },

  'men-asia-03': {
    gender: 'male', name: 'TAKU',
    identity: 'Japanese man, black with grey temples short hair, dark brown eyes, 180cm, mature distinguished',
    shots: [
      { name: 'campaign', prompt: `MALE fashion model. Japanese man in his 40s, black hair with grey temples (short cut), dark brown eyes, 180cm. Mature, distinguished.
Wearing COMOLI relaxed tailoring — unstructured navy cotton-linen blazer, white band-collar shirt, wide tapered grey trousers, leather sandals. Impeccable fabric quality visible.
Full body, warm neutral background, soft natural window light feel. Calm authority. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `MALE fashion model. Japanese man in his 40s, black hair with grey temples, dark brown eyes. Mature, distinguished.
Wearing visvim Americana-craft style — indigo-dyed noragi jacket, vintage-wash chambray shirt, raw denim jeans, leather moccasin boots. Wabi-sabi aesthetic.
Full body, warm wood-toned background, warm directional light. Weathered elegance. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `MALE fashion model. Japanese man in his 40s, black hair with grey temples, dark brown eyes.
Wearing BEAMS F classic style — navy hopsack blazer, sky blue Oxford shirt, grey flannel trousers, brown suede tassel loafers, no tie.
Full body, clean white background, crisp studio lighting. Classic Japanese sartorial elegance. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `MALE fashion model. Japanese man in his 40s, black hair with grey temples, dark brown eyes.
Intellectual portrait. Wearing dark charcoal crewneck cashmere sweater over white T-shirt. Reading glasses pushed up on forehead.
Upper body, warm interior lighting, bookshelf or architectural detail in soft background. Wise, approachable. NO makeup. MENSWEAR only.${PORTRAIT}` },
    ],
  },

  // ═══ Influencer / Creative ═══
  'influencer-girl-01': {
    gender: 'female', name: 'RINKA',
    identity: 'Japanese woman, pink-ash shoulder length hair, dark brown eyes, 165cm, creative style',
    shots: [
      { name: 'campaign', prompt: `FEMALE fashion model. Japanese woman, pink-ash shoulder length hair, dark brown eyes, 165cm. Creative, energetic.
Wearing AMBUSH statement style — oversized chain necklace, cropped leather biker jacket, graphic print mini skirt, platform boots. Tokyo street luxury.
Full body, neon-lit dark background with color gels (pink/blue), editorial flash lighting. Bold pose, attitude. Harajuku energy.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `FEMALE fashion model. Japanese woman, pink-ash shoulder length hair, dark brown eyes.
Wearing HUMAN MADE x Girls Don't Cry style — vintage-washed graphic tee, oversized denim trucker jacket, wide cargo pants, retro sneakers. Streetwear culture.
Full body, white background, clean bright lighting. Fun, approachable, peace sign or playful pose.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `FEMALE fashion model. Japanese woman, pink-ash shoulder length hair, dark brown eyes.
Wearing sacai hybrid style — deconstructed trench coat with knit panel inserts, asymmetric pleated skirt, chunky sole loafers. Fashion-forward layering.
Full body, grey studio background, directional side lighting. Fashion editorial pose, looking over shoulder.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `FEMALE fashion model. Japanese woman, pink-ash shoulder length hair, dark brown eyes.
Harajuku street snap style — colorful vintage cardigan, band tee, plaid mini skirt, platform Mary Janes, tote bag with pins and patches.
Full body, bright white background, pop flash lighting. Walking pose, natural smile. Authentic street culture.${PORTRAIT}` },
    ],
  },

  'influencer-boy-01': {
    gender: 'male', name: 'KAI',
    identity: 'Mixed-heritage man, dark brown curly-wavy hair, light brown eyes, 178cm, surfer vibe',
    shots: [
      { name: 'campaign', prompt: `MALE fashion model. Mixed-heritage man, dark brown curly-wavy hair, light brown eyes, 178cm. Tanned, relaxed surfer build.
Wearing Stüssy classic — bold stripe rugby shirt, relaxed khaki work pants, white VANS Old Skool. California meets Tokyo streetwear.
Full body, white background, bright clean lighting. Easy stance, hands in pockets. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'verve-cover', prompt: `MALE fashion model. Mixed-heritage man, dark brown curly-wavy hair, light brown eyes, tanned.
Wearing Ron Herman California casual — faded indigo denim jacket, heather grey pocket tee, rolled-up chinos, leather flip flops.
Full body, warm bright background, golden-hour sunlight feel. Squinting slightly, natural. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'form-editorial', prompt: `MALE fashion model. Mixed-heritage man, dark brown curly-wavy hair, light brown eyes.
Wearing Patagonia / outdoor lifestyle — fleece half-zip pullover in sage green, nylon hiking shorts, trail running shoes, cap.
Full body, natural outdoor background feel, bright daylight. Active, healthy lifestyle. NO makeup. MENSWEAR only.${PORTRAIT}` },
      { name: 'muse-portrait', prompt: `MALE fashion model. Mixed-heritage man, dark brown curly-wavy hair, light brown eyes.
Wearing KITH / BEAMS style — oversized washed hoodie, wide-leg cargo pants, New Balance 990 sneakers, bucket hat.
Full body, white background, clean even lighting. Relaxed pose, slight smile. Urban casual. NO makeup. MENSWEAR only.${PORTRAIT}` },
    ],
  },
};

// ── Generation logic ──

async function generateShot(modelId, model, shot) {
  const dir = `public/agency-models/${modelId}`;
  const outPath = path.join(dir, `v3-${shot.name}.png`);

  if (!force && fs.existsSync(outPath)) {
    console.log(`    ${shot.name} — exists, skip`);
    return;
  }

  // Load identity refs
  const refs = [];
  for (const f of ['polaroid-front.png', 'polaroid-face.png']) {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) refs.push(fs.readFileSync(p).toString('base64'));
  }

  const genderWord = model.gender === 'male' ? 'man' : 'woman';
  const parts = [];
  if (refs.length > 0) {
    parts.push({ text: `IDENTITY LOCK — Generate the EXACT SAME ${genderWord} shown in these reference photos. Match every facial feature precisely. This is a ${model.gender.toUpperCase()} model named ${model.name}:` });
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
          console.log(`    ${shot.name} OK`);
          return;
        }
      }
      console.log(`    ${shot.name} no image (attempt ${attempt})`);
    } catch (e) {
      console.error(`    ${shot.name} ERROR (attempt ${attempt}): ${e.message}`);
      if (attempt < 2) await new Promise(r => setTimeout(r, 10000));
    }
  }
}

// ── Main ──

const ids = targetId ? [targetId] : Object.keys(ROSTER);
console.log(`=== Portfolio Generation (CEO-approved direction) ===`);
console.log(`Models: ${ids.length} | Force: ${force}`);
console.log(`Time: ${new Date().toLocaleString('ja-JP')}\n`);

for (const id of ids) {
  const model = ROSTER[id];
  if (!model) { console.error(`Unknown: ${id}`); continue; }
  console.log(`\n--- ${model.name} (${id}) — ${model.gender.toUpperCase()} ---`);

  for (const shot of model.shots) {
    await generateShot(id, model, shot);
    await new Promise(r => setTimeout(r, 2500));
  }
  await new Promise(r => setTimeout(r, 3000));
}

console.log(`\n=== Done: ${new Date().toLocaleString('ja-JP')} ===`);

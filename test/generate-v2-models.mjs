/**
 * LUMINA MODEL AGENCY v2 — High-quality model generation
 *
 * Generates: 4 reference shots + 4 portfolio shots (high-fashion styling)
 *
 * GEMINI_API_KEY=xxx node test/generate-v2-models.mjs ladies-intl-01
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY required'); process.exit(1); }
const modelId = process.argv[2];
if (!modelId) { console.error('Usage: node test/generate-v2-models.mjs <model-id>'); process.exit(1); }

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ── Model Definitions ────────────────────────────────────────────────────────

const MODELS = {
  // ─── LADIES INTERNATIONAL ──────────────────────────────────
  'ladies-intl-01': {
    name: 'ELENA',
    category: 'ladies_international',
    desc: `Professional high-fashion female model, Scandinavian heritage (Swedish-Danish), age 23, height 179cm, B80/W59/H88.
FACE: Elongated oval face, razor-sharp cheekbones, large blue-grey eyes with heavy lids giving a sleepy-editorial quality, straight refined nose, thin lips with defined cupid's bow, strong jaw softened by feminine proportions. Barely-there blonde eyebrows.
BODY: Runway proportions — extremely long legs, narrow shoulders, flat chest. Built for couture.
HAIR: Pale ash blonde, straight, long, center-parted. Almost white-blonde. Clean, no styling product.
SKIN: Very fair, translucent quality, cool pink undertone. No tan, no warmth. Scandinavian winter skin.
EXPRESSION: Remote, unreachable. The editorial gaze that looks past you. Not cold — absent. As if she's thinking about something far away.
REFERENCE: Think Kirsty Hume or early Sasha Pivovarova. The Scandinavian girl who books Jil Sander and The Row.`,
    height: 179,
    measurements: { bust: 80, waist: 59, hips: 88 },
    hair: 'Ash blonde, straight, long',
    eyes: 'Blue-grey',
    vibe: 'Scandinavian editorial, Jil Sander / The Row',
  },

  'ladies-intl-02': {
    name: 'AMARA',
    category: 'ladies_international',
    desc: `Professional high-fashion female model, Somali heritage, age 22, height 181cm, B81/W60/H89.
FACE: Perfectly symmetrical oval face, extraordinary cheekbones — the highest, most sculpted bone structure imaginable. Large dark brown eyes with naturally long lashes, elegant aquiline nose, full lips with beautiful natural definition. Flawless dark skin with blue-black undertone that catches light like obsidian.
BODY: Impossibly long and lean. Long neck, narrow frame, elongated limbs. The proportions that haute couture was designed for.
HAIR: Natural black, close-cropped buzz cut — 2mm all over. The buzz cut puts all attention on the bone structure.
SKIN: Deep, rich, dark brown. Flawless. The kind of skin that glows under studio lighting.
EXPRESSION: Regal composure. She has the stillness of a portrait painting. Not performing — simply being, and it's enough.
REFERENCE: Think Iman in the 80s, or Adut Akech. The kind of beauty that changes fashion's standards.`,
    height: 181,
    measurements: { bust: 81, waist: 60, hips: 89 },
    hair: 'Black, buzz cut',
    eyes: 'Dark brown',
    vibe: 'Haute couture, Balenciaga / Rick Owens',
  },

  'ladies-intl-03': {
    name: 'SOFIA',
    category: 'ladies_international',
    desc: `Professional high-fashion female model, Brazilian-Italian heritage, age 25, height 177cm, B82/W60/H89.
FACE: Classic Mediterranean beauty with Brazilian warmth — oval face, pronounced cheekbones, large deep brown eyes with golden amber flecks, straight nose with slight Roman bump (gives character), naturally full lips. Strong eyebrows, naturally shaped. A face that's both powerful and warm.
BODY: Athletic yet feminine. Slightly broader shoulders than typical runway, but perfectly proportioned. She moves with the confidence of someone comfortable in her body.
HAIR: Dark chestnut brown, thick, natural wave, past shoulders. The kind of hair that moves beautifully in photos.
SKIN: Medium olive, warm golden undertone. Light freckling across nose and upper cheeks. Sun-kissed without trying.
EXPRESSION: Warm intensity. She engages with the camera, not at a distance. The smile lives in her eyes even when her mouth is neutral. Approachable editorial.
REFERENCE: Think Gisele's warmth meets Monica Bellucci's intensity. The girl who books both Valentino and Michael Kors.`,
    height: 177,
    measurements: { bust: 82, waist: 60, hips: 89 },
    hair: 'Dark chestnut, natural wave',
    eyes: 'Brown with amber',
    vibe: 'Mediterranean editorial, Valentino / Bottega Veneta',
  },

  // ─── LADIES ASIA ───────────────────────────────────────────
  'ladies-asia-01': {
    name: 'MIKU',
    category: 'ladies_asia',
    desc: `Professional high-fashion Japanese female model, age 21, height 175cm, B78/W57/H85.
FACE: Striking angular face — diamond-shaped with high sharp cheekbones. Single-lid monolid eyes that are narrow and intense, giving an editorial sharpness. Small refined nose, thin precise lips. Strong defined jaw. The bone structure photographs with dramatic shadow play.
BODY: Very lean, boyish. Narrow hips, flat chest. The androgynous silhouette that Japanese avant-garde designers love.
HAIR: Black, blunt cut at chin level. Geometric, architectural. Glossy like lacquer.
SKIN: Porcelain fair, cool undertone. Matte, even, flawless.
EXPRESSION: Intense stillness. The focus of a Noh performer. Zero sweetness — pure editorial severity.
REFERENCE: Think of the girls who walk for Comme des Garçons, Yohji Yamamoto, Sacai. Tokyo fashion at its most uncompromising.`,
    height: 175,
    measurements: { bust: 78, waist: 57, hips: 85 },
    hair: 'Black, blunt bob',
    eyes: 'Dark brown, monolid',
    vibe: 'Japanese avant-garde, Comme des Garçons / Sacai',
  },

  'ladies-asia-02': {
    name: 'HARIN',
    category: 'ladies_asia',
    desc: `Professional high-fashion Korean female model, age 24, height 174cm, B79/W58/H87.
FACE: Soft oval face with gentle bone structure. Natural double-lid almond eyes, softly defined nose, full lips with gradient effect (slightly darker at center). Clear, luminous "glass skin" — the K-beauty ideal made real. Subtly arched eyebrows.
BODY: Slim, proportionate, elegant. Not as angular as runway — more of a commercial-editorial crossover build.
HAIR: Black, long, straight and sleek. Center-parted with face-framing layers. The kind of shiny, healthy hair that sells shampoo.
SKIN: Light-medium, warm neutral undertone. Dewy, luminous. Glass skin — the glow is the feature.
EXPRESSION: Serene confidence. The "quiet luxury" expression — nothing forced, everything effortless. She looks expensive without trying.
REFERENCE: Think of the Korean models who book for Celine and Bottega. The quiet luxury aesthetic personified.`,
    height: 174,
    measurements: { bust: 79, waist: 58, hips: 87 },
    hair: 'Black, long, straight',
    eyes: 'Dark brown, double lid',
    vibe: 'K-beauty editorial, Celine / quiet luxury',
  },

  'ladies-asia-03': {
    name: 'LIEN',
    category: 'ladies_asia',
    desc: `Professional high-fashion Vietnamese-French female model, age 23, height 176cm, B79/W58/H86.
FACE: Exotic blend — Southeast Asian softness with French angularity. Heart-shaped face, wide-set almond eyes with subtle double lid (one eye slightly different — a charming asymmetry), defined nose bridge, lips that are full at center and taper elegantly. High forehead.
BODY: Lean, elegant. Long neck, graceful proportions. She moves like a dancer.
HAIR: Very dark brown (almost black), cut in a sharp modern shag — choppy layers, side-swept bangs. The most fashion-forward haircut on the roster.
SKIN: Light olive, warm golden undertone. Southeast Asian warmth. Healthy, natural glow.
EXPRESSION: Curious intelligence. She looks at the camera like she's figuring out a puzzle. Engaging, not distant. Makes the viewer lean in.
REFERENCE: The new generation of mixed-heritage Asian models reshaping fashion. Think of the girls who bridge Paris and Saigon.`,
    height: 176,
    measurements: { bust: 79, waist: 58, hips: 86 },
    hair: 'Dark brown, modern shag',
    eyes: 'Dark brown, almond',
    vibe: 'Franco-Asian editorial, Dior / Loewe',
  },

  // ─── MEN INTERNATIONAL ────────────────────────────────────
  'men-intl-01': {
    name: 'IDRIS',
    category: 'men_international',
    desc: `Professional high-fashion male model, British-Ghanaian heritage, age 27, height 189cm, C92/W74/H90.
FACE: Carved angular face — strong jaw, high cheekbones, deep-set dark brown eyes with intensity, broad nose, full well-defined lips. Clean-shaven. The face has architectural quality — every angle is strong.
BODY: Tall, lean but strong. Swimmer's build — broad shoulders, narrow waist. Runway proportions for menswear.
HAIR: Black, very short fade, immaculate lineup.
SKIN: Rich deep brown, even, healthy. Natural sheen under studio lighting.
EXPRESSION: Quiet authority. He looks like he could run a boardroom or a runway with equal ease. Not aggressive — assured.
REFERENCE: Think of the men who walk for Prada, Dior Homme, Louis Vuitton. British tailoring meets West African regality.`,
    height: 189,
    measurements: { bust: 92, waist: 74, hips: 90 },
    hair: 'Black, short fade',
    eyes: 'Dark brown',
    vibe: 'Luxury menswear, Prada / Dior Homme',
  },

  'men-intl-02': {
    name: 'LARS',
    category: 'men_international',
    desc: `Professional high-fashion male model, Dutch heritage, age 25, height 187cm, C90/W72/H89.
FACE: Classic Northern European bone structure — strong angular jaw, high cheekbones, light blue eyes, straight nose, thin lips. Sandy blonde eyebrows. The face is handsome but not pretty — there's a roughness that adds character. Very slight stubble (one day growth).
BODY: Lean, athletic. Runner's build. Long limbs, narrow waist.
HAIR: Sandy blonde, medium length, natural texture. Pushed back but not styled — falls forward naturally. Surfer-meets-CEO energy.
SKIN: Fair, warm undertone with slight weathering. Not porcelain — he looks like he spends time outside. Light freckling on nose.
EXPRESSION: Easy confidence. The half-smile that says he's in on a joke. Approachable but stylish. The "I woke up like this" editorial look.
REFERENCE: Think of the men who book for COS, A.P.C., Lemaire. Scandi minimalism with warmth.`,
    height: 187,
    measurements: { bust: 90, waist: 72, hips: 89 },
    hair: 'Sandy blonde, medium',
    eyes: 'Light blue',
    vibe: 'Scandi minimal, COS / Lemaire',
  },

  'men-intl-03': {
    name: 'MATEO',
    category: 'men_international',
    desc: `Professional high-fashion male model, Argentine-Spanish heritage, age 26, height 185cm, C91/W73/H90.
FACE: Mediterranean masculinity — strong jaw with slight cleft chin, prominent nose with character, dark brown eyes with thick lashes, full lips. Well-groomed thick eyebrows. Dark stubble (2-3 days growth, intentional). The face has cinematic quality — he could be in a Campari ad.
BODY: Athletic, well-proportioned. Broader chest than typical runway but carries clothes beautifully. Olive-toned arms with visible veins — he works out but isn't bulky.
HAIR: Dark brown, almost black. Thick, wavy, medium length. Styled back but with natural movement. The kind of hair you want to run your hands through.
SKIN: Medium olive, warm undertone. Mediterranean tan. Looks like eternal summer.
EXPRESSION: Smoldering but not trying. The Latin confidence that's earned, not performed. He knows he's attractive but doesn't lean on it.
REFERENCE: Think of the men who book for Zegna, Tom Ford, Dolce & Gabbana. Mediterranean luxury.`,
    height: 185,
    measurements: { bust: 91, waist: 73, hips: 90 },
    hair: 'Dark brown, wavy',
    eyes: 'Dark brown',
    vibe: 'Mediterranean luxury, Tom Ford / Zegna',
  },

  // ─── MEN ASIA ──────────────────────────────────────────────
  'men-asia-01': {
    name: 'SHOTA',
    category: 'men_asia',
    desc: `Professional high-fashion Japanese male model, age 24, height 183cm, C88/W70/H88.
FACE: Clean, balanced Japanese features — oval face with defined but not aggressive jaw, slightly hooded monolid eyes with calm intensity, straight nose, medium lips. Clean-shaven. Glass skin — the male equivalent of K-beauty skin quality. Natural, masculine eyebrows.
BODY: Lean, clean lines. Not muscular — the "clothes hanger" build that Japanese designers prize. Long torso, proportional limbs.
HAIR: Black, medium length, natural texture. Not overly styled — looks like he ran his hand through it once and it fell perfectly. Side-parted.
SKIN: Light-medium, neutral undertone. Clear, healthy, matte.
EXPRESSION: Composed minimalism. The restraint of Japanese aesthetics in a face. He shows nothing and somehow that's captivating. Zen editorial.
REFERENCE: Think of the men who walk for Issey Miyake, HOMME PLISSÉ, Lemaire. Japanese quiet masculinity.`,
    height: 183,
    measurements: { bust: 88, waist: 70, hips: 88 },
    hair: 'Black, medium, natural',
    eyes: 'Dark brown, monolid',
    vibe: 'Japanese minimalist, Issey Miyake / HOMME PLISSÉ',
  },

  'men-asia-02': {
    name: 'JIHO',
    category: 'men_asia',
    desc: `Professional high-fashion Korean male model, age 23, height 182cm, C87/W69/H87.
FACE: Beautiful androgynous features — soft oval face, large double-lid eyes with gentle curve, refined small nose, full lips with natural pink tint. Clean-shaven, immaculate glass skin with dewiness. The face is beautiful in a way that transcends traditional masculinity — he could book women's accessories campaigns.
BODY: Slim, elongated. Narrow shoulders, long neck. The androgynous build that high fashion celebrates.
HAIR: Black, longer on top (ear-length), styled with soft movement. Not K-pop overdone — editorial restraint. Sometimes falls over one eye.
SKIN: Fair, cool-neutral undertone. The glass skin texture that K-beauty is built on. Luminous without being oily.
EXPRESSION: Soft vulnerability meets quiet strength. The "flower boy" aesthetic elevated to high-fashion level. Not cute — beautiful.
REFERENCE: Think of the Korean models who walk for Raf Simons, JW Anderson, Loewe. Gender-fluid beauty at its most refined.`,
    height: 182,
    measurements: { bust: 87, waist: 69, hips: 87 },
    hair: 'Black, medium-long, soft',
    eyes: 'Dark brown, double lid',
    vibe: 'Androgynous editorial, Raf Simons / Loewe',
  },

  'men-asia-03': {
    name: 'TAKU',
    category: 'men_asia',
    desc: `Professional high-fashion Japanese male model, age 28, height 180cm, C90/W72/H89.
FACE: Mature, weathered handsomeness — square jaw with definition, slightly hooded eyes with smile lines at corners (he actually looks like he's lived), strong nose, medium lips set in a natural almost-smile. Stubble — intentional 2-day growth. The first model on the roster who looks over 25.
BODY: Athletic, solid. Broader build than typical runway — more suited to commercial and menswear editorial. He fills out a suit beautifully.
HAIR: Black with premature grey at temples (distinguished, not aging). Short, clean, pushed back.
SKIN: Medium, warm undertone. Not glass-skin perfect — there's texture, there's reality. That's the appeal.
EXPRESSION: Worldly confidence. He's been somewhere, done something. The expression of experience, not youth. Think: creative director, not model. That's why he books the sophisticated campaigns.
REFERENCE: Think of the men in Auralee, COMOLI, Studio Nicholson lookbooks. The grown-up Japanese man.`,
    height: 180,
    measurements: { bust: 90, waist: 72, hips: 89 },
    hair: 'Black with grey temples, short',
    eyes: 'Dark brown',
    vibe: 'Mature menswear, Auralee / COMOLI',
  },

  // ─── INFLUENCER ────────────────────────────────────────────
  // ─── STREET / CULTURE ─────────────────────────────────────
  'men-street-01': {
    name: 'RYO',
    category: 'men_asia',
    desc: `Professional fashion model and skateboarder, Japanese-American mixed heritage (American father from LA, Japanese mother from Tokyo), age 22, height 181cm, C88/W70/H88.
FACE: Mixed heritage — subtle Western bone structure blended with Japanese softness. Sharp jawline with slight angularity, deep-set dark brown eyes with a slightly hooded, sleepy quality (奥二重). Straight nose with gentle bridge. Medium lips, often in a neutral half-expression. Light stubble (1-day growth). The face has character — not conventionally pretty, but magnetic. He looks like he's seen things and decided most of them aren't worth talking about.
BODY: Lean skater build — narrow waist, defined shoulders from years of skating, visible forearm muscle. Not gym-built. Long limbs. Moves with the fluid economy of someone who's been on a board since childhood.
HAIR: Black, medium length with slight natural wave/curl from his mixed heritage. Falls into his eyes. Unstyled — looks like he woke up 20 minutes ago. Sometimes tucked behind one ear.
SKIN: Warm wheat-toned, naturally sun-kissed from outdoor life. Not salon tan — real outdoor skin. Slight weathering on hands.
TATTOOS: Left arm full sleeve — Japanese traditional wave (和彫り nami) merging into American Traditional eagle and roses. Right inner wrist — small kanji "風" (wind). Back of neck — small simple cross. The tattoos are aged-in, not fresh — they look like they've been there for years.
ACCESSORIES: Left ear — single silver hoop. Fingers — 2-3 heavy silver rings (Chrome Hearts style, worn and scratched). Always.
EXPRESSION: Quiet cool. Not performing — just being. Slightly sleepy eyes that suddenly sharpen when something interests him. The anti-model energy that streetwear brands cast for.
REFERENCE: Think Sung Jin Park's tattoo edge meets early Yura Nakano's mixed-heritage editorial quality. The guy WACKO MARIA and WTAPS would street-cast. He chose the clothes, the clothes didn't choose him.`,
    height: 181,
    measurements: { bust: 88, waist: 70, hips: 88 },
    hair: 'Black, medium, slight wave',
    eyes: 'Dark brown, hooded',
    vibe: 'Tokyo street culture, WTAPS / WACKO MARIA / BEDWIN',
  },

  // ─── INFLUENCER ────────────────────────────────────────────
  'influencer-girl-01': {
    name: 'RINKA',
    category: 'influencer',
    desc: `Influencer / digital creator, Japanese, age 22, height 165cm.
FACE: Cute-beautiful hybrid — round-ish face with youthful proportions, large expressive double-lid eyes, small nose, full lips with natural pink. She looks approachable and aspirational at the same time. Light makeup always — gloss lips, subtle blush, mascara.
BODY: Petite, slim. Not model proportions — real-girl proportions that her followers relate to.
HAIR: Pink-ash colored, shoulder length, layered with effortless texture. Her signature — the hair IS the brand.
SKIN: Fair, warm undertone. Healthy glow. Always looks like she just did her skincare routine.
EXPRESSION: Playful warmth. She smiles with her whole face. The girl next door who happens to have incredible style.
VIBE: Tokyo street style meets Harajuku creativity. She's the girl your followers want to be. Not editorial — lifestyle.`,
    height: 165,
    measurements: { bust: 78, waist: 58, hips: 84 },
    hair: 'Pink-ash, shoulder length',
    eyes: 'Dark brown',
    vibe: 'Tokyo street style, Harajuku creative',
  },

  'influencer-boy-01': {
    name: 'KAI',
    category: 'influencer',
    desc: `Influencer / digital creator, Japanese-Australian mixed, age 24, height 178cm.
FACE: Mixed heritage beauty — soft jaw blending Japanese refinement with Australian openness, light brown eyes (unusual for Asian heritage — his most distinctive feature), natural double-lid eyes, straight nose, easy smile. Light tan. The face people stop scrolling for.
BODY: Lean athletic. Surfer build — not bulky, naturally fit. The body that looks good in everything from streetwear to swim.
HAIR: Dark brown with natural sun-bleached highlights, medium length, curly-wavy texture. Messy in a curated way.
SKIN: Light-medium, warm olive. Sun-kissed. Looks like he lives outdoors.
EXPRESSION: Effortless cool. The smile that makes you feel like you're in on a secret. Charismatic without being performative.
VIBE: Tokyo meets Byron Bay. Streetwear, surf culture, creative lifestyle. He's the guy brands want for their Instagram.`,
    height: 178,
    measurements: { bust: 88, waist: 72, hips: 88 },
    hair: 'Dark brown, curly-wavy, sun-bleached',
    eyes: 'Light brown',
    vibe: 'Tokyo × Byron Bay, lifestyle creative',
  },
};

const model = MODELS[modelId];
if (!model) {
  console.error(`Unknown: ${modelId}\nAvailable: ${Object.keys(MODELS).join(', ')}`);
  process.exit(1);
}

const OUTPUT_DIR = `public/agency-models/${modelId}`;
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── Reference Shots ──────────────────────────────────────────────────────────

const REF_SHOTS = [
  { name: 'polaroid-front', dir: 'Agency polaroid: full body, white tank/tee + simple pants, flat lighting, white bg, arms at sides, no styling' },
  { name: 'polaroid-face', dir: 'Agency polaroid: head+shoulders close-up, no makeup, hair natural, flat lighting, neutral expression, show bone structure' },
  { name: 'editorial', dir: 'Studio editorial: full body, wearing simple well-cut black clothing, professional 45-degree key lighting, clean grey bg, natural standing pose, high-fashion agency portfolio quality' },
  { name: 'beauty', dir: 'Beauty editorial close-up: face and upper shoulders, minimal makeup, soft beauty lighting, skin texture visible, serene expression' },
];

// ── Portfolio Shots (high-fashion styling) ───────────────────────────────────

const PORTFOLIO_SHOTS = [
  { name: 'look-01', dir: `High-fashion editorial photograph. Full body.
Wearing: a MIU MIU-style look — oversized knit cardigan over a mini skirt, knee-high boots, playful intellectual styling.
Hair: styled with volume, blown out.
Makeup: bold — graphic eyeliner, berry lip.
Setting: clean studio, white background.
Lighting: editorial directional, shadow ratio 1:2.5.
This should look like a page from Vogue or i-D magazine.` },

  { name: 'look-02', dir: `High-fashion editorial photograph. Full body.
Wearing: a PRADA-style look — sharply tailored coat, slim trousers, leather loafers. Minimal accessories, one statement bag.
Hair: sleek, pulled back or slicked.
Makeup: minimal — clean skin, defined brow, nude lip.
Setting: clean studio, grey background.
Lighting: high-contrast editorial.
This should look like a Prada campaign image.` },

  { name: 'look-03', dir: `Luxury e-commerce photograph. Full body.
Wearing: casual luxury — a perfectly fitted cashmere sweater, wide-leg trousers, elegant flats. The kind of outfit you'd see on NET-A-PORTER.
Hair: natural, effortless.
Makeup: barely there — tinted moisturizer, natural lip.
Setting: clean studio, white background.
Lighting: soft, flattering, commercial.
This should look like a product page on SSENSE or NET-A-PORTER.` },

  { name: 'look-04', dir: `Magazine cover-style portrait. Close-up, head and shoulders.
Wearing: a beautiful statement earring or necklace, bare shoulders or simple black top.
Hair: dramatic styling — either sleek updo, wet-look, or voluminous editorial blow-out.
Makeup: full editorial — smokey eye, sculpted cheekbones, statement lip.
Setting: studio, solid color background.
Lighting: beauty editorial lighting, catchlights in eyes.
This should look like a Vogue Japan or Harper's Bazaar cover.` },
];

async function generateShot(shot, existingRefs) {
  const outPath = path.join(OUTPUT_DIR, `${shot.name}.png`);
  if (fs.existsSync(outPath)) {
    console.log(`  ⏭️ ${shot.name} exists`);
    const data = fs.readFileSync(outPath).toString('base64');
    return { name: shot.name, data };
  }

  console.log(`  ${shot.name}...`);
  const parts = [];
  if (existingRefs.length > 0) {
    parts.push({ text: 'IDENTITY LOCK — this is the EXACT person. Match every facial detail:' });
    for (const r of existingRefs) parts.push({ inlineData: { mimeType: 'image/png', data: r.data } });
  }
  parts.push({ text: `${model.desc}\n\nSHOT: ${shot.dir}` });

  const resp = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ role: 'user', parts }],
    config: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 },
  });

  for (const p of resp.candidates?.[0]?.content?.parts || []) {
    if (p.inlineData) {
      fs.writeFileSync(outPath, Buffer.from(p.inlineData.data, 'base64'));
      console.log(`  ✅ ${shot.name}`);
      return { name: shot.name, data: p.inlineData.data };
    }
  }
  throw new Error(`No image for ${shot.name}`);
}

async function main() {
  console.log(`=== ${model.name} (${modelId}) ===\n`);

  const refs = [];

  // Reference shots
  console.log('── References ──');
  for (const shot of REF_SHOTS) {
    if (refs.length > 0) await new Promise(r => setTimeout(r, 2000));
    try {
      const ref = await generateShot(shot, refs);
      refs.push(ref);
    } catch (e) {
      console.error(`  ❌ ${shot.name}: ${e.message}`);
      await new Promise(r => setTimeout(r, 10000));
      try { const ref = await generateShot(shot, refs); refs.push(ref); }
      catch (e2) { console.error(`  ❌ retry failed: ${e2.message}`); }
    }
  }

  // Portfolio shots
  console.log('\n── Portfolio ──');
  for (const shot of PORTFOLIO_SHOTS) {
    await new Promise(r => setTimeout(r, 3000));
    try {
      await generateShot(shot, refs);
    } catch (e) {
      console.error(`  ❌ ${shot.name}: ${e.message}`);
      await new Promise(r => setTimeout(r, 10000));
      try { await generateShot(shot, refs); }
      catch (e2) { console.error(`  ❌ retry failed: ${e2.message}`); }
    }
  }

  console.log(`\n=== ${model.name} complete ===`);
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

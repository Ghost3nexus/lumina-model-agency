/**
 * LUMINA MODEL AGENCY — AI Model roster
 *
 * v2 (17 models): 4 ref shots + 4-15 portfolio looks each
 * v1 legacy (8 models): 3 sample shots, kept for backward compat
 *
 * v3 (in progress): Character Bible adds persona / lifestyle / fitFor /
 *   visualGuide / instagram per model. All bible fields are OPTIONAL —
 *   populated incrementally as bibles are authored (Task #2-#4).
 */

// ─── v3 Character Bible types ───────────────────────────────────────
// Each talent gets a full bible so that visuals, voice, and IG content
// stay coherent across all generations. Fields are intentionally
// granular so they can drive Voice Clone seeds, HeyGen avatar configs,
// generation prompts, and IG caption tone.

export interface AgencyModelPersona {
  age: number;
  nationality: string;
  hometown: string;
  languages: string[];
  backstory: string;            // ~200字: 生い立ち・転機
  personality: string[];        // 5-7 traits
  hobbies: string[];            // 5-7
  signature: string;            // 一言で「この人らしさ」
}

export interface AgencyModelLifestyle {
  base: string;                 // Tokyo / Paris / Berlin / etc
  daily: string;                // 朝〜夜のルーティン1段落
  music: string[];
  food: string[];
  aesthetics: string[];         // 美意識のキーワード群
}

export interface AgencyModelFitFor {
  fashionBrands: string[];      // 10-15 ブランド
  cosmetics: string[];          // 5-10 化粧品レンジ
  magazines: string[];          // 5-10 媒体
  advertising: string[];        // ジャンル: 時計/不動産/旅行/車/家電/食品/etc
  notFor: string[];             // 合わないジャンル (ガードレール)
}

export interface AgencyModelVisualGuide {
  lighting: string;             // ソフトサイド / ハードトップ / etc
  colorPalette: string[];       // 色名 or hex 4-6
  posing: string;               // ポーズ言語
  framing: string;              // 構図好み
  referenceShoots: string[];    // 参考カット記述（雑誌名は禁止）
}

export interface AgencyModelInstagram {
  handle: string;               // @lumina_elena
  bio: string;                  // ~150字
  contentPillars: string[];     // 4-5: GRWM/lookbook/lifestyle/etc
  postingCadence: string;       // 例: 週3本
  captionStyle: string;         // 例: 短文+絵文字なし、英日混在
}

export interface AgencyModel {
  id: string;
  name: string;
  category: 'ladies_asia' | 'ladies_international' | 'men_asia' | 'men_international' | 'influencer';
  height: number;
  measurements: { bust: number; waist: number; hips: number };
  hair: string;
  eyes: string;
  vibe: string;
  images: { main: string; polaroid: string; beauty: string; editorial: string };
  portfolio: string[];
  /** Optional face-only reference images used by Studio generation to prevent
   *  the model's registered outfit from bleeding into uploaded-garment generations.
   *  Falls back to `images.*` when not specified. */
  studioRefs?: string[];

  // v3 Character Bible (optional, filled per model as bibles are authored)
  persona?: AgencyModelPersona;
  lifestyle?: AgencyModelLifestyle;
  fitFor?: AgencyModelFitFor;
  visualGuide?: AgencyModelVisualGuide;
  instagram?: AgencyModelInstagram;
}

/** Portfolio image names — all possible files per model folder (excluding polaroid/beauty refs) */
const PORTFOLIO_FILES = [
  'look-01.png', 'look-02.png', 'look-03.png', 'look-04.png',
  'campaign.png', 'verve-cover.png', 'form-editorial.png', 'muse-portrait.png',
  'v3-campaign.png', 'v3-verve-cover.png', 'v3-form-editorial.png', 'v3-muse-portrait.png',
  // RYO lifestyle
  'skate-01.png', 'cafe-01.png', 'vinyl-01.png', 'selfie-01.png', 'night-01.png', 'travel-01.png',
  // Lifestyle shots (all models)
  'arch-01.png', 'studio-01.png', 'city-01.png',          // ELENA
  'performance-01.png', 'gallery-01.png', 'london-01.png', // AMARA
  'kitchen-01.png', 'cinema-01.png', 'market-01.png', 'terrace-01.png', // SOFIA
  'tea-01.png', 'reading-01.png', 'koenji-01.png',         // MIKU
  'museum-01.png', 'skincare-01.png', 'paris-01.png',      // HARIN
  'camera-01.png', 'flea-01.png', 'zine-01.png', 'belleville-01.png', // LIEN
  'chess-01.png', 'tailor-01.png', 'watch-01.png',         // IDRIS
  'design-01.png', 'bike-01.png', 'cook-01.png',           // LARS
  'wine-01.png', 'football-01.png', 'dinner-01.png', 'tango-01.png', // MATEO
  'run-01.png', 'ceramics-01.png', 'minimal-01.png',       // SHOTA
  'music-01.png', 'cat-01.png', 'paint-01.png', 'tokyo-01.png', // JIHO
  'books-01.png', 'daughter-01.png',                        // TAKU
  'dj-01.png', 'vintage-01.png', 'shimokita-01.png',       // RINKA
  'surf-01.png', 'yoga-01.png', 'kamakura-01.png', 'workshop-01.png', // KAI
];

/** Build images + portfolio for a v2 model, with fallback for missing files */
function m(id: string, overrides?: Partial<{ main: string; polaroid: string; beauty: string; editorial: string }>) {
  const b = `/agency-models/${id}`;
  return {
    images: {
      main: overrides?.main ?? `${b}/beauty.png`,
      polaroid: overrides?.polaroid ?? `${b}/polaroid-front.png`,
      beauty: overrides?.beauty ?? `${b}/beauty.png`,
      editorial: overrides?.editorial ?? `${b}/editorial.png`,
    },
    portfolio: PORTFOLIO_FILES.map(f => `${b}/${f}`),
  };
}

export const AGENCY_MODELS: AgencyModel[] = [
  { id: 'ladies-intl-01', name: 'ELENA', category: 'ladies_international', height: 179, measurements: { bust: 80, waist: 59, hips: 88 }, hair: 'Ash blonde, straight, long', eyes: 'Blue-grey', vibe: 'Scandinavian editorial, Jil Sander / The Row', ...m('ladies-intl-01') },
  { id: 'ladies-intl-02', name: 'AMARA', category: 'ladies_international', height: 181, measurements: { bust: 81, waist: 60, hips: 89 }, hair: 'Black, buzz cut', eyes: 'Dark brown', vibe: 'Haute couture, Balenciaga / Rick Owens', ...m('ladies-intl-02') },
  { id: 'ladies-intl-03', name: 'SOFIA', category: 'ladies_international', height: 177, measurements: { bust: 82, waist: 60, hips: 89 }, hair: 'Dark chestnut, natural wave', eyes: 'Brown with amber', vibe: 'Mediterranean editorial, Valentino / Bottega Veneta', ...m('ladies-intl-03') },
  { id: 'ladies-intl-04', name: 'NADIA', category: 'ladies_international', height: 178, measurements: { bust: 81, waist: 59, hips: 88 }, hair: 'Beachy blonde, long wavy, sun-kissed highlights', eyes: 'Green-hazel, cat-eye', vibe: 'Quiet luxury workwear, Theory / Max Mara / Joseph', ...m('ladies-intl-04') },
  { id: 'ladies-asia-01', name: 'MIKU', category: 'ladies_asia', height: 175, measurements: { bust: 78, waist: 57, hips: 85 }, hair: 'Black, blunt bob', eyes: 'Dark brown, monolid', vibe: 'Japanese avant-garde, Comme des Garçons / Sacai', ...m('ladies-asia-01') },
  { id: 'ladies-asia-02', name: 'HARIN', category: 'ladies_asia', height: 174, measurements: { bust: 79, waist: 58, hips: 87 }, hair: 'Black, long, straight', eyes: 'Dark brown, double lid', vibe: 'K-beauty editorial, Celine / quiet luxury', ...m('ladies-asia-02', { editorial: '/agency-models/ladies-asia-02/v3-verve-cover.png' }) },
  { id: 'ladies-asia-03', name: 'LIEN', category: 'ladies_asia', height: 176, measurements: { bust: 79, waist: 58, hips: 86 }, hair: 'Dark brown, modern shag', eyes: 'Dark brown, almond', vibe: 'Franco-Asian editorial, Dior / Loewe', ...m('ladies-asia-03', { editorial: '/agency-models/ladies-asia-03/v3-campaign.png' }) },
  { id: 'men-intl-01', name: 'IDRIS', category: 'men_international', height: 189, measurements: { bust: 92, waist: 74, hips: 90 }, hair: 'Black, short fade', eyes: 'Dark brown', vibe: 'Luxury menswear, Prada / Dior Homme', ...m('men-intl-01', { editorial: '/agency-models/men-intl-01/v3-verve-cover.png' }) },
  { id: 'men-intl-02', name: 'LARS', category: 'men_international', height: 187, measurements: { bust: 90, waist: 72, hips: 89 }, hair: 'Sandy blonde, medium', eyes: 'Light blue', vibe: 'Scandi minimal, COS / Lemaire', ...m('men-intl-02') },
  { id: 'men-intl-03', name: 'MATEO', category: 'men_international', height: 185, measurements: { bust: 91, waist: 73, hips: 90 }, hair: 'Dark brown, wavy', eyes: 'Dark brown', vibe: 'Mediterranean luxury, Tom Ford / Zegna', ...m('men-intl-03') },
  { id: 'men-asia-01', name: 'SHOTA', category: 'men_asia', height: 183, measurements: { bust: 88, waist: 70, hips: 88 }, hair: 'Black, medium, natural', eyes: 'Dark brown, monolid', vibe: 'Japanese minimalist, Issey Miyake / HOMME PLISSÉ', ...m('men-asia-01') },
  { id: 'men-asia-02', name: 'JIHO', category: 'men_asia', height: 182, measurements: { bust: 87, waist: 69, hips: 87 }, hair: 'Black, medium-long, soft', eyes: 'Dark brown, double lid', vibe: 'Androgynous editorial, Raf Simons / Loewe', ...m('men-asia-02') },
  { id: 'men-street-01', name: 'RYO', category: 'men_asia', height: 181, measurements: { bust: 88, waist: 70, hips: 88 }, hair: 'Black, medium, slight wave', eyes: 'Dark brown, hooded', vibe: 'Tokyo street culture, WTAPS / WACKO MARIA / BEDWIN', ...m('men-street-01') },
  { id: 'men-street-02', name: 'LUCAS MORI', category: 'men_asia', height: 185, measurements: { bust: 110, waist: 80, hips: 95 }, hair: 'Dark brown, medium, wet slicked-back center-part with subtle natural wave', eyes: 'Hazel-brown with soft epicanthic fold', vibe: 'BEDWIN 26SS lookbook — mixed Brazilian-Japanese nikkei, athletic V-shape tall 185cm with EDITORIAL FASHION MODEL PROPORTION (**minimum 8-heads tall, target 8.5 to 9 heads tall — Watanabe standard "8頭身未満はモデルじゃない"**, small head, long limbs), LONG LEGS (crotch at 50% body height, inseam ~90-92cm, legs appear extra long in full-body shots), LUXURY SWAN-LIKE NECK (neck width = 0.62-0.70 of face width, circumference 34-36cm target, long visible neck column ≥1/2 head-height, flat sloping trapezius, shoulders drop away, NO fighter/MMA/bull-neck — Prada/Saint Laurent/Lemaire editorial standard) with eagle tattoo ONLY on the RIGHT LATERAL SIDE as FLAT GRAPHIC INK (front of throat stays CLEAN natural skin, tattoo does NOT wrap to front/left/Adam\\\'s apple, does NOT add visual bulk to the neck — slim neck silhouette visible through ink). Pants MUST sit at the NATURAL WAIST (mid-rise) — NOT low-rise, NOT hip-sit, NOT sagging (hip-sit/low-rise makes legs look short which is forbidden). Shot with 50mm+ focal length (50-100mm range, never wide-angle). Americana workwear, Watanabe-signed exclusive', images: { main: '/agency-models/men-street-02/look-04.png', polaroid: '/agency-models/men-street-02/polaroid-front.png', beauty: '/agency-models/men-street-02/look-03.png', editorial: '/agency-models/men-street-02/editorial.png' }, portfolio: ['/agency-models/men-street-02/look-01.png', '/agency-models/men-street-02/look-02.png', '/agency-models/men-street-02/beauty.png', '/agency-models/men-street-02/skate-01.png', '/agency-models/men-street-02/campaign.png', '/agency-models/men-street-02/v3-muse-portrait.png'], studioRefs: ['/agency-models/men-street-02/face-ref.png'] },
  { id: 'influencer-girl-01', name: 'RINKA', category: 'influencer', height: 165, measurements: { bust: 78, waist: 58, hips: 84 }, hair: 'Pink-ash, shoulder length', eyes: 'Dark brown', vibe: 'Tokyo street style, Harajuku creative', ...m('influencer-girl-01', { editorial: '/agency-models/influencer-girl-01/v3-campaign.png' }) },
  { id: 'influencer-boy-01', name: 'KAI', category: 'influencer', height: 178, measurements: { bust: 88, waist: 72, hips: 88 }, hair: 'Dark brown, curly-wavy', eyes: 'Light brown', vibe: 'Tokyo × Byron Bay, lifestyle creative', ...m('influencer-boy-01') },

  // ─── Legacy models (v1 roster) ─────────────────────────────
  { id: 'model-test', name: 'YUKI', category: 'ladies_asia', height: 176, measurements: { bust: 79, waist: 59, hips: 87 }, hair: 'Black, straight, long', eyes: 'Dark brown', vibe: 'Editorial high-fashion, structural beauty', images: { main: '/agency-models/model-test/editorial-beauty.png', polaroid: '/agency-models/model-test/polaroid-front.png', beauty: '/agency-models/model-test/editorial-beauty.png', editorial: '/agency-models/model-test/walking.png' }, portfolio: ['/agency-models/model-test/sample-1.png', '/agency-models/model-test/sample-2.png', '/agency-models/model-test/sample-3.png'] },
  { id: 'ladies-asia-2', name: 'AIKO', category: 'ladies_asia', height: 174, measurements: { bust: 80, waist: 58, hips: 86 }, hair: 'Dark brown, blunt bob', eyes: 'Dark brown', vibe: 'Celine / The Row editorial', images: { main: '/agency-models/ladies-asia-2/beauty.png', polaroid: '/agency-models/ladies-asia-2/polaroid-front.png', beauty: '/agency-models/ladies-asia-2/beauty.png', editorial: '/agency-models/ladies-asia-2/editorial.png' }, portfolio: ['/agency-models/ladies-asia-2/sample-1.png', '/agency-models/ladies-asia-2/sample-2.png', '/agency-models/ladies-asia-2/sample-3.png'] },
  { id: 'ladies-intl-clean', name: 'GEORGIAN', category: 'ladies_international', height: 178, measurements: { bust: 80, waist: 60, hips: 88 }, hair: 'Dark honey blonde, natural wave', eyes: 'Emerald green', vibe: 'Eastern European elegance, Valentino / Celine', images: { main: '/agency-models/ladies-intl-clean/beauty.png', polaroid: '/agency-models/ladies-intl-clean/polaroid-front.png', beauty: '/agency-models/ladies-intl-clean/beauty.png', editorial: '/agency-models/ladies-intl-clean/editorial.png' }, portfolio: ['/agency-models/ladies-intl-clean/sample-1.png', '/agency-models/ladies-intl-clean/sample-2.png', '/agency-models/ladies-intl-clean/sample-3.png'] },
  { id: 'men-asia-clean', name: 'KENJI T.', category: 'men_asia', height: 184, measurements: { bust: 88, waist: 70, hips: 88 }, hair: 'Black, medium, natural wave', eyes: 'Dark brown', vibe: 'Lemaire / Jil Sander, understated elegance', images: { main: '/agency-models/men-asia-clean/beauty.png', polaroid: '/agency-models/men-asia-clean/polaroid-front.png', beauty: '/agency-models/men-asia-clean/beauty.png', editorial: '/agency-models/men-asia-clean/editorial.png' }, portfolio: ['/agency-models/men-asia-clean/sample-1.png', '/agency-models/men-asia-clean/sample-2.png', '/agency-models/men-asia-clean/sample-3.png'] },
  { id: 'ladies-asia-3', name: 'SAKURA', category: 'influencer', height: 171, measurements: { bust: 78, waist: 57, hips: 85 }, hair: 'Black, long, straight', eyes: 'Dark brown', vibe: 'Fresh new face, lifestyle', images: { main: '/agency-models/ladies-asia-3/beauty.png', polaroid: '/agency-models/ladies-asia-3/polaroid-front.png', beauty: '/agency-models/ladies-asia-3/beauty.png', editorial: '/agency-models/ladies-asia-3/editorial.png' }, portfolio: ['/agency-models/ladies-asia-3/sample-1.png', '/agency-models/ladies-asia-3/sample-2.png', '/agency-models/ladies-asia-3/sample-3.png'] },
  { id: 'men-intl-clean', name: 'MARCUS', category: 'men_international', height: 188, measurements: { bust: 92, waist: 74, hips: 90 }, hair: 'Black, short fade', eyes: 'Dark brown', vibe: 'Dior Homme / Bottega Veneta editorial', images: { main: '/agency-models/men-intl-clean/beauty.png', polaroid: '/agency-models/men-intl-clean/polaroid-front.png', beauty: '/agency-models/men-intl-clean/beauty.png', editorial: '/agency-models/men-intl-clean/editorial.png' }, portfolio: ['/agency-models/men-intl-clean/sample-1.png', '/agency-models/men-intl-clean/sample-2.png', '/agency-models/men-intl-clean/sample-3.png'] },
  { id: 'nova', name: 'NOVA', category: 'ladies_international', height: 178, measurements: { bust: 80, waist: 60, hips: 88 }, hair: 'Platinum silver-white', eyes: 'Grey-green', vibe: 'Y3K cyborg beauty, futuristic editorial', images: { main: '/agency-models/nova/ref-three-quarter.png', polaroid: '/agency-models/nova/ref-front.png', beauty: '/agency-models/nova/ref-smiling.png', editorial: '/agency-models/nova/sample-02.png' }, portfolio: ['/agency-models/nova/sample-1.png', '/agency-models/nova/sample-2.png', '/agency-models/nova/sample-3.png'] },
  { id: 'ren', name: 'REN', category: 'men_asia', height: 181, measurements: { bust: 86, waist: 68, hips: 88 }, hair: 'Black, curtain bangs', eyes: 'Dark brown', vibe: 'K-beauty × Tokyo editorial', images: { main: '/agency-models/ren/ref-three-quarter.png', polaroid: '/agency-models/ren/ref-front.png', beauty: '/agency-models/ren/ref-smiling.png', editorial: '/agency-models/ren/sample-02.png' }, portfolio: ['/agency-models/ren/sample-1.png', '/agency-models/ren/sample-2.png', '/agency-models/ren/sample-3.png'] },
];

export const AGENCY_CATEGORIES = [
  { id: 'ladies_international', label: 'LADIES — INTERNATIONAL' },
  { id: 'ladies_asia', label: 'LADIES — ASIA' },
  { id: 'men_international', label: 'MEN — INTERNATIONAL' },
  { id: 'men_asia', label: 'MEN — ASIA' },
  { id: 'influencer', label: 'INFLUENCER' },
] as const;

/**
 * LUMINA MODEL AGENCY — AI Model roster v2
 *
 * 14 models with 4 ref shots + 4 portfolio looks each
 */

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
}

/** Portfolio image names — all possible files per model folder (excluding polaroid/beauty refs) */
const PORTFOLIO_FILES = [
  'look-01.png', 'look-02.png', 'look-03.png', 'look-04.png',
  'campaign.png', 'verve-cover.png', 'form-editorial.png', 'muse-portrait.png',
  'v3-campaign.png', 'v3-verve-cover.png', 'v3-form-editorial.png', 'v3-muse-portrait.png',
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
  { id: 'ladies-asia-01', name: 'MIKU', category: 'ladies_asia', height: 175, measurements: { bust: 78, waist: 57, hips: 85 }, hair: 'Black, blunt bob', eyes: 'Dark brown, monolid', vibe: 'Japanese avant-garde, Comme des Garçons / Sacai', ...m('ladies-asia-01') },
  { id: 'ladies-asia-02', name: 'HARIN', category: 'ladies_asia', height: 174, measurements: { bust: 79, waist: 58, hips: 87 }, hair: 'Black, long, straight', eyes: 'Dark brown, double lid', vibe: 'K-beauty editorial, Celine / quiet luxury', ...m('ladies-asia-02', { editorial: '/agency-models/ladies-asia-02/v3-verve-cover.png' }) },
  { id: 'ladies-asia-03', name: 'LIEN', category: 'ladies_asia', height: 176, measurements: { bust: 79, waist: 58, hips: 86 }, hair: 'Dark brown, modern shag', eyes: 'Dark brown, almond', vibe: 'Franco-Asian editorial, Dior / Loewe', ...m('ladies-asia-03', { editorial: '/agency-models/ladies-asia-03/v3-campaign.png' }) },
  { id: 'men-intl-01', name: 'IDRIS', category: 'men_international', height: 189, measurements: { bust: 92, waist: 74, hips: 90 }, hair: 'Black, short fade', eyes: 'Dark brown', vibe: 'Luxury menswear, Prada / Dior Homme', ...m('men-intl-01', { editorial: '/agency-models/men-intl-01/v3-verve-cover.png' }) },
  { id: 'men-intl-02', name: 'LARS', category: 'men_international', height: 187, measurements: { bust: 90, waist: 72, hips: 89 }, hair: 'Sandy blonde, medium', eyes: 'Light blue', vibe: 'Scandi minimal, COS / Lemaire', ...m('men-intl-02') },
  { id: 'men-intl-03', name: 'MATEO', category: 'men_international', height: 185, measurements: { bust: 91, waist: 73, hips: 90 }, hair: 'Dark brown, wavy', eyes: 'Dark brown', vibe: 'Mediterranean luxury, Tom Ford / Zegna', ...m('men-intl-03') },
  { id: 'men-asia-01', name: 'SHOTA', category: 'men_asia', height: 183, measurements: { bust: 88, waist: 70, hips: 88 }, hair: 'Black, medium, natural', eyes: 'Dark brown, monolid', vibe: 'Japanese minimalist, Issey Miyake / HOMME PLISSÉ', ...m('men-asia-01') },
  { id: 'men-asia-02', name: 'JIHO', category: 'men_asia', height: 182, measurements: { bust: 87, waist: 69, hips: 87 }, hair: 'Black, medium-long, soft', eyes: 'Dark brown, double lid', vibe: 'Androgynous editorial, Raf Simons / Loewe', ...m('men-asia-02') },
  { id: 'men-asia-03', name: 'TAKU', category: 'men_asia', height: 180, measurements: { bust: 90, waist: 72, hips: 89 }, hair: 'Black with grey temples, short', eyes: 'Dark brown', vibe: 'Mature menswear, Auralee / COMOLI', ...m('men-asia-03', { main: '/agency-models/men-asia-03/polaroid-front.png', beauty: '/agency-models/men-asia-03/v3-muse-portrait.png', editorial: '/agency-models/men-asia-03/v3-campaign.png' }) },
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

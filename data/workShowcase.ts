/**
 * workShowcase.ts — Volume gallery + featured lookbook data for /for-brands.
 *
 * Three artifacts:
 *   1. LOOKBOOK_SS26 — LUMINA Spring/Summer 2026 lookbook (9 spreads)
 *   2. WORK_GALLERY — roster-wide mass showcase (auto-built from AGENCY_MODELS)
 *   3. FEATURED_CASE_IMAGES — hero images for the 2 featured case cards
 */

import { AGENCY_MODELS } from './agencyModels';

// ─── LUMINA_Lookbook_SS26 Vol.01 ────────────────────────────────────────────

export interface LookbookSpread {
  src: string;
  caption: string;
  layout: 'wide' | 'half';
}

export const LOOKBOOK_SS26: LookbookSpread[] = [
  {
    src: '/case-studies/lumina-lookbook-ss26/page-01.jpg',
    caption: 'Cover — Navy airfield at golden hour',
    layout: 'wide',
  },
  {
    src: '/case-studies/lumina-lookbook-ss26/page-03.jpg',
    caption: 'Coastal highway — leather, linen, a convertible',
    layout: 'wide',
  },
  {
    src: '/case-studies/lumina-lookbook-ss26/page-02.jpg',
    caption: 'Studio portraits — Cowichan knit & cable cardigan',
    layout: 'half',
  },
  {
    src: '/case-studies/lumina-lookbook-ss26/page-04.jpg',
    caption: 'Chambray work shirt · plaid overshirt',
    layout: 'half',
  },
  {
    src: '/case-studies/lumina-lookbook-ss26/page-05.jpg',
    caption: 'Hangar — camo dress with leather bomber',
    layout: 'wide',
  },
  {
    src: '/case-studies/lumina-lookbook-ss26/page-07.jpg',
    caption: 'Red 1967 Mustang — heritage Americana',
    layout: 'wide',
  },
  {
    src: '/case-studies/lumina-lookbook-ss26/page-06.jpg',
    caption: 'Surf shack + sunset motorcycle',
    layout: 'half',
  },
  {
    src: '/case-studies/lumina-lookbook-ss26/page-08.jpg',
    caption: 'Black-and-white — aircraft fuselage & runway denim',
    layout: 'half',
  },
  {
    src: '/case-studies/lumina-lookbook-ss26/page-09.jpg',
    caption: 'Military cabin — denim jumpsuit',
    layout: 'wide',
  },
];

// ─── Roster volume gallery ──────────────────────────────────────────────────

export interface ShowcaseTile {
  src: string;
  modelName: string;
  modelId: string;
  aspect: 'portrait' | 'tall' | 'square';
}

/**
 * Build gallery using only explicitly-registered image paths.
 * `images.{editorial,main,beauty}` are always set per model (defaults or explicit overrides).
 * We avoid `portfolio[]` because PORTFOLIO_FILES contains speculative paths that may 404.
 */
function buildGallery(): ShowcaseTile[] {
  const tiles: ShowcaseTile[] = [];
  const aspectCycle: ShowcaseTile['aspect'][] = ['portrait', 'tall', 'portrait', 'square', 'portrait', 'tall'];
  let ci = 0;

  for (const m of AGENCY_MODELS) {
    const candidates = [m.images.editorial, m.images.main, m.images.beauty]
      .filter((x): x is string => Boolean(x));
    const unique = Array.from(new Set(candidates));
    const picks = unique.slice(0, 2);

    for (const src of picks) {
      tiles.push({
        src,
        modelName: m.name,
        modelId: m.id,
        aspect: aspectCycle[ci % aspectCycle.length],
      });
      ci++;
    }
  }

  return tiles.slice(0, 20);
}

export const WORK_GALLERY: ShowcaseTile[] = buildGallery();

// ─── Featured case hero covers ──────────────────────────────────────────────

/** Hero images for the 2 featured case cards (BEDWIN + EC20SKU).
 *  The Lookbook has its own dedicated section and no longer appears in cards. */
export const FEATURED_CASE_IMAGES: string[] = [
  '/agency-models/men-street-02/campaign.png',     // BEDWIN 26SS
  '/agency-models/ladies-intl-01/beauty.png',      // EC 20SKU
];

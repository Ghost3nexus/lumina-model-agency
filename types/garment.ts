export type GarmentCategory = 'tops' | 'pants' | 'dress' | 'outer' | 'skirt' | 'shoes' | 'accessories';

export interface GarmentConstruction {
  collar: string;
  closure: string;
  sleeves: string;
  pockets: string;
  hem: string;
  seams: string;
  lining: string;
}

export interface GarmentAnalysis {
  category: GarmentCategory;
  subcategory: string;
  color: string;
  colors: string[];
  material: string;
  pattern: string;
  construction: GarmentConstruction;
  branding: string;
  fit: string;
  length: string;
  details: string[];
  description: string;
}

// ─── Multi-slot outfit types ─────────────────────────────────────────────────

export type OutfitSlot =
  | 'tops' | 'outer' | 'inner'
  | 'pants' | 'skirt' | 'dress'
  | 'shoes' | 'eyewear' | 'headgear' | 'accessories';

export interface SlotImage {
  preview: string;      // data URL for display
  compressed: string;   // data URL for API
}

export interface SlotUpload {
  slot: OutfitSlot;
  preview: string;      // data URL for display (primary image)
  compressed: string;   // data URL for API (primary image)
  extraImages: SlotImage[];  // additional angles (back, detail, etc.)
  analysis?: GarmentAnalysis;
}

export interface OutfitUpload {
  slots: Partial<Record<OutfitSlot, SlotUpload>>;
}

// ─── Slot metadata ───────────────────────────────────────────────────────────

export interface SlotMeta {
  slot: OutfitSlot;
  label: string;
  emoji: string;
  group: 'coordinate' | 'accessory';
}

/** Top-half slots that satisfy the "top" requirement */
export const TOP_HALF_SLOTS: ReadonlySet<OutfitSlot> = new Set(['tops', 'outer', 'dress']);

/** Bottom-half slots that satisfy the "bottom" requirement */
export const BOTTOM_HALF_SLOTS: ReadonlySet<OutfitSlot> = new Set(['pants', 'skirt', 'dress']);

export const SLOT_META: SlotMeta[] = [
  // Coordinate (required section)
  { slot: 'tops',    label: 'トップス',         emoji: '\u{1F455}', group: 'coordinate' },
  { slot: 'outer',   label: 'アウター',         emoji: '\u{1F9E5}', group: 'coordinate' },
  { slot: 'pants',   label: 'パンツ',           emoji: '\u{1F456}', group: 'coordinate' },
  { slot: 'skirt',   label: 'スカート',         emoji: '\u{1F457}', group: 'coordinate' },
  { slot: 'dress',   label: 'ドレス/ワンピース', emoji: '\u{1F457}', group: 'coordinate' },
  // Accessory (optional section)
  { slot: 'inner',       label: 'インナー',     emoji: '\u{1F454}', group: 'accessory' },
  { slot: 'shoes',       label: 'シューズ',     emoji: '\u{1F45F}', group: 'accessory' },
  { slot: 'eyewear',     label: 'アイウェア',   emoji: '\u{1F576}\u{FE0F}', group: 'accessory' },
  { slot: 'headgear',    label: 'ヘッドギア',   emoji: '\u{1F9E2}', group: 'accessory' },
  { slot: 'accessories', label: 'アクセサリー', emoji: '\u{1F48D}', group: 'accessory' },
];

/**
 * Check if the outfit slots satisfy the minimum generation requirement:
 * at least 1 top-half item AND 1 bottom-half item (dress alone counts as both).
 */
export function isOutfitReady(slots: Partial<Record<OutfitSlot, SlotUpload>>): boolean {
  const filledSlots = Object.keys(slots) as OutfitSlot[];
  const hasTopHalf = filledSlots.some(s => TOP_HALF_SLOTS.has(s));
  const hasBottomHalf = filledSlots.some(s => BOTTOM_HALF_SLOTS.has(s));
  return hasTopHalf && hasBottomHalf;
}

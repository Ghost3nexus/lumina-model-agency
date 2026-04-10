/**
 * motionDictionary.ts — Research-based I2V motion prompts
 *
 * Categorized by cut role. Each prompt optimized for Kling v2.1.
 * Source: RINKA GRWM production + 15-video viral analysis.
 */

import type { MotionEntry } from '../../types/video';

export const MOTION_DICTIONARY: MotionEntry[] = [
  // ── Hook ──
  { id: 'hook-blink', label: '寝起き瞬き', category: 'hook', prompt: 'Blinks slowly, slightly shifts head on pillow, sleepy annoyed expression. Minimal movement.' },
  { id: 'hook-mirror', label: '鏡チェック', category: 'hook', prompt: 'Looks at own reflection, touches face lightly, evaluating expression. Subtle head tilt.' },
  { id: 'hook-reach', label: 'アイテムに手を伸ばす', category: 'hook', prompt: 'Reaches toward clothing rack, hand enters frame from side. Casual, unhurried.' },

  // ── Prep ──
  { id: 'prep-hair', label: '髪セット', category: 'prep', prompt: 'Both hands run through hair, tousling and arranging strands while looking in mirror.' },
  { id: 'prep-skincare', label: 'スキンケア', category: 'prep', prompt: 'Applies skincare product to face with gentle patting motion, looking in small mirror.' },

  // ── Wear ──
  { id: 'wear-top', label: 'トップス着用', category: 'wear', prompt: 'Pulls shirt over head, adjusts collar and hem, checks fit in mirror.' },
  { id: 'wear-bottom', label: 'ボトムス着用', category: 'wear', prompt: 'Adjusts pants waistband in mirror reflection. Lower body movement only.' },
  { id: 'wear-outer', label: 'アウター羽織り', category: 'wear', prompt: 'Puts on jacket, adjusts collar with one hand in mirror. Slight shoulder movement, satisfied expression.' },
  { id: 'wear-shoes', label: '靴を手に取る', category: 'wear', prompt: 'Hands pick up boots/shoes, laces swing gently. Subtle hand movement lifting up.' },
  { id: 'wear-accessory', label: 'アクセサリー装着', category: 'wear', prompt: 'Fingers clasp necklace behind neck, delicate movement. Slight wrist turn showing bracelet.' },

  // ── Show ──
  { id: 'show-turn', label: '360度回転', category: 'show', prompt: 'Slowly turns from front to side to back, showing full outfit from all angles. Confident expression.' },
  { id: 'show-pose', label: 'ポージング', category: 'show', prompt: 'Strikes a confident fashion pose, slight weight shift, hand adjusts jacket or touches hair.' },
  { id: 'show-mirror', label: '鏡で確認', category: 'show', prompt: 'Checks reflection in mirror, nods slightly with satisfied subtle smile. Minimal movement.' },
  { id: 'show-detail', label: 'ディテール見せ', category: 'show', prompt: 'Holds fabric close to camera, fingers showing texture. Fabric moves gently.' },

  // ── Street ──
  { id: 'street-walk', label: 'ストリートウォーク', category: 'street', prompt: 'Walking forward down street, natural stride, hands at sides or in pockets. Hair sways with movement.' },
  { id: 'street-lookback', label: '振り返り', category: 'street', prompt: 'Looks back over shoulder at camera, casual smile or peace sign. Hair blown by breeze.' },
  { id: 'street-candid', label: 'キャンディッド', category: 'street', prompt: 'Candid moment on street, natural laugh, relaxed body language, wind in hair.' },
  { id: 'street-crossing', label: '横断歩道', category: 'street', prompt: 'Walking across crosswalk, urban background scrolls, confident stride.' },

  // ── Product ──
  { id: 'product-hold', label: '商品を持つ', category: 'product', prompt: 'Holds garment up to camera with both hands, fabric drapes naturally, showing full design.' },
  { id: 'product-unfold', label: '商品を広げる', category: 'product', prompt: 'Unfolds garment on flat surface, smoothing with hands, logo and details become visible.' },
  { id: 'product-tag', label: 'タグ見せ', category: 'product', prompt: 'Turns over clothing tag/label, fingers holding delicately, reading information.' },
  { id: 'product-swing', label: '素材の揺れ', category: 'product', prompt: 'Garment swings gently on hanger or in hand, showing material flow and drape, soft movement.' },
];

export const DEFAULT_NEGATIVE_PROMPT = 'morphing, distortion, blurry face, extra fingers, unnatural body movement, static image';

/** Get motions filtered by category */
export function getMotionsByCategory(category: MotionEntry['category']): MotionEntry[] {
  return MOTION_DICTIONARY.filter(m => m.category === category);
}

/** Get a single motion by ID */
export function getMotion(id: string): MotionEntry | undefined {
  return MOTION_DICTIONARY.find(m => m.id === id);
}

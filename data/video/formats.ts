/**
 * formats.ts — 5 video format templates
 *
 * Based on 15-video viral analysis (docs/sns-shorts/grwm-viral-analysis.md)
 */

import type { VideoFormat } from '../../types/video';

export const VIDEO_FORMATS: VideoFormat[] = [
  {
    id: 'grwm',
    label: 'GRWM',
    description: 'Get Ready With Me — 支度動画。Hook→準備→着用→完成→外出',
    durationRange: { min: 15, max: 60 },
    cutRange: { min: 6, max: 15 },
    defaultCuts: [
      { role: 'hook', label: 'Hook (寝起き/Before)', duration: 5, camera: 'selfie', defaultMotionId: 'hook-blink', stillPromptHint: 'lying in bed, messy hair, sleepy expression, morning light from window, cozy bedroom', textOverlay: '' },
      { role: 'prep', label: '準備 (ヘア/スキンケア)', duration: 5, camera: 'mirror-bust', defaultMotionId: 'prep-hair', stillPromptHint: 'sitting at low table with mirror, doing hair, warm morning light, skincare products scattered' },
      { role: 'item', label: 'アイテム1 (靴/キーアイテム)', duration: 5, camera: 'closeup', defaultMotionId: 'wear-shoes', stillPromptHint: 'hands picking up shoes/boots, close-up of footwear detail, warm indoor light' },
      { role: 'wear', label: 'アイテム2 (ボトムス着用)', duration: 5, camera: 'mirror-lower', defaultMotionId: 'wear-bottom', stillPromptHint: 'adjusting pants waistband in full-length mirror, lower body focus, natural pose' },
      { role: 'item', label: 'アイテム3 (トップス/ロゴ見せ)', duration: 5, camera: 'closeup', defaultMotionId: 'product-hold', stillPromptHint: 'holding up t-shirt/top showing brand logo, hands presenting garment to camera' },
      { role: 'wear', label: 'アイテム4 (アウター羽織り)', duration: 5, camera: 'mirror-bust', defaultMotionId: 'wear-outer', stillPromptHint: 'putting on jacket in mirror, adjusting collar, satisfied expression' },
      { role: 'accessory', label: 'アクセサリー', duration: 5, camera: 'closeup', defaultMotionId: 'wear-accessory', stillPromptHint: 'clasping necklace, close-up of hands at neck/wrist, delicate jewelry detail' },
      { role: 'complete', label: '全身コーデ完成', duration: 5, camera: 'mirror-full', defaultMotionId: 'show-turn', stillPromptHint: 'full body outfit complete in mirror, confident stance, warm room light' },
      { role: 'street', label: 'ストリートウォーク', duration: 5, camera: 'follow', defaultMotionId: 'street-walk', stillPromptHint: 'walking on narrow street, natural stride, urban background, natural daylight' },
      { role: 'closing', label: '振り返り/締め', duration: 5, camera: 'front-street', defaultMotionId: 'street-lookback', stillPromptHint: 'looking back at camera on street, casual smile, candid moment, natural light' },
    ],
  },
  {
    id: 'outfit-transition',
    label: 'Outfit Transition',
    description: 'ビートドロップ変身。Before→After×1-4ルック。最もバイラル可能性が高い',
    durationRange: { min: 15, max: 20 },
    cutRange: { min: 4, max: 8 },
    defaultCuts: [
      { role: 'hook', label: 'Before (部屋着)', duration: 5, camera: 'mirror-full', defaultMotionId: 'show-mirror', stillPromptHint: 'wearing casual/pajama clothes, standing in front of mirror, relaxed posture, same position as after shots' },
      { role: 'complete', label: 'After Look 1', duration: 5, camera: 'mirror-full', defaultMotionId: 'show-pose', stillPromptHint: 'complete outfit look 1, same mirror position as before, confident pose, fashion photography' },
      { role: 'complete', label: 'After Look 2', duration: 5, camera: 'mirror-full', defaultMotionId: 'show-turn', stillPromptHint: 'complete outfit look 2, same mirror position, different outfit, striking pose' },
      { role: 'complete', label: 'After Look 3', duration: 5, camera: 'mirror-full', defaultMotionId: 'show-pose', stillPromptHint: 'complete outfit look 3, same mirror position, third outfit option, model poses' },
    ],
  },
  {
    id: 'lookbook',
    label: 'Lookbook',
    description: 'ルック×3構成。フラットレイ→着用→全身→ディテール→ストリート',
    durationRange: { min: 30, max: 60 },
    cutRange: { min: 9, max: 18 },
    defaultCuts: [
      // Look 1
      { role: 'flatlay', label: 'Look 1: フラットレイ', duration: 5, camera: 'overhead', defaultMotionId: 'product-unfold', stillPromptHint: 'flat lay of outfit items arranged on clean surface, overhead view, styled composition' },
      { role: 'wear', label: 'Look 1: 着用', duration: 5, camera: 'mirror-full', defaultMotionId: 'wear-top', stillPromptHint: 'putting on outfit in mirror, dressing process, natural movement' },
      { role: 'complete', label: 'Look 1: 全身', duration: 5, camera: 'full-front', defaultMotionId: 'show-pose', stillPromptHint: 'full body outfit shot, clean background, fashion photography pose' },
      { role: 'detail', label: 'Look 1: ディテール', duration: 5, camera: 'closeup', defaultMotionId: 'show-detail', stillPromptHint: 'close-up of fabric texture, brand detail, stitching, material quality' },
      { role: 'street', label: 'Look 1: ストリート', duration: 5, camera: 'follow', defaultMotionId: 'street-walk', stillPromptHint: 'walking on street in outfit, natural stride, urban setting' },
      // Look 2
      { role: 'flatlay', label: 'Look 2: フラットレイ', duration: 5, camera: 'overhead', defaultMotionId: 'product-unfold', stillPromptHint: 'flat lay of second outfit items, overhead view, different color palette' },
      { role: 'wear', label: 'Look 2: 着用', duration: 5, camera: 'mirror-full', defaultMotionId: 'wear-outer', stillPromptHint: 'putting on second outfit, layering process in mirror' },
      { role: 'complete', label: 'Look 2: 全身', duration: 5, camera: 'full-front', defaultMotionId: 'show-turn', stillPromptHint: 'full body second look, 360 turn, showing silhouette' },
      { role: 'street', label: 'Look 2: ストリート', duration: 5, camera: 'front-street', defaultMotionId: 'street-candid', stillPromptHint: 'candid street moment in second outfit, laughing, natural light' },
      // Look 3
      { role: 'flatlay', label: 'Look 3: フラットレイ', duration: 5, camera: 'overhead', defaultMotionId: 'product-unfold', stillPromptHint: 'flat lay of third outfit items, overhead, evening/bold palette' },
      { role: 'complete', label: 'Look 3: 全身', duration: 5, camera: 'full-front', defaultMotionId: 'show-pose', stillPromptHint: 'full body third look, most impactful outfit, strong pose' },
      { role: 'closing', label: 'Look 3: 締め', duration: 5, camera: 'front-street', defaultMotionId: 'street-lookback', stillPromptHint: 'final shot walking away, looks back at camera, street setting' },
    ],
  },
  {
    id: 'product-showcase',
    label: 'Product Showcase',
    description: '商品PR。商品クローズアップ→モデル着用→ディテール→全身。EC向け',
    durationRange: { min: 15, max: 30 },
    cutRange: { min: 4, max: 8 },
    defaultCuts: [
      { role: 'product', label: '商品単体', duration: 5, camera: 'closeup', defaultMotionId: 'product-hold', stillPromptHint: 'garment displayed on clean background, product photography, fabric texture visible, professional lighting' },
      { role: 'detail', label: 'タグ/ブランド', duration: 5, camera: 'macro', defaultMotionId: 'product-tag', stillPromptHint: 'extreme close-up of brand tag/label, stitching detail, quality indicators' },
      { role: 'wear', label: '着用', duration: 5, camera: 'mirror-full', defaultMotionId: 'wear-top', stillPromptHint: 'model putting on the garment, natural dressing movement, showing fit' },
      { role: 'complete', label: '全身フロント', duration: 5, camera: 'full-front', defaultMotionId: 'show-pose', stillPromptHint: 'full body front shot wearing the product, EC standard angle, clean background, directional lighting' },
      { role: 'complete', label: '全身バック', duration: 5, camera: 'full-back', defaultMotionId: 'show-turn', stillPromptHint: 'full body back view, showing back design details, same lighting as front' },
      { role: 'street', label: '動き/シルエット確認', duration: 5, camera: 'follow', defaultMotionId: 'street-walk', stillPromptHint: 'model walking showing fabric movement and drape, natural stride, silhouette visible' },
    ],
  },
  {
    id: 'editorial',
    label: 'Editorial',
    description: 'シネマティック構成。ブランディング/キャンペーン向け',
    durationRange: { min: 30, max: 60 },
    cutRange: { min: 6, max: 12 },
    defaultCuts: [
      { role: 'atmosphere', label: '空気感/ロケーション', duration: 5, camera: 'wide', defaultMotionId: 'street-walk', stillPromptHint: 'wide establishing shot of location, cinematic composition, atmospheric lighting, no model yet' },
      { role: 'hook', label: 'モデル登場', duration: 5, camera: 'medium-back', defaultMotionId: 'street-walk', stillPromptHint: 'model entering frame from behind, silhouette shot, dramatic lighting, editorial fashion' },
      { role: 'detail', label: 'ディテール1', duration: 5, camera: 'closeup', defaultMotionId: 'show-detail', stillPromptHint: 'close-up of hands, accessories, fabric detail, shallow depth of field, editorial quality' },
      { role: 'portrait', label: 'ポートレート', duration: 5, camera: 'bust', defaultMotionId: 'show-mirror', stillPromptHint: 'portrait bust shot, direct eye contact, dramatic lighting, high fashion editorial expression' },
      { role: 'complete', label: 'ウォーキング/動き', duration: 5, camera: 'full-side', defaultMotionId: 'street-walk', stillPromptHint: 'full body walking shot from side, fabric movement, cinematic composition, editorial fashion' },
      { role: 'detail', label: 'ディテール2', duration: 5, camera: 'closeup', defaultMotionId: 'product-swing', stillPromptHint: 'different angle detail shot, texture and material close-up, artistic composition' },
      { role: 'complete', label: 'メインショット', duration: 5, camera: 'full-front', defaultMotionId: 'show-pose', stillPromptHint: 'hero shot, full body, most impactful composition, editorial lighting, high fashion pose' },
      { role: 'closing', label: '締め/歩き去り', duration: 5, camera: 'wide', defaultMotionId: 'street-walk', stillPromptHint: 'model walking away into distance, wide shot, atmospheric, cinematic ending' },
    ],
  },
];

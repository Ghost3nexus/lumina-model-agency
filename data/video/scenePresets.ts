import type { ScenePreset } from '../../types/video';

export const SCENE_PRESETS: ScenePreset[] = [
  {
    id: 'grwm',
    label: 'GRWM',
    description: 'Get Ready With Me — 朝の準備シーン',
    stillPromptHint: 'cozy bedroom morning light, mirror reflection, getting ready',
  },
  {
    id: 'lookbook',
    label: 'Lookbook',
    description: 'ファッションルックブック',
    stillPromptHint: 'clean minimal background, editorial fashion photography, full body',
  },
  {
    id: 'product',
    label: 'Product PR',
    description: '商品プロモーション動画',
    stillPromptHint: 'product showcase, clean background, professional lighting',
  },
  {
    id: 'street',
    label: 'Street',
    description: 'ストリートスナップ風',
    stillPromptHint: 'urban street photography, natural light, candid vibe',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    description: '雑誌エディトリアル風',
    stillPromptHint: 'high fashion editorial, dramatic lighting, artistic composition',
  },
  {
    id: 'custom',
    label: 'Custom',
    description: 'カスタムシーン',
  },
];

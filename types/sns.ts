import type { AngleType } from './generation';

export type ShootMode = 'ec-standard' | 'sns-creative';

export type SceneCategory = 'editorial' | 'campaign' | 'street' | 'surreal';

export type AspectRatio = '4:5' | '1:1' | '9:16' | '16:9';

export type VariationType = 'var1' | 'var2' | 'var3' | 'var4';

export type ResultKey = AngleType | VariationType;

export const VARIATION_KEYS: readonly VariationType[] = ['var1', 'var2', 'var3', 'var4'];

export const ASPECT_RATIO_PIXELS: Record<AspectRatio, { width: number; height: number }> = {
  '4:5':  { width: 1024, height: 1280 },
  '1:1':  { width: 1024, height: 1024 },
  '9:16': { width: 1024, height: 1820 },
  '16:9': { width: 1820, height: 1024 },
};

export interface ScenePreset {
  id: string;
  name: string;
  category: SceneCategory;
  direction: string;
  thumbnail: string;
}

export interface SNSCreativeConfig {
  scene: ScenePreset;
  customPrompt?: string;
  aspectRatio: AspectRatio;
}

export const VARIATION_CAMERAS: Record<VariationType, { camera: string; composition: string; label: string }> = {
  var1: {
    camera: 'Full body shot, eye-level camera',
    composition: 'Subject centered with breathing room above and below',
    label: 'Standard',
  },
  var2: {
    camera: '3/4 body shot, slightly low angle camera',
    composition: 'Subject off-center using rule of thirds',
    label: 'Dynamic',
  },
  var3: {
    camera: 'Medium shot from waist up, eye-level',
    composition: 'Tight crop focusing on face and upper garment texture',
    label: 'Portrait',
  },
  var4: {
    camera: 'Full body shot, wide environmental framing',
    composition: 'Subject occupies 40-50% of frame, scene context visible around them',
    label: 'Context',
  },
};

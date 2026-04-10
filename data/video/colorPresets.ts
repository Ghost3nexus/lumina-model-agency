/**
 * colorPresets.ts — Color grading presets for still images
 *
 * Applied via Canvas before I2V conversion.
 * Based on viral analysis: warm morning / natural / film grain styles.
 */

export interface ColorPreset {
  id: string;
  label: string;
  description: string;
  /** CSS filter string for preview */
  cssFilter: string;
  /** Canvas adjustments for baking into still */
  adjustments: {
    brightness?: number;    // multiplier, 1.0 = no change
    contrast?: number;      // multiplier
    saturate?: number;      // multiplier
    warmth?: number;        // -1 to 1, positive = warm
    grain?: number;         // 0-1, grain intensity
  };
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'none',
    label: 'None',
    description: 'No color grading',
    cssFilter: 'none',
    adjustments: {},
  },
  {
    id: 'warm-morning',
    label: 'Warm Morning',
    description: '暖色朝日トーン。室内GRWM向け',
    cssFilter: 'brightness(1.05) contrast(0.95) saturate(1.1) sepia(0.15)',
    adjustments: { brightness: 1.05, contrast: 0.95, saturate: 1.1, warmth: 0.15 },
  },
  {
    id: 'natural-daylight',
    label: 'Natural Daylight',
    description: '自然光。屋外・ストリート向け',
    cssFilter: 'brightness(1.02) contrast(1.05) saturate(1.05)',
    adjustments: { brightness: 1.02, contrast: 1.05, saturate: 1.05 },
  },
  {
    id: 'film-grain',
    label: 'Film',
    description: 'フィルム粒子感。ヴィンテージ/エディトリアル向け',
    cssFilter: 'contrast(1.1) saturate(0.9) sepia(0.08)',
    adjustments: { contrast: 1.1, saturate: 0.9, warmth: 0.08, grain: 0.3 },
  },
  {
    id: 'cool-editorial',
    label: 'Cool Editorial',
    description: 'クール寒色系。ハイファッション向け',
    cssFilter: 'brightness(0.98) contrast(1.1) saturate(0.85) hue-rotate(-5deg)',
    adjustments: { brightness: 0.98, contrast: 1.1, saturate: 0.85, warmth: -0.1 },
  },
  {
    id: 'high-contrast',
    label: 'High Contrast',
    description: '高コントラスト。ストリート/ビートドロップ向け',
    cssFilter: 'contrast(1.25) saturate(1.15) brightness(0.95)',
    adjustments: { contrast: 1.25, saturate: 1.15, brightness: 0.95 },
  },
];

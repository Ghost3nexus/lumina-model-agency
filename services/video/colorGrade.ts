/**
 * colorGrade.ts — Apply color grading to still images via Canvas
 *
 * Bakes color adjustments into the image before I2V conversion.
 */

import type { ColorPreset } from '../../data/video/colorPresets';

/**
 * Apply color grading preset to a base64 image.
 */
export async function applyColorGrade(
  imageBase64: string,
  preset: ColorPreset,
): Promise<string> {
  if (preset.id === 'none') return imageBase64;

  const img = await loadImage(imageBase64);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  // Apply CSS-style filter via canvas
  ctx.filter = preset.cssFilter;
  ctx.drawImage(img, 0, 0);
  ctx.filter = 'none';

  // Apply film grain if specified
  if (preset.adjustments.grain && preset.adjustments.grain > 0) {
    applyGrain(ctx, canvas.width, canvas.height, preset.adjustments.grain);
  }

  return canvas.toDataURL('image/png');
}

function applyGrain(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const amount = intensity * 25; // 0-25 noise range

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * amount;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = src;
  });
}

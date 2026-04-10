/**
 * textOverlay.ts — Burn text onto still images before I2V
 *
 * Renders text overlay on a canvas, returns new base64.
 * Text is baked into the still so it appears in the generated video.
 *
 * Style: white bold gothic + black stroke. Safe zone: top 200-600px area.
 * Based on viral analysis: minimal sans-serif, 36pt+, 2px black stroke.
 */

export interface TextOverlayConfig {
  text: string;
  position?: 'top' | 'center' | 'bottom';
  fontSize?: number;     // CSS px, default 48
  color?: string;        // default white
  strokeColor?: string;  // default black
  strokeWidth?: number;  // default 2
}

/**
 * Burn text onto a base64 image. Returns new base64 data URL.
 */
export async function applyTextOverlay(
  imageBase64: string,
  config: TextOverlayConfig,
): Promise<string> {
  if (!config.text.trim()) return imageBase64;

  const img = await loadImage(imageBase64);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  // Draw original image
  ctx.drawImage(img, 0, 0);

  // Text settings
  const fontSize = config.fontSize ?? Math.round(img.height * 0.04); // ~4% of height
  const font = `bold ${fontSize}px "Noto Sans JP", "Hiragino Kaku Gothic Pro", sans-serif`;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Position
  let y: number;
  const pos = config.position ?? 'top';
  if (pos === 'top') {
    y = img.height * 0.12; // safe zone top area
  } else if (pos === 'bottom') {
    y = img.height * 0.88;
  } else {
    y = img.height * 0.5;
  }
  const x = img.width / 2;

  // Stroke (outline)
  const strokeWidth = config.strokeWidth ?? 2;
  if (strokeWidth > 0) {
    ctx.strokeStyle = config.strokeColor ?? '#000000';
    ctx.lineWidth = strokeWidth * 2; // doubled because strokeText renders half inside
    ctx.lineJoin = 'round';
    ctx.strokeText(config.text, x, y);
  }

  // Fill
  ctx.fillStyle = config.color ?? '#FFFFFF';
  ctx.fillText(config.text, x, y);

  return canvas.toDataURL('image/png');
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = src;
  });
}

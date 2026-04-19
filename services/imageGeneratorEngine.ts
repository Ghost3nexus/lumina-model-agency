/**
 * imageGeneratorEngine.ts — Engine dispatcher for image generation
 *
 * Chooses between the default single-step Gemini pipeline and the nano-banana
 * 2-step pipeline (Gemini + head-shrink edit) based on VITE_IMAGE_ENGINE.
 *
 * Both engines use the SAME Gemini API and the SAME apiKey — no separate billing.
 *
 * Default: 'gemini' (single-step).
 * Set VITE_IMAGE_ENGINE='nano-banana' to enable the head-shrink second pass for
 * 8.5-to-9-head runway proportion.
 */

import * as gemini from './imageGenerator';
import * as nanoBanana from './imageGeneratorNanoBanana';

type Engine = 'gemini' | 'nano-banana';

function currentEngine(): Engine {
  const v = String(import.meta.env?.VITE_IMAGE_ENGINE ?? 'gemini').trim();
  return v === 'nano-banana' ? 'nano-banana' : 'gemini';
}

export function getEngine(): Engine {
  return currentEngine();
}

export const generateFront: typeof gemini.generateFront = (...args) => {
  return currentEngine() === 'nano-banana'
    ? nanoBanana.generateFront(...args)
    : gemini.generateFront(...args);
};

export const generateAngle: typeof gemini.generateAngle = (...args) => {
  return currentEngine() === 'nano-banana'
    ? nanoBanana.generateAngle(...args)
    : gemini.generateAngle(...args);
};

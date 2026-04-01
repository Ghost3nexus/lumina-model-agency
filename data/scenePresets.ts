import type { SceneCategory, ScenePreset } from '../types/sns';

// ────────────────────────────────────────────────────────────────────────────
// Category gradient placeholders (used when no thumbnail image is available)
// ────────────────────────────────────────────────────────────────────────────
export const CATEGORY_GRADIENTS: Record<SceneCategory, string> = {
  editorial: 'linear-gradient(135deg, #f5f0eb 0%, #d4c5b0 100%)',
  campaign:  'linear-gradient(135deg, #e8e8e8 0%, #b0b0b0 100%)',
  street:    'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  surreal:   'linear-gradient(135deg, #ff6b9d 0%, #c44dff 50%, #4dc8ff 100%)',
};

// ────────────────────────────────────────────────────────────────────────────
// 18 Scene Presets
// ────────────────────────────────────────────────────────────────────────────
export const SCENE_PRESETS: ScenePreset[] = [

  // ── Editorial (5) ──────────────────────────────────────────────────────────

  {
    id: 'editorial-popeye',
    name: 'POPEYE',
    category: 'editorial',
    direction:
      'Natural daylight streaming through urban windows, warm golden tones of a Tokyo afternoon. ' +
      'City boy energy — relaxed, unstudied poses that feel genuinely lived-in, generous white space around the subject. ' +
      'Subtle film-grain texture, muted warm palette, the quiet atmosphere of Japanese city life captured between moments.',
    thumbnail: '',
  },

  {
    id: 'editorial-fudge',
    name: 'FUDGE',
    category: 'editorial',
    direction:
      'Soft, diffused natural light as if filtered through sheer curtains on a Sunday morning. ' +
      'Girlish-boyish aesthetic — fashion woven into everyday life rather than performed for the camera. ' +
      'Muted warm tones, nostalgic film quality with gentle halation, the comfortable intimacy of a personal diary photograph.',
    thumbnail: '',
  },

  {
    id: 'editorial-numero',
    name: 'Numero',
    category: 'editorial',
    direction:
      'High-fashion editorial with cinematic drama — strong directional lighting carving sculptural shadows across the figure. ' +
      'Powerful, intentional poses that command the frame; graphic composition with bold geometric tension. ' +
      'Rich, saturated colors rendered with precision; every element deliberate, nothing accidental.',
    thumbnail: '',
  },

  {
    id: 'editorial-brutus',
    name: 'BRUTUS',
    category: 'editorial',
    direction:
      'Fashion meeting culture and intellect — the understated elegance of someone who reads, travels, and thinks. ' +
      'Clean composition influenced by Japanese aesthetic principles: ma (negative space), wabi-sabi imperfection, refined restraint. ' +
      'Soft but directional natural light; tones are desaturated and contemplative, never decorative.',
    thumbnail: '',
  },

  {
    id: 'editorial-id',
    name: 'i-D',
    category: 'editorial',
    direction:
      'Raw youth culture energy — rebellious, unpolished, electric with DIY attitude meeting high fashion. ' +
      'Harsh on-camera flash that flattens and saturates simultaneously, the iconic i-D wink in the subject\'s expression. ' +
      'Punk energy colliding with couture; composition that breaks rules deliberately and confidently.',
    thumbnail: '',
  },

  // ── Campaign (4) ───────────────────────────────────────────────────────────

  {
    id: 'campaign-minimal',
    name: 'Minimal',
    category: 'campaign',
    direction:
      'Clean white or soft grey seamless background with a single strong directional side light sculpting the garment\'s form. ' +
      'Product-focused clarity inspired by COS and MUJI — the garment speaks without distraction, construction and fabric texture rendered in precise detail. ' +
      'Negative space is generous; pose is calm and architectural, allowing the clothing to be the protagonist.',
    thumbnail: '',
  },

  {
    id: 'campaign-seasonal',
    name: 'Seasonal',
    category: 'campaign',
    direction:
      'Immersive seasonal atmosphere — cherry blossoms drifting in spring, golden ocean light in summer, warm amber foliage in autumn, crisp snow-light in winter. ' +
      'Natural outdoor environment captured at golden hour or soft overcast diffused light, creating a mood that feels aspirational yet approachable. ' +
      'The season and garment tell a story together; location and styling are harmonized into a coherent lifestyle image.',
    thumbnail: '',
  },

  {
    id: 'campaign-luxury',
    name: 'Luxury',
    category: 'campaign',
    direction:
      'Dark, moody, sophisticated — chiaroscuro lighting borrowed from Flemish painting, deep shadow regions preserving rich texture detail. ' +
      'Bottega Veneta and Saint Laurent campaign energy: confident restraint, understated power, nothing trying too hard. ' +
      'Deep tones, shadow-forward palette; the image feels expensive before the viewer registers why.',
    thumbnail: '',
  },

  {
    id: 'campaign-sport',
    name: 'Sport',
    category: 'campaign',
    direction:
      'Dynamic, energetic composition with a subject mid-motion or in a powerful athletic stance that radiates capability. ' +
      'Vibrant, saturated colors with crisp contrast — the visual language of Nike and adidas flagship campaigns. ' +
      'Lighting is clean and decisive; the image communicates performance, confidence, and the body in its element.',
    thumbnail: '',
  },

  // ── Street (4) ─────────────────────────────────────────────────────────────

  {
    id: 'street-tokyo',
    name: 'Tokyo',
    category: 'street',
    direction:
      'The real Tokyo street experience — Harajuku backstreets, Shimokitazawa record shops, the layered visual noise of neon signs and narrow alleys. ' +
      'Mixed artificial and ambient lighting creating the characteristic Tokyo glow at dusk or night; concrete, vending machines, weathered walls. ' +
      'The subject moves through the city naturally, style effortless, the atmosphere unmistakably Japanese urban.',
    thumbnail: '',
  },

  {
    id: 'street-ny',
    name: 'New York',
    category: 'street',
    direction:
      'Brooklyn brownstones, SoHo cobblestone, fire escapes casting grid shadows — the definitive New York backdrop. ' +
      'Harsh midday sun or cinematic golden hour light that makes brick walls glow amber; the city\'s energy transferred into the image. ' +
      'Subject carries NYC confidence — unhurried yet purposeful, the stance of someone who owns the sidewalk.',
    thumbnail: '',
  },

  {
    id: 'street-paris',
    name: 'Paris',
    category: 'street',
    direction:
      'Café terraces, cobblestone boulevards, Haussmann limestone facades — the iconographic grammar of Parisian life. ' +
      'Soft overcast light characteristic of Paris: diffused, flattering, slightly melancholic in the best possible way. ' +
      'French effortlessness encoded in posture and expression; style that appears unconsidered and is deeply considered.',
    thumbnail: '',
  },

  {
    id: 'street-london',
    name: 'London',
    category: 'street',
    direction:
      'Brick Lane murals, Shoreditch warehouse walls, a red telephone box in peripheral vision — distinctly East London. ' +
      'Grey British sky providing a flat, democratic light that reads as both overcast melancholy and photographic versatility. ' +
      'The quintessential London contradiction: punk heritage and Savile Row tailoring existing in the same outfit, same body, same frame.',
    thumbnail: '',
  },

  // ── Surreal (5) ────────────────────────────────────────────────────────────

  {
    id: 'surreal-timwalker',
    name: 'Tim Walker',
    category: 'surreal',
    direction:
      'Dreamlike, fairy-tale world where scale is deliberately wrong — oversized flowers, giant teacups, impossible architecture rendered with loving craft. ' +
      'Soft, ethereal lighting that feels as if the scene is illuminated by something other than the sun; pastel palette of sugared almond and parchment. ' +
      'Everything feels handmade and theatrical; the image could be from a childhood dream or a Victorian storybook illustration given fashion.',
    thumbnail: '',
  },

  {
    id: 'surreal-pierretgilles',
    name: 'Pierre et Gilles',
    category: 'surreal',
    direction:
      'Hyper-real kitsch at maximum saturation — religious iconography, painted backdrops, glitter and sequins, the camp sacred and profane coexisting. ' +
      'Oversaturated color that pushes past photography into the territory of hand-painted devotional art; every surface decorated, adorned, excessive. ' +
      'The subject becomes icon: saint, idol, celebrity, deity — framed by painted roses, gold halos, or sparkling starfields.',
    thumbnail: '',
  },

  {
    id: 'surreal-guybourdin',
    name: 'Guy Bourdin',
    category: 'surreal',
    direction:
      'Vivid, violent color combinations that feel simultaneously glamorous and unsettling — red lacquer, candy pink, acid yellow. ' +
      'Surreal narrative tension: fragmented bodies, unexpected cropping, glossy surfaces reflecting distorted forms, scenarios with implied dark humor. ' +
      'The image provokes discomfort and desire simultaneously; fashion becomes the language of a waking fever dream.',
    thumbnail: '',
  },

  {
    id: 'surreal-erikheck',
    name: 'Erik Madigan Heck',
    category: 'surreal',
    direction:
      'Painterly color explosion where photographic reality dissolves into something approaching abstract textile art. ' +
      'Printed or woven backgrounds merge indistinguishably with the garment\'s own pattern and texture, collapsing figure and ground. ' +
      'The overall effect is a living painting — Matisse meets fashion editorial, color relationships governing the image more than light or form.',
    thumbnail: '',
  },

  {
    id: 'surreal-custom',
    name: 'Custom',
    category: 'surreal',
    direction: '',
    thumbnail: '',
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Helper functions
// ────────────────────────────────────────────────────────────────────────────

/** Returns all presets belonging to the given category, in insertion order. */
export function getPresetsByCategory(category: SceneCategory): ScenePreset[] {
  return SCENE_PRESETS.filter((p) => p.category === category);
}

/** Ordered list of scene categories. */
export const SCENE_CATEGORIES: SceneCategory[] = [
  'editorial',
  'campaign',
  'street',
  'surreal',
];

/** Display labels for each category. */
export const CATEGORY_LABELS: Record<SceneCategory, string> = {
  editorial: 'Editorial',
  campaign:  'Campaign',
  street:    'Street',
  surreal:   'Surreal',
};

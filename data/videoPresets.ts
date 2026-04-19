/**
 * videoPresets.ts — Cinematic I2V presets for LUMINA Hero videos.
 *
 * Each preset pairs a source portrait with a movie-grade prompt.
 * Character specs sourced from data/agencyModels.ts — do not paraphrase.
 *
 * Prompt philosophy: reference concrete films + cinematography terms
 * so Seedance emulates the director's visual grammar, not a generic
 * "cinematic" blur.
 */

export type VideoPresetId = 'lucas-mori-rumble-fish' | 'elena-single-man' | 'rinka-lost-in-translation';

export interface VideoPreset {
  id: VideoPresetId;
  modelId: string;              // agency model slug
  modelDisplayName: string;
  sourceImagePath: string;      // served at root from public/
  filmReferences: string[];
  prompt: string;
  duration: number;             // seconds (Seedance: 4-15)
  aspectRatio: '16:9' | '9:16' | '1:1';
  notes?: string;
}

export const VIDEO_PRESETS: VideoPreset[] = [
  {
    id: 'lucas-mori-rumble-fish',
    modelId: 'men-street-02',
    modelDisplayName: 'LUCAS MORI',
    sourceImagePath: '/agency-models/men-street-02/beauty.png',
    filmReferences: ['Rumble Fish (1983, Coppola)', 'The Outsiders (1983)'],
    duration: 8,
    aspectRatio: '16:9',
    prompt: `Black-and-white high-contrast cinematography emulating Stephen H. Burum's work on Rumble Fish. Subject: LUCAS MORI — mixed Brazilian-Japanese nikkei male, 23, 185cm, editorial fashion model proportion (8.5-9 heads tall, small head, long limbs, luxury swan-like long neck). Dark brown wet slicked-back center-part hair with subtle natural wave. Hazel-brown eyes with soft epicanthic fold. Wearing BEDWIN x FIVE BROTHER flannel unbuttoned over white tank top. Eagle tattoo on the RIGHT LATERAL side of the neck only (flat graphic ink, front of throat stays clean, tattoo does NOT wrap to the front or left). LOVE/PAIN finger tattoos visible. Single nose ring. He slowly raises a cigarette to his lips. Leaning against a corrugated garage door in a Los Angeles back alley, late afternoon. Smoke curls slowly upward — only the smoke is in color (signature Coppola motif). He locks eyes with camera at the 2-second mark, holds the stare for the remaining 6 seconds. No cuts. Locked static medium close-up with subtle breathing motion. Shot on Arri Alexa with 50mm anamorphic lens (never wide-angle), 2.39:1 letterbox. Matt Dillon vulnerability with Rusty James swagger.`,
    notes: 'Watanabe-signed BEDWIN 26SS muse. Neck tattoo MUST NOT wrap front/left (visual bulk NG). 50mm+ focal length only.',
  },
  {
    id: 'elena-single-man',
    modelId: 'ladies-intl-01',
    modelDisplayName: 'ELENA',
    sourceImagePath: '/agency-models/ladies-intl-01/beauty.png',
    filmReferences: ['A Single Man (2009, Tom Ford)', 'Blow-Up (1966, Antonioni)'],
    duration: 8,
    aspectRatio: '16:9',
    prompt: `Cinematic fashion editorial. Subject: ELENA — Scandinavian female model, early 30s, 179cm, ash blonde straight long hair, blue-grey eyes. Vibe: Jil Sander / The Row quiet-luxury editorial restraint. She wears a minimal black silk slip dress, standing in a sun-drenched Nordic loft with a vintage brass floor lamp. Color grade from A Single Man — Tom Ford's amber-dominant warm fill with cool shadow separation. Her ash blonde hair moves in 2 seconds of slow wind. At the 4-second mark she turns her head 15 degrees to profile, revealing the collarbone line. Film grain, 35mm. High-saturation lip pop (Tom Ford signature). Shot like David Hemmings photographing Verushka in Blow-Up — slow 15-degree pan from frontal to 3/4 angle, dolly-in 10%. Museum-grade editorial stillness. Celine AW21 campaign energy. Shot on Arri Alexa with 85mm lens.`,
    notes: 'Ash blonde Scandinavian — NOT Mediterranean/brunette. Jil Sander/The Row quiet-luxury restraint.',
  },
  {
    id: 'rinka-lost-in-translation',
    modelId: 'influencer-girl-01',
    modelDisplayName: 'RINKA',
    sourceImagePath: '/agency-models/influencer-girl-01/beauty.png',
    filmReferences: ['Lost in Translation (2003, Sofia Coppola)', 'Kamikaze Girls (2004, Nakashima)'],
    duration: 8,
    aspectRatio: '9:16',
    prompt: `Handheld cinematic documentary feel. Subject: RINKA — 20-year-old Japanese female, 165cm, pink-ash shoulder-length hair, dark brown eyes. Vibe: Tokyo Harajuku creative street style (oversized tee, cargo pants, chunky sneakers). Standing on a neon-lit Shibuya backstreet at blue-hour dusk. Sofia Coppola's Park Hyatt color grade — teal shadows with magenta neon highlights. She looks over her left shoulder at camera with a subtle, uncertain smile at the 3-second mark. Wind from passing cars lifts her pink-ash hair. Bokeh of kanji neon signs behind her. Lana Del Rey romantic isolation energy. A24 film color science, shot on ARRI Alexa Mini LF with 40mm lens. Handheld medium shot with slight natural camera shake, 20% dolly-in over 8 seconds. Lost in Translation melancholy meets Kamikaze Girls coolness.`,
    notes: 'Pink-ash hair (not generic black/brown). Harajuku creative — NOT generic J-fashion. 9:16 for SNS cross-use.',
  },
];

export function getPreset(id: VideoPresetId): VideoPreset | undefined {
  return VIDEO_PRESETS.find(p => p.id === id);
}

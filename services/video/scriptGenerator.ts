/**
 * scriptGenerator.ts — AI script generation for Video Studio
 *
 * Flow:
 * 1. User inputs: model + format + intent (e.g. "RINKAのGRWM、sacai×Dickiesコーデ")
 * 2. AI researches current viral trends (via Gemini grounding/search)
 * 3. AI generates full cut-by-cut script with prompts, narration, text overlays
 * 4. Output fills timeline automatically
 *
 * Uses Gemini 2.5 Flash for text generation (fast + cheap).
 */

import { createClient, GEN_CONFIG } from '../geminiClient';
import { researchViralTrends, type ViralResearchResult } from './viralResearch';
import type { AgencyModel } from '../../data/agencyModels';
import type { VideoFormat } from '../../types/video';
import type { TimelineCut } from '../../types/video';
import { MOTION_DICTIONARY } from '../../data/video/motionDictionary';

export interface ScriptRequest {
  model: AgencyModel;
  format: VideoFormat;
  intent: string;        // User's creative brief
  apiKey: string;
}

export interface ScriptProgress {
  stage: 'researching' | 'writing';
  message: string;
}

export interface GeneratedScript {
  title: string;
  totalDuration: number;
  cuts: GeneratedCut[];
  bgmSuggestion: string;
  hashtagSuggestion: string;
}

export interface GeneratedCut {
  label: string;
  role: string;
  duration: 5 | 10;
  scenePrompt: string;
  motionPrompt: string;
  motionId: string;
  textOverlay: string;
  narrationText: string;
  narrationTone: string;
}

const VIRAL_KNOWLEDGE = `## Viral Short-Form Fashion Video Structure (2026)

Key patterns from 15-video analysis:
- Hook (0-3s): Before state (messy hair/pajamas) or ASMR sound or text hook
- Average cut length: 2-3s per cut
- Total cuts: 10-14 for 30s video
- Tempo: slow start (3-4s/cut) → accelerate (1.5-2s) → beat drop → completion (3-5s)
- Camera: 45% mirror full-body, 20% tripod front, 20% close-up, 10% handheld, 5% overhead
- Text: sans-serif bold, white + 2px black stroke, safe zone top 200-600px, max 4 placements
- Transition: jump cut only (70%+), synced to beat. No dissolves.
- Completion rate: 15s=68%, 30s=60%, 60s=48%

GRWM structure: Hook→Prep→Item1→Item2→Item3→Outer→Accessory→Complete→Street→Closing
Outfit Transition: Before→BeatDrop→After (same camera position, clothes change)
Lookbook: Flatlay→Wear→Full→Detail→Street (×3 looks)
Product Showcase: Product solo→Tag→Wear→Front→Back→Movement
Editorial: Atmosphere→Model enter→Detail→Portrait→Movement→Detail2→Hero→Outro`;

/**
 * Generate a full video script using AI.
 * Step 1: Research current viral trends (web search)
 * Step 2: Generate script using trends + model profile + format
 */
export async function generateScript(
  request: ScriptRequest,
  onProgress?: (progress: ScriptProgress) => void,
): Promise<GeneratedScript> {
  // ── Step 1: Viral research ──
  onProgress?.({ stage: 'researching', message: 'Searching for viral trends…' });

  let research: ViralResearchResult | null = null;
  try {
    research = await researchViralTrends(request.apiKey, {
      format: request.format.label,
      style: request.model.vibe,
      region: request.model.category.includes('asia') ? 'Japan' : 'global',
    });
  } catch {
    // If research fails, continue with static knowledge only
  }

  // ── Step 2: Script generation ──
  onProgress?.({ stage: 'writing', message: 'Writing script…' });

  const client = createClient(request.apiKey);
  const modelProfile = buildModelProfile(request.model);
  const motionList = MOTION_DICTIONARY.map(m => `${m.id}: ${m.prompt}`).join('\n');

  const researchSection = research ? `
## CURRENT VIRAL TRENDS (searched just now)

${research.rawSummary}

### Trending Now
${research.trends.map(t => `- ${t.title} (${t.platform}, ${t.estimatedViews}, ${t.duration}) — Hook: ${t.hookStyle} — Technique: ${t.keyTechnique}`).join('\n')}

### Trending Audio
${research.trendingAudio.join('\n')}

### Trending Hashtags
${research.trendingHashtags.join(' ')}

### Current Structural Patterns
${research.structuralPatterns}
` : '';

  const prompt = `You are a viral short-form video director. Your job is to CREATE CONTENT THAT GOES VIRAL by copying the structure and techniques of what's working RIGHT NOW.

## TASK
Create a complete cut-by-cut video script.

**Model**: ${modelProfile}
**Format**: ${request.format.label} (${request.format.description})
**Duration range**: ${request.format.durationRange.min}-${request.format.durationRange.max}s
**Cut range**: ${request.format.cutRange.min}-${request.format.cutRange.max} cuts
**Creative brief**: ${request.intent}

${researchSection}

${VIRAL_KNOWLEDGE}

## CRITICAL: Use the current trends above to inform your script. Copy what's working — the hooks, the pacing, the audio sync points, the text placement. Adapt it to this specific model and brief.

## AVAILABLE MOTIONS
${motionList}

## OUTPUT FORMAT
Respond with ONLY valid JSON (no markdown, no explanation):
{
  "title": "Video title for caption (Japanese, catchy, under 20 chars)",
  "totalDuration": <number>,
  "bgmSuggestion": "Genre + BPM + vibe suggestion",
  "hashtagSuggestion": "15 hashtags separated by spaces",
  "cuts": [
    {
      "label": "Cut label (Japanese OK, short)",
      "role": "hook|prep|item|wear|accessory|complete|street|closing|flatlay|detail|product|transition|atmosphere|portrait",
      "duration": 5,
      "scenePrompt": "Detailed scene description for still image generation. Include: location, lighting, camera angle, mood, what the model is doing/wearing. Be SPECIFIC to this model's character and setting. Photorealistic fashion photography.",
      "motionPrompt": "Specific motion for I2V conversion. Describe exact movement, expression changes, body language.",
      "motionId": "closest match from available motions list",
      "textOverlay": "On-screen text (empty string if none for this cut)",
      "narrationText": "What the model says in this cut (in character voice, Japanese). Empty if no narration.",
      "narrationTone": "Voice direction: e.g. sleepy, excited, cool, proud"
    }
  ]
}

## CRITICAL RULES
- Scene prompts must be EXTREMELY specific to this model (use their actual hair color, style, vibe)
- Narration must match the model's character voice (age, personality, speech patterns)
- Follow the viral structure patterns exactly — hook must grab in 0-3s
- Text overlays: max 4 across all cuts (hook + 2 items + closing)
- Each cut's scenePrompt should describe a UNIQUE, specific scene (not generic "fashion photo")
- motionId must be one from the available motions list
- Think about what makes THIS specific model's content go viral`;

  const response = await client.models.generateContent({
    model: GEN_CONFIG.models.flash,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from script generation');

  const script: GeneratedScript = JSON.parse(text);

  // Validate motionIds
  for (const cut of script.cuts) {
    if (!MOTION_DICTIONARY.find(m => m.id === cut.motionId)) {
      cut.motionId = 'show-pose'; // fallback
    }
    if (cut.duration !== 5 && cut.duration !== 10) {
      cut.duration = 5;
    }
  }

  return script;
}

/**
 * Convert generated script to timeline cuts.
 */
export function scriptToTimelineCuts(script: GeneratedScript): TimelineCut[] {
  return script.cuts.map((cut, i) => ({
    id: `cut-${i}-${Date.now()}`,
    index: i,
    role: cut.role as TimelineCut['role'],
    label: cut.label,
    duration: cut.duration,
    motionId: cut.motionId,
    motionPromptOverride: cut.motionPrompt,
    stillPrompt: cut.scenePrompt,
    textOverlay: cut.textOverlay || undefined,
    narrationText: cut.narrationText || undefined,
    status: 'pending' as const,
  }));
}

function buildModelProfile(model: AgencyModel): string {
  return `${model.name} (${model.id})
- Height: ${model.height}cm, B${model.measurements.bust}/W${model.measurements.waist}/H${model.measurements.hips}
- Hair: ${model.hair}
- Eyes: ${model.eyes}
- Vibe: ${model.vibe}
- Category: ${model.category}`;
}

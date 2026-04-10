/**
 * types/video.ts — LUMINA VIDEO STUDIO v2 type definitions
 *
 * Multi-clip timeline architecture based on viral structure analysis.
 */

// ─── Format & Cut ────────────────────────────────────────────────────────────

export type FormatId = 'grwm' | 'outfit-transition' | 'lookbook' | 'product-showcase' | 'editorial';

export interface VideoFormat {
  id: FormatId;
  label: string;
  description: string;
  durationRange: { min: number; max: number }; // seconds
  cutRange: { min: number; max: number };
  defaultCuts: CutTemplate[];
}

export type CutRole =
  | 'hook' | 'prep' | 'item' | 'wear' | 'accessory'
  | 'complete' | 'street' | 'closing'
  | 'flatlay' | 'detail' | 'product' | 'transition'
  | 'atmosphere' | 'portrait';

export interface CutTemplate {
  role: CutRole;
  label: string;
  duration: number;          // seconds (5 or 10)
  camera: string;            // e.g. "selfie", "mirror-full", "closeup"
  defaultMotionId: string;   // from motion dictionary
  stillPromptHint: string;   // scene hint for Gemini
  textOverlay?: string;      // optional default text
}

// ─── Motion Dictionary ───────────────────────────────────────────────────────

export interface MotionEntry {
  id: string;
  label: string;
  category: 'hook' | 'prep' | 'wear' | 'show' | 'street' | 'product';
  prompt: string;            // I2V prompt for Kling
}

// ─── Timeline (multi-clip) ───────────────────────────────────────────────────

export type CutStatus = 'pending' | 'generating-still' | 'generating-video' | 'done' | 'error';

export interface TimelineCut {
  id: string;               // unique per cut
  index: number;
  role: CutRole;
  label: string;
  duration: 5 | 10;
  motionId: string;
  motionPromptOverride?: string;
  stillPrompt: string;
  textOverlay?: string;
  narrationText?: string;
  colorPresetId?: string;    // per-cut or inherited from timeline
  // Results
  status: CutStatus;
  stillImage?: string;       // base64
  videoUrl?: string;         // mp4 URL
  audioUrl?: string;         // mp3 blob URL
  error?: string;
}

export interface VideoTimeline {
  formatId: FormatId;
  modelId: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  cuts: TimelineCut[];
  garmentImage?: string;     // base64 data URL
  colorPresetId?: string;    // global color grade for all cuts
}

// ─── Pipeline ────────────────────────────────────────────────────────────────

export type PipelineStep = 'still' | 'i2v' | 'narration';
export type StepStatus = 'idle' | 'running' | 'done' | 'error';

export interface StepState {
  status: StepStatus;
  result?: string;
  error?: string;
  progress?: string;
}

/** Per-cut generation request */
export interface CutGenerationRequest {
  modelId: string;
  stillPrompt: string;
  motionPrompt: string;
  negativePrompt?: string;
  duration: 5 | 10;
  aspectRatio: '9:16' | '16:9' | '1:1';
  garmentImage?: string;
  textOverlay?: string;
  colorPresetId?: string;
  narration?: {
    text: string;
    voiceId: string;
    stability?: number;
  };
}

// ─── Voice ───────────────────────────────────────────────────────────────────

export interface VoiceMapping {
  voiceId: string;
  name: string;
  lang: string;
}

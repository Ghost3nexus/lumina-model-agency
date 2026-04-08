/**
 * types/video.ts — LUMINA VIDEO STUDIO type definitions
 */

export type PipelineStep = 'still' | 'i2v' | 'narration';
export type StepStatus = 'idle' | 'running' | 'done' | 'error';

export interface StepState {
  status: StepStatus;
  result?: string;   // base64 (still) or URL (video/audio)
  error?: string;
  progress?: string; // e.g. "polling…"
}

export interface VideoPipelineState {
  currentStep: PipelineStep | null;
  steps: Record<PipelineStep, StepState>;
}

export interface VideoGenerationRequest {
  modelId: string;
  scene: {
    presetId: string;
    customPrompt?: string;
  };
  motion: {
    presetId: string;
    customPrompt?: string;
    negativePrompt?: string;
  };
  narration?: {
    text: string;
    voiceId: string;
    stability?: number;
  };
  garmentImage?: string; // base64 data URL (optional)
  duration?: 5 | 10;    // seconds — Kling supports 5 or 10
  aspectRatio?: '16:9' | '9:16' | '1:1';
}

export interface VideoGenerationResult {
  stillImage: string;      // base64 data URL
  videoUrl?: string;       // mp4 URL from Replicate
  audioUrl?: string;       // mp3 blob URL
  metadata: {
    modelId: string;
    duration: number;
    aspectRatio: string;
    generatedAt: string;   // ISO date
  };
}

export interface MotionPreset {
  id: string;
  label: string;
  prompt: string;
  icon?: string;
}

export interface ScenePreset {
  id: string;
  label: string;
  description: string;
  stillPromptHint?: string; // hint appended to still generation prompt
}

export interface VoiceMapping {
  voiceId: string;
  name: string;
  lang: string;
}

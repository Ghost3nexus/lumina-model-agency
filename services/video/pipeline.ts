/**
 * pipeline.ts — Video generation pipeline orchestration
 *
 * Coordinates the 3-step pipeline: Still → I2V → Narration.
 * Each step can be run independently or as a full pipeline.
 */

import { generateStill } from './stillGenerator';
import { generateVideo, cancelPrediction } from './klingService';
import { generateSpeech } from './elevenlabsService';
import { AGENCY_MODELS } from '../../data/agencyModels';
import { MOTION_PRESETS, DEFAULT_NEGATIVE_PROMPT } from '../../data/video/motionPresets';
import { SCENE_PRESETS } from '../../data/video/scenePresets';
import { VOICE_MAP } from '../../data/video/voiceMap';
import type {
  VideoGenerationRequest,
  VideoGenerationResult,
  PipelineStep,
} from '../../types/video';

export type PipelineCallback = (step: PipelineStep, status: string) => void;

/**
 * Run the full pipeline (or partial, based on request).
 */
export async function runPipeline(
  request: VideoGenerationRequest,
  apiKey: string,
  onProgress?: PipelineCallback,
): Promise<VideoGenerationResult> {
  const model = AGENCY_MODELS.find(m => m.id === request.modelId);
  if (!model) throw new Error(`Model not found: ${request.modelId}`);

  // Resolve presets
  const scenePreset = SCENE_PRESETS.find(s => s.id === request.scene.presetId);
  const motionPreset = MOTION_PRESETS.find(m => m.id === request.motion.presetId);

  const scenePrompt = request.scene.customPrompt
    || [scenePreset?.stillPromptHint, request.scene.customPrompt].filter(Boolean).join('. ')
    || 'fashion photography, natural setting';

  // ── Step 1: Still Image ──
  onProgress?.('still', 'generating');

  const stillImage = await generateStill({
    model,
    scenePrompt,
    garmentImage: request.garmentImage,
    aspectRatio: request.aspectRatio,
    apiKey,
  });

  onProgress?.('still', 'done');

  const result: VideoGenerationResult = {
    stillImage,
    metadata: {
      modelId: request.modelId,
      duration: request.duration ?? 5,
      aspectRatio: request.aspectRatio ?? '9:16',
      generatedAt: new Date().toISOString(),
    },
  };

  // ── Step 2: I2V (optional — skip if no motion preset) ──
  if (request.motion.presetId !== 'none') {
    onProgress?.('i2v', 'submitting');

    const motionPrompt = request.motion.customPrompt
      || motionPreset?.prompt
      || 'subtle natural movement';

    const i2vResult = await generateVideo(
      {
        startImage: stillImage,
        prompt: motionPrompt,
        negativePrompt: request.motion.negativePrompt ?? DEFAULT_NEGATIVE_PROMPT,
        duration: request.duration ?? 5,
        aspectRatio: request.aspectRatio ?? '9:16',
      },
      (status) => onProgress?.('i2v', status),
    );

    result.videoUrl = i2vResult.videoUrl;
    onProgress?.('i2v', 'done');
  }

  // ── Step 3: Narration (optional) ──
  if (request.narration?.text && request.narration?.voiceId) {
    onProgress?.('narration', 'generating');

    const voice = VOICE_MAP[request.modelId];
    const ttsResult = await generateSpeech({
      text: request.narration.text,
      voiceId: request.narration.voiceId || voice?.voiceId || '',
      stability: request.narration.stability,
    });

    result.audioUrl = ttsResult.audioUrl;
    onProgress?.('narration', 'done');
  }

  return result;
}

export { cancelPrediction };

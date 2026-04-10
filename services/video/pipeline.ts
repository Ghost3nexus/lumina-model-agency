/**
 * pipeline.ts — Video generation pipeline orchestration (v2)
 *
 * Supports multi-clip timeline: generates each cut's still → I2V → narration.
 * Cuts are processed sequentially to avoid API rate limits.
 */

import { generateStill } from './stillGenerator';
import { generateVideo, cancelPrediction } from './klingService';
import { generateSpeech } from './elevenlabsService';
import { AGENCY_MODELS } from '../../data/agencyModels';
import { getMotion, DEFAULT_NEGATIVE_PROMPT } from '../../data/video/motionDictionary';
import { VOICE_MAP } from '../../data/video/voiceMap';
import type { TimelineCut, CutGenerationRequest, CutStatus } from '../../types/video';

export type CutCallback = (cutId: string, status: CutStatus, data?: { stillImage?: string; videoUrl?: string; audioUrl?: string; error?: string }) => void;

/**
 * Generate a single cut (still → I2V → optional narration).
 */
export async function generateCut(
  request: CutGenerationRequest,
  apiKey: string,
  onProgress?: (status: CutStatus) => void,
): Promise<{ stillImage: string; videoUrl?: string; audioUrl?: string }> {
  const model = AGENCY_MODELS.find(m => m.id === request.modelId);
  if (!model) throw new Error(`Model not found: ${request.modelId}`);

  // Step 1: Still
  onProgress?.('generating-still');
  const stillImage = await generateStill({
    model,
    scenePrompt: request.stillPrompt,
    garmentImage: request.garmentImage,
    aspectRatio: request.aspectRatio,
    apiKey,
  });

  // Step 2: I2V
  onProgress?.('generating-video');
  const i2vResult = await generateVideo(
    {
      startImage: stillImage,
      prompt: request.motionPrompt,
      negativePrompt: request.negativePrompt ?? DEFAULT_NEGATIVE_PROMPT,
      duration: request.duration,
      aspectRatio: request.aspectRatio,
    },
    () => onProgress?.('generating-video'),
  );

  // Step 3: Narration (optional)
  let audioUrl: string | undefined;
  if (request.narration?.text && request.narration?.voiceId) {
    const ttsResult = await generateSpeech({
      text: request.narration.text,
      voiceId: request.narration.voiceId,
      stability: request.narration.stability,
    });
    audioUrl = ttsResult.audioUrl;
  }

  return { stillImage, videoUrl: i2vResult.videoUrl, audioUrl };
}

/**
 * Generate all cuts in a timeline sequentially.
 */
export async function generateTimeline(
  cuts: TimelineCut[],
  modelId: string,
  aspectRatio: '9:16' | '16:9' | '1:1',
  apiKey: string,
  onCutUpdate: CutCallback,
  garmentImage?: string,
): Promise<void> {
  for (const cut of cuts) {
    const motion = getMotion(cut.motionId);
    const motionPrompt = cut.motionPromptOverride || motion?.prompt || 'subtle natural movement';

    const request: CutGenerationRequest = {
      modelId,
      stillPrompt: cut.stillPrompt,
      motionPrompt,
      duration: cut.duration,
      aspectRatio,
      garmentImage,
    };

    // Add narration if cut has text and model has voice
    if (cut.narrationText) {
      const voice = VOICE_MAP[modelId];
      if (voice) {
        request.narration = {
          text: cut.narrationText,
          voiceId: voice.voiceId,
        };
      }
    }

    try {
      const result = await generateCut(request, apiKey, (status) => {
        onCutUpdate(cut.id, status);
      });

      onCutUpdate(cut.id, 'done', {
        stillImage: result.stillImage,
        videoUrl: result.videoUrl,
        audioUrl: result.audioUrl,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      onCutUpdate(cut.id, 'error', { error: message });
      // Continue with next cut instead of aborting entire timeline
    }
  }
}

export { cancelPrediction };

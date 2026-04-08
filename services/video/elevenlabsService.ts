/**
 * elevenlabsService.ts — ElevenLabs TTS wrapper
 *
 * Generates narration audio from text using ElevenLabs multilingual v2.
 * Returns audio as a blob URL for playback/download.
 */

const ELEVENLABS_API = 'https://api.elevenlabs.io/v1';
const MODEL_ID = 'eleven_multilingual_v2';

function getApiKey(): string {
  const key = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!key) throw new Error('VITE_ELEVENLABS_API_KEY not configured');
  return key;
}

export interface TtsInput {
  text: string;
  voiceId: string;
  stability?: number;       // 0.0-1.0, default 0.5
  similarityBoost?: number; // 0.0-1.0, default 0.75
}

export interface TtsResult {
  audioUrl: string; // blob URL — must be revoked when no longer needed
  blob: Blob;
}

/**
 * Generate speech audio from text.
 */
export async function generateSpeech(input: TtsInput): Promise<TtsResult> {
  const resp = await fetch(`${ELEVENLABS_API}/text-to-speech/${input.voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': getApiKey(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: input.text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: input.stability ?? 0.5,
        similarity_boost: input.similarityBoost ?? 0.75,
      },
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`ElevenLabs TTS failed (${resp.status}): ${errText}`);
  }

  const blob = await resp.blob();
  const audioUrl = URL.createObjectURL(blob);

  return { audioUrl, blob };
}

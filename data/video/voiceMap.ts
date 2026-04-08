import type { VoiceMapping } from '../../types/video';

/**
 * Model ID → ElevenLabs voice mapping.
 * Only models with assigned voices appear here.
 * UI shows "Voice not configured" for models not in this map.
 */
export const VOICE_MAP: Record<string, VoiceMapping> = {
  'influencer-01': { voiceId: 'DIcmWR2oXfmLIlrj43rH', name: 'Rin', lang: 'ja' },
  // Other models will be added as voices are configured
};

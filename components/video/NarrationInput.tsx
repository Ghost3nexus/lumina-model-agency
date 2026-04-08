/**
 * NarrationInput.tsx — Narration text + voice selection
 */

import { VOICE_MAP } from '../../data/video/voiceMap';

interface Props {
  modelId: string | null;
  enabled: boolean;
  text: string;
  onToggle: (enabled: boolean) => void;
  onTextChange: (text: string) => void;
}

export function NarrationInput({ modelId, enabled, text, onToggle, onTextChange }: Props) {
  const voice = modelId ? VOICE_MAP[modelId] : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-400 tracking-wider">
          NARRATION
        </label>
        <button
          type="button"
          onClick={() => onToggle(!enabled)}
          className={`w-8 h-4 rounded-full transition-colors duration-200 relative ${
            enabled ? 'bg-cyan-500' : 'bg-gray-700'
          }`}
        >
          <span
            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${
              enabled ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500">Voice:</span>
            {voice ? (
              <span className="text-xs text-cyan-400 font-medium">{voice.name} ({voice.lang})</span>
            ) : (
              <span className="text-xs text-gray-600">Not configured for this model</span>
            )}
          </div>
          <textarea
            value={text}
            onChange={e => onTextChange(e.target.value)}
            placeholder="Enter narration text…"
            rows={3}
            disabled={!voice}
            className="w-full rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none resize-none disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>
      )}
    </div>
  );
}

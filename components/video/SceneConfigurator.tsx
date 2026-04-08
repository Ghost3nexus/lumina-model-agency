/**
 * SceneConfigurator.tsx — Scene preset selection + custom prompt
 */

import { SCENE_PRESETS } from '../../data/video/scenePresets';

interface Props {
  selectedId: string;
  customPrompt: string;
  onSelectPreset: (id: string) => void;
  onCustomPromptChange: (text: string) => void;
}

export function SceneConfigurator({ selectedId, customPrompt, onSelectPreset, onCustomPromptChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 tracking-wider mb-2">
        SCENE
      </label>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {SCENE_PRESETS.map(preset => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              selectedId === preset.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-gray-300'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      {(selectedId === 'custom' || customPrompt) && (
        <textarea
          value={customPrompt}
          onChange={e => onCustomPromptChange(e.target.value)}
          placeholder="Describe the scene…"
          rows={2}
          className="w-full rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none resize-none"
        />
      )}
    </div>
  );
}

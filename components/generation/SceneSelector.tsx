import { useState } from 'react';
import type { SceneCategory, AspectRatio, ScenePreset, SNSCreativeConfig } from '../../types/sns';
import {
  SCENE_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_GRADIENTS,
  getPresetsByCategory,
} from '../../data/scenePresets';

interface SceneSelectorProps {
  config: SNSCreativeConfig | null;
  onChange: (config: SNSCreativeConfig) => void;
}

const ASPECT_RATIOS: { id: AspectRatio; label: string; sub: string }[] = [
  { id: '4:5',  label: '4:5',  sub: 'IG Feed' },
  { id: '1:1',  label: '1:1',  sub: 'X / 汎用' },
  { id: '9:16', label: '9:16', sub: 'Story' },
  { id: '16:9', label: '16:9', sub: 'Banner' },
];

export function SceneSelector({ config, onChange }: SceneSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<SceneCategory>('editorial');
  const [customPrompt, setCustomPrompt] = useState<string>(config?.customPrompt ?? '');

  const currentAspectRatio: AspectRatio = config?.aspectRatio ?? '4:5';
  const selectedPresetId = config?.scene.id ?? null;

  const presets = getPresetsByCategory(activeCategory);

  // Whether to show the custom prompt textarea
  const showCustomPrompt =
    selectedPresetId === 'surreal-custom' ||
    (selectedPresetId !== null);

  function handleSelectPreset(preset: ScenePreset) {
    onChange({
      scene: preset,
      customPrompt: customPrompt || undefined,
      aspectRatio: currentAspectRatio,
    });
  }

  function handleCustomPromptChange(value: string) {
    const trimmed = value.slice(0, 500);
    setCustomPrompt(trimmed);
    if (config) {
      onChange({
        ...config,
        customPrompt: trimmed || undefined,
      });
    }
  }

  function handleAspectRatioChange(ratio: AspectRatio) {
    if (config) {
      onChange({ ...config, aspectRatio: ratio });
    } else {
      // No preset selected yet — store the ratio preference in state via a no-op;
      // it will be applied when a preset is picked. Nothing to persist without a scene.
    }
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Category tabs */}
      <div className="flex gap-1 p-1 bg-gray-900/50 rounded-lg">
        {SCENE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={[
              'flex-1 py-1.5 rounded-md text-xs font-medium transition-colors duration-200',
              cat === activeCategory
                ? 'bg-gray-800 text-gray-200'
                : 'text-gray-400 hover:text-gray-300',
            ].join(' ')}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Preset grid — 3 columns */}
      <div className="grid grid-cols-3 gap-2">
        {presets.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={[
                'flex flex-col overflow-hidden rounded-lg border transition-colors duration-200 text-left',
                isSelected
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-600',
              ].join(' ')}
            >
              {/* Thumbnail — CSS gradient placeholder */}
              <div
                className="w-full aspect-square"
                style={{ background: CATEGORY_GRADIENTS[preset.category] }}
                aria-hidden="true"
              />
              {/* Name */}
              <span
                className={[
                  'px-2 py-1.5 text-xs font-medium truncate',
                  isSelected ? 'text-cyan-400' : 'text-gray-400',
                ].join(' ')}
              >
                {preset.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom prompt — shown once any preset is selected */}
      {showCustomPrompt && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-400">
              {selectedPresetId === 'surreal-custom'
                ? 'カスタムディレクション'
                : '追加ディレクション（任意）'}
            </label>
            <span className="text-xs text-gray-500">
              {customPrompt.length} / 500
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={500}
            value={customPrompt}
            onChange={(e) => handleCustomPromptChange(e.target.value)}
            placeholder={
              selectedPresetId === 'surreal-custom'
                ? 'シーンのビジョンを説明してください…'
                : 'プリセットに追加したいディレクションを記述…'
            }
            className="w-full resize-none rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-200 placeholder-gray-600 outline-none transition-colors duration-200 focus:border-cyan-500"
          />
        </div>
      )}

      {/* Aspect ratio selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-gray-400">アスペクト比</span>
        <div className="flex gap-2">
          {ASPECT_RATIOS.map((ar) => {
            const isSelected = ar.id === currentAspectRatio;
            return (
              <button
                key={ar.id}
                type="button"
                onClick={() => handleAspectRatioChange(ar.id)}
                className={[
                  'flex flex-1 flex-col items-center gap-0.5 rounded-lg border py-2 text-center transition-colors duration-200',
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-600',
                ].join(' ')}
              >
                <span
                  className={[
                    'text-xs font-semibold',
                    isSelected ? 'text-cyan-400' : 'text-gray-200',
                  ].join(' ')}
                >
                  {ar.label}
                </span>
                <span className="text-[10px] text-gray-500">{ar.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

/**
 * FormatSelector.tsx — 5 video format selection
 */

import { VIDEO_FORMATS } from '../../data/video/formats';
import type { FormatId } from '../../types/video';

interface Props {
  selectedId: FormatId | null;
  onSelect: (id: FormatId) => void;
}

export function FormatSelector({ selectedId, onSelect }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 tracking-wider mb-2">
        FORMAT
      </label>
      <div className="space-y-1.5">
        {VIDEO_FORMATS.map(fmt => (
          <button
            key={fmt.id}
            type="button"
            onClick={() => onSelect(fmt.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
              selectedId === fmt.id
                ? 'bg-cyan-500/15 border border-cyan-500/40'
                : 'bg-gray-900 border border-gray-800 hover:border-gray-600'
            }`}
          >
            <div className={`text-xs font-semibold ${selectedId === fmt.id ? 'text-cyan-400' : 'text-gray-300'}`}>
              {fmt.label}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              {fmt.description}
            </div>
            <div className="text-[10px] text-gray-600 mt-0.5">
              {fmt.durationRange.min}-{fmt.durationRange.max}秒 / {fmt.cutRange.min}-{fmt.cutRange.max}カット
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

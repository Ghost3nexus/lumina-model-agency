/**
 * TimelineEditor.tsx — Multi-clip timeline view with per-cut status
 */

import { MOTION_DICTIONARY } from '../../data/video/motionDictionary';
import type { TimelineCut } from '../../types/video';

interface Props {
  cuts: TimelineCut[];
  onUpdateCut: (cutId: string, updates: Partial<TimelineCut>) => void;
  onRemoveCut: (cutId: string) => void;
  onMoveCut: (from: number, to: number) => void;
  narrationEnabled?: boolean;
  disabled?: boolean;
}

const STATUS_ICON: Record<string, string> = {
  pending: '\u25CB',
  'generating-still': '\u23F3',
  'generating-video': '\u{1F3AC}',
  done: '\u2705',
  error: '\u274C',
};

export function TimelineEditor({ cuts, onUpdateCut, onRemoveCut, onMoveCut, narrationEnabled, disabled }: Props) {
  const totalDuration = cuts.reduce((s, c) => s + c.duration, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-400 tracking-wider">
          TIMELINE
        </label>
        <span className="text-[10px] text-gray-500">
          {cuts.length}カット / {totalDuration}秒
        </span>
      </div>

      <div className="space-y-1.5 max-h-[350px] overflow-y-auto">
        {cuts.map((cut, idx) => (
          <div
            key={cut.id}
            className={`rounded-lg border p-2 transition-colors ${
              cut.status === 'done' ? 'border-green-500/30 bg-green-500/5' :
              cut.status === 'error' ? 'border-red-500/30 bg-red-500/5' :
              cut.status === 'generating-still' || cut.status === 'generating-video' ? 'border-cyan-500/30 bg-cyan-500/5' :
              'border-gray-800 bg-gray-900/50'
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-2">
              <span className="text-sm">{STATUS_ICON[cut.status]}</span>
              <span className="text-[10px] text-gray-500 w-4">{idx + 1}</span>
              <span className="text-xs font-medium text-gray-300 flex-1 truncate">{cut.label}</span>
              <span className="text-[10px] text-gray-600">{cut.duration}s</span>
              {!disabled && (
                <div className="flex gap-0.5">
                  {idx > 0 && (
                    <button type="button" onClick={() => onMoveCut(idx, idx - 1)} className="text-gray-600 hover:text-gray-400 text-[10px] px-1">▲</button>
                  )}
                  {idx < cuts.length - 1 && (
                    <button type="button" onClick={() => onMoveCut(idx, idx + 1)} className="text-gray-600 hover:text-gray-400 text-[10px] px-1">▼</button>
                  )}
                  <button type="button" onClick={() => onRemoveCut(cut.id)} className="text-gray-600 hover:text-red-400 text-[10px] px-1">✕</button>
                </div>
              )}
            </div>

            {/* Motion selector */}
            {!disabled && (
              <div className="mt-1.5">
                <select
                  value={cut.motionId}
                  onChange={e => onUpdateCut(cut.id, { motionId: e.target.value })}
                  className="w-full rounded bg-gray-900 border border-gray-800 px-2 py-1 text-[10px] text-gray-300 focus:border-cyan-500/50 focus:outline-none"
                >
                  {MOTION_DICTIONARY.map(m => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Narration text */}
            {!disabled && narrationEnabled && (
              <div className="mt-1.5">
                <input
                  type="text"
                  value={cut.narrationText ?? ''}
                  onChange={e => onUpdateCut(cut.id, { narrationText: e.target.value })}
                  placeholder="Narration…"
                  className="w-full rounded bg-gray-900 border border-gray-800 px-2 py-1 text-[10px] text-gray-300 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none"
                />
              </div>
            )}

            {/* Text overlay */}
            {!disabled && (
              <div className="mt-1.5">
                <input
                  type="text"
                  value={cut.textOverlay ?? ''}
                  onChange={e => onUpdateCut(cut.id, { textOverlay: e.target.value })}
                  placeholder="Text overlay…"
                  className="w-full rounded bg-gray-900 border border-gray-800 px-2 py-1 text-[10px] text-gray-300 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none"
                />
              </div>
            )}

            {/* Preview thumbnail */}
            {cut.stillImage && (
              <div className="mt-1.5">
                <img src={cut.stillImage} alt={cut.label} className="w-full h-16 object-cover rounded border border-gray-800" />
              </div>
            )}

            {/* Error */}
            {cut.error && (
              <p className="text-[10px] text-red-400 mt-1 truncate">{cut.error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

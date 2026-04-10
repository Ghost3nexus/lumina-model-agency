/**
 * TimelineEditor.tsx — Multi-clip timeline with full per-cut prompt editing
 *
 * Each cut is expandable: scene prompt, motion prompt, narration, text overlay.
 * Format template gives defaults, user overrides everything.
 */

import { useState } from 'react';
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
  const [expandedCut, setExpandedCut] = useState<string | null>(null);
  const totalDuration = cuts.reduce((s, c) => s + c.duration, 0);

  function toggleExpand(cutId: string) {
    setExpandedCut(prev => prev === cutId ? null : cutId);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-400 tracking-wider">TIMELINE</label>
        <span className="text-[10px] text-gray-500">{cuts.length}カット / {totalDuration}秒</span>
      </div>

      <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
        {cuts.map((cut, idx) => {
          const isExpanded = expandedCut === cut.id;
          const motionEntry = MOTION_DICTIONARY.find(m => m.id === cut.motionId);

          return (
            <div
              key={cut.id}
              className={`rounded-lg border transition-colors ${
                cut.status === 'done' ? 'border-green-500/30 bg-green-500/5' :
                cut.status === 'error' ? 'border-red-500/30 bg-red-500/5' :
                cut.status === 'generating-still' || cut.status === 'generating-video' ? 'border-cyan-500/30 bg-cyan-500/5' :
                'border-gray-800 bg-gray-900/50'
              }`}
            >
              {/* ── Header (always visible) ── */}
              <div className="flex items-center gap-2 p-2 cursor-pointer" onClick={() => !disabled && toggleExpand(cut.id)}>
                <span className="text-sm">{STATUS_ICON[cut.status]}</span>
                <span className="text-[10px] text-gray-500 w-4">{idx + 1}</span>
                <span className="text-xs font-medium text-gray-300 flex-1 truncate">{cut.label}</span>
                <span className="text-[10px] text-gray-600">{cut.duration}s</span>
                {!disabled && (
                  <div className="flex gap-0.5" onClick={e => e.stopPropagation()}>
                    {idx > 0 && (
                      <button type="button" onClick={() => onMoveCut(idx, idx - 1)} className="text-gray-600 hover:text-gray-400 text-[10px] px-1">▲</button>
                    )}
                    {idx < cuts.length - 1 && (
                      <button type="button" onClick={() => onMoveCut(idx, idx + 1)} className="text-gray-600 hover:text-gray-400 text-[10px] px-1">▼</button>
                    )}
                    <button type="button" onClick={() => onRemoveCut(cut.id)} className="text-gray-600 hover:text-red-400 text-[10px] px-1">✕</button>
                  </div>
                )}
                <span className="text-[10px] text-gray-700">{isExpanded ? '▾' : '▸'}</span>
              </div>

              {/* ── Expanded editor ── */}
              {isExpanded && !disabled && (
                <div className="px-2 pb-2 space-y-2 border-t border-gray-800/50 pt-2">
                  {/* Scene / Still prompt */}
                  <div>
                    <label className="text-[9px] text-gray-500 font-semibold tracking-wider">SCENE PROMPT</label>
                    <textarea
                      value={cut.stillPrompt}
                      onChange={e => onUpdateCut(cut.id, { stillPrompt: e.target.value })}
                      rows={3}
                      className="w-full mt-0.5 rounded bg-gray-900 border border-gray-800 px-2 py-1 text-[10px] text-gray-300 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Motion */}
                  <div>
                    <label className="text-[9px] text-gray-500 font-semibold tracking-wider">MOTION</label>
                    <select
                      value={cut.motionId}
                      onChange={e => {
                        const m = MOTION_DICTIONARY.find(x => x.id === e.target.value);
                        onUpdateCut(cut.id, {
                          motionId: e.target.value,
                          motionPromptOverride: m?.prompt ?? '',
                        });
                      }}
                      className="w-full mt-0.5 rounded bg-gray-900 border border-gray-800 px-2 py-1 text-[10px] text-gray-300 focus:border-cyan-500/50 focus:outline-none"
                    >
                      {MOTION_DICTIONARY.map(m => (
                        <option key={m.id} value={m.id}>{m.label} — {m.category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Motion prompt override */}
                  <div>
                    <label className="text-[9px] text-gray-500 font-semibold tracking-wider">MOTION PROMPT (custom)</label>
                    <textarea
                      value={cut.motionPromptOverride ?? motionEntry?.prompt ?? ''}
                      onChange={e => onUpdateCut(cut.id, { motionPromptOverride: e.target.value })}
                      rows={2}
                      className="w-full mt-0.5 rounded bg-gray-900 border border-gray-800 px-2 py-1 text-[10px] text-gray-300 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Text overlay */}
                  <div>
                    <label className="text-[9px] text-gray-500 font-semibold tracking-wider">TEXT OVERLAY</label>
                    <input
                      type="text"
                      value={cut.textOverlay ?? ''}
                      onChange={e => onUpdateCut(cut.id, { textOverlay: e.target.value })}
                      placeholder="On-screen text…"
                      className="w-full mt-0.5 rounded bg-gray-900 border border-gray-800 px-2 py-1 text-[10px] text-gray-300 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none"
                    />
                  </div>

                  {/* Narration */}
                  {narrationEnabled && (
                    <div>
                      <label className="text-[9px] text-gray-500 font-semibold tracking-wider">NARRATION</label>
                      <input
                        type="text"
                        value={cut.narrationText ?? ''}
                        onChange={e => onUpdateCut(cut.id, { narrationText: e.target.value })}
                        placeholder="What the model says…"
                        className="w-full mt-0.5 rounded bg-gray-900 border border-gray-800 px-2 py-1 text-[10px] text-gray-300 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Duration toggle */}
                  <div className="flex items-center gap-2">
                    <label className="text-[9px] text-gray-500 font-semibold tracking-wider">DURATION</label>
                    <div className="flex gap-1">
                      {([5, 10] as const).map(d => (
                        <button key={d} type="button" onClick={() => onUpdateCut(cut.id, { duration: d })}
                          className={`px-2 py-0.5 rounded text-[9px] font-medium ${
                            cut.duration === d ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-gray-900 text-gray-600 border border-gray-800'
                          }`}>{d}s</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Preview thumbnail (always visible if available) ── */}
              {cut.stillImage && !isExpanded && (
                <div className="px-2 pb-2">
                  <img src={cut.stillImage} alt={cut.label} className="w-full h-14 object-cover rounded border border-gray-800" />
                </div>
              )}

              {/* Error */}
              {cut.error && (
                <p className="text-[10px] text-red-400 px-2 pb-2 truncate">{cut.error}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

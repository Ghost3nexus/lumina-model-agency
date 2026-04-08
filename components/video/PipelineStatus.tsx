/**
 * PipelineStatus.tsx — 3-step pipeline progress display
 */

import type { VideoPipelineState, PipelineStep } from '../../types/video';

interface Props {
  state: VideoPipelineState;
}

const STEP_LABELS: Record<PipelineStep, string> = {
  still: 'Still Image',
  i2v: 'I2V Conversion',
  narration: 'Narration',
};

const STATUS_ICONS: Record<string, string> = {
  idle: '\u25CB',      // ○
  running: '\u23F3',   // ⏳
  done: '\u2705',      // ✅
  error: '\u274C',     // ❌
};

export function PipelineStatus({ state }: Props) {
  const steps: PipelineStep[] = ['still', 'i2v', 'narration'];
  const hasActivity = steps.some(s => state.steps[s].status !== 'idle');

  if (!hasActivity) return null;

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 space-y-2">
      <span className="text-[10px] font-semibold text-gray-500 tracking-wider">PIPELINE</span>
      {steps.map(step => {
        const s = state.steps[step];
        return (
          <div key={step} className="flex items-center gap-2">
            <span className="text-sm">{STATUS_ICONS[s.status]}</span>
            <span className={`text-xs font-medium ${
              s.status === 'running' ? 'text-cyan-400' :
              s.status === 'done' ? 'text-green-400' :
              s.status === 'error' ? 'text-red-400' :
              'text-gray-600'
            }`}>
              {STEP_LABELS[step]}
            </span>
            {s.progress && s.status === 'running' && (
              <span className="text-[10px] text-gray-500">{s.progress}</span>
            )}
            {s.error && (
              <span className="text-[10px] text-red-400 truncate max-w-[200px]">{s.error}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * GenerateButton.tsx — Generate button with progress bar
 *
 * States: ready / working (analyzing|generating|checking|retrying) / complete / not-ready
 */

import type { GenerationStatus } from '../../types/generation';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GenerateButtonProps {
  status: GenerationStatus;
  canGenerate: boolean;
  progress: { completed: number; total: number };
  onGenerate: () => void;
  onReset: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WORKING_STATUSES = new Set<GenerationStatus>(['analyzing', 'generating', 'checking', 'retrying']);

const STATUS_LABELS: Partial<Record<GenerationStatus, string>> = {
  analyzing:  '商品を解析中...',
  generating: '生成中...',
  checking:   '品質チェック中...',
  retrying:   '再試行中...',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="w-4 h-4 animate-spin shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.4" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GenerateButton({
  status,
  canGenerate,
  progress,
  onGenerate,
  onReset,
}: GenerateButtonProps) {
  const isWorking  = WORKING_STATUSES.has(status);
  const isComplete = status === 'complete';

  const progressPct = progress.total > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  // ── Complete state ──────────────────────────────────────────────────────────

  if (isComplete) {
    return (
      <button
        type="button"
        onClick={onReset}
        className="w-full py-3 rounded-lg bg-gray-800 text-gray-200 text-sm font-semibold hover:bg-gray-700 transition-colors duration-200"
      >
        新規生成
      </button>
    );
  }

  // ── Working state ───────────────────────────────────────────────────────────

  if (isWorking) {
    return (
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Spinner />
            <span>{STATUS_LABELS[status] ?? '処理中...'}</span>
          </div>
          <span className="text-xs text-gray-500">
            {progress.completed} / {progress.total}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <button
          type="button"
          disabled
          className="w-full py-3 rounded-lg bg-gray-800 text-gray-600 text-sm font-semibold cursor-not-allowed"
        >
          Generate ⚡
        </button>
      </div>
    );
  }

  // ── Ready / not-ready state ─────────────────────────────────────────────────

  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={!canGenerate}
      className={[
        'w-full py-3 rounded-lg text-sm font-semibold transition-colors duration-200',
        canGenerate
          ? 'bg-cyan-500 text-gray-950 hover:bg-cyan-400 active:bg-cyan-600'
          : 'bg-gray-800 text-gray-600 cursor-not-allowed',
      ].join(' ')}
    >
      Generate ⚡
    </button>
  );
}

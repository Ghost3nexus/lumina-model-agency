/**
 * ErrorDisplay.tsx — Error message card with retry and support link
 *
 * Types: api / quality / input
 */


// ─── Types ────────────────────────────────────────────────────────────────────

interface ErrorDisplayProps {
  message: string;
  type: 'api' | 'quality' | 'input';
  onRetry?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ERROR_LABELS: Record<ErrorDisplayProps['type'], string> = {
  api:     '⚠️ サーバーエラー',
  quality: '品質チェックエラー',
  input:   '入力エラー',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ErrorDisplay({ message, type, onRetry }: ErrorDisplayProps) {
  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-lg border border-red-500/30 bg-red-500/10"
      role="alert"
    >
      {/* Error type label */}
      <p className="text-xs font-semibold text-red-400 leading-none">
        {ERROR_LABELS[type]}
      </p>

      {/* Message */}
      <p className="text-sm text-red-300/90 leading-relaxed">
        {message}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-medium hover:bg-red-500/30 transition-colors duration-200"
          >
            再試行
          </button>
        )}
        <a
          href="mailto:support@tomorrowproof.co.jp"
          className="text-xs text-gray-500 hover:text-gray-400 underline underline-offset-2 transition-colors duration-200"
        >
          お問い合わせ
        </a>
      </div>
    </div>
  );
}

import type { ShootMode } from '../../types/sns';

interface ModeToggleProps {
  mode: ShootMode;
  onChange: (mode: ShootMode) => void;
}

const MODES: { id: ShootMode; label: string }[] = [
  { id: 'ec-standard', label: 'EC撮影' },
  { id: 'sns-creative', label: 'SNSクリエイティブ' },
];

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex gap-0 rounded-lg border border-gray-700 overflow-hidden">
      {MODES.map(m => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={[
            'flex-1 px-4 py-2.5 text-sm font-semibold transition-colors duration-200',
            m.id === mode
              ? 'bg-cyan-500 text-gray-950'
              : 'bg-gray-900 text-gray-400 hover:text-gray-200 hover:bg-gray-800',
          ].join(' ')}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

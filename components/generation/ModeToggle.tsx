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
    <div className="flex gap-1 p-1 bg-gray-900 rounded-full w-fit">
      {MODES.map(m => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={[
            'px-4 py-1.5 rounded-full text-xs font-medium transition-colors duration-200',
            m.id === mode
              ? 'bg-cyan-500 text-gray-950'
              : 'text-gray-400 hover:text-gray-200',
          ].join(' ')}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

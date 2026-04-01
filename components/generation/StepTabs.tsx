/**
 * StepTabs.tsx — Tab navigation for the generation flow
 *
 * Two tabs (EC): 商品画像 (garment) / モデル (model)
 * Three tabs (SNS): 商品画像 (garment) / モデル (model) / シーン (scene)
 * Shows a checkmark when each step is ready.
 */


// ─── Types ────────────────────────────────────────────────────────────────────

export type StepId = 'garment' | 'model' | 'scene';

interface StepTabsProps {
  current: StepId;
  onChange: (step: StepId) => void;
  garmentReady: boolean;
  modelReady: boolean;
  shootMode?: 'ec-standard' | 'sns-creative';
  sceneReady?: boolean;
}

// ─── Checkmark SVG ────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 ml-1.5 shrink-0"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="7" fill="currentColor" opacity="0.2" />
      <path
        d="M4 7l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StepTabs({ current, onChange, garmentReady, modelReady, shootMode, sceneReady }: StepTabsProps) {
  const tabs: { id: StepId; label: string; ready: boolean }[] = [
    { id: 'garment', label: '商品画像', ready: garmentReady },
    { id: 'model',   label: 'モデル',   ready: modelReady  },
  ];
  if (shootMode === 'sns-creative') {
    tabs.push({ id: 'scene', label: 'シーン', ready: sceneReady ?? false });
  }

  return (
    <div className="flex gap-2 p-1 bg-gray-900 rounded-full w-fit">
      {tabs.map(tab => {
        const isActive = tab.id === current;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              'flex items-center px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200',
              isActive
                ? 'bg-cyan-500 text-gray-950'
                : 'bg-transparent text-gray-400 hover:text-gray-200',
            ].join(' ')}
            aria-current={isActive ? 'step' : undefined}
          >
            {tab.label}
            {tab.ready && <CheckIcon />}
          </button>
        );
      })}
    </div>
  );
}

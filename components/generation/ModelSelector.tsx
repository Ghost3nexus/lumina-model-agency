/**
 * ModelSelector.tsx — Agency model selection grid with contract-based locking
 *
 * Free plan: all models available
 * Paid plans: only contracted models selectable, others show lock icon
 */

import { useState } from 'react';
import { AGENCY_MODELS, AGENCY_CATEGORIES, type AgencyModel } from '../../data/agencyModels';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ModelSelectorProps {
  selectedModel: AgencyModel | null;
  onSelect: (model: AgencyModel) => void;
  isModelAvailable: (modelId: string) => boolean;
  plan: string;
}

type FilterCategory = 'all' | AgencyModel['category'];

// ─── Lock Icon ───────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ModelSelector({ selectedModel, onSelect, isModelAvailable, plan }: ModelSelectorProps) {
  const [filter, setFilter] = useState<FilterCategory>('all');

  const filteredModels = filter === 'all'
    ? AGENCY_MODELS
    : AGENCY_MODELS.filter(m => m.category === filter);

  return (
    <div className="flex flex-col gap-3">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        <FilterButton label="ALL" active={filter === 'all'} onClick={() => setFilter('all')} />
        {AGENCY_CATEGORIES.map(cat => (
          <FilterButton key={cat.id} label={cat.label} active={filter === cat.id} onClick={() => setFilter(cat.id)} />
        ))}
      </div>

      {/* Plan indicator */}
      {plan !== 'free' && (
        <p className="text-[10px] text-gray-600">
          Contracted models only. <a href="/pricing" className="text-cyan-500 hover:underline">Add models</a>
        </p>
      )}

      {/* Model grid */}
      <div className="grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-1">
        {filteredModels.map(model => {
          const isSelected = selectedModel?.id === model.id;
          const available = isModelAvailable(model.id);

          return (
            <button
              key={model.id}
              type="button"
              onClick={() => available && onSelect(model)}
              disabled={!available}
              className={`relative rounded-lg overflow-hidden border transition-all duration-200 ${
                !available
                  ? 'border-gray-800 opacity-50 cursor-not-allowed'
                  : isSelected
                    ? 'border-cyan-500 ring-2 ring-cyan-500/40'
                    : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="relative w-full aspect-[3/4] bg-gray-900">
                <img
                  src={model.images.main}
                  alt={model.name}
                  className={`w-full h-full object-cover ${!available ? 'grayscale' : ''}`}
                  loading="lazy"
                />

                {/* Lock overlay */}
                {!available && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <LockIcon />
                      <span className="text-[9px] tracking-wider uppercase">Contract</span>
                    </div>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 px-2 pb-2">
                  <p className="text-[11px] font-semibold text-white tracking-wider truncate">
                    {model.name}
                  </p>
                  <p className="text-[10px] text-gray-300 truncate">
                    {model.height}cm
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-[10px] tracking-wider font-medium transition-colors ${
        active ? 'text-white border-b border-white' : 'text-gray-600 hover:text-gray-400'
      }`}
    >
      {label}
    </button>
  );
}

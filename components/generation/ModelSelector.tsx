/**
 * ModelSelector.tsx — Agency model selection grid
 *
 * Uses AGENCY_MODELS from data/agencyModels.ts
 * Categories: ALL / LADIES ASIA / LADIES INTL / MEN ASIA / MEN INTL
 */

import { useState } from 'react';
import { AGENCY_MODELS, AGENCY_CATEGORIES, type AgencyModel } from '../../data/agencyModels';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ModelSelectorProps {
  selectedModel: AgencyModel | null;
  onSelect: (model: AgencyModel) => void;
}

type FilterCategory = 'all' | AgencyModel['category'];

// ─── Component ────────────────────────────────────────────────────────────────

export function ModelSelector({ selectedModel, onSelect }: ModelSelectorProps) {
  const [filter, setFilter] = useState<FilterCategory>('all');

  const filteredModels = filter === 'all'
    ? AGENCY_MODELS
    : AGENCY_MODELS.filter(m => m.category === filter);

  return (
    <div className="flex flex-col gap-3">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        <FilterButton
          label="ALL"
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        {AGENCY_CATEGORIES.map(cat => (
          <FilterButton
            key={cat.id}
            label={cat.label}
            active={filter === cat.id}
            onClick={() => setFilter(cat.id)}
          />
        ))}
      </div>

      {/* Model grid */}
      <div className="grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-1">
        {filteredModels.map(model => {
          const isSelected = selectedModel?.id === model.id;
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onSelect(model)}
              className={`relative rounded-lg overflow-hidden border transition-all duration-200 ${
                isSelected
                  ? 'border-cyan-500 ring-2 ring-cyan-500/40'
                  : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="relative w-full aspect-[3/4] bg-gray-900">
                <img
                  src={model.images.main}
                  alt={model.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
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
        active
          ? 'text-white border-b border-white'
          : 'text-gray-600 hover:text-gray-400'
      }`}
    >
      {label}
    </button>
  );
}

/**
 * ModelSelector.tsx — Model selection grid for Video Studio
 */

import { AGENCY_MODELS } from '../../data/agencyModels';
import type { AgencyModel } from '../../data/agencyModels';

interface Props {
  selectedId: string | null;
  onSelect: (model: AgencyModel) => void;
}

export function VideoModelSelector({ selectedId, onSelect }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 tracking-wider mb-2">
        MODEL
      </label>
      <div className="grid grid-cols-4 gap-2">
        {AGENCY_MODELS.map(model => (
          <button
            key={model.id}
            type="button"
            onClick={() => onSelect(model)}
            className={`relative rounded-lg overflow-hidden border transition-all duration-200 aspect-[3/4] group ${
              selectedId === model.id
                ? 'border-cyan-500 ring-1 ring-cyan-500/30'
                : 'border-gray-800 hover:border-gray-600'
            }`}
          >
            <img
              src={model.images.main}
              alt={model.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
              <span className="text-[10px] font-semibold tracking-wider text-white">
                {model.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

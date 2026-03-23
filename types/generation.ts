import type { GarmentAnalysis, OutfitSlot, SlotUpload } from './garment';
import type { AgencyModel } from '../data/agencyModels';

export type AngleType = 'front' | 'back' | 'side' | 'bust';

export interface PreviewResult {
  id: string;
  angle: AngleType;
  imageUrl: string;
  status: 'pending' | 'generating' | 'checking' | 'complete' | 'error' | 'retrying';
  qualityScore?: number;
  qualityIssues?: string[];
  retryCount: number;
}

export type GenerationStatus =
  | 'idle' | 'ready' | 'analyzing' | 'generating'
  | 'checking' | 'retrying' | 'complete' | 'error';

export interface GenerationState {
  status: GenerationStatus;
  /** @deprecated — use outfitSlots instead */
  garmentImage: string | null;
  outfitSlots: Partial<Record<OutfitSlot, SlotUpload>>;
  garmentAnalysis: GarmentAnalysis | null;
  /** Combined outfit analysis (describes the full outfit) */
  outfitAnalysis: GarmentAnalysis[] | null;
  selectedModel: AgencyModel | null;
  results: Record<AngleType, PreviewResult>;
  progress: { current: AngleType | null; completed: number; total: 4 };
  error: { message: string; type: 'api' | 'quality' | 'input' } | null;
}

export type GenerationAction =
  | { type: 'SET_GARMENT'; image: string }
  | { type: 'SET_OUTFIT'; slots: Partial<Record<OutfitSlot, SlotUpload>> }
  | { type: 'SET_ANALYSIS'; analysis: GarmentAnalysis }
  | { type: 'SET_OUTFIT_ANALYSIS'; analyses: GarmentAnalysis[] }
  | { type: 'SET_MODEL'; model: AgencyModel }
  | { type: 'CLEAR_GARMENT' }
  | { type: 'START_ANALYZING' }
  | { type: 'START_GENERATING' }
  | { type: 'UPDATE_RESULT'; angle: AngleType; result: Partial<PreviewResult> }
  | { type: 'SET_PROGRESS'; current: AngleType | null; completed: number }
  | { type: 'START_CHECKING' }
  | { type: 'START_RETRYING' }
  | { type: 'COMPLETE' }
  | { type: 'SET_ERROR'; message: string; errorType: 'api' | 'quality' | 'input' }
  | { type: 'RESET' };

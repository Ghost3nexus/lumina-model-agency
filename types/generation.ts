import type { GarmentAnalysis, OutfitSlot, SlotUpload } from './garment';
import type { AgencyModel } from '../data/agencyModels';
import type {
  ShootMode,
  SNSCreativeConfig,
  ResultKey,
  VariationType,
} from './sns';

export type { ShootMode, SNSCreativeConfig, ResultKey, VariationType };
export type {
  SceneCategory,
  AspectRatio,
  ScenePreset,
} from './sns';
export { VARIATION_KEYS, ASPECT_RATIO_PIXELS, VARIATION_CAMERAS } from './sns';

export type AngleType = 'front' | 'back' | 'side' | 'bust';

export interface PreviewResult {
  id: string;
  angle: ResultKey;
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
  shootMode: ShootMode;
  snsConfig: SNSCreativeConfig | null;
  results: Partial<Record<ResultKey, PreviewResult>>;
  progress: { current: ResultKey | null; completed: number; total: number };
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
  | { type: 'SET_SHOOT_MODE'; mode: ShootMode }
  | { type: 'SET_SNS_CONFIG'; config: SNSCreativeConfig | null }
  | { type: 'UPDATE_RESULT'; angle: ResultKey; result: Partial<PreviewResult> }
  | { type: 'SET_PROGRESS'; current: ResultKey | null; completed: number }
  | { type: 'START_CHECKING' }
  | { type: 'START_RETRYING' }
  | { type: 'COMPLETE' }
  | { type: 'SET_ERROR'; message: string; errorType: 'api' | 'quality' | 'input' }
  | { type: 'RESET' };

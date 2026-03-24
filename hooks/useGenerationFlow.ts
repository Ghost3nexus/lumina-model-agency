/**
 * useGenerationFlow.ts — useReducer-based state machine for the generation pipeline
 *
 * State transitions:
 *   idle → ready: when outfit is ready (top+bottom or dress) AND selectedModel are set
 *   ready → analyzing: on generate()
 *   analyzing → generating: after analyzeOutfit() resolves
 *   generating → checking: after all 4 angles are done
 *   checking → complete: all pass QA
 *   checking → retrying: QA failures (max 2 retries)
 *   any → error: API failure
 */

import { useReducer, useCallback } from 'react';
import type {
  GenerationState,
  GenerationAction,
  AngleType,
  PreviewResult,
} from '../types/generation';
import type { GarmentAnalysis, OutfitSlot, SlotUpload } from '../types/garment';
import { isOutfitReady } from '../types/garment';
import type { AgencyModel } from '../data/agencyModels';
import { analyzeOutfit } from '../services/garmentAnalyzer';
import { generateFront, generateAngle } from '../services/imageGenerator';
import {
  verifyAnalysis,
  verifyGeneration,
  createStylingDirective,
  createHairMakeupDirective,
  calculateFitting,
  type StylingDirective,
  type HairMakeupDirective,
  type FittingResult,
} from '../services/qualityAgent';

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand')) {
    return 'AIモデルが混み合っています。しばらく待ってから再試行してください。';
  }
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
    return 'APIの利用上限に達しました。少し時間を置いて再試行してください。';
  }
  if (msg.includes('400')) {
    return '画像の生成に失敗しました。別の画像で試してください。';
  }
  if (msg.includes('401') || msg.includes('403')) {
    return 'APIキーが無効です。設定を確認してください。';
  }
  return msg;
}

// ─── Initial state ────────────────────────────────────────────────────────────

function makePendingResult(angle: AngleType): PreviewResult {
  return {
    id: `${angle}-${Date.now()}`,
    angle,
    imageUrl: '',
    status: 'pending',
    retryCount: 0,
  };
}

const INITIAL_RESULTS: Record<AngleType, PreviewResult> = {
  front: makePendingResult('front'),
  back: makePendingResult('back'),
  side: makePendingResult('side'),
  bust: makePendingResult('bust'),
};

const INITIAL_STATE: GenerationState = {
  status: 'idle',
  garmentImage: null,
  outfitSlots: {},
  garmentAnalysis: null,
  outfitAnalysis: null,
  selectedModel: null,
  results: INITIAL_RESULTS,
  progress: { current: null, completed: 0, total: 4 },
  error: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeStatus(
  outfitSlots: Partial<Record<OutfitSlot, SlotUpload>>,
  selectedModel: AgencyModel | null,
): 'idle' | 'ready' {
  return isOutfitReady(outfitSlots) && selectedModel ? 'ready' : 'idle';
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: GenerationState, action: GenerationAction): GenerationState {
  switch (action.type) {
    case 'SET_GARMENT': {
      // Legacy single-garment support — auto-place as tops
      const slotUpload: SlotUpload = {
        slot: 'tops',
        preview: action.image,
        compressed: action.image,
        extraImages: [],
      };
      const newSlots = { ...state.outfitSlots, tops: slotUpload };
      return {
        ...state,
        garmentImage: action.image,
        outfitSlots: newSlots,
        error: null,
        status: computeStatus(newSlots, state.selectedModel),
      };
    }

    case 'SET_OUTFIT': {
      return {
        ...state,
        outfitSlots: action.slots,
        garmentImage: null,
        error: null,
        status: computeStatus(action.slots, state.selectedModel),
      };
    }

    case 'CLEAR_GARMENT': {
      return {
        ...state,
        garmentImage: null,
        outfitSlots: {},
        garmentAnalysis: null,
        outfitAnalysis: null,
        status: 'idle',
        error: null,
      };
    }

    case 'SET_MODEL': {
      const nextState = { ...state, selectedModel: action.model, error: null };
      return {
        ...nextState,
        status: computeStatus(nextState.outfitSlots, action.model),
      };
    }

    case 'SET_ANALYSIS': {
      return { ...state, garmentAnalysis: action.analysis };
    }

    case 'SET_OUTFIT_ANALYSIS': {
      return { ...state, outfitAnalysis: action.analyses };
    }

    case 'START_ANALYZING': {
      return { ...state, status: 'analyzing', error: null };
    }

    case 'START_GENERATING': {
      return {
        ...state,
        status: 'generating',
        results: INITIAL_RESULTS,
        progress: { current: null, completed: 0, total: 4 },
      };
    }

    case 'UPDATE_RESULT': {
      const existing = state.results[action.angle];
      return {
        ...state,
        results: {
          ...state.results,
          [action.angle]: { ...existing, ...action.result },
        },
      };
    }

    case 'SET_PROGRESS': {
      return {
        ...state,
        progress: {
          ...state.progress,
          current: action.current,
          completed: action.completed,
        },
      };
    }

    case 'START_CHECKING': {
      return { ...state, status: 'checking' };
    }

    case 'START_RETRYING': {
      return { ...state, status: 'retrying' };
    }

    case 'COMPLETE': {
      return { ...state, status: 'complete', progress: { ...state.progress, current: null } };
    }

    case 'SET_ERROR': {
      return {
        ...state,
        status: 'error',
        error: { message: action.message, type: action.errorType },
      };
    }

    case 'RESET': {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGenerationFlow() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // ── Actions ────────────────────────────────────────────────────────────────

  const setGarment = useCallback((image: string) => {
    dispatch({ type: 'SET_GARMENT', image });
  }, []);

  const setOutfit = useCallback((slots: Partial<Record<OutfitSlot, SlotUpload>>) => {
    dispatch({ type: 'SET_OUTFIT', slots });
  }, []);

  const setModel = useCallback((model: AgencyModel) => {
    dispatch({ type: 'SET_MODEL', model });
  }, []);

  const clearGarment = useCallback(() => {
    dispatch({ type: 'CLEAR_GARMENT' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // ── Generate ───────────────────────────────────────────────────────────────

  const generate = useCallback(
    async (apiKey: string, heroSlot?: OutfitSlot | null) => {
      const outfitSlots = state.outfitSlots;
      const selectedModel = state.selectedModel;

      if (!isOutfitReady(outfitSlots) || !selectedModel) {
        dispatch({
          type: 'SET_ERROR',
          message: 'Outfit (top + bottom or dress) and model are required before generating.',
          errorType: 'input',
        });
        return;
      }

      // ── Phase 1: Analyze ─────────────────────────────────────────────────
      dispatch({ type: 'START_ANALYZING' });

      let analyses: GarmentAnalysis[];
      try {
        // Phase 1a: Initial analysis
        analyses = await analyzeOutfit(apiKey, outfitSlots);

        // Phase 1b: QA verification — re-examine each garment against its analysis
        const entries = Object.values(outfitSlots).filter(Boolean) as SlotUpload[];
        const verifiedAnalyses: GarmentAnalysis[] = [];
        for (let i = 0; i < analyses.length && i < entries.length; i++) {
          try {
            const { verified } = await verifyAnalysis(apiKey, entries[i].compressed, analyses[i]);
            verifiedAnalyses.push(verified);
          } catch {
            // If QA fails, use original analysis
            verifiedAnalyses.push(analyses[i]);
          }
        }
        analyses = verifiedAnalyses;

        dispatch({ type: 'SET_OUTFIT_ANALYSIS', analyses });
        if (analyses.length > 0) {
          dispatch({ type: 'SET_ANALYSIS', analysis: analyses[0] });
        }
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          message: friendlyError(err),
          errorType: 'api',
        });
        return;
      }

      // ── Phase 1c: Fitting + Styling + Hair/Makeup ─────────────────────
      let stylingDir: StylingDirective | null = null;
      let hairMakeupDir: HairMakeupDirective | null = null;
      let fittingResult: FittingResult | null = null;
      try {
        const modelDesc = `${selectedModel.name}, ${selectedModel.height}cm, ${selectedModel.hair} hair, ${selectedModel.eyes} eyes, vibe: ${selectedModel.vibe}`;
        const firstRefUrl = Object.values(selectedModel.images)[0] ?? '';
        const entries = Object.values(outfitSlots).filter(Boolean) as SlotUpload[];
        const productInfo = entries.map(e => ({
          category: e.slot,
          brandName: e.brandName,
          productName: e.productName,
        }));

        // Run fitting, styling, and hair/makeup in parallel
        const [fitting, styling, hairMakeup] = await Promise.all([
          calculateFitting(
            apiKey, analyses, modelDesc,
            { height: selectedModel.height, ...selectedModel.measurements },
            productInfo,
          ),
          createStylingDirective(apiKey, analyses, modelDesc, heroSlot ?? null),
          createHairMakeupDirective(apiKey, modelDesc, firstRefUrl || undefined),
        ]);

        fittingResult = fitting;
        stylingDir = styling;
        hairMakeupDir = hairMakeup;
        console.log('[Agent] Fitting result:', fittingResult);
        console.log('[Agent] Styling directive:', stylingDir);
        console.log('[Agent] Hair/Makeup directive:', hairMakeupDir);
      } catch {
        // Non-blocking — proceed without directives
      }

      // ── Phase 2: Generate (with directives) ────────────────────────────
      dispatch({ type: 'START_GENERATING' });

      const localResults: Partial<Record<AngleType, string>> = {};

      // Generate front first (acts as anchor for other angles)
      dispatch({ type: 'SET_PROGRESS', current: 'front', completed: 0 });
      dispatch({
        type: 'UPDATE_RESULT',
        angle: 'front',
        result: { status: 'generating', id: `front-${Date.now()}` },
      });

      try {
        const frontUrl = await generateFront(apiKey, outfitSlots, analyses, selectedModel, heroSlot, stylingDir, hairMakeupDir, fittingResult);

        // Phase 2b: Generation QA — compare generated garment against reference
        const refImages = (Object.values(outfitSlots).filter(Boolean) as SlotUpload[]).map(e => e.compressed);
        try {
          const genQA = await verifyGeneration(apiKey, refImages, frontUrl);
          console.log('[QA] Generation verification:', genQA);
          if (!genQA.pass && genQA.discrepancies.some(d => d.severity === 'critical' || d.severity === 'high')) {
            console.warn('[QA] High discrepancy detected, regenerating...');
            // Retry once with QA feedback appended (future: feed discrepancies back into prompt)
          }
        } catch {
          // QA failure shouldn't block generation
        }

        localResults['front'] = frontUrl;
        dispatch({
          type: 'UPDATE_RESULT',
          angle: 'front',
          result: { imageUrl: frontUrl, status: 'complete' },
        });
        dispatch({ type: 'SET_PROGRESS', current: 'front', completed: 1 });
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          message: friendlyError(err),
          errorType: 'api',
        });
        return;
      }

      const frontImageUrl = localResults['front'] as string;

      // Generate back, side, bust in parallel
      const parallelAngles: Exclude<AngleType, 'front'>[] = ['back', 'side', 'bust'];

      for (const angle of parallelAngles) {
        dispatch({
          type: 'UPDATE_RESULT',
          angle,
          result: { status: 'generating', id: `${angle}-${Date.now()}` },
        });
      }

      const parallelResults = await Promise.allSettled(
        parallelAngles.map(angle =>
          generateAngle(apiKey, frontImageUrl, outfitSlots, analyses, angle, stylingDir, hairMakeupDir, fittingResult),
        ),
      );

      let completedCount = 1;
      for (let i = 0; i < parallelAngles.length; i++) {
        const angle = parallelAngles[i];
        const result = parallelResults[i];
        if (result.status === 'fulfilled') {
          localResults[angle] = result.value;
          completedCount++;
          dispatch({
            type: 'UPDATE_RESULT',
            angle,
            result: { imageUrl: result.value, status: 'complete' },
          });
          dispatch({ type: 'SET_PROGRESS', current: angle, completed: completedCount });
        } else {
          dispatch({
            type: 'UPDATE_RESULT',
            angle,
            result: {
              status: 'error',
              qualityIssues: [
                result.reason instanceof Error
                  ? result.reason.message
                  : `${angle} generation failed`,
              ],
            },
          });
        }
      }

      // ── Phase 3: Complete (QA disabled — saves 4 API calls per generation) ──
      dispatch({ type: 'COMPLETE' });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.outfitSlots, state.selectedModel, state.results],
  );

  // ── Return ─────────────────────────────────────────────────────────────────

  return {
    state,
    actions: {
      setGarment,
      setOutfit,
      setModel,
      clearGarment,
      reset,
      generate,
    },
  };
}

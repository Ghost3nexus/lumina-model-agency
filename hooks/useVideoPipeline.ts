/**
 * useVideoPipeline.ts — React hook for Video Studio pipeline state management
 */

import { useState, useCallback, useRef } from 'react';
import { runPipeline } from '../services/video/pipeline';
import type {
  VideoPipelineState,
  VideoGenerationRequest,
  VideoGenerationResult,
  PipelineStep,
  StepStatus,
} from '../types/video';

const INITIAL_STATE: VideoPipelineState = {
  currentStep: null,
  steps: {
    still: { status: 'idle' },
    i2v: { status: 'idle' },
    narration: { status: 'idle' },
  },
};

export function useVideoPipeline() {
  const [state, setState] = useState<VideoPipelineState>(INITIAL_STATE);
  const [result, setResult] = useState<VideoGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const updateStep = useCallback((step: PipelineStep, update: { status: StepStatus; progress?: string; result?: string; error?: string }) => {
    setState(prev => ({
      ...prev,
      currentStep: update.status === 'running' ? step : prev.currentStep,
      steps: {
        ...prev.steps,
        [step]: { ...prev.steps[step], ...update },
      },
    }));
  }, []);

  const generate = useCallback(async (request: VideoGenerationRequest) => {
    abortRef.current = false;
    setError(null);
    setResult(null);
    setState(INITIAL_STATE);

    try {
      const pipelineResult = await runPipeline(request, (step, status) => {
        if (abortRef.current) return;

        if (status === 'done') {
          updateStep(step, { status: 'done' });
        } else {
          updateStep(step, { status: 'running', progress: status });
        }
      });

      if (!abortRef.current) {
        setResult(pipelineResult);

        // Mark remaining idle steps as done if they were skipped
        setState(prev => {
          const updated = { ...prev, currentStep: null };
          for (const step of ['still', 'i2v', 'narration'] as PipelineStep[]) {
            if (prev.steps[step].status === 'idle') {
              updated.steps = { ...updated.steps, [step]: { status: 'done' } };
            }
          }
          return updated;
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);

      // Mark current step as error
      setState(prev => {
        if (prev.currentStep) {
          return {
            ...prev,
            steps: {
              ...prev.steps,
              [prev.currentStep]: { status: 'error' as StepStatus, error: message },
            },
          };
        }
        return prev;
      });
    }
  }, [updateStep]);

  const reset = useCallback(() => {
    abortRef.current = true;
    setState(INITIAL_STATE);
    setResult(null);
    setError(null);
  }, []);

  const isRunning = state.currentStep !== null && state.steps[state.currentStep]?.status === 'running';

  return {
    state,
    result,
    error,
    isRunning,
    generate,
    reset,
  };
}

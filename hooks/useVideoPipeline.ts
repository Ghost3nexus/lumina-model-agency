/**
 * useVideoPipeline.ts — React hook for Video Studio v2 timeline state
 */

import { useState, useCallback, useRef } from 'react';
import { generateTimeline } from '../services/video/pipeline';
import { generateScript, scriptToTimelineCuts } from '../services/video/scriptGenerator';
import { VIDEO_FORMATS } from '../data/video/formats';
import { AGENCY_MODELS } from '../data/agencyModels';
import type { VideoTimeline, TimelineCut, FormatId, CutStatus } from '../types/video';

/** Create a fresh timeline from a format template */
export function createTimeline(formatId: FormatId, modelId: string, aspectRatio: '9:16' | '16:9' | '1:1' = '9:16'): VideoTimeline {
  const format = VIDEO_FORMATS.find(f => f.id === formatId);
  if (!format) throw new Error(`Format not found: ${formatId}`);

  const cuts: TimelineCut[] = format.defaultCuts.map((tpl, i) => ({
    id: `cut-${i}-${Date.now()}`,
    index: i,
    role: tpl.role,
    label: tpl.label,
    duration: tpl.duration as 5 | 10,
    motionId: tpl.defaultMotionId,
    stillPrompt: tpl.stillPromptHint,
    textOverlay: tpl.textOverlay,
    status: 'pending' as CutStatus,
  }));

  return { formatId, modelId, aspectRatio, cuts };
}

export function useVideoPipeline() {
  const [timeline, setTimeline] = useState<VideoTimeline | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const initTimeline = useCallback((formatId: FormatId, modelId: string, aspectRatio: '9:16' | '16:9' | '1:1' = '9:16') => {
    setTimeline(createTimeline(formatId, modelId, aspectRatio));
    setError(null);
  }, []);

  const updateCut = useCallback((cutId: string, updates: Partial<TimelineCut>) => {
    setTimeline(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        cuts: prev.cuts.map(c => c.id === cutId ? { ...c, ...updates } : c),
      };
    });
  }, []);

  const moveCut = useCallback((fromIndex: number, toIndex: number) => {
    setTimeline(prev => {
      if (!prev) return prev;
      const cuts = [...prev.cuts];
      const [moved] = cuts.splice(fromIndex, 1);
      cuts.splice(toIndex, 0, moved);
      return { ...prev, cuts: cuts.map((c, i) => ({ ...c, index: i })) };
    });
  }, []);

  const removeCut = useCallback((cutId: string) => {
    setTimeline(prev => {
      if (!prev) return prev;
      const cuts = prev.cuts.filter(c => c.id !== cutId).map((c, i) => ({ ...c, index: i }));
      return { ...prev, cuts };
    });
  }, []);

  const addCut = useCallback((cut: TimelineCut) => {
    setTimeline(prev => {
      if (!prev) return prev;
      const cuts = [...prev.cuts, { ...cut, index: prev.cuts.length }];
      return { ...prev, cuts };
    });
  }, []);

  const generate = useCallback(async (apiKey: string) => {
    if (!timeline) return;
    abortRef.current = false;
    setIsRunning(true);
    setError(null);

    // Reset all cuts to pending
    setTimeline(prev => prev ? {
      ...prev,
      cuts: prev.cuts.map(c => ({ ...c, status: 'pending' as CutStatus, stillImage: undefined, videoUrl: undefined, audioUrl: undefined, error: undefined })),
    } : prev);

    try {
      await generateTimeline(
        timeline.cuts,
        timeline.modelId,
        timeline.aspectRatio,
        apiKey,
        (cutId, status, data) => {
          if (abortRef.current) return;
          updateCut(cutId, { status, ...data });
        },
        timeline.garmentImage,
        timeline.colorPresetId,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsRunning(false);
    }
  }, [timeline, updateCut]);

  const reset = useCallback(() => {
    abortRef.current = true;
    setIsRunning(false);
    setError(null);
    if (timeline) {
      setTimeline({
        ...timeline,
        cuts: timeline.cuts.map(c => ({ ...c, status: 'pending' as CutStatus, stillImage: undefined, videoUrl: undefined, audioUrl: undefined, error: undefined })),
      });
    }
  }, [timeline]);

  const setGarmentImage = useCallback((image: string | undefined) => {
    setTimeline(prev => prev ? { ...prev, garmentImage: image } : prev);
  }, []);

  const setColorPreset = useCallback((presetId: string) => {
    setTimeline(prev => prev ? { ...prev, colorPresetId: presetId } : prev);
  }, []);

  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptMeta, setScriptMeta] = useState<{ title: string; bgm: string; hashtags: string } | null>(null);

  /** AI台本生成: intent → 全カットのプロンプトを自動生成 */
  const generateAIScript = useCallback(async (intent: string, apiKey: string) => {
    if (!timeline) return;
    const format = VIDEO_FORMATS.find(f => f.id === timeline.formatId);
    const model = AGENCY_MODELS.find(m => m.id === timeline.modelId);
    if (!format || !model) return;

    setIsGeneratingScript(true);
    setError(null);

    try {
      const script = await generateScript({ model, format, intent, apiKey });
      const cuts = scriptToTimelineCuts(script);

      setTimeline(prev => prev ? { ...prev, cuts } : prev);
      setScriptMeta({
        title: script.title,
        bgm: script.bgmSuggestion,
        hashtags: script.hashtagSuggestion,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Script generation failed');
    } finally {
      setIsGeneratingScript(false);
    }
  }, [timeline]);

  const totalDuration = timeline?.cuts.reduce((sum, c) => sum + c.duration, 0) ?? 0;
  const completedCuts = timeline?.cuts.filter(c => c.status === 'done').length ?? 0;
  const totalCuts = timeline?.cuts.length ?? 0;

  return {
    timeline,
    isRunning,
    error,
    totalDuration,
    completedCuts,
    totalCuts,
    initTimeline,
    updateCut,
    moveCut,
    removeCut,
    addCut,
    setGarmentImage,
    setColorPreset,
    generateAIScript,
    isGeneratingScript,
    scriptMeta,
    generate,
    reset,
  };
}

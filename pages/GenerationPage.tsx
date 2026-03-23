/**
 * GenerationPage.tsx — Thin orchestrator: wires hooks to 2-column botika-style UI
 *
 * Layout:
 *   Header (LUMINA STUDIO + API Key toggle)
 *   Main (flex-1)
 *       Left panel (w-[380px]): StepTabs -> GarmentUpload (multi-slot) | ModelSelector -> Generate
 *       Right panel (flex-1): PreviewGrid
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserPlan } from '../hooks/useUserPlan';
import { useGenerationFlow } from '../hooks/useGenerationFlow';
import { useGarmentUpload } from '../hooks/useGarmentUpload';
import { StepTabs } from '../components/generation/StepTabs';
import type { StepId } from '../components/generation/StepTabs';
import { GarmentUpload } from '../components/generation/GarmentUpload';
import { ModelSelector } from '../components/generation/ModelSelector';
import { PreviewGrid } from '../components/generation/PreviewGrid';
import { GenerateButton } from '../components/generation/GenerateButton';
import { ErrorDisplay } from '../components/generation/ErrorDisplay';
import { AGENCY_MODELS } from '../data/agencyModels';

// ─── Constants ────────────────────────────────────────────────────────────────

const API_KEY_STORAGE_KEY = 'lumina_gemini_api_key';

// ─── Component ────────────────────────────────────────────────────────────────

export default function GenerationPage() {
  // ── Hooks ──────────────────────────────────────────────────────────────────

  const { user, signOut } = useAuth();
  const { userPlan, isModelAvailable } = useUserPlan();
  const { state, actions } = useGenerationFlow();
  const {
    state: uploadState,
    uploadToSlot,
    addExtraImage,
    removeExtraImage,
    removeSlot,
    isReadyToGenerate,
  } = useGarmentUpload();

  // ── Local state ────────────────────────────────────────────────────────────

  const [currentStep, setCurrentStep] = useState<StepId>('garment');
  const [heroSlot, setHeroSlot] = useState<import('../types/garment').OutfitSlot | null>(null);
  const [apiKey, setApiKey] = useState<string>(
    () => localStorage.getItem(API_KEY_STORAGE_KEY) ?? '',
  );
  const [showApiKeyBar, setShowApiKeyBar] = useState<boolean>(
    () => !localStorage.getItem(API_KEY_STORAGE_KEY),
  );
  const [apiKeyInput, setApiKeyInput] = useState<string>(
    () => localStorage.getItem(API_KEY_STORAGE_KEY) ?? '',
  );
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // ── Auto-select model from URL param (?model=xxx) ───────────────────────

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modelId = params.get('model');
    if (modelId) {
      const model = AGENCY_MODELS.find(m => m.id === modelId);
      if (model) {
        actions.setModel(model);
        setCurrentStep('garment');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync outfit slots → generation state ─────────────────────────────────

  const slotsRef = JSON.stringify(Object.keys(uploadState.slots));
  useEffect(() => {
    actions.setOutfit(uploadState.slots);
    // Reset heroSlot if its slot was removed
    if (heroSlot && !(heroSlot in uploadState.slots)) {
      setHeroSlot(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotsRef]);

  // ── Derived flags ──────────────────────────────────────────────────────────

  const canGenerate = state.status === 'ready' && !!apiKey;

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleGenerate() {
    if (!apiKey) {
      setShowApiKeyBar(true);
      return;
    }
    void actions.generate(apiKey, heroSlot);
  }

  function handleSaveApiKey() {
    const trimmed = apiKeyInput.trim();
    localStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
    setApiKey(trimmed);
    if (trimmed) {
      setApiKeySaved(true);
      setTimeout(() => {
        setShowApiKeyBar(false);
        setApiKeySaved(false);
      }, 1200);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-[#050508] text-gray-100 flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold tracking-tight text-gray-100">
            LUMINA STUDIO
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="text-xs text-gray-600 hidden md:inline">{user.email}</span>
          )}
          <a
            href="/agency"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors tracking-wider"
          >
            ← AGENCY
          </a>
          <button
            type="button"
            onClick={() => setShowApiKeyBar(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-900 text-gray-400 text-xs font-medium hover:border-gray-600 hover:text-gray-200 transition-colors duration-200"
          >
            API Key
          </button>
          <button
            type="button"
            onClick={signOut}
            className="px-3 py-1.5 rounded-lg border border-gray-800 text-gray-600 text-xs hover:text-gray-400 hover:border-gray-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── API Key bar ── */}
      {showApiKeyBar && (
        <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-800 bg-gray-950 shrink-0">
          <label htmlFor="api-key-input" className="text-xs text-gray-400 whitespace-nowrap">
            Gemini API Key
          </label>
          <input
            id="api-key-input"
            type="password"
            value={apiKeyInput}
            onChange={e => setApiKeyInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSaveApiKey(); }}
            placeholder="AIza..."
            className="flex-1 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors duration-200"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={handleSaveApiKey}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 whitespace-nowrap ${
              apiKeySaved
                ? 'bg-green-500 text-white'
                : 'bg-cyan-500 text-gray-950 hover:bg-cyan-400'
            }`}
          >
            {apiKeySaved ? '保存しました' : '保存'}
          </button>
        </div>
      )}

      {/* ── Main layout ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* ── Left panel (full width on mobile, 380px on desktop) ── */}
        <div className="w-full md:w-[380px] shrink-0 flex flex-col gap-4 px-5 py-5 md:border-r border-gray-800 overflow-y-auto">

          {/* Selected model indicator */}
          {state.selectedModel && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-800 bg-gray-900/60">
              <img
                src={state.selectedModel.images.main}
                alt={state.selectedModel.name}
                className="w-8 h-8 rounded-full object-cover border border-gray-700"
              />
              <span className="text-xs text-gray-400">Model:</span>
              <span className="text-xs text-gray-200 font-medium">{state.selectedModel.name}</span>
            </div>
          )}

          {/* Step tabs */}
          <StepTabs
            current={currentStep}
            onChange={setCurrentStep}
            garmentReady={isReadyToGenerate}
            modelReady={!!state.selectedModel}
          />

          {/* Step content */}
          <div className="flex-1">
            {currentStep === 'garment' && (
              <GarmentUpload
                slots={uploadState.slots}
                heroSlot={heroSlot}
                isProcessing={uploadState.isProcessing}
                error={uploadState.error}
                onUpload={uploadToSlot}
                onRemove={removeSlot}
                onSetHero={setHeroSlot}
                onAddExtra={addExtraImage}
                onRemoveExtra={removeExtraImage}
              />
            )}

            {currentStep === 'model' && (
              <ModelSelector
                selectedModel={state.selectedModel}
                onSelect={actions.setModel}
                isModelAvailable={isModelAvailable}
                plan={userPlan.plan}
              />
            )}
          </div>

          {/* Error */}
          {state.error && (
            <ErrorDisplay
              message={state.error.message}
              type={state.error.type}
              onRetry={handleGenerate}
            />
          )}

          {/* Generate button */}
          <GenerateButton
            status={state.status}
            canGenerate={canGenerate}
            progress={state.progress}
            onGenerate={handleGenerate}
            onReset={actions.reset}
          />
        </div>

        {/* ── Right panel (hidden on mobile until results exist) ── */}
        <div className="flex-1 flex items-start justify-center p-4 md:p-6 overflow-y-auto border-t md:border-t-0 border-gray-800">
          <div className="w-full max-w-2xl">
            <PreviewGrid results={state.results} modelName={state.selectedModel?.name} />
          </div>
        </div>
      </div>
    </div>
  );
}

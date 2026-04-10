/**
 * VideoStudioPage.tsx — LUMINA VIDEO STUDIO v2
 *
 * Format-based multi-clip pipeline.
 * Left: Format → Model → Timeline editor
 * Right: Preview grid of generated cuts
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVideoPipeline } from '../hooks/useVideoPipeline';
import { VideoModelSelector } from '../components/video/ModelSelector';
import { FormatSelector } from '../components/video/FormatSelector';
import { TimelineEditor } from '../components/video/TimelineEditor';
import { GarmentUpload } from '../components/video/GarmentUpload';
import { PreviewPanel } from '../components/video/PreviewPanel';
import { VOICE_MAP } from '../data/video/voiceMap';
import { COLOR_PRESETS } from '../data/video/colorPresets';
import type { AgencyModel } from '../data/agencyModels';
import type { FormatId } from '../types/video';

const API_KEY_STORAGE_KEY = 'lumina_gemini_api_key';

export default function VideoStudioPage() {
  const { user, signOut } = useAuth();
  const {
    timeline, isRunning, error,
    totalDuration, completedCuts, totalCuts,
    initTimeline, updateCut, moveCut, removeCut, setGarmentImage, setColorPreset,
    generateAIScript, isGeneratingScript, scriptStatus, scriptMeta,
    generate, reset,
  } = useVideoPipeline();

  const [selectedModel, setSelectedModel] = useState<AgencyModel | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<FormatId | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [narrationEnabled, setNarrationEnabled] = useState(false);
  const [creativeIntent, setCreativeIntent] = useState('');

  // API Key
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(API_KEY_STORAGE_KEY) ?? '');
  const [showApiKeyBar, setShowApiKeyBar] = useState<boolean>(() => !localStorage.getItem(API_KEY_STORAGE_KEY));
  const [apiKeyInput, setApiKeyInput] = useState<string>(() => localStorage.getItem(API_KEY_STORAGE_KEY) ?? '');

  function handleSaveApiKey() {
    const trimmed = apiKeyInput.trim();
    localStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
    setApiKey(trimmed);
    if (trimmed) setShowApiKeyBar(false);
  }

  function handleFormatSelect(formatId: FormatId) {
    setSelectedFormat(formatId);
    if (selectedModel) {
      initTimeline(formatId, selectedModel.id, aspectRatio);
    }
  }

  function handleModelSelect(model: AgencyModel) {
    setSelectedModel(model);
    if (selectedFormat) {
      initTimeline(selectedFormat, model.id, aspectRatio);
    }
  }

  function handleAspectRatioChange(ratio: '9:16' | '16:9' | '1:1') {
    setAspectRatio(ratio);
    if (selectedFormat && selectedModel) {
      initTimeline(selectedFormat, selectedModel.id, ratio);
    }
  }

  const canGenerate = timeline && timeline.cuts.length > 0 && apiKey && !isRunning;

  return (
    <div className="h-screen bg-[#050508] text-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold tracking-tight text-gray-100">LUMINA VIDEO STUDIO</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">v2</span>
        </div>
        <div className="flex items-center gap-3">
          {user && <span className="text-xs text-gray-600 hidden md:inline">{user.email}</span>}
          <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors tracking-wider">AGENCY</a>
          <a href="/studio" className="text-xs text-gray-500 hover:text-gray-300 transition-colors tracking-wider">STUDIO</a>
          <button type="button" onClick={() => setShowApiKeyBar(p => !p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-900 text-gray-400 text-xs font-medium hover:border-gray-600 hover:text-gray-200 transition-colors duration-200">API Key</button>
          <button type="button" onClick={signOut} className="px-3 py-1.5 rounded-lg border border-gray-800 text-gray-600 text-xs hover:text-gray-400 hover:border-gray-700 transition-colors duration-200">Logout</button>
        </div>
      </header>

      {/* API Key bar */}
      {showApiKeyBar && (
        <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-800 bg-gray-950 shrink-0">
          <label className="text-xs text-gray-400 whitespace-nowrap">Gemini API Key</label>
          <input
            type="password"
            value={apiKeyInput}
            onChange={e => setApiKeyInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSaveApiKey()}
            placeholder="AIza…"
            className="flex-1 rounded-lg bg-gray-900 border border-gray-800 px-3 py-1.5 text-xs text-gray-200 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none"
          />
          <button type="button" onClick={handleSaveApiKey} className="px-4 py-1.5 rounded-lg bg-cyan-500 text-gray-950 text-xs font-semibold hover:bg-cyan-400 transition-colors">Save</button>
        </div>
      )}

      {/* Main */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-[380px] border-r border-gray-800 overflow-y-auto p-4 space-y-5 shrink-0">
          {/* Format */}
          <FormatSelector selectedId={selectedFormat} onSelect={handleFormatSelect} />

          {/* Model */}
          <VideoModelSelector selectedId={selectedModel?.id ?? null} onSelect={handleModelSelect} />

          {/* Aspect Ratio */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 tracking-wider mb-1">ASPECT RATIO</label>
            <div className="flex gap-1">
              {(['9:16', '16:9', '1:1'] as const).map(r => (
                <button key={r} type="button" onClick={() => handleAspectRatioChange(r)}
                  className={`flex-1 px-2 py-1.5 rounded text-[10px] font-medium transition-colors ${
                    aspectRatio === r ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-gray-900 text-gray-500 border border-gray-800'
                  }`}>{r}</button>
              ))}
            </div>
          </div>

          {/* AI Script Generation */}
          {timeline && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 tracking-wider mb-2">
                AI SCRIPT
              </label>
              <textarea
                value={creativeIntent}
                onChange={e => setCreativeIntent(e.target.value)}
                placeholder="What do you want to create? (e.g. RINKAの朝支度GRWM、sacai×Dickies×Dr.Martensのストリートコーデ、下北沢ロケ)"
                rows={3}
                className="w-full rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-xs text-gray-200 placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none resize-none"
              />
              <button
                type="button"
                onClick={() => generateAIScript(creativeIntent, apiKey)}
                disabled={!creativeIntent.trim() || !apiKey || isGeneratingScript}
                className={`w-full mt-2 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 ${
                  creativeIntent.trim() && apiKey && !isGeneratingScript
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 hover:bg-purple-500/30'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                {isGeneratingScript ? (scriptStatus ?? 'Generating…') : 'Generate Script with AI'}
              </button>

              {/* Script meta */}
              {scriptMeta && (
                <div className="mt-2 rounded-lg border border-gray-800 bg-gray-900/50 p-2 space-y-1">
                  <p className="text-[10px] text-cyan-400 font-semibold">{scriptMeta.title}</p>
                  <p className="text-[10px] text-gray-500">BGM: {scriptMeta.bgm}</p>
                  <p className="text-[10px] text-gray-600 break-all">{scriptMeta.hashtags}</p>
                </div>
              )}
            </div>
          )}

          {/* Garment upload */}
          <GarmentUpload
            image={timeline?.garmentImage ?? null}
            onUpload={(img) => setGarmentImage(img)}
            onClear={() => setGarmentImage(undefined)}
            disabled={isRunning}
          />

          {/* Color Grading */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 tracking-wider mb-2">COLOR GRADE</label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PRESETS.map(preset => (
                <button key={preset.id} type="button" onClick={() => setColorPreset(preset.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                    (timeline?.colorPresetId ?? 'none') === preset.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : 'bg-gray-900 text-gray-500 border border-gray-800 hover:border-gray-600'
                  }`}>
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Narration toggle */}
          {selectedModel && (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-400 tracking-wider">NARRATION</span>
                {selectedModel && VOICE_MAP[selectedModel.id] && (
                  <span className="text-[10px] text-gray-600 ml-2">{VOICE_MAP[selectedModel.id].name}</span>
                )}
                {selectedModel && !VOICE_MAP[selectedModel.id] && (
                  <span className="text-[10px] text-gray-600 ml-2">No voice</span>
                )}
              </div>
              <button type="button" onClick={() => setNarrationEnabled(!narrationEnabled)}
                className={`w-8 h-4 rounded-full transition-colors duration-200 relative ${narrationEnabled ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${narrationEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
          )}

          {/* Timeline */}
          {timeline && (
            <TimelineEditor
              cuts={timeline.cuts}
              onUpdateCut={updateCut}
              onRemoveCut={removeCut}
              onMoveCut={moveCut}
              narrationEnabled={narrationEnabled && !!selectedModel && !!VOICE_MAP[selectedModel.id]}
              disabled={isRunning}
            />
          )}

          {/* Duration info */}
          {timeline && (
            <div className="text-[10px] text-gray-500">
              Total: {totalDuration}秒 / {totalCuts}カット
              {completedCuts > 0 && ` (${completedCuts} done)`}
            </div>
          )}

          {/* Generate */}
          <button type="button" onClick={() => generate(apiKey)} disabled={!canGenerate}
            className={`w-full py-3 rounded-lg text-sm font-semibold tracking-wider transition-all duration-200 ${
              canGenerate ? 'bg-cyan-500 text-gray-950 hover:bg-cyan-400 active:scale-[0.98]' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}>
            {isRunning ? `Generating ${completedCuts}/${totalCuts}…` : !apiKey ? 'Set API Key First' : !timeline ? 'Select Format & Model' : 'Generate All Cuts'}
          </button>

          {isRunning && (
            <button type="button" onClick={reset}
              className="w-full py-2 rounded-lg text-xs text-gray-500 border border-gray-800 hover:border-gray-700 hover:text-gray-400 transition-colors">Cancel</button>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col bg-[#030306]">
          <PreviewPanel
            cuts={timeline?.cuts ?? []}
            isRunning={isRunning}
            completedCuts={completedCuts}
            totalCuts={totalCuts}
            modelId={timeline?.modelId}
            formatId={timeline?.formatId}
          />
        </div>
      </main>
    </div>
  );
}

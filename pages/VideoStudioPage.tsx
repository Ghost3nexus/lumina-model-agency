/**
 * VideoStudioPage.tsx — LUMINA VIDEO STUDIO
 *
 * 3-step pipeline: Still Image → I2V Video → Narration
 * Layout mirrors GenerationPage: left panel (controls) + right panel (preview)
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVideoPipeline } from '../hooks/useVideoPipeline';
import { VideoModelSelector } from '../components/video/ModelSelector';
import { SceneConfigurator } from '../components/video/SceneConfigurator';
import { MotionSelector } from '../components/video/MotionSelector';
import { NarrationInput } from '../components/video/NarrationInput';
import { PipelineStatus } from '../components/video/PipelineStatus';
import { PreviewPanel } from '../components/video/PreviewPanel';
import { VOICE_MAP } from '../data/video/voiceMap';
import type { AgencyModel } from '../data/agencyModels';
import type { VideoGenerationRequest } from '../types/video';

export default function VideoStudioPage() {
  const { user, signOut } = useAuth();
  const { state, result, error, isRunning, generate, reset } = useVideoPipeline();

  // ── Local state ──
  const [selectedModel, setSelectedModel] = useState<AgencyModel | null>(null);
  const [scenePresetId, setScenePresetId] = useState('grwm');
  const [sceneCustomPrompt, setSceneCustomPrompt] = useState('');
  const [motionPresetId, setMotionPresetId] = useState('walk');
  const [motionCustomPrompt, setMotionCustomPrompt] = useState('');
  const [narrationEnabled, setNarrationEnabled] = useState(false);
  const [narrationText, setNarrationText] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [duration, setDuration] = useState<5 | 10>(5);

  const voice = selectedModel ? VOICE_MAP[selectedModel.id] : null;
  const canGenerate = selectedModel && !isRunning;

  function handleGenerate() {
    if (!selectedModel) return;

    const request: VideoGenerationRequest = {
      modelId: selectedModel.id,
      scene: {
        presetId: scenePresetId,
        customPrompt: sceneCustomPrompt || undefined,
      },
      motion: {
        presetId: motionPresetId,
        customPrompt: motionCustomPrompt || undefined,
      },
      duration,
      aspectRatio,
    };

    if (narrationEnabled && narrationText.trim() && voice) {
      request.narration = {
        text: narrationText.trim(),
        voiceId: voice.voiceId,
      };
    }

    generate(request);
  }

  return (
    <div className="h-screen bg-[#050508] text-gray-100 flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold tracking-tight text-gray-100">
            LUMINA VIDEO STUDIO
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
            Alpha
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-xs text-gray-600 hidden md:inline">{user.email}</span>
          )}
          <a
            href="/"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors tracking-wider"
          >
            AGENCY
          </a>
          <a
            href="/studio"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors tracking-wider"
          >
            STUDIO
          </a>
          <button
            type="button"
            onClick={signOut}
            className="px-3 py-1.5 rounded-lg border border-gray-800 text-gray-600 text-xs hover:text-gray-400 hover:border-gray-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex flex-1 overflow-hidden">
        {/* ── Left Panel: Controls ── */}
        <div className="w-[380px] border-r border-gray-800 overflow-y-auto p-4 space-y-5 shrink-0">
          {/* Model Selection */}
          <VideoModelSelector
            selectedId={selectedModel?.id ?? null}
            onSelect={setSelectedModel}
          />

          {/* Scene */}
          <SceneConfigurator
            selectedId={scenePresetId}
            customPrompt={sceneCustomPrompt}
            onSelectPreset={setScenePresetId}
            onCustomPromptChange={setSceneCustomPrompt}
          />

          {/* Motion */}
          <MotionSelector
            selectedId={motionPresetId}
            customPrompt={motionCustomPrompt}
            onSelectPreset={setMotionPresetId}
            onCustomPromptChange={setMotionCustomPrompt}
          />

          {/* Settings row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-semibold text-gray-500 tracking-wider mb-1">
                ASPECT RATIO
              </label>
              <div className="flex gap-1">
                {(['9:16', '16:9', '1:1'] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAspectRatio(r)}
                    className={`flex-1 px-2 py-1.5 rounded text-[10px] font-medium transition-colors ${
                      aspectRatio === r
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : 'bg-gray-900 text-gray-500 border border-gray-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-semibold text-gray-500 tracking-wider mb-1">
                DURATION
              </label>
              <div className="flex gap-1">
                {([5, 10] as const).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`flex-1 px-2 py-1.5 rounded text-[10px] font-medium transition-colors ${
                      duration === d
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : 'bg-gray-900 text-gray-500 border border-gray-800'
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Narration */}
          <NarrationInput
            modelId={selectedModel?.id ?? null}
            enabled={narrationEnabled}
            text={narrationText}
            onToggle={setNarrationEnabled}
            onTextChange={setNarrationText}
          />

          {/* Generate button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`w-full py-3 rounded-lg text-sm font-semibold tracking-wider transition-all duration-200 ${
              canGenerate
                ? 'bg-cyan-500 text-gray-950 hover:bg-cyan-400 active:scale-[0.98]'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {isRunning ? 'Generating…' : 'Generate Video'}
          </button>

          {isRunning && (
            <button
              type="button"
              onClick={reset}
              className="w-full py-2 rounded-lg text-xs text-gray-500 border border-gray-800 hover:border-gray-700 hover:text-gray-400 transition-colors"
            >
              Cancel
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Pipeline Status */}
          <PipelineStatus state={state} />
        </div>

        {/* ── Right Panel: Preview ── */}
        <div className="flex-1 flex flex-col bg-[#030306]">
          <PreviewPanel result={result} isRunning={isRunning} />
        </div>
      </main>
    </div>
  );
}

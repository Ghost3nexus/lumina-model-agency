/**
 * TestSeedancePage — Minimal Seedance 2.0 I2V verification page.
 *
 * Purpose: Validate output quality BEFORE pipeline integration.
 * Access: /test/seedance (protected — uses VITE_RUNWAY_API_KEY).
 *
 * Flow: upload image → write prompt → generate → watch video.
 */

import { useState } from 'react';
import { generateVideo, type SeedanceResult } from '../services/video/seedanceService';
import { VIDEO_PRESETS, type VideoPreset } from '../data/videoPresets';

type AspectRatio = '16:9' | '9:16' | '1:1';

interface LogEntry {
  ts: string;
  message: string;
}

export default function TestSeedancePage() {
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [imageName, setImageName] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [duration, setDuration] = useState<number>(8);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string>('idle');
  const [result, setResult] = useState<SeedanceResult | null>(null);
  const [error, setError] = useState<string>('');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const hasKey = Boolean(import.meta.env.VITE_RUNWAY_API_KEY);

  function addLog(message: string) {
    const ts = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    setLogs(prev => [...prev, { ts, message }]);
  }

  async function loadPreset(preset: VideoPreset) {
    setError('');
    setPrompt(preset.prompt);
    setDuration(preset.duration);
    setAspectRatio(preset.aspectRatio);
    setImageName(`${preset.modelDisplayName} (${preset.sourceImagePath})`);

    try {
      const resp = await fetch(preset.sourceImagePath);
      if (!resp.ok) throw new Error(`Failed to load source image: ${resp.status}`);
      const blob = await resp.blob();
      const reader = new FileReader();
      reader.onload = () => setImageDataUrl(reader.result as string);
      reader.readAsDataURL(blob);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load preset image');
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
      setImageName(file.name);
      setError('');
    };
    reader.readAsDataURL(file);
  }

  async function handleGenerate() {
    if (!imageDataUrl) {
      setError('Upload a source image first');
      return;
    }
    if (!prompt.trim()) {
      setError('Write a prompt');
      return;
    }

    setIsGenerating(true);
    setStatus('submitting');
    setResult(null);
    setError('');
    setLogs([]);
    addLog(`Submitting to Seedance 2.0 (model=seedance2, duration=${duration}s, ratio=${aspectRatio})`);

    const startedAt = Date.now();
    try {
      const out = await generateVideo(
        {
          startImage: imageDataUrl,
          prompt: prompt.trim(),
          duration,
          aspectRatio,
        },
        (s) => {
          setStatus(s);
          addLog(`status: ${s}`);
        },
      );
      const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
      setResult(out);
      setStatus('done');
      addLog(`Done in ${seconds}s. taskId=${out.taskId}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      setStatus('error');
      addLog(`ERROR: ${msg}`);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] text-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-[#1A1A2E]">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Test Lab</div>
          <h1 className="text-3xl font-semibold">Seedance 2.0 — Verification</h1>
          <p className="text-sm text-gray-500 mt-2">
            Runway · model=<code className="text-cyan-400">seedance2</code> · cinematic I2V
          </p>
          {!hasKey && (
            <div className="mt-4 rounded border border-amber-700/50 bg-amber-950/20 px-4 py-3 text-sm text-amber-300">
              ⚠ <code>VITE_RUNWAY_API_KEY</code> is not set in <code>.env</code>. Add it and reload.
            </div>
          )}
        </div>

        {/* Preset loader */}
        <section className="mb-8">
          <label className="text-xs uppercase tracking-wider text-gray-400 mb-3 block">
            Hero presets (movie-referenced)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {VIDEO_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                disabled={isGenerating}
                className="text-left rounded border border-[#1A1A2E] bg-[#0A0A0F] px-4 py-3 hover:border-cyan-500/50 disabled:opacity-50 transition-colors"
              >
                <div className="text-sm font-semibold text-gray-100">{p.modelDisplayName}</div>
                <div className="text-[11px] text-gray-500 mt-1">
                  {p.filmReferences.join(' · ')}
                </div>
                <div className="text-[10px] text-gray-600 mt-1">
                  {p.duration}s · {p.aspectRatio}
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <div className="space-y-6">
            {/* Image upload */}
            <section>
              <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">
                1. Source image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isGenerating}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:text-xs file:uppercase file:tracking-wider file:bg-[#0A0A0F] file:text-gray-200 file:border file:border-[#1A1A2E] hover:file:bg-[#1A1A2E] cursor-pointer"
                />
              </div>
              {imageDataUrl && (
                <div className="mt-3 rounded border border-[#1A1A2E] overflow-hidden">
                  <img src={imageDataUrl} alt={imageName} className="w-full h-auto max-h-64 object-contain bg-black" />
                  <div className="px-3 py-2 text-xs text-gray-500 bg-[#0A0A0F]">{imageName}</div>
                </div>
              )}
            </section>

            {/* Prompt */}
            <section>
              <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">
                2. Cinematic prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
                rows={8}
                placeholder="Describe camera work, lighting, motion, film references (e.g. Rumble Fish b&w, Arri Alexa 35mm)..."
                className="w-full rounded bg-[#0A0A0F] border border-[#1A1A2E] px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
              />
              <div className="mt-1 text-[11px] text-gray-600">{prompt.length} chars</div>
            </section>

            {/* Params */}
            <section className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">
                  Duration (s)
                </label>
                <input
                  type="number"
                  min={4}
                  max={15}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  disabled={isGenerating}
                  className="w-full rounded bg-[#0A0A0F] border border-[#1A1A2E] px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">
                  Aspect ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  disabled={isGenerating}
                  className="w-full rounded bg-[#0A0A0F] border border-[#1A1A2E] px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="16:9">16:9 (1920×1080)</option>
                  <option value="9:16">9:16 (1080×1920)</option>
                  <option value="1:1">1:1 (1080×1080)</option>
                </select>
              </div>
            </section>

            {/* Generate */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !hasKey}
              className="w-full py-3 rounded bg-gray-100 text-gray-950 text-sm font-semibold tracking-wide uppercase hover:bg-cyan-400 hover:text-gray-950 disabled:bg-[#1A1A2E] disabled:text-gray-600 transition-colors"
            >
              {isGenerating ? `Generating — ${status}` : 'Generate'}
            </button>

            <div className="text-[11px] text-gray-600">
              Est. cost: ${(duration * 0.13).toFixed(2)} · Timeout: 10 min
            </div>
          </div>

          {/* Right: Output */}
          <div className="space-y-6">
            <section>
              <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">
                Result
              </label>
              <div className="aspect-video rounded border border-[#1A1A2E] bg-black flex items-center justify-center overflow-hidden">
                {result ? (
                  <video
                    src={result.videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-xs text-gray-600 uppercase tracking-widest">
                    {isGenerating ? status : 'No video yet'}
                  </div>
                )}
              </div>
              {result && (
                <div className="mt-2 text-[11px] text-gray-600 break-all">
                  <div>taskId: {result.taskId}</div>
                  <div>
                    url: <a href={result.videoUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{result.videoUrl}</a>
                  </div>
                </div>
              )}
            </section>

            {error && (
              <div className="rounded border border-red-900/60 bg-red-950/20 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Logs */}
            {logs.length > 0 && (
              <section>
                <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">
                  Log
                </label>
                <div className="rounded border border-[#1A1A2E] bg-[#0A0A0F] p-3 text-[11px] font-mono text-gray-400 max-h-64 overflow-y-auto">
                  {logs.map((l, i) => (
                    <div key={i}>
                      <span className="text-gray-600">{l.ts}</span>{' '}
                      <span>{l.message}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

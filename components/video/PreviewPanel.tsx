/**
 * PreviewPanel.tsx — Still image / video / audio preview + download
 */

import type { VideoGenerationResult } from '../../types/video';

interface Props {
  result: VideoGenerationResult | null;
  isRunning: boolean;
}

export function PreviewPanel({ result, isRunning }: Props) {
  if (isRunning && !result) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-6 h-6 animate-spin text-cyan-500" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="text-xs text-gray-500">Generating…</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl text-gray-800 mb-2">&#9654;</div>
          <p className="text-xs text-gray-600">Select a model and scene to start</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto">
      {/* Still image */}
      {result.stillImage && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-gray-500 tracking-wider">STILL</span>
            <a
              href={result.stillImage}
              download={`still-${result.metadata.modelId}-${Date.now()}.png`}
              className="text-[10px] text-cyan-400 hover:text-cyan-300"
            >
              Download
            </a>
          </div>
          <img
            src={result.stillImage}
            alt="Generated still"
            className="w-full rounded-lg border border-gray-800"
          />
        </div>
      )}

      {/* Video */}
      {result.videoUrl && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-gray-500 tracking-wider">VIDEO</span>
            <a
              href={result.videoUrl}
              download={`video-${result.metadata.modelId}-${Date.now()}.mp4`}
              className="text-[10px] text-cyan-400 hover:text-cyan-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </div>
          <video
            src={result.videoUrl}
            controls
            autoPlay
            loop
            muted
            className="w-full rounded-lg border border-gray-800"
          />
        </div>
      )}

      {/* Audio */}
      {result.audioUrl && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-gray-500 tracking-wider">NARRATION</span>
            <a
              href={result.audioUrl}
              download={`narration-${result.metadata.modelId}-${Date.now()}.mp3`}
              className="text-[10px] text-cyan-400 hover:text-cyan-300"
            >
              Download
            </a>
          </div>
          <audio src={result.audioUrl} controls className="w-full" />
        </div>
      )}

      {/* Metadata */}
      <div className="text-[10px] text-gray-600 space-y-0.5">
        <p>Model: {result.metadata.modelId} | Duration: {result.metadata.duration}s | Ratio: {result.metadata.aspectRatio}</p>
        <p>Generated: {new Date(result.metadata.generatedAt).toLocaleString('ja-JP')}</p>
      </div>
    </div>
  );
}

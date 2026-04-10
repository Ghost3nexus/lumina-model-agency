/**
 * PreviewPanel.tsx — Timeline preview: shows generated stills and videos
 */

import { useState } from 'react';
import { downloadTimelineZip } from '../../services/video/downloadPack';
import type { TimelineCut } from '../../types/video';

interface Props {
  cuts: TimelineCut[];
  isRunning: boolean;
  completedCuts: number;
  totalCuts: number;
  modelId?: string;
  formatId?: string;
}

export function PreviewPanel({ cuts, isRunning, completedCuts, totalCuts, modelId, formatId }: Props) {
  const [downloading, setDownloading] = useState(false);
  const doneCuts = cuts.filter(c => c.stillImage || c.videoUrl);

  async function handleDownloadAll() {
    if (!modelId || !formatId) return;
    setDownloading(true);
    try {
      await downloadTimelineZip(cuts, modelId, formatId);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  }

  if (isRunning && doneCuts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-6 h-6 animate-spin text-cyan-500" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="text-xs text-gray-500">Generating cut 1/{totalCuts}…</span>
        </div>
      </div>
    );
  }

  if (doneCuts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl text-gray-800 mb-2">&#9654;</div>
          <p className="text-xs text-gray-600">Select format and model to start</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* Progress bar */}
      {isRunning && (
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-500">Progress</span>
            <span className="text-[10px] text-cyan-400">{completedCuts}/{totalCuts}</span>
          </div>
          <div className="w-full h-1 bg-gray-800 rounded-full">
            <div
              className="h-1 bg-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCuts / totalCuts) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Download all button */}
      {doneCuts.length > 0 && !isRunning && (
        <div className="px-4 pt-3">
          <button
            type="button"
            onClick={handleDownloadAll}
            disabled={downloading}
            className="w-full py-2 rounded-lg text-xs font-semibold tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25 transition-colors disabled:opacity-50"
          >
            {downloading ? 'Packing ZIP…' : `Download All (${doneCuts.length} cuts)`}
          </button>
        </div>
      )}

      {/* Cuts grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {cuts.map((cut, idx) => (
          <div key={cut.id} className="rounded-lg border border-gray-800 overflow-hidden bg-gray-900/50">
            {/* Thumbnail */}
            {cut.videoUrl ? (
              <video
                src={cut.videoUrl}
                controls
                muted
                loop
                className="w-full aspect-video object-cover"
              />
            ) : cut.stillImage ? (
              <img
                src={cut.stillImage}
                alt={cut.label}
                className="w-full aspect-video object-cover"
              />
            ) : (
              <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
                {cut.status === 'generating-still' || cut.status === 'generating-video' ? (
                  <svg className="w-4 h-4 animate-spin text-cyan-500" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : cut.status === 'error' ? (
                  <span className="text-red-400 text-xs">Error</span>
                ) : (
                  <span className="text-gray-700 text-xs">{idx + 1}</span>
                )}
              </div>
            )}

            {/* Label */}
            <div className="px-2 py-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 truncate">{idx + 1}. {cut.label}</span>
                <span className="text-[10px] text-gray-600">{cut.duration}s</span>
              </div>
              {/* Download links */}
              {(cut.stillImage || cut.videoUrl) && (
                <div className="flex gap-2 mt-1">
                  {cut.stillImage && (
                    <a href={cut.stillImage} download={`cut-${idx + 1}-still.png`} className="text-[9px] text-cyan-400 hover:text-cyan-300">Still</a>
                  )}
                  {cut.videoUrl && (
                    <a href={cut.videoUrl} download={`cut-${idx + 1}.mp4`} target="_blank" rel="noopener noreferrer" className="text-[9px] text-cyan-400 hover:text-cyan-300">Video</a>
                  )}
                  {cut.audioUrl && (
                    <a href={cut.audioUrl} download={`cut-${idx + 1}-audio.mp3`} className="text-[9px] text-cyan-400 hover:text-cyan-300">Audio</a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * PreviewGrid.tsx — 2x2 grid showing 4 angle results
 *
 * Slots: front / back / side / bust
 * Each slot shows status: pending / generating / complete / error
 */

import { useCallback, useState } from 'react';
import JSZip from 'jszip';
import type { AngleType, PreviewResult, ResultKey } from '../../types/generation';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PreviewGridProps {
  results: Partial<Record<ResultKey, PreviewResult>>;
  modelName?: string;
  heroSlot?: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makePendingResult(angle: AngleType): PreviewResult {
  return {
    id: `${angle}-placeholder`,
    angle,
    imageUrl: '',
    status: 'pending',
    retryCount: 0,
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ANGLE_LABELS: Record<AngleType, string> = {
  front: 'Front',
  back:  'Back',
  side:  'Side',
  bust:  'Bust',
};

const BOTTOM_HERO_SLOTS = new Set(['pants', 'skirt']);

function getAngleLabel(angle: AngleType, heroSlot?: string | null): string {
  if (angle === 'bust' && heroSlot && BOTTOM_HERO_SLOTS.has(heroSlot)) {
    return 'Detail';
  }
  return ANGLE_LABELS[angle];
}

const ANGLE_ORDER: AngleType[] = ['front', 'back', 'side', 'bust'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="w-6 h-6 animate-spin text-cyan-500"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="生成中"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 1v8M4 7l3 3 3-3M2 11h10" />
    </svg>
  );
}

// ─── Single slot ──────────────────────────────────────────────────────────────

interface SlotProps {
  angle: AngleType;
  result: PreviewResult;
  heroSlot?: string | null;
}

function PreviewSlot({ angle, result, heroSlot }: SlotProps) {
  const label = getAngleLabel(angle, heroSlot);
  const isWorking = result.status === 'generating' || result.status === 'checking' || result.status === 'retrying';
  const isComplete = result.status === 'complete';
  const isError    = result.status === 'error';
  const isPending  = result.status === 'pending';

  function handleDownload() {
    if (!result.imageUrl) return;
    const a = document.createElement('a');
    a.href = result.imageUrl;
    a.download = `lumina-${angle}.png`;
    a.click();
  }

  return (
    <div className="relative flex items-center justify-center aspect-[3/4] rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
      {/* Label badge */}
      <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded bg-gray-900/70 text-gray-400 text-[10px] font-medium leading-none">
        {label}
      </span>

      {/* States */}
      {isPending && (
        <span className="text-xs text-gray-600">待機中</span>
      )}

      {isWorking && (
        <div className="flex flex-col items-center gap-2">
          <Spinner />
          <span className="text-[11px] text-gray-500">
            {result.status === 'retrying' ? '再試行中...' : '生成中...'}
          </span>
        </div>
      )}

      {isComplete && result.imageUrl && (
        <>
          <img
            src={result.imageUrl}
            alt={`${label} view`}
            className="w-full h-full object-contain"
          />
          {/* QA warning badge */}
          {result.qualityScore !== undefined && result.qualityScore < 85 && (
            <span className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-medium leading-none">
              QA {result.qualityScore}
            </span>
          )}
          {/* Download button */}
          <button
            type="button"
            onClick={handleDownload}
            className="absolute bottom-2 right-2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-gray-900/80 border border-gray-700 text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors duration-200"
            aria-label={`${label}をダウンロード`}
          >
            <DownloadIcon />
          </button>
        </>
      )}

      {isError && (
        <p className="text-xs text-red-400 px-3 text-center">
          {result.qualityIssues?.[0] ?? '生成に失敗しました'}
        </p>
      )}
    </div>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

export function PreviewGrid({ results, modelName, heroSlot }: PreviewGridProps) {
  const [zipping, setZipping] = useState(false);

  const completedImages = ANGLE_ORDER.filter(
    a => results[a]?.status === 'complete' && results[a]?.imageUrl,
  );
  const canZip = completedImages.length >= 2;

  const handleZipDownload = useCallback(async () => {
    if (!canZip) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      for (const angle of completedImages) {
        const dataUrl = results[angle]?.imageUrl;
        if (!dataUrl) continue;
        // Extract base64 data from data URL
        const base64 = dataUrl.split(',')[1];
        if (base64) {
          zip.file(`lumina-${angle}.png`, base64, { base64: true });
        }
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ts = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');
      const name = modelName ? modelName.toLowerCase().replace(/\s+/g, '-') : 'photos';
      a.download = `lumina-${name}-${ts}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setZipping(false);
    }
  }, [canZip, completedImages, results]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {ANGLE_ORDER.map(angle => {
          const result = results[angle] ?? makePendingResult(angle);
          return <PreviewSlot key={angle} angle={angle} result={result} heroSlot={heroSlot} />;
        })}
      </div>
      {canZip && (
        <button
          type="button"
          onClick={handleZipDownload}
          disabled={zipping}
          className="w-full py-2.5 rounded-lg border border-gray-700 bg-gray-900 text-gray-300 text-sm font-medium hover:bg-gray-800 hover:text-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <DownloadIcon />
          {zipping ? 'ZIP作成中...' : `${completedImages.length}枚をZIPダウンロード${modelName ? ` (${modelName})` : ''}`}
        </button>
      )}
    </div>
  );
}

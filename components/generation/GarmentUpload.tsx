/**
 * GarmentUpload.tsx — Multi-slot outfit upload UI
 *
 * Shows slots grouped into "coordinate (required)" and "accessory (optional)" sections.
 * Each slot: emoji + label + thumbnail (if filled) + upload/remove controls.
 */

import { useRef, useCallback } from 'react';
import type { OutfitSlot, SlotUpload } from '../../types/garment';
import { SLOT_META, isOutfitReady } from '../../types/garment';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GarmentUploadProps {
  slots: Partial<Record<OutfitSlot, SlotUpload>>;
  heroSlot: OutfitSlot | null;
  isProcessing: OutfitSlot | null;
  error: string | null;
  onUpload: (slot: OutfitSlot, file: File) => void;
  onRemove: (slot: OutfitSlot) => void;
  onSetHero: (slot: OutfitSlot) => void;
  onAddExtra: (slot: OutfitSlot, file: File) => void;
  onRemoveExtra: (slot: OutfitSlot, index: number) => void;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="w-4 h-4 animate-spin text-cyan-500"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
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

// ─── Slot Row ─────────────────────────────────────────────────────────────────

interface SlotRowProps {
  slot: OutfitSlot;
  label: string;
  emoji: string;
  upload: SlotUpload | undefined;
  isHero: boolean;
  isProcessing: boolean;
  isRequired: boolean;
  onUpload: (slot: OutfitSlot, file: File) => void;
  onRemove: (slot: OutfitSlot) => void;
  onSetHero: (slot: OutfitSlot) => void;
  onAddExtra: (slot: OutfitSlot, file: File) => void;
  onRemoveExtra: (slot: OutfitSlot, index: number) => void;
}

function SlotRow({ slot, label, emoji, upload, isHero, isProcessing, isRequired, onUpload, onRemove, onSetHero, onAddExtra, onRemoveExtra }: SlotRowProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const extraInputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUpload(slot, file);
        e.target.value = '';
      }
    },
    [slot, onUpload],
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove(slot);
    },
    [slot, onRemove],
  );

  const handleExtraChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onAddExtra(slot, file);
        e.target.value = '';
      }
    },
    [slot, onAddExtra],
  );

  const extraCount = upload?.extraImages?.length ?? 0;
  const totalImages = upload ? 1 + extraCount : 0;

  // ── Filled slot ──
  if (upload) {
    return (
      <div className={`flex flex-col gap-1.5 px-3 py-2 rounded-lg border bg-gray-900/60 ${
        isHero ? 'border-amber-500/60 bg-amber-500/5' : 'border-gray-700'
      }`}>
        {/* Main row */}
        <div className="flex items-center gap-3">
          {/* Thumbnail */}
          <img
            src={upload.preview}
            alt={label}
            className="w-10 h-10 rounded object-cover border border-gray-700 shrink-0"
          />
          {/* Label */}
          <div className="flex-1 min-w-0">
            <span className="text-sm text-gray-200 truncate block">
              {emoji} {label}
            </span>
            <span className="text-[10px] text-gray-500">
              {totalImages > 1 ? `${totalImages}枚` : '1枚'}
              {isHero && <span className="text-amber-400 font-medium ml-1.5">主役</span>}
            </span>
          </div>
          {/* Hero toggle */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSetHero(slot); }}
            className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-200 shrink-0 ${
              isHero
                ? 'bg-amber-500 text-black'
                : 'bg-gray-800 border border-gray-700 text-gray-600 hover:text-amber-400 hover:border-amber-500/40'
            }`}
            aria-label={`${label}を主役に設定`}
            title="主役アイテムに設定"
          >
            <span className="text-xs">★</span>
          </button>
          {/* Remove */}
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 border border-gray-700 text-gray-500 hover:text-red-400 hover:border-red-500/40 transition-colors duration-200 shrink-0"
            aria-label={`${label}を削除`}
          >
            <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {/* Extra images row */}
        <div className="flex items-center gap-1.5 pl-1">
          {upload.extraImages.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img.preview}
                alt={`${label} extra ${i + 1}`}
                className="w-8 h-8 rounded object-cover border border-gray-700"
              />
              <button
                type="button"
                onClick={() => onRemoveExtra(slot, i)}
                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gray-900 border border-gray-600 text-gray-400 hover:text-red-400 text-[8px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="削除"
              >
                x
              </button>
            </div>
          ))}
          {/* Add extra button (max 4 extras) */}
          {extraCount < 4 && (
            <button
              type="button"
              onClick={() => extraInputRef.current?.click()}
              className="w-8 h-8 rounded border border-dashed border-gray-700 hover:border-cyan-500/50 flex items-center justify-center text-gray-600 hover:text-cyan-400 transition-colors"
              title="別アングルを追加（再現性UP）"
            >
              <span className="text-sm leading-none">+</span>
            </button>
          )}
          {extraCount === 0 && (
            <span className="text-[10px] text-gray-600 ml-1">別アングル追加で再現性UP</span>
          )}
          <input
            ref={extraInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleExtraChange}
          />
        </div>
      </div>
    );
  }

  // ── Processing slot ──
  if (isProcessing) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-cyan-500/30 bg-gray-900/60">
        <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center shrink-0">
          <Spinner />
        </div>
        <span className="text-sm text-gray-400">{emoji} {label} - 処理中...</span>
      </div>
    );
  }

  // ── Empty slot ──
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg border border-dashed transition-colors duration-200 w-full text-left ${
        isRequired
          ? 'border-gray-600 hover:border-cyan-500/60 hover:bg-gray-900/60'
          : 'border-gray-800 hover:border-gray-600 hover:bg-gray-900/40'
      }`}
    >
      <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${
        isRequired ? 'bg-gray-800/80' : 'bg-gray-900/40'
      }`}>
        <span className="text-lg">{emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-sm truncate block ${isRequired ? 'text-gray-400' : 'text-gray-600'}`}>
          {label}
        </span>
        <span className={`text-xs ${isRequired ? 'text-gray-600' : 'text-gray-700'}`}>
          + アップロード
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleChange}
      />
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GarmentUpload({ slots, heroSlot, isProcessing, error, onUpload, onRemove, onSetHero, onAddExtra, onRemoveExtra }: GarmentUploadProps) {
  const coordinateSlots = SLOT_META.filter(m => m.group === 'coordinate');
  const accessorySlots = SLOT_META.filter(m => m.group === 'accessory');
  const ready = isOutfitReady(slots);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ── Coordinate section (required) ── */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          コーディネート（必須）
        </h3>
        <div className="flex flex-col gap-1.5">
          {coordinateSlots.map(meta => (
            <SlotRow
              key={meta.slot}
              slot={meta.slot}
              label={meta.label}
              emoji={meta.emoji}
              upload={slots[meta.slot]}
              isHero={heroSlot === meta.slot}
              isProcessing={isProcessing === meta.slot}
              isRequired={true}
              onUpload={onUpload}
              onRemove={onRemove}
              onSetHero={onSetHero}
              onAddExtra={onAddExtra}
              onRemoveExtra={onRemoveExtra}
            />
          ))}
        </div>
      </div>

      {/* ── Accessory section (optional) ── */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          アクセサリー（任意）
        </h3>
        <div className="flex flex-col gap-1.5">
          {accessorySlots.map(meta => (
            <SlotRow
              key={meta.slot}
              slot={meta.slot}
              label={meta.label}
              emoji={meta.emoji}
              upload={slots[meta.slot]}
              isHero={heroSlot === meta.slot}
              isProcessing={isProcessing === meta.slot}
              isRequired={false}
              onUpload={onUpload}
              onRemove={onRemove}
              onSetHero={onSetHero}
              onAddExtra={onAddExtra}
              onRemoveExtra={onRemoveExtra}
            />
          ))}
        </div>
      </div>

      {/* ── Ready indicator / hint ── */}
      {ready ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-green-500/30 bg-green-500/5">
          <svg className="w-4 h-4 text-green-400 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs text-green-400 font-medium">コーディネート完了</span>
        </div>
      ) : (
        <div className="px-3 py-2 rounded-lg border border-gray-800 bg-gray-900/40">
          <span className="text-xs text-gray-500">
            トップス + ボトムス、またはドレス単体をアップロードしてください
          </span>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

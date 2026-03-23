/**
 * useGarmentUpload.ts — Multi-slot garment upload handler
 *
 * Manages multiple outfit slot uploads (tops, pants, dress, shoes, etc.)
 * Accepts: JPG, PNG, WebP only. Max size: 20 MB per file.
 *
 * Returns: { state, uploadToSlot, removeSlot, clear, isReadyToGenerate }
 */

import { useState, useCallback, useMemo } from 'react';
import { compressImage } from '../services/geminiClient';
import type { OutfitSlot, SlotUpload } from '../types/garment';
import { isOutfitReady } from '../types/garment';

// ─── Types ────────────────────────────────────────────────────────────────────

/** @deprecated — kept for backward compatibility with GarmentUpload component */
export interface UploadState {
  preview: string | null;
  compressed: string | null;
  error: string | null;
  isProcessing: boolean;
}

export interface MultiUploadState {
  slots: Partial<Record<OutfitSlot, SlotUpload>>;
  error: string | null;
  isProcessing: OutfitSlot | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCEPTED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGarmentUpload() {
  const [state, setState] = useState<MultiUploadState>({
    slots: {},
    error: null,
    isProcessing: null,
  });

  // ── Upload to a specific slot ───────────────────────────────────────────────

  const uploadToSlot = useCallback(async (slot: OutfitSlot, file: File) => {
    // Validate MIME type
    if (!ACCEPTED_MIME_TYPES.has(file.type)) {
      setState(prev => ({
        ...prev,
        error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.',
        isProcessing: null,
      }));
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setState(prev => ({
        ...prev,
        error: `File is too large. Maximum size is 20 MB (got ${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
        isProcessing: null,
      }));
      return;
    }

    setState(prev => ({ ...prev, isProcessing: slot, error: null }));

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const compressedDataUrl = await compressImage(dataUrl);

      const slotUpload: SlotUpload = {
        slot,
        preview: dataUrl,
        compressed: compressedDataUrl,
        extraImages: [],
      };

      setState(prev => ({
        ...prev,
        slots: { ...prev.slots, [slot]: slotUpload },
        error: null,
        isProcessing: null,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to process image.',
        isProcessing: null,
      }));
    }
  }, []);

  // ── Add extra image to an existing slot ─────────────────────────────────────

  const addExtraImage = useCallback(async (slot: OutfitSlot, file: File) => {
    if (!ACCEPTED_MIME_TYPES.has(file.type)) {
      setState(prev => ({ ...prev, error: 'Invalid file type. JPG, PNG, or WebP only.' }));
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setState(prev => ({ ...prev, error: 'File too large (max 20 MB).' }));
      return;
    }

    setState(prev => ({ ...prev, isProcessing: slot, error: null }));

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const compressedDataUrl = await compressImage(dataUrl);

      setState(prev => {
        const existing = prev.slots[slot];
        if (!existing) return prev;
        const updated: SlotUpload = {
          ...existing,
          extraImages: [...existing.extraImages, { preview: dataUrl, compressed: compressedDataUrl }],
        };
        return { ...prev, slots: { ...prev.slots, [slot]: updated }, isProcessing: null, error: null };
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to process image.',
        isProcessing: null,
      }));
    }
  }, []);

  // ── Remove extra image from a slot ─────────────────────────────────────────

  const removeExtraImage = useCallback((slot: OutfitSlot, index: number) => {
    setState(prev => {
      const existing = prev.slots[slot];
      if (!existing) return prev;
      const updated: SlotUpload = {
        ...existing,
        extraImages: existing.extraImages.filter((_, i) => i !== index),
      };
      return { ...prev, slots: { ...prev.slots, [slot]: updated } };
    });
  }, []);

  // ── Remove a slot ───────────────────────────────────────────────────────────

  const removeSlot = useCallback((slot: OutfitSlot) => {
    setState(prev => {
      const newSlots = { ...prev.slots };
      delete newSlots[slot];
      return { ...prev, slots: newSlots, error: null };
    });
  }, []);

  // ── Clear all ───────────────────────────────────────────────────────────────

  const clear = useCallback(() => {
    setState({ slots: {}, error: null, isProcessing: null });
  }, []);

  // ── Computed readiness ──────────────────────────────────────────────────────

  const isReadyToGenerate = useMemo(() => isOutfitReady(state.slots), [state.slots]);

  return {
    state,
    uploadToSlot,
    addExtraImage,
    removeExtraImage,
    removeSlot,
    clear,
    isReadyToGenerate,
  };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('FileReader returned unexpected result type'));
      }
    };
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

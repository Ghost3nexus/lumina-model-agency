/**
 * GarmentUpload.tsx — Single garment image upload for Video Studio
 *
 * Simpler than Studio's multi-slot system. One image, applied to all cuts.
 */

import { useCallback, useRef } from 'react';
import { compressImage } from '../../services/geminiClient';

interface Props {
  image: string | null; // base64 data URL
  onUpload: (base64: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

const ACCEPTED = '.jpg,.jpeg,.png,.webp';
const MAX_SIZE = 20 * 1024 * 1024;

export function GarmentUpload({ image, onUpload, onClear, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (file.size > MAX_SIZE) return;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Read failed'));
      reader.readAsDataURL(file);
    });
    const compressed = await compressImage(dataUrl);
    onUpload(compressed);
  }, [onUpload]);

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 tracking-wider mb-2">
        GARMENT IMAGE <span className="text-gray-600 font-normal">(optional)</span>
      </label>

      {image ? (
        <div className="relative rounded-lg border border-gray-800 overflow-hidden">
          <img src={image} alt="Garment" className="w-full h-24 object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-gray-400 text-xs hover:text-white flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="w-full py-3 rounded-lg border border-dashed border-gray-700 bg-gray-900/50 text-xs text-gray-500 hover:border-gray-600 hover:text-gray-400 transition-colors disabled:opacity-40"
        >
          + Upload product image
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

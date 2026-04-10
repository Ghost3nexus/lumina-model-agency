/**
 * downloadPack.ts — Bundle all timeline clips into a downloadable ZIP
 *
 * Includes: stills (PNG), videos (MP4), audio (MP3), and a manifest.
 */

import JSZip from 'jszip';
import type { TimelineCut } from '../../types/video';

/**
 * Download all generated assets as a ZIP file.
 */
export async function downloadTimelineZip(
  cuts: TimelineCut[],
  modelId: string,
  formatId: string,
): Promise<void> {
  const zip = new JSZip();
  const timestamp = new Date().toISOString().slice(0, 10);
  const folderName = `${modelId}-${formatId}-${timestamp}`;
  const folder = zip.folder(folderName)!;

  const doneCuts = cuts.filter(c => c.stillImage || c.videoUrl);
  if (doneCuts.length === 0) throw new Error('No generated assets to download');

  // Add each cut's assets
  for (let i = 0; i < cuts.length; i++) {
    const cut = cuts[i];
    const prefix = String(i + 1).padStart(2, '0');
    const label = cut.label.replace(/[^a-zA-Z0-9\u3000-\u9FFF]/g, '-').slice(0, 30);

    // Still image (base64 → blob)
    if (cut.stillImage) {
      const stillBlob = base64ToBlob(cut.stillImage);
      folder.file(`${prefix}-${label}-still.png`, stillBlob);
    }

    // Video (fetch URL → blob)
    if (cut.videoUrl) {
      try {
        const resp = await fetch(cut.videoUrl);
        const blob = await resp.blob();
        folder.file(`${prefix}-${label}.mp4`, blob);
      } catch {
        // Skip if video URL expired
      }
    }

    // Audio (blob URL → fetch)
    if (cut.audioUrl) {
      try {
        const resp = await fetch(cut.audioUrl);
        const blob = await resp.blob();
        folder.file(`${prefix}-${label}-narration.mp3`, blob);
      } catch {
        // Skip if audio blob revoked
      }
    }
  }

  // Add manifest
  const manifest = buildManifest(cuts, modelId, formatId);
  folder.file('manifest.json', JSON.stringify(manifest, null, 2));

  // Add editing notes
  const editingNotes = buildEditingNotes(cuts);
  folder.file('editing-notes.md', editingNotes);

  // Generate and download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function base64ToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/data:(.*?);/)?.[1] ?? 'image/png';
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

function buildManifest(cuts: TimelineCut[], modelId: string, formatId: string) {
  return {
    model: modelId,
    format: formatId,
    generatedAt: new Date().toISOString(),
    totalDuration: cuts.reduce((s, c) => s + c.duration, 0),
    cuts: cuts.map((c, i) => ({
      index: i + 1,
      label: c.label,
      role: c.role,
      duration: c.duration,
      motionId: c.motionId,
      textOverlay: c.textOverlay || null,
      narration: c.narrationText || null,
      hasStill: !!c.stillImage,
      hasVideo: !!c.videoUrl,
      hasAudio: !!c.audioUrl,
    })),
  };
}

function buildEditingNotes(cuts: TimelineCut[]): string {
  const lines = [
    '# Editing Notes',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Total: ${cuts.length} cuts / ${cuts.reduce((s, c) => s + c.duration, 0)}s`,
    '',
    '## Cut List',
    '',
    '| # | Label | Duration | Text | Narration |',
    '|---|-------|----------|------|-----------|',
  ];

  for (let i = 0; i < cuts.length; i++) {
    const c = cuts[i];
    lines.push(`| ${i + 1} | ${c.label} | ${c.duration}s | ${c.textOverlay || '-'} | ${c.narrationText || '-'} |`);
  }

  lines.push('', '## Import Order', '', 'Import clips in numbered order into CapCut/Premiere.');
  lines.push('All cuts are jump-cut transitions (no dissolve/effects).', '');
  lines.push('## Recommended', '', '- Trim each 5s clip to best 2-3s moment');
  lines.push('- Align beat drops to cut transitions');
  lines.push('- Add trending audio from Instagram/TikTok');

  return lines.join('\n');
}

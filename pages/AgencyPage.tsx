/**
 * AgencyPage.tsx — LUMINA MODEL AGENCY LP
 *
 * 90s RETRO EDITION: Windows 95 era software aesthetic.
 * CRT scanlines, pixel fonts, dithered gradients, chunky UI.
 */

import { useState, useEffect } from 'react';
import { AGENCY_MODELS, AGENCY_CATEGORIES, type AgencyModel } from '../data/agencyModels';

// ─── Types ──────────────────────────────────────────────────────────────────

type ViewMode = 'grid' | 'zoom';

// ─── Retro CSS (injected once) ──────────────────────────────────────────────

const RETRO_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

/* CRT Scanline overlay */
.crt-overlay {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.03) 0px,
    rgba(0, 0, 0, 0.03) 1px,
    transparent 1px,
    transparent 2px
  );
}

/* Pixelated image rendering */
.pixel-render {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

/* Retro window frame */
.win95-window {
  border: 2px solid;
  border-color: #dfdfdf #808080 #808080 #dfdfdf;
  background: #c0c0c0;
  box-shadow: 1px 1px 0 #000;
}

.win95-titlebar {
  background: linear-gradient(90deg, #000080, #1084d0);
  padding: 2px 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-family: 'VT323', monospace;
  font-size: 14px;
  user-select: none;
}

.win95-btn {
  border: 2px solid;
  border-color: #dfdfdf #808080 #808080 #dfdfdf;
  background: #c0c0c0;
  padding: 4px 16px;
  font-family: 'VT323', monospace;
  font-size: 16px;
  cursor: pointer;
  color: #000;
}

.win95-btn:active {
  border-color: #808080 #dfdfdf #dfdfdf #808080;
}

.win95-btn-primary {
  background: #000080;
  color: white;
  border-color: #aaa #333 #333 #aaa;
}

/* Dithered background pattern */
.dither-bg {
  background-color: #008080;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVQIW2NkYPj/n4EBigADABYaA/1mzKMnAAAAAElFTkSuQmCC");
  background-repeat: repeat;
}

/* Retro image hover — pixelate on hover */
.retro-model-img {
  transition: filter 0.3s;
  filter: contrast(1.1) saturate(0.85);
}

.retro-model-img:hover {
  filter: contrast(1.2) saturate(1) brightness(1.05);
}

/* Marquee-style scroll text */
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

.marquee-text {
  animation: marquee 20s linear infinite;
  white-space: nowrap;
}

/* Blink cursor */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.blink-cursor::after {
  content: '█';
  animation: blink 1s step-end infinite;
  color: #00ff00;
}

/* Retro scrollbar */
.retro-scroll::-webkit-scrollbar {
  width: 16px;
}

.retro-scroll::-webkit-scrollbar-track {
  background: #c0c0c0;
  border-left: 1px solid #808080;
}

.retro-scroll::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #dfdfdf #808080 #808080 #dfdfdf;
}
`;

function useRetroStyles() {
  useEffect(() => {
    const id = 'retro-styles';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = RETRO_STYLES;
    document.head.appendChild(style);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
}

// ─── Model Detail Modal ─────────────────────────────────────────────────────

function ModelDetail({ model, onClose }: { model: AgencyModel; onClose: () => void }) {
  const categoryLabel = AGENCY_CATEGORIES.find(c => c.id === model.category)?.label || '';

  const portfolioImages = [
    model.images.main,
    model.images.polaroid,
    model.images.beauty,
    model.images.editorial,
    ...('portfolio' in model ? model.portfolio : []),
  ].filter((src, i, arr) => arr.indexOf(src) === i);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto retro-scroll" style={{ background: '#008080' }}>
      {/* Window frame */}
      <div className="max-w-5xl mx-auto my-4 md:my-8">
        <div className="win95-window">
          {/* Title bar */}
          <div className="win95-titlebar">
            <span>📁 {model.name} — Model Profile</span>
            <button
              onClick={onClose}
              className="win95-btn px-2 py-0 text-xs"
              style={{ minWidth: 'auto', padding: '1px 6px' }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={model.images.polaroid}
                  alt={model.name}
                  className="w-full aspect-[2/3] object-cover retro-model-img border-2 border-gray-400"
                />
              </div>

              <div>
                <p style={{ fontFamily: 'VT323, monospace', fontSize: '12px', color: '#808080', letterSpacing: '0.2em' }}>
                  {categoryLabel.toUpperCase()}
                </p>
                <h1 style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '18px', margin: '12px 0 24px', lineHeight: '1.6' }}>
                  {model.name}
                </h1>

                <div className="space-y-3" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px' }}>
                  <div className="grid grid-cols-4 gap-3 p-3 bg-gray-100 border border-gray-300">
                    <div><span className="block text-xs text-gray-500">HT</span>{model.height}</div>
                    <div><span className="block text-xs text-gray-500">BUST</span>{model.measurements.bust}</div>
                    <div><span className="block text-xs text-gray-500">WAIST</span>{model.measurements.waist}</div>
                    <div><span className="block text-xs text-gray-500">HIPS</span>{model.measurements.hips}</div>
                  </div>
                  <div className="p-3 bg-gray-100 border border-gray-300">
                    <span className="text-xs text-gray-500">HAIR:</span> {model.hair} &nbsp;|&nbsp;
                    <span className="text-xs text-gray-500">EYES:</span> {model.eyes}
                  </div>
                </div>

                <a
                  href={`/studio?model=${model.id}`}
                  className="win95-btn-primary win95-btn inline-block mt-6"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '18px', letterSpacing: '0.1em' }}
                >
                  📷 BOOK THIS MODEL
                </a>
              </div>
            </div>

            {/* Portfolio */}
            <div className="mt-8">
              <p style={{ fontFamily: 'VT323, monospace', fontSize: '14px', color: '#808080', letterSpacing: '0.2em', marginBottom: '12px' }}>
                ═══ PORTFOLIO ═══
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {portfolioImages.map((src, i) => (
                  <div key={src} className="border-2 border-gray-300">
                    <img
                      src={src}
                      alt={`${model.name} portfolio ${i + 1}`}
                      className="w-full aspect-[2/3] object-cover retro-model-img"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLElement).parentElement!.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Model Card ──────────────────────────────────────────────────────────────

function ModelCard({ model, viewMode, onClick }: { model: AgencyModel; viewMode: ViewMode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group text-left w-full">
      <div className="win95-window">
        <div className="win95-titlebar text-xs py-0.5 px-1">
          <span className="truncate">{model.name.toLowerCase()}.bmp</span>
        </div>
        <div className="p-1 bg-white">
          <img
            src={model.images.main}
            alt={model.name}
            className={`w-full object-cover retro-model-img ${
              viewMode === 'zoom' ? 'aspect-[3/4]' : 'aspect-[2/3]'
            }`}
            loading="lazy"
          />
        </div>
      </div>
      <p className="mt-2" style={{ fontFamily: 'VT323, monospace', fontSize: '16px', color: '#000' }}>
        {model.name}
      </p>
    </button>
  );
}

// ─── Section ────────────────────────────────────────────────────────────────

function ModelSection({
  title,
  models,
  viewMode,
  onModelClick,
}: {
  title: string;
  models: AgencyModel[];
  viewMode: ViewMode;
  onModelClick: (model: AgencyModel) => void;
}) {
  if (models.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-baseline justify-between mb-4 border-b-2 border-gray-400 pb-1">
        <h2 style={{ fontFamily: 'VT323, monospace', fontSize: '18px', letterSpacing: '0.15em', color: '#000080' }}>
          📂 {title.toUpperCase()}
        </h2>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#808080' }}>
          {models.length} models
        </span>
      </div>
      <div className={`grid gap-4 ${
        viewMode === 'zoom'
          ? 'grid-cols-2 md:grid-cols-3'
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
      }`}>
        {models.map(model => (
          <ModelCard
            key={model.id}
            model={model}
            viewMode={viewMode}
            onClick={() => onModelClick(model)}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function AgencyPage() {
  useRetroStyles();

  const [selectedModel, setSelectedModel] = useState<AgencyModel | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    if (selectedModel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedModel]);

  const ladiesAsia = AGENCY_MODELS.filter(m => m.category === 'ladies_asia');
  const ladiesIntl = AGENCY_MODELS.filter(m => m.category === 'ladies_international');
  const menAsia = AGENCY_MODELS.filter(m => m.category === 'men_asia');
  const menIntl = AGENCY_MODELS.filter(m => m.category === 'men_international');
  const influencers = AGENCY_MODELS.filter(m => m.category === 'influencer');

  return (
    <div className="min-h-screen retro-scroll" style={{ background: '#008080' }}>
      {/* CRT Scanline overlay */}
      <div className="crt-overlay" />

      {/* ── Header (Taskbar style) ── */}
      <header className="sticky top-0 z-40" style={{
        background: '#c0c0c0',
        borderBottom: '2px solid',
        borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
      }}>
        <div className="max-w-7xl mx-auto px-3 md:px-6 h-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="win95-btn px-2 py-0 text-xs" style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}>
              💎 Start
            </span>
            <span style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '8px', color: '#000080', marginLeft: '8px' }}>
              LUMINA MODEL AGENCY
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {['Women', 'Men', 'Influencer', 'About'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="win95-btn px-3 py-0 text-xs"
                style={{ fontFamily: 'VT323, monospace', fontSize: '14px' }}
              >
                {item}
              </a>
            ))}
            <a
              href="/studio"
              className="win95-btn-primary win95-btn px-3 py-0 text-xs"
              style={{ fontFamily: 'VT323, monospace', fontSize: '14px' }}
            >
              Studio →
            </a>
          </nav>

          {/* Clock */}
          <div className="flex items-center gap-2 border-l border-gray-400 pl-3" style={{ fontFamily: 'VT323, monospace', fontSize: '14px' }}>
            <span>🔊</span>
            <span>{new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </header>

      {/* ── Marquee ── */}
      <div style={{ background: '#000080', overflow: 'hidden', padding: '4px 0' }}>
        <p className="marquee-text" style={{ fontFamily: 'VT323, monospace', fontSize: '16px', color: '#00ff00' }}>
          ★★★ LUMINA MODEL AGENCY — AI-POWERED FASHION MODELS — AVAILABLE 24/7 — NO CASTING REQUIRED — BOOK NOW AT LUMINA STUDIO ★★★
        </p>
      </div>

      {/* ── Hero (as Windows dialog) ── */}
      <section className="max-w-4xl mx-auto px-3 md:px-6 py-6 md:py-10">
        <div className="win95-window">
          <div className="win95-titlebar">
            <span>🖥️ Welcome to LUMINA MODEL AGENCY</span>
          </div>
          <div className="p-6 md:p-10 bg-white text-center">
            <h1 style={{
              fontFamily: 'Press Start 2P, monospace',
              fontSize: 'clamp(14px, 3vw, 24px)',
              lineHeight: '2',
              color: '#000080',
            }}>
              THE FUTURE OF<br />FASHION PHOTOGRAPHY
            </h1>
            <p className="mt-4" style={{
              fontFamily: 'VT323, monospace',
              fontSize: '20px',
              color: '#808080',
              lineHeight: '1.6',
            }}>
              AI-powered models available 24/7.<br />
              No casting. No scheduling. No limitations.<br />
              Studio-quality fashion photography, instantly.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a href="/studio" className="win95-btn-primary win95-btn" style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}>
                📷 OPEN STUDIO
              </a>
              <a href="#women" className="win95-btn" style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}>
                👁 BROWSE MODELS
              </a>
            </div>
            <p className="mt-4 blink-cursor" style={{ fontFamily: 'VT323, monospace', fontSize: '14px', color: '#008000' }}>
              SYSTEM READY
            </p>
          </div>
        </div>
      </section>

      {/* ── View Controls ── */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 mb-4">
        <div className="inline-flex" style={{ background: '#c0c0c0', border: '2px solid', borderColor: '#dfdfdf #808080 #808080 #dfdfdf', padding: '2px' }}>
          <button
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'win95-btn-primary win95-btn text-xs' : 'win95-btn text-xs'}
            style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}
          >
            ▦ All View
          </button>
          <button
            onClick={() => setViewMode('zoom')}
            className={viewMode === 'zoom' ? 'win95-btn-primary win95-btn text-xs' : 'win95-btn text-xs'}
            style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}
          >
            🔍 Zoom View
          </button>
        </div>
      </div>

      {/* ── Models (in window frames) ── */}
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        {/* Women */}
        <div id="women" className="win95-window mb-6">
          <div className="win95-titlebar">
            <span>👗 C:\LUMINA\WOMEN</span>
          </div>
          <div className="p-4 bg-white">
            <ModelSection title="International" models={ladiesIntl} viewMode={viewMode} onModelClick={setSelectedModel} />
            <ModelSection title="Asia" models={ladiesAsia} viewMode={viewMode} onModelClick={setSelectedModel} />
          </div>
        </div>

        {/* Men */}
        <div id="men" className="win95-window mb-6">
          <div className="win95-titlebar">
            <span>🕴️ C:\LUMINA\MEN</span>
          </div>
          <div className="p-4 bg-white">
            <ModelSection title="International" models={menIntl} viewMode={viewMode} onModelClick={setSelectedModel} />
            <ModelSection title="Asia" models={menAsia} viewMode={viewMode} onModelClick={setSelectedModel} />
          </div>
        </div>

        {/* Influencer */}
        {influencers.length > 0 && (
          <div id="influencer" className="win95-window mb-6">
            <div className="win95-titlebar">
              <span>⭐ C:\LUMINA\INFLUENCER</span>
            </div>
            <div className="p-4 bg-white">
              <ModelSection title="Creative Talent" models={influencers} viewMode={viewMode} onModelClick={setSelectedModel} />
            </div>
          </div>
        )}
      </div>

      {/* ── About ── */}
      <section id="about" className="max-w-4xl mx-auto px-3 md:px-6 py-8">
        <div className="win95-window">
          <div className="win95-titlebar">
            <span>ℹ️ About LUMINA MODEL AGENCY</span>
          </div>
          <div className="p-6 bg-white" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', lineHeight: '1.8' }}>
            <p className="mb-3">
              LUMINA MODEL AGENCY represents the next generation of fashion models.
              Our roster features AI-generated models with consistent identity, available for
              e-commerce photography, editorial campaigns, and brand content.
            </p>
            <p className="mb-3">
              24 hours a day, 365 days a year. No scheduling conflicts. No travel costs.
              No limitations. Each model maintains perfect consistency across unlimited shoots.
            </p>
            <p style={{ color: '#808080' }}>
              Powered by LUMINA STUDIO — TomorrowProof Inc. © 2026
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-4xl mx-auto px-3 md:px-6 pb-8">
        <div className="win95-window">
          <div className="win95-titlebar">
            <span>🚀 Ready to book?</span>
          </div>
          <div className="p-8 bg-white text-center">
            <p style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '12px', lineHeight: '2', marginBottom: '16px' }}>
              START CREATING<br />STUDIO-QUALITY<br />FASHION PHOTOGRAPHY
            </p>
            <a
              href="/studio"
              className="win95-btn-primary win95-btn"
              style={{ fontFamily: 'VT323, monospace', fontSize: '24px', padding: '8px 32px' }}
            >
              📷 OPEN STUDIO
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer (Taskbar style) ── */}
      <footer style={{
        background: '#c0c0c0',
        borderTop: '2px solid',
        borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
      }}>
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '8px' }}>
            <span style={{ color: '#000080' }}>LUMINA</span>
            <span style={{ color: '#808080', marginLeft: '4px' }}>MODEL AGENCY</span>
            <p style={{ fontFamily: 'VT323, monospace', fontSize: '14px', color: '#808080', marginTop: '2px' }}>
              by TomorrowProof Inc.
            </p>
          </div>
          <nav className="flex items-center gap-2">
            {['Women', 'Men', 'About'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="win95-btn px-2 py-0" style={{ fontFamily: 'VT323, monospace', fontSize: '13px' }}>
                {item}
              </a>
            ))}
          </nav>
          <p style={{ fontFamily: 'VT323, monospace', fontSize: '14px', color: '#808080' }}>
            © 2026 LUMINA MODEL AGENCY v1.0
          </p>
        </div>
      </footer>

      {/* ── Model Detail Modal ── */}
      {selectedModel && (
        <ModelDetail
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </div>
  );
}

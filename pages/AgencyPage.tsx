/**
 * AgencyPage.tsx — LUMINA MODEL AGENCY LP
 *
 * Wizard Models inspired: white base, minimal, photography-first.
 * A legitimate model agency website that happens to be AI-powered.
 */

import { useState, useEffect } from 'react';
import { AGENCY_MODELS, AGENCY_CATEGORIES, type AgencyModel } from '../data/agencyModels';

// ─── Types ──────────────────────────────────────────────────────────────────

type ViewMode = 'grid' | 'zoom';

// ─── Model Detail Modal ─────────────────────────────────────────────────────

function ModelDetail({ model, onClose }: { model: AgencyModel; onClose: () => void }) {
  const categoryLabel = AGENCY_CATEGORIES.find(c => c.id === model.category)?.label || '';

  // Collect all images for portfolio
  const portfolioImages = [
    model.images.main,
    model.images.polaroid,
    model.images.beauty,
    model.images.editorial,
    ...('portfolio' in model ? model.portfolio : []),
  ].filter((src, i, arr) => arr.indexOf(src) === i); // deduplicate

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
        aria-label="Close"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Top: Name + Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Main image */}
          <div>
            <img
              src={model.images.polaroid}
              alt={model.name}
              className="w-full aspect-[2/3] object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-3">{categoryLabel}</p>
            <h1 className="text-4xl md:text-5xl font-light tracking-[0.08em] text-gray-900 mb-8">{model.name}</h1>

            <div className="space-y-4 text-sm text-gray-500 mb-10">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <span className="block text-xs text-gray-400 uppercase tracking-wider">Height</span>
                  <span className="text-gray-800">{model.height}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 uppercase tracking-wider">Bust</span>
                  <span className="text-gray-800">{model.measurements.bust}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 uppercase tracking-wider">Waist</span>
                  <span className="text-gray-800">{model.measurements.waist}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 uppercase tracking-wider">Hips</span>
                  <span className="text-gray-800">{model.measurements.hips}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Hair</span>
                <span className="text-gray-700">{model.hair}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Eyes</span>
                <span className="text-gray-700">{model.eyes}</span>
              </div>
            </div>

            <a
              href={`/studio?model=${model.id}`}
              className="inline-block px-8 py-3 bg-gray-900 text-white text-xs tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors self-start"
            >
              Book This Model
            </a>
          </div>
        </div>

        {/* Portfolio */}
        <div>
          <h2 className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-8">Portfolio</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {portfolioImages.map((src, i) => (
              <div key={src} className="overflow-hidden">
                <img
                  src={src}
                  alt={`${model.name} portfolio ${i + 1}`}
                  className="w-full aspect-[2/3] object-cover hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLElement).parentElement!.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Model Card ──────────────────────────────────────────────────────────────

function ModelCard({ model, viewMode, onClick }: { model: AgencyModel; viewMode: ViewMode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group text-left w-full"
    >
      <div className="overflow-hidden">
        <img
          src={model.images.main}
          alt={model.name}
          className={`w-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out ${
            viewMode === 'zoom' ? 'aspect-[3/4]' : 'aspect-[2/3]'
          }`}
          loading="lazy"
        />
      </div>
      <div className="mt-3">
        <p className="text-sm text-gray-800 tracking-wider">{model.name}</p>
      </div>
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
    <section className="mb-20">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-xs tracking-[0.3em] text-gray-400 uppercase">{title}</h2>
        <span className="text-xs text-gray-300">{models.length} models</span>
      </div>
      <div className={`grid gap-6 ${
        viewMode === 'zoom'
          ? 'grid-cols-2 md:grid-cols-3'
          : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
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
  const [selectedModel, setSelectedModel] = useState<AgencyModel | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedModel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedModel]);

  // Group models by category
  const ladiesAsia = AGENCY_MODELS.filter(m => m.category === 'ladies_asia');
  const ladiesIntl = AGENCY_MODELS.filter(m => m.category === 'ladies_international');
  const menAsia = AGENCY_MODELS.filter(m => m.category === 'men_asia');
  const menIntl = AGENCY_MODELS.filter(m => m.category === 'men_international');
  const influencers = AGENCY_MODELS.filter(m => m.category === 'influencer');

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div>
            <span className="text-base font-light tracking-[0.2em] text-gray-900">LUMINA</span>
            <span className="text-[10px] text-gray-400 tracking-[0.15em] ml-2">MODEL AGENCY</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#women" className="text-xs tracking-[0.15em] text-gray-500 hover:text-gray-900 transition-colors uppercase">Women</a>
            <a href="#men" className="text-xs tracking-[0.15em] text-gray-500 hover:text-gray-900 transition-colors uppercase">Men</a>
            <a href="#influencer" className="text-xs tracking-[0.15em] text-gray-500 hover:text-gray-900 transition-colors uppercase">Influencer</a>
            <a href="#about" className="text-xs tracking-[0.15em] text-gray-500 hover:text-gray-900 transition-colors uppercase">About</a>
            <a href="/studio" className="text-xs tracking-[0.15em] text-gray-400 hover:text-gray-900 transition-colors uppercase">Studio →</a>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <h1 className="text-3xl md:text-5xl font-extralight tracking-[0.05em] text-gray-900 leading-tight max-w-2xl">
          The future of<br />fashion photography.
        </h1>
        <p className="mt-6 text-sm text-gray-400 tracking-wider max-w-lg leading-relaxed">
          AI-powered models available 24/7. No casting. No scheduling.<br />
          Studio-quality fashion photography, instantly.
        </p>
      </section>

      {/* ── View Controls ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 flex items-center gap-4">
        <button
          onClick={() => setViewMode('grid')}
          className={`text-xs tracking-wider uppercase transition-colors ${
            viewMode === 'grid' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'
          }`}
        >
          All View
        </button>
        <span className="text-gray-200">|</span>
        <button
          onClick={() => setViewMode('zoom')}
          className={`text-xs tracking-wider uppercase transition-colors ${
            viewMode === 'zoom' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'
          }`}
        >
          Zoom View
        </button>
      </div>

      {/* ── Women ── */}
      <div id="women" className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12">
          <h2 className="text-lg font-light tracking-[0.15em] text-gray-900">
            Women
          </h2>
        </div>

        <ModelSection
          title="International"
          models={ladiesIntl}
          viewMode={viewMode}
          onModelClick={setSelectedModel}
        />

        <ModelSection
          title="Asia"
          models={ladiesAsia}
          viewMode={viewMode}
          onModelClick={setSelectedModel}
        />
      </div>

      {/* ── Men ── */}
      <div id="men" className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
        <div className="mb-12">
          <h2 className="text-lg font-light tracking-[0.15em] text-gray-900">
            Men
          </h2>
        </div>

        <ModelSection
          title="International"
          models={menIntl}
          viewMode={viewMode}
          onModelClick={setSelectedModel}
        />

        <ModelSection
          title="Asia"
          models={menAsia}
          viewMode={viewMode}
          onModelClick={setSelectedModel}
        />
      </div>

      {/* ── Influencer / Creative ── */}
      {influencers.length > 0 && (
        <div id="influencer" className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
          <div className="mb-12">
            <h2 className="text-lg font-light tracking-[0.15em] text-gray-900">
              Influencer / Creative
            </h2>
          </div>
          <ModelSection
            title="Creative Talent"
            models={influencers}
            viewMode={viewMode}
            onModelClick={setSelectedModel}
          />
        </div>
      )}

      {/* ── About ── */}
      <section id="about" className="max-w-7xl mx-auto px-6 md:px-12 py-24 mt-16 border-t border-gray-100">
        <div className="max-w-xl">
          <h2 className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-6">About</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            LUMINA MODEL AGENCY represents the next generation of fashion models.
            Our roster features AI-generated models with consistent identity, available for
            e-commerce photography, editorial campaigns, and brand content — 24 hours a day,
            365 days a year.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Each model maintains perfect consistency across unlimited shoots.
            No scheduling conflicts. No travel costs. No limitations.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Powered by LUMINA STUDIO — professional AI fashion photography
            at a fraction of traditional production costs.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 mb-8">
        <div className="bg-gray-50 rounded-sm px-12 py-16 text-center">
          <h2 className="text-2xl font-extralight tracking-[0.08em] text-gray-900 mb-4">
            Ready to book?
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Start creating studio-quality fashion photography today.
          </p>
          <a
            href="/studio"
            className="inline-block px-10 py-3 bg-gray-900 text-white text-xs tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
          >
            Open Studio
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-sm font-light tracking-[0.2em] text-gray-900">LUMINA</span>
            <span className="text-[10px] text-gray-400 tracking-[0.15em] ml-1.5">MODEL AGENCY</span>
            <p className="text-xs text-gray-300 mt-2">by TomorrowProof Inc.</p>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#women" className="text-xs text-gray-400 hover:text-gray-600 transition-colors tracking-wider uppercase">Women</a>
            <a href="#men" className="text-xs text-gray-400 hover:text-gray-600 transition-colors tracking-wider uppercase">Men</a>
            <a href="#about" className="text-xs text-gray-400 hover:text-gray-600 transition-colors tracking-wider uppercase">About</a>
          </nav>
          <p className="text-xs text-gray-300">© 2026 LUMINA MODEL AGENCY</p>
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

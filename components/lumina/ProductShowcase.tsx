import { useState } from 'react';
import { useLang } from '../../contexts/LanguageContext';
import { SHOWCASE_PRODUCTS, type ShowcaseProduct } from '../../data/productShowcase';

/**
 * EC Product Showcase — mirrors lumina-studio-lp product grid.
 *
 * Each product card shows the 'front' image by default. On hover, cycles
 * through front → side → back → detail → product (flat-lay) to reveal
 * the 4-view AI delivery. Communicates "this is the actual deliverable"
 * far better than model portraits.
 */

type Shot = 'front' | 'side' | 'back' | 'detail' | 'product';
const CYCLE: Shot[] = ['front', 'side', 'back', 'detail', 'product'];
const SHOT_LABEL: Record<Shot, { en: string; ja: string }> = {
  front: { en: 'Front', ja: '正面' },
  side: { en: 'Side', ja: 'サイド' },
  back: { en: 'Back', ja: '背面' },
  detail: { en: 'Detail', ja: '詳細' },
  product: { en: 'Flat-lay', ja: '商品単体' },
};

export default function ProductShowcase() {
  const { lang } = useLang();
  const isJa = lang === 'ja';

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <p className="text-[10px] uppercase tracking-[0.32em] text-[#6B7280]">
          {isJa ? '商品ページ作例' : 'Product page deliverables'}
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">
          {isJa
            ? '6ブランド · 各4ビュー + 商品単体'
            : '6 brands · 4 views + flat-lay each'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {SHOWCASE_PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} isJa={isJa} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, isJa }: { product: ShowcaseProduct; isJa: boolean }) {
  const [shot, setShot] = useState<Shot>('front');

  return (
    <article className="group bg-[#0A0A0F] border border-[#1A1A2E] hover:border-[#00D4FF]/40 transition-colors duration-300 flex flex-col">
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#050508]">
        <img
          src={product.images[shot]}
          alt={`${product.brand} — ${SHOT_LABEL[shot][isJa ? 'ja' : 'en']}`}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-opacity duration-300"
        />
        {/* Shot label badge */}
        <div className="absolute top-3 left-3 bg-[#050508]/80 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#FAFAFA]">
          {SHOT_LABEL[shot][isJa ? 'ja' : 'en']}
        </div>
      </div>

      {/* Shot switcher strip — 5 thumbnails */}
      <div className="grid grid-cols-5 gap-[2px] bg-[#1A1A2E]">
        {CYCLE.map((s) => (
          <button
            key={s}
            onMouseEnter={() => setShot(s)}
            onFocus={() => setShot(s)}
            onClick={() => setShot(s)}
            aria-label={SHOT_LABEL[s][isJa ? 'ja' : 'en']}
            className={[
              'aspect-square overflow-hidden bg-[#0A0A0F] transition-all duration-200',
              shot === s ? 'ring-1 ring-[#00D4FF]' : 'opacity-60 hover:opacity-100',
            ].join(' ')}
          >
            <img
              src={product.images[s]}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover object-top"
            />
          </button>
        ))}
      </div>

      {/* Meta */}
      <div className="p-5 md:p-6 flex-grow flex flex-col">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] mb-2">
          {product.brand} · {isJa ? product.category.ja : product.category.en}
        </p>
        <h3 className="text-sm md:text-base font-medium text-[#FAFAFA] mb-3 leading-snug">
          {isJa ? product.name.ja : product.name.en}
        </h3>
        <div className="mt-auto pt-3 border-t border-[#1A1A2E] flex items-center justify-between">
          <span className="text-sm text-[#FAFAFA]">{product.price}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#00D4FF]/80">
            {isJa ? '4ビュー + 商品' : '4 views + flat-lay'}
          </span>
        </div>
      </div>
    </article>
  );
}

import { useEffect, useState } from 'react';
import CTAButton from './CTAButton';
import { useLang } from '../../contexts/LanguageContext';
import { useForBrandsLocale } from '../../i18n/forBrandsLocale';

interface ForBrandsHeroProps {
  onInquiryClick: () => void;
  onPricingClick: () => void;
}

/**
 * Full-bleed cinematic hero.
 *
 * Rotates 4 wide lookbook shots with cross-fade + Ken Burns zoom.
 * Typography bottom-left, minimal — editorial confidence over catalog density.
 * Reference grammar: YSL hero, IMG Models campaign hero, Awwwards 2026 oversized type.
 */

const HERO_IMAGES = [
  {
    src: '/case-studies/lumina-lookbook-ss26/page-03.jpg',
    caption: 'Coastal highway · RRL convertible',
    focal: 'center 40%',
  },
  {
    src: '/case-studies/lumina-lookbook-ss26/page-07.jpg',
    caption: 'Red 1967 Mustang · Americana heritage',
    focal: 'center 45%',
  },
  {
    src: '/case-studies/lumina-lookbook-ss26/page-05.jpg',
    caption: 'Hangar · camo dress with leather bomber',
    focal: 'center 40%',
  },
  {
    src: '/case-studies/lumina-lookbook-ss26/page-09.jpg',
    caption: 'Military aircraft cabin · denim jumpsuit',
    focal: 'center 35%',
  },
];

const ROTATION_MS = 7000;
const FADE_MS = 1800;

export default function ForBrandsHero({ onInquiryClick, onPricingClick }: ForBrandsHeroProps) {
  const { lang } = useLang();
  const t = useForBrandsLocale(lang);
  const isJa = lang === 'ja';

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % HERO_IMAGES.length);
    }, ROTATION_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#050508] text-[#FAFAFA]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background layers — cross-fade + Ken Burns zoom */}
      <div className="absolute inset-0">
        {HERO_IMAGES.map((img, i) => {
          const isActive = i === active;
          return (
            <div
              key={img.src}
              className="absolute inset-0 transition-opacity ease-out"
              style={{
                opacity: isActive ? 1 : 0,
                transitionDuration: `${FADE_MS}ms`,
              }}
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: img.focal,
                  transform: isActive ? 'scale(1.06)' : 'scale(1.00)',
                  transition: `transform ${ROTATION_MS + FADE_MS}ms ease-out`,
                }}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}
      </div>

      {/* Vignette + bottom gradient — ensures text readability over any shot */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,8,0)_0%,rgba(5,5,8,0.35)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#050508]/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#050508] via-[#050508]/80 to-transparent" />

      {/* Content — bottom-left editorial anchor */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end pt-32 pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.36em] text-[#FAFAFA]/70 mb-6 md:mb-8">
              {t.hero.eyebrow}
            </p>

            <h1
              className={[
                'font-semibold tracking-[-0.015em]',
                isJa
                  ? 'text-[36px] md:text-[48px] lg:text-[64px] leading-[1.35] [font-feature-settings:"palt"]'
                  : 'text-[44px] md:text-[64px] lg:text-[88px] leading-[0.98]',
              ].join(' ')}
            >
              {t.hero.titleLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p
              className={[
                'mt-8 md:mt-10 text-[#D1D5DB] whitespace-pre-line max-w-xl',
                isJa
                  ? 'text-[15px] md:text-base leading-[1.9]'
                  : 'text-base md:text-lg leading-relaxed',
              ].join(' ')}
            >
              {t.hero.body}
            </p>

            <div className="mt-10 md:mt-12 flex flex-wrap gap-3">
              <CTAButton onClick={onInquiryClick} arrow size="lg">
                {t.hero.ctaPrimary}
              </CTAButton>
              <CTAButton onClick={onPricingClick} variant="secondary" size="lg">
                {t.hero.ctaSecondary}
              </CTAButton>
            </div>
          </div>
        </div>
      </div>

      {/* Rotation indicators — bottom-right, minimal bars */}
      <div className="absolute bottom-8 md:bottom-10 right-6 md:right-10 z-20 flex items-center gap-3">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1} of ${HERO_IMAGES.length}`}
            className="group relative h-[3px] transition-all duration-500"
            style={{ width: i === active ? 36 : 18 }}
          >
            <span
              className={[
                'absolute inset-0 transition-colors duration-500',
                i === active ? 'bg-[#FAFAFA]' : 'bg-[#FAFAFA]/30 group-hover:bg-[#FAFAFA]/60',
              ].join(' ')}
            />
          </button>
        ))}
      </div>

      {/* Source attribution — editorial credit */}
      <div className="absolute bottom-8 md:bottom-10 left-6 md:left-10 z-20 text-[10px] uppercase tracking-[0.28em] text-[#FAFAFA]/50 hidden md:block">
        LUMINA_Lookbook_SS26 — {String(active + 1).padStart(2, '0')} / {String(HERO_IMAGES.length).padStart(2, '0')}
      </div>
    </section>
  );
}

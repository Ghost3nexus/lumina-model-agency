import { useEffect, useState } from 'react';
import CTAButton from './CTAButton';
import { useLang } from '../../contexts/LanguageContext';
import { useForBrandsLocale } from '../../i18n/forBrandsLocale';

interface LuminaHeaderProps {
  onBookClick?: () => void;
}

export default function LuminaHeader({ onBookClick }: LuminaHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLang();
  const t = useForBrandsLocale(lang);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        'fixed top-0 inset-x-0 z-40',
        'transition-colors duration-300 ease-out',
        scrolled
          ? 'bg-[#050508]/90 backdrop-blur border-b border-[#1A1A2E]'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a
          href="/"
          className="text-[#FAFAFA] font-semibold tracking-[0.2em] text-sm md:text-base"
        >
          LUMINA
        </a>

        <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.14em] text-[#FAFAFA]/70">
          <a href="/" className="hover:text-[#00D4FF] transition-colors">
            {t.nav.roster}
          </a>
          <a href="/for-brands" className="text-[#FAFAFA] transition-colors">
            {t.nav.forBrands}
          </a>
          <a href="/studio" className="hover:text-[#00D4FF] transition-colors">
            {t.nav.services}
          </a>
          <a href="/ethics" className="hover:text-[#00D4FF] transition-colors">
            {t.nav.ethics}
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.14em]">
            <button
              onClick={() => setLang('en')}
              className={lang === 'en' ? 'text-[#FAFAFA]' : 'text-[#6B7280] hover:text-[#FAFAFA] transition-colors'}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
            <span className="text-[#374151]">/</span>
            <button
              onClick={() => setLang('ja')}
              className={lang === 'ja' ? 'text-[#FAFAFA]' : 'text-[#6B7280] hover:text-[#FAFAFA] transition-colors'}
              aria-pressed={lang === 'ja'}
            >
              JP
            </button>
          </div>

          <CTAButton
            size="sm"
            variant="secondary"
            arrow
            onClick={onBookClick}
          >
            {t.nav.bookCta}
          </CTAButton>
        </div>
      </div>
    </header>
  );
}

import { useLang } from '../../contexts/LanguageContext';
import { useForBrandsLocale } from '../../i18n/forBrandsLocale';
import LookbookFeature from './LookbookFeature';
import ProductShowcase from './ProductShowcase';

export default function CaseStudies() {
  const { lang } = useLang();
  const t = useForBrandsLocale(lang);

  return (
    <section
      id="selected-work"
      className="bg-[#050508] text-[#FAFAFA] py-24 md:py-32 border-t border-[#1A1A2E]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section header */}
        <div className="mb-14 md:mb-20 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#6B7280] mb-4">
            {t.cases.eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            {t.cases.heading}
          </h2>
          <p className="mt-5 text-sm md:text-base text-[#9CA3AF]">
            {t.cases.gallerySub}
          </p>
        </div>

        {/* Featured lookbook — dedicated SS26 showcase */}
        <LookbookFeature />

        {/* EC product showcase — mirrored from lumina-studio-lp */}
        <ProductShowcase />
      </div>
    </section>
  );
}

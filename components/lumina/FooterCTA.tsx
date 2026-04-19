import { useLang } from '../../contexts/LanguageContext';
import { useForBrandsLocale } from '../../i18n/forBrandsLocale';

export default function FooterCTA() {
  const { lang } = useLang();
  const t = useForBrandsLocale(lang);

  return (
    <section className="bg-[#050508] text-[#FAFAFA] py-20 md:py-28 border-t border-[#1A1A2E]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">
          {t.footerCta.heading}
        </h2>
        <div className="flex flex-wrap justify-center gap-8 text-xs uppercase tracking-[0.2em]">
          <a href="/" className="text-[#FAFAFA] hover:text-[#00D4FF] transition-colors">
            {t.footerCta.roster}
          </a>
          <a href="/legal" className="text-[#FAFAFA] hover:text-[#00D4FF] transition-colors">
            {t.footerCta.ethics}
          </a>
          <a href="/" className="text-[#FAFAFA] hover:text-[#00D4FF] transition-colors">
            {t.footerCta.about}
          </a>
        </div>
        <p className="mt-10 text-sm text-[#9CA3AF]">
          {t.footerCta.emailLine}{' '}
          <a
            href="mailto:brand@lumina-models.com"
            className="text-[#FAFAFA] hover:text-[#00D4FF] transition-colors underline underline-offset-4 decoration-[#1A1A2E] hover:decoration-[#00D4FF]"
          >
            brand@lumina-models.com
          </a>
        </p>
      </div>
    </section>
  );
}

import { useLang } from '../../contexts/LanguageContext';
import { useForBrandsLocale } from '../../i18n/forBrandsLocale';

export default function TrustBar() {
  const { lang } = useLang();
  const t = useForBrandsLocale(lang);

  return (
    <section className="bg-[#050508] border-t border-[#1A1A2E] py-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-center gap-8 text-[10px] uppercase tracking-[0.3em] text-[#6B7280]">
        <span>{t.trustBar.featuredIn}</span>
        <span className="h-4 w-px bg-[#1A1A2E]" />
        <a
          href="https://tomorrowproof-ai.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-[#FAFAFA] transition-colors"
        >
          TomorrowProof Journal
        </a>
      </div>
    </section>
  );
}

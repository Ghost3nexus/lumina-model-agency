import { useLang } from '../../contexts/LanguageContext';
import { useForBrandsLocale } from '../../i18n/forBrandsLocale';

export default function HowItWorks() {
  const { lang } = useLang();
  const t = useForBrandsLocale(lang);
  const steps = t.howItWorks.steps;

  return (
    <section className="bg-[#0A0A0F] text-[#FAFAFA] py-24 md:py-32 border-t border-[#1A1A2E]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-14 md:mb-20">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#6B7280] mb-4">
            {t.howItWorks.eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
            {t.howItWorks.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              <div className="flex items-center mb-6">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#00D4FF] font-semibold">
                  {s.num}
                </span>
                {i < steps.length - 1 && (
                  <div className="hidden md:block ml-4 flex-1 h-px bg-gradient-to-r from-[#00D4FF]/40 via-[#1A1A2E] to-transparent" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-tight">
                {s.title}
              </h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

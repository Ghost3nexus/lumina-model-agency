import CTAButton from './CTAButton';
import { useLang } from '../../contexts/LanguageContext';
import { useForBrandsLocale } from '../../i18n/forBrandsLocale';

interface ServicesSectionProps {
  onCampaignInquire: () => void;
}

export default function ServicesSection({ onCampaignInquire }: ServicesSectionProps) {
  const { lang } = useLang();
  const t = useForBrandsLocale(lang);

  return (
    <section className="bg-[#050508] text-[#FAFAFA] py-24 md:py-32 border-t border-[#1A1A2E]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-14 md:mb-20">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#6B7280] mb-4">
            {t.services.eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
            {t.services.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1A1A2E]">
          {t.services.items.map((s) => (
            <div
              key={s.number}
              className="bg-[#0A0A0F] p-8 md:p-10 flex flex-col min-h-[380px] group hover:bg-[#10101A] transition-colors duration-300"
            >
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#00D4FF]">
                  {s.number}
                </span>
                <span className="h-px flex-1 bg-[#1A1A2E]" />
              </div>

              <h3 className="text-2xl md:text-3xl font-semibold mb-5 uppercase tracking-[0.04em]">
                {s.title}
              </h3>

              <p className="text-sm text-[#9CA3AF] leading-relaxed mb-6 flex-grow">
                {s.body}
              </p>

              <div className="pt-6 border-t border-[#1A1A2E]">
                <p className="text-xs text-[#FAFAFA] mb-2">{s.foot}</p>
                <p className="text-[11px] text-[#6B7280]">
                  {t.services.idealFor}: {s.ideal}
                </p>
                {s.ctaCampaign && (
                  <div className="mt-5">
                    <CTAButton
                      onClick={onCampaignInquire}
                      variant="secondary"
                      size="sm"
                      arrow
                    >
                      {s.ctaCampaign}
                    </CTAButton>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

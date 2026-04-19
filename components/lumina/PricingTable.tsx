import CTAButton from './CTAButton';
import { useLang } from '../../contexts/LanguageContext';
import { useForBrandsLocale } from '../../i18n/forBrandsLocale';

interface PricingTableProps {
  onInquiryClick: () => void;
  onCampaignInquire: () => void;
}

export default function PricingTable({
  onInquiryClick,
  onCampaignInquire,
}: PricingTableProps) {
  const { lang } = useLang();
  const t = useForBrandsLocale(lang);

  return (
    <section
      id="pricing"
      className="bg-[#0A0A0F] text-[#FAFAFA] py-24 md:py-32 border-t border-[#1A1A2E]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-14 md:mb-20">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#6B7280] mb-4">
            {t.pricing.eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
            {t.pricing.heading}
          </h2>
          <p className="mt-5 text-sm md:text-base text-[#9CA3AF] max-w-xl leading-relaxed">
            {t.pricing.sub}
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-hidden border border-[#1A1A2E]">
          <table className="w-full text-sm">
            <thead className="bg-[#050508] text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">
              <tr>
                <th className="text-left px-6 py-5 font-medium">{t.pricing.colTier}</th>
                <th className="text-left px-6 py-5 font-medium">{t.pricing.colUseCase}</th>
                <th className="text-left px-6 py-5 font-medium">{t.pricing.colRate}</th>
                <th className="text-left px-6 py-5 font-medium">{t.pricing.colImages}</th>
                <th className="text-left px-6 py-5 font-medium">{t.pricing.colVideo}</th>
                <th className="text-left px-6 py-5 font-medium">{t.pricing.colExclusivity}</th>
              </tr>
            </thead>
            <tbody>
              {t.pricing.tiers.map((tier, idx) => {
                const highlight = idx === 2; // Campaign row
                return (
                  <tr
                    key={tier.name}
                    className={[
                      'border-t border-[#1A1A2E]',
                      highlight ? 'bg-[#00D4FF]/[0.03]' : '',
                    ].join(' ')}
                  >
                    <td className="px-6 py-6">
                      <div className="font-semibold text-base tracking-tight">
                        {tier.name}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-[#9CA3AF]">{tier.useCase}</td>
                    <td className="px-6 py-6">
                      <div className="font-medium text-[#FAFAFA]">{tier.rate}</div>
                      {tier.rateUnit && (
                        <div className="text-[11px] text-[#6B7280]">{tier.rateUnit}</div>
                      )}
                    </td>
                    <td className="px-6 py-6 text-[#9CA3AF]">{tier.imageCap}</td>
                    <td className="px-6 py-6 text-[#9CA3AF]">{tier.videoCap}</td>
                    <td className="px-6 py-6 text-[#9CA3AF]">{tier.exclusivity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {t.pricing.tiers.map((tier, idx) => {
            const highlight = idx === 2;
            return (
              <div
                key={tier.name}
                className={[
                  'border p-5',
                  highlight
                    ? 'border-[#00D4FF]/40 bg-[#00D4FF]/[0.03]'
                    : 'border-[#1A1A2E] bg-[#050508]',
                ].join(' ')}
              >
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-lg font-semibold">{tier.name}</span>
                  <span className="text-sm text-[#FAFAFA]">{tier.rate}</span>
                </div>
                <p className="text-xs text-[#9CA3AF] mb-4">{tier.useCase}</p>
                <dl className="text-xs space-y-1 pt-3 border-t border-[#1A1A2E]">
                  <div className="flex justify-between">
                    <dt className="text-[#6B7280]">{t.pricing.colImages}</dt>
                    <dd>{tier.imageCap}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#6B7280]">{t.pricing.colVideo}</dt>
                    <dd>{tier.videoCap}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#6B7280]">{t.pricing.colExclusivity}</dt>
                    <dd>{tier.exclusivity}</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>

        <ul className="mt-8 space-y-1.5 text-xs text-[#6B7280] leading-relaxed">
          {t.pricing.footnotes.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <CTAButton onClick={onInquiryClick} size="lg" arrow>
            {t.pricing.ctaStart}
          </CTAButton>
          <CTAButton
            onClick={onCampaignInquire}
            size="lg"
            variant="secondary"
          >
            {t.pricing.ctaCampaign}
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

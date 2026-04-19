import { useState } from 'react';
import { useLang } from '../../contexts/LanguageContext';
import { useForBrandsLocale } from '../../i18n/forBrandsLocale';

export default function FAQAccordion() {
  const { lang } = useLang();
  const t = useForBrandsLocale(lang);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-[#0A0A0F] text-[#FAFAFA] py-24 md:py-32 border-t border-[#1A1A2E]">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <div className="mb-12 md:mb-16">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#6B7280] mb-4">
            {t.faq.eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
            {t.faq.heading}
          </h2>
        </div>

        <div className="border-t border-[#1A1A2E]">
          {t.faq.items.map((item, i) => {
            const open = openIdx === i;
            return (
              <div key={i} className="border-b border-[#1A1A2E]">
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                  aria-expanded={open}
                >
                  <span className="text-base md:text-lg font-medium text-[#FAFAFA] group-hover:text-[#00D4FF] transition-colors">
                    Q{i + 1}. {item.q}
                  </span>
                  <span
                    className={[
                      'shrink-0 w-8 h-8 border border-[#1A1A2E] flex items-center justify-center transition-all',
                      open
                        ? 'border-[#00D4FF] text-[#00D4FF] rotate-45'
                        : 'text-[#9CA3AF]',
                    ].join(' ')}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div
                  className={[
                    'grid transition-all duration-300 ease-out',
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  ].join(' ')}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-12 text-sm text-[#9CA3AF] leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

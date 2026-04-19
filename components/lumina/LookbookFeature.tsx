import { useLang } from '../../contexts/LanguageContext';
import { useForBrandsLocale } from '../../i18n/forBrandsLocale';
import { LOOKBOOK_SS26 } from '../../data/workShowcase';

/**
 * LookbookFeature — dedicated LUMINA_Lookbook_SS26 showcase strip.
 *
 * Layout: cover hero + editorial spread grid alternating wide/half.
 * Spreads arranged to mimic magazine pacing: wide · wide · (half+half) · wide · wide · (half+half) · wide.
 */
export default function LookbookFeature() {
  const { lang } = useLang();
  const t = useForBrandsLocale(lang);
  const lb = t.cases.lookbook;

  const [cover, ...rest] = LOOKBOOK_SS26;

  // Pair "half" spreads into 2-up rows; wide stays full row.
  const rows: (typeof LOOKBOOK_SS26)[] = [];
  let halfBuffer: typeof LOOKBOOK_SS26 = [];
  for (const s of rest) {
    if (s.layout === 'half') {
      halfBuffer.push(s);
      if (halfBuffer.length === 2) {
        rows.push(halfBuffer);
        halfBuffer = [];
      }
    } else {
      if (halfBuffer.length) {
        rows.push(halfBuffer);
        halfBuffer = [];
      }
      rows.push([s]);
    }
  }
  if (halfBuffer.length) rows.push(halfBuffer);

  return (
    <section className="mb-24 md:mb-32">
      <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#00D4FF] mb-4">
            {lb.eyebrow}
          </p>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            {lb.title}
          </h3>
          <p className="mt-3 text-sm md:text-base text-[#9CA3AF]">{lb.subtitle}</p>
        </div>
        <div className="text-xs md:text-sm text-[#9CA3AF] md:text-right">
          <p className="uppercase tracking-[0.18em] text-[#FAFAFA]">{lb.meta}</p>
          <p className="mt-2 text-[#6B7280] max-w-sm md:ml-auto">{lb.footnote}</p>
        </div>
      </div>

      {/* Cover hero — full width */}
      {cover && (
        <figure className="mb-1 md:mb-2 border border-[#1A1A2E] overflow-hidden bg-[#0A0A0F]">
          <img
            src={cover.src}
            alt={cover.caption}
            loading="lazy"
            className="w-full h-auto block"
          />
        </figure>
      )}

      {/* Editorial spread grid */}
      <div className="space-y-1 md:space-y-2">
        {rows.map((row, i) => (
          <div
            key={i}
            className={[
              'grid gap-1 md:gap-2',
              row.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1',
            ].join(' ')}
          >
            {row.map((spread) => (
              <figure
                key={spread.src}
                className="border border-[#1A1A2E] overflow-hidden bg-[#0A0A0F] group"
              >
                <img
                  src={spread.src}
                  alt={spread.caption}
                  loading="lazy"
                  className="w-full h-auto block group-hover:scale-[1.01] transition-transform duration-700"
                />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

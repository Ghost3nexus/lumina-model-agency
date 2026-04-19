import { useLang } from '../../contexts/LanguageContext';
import { useForBrandsLocale } from '../../i18n/forBrandsLocale';

export default function LuminaFooter() {
  const { lang } = useLang();
  const t = useForBrandsLocale(lang);

  return (
    <footer className="border-t border-[#1A1A2E] bg-[#0A0A0F] text-[#FAFAFA]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
        <div className="mb-12">
          <div className="text-xl md:text-2xl font-semibold tracking-[0.12em]">
            LUMINA MODEL AGENCY
          </div>
          <p className="mt-3 text-sm text-[#9CA3AF] max-w-md">
            {t.footer.tagline}
          </p>
          <p className="mt-1 text-xs text-[#6B7280]">
            {t.footer.since}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <FooterColumn
            heading={t.footer.colRoster}
            links={[
              { label: lang === 'ja' ? '女性' : 'Women', href: '/' },
              { label: lang === 'ja' ? '男性' : 'Men', href: '/' },
              { label: lang === 'ja' ? 'クリエイター' : 'Creators', href: '/' },
              { label: lang === 'ja' ? 'タレント' : 'Talent', href: '/' },
            ]}
          />
          <FooterColumn
            heading={t.footer.colForBrands}
            links={[
              { label: lang === 'ja' ? 'キャンペーン' : 'Campaign', href: '/for-brands' },
              { label: lang === 'ja' ? 'サービス' : 'Services', href: '/studio' },
              { label: lang === 'ja' ? '料金' : 'Pricing', href: '/pricing' },
              { label: lang === 'ja' ? '実績' : 'Case Studies', href: '/for-brands#selected-work' },
            ]}
          />
          <FooterColumn
            heading={t.footer.colAbout}
            links={[
              { label: lang === 'ja' ? 'ストーリー' : 'Story', href: '/legal' },
              { label: lang === 'ja' ? '倫理規範' : 'Ethics', href: '/legal' },
              { label: lang === 'ja' ? 'お問い合わせ' : 'Contact', href: 'mailto:brand@lumina-models.com' },
            ]}
          />
          <FooterColumn
            heading={t.footer.colLegal}
            links={[
              { label: lang === 'ja' ? '利用規約' : 'Terms', href: '/terms' },
              { label: lang === 'ja' ? 'プライバシー' : 'Privacy', href: '/privacy' },
              { label: lang === 'ja' ? 'IPライセンス' : 'IP License', href: '/legal' },
              { label: lang === 'ja' ? '詐欺警告' : 'Anti-fraud', href: '/legal' },
            ]}
          />
        </div>

        <div className="mt-12 pt-6 border-t border-[#1A1A2E] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#6B7280]">
          <div className="flex items-center gap-4 uppercase tracking-[0.14em]">
            <a
              href="https://instagram.com/lumina.models"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#00D4FF] transition-colors"
            >
              Instagram
            </a>
            <a href="#" className="hover:text-[#00D4FF] transition-colors">
              TikTok
            </a>
            <a href="#" className="hover:text-[#00D4FF] transition-colors">
              X
            </a>
            <a href="#" className="hover:text-[#00D4FF] transition-colors">
              YouTube
            </a>
          </div>
          <p>© 2026 TomorrowProof Inc.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-[0.18em] text-[#FAFAFA] mb-4">
        {heading}
      </h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-[#9CA3AF] hover:text-[#FAFAFA] transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

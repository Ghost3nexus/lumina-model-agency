/**
 * IpLicensePage — /legal/ip-license route.
 * Public-facing IP License Tier Table.
 * Source: docs/design/ip-license-tiers.md (v0.2 CEO-approved).
 */

import { LanguageProvider, useLang } from '../contexts/LanguageContext';
import LuminaHeader from '../components/lumina/LuminaHeader';
import LuminaFooter from '../components/lumina/LuminaFooter';

function IpLicenseContent() {
  const { lang } = useLang();
  const isJa = lang === 'ja';

  return (
    <div className="min-h-screen bg-[#050508] text-[#FAFAFA] font-sans antialiased">
      <LuminaHeader />

      <main className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <header className="mb-16 pb-10 border-b border-[#1A1A2E]">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#6B7280] mb-4">
              LUMINA MODEL AGENCY · LEGAL
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
              IP License Tiers
            </h1>
            <p className="text-sm md:text-base text-[#9CA3AF]">
              {isJa
                ? 'すべてのモデル指名には商用利用権が含まれます。範囲はランクごとに異なります。'
                : 'All model nominations include commercial usage rights. Scope varies by tier.'}
            </p>
            <div className="mt-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#6B7280]">
              <span>Version 0.2</span>
              <span className="h-3 w-px bg-[#1A1A2E]" />
              <span>Last updated: 2026-04-19</span>
              <span className="h-3 w-px bg-[#1A1A2E]" />
              <span className="text-[#FFB800]">Legal review in progress</span>
            </div>
          </header>

          <article className="space-y-14 text-[15px] md:text-base leading-[1.85] text-[#D1D5DB]">

            {/* Tier summary */}
            <section>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#6B7280] mb-5">
                {isJa ? 'Tier 一覧' : 'Tier Summary'}
              </h2>
              <div className="overflow-x-auto -mx-6 md:mx-0">
                <table className="w-full min-w-[600px] text-sm">
                  <thead className="bg-[#0A0A0F] text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">
                    <tr>
                      <th className="text-left px-4 py-4 font-medium">Tier</th>
                      <th className="text-left px-4 py-4 font-medium">{isJa ? '用途' : 'Use cases'}</th>
                      <th className="text-left px-4 py-4 font-medium">{isJa ? '料金' : 'Rate'}</th>
                      <th className="text-left px-4 py-4 font-medium">{isJa ? '独占性' : 'Exclusivity'}</th>
                    </tr>
                  </thead>
                  <tbody className="border border-[#1A1A2E]">
                    <tr className="border-b border-[#1A1A2E]">
                      <td className="px-4 py-5 font-semibold text-[#FAFAFA]">Standard</td>
                      <td className="px-4 py-5 text-[#9CA3AF]">{isJa ? 'EC 商品ページのみ' : 'EC product pages only'}</td>
                      <td className="px-4 py-5 text-[#FAFAFA]">¥5,000 / mo</td>
                      <td className="px-4 py-5 text-[#9CA3AF]">—</td>
                    </tr>
                    <tr className="border-b border-[#1A1A2E]">
                      <td className="px-4 py-5 font-semibold text-[#FAFAFA]">Extended</td>
                      <td className="px-4 py-5 text-[#9CA3AF]">{isJa ? 'EC + SNS + Web' : 'EC + SNS + Web (brand-owned)'}</td>
                      <td className="px-4 py-5 text-[#FAFAFA]">¥15,000 / mo</td>
                      <td className="px-4 py-5 text-[#9CA3AF]">—</td>
                    </tr>
                    <tr className="border-b border-[#1A1A2E] bg-[#00D4FF]/[0.03]">
                      <td className="px-4 py-5 font-semibold text-[#FAFAFA]">Campaign</td>
                      <td className="px-4 py-5 text-[#9CA3AF]">{isJa ? '広告・印刷・動画キャンペーン' : 'Ads · print · broadcast · OOH'}</td>
                      <td className="px-4 py-5 text-[#FAFAFA]">{isJa ? '個別見積' : 'Inquire'}</td>
                      <td className="px-4 py-5 text-[#9CA3AF]">{isJa ? '案件期間中' : 'During campaign'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-5 font-semibold text-[#FAFAFA]">Exclusive</td>
                      <td className="px-4 py-5 text-[#9CA3AF]">{isJa ? 'カテゴリ独占' : 'Category-wide exclusivity'}</td>
                      <td className="px-4 py-5 text-[#FAFAFA]">{isJa ? '¥200,000〜 / mo' : 'From ¥200,000 / mo'}</td>
                      <td className="px-4 py-5 text-[#9CA3AF]">{isJa ? 'カテゴリ単位' : 'Category-level'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <Section num="§1" title="What each tier permits" titleJa="各 tier で許諾される範囲">
              <div className="space-y-8">
                <TierCard name="Standard" permitted={isJa ? [
                  'ライセンシー自身が運営する EC 商品ページ(楽天/Yahoo/Amazon/Shopify/自社直販)',
                  '商品ページのサムネイル・ギャラリー画像',
                  '取引メール(注文確認・カゴ落ちリカバリ等)',
                ] : [
                  "Licensee's own e-commerce product pages (Rakuten / Yahoo / Amazon / Shopify / DTC)",
                  'Product thumbnails and gallery images for those pages',
                  'Transactional emails (order confirmations, abandonment recovery)',
                ]} notPermitted={isJa ? [
                  '有料広告',
                  'SNS 投稿(自社・第三者問わず)',
                  '印刷・OOH・放送・エディトリアル',
                  '再販業者・サブライセンス',
                ] : [
                  'Any paid advertising',
                  'Social media posts (licensee or third-party)',
                  'Print, OOH, broadcast, editorial content',
                  'Resellers, sub-licensing',
                ]} />

                <TierCard name="Extended" permitted={isJa ? [
                  'Standard の範囲すべて',
                  'ライセンシー自身の SNS アカウント(IG/X/TikTok/FB/LinkedIn/Pinterest/YouTube 他)',
                  'ブランド所有のブログ・エディトリアル・コンテンツマーケティング',
                  'プロモーション用メールマガジン',
                  '月 10 本までのショート動画(9:16/16:9/1:1、15 秒以下)',
                ] : [
                  'Everything in Standard',
                  "Licensee's own SNS accounts (IG / X / TikTok / FB / LinkedIn / Pinterest / YouTube)",
                  'Brand-owned blog, editorial, content marketing',
                  'Promotional email marketing',
                  '10 short videos per month (vertical/landscape/square, up to 15 seconds)',
                ]} notPermitted={isJa ? [
                  '有料広告(Campaign tier 要)',
                  'サブライセンス',
                  '独立配信する代理店・再販業者',
                ] : [
                  'Paid advertising (add Campaign tier)',
                  'Sub-licensing',
                  'Resellers or distributors using content independently',
                ]} />

                <TierCard name="Campaign" permitted={isJa ? [
                  'Extended の範囲すべて',
                  '有料広告 (Meta/Google/TikTok/X Ads/LINE Ads/YouTube Ads/OOH/印刷/放送/OTT)',
                  'パートナーブランドとの共同マーケティング(契約範囲内)',
                  'イベント・リテールサイネージ、PR メディア配信',
                ] : [
                  'Everything in Extended',
                  'Paid advertising (Meta / Google / TikTok / X Ads / LINE Ads / YouTube Ads / OOH / print / broadcast / OTT)',
                  'Co-marketing with partner brands (within agreed scope)',
                  'Event and retail signage, PR / media distribution',
                ]} notPermitted={isJa ? [
                  '政治・宗教・選挙勧誘(Legal 追加審査で対応可)',
                  'カテゴリ外での競合ブランド起用(案件期間中)',
                ] : [
                  'Political / religious / election advocacy (requires additional Legal review)',
                  'Competing category campaigns during the active window',
                ]} />

                <TierCard name="Exclusive" permitted={isJa ? [
                  'Campaign の範囲すべて',
                  '契約期間中のカテゴリ独占(例: 「女性用スニーカー 6ヶ月」)',
                  '最低契約期間 6ヶ月、6ヶ月単位で自動更新',
                ] : [
                  'Everything in Campaign',
                  'Category exclusivity for the contract duration (e.g. "women\'s sneakers for 6 months")',
                  'Minimum 6-month term, auto-renews in 6-month increments',
                ]} />
              </div>
            </Section>

            <Section num="§2" title="Duration & renewal" titleJa="期間・更新">
              <div className="overflow-x-auto -mx-6 md:mx-0">
                <table className="w-full min-w-[500px] text-sm border border-[#1A1A2E]">
                  <thead className="bg-[#0A0A0F] text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Tier</th>
                      <th className="text-left px-4 py-3 font-medium">{isJa ? '最低期間' : 'Min term'}</th>
                      <th className="text-left px-4 py-3 font-medium">{isJa ? '更新' : 'Renewal'}</th>
                      <th className="text-left px-4 py-3 font-medium">{isJa ? '解約通知' : 'Notice'}</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#9CA3AF]">
                    <tr className="border-t border-[#1A1A2E]"><td className="px-4 py-3">Standard</td><td className="px-4 py-3">1 month</td><td className="px-4 py-3">Monthly auto</td><td className="px-4 py-3">30 days</td></tr>
                    <tr className="border-t border-[#1A1A2E]"><td className="px-4 py-3">Extended</td><td className="px-4 py-3">1 month</td><td className="px-4 py-3">Monthly auto</td><td className="px-4 py-3">30 days</td></tr>
                    <tr className="border-t border-[#1A1A2E]"><td className="px-4 py-3">Campaign</td><td className="px-4 py-3">Per project</td><td className="px-4 py-3">—</td><td className="px-4 py-3">N/A</td></tr>
                    <tr className="border-t border-[#1A1A2E]"><td className="px-4 py-3">Exclusive</td><td className="px-4 py-3">6 months</td><td className="px-4 py-3">6-month auto</td><td className="px-4 py-3">90 days</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[#6B7280] mt-3">
                {isJa
                  ? 'すべての tier で、契約期間中のアップグレード(例: Standard → Extended)を日割り精算で受付。'
                  : 'All tiers support paid upgrade mid-term (e.g. Standard → Extended), prorated.'}
              </p>
            </Section>

            <Section num="§3" title="IP ownership" titleJa="知的財産権の帰属">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-[#1A1A2E] p-5 bg-[#0A0A0F]">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#00D4FF] mb-3">LUMINA owns</p>
                  <ul className="space-y-2 text-xs text-[#D1D5DB]">
                    <li>— {isJa ? 'モデルのアイデンティティ・名前・肖像・声・キャラクター属性' : "Model identity, name, visual likeness, voice, character attributes"}</li>
                    <li>— {isJa ? '学習・生成パイプラインと方法論' : 'Training pipelines and generation methodology'}</li>
                    <li>— {isJa ? 'ライセンシーによる後編集前の原始出力物' : 'Raw output prior to licensee post-production'}</li>
                  </ul>
                </div>
                <div className="border border-[#1A1A2E] p-5 bg-[#0A0A0F]">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#00D4FF] mb-3">Licensee owns</p>
                  <ul className="space-y-2 text-xs text-[#D1D5DB]">
                    <li>— {isJa ? '自社のガーメントデザイン・ロゴ・ブランド資産・コピー' : 'Their garment designs, logos, brand assets, and copy'}</li>
                    <li>— {isJa ? '自社が著作したキャンペーン・クリエイティブディレクション文書' : 'Campaign-specific creative direction they author'}</li>
                    <li>— {isJa ? '編集済みコンポジット(編集結果のみ、素材の権利は移転なし)' : 'Finished composite content (edited images/videos) — composite only, not underlying LUMINA asset'}</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-[#6B7280] mt-4">
                {isJa
                  ? 'LUMINA の権利は**当該法令上許容される最大範囲において**排他的に帰属する。'
                  : "LUMINA's rights vest exclusively to the extent permitted by applicable law."}
              </p>
            </Section>

            <Section num="§4" title="Revoke vs. survive" titleJa="権利の停止と存続">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6B7280] mb-2">
                    {isJa ? '解約・期限切れ時に消滅する権利' : 'Revoked on non-renewal / cancellation'}
                  </p>
                  <ul className="text-xs text-[#D1D5DB] space-y-1 pl-4">
                    <li>— {isJa ? '新規コンテンツ生成の権利' : 'Rights to generate new content featuring the model'}</li>
                    <li>— {isJa ? '既存コンテンツの契約範囲外への新規利用' : 'Rights to new uses of existing content outside the original engagement scope'}</li>
                    <li>— {isJa ? 'アクティブなパートナーシップとしての表示' : 'Right to claim current active partnership with the model'}</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6B7280] mb-2">
                    {isJa ? '解約後も継続利用できる範囲' : 'Survives (can continue to be used)'}
                  </p>
                  <ul className="text-xs text-[#D1D5DB] space-y-1 pl-4">
                    <li>— {isJa ? '既に公表済みコンテンツを原契約範囲で継続利用' : 'Content already published before termination, under the tier\'s original use-case scope'}</li>
                    <li>— {isJa ? '過去のマーケティング記録・アーカイブ' : 'Historical marketing materials / editorial archive'}</li>
                    <li>— {isJa ? '印刷済み物理素材(回収義務なし)' : 'Already-printed physical materials (no recall obligation)'}</li>
                  </ul>
                </div>
              </div>
            </Section>

            <Section num="§5" title="Dispute resolution" titleJa="紛争解決">
              <Ul items={isJa ? [
                '**準拠法: 日本法**',
                '**第一審: 東京地方裁判所**の専属的合意管轄',
                '事前交渉期間: 正式な法的手続き前に 30 日間の誠実協議',
              ] : [
                'Governing law: Japan',
                'Forum: Tokyo District Court (first instance), or Japan Commercial Arbitration Association (by mutual agreement)',
                'Pre-litigation: Mandatory 30-day good-faith negotiation period before formal action',
              ]} />
            </Section>

            <Section num="§6" title="How this differs from traditional agencies" titleJa="伝統的エージェンシーとの違い">
              <div className="overflow-x-auto -mx-6 md:mx-0">
                <table className="w-full min-w-[500px] text-sm border border-[#1A1A2E]">
                  <thead className="bg-[#0A0A0F] text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">{isJa ? '項目' : 'Aspect'}</th>
                      <th className="text-left px-4 py-3 font-medium">{isJa ? '伝統エージェンシー' : 'Traditional agency'}</th>
                      <th className="text-left px-4 py-3 font-medium text-[#FAFAFA]">LUMINA</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#9CA3AF]">
                    <tr className="border-t border-[#1A1A2E]"><td className="px-4 py-3">{isJa ? 'モデルの正体' : 'Model is'}</td><td className="px-4 py-3">{isJa ? '実在の人間' : 'A real person'}</td><td className="px-4 py-3">{isJa ? '架空キャラクター(IP)' : 'A fictional character (IP)'}</td></tr>
                    <tr className="border-t border-[#1A1A2E]"><td className="px-4 py-3">{isJa ? 'IP 帰属' : 'Who holds IP'}</td><td className="px-4 py-3">{isJa ? 'モデル + エージェンシー(分配)' : 'Model + agency (split)'}</td><td className="px-4 py-3">LUMINA ({isJa ? '単独' : 'sole'})</td></tr>
                    <tr className="border-t border-[#1A1A2E]"><td className="px-4 py-3">{isJa ? '実在人物模倣リスク' : 'Real-person impersonation risk'}</td><td className="px-4 py-3">{isJa ? '本質的(そもそも実在)' : 'Inherent (it IS a person)'}</td><td className="px-4 py-3">{isJa ? 'ゼロ(Ethics §3 で明示禁止)' : 'Zero (prohibited, Ethics §3)'}</td></tr>
                    <tr className="border-t border-[#1A1A2E]"><td className="px-4 py-3">{isJa ? '肖像権処理' : 'Name/likeness rights'}</td><td className="px-4 py-3">{isJa ? '法域ごとに複雑' : 'Complex per jurisdiction'}</td><td className="px-4 py-3">{isJa ? '契約上シンプル' : 'Contractually simple'}</td></tr>
                    <tr className="border-t border-[#1A1A2E]"><td className="px-4 py-3">{isJa ? '撮影同意書' : 'Release forms'}</td><td className="px-4 py-3">{isJa ? '撮影毎に必要' : 'Required per shoot'}</td><td className="px-4 py-3">{isJa ? '不要' : 'Not applicable'}</td></tr>
                  </tbody>
                </table>
              </div>
            </Section>
          </article>
        </div>
      </main>

      <LuminaFooter />
    </div>
  );
}

export default function IpLicensePage() {
  return (
    <LanguageProvider>
      <IpLicenseContent />
    </LanguageProvider>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Section({
  num,
  title,
  titleJa,
  children,
}: {
  num: string;
  title: string;
  titleJa?: string;
  children: React.ReactNode;
}) {
  const { lang } = useLang();
  return (
    <section>
      <div className="flex items-baseline gap-4 mb-5">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#00D4FF]">{num}</span>
        <h2 className="text-xl md:text-2xl font-semibold text-[#FAFAFA] tracking-tight">
          {lang === 'ja' && titleJa ? titleJa : title}
        </h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-[#D1D5DB]">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="text-[#6B7280] mt-1">—</span>
          <span
            dangerouslySetInnerHTML={{
              __html: item.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-[#FAFAFA]">$1</strong>'),
            }}
          />
        </li>
      ))}
    </ul>
  );
}

function TierCard({
  name,
  permitted,
  notPermitted,
}: {
  name: string;
  permitted: string[];
  notPermitted?: string[];
}) {
  return (
    <div className="border border-[#1A1A2E] p-5 md:p-6 bg-[#0A0A0F]">
      <h3 className="text-lg font-semibold text-[#FAFAFA] tracking-tight mb-4">{name}</h3>
      <div className="space-y-4 text-sm">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#00FF88]/80 mb-2">Permitted</p>
          <ul className="space-y-1.5 text-[#D1D5DB]">
            {permitted.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[#00FF88]/60 mt-1">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        {notPermitted && notPermitted.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#FF3366]/80 mb-2">Not permitted</p>
            <ul className="space-y-1.5 text-[#D1D5DB]">
              {notPermitted.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#FF3366]/60 mt-1">✗</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

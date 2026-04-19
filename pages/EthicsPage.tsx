/**
 * EthicsPage — /ethics route.
 * Renders the LUMINA AI Ethics Code publicly.
 * Source of truth: docs/design/ai-ethics-code.md (v0.2 CEO-approved).
 */

import { LanguageProvider, useLang } from '../contexts/LanguageContext';
import LuminaHeader from '../components/lumina/LuminaHeader';
import LuminaFooter from '../components/lumina/LuminaFooter';

function EthicsContent() {
  const { lang } = useLang();
  const isJa = lang === 'ja';

  return (
    <div className="min-h-screen bg-[#050508] text-[#FAFAFA] font-sans antialiased">
      <LuminaHeader />

      <main className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          {/* Header */}
          <header className="mb-16 pb-10 border-b border-[#1A1A2E]">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#6B7280] mb-4">
              LUMINA MODEL AGENCY
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
              AI Ethics Code
            </h1>
            <p className="text-sm md:text-base text-[#9CA3AF] mb-2">
              {isJa
                ? 'LUMINA が AI モデルをどう作り、貸し出し、引退させるかについての公的な約束。'
                : "LUMINA's public commitment on how we create, license, and retire our AI models."}
            </p>
            <div className="mt-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#6B7280]">
              <span>Version 0.2</span>
              <span className="h-3 w-px bg-[#1A1A2E]" />
              <span>Last updated: 2026-04-19</span>
              <span className="h-3 w-px bg-[#1A1A2E]" />
              <span className="text-[#FFB800]">Legal review in progress</span>
            </div>
          </header>

          {/* Body */}
          <article className="space-y-14 text-[15px] md:text-base leading-[1.85] text-[#D1D5DB]">

            <Section num="§0" title="Preamble" titleJa="前文">
              <P>
                {isJa
                  ? '本規範は、LUMINA MODEL AGENCY がAIモデルを「どう作り」「どう貸し出し」「どう引退させるか」の公的な約束です。内部ガイドラインではなく、契約前にブランド・報道・規制当局・消費者が検証できる形で公開します。'
                  : 'This code governs how LUMINA MODEL AGENCY creates, licenses, and deprecates its AI-generated models. It is a public commitment, not an internal guideline — published so brands, journalists, regulators, and end consumers can audit our practices before entering into any engagement.'}
              </P>
            </Section>

            <Section num="§1" title="How our models are created" titleJa="モデルの作り方">
              <Ul items={isJa ? [
                'すべての LUMINA モデルは**架空のキャラクター**。実在人物の複製ではない。',
                '学習・生成は、基盤モデル提供者(Google、Runway 等)との利用規約を遵守し、各プロバイダーによって合法的に提供された base model のみを使用。実在人物の同意なきデータセットは不使用。',
                'ディレクションは LUMINA クリエイティブディレクター(KOZUKI TAKAHIRO)、または協業者(例: BEDWIN Masafumi Watanabe 氏 for LUCAS MORI)の書面共同ディレクションによる。',
                '各モデルは Character Bible(容姿・プロポーション・スタイリング・声質・振る舞いの仕様)に従って生成される。Bible は生成時の唯一の真実の源。',
              ] : [
                'Every LUMINA model is a **fictional character** built from original creative direction, not a digital replica of any real person.',
                'Training and generation use base models provided lawfully by their providers (Google, Runway, etc.) under their respective terms of service. We do not ingest non-consensual datasets of real individuals.',
                "Character direction is authored by LUMINA's creative director (KOZUKI TAKAHIRO) or, where a third party is creatively involved (e.g. BEDWIN's Masafumi Watanabe for LUCAS MORI), with their written co-direction.",
                'Each model has a documented Character Bible specifying appearance, proportion, styling, voice quality, and behavioural norms. The Bible is the single source of truth during generation.',
              ]} />
            </Section>

            <Section num="§2" title="Likeness, consent & IP" titleJa="肖像・同意・知的財産権">
              <Ul items={isJa ? [
                '**当該法令上許容される最大範囲において**、LUMINA は各モデルのアイデンティティ・名前・肖像・声・キャラクター属性に関する著作権・キャラクター権・その他の知的財産権を全世界・永続的に保有する。',
                'クライアントは**使用ライセンス**のみ取得する。モデルの IP は取得しない。範囲は tier 別(Standard/Extended/Campaign/Exclusive)に定義。',
                'クライアント提供の商品・ロゴ・クリエイティブはクライアント帰属。LUMINA の利用権は契約範囲内に限定。',
                'Exclusive 契約期間中、同カテゴリ内の他社への転売・サブライセンス・移転は禁止。',
              ] : [
                'To the extent permitted by applicable law, LUMINA owns the copyright, character rights, and other intellectual property rights in each model\'s identity, name, visual likeness, voice, and character attributes, worldwide and in perpetuity.',
                'Brands that license a LUMINA model receive a usage license — they do not acquire the model\'s IP. Exact scope is defined per tier (Standard / Extended / Campaign / Exclusive).',
                'If a client provides original garments, brand logos, or brand-specific creative, their IP remains theirs. Our license to display those inputs is limited to the engagement\'s scope.',
                'We do not sell, sub-license, or transfer models between clients within the same Exclusive category period.',
              ]} />
            </Section>

            <Section num="§3" title="Real-person impersonation — banned" titleJa="実在人物の模倣は禁止">
              <Ul items={isJa ? [
                'LUMINA モデルは**実在人物(存命・故人問わず)と識別可能な類似を禁止**。',
                '以下のクライアントブリーフは受諾しない: 特定の有名人・アスリート・公人の再現 / 書面同意のない社員・役員・顧客の類似 / あらゆる形態のディープフェイク。',
                '生成が偶発的に実在人物へ収束した場合は**廃棄・再生成**。定期的な逆画像検索による監査を実施。',
                '民族・地域・アーキタイプ参照(例: 「スカンジナビアンエディトリアル」「東京ストリート」)は**スタイル指定**として許容。特定個人ではない。',
              ] : [
                'LUMINA models must not resemble any identifiable real person (living or deceased) to a degree that a reasonable viewer could confuse the two.',
                'We do not accept client briefs that ask us to: replicate a specific celebrity, athlete, or public figure; generate a model that looks like a named employee, executive, or customer without explicit written consent; produce deepfakes of any kind.',
                'If a generation accidentally converges on a real-person likeness, we retire the generation and regenerate. We conduct periodic reverse-image audits.',
                'Ethnic, regional, or archetypal references (e.g. "Scandinavian editorial", "Tokyo street") are permitted as style guidance — they describe a look, not a specific person.',
              ]} />
            </Section>

            <Section num="§4" title="Brand safety guidelines" titleJa="ブランドセーフティ">
              <P>{isJa ? 'LUMINA モデルは以下の用途で使用不可:' : 'LUMINA models may not be used in content that:'}</P>
              <Ul items={isJa ? [
                '違法行為・ヘイトスピーチ・ハラスメントの助長',
                '未成年または未成年に見える描写での性的コンテンツ(**ゼロトレランス**)',
                '非同意の性的コンテンツ・性暴力・強要(**禁止**)',
                '政治キャンペーン・選挙運動・宗教改宗 — Campaign tier + Legal 審査経由のみ',
                '武器・違法薬物・未成年対象ギャンブル',
                '医療・ワクチン・選挙の誤情報',
                '医薬品・金融商品・仮想通貨・投資勧誘(景表法・薬機法等、業界別の追加審査が必要)',
                '主要広告プラットフォーム(Meta/Google/TikTok 等、最新版ポリシー)のブランドセーフティ違反',
              ] : [
                'Promotes illegal activity, hate speech, or harassment of any protected group',
                'Depicts sexual content involving minors or anyone appearing to be a minor (zero tolerance)',
                'Non-consensual sexual content, sexual violence, or coercion (prohibited)',
                'Political campaigns, election advocacy, or religious conversion — available only via explicit Campaign-tier contract with Legal review',
                'Weapons sales, illegal drugs, gambling targeted at minors',
                'Health/vaccine/election misinformation',
                'Pharmaceuticals, financial products, cryptocurrency, or investment solicitation (subject to additional industry-specific review under Japanese consumer/pharmaceutical laws)',
                'Content violating the brand-safety policies of Meta, Google, TikTok, and equivalent platforms (as updated from time to time)',
              ]} />
              <P className="mt-4">
                {isJa
                  ? '成人向け(18+)ファッション/エディトリアル(下着・水着等)は、適切な tier 契約 + 配信先での年齢確認のもと許容。'
                  : 'Adult (18+) fashion/editorial work (e.g. lingerie, swimwear) is permitted under appropriate tier contracts with age verification on publishing platforms.'}
              </P>
            </Section>

            <Section num="§5" title="Transparency obligations" titleJa="透明性">
              <Ul items={isJa ? [
                'ブランドは消費者への AI 使用開示**義務なし**(LUMINA モデルは架空キャラクターで「実在撮影の虚偽」が存在しないため)。',
                '自発開示希望ブランドには EU AI Act §50 ベースの開示テンプレート提供。',
                'LUMINA 自身は `/ethics` `/about` および広報で AI 使用を明示。隠さない。',
                'ブランドは「実在の人間モデル」と**虚偽表示してはならない**(景品表示法 優良誤認防止)。',
              ] : [
                'Brands are not required to disclose AI usage to consumers, because LUMINA models are fictional characters — there is no deception of "a real person being photographed" to reveal.',
                'LUMINA provides a disclosure statement template for brands that choose voluntary transparency, aligned with EU AI Act §50 best practice.',
                'LUMINA itself discloses AI usage on /ethics, /about, and in press materials. We do not hide what we do.',
                'Brands must not claim that a LUMINA model is a "real human model" in marketing copy.',
              ]} />
            </Section>

            <Section num="§6" title="Data handling & client confidentiality" titleJa="データ取扱い・秘密保持">
              <Ul items={isJa ? [
                'クライアントブリーフ・商品画像・未発売素材は保管時(AES-256)・通信時(TLS 1.3)暗号化。',
                'ブリーフ共有前に**相互 NDA 標準締結**。',
                '提供素材は**契約用途のみに使用**、プロジェクト完了から原則 90 日以内に削除(書面合意があれば最長 24 ヶ月)。',
                'クライアント提供素材での独自モデル学習は行わない。',
                'データ所在地: 日本(Supabase Japan リージョン)。推論時に第三者プロバイダ(Google Gemini / Runway、米国サーバー経由)を使用。各社 DPA に準拠。',
              ] : [
                'Client briefs, product images, and unreleased collection materials are encrypted at rest (AES-256) and in transit (TLS 1.3).',
                'We sign a mutual NDA as standard before any brief is shared.',
                'Client-provided content is used only for the contracted engagement and deleted within 90 days of project completion unless extended in writing (up to 24 months max).',
                'LUMINA does not train any proprietary model on client-provided content.',
                'Data residency: Japan (Supabase Japan region). Inference may route through third-party providers (Google Gemini, Runway — US servers) under their contractual data-processing terms.',
              ]} />
            </Section>

            <Section num="§7" title="Model lifecycle & retirement" titleJa="モデルのライフサイクル・引退">
              <Ul items={isJa ? [
                '引退理由: Character Bible の抜本改訂、倫理的リスク顕在化、共同ディレクターの離脱、等',
                '活動中ライセンシーへは**60 日前通知**',
                '既納品コンテンツは原契約条件で継続利用可(遡及取消なし)',
                '引退モデルの名前・ビジュアルは**永久凍結**(復活・サブブランド再利用なし)',
                'Exclusive tier は契約期間中のモデル継続性を保証',
              ] : [
                'Retirement triggers: fundamental Character Bible revision, emerging ethical risk, withdrawal of a co-director, etc.',
                'Active licensees are notified 60 days in advance',
                'Already-delivered content remains licensed under the original terms (no retroactive revocation)',
                "Retired model's name and visual assets are permanently shelved — no revival, no sub-brand re-use",
                'Exclusive tier contracts include model-continuity guarantees for the contracted period',
              ]} />
            </Section>

            <Section num="§8" title="Human oversight & editorial control" titleJa="人間による監視・編集管理">
              <Ul items={isJa ? [
                'すべての生成は納品前に人間エディターがレビュー',
                '2段階品質ゲート: Tier 1 (自動) = 解析QA + 生成QA / Tier 2 (人間) = クリエイティブディレクター審査(キャラ一貫性+ブランドセーフティ)',
                'クライアントは納品物に対し異議申立可能。契約枠内で追加料金なしで再生成。',
              ] : [
                'Every LUMINA model generation is reviewed by a human editor before delivery.',
                'Two-tier quality gate: Tier 1 (Automated) = garment analysis QA + generation QA | Tier 2 (Human) = creative director review for character consistency + brand safety.',
                'Clients may appeal any delivery — we regenerate at no additional cost within the contracted quota.',
              ]} />
            </Section>

            <Section num="§9" title="Reporting concerns" titleJa="通報窓口">
              <P>
                {isJa
                  ? '本規範違反の疑い、または実在人物類似の発見があった場合:'
                  : 'If you believe a LUMINA model has been misused, resembles a real person, or violates this code:'}
              </P>
              <div className="mt-4 p-5 bg-[#0A0A0F] border border-[#1A1A2E] text-sm">
                <a
                  href="mailto:kozuki@tomorrowproof-ai.com"
                  className="text-[#00D4FF] hover:underline"
                >
                  kozuki@tomorrowproof-ai.com
                </a>
                <p className="mt-2 text-xs text-[#9CA3AF]">
                  {isJa
                    ? '初回受領確認 48 営業時間内 · 解決 14 日以内'
                    : 'Initial acknowledgment within 48 business hours · resolution within 14 days'}
                </p>
              </div>
            </Section>

            <Section num="§10" title="Changes to this code" titleJa="本規範の変更">
              <Ul items={isJa ? [
                'バージョン管理:重要変更は 30 日前告知 + ページ下部 changelog 公開',
                '軽微な編集修正は告知なしで実施可。ただし変更履歴は changelog に保持。',
                'バージョン履歴・最終更新日はページ上部に常時表示。',
              ] : [
                'Versioned. Material changes are announced 30 days in advance to active licensees and published in the changelog at the bottom of this page.',
                'Minor editorial clarifications (non-material) may be made without notice, with redlines preserved in the changelog.',
                'Version history and last-updated date are permanently shown at the top of the public page.',
              ]} />
            </Section>

            {/* Changelog */}
            <div className="pt-10 border-t border-[#1A1A2E]">
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#6B7280] mb-4">
                {isJa ? '変更履歴' : 'Changelog'}
              </h2>
              <table className="w-full text-xs text-[#9CA3AF]">
                <thead className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">
                  <tr>
                    <th className="text-left py-2 pr-4">Version</th>
                    <th className="text-left py-2 pr-4">Date</th>
                    <th className="text-left py-2 pr-4">Changes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#1A1A2E]">
                    <td className="py-3 pr-4">v0.1</td>
                    <td className="py-3 pr-4">2026-04-19</td>
                    <td className="py-3 pr-4">Initial draft</td>
                  </tr>
                  <tr className="border-t border-[#1A1A2E]">
                    <td className="py-3 pr-4 text-[#FAFAFA]">v0.2</td>
                    <td className="py-3 pr-4">2026-04-19</td>
                    <td className="py-3 pr-4">CEO approved; Legal review in progress</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </main>

      <LuminaFooter />
    </div>
  );
}

export default function EthicsPage() {
  return (
    <LanguageProvider>
      <EthicsContent />
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
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#00D4FF]">
          {num}
        </span>
        <h2 className="text-xl md:text-2xl font-semibold text-[#FAFAFA] tracking-tight">
          {lang === 'ja' && titleJa ? titleJa : title}
        </h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function P({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[#D1D5DB] ${className}`}>{children}</p>;
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

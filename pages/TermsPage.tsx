/**
 * TermsPage.tsx — LUMINA STUDIO 利用規約
 */

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/pricing" className="text-xs text-gray-500 hover:text-gray-300 mb-8 inline-block">← Back</a>
        <h1 className="text-2xl font-semibold mb-8">利用規約</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 text-sm leading-relaxed">

          <p>本利用規約（以下「本規約」）は、株式会社TomorrowProof（以下「当社」）が提供するLUMINA STUDIO及びLUMINA MODEL AGENCY（以下「本サービス」）の利用条件を定めるものです。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">第1条（適用）</h2>
          <p>本規約は、本サービスの利用に関する当社とユーザーとの間の一切の関係に適用されます。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">第2条（サービス内容）</h2>
          <p>本サービスは、AI技術を用いたファッション商品画像の生成サービス（LUMINA STUDIO）及びAIモデルの提供・ライセンスサービス（LUMINA MODEL AGENCY）を提供します。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">第3条（アカウント）</h2>
          <p>1. ユーザーは正確な情報を提供してアカウントを登録するものとします。</p>
          <p>2. アカウント情報の管理はユーザーの責任とし、第三者への譲渡・貸与は禁止します。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">第4条（料金・契約締結・支払い）</h2>
          <p>1. 本サービスの料金は、以下の2区分から構成されます。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>(a) <strong>Studio Self-Serve 利用料</strong> — 個人・小規模事業者向けの月額サブスクリプション。Stripe 決済により即時ご利用開始いただけます。</li>
            <li>(b) <strong>LUMINA MODEL AGENCY モデル使用ライセンス料</strong>（Standard / Extended / Campaign / Exclusive）— 法人・ブランド向けの B2B 契約。</li>
          </ul>
          <p>2. モデル使用ライセンス（(b)）のご契約は、以下のフローで締結します。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>当社 HP(`/for-brands`)のお問い合わせフォームまたはメールにてご連絡</li>
            <li>当社 Sales によるお打ち合わせ（Google Meet 30分）でブリーフ・使用媒体・期間・希望モデルを確認</li>
            <li>当社より提案書・見積書をご送付</li>
            <li>お客様からのご承諾（メール返信または注文書）により契約成立</li>
            <li>当社が freee 経由で請求書を発行し、記載の銀行口座へお振込いただきます</li>
          </ul>
          <p>3. モデル使用ライセンス料は、指名するモデル・ライセンス種別・契約期間に応じて個別契約書または当社提案書に明示されます。</p>
          <p>4. 請求書の支払い期日は、別段の合意がない限り請求書発行日から 30 日以内の銀行振込とします。</p>
          <p>5. 支払い遅延の場合、年 14.6% の遅延損害金を請求できるものとします。</p>
          <p>6. 月途中での解約による日割り返金は行いません。解約希望の場合、30 日前までに書面または電子メールで通知するものとします。</p>
          <p>7. Campaign / Exclusive ライセンスに関する契約条件は、案件毎に当社と別途個別契約書を締結します。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">第5条（生成画像の権利）</h2>
          <p>1. 本サービスで生成された画像の著作権は、ユーザーが創作的に関与した範囲において、ユーザーに帰属します。</p>
          <p>2. ただし、画像に含まれるAIモデルの肖像に関する権利は当社に帰属し、モデル使用ライセンス契約に基づいてのみ使用できます。</p>
          <p>3. ライセンス契約で許諾された範囲を超える使用（SNS・広告等）は別途ライセンス契約が必要です。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">第6条（モデル使用ライセンス）</h2>
          <p>1. 有料プランのユーザーは、契約したモデルのみ使用できます。</p>
          <p>2. ライセンス種別（Standard/Extended/Campaign/Exclusive）に応じて使用可能な媒体が異なります。</p>
          <p>3. Exclusiveライセンスを除き、同一モデルを複数のユーザーが同時に使用することがあります。</p>
          <p>4. ライセンス契約終了後は、生成済み画像の新規使用を停止するものとします。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">第7条（禁止事項）</h2>
          <p>以下の行為を禁止します：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>生成画像を政治活動、宗教活動、アダルトコンテンツに使用すること</li>
            <li>モデルの名誉・信用を毀損する態様での使用</li>
            <li>生成画像の第三者への再ライセンス・転売</li>
            <li>サービスのリバースエンジニアリング</li>
            <li>不正なAPI利用、過度なリクエスト</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">第8条（免責事項）</h2>
          <p>1. 当社は、生成物に対し合理的な品質ゲート（自動解析およびクリエイティブディレクターによる人間レビュー）を実施します。ただし、AI技術の特性上、生成結果の完全な品質を保証するものではありません。</p>
          <p>2. 生成画像が第三者の権利を侵害しないことを保証するものではありませんが、当社は実在人物への類似収束の防止等、合理的な注意義務を尽くします。</p>
          <p>3. サービスの中断・停止に伴う損害について、当社の故意または重大な過失がある場合を除き、当社は責任を負いません。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">第9条（規約の変更）</h2>
          <p>当社は本規約を変更できるものとし、変更後の規約は本サービス上で公表した時点で効力を生じます。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">第10条（準拠法・管轄）</h2>
          <p>本規約の解釈は日本法に準拠し、紛争の管轄裁判所は東京地方裁判所とします。</p>

          <p className="text-gray-500 mt-12">制定日: 2026年3月23日<br />改訂日: 2026年4月20日（第4条 契約・支払いフロー更新、第8条 免責の整合修正）<br />株式会社TomorrowProof</p>
        </div>
      </div>
    </div>
  );
}

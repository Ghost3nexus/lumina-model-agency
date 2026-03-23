/**
 * LegalPage.tsx — 特定商取引法に基づく表記 + AI生成画像免責事項
 */

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/pricing" className="text-xs text-gray-500 hover:text-gray-300 mb-8 inline-block">← Back</a>

        {/* ── 特定商取引法表記 ── */}
        <h1 className="text-2xl font-semibold mb-8">特定商取引法に基づく表記</h1>
        <div className="text-sm text-gray-300 leading-relaxed mb-16">
          <table className="w-full border-collapse">
            <tbody className="divide-y divide-gray-800">
              <tr><td className="py-3 pr-4 text-gray-500 whitespace-nowrap align-top w-40">販売事業者</td><td className="py-3">株式会社TomorrowProof</td></tr>
              <tr><td className="py-3 pr-4 text-gray-500 whitespace-nowrap align-top">代表者</td><td className="py-3">KOZUKI TAKAHIRO</td></tr>
              <tr><td className="py-3 pr-4 text-gray-500 whitespace-nowrap align-top">所在地</td><td className="py-3">お問い合わせいただいた方に遅滞なく開示いたします</td></tr>
              <tr><td className="py-3 pr-4 text-gray-500 whitespace-nowrap align-top">連絡先</td><td className="py-3">info@tomorrowproof.co.jp</td></tr>
              <tr><td className="py-3 pr-4 text-gray-500 whitespace-nowrap align-top">販売価格</td><td className="py-3">各プランの価格はプライシングページに表示の通り（税込）</td></tr>
              <tr><td className="py-3 pr-4 text-gray-500 whitespace-nowrap align-top">支払方法</td><td className="py-3">クレジットカード（Stripe経由）</td></tr>
              <tr><td className="py-3 pr-4 text-gray-500 whitespace-nowrap align-top">支払時期</td><td className="py-3">サブスクリプション開始時及び毎月の更新日</td></tr>
              <tr><td className="py-3 pr-4 text-gray-500 whitespace-nowrap align-top">サービス提供時期</td><td className="py-3">決済完了後、直ちにサービスをご利用いただけます</td></tr>
              <tr><td className="py-3 pr-4 text-gray-500 whitespace-nowrap align-top">返品・キャンセル</td><td className="py-3">デジタルサービスの性質上、サービス提供後の返金は原則行いません。月途中の解約の場合、当月末までご利用いただけます。</td></tr>
              <tr><td className="py-3 pr-4 text-gray-500 whitespace-nowrap align-top">動作環境</td><td className="py-3">最新版のChrome、Safari、Edge、Firefox。インターネット接続が必要です。</td></tr>
            </tbody>
          </table>
        </div>

        {/* ── AI生成画像に関する免責事項 ── */}
        <h1 className="text-2xl font-semibold mb-8">AI生成画像に関する免責事項</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 text-sm leading-relaxed">

          <h2 className="text-lg font-semibold text-gray-100 mt-8">1. AI生成の特性</h2>
          <p>本サービスで生成される画像は、AIモデル（Google Gemini）による自動生成です。生成結果は毎回異なり、同一の入力から同一の出力が得られることを保証するものではありません。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">2. 品質保証の限界</h2>
          <p>当社は生成画像の品質向上に努めますが、以下の事象が発生する可能性があります：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>商品の色味・素材感・ディテールが実物と異なる場合</li>
            <li>モデルの手指・顔・体型に不自然な表現が含まれる場合</li>
            <li>ライティングや背景が意図した通りにならない場合</li>
          </ul>
          <p>生成画像のEC商品ページ等への使用は、ユーザーの判断と責任において行うものとします。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">3. 知的財産権に関する注意</h2>
          <p>1. 生成画像が既存の著作物・商標・デザインに類似する可能性があります。ユーザーは使用前に類似性を確認する責任を負います。</p>
          <p>2. 当社のAIモデルの外観は架空のものであり、実在する人物との類似は意図されたものではありません。</p>
          <p>3. プロンプトに特定のブランド名を含めて生成した画像を商用利用する場合、当該ブランドの商標権に留意してください。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">4. AIモデルの権利</h2>
          <p>本サービスで提供されるAIモデル（ELENA、IDRIS、MIKU等）の肖像に関する一切の権利は当社に帰属します。モデルの画像を無断で複製・改変・再配布することは禁止します。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">5. 免責</h2>
          <p>当社は、生成画像の使用に起因するユーザーまたは第三者の損害について、当社の故意または重過失による場合を除き、責任を負いません。</p>

          <p className="text-gray-500 mt-12">制定日: 2026年3月23日<br />株式会社TomorrowProof</p>
        </div>
      </div>
    </div>
  );
}

/**
 * PrivacyPage.tsx — プライバシーポリシー
 */

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/pricing" className="text-xs text-gray-500 hover:text-gray-300 mb-8 inline-block">← Back</a>
        <h1 className="text-2xl font-semibold mb-8">プライバシーポリシー</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 text-sm leading-relaxed">

          <p>株式会社TomorrowProof（以下「当社」）は、LUMINA STUDIO及びLUMINA MODEL AGENCY（以下「本サービス」）における個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">1. 収集する情報</h2>
          <p>当社は以下の情報を収集します：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>メールアドレス（アカウント登録時）</li>
            <li>氏名（Google OAuth利用時に取得される場合）</li>
            <li>決済情報（Stripeを通じて処理。当社はカード番号を直接保持しません）</li>
            <li>アップロードされた商品画像（画像生成処理のため一時的に使用）</li>
            <li>利用ログ（サービス改善のため）</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">2. 利用目的</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>本サービスの提供・運営</li>
            <li>アカウント管理・認証</li>
            <li>料金請求・決済処理</li>
            <li>サービスの改善・新機能の開発</li>
            <li>お問い合わせへの対応</li>
            <li>利用規約違反の調査</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">3. 第三者提供</h2>
          <p>当社は、以下の場合を除き、個人情報を第三者に提供しません：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>サービス提供に必要な業務委託先（Supabase、Stripe、Google Cloud）への提供</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">4. 外部サービス</h2>
          <p>本サービスは以下の外部サービスを利用しています：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Supabase</strong>: 認証・データベース（プライバシーポリシー: supabase.com/privacy）</li>
            <li><strong>Stripe</strong>: 決済処理（プライバシーポリシー: stripe.com/privacy）</li>
            <li><strong>Google Cloud (Gemini API)</strong>: AI画像生成（プライバシーポリシー: cloud.google.com/terms/cloud-privacy-notice）</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">5. アップロード画像の取扱い</h2>
          <p>1. ユーザーがアップロードした商品画像は、画像生成処理のためにGoogle Gemini APIに送信されます。</p>
          <p>2. アップロード画像は当社サーバーに永続的に保存されません。</p>
          <p>3. 当社はアップロード画像を、ユーザーの許可なくマーケティングやAIモデルの学習に使用しません。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">6. データの保護</h2>
          <p>当社は、個人情報の漏洩・滅失・毀損の防止のため、適切な安全管理措置を講じます。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">7. 開示・訂正・削除の請求</h2>
          <p>ユーザーは、自己の個人情報について開示・訂正・削除を請求することができます。info@tomorrowproof.co.jp までご連絡ください。</p>

          <h2 className="text-lg font-semibold text-gray-100 mt-8">8. ポリシーの変更</h2>
          <p>当社は本ポリシーを変更できるものとし、変更後は本サービス上で公表します。</p>

          <p className="text-gray-500 mt-12">制定日: 2026年3月23日<br />株式会社TomorrowProof<br />info@tomorrowproof.co.jp</p>
        </div>
      </div>
    </div>
  );
}

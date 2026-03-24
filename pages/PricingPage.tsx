/**
 * PricingPage.tsx — LUMINA STUDIO + MODEL AGENCY pricing
 *
 * Two sections:
 * 1. Studio Plans (tool usage)
 * 2. Model Licensing (per-model fees)
 */

import { useAuth } from '../contexts/AuthContext';

// ─── Studio Plans ────────────────────────────────────────────────────────────

const STUDIO_PLANS = [
  {
    name: 'Free',
    price: '¥0',
    period: '',
    credits: '5枚/月',
    model: '全モデル開放',
    features: ['HD解像度', '4アングル生成', 'ZIPダウンロード'],
    cta: 'Get Started',
    href: '/',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '¥4,980',
    period: '/月',
    credits: '30枚/月',
    model: '指名モデルのみ',
    features: ['HD解像度', '4アングル生成', 'ZIPダウンロード', '複数画像アップロード', 'メールサポート'],
    cta: 'Subscribe',
    href: 'https://buy.stripe.com/test_00w7sEa0w5bC99zeB35os00',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '¥14,800',
    period: '/月',
    credits: '100枚/月',
    model: '指名モデルのみ',
    features: ['2K解像度', '4アングル生成', 'ZIPダウンロード', '複数画像アップロード', '優先サポート', 'バッチ生成'],
    cta: 'Subscribe',
    href: 'https://buy.stripe.com/test_bJe14gc8EcE471reB35os01',
    highlight: true,
  },
  {
    name: 'Business',
    price: '¥49,800',
    period: '/月',
    credits: '500枚/月',
    model: '指名モデルのみ',
    features: ['4K解像度', '4アングル生成', 'ZIPダウンロード', '複数画像アップロード', '専任サポート', 'バッチ生成', 'API アクセス'],
    cta: 'Subscribe',
    href: 'https://buy.stripe.com/test_14AeV6a0weMc2Lb8cF5os02',
    highlight: false,
  },
];

// ─── Model Licensing ─────────────────────────────────────────────────────────

const MODEL_LICENSES = [
  {
    name: 'Standard',
    price: '¥5,000',
    period: '/月/体',
    scope: 'EC商品ページ',
    description: 'EC商品ページでの使用。自社オンラインストアの商品画像として利用可能。',
    features: ['EC商品ページ使用', '非独占', '月額更新', '日本国内'],
  },
  {
    name: 'Extended',
    price: '¥15,000',
    period: '/月/体',
    scope: 'EC + SNS + Web',
    description: 'EC商品ページに加え、SNS投稿やWebサイトでの使用が可能。',
    features: ['EC + SNS + Web使用', '非独占', '月額更新', '日本国内', 'クレジット表記必須'],
  },
  {
    name: 'Campaign',
    price: '¥50,000〜',
    period: '/案件',
    scope: '広告・印刷・動画',
    description: 'バナー広告、LP、プリント広告、動画等のキャンペーン起用。',
    features: ['全媒体対応', '非独占', '案件単位契約', '使用地域指定', 'クレジット表記必須'],
  },
  {
    name: 'Exclusive',
    price: '¥200,000〜',
    period: '/月/体',
    scope: 'カテゴリ独占',
    description: '特定カテゴリでのモデル独占使用権。競合他社はこのモデルを使用不可。',
    features: ['全媒体対応', 'カテゴリ独占', '月額更新', '地域指定可能', 'クレジット表記必須'],
  },
];

// ─── Checkmark ───────────────────────────────────────────────────────────────

function Check() {
  return (
    <svg className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" viewBox="0 0 14 14" fill="none">
      <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PricingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050508] text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <a href="/" className="text-base font-bold tracking-tight text-gray-100">LUMINA</a>
        <div className="flex items-center gap-4">
          <a href="/agency" className="text-xs text-gray-500 hover:text-gray-300 transition-colors tracking-wider">AGENCY</a>
          <a href="/studio" className="text-xs text-gray-500 hover:text-gray-300 transition-colors tracking-wider">STUDIO</a>
        </div>
      </header>

      {/* ── Section 1: Studio Plans ── */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Pricing</h1>
        <p className="text-sm text-gray-400 max-w-lg mx-auto mb-2">
          Professional AI fashion photography at a fraction of traditional production costs.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-6">
        <h2 className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-6">Studio Plans — Tool Usage</h2>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STUDIO_PLANS.map(plan => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-xl border p-6 ${
              plan.highlight ? 'border-cyan-500 bg-cyan-500/5' : 'border-gray-800 bg-gray-900/30'
            }`}
          >
            <div className="mb-4">
              {plan.highlight && (
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mb-2">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
            </div>
            <div className="mb-1">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-sm text-gray-500">{plan.period}</span>
            </div>
            <p className="text-xs text-gray-500">{plan.credits}</p>
            <p className="text-xs text-cyan-400/70 mb-6">{plan.model}</p>
            <a
              href={plan.name === 'Free' && user ? plan.href : plan.name === 'Free' ? '/login' : plan.href}
              className={`block w-full py-2.5 rounded-lg text-center text-sm font-semibold transition-colors mb-6 ${
                plan.highlight ? 'bg-cyan-500 text-gray-950 hover:bg-cyan-400' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
              }`}
            >
              {plan.cta}
            </a>
            <ul className="flex-1 space-y-2.5">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-gray-400"><Check />{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Section 2: Model Licensing ── */}
      <div className="border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-6">
          <h2 className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-2">Model Licensing — Per Model Fee</h2>
          <p className="text-sm text-gray-400 max-w-2xl">
            有料プランではモデル指名制です。使用したいモデルを契約し、用途に応じたライセンスをお選びください。
            Free プランでは全モデルをお試しいただけます。
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODEL_LICENSES.map(lic => (
            <div key={lic.name} className="flex flex-col rounded-xl border border-gray-800 bg-gray-900/30 p-6">
              <h3 className="text-lg font-semibold mb-1">{lic.name}</h3>
              <div className="mb-1">
                <span className="text-2xl font-bold">{lic.price}</span>
                <span className="text-xs text-gray-500">{lic.period}</span>
              </div>
              <p className="text-xs text-cyan-400/70 mb-3">{lic.scope}</p>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">{lic.description}</p>
              <a
                href="mailto:info@tomorrowproof.co.jp?subject=Model Licensing Inquiry"
                className="block w-full py-2.5 rounded-lg bg-gray-800 text-gray-200 text-center text-sm font-semibold hover:bg-gray-700 transition-colors mb-6"
              >
                Contact Us
              </a>
              <ul className="flex-1 space-y-2.5">
                {lic.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-400"><Check />{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cost Comparison ── */}
      <div className="border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-xl font-semibold mb-8">Traditional vs LUMINA</h2>
          <div className="grid grid-cols-2 gap-6 text-left">
            <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Traditional Photography</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex justify-between"><span>Studio rental</span><span className="text-gray-200">¥30,000-100,000/回</span></div>
                <div className="flex justify-between"><span>Model fee</span><span className="text-gray-200">¥20,000-100,000/回</span></div>
                <div className="flex justify-between"><span>Photographer</span><span className="text-gray-200">¥30,000-80,000/回</span></div>
                <div className="flex justify-between"><span>Retouching</span><span className="text-gray-200">¥5,000-20,000/枚</span></div>
                <div className="flex justify-between border-t border-gray-800 pt-3 text-gray-200 font-semibold"><span>Total</span><span>¥85,000-300,000/回</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-6">
              <h3 className="text-xs text-cyan-400 uppercase tracking-wider mb-4">LUMINA</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex justify-between"><span>Studio (Starter)</span><span className="text-gray-200">¥4,980/月</span></div>
                <div className="flex justify-between"><span>Model (Standard)</span><span className="text-gray-200">¥5,000/月/体</span></div>
                <div className="flex justify-between"><span>30 images included</span><span className="text-gray-200">¥0</span></div>
                <div className="flex justify-between"><span>Retouching</span><span className="text-gray-200">¥0</span></div>
                <div className="flex justify-between border-t border-gray-800 pt-3 text-cyan-400 font-semibold"><span>Total</span><span>¥9,980/月</span></div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6">Save up to <span className="text-cyan-400 font-semibold">90%</span> on fashion photography costs</p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">by TomorrowProof Inc.</p>
          <div className="flex items-center gap-4">
            <a href="/terms" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Terms</a>
            <a href="/privacy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy</a>
            <a href="/legal" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Legal</a>
          </div>
        </div>
      </div>
    </div>
  );
}

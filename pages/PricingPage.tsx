/**
 * PricingPage.tsx — LUMINA STUDIO pricing plans
 */

import { useAuth } from '../contexts/AuthContext';

// ─── Plan data ───────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: 'Free',
    price: '¥0',
    period: '',
    credits: '5枚/月',
    features: [
      'HD解像度',
      '4アングル生成',
      'モデル全員利用可能',
      'ZIPダウンロード',
    ],
    cta: 'Get Started',
    href: '/',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '¥4,980',
    period: '/月',
    credits: '30枚/月',
    features: [
      'HD解像度',
      '4アングル生成',
      'モデル全員利用可能',
      'ZIPダウンロード',
      '複数画像アップロード',
      'メールサポート',
    ],
    cta: 'Subscribe',
    href: 'https://buy.stripe.com/test_00w7sEa0w5bC99zeB35os00',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '¥14,800',
    period: '/月',
    credits: '100枚/月',
    features: [
      '2K解像度',
      '4アングル生成',
      'モデル全員利用可能',
      'ZIPダウンロード',
      '複数画像アップロード',
      '優先サポート',
      'バッチ生成',
    ],
    cta: 'Subscribe',
    href: 'https://buy.stripe.com/test_bJe14gc8EcE471reB35os01',
    highlight: true,
  },
  {
    name: 'Business',
    price: '¥49,800',
    period: '/月',
    credits: '500枚/月',
    features: [
      '4K解像度',
      '4アングル生成',
      'モデル全員利用可能',
      'ZIPダウンロード',
      '複数画像アップロード',
      '専任サポート',
      'バッチ生成',
      'API アクセス',
      'カスタムモデル対応',
    ],
    cta: 'Subscribe',
    href: 'https://buy.stripe.com/test_14AeV6a0weMc2Lb8cF5os02',
    highlight: false,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function PricingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050508] text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <a href="/" className="text-base font-bold tracking-tight text-gray-100">LUMINA STUDIO</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="/agency" className="text-xs text-gray-500 hover:text-gray-300 transition-colors tracking-wider">AGENCY</a>
          <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors tracking-wider">STUDIO</a>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          Choose your plan
        </h1>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          Professional AI fashion photography at a fraction of traditional production costs.
          Start free, upgrade when you need more.
        </p>
      </div>

      {/* Plans grid */}
      <div className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map(plan => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-xl border p-6 ${
              plan.highlight
                ? 'border-cyan-500 bg-cyan-500/5'
                : 'border-gray-800 bg-gray-900/30'
            }`}
          >
            {/* Plan name */}
            <div className="mb-4">
              {plan.highlight && (
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mb-2">
                  Most Popular
                </span>
              )}
              <h2 className="text-lg font-semibold">{plan.name}</h2>
            </div>

            {/* Price */}
            <div className="mb-1">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-sm text-gray-500">{plan.period}</span>
            </div>
            <p className="text-xs text-gray-500 mb-6">{plan.credits}</p>

            {/* CTA */}
            <a
              href={plan.name === 'Free' && user ? plan.href : plan.name === 'Free' ? '/login' : plan.href}
              className={`block w-full py-2.5 rounded-lg text-center text-sm font-semibold transition-colors mb-6 ${
                plan.highlight
                  ? 'bg-cyan-500 text-gray-950 hover:bg-cyan-400'
                  : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
              }`}
            >
              {plan.cta}
            </a>

            {/* Features */}
            <ul className="flex-1 space-y-2.5">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-gray-400">
                  <svg className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-8 text-center">
        <p className="text-xs text-gray-600">
          Powered by LUMINA MODEL AGENCY — by TomorrowProof Inc.
        </p>
      </div>
    </div>
  );
}

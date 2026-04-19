/**
 * forBrandsLocale.ts — Bilingual copy dictionary for /for-brands page.
 *
 * EN + JA versions of every user-facing string on the For Brands page.
 * Import via useLang() in components.
 */

import type { Lang } from '../contexts/LanguageContext';

interface ForBrandsLocale {
  nav: {
    roster: string;
    forBrands: string;
    services: string;
    ethics: string;
    bookCta: string;
  };
  hero: {
    eyebrow: string;
    titleLines: string[];
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
  };
  services: {
    eyebrow: string;
    heading: string;
    idealFor: string;
    items: Array<{
      number: string;
      title: string;
      body: string;
      foot: string;
      ideal: string;
      ctaCampaign?: string;
    }>;
  };
  howItWorks: {
    eyebrow: string;
    heading: string;
    steps: Array<{ num: string; title: string; body: string }>;
  };
  cases: {
    eyebrow: string;
    heading: string;
    featuredLabel: string;
    galleryLabel: string;
    gallerySub: string;
    lookbook: {
      eyebrow: string;
      title: string;
      subtitle: string;
      meta: string;
      footnote: string;
    };
    items: Array<{
      number: string;
      title: string;
      subtitle: string;
      tag: string;
      metrics: Array<{ label: string; value: string }>;
    }>;
  };
  pricing: {
    eyebrow: string;
    heading: string;
    sub: string;
    colTier: string;
    colUseCase: string;
    colRate: string;
    colImages: string;
    colVideo: string;
    colExclusivity: string;
    tiers: Array<{
      name: string;
      rate: string;
      rateUnit: string;
      useCase: string;
      imageCap: string;
      videoCap: string;
      exclusivity: string;
    }>;
    footnotes: string[];
    ctaStart: string;
    ctaCampaign: string;
  };
  form: {
    eyebrow: string;
    heading: string;
    sub: string;
    stepOf: (n: number) => string;
    step1Heading: string;
    step2Heading: string;
    step3Heading: string;
    step3Sub: string;
    step3NoPreference: string;
    step3Selected: (n: number, max: number) => string;
    step4Heading: string;
    goals: Array<{ value: string; label: string }>;
    budgets: Array<{ value: string; label: string }>;
    fieldName: string;
    fieldCompany: string;
    fieldEmail: string;
    fieldPhone: string;
    fieldStartDate: string;
    fieldLaunchDate: string;
    fieldNotes: string;
    trustLine: string;
    back: string;
    next: string;
    submit: string;
    errRequiredName: string;
    errRequiredCompany: string;
    errRequiredEmail: string;
    errInvalidEmail: string;
    errRequiredStartDate: string;
    thanksEyebrow: string;
    thanksHeading: string;
    thanksBody: string;
    thanksMeetCta: string;
    thanksMeetFootnote: string;
    thanksCta: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: Array<{ q: string; a: string }>;
  };
  trustBar: {
    featuredIn: string;
  };
  footerCta: {
    heading: string;
    roster: string;
    ethics: string;
    about: string;
    emailLine: string;
  };
  footer: {
    tagline: string;
    since: string;
    colRoster: string;
    colForBrands: string;
    colAbout: string;
    colLegal: string;
  };
}

const en: ForBrandsLocale = {
  nav: {
    roster: 'The Roster',
    forBrands: 'For Brands',
    services: 'Services',
    ethics: 'Ethics',
    bookCta: 'Book a Model',
  },
  hero: {
    eyebrow: 'For Brands',
    titleLines: ['From casting to', 'content, handled', 'in one roster.'],
    body:
      'LUMINA is the first AI Model Agency with Character Bibles. Model nomination, content production, and full campaign services — delivered as one.',
    ctaPrimary: 'Start an Inquiry',
    ctaSecondary: 'View Pricing',
    scroll: 'Scroll',
  },
  services: {
    eyebrow: 'Services',
    heading: 'What we deliver',
    idealFor: 'Ideal for',
    items: [
      {
        number: '01',
        title: 'Model Nomination',
        body:
          "IP-license a LUMINA model for your brand. Use our roster's characters in your e-commerce, campaigns, and editorial.",
        foot: 'Monthly retainer from ¥5,000',
        ideal: 'EC product pages, continuous brand presence',
      },
      {
        number: '02',
        title: 'Content Production',
        body:
          "We deliver images & videos in your brand's voice. Garment analysis → AI styling → multi-format delivery (Rakuten / Yahoo / Amazon / Shopify ready).",
        foot: 'Billed per delivery',
        ideal: 'Replace traditional shoots, 80% cost reduction',
      },
      {
        number: '03',
        title: 'Campaign & Custom',
        body:
          'Full creative partnership for launches. Concept → casting → production → optional LP/HP direction. Tailored per project.',
        foot: 'Inquire for pricing',
        ideal: 'Seasonal launches, large brand campaigns',
        ctaCampaign: 'Inquire for Campaign',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'Process',
    heading: 'How it works',
    steps: [
      {
        num: '01',
        title: 'Tell us your brief',
        body: 'Multi-step form (4 steps) or email. We respond within 1 business day.',
      },
      {
        num: '02',
        title: 'Proposal',
        body: 'Model + brief proposal within 48 hours, fully aligned with your goals.',
      },
      {
        num: '03',
        title: 'Production',
        body: 'LUMINA Studio drives the generation. Every output reviewed by our creative director.',
      },
      {
        num: '04',
        title: 'Delivery',
        body: 'Format-ready output (PNG / MP4 / WebP). Rakuten / Yahoo / Amazon / Shopify regs supported.',
      },
    ],
  },
  cases: {
    eyebrow: 'Selected work',
    heading: 'From lookbook to product page.',
    featuredLabel: 'Featured cases',
    galleryLabel: 'Gallery',
    gallerySub: 'SS26 lookbook. Six live product pages. Real deliverables.',
    lookbook: {
      eyebrow: 'Featured lookbook',
      title: 'LUMINA_Lookbook_SS26',
      subtitle: 'Spring / Summer 2026 · Vol.01',
      meta: '24 looks · 6 models · 5 days delivery',
      footnote: 'AI-generated lookbook, shot-by-shot direction by KOZUKI TAKAHIRO.',
    },
    items: [
      {
        number: 'CASE 01',
        title: 'BEDWIN 26SS',
        subtitle: 'LUCAS MORI muse — Watanabe-signed exclusive',
        tag: 'Brand collaboration',
        metrics: [
          { label: 'Shoots replaced', value: '12' },
          { label: 'Turnaround', value: '48h' },
          { label: 'Character consistency', value: '100%' },
        ],
      },
      {
        number: 'CASE 02',
        title: 'LUMINA internal demo — 20 SKU EC',
        subtitle: 'Traditional shoot vs LUMINA — side-by-side',
        tag: 'Internal benchmark',
        metrics: [
          { label: 'Shoot cost reduction', value: '-88%' },
          { label: 'Delivery time', value: '3d → 18h' },
          { label: 'SKUs covered', value: '20' },
        ],
      },
    ],
  },
  pricing: {
    eyebrow: 'Pricing & Licensing',
    heading: 'Transparent tiers',
    sub: 'All model nominations include commercial usage rights. Scope varies by tier.',
    colTier: 'Tier',
    colUseCase: 'Use case',
    colRate: 'Rate',
    colImages: 'Images',
    colVideo: 'Video',
    colExclusivity: 'Exclusivity',
    tiers: [
      {
        name: 'Standard',
        rate: '¥5,000',
        rateUnit: '/ model / mo',
        useCase: 'EC product pages only',
        imageCap: '100 / month',
        videoCap: '—',
        exclusivity: '—',
      },
      {
        name: 'Extended',
        rate: '¥15,000',
        rateUnit: '/ model / mo',
        useCase: 'EC + SNS + Web (brand-owned)',
        imageCap: '300 / month',
        videoCap: '10 / month',
        exclusivity: '—',
      },
      {
        name: 'Campaign',
        rate: 'Inquire',
        rateUnit: '',
        useCase: 'Ads · print · broadcast · OOH',
        imageCap: 'Project-based',
        videoCap: 'Project-based',
        exclusivity: 'During campaign',
      },
      {
        name: 'Exclusive',
        rate: 'From ¥200,000',
        rateUnit: '/ model / mo',
        useCase: 'Category-wide exclusivity',
        imageCap: 'Unlimited',
        videoCap: 'Unlimited',
        exclusivity: 'Category-level',
      },
    ],
    footnotes: [
      '— Content production billed per-delivery.',
      '— Volume discounts available at Extended and above.',
      '— All licenses renewable monthly. No lock-in.',
      '— STUDIO self-serve access provided to Extended+ tiers at no extra cost.',
    ],
    ctaStart: 'Start an Inquiry',
    ctaCampaign: 'Inquire for Campaign',
  },
  form: {
    eyebrow: 'Inquiry',
    heading: 'Start an Inquiry',
    sub: 'Takes 90 seconds. We respond within 1 business day.',
    stepOf: (n) => `Step ${n} of 4`,
    step1Heading: 'What do you need from LUMINA?',
    step2Heading: 'Budget range (per month or project).',
    step3Heading: 'Do you have models in mind?',
    step3Sub: 'Optional. Select up to 5 models.',
    step3NoPreference: 'Not sure — please recommend',
    step3Selected: (n, max) => `Selected: ${n} / ${max}`,
    step4Heading: 'Almost there.',
    goals: [
      { value: 'ec-ongoing', label: 'E-commerce product photos (ongoing)' },
      { value: 'campaign-launch', label: 'Campaign / Seasonal launch (project)' },
      { value: 'content-series', label: 'Ongoing content series (SNS / blog)' },
      { value: 'video-content', label: 'Video content (shorts / ads)' },
      { value: 'custom', label: 'Custom / Other' },
    ],
    budgets: [
      { value: 'exploring', label: 'Exploring / Not sure yet' },
      { value: 'under-50k', label: 'Under ¥50,000 / month' },
      { value: '50-200k', label: '¥50,000 — ¥200,000 / month' },
      { value: '200k-1m', label: '¥200,000 — ¥1,000,000 / project' },
      { value: '1m-plus', label: 'Over ¥1,000,000 / project' },
    ],
    fieldName: 'Full name',
    fieldCompany: 'Company / Brand',
    fieldEmail: 'Email',
    fieldPhone: 'Phone (optional)',
    fieldStartDate: 'Target start date',
    fieldLaunchDate: 'Launch date (optional)',
    fieldNotes: 'Additional notes (optional)',
    trustLine: '🔒 SSL encrypted · Privacy policy',
    back: '← Back',
    next: 'Next',
    submit: 'Submit',
    errRequiredName: 'Full name is required',
    errRequiredCompany: 'Company / Brand is required',
    errRequiredEmail: 'Email is required',
    errInvalidEmail: 'Email format looks invalid',
    errRequiredStartDate: 'Target start date is required',
    thanksEyebrow: 'Inquiry received',
    thanksHeading: 'Thank you.',
    thanksBody: "We received your inquiry.\nBook a 30-minute Google Meet consultation — we'll walk through your brief, models, and next steps.",
    thanksMeetCta: 'Book a 30-min Meet →',
    thanksMeetFootnote: "Or we'll reach out within 1 business day.",
    thanksCta: 'Explore THE ROSTER →',
  },
  faq: {
    eyebrow: 'FAQ',
    heading: 'Frequently asked',
    items: [
      {
        q: 'Are AI models OK for product photography?',
        a: "LUMINA models aren't just 'AI-generated'; they're character IPs with detailed Character Bibles, usable continuously by brands as if they were contracted human models. The absence of real-likeness ambiguity actually reduces commercial legal risk.",
      },
      {
        q: 'What is the scope of the IP license?',
        a: 'Standard = EC product pages only. Extended = EC + SNS + Web. Campaign = ads / print / broadcast / OOH with exclusivity during the campaign. Exclusive = category-wide exclusivity (e.g. 6 months for your brand only). Inquire for details.',
      },
      {
        q: 'How quickly do you deliver?',
        a: 'Model Nomination = same day. Image Production = within 24 hours per SKU. Video = 3-5 business days. Campaign = quoted per project.',
      },
      {
        q: 'Which formats do you deliver?',
        a: 'Rakuten / Yahoo / Amazon / Shopify specs supported out of the box. PNG / JPEG / WebP / MP4 (H.264/H.265) as standard. Custom specs available under Campaign tier.',
      },
      {
        q: 'Can you use our existing product photos as input?',
        a: 'Yes. Upload garment photography (flat-lay or hanger) and we generate on-model shots featuring a LUMINA model wearing the garment. We preserve color, texture, and stitching faithfully.',
      },
      {
        q: 'Is an exclusive contract possible?',
        a: 'Yes (Exclusive tier). Exclusivity is available per category (e.g. sneakers) or per time window. Starts at ¥200,000/mo.',
      },
      {
        q: 'What about term length and cancellation?',
        a: 'Monthly contracts auto-renew each month with no lock-in. Cancel with 30 days notice. Campaign contracts follow the project window.',
      },
      {
        q: 'What security / confidentiality do you offer?',
        a: 'All briefs and product images are encrypted. An NDA is signed by default. We guarantee zero leakage risk for pre-launch product information.',
      },
    ],
  },
  trustBar: {
    featuredIn: 'Featured in',
  },
  footerCta: {
    heading: 'Still exploring?',
    roster: 'THE ROSTER →',
    ethics: 'ETHICS →',
    about: 'ABOUT →',
    emailLine: 'Or email us directly:',
  },
  footer: {
    tagline: 'The first AI Model Agency with Character Bibles.',
    since: 'Since 2026 · Founded by KOZUKI TAKAHIRO',
    colRoster: 'The Roster',
    colForBrands: 'For Brands',
    colAbout: 'About',
    colLegal: 'Legal',
  },
};

const ja: ForBrandsLocale = {
  nav: {
    roster: 'ザ・ロスター',
    forBrands: 'ブランド向け',
    services: 'サービス',
    ethics: '倫理規範',
    bookCta: 'モデル指名',
  },
  hero: {
    eyebrow: 'ブランド向け',
    titleLines: [
      'キャスティングから',
      'コンテンツ納品まで、',
      'ひとつのロスターで。',
    ],
    body:
      'LUMINA は Character Bible 型の AIモデルエージェンシー。\nモデル指名・コンテンツ制作・キャンペーン施策まで、\nワンストップでご提供します。',
    ctaPrimary: '問い合わせを始める',
    ctaSecondary: '料金を見る',
    scroll: 'スクロール',
  },
  services: {
    eyebrow: 'サービス',
    heading: '提供するもの',
    idealFor: '最適用途',
    items: [
      {
        number: '01',
        title: 'モデル指名',
        body:
          'LUMINAモデルをブランド専属としてIPライセンス。EC・キャンペーン・エディトリアルでロスターのキャラクターを継続起用できます。',
        foot: '月額 ¥5,000 〜',
        ideal: 'EC商品ページ、継続的なブランド露出',
      },
      {
        number: '02',
        title: 'コンテンツ制作',
        body:
          'ブランドの世界観で画像・動画を納品。ガーメント解析 → AIスタイリング → 各モール規格(楽天/Yahoo/Amazon/Shopify)対応で配信。',
        foot: '納品数に応じた従量課金',
        ideal: 'ささげ代替、撮影コスト80%削減',
      },
      {
        number: '03',
        title: 'キャンペーン&カスタム',
        body:
          'ローンチ向けのフルクリエイティブパートナーシップ。コンセプト → キャスティング → 制作 → 必要に応じて LP/HP ディレクションまで。案件ごとの個別設計。',
        foot: '個別見積',
        ideal: 'シーズンキャンペーン、大型ブランド施策',
        ctaCampaign: 'キャンペーンを相談',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'プロセス',
    heading: 'ご依頼の流れ',
    steps: [
      {
        num: '01',
        title: 'ブリーフをお聞かせください',
        body: '4ステップの問い合わせフォーム or メールから。1営業日以内にご返信。',
      },
      {
        num: '02',
        title: 'ご提案',
        body: 'モデルとブリーフ提案を 48時間以内にお送りします。',
      },
      {
        num: '03',
        title: '制作',
        body: 'LUMINA Studio が生成を担当。全てのアウトプットをクリエイティブディレクターがレビュー。',
      },
      {
        num: '04',
        title: '納品',
        body: 'PNG / MP4 / WebP 形式で即使用可能。楽天 / Yahoo / Amazon / Shopify 規格対応。',
      },
    ],
  },
  cases: {
    eyebrow: '制作実績',
    heading: 'ルックブックから商品ページまで。',
    featuredLabel: '注目事例',
    galleryLabel: 'ギャラリー',
    gallerySub: 'SS26ルックブック、6ブランドのEC商品ページ。実納品。',
    lookbook: {
      eyebrow: '注目ルックブック',
      title: 'LUMINA_Lookbook_SS26',
      subtitle: 'Spring / Summer 2026 · Vol.01',
      meta: '全24ルック · 起用モデル6名 · 納期5日',
      footnote: 'AI生成ルックブック。KOZUKI TAKAHIRO がショット単位でディレクション。',
    },
    items: [
      {
        number: 'CASE 01',
        title: 'BEDWIN 26SS',
        subtitle: 'LUCAS MORI muse — Watanabe氏直接指示によるキャラ設計',
        tag: 'ブランド協業',
        metrics: [
          { label: '撮影置換数', value: '12本' },
          { label: '納期', value: '48時間' },
          { label: 'キャラ一貫性', value: '100%' },
        ],
      },
      {
        number: 'CASE 02',
        title: 'LUMINA内製デモ — EC 20SKU',
        subtitle: '従来撮影 vs LUMINA のサイドバイサイド比較',
        tag: '内部ベンチマーク',
        metrics: [
          { label: '撮影コスト削減', value: '-88%' },
          { label: '納期', value: '3日 → 18時間' },
          { label: 'SKU数', value: '20' },
        ],
      },
    ],
  },
  pricing: {
    eyebrow: '料金体系',
    heading: '透明な4段階ライセンス',
    sub: 'すべてのモデル指名には商用利用権が含まれます。範囲はランクごとに異なります。',
    colTier: 'ランク',
    colUseCase: '用途',
    colRate: '料金',
    colImages: '画像',
    colVideo: '動画',
    colExclusivity: '独占',
    tiers: [
      {
        name: 'Standard',
        rate: '¥5,000',
        rateUnit: '/ モデル / 月',
        useCase: 'EC商品ページのみ',
        imageCap: '月100枚',
        videoCap: '—',
        exclusivity: '—',
      },
      {
        name: 'Extended',
        rate: '¥15,000',
        rateUnit: '/ モデル / 月',
        useCase: 'EC + SNS + Web (自社所有)',
        imageCap: '月300枚',
        videoCap: '月10本',
        exclusivity: '—',
      },
      {
        name: 'Campaign',
        rate: '個別見積',
        rateUnit: '',
        useCase: '広告・印刷・放送・OOH',
        imageCap: '案件別',
        videoCap: '案件別',
        exclusivity: '案件期間中',
      },
      {
        name: 'Exclusive',
        rate: '¥200,000〜',
        rateUnit: '/ モデル / 月',
        useCase: 'カテゴリ独占',
        imageCap: '無制限',
        videoCap: '無制限',
        exclusivity: 'カテゴリ単位',
      },
    ],
    footnotes: [
      '— コンテンツ制作は納品単位で別途課金。',
      '— Extended 以上でボリュームディスカウント適用可。',
      '— 月額ライセンスは毎月更新、ロックインなし。',
      '— Extended 以上は STUDIO セルフサーブへの無償アクセス付き。',
    ],
    ctaStart: '問い合わせを始める',
    ctaCampaign: 'キャンペーンを相談',
  },
  form: {
    eyebrow: 'お問い合わせ',
    heading: '問い合わせを始める',
    sub: '所要 90秒。1営業日以内にご返信します。',
    stepOf: (n) => `ステップ ${n} / 4`,
    step1Heading: 'LUMINA に何をお求めですか?',
    step2Heading: '予算の目安(月 or プロジェクト)',
    step3Heading: '指名したいモデルはありますか?',
    step3Sub: '任意。最大5名まで選択可。',
    step3NoPreference: '特になし — 提案をお願いします',
    step3Selected: (n, max) => `選択中: ${n} / ${max}`,
    step4Heading: 'あと少しです。',
    goals: [
      { value: 'ec-ongoing', label: 'EC商品ページ(継続)' },
      { value: 'campaign-launch', label: 'キャンペーン / シーズンローンチ(単発)' },
      { value: 'content-series', label: '継続的なコンテンツシリーズ(SNS / ブログ)' },
      { value: 'video-content', label: '動画コンテンツ(ショート / 広告)' },
      { value: 'custom', label: 'カスタム / その他' },
    ],
    budgets: [
      { value: 'exploring', label: '検討中 / 未定' },
      { value: 'under-50k', label: '月 ¥50,000 未満' },
      { value: '50-200k', label: '月 ¥50,000 — ¥200,000' },
      { value: '200k-1m', label: '1案件 ¥200,000 — ¥1,000,000' },
      { value: '1m-plus', label: '1案件 ¥1,000,000 以上' },
    ],
    fieldName: 'お名前',
    fieldCompany: '会社 / ブランド名',
    fieldEmail: 'メールアドレス',
    fieldPhone: '電話番号(任意)',
    fieldStartDate: '開始希望日',
    fieldLaunchDate: 'ローンチ日(任意)',
    fieldNotes: '備考(任意)',
    trustLine: '🔒 SSL暗号化 · プライバシーポリシー',
    back: '← 戻る',
    next: '次へ',
    submit: '送信',
    errRequiredName: 'お名前は必須です',
    errRequiredCompany: '会社 / ブランド名は必須です',
    errRequiredEmail: 'メールアドレスは必須です',
    errInvalidEmail: 'メールアドレス形式が正しくありません',
    errRequiredStartDate: '開始希望日は必須です',
    thanksEyebrow: 'お問い合わせ受領',
    thanksHeading: 'ありがとうございます。',
    thanksMeetCta: '30分の打ち合わせを予約 →',
    thanksMeetFootnote: 'または、1営業日以内に当社よりご連絡いたします。',
    thanksBody: 'お問い合わせを受領しました。\n30分のオンライン打ち合わせ(Google Meet)をご予約ください。ブリーフ・モデル候補・次のステップをご説明します。',
    thanksCta: 'THE ROSTER を見る →',
  },
  faq: {
    eyebrow: 'FAQ',
    heading: 'よくある質問',
    items: [
      {
        q: 'AIモデルで商品撮影しても問題ないのでは?',
        a: 'LUMINAモデルは「AI生成」ではなく、キャラクターIPとして設計された専属モデルです。各モデルには詳細なキャラクター設定 (Character Bible) があり、人間の専属モデルと同じように継続的にブランドで起用できます。肖像権の曖昧さがないため、商用利用の法的リスクはむしろ軽減されます。',
      },
      {
        q: 'IPライセンスの範囲は?',
        a: 'Standard = EC商品ページのみ。Extended = EC + SNS + Web。Campaign = 広告・印刷・動画キャンペーン (案件期間中の独占可)。Exclusive = カテゴリ独占 (例: 6ヶ月間あなたのブランドのみ)。詳細はお問い合わせください。',
      },
      {
        q: '納品までの期間は?',
        a: 'Model Nomination = 当日。Image Production = 1 SKUあたり24時間以内。Video = 3-5営業日。Campaign = 案件ごとに見積。',
      },
      {
        q: 'どのフォーマットで納品されますか?',
        a: 'Rakuten / Yahoo / Amazon / Shopify の規格対応済。PNG / JPEG / WebP / MP4 (H.264/H.265) を標準配信。カスタム規格も Campaign tier で対応。',
      },
      {
        q: '既存の商品写真を使って生成できますか?',
        a: 'はい。ガーメント写真 (平置き・吊るし) をアップロードいただければ、LUMINAモデルが着用した商品写真を生成します。色・素材・縫い目まで忠実に再現します。',
      },
      {
        q: 'モデルの独占契約は可能?',
        a: 'はい (Exclusive tier)。カテゴリ単位 (例: スニーカー) または期間単位での独占契約を提供。月額¥200,000〜。',
      },
      {
        q: '契約期間・解約は?',
        a: '月額契約は毎月更新 (ロックイン無し)。30日前通知で解約可能。Campaign は案件期間ごと。',
      },
      {
        q: 'セキュリティ・秘密保持は?',
        a: '全てのブリーフ・商品画像は暗号化保存。NDA (秘密保持契約) を標準で締結。商品未発売時の情報漏洩リスクゼロを担保。',
      },
    ],
  },
  trustBar: {
    featuredIn: '掲載実績',
  },
  footerCta: {
    heading: 'もう少し知りたい方へ',
    roster: 'ザ・ロスター →',
    ethics: '倫理規範 →',
    about: '私たちについて →',
    emailLine: 'またはメールで直接:',
  },
  footer: {
    tagline: 'Character Bible 型の AIモデルエージェンシー。',
    since: '2026年創業 · ファウンダー KOZUKI TAKAHIRO',
    colRoster: 'ロスター',
    colForBrands: 'ブランド向け',
    colAbout: '会社概要',
    colLegal: '規約',
  },
};

const DICT: Record<Lang, ForBrandsLocale> = { en, ja };

export function useForBrandsLocale(lang: Lang): ForBrandsLocale {
  return DICT[lang];
}

export type { ForBrandsLocale };

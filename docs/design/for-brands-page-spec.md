# `/for-brands` — Page Detailed Design Spec

> Claude Design 投入用の**B2Bランディングページ**詳細仕様。
> 親ドキュメント: `docs/design/lumina-agency-hp-spec.md` 3-4節 の拡張。
> 決定根拠: Council 2026-04-19 (論点2: Campaign価格非表示、論点8: Multi-step form Phase1必須)
>
> **このページがLUMINAの商談獲得CVRエンジン**。HP全体で最も設計投資する箇所。

---

## 0. Page Goals

| KPI | 目標 |
|---|---|
| Form submission CVR | Phase 1: 5%以上 / Phase 2(Chatbot導入後): 10%以上 |
| 商談化率 | Submission → 初回商談 40%以上 |
| 平均リード品質 | Qualified Lead 比率 60%以上(予算¥50k/月以上) |
| 読了時間中央値 | 90秒以上(スクロール深度70%以上) |

---

## 1. Brand Tone (継承)

親spec「Brand Constitution」に完全準拠。
- Dark × Minimal × Edge × Tech
- Background `#050508` / Accent `#00D4FF`
- Inter + Noto Sans JP
- ストック写真禁止、実際のLUMINAモデル画像のみ

**本ページ固有のトーン**:
- **B2B格式**: 代理店・大手ブランド担当が見ても「制作会社/エージェンシー格」が立つ厚み
- **透明性**: 料金帯・納期・プロセスを逃げずに明示
- **余裕**: 押し売り感ゼロ、選ばれる側の立ち位置

---

## 2. Page Structure (上から順)

### 2-1. Hero Section (100vh)

**Layout**: 左=コピー / 右=フルブリード画像グリッド(ELENA/LUCAS MORI/RINKA 3枚モザイク)

**Copy (EN primary)**:
```
FOR BRANDS

From casting to content,
handled in one roster.

LUMINA is the world's first AI Model Agency.
Model nomination, content production, and full
campaign services — delivered as one.

[ Start an Inquiry → ]  [ View Pricing ]
```

**Copy (JP)**:
```
FOR BRANDS

キャスティングから
コンテンツ納品まで、
ひとつのロスターで完結。

LUMINA は世界初のAIモデルエージェンシー。
モデル指名・コンテンツ制作・キャンペーン
サービスをワンストップで提供します。

[ 問い合わせを始める → ]  [ 料金を見る ]
```

**Primary CTA**: `Start an Inquiry` → フォーム(セクション2-6)へスクロール
**Secondary CTA**: `View Pricing` → セクション2-5へスクロール

---

### 2-2. Services Section (3-card block)

**Heading**: `What we deliver`

**3 Services Cards** (grid, 同高さ):

#### Card 1: Model Nomination
```
01 — MODEL NOMINATION
─────────────────
IP-license a LUMINA model
for your brand.

Use our roster's characters in your
e-commerce, campaigns, and editorial.
Monthly retainer from ¥5,000.

Ideal for: EC商品ページ、継続的なブランド露出
```

#### Card 2: Content Production
```
02 — CONTENT PRODUCTION
─────────────────
We deliver images & videos
in your brand's voice.

Garment analysis → AI styling →
multi-format delivery (Rakuten / Yahoo /
Amazon / Shopify ready).

Ideal for: ささげ代替、撮影コスト80%削減
```

#### Card 3: Campaign & Custom Services
```
03 — CAMPAIGN & CUSTOM
─────────────────
Full creative partnership
for launches.

Concept → casting → production →
optional LP/HP direction. 
Tailored per project.

Ideal for: シーズンキャンペーン、大型ブランド施策
CTA: [ Inquire for Campaign ]
```

**注**: Card 3 は**価格非表示**(Council 論点2)。`Inquire` のみ。特商法リスク回避。

---

### 2-3. How It Works (4-step flow)

**Heading**: `How it works`

**Layout**: 横4カラムステップ (mobileでは縦stack)、各ステップにアイコン+番号

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ 01          │ 02          │ 03          │ 04          │
│ Tell us     │ Proposal    │ Production  │ Delivery    │
│ your brief  │             │             │             │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Multi-step  │ Model &     │ LUMINA      │ Format-     │
│ form 4 pasos│ brief propo-│ Studio      │ ready       │
│ or email.   │ sal within  │ production. │ output      │
│ We respond  │ 48 hrs.     │             │ (PNG/MP4/   │
│ in 1 biz day│             │             │ WebP).      │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**視覚アクセント**: ステップ番号を `#00D4FF` アクセント、ステップ間を細線矢印でつなぐ

---

### 2-4. Case Studies Section (3 slots)

**Heading**: `Selected work`

**注**: 実案件が集まるまで、自社 use case + デモ生成例で埋める(空白禁止)。

**Layout**: 3カラム card grid、hoverでdetail expand

**Card Template**:
```
[ Hero image 3:4 ]

CASE 01
─────────────────
[Brand / Project name]

Metric: 
 - 撮影コスト削減: -XX%
 - 納期: X日 → XX時間
 - SKU数: XX

[View case →]  (clickable, currently → #)
```

**Initial content (実案件獲得まで)**:
1. **BEDWIN 26SS (LUCAS MORI muse)** — Founded-by-founder用ケース。Watanabe氏直接指示でキャラ設計→lookbook展開
2. **LUMINA internal demo — EC 20SKU** — 自社デモで20SKUを従来撮影 vs LUMINA で比較(コスト/時間/品質)
3. **Harajuku Creator Package (RINKA)** — SNS動画3本 + スチル10枚の制作事例

**運用ルール**: 実案件獲得次第、古いデモ枠から差し替え。最低3枠キープ。

---

### 2-5. Pricing Overview

**Heading**: `Pricing & Licensing`

**Sub-heading**: `All model nominations include commercial usage rights. Scope varies by tier.`

**Table** (4 tier):

| Tier | Use case | Monthly rate | Image usage | Video | Exclusivity |
|---|---|---|---|---|---|
| **Standard** | EC商品ページのみ | ¥5,000 / model | 100 images/mo | — | — |
| **Extended** | EC + SNS + Web | ¥15,000 / model | 300 images/mo | 10 videos/mo | — |
| **Campaign** | 広告・印刷・動画キャンペーン | **Inquire** | Project-based | Project-based | 案件期間中 |
| **Exclusive** | カテゴリ独占 | From ¥200,000 / mo | Unlimited | Unlimited | ✅ Category-level |

**Campaign 行の価格非表示**は意図的(Council 論点2)。CTAは `Inquire` のみ。

**下部に注記**:
```
- Content production (actual image/video generation) billed per-delivery.
- Volume discounts available at Extended and above.
- All licenses renewable monthly. No lock-in.
- STUDIO self-serve access is provided to all Extended+ tiers at no extra cost.
```

**注**: 最後の1行で `/studio` 裏動線へ触れる(Council 論点3: STUDIO非表看板方針と矛盾せず、有料顧客向け特典として言及)。

---

### 2-6. Multi-step Form (CVR本体)

**Heading**: `Start an Inquiry`

**Sub-heading**: `Takes 90 seconds. We respond within 1 business day.`

**Layout**: Single column, max-width 560px, center aligned
**Progress bar**: 上部細線、各ステップ完了で `#00D4FF` 充填

#### Step 1 — Your Goal

```
Step 1 of 4
─────────
What do you need from LUMINA?

○ E-commerce product photos (ongoing)
○ Campaign / Seasonal launch (project)
○ Ongoing content series (SNS / blog)
○ Video content (shorts / ads)
○ Custom / Other

[ Next → ]
```

**Validation**: Required, single select
**UI**: Large click area, radio button + label block

---

#### Step 2 — Budget Range

```
Step 2 of 4
─────────
Budget range per month or project.

○ Exploring / Not sure yet
○ Under ¥50,000 / month
○ ¥50,000 — ¥200,000 / month
○ ¥200,000 — ¥1,000,000 / project
○ Over ¥1,000,000 / project

[ ← Back ]  [ Next → ]
```

**Validation**: Required
**Note**: 「Exploring」選択時もリード獲得優先で次へ進める(フィルタリングは内部で行う)

---

#### Step 3 — Preferred Models (Optional)

```
Step 3 of 4
─────────
Do you have models in mind?    (optional)

[ Model grid — 14体のサムネ、複数選択可 ]
  ┌────┐ ┌────┐ ┌────┐ ┌────┐
  │ELE │ │AMA │ │SOF │ │NAD │
  │NA  │ │RA  │ │IA  │ │IA  │
  └────┘ └────┘ └────┘ └────┘
  ┌────┐ ┌────┐ ┌────┐ ┌────┐
  │MIK │ │HAR │ │LIE │ │IDR │
  │U   │ │IN  │ │N   │ │IS  │
  └────┘ └────┘ └────┘ └────┘
  ...

Or: ○ Not sure — please recommend

[ ← Back ]  [ Next → ]
```

**Validation**: Skippable (optional)
**UI**:
- Thumbnails 120×160 (3:4 portrait)
- Selected: border `#00D4FF` 2px + scale 1.02
- Max 5 models selectable
- データソース: `data/agencyModels.ts` の `images.beauty` を使用

---

#### Step 4 — Timeline & Contact

```
Step 4 of 4
─────────
Almost there.

Full name*        [_______________]
Company / Brand*  [_______________]
Email*            [_______________]
Phone (optional)  [_______________]

Target start date* [_____________] (date picker)
Launch date (optional) [________]

Additional notes (optional)
[
  (multiline, max 500 chars)
]

[ ← Back ]  [ Submit ]
```

**Validation**: Required fields marked with `*`. Email format check.
**Trust row** (submit buttonの下):
```
🔒 SSL encrypted · Privacy policy · GDPR compliant
```

---

#### Submit Handling

1. **POST to backend** (serverless): `/api/inquiry`
2. **Bundled data**: Step 1-4 の全入力 + timestamp + UA + referrer
3. **Server-side actions**:
   - Supabase Postgres に `inquiries` テーブル保存
   - Slack webhook → `#sales-leads` に通知(担当Sales Agent呼ばれる)
   - 確認メール送信(Resend or Supabase Edge Function) — 受領確認 + 次のステップ案内
4. **Client**: Success画面に遷移
   ```
   Thank you.
   We received your inquiry.
   You'll hear from us within 1 business day.
   
   Meanwhile, [ explore THE ROSTER → ]
   ```
5. **Error handling**: 失敗時は Step 4 画面に赤字エラー + "Please try again or email us at brand@lumina-models.com"

---

### 2-7. FAQ Section

**Heading**: `Frequently asked`

**Layout**: Accordion (expand/collapse), 上から重要度順

#### Q1. AIモデルで商品撮影しても問題ないのでは? → Yes, here's why.
```
A. LUMINAモデルは「AI生成」ではなく、
   キャラクターIPとして設計された専属モデルです。
   各モデルには詳細なキャラクター設定 (Character Bible) があり、
   人間の専属モデルと同じように継続的にブランドで起用できます。
   肖像権の曖昧さがないため、商用利用の法的リスクはむしろ軽減されます。
```

#### Q2. IPライセンスの範囲は?
```
A. Standard = EC商品ページのみ。Extended = EC + SNS + Web。
   Campaign = 広告・印刷・動画キャンペーン (案件期間中の独占可)。
   Exclusive = カテゴリ独占 (例: 6ヶ月間あなたのブランドのみ)。
   詳細はお問い合わせください。
```

#### Q3. 納品までの期間は?
```
A. Model Nomination = 当日。
   Image Production = 1 SKU あたり 24時間以内。
   Video = 3-5営業日 (カット数に応じる)。
   Campaign = 案件ごとに見積。
```

#### Q4. どのフォーマットで納品されますか?
```
A. Rakuten / Yahoo / Amazon / Shopify の規格対応済。
   PNG / JPEG / WebP / MP4 (H.264/H.265) を標準配信。
   カスタム規格も Campaign tier で対応。
```

#### Q5. 既存の商品写真を使って生成できますか?
```
A. はい。ガーメント写真 (平置き・吊るし) を
   アップロードいただければ、LUMINAモデルが着用した
   商品写真を生成します。色・素材・縫い目まで忠実に再現します。
```

#### Q6. モデルの独占契約は可能?
```
A. はい (Exclusive tier)。カテゴリ単位 (例: スニーカー)
   または期間単位での独占契約を提供しています。
   月額¥200,000〜、契約条件はご相談ください。
```

#### Q7. 契約期間・解約は?
```
A. 月額契約は毎月更新 (ロックイン無し)。
   30日前通知で解約可能。Campaign は案件期間ごと。
```

#### Q8. セキュリティ・秘密保持は?
```
A. 全てのブリーフ・商品画像は暗号化保存。
   NDA (秘密保持契約) を標準で締結します。
   商品未発売時の情報漏洩リスクゼロを担保します。
```

---

### 2-8. Trust Bar (Pre-footer)

**Layout**: モノクロロゴ帯 (実績クライアント or メディア掲載)
**現状**: `Featured in — TomorrowProof Journal` のみ(最低限)
**将来**: 実案件クライアントロゴ追加

---

### 2-9. Footer CTA

```
Still exploring?

THE ROSTER →   ETHICS →   ABOUT →

Or email us directly: brand@lumina-models.com
```

---

## 3. Conversion Events (Analytics)

以下のイベントを計測(GA4 + 内部ダッシュボード):

| Event | Trigger |
|---|---|
| `for_brands_view` | ページ到達 |
| `for_brands_scroll_50` | 50%スクロール |
| `for_brands_scroll_90` | 90%スクロール |
| `inquiry_step_1_complete` | Step 1 完了 |
| `inquiry_step_2_complete` | Step 2 完了 |
| `inquiry_step_3_complete` | Step 3 完了 |
| `inquiry_submitted` | 最終submit |
| `pricing_table_view` | 価格表がviewport入る |
| `faq_expand_{q_id}` | FAQ開閉 |
| `campaign_inquire_click` | Campaign card CTA |

---

## 4. A/B Test 候補 (Phase 2)

- Hero CTA 文言: `Start an Inquiry` vs `Book a Model`
- Multi-step form ステップ順: 目的→予算 vs 予算→目的
- Pricing table 表示 vs 非表示
- Case Studies 数: 3枠 vs 6枠
- FAQ の Q1 頭出し文言

---

## 5. 実装フェーズ分割

### Phase 1 (Launch minimum)
- Hero / Services / How it works / Pricing table / Multi-step form / FAQ / Footer CTA
- Submit handling: Slack webhook のみ(Supabase連携は最悪後回し)
- Case Studies: 自社デモ3本で埋める

### Phase 2 (Polish & scale)
- Case Studies 実案件差し替え
- Chatbot (Claude Haiku) 統合 — フォーム補完/質問応答
- Analytics ダッシュボード
- A/B テスト基盤

### Phase 3 (Growth)
- Multi-language (JP/EN 両方のフル最適化)
- PDP (個別モデル) からの直接Book導線
- Video case study embed

---

## 6. Out of scope (本ページで絶対やらない)

- **STUDIO の直接セールス露出**(Council 論点3、pricing最下部の1行のみ許容)
- **Campaign の価格明示**(Council 論点2、法務リスク)
- **AI生成プロセスの詳細説明**(「AI」を前面化せず「Character IP」と表現)
- **実在モデルとの比較表**(倫理・Legal許容度を超える)

---

## 7. Decisions (CEO 2026-04-19 approved)

1. ✅ **ドメイン**: `lumina-aimodels-agency.com` 取得次第切替。それまで `lumina-model-agency.vercel.app/for-brands`
2. ✅ **ビジネスメール**: `brand@lumina-models.com` で確定(独自ドメイン取得後に再評価)
3. ✅ **Slack webhook**: `#sales-leads` で確定
4. ✅ **Phase 1 ローンチ目標**: **2026-05-10**
5. ✅ **Case Studies 初期3本**: BEDWIN / 自社デモ / RINKA で確定

---

**Document Owner**: dev + sales + marketing(代行作成)
**Approval Needed**: KOZUKI (Section 7 の5項目)
**Last Updated**: 2026-04-19
**Parent Spec**: `docs/design/lumina-agency-hp-spec.md` 3-4節

# LUMINA MODEL AGENCY — Master Design Spec

> **Claude Design 投入専用マスターファイル**。このファイル全文を Claude Design の Initial Prompt にコピペすれば、LUMINA MODEL AGENCY の公式HP全体のワイヤーフレーム + ビジュアル + 全ページコピー + 静的ページ本文が生成可能。
>
> 統合元:
> - `lumina-agency-hp-spec.md` (全体IA)
> - `for-brands-page-spec.md` (B2B最重要ページ詳細)
> - `ai-ethics-code.md` (Ethics Code 全文)
> - `ip-license-tiers.md` (IP License Tier 全文)
>
> 決定根拠: Council 2026-04-19 / journal/2026/04/19.md
> CEO承認: 2026-04-19 (すべての Open Questions 決定済み)
> 最終更新: 2026-04-19

---

## 0. How to Use This Spec

**Target**: Claude Design に Website → Marketing/Agency プロジェクト作成。本ファイル全文を Initial Prompt に貼付。

**期待出力**:
1. `/` Home のワイヤー + コピー + ビジュアル
2. `/women` `/men` `/creators` `/talent` Division ページ(テンプレ化)
3. `/models/[slug]` PDP テンプレート
4. `/for-brands` B2B ランディング(Multi-step form 含む)
5. `/services` `/ethics` `/about` 固定ページ
6. `/legal/ip-license` を含む法務ページ群
7. Global Header / Footer / 共通コンポーネント

**実装Stack**:
- React 19 / TypeScript / Vite / Tailwind CSS (既存)
- React Router (既存、`/` = AgencyPage, `/studio` = 既存保持)
- Deploy: Vercel (プロジェクト名 `lumina-model-agency`)

**既存URL温存**: `/studio` `/video` `/login` `/pricing` `/terms` `/privacy` `/legal` は既に本番稼働中。トップナビから目立たなくしつつ、ルート自体は触れない。

---

## 1. Brand Constitution (絶対遵守)

### 1-1. Positioning
**"The first AI Model Agency with Character Bibles."**

伝統モデルエージェンシー(IMG / Ford / DNA / Next)の「ロスター文法」と「格」を完全踏襲しつつ、AIで生成されるモデルをキャラクターIPとして運用する世界でユニークなポジション。Botika/Lalaland 等の "ツール" とは断絶し、Deep Agency 等の先行AIエージェンシーとは "Character Bible × IP tier × Ethics Code" で差別化。

### 1-2. Visual Tone
**Dark × Minimal × Edge × Tech** — Kive.ai + Nothing Tech + Apple 系譜。ストリート感なし、Editorial luxury。

### 1-3. Color System

| Role | Hex | Usage |
|---|---|---|
| Background | `#050508` | body |
| Surface | `#0A0A0F` | card, section |
| Border | `#1A1A2E` | 区切り線(shadow代替) |
| Text | `#FAFAFA` | 本文 |
| Sub-text | `#6B7280` | 補助 |
| Accent | `#00D4FF` | CTA hover, focus ring, progress bar |
| Success | `#00FF88` | 稀用 |
| Warning | `#FFB800` | 稀用 |
| Error | `#FF3366` | 稀用 |

### 1-4. Typography
- **EN**: `Inter` — Heading 600-700 / Body 400 / Nav uppercase tracking 0.08em
- **JP**: `Noto Sans JP` — Heading 700 / Body 400
- **Scale**: 12 / 14 / 16 / 20 / 28 / 40 / 64 / 96px
- **Lang switch**: EN/JP トグル、`<html lang="">` を切替

### 1-5. Motion
- Transitions: 200-300ms ease-out
- Hero: フルブリード画像/動画のゆっくりパン(6-10秒)
- Grid hover: `scale(1.02) + opacity 0.95`
- Progress bar: 200ms linear fill `#00D4FF`

### 1-6. 禁忌
- ストック写真感・ポップ配色・ドロップシャドウ多用・グラデ多用
- 「何でも屋」感(制作会社的な機能羅列)
- AI感の強調(『AI生成画像』等の押し出し) — 代わりに『Character IP』『Roster』
- 「世界初」「革命」等の強気安易コピー

---

## 2. Global Navigation

### 2-1. Header (sticky, transparent → `#050508` on scroll)

```
[ LUMINA ]                                       EN | JP
           THE ROSTER ▾   FOR BRANDS   SERVICES   ETHICS   ABOUT
                                              [ Book a Model → ]
```

- **Logo**: `LUMINA` ワードマーク。Inter 700 tracking 0.12em
- **Book a Model CTA**: Pill button, border 1px `#FAFAFA`, hover bg `#00D4FF` text `#050508`
- **THE ROSTER mega-menu** (on hover):
  ```
  ┌──────────┬──────────┬──────────┬──────────┐
  │ Women    │ Men      │ Creators │ Talent   │
  ├──────────┼──────────┼──────────┼──────────┤
  │ [thumb1] │ [thumb1] │ [thumb1] │ [thumb1] │
  │ [thumb2] │ [thumb2] │ [thumb2] │ [thumb2] │
  │ [thumb3] │ [thumb3] │ [thumb3] │ [thumb3] │
  │ View all →│ View all →│ View all →│ View all →│
  └──────────┴──────────┴──────────┴──────────┘
  ```

### 2-2. Footer (`#0A0A0F`, border-top `#1A1A2E`)

```
LUMINA MODEL AGENCY
The first AI Model Agency with Character Bibles.
Since 2026 · Founded by KOZUKI TAKAHIRO

─────────────────────────────────────────────────
THE ROSTER     FOR BRANDS       ABOUT         LEGAL
 Women          Campaign         Story         Terms
 Men            Services         Ethics        Privacy
 Creators       Pricing          Contact       IP License
 Talent         Case Studies                   Anti-fraud
─────────────────────────────────────────────────

Instagram   TikTok   X   YouTube

© 2026 TomorrowProof Inc.
```

---

## 3. Division 確定マトリクス (CEO承認 2026-04-19)

**URL構造は標準(SEO)、表示ラベルは独自冠。** 本表はすべての Header / H1 / Footer / Breadcrumb で統一適用。

| URL (SEO) | 表示ラベル (EN) | 表示ラベル (JP) | Sub-categories |
|---|---|---|---|
| `/women` | **THE ROSTER · Women** | THE ROSTER · 女性モデル | Signature / New Faces / Curve |
| `/men` | **THE ROSTER · Men** | THE ROSTER · 男性モデル | Signature / New Faces / Street |
| `/creators` | **THE ROSTER · Creators** | THE ROSTER · クリエイター | Influencers / Content Creators |
| `/talent` | **THE ROSTER · Talent** | THE ROSTER · タレント | Campaign / Icons |

---

## 4. Pages

---

### 4-1. `/` Home

**Hero (100vh)**

フルブリード ROSTER グリッド — 6-14体の beauty 画像を不規則モザイク配置(3:4 portrait基調)。一部セルを3-4秒 fade で別モデルに差替(パーソナリティ感)。

中央オーバーレイ:
```
  LUMINA
  MODEL AGENCY
  ──────────────────
  The first AI Model Agency
  with Character Bibles.
  ──────────────────
  [ Discover the Roster → ]   [ For Brands ]
```

**Section 2: Featured (1体フィーチャー動画ローテ)**
- フルブリード 16:9 動画 or Ken Burns パン (Phase 1 は静止画でOK、動画は Phase 2 送り)
- 優先順位: **LUCAS MORI** → **RINKA** → **ELENA**
- Character Bible公開版の1行: 例 `LUCAS MORI — Los Angeles · Americana · BEDWIN Muse`
- CTA: `View Profile →`

**Section 3: THE ROSTER (4 Divisions プレビュー)**
- 4カラム grid: Women / Men / Creators / Talent
- 各カラム: サムネ3体 + `View All →`
- 画像 source: `public/agency-models/*/beauty.png`

**Section 4: For Brands (ティーザー)**
- 左: コピー `From casting to content, handled.`
- 右: 3サービスカード
  1. **Model Nomination** — IP licensing for your brand
  2. **Content Production** — Image & video delivery
  3. **Campaign & Custom Services** — Full creative partnership
- CTA: `Explore For Brands →`

**Section 5: Trust / Credentials**
- 細ロゴ帯(現状は `Featured in — TomorrowProof Journal` のみ、最小限)
- AI Ethics Code preview: `Every LUMINA model is governed by our AI Ethics Code` → `/ethics`

**Section 6: News Feed (Editorial風)**
- 3カラム: 最新起用事例・メディア掲載・インタビュー
- Ford Models のニュース欄を参考

**Section 7: CTA Final**
- `Ready to work with a LUMINA model?`
- 2 CTA: `Book a Model` / `For Brands Inquiry`

---

### 4-2. Division Pages (`/women` `/men` `/creators` `/talent`)

**Header (page top)**
```
THE ROSTER                    ← eyebrow(小さく、uppercase tracking-widest)
Women                         ← H1, 96px
─────────────────────────
[ Signature ] [ New Faces ] [ Curve ]   ← sub-category filter (pill tabs)
```

**Body: ロスターグリッド**
- 3-4カラム grid、beauty.png をポートレイト 3:4 比率で表示
- Hover: overlay に `モデル名 + Location + Tag` 出現
- Click → `/models/[slug]` PDP

**Filter sidebar (desktop only)**
- Height / Body / Age / Mood / Ethnicity / Rank
- Tailwind accordion

---

### 4-3. Model PDP (`/models/[slug]`)

**Hero (大判 beauty shot)**
- Full-bleed 1枚 (モデルの beauty.png)
- 右下: モデル名 Inter 900 display size

**Meta strip**
```
LUCAS MORI
Los Angeles · Men Signature · BEDWIN Muse
185cm · Size 48 · 23
```

**Primary CTA block (右サイド sticky on desktop)**
```
[ Book LUCAS MORI → ]
[ Inquire for Campaign ]
Starting from ¥5,000/mo (Standard License)
```

**Tabs / Sections (縦並び)**
1. **Portfolio** — 既存画像 grid (beauty / campaign / editorial / polaroid)
2. **Video Reel** — 動画(Phase 2)
3. **Character** — Character Bible 公開版(測定値/声質/スタイリング等)
4. **Licensing** — Standard/Extended/Campaign/Exclusive の価格
5. **Availability** — 指名可能状況 (calendar or "Available now"バッジ)
6. **Press / Work** — 過去起用事例

**Bottom: Similar Models**
- 同Division の他3体推薦

**画像ソース**
- メイン: `public/agency-models/[slug]/beauty.png`
- Portfolio: 同ディレクトリの campaign/editorial/polaroid/look-0X
- LUCAS MORI の場合: Character Bible (`CHARACTER-BIBLE.md`)の実在URL尊重(BEDWIN 26SS等)

---

### 4-4. `/for-brands` (B2Bランディング — 最重要CVR)

**Page goals**:
- Form CVR: Phase 1 = 5%+ / Phase 2(Chatbot導入後) = 10%+
- 商談化率: submission → 初回商談 40%+
- Qualified Lead 比率: 60%+(予算¥50k/月以上)

**Section A — Hero (100vh)**

Layout: 左=コピー、右=フルブリード画像グリッド(ELENA / LUCAS MORI / RINKA 3枚モザイク)

EN Copy:
```
FOR BRANDS

From casting to content,
handled in one roster.

LUMINA is the first AI Model Agency with Character Bibles.
Model nomination, content production, and full
campaign services — delivered as one.

[ Start an Inquiry → ]  [ View Pricing ]
```

JP Copy:
```
FOR BRANDS

キャスティングから
コンテンツ納品まで、
ひとつのロスターで完結。

LUMINA は Character Bible 型の AIモデルエージェンシー。
モデル指名・コンテンツ制作・キャンペーンサービスを
ワンストップで提供します。

[ 問い合わせを始める → ]  [ 料金を見る ]
```

**Section B — Services (3カード)**

Heading: `What we deliver`

Card 01 — **MODEL NOMINATION**
> IP-license a LUMINA model for your brand.
> Use our roster's characters in your e-commerce, campaigns, and editorial.
> Monthly retainer from ¥5,000.
> _Ideal for: EC商品ページ、継続的なブランド露出_

Card 02 — **CONTENT PRODUCTION**
> We deliver images & videos in your brand's voice.
> Garment analysis → AI styling → multi-format delivery (Rakuten / Yahoo / Amazon / Shopify ready).
> _Ideal for: ささげ代替、撮影コスト80%削減_

Card 03 — **CAMPAIGN & CUSTOM**
> Full creative partnership for launches.
> Concept → casting → production → optional LP/HP direction. Tailored per project.
> _Ideal for: シーズンキャンペーン、大型ブランド施策_
> CTA: `Inquire for Campaign`

**Card 03 は価格非表示**。`Inquire` のみ。特商法リスク回避。

**Section C — How It Works (4 steps)**

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 01           │ 02           │ 03           │ 04           │
│ Tell us      │ Proposal     │ Production   │ Delivery     │
│ your brief   │              │              │              │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ Multi-step   │ Model + brief│ LUMINA Studio│ Format-ready │
│ form 4 steps │ proposal     │ production.  │ output (PNG/ │
│ or email.    │ within 48h.  │              │ MP4/WebP).   │
│ Respond in   │              │              │              │
│ 1 biz day.   │              │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

- ステップ番号を `#00D4FF`
- ステップ間は細線矢印

**Section D — Selected Work (Case Studies, 3枠)**

Heading: `Selected work`

初期3本(CEO承認):
1. **BEDWIN 26SS (LUCAS MORI muse)** — Watanabe氏直接指示でキャラ設計
2. **LUMINA internal demo — EC 20SKU** — 20SKU を従来 vs LUMINA 比較(コスト/時間/品質)
3. **Harajuku Creator Package (RINKA)** — SNS動画3本 + スチル10枚

Card template:
```
[ Hero image 3:4 ]
CASE 01
─────────────────
[Brand / Project name]
Metric: 
 - 撮影コスト削減: -XX%
 - 納期: X日 → XX時間
 - SKU数: XX
[View case →]
```

実案件獲得時、古いデモ枠から差替。最低3枠キープ。

**Section E — Pricing Overview**

Heading: `Pricing & Licensing`
Sub: `All model nominations include commercial usage rights. Scope varies by tier.`

| Tier | Use case | Monthly rate | Image cap | Video cap | Exclusivity |
|---|---|---|---|---|---|
| **Standard** | EC商品ページのみ | ¥5,000 / model | 100 / mo | — | — |
| **Extended** | EC + SNS + Web | ¥15,000 / model | 300 / mo | 10 / mo | — |
| **Campaign** | 広告・印刷・動画キャンペーン | **Inquire** | Project-based | Project-based | 案件期間中 |
| **Exclusive** | カテゴリ独占 | From ¥200,000 / mo | Unlimited | Unlimited | ✅ Category-level |

注記(表下):
```
- Content production billed per-delivery.
- Volume discounts available at Extended and above.
- All licenses renewable monthly. No lock-in.
- STUDIO self-serve access provided to Extended+ tiers at no extra cost.
```

**Section F — Multi-step Form (CVR本体)**

Heading: `Start an Inquiry`
Sub: `Takes 90 seconds. We respond within 1 business day.`
Layout: Single column, max-width 560px, center aligned. Progress bar上部。

#### Step 1 — Your Goal (required)
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

#### Step 2 — Budget Range (required)
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

#### Step 3 — Preferred Models (optional)
```
Step 3 of 4
─────────
Do you have models in mind? (optional)

[ Model grid — 14体サムネ、複数選択可、max 5 ]
Or: ○ Not sure — please recommend

[ ← Back ]  [ Next → ]
```
- Thumb size: 120×160 (3:4)
- Selected: border `#00D4FF` 2px + scale 1.02

#### Step 4 — Timeline & Contact (required)
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
[ (multiline, max 500 chars) ]

[ ← Back ]  [ Submit ]

🔒 SSL encrypted · Privacy policy · GDPR compliant
```

#### Submit Handling
1. POST to `/api/inquiry` (serverless)
2. Server-side: Supabase Postgres `inquiries` 保存 + Slack webhook `#sales-leads` + Resend 確認メール
3. Success画面:
   ```
   Thank you.
   We received your inquiry.
   You'll hear from us within 1 business day.
   Meanwhile, [ explore THE ROSTER → ]
   ```
4. Error: Step 4 画面に赤字 + `Please try again or email brand@lumina-models.com`

**Section G — FAQ (Accordion)**

8問(全文Q&A下書き済み):

**Q1. AIモデルで商品撮影しても問題ないのでは?**
LUMINAモデルは「AI生成」ではなく、キャラクターIPとして設計された専属モデルです。各モデルには詳細なキャラクター設定 (Character Bible) があり、人間の専属モデルと同じように継続的にブランドで起用できます。肖像権の曖昧さがないため、商用利用の法的リスクはむしろ軽減されます。

**Q2. IPライセンスの範囲は?**
Standard = EC商品ページのみ。Extended = EC + SNS + Web。Campaign = 広告・印刷・動画キャンペーン (案件期間中の独占可)。Exclusive = カテゴリ独占 (例: 6ヶ月間あなたのブランドのみ)。詳細はお問い合わせください。

**Q3. 納品までの期間は?**
Model Nomination = 当日。Image Production = 1 SKU あたり 24時間以内。Video = 3-5営業日。Campaign = 案件ごとに見積。

**Q4. どのフォーマットで納品されますか?**
Rakuten / Yahoo / Amazon / Shopify の規格対応済。PNG / JPEG / WebP / MP4 (H.264/H.265) を標準配信。カスタム規格も Campaign tier で対応。

**Q5. 既存の商品写真を使って生成できますか?**
はい。ガーメント写真 (平置き・吊るし) をアップロードいただければ、LUMINAモデルが着用した商品写真を生成します。色・素材・縫い目まで忠実に再現します。

**Q6. モデルの独占契約は可能?**
はい (Exclusive tier)。カテゴリ単位 (例: スニーカー) または期間単位での独占契約を提供。月額¥200,000〜。

**Q7. 契約期間・解約は?**
月額契約は毎月更新 (ロックイン無し)。30日前通知で解約可能。Campaign は案件期間ごと。

**Q8. セキュリティ・秘密保持は?**
全てのブリーフ・商品画像は暗号化保存。NDA (秘密保持契約) を標準で締結。商品未発売時の情報漏洩リスクゼロを担保。

**Section H — Trust Bar (Pre-footer)**
モノクロロゴ帯(現状: `Featured in — TomorrowProof Journal`)

**Section I — Footer CTA**
```
Still exploring?
THE ROSTER →   ETHICS →   ABOUT →
Or email us directly: brand@lumina-models.com
```

---

### 4-5. `/services`

**目的**: STUDIO/Video への導線を「エージェンシーの内部ツール」として控えめに設置。表看板ではなく裏動線。

**構造**
- **LUMINA Studio** — "Our internal content engine, also available to power users"
- **LUMINA Video Studio** — Video content pipeline
- 各カード末尾に小さく `Access Studio →` `Access Video →`

**絶対保持**: 既存 `/studio` `/video` ルートは完全維持、既存ユーザー影響ゼロ。

---

### 4-6. `/ethics` (AI Ethics Code)

> **次章で全文掲載**(セクション5)。Claude Design はこの全文をそのまま `/ethics` ページに配置する。Legal review 進行中のため、右上に `v0.2 — Legal review in progress` バッジを小さく表示。

ページ構造:
- H1: `AI Ethics Code`
- Eyebrow: `LUMINA MODEL AGENCY`
- Sub: `Last updated: 2026-04-19 · Version 0.2`
- TOC (sticky sidebar on desktop, accordion on mobile): §0 〜 §10 リンク
- 本文: 次章 "5. Full Content — AI Ethics Code" を全文表示
- Changelog: ページ最下部に table

---

### 4-7. `/about`

- **Story**: Since 2026, Founded by KOZUKI TAKAHIRO (Fashion Director + AI Strategist, TomorrowProof Inc.)
- **Founder message**: 1-2 段落、なぜLUMINAを立ち上げたか
- **Team**: TomorrowProof Inc. メンバー(将来)
- **Press / Media mentions**: 掲載履歴
- **Contact info**: `brand@lumina-models.com` / `ethics@lumina-models.com`

---

### 4-8. `/legal/*`

既存4ページ(`/terms` `/privacy` `/legal` `/legal/ai-disclaimer`)を温存 + 新規追加:

- `/legal/ip-license` — **次章で全文掲載**(セクション6)
- `/legal/anti-fraud` — 詐欺警告(Next Management 流)

---

## 5. Full Content — AI Ethics Code

> **`/ethics` ページに全文表示する本文**。EN primary + JP summary per section。

### 5-0. Preamble
This code governs how LUMINA MODEL AGENCY creates, licenses, and deprecates its AI-generated models. It is a **public commitment**, not an internal guideline.

本規範は、LUMINA MODEL AGENCY がAIモデルを「どう作り」「どう貸し出し」「どう引退させるか」の公的な約束です。

### 5-1. How our models are created
- Every LUMINA model is a **fictional character** built from original creative direction, not a digital replica of any real person.
- Training uses licensed or fair-use foundation models (Gemini, Seedance 2.0, etc.). No non-consensual ingestion.
- Direction is authored by LUMINA's creative director (KOZUKI TAKAHIRO) or written co-direction with third-party collaborators (e.g. BEDWIN's Masafumi Watanabe for LUCAS MORI).
- Each model has a documented **Character Bible** — appearance, proportion, styling, voice quality, behaviour. This is the single source of truth during generation.

### 5-2. Likeness, consent & IP
- LUMINA is the **sole copyright owner** of each model's identity, name, visual likeness, voice, and character attributes, worldwide and in perpetuity.
- Licensees receive **usage license only** — they do not acquire model IP. Scope varies by tier.
- Client-provided garments / logos / creative stay with the client. LUMINA's license to display those inputs is scope-limited.
- No sub-licensing or transfer between clients within the same Exclusive category period.

### 5-3. Real-person impersonation — banned
- LUMINA models **must not resemble any identifiable real person** (living or deceased) to a degree that could confuse reasonable viewers.
- We refuse briefs that ask for: celebrity replication, named-individual impersonation without consent, any deepfake.
- If a generation accidentally converges on a real-person likeness, **retire and regenerate**.
- Ethnic/regional/archetypal references (e.g. "Scandinavian editorial", "Tokyo street") are allowed — these describe style, not a specific person.

### 5-4. Brand safety guidelines
LUMINA models may not appear in content that:
- Promotes illegal activity, hate speech, or harassment
- Depicts sexual content involving minors or anyone appearing to be a minor (**zero tolerance**)
- Non-consensual sexual content, sexual violence, coercion (**prohibited**)
- Political campaigns, election advocacy, religious conversion — Campaign-tier + Legal review only
- Weapons sales, illegal drugs, gambling targeted at minors
- Health/vaccine/election misinformation
- Violates brand-safety policies of Meta, Google, TikTok

Adult (18+) fashion/editorial work (lingerie, swimwear) permitted under appropriate tier + platform age verification.

### 5-5. Transparency obligations
- Brands are **not required** to disclose AI usage to consumers — LUMINA models are fictional characters, there is no "real person photography" to reveal.
- LUMINA provides a disclosure template for voluntary transparency aligned with EU AI Act §50.
- LUMINA discloses AI usage on `/ethics`, `/about`, press materials. We don't hide what we do.
- Brands **must not claim** a LUMINA model is a "real human model" in marketing copy.

### 5-6. Data handling & client confidentiality
- Encrypted at rest (AES-256), in transit (TLS 1.3).
- **Mutual NDA as standard** before any brief is shared.
- Client content used **only for the contracted engagement**, deleted within 90 days (extendable to 24 months max with written request).
- We do NOT train any proprietary model on client-provided content.
- Data residency: Japan (Supabase Japan). Third-party inference providers (Gemini, Runway) per their DPA.

### 5-7. Model lifecycle & retirement
- **Retirement triggers**: Character Bible fundamental revision / ethical risk / co-director withdrawal.
- Active licensees notified **60 days in advance**.
- Already-delivered content remains licensed under original terms (no retroactive revocation).
- Retired model names and visual assets are **permanently shelved**. No revival, no sub-brand re-use.
- Exclusive tier includes model-continuity guarantees for the contracted period.

### 5-8. Human oversight & editorial control
- Every generation reviewed by a human editor before delivery.
- **Two-tier quality gate**:
  - Tier 1 (Automated): garment analysis QA + generation QA
  - Tier 2 (Human): creative director review for character consistency + brand safety
- Clients may appeal any delivery — regenerated at no additional cost within contracted quota.

### 5-9. Reporting concerns
- Email: **ethics@lumina-models.com**
- Response: 48 business hours initial ack, 14 days resolution
- Anonymised annual summaries at `/ethics/reports`

### 5-10. Changes to this code
- Versioned. Material changes announced 30 days in advance to active licensees + page changelog.
- Minor editorial clarifications without notice, redlines preserved.
- Version + last-updated date always shown at top.

### Glossary
| Term | Definition |
|---|---|
| **Model** | A LUMINA fictional character (e.g. LUCAS MORI, ELENA, RINKA) with a documented Character Bible. |
| **Character Bible** | Authoritative specification of a model's appearance, proportion, styling, voice, behaviour. |
| **License tier** | Standard / Extended / Campaign / Exclusive. Defines IP usage scope. |
| **Deepfake** | AI-generated content portraying a real person without consent. |
| **Retirement** | Permanent shelving of a LUMINA model. No revival. |

### Changelog
| Version | Date | Changes | Approver |
|---|---|---|---|
| v0.1 (Draft) | 2026-04-19 | Initial draft | dev (代行) |
| v0.2 (CEO approved, Legal review in progress) | 2026-04-19 | CEO 内容承認 | CEO |
| v1.0 | TBD | Legal review完了 + publication | Legal + CEO |

---

## 6. Full Content — IP License Tiers

> **`/legal/ip-license` ページに全文表示する本文**。

### 6-1. Tier summary

| Tier | Monthly rate | Use cases | Image cap | Video cap | Territory | Duration | Exclusivity |
|---|---|---|---|---|---|---|---|
| **Standard** | ¥5,000 / model | EC product pages only | 100 / mo | — | Worldwide | Monthly auto-renew | None |
| **Extended** | ¥15,000 / model | EC + SNS + Web (brand-owned) | 300 / mo | 10 / mo | Worldwide | Monthly auto-renew | None |
| **Campaign** | Inquire | EC + SNS + Web + paid ads + print + broadcast + OOH | Project-based | Project-based | Agreed per campaign | Per campaign | Category-exclusive during period |
| **Exclusive** | From ¥200,000 / mo | Full commercial, exclusive to licensee within category | Unlimited | Unlimited | Worldwide | 6-month min | Category-level across all LUMINA clients |

### 6-2. Use cases per tier

**Standard**
- ✅ Licensee's own EC product pages (Rakuten / Yahoo / Amazon / Shopify / brand DTC)
- ✅ Product thumbnails / gallery for those pages
- ✅ Transactional email marketing (order confirmations, abandonment)
- ❌ Paid ads, SNS posts, print, OOH, broadcast, editorial, resellers, sub-licensing

**Extended (adds to Standard)**
- ✅ Brand-owned SNS accounts (IG / X / TikTok / FB / LinkedIn / Pinterest / YouTube / etc.)
- ✅ Brand-owned blog, editorial, content marketing
- ✅ Promotional email marketing
- ✅ 10 short videos per month (9:16 / 16:9 / 1:1, up to 15s)
- ❌ Paid advertising, sub-licensing, reseller distribution

**Campaign**
- All above + paid advertising (Meta / Google / TikTok / X / LINE / YouTube / OOH / print / broadcast / OTT)
- Co-marketing with partner brands (within scope)
- Event and retail signage
- PR/media distribution
- Scope: negotiated per project
- During active campaign window: named model will NOT appear in competing-category campaigns for other LUMINA clients
- Political / religious / election usage requires additional Legal review

**Exclusive**
- All of Campaign + category exclusivity for contract duration
- Category scope defined at signing (e.g. "women's sneakers")
- Min 6 months, auto-renews in 6-month increments unless 90-day notice
- Pricing from ¥200,000/mo; enterprise/multi-model negotiated separately

### 6-3. Territory
- Default: Worldwide (Standard / Extended / Exclusive)
- Campaign: per-contract
- All Berne Convention countries covered
- Unique name-and-likeness laws (California Civil Code §3344 etc.) honoured via impersonation prohibition (Ethics §3)

### 6-4. Duration & renewal
| Tier | Min term | Default renewal | Cancel notice |
|---|---|---|---|
| Standard | 1 month | Monthly auto-renew | 30 days |
| Extended | 1 month | Monthly auto-renew | 30 days |
| Campaign | Per project | None (ends on campaign end) | N/A |
| Exclusive | 6 months | 6-month auto-renew | 90 days |

All tiers support paid upgrade mid-term, prorated.

### 6-5. IP Ownership

**LUMINA owns (perpetually, worldwide, exclusively)**:
- Model identity, name, visual likeness, voice, Character Bible
- Training pipelines and generation methodology
- Raw output prior to licensee post-production

**Licensee owns**:
- Their garment designs, logos, brand assets, copy
- Campaign-specific creative direction they author
- Finished composite content (edited videos, retouched images) — composite only, not underlying LUMINA asset

**Joint (mutual consent required)**:
- Co-created Campaign concepts where LUMINA contributed direction
- Case study materials for LUMINA marketing

### 6-6. Client-supplied content
- Fully owned by client; LUMINA license limited to contracted scope and duration
- Deleted within 90 days post-engagement (extendable to 24 months max with written request)
- NOT used to train any model (see Ethics §6)

### 6-7. Sub-licensing & transfer
- **No sub-licensing without written LUMINA consent**
- Co-branded campaigns: Campaign/Exclusive only, explicit scope in contract
- Agency arrangements: end-client must be disclosed; license ties to end-client
- M&A: license survives current term; new entity renewal required after

### 6-8. Revoke vs. survive

**On non-renewal/cancellation**:
- 🚫 Revoked: new content generation, new uses outside original scope, active partnership claims
- ✅ Survives: already-published content under original scope, historical/archive use, printed materials (no recall)

**On LUMINA-initiated retirement**:
- 60-day notice
- No new generation after retirement date
- Existing deliverables remain licensed
- Goodwill: substitution with similar model offered at current tier rate

**On breach**:
- 14-day notice for material breach
- Cure period preferred over termination, unless breach irreversible

### 6-9. Dispute resolution
- Governing law: Japan
- Forum: Tokyo District Court (first instance), or Japan Commercial Arbitration Association (if both parties agree)
- 30-day good-faith negotiation mandatory before formal action
- Cross-border: default Japanese law, alternative agreed per contract

### 6-10. How LUMINA differs from traditional agencies

| Aspect | Traditional modeling agency | **LUMINA** |
|---|---|---|
| Model is | A real person | A fictional character (IP) |
| Who holds IP | Model + agency (split) | LUMINA (sole) |
| Real-person impersonation risk | Inherent | Zero (prohibited, Ethics §3) |
| Name/likeness rights | Complex per jurisdiction | Contractually simple |
| Release forms (撮影同意書) | Required per shoot | Not applicable |
| Residuals / royalties | Often | Flat tier pricing |
| Estate/posthumous rights | Relevant | Not applicable |

---

## 7. Component Library

Claude Design が生成すべき共通部品:

| Component | Specs |
|---|---|
| `ModelCard` | portrait 3:4, name + division + location overlay on hover, scale(1.02) |
| `DivisionHero` | eyebrow + H1 + sub-category pill tabs |
| `CTAButton` | primary (filled `#FAFAFA` bg, `#050508` text) / secondary (outline) / ghost |
| `FormStep` | Multi-step wizard with progress bar `#00D4FF` |
| `NewsCard` | editorial風、日付 + カテゴリ + 画像 + 見出し |
| `ServiceCard` | アイコン + タイトル + 3行 + CTA |
| `TrustBar` | モノクロロゴ帯 |
| `LicenseTable` | ランク別価格表 |
| `TabSection` | vertical tabs (Portfolio/Character/Licensing etc.) |
| `StickyBookCTA` | PDP 右サイド sticky CTA block |
| `FAQ` | accordion、`FAQPage` Schema.org マークアップ |
| `LanguageToggle` | EN/JP 切替 |

---

## 8. Image & Media Direction

### 8-1. Existing Asset Library
- **ロスター 14体**: `public/agency-models/[slug]/beauty.png` を各モデルPDP/カードで使用
- **Portfolio画像**: `public/agency-models/[slug]/` 内の campaign / editorial / polaroid / look-0X
- 特に **LUCAS MORI** (`men-street-02/`) は BEDWIN 26SS muse、最深のCharacter Bible保持

### 8-2. Hero Video (Phase 2 送り — Phase 1 は静止画 Ken Burns パンで OK)

優先生成順(将来):
1. **LUCAS MORI** — Rumble Fish (1983, Coppola) style, 8s, 16:9
2. **RINKA** — Lost in Translation + Kamikaze Girls, 8s, 9:16
3. **ELENA** — A Single Man (Tom Ford) + Blow-Up, 8s, 16:9

プロンプトは `data/videoPresets.ts` 参照(既にコード内で定義済み)。
生成は当面 Seedance 2.0 via Runway API で検証中(cost $0.13/sec)。コスト次第で Kling via Replicate にフォールバック。

### 8-3. OGP (1200×630 PNG)
- `/og/home.png` — ROSTER グリッド代表カット
- `/og/for-brands.png` — B2B 訴求カット
- `/og/[slug].png` — モデル個別(14体分)
- `/og/ethics.png` — シンプルロゴ + "AI Ethics Code"

---

## 9. Technical SEO Requirements

### Core Web Vitals 目標 (Lighthouse 90+)
| 項目 | 目標 |
|---|---|
| LCP | < 2.0s |
| INP | < 200ms |
| CLS | < 0.1 |
| TTFB | < 0.6s |

### Meta / OG / Twitter (全ページ共通テンプレ)
```html
<meta name="description" content="{page-specific}">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="{/og/[slug].png}">
<meta property="og:url" content="{canonical}">
<meta property="og:site_name" content="LUMINA MODEL AGENCY">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@luminamodels">
<link rel="canonical" href="{canonical}">
```

### sitemap / robots
- `/sitemap.xml` 自動生成
- `/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Disallow: /studio/
  Disallow: /test/
  Sitemap: https://lumina-model-agency.vercel.app/sitemap.xml
  ```

### Schema.org 必須
- `Organization` (全ページ)
- `BreadcrumbList` (深いページ)
- `FAQPage` (/for-brands, /ethics)
- `CollectionPage` + `ItemList` (Division Pages)
- `Person` + `additionalType: FictionalCharacter` (/models/[slug])
- `Article` + `dateModified` (/ethics)
- `Service` + `Offer` + `PriceSpecification` (/for-brands, /legal/ip-license)

---

## 10. Out of Scope (このプロジェクトで絶対やらないこと)

- 画像のAI再生成(既存 beauty.png をそのまま使う)
- Studio/Video のUI変更 / `/studio` `/video` ルート改変
- AI生成プロセスの詳細説明(「AI」前面化せず「Character IP」と表現)
- 実在モデルとの比較表(倫理・Legal許容度を超える)
- Paid SEM 設計(Google Ads は別agent管轄)
- 商品販売機能(LUMINAは小売しない)

---

## 11. Success Criteria

- Claude Design → React移植が 2週間以内に完了
- `/for-brands` Multi-step form CVR 10%以上(Phase 2 Chatbot導入後)
- "AI fashion model agency" キーワードで Google top 10(90日後)
- ブランド検索 `LUMINA MODEL AGENCY` で top 1(90日後)
- Phase 1 ローンチ: **2026-05-10**
- 公開後30日以内に B2B 商談 10件以上獲得

---

## 12. Implementation Phasing

### Phase 1 (Launch minimum, 04-22 ~ 05-10)
- Hero / Services / How it works / Pricing table / Multi-step form / FAQ / Footer CTA
- Submit: Slack webhook `#sales-leads` のみ(Supabase は可能なら並行、最悪後回し)
- Case Studies: 自社デモ3本で埋める(BEDWIN / 20SKU / RINKA)
- Hero: 静止画 Ken Burns パン

### Phase 2 (Polish, 05-10 ~ 06-10)
- Case Studies 実案件差替え開始
- Hero 動画(Seedance 2.0 または Kling)
- Chatbot (Claude Haiku) 統合
- GA4 + Search Console ダッシュボード
- A/B テスト基盤

### Phase 3 (Growth, 06-10 〜)
- EN/JP 両方のフル最適化
- PDP → Book Direct 動線の強化
- Video case study embed
- SEO: Journal 長文記事 15本目標
- Backlink: Tier 2 メディア3本獲得

---

## 13. Config Reference (dev 実装時)

- Project: `lumina-model-agency` (Vercel)
- URL: `https://lumina-model-agency.vercel.app/` → future `lumina-aimodels-agency.com`
- Email: `brand@lumina-models.com` (B2B) / `ethics@lumina-models.com` (Ethics)
- Slack: `#sales-leads` webhook
- Stack: React 19 + TypeScript + Vite + Tailwind CSS
- Auth: Supabase (既存)
- Data: `data/agencyModels.ts` で14体モデル定義済み

---

**Document Owner**: dev + branding (代行作成)
**CEO Approved**: 2026-04-19 (Council 決定 + Open Questions 5項目×2 決定済)
**Legal Review**: In progress for Ethics Code + IP License
**Last Updated**: 2026-04-19

---

## Appendix: File References

統合元(このマスターで完結しているが、参照元は残置):
- `docs/design/lumina-agency-hp-spec.md`
- `docs/design/for-brands-page-spec.md`
- `docs/design/ai-ethics-code.md`
- `docs/design/ip-license-tiers.md`

関連(マスターに含めず別運用):
- `docs/design/seo-strategy.md` (SEO は実装後の運用計画なので別管理)
- `data/videoPresets.ts` (Hero動画プロンプト、Phase 2時に参照)
- `journal/2026/04/19.md` (Council議事録)

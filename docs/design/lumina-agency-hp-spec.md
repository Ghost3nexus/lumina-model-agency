# LUMINA MODEL AGENCY — HP IA / Design Specification

> **このドキュメントはClaude Designへ投入する仕様書。**
> KOZUKIが Claude Design に全文コピペすれば、LUMINA MODEL AGENCY の公式HPがワイヤーフレーム+ビジュアル方向性を含む形で生成される。
>
> 決定根拠: Council 2026-04-19 / journal/2026/04/19.md
> 参照競合: IMG Models / Ford Models / DNA Models / Next Management / The Society Management / Storm Management

---

## 0. Meta Context for Claude Design

**Project**: LUMINA MODEL AGENCY — The world's first AI Model Agency
**Type**: Multi-page marketing website with B2B booking funnel
**Framework target**: React 19 + TypeScript + Vite + Tailwind CSS (already set up)
**Existing integration**: React Router (/, /studio, /video are already wired — this spec covers NEW routes)
**Deploy**: Vercel (project: lumina-model-agency)

**Mission**: 伝統モデルエージェンシー(IMG/Ford/DNA/Next)の「ロスター文法」と「格」を完全踏襲しつつ、AIで生成・運用されるモデルをキャラクターIPとして売る新カテゴリの先駆者として世界で唯一のポジションを確立する。

---

## 1. Brand Constitution (絶対遵守)

### Visual tone
**Dark × Minimal × Edge × Tech** — Kive.ai + Nothing Tech + Apple の系譜。ストリート感なしの Editorial luxury。

### Color System
| Role | Hex | Usage |
|---|---|---|
| Background | `#050508` | body |
| Surface | `#0A0A0F` | card, section |
| Border | `#1A1A2E` | 区切り線(shadowの代替) |
| Text | `#FAFAFA` | 本文 |
| Sub-text | `#6B7280` | 補助 |
| Accent | `#00D4FF` | CTA hover, focus ring |
| Success | `#00FF88` | 稀用 |
| Warning | `#FFB800` | 稀用 |
| Error | `#FF3366` | 稀用 |

### Typography
- **EN**: `Inter` — Heading 600-700 / Body 400 / Uppercase tracking 0.08em for nav
- **JP**: `Noto Sans JP` — Heading 700 / Body 400
- **Scale**: 12/14/16/20/28/40/64/96px

### Motion
- Transitions: 200-300ms ease-out
- Hero: フルブリード画像/動画のゆっくりパン(6-10秒)
- Grid hover: scale(1.02) + opacity 0.95

### 禁忌
- ストック写真感・ポップ配色・ドロップシャドウ多用・グラデ多用
- 「何でも屋」感(制作会社的な機能羅列)
- AI感の強調(『AI生成画像』等の押し出し) — 代わりに『Character IP』『Roster』と表現

---

## 2. Global Navigation

### Header (sticky, transparent → #050508 on scroll)
```
[ LUMINA ]                                  EN | JP
            THE ROSTER   FOR BRANDS   SERVICES   ETHICS   ABOUT
                                                    [ Book a Model → ]
```

- Logo: `LUMINA` ワードマーク。Inter 700 tracking 0.12em
- Book a Model CTA: Pill button, border 1px `#FAFAFA`, hover: bg `#00D4FF` text `#050508`
- THE ROSTER on hover: mega-menu開示 (Women / Men / Creators / Talent の4カラム+各モデルサムネ3体)

### Footer (#0A0A0F, border-top)
```
LUMINA MODEL AGENCY
The world's first AI Model Agency.
Since 2026 · Founded by KOZUKI TAKAHIRO
──────────────────────────────────────
THE ROSTER     FOR BRANDS       ABOUT         LEGAL
 Women          Campaign         Story         Terms
 Men            Services         Ethics        Privacy
 Creators       Pricing          Contact       IP License
 Talent         Case Studies                   Anti-fraud
──────────────────────────────────────
Instagram   TikTok   X   YouTube
© 2026 TomorrowProof Inc.
```

---

## 3. Pages

### 3-1. `/` Home

**Hero (100vh)**
- Full-bleed ROSTER grid: 6-14体のbeauty画像を不規則モザイク配置(3:4 portrait基調)
- Grid の一部セルを3-4秒 fade で別モデルに差し替え(パーソナリティ感)
- 中央オーバーレイ: ごく細い line 大判タイポ

```
  LUMINA
  MODEL AGENCY
  ──────────────────
  The world's first
  AI Model Agency.
  ──────────────────
  [ Discover the Roster → ]   [ For Brands ]
```

- 下スクロールインジケータ: 細線+"Scroll"

**Section 2: Featured (1体フィーチャー動画ローテ)**
- フルブリード 16:9 動画ローテーション(3本、各6秒)
- 優先順位: **LUCAS MORI** → **RINKA** → **ELENA**
- Character Bible公開版の1行: 例 `LUCAS MORI — Los Angeles · Americana · BEDWIN Muse`
- CTA: `View Profile →`
- 動画パス参照: `docs/sns-shorts/rinka-grwm-01/` 等既存素材から選定

**Section 3: THE ROSTER (4 Divisions プレビュー)**
- 4カラム grid: Women / Men / Creators / Talent
- 各カラム: サムネ3体 + "View All →"
- 画像は `public/agency-models/*/beauty.png` から抽出

**Section 4: For Brands (ティーザー)**
- 左: コピー "From casting to content, handled."
- 右: エージェンシーサービスの3カード
  1. Model Nomination — IP licensing for your brand
  2. Content Production — Image & video delivery
  3. Campaign Services — Full creative partnership
- CTA: `Explore For Brands →`

**Section 5: Trust / Credentials**
- 細いロゴ帯: 起用実績 or Media mentions (Since 2026なので "Featured in — TomorrowProof journal" 等最小限)
- AI Ethics Code preview: "Every LUMINA model is governed by our AI Ethics Code" → `/ethics`

**Section 6: News Feed (Editorial風)**
- 3カラム: 最新の起用事例・メディア・インタビュー
- Ford Modelsのニュース欄を参考。editorial感

**Section 7: CTA Final**
- `Ready to work with a LUMINA model?`
- 2 CTA: `Book a Model` / `For Brands Inquiry`

---

### 3-2. `/women`, `/men`, `/creators`, `/talent` (Division Pages)

URL構造は標準(SEO)、表示ラベルは独自冠。**CEO承認済(2026-04-19)**。

**Division 確定マトリクス**

| URL (SEO) | 表示ラベル (EN) | 表示ラベル (JP) | Sub-categories |
|---|---|---|---|
| `/women` | **THE ROSTER · Women** | THE ROSTER · 女性モデル | Signature / New Faces / Curve |
| `/men` | **THE ROSTER · Men** | THE ROSTER · 男性モデル | Signature / New Faces / Street |
| `/creators` | **THE ROSTER · Creators** | THE ROSTER · クリエイター | Influencers / Content Creators |
| `/talent` | **THE ROSTER · Talent** | THE ROSTER · タレント | Campaign / Icons |

この表記は以下すべてで統一:
- Global header mega-menu
- Division page H1 (eyebrow + main)
- Footer links
- Meta title タグ (SEO用)
- Breadcrumb

**Header (page top)**
```
THE ROSTER                    ← eyebrow(小さく)
Women                         ← H1, 96px
─────────────────────────
[ Signature ] [ New Faces ] [ Curve ]   ← sub-category filter
```

**Body: ロスターグリッド**
- 3-4カラムの grid。beauty.png をポートレイト比率で
- Hover: モデル名 + Location + Tag が overlay 出現
- Click → `/models/[slug]` PDP

**Filter sidebar (desktop only)**
- Height / Body / Age / Mood / Ethnicity / Rank
- Tailwind でアコーディオン実装

---

### 3-3. `/models/[slug]` Model PDP (最重要)

**Hero (大判 beauty shot)**
- Full-bleed 1枚 (模特のbeauty.png)
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
2. **Video Reel** — Video Studio 生成の動画
3. **Character** — Character Bible 公開版 (BEDWIN Watanabe仕様、測定値、声質トーン等)
4. **Licensing** — Standard/Extended/Campaign/Exclusive の価格表
5. **Availability** — 指名可能状況 (calendar風 or "Available now"バッジ)
6. **Press / Work** — 過去の起用事例

**Bottom: Similar Models**
- 同Division の他3体推薦

**Image direction**
- メイン beauty shot は既存 `public/agency-models/[slug]/beauty.png`
- Portfolio は同ディレクトリの campaign/editorial/polaroid/look-0X から
- LUCAS MORI の場合は特に `CHARACTER-BIBLE.md` の既存実在URL(BEDWIN 26SS等)を尊重

---

### 3-4. `/for-brands` (B2Bランディング — 最重要CVR設計)

> **詳細仕様は別ファイル**: `docs/design/for-brands-page-spec.md` (CEO承認待ちの5項目含む)
> 以下は概要のみ。実装時は詳細specを正とする。

**Hero**
```
For Brands

From casting to content,
handled in a single roster.

[ Start an Inquiry → ]
```
- サブ: "LUMINA is the world's first AI Model Agency — model nomination, content production, and full campaign services, delivered as one."

**Section 2: Services (3カード)**
| # | Service | One-liner | Use case |
|---|---|---|---|
| 1 | Model Nomination | IP license a LUMINA model for your brand | EC商品ページ、月次キャンペーン |
| 2 | Content Production | We deliver images & videos in your brand's voice | ささげ外注代替 |
| 3 | Campaign & Custom Services | Full creative partnership for launches | シーズンキャンペーン、LPフル制作 |

**Section 3: How It Works (4ステップフロー)**
1. Tell us your brief — Multi-step form(4ステップ: 目的→予算→指名モデル→希望時期)
2. Model & brief proposal — 48時間以内
3. Content production — LUMINA Studio 経由で納品
4. Delivery — 指定フォーマットで納品(楽天/Yahoo/Amazon対応)

**Section 4: Case Studies (3本)**
- 現状は自社事例 + デモ起用例3本。今後実案件で差し替え
- 画像 + 成果数字(時間削減%、コスト削減%)

**Section 5: Pricing overview**
- License ranks (Standard ¥5k〜 Extended ¥15k〜 Campaign ¥50k〜 Exclusive ¥200k〜)
- STUDIO self-serve プランは **ここでは言及しない**(裏動線)
- Campaign は価格非表示、`Inquire for Campaign` CTA のみ

**Section 6: Multi-step Form (CVR本体)**

4ステップ wizard:
```
Step 1: Your goal
  ○ E-commerce product photos
  ○ Campaign / Seasonal launch
  ○ Content series (ongoing)
  ○ Other

Step 2: Budget range
  ○ Under ¥50k/month
  ○ ¥50k - ¥200k/month
  ○ ¥200k - ¥1M / project
  ○ ¥1M+ / project

Step 3: Preferred model(s) — optional
  [ ロスターから複数選択可 — card grid ]

Step 4: Timeline & contact
  - Name / Company / Email
  - Start date / Launch date
  - Notes (optional)

[ Submit ]  Trust badges: SSL / Privacy policy linked
```

- 実装: React Hook Form or native state
- Submit 後: 確認メール(Supabase Edge Function or Resend) + Slack webhook to sales

**Section 7: FAQ (Expand/collapse)**
- IPライセンスの範囲は？
- AIモデルで商品撮影しても問題ない?
- 納品までの期間は?
- モデルの独占契約は可能?

---

### 3-5. `/services`

**目的**: STUDIO/Videoへの導線を「エージェンシーの内部ツール」として控えめに設置。表看板ではなく裏動線。

**構造**
- LUMINA Studio — "Our internal content engine, also available to power users"
- LUMINA Video Studio — Video content pipeline
- 各カード末尾に小さく `Access Studio →` `Access Video →`

**注意**: 既存 `/studio` `/video` ルートは完全維持。既存ユーザー影響ゼロ。

---

### 3-6. `/ethics` (AI Ethics Code)

> **起草完了**: `docs/design/ai-ethics-code.md` (Legal review待ち)
> **IPライセンス表**: `docs/design/ip-license-tiers.md` (companion doc, `/legal/ip-license` 配置)
>
> Storm Management の AI Code of Practice を参照。

**構造骨子**
1. Our commitment (価値宣言)
2. How LUMINA models are created (技術透明性)
3. Likeness, consent, and IP (肖像権・同意・IP帰属)
4. No deepfake of real people (実在人物模倣禁止ポリシー)
5. Brand safety guidelines (アダルト/政治/宗教の扱い)
6. Model retirement policy (廃モデル時のデータ処理)
7. Reporting concerns (通報窓口)

**Visual**: テキスト中心。中段にインフォグラフィック1点(Lumina model lifecycle)。

---

### 3-7. `/about`

- Story (Since 2026, Founded by KOZUKI TAKAHIRO)
- Founder message
- Team (TomorrowProof Inc.)
- Press / Media mentions
- Contact info

---

### 3-8. `/legal/*` (既存維持)

既存の4ページ(`/terms` `/privacy` `/legal` AI免責)+ 新規追加:
- `/legal/ip-license` — IP License tiers (Standard/Extended/Campaign/Exclusive)
- `/legal/anti-fraud` — 詐欺警告(Next Management流)

---

## 4. Component Library (Claude Design が生成すべき共通部品)

| Component | Specs |
|---|---|
| `ModelCard` | portrait 3:4 / name + division + location overlay / hover scale |
| `DivisionHero` | eyebrow + H1 + sub-category tabs |
| `CTAButton` | primary(filled #FAFAFA bg) / secondary(outline) / ghost |
| `FormStep` | Multi-step wizard, progress bar `#00D4FF` |
| `NewsCard` | editorial風、日付+カテゴリ+画像+見出し |
| `ServiceCard` | アイコン+タイトル+3行+CTA |
| `TrustBar` | モノクロロゴ帯 |
| `LicenseTable` | ランク別価格表 |

---

## 5. Hero動画ローテーション選定(task #5, 04-24期限)

優先順位(council決定):
1. **LUCAS MORI** — Americana / BEDWIN / 首タトゥー / Matt Dillon声トーン
2. **RINKA** — GRWM / 若年層訴求 / 既存素材 `docs/sns-shorts/rinka-grwm-01/`
3. **ELENA** — Editorial luxury / 商標出願予定モデル

各6秒、16:9、H.264、最大8MB。

---

## 6. Reference Gallery (Claude Design が視覚的ムードを理解するため)

これらのサイトの"雰囲気"を参照: IMG Models (`imgmodels.com`) / Ford Models (`fordmodels.com`) / DNA Models (`dnamodels.com`) / The Society Management (`thesocietymanagement.com`)

共通要素:
- フルブリード写真/動画
- ミニマル・ダーク
- 大判タイポ(Display size)
- 余白多め
- ブランドロゴは控えめ

---

## 7. Claude Design 投入手順 (KOZUKI 用)

1. Claude Design を開く
2. New Project → "Website" → "Marketing / Agency"
3. このファイル全文をコピーして Initial Prompt に貼り付け
4. Brand colors を上記 Color System で設定
5. Typography を Inter + Noto Sans JP で設定
6. 最初に `/` (Home) から生成 → 他ページへ
7. 生成結果をレビュー、dev にフィードバックしてReact化

---

## 8. Out of scope (今回やらないこと)

- 画像のAI再生成(既存 beauty.png をそのまま使う)
- Studio/Video のUI変更
- 既存 `/studio` `/video` ルートの変更
- 日英の同時ローンチ(英語から先行、日本語は Phase 2)

---

## 9. Success Criteria

- Claude Design から React プロジェクトへの移植が 2週間以内に完了
- `/for-brands` Multi-step form CVR 10% 以上(Phase 2 Chatbot導入後)
- "AI Model Agency" キーワードで Google 検索 1-3位(英/日)
- 公開後 30日以内に B2B 商談 10件獲得

---

**Document Owner**: dev + branding(代行作成)
**Approval Needed**: KOZUKI (Division labels / Hero priority / 投入スケジュール)
**Last Updated**: 2026-04-19

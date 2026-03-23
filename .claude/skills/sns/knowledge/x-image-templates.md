# X画像生成プロンプトテンプレート — Replicate Flux MCP対応

> TomorrowProofブランドガイドライン準拠。全テンプレート共通で
> ダーク × ミニマル × エッジ × テック のビジュアルを維持する。

---

## ブランド共通サフィックス（全プロンプト末尾に付与）

```
, ultra minimal design, dark background #050508, clean typography, no clutter, no stock photo aesthetic, professional tech branding, high contrast, sharp edges, 8k quality
```

> 全テンプレートのプロンプト末尾にこのサフィックスを追加すること。
> 以下のテンプレートには既に組み込み済み。

---

## Replicate Flux MCP ツールでの使い方

```
1. mcp__replicate-flux__generate_image を呼び出す
2. prompt にテンプレートのプロンプト全文を渡す
3. width / height をテンプレート指定値に設定
4. [TEXT] 部分を実際のコピーに置換してから実行
```

### パラメータ例

```
tool: mcp__replicate-flux__generate_image
prompt: [テンプレートのプロンプト全文]
width: 1200
height: 675
```

---

## テンプレート一覧

---

### 1. データカード（データ・統計投稿用）

**用途**: 数字・統計・KPIを強調するポスト。「〇〇が△△%増加」「売上XX万円突破」など。

**プロンプト**:

```
Minimalist data visualization card, solid dark background color #050508, one large bold number "[NUMBER]" in cyan #00D4FF centered, small label text "[LABEL]" in white #FAFAFA below the number, subtle geometric grid pattern in dark gray #0A0A0F, thin cyan accent line at bottom, no gradients, no photos, clean sans-serif typography, ultra minimal design, dark background #050508, clean typography, no clutter, no stock photo aesthetic, professional tech branding, high contrast, sharp edges, 8k quality
```

**サイズ**: 1200 x 675px

**カラー適用**:
- 背景: #050508（ソリッド）
- 数字: #00D4FF（シアン、最大要素）
- ラベル: #FAFAFA（オフホワイト、小さめ）
- パターン: #0A0A0F（ダークグレー、微細）
- アクセントライン: #00D4FF

**置換箇所**:
- `[NUMBER]` → 表示する数字（例: "147%", "¥3.2M", "10x"）
- `[LABEL]` → 数字の説明（例: "CVR improvement", "月間売上"）

---

### 2. スレッドヘッダー（スレッド1投目用）

**用途**: Xスレッドの最初のツイートに添付。「保存推奨」バッジでエンゲージメント誘導。

**プロンプト**:

```
Thread header card for social media, dark gradient background from #050508 to #0A0A0F, title text area in center with white #FAFAFA bold sans-serif text "[TITLE]", small thread icon symbol in cyan #00D4FF at top left corner, small badge label "SAVE THIS" in a thin bordered rounded rectangle with cyan #00D4FF border at top right, subtle vertical lines pattern in #1A1A2E, ultra minimal design, dark background #050508, clean typography, no clutter, no stock photo aesthetic, professional tech branding, high contrast, sharp edges, 8k quality
```

**サイズ**: 1200 x 675px

**カラー適用**:
- 背景: #050508 → #0A0A0F（微細グラデーション）
- タイトル: #FAFAFA（白、中央配置）
- スレッドアイコン: #00D4FF（左上）
- バッジ枠: #00D4FF（右上、細ボーダー）
- パターン: #1A1A2E（縦線、微細）

**置換箇所**:
- `[TITLE]` → スレッドのタイトル（例: "AIで売上を3倍にした全手順"）

---

### 3. 引用カード（名言・知見共有用）

**用途**: 引用、学び、洞察を共有するポスト。権威性・知的な印象を演出。

**プロンプト**:

```
Elegant quote card, solid dark background #050508, large opening quotation mark in cyan #00D4FF at top left with slight transparency, quote text area in center with white #FAFAFA italic sans-serif text, small horizontal line divider in #1A1A2E below quote, small attribution text "[AUTHOR]" in gray #6B7280 below divider aligned right, no photos, no decorations, ultra minimal design, dark background #050508, clean typography, no clutter, no stock photo aesthetic, professional tech branding, high contrast, sharp edges, 8k quality
```

**サイズ**: 1200 x 675px

**カラー適用**:
- 背景: #050508（ソリッド）
- 引用符: #00D4FF（大きめ、左上、半透明）
- 引用テキスト: #FAFAFA（中央、イタリック）
- 区切り線: #1A1A2E
- 著者名: #6B7280（右寄せ、小さめ）

**置換箇所**:
- `[AUTHOR]` → 引用元（例: "Steve Jobs", "自社調べ"）
- 引用テキスト自体は画像内に含めず、ツイート本文に記載するパターンも可

---

### 4. Before/After（比較カード）

**用途**: ビフォーアフター比較。導入前後、改善前後、旧vs新の対比を視覚化。

**プロンプト**:

```
Split comparison card, left half labeled "BEFORE" with darker background #050508 and subtle red tint overlay #FF3366 at 10 percent opacity, right half labeled "AFTER" with dark background #050508 and subtle cyan tint overlay #00D4FF at 15 percent opacity, bold arrow symbol pointing right in center dividing line in white #FAFAFA, "BEFORE" text in gray #6B7280 at top left, "AFTER" text in cyan #00D4FF at top right, thin vertical divider line in #1A1A2E at center, ultra minimal design, dark background #050508, clean typography, no clutter, no stock photo aesthetic, professional tech branding, high contrast, sharp edges, 8k quality
```

**サイズ**: 1200 x 675px

**カラー適用**:
- 左半分（Before）: #050508 + #FF3366 10%オーバーレイ
- 右半分（After）: #050508 + #00D4FF 15%オーバーレイ
- 中央矢印: #FAFAFA
- "BEFORE"ラベル: #6B7280（控えめ）
- "AFTER"ラベル: #00D4FF（強調）
- 中央区切り: #1A1A2E

**使い方のコツ**:
- 左右に具体的な数字やキーワードを配置する場合は、プロンプトに追記
- 例: `left side text "手動3時間" in gray, right side text "AI 5分" in cyan`

---

### 5. 煽りカード（注意喚起・挑発系）

**用途**: 「まだ〇〇してるの？」「知らないと損する」系の挑発的・注意喚起ポスト。

**プロンプト**:

```
Provocative attention-grabbing card, dark background #050508 with very subtle warm gradient glow from bottom center in amber #FFB800 at 8 percent opacity, bold short text area "[COPY]" in white #FAFAFA centered, thin amber #FFB800 accent line at bottom edge, subtle noise texture overlay at 3 percent, no photos, no icons, typography only, ultra minimal design, dark background #050508, clean typography, no clutter, no stock photo aesthetic, professional tech branding, high contrast, sharp edges, 8k quality
```

**サイズ**: 1200 x 675px

**カラー適用**:
- 背景: #050508（ベース）
- 暖色グロー: #FFB800 8%（下部中央から微細に拡散）
- コピー: #FAFAFA（白、太字、中央配置）
- アクセントライン: #FFB800（下端）
- テクスチャ: ノイズ 3%（微細な質感）

**置換箇所**:
- `[COPY]` → 煽りコピー（例: "まだ手動でやってるの？", "これ知らない人、損してます"）

**注意**: アンバー/オレンジはブランドの通常アクセント（シアン）とは異なる。
煽り・警告の文脈でのみ使用し、多用しないこと。

---

## 追加テンプレート

---

### noteサムネイル

**サイズ**: 1280 x 670px

**プロンプト**:

```
Article thumbnail for blog platform, wide format, dark background #050508, title text area "[TITLE]" in bold white #FAFAFA sans-serif at center left with generous padding, thin cyan #00D4FF vertical accent bar on left edge, subtle abstract geometric shapes in #0A0A0F in background right side, small author area at bottom right with text "TomorrowProof" in gray #6B7280, clean editorial layout, ultra minimal design, dark background #050508, clean typography, no clutter, no stock photo aesthetic, professional tech branding, high contrast, sharp edges, 8k quality
```

**カラー適用**:
- 背景: #050508
- タイトル: #FAFAFA（左寄せ、太字）
- 左アクセントバー: #00D4FF（縦ライン）
- 幾何学模様: #0A0A0F（右側背景、微細）
- 著者名: #6B7280（右下、小さめ）

**置換箇所**:
- `[TITLE]` → note記事タイトル

---

### OGPカード

**サイズ**: 1200 x 628px

**プロンプト**:

```
OGP social share card, dark solid background #050508, article title text "[TITLE]" in bold white #FAFAFA sans-serif centered, thin horizontal cyan #00D4FF line below title, small site name "TomorrowProof" in gray #6B7280 at bottom center, subtle dot grid pattern in #0A0A0F across background, no photos, no illustrations, typography focused, ultra minimal design, dark background #050508, clean typography, no clutter, no stock photo aesthetic, professional tech branding, high contrast, sharp edges, 8k quality
```

**カラー適用**:
- 背景: #050508
- タイトル: #FAFAFA（中央、太字）
- 区切りライン: #00D4FF（タイトル下）
- サイト名: #6B7280（下部中央）
- ドットグリッド: #0A0A0F（全体背景、微細）

**置換箇所**:
- `[TITLE]` → 記事タイトル

---

## 運用ルール

1. **テキストは画像に焼かない** — Flux は文字の精度が不安定。テキストはツイート本文に書き、画像はビジュアルインパクトに集中する
2. **色の一貫性** — シアン #00D4FF がプライマリアクセント。アンバー #FFB800 は煽り限定
3. **1投稿1テンプレート** — 画像の種類を混ぜない。1ツイートに1画像
4. **生成後の確認** — AI生成画像は必ず目視確認。ブランドから逸脱していたら再生成
5. **ファイル命名** — `x-card-[slug].png` で統一（画像命名規則準拠）

# Visual Specs — LUMINA × Wizard Proposal

## アスペクト比
- **A4 Landscape / 横向き**(297mm × 210mm)
- CSS: `@page { size: A4 landscape; margin: 12mm; }`

## カラーパレット

### Primary(黒白基調)
| Role | Hex | Usage |
|---|---|---|
| Black | `#0A0A0F` | メインテキスト、章題、区切り線 |
| Off-white | `#FAFAFA` | 明所の背景 |
| Paper | `#F5F3EE` | セカンダリ背景(ベージュ寄り、editorial warmth) |
| Cream | `#EDE8DD` | アクセント背景、callout |

### Text
| Role | Hex | Usage |
|---|---|---|
| Primary text | `#0A0A0F` | 本文、見出し |
| Secondary text | `#4B5563` | サブテキスト、キャプション |
| Tertiary text | `#9CA3AF` | meta、footer、eyebrow |
| Hairline | `#E5E7EB` | テーブル罫線、hr |

### Accent(最小限)
| Role | Hex | Usage |
|---|---|---|
| Ink navy | `#1E2951` | 特別な見出し or 引用 (editorial blue) |
| Gold | `#8B6F47` | 稀なアクセント(quarter page dividers 等) |

**禁忌**: 原色(#FF0000 等)、鮮やかな primary blue、派手なグラデーション、ドロップシャドウ多用。

---

## タイポグラフィ

### 英字
- **Display**: `Inter` (600-700) — 章題・タイトル
- **Body**: `Inter` (300-400) — 本文
- **Italic / Serif accent**: `EB Garamond` または `Cormorant Garamond` — キャプション、引用
- **Mono**: `SF Mono` / `Menlo` — コード、URL

### 日本語
- **Body**: `Hiragino Kaku Gothic ProN` (W3/W4) または `Noto Sans JP` (300-400)
- **Display(強調)**: `Hiragino Kaku Gothic ProN` (W6/W7) または `Noto Sans JP` (700)
- **Serif accent**: `Hiragino Mincho ProN` または `Noto Serif JP` — キャプション、引用

### サイズスケール(A4 横向きベース)
| Level | Size |
|---|---|
| Cover title | 56-72pt |
| Chapter title (H1) | 32-42pt |
| Section (H2) | 18-22pt |
| Subsection (H3) | 12pt uppercase tracking 0.12em |
| Body | 10-11pt, line-height 1.85-1.95 |
| Caption / Eyebrow | 8-9pt, tracking 0.3em uppercase |
| Footer | 7.5pt, tracking 0.3em |

### Tracking / letter-spacing
- 日本語本文: `letter-spacing: 0.015em`
- 日本語見出し: `letter-spacing: 0.005em`
- 英字 eyebrow / meta: `letter-spacing: 0.3em UPPERCASE`
- font-feature-settings: `"palt"` (日本語 proportional alt)

---

## レイアウトパターン

### 1. Cover
- フルブリード背景画像(Lookbook SS26 page-01 or page-03)
- 下部に暗グラデーションオーバーレイ
- 左下: タイトル(3行、オーバーサイズ)
- 右下: 宛名 / 差出人 / 日付

### 2. Chapter divider(見開き左ページ想定、横向き1枚)
- 左側 40%: 大判ローマ数字 (I, II, III...) または数字
- 右側 60%: 章題 + サブタイトル + kicker + 画像 or 余白
- 余白最大化

### 3. Two-column editorial(本文)
- 左カラム: 本文メイン
- 右カラム: サブテキスト、引用、画像、figure

### 4. Figure + Caption
- 画像中央配置、最大幅 80%
- 下に明朝 italic caption(`— 図: ...`)
- 画像にボーダー不要

### 5. Data table
- 上下罫線のみ(NET-A-PORTER 風)
- th はアップケーストラッキング、罫線の下
- td は左揃え、padding 10pt

### 6. Mermaid diagram
- 背景 `#FAFAFA` のカード処理
- 0.5px hairline `#E5E7EB` 枠
- caption 下に明朝 italic

---

## トーン(文章側)

- 敬語、謙虚、簡潔
- 「提案」ではなく「素案」「ご相談」「たたき台」
- 「〜と考えております」「〜と思っております」
- 「世界初」「圧倒的」「革命」等の強気表現は禁忌
- 受動姿勢(「〜かもしれません」「〜であれば幸いです」)
- 渡辺氏の業績(BEDWIN / DAYZ / HYPEGOLF / Wizard Models)を軽視しない

---

## リファレンス(Claude に見せる用)

- NET-A-PORTER 商品詳細ページ(余白・タイポ・editorial calm)
- Supreme Management(minimalist grid, large imagery)
- The Row editorial(黒白、紙質感)
- Vogue Business レイアウト(data 図表 + 本文)
- Kith brand story(full bleed hero + text block)

---

## 禁忌まとめ

- ❌ A4 縦(portrait)
- ❌ ストック写真感、アイコン多用、絵文字
- ❌ ポップカラー、派手グラデ、影多用
- ❌ 角丸多用(rounded corners は最小限)
- ❌ アニメーション(PDF 出力時に消える)
- ❌ 小さすぎるフォント(本文 8pt 未満)
- ❌ 「世界初」「革命」「圧倒的」などの強気コピー
- ❌ 絵文字(📊 🎉 等を装飾として使わない)

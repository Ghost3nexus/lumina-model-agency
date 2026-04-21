# Visual Index — 図・画像の章別インデックス

> 提案書全9章で埋め込まれている図・画像の一覧。
> 提案書を読み進める際の地図として、あるいは特定の図だけを抜粋したい時の索引として使用。

---

## 章別サマリー

| 章 | 図の総数 | 主な図 |
|---|---|---|
| 00. Cover Letter | 0 | (テキストのみ) |
| 01. Executive Summary | 3 | TAM/SAM/SOM ピラミッド、現状vs提案差分表、市場カテゴリ成長グラフ |
| 02. Market 3C Analysis | 4 | Mermaid positioning quadrant、競合価格 bar、3C mindmap、Top8エージェンシーAI対応マトリクス |
| 03. Opportunity Landscape | 4 | 市場規模 pie、海外展開フロー、規制タイムライン、TAM合算 bar |
| 04. Proposed Structure | 5 | Wizard AI 組織図、業務分担 matrix、既存顧客不干渉分離図、Hybrid Roster 構成図、月次運営サイクル |
| 05. Service Portfolio Roadmap | 3 | サービスtimeline、4-tier料金マトリクス、収益ストリーム graph |
| 06. Phased Roadmap | 4 | Phased Gantt、KPI 3層 bar、リスクマップ、撤退判断 decision tree |
| 07. Immediate Actions | 3 | 初回対話6論点 mindmap、意思決定フロー、Meet URL装飾 |
| MASTER.md | 全統合 | 上記すべて + Lookbook SS26 3×3 grid、14モデルロスターグリッド、商品ショーケース |

**合計**: Mermaid 16図 / HTML装飾 9ブロック / 画像参照 約40枚

---

## Mermaid 図 一覧

| # | 章 | 図 | 種別 |
|---|---|---|---|
| M01 | 01 | AIファッション市場の成長曲線 | xychart-beta |
| M02 | 02 | ポジショニングマップ(伝統↔AI × ツール↔エージェンシー) | quadrantChart |
| M03 | 02 | 競合料金比較 | xychart-beta |
| M04 | 02 | 3C分析 mindmap | mindmap |
| M05 | 03 | 市場規模レイヤー構成 | pie |
| M06 | 03 | 海外展開 Phase flow | flowchart LR |
| M07 | 03 | 規制 & 採用事例 timeline | timeline |
| M08 | 04 | Wizard AI 組織図(Option A) | flowchart TD |
| M09 | 04 | 既存Wizard顧客不干渉の技術的分離図 | flowchart LR |
| M10 | 04 | Hybrid Roster 構成図 | flowchart TD |
| M11 | 04 | 月次運営サイクル | flowchart LR |
| M12 | 05 | サービスtimeline(Core → Expansion → Horizon) | timeline |
| M13 | 05 | 収益ストリーム | graph LR |
| M14 | 06 | Phased Roadmap Gantt | gantt |
| M15 | 06 | 撤退判断 Decision Tree | flowchart TD |
| M16 | 07 | 初回対話6論点 mindmap | mindmap |
| M17 | 07 | 意思決定フロー(Go/Partial/No-Go) | flowchart TD |

---

## HTML装飾ブロック 一覧

| # | 章 | 内容 |
|---|---|---|
| H01 | 01 | TAM/SAM/SOM ピラミッド(3層 CSS) |
| H02 | 01 | 現状 vs 提案 差分表(色付き比較) |
| H03 | 02 | Top8 伝統エージェンシー AI対応マトリクス |
| H04 | 04 | 業務分担マトリクス(色付き) |
| H05 | 05 | 4-tier 料金マトリクス(カード型) |
| H06 | 06 | KPI 3層(保守/中位/楽観)バーチャート |
| H07 | 06 | リスクマップ(Impact × Likelihood 2x2) |
| H08 | 07 | Google Meet URL 強調カード |
| H09 | MASTER | 14モデルロスター 4×4 グリッド |

---

## 画像参照 一覧

### Lookbook SS26 (`public/case-studies/lumina-lookbook-ss26/`)

| ファイル | 使用章 | 用途 |
|---|---|---|
| page-01.jpg | MASTER 表紙 | Navy airfield カバー |
| page-02.jpg ~ page-10.jpg | MASTER | 3×3 spreads grid |

### 14モデルロスター (`public/agency-models/*/beauty.png`)

MASTER.md の「初期ロスター」セクションで 4×4 風 grid として配置。
合計 14体(ladies 8 + men 6)。

### 商品ショーケース (`public/showcase/*.png`)

サービス 05 章で「画像生成クオリティのエビデンス」として 6 商品 × 1-2カット抜粋。
- bottega, miumiu, noah, nb, zara, nike

---

## クイックアクセス

特定の図を Watanabe 氏に見せたい場合:

| 見せたい論点 | 該当図 |
|---|---|
| 「市場には空白がある」 | M02 ポジショニングマップ |
| 「世界はもう動いている」 | M07 規制&採用事例 timeline |
| 「組織はこう設計したい」 | M08 Wizard AI 組織図 |
| 「既存顧客には触らない」 | M09 不干渉分離図 |
| 「フェーズでこう進める」 | M14 Phased Gantt |
| 「撤退条件も明示してある」 | M15 Decision Tree |
| 「初回対話で聞きたいこと」 | M16 論点 mindmap |

---

## 更新ログ

| 日付 | 更新者 | 内容 |
|---|---|---|
| 2026-04-21 | KOZUKI | 初版(Phase 2 ビジュアル拡張)作成 |

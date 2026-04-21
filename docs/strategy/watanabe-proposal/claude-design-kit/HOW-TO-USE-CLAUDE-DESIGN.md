# How to Use Claude Design — 提案書作成ベストプラクティス

> 調査日: 2026-04-21 / 対象: Anthropic Claude Design(2026-04-17リリース)
> 目的: A4 横向き / エディトリアル級 / 日本語対応の PDF 提案書を claude.ai で作る

---

## 1. 結論(実現可能性)

**✅ 実現可能(条件付き)**

| 要件 | 状態 |
|---|---|
| A4 横向き PDF 出力 | ✅ CSS `@page { size: A4 landscape; }` で完全制御 |
| 日本語フォント | ✅ Google Fonts の Noto Sans JP / Noto Serif JP で対応 |
| Mermaid 図描画 | ✅ Claude Artifacts native support(SVG レンダリング) |
| 画像埋込 | ✅ URL / Base64 両対応(URL 推奨) |
| エディトリアル組版 | ✅ 3-4 回の反復修正で達成(初回出力は要 polishing) |
| ページ番号・フッター | ✅ `@page` + `@bottom-right` CSS で |

---

## 2. 前提チェックリスト(KOZUKI 側)

- [ ] claude.ai に Pro または Team プランで login 済み(Artifacts は free でも動くが、制限あり)
- [ ] ブラウザ: **Chrome or Arc 推奨**(Safari は印刷時の CSS `@page` 挙動に差あり)
- [ ] 提案書コンテンツ(`CONTENT-PACKAGE.md`)を開いてすぐコピペできる状態
- [ ] 画像素材(`IMAGE-MANIFEST.md` 参照)をローカル or 本番URL で投入可能状態
- [ ] 作業時間 **60-90分** 確保(55分が純作業、+αレビュー時間)

---

## 3. ワークフロー 7 ステップ

### Step 1 — プロジェクト開始(2分)
1. claude.ai で新規会話を開始
2. `INPUT-PROMPT.md` の `==== COPY FROM HERE ====` と `==== COPY UNTIL HERE ====` の間を全文コピペして送信
3. Claude が「最初に Cover page だけ作ります」と応答するまで待つ

### Step 2 — Cover 画像投入(3分)
1. 画像をドラッグ&ドロップ:`page-01.jpg` or `page-03.jpg`(推奨 page-03: coastal highway RRL convertible)
2. 「この画像でCoverを作って」と指示
3. Artifact パネルに初期 HTML が生成される

### Step 3 — Cover polish(10分、1-3回反復)
典型的な修正指示:
- 「タイトルを 72pt まで大きく」
- 「eyebrow の tracking を 0.4em に」
- 「下部グラデを強く(#050508 opacity 0.95 from bottom)」
- 「Meta 3 行を右下に縦並びで」

### Step 4 — 各章を順次追加(30-40分)
`CONTENT-PACKAGE.md` の各章を貼付:
1. 「次、Foreword と目次を追加して」+ §2-3 貼付
2. 「Chapter I: Executive Summary を追加」+ §4 貼付
3. ... VII まで
4. Appendix(Lookbook / Roster)

**コツ**:1章ずつ投入 → プレビュー確認 → OK なら次へ。**最初から全章貼るとエラーや省略が起こる**。

### Step 5 — Mermaid 図追加(5分)
- `assets/mermaid/*.mmd` の内容をコピペして「この図を Chapter IV に入れて」と指示
- Claude は ` ```mermaid ... ``` ` コードブロックを自動 SVG 化
- サイズ調整指示:「図の幅を 80% に」「背景をcream 色のカード処理に」

### Step 6 — 統合レビュー(5分)
- 「全章を1つの Artifact に統合して、通しで見せて」
- 通しで見て、修正指示
- 「フッターは Cover 以外全ページに」等の細部指示

### Step 7 — PDF 化(5分)
1. Artifact 右上「Open in new tab」で新タブ表示
2. `Cmd+P` (mac) / `Ctrl+P` (win)
3. 印刷ダイアログで以下を設定:

| 項目 | 値 |
|---|---|
| **Destination** | Save as PDF |
| **Pages** | All |
| **Layout** | **Landscape** |
| **Paper size** | A4 |
| **Margins** | **None** (or Custom: Top/Bottom/Left/Right = 0) |
| **Scale** | Default (100%) |
| **Options** | ✅ Background graphics(必須、これONないと背景色・画像消える) |
| **Options** | ✅ Headers and footers(OFF 推奨。CSSで制御している場合) |

4. `Save` → `~/Desktop/LUMINA_Proposal_for_Watanabe_v1.0.pdf` として保存

---

## 4. よく使う反復修正のテンプレ

| 症状 | 指示例 |
|---|---|
| 余白が狭い | 「全体の余白を+2段階広く、body margin 16mm→20mm」 |
| タイポが地味 | 「Cover title をもう+20pt。letter-spacing: -0.015em」 |
| Mermaid 枠が目立つ | 「SVG の背景を `#FAFAFA`、border 0.5px `#E5E7EB` の紙っぽく」 |
| テーブルが野暮 | 「NET-A-PORTER 風: 上下罫線のみ、縦罫全削除、th は uppercase tracking 0.2em」 |
| 画像がボーダー付き | 「全ての img から border を外して」 |
| 日本語フォントが英字 | 「body に Noto Sans JP を確実に適用、`font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif;`」 |
| 色が派手 | 「accent color を減らして、黒・白・紙色だけに restrain」 |

---

## 5. トラブルシューティング

### 日本語フォントが崩れる
**原因**: Google Fonts 読込失敗 or font-family 指定順が逆
**解決**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
```

### Mermaid 図が空白
**原因**: Mermaid script loading 失敗 or syntax error
**解決**: Claude に「Mermaid CDN から 11.x を読込、 `mermaid.initialize({startOnLoad: true})` を実行」指示

### 背景色が PDF に出ない
**原因**: Chrome 印刷設定「Background graphics」OFF
**解決**: 印刷ダイアログで必ず ✅

### 改ページが効かない
**原因**: `page-break-before` が CSS で指定されていない
**解決**: 「各 h1 (chapter title) に `page-break-before: always; page-break-inside: avoid;` を」

### フォントが 1 つしか出ない
**原因**: Google Fonts 読込が1種類のみ
**解決**: Inter + Noto Sans JP + Noto Serif JP をまとめて読み込む

### 画像の解像度が低い
**原因**: 小さい画像を引き延ばし
**解決**: オリジナル(3-5MB の beauty.png 等)を投入、`max-width: 100%` で適切に縮小

---

## 6. デザインリファレンス(Claude への共有用)

### 色コード(再掲)
- Black: `#0A0A0F`
- Off-white: `#FAFAFA`
- Paper: `#F5F3EE`
- Cream: `#EDE8DD`
- Text secondary: `#4B5563`
- Hairline: `#E5E7EB`

### 参考サイト(Claude に「こういうトーンで」と伝える際のリファレンス)
- NET-A-PORTER (net-a-porter.com) — 商品詳細、Edition magazine
- Dover Street Market(doverstreetmarket.com)
- The Row(therow.com)
- Supreme Management(suprememgmt.com)
- Vogue Business(voguebusiness.com)

---

## 7. 成功チェックリスト(PDF 保存前)

- [ ] Cover が A4 横フルブリードで表示される
- [ ] Foreword と目次が editorial グレード(ローマ数字、トラッキング)
- [ ] 全章に改ページが効いている
- [ ] 日本語本文が Noto Sans JP / Hiragino で表示
- [ ] 英字タイトルが Inter(変な serif が混在していない)
- [ ] フッター(`LUMINA × WIZARD — DRAFT` + ページ番号)が全ページに
- [ ] Cover にはフッターが**出ていない**(覆い隠されている or 除外)
- [ ] Mermaid 図が SVG で描画、cream/paper 背景のカード処理
- [ ] 画像に余計なボーダーがない
- [ ] テーブルが NET-A-PORTER 風(上下罫線のみ)
- [ ] ポジショニングマップ(Chapter II)が**最大視覚インパクト**で配置されている
- [ ] Gantt / Decision tree が Chapter VI で見やすく
- [ ] 最終 PDF が 20-30 ページ範囲

---

## 8. 時間見積もり

| 段階 | 時間 |
|---|---|
| プロンプト投入 + Cover 生成 | 5分 |
| Cover polish(2-3回反復) | 10分 |
| 各章投入 + 個別調整(7章) | 35分 |
| Mermaid 図追加 | 5分 |
| 全章統合 + 最終レビュー | 10分 |
| Chrome Print to PDF + 確認 | 5分 |
| **合計** | **70分** |

+ 予備時間 30分(反復修正、好みの微調整)→ **通しで 90-120 分**

---

## 9. 完成後のファイル配置

```
~/Desktop/
  └ LUMINA_Proposal_for_Watanabe_v1.0.pdf       ← Chrome Print to PDF 保存先

docs/strategy/watanabe-proposal/claude-design-kit/output/
  └ proposal.html                                ← Claude Artifact の HTML コピー(ソース保存用)
```

HTML ソースも保存しておくと、微修正・再生成が楽になる。

---

## 10. 次回以降の応用

同じ kit を使って:
- **英訳版**提案書(Chapter I のみ英語化等、部分的に)
- **短縮版**(5-6 ページの summary deck)
- **プレゼン用**(claude.ai → Marp 変換など)

すべて同じ `CONTENT-PACKAGE.md` + `VISUAL-SPECS.md` + `IMAGE-MANIFEST.md` の素材で流用可。

---

**Document Owner**: dev + KOZUKI
**Last Updated**: 2026-04-21
**Related**: `README.md`, `INPUT-PROMPT.md`, `CONTENT-PACKAGE.md`, `VISUAL-SPECS.md`, `IMAGE-MANIFEST.md`

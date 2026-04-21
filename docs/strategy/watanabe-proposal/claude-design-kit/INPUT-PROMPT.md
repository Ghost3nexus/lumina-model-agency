# Claude Design — メインプロンプト

> このファイルの下部ブロック **`==== COPY FROM HERE ====` と `==== COPY UNTIL HERE ====` の間を全文コピー**して claude.ai に貼付。
> その後、指示通りに画像を順次投入していけば提案書が完成する設計。

---

==== COPY FROM HERE ====

# タスク

A4 **横向き (landscape)** の PDF 出力を想定した、エディトリアル級の partnership 提案書を HTML Artifact として作成してください。

テーマ: BEDWIN 創業者 / Wizard Models オーナー 渡辺真史氏 への、ファッション業界トップディレクター宛の提案書です。NET-A-PORTER / Supreme Management / The Row / Dover Street Market レベルの組版を目指します。

## 必須仕様

### サイズ・アスペクト比
- A4 **横向き / landscape** (297mm × 210mm)
- CSS: `@page { size: A4 landscape; margin: 12mm; }`
- 各 section / chapter は `page-break-before: always;` で改ページ
- ページ番号・フッターを各ページに配置

### フォント
- 日本語本文: `Hiragino Kaku Gothic ProN`, `Noto Sans JP` (weight 300-400)
- 日本語見出し: 同上 (weight 600-700)
- 英字 display: `Inter` (weight 500-700)
- 英字 body: `Inter` (weight 300-400)
- キャプション / 明朝 accent: `Hiragino Mincho ProN`, `Noto Serif JP` (italic)

Google Fonts の `@import` 文を <head> 相当に含めてください:
```
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:ital,wght@1,300;1,400&display=swap');
```

### カラーパレット

```
Black:       #0A0A0F  (primary text, titles, borders)
Off-white:   #FAFAFA  (background)
Paper:       #F5F3EE  (secondary surface — editorial warmth)
Cream:       #EDE8DD  (callout background)

Secondary text:  #4B5563
Tertiary text:   #9CA3AF
Hairline:        #E5E7EB

Ink navy (rare accent):  #1E2951
Gold (rare accent):      #8B6F47
```

**禁忌**: 原色・派手グラデ・rounded corner 多用・絵文字・ストック写真感・ドロップシャドウ多用。

### タイポグラフィ・スケール(横 A4 ベース)

| レベル | サイズ |
|---|---|
| Cover title | 56-72pt |
| Chapter title (H1) | 32-42pt |
| Section (H2) | 18-22pt |
| Subsection (H3) | 12pt uppercase tracking 0.12em |
| Body | 10-11pt, line-height 1.9 |
| Caption / Eyebrow | 8-9pt, tracking 0.3em uppercase |
| Footer | 7.5pt tracking 0.3em |

日本語 `font-feature-settings: "palt"` を全体適用、`letter-spacing: 0.015em`。

### レイアウトパターン(章ごとに最適なものを選択)

1. **Cover page** — フルブリード画像 + 下部グラデ + タイポ overlay
2. **Chapter divider** — 左 40% 大判ローマ数字、右 60% タイトル + サブ
3. **Two-column editorial** — 本文メイン(左 65%)+ サイド figure / 引用(右 35%)
4. **Figure + caption** — 中央配置画像 + 下に明朝 italic キャプション
5. **Data table** — NET-A-PORTER 風(上下罫線のみ、縦罫なし、th uppercase)
6. **Big callout** — 白 or cream 背景、大判引用・数値

## ページ構成(20-30 ページ想定)

1. **Cover**(1ページ、フルブリード)
2. **Foreword(本書の位置づけ)**(1ページ、editorial tone)
3. **目次**(1ページ、ローマ数字 I-VII)
4. **Chapter I — Executive Summary**(chapter divider + 2-3 ページ)
5. **Chapter II — Market 3C**(chapter divider + 3-4 ページ + ポジショニングマップ)
6. **Chapter III — Opportunity**(3 ページ + データテーブル)
7. **Chapter IV — Proposed Structure**(chapter divider + 4-5 ページ + 組織図)
8. **Chapter V — Service Roadmap**(3 ページ + timeline)
9. **Chapter VI — Phased Roadmap**(2-3 ページ + Gantt)
10. **Chapter VII — Immediate Actions**(2 ページ + 6 論点 mindmap)
11. **Appendix A — Lookbook Gallery**(2 ページ、9 spreads grid)
12. **Appendix B — Roster Gallery**(1 ページ、14 体 grid)
13. **Contact**(1 ページ、Google Meet URL、大きく)

## 作業手順

今日は以下の順で作ります。私が「次」と言ったら次のステップへ進みます。

### Step 1: Cover page のみ
- 画像を 1 枚送ります(Lookbook SS26 page-01 または page-03)
- Cover ページ 1 枚だけを HTML Artifact として生成
- 完成したら Chrome Print to PDF で確認できる形(landscape)

### Step 2: Foreword + 目次
- Step 1 ができたら追加

### Step 3: Chapter I(Executive Summary)
- 本文テキストは私が貼付します

### Step 4 以降
- Chapter ごとに進める

### 最終 Step
- 全章を統合した 1 つの HTML Artifact に

## 重要な制約

- **フッター**:各ページ下に `LUMINA × WIZARD — DRAFT` + ページ番号(tracking 0.3em, 7.5pt, 薄いグレー)。Cover のみ非表示。
- **改ページ**:各 `h1.chapter-title` の前に `page-break-before: always`
- **画像**:ボーダーなし、ロックスクリーンサイズ制限(max-width 100%)
- **Mermaid図**は後から追加します。まずは text + 画像ベースで
- **絵文字禁止**。アイコンも極力使わない(どうしても必要なら線画のアウトラインスタイルのみ)

## 最初のお願い

Step 1(Cover page のみ)を作ってください。

画像は次のメッセージで送ります。それまでは、Cover 1 ページだけの HTML スケルトン(landscape, タイポスケール, カラー適用済み)をまず組み立てて見せてください。

タイトル文言:
- Cover eyebrow: `A DRAFT IDEA · 2026`
- Cover title (3 lines):
  - `AI ×`
  - `Traditional`
  - `Model Agency`
- Cover subtitle: `伝統モデルエージェンシーと AI を、ひとつの形にする素案`
- Meta 1: `渡辺 真史 様` (明朝寄り、大きめ、11pt)
- Meta 2: `KOZUKI TAKAHIRO · TomorrowProof Inc.`
- Date: `April 2026`

==== COPY UNTIL HERE ====

---

## 追加指示(KOZUKI が反復改善時に使える指示例)

### よく使うであろう修正指示

- 「余白をもう 2 段階広げて」
- 「タイトルをもう一回り大きく(72pt)」
- 「eyebrow のトラッキングを強く、0.4em に」
- 「画像の下のキャプションを明朝 italic に、色 #6B7280」
- 「このテーブルは NET-A-PORTER 風で。上下罫線だけ残して縦罫全削除」
- 「この章、2 カラムに分けて。左 65% 本文、右 35% 図」
- 「フッターから "DRAFT" を消してページ番号だけに」

### PDF 化(Chrome)

1. Artifact を新タブで開く(claude.ai Artifact preview の "Open in new tab")
2. Cmd+P で Print
3. Destination: **Save as PDF**
4. Pages: All
5. Layout: **Landscape**
6. Paper size: A4
7. Margins: **None**(CSSで制御済のため)
8. Options: **Background graphics ✅**(背景色・グラデを残すため)
9. Save → `~/Desktop/LUMINA_Proposal_for_Watanabe_v1.0.pdf`

---

## コンテンツ投入スケジュール

各 Step での投入素材:

- **Step 1**: `CONTENT-PACKAGE.md §1 Cover` + 画像 `page-01.jpg` or `page-03.jpg`
- **Step 2**: `CONTENT-PACKAGE.md §2 Foreword + §3 TOC`
- **Step 3**: `CONTENT-PACKAGE.md §4 Executive Summary`
- ... 以降、章別に `CONTENT-PACKAGE.md` から取り出して投入
- **Appendix**: `IMAGE-MANIFEST.md` の一覧を参照して画像を投入

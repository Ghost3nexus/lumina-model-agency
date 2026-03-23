# noteサムネイル設計ガイド — バイラルパターン準拠

> 最終更新: 2026-03-09
> ソース: AI FREAK（14K followers）、けんすう、しいたけ占い、各種バイラルnote分析
> **重要: noteサムネはHPブログのダークテーマとは別ルールで設計する**

---

## 核心原則

**noteのサムネイルは「雑誌の表紙」である。**

HPブログ（ダーク×ミニマル×テック）とは完全に異なるデザイン戦略を取る。
noteはフィード上で他の記事と「サムネイルの視認性」で競争するプラットフォームであり、
ダークで文字なしのサムネは**絶対にバイラルしない**。

---

## noteサムネ vs HPブログ画像の違い

| 要素 | HPブログ（hero画像） | noteサムネイル |
|------|-------------------|--------------|
| **背景色** | #050508（ほぼ黒） | 明るい〜中間色（白、黄、グラデ） |
| **テキスト** | なし or 最小限 | **必須**。3層コピー構成 |
| **配色** | モノトーン+シアン | **高コントラスト**。目を引く配色 |
| **情報量** | ミニマル | **多め**。数字・キーワード・コピー |
| **人物/キャラ** | なし | あり推奨（感情移入の入口） |
| **目的** | ブランド体験 | **クリック率最大化** |

---

## サムネイルの3層コピー構成（必須）

noteのバイラルサムネには必ず以下の3層が入っている:

```
┌─────────────────────────────────┐
│                                 │
│  [キャッチフレーズ]              │  ← 小さめ。感情を動かす一文
│                                 │
│  [メインコピー]                  │  ← 最大サイズ。記事の核心
│                                 │
│  [サブタイトル/補足]             │  ← 小さめ。ジャンル・対象者
│                                 │
│         [ビジュアル要素]         │  ← 人物/キャラ/アイコン
│                                 │
└─────────────────────────────────┘
```

### 各層の役割

| 層 | サイズ | 役割 | 例 |
|----|--------|------|-----|
| **キャッチフレーズ** | 小（16-20px相当） | 感情フック。共感・衝撃 | 「全部失った。でも、仲間は"作れた"。」 |
| **メインコピー** | 最大（32-48px相当） | 記事の核心を一文で | 「AI社員22体で8事業を回す男」 |
| **サブタイトル** | 中（14-18px相当） | ジャンル・対象者・補足 | 「1人法人×AIエージェントの全記録」 |

### コピーの書き方ルール

- **数字を入れる**: 「22体」「8事業」「3.2%」→ 具体性が信頼を生む
- **逆説を入れる**: 「全部失った。でも〜」「普通は無理。でも〜」
- **ターゲットを明示**: 「経営者向け」「1人法人の」「副業で〜」
- **疑問形も有効**: 「あなたのAIエージェント、安全ですか？」
- **30文字以内**: メインコピーは30文字以内で読み切れるように

---

## ビジュアルスタイルパターン

### パターンA: Marvel/ヒーロー系（TomorrowProof推奨）

TomorrowProofの世界観「AIとのMARVEL集団」に最適。

```
プロンプト構成:
- 中央にCEO（スーツ or テックアーマー）
- 背後にAIエージェントチーム（サイバースーツ、各色のエネルギー）
- 映画ポスター的構図（Avengers Assemble風）
- ドラマチックなライティング（バックライト、炎、エネルギー波）
- コピーは画像の上部と下部に配置
```

**使用場面**: 起業ストーリー、チーム紹介、復活系記事

### パターンB: データ/インフォグラフィック系

```
プロンプト構成:
- 背景: 白 or ライトグレー or グラデーション
- 大きな数字（72pt+）をセンターに配置
- 補足テキストを数字の上下に
- アイコンやミニチャートを装飾的に配置
- フォント: 太めのゴシック体
```

**使用場面**: データ分析、比較記事、ランキング記事

### パターンC: 雑誌表紙/エディトリアル系

```
プロンプト構成:
- 人物写真 or イラストを片側に配置
- 反対側にコピーを3層配置
- 背景: 単色 or シンプルグラデーション
- アクセント: 吹き出し、マーカー線、赤字強調
```

**使用場面**: コラム、体験談、インタビュー風記事

---

## 配色パターン（noteバイラル実績あり）

| パターン | 背景 | テキスト | アクセント | 雰囲気 |
|---------|------|---------|-----------|--------|
| **クリーンテック** | 白 #FFFFFF | 黒 #1A1A1A | シアン #00D4FF | 信頼・専門性 |
| **ウォーム** | クリーム #FFF8E7 | 濃茶 #2D1810 | オレンジ #FF6B35 | 親しみ・温かさ |
| **インパクト** | 黒 #1A1A1A | 白 #FFFFFF | 赤 #FF3366 | 衝撃・緊急性 |
| **プレミアム** | ダークネイビー #0A1628 | 白 #FFFFFF | ゴールド #FFD700 | 高級・権威 |
| **エネルギー** | グラデ（紫→青） | 白 #FFFFFF | 黄 #FFE600 | 躍動・成長 |

### TomorrowProof note配色の使い分け

- **起業/復活ストーリー**: インパクト or エネルギー
- **技術解説/ハウツー**: クリーンテック
- **経営/戦略**: プレミアム
- **体験談/コラム**: ウォーム

**注意**: HPブログのダークテーマ（#050508背景）をそのままnoteサムネに使うのは禁止。
noteのフィードは白背景が多く、暗いサムネは埋もれる。

---

## バイラルnoteアカウント分析（参考）

### AI FREAK（14K followers）
- サムネ特徴: **明るい背景 + 大きな日本語テキスト + 数字 + AIキャラクター**
- 配色: 白背景、青・紫アクセント
- コピー: 数字先行（「〇〇が△△%向上」「□□を使って○時間削減」）

### けんすう（57K followers）
- サムネ特徴: **シンプル背景 + 大きなタイトル + 手書き風アクセント**
- 配色: 白 or パステル背景
- コピー: 問いかけ型（「〇〇って知ってる？」「なぜ△△なのか」）

### 共通パターン
1. **文字が画像面積の40-60%を占める**
2. **フォントは太いゴシック体（視認性最優先）**
3. **背景は明るい or 高コントラスト**
4. **数字は最大サイズで表示**
5. **人物/キャラクターで親近感を出す**

---

## 生成プロンプトテンプレート（Nano Banana Pro用）

### noteサムネイル — Marvel/ヒーロー系
```
Generate a photorealistic image for a Japanese blog thumbnail:
[メインビジュアルの説明 — Marvel Avengers style hero team]

Composition: Movie poster style. Central figure [人物描写] with a team of
[チームメンバー描写] behind them. Dramatic backlighting with energy effects.

**IMPORTANT: Leave clear space at the top 20% and bottom 20% for text overlay.**
The text will be added separately — do NOT generate any text in the image.

Style: Cinematic, dramatic lighting, superhero movie poster composition.
High contrast. Vibrant but not cartoonish. Professional quality.
Aspect ratio: 1.91:1 (1280x670px).
```

### noteサムネイル — データ/テック系
```
Generate a photorealistic image for a Japanese blog thumbnail:
[テーマに関連するテックビジュアル]

Composition: Clean, modern. [具体的な要素配置].
Background: Light gradient (white to light blue) for high visibility on note.com feed.

**IMPORTANT: Leave clear space for large Japanese text overlay (top 30% and bottom 20%).**
Do NOT generate any text in the image.

Style: Clean tech, bright, professional. NOT dark theme.
High contrast against white background.
Aspect ratio: 1.91:1 (1280x670px).
```

### テキストオーバーレイの追加方法

サムネイルの画像生成後、テキストは以下のいずれかで追加:

1. **HTML/CSS → Puppeteerスクリーンショット**（推奨・ブランド完全制御）
2. **Canva MCP**（テンプレート化して量産する場合）
3. **Ideogram 3.0**（テキスト描画精度98%、日本語も高精度）
4. **GPT Image**（テキスト描画精度95%、複合レイアウト対応）

#### HTML/CSSオーバーレイテンプレート
```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1280px;
    height: 670px;
    position: relative;
    overflow: hidden;
  }
  .bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.6) 0%,
      rgba(0,0,0,0.1) 30%,
      rgba(0,0,0,0.1) 70%,
      rgba(0,0,0,0.7) 100%
    );
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 50px;
  }
  .catchphrase {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #FFE600;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.8);
  }
  .main-copy {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 52px;
    font-weight: 900;
    color: #FFFFFF;
    text-shadow: 3px 3px 12px rgba(0,0,0,0.9);
    line-height: 1.2;
    max-width: 80%;
  }
  .subtitle {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #FFFFFF;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.8);
    opacity: 0.9;
  }
</style>
</head>
<body>
  <img class="bg-image" src="[背景画像パス]" />
  <div class="overlay">
    <div class="catchphrase">[キャッチフレーズ]</div>
    <div class="main-copy">[メインコピー]</div>
    <div class="subtitle">[サブタイトル]</div>
  </div>
</body>
</html>
```

---

## チェックリスト（noteサムネイル生成時・必須）

- [ ] **3層コピーが入っているか**: キャッチフレーズ + メインコピー + サブタイトル
- [ ] **メインコピーが30文字以内か**
- [ ] **数字が含まれているか**（具体性）
- [ ] **背景が明るい or 高コントラストか**（ダークテーマ禁止）
- [ ] **文字が画像面積の40%以上を占めているか**
- [ ] **フォントが太いゴシック体か**（細いフォント禁止）
- [ ] **noteフィード上で他の記事と並べても目立つか**
- [ ] **スマホ（小さいサムネ表示）でもコピーが読めるか**
- [ ] **HPブログのダークテーマと差別化されているか**
- [ ] **1280x670px（1.91:1）で出力されているか**

---

## アンチパターン（noteサムネで絶対やらない）

1. **文字なしのサムネ** — noteで文字なしは存在しないのと同じ
2. **#050508（ほぼ黒）背景** — フィードで埋もれる。HPブログ専用
3. **英語のみのコピー** — noteの読者は日本人。日本語必須
4. **ストック画像のそのまま使用** — パクリが一目でわかる
5. **細いフォント** — スマホのフィードで読めない
6. **情報量ゼロの抽象画像** — 「何の記事かわからない」サムネは最悪
7. **ロボットのクリップアート** — 安っぽく見える。使うならオリジナル生成

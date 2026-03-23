# コンテンツマーケティング・オーケストレーション v2.0

> Marketing Agent がオーケストレーターとして、ブログ1本から10+チャネルへ一気通貫で展開する。
> 調査ベース: content-pipeline-research-2026.md（Postiz、CrewAI、Justin Welsh方式、Evaluator-Optimizer等）
> KOZUKIの手動作業は最小化（note + IG のコピペのみ。Xは API自動投稿）。

---

## 全体フロー（1記事 = 1サイクル / 6ステップ固定）

```
STEP 1: [Marketing] テーマ・KW選定 + コンテンツブリーフ
    ↓
STEP 2: [Writer] コンテンツパッケージ執筆（Part 1-7）
    ↓
STEP 3: [Marketing] 品質評価（Evaluator-Optimizerパターン）
    ↓
STEP 4: [Visualizer] 画像一括生成（hero + OGP + x-card + note + ig = 5枚以上）
    ↓
STEP 5: [Dev] HP公開（Vercel自動デプロイ）
    ↓
STEP 6: [SNS] 投稿パッケージ統合 + X API自動投稿
```

---

## ブログが全ての起点（Single Source of Truth）

- **canonical = 自社ブログ**（tomorrowproof-ai.com/blog）
- X / note / Instagram は全てブログから派生
- **同一コンテンツの重複禁止**（noteのDA96.4がオリジナル認定を奪うリスク）

### 派生ルール（1ピラー → 10+派生）

| # | チャネル | 派生方法 | 本数/記事 |
|---|---------|---------|----------|
| 1 | ブログ | ピラーコンテンツ（SEO・教科書・である調） | 1本 |
| 2 | note | 別切り口の体験談（PASONA・ですます調） | 1本 |
| 3-5 | X | 核心凝縮・データ・問いかけ（SNSチェックリスト準拠） | 3本 |
| 6 | Instagram | ビジュアル主導フィード or カルーセル | 1本 |
| 7 | LinkedIn | BtoB寄り長文（経営者・意思決定者向け） | 1本 |
| 8-10 | X追加 | 公開後1-2週間で追加引用ツイート | 3本 |
| 11 | メルマガ | 記事ダイジェスト + 独自考察 | 1本 |
| 12 | 引用グラフィック | 記事内の数字・名言を画像化 → X/IG投稿 | 2-3枚 |

**目標: 1ピラーから12+派生**（現状6 → 倍増）

---

## STEP 1: テーマ・KW選定（Marketing Agent）

Marketing Agent が実行。**コンテンツブリーフ**を出力する。

### 実行手順
```
1. 過去記事との重複チェック（必須・最初に実行）:
   - /content/packages/*.md の全タイトル・テーマを一覧取得
   - /content/note/*.md の全タイトルを一覧取得
   - 公開済みブログ（WebFetch: tomorrowproof-ai.com/blog）の記事一覧確認
   - 同一テーマの記事が存在する場合 → 別の切り口を設定 or 別テーマに変更
2. WebSearchでメインKWの検索ボリューム・競合度を調査
3. 競合上位5記事の構成・文字数・切り口を分析
4. コンテンツギャップ（競合が書いていない切り口）を特定
5. AI Overviewで引用されやすい構造を設計
6. 前回記事のパフォーマンスデータを確認（フィードバックループ）
```

### 出力物（コンテンツブリーフ）
```markdown
## コンテンツブリーフ — YYYY-MM-DD

テーマ: [記事タイトル案]
メインKW: [検索ボリューム / 競合度]
関連KW: [5-10個]
検索意図: [情報収集 / 比較検討 / 購入]
ターゲット読者: [ペルソナ]
記事の目的: [認知 / リード / CV]
noteの切り口: [ブログとどう差別化するか]
前回記事の学び: [パフォーマンスデータから]
```

### フィードバックループ入力
過去記事のパフォーマンスを参照:
```
- 高パフォーマンス記事のKW・タイトル・構成パターンを再利用
- 低パフォーマンス記事の失敗要因（弱いフック？ニッチすぎ？）を回避
- X投稿のエンゲージメント率上位パターンを次回Part 5に反映
```

---

## STEP 2: コンテンツパッケージ執筆（Writer Agent）

Writer Agent にブリーフを渡してコンテンツパッケージを依頼。

### 必須要件
- Part 1: SEOデータ（STEP 1のブリーフ含む）
- Part 2: ブログ本文（3000-5000字、VISUALタグ3箇所以上）
- Part 3: 情報源リスト（10件以上、URL付き）
- Part 4: 内部リンク・CTA設計
- **Part 5: SNS投稿文（X 3本 + IG 1本 + LinkedIn 1本）** ← SNSチェックリスト準拠
- **Part 6: note派生記事**（PASONA構成、2000-4000字、ブログと別切り口）
- Part 7: 次回記事への導線

### Part 5 のX投稿は SNS SKILL.md チェックリスト準拠
Writer が Part 5 を書く時点で、以下を全て満たすこと:
1. 【】括弧フックで始める
2. 140字以内
3. 自社数字を含む
4. 画像指示を添える
5. 断言トーン
6. URL本文なし（リプで誘導）
7. BM自問テスト合格

### Part 6 のブログとの差別化（必須）
```
ブログ: である調、第三者的ガイド、データ網羅、SEO狙い → LP/サービスへCTA
note:   ですます調、一人称体験談、感情・失敗・裏側、バイラル狙い → ブログへCTA
```
- タイトルを変える（ブログ: 方法論 → note: 体験談）
- 冒頭をストーリーにする
- CTAを変える（ブログ→LP / note→ブログの完全ガイド）

**保存先**: `/content/packages/YYYY-MM-DD_[slug].md`

---

### STEP 2.5: Atomic Concept Extraction（Marketing Agent）

Writer納品後、SNS投稿生成の前に実行:

1. **概念抽出**: ブログ本文から3-7個の「atomic concept」を抽出
   - 1概念 = 1ツイートで完結する独立した主張
   - ブログの要約ではなく、独立したフックになる概念
2. **強度ランキング**: 各概念をバイラル可能性でスコアリング
   - データ/数字がある → +2
   - 反直感的（逆説） → +2
   - 自社体験 → +1
   - 問いかけ可能 → +1
3. **選定**: 上位3概念をX投稿用に選定、1概念をIG用に選定
4. **プラットフォーム適応**: 各概念をプラットフォームネイティブな形式に変換
   - X: 140字以内のフック + 残り140字で展開
   - IG: ビジュアルで伝わる概念を優先

**アンチパターン**:
- ブログの要約をそのままSNSに転用（要約はフックにならない）
- 全プラットフォームに同じコピーを投稿（各プラットフォームの文化が異なる）

---

## STEP 3: 品質評価（Marketing Agent — Evaluator-Optimizerパターン）

**Anthropic推奨のワークフロー: 生成と評価を分離する。**

Writer出力をMarketing Agentが評価。不合格なら修正指示を出す。

### 評価チェックリスト
```
□ Part 2: メインKWがタイトル・H2・本文冒頭に含まれているか
□ Part 2: VISUALタグが3箇所以上あるか
□ Part 2: E-E-A-T（実体験・専門性・権威性・信頼性）が示されているか
□ Part 2: 冒頭40-60語で検索意図に直接回答しているか（GEO対策）
□ Part 3: 情報源が10件以上あるか
□ Part 5: X投稿がSNSチェックリスト10項目を全て満たしているか
□ Part 5: LinkedIn投稿が含まれているか
□ Part 6: noteがブログと別切り口で書かれているか（PASONA構成）
□ Part 6: 2000字以上あるか
□ 全体: ブランドボイス（ダーク×テック×知的）が一貫しているか
```

**不合格**: 具体的な修正指示をWriterに返す → 修正版を受け取る → 再評価
**合格**: STEP 4 に進む

---

## STEP 4: ビジュアル一括生成（Visualizer Agent）

### 生成リスト（1記事あたり最低5枚）

| 画像 | サイズ | 用途 |
|------|--------|------|
| hero-[slug] | 16:9 | ブログヒーロー画像 |
| og-[slug] | 1200x630 | OGP / SNSシェア |
| x-card-[slug] | 1200x675 | X投稿カード |
| note-thumb-[slug] | 1280x670 | noteサムネイル（**明るい背景**） |
| ig-[slug] | 1080x1080 | Instagramフィード |

**ツール優先順位**:
1. Replicate Flux MCP（高品質）
2. Nano Banana Pro（`tools/generate-image.sh`、フォールバック）
3. HTML/CSS → スクリーン ショット（インフォグラフィック・データ図解）

**注意**: noteサムネイルはブログと真逆のビジュアル（明るい×高コントラスト×雑誌表紙的）

**保存先**: `/content/packages/visuals/[slug]/`

---

## STEP 5: HP公開（Dev Agent / CEO）

```
1. tomorrowproof-hp を /tmp にclone
2. 記事 + 画像を配置
3. npm run build で確認
4. push → Vercel自動デプロイ
5. 公開URL確定: https://tomorrowproof-ai.com/blog/[slug]
```

---

## STEP 6: SNS投稿パッケージ統合（SNS Agent）

### X投稿（API自動投稿）
```bash
cd discord-bot && node scripts/post-x-from-package.js YYYY-MM-DD_[slug]
```

### 統合出力ファイル
**保存先**: `/content/sns/YYYY-MM-DD_[slug]-posts.md`

```markdown
---
title: "SNS投稿パッケージ — [記事タイトル]"
date: "YYYY-MM-DD"
source_blog: "https://tomorrowproof-ai.com/blog/[slug]"
source_note: "/content/note/NN_[slug].md"
---

# SNS投稿パッケージ — [記事タイトル]

## 投稿スケジュール

| 時間 | チャネル | 投稿ID | 方法 |
|------|---------|--------|------|
| 08:00 | X | X-01 | API自動 |
| 09:00 | note | NOTE-01 | KOZUKIコピペ |
| 12:15 | X | X-02 | API自動 |
| 12:30 | Instagram | IG-01 | KOZUKIコピペ |
| 18:00 | X | X-03 | API自動 |

## X投稿（3本）— API自動投稿

### X-01: [タイトル]
画像: `content/packages/visuals/[slug]/x-card-[slug].png`
```
[投稿文]
```
↓ リプライ
```
[ブログURL誘導]
```

### X-02: [タイトル]
```
[投稿文]
```
↓ リプライ
```
[note誘導]
```

### X-03: [タイトル]
```
[投稿文]
```

## Instagram（1本）— KOZUKIコピペ

### IG-01: [タイトル]
画像: `content/packages/visuals/[slug]/ig-[slug].jpg`
```
[キャプション + ハッシュタグ15個]
```

## note（1本）— KOZUKIコピペ
サムネイル: `content/packages/visuals/[slug]/note-thumb-[slug].png`
本文: `/content/note/NN_[slug].md`

## LinkedIn（1本）— KOZUKIコピペ
```
[BtoB寄り長文]
```
```

---

## 品質ゲート（各STEP完了時）

| STEP | チェック | 基準 |
|------|---------|------|
| 1 | コンテンツブリーフ完成 | KW + 競合分析 + note切り口 |
| 2 | コンテンツパッケージ完成 | Part 1-7全て埋まっている |
| 3 | Evaluator評価合格 | チェックリスト全項目クリア |
| 4 | 画像生成完了 | 5枚以上 + VISUAL-SPEC.md |
| 5 | ビルド成功 | `npm run build` エラーなし |
| 6 | SNSパッケージ完成 | 全投稿文 + 画像パス + スケジュール |

---

## note独立記事フロー（ブログ連動じゃないnote）

ブログ記事がない独立noteの場合:

```
STEP 1: [Marketing/Writer] テーマ決定 + PASONA構成設計
STEP 2: [Writer] note記事執筆（/content/note/NN_[slug].md）
STEP 3: [Visualizer] noteサムネイル生成（明るい背景）
STEP 4: [SNS] X誘導投稿 2-3本を /content/sns/x-daily/YYYY-MM-DD.md に追加
STEP 5: KOZUKIがnoteにコピペ公開
```

**注意**: 独立noteでもブログへのCTAを入れる（「完全ガイドはブログで」）

---

## フィードバックループ（月次）

毎月末にMarketing Agentが実行:

```
1. GA4で各ブログ記事のPV・滞在時間・直帰率を確認
2. Search Consoleでキーワード順位・CTRを確認
3. noteのスキ数・コメント数・フォロワー増減を確認
4. X投稿のインプレッション・エンゲージメント率を確認
5. 高パフォーマンスパターンを抽出 → 次月のコンテンツブリーフに反映
6. 低パフォーマンス記事 → タイトル・CTA・内部リンクを最適化
7. AI可視性チェック: ChatGPT/Perplexity/Geminiで主要KWを検索 → 引用されているか確認
```

**保存先**: `/journal/YYYY/MM/content-performance-review.md`

---

## 週次サイクル（月曜・金曜）

```
月曜（メイン公開日）:
  AM: Marketing → STEP 1-3（ブリーフ → 執筆依頼 → 品質評価）
  PM: Visualizer → STEP 4（画像生成）
  PM: Dev → STEP 5（HP公開）
  夕: SNS → STEP 6（投稿パッケージ + X API投稿）
  夕: KOZUKI → note + IG コピペ（15分）

金曜（サブ公開日）:
  同上構成（2本目）

火〜木・土日:
  SNS Agent が X日次投稿5本を自動生成・API投稿（KOZUKI作業なし）
```

月8本のブログ → 各12+派生 = X 48本 + IG 8本 + note 8本 + LinkedIn 8本 + 引用画像20+枚

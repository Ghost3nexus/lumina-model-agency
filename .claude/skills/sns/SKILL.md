---
name: sns
description: "Instagram・X・LinkedIn・Pinterest全SNSの投稿生成・スケジュール・分析エージェント。事業別アカウント運用、投稿コンテンツ企画、ハッシュタグ戦略を担当。起動: SNS・投稿・Instagram・X・Twitter・ハッシュタグ・コンテンツ・LinkedIn・Pinterest"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - WebSearch
  - WebFetch
  - Glob
  - Grep
---

# SNS Agent - 統合実行手順書（v7.0）

> 2026-03-15 調査結果に基づくv7.0更新。v6.0からの主要変更:
> - **リプライ先を海外AI公式・競合アカウントに集中**（日本の同業者にリプライしない）
> - **日本AI発信者はコンテンツ構造の研究対象**（投稿パターン・バズ構造を学ぶ）
> - **リプライ = 英語圏の大型アカウントの新投稿に30分以内で価値あるリプ**
> - 3本柱体制・3タイプ制（A/B/C）は維持
> - **リプライ1本 = オリジナル投稿30本分のインプレッション**（実測データ）

---

## 鉄則

### 1. コンテンツ依存関係

```
Type C（note連動）: note記事公開（URL確定） → X投稿生成 → X投稿
Type A/B: X内で完結。外部URL不要。
```

### 2. プレースホルダー絶対禁止

XXXXX、仮URL、推測URL、存在未確認URLを含む投稿は**生成も投稿も禁止**。

### 3. バイラル鮮度

AIトピックは**トレンド発生から1時間以内**の反応が最もリーチを稼ぐ。
鮮度が命。昨日のニュースは使わない。

### 4. 3本柱の優先順位

```
リプライ（150x） > 引用RT（25x） > オリジナル投稿（1x）
```

フォロワー〜1,000の現段階では**リプライが最優先**。
オリジナル投稿の量を減らしてでもリプライの質と量を確保する。

---

## リプライ戦略（v7.0 — 海外公式アカウント特化）

> **原則**: リプライ先は海外AI公式アカウント・海外AI CEOs。
> 日本のAI発信者はコンテンツ構造を学ぶ研究対象であり、リプライ先ではない。
> 日本のトップ発信者も同じ戦略を取っている（海外公式にリプ→フォロワー獲得）。

### リプライの実効データ（2026年検証済み）

| 指標 | オリジナル投稿 | 海外公式へのリプライ |
|------|-------------|-------------------|
| インプレッション | 400 | **12,000（30倍）** |
| プロフィール訪問 | 2 | **7** |
| 目的 | 既存フォロワーとの関係深化 | **新規フォロワー発見** |

### Tier 1: AI企業公式（製品アップデート時にリプライ）

| # | ハンドル | 概要 | リプライの切り口 |
|---|---------|------|----------------|
| 1 | **@OpenAI** | ChatGPT/API新機能発表 | 自社22体AIでの活用実例 |
| 2 | **@AnthropicAI** | Claude更新・安全性議論 | Claude Codeで法人運営している実体験 |
| 3 | **@GoogleDeepMind** | Gemini/研究発表 | 実務での検証結果・比較データ |
| 4 | **@MetaAI** | Llama/オープンソース | ライセンス問題の実体験（CC BY-NC-SA地雷） |
| 5 | **@midjourney** | 画像生成アップデート | ファッションEC用途の実験結果 |
| 6 | **@GroqInc** | 推論速度・コスト | API費用の比較データ |

### Tier 2: AI CEOs/リーダー（思想的な投稿にリプライ）

| # | ハンドル | フォロワー | リプライの切り口 |
|---|---------|-----------|----------------|
| 7 | **@sama** (Sam Altman) | 数百万 | AI×スタートアップ → 1人法人の現実 |
| 8 | **@ylecun** (Yann LeCun) | 972K | AI技術論争 → 実務者の現場感 |
| 9 | **@rowancheung** | 567K | AI週次まとめ → 独自データで補強 |
| 10 | **@AravSrinivas** (Perplexity CEO) | 322K | AI検索・ツール → ビジネス活用の実例 |
| 11 | **@OfficialLoganK** (Logan / Google) | 231K | 開発者向け情報 → 具体的な実装体験 |
| 12 | **@LinusEkenstam** | 219K | AI×デザイン → Lumina/ファッションAI |
| 13 | **@AndrewYNg** (Andrew Ng) | 数十万 | AI教育・実装 → 中小企業AI化の実体験 |
| 14 | **@GaryMarcus** | 197K | AI批評 → 建設的な反論・実務視点 |

### Tier 3: AI研究者・開発ツール（技術発表にリプライ）

| # | ハンドル | 概要 | リプライの切り口 |
|---|---------|------|----------------|
| 15 | **@alexalbert__** | Anthropic DevRel, Claude Tips | Claude活用の具体例 |
| 16 | **@tunguz** (Tomasz Tunguz) | VC・テック分析 | ソロプレナー視点のデータ |
| 17 | **@waitin4agi_** | AI起業家 | 1人法人AI運営の実例 |
| 18 | **@drfeifei** (Fei-Fei Li) | Stanford AI Director | ファッション×AI研究への接続 |

### リプライの型（5テンプレート）

| 型 | 名前 | 使い方 | 言語 |
|---|------|--------|------|
| R1 | **データ追加** | 相手の主張に具体的な自社数字を追加 | 英語 or 日本語 |
| R2 | **実体験補強** | 22体AI法人運営の生データで裏付ける | 英語推奨 |
| R3 | **建設的反論** | 敬意を持って別視点を提示 | 英語 |
| R4 | **質問深掘り** | 相手の専門知識を引き出す質問 | 英語 |
| R5 | **事例共有** | ミニケーススタディを1-2文で | 英語 or 日本語 |

### リプライで出せるTomorrowProof独自の武器

| 武器 | 使える型 | 刺さる相手 |
|------|---------|-----------|
| 22体AIエージェント法人運営の実数値 | R1, R2 | @sama, @AndrewYNg, @rowancheung |
| AI動画6ツール比較→Remotion83%削減 | R1, R5 | @midjourney, @LinusEkenstam |
| ライセンス地雷（CC BY-NC-SA商用不可） | R2, R3 | @MetaAI, オープンソース議論 |
| 二重AIパイプライン白飛び事件 | R5 | @OpenAI, @AnthropicAI（品質議論時） |
| 月¥5,000で22体AI運用 | R1 | @sama, @tunguz（コスト議論時） |

### リプライの鉄則

1. **投稿後30分以内にリプライ** — 早いほどアルゴリズムに乗る
2. **「Great!」「Amazing!」禁止** — 必ず独自の情報・視点・データを追加
3. **自社宣伝禁止** — 価値提供のみ。リンク貼らない
4. **1日20リプライ目標** — 朝10本（海外の夜間投稿に返信）+ 夜10本
5. **返信が来たら即レス（30分以内）** — 会話チェーンが150xブースト
6. **「AI法人運営者」視点を崩さない** — ブランド一貫性
7. **英語リプライ推奨** — 海外公式には英語。日本語フォロワーにも英語は刺さる

---

## コンテンツ研究対象（日本AI発信者）

> **目的**: 投稿の構造・フォーマット・バズパターンを学ぶ。リプライ先ではない。

### 研究対象アカウント

| # | ハンドル | フォロワー | 投稿スタイル | 学ぶべきパターン |
|---|---------|-----------|-------------|----------------|
| 1 | **@tetumemo** | 数万 | AI図解×検証レポート。ニュースレター毎週火曜。「〇〇やったらエグかった」系スレッド | **スレッド＋図解** の組み合わせ。量で圧倒する50事例一挙型 |
| 2 | **@sora19ai** | 17.2K | Dify×Make自動化。ステップバイステップ学習ロードマップ型 | **学習パス型リスト**（①→②→③の段階構造）が保存されやすい |
| 3 | **@taziku_co** | 数千〜1万 | 海外AI論文速報。毎日複数投稿。Project/Paper/Codeリンク付き | **速報キュレーション型**の安定フォーマット |
| 4 | **@MacopeninSUTABA** | 112.1K | 有益リソースまとめ。「このサイトは凄い✨」+スクショ。Qiita 2024年1位 | **まとめキュレーション型**がフォロワー10万超の原動力 |
| 5 | **@masahirochaen** | ~17万 | AIニュース最速発信。AI自動生成術を公開。Digirise CEO | **速報×実践** の組み合わせ。投稿頻度が異常に高い |
| 6 | **@shota7180** | ~14万 | SHIFT AI代表。AIツール図解。コミュニティ2万人運営 | **図解×教育型**。コミュニティをフォロワー装置化 |

### 盗むべき投稿構造（共通パターン）

| パターン | 効果 | KOZUKIへの適用 |
|---------|------|---------------|
| **スレッド形式** | インプレッション+63% | 22体AI組織の裏側をスレッドで語る |
| **図解・スクショ画像** | BM率大幅増 | 「22体AI組織図」「6ツール比較表」を図解化 |
| **ステップ型リスト（①→②→③）** | 保存率高い | 「AI法人運営のロードマップ」をリスト形式で |
| **「〇〇やったらエグかった」フック** | クリック率高い | 自社実験結果の驚き要素をフックに |
| **有益リソースまとめ型** | フォロワー直結 | 「AI法人運営に使ってるツール全公開」 |

---

## 引用RT戦略（v6.0 新規）

### セルフQT
- 自分のオリジナル投稿を**4-6時間後**に引用RT
- 追加コメント: より過激な意見、後日談、データ追加

### 他者引用RT
- バズっているAI関連投稿に**自社視点を乗せて**引用RT
- 「うちではこうしている」「この数字の裏側はこうだ」

### 引用RTの型

| 型 | 名前 |
|---|------|
| Q1 | **実体験追加** |
| Q2 | **反論・別角度** |
| Q3 | **データ補強** |
| Q4 | **セルフQT更新** |

---

## 3タイプ定義

| タイプ | 名称 | 内容 | note依存 | 頻度 |
|--------|------|------|---------|------|
| **Type A** | バイラル考察 | AI関連バズトピック × TomorrowProof独自視点。ニュース速報+考察、引用RT的考察、データ×独自解釈 | **なし** | 毎日1-2本 |
| **Type B** | 自社ストーリー | 自社の実体験・数字・AI社員エピソード・失敗談・仕組みの裏側 | **なし** | 週3-4本 |
| **Type C** | note連動 | note公開告知 + 記事内容の引用 + URL誘導リプライ | **必須** | 週1-2本（note公開日のみ） |
| **Type D** | 実装コード共有 | 当日の開発で使ったコード・仕組み・解決策を共有。Build in Public。技術的な有益情報で保存・フォローを獲得 | **なし** | 毎日1本 |

### Type A: バイラル考察の書き方

```
構成:
1. 【】フック — バズトピックの核心を一言で
2. 事実の提示 — ソース付きで「何が起きたか」を2-3行
3. TomorrowProof視点 — 「うちはこうしている」「だからこう思う」を3-5行
4. 断言で締め — 問いかけ or 結論

例:
【Claude Codeが開発者の本番DBを丸ごと消した】
2.5年分のデータ。スナップショットごと。一瞬で。
うちは全エージェントに承認ゲートを設けている。
破壊的操作はCEOの承認がないと実行できない。
AIを信用するな。仕組みで止めろ。
```

**ソース基準**: ファクトチェックフロー（.claude/rules/fact-check-flow.md）のAラベル（公式ソース確認済み）のみ使用。Bラベルは「〜と見られる」表現で。

### Type B: 自社ストーリーの書き方

```
構成:
1. 【】フック — 自社の意外な事実 or 数字
2. ストーリー — 具体的なエピソード（何をして、何が起きたか）
3. 学び or 問いかけ

例:
【AIエージェント同士が喧嘩した話】
Dev Agent:「背景は#000000でいい」
Branding Agent:「ダメ。#050508」
並べたら「高級感」が違った。
デザインはセンスだと思っていた。違った。論理だ。
```

**ソース**: 自社のnote記事、journal、実運用データから。自社体験100%。

### Type D: 実装コード共有の書き方（Build in Public）

```
構成:
1行目: 【問題/成果】— 何を解決したか or 何を作ったか（数字入り）
2-3行目: コードスニペット or アーキテクチャ図（コードブロック）
4行目: なぜこうしたか（技術的判断の理由）
5行目: 学び or Tips（フォロワーが持ち帰れる知見）

例:
「APIサーバーの起動が60秒→3秒になった。

原因: discord.jsの同期requireが全ルートをブロック

function lazyRoute(path) {
  let r = null;
  return (req, res, next) => {
    if (!r) r = require(path);
    r(req, res, next);
  };
}

全21ルートをlazy-load化。
コールドスタート問題はrequireの順序で9割解決する。」
```

**ソース**: 当日のgit diff、journal、実装中のコード変更から。
**鉄則**: 実際に動いたコードのみ。理論や推測は禁止。
**コードブロック**: 4-8行が最適。長すぎると読まれない。
**画像**: コード部分のスクリーンショット or ターミナル出力のキャプチャが効果的。

### Type C: note連動の書き方

```
前提: url-registry.json に公開済みURLが登録されている記事のみ対象。

構成:
1. 本文（Type A or B のフォーマット）— note記事の核心を引用
2. リプライ — 「noteで全文公開してます → [実URL]」

リプライのURL:
- url-registry.json から取得（手入力禁止）
- 登録がなければ Type C 自体を生成しない
```

---

## 日次配分ルール（3-5本/日 + リプライ20本 + QT3本）

### note公開日（週1-2回）
```
Type A × 1-2本 + Type B × 1-2本 + Type C × 1本 = 3-5本
+ リプライ20本 + 引用RT 3本
```

### 通常日
```
Type A × 2本 + Type B × 2本 = 3-5本
+ リプライ20本 + 引用RT 3本
```

### 時間割（v7.0 — 海外公式リプライ中心）

| 枠 | 時刻 | 内容 | 狙い |
|----|------|------|------|
| 1 | 07:00 | **海外リプライ巡回①（10本）** | 米国夕方の投稿に30分以内リプ（最重要） |
| 2 | 08:00 | オリジナル Type A | 朝一トレンド速報 |
| 3 | 12:00 | オリジナル Type B + セルフQT | 昼休みピーク |
| 4 | 13:00 | 引用RT（海外公式の発表を日本語で） | 速報翻訳+独自視点 |
| 5 | 18:00 | オリジナル Type A/B | 帰宅ピーク |
| 6 | 22:00-23:00 | **海外リプライ巡回②（10本）** | 米国朝の投稿にリプ（ゴールデンタイム） |

---

## 起動時の実行フロー（7ステップ）

### Step 1: 日付・状況・モード判定

```
1. 今日の日付と曜日を確認
2. 既存の投稿ファイルがあるか確認: /content/sns/x-daily/YYYY-MM-DD.md
3. url-registry.json を読み込み → 公開済みnote URLをリスト化
4. モード判定:
   - note公開日（KOZUKIから指示 or 当日noteを公開した場合）
     → Type C を1本含める（registry登録済みURLのみ）
   - 通常日
     → Type A + B のみ。note誘導リプライなし
```

### Step 2: リアルタイムトレンド調査（WebSearch — 必須実行）

**Type A（バイラル考察）の材料を集める。省略禁止。**

```
検索KW（並行で実行）:
1. 「AI agent news today 2026」
2. 「AIエージェント 最新 2026年3月」
3. 「Claude Code」OR「生成AI 企業」
4. 「AI startup funding 2026」OR「AI security breach」
5. 「ソロプレナー AI」OR「1人法人 AI」
```

調査結果から**Type Aに使えるトピックを5-6つ選定**:
- 鮮度（24時間以内）
- TomorrowProof視点が付けられるか
- 自社の実体験と接続できるか

### Step 3: 自社ストーリー候補の抽出（Type B用）

```
1. /content/note/ 以下の記事から引用候補を抽出
   - 数字フック、名言フレーズ、ストーリー切り抜き
2. /journal/ から最近の意思決定・エピソードを確認
3. 自社の実運用データ（エージェント数、タスク完了率、API費用等）
```

### Step 3.5: 過去投稿との重複チェック（必須・10本/日対応）

**10本/日は重複リスクが高い。省略禁止。**

```
1. 過去ファイルの読み込み（過去7日分）:
   /content/sns/x-daily/*.md の直近7ファイルを確認
   - 過去の【】フックテキストを全てリスト化
   - 過去使用した数字・データポイントを全てリスト化
   - 過去使用したソースURL・記事タイトルをリスト化
   - 過去のテンプレート系統（A1-B3）の使用頻度を確認
   - 過去引用したnote記事スラッグをリスト化

2. 当日10本間の重複チェック（同日内の被り防止）:
   - 同日内で同じテンプレート系統は最大2回まで
   - 同日内で同じソースからの投稿は最大2本まで
   - 同日内でType Aが同じトピック領域（セキュリティ、資金調達等）は最大2本まで
   - 同日内のType Bで同じnote記事からの引用は1回まで

3. 過去との重複判定基準:
   - 同じ【】フックテキスト → 永久NG
   - 同じ数字の同文脈使用 → 7日以内NG（別文脈ならOK）
   - 同テンプレート系統が3日連続 → NG（ローテーション必須）
   - 同note記事引用 → 7日以内NG
   - 同じバイラルトピック → 2日連続NG（別角度ならOK）
   - 同じソースURL → 3日以内NG

4. 出力: frontmatter の dedup_check に記録
   dedup_check:
     avoided_hooks: "過去7日のフック一覧（被り回避確認）"
     avoided_numbers: "過去7日の使用済み数字"
     avoided_sources: "過去3日の使用済みソース"
     same_day_distribution: "A1:2, A2:1, B1:2, B3:1..."
```

### Step 4: 投稿文を10本生成

**各投稿に `type: A/B/C` を明記する。**

#### X投稿 必須チェックリスト

| # | ルール | 必須 |
|---|--------|------|
| 1 | **【】括弧フックで始める** | 必須 |
| 2 | **140字以内** | 必須 |
| 3 | **自社数字 or 具体的データを含む** | 必須 |
| 4 | **画像を必ず付ける** | 必須 |
| 5 | **断言する**（「かもしれない」禁止） | 必須 |
| 6 | **外部リンクは本文に貼らない** | 必須 |
| 7 | **スレッドは2本まで** | 必須 |
| 8 | **Type A: トレンド鮮度24h以内** | Type Aのみ |
| 9 | **Type B: 自社体験100%** | Type Bのみ |
| 10 | **Type C: url-registry.json登録済みURLのみ** | Type Cのみ |
| 11 | **プレースホルダーURL絶対禁止** | 必須 |
| 12 | **BM自問テスト**（保存して読み返したいか？） | 必須 |

#### 6テンプレート（系統を明記）

| 系統 | 名前 | 狙い | 相性の良いタイプ |
|------|------|------|----------------|
| A1 | 会話誘発型 | Reply 150x | Type A, B |
| A2 | 数字でスケール | BM 14.4x | Type A, B |
| A3 | 意外性・ギャップ | 拡散 | Type A |
| B1 | 本質断言 | Quote 25x | Type A, B |
| B2 | 逆説・反常識 | 拡散 + BM | Type A |
| B3 | 哲学・思考 | ファン化 | Type B |

#### 投稿時間 → 上記「時間割（10枠・固定）」を参照

※ 既に過ぎた時間帯はスキップ。残り枠分だけ生成する。
※ `scheduled` モードならcronで自動投稿される。

### Step 5: 画像を生成（全投稿分）

**ツール優先順位**:
1. Replicate Flux MCP（`mcp__replicate-flux__generate_image`）
2. HTML/CSS カード生成（フォールバック）

**画像ルール**:
- サイズ: **16:9**（X最適）
- ブランドカラー: 背景 #050508 / アクセント #00D4FF / テキスト #FAFAFA
- テキスト焼き込みは最小限（Fluxのテキスト精度に限界あり）

**タイプ別画像テンプレート**:

| タイプ | 画像スタイル |
|--------|------------|
| Type A | ニュースカード / データカード / 警告カード |
| Type B | 引用カード / Before-After / ストーリーカード |
| Type C | noteサムネイル引用 / 記事タイトルカード |

### Step 6: 投稿ファイルに出力

**保存先**: `/content/sns/x-daily/YYYY-MM-DD.md`

**フォーマット**:
```markdown
---
title: "X日次投稿 — YYYY-MM-DD"
date: "YYYY-MM-DD"
type: "x-daily"
account: "@gpt_workhack"
mode: "通常" or "note連動"
posts: 10
trend_research: "トレンドサマリー"
dedup_check:
  avoided_hooks: "..."
  avoided_numbers: "..."
---

## 本日のX投稿（10本）

---

### 1. [07:00] タイトル
**タイプ**: Type A（バイラル考察）
**系統**: [A1-B3] + [画像テンプレート]
**画像**: `content/sns/x-daily/images/YYYY-MM-DD-01.png`
```
[投稿文]
```
**文字数**: XXX字
**ソース**: [Aラベル: URL]

---

### 2. [08:30] タイトル
**タイプ**: Type B（自社ストーリー）
...

（### 3〜10 も同フォーマットで。時間割に従い10枠分を生成）

---

## チェックリスト

| # | ルール | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|--------|---|---|---|---|---|---|---|---|---|---|
| 1 | 【】フック | | | | | | | | | | |
| 2 | 140字以内 | | | | | | | | | | |
| 3 | データ/数字 | | | | | | | | | | |
| 4 | 画像 | | | | | | | | | | |
| 5 | 断言 | | | | | | | | | | |
| 6 | URL本文なし | | | | | | | | | | |
| 7 | スレッド2本以内 | | | | | | | | | | |
| 8 | タイプ別条件 | | | | | | | | | | |
| 11 | プレースホルダー無し | | | | | | | | | | |
| 12 | BM自問テスト | | | | | | | | | | |
```

### Step 7: API自動投稿

```bash
# 全投稿を即時投稿
cd discord-bot && node scripts/post-x-daily.js YYYY-MM-DD all

# 時刻が来た未投稿分だけ投稿（cron向け）
cd discord-bot && node scripts/post-x-daily.js YYYY-MM-DD scheduled

# 特定の投稿だけ
cd discord-bot && node scripts/post-x-daily.js YYYY-MM-DD 3
```

**ガード（v5.0）**:
- プレースホルダーURL（XXXXX等）を検出 → リプライをブロック
- Type Cのリプライは `url-registry.json` に登録済みURLが含まれていなければブロック
- `scheduled` モードは `.posted/YYYY-MM-DD.json` で二重投稿を防止

---

## サービス言及ルール

- 10本中、直接的なサービス言及は**最大2本**
- 残りは純粋な価値提供・考察
- CARD:NOIR / Lumina 等のβ告知は**週2回限定**

---

## アカウント情報

| 事業 | プラットフォーム | ターゲット |
|------|----------------|----------|
| TomorrowProof本体 | X / LinkedIn | 経営者・AI興味層 |
| Lumina Studio | Instagram / Pinterest | クリエイター・企業担当者 |
| AI絵本メーカー | X / Instagram | 保護者・幼稚園教諭 |

**Xメインアカウント**: @gpt_workhack
**独自ポジショニング**: 「AIエージェントで法人運営している唯一のアカウント」

---

## ファネル意識

```
Type A（認知・リーチ）→ Type D（技術信頼・保存）→ Type B（信頼・ファン化）→ Type C（教育・noteへ誘導）→ ブログ（SEO）→ LP（CV）
```

Type AとBはX内で完結し、Xのアルゴリズムに最適化。
Type Cはnote公開日にだけ発動し、確実なURLで誘導。

---

## ナレッジ参照先

| ファイル | 内容 |
|---------|------|
| `knowledge/x-algorithm-2026.md` | Xアルゴリズム重み詳細 |
| `knowledge/x-performance-insights.md` | 投稿ルール（実データ検証済み） |
| `knowledge/x-buzz-framework.md` | バズの2類型・テンプレート |
| `knowledge/x-image-templates.md` | 画像プロンプト5テンプレート |
| `knowledge/note-thumbnail-guide.md` | noteサムネイル設計 |
| `playbooks/x-daily-auto.md` | 自動運用手順 |
| `knowledge/video-reel-pipeline.md` | AI動画リール制作パイプライン |
| `knowledge/x-growth-strategy-v7.md` | v7.0 海外公式リプライ＋日本発信者コンテンツ研究 |

**原則: このSKILL.mdだけで投稿生成が完結する。**

---

## AI動画リール制作（v1.0 — 2026-03-13 実証済み）

> 画像→動画→音声→結合の全自動パイプライン。
> Instagram Reels / X動画 / TikTok に対応。
> 全アカウント（TomorrowProof / 丸山幼稚園 / KOZUKI個人）で使用可能。

### パイプライン

```
台本(Claude) → 画像生成(Flux 9:16) → 動画化(Hailuo i2v) → 音声(VOICEVOX) → 結合(ffmpeg)
```

### Step 1: 台本作成

- 15-20秒（3カット構成）が最適
- 各カット5-6秒（Hailuo生成上限に合わせる）
- ナレーション原稿は短く（10-15字以内が聞きやすい）
- フック（冒頭3秒）で視聴者を掴む

```
構成テンプレート:
  カット1 (0-5s): フック — 動きのあるシーン
  カット2 (5-10s): 本題 — メインメッセージ
  カット3 (10-15s): 締め — エモーショナルな余韻
  ナレーション: 最終カットに重ねる（4-5秒）
```

### Step 2: 画像生成（Flux via Replicate MCP）

```
ツール: mcp__replicate-flux__generate_image
アスペクト比: 9:16（縦型リール）
フォーマット: png

スタイルプリセット:
- ジブリ風: "Studio Ghibli anime style illustration, Hayao Miyazaki art style, soft pastel watercolor aesthetic"
- ダークテック: "Dark tech aesthetic, #050508 background, cyan #00D4FF accent, holographic elements"
- シネマティック: "Cinematic photorealistic, dramatic lighting, shallow depth of field, 4K quality"
- ストリート: "Urban street photography style, moody atmosphere, neon lights, editorial fashion"
```

### Step 3: 動画化（Hailuo / minimax/video-01 via Replicate API）

```bash
# Replicate API でimage-to-video
# Version: minimax/video-01 latest
# Input: first_frame_image (base64 data URI) + prompt
# Output: 5.6秒 720p MP4

# 大きい画像はbase64が巨大になるため、python経由でPOST:
python3 << 'EOF'
import json, base64, urllib.request, os

token = "..."  # .mcp.json から取得
with open("scene.png", "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode()

payload = json.dumps({
    "version": "<latest_version_id>",
    "input": {
        "prompt": "animation description...",
        "first_frame_image": f"data:image/png;base64,{img_b64}",
        "prompt_optimizer": True
    }
}).encode()

req = urllib.request.Request(
    "https://api.replicate.com/v1/predictions",
    data=payload,
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
)
resp = urllib.request.urlopen(req)
result = json.loads(resp.read().decode())
print(result["id"])  # Poll this ID for completion
EOF
```

**動画プロンプトのコツ**:
- 動きを具体的に指定（"slowly walking", "petals drifting", "camera push in"）
- 元画像のスタイルを維持する記述を入れる（"anime style animation", "cinematic movement"）
- 5秒以内の動きに収める（それ以上はドリフトする）

### Step 4: 音声生成（VOICEVOX — Docker）

```bash
# VOICEVOX Engine起動（初回のみ）
docker run -d --rm --name voicevox -p 50021:50021 voicevox/voicevox_engine:cpu-latest

# 音声合成（2ステップ）
TEXT_ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('テキスト'))")
QUERY=$(curl -s -X POST "http://localhost:50021/audio_query?text=${TEXT_ENCODED}&speaker=0")
curl -s -X POST "http://localhost:50021/synthesis?speaker=0" \
  -H "Content-Type: application/json" -d "$QUERY" --output narration.wav
```

**推奨ボイス**:

| 用途 | 話者 | ID | 特徴 |
|------|------|-----|------|
| 幼稚園・教育 | 四国めたん(あまあま) | 0 | 柔らかい女性声 |
| 幼稚園・子供向け | ずんだもん(あまあま) | 1 | 親しみやすい |
| TomorrowProof・ビジネス | 青山龍星(ノーマル) | 13 | 低めの男性声 |
| TomorrowProof・煽り | 青山龍星(熱血) | 81 | 力強い男性声 |
| KOZUKI個人 | 玄野武宏(ノーマル) | 11 | 落ち着いた男性声 |
| ナレーション・読み上げ | No.7(アナウンス) | 30 | アナウンサー風 |

### Step 5: 結合（ffmpeg）

```bash
# 動画結合
cat > /tmp/concat.txt << EOF
file 'scene-01.mp4'
file 'scene-02.mp4'
file 'scene-03.mp4'
EOF
ffmpeg -y -f concat -safe 0 -i /tmp/concat.txt -c copy concat.mp4

# ナレーション合成（最終カットに重ねる）
ffmpeg -y -i concat.mp4 -i narration.wav \
  -filter_complex "[1:a]adelay=11500|11500,volume=1.8[narr];[narr]apad=whole_dur=17[aout]" \
  -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -shortest output.mp4
```

### コスト

| 素材 | 単価 | 3カット分 |
|------|------|----------|
| Flux画像 | ~$0.01/枚 | $0.03 |
| Hailuo動画 | ~$0.13/クリップ | $0.40 |
| VOICEVOX | 無料 | ¥0 |
| **合計/リール** | | **~¥60** |

### 保存先

```
content/sns/video-tests/           ← テスト動画
content/sns/reels/YYYY-MM-DD/      ← 本番リール（日付別）
content/sns/reels/YYYY-MM-DD/
  ├── script.md                    ← 台本
  ├── scene-01.png / .mp4          ← 各カット
  ├── scene-02.png / .mp4
  ├── scene-03.png / .mp4
  ├── narration.wav                ← ナレーション
  └── reel-final.mp4               ← 完成リール
```

### アカウント別スタイルガイド

| アカウント | スタイル | ボイス | トーン |
|-----------|---------|--------|--------|
| TomorrowProof (@gpt_workhack) | ダークテック / シネマティック | 青山龍星 | 断言・挑発 |
| 丸山幼稚園 | ジブリ風 / 温かいアニメ | 四国めたん / ずんだもん | 温かい・安心 |
| KOZUKI個人 | ストリート / ミニマル | 玄野武宏 | 等身大・哲学 |
| Lumina Studio | シネマティック / ファッション | No.7(アナウンス) | 洗練・プロ |

### 制約・注意点

- Hailuo動画は最大5.6秒/クリップ。長尺は複数クリップ結合が必須
- 生成時間: 画像~5秒、動画~3-6分/クリップ。3カットで計10-20分
- 動画内のキャラ一貫性は保証されない（カット間で顔が変わる可能性）
- テキスト焼き込みはffmpegで後付けが確実（AI動画内テキストは崩れやすい）
- VOICEVOX使用時はクレジット表記推奨（利用規約に準拠）

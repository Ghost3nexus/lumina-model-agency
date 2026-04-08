# RINKA GRWM Short Video — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** RINKA（LUMINA MODEL AGENCYのAIインフルエンサー）のGRWM動画をInstagram Reels向けに1本制作し、AIモデルSNSショート動画パイプラインを検証する。

**Architecture:** 競合バイラル構造分析 → コンセプト設計 → Gemini静止画生成（10カット）→ I2Vツール（Kling/Seedance 2.0）で動画変換 → CapCutで最終編集。品質基準は「AIとわからないレベル」。

**Tech Stack:** Gemini 3.1 Flash Image Preview / Kling 1.6 / Seedance 2.0 / CapCut / Instagram Reels

**Spec:** `docs/superpowers/specs/2026-04-08-rinka-grwm-short-video-design.md`

---

## Task 1: I2Vツール検証

**目的:** Kling 1.6 / Seedance 2.0 のアクセス・無料枠・品質を確認し、使用ツールを決定する。

**Files:**
- Read: `public/agency-models/influencer-girl-01/beauty.png`（テスト用リファレンス画像）
- Create: `docs/sns-shorts/tool-evaluation.md`

- [ ] **Step 1: Kling 1.6 のアカウント作成・無料枠確認**

  WebSearchで最新の料金体系・無料枠・9:16対応を調査。以下をまとめる:
  - 無料枠: 何クリップ/月? 最大尺?
  - 9:16入力対応の有無
  - 1クリップあたりのコスト（無料枠超過時）

- [ ] **Step 2: Seedance 2.0 のアクセス確認**

  WebSearchで以下を調査:
  - アクセス方法（Web? API? waitlist?）
  - レイヤー編集機能の詳細（背景差し替え、照明編集）
  - 料金体系
  - I2V機能の有無（静止画→動画もできるか、動画編集のみか）

- [ ] **Step 3: RINKAの既存画像でテスト生成**

  `beauty.png` を使って以下をテスト:
  - Kling: 静止画→3秒動画（微動: 瞬き、髪揺れ）
  - Seedance 2.0: アクセス可能なら同様のテスト
  - 品質チェック: 顔歪み、髪色維持、自然さ

- [ ] **Step 4: ツール評価レポート作成**

  `docs/sns-shorts/tool-evaluation.md` に以下を記録:
  ```markdown
  # I2V Tool Evaluation — 2026-04-08

  ## Kling 1.6
  - アクセス: [OK/NG]
  - 無料枠: [詳細]
  - 9:16対応: [Y/N]
  - テスト結果: [品質評価 + スクショ]
  - 判定: [採用/不採用]

  ## Seedance 2.0
  - アクセス: [OK/NG/waitlist]
  - レイヤー編集: [詳細]
  - テスト結果: [品質評価]
  - 判定: [採用/不採用]

  ## 結論
  - メインツール: [選定結果]
  - フォールバック: [選定結果]
  ```

- [ ] **Step 5: CEO報告 → 使用ツール決定**

  テスト動画をCEOに見せて品質判断を仰ぐ。
  **ゲート:** I2Vテストで「自然な動き」が確認できたら Task 3 以降で使用。不可なら静止画Reels（Ken Burns）に切り替え。

---

## Task 2: 競合バイラルGRWM構造分析

**目的:** バイラルGRWM Reels 10-15本の構造を分析し、RINKAの動画に「パクる」テンプレートを作る。

**Files:**
- Create: `docs/sns-shorts/grwm-viral-analysis.md`

- [ ] **Step 1: 日本人女性GRWM Reelsを5本収集**

  WebSearchで以下を検索:
  - 「GRWM 原宿 instagram reels」
  - 「支度動画 古着 バイラル」
  - 「GRWM harajuku streetwear」

  各投稿から記録:
  - URL / アカウント名 / 再生数
  - 総尺
  - カット数とタイミング
  - フック（最初3秒の内容）
  - BGMジャンル

- [ ] **Step 2: 海外バイラルGRWM Reelsを5本収集**

  WebSearchで以下を検索:
  - 「GRWM viral reels 2026 most viewed」
  - 「get ready with me aesthetic streetwear」
  - 「GRWM outfit inspo 1M views」

  同じフォーマットで記録。

- [ ] **Step 3: ファッション特化GRWM Reelsを3-5本収集**

  WebSearchで以下を検索:
  - 「GRWM outfit streetwear girl reels」
  - 「fashion GRWM viral structure」
  - 「outfit transition reels viral」

  同じフォーマットで記録。

- [ ] **Step 4: 構造パターンを抽出**

  収集した10-15本から共通パターンを分析:

  ```markdown
  ## バイラルGRWM構造テンプレート

  ### フック（0-3秒）
  - パターンA: 完成形チラ見せ → 巻き戻し
  - パターンB: テキスト煽り「今日のバイト行くまで」
  - パターンC: Before（すっぴん）→ After（完成）高速カット

  ### カット割り
  - 平均カット長: X秒
  - 総カット数: X-X個
  - テンポ変化: [序盤ゆっくり→後半テンポアップ etc.]

  ### カメラアングル比率
  - 鏡越し: X%
  - 三脚正面: X%
  - 手持ち/セルフィー: X%
  - クローズアップ（手元/目元）: X%

  ### テキスト
  - フォント: [共通パターン]
  - 配置: [上/中央/下]
  - 出現頻度: X箇所/動画

  ### トランジション
  - 最頻出: [カット/ディゾルブ/ジャンプカット etc.]

  ### 尺配分
  - メイク: X%
  - ヘア: X%
  - コーデ: X%
  - フック+締め: X%
  ```

- [ ] **Step 5: grwm-viral-analysis.md を保存**

  上記の分析結果を `docs/sns-shorts/grwm-viral-analysis.md` に保存。

- [ ] **Step 6: コミット**

  ```bash
  git add docs/sns-shorts/grwm-viral-analysis.md
  git commit -m "research: GRWM viral structure analysis for RINKA short video"
  ```

---

## Task 3: RINKAコンセプト確定 + プロンプト設計

**目的:** 競合分析結果を反映してカット構成を最終調整し、全カットのGeminiプロンプトを設計する。

**Files:**
- Read: `docs/sns-shorts/grwm-viral-analysis.md`（Task 2の成果物）
- Read: `docs/model-direction/men-character-bibles.md` L879-1027（RINKAキャラバイブル）
- Read: `public/agency-models/influencer-girl-01/beauty.png`（顔リファレンス）
- Create: `docs/sns-shorts/rinka-grwm-concept.md`

- [ ] **Step 1: カット構成を競合分析に基づいて最終調整**

  - 競合分析のフック/カット割り/尺配分テンプレートと、specのカット構成を照合
  - バイラル構造に合わない部分を修正（カット数の増減、尺配分の調整、フックの変更等）
  - 最終カット構成テーブルを確定

- [ ] **Step 2: 全カットのGeminiプロンプトを設計**

  各カットに対して以下のプロンプト構造で設計:

  ```
  [カット名] プロンプト:

  キャラ固定（全カット共通）:
  "Young Japanese woman, 23 years old, round face, large eyes,
  pink-ash shoulder-length hair, small star tattoo on right collarbone,
  fair skin, petite build (165cm)"

  シーン固定:
  "[このカット固有のシーン・アクション・背景・照明]"

  衣装固定（着替え後カットのみ）:
  "[specの最終着用アイテムスペックから]"

  技術指定:
  "9:16 aspect ratio, 1024x1792, natural indoor lighting,
  iPhone selfie camera aesthetic, slight grain, warm tone"
  ```

  CLAUDE.md指示: プロンプトは短く。400語以内。

- [ ] **Step 3: テキストオーバーレイ計画を確定**

  競合分析のテキスト配置パターンに基づいて:
  - フォントスタイル（手書き風? ゴシック? 明朝?）
  - 配置位置（中央? 下部?）
  - 表示タイミング（各カットの何秒目?）
  - 日本語テキスト内容の最終版

- [ ] **Step 4: rinka-grwm-concept.md を保存**

  最終カット構成 + 全プロンプト + テキスト計画を保存。

- [ ] **Step 5: CEO確認**

  コンセプト全体をCEOに提示。カット構成・プロンプト・テキストの承認を得る。

- [ ] **Step 6: コミット**

  ```bash
  git add docs/sns-shorts/rinka-grwm-concept.md
  git commit -m "design: RINKA GRWM concept with shot list and prompts"
  ```

---

## Task 4: 静止画生成（10カット）

**目的:** Gemini 3.1 Flash Image Previewで全カットの静止画を生成し、ベストを選定する。

**Files:**
- Read: `docs/sns-shorts/rinka-grwm-concept.md`（Task 3の成果物）
- Read: `public/agency-models/influencer-girl-01/beauty.png`（顔リファレンス）
- Read: `public/agency-models/influencer-girl-01/polaroid-front.png`（ポラロイドリファレンス）
- Create: `docs/sns-shorts/rinka-grwm-01/stills/` ディレクトリ + 画像ファイル
- Create: `docs/sns-shorts/rinka-grwm-01/manifest.json`

- [ ] **Step 1: ディレクトリ構成を作成**

  ```bash
  mkdir -p docs/sns-shorts/rinka-grwm-01/{stills,clips,final}
  ```

- [ ] **Step 2: カット1-3 を生成（フック・寝起き・スキンケア）**

  各カット2-3枚ずつ生成。rinka-grwm-concept.md のプロンプトを使用。
  - RINKAの beauty.png を参照画像として添付
  - 9:16（1024x1792）で出力
  - 保存: `stills/01-hook-v1.png`, `01-hook-v2.png`, ...

- [ ] **Step 3: カット4-6 を生成（ベースメイク・ポイントメイク・ヘア）**

  同様に生成。メイク系はクローズアップ中心。

- [ ] **Step 4: カット7-10 を生成（コーデ選び・着替え完了・アクセ・出発）**

  同様に生成。着替え後は衣装スペックの全アイテムが映ること。

- [ ] **Step 5: 各カットのベストを選定**

  品質チェック:
  - [ ] 顔の一貫性（全カットでRINKAに見えるか）
  - [ ] 髪色がピンクアッシュを維持しているか
  - [ ] 衣装の正確性（着替え後カット）
  - [ ] アングル・構図がGRWMとして自然か
  - [ ] 解像度・画質

  ベスト10枚を選定 → `stills/01-hook.png` ～ `stills/10-departure.png` にリネーム。

- [ ] **Step 6: manifest.json を作成**

  ```json
  {
    "description": "RINKA GRWM #01 — 下北沢古着屋バイトの支度",
    "assets": [
      {
        "file": "stills/01-hook.png",
        "purpose": "フック — 完成形RINKA全身",
        "tool": "Gemini 3.1 Flash Image Preview",
        "created": "2026-04-08"
      }
    ]
  }
  ```

- [ ] **Step 7: CEO確認（品質ゲート）**

  10枚をCEOに提示:
  - 全カットの顔一貫性
  - 衣装の正確性
  - 「AIとわからない」レベルに達しているか

  **ゲート:** CEO承認 → Task 5 へ。修正指示 → Step 2-5 を再実行。

- [ ] **Step 8: コミット**

  ```bash
  git add docs/sns-shorts/rinka-grwm-01/manifest.json
  git commit -m "asset: RINKA GRWM stills — 10 cuts selected"
  ```

  ※ 画像ファイル自体はサイズが大きいためgit管理外（.gitignore）。manifest.jsonで追跡。

---

## Task 5: I2V動画変換

**目的:** 静止画10枚をI2Vツールで2-4秒の動画クリップに変換する。

**Files:**
- Read: `docs/sns-shorts/rinka-grwm-01/stills/` （Task 4の成果物）
- Read: `docs/sns-shorts/tool-evaluation.md`（Task 1の成果物 → 使用ツール確認）
- Create: `docs/sns-shorts/rinka-grwm-01/clips/` ディレクトリ + 動画ファイル
- Update: `docs/sns-shorts/rinka-grwm-01/manifest.json`

- [ ] **Step 1: カット1-3 の動画変換**

  Task 1で決定したI2Vツール（Kling / Seedance 2.0）で:
  - `stills/01-hook.png` → `clips/01-hook.mp4`（2-3秒、微動: ポーズ維持、髪揺れ）
  - `stills/02-wakeup.png` → `clips/02-wakeup.mp4`（2-3秒、微動: 寝返り、目をこする）
  - `stills/03-skincare.png` → `clips/03-skincare.mp4`（2-3秒、微動: 手の動き）

- [ ] **Step 2: カット4-6 の動画変換**

  - `stills/04-base-makeup.png` → `clips/04-base-makeup.mp4`
  - `stills/05-point-makeup.png` → `clips/05-point-makeup.mp4`
  - `stills/06-hair.png` → `clips/06-hair.mp4`

- [ ] **Step 3: カット7-10 の動画変換**

  - `stills/07-outfit-select.png` → `clips/07-outfit-select.mp4`
  - `stills/08-dressed.png` → `clips/08-dressed.mp4`
  - `stills/09-accessory.png` → `clips/09-accessory.mp4`
  - `stills/10-departure.png` → `clips/10-departure.mp4`

- [ ] **Step 4: 品質ゲート（I2V変換後）**

  各クリップをチェック:
  | # | 顔歪み | 髪色維持 | 衣装維持 | 手指 | 判定 |
  |---|--------|---------|---------|------|------|
  | 1 | | | | | |
  | ... | | | | | |
  | 10 | | | | | |

  **判定:** 7/10合格 → Step 5へ。3本以上不合格 → Task 5B（フォールバック）へ。

- [ ] **Step 5: Seedance 2.0 レイヤー編集（必要時）**

  背景や照明のカット間不一致がある場合:
  - 背景を統一（下北沢アパート風のインテリアに差し替え）
  - 照明トーンを統一（暖色系朝の自然光）

- [ ] **Step 6: manifest.json を更新**

  各クリップのエントリを追加。

- [ ] **Step 7: コミット**

  ```bash
  git add docs/sns-shorts/rinka-grwm-01/manifest.json
  git commit -m "asset: RINKA GRWM video clips — 10 cuts converted"
  ```

---

## Task 5B: フォールバック — 静止画Reels（Task 5で不合格時のみ）

**目的:** I2V品質が基準未達の場合、静止画ベースのReelsを制作する。

- [ ] **Step 1: Ken Burns効果の設計**

  各カットに対して:
  - ズームイン/アウトの方向
  - パンの方向（左→右、上→下 etc.）
  - 尺（2-3秒/カット）

- [ ] **Step 2: CapCutで静止画Reels制作**

  - 10枚をインポート
  - 各カットにKen Burns効果を適用
  - テキストアニメーションを追加
  - トランジション（ジャンプカット or ディゾルブ）
  - 仮BGMでテンポ確認
  - 9:16で書き出し

- [ ] **Step 3: CEO確認 → Task 6へ**

---

## Task 6: 最終編集 + 書き出し

**目的:** 全クリップを結合し、テキスト・トランジションを加えてReels向け最終動画を完成させる。

**Files:**
- Read: `docs/sns-shorts/rinka-grwm-01/clips/`（Task 5の成果物）
- Read: `docs/sns-shorts/rinka-grwm-concept.md`（テキストオーバーレイ計画）
- Create: `docs/sns-shorts/rinka-grwm-01/final/rinka-grwm-01-reels.mp4`
- Update: `docs/sns-shorts/rinka-grwm-01/manifest.json`

- [ ] **Step 1: CapCutで編集**

  1. 10クリップを順番にタイムラインに配置
  2. トランジション適用（競合分析の最頻出パターンに従う）
  3. テキストオーバーレイを配置:
     - 0-2秒: 「古着屋バイトの日の支度」
     - 2-5秒: 「また寝坊した」
     - 20-24秒: 「今日はsacai の気分」
     - 29-30秒: 「@rinka.pink」
  4. 仮BGMを設定（テンポ確認用。最終はReelsのトレンド音源）
  5. カラーグレーディング統一（暖色系、軽いフィルム粒子）

- [ ] **Step 2: テンポ・尺の最終調整**

  - 総尺が15-30秒に収まっているか
  - フック（最初3秒）で目が止まるか
  - テンポが単調でないか（序盤ゆっくり→後半加速 etc.）

- [ ] **Step 3: 9:16で書き出し**

  - 解像度: 1080x1920
  - フォーマット: MP4 (H.264)
  - ビットレート: 10Mbps以上
  - 保存先: `final/rinka-grwm-01-reels.mp4`

- [ ] **Step 4: manifest.json を更新**

  最終動画のエントリを追加。

- [ ] **Step 5: CEO最終確認**

  品質チェック:
  - [ ] 人間のGRWM Reelsと並べて違和感がないか
  - [ ] テキストが読みやすいか
  - [ ] テンポが自然か
  - [ ] 「AIとわからない」レベルに達しているか
  - [ ] Instagram Reelsとして投稿できるクオリティか

  **ゲート:** CEO「投稿OK」→ Task 7へ。修正指示 → Step 1に戻る。

- [ ] **Step 6: コミット**

  ```bash
  git add docs/sns-shorts/rinka-grwm-01/manifest.json
  git commit -m "asset: RINKA GRWM final Reels video — ready for posting"
  ```

---

## Task 7: 横展開テンプレート化 + 振り返り

**目的:** 今回のプロセスをテンプレート化し、他モデル・他カテゴリへの横展開を容易にする。

**Files:**
- Create: `docs/sns-shorts/short-video-template.md`

- [ ] **Step 1: プロセスの振り返り**

  今回のパイプラインで:
  - うまくいったこと
  - ボトルネックだった工程
  - 品質で妥協した部分
  - 次回改善すべき点

- [ ] **Step 2: テンプレート作成**

  ```markdown
  # SNS Short Video Template

  ## 1. モデル選定 + カテゴリ決定
  - キャラバイブル参照: [path]
  - 発信カテゴリ: [GRWM/OOTD/ルーティン/紹介系/...]

  ## 2. 競合分析
  - 検索ワード: [...]
  - 分析項目: [フック/カット割り/テキスト/BGM/トランジション]

  ## 3. コンセプト + プロンプト設計
  - カット構成テーブル
  - 全カットのGeminiプロンプト（キャラ固定 + シーン固定 + 技術指定）

  ## 4. 静止画生成
  - 1カット2-3枚 → ベスト選定 → CEO確認

  ## 5. 動画変換
  - I2Vツール: [検証結果に基づく推奨]
  - 品質ゲート: 7/10合格で続行

  ## 6. 編集 + 書き出し
  - CapCut: テキスト + トランジション + カラグレ
  - 9:16 / 15-30秒
  - BGM: Reelsトレンド音源

  ## 7. 投稿
  - キャプション: [モデルのトーンで]
  - ハッシュタグ: [カテゴリ別推奨]
  - 投稿時間: [最適時間帯]
  ```

- [ ] **Step 3: 次の展開候補をリストアップ**

  RINKA GRWM の結果を踏まえて:
  - RINKA 2本目: ヴィンテージ紹介 or OOTD
  - RYO 1本目: ストリートスナップ or レコード掘り
  - 優先順位をCEOに提案

- [ ] **Step 4: コミット**

  ```bash
  git add docs/sns-shorts/short-video-template.md
  git commit -m "docs: SNS short video production template from RINKA GRWM learnings"
  ```

---

## 依存関係

```
Task 1 (ツール検証) ──┐
                      ├──→ Task 3 (コンセプト確定)
Task 2 (競合分析) ────┘          │
                                 ↓
                          Task 4 (静止画生成)
                                 │
                                 ↓
                          Task 5 (I2V変換)
                          or Task 5B (フォールバック)
                                 │
                                 ↓
                          Task 6 (最終編集)
                                 │
                                 ↓
                          Task 7 (テンプレート化)
```

**Task 1 と Task 2 は並行実行可能。**

---

## チェックポイント（CEOゲート）

| ポイント | タスク | 判断基準 |
|---------|--------|---------|
| CP1 | Task 1 完了後 | I2Vツールの品質が許容範囲か |
| CP2 | Task 3 完了後 | カット構成・プロンプト・テキストの承認 |
| CP3 | Task 4 完了後 | 静止画10枚の顔一貫性・衣装正確性 |
| CP4 | Task 5 完了後 | 動画クリップの品質（7/10合格） |
| CP5 | Task 6 完了後 | 最終動画の投稿可否判断 |

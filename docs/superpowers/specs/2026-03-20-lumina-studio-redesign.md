# Lumina Studio Redesign — Design Spec

## Overview

AIモデル着用画像生成アプリ。ファッションEC事業者向けに、商品画像からプロレベルのモデル着用写真を自動生成する。

**スコープ**: EC商品ページ・Web広告のクリエイティブ用途のみ。AIアート的な用途はスコープ外。

**ベンチマーク**: botika.com（画像品質・UXフロー）

## Product Strategy

LUMINA は2プロダクト構成:

- **LUMINA STUDIO**（このスペック）: 着用画像生成ツール。Rosterからモデル選択 → 商品画像生成
- **LUMINA AI MODEL Agency**（別プロダクト・別スペック）: ブランド専属AIモデルの生成・管理。SNS活用前提

Studio は将来的に Agency と連携し、クライアント専属モデルを Studio 内で利用可能にする。
本スペックでは Roster（事前用意モデル）のみ。

## Core User Flow

botika式。プロンプト不要。

```
1. 商品画像アップ → 2. モデル選択 → 3. 生成（ポーズ・背景は固定） → 4. ダウンロード
```

※ Step 3 の「設定」は初期リリースでは固定。ポーズ選択は将来追加。

## API Key Management

| ユーザー種別 | APIキー管理 |
|------------|-----------|
| toB（法人クライアント） | LUMINA側で管理。ユーザーはキーを意識しない |
| 一般ユーザー | ユーザー自身がGemini APIキーを入力 |

サービス層は `apiKey` をパラメータとして受け取る設計を維持。
呼び出し元（hooks）が toB/一般の切り分けを行い、適切なキーを注入する。

## UI Layout

**2カラム構成（botika寄り）**

- **左パネル**: ステップ入力。タブ切り替え（商品 / モデル）
- **右パネル**: 4枚グリッドプレビュー（Front / Back / Side / Bust-up）
- **下部バー**: Back / Generate ボタン

ステップはタブUIで切り替え。現在のステップがハイライトされ、完了済みステップにはチェックマーク表示。

## Generation Output

EC用マルチアングル一括出力:
- **Front（正面）**: アンカー画像。全てのベース
- **Back（背面）**: 同一モデルで後ろ姿
- **Side（横）**: 3/4アングル
- **Bust-up（バストアップ）**: Gemini で新規生成（クロップは解像度劣化のため不採用）

背景: **スタジオ背景**（固定）。ユーザーが必要なら Photoshop で背景変更可能。

解像度: 最低1024x1024、推奨2048以上
フォーマット: JPEG品質0.93以上 or PNG

## Architecture — Code Structure

### 現状の問題

| ファイル | 問題 |
|---------|------|
| `services/geminiService.ts` (~2,900行) | 分析・生成・品質チェック・編集が全部入り |
| `pages/NewGenerationPage.tsx` (~1,500行) | 20+ useState、UI・ロジック・API混在 |
| `types.ts` (~650行) | 全型定義が1ファイル |

### リファクタリング後の構造

```
services/
  garmentAnalyzer.ts    — 商品画像の分析（カテゴリ、色、素材、ディテール抽出）
  imageGenerator.ts     — Gemini 3 Pro Image による画像生成
  qualityChecker.ts     — QAスコアリング（85点合格ライン）
  geminiClient.ts       — Gemini API共通クライアント（APIキー管理含む）

hooks/
  useGenerationFlow.ts  — 生成フロー全体のステート管理（useReducer）
  useGarmentUpload.ts   — 商品画像アップロード + バリデーション

types/
  garment.ts            — GarmentAnalysis, GarmentCategory 等
  model.ts              — ModelProfile, ModelRoster 等
  generation.ts         — GenerationState, GenerationAction, PreviewResult 等
  common.ts             — 共通ユーティリティ型

pages/
  GenerationPage.tsx    — 薄いオーケストレーター。hooks に委譲

components/generation/
  GarmentUpload.tsx     — Step 1: 商品画像アップロード
  ModelSelector.tsx     — Step 2: モデル選択グリッド
  PreviewGrid.tsx       — 右パネル: 4枚グリッドプレビュー
  GenerateButton.tsx    — 生成ボタン + 進捗表示

data/
  modelRoster.ts        — AIモデルプロファイル（既存34体）
```

### 責務の分離原則

- **pages/**: hooks を呼び出すだけ。ビジネスロジックを持たない
- **hooks/**: ステート管理 + services の呼び出し。UIを知らない
- **services/**: API通信 + データ変換。ステートを持たない
- **components/**: props を受けて描画するだけ。API を直接呼ばない

## Generation State Machine

`useGenerationFlow` は useReducer で管理。

```
States:
  idle          — 初期状態。商品画像・モデル未選択
  ready         — 商品画像 + モデル選択済み。生成可能
  analyzing     — 商品画像を分析中
  generating    — 画像生成中（進捗: front → back/side/bust 並行）
  checking      — 品質チェック中
  retrying      — QA不合格の画像をリトライ中
  complete      — 全アングル生成完了
  error         — エラー発生

Transitions:
  idle → ready              : 商品画像 + モデル両方セット
  ready → analyzing         : Generate クリック
  analyzing → generating    : 分析完了
  generating → checking     : 全アングル生成完了
  checking → complete       : 全画像QA合格
  checking → retrying       : QA不合格あり（最大2回）
  retrying → checking       : リトライ生成完了
  retrying → complete       : リトライ上限到達（結果をそのまま表示）
  any → error               : API失敗・致命的エラー

State Data:
  {
    status: GenerationStatus,
    garmentImage: string | null,
    garmentAnalysis: GarmentAnalysis | null,
    selectedModel: ModelProfile | null,
    results: Map<AngleType, PreviewResult>,  // front, back, side, bust
    progress: { current: AngleType, total: 4 },
    error: { message: string, type: 'api' | 'quality' | 'input' } | null,
  }
```

## Error Handling

| エラー種別 | ユーザー表示 | 対応 |
|-----------|-----------|------|
| API rate limit (429) | 「混雑中です。少々お待ちください」 | 自動リトライ（exponential backoff、最大3回） |
| API failure (500等) | 「生成に失敗しました。再試行してください」 | 再試行ボタン表示 |
| QA全リトライ失敗 | 結果をそのまま表示 + 品質警告バッジ | ユーザーが判断 |
| 商品画像が不適切 | 「商品画像を確認してください」+ 具体的な理由 | 画像の撮り直し案内。改善しない場合はサポート問い合わせ |
| 部分的成功（4枚中一部失敗） | 成功分を表示 + 失敗分に再生成ボタン | 個別リトライ可能 |

サポート導線: エラー画面に「お問い合わせ」リンクを常設。商品画像起因の問題はサポートで対応。

## Generation Pipeline

Geminiベースの4ステップパイプライン。

```
Step 1: Analyze (Gemini 2.0 Flash)
  入力: 商品画像
  出力: GarmentAnalysis（カテゴリ、色、素材、ディテール）
  用途: Step 2 のプロンプト構築に使用

Step 2: Generate Front (Gemini 3 Pro Image Preview)
  入力: 商品画像 + GarmentAnalysis + ModelProfile
  出力: 正面着用画像（アンカー）
  備考: この画像が全アングルのベース

Step 3: Generate Back / Side / Bust (Gemini 3 Pro Image Preview)
  入力: Front画像（アンカー）+ 商品画像 + アングル指定
  出力: 各アングルの着用画像
  備考: Front画像をリファレンスとして渡し同一モデルの一貫性を保証。3枚並行生成。

Step 4: Quality Check (Gemini 2.0 Flash)
  入力: 各生成画像 + Front画像（アンカー比較用）
  出力: QualityScore（0-100）+ issues リスト
  判定: 85点以上で合格。未満は自動リトライ（最大2回）
  全リトライ失敗時: 結果をそのまま表示 + 品質警告バッジ
```

### コスト見積もり

| ステップ | API呼び出し | 単価 | 小計 |
|---------|-----------|------|------|
| Analyze | 1x Flash | ~$0.005 | $0.005 |
| Front | 1x Pro Image | ~$0.04 | $0.04 |
| Back/Side/Bust | 3x Pro Image | ~$0.04 | $0.12 |
| QA | 4x Flash | ~$0.005 | $0.02 |
| **合計（リトライなし）** | | | **~$0.19** |
| **合計（最大リトライ）** | +6x Pro + 6x Flash | | **~$0.52** |

### 品質チェック項目

| チェック項目 | 不合格時の減点 | ハードフェイル |
|------------|-------------|------------|
| 手の描画不良 | -20 | Yes |
| 撮影機材の写り込み | -15 | No |
| ガーメント向き異常 | -15 | Yes |
| AIっぽい肌 | -10 | No |
| 色の不整合 | -15 | No |
| 体型プロポーション異常 | -15 | No |
| 顔のブレ/歪み | -20 | Yes |
| 白飛び（素材ディテール消失）| -20 | Yes |
| フラットライティング | -15 | No |
| 素材感が見えない | -10 | No |

## Migration Strategy

### 削除するファイル
- `services/luminaApi.ts` — PreviewResult型だけ残して移植、他は削除
- `services/newShootMapping.ts` — 新アーキテクチャで不要
- `services/modelAgentService.ts` — Agency側のスコープ。Studio不要
- `services/upscaleService.ts` — 初期リリースではGemini出力をそのまま使用
- `services/creativeService.ts` — AIアートはスコープ外
- `components/new/ImageEditor.tsx` — スコープ外
- `components/new/TextOverlayModal.tsx` — スコープ外
- `components/new/GarmentDiagramSelector/` — スコープ外
- `components/new/steps/CustomModelPanel.tsx` — Agency側
- `data/skills/` — 初期リリースではスキルシステム不要（固定プリセット）

### 移植するファイル
- `services/geminiService.ts` → 分割して `services/garmentAnalyzer.ts`, `imageGenerator.ts`, `qualityChecker.ts`, `geminiClient.ts` へ
- `types.ts` → 分割して `types/garment.ts`, `types/model.ts`, `types/generation.ts`, `types/common.ts` へ
- `data/modelRoster.ts` — そのまま維持
- `public/models/` — そのまま維持

### 手順
1. 新ファイル構造を作成（空ファイル）
2. geminiService.ts から関数を新ファイルに移植
3. types.ts から型を新ファイルに移植
4. 新 hooks を作成（useGenerationFlow, useGarmentUpload）
5. 新 components を作成（2カラムUI）
6. 新 GenerationPage を作成（hooks 呼び出しのみ）
7. 旧ファイルを削除
8. ビルド確認 + 動作確認

## Tech Stack

- **Frontend**: React 19 / TypeScript / Vite / Tailwind CSS
- **AI Engine**: Gemini（分析: 2.0 Flash, 生成: 3 Pro Image Preview）
- **Deploy**: Vercel
- **State Management**: React hooks（useReducer で生成フロー管理）

## Not In Scope (Initial Release)

- クリエイティブAIアート生成
- 背景カスタマイズ（スタジオ背景固定。ユーザーが必要なら Photoshop で変更）
- ポーズ選択（初期は固定。将来追加）
- 動画リール生成
- カスタムAIモデル生成（→ LUMINA AI MODEL Agency 側のスコープ）
- Human QA レイヤー
- バッチ処理（複数商品の一括処理）

## Success Criteria

1. botika.com のギャラリー画像と並べて遜色ないレベルの画像品質
2. 5種類のガーメント（白Tシャツ、黒ジャケット、柄物ワンピース、デニム、ニット）で社長OK
3. 商品画像アップ → 4枚生成完了まで3分以内
4. ビルドエラー0件、主要フローの動作確認完了

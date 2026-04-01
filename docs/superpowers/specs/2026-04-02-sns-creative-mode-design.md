# LUMINA Studio — SNS Creative Mode Design Spec

## Overview

LUMINA StudioにSNSクリエイティブ生成モードを追加する。現行のEC撮影（白背景4角度）に加え、エディトリアル・キャンペーン・ストリート・シュルレアリスムの4カテゴリでSNS/広告用画像を生成する。

## Goals

- EC事業者のSNS投稿・キャンペーン用クリエイティブの撮影コストを削減
- AIとわからないレベルのフォトリアル（Editorial/Campaign/Street）
- AIだからこそできる非現実世界観（Surreal）
- 既存のモデル一貫性・衣服忠実度パイプラインを流用し、品質を担保

## Non-Goals

- 動画生成（Phase 3）
- ブランドスタイル学習/Brand Kit（Phase 3）
- Generative Resize / AI outpainting（Phase 2）
- バッチ処理 / 大量一括生成

## UI Structure

### Mode Toggle

ヘッダー直下またはStepTabs内に2モードトグルを配置:

```
[EC撮影] [SNSクリエイティブ]
```

- EC撮影: 現行のまま（アップロード → モデル → 生成 → 4角度グリッド）
- SNSクリエイティブ: 新規フロー

### SNS Creative Flow (Left Panel)

```
Step 1: Garment（現行GarmentUploadをそのまま流用）
Step 2: Model（現行ModelSelectorをそのまま流用）
Step 3: Scene（新規）
  ├── カテゴリ選択（4カテゴリタブ）
  ├── プリセット選択（サムネイルグリッド）
  ├── カスタムプロンプト入力（Surrealカテゴリ or 任意プリセット選択後）
  └── アスペクト比選択（4:5 / 1:1 / 9:16 / 16:9）
Step 4: Generate
```

### Scene Selection UI

カテゴリはタブ切替。各カテゴリ内でプリセットをサムネイルグリッド表示:

```
[Editorial] [Campaign] [Street] [Surreal]
┌──────┐ ┌──────┐ ┌──────┐
│POPEYE│ │FUDGE │ │Numero│ ...
│ (img)│ │ (img)│ │ (img)│
└──────┘ └──────┘ └──────┘

[ カスタムプロンプト入力欄（任意） ]
```

プリセット選択後、プロンプト追記が可能（例: 「POPEYE風 + 古着屋の店内」）。

### Aspect Ratio Selector

シーン選択の下部に横並びボタン:

```
[4:5] [1:1] [9:16] [16:9]
  IG    汎用  Story  Banner
```

デフォルト: 4:5（Instagram Feed）

### Output (Right Panel)

2x2グリッドで4バリエーションを表示（EC側の4角度グリッドと同じPreviewGrid構造を流用）:

```
┌──────────┐ ┌──────────┐
│ Var. 1   │ │ Var. 2   │
│          │ │          │
└──────────┘ └──────────┘
┌──────────┐ ┌──────────┐
│ Var. 3   │ │ Var. 4   │
│          │ │          │
└──────────┘ └──────────┘
[4枚をZIPダウンロード]
```

各バリエーションに個別DLボタン。完成2枚以上でZIP DL。

## Scene Presets

### Editorial

| ID | Name | Direction |
|----|------|-----------|
| `editorial-popeye` | POPEYE | 自然光、シティボーイ、日常感、余白多め、カジュアルポーズ |
| `editorial-fudge` | FUDGE | ソフトライト、ガーリー/ボーイッシュ、生活の中のファッション |
| `editorial-numero` | Numero | ハイファッション、ドラマティック、アート寄り、強いポーズ |
| `editorial-brutus` | BRUTUS | カルチャー×ファッション、知的、日本的美意識 |
| `editorial-id` | i-D | ユースカルチャー、エッジ、片目ウインク、反骨精神 |

### Campaign

| ID | Name | Direction |
|----|------|-----------|
| `campaign-minimal` | Minimal | 白/グレー背景、影強調、プロダクトフォーカス、COS/MUJI的 |
| `campaign-seasonal` | Seasonal | 季節の空気感（桜/海/紅葉/雪）、自然光、開放感 |
| `campaign-luxury` | Luxury | ダークトーン、ドラマティックライティング、高級感、Bottega的 |
| `campaign-sport` | Sport | 動的ポーズ、鮮やかなカラー、エネルギー、Nike/adidas的 |

### Street

| ID | Name | Direction |
|----|------|-----------|
| `street-tokyo` | Tokyo | 裏原/渋谷/下北沢、ネオン、雑多な街並み、リアル |
| `street-ny` | New York | ブルックリン/SoHo、ブリック壁、消火栓、都市のテクスチャ |
| `street-paris` | Paris | カフェテラス、石畳、アイアンバルコニー、エレガント |
| `street-london` | London | ブリティッシュ、赤電話ボックス、曇天、パンクミックス |

### Surreal

| ID | Name | Direction |
|----|------|-----------|
| `surreal-timwalker` | Tim Walker | 夢幻、巨大オブジェ、パステル、ファンタジー |
| `surreal-pierretgilles` | Pierre et Gilles | ハイパーリアル、キッチュ、光輪、彩色過多 |
| `surreal-guybourdin` | Guy Bourdin | 鮮烈な色彩、シュール、セクシー、不穏 |
| `surreal-erikheck` | Erik Madigan Heck | 絵画的、花、テキスタイル背景、色彩爆発 |
| `surreal-custom` | Custom | フリープロンプト入力。ユーザーが自由に世界観を記述 |

## Technical Architecture

### New Types

```typescript
// types/generation.ts に追加

export type ShootMode = 'ec-standard' | 'sns-creative';

export type SceneCategory = 'editorial' | 'campaign' | 'street' | 'surreal';

export type AspectRatio = '4:5' | '1:1' | '9:16' | '16:9';

export type VariationType = 'var1' | 'var2' | 'var3' | 'var4';

/** Union key for both EC angles and SNS variations */
export type ResultKey = AngleType | VariationType;

export interface ScenePreset {
  id: string;
  name: string;
  category: SceneCategory;
  direction: string;       // プロンプトに注入する撮影ディレクション
  thumbnail: string;       // プリセット選択UIのサムネイル画像パス（必須。Phase 1はプレースホルダーCSS gradient）
}

export interface SNSCreativeConfig {
  scene: ScenePreset;
  customPrompt?: string;   // プリセットへの追記 or Surreal Custom用
  aspectRatio: AspectRatio;
}

// GenerationState の results を拡張:
// EC mode:  Record<AngleType, PreviewResult>  (front/back/side/bust)
// SNS mode: Record<VariationType, PreviewResult> (var1/var2/var3/var4)
// → results: Record<ResultKey, PreviewResult> に変更
// → progress.total は ShootMode に関わらず 4 固定（変更不要）
```

### Generation Pipeline Changes

```
EC撮影（現行）:
  analyzeOutfit → QA → styling/hair/fitting → generateFront → generateAngle×3

SNSクリエイティブ（新規）:
  analyzeOutfit → QA → styling/hair/fitting → generateSNSCreative×4（2並列×2バッチ）
```

- `generateSNSCreative`: 新関数。シーンプリセットのdirectionをプロンプトに注入
- **並列実行は2枚ずつ**（Gemini API rate limit対策）: [var1,var2]並列 → [var3,var4]並列
- temperatureは `GEN_CONFIG.SNS_TEMPERATURE = 0.6` として定数化（EC用0.4とは分離）
- モデル参照画像・衣服解析結果は共通で渡す

### Variation Differentiation

4バリエーションは**カメラ/構図を明示的に変える**（temperatureだけに依存しない）:

| Variation | Camera | Composition | Purpose |
|-----------|--------|-------------|---------|
| var1 | Full body, eye-level | Center subject, breathing room | Standard — 最も汎用的 |
| var2 | 3/4 body, slightly low angle | Off-center, rule of thirds | Dynamic — 脚長効果 |
| var3 | Medium shot (waist up) | Tight crop, face focus | Portrait — IG向け |
| var4 | Full body, wide environmental | Subject small in scene | Context — 世界観重視 |

各バリエーションのカメラ指示はプロンプトに直接注入する。

### Error Handling & Partial Failure

- 4バリエーションは `Promise.allSettled` で処理（EC modeと同じパターン）
- 個別バリエーションの失敗: エラー表示 + 個別リトライボタン
- 成功2枚以上でZIP DL可能
- 全4枚失敗時: エラーメッセージ + 全体リトライボタン
- rate limit (429) エラー時: `callWithRetry` の既存バックオフ（1s→2s→4s）で自動リトライ

### QA Pipeline (SNS Mode)

- **Analysis QA**: EC modeと共通（`verifyAnalysis`）。衣服解析の正確性は撮影スタイルに依存しない
- **Generation QA**: SNS modeでは**スキップ**。理由:
  - EC mode QAの基準（shadow ratio 1:2.5-1:3等）はSNSのスタイライズドライティングに適用不可
  - 4バリエーション x QA = 追加4 API call（コスト倍増）
  - 代わりにユーザーが4枚から選択する = 人間QA
- **Styling/Hair/Makeup Agent**: EC modeと共通で実行。ただしSNS modeではポーズ指示をバリエーション別カメラ指示で上書き

### New Files

| File | Purpose |
|------|---------|
| `data/scenePresets.ts` | 全プリセット定義（ID, name, category, direction, thumbnail） |
| `services/snsGenerator.ts` | `generateSNSCreative()` — シーンベース生成関数 |
| `components/generation/SceneSelector.tsx` | カテゴリタブ + プリセットグリッド + カスタムプロンプト + アスペクト比 |
| `components/generation/ModeToggle.tsx` | EC撮影 / SNSクリエイティブ トグル |

### Modified Files

| File | Change |
|------|--------|
| `types/generation.ts` | ShootMode, SceneCategory, AspectRatio, VariationType, ResultKey, SNSCreativeConfig 型追加。GenerationState.results を `Record<ResultKey, PreviewResult>` に拡張 |
| `hooks/useGenerationFlow.ts` | ShootMode分岐追加、SNSモード時はgenerateSNSCreative×4を2並列×2バッチ実行 |
| `pages/GenerationPage.tsx` | ModeToggle配置、SNSモード時のStep追加（Scene）、PreviewGrid切替 |
| `components/generation/PreviewGrid.tsx` | SNSモード時のラベル変更（Var.1〜4）、アスペクト比に応じたグリッドレイアウト |
| `components/generation/StepTabs.tsx` | SNSモード時のステップ追加（Scene） |
| `services/geminiClient.ts` | `GEN_CONFIG.SNS_TEMPERATURE = 0.6` 追加 |

### Prompt Structure (generateSNSCreative)

```
Professional fashion photography. {preset.direction}

MODEL IDENTITY (LOCKED — use the EXACT person shown in the model reference photos):
{modelDesc}

OUTFIT (match garment reference images EXACTLY):
{outfitDesc}

SCENE DIRECTION:
{preset.direction}
{customPrompt if provided}

CAMERA & COMPOSITION (this variation):
{variationCamera[n]} — e.g. "Full body shot, eye-level camera, subject centered with breathing room above and below"

PHOTOGRAPHY:
- Output image MUST be {aspectRatio} aspect ratio ({pixelWidth}x{pixelHeight})
- Photorealistic, indistinguishable from real photography
- {lighting direction derived from preset}
- Model must be naturally integrated into the scene — matching scene lighting, perspective, and depth of field
- Garment colors, materials, patterns must match reference exactly

ABSOLUTE PROHIBITIONS:
- DO NOT add logos, text, graphics, prints, branding not in reference images
- DO NOT hallucinate brand names, tags, labels, decoration
- DO NOT render back-side elements (neck tags, care labels) on visible surfaces
- If a detail is not in the reference photo, it does not exist
```

### Aspect Ratio to Pixel Mapping

| Ratio | Pixels | Use Case |
|-------|--------|----------|
| 4:5 | 1024x1280 | Instagram Feed |
| 1:1 | 1024x1024 | X / Generic |
| 9:16 | 1024x1820 | Instagram Story / Reels |
| 16:9 | 1820x1024 | X / YouTube / Banner |

Note: 全サイズ1024ベース。Gemini APIの推奨解像度に準拠。

### Cost Estimate

| Item | Cost | Notes |
|------|------|-------|
| 衣服解析 (Gemini Flash) | ~$0.005/slot | EC modeと共通 |
| Analysis QA | ~$0.005/slot | EC modeと共通 |
| Styling + Hair/Makeup + Fitting | ~$0.015 | 3 Flash calls |
| **SNS生成 x4** | **$0.08-0.20** | 4x proImage calls |
| Generation QA | $0 | SNS modeではスキップ |
| **合計/1生成** | **~$0.11-0.23** | EC mode（~$0.13-0.25）と同等 |

月間想定: Starterプラン（5枚SNS/月）= ~$0.55-1.15追加。Proプラン（30枚）= ~$3.3-6.9追加。予算内。

### Credit Consumption

1回のSNS生成（4バリエーション）= **1クレジット消費**。
理由: EC生成（4角度）も1クレジット。ユーザーにとっては「1回の撮影」単位。

### Custom Prompt Guardrails (Surreal Custom)

- 最大文字数: 500文字
- プロンプトインジェクション対策: ユーザー入力は `{customPrompt}` としてSCENE DIRECTIONセクションにのみ注入。システムプロンプト（MODEL IDENTITY, PROHIBITIONS等）は上書き不可
- 禁止パターン: "ignore previous", "system prompt", "you are" 等のインジェクション試行をクライアント側でフィルタ
- NSFW/暴力的なコンテンツ: Gemini APIのSafety Filterに依存（追加フィルタは不要）

### Preset Thumbnails (Phase 1)

Phase 1ではプリセットサムネイルにCSSグラデーション+テキストラベルを使用:
- Editorial: 暖色系グラデーション
- Campaign: モノトーン系グラデーション
- Street: 都市的グレー系グラデーション
- Surreal: 紫〜ピンク系グラデーション

Phase 1.5でLumina自身を使ってプリセットサムネイル画像を生成し差し替え。

### Responsive / Aspect Ratio Grid

PreviewGridはSNS mode時、選択されたアスペクト比に応じてセルのaspect-ratioを動的に変更:
- 4:5 → `aspect-[4/5]`
- 1:1 → `aspect-square`
- 9:16 → `aspect-[9/16]`（セルが縦長になるため、1列2行のレイアウトに切替）
- 16:9 → `aspect-video`（セルが横長になるため、1列4行のレイアウトに切替）

## Shared Infrastructure (EC/SNS Common)

- GarmentUpload component — identical
- ModelSelector component — identical
- garmentAnalyzer.ts — identical
- qualityAgent.ts (verifyAnalysis, styling, hairMakeup, fitting) — identical
- geminiClient.ts — identical (+ SNS_TEMPERATURE追加)
- Model reference image loading — identical

## Quality Requirements

- Editorial/Campaign/Street: AIとわからないレベルのフォトリアル
- Surreal: アート表現として成立する品質
- 衣服の色・素材・パターンの忠実度はECモードと同等
- モデルの顔一貫性はECモードと同等
- temperature 0.6はCEO承認済み（Council 2026-04-01で決定）

## Out of Scope (Phase 2+)

- Generative Resize（EC画像→SNSサイズへのAI拡張）
- アスペクト比の動的追加
- Street/Campaignの追加プリセット
- ブランドスタイル学習 / Brand Kit
- 動画生成
- バッチ処理
- プリセットサムネイル画像の生成（Phase 1.5）

# LUMINA VIDEO STUDIO — 設計書

> **ステータス**: 設計承認済み（2026-04-09 CEO承認）
> **フェーズA**: 内部ツール（KOZUKI + エージェントがSNS動画を量産）
> **フェーズB**: SaaS化（EC事業者が商品PR動画を作成）— 実績後に開放

---

## 1. 概要

### 何を作るか
AIモデルの動画コンテンツを生成するツール。静止画生成 → I2V動画変換 → ナレーション生成の3ステップパイプライン。

### 誰が使うか
- **フェーズA**: KOZUKI + エージェント（LUMINA MODEL AGENCYのSNSコンテンツ量産）
- **フェーズB**: EC事業者（商品PR動画の自動生成SaaS）

### どこに置くか
既存の lumina-model-agency アプリに `/video` ルートとして追加。

### 絶対原則
**既存コードに一切触らない。** 完全に独立したモジュールとして追加する。

---

## 2. アーキテクチャ

### ルーティング

```
既存（変更なし）:
  /          → AgencyPage（モデルポートフォリオ）
  /studio    → GenerationPage（EC画像生成）
  /login     → LoginPage
  /pricing   → PricingPage
  /terms, /privacy, /legal → 各ページ

追加:
  /video     → VideoStudioPage（動画生成 — 認証必須）
```

### 分離戦略
- 新ページ: `pages/VideoStudioPage.tsx`
- 新サービス群: `services/video/` ディレクトリ
- 新コンポーネント: `components/video/` ディレクトリ
- 新データ: `data/video/` ディレクトリ
- 新型定義: `types/video.ts`
- 新hook: `hooks/useVideoPipeline.ts`

**既存の geminiClient.ts, imageGenerator.ts, garmentAnalyzer.ts, qualityAgent.ts は一切変更しない。**

---

## 3. 動画生成パイプライン

### 3ステップ直列パイプライン

```
Step 1: 静止画生成（Gemini）
  入力: モデル選択 + シーン指示 + 衣装画像(optional)
  出力: 高品質静止画 1枚
  実装: services/video/stillGenerator.ts（既存imageGeneratorの薄いラッパー）
  ※ 既存コードを「参照」するが「変更」しない

Step 2: I2V動画変換（Replicate → Kling v2.1）
  入力: Step1の静止画 + モーション指示
  出力: 5秒動画クリップ (.mp4)
  API: Replicate (kwaivgi/kling-v2.1-standard)
  実装: services/video/klingService.ts
  ※ 中国企業直アクセス回避のためReplicate経由
  ※ 非同期: POST → ポーリング → 完了

Step 3: ナレーション生成（ElevenLabs）
  入力: テキスト + ボイスID
  出力: 音声ファイル (.mp3)
  API: ElevenLabs TTS (eleven_multilingual_v2)
  実装: services/video/elevenlabsService.ts
  ※ モデルごとにボイスを紐付け
```

### 実行モード
各ステップは独立実行可能:
- **静止画のみ**: Step 1だけ
- **動画のみ**: Step 1 + 2
- **フルパッケージ**: Step 1 + 2 + 3

### 最終編集
- **フェーズA**: CapCut手動編集（静止画 + 動画クリップ + 音声を手動合成）
- **フェーズB**: FFmpeg自動合成を検討

---

## 4. API設計

### 環境変数（追加）
```
VITE_REPLICATE_API_TOKEN  — Replicate APIトークン
VITE_ELEVENLABS_API_KEY   — ElevenLabs APIキー
```
※ 既存のVITE_GEMINI_API_KEY等は変更なし
※ Phase 2でサーバーサイドプロキシ化する（既存課題と同じ）

### API呼び出し

```
Replicate:
  POST https://api.replicate.com/v1/predictions     → I2V生成開始
  GET  https://api.replicate.com/v1/predictions/{id} → ステータスポーリング

ElevenLabs:
  POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
```

---

## 5. サービスファイル構成

```
services/video/
  replicateClient.ts    — Replicate API共通クライアント（認証・ポーリング）
  klingService.ts       — Kling v2.1 I2V固有ロジック（モデル指定・パラメータ）
  elevenlabsService.ts  — ElevenLabs TTS（ボイス選択・音声生成）
  stillGenerator.ts     — Gemini静止画生成（既存imageGeneratorの薄いラッパー）
  pipeline.ts           — 3ステップオーケストレーション（状態管理・エラーハンドリング）
```

---

## 6. UI設計

### レイアウト（/video）

```
┌─────────────────────────────────────────────────┐
│  LUMINA VIDEO STUDIO                        [←] │
├──────────────┬──────────────────────────────────┤
│              │                                  │
│  モデル選択   │   プレビューエリア                │
│  (グリッド)   │   (静止画 → 動画プレビュー)       │
│              │                                  │
│  シーン設定   │                                  │
│  - プリセット │                                  │
│  - カスタム   │                                  │
│              │                                  │
│  モーション   │   パイプラインステータス           │
│  - 歩く      │   Step 1: ✅ 静止画生成           │
│  - 振り向く   │   Step 2: ⏳ I2V変換中...        │
│  - ポーズ    │   Step 3: ○ ナレーション          │
│              │                                  │
│  ナレーション │                                  │
│  - テキスト   │                                  │
│  - ボイス選択 │                                  │
│              │                                  │
│  [生成開始]   │   [ダウンロード]                  │
└──────────────┴──────────────────────────────────┘
```

### デザインルール
- ダークテーマ（既存と統一: bg-[#050508], text-gray-100）
- Tailwind CSS CDN版（既存と同じ）
- アクセントカラー: シアンブルー #00D4FF（既存と統一）
- 角丸: 8-12px、ボーダーで区切り（既存と統一）

### コンポーネント分割

```
components/video/
  ModelSelector.tsx     — モデル選択グリッド（既存agencyModelsデータを参照）
  SceneConfigurator.tsx — シーン設定UI（プリセット + カスタム入力）
  MotionSelector.tsx    — モーションプリセット選択
  NarrationInput.tsx    — ナレーションテキスト + ボイス選択
  PreviewPanel.tsx      — 静止画/動画プレビュー表示
  PipelineStatus.tsx    — 3ステップ進捗表示
```

---

## 7. データ設計

### 既存データ（参照のみ、変更なし）
- `data/agencyModels.ts` — モデル定義（15体v2 + 8体legacy）

### 新規データ

```typescript
// data/video/voiceMap.ts
export const voiceMap: Record<string, { voiceId: string; name: string; lang: string }> = {
  'rinka': { voiceId: 'xxx', name: 'Rin', lang: 'ja' },
  // 他モデルは順次追加。未設定モデルはUI上「ボイス未設定」表示
};

// data/video/motionPresets.ts
export const motionPresets = [
  { id: 'walk', label: 'Walk', prompt: 'walking slowly towards camera' },
  { id: 'turn', label: 'Turn', prompt: 'slowly turning head to look at camera' },
  { id: 'pose', label: 'Pose', prompt: 'striking a fashion pose' },
  { id: 'grwm', label: 'GRWM', prompt: 'getting ready, natural movements' },
  { id: 'custom', label: 'Custom', prompt: '' },
];

// data/video/scenePresets.ts
export const scenePresets = [
  { id: 'grwm', label: 'GRWM', description: '朝の準備シーン' },
  { id: 'lookbook', label: 'Lookbook', description: 'ファッションルックブック' },
  { id: 'product', label: 'Product', description: '商品PR' },
  { id: 'editorial', label: 'Editorial', description: 'エディトリアル' },
  { id: 'custom', label: 'Custom', description: 'カスタムシーン' },
];
```

---

## 8. 型定義

```typescript
// types/video.ts

export type PipelineStep = 'still' | 'i2v' | 'narration';
export type StepStatus = 'idle' | 'running' | 'done' | 'error';

export interface VideoPipelineState {
  currentStep: PipelineStep | null;
  steps: {
    still: { status: StepStatus; result?: string; error?: string };   // base64 or URL
    i2v: { status: StepStatus; result?: string; error?: string };     // video URL
    narration: { status: StepStatus; result?: string; error?: string }; // audio URL
  };
}

export interface VideoGenerationRequest {
  modelId: string;
  scene: {
    presetId: string;
    customPrompt?: string;
  };
  motion: {
    presetId: string;
    customPrompt?: string;
  };
  narration?: {
    text: string;
    voiceId: string;
  };
  garmentImage?: File; // optional衣装画像
}

export interface VideoGenerationResult {
  stillImage: string;      // base64 or URL
  videoUrl?: string;       // mp4 URL (Step 2完了時)
  audioUrl?: string;       // mp3 URL (Step 3完了時)
  metadata: {
    modelId: string;
    duration: number;      // seconds
    resolution: string;
    generatedAt: string;   // ISO date
  };
}
```

---

## 9. ファイル一覧と影響範囲

### 新規作成（17ファイル）
```
pages/VideoStudioPage.tsx
components/video/ModelSelector.tsx
components/video/SceneConfigurator.tsx
components/video/MotionSelector.tsx
components/video/NarrationInput.tsx
components/video/PreviewPanel.tsx
components/video/PipelineStatus.tsx
services/video/replicateClient.ts
services/video/klingService.ts
services/video/elevenlabsService.ts
services/video/stillGenerator.ts
services/video/pipeline.ts
data/video/voiceMap.ts
data/video/motionPresets.ts
data/video/scenePresets.ts
types/video.ts
hooks/useVideoPipeline.ts
```

### 既存変更（1ファイル、1行のみ）
```
App.tsx — /video ルート追加（1行）:
  <Route path="/video" element={<ProtectedRoute><VideoStudioPage /></ProtectedRoute>} />
```

### 影響範囲: isolated
既存のStudio機能、Agency機能、認証、決済には一切影響なし。

---

## 10. コスト見積もり

| API | 1回あたり | 月間見込み（フェーズA: 月50本） |
|-----|----------|-------------------------------|
| Gemini静止画 | ~$0.03 | ~$1.50 |
| Replicate Kling v2.1 | ~$0.10-0.30 | ~$5-15 |
| ElevenLabs TTS | ~$0.01-0.05 | ~$0.50-2.50 |
| **合計** | ~$0.14-0.38/本 | **~$7-19/月** |

※ フェーズA（内部利用）では月$20以下に収まる見込み

---

## 11. 実装順序

```
Phase 1: 基盤（1セッション）
  1. types/video.ts — 型定義
  2. services/video/ — 全サービスファイル
  3. data/video/ — プリセット・マッピング
  4. hooks/useVideoPipeline.ts — パイプラインhook

Phase 2: UI（1セッション）
  1. components/video/ — 全コンポーネント
  2. pages/VideoStudioPage.tsx — メインページ
  3. App.tsx — /video ルート追加（1行）

Phase 3: 検証（1セッション）
  1. RINKAモデルでE2Eテスト
  2. 静止画のみ → 動画のみ → フル の各モード確認
  3. ビルド確認（npm run build）
```

---

## 12. リスクと対策

| リスク | 対策 |
|--------|------|
| Replicate APIの応答遅延 | ポーリング + タイムアウト（5分） + キャンセル機能 |
| Kling v2.1の品質ばらつき | モーションプリセットを厳選。品質が低いプリセットは除外 |
| APIキーのクライアント露出 | Phase 2でサーバーサイドプロキシ化（既存課題と同じスケジュール） |
| 既存機能への影響 | 完全分離設計。既存ファイルへの変更はApp.tsxの1行のみ |

---

## 変更履歴

| 日付 | 変更者 | 内容 |
|------|--------|------|
| 2026-04-09 | CEO + Claude | 初版作成。ブレスト→設計承認 |

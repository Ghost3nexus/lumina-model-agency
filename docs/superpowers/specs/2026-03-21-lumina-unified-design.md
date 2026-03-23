# LUMINA 統合設計 — Agency × Studio

## Overview

LUMINA は「AIモデルエージェンシー × 着用画像生成ツール」を統合した1プロダクト。ブランディング上は2つの名前を使い分ける。

- **LUMINA MODEL AGENCY** — 集客・話題性・SNS。「AIモデル事務所」としてブランドにリーチ
- **LUMINA STUDIO** — 実務ツール。Agencyのモデルを使って商品着用画像を生成

プロダクトは1つ。アカウントは1つ。課金は統合。

## ベンチマーク

- **botika.com** — 画像生成品質・ワークフロー
- **imma / Lil Miquela** — バーチャルヒューマンの到達点（Phase 3目標）
- **リアルのモデル事務所** — ビジネスモデル・カテゴリ構成

## ビジネスモデル

SaaSパッケージ型:
- 月額プラン: モデル指名し放題 + 月○枚生成
- オプション: ブランド専属AIモデル制作（別途費用）

```
ユーザーフロー:
  LUMINA MODEL AGENCY（LP/SNS）で認知
    → モデル一覧を見て「この子使いたい」
    → LUMINA にサインアップ
    → STUDIO でモデルを指名して着用画像生成
    → 月額プランで継続利用
```

## AIモデル設計

### カテゴリ構成

```
LUMINA MODEL AGENCY
├─ LADIES
│   ├─ ASIA（3体以上）
│   └─ INTERNATIONAL（3体以上）
└─ MEN
    ├─ ASIA（2体以上）
    └─ INTERNATIONAL（2体以上）

合計: 10体以上（MVP）
```

### モデルデータ構造

```typescript
interface AIModel {
  // Identity
  id: string;                    // e.g. "lumina_yuki_001"
  name: string;                  // e.g. "Yuki"
  category: 'ladies_asia' | 'ladies_international' | 'men_asia' | 'men_international';

  // Face Consistency（最重要）
  faceId: string;                // EcomID/InstantID 顔ID特徴量
  referenceImages: {             // 一貫性担保用リファレンス（5枚以上）
    front: string;               // 正面
    threeQuarter: string;        // 斜め
    side: string;                // 横
    smiling: string;             // 笑顔
    cool: string;                // クール表情
    [key: string]: string;       // 追加バリエーション
  };

  // Physical Profile（コンポジット情報）
  height: number;                // cm
  measurements: {
    bust: number;
    waist: number;
    hips: number;
  };
  shoeSize: number;              // cm
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  skinTone: string;
  bodyType: string;              // slim | athletic | average | curvy

  // Modeling Profile
  age: string;                   // "20s" | "late 20s" etc.
  vibe: string;                  // "editorial cool" | "commercial friendly" etc.
  strengths: string[];           // ["high fashion", "streetwear", "commercial"]

  // Phase 2: Persona
  personality?: string;
  lifestyle?: string;
  interests?: string[];
  snsAccounts?: {
    instagram?: string;
    x?: string;
    tiktok?: string;
  };

  // Metadata
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'development';
}
```

### モデル生成プロセス

```
Step 1: 顔の設計
  - AI完全生成（実在しない顔）
  - 実在モデルの特徴をミックスして魅力的な顔を作る
  - 例: モデルA（目元）× モデルB（輪郭）× 独自調整

Step 2: リファレンス画像セット生成
  - EcomID / InstantID で顔IDを確立
  - 5枚以上のバリエーション（角度・表情）を生成
  - 全画像で同一人物と認識できることを検証

Step 3: プロフィール設定
  - 名前、身体情報、テイスト設定
  - コンポジットカード（宣材）作成

Step 4: Studio連携テスト
  - 実際の商品画像で着用画像を生成
  - 顔の一貫性を検証（複数商品・複数アングル）
  - 品質基準クリアを確認
```

## Studio 連携設計

### ユーザーフロー

```
1. モデル選択（Agencyから指名）
   └─ カテゴリ（Ladies Asia / Men International 等）でフィルタ
   └─ モデルカード: コンポジット情報 + リファレンス写真

2. 商品画像アップロード（カテゴリ別スロット）
   ├─ 必須: トップス/アウター + パンツ/スカート （or ドレス単体）
   ├─ 任意: インナー, 靴, アイウェア, ヘッドギア, アクセサリー
   └─ 主役アイテム指定（★マーク）

3. 生成
   └─ 4アングル一括: Front / Back / Side / Bust-up
   └─ 主役アイテムに応じたスタイリングルール自動適用

4. ダウンロード
```

### 生成パイプライン（Agency対応版）

```
Step 1: Analyze（Gemini Flash）
  入力: 商品画像（複数スロット）
  出力: アイテム別分析 + コーデ全体分析 + 不足アイテム提案

Step 2: Generate Front（Gemini Pro Image + EcomID/InstantID）
  入力: 商品画像 + 分析結果 + AIModel（faceId + リファレンス画像）+ スタイリングルール
  出力: 正面着用画像（アンカー）
  顔一貫性: faceId特徴量を注入して同一人物を保証

Step 3: Generate Back / Side / Bust（並行）
  入力: Front画像 + 商品画像 + AIModel + アングル指定
  出力: 各アングル着用画像
  顔一貫性: 同じfaceIdで保証

Step 4: Quality Check（Gemini Flash）
  入力: 各画像 + Front（アンカー比較）
  出力: スコア + issues
  追加チェック: 顔一貫性スコア（リファレンスとの類似度）
```

### スタイリングルール

主役アイテムに応じて着こなしが自動で変わる:

| 主役 | ルール |
|------|--------|
| トップス | そのまま着用。タックインしない。ボタンそのまま |
| パンツ | ウエスト・股上を見せる。トップスはタックインまたは短め |
| アウター | 前を閉めて着用。シルエットを見せる |
| ドレス | ネックラインからヘムまで見せる。重ね着で隠さない |
| スカート | ウエスト見せる。トップスはタックイン |

補助アイテムは主役を引き立てるスタイリング:
- アウター（補助）→ 前を開けて中を見せる
- トップス（補助）→ シンプルに。主役を邪魔しない

## 顔一貫性技術

### 要件
- **完全一貫性（レベルC）**: SNSで毎日投稿しても同一人物に見える
- これがLUMINAの技術的な核。妥協しない

### 技術候補

| 技術 | 概要 | 精度 | コスト |
|------|------|------|--------|
| EcomID（Alibaba） | SDXL + PuLID IP-Adapter | 高 | API依存 |
| InstantID | 顔1枚から一貫バリエーション | 高 | fal.ai ~$0.03/枚 |
| IPAdapter FaceID | 顔特徴量注入 | 中〜高 | Replicate ~$0.05/枚 |

### 統合方式

```
モデル登録時:
  AIModel.referenceImages → EcomID/InstantID で faceId 特徴量を抽出・保存

生成時:
  Gemini Pro Image で着用画像のベースを生成
    → faceId 特徴量を注入して顔を置換/修正
    → 一貫性チェック（リファレンスとの類似度スコア）
```

具体的な統合アーキテクチャ（Gemini + EcomID のパイプライン詳細）は実装時にPoCで検証して確定する。

## Phase ロードマップ

### Phase 1: MVP（現在 → ）
- Studio: マルチスロット + 主役指定 + スタイリングルール（✅ バックエンド検証済み）
- Agency: 10体以上のAIモデル生成（faceId + リファレンス画像）
- 顔一貫性: EcomID/InstantID PoC → 統合
- UI: Studio生成画面 + Agency モデル一覧
- 課金: なし（ベータ）

### Phase 2: ペルソナ
- AIモデルにペルソナ（性格・ライフスタイル）追加
- SNSアカウント開設・運用開始
- ブランド専属モデル制作サービス開始

### Phase 3: フルバーチャルヒューマン
- AIモデルがSNSで自律的にコンテンツ投稿
- ファンコミュニティ形成
- ブランドコラボ（imma的なモデル）

## 現行Studioコードへの影響

### 変更が必要なファイル

```
data/modelRoster.ts
  → AIModel型に拡張。faceId, referenceImages 追加
  → 将来的にはDB/APIから取得（Phase 1はハードコードでOK）

services/imageGenerator.ts
  → generateFront/generateAngle に faceId 注入ステップ追加
  → EcomID/InstantID API呼び出しの統合

types/model.ts
  → AIModel インターフェース定義

components/generation/ModelSelector.tsx
  → カテゴリ体系を4カテゴリに変更
  → コンポジット情報表示追加
```

### 変更不要なファイル

```
services/geminiClient.ts — 共通ユーティリティはそのまま
services/garmentAnalyzer.ts — 商品分析はモデルに依存しない
services/qualityChecker.ts — 顔一貫性チェック項目を追加するだけ
hooks/useGenerationFlow.ts — フロー自体は同じ
hooks/useGarmentUpload.ts — アップロードはモデルに依存しない
```

## Not In Scope（MVP）

- SNSアカウント運用（Phase 2）
- ペルソナ設定（Phase 2）
- 自律的コンテンツ投稿（Phase 3）
- ブランド専属モデル制作UI（MVP は手動制作）
- 課金システム（ベータ期間）
- モデルのDB管理（MVPはハードコード）

## Success Criteria

1. 10体以上のAIモデルが Agency ページに掲載されている
2. 各モデルが複数の商品で着用画像を生成しても「同一人物」と認識できる
3. botika.com のギャラリーと遜色ない画像品質
4. ブランドが指名 → 着用画像生成 → ダウンロードの一連のフローが動作する
5. 社長が「これはモデル事務所として成立する」と判断する

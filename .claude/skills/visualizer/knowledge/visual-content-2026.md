# ビジュアルコンテンツ生成 2026 知識ベース

> 最終更新: 2026-03-05
> ソース: AI画像生成API各社公式ドキュメント + 最新比較レポート + 3Dツール + MCP連携

---

## 1. AI画像生成ツール比較マトリクス

### メインツール比較（2026年3月時点）

| ツール | API | 品質 | テキスト描画 | 速度 | コスト/枚 | ブランド適性 | 推奨度 |
|--------|-----|------|-------------|------|-----------|-------------|--------|
| **Midjourney v7** | 非公式のみ | S+ | B (50%) | 中速 | $0.01-0.04 | S+ | アート用 |
| **FLUX.2 Pro** (BFL) | REST API | S | A | 高速 | $0.03-0.055 | S | **メイン** |
| **GPT Image** (OpenAI) | REST API | S | S (95%) | 高速 | $0.02-0.19 | A | **メイン** |
| **Ideogram 3.0** | REST API | A | S+ (98%) | 高速 | $0.06 | B | テキスト用 |
| **SD 3.5 Large** (Stability) | REST API | A | B | 高速 | $0.035-0.065 | A | バルク用 |
| **FLUX.2 klein** (BFL) | REST API | B+ | B | 超高速(<1s) | $0.014 | B+ | ドラフト用 |
| **SDXL** (Stability) | REST API | B+ | C | 高速 | $0.002-0.006 | B | 最安バルク |
| **Recraft V4** | REST API | A | A | 高速 | $0.04 | A | ベクター系 |
| **Adobe Firefly 3** | REST API | A | B+ | 中速 | サブスク | A | 商用安全 |

### 評価基準
- **S+**: 業界最高水準 / **S**: 優秀 / **A**: 良好 / **B**: 実用的 / **C**: 課題あり

### 各ツール詳細

#### Midjourney v7
- **強み**: ソウルフルなライティングとバランスの取れた構図。ファンタジー・ムードボード向けで最強。ダーク×テック系のビジュアル表現力が圧倒的
- **弱み**: 公式APIなし（Discord経由のみ）。無料枠なし。編集ツール限定的
- **プラン**: Basic $10/月、Standard $30/月、Pro $60/月、Mega $120/月
- **API回避策**: PiAPI ($0.01/タスク〜)、Useapi.net ($10/月)、ImagineAPI 等のサードパーティ
- **TomorrowProof向け用途**: 高品質なアートワーク、コンセプトイメージ、ブランドビジュアル

#### FLUX.2 Pro (Black Forest Labs)
- **強み**: 最もフォトリアリスティックな出力。肌テクスチャや照明がMidjourneyを超える写実性。APIが安定
- **弱み**: テキスト描画はIdeogramに劣る
- **価格**: FLUX 1.1 Pro: $0.04/枚、FLUX 2 Pro: Replicate $0.055/枚、fal.ai $0.073/枚
- **エンドポイント**: `api.bfl.ml/v1/flux-2-pro`、Replicate、fal.ai 経由も可
- **TomorrowProof向け用途**: ブログヒーロー画像、3Dアイソメトリック、プロダクトモックアップ

#### GPT Image (OpenAI)
- **強み**: 複雑なシーン構成の正確性が最高。テキスト描画精度95%。ChatGPTワークフローとシームレス統合
- **弱み**: 高品質設定は高コスト
- **価格**: Low $0.02、Medium $0.04、High $0.19
- **エンドポイント**: `api.openai.com/v1/images/generations`
- **TomorrowProof向け用途**: テキスト入りサムネイル、インフォグラフィック要素、概念図

#### Ideogram 3.0
- **強み**: テキスト描画精度98%（業界最高）。単語から複数行レイアウトまで正確。ロゴ・ポスター・ブランドグラフィック向け
- **弱み**: アーティスティックな表現はMidjourneyに劣る
- **価格**: $0.06/枚（ボリュームディスカウントあり）
- **レンダリングモード**: Turbo（高速ドラフト）、Default（バランス）、Quality（最高品質）
- **エンドポイント**: `api.ideogram.ai/generate`
- **TomorrowProof向け用途**: SNSカード（テキストオーバーレイ必須）、ロゴ候補、タイポグラフィデザイン

#### Stable Diffusion 3.5
- **強み**: オープンソース。セルフホスト可能。MMDiTアーキテクチャ。インペインティング・アウトペインティング対応
- **弱み**: クラウドAPI品質はFLUX/Midjourneyに劣る
- **価格**: API $0.035/枚、DreamStudio 1,000クレジット=$10（約5,000枚）、セルフホスト無料
- **エンドポイント**: `api.stability.ai/v2beta`
- **TomorrowProof向け用途**: バルク生成、バリエーション検討、カスタムファインチューニング

#### Adobe Firefly 3
- **強み**: 商用利用100%安全（学習データが全てライセンス済み）。Style Kits でブランドの視覚スタイルを学習可能。Firefly Boardsでチームコラボ
- **弱み**: 創造性・芸術性はMidjourneyに劣る。サブスクリプション必須
- **TomorrowProof向け用途**: 商用素材が必要な場合のバックアップ

### API利用可否の詳細

| ツール | APIエンドポイント | 認証方式 | SDK |
|--------|------------------|---------|-----|
| GPT Image | `api.openai.com/v1/images/generations` | API Key | openai-node |
| FLUX.2 Pro | `api.bfl.ml/v1/flux-2-pro` | API Key | 公式REST |
| FLUX.2 Pro (Replicate) | `api.replicate.com` | API Token | replicate-js |
| FLUX.2 Pro (fal.ai) | `fal.ai/models/flux-2-pro` | API Key | fal-client |
| Ideogram 3.0 | `api.ideogram.ai/generate` | API Key | REST |
| SD 3.5 | `api.stability.ai/v2beta` | API Key | stability-sdk |
| Midjourney | 公式API未提供（Discord経由） | - | - |
| Adobe Firefly | `firefly-api.adobe.io` | OAuth | Adobe SDK |

---

## 2. 3Dレンダリング AI ツール比較

### 主要3Dツール（2026年3月時点）

| ツール | テキスト→3D | 画像→3D | テクスチャ品質 | トポロジー | 速度 | 価格 |
|--------|-----------|---------|-------------|-----------|------|------|
| **Tripo3D** | S | S | 4K PBR | クリーンなクワッドメッシュ | 20秒 | 従量制 |
| **Meshy AI** | A | S | 高品質 | クリーンなエッジフロー | 3分 | $20/月〜 |
| **Rodin AI** | S | A | フォトリアリスティック | 高品質 | 中速 | 従量制 |
| **3D AI Studio** | A | A | 良好 | 標準 | 中速 | $19/月〜 |
| **Sloyd** | B+ | B | 良好 | ゲーム向け最適化 | 高速 | $15/月〜 |

### 各ツール詳細

#### Tripo3D
- **特徴**: 200億パラメータモデル。20秒でテクスチャ付き3Dモデル生成。自動リトポロジー、メッシュセグメンテーション、基本リギング
- **Magic Brush**: テクスチャの局所調整が可能
- **エクスポート**: Unity、Unreal、Blender対応
- **ブラウザベース**: インストール・GPU不要
- **TomorrowProof用途**: テック感のある3Dアブストラクトオブジェクト、ブログ用3Dレンダリング

#### Meshy AI
- **特徴**: クリーンなメッシュとエッジフロー。アートディレクション可能なAIモデリング。キャラクターアニメーション対応
- **強み**: プロンプトの細かいコントロールが効く。3D基礎知識があるユーザー向け
- **TomorrowProof用途**: プロダクトモックアップ、コンセプトモデル

#### Rodin AI
- **特徴**: フォトリアリスティックなオブジェクト生成に最強
- **TomorrowProof用途**: 製品ビジュアライゼーション、リアル系3Dレンダリング

### 3Dレンダリングのプロンプトテンプレート（TomorrowProofスタイル）

#### テック系アブストラクトオブジェクト
```
A minimal geometric 3D object: [形状: dodecahedron/torus/crystal lattice].
Material: dark matte black (#050508) with subtle cyan (#00D4FF) edge emission.
Environment: pure black void with soft ambient occlusion.
Style: Nothing Tech product design meets abstract sculpture.
Clean topology. No noise. No texture map — pure material and light.
```

#### AIエージェント・システムの3D表現
```
Isometric 3D scene: interconnected floating dark platforms (#0A0A0F)
in a black void (#050508). Thin glowing cyan (#00D4FF) light trails
connecting each platform. Each platform has a different minimal
geometric icon on it. Central platform slightly larger with brighter glow.
Style: architectural model meets circuit board aesthetic.
Clean, precise, no organic elements.
```

#### データフロー・ネットワークの3D表現
```
3D visualization of a data network. Nodes as small dark spheres
(#0A0A0F) connected by thin luminous cyan (#00D4FF) lines in 3D space.
Some nodes pulse with brighter light. Background: infinite black (#050508).
Depth of field effect. Particle dust floating.
Style: scientific visualization meets Nothing Tech aesthetic.
```

---

## 3. デザインプラットフォーム AI機能

### Canva AI（MCP連携あり）

#### 最新機能（2026年）
- **Brand Guardrails**: 非ブランドフォント・カラーの自動防止。AIが生成した画像のカラーを自動でブランドHEXコードに補正
- **Magic Animate**: ワンクリックでモーション追加
- **Magic Switch**: 異なるプラットフォーム向けに自動リサイズ（レイアウト再構築不要）
- **Magic Write**: SNSコピー、メール、ブログドラフト生成

#### MCP連携（Claude Code統合）
- **接続方法**: Canva AI Connector経由でClaude、ChatGPT、Cursorと接続
- **可能な操作**:
  - デザインの作成・検索・取得
  - テンプレートの自動入力（autofill）
  - デザインのエクスポート（PDF/画像）
  - フォルダ管理・整理
  - コメント・レビュー
  - ブランドキットの参照
  - リサイズ
- **対応プラン**: Pro、Max、Team、Enterprise
- **TomorrowProof活用**: SNS画像の一括生成、ブログサムネイルのテンプレート化、OGP画像の量産

#### Canva MCP利用手順
```
1. Canva Pro以上のプランに加入
2. Canva AI Connectorページ（canva.com/ai-connector/）でMCP設定
3. Claude Code設定でCanva MCPサーバーを追加
4. Claude CodeからCanvaデザインを直接操作
```

### Figma AI（2026年）
- **Check Designs**: AIリンターがデザインシステムをスキャンし、ブランド違反を自動検出・修正
- **Text-to-Layout**: テキスト入力から3カラム価格表等を自動生成
- **Visual Search**: デザイン資産の視覚的検索
- **TomorrowProof活用**: HP/LPのデザインシステム管理、UIコンポーネント設計

### Adobe Firefly 3（2026年）
- **Firefly Boards**: 無限キャンバスでチームコラボ。AI画像生成内蔵のMiro的ツール
- **Style Kits**: 20枚のブランド画像をアップロードするとモデルがスタイルを学習。以降の生成が全てブランド準拠
- **Generative Workflow**: 「Generative Fill」から「Generative Workflow」へ進化。編集→生成の一体化
- **TomorrowProof活用**: 商用安全なビジュアル素材の生成（法的リスク回避が必要な場合）

---

## 4. インフォグラフィック生成ツール

### 主要ツール比較

| ツール | AI機能 | ブランド対応 | データ連携 | 価格 | 推奨度 |
|--------|--------|------------|-----------|------|--------|
| **Venngage** | テキスト→インフォグラフィック | テンプレート | CSV/Excel | 無料〜$29/月 | A |
| **Piktochart AI** | スマートデータエンジン | ブランドキット | 自動チャート提案 | 無料〜$29/月 | A |
| **Visme** | 適応型レイアウト | ブランドガイド | リアルタイムデータ | 無料〜$29/月 | A |
| **Infogram** | アニメーション対応 | テーマ | データポイント | 無料〜$25/月 | B+ |
| **EzyGraph** | テキスト→インフォグラフィック | カスタマイズ可 | テキスト入力 | 無料 | B+ |
| **Canva** | Magic Design | Brand Guardrails | 統合済み | 無料〜$15/月 | A |

### TomorrowProof推奨構成

インフォグラフィックは**Mermaid + HTML/CSS**を最優先で使用する（コードベース管理・ブランド完全準拠のため）。外部ツールは以下の場合のみ:

1. **データビジュアライゼーションが複雑**: Piktochart AI（スマートデータエンジンで自動チャート提案）
2. **SNS向けインフォグラフィック**: Canva（MCP連携でClaude Codeから直接操作可能）
3. **ブログ記事変換**: Venngage（Blog to Infographic Converter）

---

## 5. OGP画像自動生成

### Next.js ImageResponse API（推奨）

tomorrowproof-ai.comはVite + Reactだが、将来のNext.js移行やHP新規構築時に適用:

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'TomorrowProof';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '60px 80px',
          background: '#050508',
          fontFamily: 'Inter, Noto Sans JP',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontWeight: 700,
            color: '#FAFAFA',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            maxWidth: '900px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: '80px',
            height: '3px',
            background: '#00D4FF',
            marginTop: '24px',
          }}
        />
        <div
          style={{
            fontSize: '18px',
            color: '#6B7280',
            marginTop: '16px',
          }}
        >
          TomorrowProof — AI Implementation Studio
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

### 現行Vite + React環境での代替策

1. **ビルド時静的生成**: satori + @resvg/resvg-js でSVG→PNG変換
2. **外部サービス**: Vercel OG Image Generation（Edge Function）
3. **AI画像生成**: 記事ごとにFLUX.2 ProでカスタムOGP画像を生成（推奨）

---

## 6. TomorrowProof推奨ツール構成

### プライマリ: FLUX.2 Pro
- **理由**: ダークテーマ・テック系ビジュアルとの相性が最も高い。コスト効率良好。APIが安定
- **用途**: ブログヒーロー画像、3Dアイソメトリック、プロダクトモックアップ
- **コスト**: 1024x1024で約$0.03-0.055/枚

### セカンダリ: GPT Image
- **理由**: テキスト描画精度95%。複雑なシーン構成の正確性が最高
- **用途**: テキスト入りサムネイル、インフォグラフィック要素、概念図
- **コスト**: Medium品質で約$0.04/枚

### テキスト特化: Ideogram 3.0
- **理由**: テキスト描画精度98%。タイポグラフィ含むデザインに最適
- **用途**: SNSカード（テキストオーバーレイ必須）、サムネイルのテキスト部分
- **コスト**: $0.06/枚

### 3Dレンダリング: Tripo3D
- **理由**: 20秒で高品質3Dモデル生成。ブラウザベースでGPU不要。4K PBRテクスチャ
- **用途**: テック感のある3Dオブジェクト、ブログ用3Dビジュアル、アブストラクトアート
- **コスト**: 従量制

### テンプレート量産: Canva AI（MCP連携）
- **理由**: Claude Codeから直接操作可能。Brand Guardrailsでブランド準拠自動化。Magic Switchで全プラットフォーム一括リサイズ
- **用途**: SNS画像テンプレート、ブログサムネイル量産、OGP画像
- **コスト**: Pro $15/月

### バルク・ドラフト: FLUX.2 klein / SDXL
- **理由**: 超低コストで大量生成可能。ドラフト確認やバリエーション検討に最適
- **用途**: ラフ案作成、バリエーション検討、A/Bテスト用
- **コスト**: $0.002-0.014/枚

### 図解・ダイアグラム: Mermaid + HTML/CSS
- **理由**: コードベースで管理可能。ブランドカラーに完全準拠
- **用途**: フローチャート、アーキテクチャ図、プロセス図、データ可視化
- **コスト**: 無料

---

## 7. 月間コスト試算

### 想定制作量（週2記事 = 月8記事ベース）

| ビジュアルタイプ | 枚数/記事 | 月間合計 | 使用ツール | コスト/枚 | 月間コスト |
|-----------------|----------|---------|-----------|----------|-----------|
| ヒーロー画像 | 1 | 8 | FLUX.2 Pro | $0.04 | $0.32 |
| インライン図解 | 2-3 | 20 | Mermaid/HTML | $0 | $0 |
| 3Dレンダリング | 1 | 8 | FLUX.2 Pro | $0.04 | $0.32 |
| SNSカード(X) | 1 | 8 | Ideogram | $0.06 | $0.48 |
| SNSカード(note) | 1 | 8 | FLUX.2 Pro | $0.04 | $0.32 |
| IGカルーセル | 5 | 40 | GPT Image | $0.04 | $1.60 |
| OGP画像 | 1 | 8 | FLUX.2 Pro | $0.04 | $0.32 |
| 3Dモデル | 1 | 4 | Tripo3D | $0.10 | $0.40 |
| ドラフト/検討 | 5 | 40 | FLUX.2 klein | $0.014 | $0.56 |
| **合計** | | **144枚** | | | **$4.32** |

**月間AI画像生成コスト: 約$5（約750円）**
**Canva Pro追加の場合: +$15/月（約2,250円）**
**合計月間ビジュアルコスト: 約$20（約3,000円）**

---

## 8. プラットフォーム別画像サイズ仕様

### ブログ（tomorrowproof-ai.com）

| 用途 | サイズ | アスペクト比 | フォーマット | 最大容量 |
|------|--------|-------------|-------------|---------|
| ヒーロー画像 | 1200 x 630 px | 1.91:1 | WebP | 200KB |
| OGP画像 | 1200 x 630 px | 1.91:1 | PNG/JPG | 300KB |
| インライン画像 | 1200 x 675 px | 16:9 | WebP | 150KB |
| サムネイル | 600 x 400 px | 3:2 | WebP | 80KB |

### note.com

| 用途 | サイズ | アスペクト比 | フォーマット |
|------|--------|-------------|-------------|
| 見出し画像 | 1280 x 670 px | 1.91:1 | PNG/JPG |
| 記事内画像 | 1200 x 任意 | - | PNG/JPG |
| マガジン表紙 | 1280 x 670 px | 1.91:1 | PNG/JPG |

### X (Twitter)

| 用途 | サイズ | アスペクト比 |
|------|--------|-------------|
| ポスト画像（単体） | 1200 x 675 px | 16:9 |
| カード画像 | 1200 x 628 px | 1.91:1 |
| ヘッダー画像 | 1500 x 500 px | 3:1 |

### Instagram

| 用途 | サイズ | アスペクト比 |
|------|--------|-------------|
| フィード正方形 | 1080 x 1080 px | 1:1 |
| フィード縦長 | 1080 x 1350 px | 4:5 |
| カルーセル | 1080 x 1350 px | 4:5 |
| ストーリーズ | 1080 x 1920 px | 9:16 |
| リール | 1080 x 1920 px | 9:16 |

### LinkedIn

| 用途 | サイズ | アスペクト比 |
|------|--------|-------------|
| 投稿画像 | 1200 x 627 px | 1.91:1 |
| 記事カバー | 1200 x 644 px | 1.86:1 |

### Pinterest

| 用途 | サイズ | アスペクト比 |
|------|--------|-------------|
| ピン画像 | 1000 x 1500 px | 2:3 |
| インフォグラフィック | 1000 x 2100 px | 1:2.1 |

---

## 9. ブランド準拠プロンプトテンプレート集

### 基本プロンプト構造（TomorrowProofスタイル）

全プロンプトに以下のスタイル指定を共通で付与する:

```
[スタイル共通接尾辞]
Style: dark minimal tech aesthetic. Background: deep black (#050508).
Accent color: electric cyan (#00D4FF). Secondary elements in muted gray (#1A1A2E).
Typography-driven. No stock photo feel. Clean edges. Subtle glow effects.
Inspired by Nothing Tech product design and Apple minimalism.
No excessive gradients. No pop colors. No decorative shadows.
Professional, edgy, futuristic but restrained.
```

---

### A. ブログヒーロー画像プロンプト（3種）

#### A-1. テック/AI概念系
```
A dark minimal hero image for a tech blog article about [テーマ].
Central composition with a single abstract geometric object floating in
void-black space (#050508). Subtle cyan (#00D4FF) edge lighting.
Faint grid lines in dark gray (#1A1A2E) receding into depth.
No text. No humans. Clean, architectural feeling.
Photorealistic 3D render quality. 8K detail.
Aspect ratio 1.91:1.
```

#### A-2. ビジネス/戦略系
```
A dark minimal hero image for an article about [テーマ].
Isometric view of abstract architectural blocks arranged like a strategic
game board on a pure black surface (#050508). Key element highlighted
with cyan glow (#00D4FF). Other elements in dark charcoal (#0A0A0F)
with subtle border lines (#1A1A2E).
No text. No humans. Geometric precision.
3D render, octane quality. Aspect ratio 1.91:1.
```

#### A-3. プロダクト/ツール紹介系
```
A dark minimal hero image showcasing [プロダクト名/概念].
Floating glass-morphism UI card with subtle reflections on a black
background (#050508). Thin cyan (#00D4FF) accent lines.
Depth of field effect. Particle dust floating in background.
No text on the image. Product-centric composition.
3D render quality. Aspect ratio 1.91:1.
```

---

### B. noteサムネイル画像プロンプト（2種）

#### B-1. 標準noteサムネイル
```
Dark minimal thumbnail for a Japanese tech blog article.
Deep black background (#050508). Abstract geometric shape (cube,
sphere, or torus) with cyan (#00D4FF) edge lighting, positioned
in the right third of the composition.
Left side reserved for text overlay (will be added separately).
Professional, premium, Nothing Tech inspired aesthetic.
1280x670px.
```

#### B-2. データ/分析noteサムネイル
```
Dark minimal thumbnail for a data-driven article.
Deep black background (#050508). Abstract holographic data
visualization (bar chart or line graph) rendered as glowing
cyan (#00D4FF) and green (#00FF88) light.
Clean, futuristic, editorial feel.
Space for text overlay on the left half.
1280x670px.
```

---

### C. SNS投稿画像プロンプト（3種）

#### C-1. Xポストカード
```
Minimalist dark card design for social media.
Black background (#050508) with a single bold typographic element.
Title text "[タイトル]" in white (#FAFAFA), large and centered.
Thin horizontal cyan (#00D4FF) accent line below the title.
Subtle "TomorrowProof" watermark in bottom right corner.
Clean, premium, editorial feel. No imagery, typography-only.
1200x675px.
```

#### C-2. Instagram正方形フィード
```
Instagram feed post. Dark premium design.
Black background (#050508). Central geometric element:
[テーマに応じた抽象形状] with cyan (#00D4FF) rim lighting.
Vast negative space. Ultra clean. Apple keynote aesthetic.
No text in the image. Square format 1080x1080px.
```

#### C-3. Instagramカルーセル（表紙 / コンテンツスライド）

表紙:
```
Instagram carousel cover slide. Dark premium design.
Black background (#050508). Large bold white text placeholder area
in the center. Subtle abstract geometric element in cyan (#00D4FF)
in bottom-right corner. Clean, editorial.
1080x1350px. Vertical format.
```

コンテンツスライド:
```
Instagram carousel content slide. Dark premium design.
Black background (#050508). Content area with dark card (#0A0A0F)
with thin border (#1A1A2E). Space for bullet points in white text.
Minimal cyan (#00D4FF) accent on key numbers or highlights.
Clean, readable, professional.
1080x1350px. Vertical format.
```

---

### D. 3Dレンダリングプロンプト（3種）

#### D-1. テック系アブストラクト
```
Isometric 3D illustration of an AI agent system.
Dark black platform (#050508) with floating modular blocks representing
different AI agents. Each block is dark charcoal (#0A0A0F) with thin
cyan (#00D4FF) connection lines between them. Central hub glows
with brighter cyan. Clean geometric shapes only.
Minimal, architectural. No characters. Tech aesthetic.
Soft ambient occlusion. Subtle reflections on the platform surface.
```

#### D-2. ワークフロー/プロセス
```
Isometric 3D illustration of a [プロセス名] workflow.
Series of connected dark platforms (#0A0A0F) floating at different
heights on a black void (#050508). Cyan (#00D4FF) light trails flow
between platforms showing data/process flow.
Each platform has a minimal geometric icon representing a step.
Clean, minimal, technical. No text. No humans.
Soft lighting from above. Subtle depth of field.
```

#### D-3. データ/分析
```
Isometric 3D illustration of data analysis.
Dark floating dashboard panels (#0A0A0F) with abstract bar charts
and line graphs rendered as glowing cyan (#00D4FF) holographic elements.
Black background (#050508). Grid floor in dark gray (#1A1A2E).
Minimalist, clean edges. Technology aesthetic.
No text. No humans. Pure geometric visualization.
```

---

### E. インフォグラフィック/図解用プロンプト（2種）

#### E-1. 比較チャート背景
```
Dark minimal background for an infographic comparison chart.
Pure black (#050508) with subtle geometric grid pattern in
dark gray (#1A1A2E). Thin horizontal divider lines.
Abstract minimal decorative element (dot matrix or line pattern)
in the top-right corner with cyan (#00D4FF) accent.
Clean, editorial, data-ready. No text. 1200x675px.
```

#### E-2. プロセスフロー背景
```
Dark minimal background for a process flow diagram.
Black (#050508) with very subtle circuit board pattern
in dark gray (#1A1A2E). Faint cyan (#00D4FF) dots marking
node positions in a horizontal flow layout.
Clean, technical, minimal. No text. 1200x675px.
```

---

### F. OGP画像プロンプト

```
OGP image for a tech blog. Minimal dark design.
Black background (#050508). Subtle abstract element in right third:
[テーマに応じた幾何学形状] with cyan (#00D4FF) edge glow.
Left 60% is clean black space for text overlay.
Bottom bar: thin 2px cyan line across the full width.
Professional, premium, modern. 1200x630px.
```

---

### G. Nothing Tech / Apple スタイル再現プロンプト集

#### G-1. Nothing Phone風プロダクトショット
```
Product photography style, Nothing Phone inspired.
Single tech object centered on pure black background (#050508).
Dramatic side lighting creating sharp highlight on one edge.
Subtle dot-matrix/glyph-inspired light pattern.
Transparent/glass material elements. Monochrome with single
cyan (#00D4FF) accent point. Ultra clean, no dust, no reflections
except intentional ones. Shot on Phase One 150MP.
```

#### G-2. Apple風ミニマルプロダクト
```
Apple-style product presentation on seamless black background.
Single object with perfect studio lighting. Incredibly clean edges.
Zero visual noise. Vast negative space around the subject.
Color palette: black, dark gray, and one precise cyan (#00D4FF)
highlight. Hyper-realistic render quality. No text.
```

#### G-3. ダーク UI/ダッシュボード風
```
Dark mode UI screenshot style. Fictional SaaS dashboard.
Background: #050508. Cards: #0A0A0F with 1px border #1A1A2E.
Data visualizations in cyan (#00D4FF) and green (#00FF88).
Inter font style typography. Minimal iconography (line style).
Clean grid layout. No rounded excessive corners.
Professional, premium, enterprise-grade aesthetic.
```

---

## 10. 図解・ダイアグラム生成ワークフロー

### Mermaidダイアグラム（ブランド準拠スタイル）

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {
  'primaryColor': '#0A0A0F',
  'primaryTextColor': '#FAFAFA',
  'primaryBorderColor': '#00D4FF',
  'lineColor': '#00D4FF',
  'secondaryColor': '#111116',
  'tertiaryColor': '#1A1A2E',
  'background': '#050508',
  'mainBkg': '#0A0A0F',
  'nodeBorder': '#00D4FF',
  'clusterBkg': '#0A0A0F',
  'titleColor': '#FAFAFA',
  'edgeLabelBackground': '#0A0A0F'
}}}%%
```

### HTML/CSSインフォグラフィック基本構造

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+JP:wght@400;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg: #050508;
      --surface: #0A0A0F;
      --border: #1A1A2E;
      --text: #FAFAFA;
      --subtext: #6B7280;
      --accent: #00D4FF;
      --success: #00FF88;
      --warning: #FFB800;
      --error: #FF3366;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', 'Noto Sans JP', sans-serif;
      padding: 48px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }

    .accent { color: var(--accent); }
    .success { color: var(--success); }
    .warning { color: var(--warning); }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 16px;
      transition: border-color 0.2s ease;
    }

    .card:hover { border-color: var(--accent); }

    .grid { display: grid; gap: 16px; }
    .grid-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-4 { grid-template-columns: repeat(4, 1fr); }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--accent);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--subtext);
      margin-top: 4px;
    }

    .tag {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid;
    }

    .tag-cyan { border-color: var(--accent); color: var(--accent); }
    .tag-green { border-color: var(--success); color: var(--success); }

    .divider {
      height: 1px;
      background: var(--border);
      margin: 24px 0;
    }
  </style>
</head>
<body>
  <!-- ここにコンテンツを配置 -->
</body>
</html>
```

---

## 11. 画像最適化ガイドライン

### フォーマット選択

| 用途 | 推奨フォーマット | 理由 |
|------|----------------|------|
| ブログ画像 | WebP | 高圧縮・高品質。ブラウザ対応率99%+ |
| OGP画像 | PNG or JPG | SNSクローラーとの互換性確保 |
| note画像 | PNG or JPG | note.comがWebP非推奨 |
| Instagram | JPG | プラットフォーム標準 |
| 図解(HTML) | SVG / HTML | スケーラブル。テキスト検索可能 |

### 圧縮ターゲット

| サイズカテゴリ | ターゲット容量 | 用途 |
|-------------|-------------|------|
| ヒーロー画像 | 150-200KB | ブログトップ |
| インライン画像 | 80-150KB | 記事内 |
| サムネイル | 50-80KB | 一覧表示 |
| SNSカード | 100-200KB | X/note/LinkedIn |
| IGカルーセル | 100-300KB | Instagram |

### alt属性のベストプラクティス

```markdown
![3Dアイソメトリック図: AIエージェントシステムの構成図。中央のCEOエージェントから各専門エージェントへの接続を示す](./images/agent-system-architecture.webp)
```

- **具体的に**: 「画像」「写真」等の曖昧な表現を避ける
- **文脈を含める**: 記事との関連性がわかる説明
- **キーワード含有**: SEO対象キーワードを自然に含める
- **100文字以内**: 長すぎるalt属性は逆効果

---

## 12. 画像ホスティング・ストレージ戦略

### 推奨構成

```
tomorrowproof-hp/  (Vercelホスティング)
  └── public/
      └── images/
          └── blog/
              ├── 2026-03/
              │   ├── hero-article-slug.webp
              │   ├── diagram-article-slug-01.webp
              │   └── og-article-slug.png
              └── agents/
                  ├── avatar-ceo.webp
                  └── avatar-dev.webp
```

### 画像パス規則

| タイプ | パス形式 |
|--------|---------|
| ブログヒーロー | `/images/blog/YYYY-MM/hero-[slug].webp` |
| 記事内図解 | `/images/blog/YYYY-MM/diagram-[slug]-[番号].webp` |
| OGP画像 | `/images/blog/YYYY-MM/og-[slug].png` |
| エージェント画像 | `/images/agents/avatar-[agent-name].webp` |
| SNS用画像 | `/images/sns/YYYY-MM/[platform]-[slug].png` |

---

## 13. ビジュアル生成のアンチパターン

### 禁止事項

1. **ストック写真的なビジュアル**: 笑顔のビジネスマン、握手、オフィス風景は一切使わない
2. **ポップカラー**: ピンク、オレンジ、パステルカラーをメインで使わない
3. **過度なグラデーション**: 虹色、サイケデリックなグラデーションは禁止
4. **テキスト直接生成の乱用**: AIで日本語テキストを画像に直接入れない（崩れるため）
5. **人物のリアル描写**: 実在しない人物のリアル画像は法的リスクあり。使うなら抽象的に
6. **装飾過多**: フレーム、バッジ、リボン、スタンプ等の装飾は使わない
7. **低解像度での公開**: 必ず指定サイズ以上で生成する
8. **ウォーターマーク放置**: 生成ツールのウォーターマークが入ったまま公開しない

### 品質チェックリスト

- [ ] ブランドカラー（#050508背景、#00D4FFアクセント）に準拠しているか
- [ ] テキストが必要な場合、後からオーバーレイで追加しているか（AI生成テキスト直書きではないか）
- [ ] 指定サイズ・アスペクト比で出力されているか
- [ ] ファイルサイズが許容範囲内か
- [ ] alt属性が適切に記述されているか
- [ ] ストック写真的な「安っぽさ」がないか
- [ ] Nothing Tech / Apple のビジュアル水準に達しているか

---

## ソース

### AI画像生成ツール
- [Best AI Image Generators 2026: Midjourney vs Flux vs Ideogram (AI Tech Boss)](https://www.aitechboss.com/best-ai-image-generators-2026/)
- [Top 5 AI Image Generators 2026 (BestPhoto)](https://bestphoto.ai/blog/top-5-ai-image-generators-2026)
- [AI Image Generators 2026: Honest Comparison (Axis Intelligence)](https://axis-intelligence.com/ai-image-generators-2026-honest-comparison/)
- [Best AI Image Generators 2026 (Awesome Agents)](https://awesomeagents.ai/tools/best-ai-image-generators-2026/)

### 3Dレンダリングツール
- [AI 3D Model Generators Compared (Medium)](https://medium.com/data-science-in-your-pocket/ai-3d-model-generators-compared-tripo-ai-meshy-ai-rodin-ai-and-more-8d42cc841049)
- [12 Essential AI 3D Creation Tools 2026 (3D AI Studio)](https://www.3daistudio.com/3d-generator-ai-comparison-alternatives-guide/best-3d-generation-tools-2026/12-essential-ai-3d-creation-tools-2026)
- [3D AI Pricing Comparison 2026 (Sloyd)](https://www.sloyd.ai/blog/3d-ai-price-comparison)

### デザインプラットフォーム
- [Canva vs Adobe Firefly vs Figma AI 2026 (Genesys Growth)](https://genesysgrowth.com/blog/canva-magic-write-vs-adobe-firefly-vs-figma-ai)
- [Best AI Design Tools 2026 (Technosys)](https://technosysblogs.com/ai-design-tools-2026/)
- [11 Best AI Design Tools 2026 (Figma)](https://www.figma.com/resource-library/ai-design-tools/)

### Canva MCP連携
- [Canva MCP Server (公式)](https://www.canva.dev/docs/apps/mcp-server/)
- [Canva AI Connector (公式)](https://www.canva.com/ai-connector/)
- [Claude MCP Integration (MacRumors)](https://www.macrumors.com/2026/01/27/claude-app-integration-asana-slack-figma-canva/)

### API料金
- [FLUX API Pricing (BFL公式)](https://bfl.ai/pricing)
- [Stability AI Platform Pricing (公式)](https://platform.stability.ai/pricing)
- [Ideogram API Pricing (公式)](https://ideogram.ai/features/api-pricing)
- [Midjourney Plans (公式)](https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans)

### インフォグラフィック
- [11 Best AI Infographic Generators 2026 (Venngage)](https://venngage.com/blog/best-ai-infographic-generator/)
- [10 Best AI Tools for Generating Infographics 2026 (Powerdrill)](https://powerdrill.ai/blog/best-ai-tools-for-generating-infographics)

### OGP画像生成
- [Next.js OGP Image Guide (公式)](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Dynamic OG Images with Next.js 16 (MakerKit)](https://makerkit.dev/blog/tutorials/dynamic-og-image)

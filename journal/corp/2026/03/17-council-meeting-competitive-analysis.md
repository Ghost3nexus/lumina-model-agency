# Council Meeting #4 — 競合分析に基づくLumina戦略再設計

**日時**: 2026-03-17
**起因**: @taziku (田中義弘 / taziku CEO) のX投稿3件から得た競合情報
**参加**: CEO, dev, planner, ec_director, research, marketing

---

## 調査対象

### X投稿3件（@taziku）
1. **v0 + NanoBanana + Vercel AI Gateway + Sora** — ノーコードでファッション試着アプリを30分で構築
2. **Forever 21 AIモデル導入** — コスト・スピード削減
3. **CapCut AI Fashion Model** — 仮想試着、モデルカスタマイズ、モーション生成

---

## 調査結果

### 1. NanoBanana Pro = Gemini 3 Pro Image（Google）

- **正体**: Luminaが既に使っているGemini画像生成のブランド名（Google DeepMind）
- **品質**: Artificial Analysis で画像生成 #1ランク
- **解像度**: ネイティブ2K、Pro版4K対応
- **価格**: $0.067〜$0.24/画像（Vertex AI）、バッチ50%割引
- **ファッション対応**: 仮想試着プロンプト対応、50+バリエーション/60秒
- **Vercel連携**: AI Gateway公式対応（model: `google/gemini-3-pro-image`）、v0スターターテンプレあり
- **多言語**: 日本語テキストレンダリング対応
- **SynthID**: 全出力にウォーターマーク埋め込み

### 2. CapCut / Pippit（ByteDance）

- **価格**: $0.027/画像 — 破壊的価格
- **基盤モデル**: Seedream 4.0/4.5/5.0（ByteDance独自）
- **品質**: SNS・中堅EC向け。高級EC水準には未達
- **強み**: TikTok/IG直接投稿、動画生成、バッチ4バリエーション/リクエスト
- **弱み**: 日本語非対応、日本モール規格非対応
- **脅威度**: 中。ローエンド市場を食うが、Luminaの品質ターゲットとは異なる層

### 3. ファッション業界のAIモデル採用状況

| ブランド | ベンダー | 結果 |
|---------|---------|------|
| **Zalando** | 内製デジタルツイン | コスト90%削減、6-8週→3-4日。70%がAI画像 |
| **H&M** | 内製デジタルツイン30体 | モデルが自身のデジタル権利を保持 |
| **Forever 21** | 未公開（Somi AI関連か） | バッシング — 「AIに見える」品質が問題 |
| **J.Crew** | 未公開 | 足が逆の画像で炎上 |
| **Mango** | 内製 | 「MADE WITH AI」表示でバッシング |
| **Levi's** | Lalaland.ai | 多様性拡大目的（補完利用）。比較的好評 |

**教訓**: AIに見える品質はブランド毀損。「AIと気づかない」品質が絶対条件。

### 4. Vercel AI Gateway + Sora 2

- **AI Gateway**: 統一API、マルチプロバイダ自動フォールバック（20ms未満）
  - 対応: OpenAI, Anthropic, Google, FLUX, Kling, Wan等
  - Bring-your-own-key（マークアップなし）
  - 統一ダッシュボードで全AIコスト可視化
- **Sora 2**: 2026-03にAPI全開発者開放
  - 画像→動画対応（4-12秒）
  - 布の動き・モデルウォーク生成可能
  - 信頼性に課題（99%停止、過負荷エラー頻発）
  - フォールバック: Kling v3.0, Wan

---

## 競合マッピング

```
低品質×低価格    → CapCut/Pippit ($0.03/枚) — 大量・使い捨て・SNS向け
中品質×中価格    → Forever 21型 — バッシングリスク大
高品質×内製      → Zalando型 — 成功事例だが巨大企業の内製
高品質×適正価格  → ★Luminaのターゲット★ — SaaSとして提供
```

## Luminaの競争優位

1. **日本市場完全特化** — 楽天/Yahoo/Amazon JP規格対応は競合ゼロ
2. **品質第一** — Forever 21/J.Crewの失敗が証明する「品質が全て」
3. **FLUX LoRA独自モデル** — 汎用AIと差別化できる参入障壁
4. **Vercelインフラ** — AI Gateway活用で最新モデルへの即時アクセス
5. **日本語対応** — CapCut/botika非対応領域

---

## 戦略提案

### Phase 1: 即座に実行（1-2週間）

#### A. Vercel AI Gateway導入
- 現在のReplicate直接呼び出しをAI Gateway経由に統一
- FLUX LoRA + FASHN VTON のルーティング
- 自動フォールバック + コスト可視化

#### B. パイプライン最終確定
```
[商品画像アップロード]
    ↓
[FLUX LoRA: AIモデル生成（独自LoRA / Lumina EC Fashion v1）]
    ↓
[FASHN VTON: 商品をモデルに合成（ピクセル精度）]
    ↓
[出力: EC用商品着用画像（2K+）]
```

#### C. NanoBanana Pro商用利用確認
- Google Vertex AI商用利用規約の最終確認
- OK → FLUX LoRA + NanoBanana Proハイブリッド
- NG → FLUX LoRA一本（現方針維持）

### Phase 2: 中期（1-2ヶ月）

#### D. 動画生成機能
- Sora 2 API → 布の動き、モデルウォーク動画（4-12秒）
- AI Gateway経由でKling v3.0フォールバック
- EC商品ページの動画 → 返品率40%減（Zalandoデータ）

#### E. モデルロースター刷新
- FLUX LoRAで高品質モデル画像を全30体分再生成
- アジア/インターナショナル/男性/シニア/キッズ各カテゴリ

### Phase 3: 長期（3-6ヶ月）

#### F. 価格設計
- ターゲット: ¥100-300/枚（$0.65-2.00）
- vs 制作会社 ¥3,000-10,000/枚 → 1/10〜1/30
- vs CapCut $0.03/枚 → 品質で正当化

#### G. Zalandoモデルの研究
- 内製AI + デジタルツインの手法を参考に
- クライアント専用モデルID一貫性の実現

---

## CEO判断待ち項目

1. [ ] Vercel AI Gateway導入の承認
2. [ ] NanoBanana Pro商用利用の確認指示
3. [ ] 動画生成（Sora 2）をロードマップに追加するか
4. [ ] 価格帯 ¥100-300/枚の方向性
5. [ ] FLUX LoRA v2学習データの収集開始タイミング

---

## ソース

### NanoBanana Pro
- CNBC: Google launches Nano Banana 2
- TechCrunch: Google launches Nano Banana 2
- Google Blog: Nano Banana Pro
- Vercel Changelog: Nano Banana Pro in AI Gateway
- Artificial Analysis: #1 ranking

### CapCut / Pippit
- CapCut AI Fashion Model Generator
- Pippit AI Virtual Try-On / Model Generator
- Pippit Pricing
- Seedream 5.0 Launch (Pandaily)

### Fashion Industry AI Adoption
- Zalando: 90% cost reduction (chiefaiofficer.com)
- H&M AI Digital Twins (CNN, BoF)
- Forever 21 AI Models (TikTok, LinkedIn)
- Mango AI Models (BoF)
- Levi's + Lalaland.ai (Fortune)
- Brands Using AI Fashion Models (Claid.ai)

### Vercel AI Gateway + Sora
- Vercel AI Gateway docs
- OpenAI Sora 2 announcement
- Sora 2 Complete Guide 2026
- OpenTryon (GitHub)
- BoF: Generative AI Virtual Try-On

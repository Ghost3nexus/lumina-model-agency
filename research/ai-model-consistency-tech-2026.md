# AIモデル一貫性技術 — 統合調査レポート
**調査日**: 2026-03-19
**目的**: BEDWINに提案する「ブランド専属AIモデル」を実現する最適技術の選定

---

## 1. サマリー

- **最有力**: Alibaba **EcomID**（EC特化の顔一貫性、オープンソース、2M枚のEC portrait学習済み）
- **次点**: ByteDance **Seedream 5.0**（アジア人の顔が最高品質、参照画像14枚対応、$0.04/枚）
- **既存インフラ活用**: FLUX Kontext + Face LoRA（fal.aiで学習$6/回）
- **中国系がEC用途で西側を抜いている** — EcomID/ACE++/Seedreamは明確にファッションEC向け

---

## 2. 技術比較（全候補）

### Tier 1: 最有力候補

| 技術 | 開発 | 顔一貫性 | オープンソース | API | コスト/枚 | 強み |
|------|------|---------|------------|-----|---------|------|
| **Alibaba EcomID** | アリババ | 85-90% | Yes (Apache 2.0) | ComfyUI | 無料(GPU) | **EC portrait特化。PuLID+InstantIDの良いとこ取り。2M枚学習** |
| **ByteDance Seedream 5.0** | バイトダンス | 85-90% | No | Yes ($0.04) | $0.04 | **アジア人の顔が最高品質。14枚参照。テキスト描画も◎** |
| **FLUX Kontext + LoRA** | BFL/fal.ai | 85-95% | - | Yes (fal.ai) | $0.04 | **既存インフラそのまま。学習$6/回** |
| **ACE++** | アリババ DAMO | 80-85% | Yes | ComfyUI | 無料(GPU) | **FLUX.1ベースの顔スワップ。ゼロ学習** |

### Tier 2: 有力補完

| 技術 | 開発 | 顔一貫性 | オープンソース | 強み |
|------|------|---------|------------|------|
| **FLUX 2 Max** | BFL | 85-90% | No | 最大10枚参照、最高品質 |
| **PuLID** | バイトダンス系 | 70-85% | Yes | 単一参照で顔ロック、LoRAと併用◎ |
| **Tencent HunyuanImage 3.0** | テンセント | 80-85% | Yes (Apache 2.0) | 80Bパラメータ、世界最大オープンソース画像モデル |
| **InstantID** | InstantX | 70-85% | Yes | ゼロショット、角度変化に強い |
| **Kling 3.0** | 快手 | 85-90% | No | 動画の顔一貫性が最強 |

### Tier 3: 参考

| 技術 | 開発 | メモ |
|------|------|------|
| Zhipu GLM-Image | 智譜AI | オープンソース、テキスト描画強い |
| ByteDance BAGEL | バイトダンス | オープンソース、GPT-4o的マルチモーダル |
| MiniMax Hailuo 2.3 | MiniMax | 動画の表情保持が最高 |
| Wan2.1 | アリババ | オープンソース動画、キャラアニメ |
| Kolors | 快手 | VTON対応、アジア人◎ |

---

## 3. 注目技術の詳細

### Alibaba EcomID（最注目）
- **PuLID + InstantID の良いとこ取り**をEC用に最適化
- 単一の参照画像から、年齢・髪型・メガネ等を変えても同一人物を保持
- **2M枚のECポートレート画像で学習済み** — まさにLuminaのユースケース
- ComfyUIネイティブプラグインあり
- HuggingFace: `alimama-creative/SDXL-EcomID`

### ByteDance Seedream 5.0
- **14枚の参照画像を同時入力可能** — 顔の角度・表情バリエーション対応
- Elo 1,225（ベンチマーク上位）
- **アジア人の顔のレンダリングが西側モデルより圧倒的に良い**
- API: $0.04/枚（WaveSpeed経由$0.025）

### ACE++（アリババ DAMO）
- FLUX.1-Fill-devベースの顔スワップ
- **学習不要（ゼロトレーニング）** — 参照画像を渡すだけ
- 顔 + ロゴのスワップに対応
- 3つの専用LoRA: ポートレート/オブジェクト/リージョン編集

---

## 4. ファッションブランドのAIモデル事例

| ブランド | 技術 | 成果 |
|---------|------|------|
| **Zalando** | AIデジタルツイン | Q4の70%がAI。コスト90%削減。6-8週→3-4日 |
| **H&M** | 30人のリアルモデルのAIツイン | 制作時間短縮 |
| **Imma（日本）** | CG+AI（Aww Inc.） | Tommy/Burberry/Apple/Alexander Wangとコラボ |
| **Balmain** | CGI「バーチャルアーミー」 | ダイバーシティキャンペーン |
| **Guess** | AI金髪モデル | Vogue掲載 |

**統計**: バーチャルインフルエンサーのエンゲージメント率2.84%（人間1.72%の約2倍）、キャンペーンコスト50%削減

---

## 5. 中国ECプラットフォーム（参考）

| サービス | 機能 | 実績 |
|---------|------|------|
| **Alibaba Pic Copilot** | 160+モデル、VTON、動画化 | Black Fridayで20万回以上利用。CVR 150%向上 |
| **WeShop AI** | 1枚→モデル生成+動画 | Shopify統合（4-5星） |
| **HuHu AI** | カスタムブランドモデル作成 | Shopifyアプリ |

---

## 6. BEDWINへの推奨戦略

### 即実行（今週）: EcomID + FLUX Kontext テスト

```
Step 1: EcomID（ComfyUI）でBEDWIN AIモデルの顔を生成
  → 単一の参照画像から一貫した顔を保持
  → EC向けポートレートに特化

Step 2: FLUX Kontextで服を着せる
  → 商品写真を参照画像として使用
  → EcomIDで生成した顔のモデルに着せ替え

Step 3: 品質比較
  → EcomID vs Seedream 5.0 vs FLUX LoRA
```

### 短期（2週間）: Face LoRA学習

```
1. AIモデルの「理想の顔」を20-30枚生成（EcomID or Seedream）
2. fal.ai flux-lora-portrait-trainer で学習（$6/回）
3. FLUX Kontext + Face LoRA でルックブック量産
```

### 中期（1ヶ月）: プロダクションパイプライン

```
FLUX Kontext + Face LoRA (0.6)  → ベース生成（服+モデル）
+ PuLID/EcomID (0.8)            → 顔の精密ロック
+ ControlNet (OpenPose)          → ポーズ制御
= 1枚 ~$0.04-0.08
```

### コスト比較

| 方式 | ルックブック50枚 | SNS月30枚 | 年間コスト |
|------|---------------|----------|----------|
| **プロ撮影** | ¥20-50万/回 | ¥5-10万/月 | ¥100-200万 |
| **AIモデル（提案）** | ¥300-600 | ¥180 | **¥5,000-60,000** |
| **コスト削減率** | — | — | **95-99%** |

---

## 7. 次のアクション

1. **今すぐ**: EcomIDをComfyUIで試す or Seedream 5.0 APIでテスト
2. **今週中**: BEDWINのAIモデルの「顔」を決定（3-5パターン生成→選定）
3. **来週**: Face LoRA学習 → ルックブック量産テスト
4. **BEDWIN訪問時**: 「商品写真アップ→AIモデル着用画像即時生成」をデモ

---

## Sources

### 西側技術
- fal.ai FLUX Kontext LoRA: https://fal.ai/models/fal-ai/flux-kontext-lora
- fal.ai LoRA Portrait Trainer: https://fal.ai/models/fal-ai/flux-lora-portrait-trainer
- FLUX 2 Max (Replicate): https://replicate.com/black-forest-labs/flux-2-max
- InstantID: https://arxiv.org/abs/2401.07519
- PuLID + FLUX Kontext: https://www.runcomfy.com/comfyui-workflows/flux-kontext-pulid-consistent-character-generation
- Runway Gen-4 References: https://help.runwayml.com/hc/en-us/articles/40042718905875

### 中国系技術
- Alibaba EcomID: https://huggingface.co/alimama-creative/SDXL-EcomID
- ACE++: https://github.com/ali-vilab/ACE_plus
- ByteDance Seedream 5.0: https://seed.bytedance.com/en/seedream4_5
- Tencent HunyuanImage 3.0: https://github.com/Tencent-Hunyuan/HunyuanImage-3.0
- Kling 3.0: https://gaga.art/blog/kling-3-0/
- MiniMax Hailuo 2.3: https://www.minimax.io/news/minimax-hailuo-23

### ブランド事例
- Zalando AI: Fashion Brands Using AI Models
- Imma (日本): https://fashiontechnews.zozo.com/en/philosophy/imma
- Virtual Influencer Market: https://marketingagent.blog/2025/11/02/virtual-influencers-vs-human-influencers

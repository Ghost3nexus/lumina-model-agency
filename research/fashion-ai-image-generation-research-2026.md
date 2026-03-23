# ファッションEC商品画像 AI生成技術 調査レポート

**調査日:** 2026年3月12日
**調査者:** TomorrowProof Research Agent
**対象:** ベースモデル比較、LoRA学習手法、商品形状保持技術、推論ホスティング、最新動向

---

## エグゼクティブサマリー

### 推奨構成（結論）

| 項目 | 推奨 | 理由 |
|------|------|------|
| **ベースモデル** | **FLUX.2 [dev]**（32Bパラメータ） | 2025年11月リリース。フォトリアリズム・テキスト描画・手の描写で最高品質。マルチリファレンス対応。FLUX.1 [dev] も依然有力な選択肢 |
| **LoRA学習ツール** | **SimpleTuner**（本番用）/ **AI-Toolkit**（プロトタイプ用） | SimpleTuner はFLUXアーキテクチャにネイティブ対応、15-25%高速。AI-Toolkit はイテレーション速度に優れる |
| **キャプション生成** | **Florence-2-large-PromptGen v1.5** + 手動レビュー | ファッション特有のディテール記述に優れ、BLIP-2より詳細なキャプション生成 |
| **形状保持** | **ControlNet Union Pro（Canny+Depth）+ IP-Adapter** | 構造保持とスタイル制御を両立。FLUX.2エコシステムで成熟 |
| **顔一貫性** | **InstantID** + **PhotoMaker V2** | 単一画像からゼロショットで顔一貫性を維持。LoRA不要 |
| **推論ホスティング** | **Modal**（開発・中規模） / **RunPod Serverless**（大規模コスト最適化） | Modal: ~$0.01/画像、コールドスタート<4秒、Python-native DX。RunPod: 大規模時に40-50%安価 |
| **VTON手法** | **CatVTON**（軽量・高速） / **FitDiT**（高忠実度） | CatVTON: ICLR 2025採択、8GB VRAM以下で動作。FitDiT: ディテール保持に優れる |

---

## 1. ベースモデル比較

### 1.1 詳細比較表

| 比較項目 | FLUX.2 [dev] (2025/11) | FLUX.1 [dev] | Stable Diffusion 3.5 | SDXL 1.0 |
|---------|----------------------|--------------|----------------------|----------|
| **画質（フォトリアリズム）** | ★★★★★ 最高品質。32Bパラメータ、マルチリファレンス対応 | ★★★★☆ 12Bパラメータ、SDXLより大幅改善。手・解剖学的正確性で優位 | ★★★☆☆ SD3から改善されたが、FLUXには及ばない | ★★★☆☆ 良好だが手・複雑な構図で問題あり |
| **テキスト描画** | ★★★★★ 最高精度のフォント描画 | ★★★★★ テキスト描画で圧倒的優位 | ★★★★☆ SD3で改善、FLUXには及ばない | ★★☆☆☆ テキスト描画は苦手 |
| **プロンプト遵守** | ★★★★★ 全要素を正確に反映 | ★★★★★ 複雑なプロンプトでも全要素を反映 | ★★★★☆ 改善されたが一部要素の欠落あり | ★★★☆☆ 複雑なプロンプトで要素欠落が多い |
| **LoRA学習の容易さ** | ★★★☆☆ SimpleTuner/AI-Toolkit対応。エコシステム発展中 | ★★★★☆ SimpleTuner/AI-Toolkit/kohya_ss対応。エコシステム成熟 | ★★★☆☆ kohya_ss対応。コミュニティLoRA少ない | ★★★★★ kohya_ss完全対応。最も豊富なLoRA資産 |
| **ControlNet/IP-Adapter** | ★★★☆☆ 対応開始、急速に発展中 | ★★★★☆ XLabs/InstantX提供。Canny, Depth, HED, Pose, IP-Adapter対応 | ★★★☆☆ 限定的な対応 | ★★★★★ 最も成熟したエコシステム。全ControlNet対応 |
| **推論速度** | ★★☆☆☆ 32Bパラメータのため最も遅い | ★★★☆☆ SDXLの約4倍遅い | ★★★★☆ 複数サイズ（Medium/Large）で速度選択可 | ★★★★★ 最速。ControlNet込みでも高速 |
| **VRAM要件** | 90GB+（フル精度） | 24GB+（bf16）、12GB+（fp8） | 8-16GB（サイズ依存） | 8-12GB |
| **商用ライセンス** | 非商用無料 / 商用は要ライセンス | 非商用無料 / 商用: $999/月 + $0.01/画像（10万枚まで基本料に含む） | 年間売上$1M未満は無料 / $1M以上はEnterprise契約 | CreativeML Open RAIL-M（商用利用可、制限あり） |
| **コミュニティ・エコシステム** | ★★★☆☆ 新しいが急成長中 | ★★★★☆ 2024-2025で急速に成熟 | ★★★☆☆ Stability AIのサポート不安定 | ★★★★★ 最大のコミュニティ。CivitAIに膨大なLoRA/モデル |
| **ファッション特化実績** | ★★★☆☆ ファッション写真ワークフロー登場開始 | ★★★★☆ ファッション撮影ワークフロー確立。ComfyUIテンプレート多数 | ★★☆☆☆ 実績少ない | ★★★★☆ 多数のファッションLoRA。長い実績 |

### 1.2 FLUX.2 [dev] の新機能（2025年11月リリース）

- **32Bパラメータ**: FLUX.1 [dev]の12Bから大幅増
- **マルチリファレンス**: 複数の参照画像から類似バリエーションを生成
- **画像編集**: 単一/複数リファレンス画像によるin-context編集
- **FLUX.2 [klein]**: 4B/9Bの軽量版。コンシューマGPUでサブ秒生成（2026年1月リリース）
- **Apache 2.0ライセンス版**: kleinシリーズは完全オープンソース

### 1.3 推奨判断

**短期（2026 Q1-Q2）**: FLUX.1 [dev] を推奨。エコシステムの成熟度、LoRA学習の実績、ControlNet対応の充実度で最もバランスが良い。

**中期（2026 Q3以降）**: FLUX.2 [dev] への移行を計画。エコシステムの成熟に伴い、32Bモデルの品質優位が活きる。コスト最適化にはFLUX.2 [klein] 9Bも有力。

---

## 2. LoRA学習手法

### 2.1 ツール比較

| 項目 | kohya_ss (sd-scripts) | AI-Toolkit (Ostris) | SimpleTuner (bghira) |
|------|----------------------|--------------------|--------------------|
| **対応モデル** | SD1.5, SDXL, SD3, FLUX.1（FLUX.2は成熟中） | FLUX.1, FLUX.2 に最適化 | FLUX.1, FLUX.2 にネイティブ対応 |
| **学習速度** | 標準 | 20-30%高速（vs SimpleTuner） | 15-25%高速（vs kohya_ss for FLUX.2） |
| **GUI対応** | あり（ブラウザGUI） | CLI中心 | CLI中心 |
| **LoRA+対応** | あり（LoRA-A/B別学習率） | 部分対応 | 対応 |
| **DeepSpeed対応** | 限定的 | あり | あり |
| **量子化学習** | FP16/BF16 | FP8対応 | FP8対応、VRAM最適化 |
| **推奨用途** | SDXL LoRA、初心者 | FLUXプロトタイピング、高速イテレーション | FLUX本番LoRA、高品質学習 |
| **コミュニティ** | 最大、ドキュメント豊富 | 成長中 | 成長中、GitHub Discussion活発 |

### 2.2 推奨パラメータ（FLUX.1 [dev] ファッション商品LoRA）

```yaml
# SimpleTuner / AI-Toolkit 共通推奨値
model: FLUX.1-dev
resolution: 1024x1024
lora_rank: 48          # 商品アイデンティティ保持と柔軟性のバランス
                       # 単純な概念: 32, 複雑な概念: 64-128
learning_rate: 0.0004  # 標準値。単純概念: 0.003, 複雑: 0.0015
lr_scheduler: cosine   # 序盤で広いパターン学習、終盤で微調整
batch_size: 1          # 小規模データセットでは1で十分
total_steps: 1000      # 小規模(~20枚): 500, 大規模(~50枚): 1500
precision: bf16        # fp8も可だが品質低下あり
optimizer: AdamW8bit   # VRAM節約
dataset_size: 20-40枚  # 50枚以上は収穫逓減
```

### 2.3 キャプション生成方法

| 手法 | 品質 | 速度 | ファッション適性 | 推奨度 |
|------|------|------|----------------|--------|
| **Florence-2-large-PromptGen v1.5** | ★★★★★ | 高速 | 詳細なキャプション生成、ファッション記述に優れる | **最推奨** |
| **BLIP-2** | ★★★★☆ | 高速 | 一般的なキャプション、ファッション固有詳細の欠落あり | 良好 |
| **CogVLM** | ★★★★☆ | 中速 | 詳細だが過剰記述の傾向 | 良好 |
| **WD14 Tagger** | ★★★☆☆ | 最速 | Booruタグ形式、自然言語でない | SDXL向き |
| **手動キャプション** | ★★★★★ | 最遅 | 最高品質だがスケールしない | 小規模データセット |

**推奨パイプライン:**
1. Florence-2で自動キャプション生成
2. 手動レビューで修正（特にファッション固有の素材・ディテール記述）
3. トリガーワードの一貫した付与

**キャプション記述例（ファッション商品）:**
```
"a confident woman with short dark hair standing in a modern studio,
wearing a navy blue tailored blazer with gold buttons, silk lining visible,
paired with high-waisted cream trousers, professional studio lighting,
white seamless background"
```

### 2.4 学習データ前処理パイプライン

```
1. 画像収集（20-40枚）
   ├── 多角度撮影（正面、背面、45度、ディテール）
   ├── 異なる背景（白背景、スタジオ、着用イメージ）
   └── 異なるライティング条件

2. 前処理
   ├── リサイズ: 1024x1024（アスペクト比保持、パディング or クロップ）
   ├── 色調補正: ホワイトバランス統一
   ├── 背景除去（任意）: rembg / SAM2
   └── 品質フィルタリング: ブレ・ノイズ画像除外

3. キャプション生成
   ├── Florence-2 自動キャプション
   ├── 手動レビュー・修正
   ├── トリガーワード付与（例: "BRAND_jacket"）
   └── メタデータ整理（JSON/テキスト形式）

4. 学習実行
   ├── SimpleTuner or AI-Toolkit
   ├── 推奨パラメータ適用
   └── 検証画像で品質チェック（500ステップごと）
```

---

## 3. 商品形状保持技術

### 3.1 ControlNet のファッション適用

| ControlNet種別 | 用途 | ファッション適性 | 推奨度 |
|---------------|------|----------------|--------|
| **Canny** | エッジ検出による構造保持 | 衣服のシルエット・縫い目保持に最適 | ★★★★★ |
| **Depth** | 深度マップによる立体構造保持 | ドレープ・しわの3D構造保持 | ★★★★★ |
| **Pose (OpenPose)** | 人体ポーズ制御 | モデル着用ポーズの指定 | ★★★★☆ |
| **HED** | ソフトエッジ検出 | Cannyより柔らかい構造制御 | ★★★★☆ |
| **Tile** | タイル分割による高解像度 | ディテール保持のアップスケール | ★★★★☆ |

**FLUX.1向け推奨ControlNetモデル:**
- **InstantX ControlNet Union Pro**: Canny, Depth, Tile, Blur, Pose, Grayを統合。最も汎用的
- **XLabs ControlNet V3**: Canny, Depth, HED個別モデル。1024x1024学習済み

**ファッション撮影ワークフロー例（ComfyUI）:**
- ControlNet Pose（体のキーポイント制御）+ Canny（衣服構造保持）
- LoRA: ファッション写真スタイル（weight=0.7）+ ポートレート品質（weight=0.4）

### 3.2 IP-Adapter による衣服アイデンティティ保持

IP-Adapterは参照画像からセマンティック特徴を抽出し、生成画像に注入する技術。

**構成:**
- ControlNet = 構造制御（ポーズ、構図）
- IP-Adapter = 美的制御（スタイル、ライティング、衣服の見た目）

**ファッションEC向け活用:**
- 商品画像1枚から、異なるモデル・ポーズ・背景での着用画像生成
- ブランドの世界観（ライティング、色調）を統一した複数画像生成

### 3.3 Reference-only / img2img アプローチ

- **img2img（denoise strength 0.3-0.5）**: 元画像の構造を大きく維持しつつバリエーション生成。最も簡便
- **Reference-only**: 追加モデル不要で参照画像のスタイルを反映。ControlNetより軽量

### 3.4 顔一貫性技術

| 技術 | 特徴 | 必要画像数 | LoRA要否 | 推奨度 |
|------|------|-----------|---------|--------|
| **InstantID** | ゼロショット。単一画像から顔一貫性維持。ByteDance開発 | 1枚 | 不要 | ★★★★★ |
| **PhotoMaker V2** | 高忠実度ID保持。秒単位でカスタマイズ | 1枚 | 不要（V2） | ★★★★★ |
| **ConsistentID** | マルチビュー一貫性に特化 | 1枚 | 不要 | ★★★★☆ |
| **LoRA学習（顔）** | 最高品質だが学習コストあり | 10-20枚 | 必要 | ★★★★☆ |

**推奨:** InstantID + PhotoMaker V2の併用。単一画像からゼロショットで顔一貫性を維持でき、LoRA学習のコスト・時間を削減。

---

## 4. 推論ホスティング比較

### 4.1 プラットフォーム比較

| 項目 | Replicate | RunPod Serverless | Modal | Together AI |
|------|-----------|------------------|-------|-------------|
| **FLUX.1 [dev] 1画像コスト** | ~$0.030 | ~$0.008-0.015（推定） | ~$0.010 | 要問い合わせ |
| **FLUX.1 [schnell] 1画像コスト** | ~$0.003 | - | ~$0.003 | 無料（3ヶ月限定） |
| **FLUX.1 [pro] 1画像コスト** | ~$0.055 | - | - | 対応あり |
| **GPU時間単価（A100）** | $3.50-4.50/hr | $1.89-2.49/hr | $3.00-4.00/hr | 非公開 |
| **コールドスタート** | ~11秒 | ~4秒 | <4秒 | 不明 |
| **カスタムLoRA対応** | あり（Cog対応） | あり（Docker自由） | あり（Python-native） | 限定的 |
| **ControlNet対応** | あり（ComfyUI Deploy等） | あり（完全自由） | あり（コード記述） | 限定的 |
| **スケーラビリティ** | 自動スケール | 自動スケール | 自動スケール（最速） | 自動スケール |
| **DX（開発者体験）** | ★★★★★ 最も簡便 | ★★★☆☆ Docker知識要 | ★★★★★ Python-native | ★★★★☆ API中心 |
| **データ転送料** | あり | 無料 | あり | 不明 |
| **稼働率保証** | あり | あり | あり | あり |

### 4.2 コスト試算（月間10,000画像生成の場合）

| プラットフォーム | FLUX.1 [dev] | FLUX.1 [schnell] | 備考 |
|----------------|-------------|-----------------|------|
| **Replicate** | ~$300/月 | ~$30/月 | 最も簡便。追加開発コスト最小 |
| **RunPod Serverless** | ~$80-150/月 | - | GPU時間課金。バースト利用で最安 |
| **Modal** | ~$100/月 | ~$30/月 | コールドスタート最短。DX最高 |
| **BFL直接API** | - | - | Pro: $0.04/画像 = $400/月 |

### 4.3 推奨判断

- **プロトタイプ・小規模（~1,000画像/月）**: **Replicate** — 最小の開発コストで開始可能
- **中規模（1,000-50,000画像/月）**: **Modal** — Python-native DX、高速コールドスタート、自動スケール
- **大規模（50,000画像/月以上）**: **RunPod Serverless** — GPU時間単価で40-50%のコスト優位

---

## 5. 2025-2026年 ファッションAI最新動向

### 5.1 主要モデルリリース（2025-2026）

| 時期 | モデル/論文 | 概要 |
|------|-----------|------|
| 2025/07 | **CatVTON** (ICLR 2025採択) | 軽量VTON。899Mパラメータ、8GB VRAM以下。Concatenation方式で高速 |
| 2025/11 | **FLUX.2 [dev]** | 32Bパラメータ。マルチリファレンス、画像編集対応 |
| 2025/11 | **FitDiT** | DiTベースVTON。高忠実度ガーメントディテール保持 |
| 2025/12 | **CatV2TON** | CatVTONのDiT版。画像+動画バーチャル試着対応 |
| 2026/01 | **FLUX.2 [klein]** | 4B/9B軽量FLUX。サブ秒生成。Apache 2.0ライセンス |
| 2026 ICLR | **GarmentGPT** | 離散潜在トークン化によるガーメントパターン生成 |
| 2026 ICLR | **Inverse Virtual Try-On** | 着用画像から商品スタイル画像を逆生成 |
| 2026 | **IMAGGarment+** | 属性別拡散によるガーメント生成 |
| 2026 | **FashionMAC** | 変形フリーファッション画像生成、きめ細かいモデル外観カスタマイズ |

### 5.2 VTON（バーチャル試着）技術比較

| モデル | ベース | VRAM | 品質 | 速度 | 特徴 |
|--------|-------|------|------|------|------|
| **CatVTON** | SD1.5 UNet | <8GB | ★★★★☆ | 高速 | 軽量、パラメータ効率的学習(49.57M学習可能) |
| **IDM-VTON** | SD1.5 Dual-UNet | ~16GB | ★★★★★ | 中速 | IP-Adapter + GarmentNet。ワイルド環境対応 |
| **FitDiT** | DiT | ~16GB | ★★★★★ | 中速 | 高忠実度ディテール保持。2024/11公開 |
| **OOTDiffusion** | SD1.5 Dual-UNet | ~12GB | ★★★★☆ | 中速 | Outfitting Fusion。AAAI採録 |
| **CatV2TON** | DiT | TBD | ★★★★★ | TBD | 画像+動画VTON対応 |

**動画VTON（2025-2026新潮流）:**
- **Eevee**, **MagicTryOn**, **DreamVVT** — Diffusion Transformerベースの動画バーチャル試着

### 5.3 市場動向

- AI生成ファッション撮影市場: 2024年$15.1億 → 2025年$20.1億（成長率33%）
- AIファッション市場全体: 2025年$28.9億、年成長率39.8%
- **コスト削減効果**: 従来撮影比80-90%コスト削減、制作速度3-10倍
- 主要商用ツール: Modelia（Shopify連携）、Claid AI、SellerPic、WeShop AI

---

## 6. 推奨構成と実装ロードマップ

### 6.1 Phase 1: MVP（2026 Q1-Q2）

```
ベースモデル:  FLUX.1 [dev]
LoRA学習:     AI-Toolkit（高速イテレーション）
キャプション:  Florence-2 + 手動レビュー
形状保持:     ControlNet Canny + IP-Adapter
顔一貫性:     InstantID
ホスティング:  Replicate（最小開発コスト）
VTON:         CatVTON（軽量、8GB VRAM）
推定コスト:    ~$300/月（10,000画像）
```

### 6.2 Phase 2: スケール（2026 Q3-Q4）

```
ベースモデル:  FLUX.2 [dev] に移行
LoRA学習:     SimpleTuner（本番品質）
形状保持:     ControlNet Union Pro + IP-Adapter
ホスティング:  Modal に移行（コスト最適化 + DX）
VTON:         FitDiT or CatV2TON
推定コスト:    ~$100-200/月（10,000画像）
```

### 6.3 Phase 3: 最適化（2027 Q1-）

```
ベースモデル:  FLUX.2 [klein] 9B（コスト最適化）or 最新モデル
ホスティング:  RunPod Serverless（大規模最適化）
VTON:         動画VTON対応
```

---

## 7. 技術的リスクと軽減策

| リスク | 影響度 | 発生確率 | 軽減策 |
|--------|--------|---------|--------|
| **FLUX.2商用ライセンスコスト増** | 高 | 中 | FLUX.2 [klein] Apache 2.0版を代替候補に。SD3.5（$1M以下無料）もフォールバック |
| **LoRA過学習による画像の多様性低下** | 中 | 高 | Rank 48以下に抑制、データ拡張、正則化画像の使用、500ステップごとの検証 |
| **ControlNetエコシステムの分断** | 中 | 中 | InstantX ControlNet Union Proに統一。モデル互換性を定期テスト |
| **推論コストの予期せぬ増加** | 高 | 中 | FP8量子化でVRAM半減、バッチ処理、キャッシュ層の導入 |
| **VRAM不足（FLUX.2 [dev] 90GB+）** | 高 | 高 | FLUX.2 [klein] 9B（~20GB）を採用。またはFP8量子化でFLUX.1 [dev]を12GBで運用 |
| **Stability AI事業継続リスク** | 中 | 中 | SD3.5依存を避け、FLUXをメインに。SD3.5はフォールバックのみ |
| **生成画像の品質一貫性** | 高 | 中 | ControlNet + IP-Adapterの多重制御。シード固定 + プロンプトテンプレート化 |
| **法的リスク（生成画像の著作権）** | 高 | 低 | 商用ライセンス取得の徹底。生成画像のメタデータにAI生成マーク |

---

## Sources

- [SDXL vs Flux1.dev models comparison - Stable Diffusion Art](https://stable-diffusion-art.com/sdxl-vs-flux/)
- [Stable Diffusion 3.5 vs. Flux - Modal](https://modal.com/blog/best-text-to-image-model-article)
- [Flux vs SDXL 2026 - PXZ.ai](https://pxz.ai/blog/flux-vs-sdxl)
- [Flux vs Stable Diffusion: Technical Comparison 2026](https://pxz.ai/blog/flux-vs-stable-diffusion:-technical-&-real-world-comparison-2026)
- [Best Open-Source AI Image Generation Models 2026 - Pixazo](https://www.pixazo.ai/blog/top-open-source-image-generation-models)
- [FLUX.2: Frontier Visual Intelligence - Black Forest Labs](https://bfl.ai/blog/flux-2)
- [FLUX.2 dev - Hugging Face](https://huggingface.co/black-forest-labs/FLUX.2-dev)
- [FLUX.2 Image Generation - NVIDIA Blog](https://blogs.nvidia.com/blog/rtx-ai-garage-flux-2-comfyui/)
- [Flux 2 Complete Guide - WaveSpeedAI](https://wavespeed.ai/blog/posts/flux-2-complete-guide-2026/)
- [FLUX.2 LoRA Training Guide 2026 - Medium](https://kgabeci.medium.com/flux-2-lora-training-the-complete-2026-guide-from-someone-who-built-the-training-platform-14d0bcb396eb)
- [Flux 2 LoRA Training Complete Guide 2025 - Apatero](https://apatero.com/blog/flux-2-lora-training-complete-guide-2025)
- [FluxGYM Alternatives - Apatero](https://apatero.com/blog/fluxgym-alternatives-lora-training-guide-2025)
- [Opinionated Guide to All Lora Training 2025 - Civitai](https://civitai.com/articles/1716/opinionated-guide-to-all-lora-training-2025-update)
- [LoRA Training Best Practices 2025 - Apatero](https://apatero.com/blog/lora-training-best-practices-flux-stable-diffusion-2025)
- [Flux Training Tips & Tricks 2025 - Apatero](https://apatero.com/blog/flux-training-tips-tricks-complete-guide-2025)
- [Fine-tuning FLUX.1-dev style LoRA - Modal](https://modal.com/blog/fine-tuning-flux-style-lora)
- [Easy Flux LoRA Training Guide 2026 - Segmind](https://blog.segmind.com/easy-flux-lora-training-guide/)
- [Florence-2-large-PromptGen v1.5 - Hugging Face](https://huggingface.co/MiaoshouAI/Florence-2-large-PromptGen-v1.5)
- [FLUX.1 ControlNet + IP-Adapter in ComfyUI - DCAI](https://www.digitalcreativeai.net/en/post/detailed-usage-flux-1-controlnet-ip-adapter-comfyui)
- [Photorealistic Fashion Photography with FLUX.1 and ControlNet - ComfyUI.org](https://comfyui.org/en/photorealistic-fashion-photography-with-flux1-and-controlnet)
- [FLUX ControlNet V3 Workflow - ComfyUI.org](https://comfyui.org/en/flux-controlnet-v3-workflow)
- [CatVTON - GitHub (ICLR 2025)](https://github.com/Zheng-Chong/CatVTON)
- [Top 4 Open Source VITON Models - fashn.ai](https://fashn.ai/blog/comparing-the-top-4-open-source-virtual-try-on-viton-models)
- [IDM-VTON - GitHub (ECCV 2024)](https://github.com/yisol/IDM-VTON)
- [InstantID](https://instantid.github.io/)
- [PhotoMaker - GitHub (CVPR 2024)](https://github.com/TencentARC/PhotoMaker)
- [GenAI in Fashion Papers - GitHub](https://github.com/wendashi/Cool-GenAI-Fashion-Papers)
- [Fashion AI: 7 Key Use Cases 2026 - fashn.ai](https://fashn.ai/blog/fashion-ai-7-key-use-cases-in-2026)
- [AI Fashion Model Generator Guide 2026 - Claid](https://claid.ai/blog/article/ai-fashion-model-generators)
- [FLUX.1 Dev License - Black Forest Labs](https://bfl.ai/licensing)
- [Self-Hosted Commercial License - BFL](https://bfl.ai/legal/self-hosted-commercial-license-terms)
- [Stability AI License](https://stability.ai/license)
- [RunPod vs Modal vs AWS 2026 - AI Pricing Master](https://www.aipricingmaster.com/blog/runpodvsModalvsAWS)
- [Serverless Inference Providers Compared 2026](https://dat1.co/blog/serverless-inference-providers-compared)
- [Serverless GPU Modal vs Replicate vs RunPod - Markaicode](https://markaicode.com/serverless-gpu-modal-vs-replicate/)
- [Modal Pricing](https://modal.com/pricing)
- [Replicate Pricing](https://replicate.com/pricing)
- [Together AI Pricing](https://www.together.ai/pricing)
- [AI Image Model Pricing Comparison 2026 - Price Per Token](https://pricepertoken.com/image)
- [Flux 2 Developer Guide - fal.ai](https://fal.ai/learn/devs/flux-2-developer-guide)
- [FLUX.2 LoRA Training with AI Toolkit - RunComfy](https://www.runcomfy.com/trainer/ai-toolkit/flux-2-dev-lora-training)

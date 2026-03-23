【TomorrowProof Council / 2026年03月19日】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 議題: FLUX Kontext + LoRA パイプライン技術方針 — 競合成功パターンを踏まえた再設計
🎯 決めること: botika品質に到達するための正しいアーキテクチャを確定する
👥 参加エージェント: CEO / Dev / Research / EC Director / CFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎯 CEO: 議題整理

3/18にVTON→FLUX Kontext移行、3/19にLoRA学習→統合を一気にやったが沼った。
一歩引いて「うまく行ってる奴ら」のやり方を調べてからアーキテクチャを決め直す。

### 現状の問題（本番UIで確認）
1. LoRA入れたら商品が変わる（ガーメント忠実度低下）
2. 選択モデルと違う人が出る（プロンプトのモデル記述が効かない）
3. マルチアングルで人が変わる（→front画像再利用で改善済みだが不完全）
4. ライティングが平坦（影比率1:1.5、目標1:2.5）
5. 白飛び（→enforceWhiteBackground無効化で対処済み）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🔭 Research: 競合調査結果

### ■ botika.com — 業界リーダー

**技術アプローチ**:
- 独自Foundation Model（汎用AIベースではない）
- 10年以上のComputer Vision研究をベース
- ファッション特化データで学習（布のドレープ、折り、伸び、物理挙動を理解）
- 100% AI生成モデル（実在人物ベースではない）
- ワークフロー: Upload product → Pick model → Pick pose/background → Generate → Review → Refine

**品質の秘密**:
- 汎用AIの弱点（変な手、歪むロゴ、物理に反する服）を専用モデルで解消
- Human QAレイヤーあり（顧客から「髪直して」等のフィードバック対応可能）
- **プロンプト不要** — UIで選ぶだけ

**実績**: 3,000+ブランド、-90%撮影コスト、40x高速化（6週間→24時間）
**価格**: $25/月〜
**弱点**: 日本語非対応、モール規格非対応

### ■ kive.ai — クリエイティブAIプラットフォーム

**技術アプローチ**:
- **Product Shots**: 商品画像を数枚アップロード → カスタムAIモデルを学習 → 無限にオンブランドシーン生成
- **Studio**: プリセット環境（ライティング、背景、構図を自動処理）
- ベストインクラスのモデルを統合（Google Veo 3, Kling 2.1等）
- 3分以内で商品画像→商業写真変換

**kiveが解決したこと**:
- 「Studio」概念 = ブランド一貫性の仕組み化（毎回設定不要）
- カスタムAIモデルを**商品ごとに学習** → 驚くほど高い商品精度
- チームコラボレーション（クラウドライブラリ、AI タグ付け）

**Luminaへの示唆**: Studio概念 + 商品ごとのカスタム学習は参考になる

### ■ 競合ランドスケープ（全9社比較）

| サービス | 技術アプローチ | 価格 | 品質 | 差別化 |
|---------|-------------|------|------|--------|
| **botika** | 独自Foundation Model | $25/月〜 | S | Fashion専用AI、Human QA |
| **WearView** | Text-to-model + pose control | $29-99/月 | A | 統合ワークスペース、4K |
| **Photoroom** | 汎用AI + fashion feature | $13-35/月 | A- | モバイル最強、背景除去込み |
| **Claid.ai** | API-first | $19-49/月 | A | 開発者向け、4K、ロゴ保持 |
| **Uwear** | 独自Drape AI | $0.10/クレジット | A- | 大量バッチ、10,000枚一括 |
| **Modelia** | 一貫キャラ生成 | $12-85/月 | B+ | Shopify統合、同一モデル保持 |
| **kive** | カスタムAI学習 + Studio | 不明 | A | 商品ごと学習、ブランド一貫性 |
| **Pixa** | モバイルファースト | $10/月 | B | ランウェイ動画、低価格 |
| **Lumina（現状）** | FLUX Kontext + LoRA | $0.08/画像 | **B** | コスト最安、日本特化 |

### ■ オープンソース注目プロジェクト

**1. OpenTryOn** (GitHub 460★)
- マルチプロバイダー対応（Amazon Nova Canvas, Kling, FLUX.2等）
- ガーメントセグメンテーション + ポーズ推定 + 拡散モデル合成
- LangChain統合でAIエージェント化可能
- → **Luminaのバックエンドとして検討価値あり**

**2. IMAGDressing** (AAAI 2025)
- Garment UNet: CLIPのセマンティック + VAEのテクスチャを統合
- ControlNet統合でポーズ制御
- IP-Adapter互換で顔一貫性
- 30万ペアのIGPairデータセット公開
- → **ガーメント忠実度の技術参考**

**3. EcomID** (Alibaba, GitHub)
- SDXL + PuLID IP-Adapter + ControlNet（200万枚の人物画像で学習）
- 顔の一貫性をID特徴量で保証（年齢・髪型・メガネに依存しない）
- InstantID/PuLIDより高品質（Alibaba公式比較）
- → **モデル一貫性問題の解決策として最有力**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ⌨️ Dev: 技術分析

**スタンス: アーキテクチャ再設計が必要**

現在の問題を競合アプローチと比較:

| 我々の問題 | 競合の解決法 | 必要な技術 |
|-----------|-----------|----------|
| ガーメント忠実度低下 | 独自学習（botika）/ Drape AI（Uwear） | **LoRAオフ → base Kontextのgarment preservationを活かす** |
| モデルが毎回変わる | EcomID（Alibaba）/ Modelia一貫キャラ | **EcomID or InstantID導入** |
| ライティング平坦 | Studio概念（kive）/ プリセット環境 | **ライティングプリセット + プロンプト最適化** |
| マルチアングル不一致 | botika: 同一モデルID + ポーズ変更 | **EcomID + front画像ベースのポーズ変更** |

**提案アーキテクチャ（v2）**:
```
[入力] ガーメント画像
  ↓
[Step 1] FLUX Kontext base（LoRAなし）: ガーメント → モデル着用フロント画像
  ↓
[Step 2] EcomID / InstantID: フロント画像からモデルID特徴量を抽出
  ↓
[Step 3] FLUX Kontext + ID特徴量: 同一モデルでback/side/bust生成
  ↓
[Step 4] Real-ESRGAN 4x アップスケール
  ↓
[出力] マルチアングルEC写真（同一モデル、4K）
```

**即座にできること**:
1. LoRAオフ（品質B+ → A-へ改善見込み）
2. プロンプトのライティング記述A/Bテスト
3. EcomID/InstantIDのfal.ai対応を調査

## 🛒 EC Director: EC実務視点

**スタンス: botika/kiveのワークフローを真似ろ**

botika成功の本質は技術ではなく**ワークフロー設計**:
- プロンプト不要（UIで選ぶだけ）
- Upload → Pick model → Pick pose → Generate → Refine
- Human QAレイヤー

kive成功の本質は**Studio概念**:
- ブランドごとに一度Studio設定 → 以降は全商品同じスタイル
- 商品ごとにカスタムAI学習 → 高い商品精度

**Luminaに必要なこと**:
1. プロンプトを触らせない（バックエンドで最適プロンプトを自動生成）
2. 「Studio」概念の導入（ライティング・背景・モデルをプリセット化）
3. モデルIDを保持する仕組み（ECでは同一モデルが必須）

## 💰 CFO: 財務視点

**スタンス: base最適化 → EcomID調査の2段階で進めろ**

| 施策 | コスト | 期待効果 | ROI |
|------|--------|---------|-----|
| LoRAオフ | ¥0 | 品質B→B+（ガーメント忠実度回復） | ∞ |
| プロンプト最適化 | ¥0 | ライティング改善 | ∞ |
| EcomID調査 | ¥0（調査のみ） | モデル一貫性問題の解決見込み | 高 |
| EcomID統合 | ~¥5,000（API費） | 品質A到達の可能性 | 高 |
| LoRA再学習（200ペア） | ~¥10,000 | ECスタイル底上げ | 中（後回し推奨） |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ⚡ 対立点・論点:

| 論点 | A案: base最適化のみ | B案: base + EcomID統合 |
|------|-------------------|---------------------|
| 即効性 | ✅ 今日中 | △ 2-3日 |
| モデル一貫性 | ❌ seed頼み | ✅ ID特徴量で保証 |
| 品質上限 | B+〜A- | A |
| 実装リスク | 低 | 中（API統合） |
| コスト | $0.06/画像 | $0.08-0.10/画像 |

| 論点 | C案: OpenTryOn導入 | D案: botika方式（独自モデル） |
|------|-------------------|--------------------------|
| 品質 | プロバイダー依存 | S級 |
| 開発期間 | 1-2週間 | 6ヶ月+ |
| コスト | 中 | ¥100万+ |
| 現実性 | ✅ | ❌ 今のフェーズでは非現実的 |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 👁 CEO 最終判断:

**決定: B案 — base Kontext最適化 + EcomID/InstantID調査→導入**

**理由**:
1. LoRAは今の56ペア/キャプション無しでは害しかない。即オフ
2. base Kontextのガーメント忠実度はA評価 — これを殺してたのがLoRA
3. モデル一貫性がEC商用利用の最大のブロッカー。seedでは解決しない
4. EcomIDはAlibaba製でEC特化、まさに我々の課題にフィット
5. kiveのStudio概念は将来的にUIに取り入れる（Phase 4）
6. 独自Foundation Model（botika方式）は今のフェーズでは非現実的

**却下した案の理由**:
- A案: モデル一貫性が解決しない。ECで使い物にならない
- C案: OpenTryOnはVTON寄り。我々はConditional Generationで行く
- D案: botika方式は理想だが開発期間とコストが合わない

📌 **ネクストアクション**:

| # | アクション | 担当 | 期限 |
|---|-----------|------|------|
| 1 | **LoRAをオフにする** | Dev | 今すぐ |
| 2 | **base Kontextでライティング最適化**（A/B 5パターン） | Dev | 3/20 |
| 3 | **EcomID (fal.ai/ComfyUI) 技術調査 + PoC** | Research + Dev | 3/21 |
| 4 | **InstantIDのfal.ai対応確認** | Dev | 3/21 |
| 5 | **base品質でbotika比較レポート**（5ガーメント） | Dev | 3/22 |
| 6 | **kive Studio概念のUI設計メモ** | EC Director | 3/25 |
| 7 | **LoRA再学習はPhase 3に延期**（200ペア+キャプション必須） | — | 3/29〜 |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 参考リンク

**競合**:
- [botika - How We Create Our AI Fashion Models](https://botika.com/resources/thethread/how-we-create-our-ai-fashion-models-hint-no-real-people-no-prompts)
- [botika Products](https://botika.com/products)
- [kive.ai](https://kive.ai/)
- [kive Product Shots](https://kive.ai/features/studios)
- [WearView - 9 Best AI Fashion Model Generators](https://www.wearview.co/blog/best-ai-fashion-model-generators)

**技術**:
- [EcomID (Alibaba) - GitHub](https://github.com/alimama-creative/SDXL_EcomID_ComfyUI)
- [OpenTryOn - GitHub](https://github.com/tryonlabs/opentryon)
- [IMAGDressing (AAAI 2025) - GitHub](https://github.com/muzishen/IMAGDressing)
- [Cool GenAI Fashion Papers](https://github.com/wendashi/Cool-GenAI-Fashion-Papers)
- [Claid.ai - AI Fashion Model Generators Guide](https://claid.ai/blog/article/ai-fashion-model-generators)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📓 Journal Agent → journal/corp/2026/03/19-council-meeting-tech-architecture.md に保存済み

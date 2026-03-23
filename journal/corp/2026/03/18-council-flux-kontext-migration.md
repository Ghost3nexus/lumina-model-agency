# Council Meeting — FLUX Kontext パイプライン全面移行決定

**日付**: 2026-03-18
**参加**: CEO / Dev / CFO / EC Director / Planner / Research
**決定事項**: VTONを廃止し、FLUX Kontextベースの生成パイプラインに全面移行

---

## 背景

- VTONに3週間（25コミット）費やしたが一度もまともにモデル着用画像を生成できなかった
- 調査の結果、botika含む成功サービスは全てConditional Generation方式（VTON不使用）
- VTONは消費者向け試着体験のツールであり、EC商品撮影には構造的に不適切
- CEO承認済みのFLUX LoRA路線がConditional Generationそのもの

## 確定方針（ブレ禁止）

1. **FLUX Kontext + 独自LoRA** をメイン生成エンジンとする
2. **VTONには戻らない。議論も禁止**
3. **fal.ai** をプライマリプラットフォーム（Replicateはフォールバック）
4. 品質問題は「プロンプト改善」「LoRA再学習」「入力品質向上」で対処

## 技術構成

```
ガーメント画像 → fal CDN アップロード → 背景除去(BiRefNet)
  → FLUX Kontext生成(fal.ai) → 品質チェック(Canvas API)
  → アップスケール(Real-ESRGAN) → EC出力フォーマット
```

### コスト: ~$0.08/画像（botika $1.10の14倍安い）

| ステップ | コスト |
|---------|--------|
| アップロード + 背景除去 | 無料 |
| ガーメント分析 (Gemini) | ~$0.02 |
| FLUX Kontext生成 | ~$0.04 |
| アップスケール (ESRGAN) | ~$0.02 |
| 品質チェック (Canvas) | 無料 |

## ロードマップ

### Phase 1: 基盤構築（3/18-3/21）
- Day 1: API + アップロード基盤
- Day 2: サービス + UI統合
- Day 3: 背景除去 + プロンプト最適化
- Day 4: 5種テスト + CEO品質判定 #1

### Phase 2: 品質向上（3/22-3/28）
- 品質チェック + リトライ
- プロンプトエンジニアリング
- アップスケール統合

### Phase 3: 独自LoRA学習（3/29-4/11）
- データ収集 + LoRA v1-v5反復学習
- CEO品質判定でbotika到達確認

### Phase 4: プロダクション化（4/12-4/18）
- VTONコード削除、マルチビュー、モール規格対応

## API仕様

- fal.ai: `fal-ai/flux-pro/kontext` ($0.04/画像)
- fal.ai: `fal-ai/flux-kontext-lora` ($0.035/MP、LoRA対応)
- fal.ai: `fal-ai/flux-kontext-trainer` ($2.50/1000steps)
- fal.ai: `fal-ai/birefnet/v2` (背景除去、無料)

## 品質検証テストセット（固定）

1. 白Tシャツ（白飛びテスト）
2. 黒ジャケット（影ディテールテスト）
3. 柄物ワンピース（プリント再現テスト）
4. デニムパンツ（素材感テスト）
5. ニットセーター（テクスチャテスト）

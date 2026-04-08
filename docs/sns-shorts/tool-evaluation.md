# I2V Tool Evaluation — 2026-04-08

> RINKA GRWM動画（Instagram Reels用）制作のためのImage-to-Videoツール選定

---

## Kling 1.6（Kuaishou）

- **アクセス**: Web UI（https://klingai.com）+ API（Replicate / PiAPI経由も可）。メール・Google・Facebookでサインアップ。ブラウザベースでインストール不要。全世界対応済み
- **料金**:
  | プラン | 月額 | クレジット |
  |--------|------|-----------|
  | Free | $0 | 66クレジット/日（リフレッシュ制） |
  | Standard | $6.99 | 660/月 |
  | Pro | $25.99 | 3,000/月 |
  | Premier | $64.99 | 8,000/月 |
  | Ultra | ~$180 | 26,000/月 |
- **I2V機能**: 静止画アップロード → モーション付与。Standard Mode: 10クレジット/5秒、Professional Mode: 35クレジット/5秒。1080p対応（Pro tier）
- **9:16対応**: Y（16:9 / 9:16 / 1:1 対応）
- **出力制限**: 最大1080p / 30fps。5秒〜10秒（extend機能で延長可）。Kling 2.6ではネイティブオーディオ付きも可（クレジット3〜5倍）
- **人物品質**: 人物・顔の生成品質はトップクラス。顔参照システムとリップシンク技術で表情・口の動き・顔の安定性が高い。布の物理シミュレーションも自然。Runway Gen-3比で人物リアリズムは上回る評価が多い
- **判定**: **推奨（メインツール）** — 無料枠で検証可能。人物品質が高く、9:16対応。コスパも良い

### コスト試算（10クリップ × 5秒）
- Standard Mode: 10クレジット × 10 = 100クレジット → **Free枠（66/日×2日）で対応可能**
- Professional Mode: 35クレジット × 10 = 350クレジット → **Standardプラン($6.99)で対応可能**

---

## Seedance 2.0（ByteDance）

- **アクセス**: Dreamina（https://dreamina.capcut.com）経由で利用可能。CapCut統合版もあり（ブラジル・東南アジアから段階的ロールアウト中）。中国版はJimeng（即梦）。日本からはDreamina経由が確実
- **レイヤー編集**: シーンをレイヤー分離して構築可能。キャラクター・背景・オブジェクト・カメラワーク・照明・影を個別制御。最大12アセットを1プロジェクトに組み合わせ可能。フレーム単位の精密制御。既存動画の背景差し替え・キャラ入れ替え・カメラアングル変更も可能
- **I2V機能**: Y — 静止画→動画変換対応。シーンから動きを推論（髪の揺れ、雲の動き等）。テキスト・画像・音声・動画の統合マルチモーダル入力
- **料金**:
  | プラン | 月額 | 備考 |
  |--------|------|------|
  | Free | $0 | 225トークン/日（全ツール共有）。ウォーターマークあり |
  | Standard | ~$18 | Dreamina国際版 |
  | 上位プラン | ~$84 | Dreamina国際版 |
  | Jimeng（中国） | ~$9.60 (69 RMB) | 中国市場版（安い） |
  - 10秒Pro動画（720p）: 約1,880クレジット ≒ $1.91〜4.60/クリップ
- **9:16対応**: Y（16:9 / 9:16 / 4:3 / 3:4 / 21:9 / 1:1）。1080×1920対応
- **出力制限**: 最大1080p。4〜15秒
- **著作権問題**: MPA（米国映画協会）から著作権侵害の批判。ディズニーがCease & Desist送付（2026-02-13）。事業利用時のリスク要考慮
- **判定**: **要検証** — レイヤー編集機能は魅力的だが、1クリップあたりコストが高い（$1.91〜4.60）。著作権問題も懸念。日本からのアクセス安定性要確認

### コスト試算（10クリップ × 5秒）
- 最安見積もり: ~$19.10（$1.91 × 10）
- 標準見積もり: ~$46.00（$4.60 × 10）
- **Klingの10〜60倍のコスト**

---

## Runway Gen-3 Alpha

- **料金**:
  | プラン | 月額 | クレジット |
  |--------|------|-----------|
  | Free | $0 | 125クレジット（初回のみ） |
  | Standard | $12 | 625/月 |
  | Pro | $28 | 2,250/月 |
  | Unlimited | $76 | 無制限 |
  - Gen-3 Alpha: **10クレジット/秒**（10秒 = 100クレジット）
  - Gen-3 Alpha Turbo: **5クレジット/秒**（10秒 = 50クレジット）
  - 4Kアップスケール: +40クレジット/20秒
- **I2V機能**: 静止画アップロード + テキストプロンプトでモーション指定。Gen-3 Alpha / Turbo両方でI2V対応
- **9:16対応**: Y（1280×768 / 768×1280 / 1:1）。Act-Oneでも縦型対応
- **人物品質**: シネマティックな色彩・フィルムグレードの映像美はトップ。ただし人物のリアリズム・表情安定性ではKlingに劣る評価が多い。自然な動き（リップシンク・ジョギング等）は得意
- **判定**: **フォールバック** — 品質は高いが人物特化ではKlingが上。コストもKlingより高い。シネマティックな演出が必要な場合のサブツールとして

### コスト試算（10クリップ × 5秒）
- Gen-3 Alpha: 50クレジット × 10 = 500クレジット → **Standardプラン($12)では不足。Proプラン($28)が必要**
- Gen-3 Alpha Turbo: 25クレジット × 10 = 250クレジット → **Standardプラン($12)で対応可能**

---

## 比較サマリー

| 項目 | Kling 1.6 | Seedance 2.0 | Runway Gen-3 Alpha |
|------|-----------|--------------|-------------------|
| **I2V対応** | Y | Y | Y |
| **9:16対応** | Y | Y | Y |
| **最大解像度** | 1080p / 30fps | 1080p | 768×1280 |
| **最大尺** | 10秒（extend可） | 15秒 | 10秒 |
| **無料枠** | 66クレジット/日 | 225トークン/日（共有） | 125クレジット（初回のみ） |
| **人物品質** | ★★★★★ | ★★★★ | ★★★★ |
| **コスパ** | ★★★★★ | ★★ | ★★★ |
| **レイヤー編集** | なし | あり（強力） | なし |
| **10クリップ推定コスト** | **$0（Free枠）〜$6.99** | **$19〜46** | **$12〜28** |

---

## 結論

- **メインツール**: **Kling 1.6**
  - 理由: 人物動画品質がトップクラス。9:16/1080p対応。無料枠で検証可能。GRWM動画に必要な顔の安定性・表情・布の物理が最も優れている。コストパフォーマンスも圧倒的
- **フォールバック**: **Runway Gen-3 Alpha Turbo**
  - 理由: Klingで品質不足の場合のバックアップ。シネマティックな色味が必要な場合に有効。Turboなら$12/月で対応可能
- **将来検討**: **Seedance 2.0**
  - レイヤー編集機能は制作の自由度が高く魅力的だが、現時点ではコストが高すぎる。著作権問題の推移も要観察。CapCutとの統合が日本で利用可能になれば再評価

### 推定コスト（10クリップ × 各2〜4秒 = GRWM 1本分）
- **Kling Free枠**: **$0**（Standard Mode、2日分のクレジットで対応可能）
- **Kling Standardプラン**: **$6.99/月**（Professional Modeで高品質生成する場合）
- **Runway Turbo（フォールバック）**: **$12/月**

### 次のステップ
1. Kling Free枠でRINKAの静止画からテスト生成（9:16 / 5秒 / Standard Mode）
2. 顔の安定性・髪の動き・服の動きを確認
3. 品質OKならKlingで本制作開始
4. 品質不足ならRunway Gen-3 Alpha Turboでテスト

---

## 情報源

- [Kling AI Pricing (AI Tool Analysis)](https://aitoolanalysis.com/kling-ai-pricing/)
- [Kling AI Complete Guide 2026](https://aitoolanalysis.com/kling-ai-complete-guide/)
- [Kling AI Official Dev Portal](https://klingai.com/global/dev)
- [Kling AI Aspect Ratio Control (PixelDojo)](https://pixeldojo.ai/kling-ai-aspect-ratio-control)
- [Seedance 2.0 Official (ByteDance)](https://seed.bytedance.com/en/seedance2_0)
- [Seedance 2.0 Pricing Breakdown (Atlas Cloud)](https://www.atlascloud.ai/blog/case-studies/seedance-2.0-pricing-full-cost-breakdown-2026)
- [Seedance 2.0 on CapCut (TechCrunch)](https://techcrunch.com/2026/03/26/bytedances-new-ai-video-generation-model-dreamina-seedance-2-0-comes-to-capcut/)
- [Dreamina Seedance 2.0 (CapCut)](https://dreamina.capcut.com/tools/seedance-2-0)
- [Runway AI Pricing](https://runwayml.com/pricing)
- [Runway Gen-3 Alpha Help](https://help.runwayml.com/hc/en-us/articles/30266515017875-Creating-with-Gen-3-Alpha-and-Gen-3-Alpha-Turbo)
- [Runway Aspect Ratio Settings](https://help.runwayml.com/hc/en-us/articles/26113483666451-Changing-the-aspect-ratio-and-resolution)
- [Kling vs Runway Comparison (WaveSpeed AI)](https://wavespeed.ai/blog/posts/kling-vs-runway-gen3-comparison-2026/)
- [AI Video Tools Comparison 2026 (AI Creative Hub)](https://aicreativehub.eu/ai-video-tools/)

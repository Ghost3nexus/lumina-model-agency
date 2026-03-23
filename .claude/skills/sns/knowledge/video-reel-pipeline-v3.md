# 動画リールパイプライン v3.0 — 2026-03-13 Council決定

> v2.0からの変更: AI動画(Wan 2.1)主軸 → **Remotion(モーショングラフィクス)主軸**
> AI動画は文字化け・非現実的映像のため主力から撤退。Remotion 80% + AI動画 20%のハイブリッド。
> **v2.0は廃止。本ドキュメントが最新。**

---

## パイプライン構成

```
台本(Claude) → 競合バイラル3本分析
     ↓
[Type B/D] Remotionコンポーネント設計（React + TypeScript）
     ↓
ローカルレンダリング（1080x1920 / 30fps / H.264）
     ↓
[任意] ElevenLabsナレーション追加
     ↓
[任意] BGM合成（ffmpeg）
     ↓
出力: MP4 / 1080x1920 / Instagram Reels最適化
```

## コンテンツ4タイプ

| Type | 方式 | ツール | コスト/本 | 使用率 | 用途 |
|------|------|--------|----------|--------|------|
| **A: 画面録画** | QuickTime + テロップ + BGM | ffmpeg + PIL | ~¥0 | 10% | 操作デモ（信頼性最高） |
| **B: モーショングラフィクス** | キネティックテキスト + UIアニメ | **Remotion** | ¥0 | **60%** | 教育・統計・CTA（主力） |
| **C: AI動画** | 写真→動画 + テロップ | Hailuo 02 + PIL | ~¥40 | 10% | 雰囲気プロモ（限定） |
| **D: テキスト動画** | キネティックテロップ + BGM | **Remotion** | ¥0 | 20% | 豆知識・速報（最速） |

## Remotion構成

```
/tmp/mypro-remotion/           （→ リポジトリ統合予定）
├── src/
│   ├── index.ts               # エントリーポイント
│   ├── Root.tsx                # Composition定義
│   ├── components/
│   │   ├── TextReveal.tsx      # テキスト出現アニメーション
│   │   ├── SceneTransition.tsx # シーン切替
│   │   ├── CountUp.tsx         # 数字カウントアップ
│   │   └── CTABadge.tsx        # CTAボタン
│   └── reels/
│       ├── Reel1-PaperCard.tsx # 紙の名刺、まだ？
│       ├── Reel2-AiChat.tsx    # AI24時間営業
│       └── Reel3-30sec.tsx     # 30秒で名刺完成
├── public/                     # 静的アセット
└── out/                        # レンダリング出力
```

### Remotionコマンド
```bash
# プレビュー（ブラウザ）
npm run preview

# 個別レンダリング
npx remotion render src/index.ts Reel1-PaperCard out/reel1.mp4 --codec h264

# 全リール一括レンダリング
npm run render:all
```

### Remotion出力仕様
- 解像度: 1080x1920 (9:16)
- フレームレート: 30fps
- コーデック: H.264
- 尺: 10秒（300フレーム）
- フォント: ヒラギノ丸ゴ ProN（メイン）、Inter（英字）、Noto Sans JP（フォールバック）

## バイラルフォーマット（Remotion向け）

| # | フォーマット | Remotion構造 | マイプロ例 |
|---|------------|-------------|------------|
| 1 | **数字フック + 解説** | CountUp → TextReveal → CTA | 「名刺の92%は捨てられる」 |
| 2 | **Before/After** | Scene1問題 → Scene2解決 → CTA | 紙名刺→デジタル名刺 |
| 3 | **3ステップ** | ステップ1,2,3順番出現 → CTA | テンプレ選ぶ→入力→シェア |
| 4 | **チャットUI** | 吹き出しアニメーション → CTA | AI問い合わせ対応デモ |
| 5 | **比較表** | 左右対比アニメーション → CTA | 紙名刺 vs マイプロ |

## 制作前の必須プロセス

1. **競合バイラル3本分析**: 同ジャンルで直近1週間にバズった動画を3本視聴
   - フック手法（最初3秒で何をしているか）
   - テロップの出し方（フォント、色、タイミング）
   - 音声構成（BGM、ナレーション、効果音）
   - CTA配置と表現
2. **分析結果を台本に反映**してから制作開始

## 品質基準

- [ ] 解像度: 1080x1920 (9:16)
- [ ] フレームレート: 30fps
- [ ] フック: 最初3秒にスクロール停止要素
- [ ] テキスト: 文字化けゼロ（Remotion=ブラウザレンダリング）
- [ ] セーフゾーン: 下280px・右90px避ける
- [ ] CTA: 最終シーンに含む
- [ ] フォント: 丸ゴシック系
- [ ] 尺: 7-15秒（30秒超禁止）
- [ ] ブランド一貫性: ダーク×テック×ミニマル

## AI動画使用時（Type C限定）

### Hailuo 02 Standard（推奨）
- **API**: fal.ai `fal-ai/minimax/hailuo-02/standard/image-to-video`
- **コスト**: $0.045/秒 → ~$0.27/5秒クリップ
- **解像度**: 768p
- **注意**: ソース画像にテキスト/ロゴを含めない（文字化け防止）
- **用途**: 写真に微妙な動き（パララックス、ズーム）を加える場合のみ

### テキストオーバーレイ（AI動画後処理）
```python
# PIL テロップ生成パラメータ（v2.0から継続）
FONT = "/System/Library/Fonts/ヒラギノ丸ゴ ProN W4.ttc"
FONT_SIZE_MAIN = 80
FONT_SIZE_SUB = 48
COLOR_TEXT = (255, 255, 255)
COLOR_OUTLINE = (0, 0, 0)
COLOR_KEYWORD = (255, 255, 0)
OUTLINE_WIDTH = 4
SAFE_TOP = 200
SAFE_BOTTOM = 280
SAFE_RIGHT = 90
```

## ElevenLabs TTS（任意）
- Starterプラン: $5/mo (40,000文字)
- モデル: multilingual_v2
- 声: Asahi（ビジネス男性・日本語）
- Voice ID: GKDaBI8TKSBJVhsCLD6n

## コスト試算（v3.0）

| 項目 | 月額 | 備考 |
|------|------|------|
| Remotion | ¥0 | 3人以下無料 |
| Hailuo 02（月5本） | ~¥540 | $0.27 × 5 × 4週 |
| ElevenLabs | ¥750 | $5/mo固定 |
| BGM | ¥0 | Pixabay等フリー |
| **合計** | **~¥1,290/mo** | v2.0の¥4,350から70%削減 |

## Wan 2.1撤退理由（記録）

1. ビジネスプロモに不向き（SF/アート系出力）
2. テキスト/ロゴが文字化けする（拡散モデル共通の構造的問題）
3. 動きが不自然
4. 83%の消費者がAI動画を見抜き、36%が信頼低下
5. Remotionの方がコスト¥0、品質安定、量産可能

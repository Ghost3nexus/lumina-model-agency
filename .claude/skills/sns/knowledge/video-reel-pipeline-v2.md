# AI動画リールパイプライン v2.0 — 2026-03-13 Council決定

> v1.0からの変更: Replicate→fal.ai、Hailuo旧→Wan 2.6、VOICEVOX→ElevenLabs
> ハイブリッド制作（実写+AI演出）推奨。AI全自動は非推奨。

---

## パイプライン構成

```
台本(Claude) → 競合バイラル3本分析
     ↓
画像生成(Flux Schnell via Replicate MCP, 9:16)
     ↓
動画化(Wan 2.6 via fal.ai, 1080p, $0.25/clip)
  ※重要プロモ: Kling 3.0 Pro ($0.50/clip)
     ↓
ナレーション(ElevenLabs JP, $5/mo)
     ↓
テロップ画像(PIL: 丸ゴシック白+黒縁、キーワード色変え)
     ↓
結合(ffmpeg: 動画 + ナレーション + BGM + テロップ overlay)
     ↓
出力: 1080x1920 / 30fps / H.264 / 8Mbps / AAC 256kbps 48kHz
```

## コンテンツ3タイプ

| Type | 方式 | コスト/本 | 用途 |
|------|------|----------|------|
| **A: 画面収録デモ** | QuickTime録画 + テロップ + BGM | ~¥30 | アプリ操作デモ、信頼性最高 |
| **B: AI動画** | Flux→Wan 2.6→テロップ→BGM | ~¥140 | プロモ、ブランド動画 |
| **C: テキスト動画** | PIL/キネティックテロップ + BGM | ~¥10 | 統計・豆知識、最安最速 |

## バイラルフォーマット（効果順）

| # | フォーマット | 構造 | マイプロ例 |
|---|------------|------|----------|
| 1 | **職場あるある** | 寸劇→オチ→CTA | 名刺切れた営業マン |
| 2 | **Before/After** | 課題提示→変換→結果 | 紙名刺→デジタル名刺 |
| 3 | **Did you know?** | 衝撃統計→解説→CTA | 「名刺の92%は1週間で捨てられる」 |
| 4 | **画面収録デモ** | 操作開始→完成→シェア | 30秒で名刺作成 |

## 制作前の必須プロセス

1. **競合バイラル3本分析**: 同ジャンルで直近1週間にバズった動画を3本視聴
   - フック手法（最初1秒で何をしているか）
   - テロップの出し方（フォント、色、タイミング）
   - 音声構成（BGM、ナレーション、効果音）
   - CTA配置と表現
2. **分析結果を台本に反映**してから制作開始

## 品質基準（必須チェックリスト）

- [ ] 解像度: 1080x1920 (9:16)
- [ ] フレームレート: 30fps
- [ ] ビットレート: 8Mbps以上
- [ ] 尺: 7-15秒（30秒超禁止）
- [ ] フック: 最初1.7秒にスクロール停止要素
- [ ] 字幕: 全カットに付与（85%サイレント視聴）
- [ ] セーフゾーン: 下280px・右90px避ける
- [ ] BGM: あり（テック系アンビエント、控えめ）
- [ ] CTA: 最終カットに含む
- [ ] テロップフォント: 丸ゴシック系、白+黒縁取り

## API情報

### fal.ai (動画生成)
- **Wan 2.6 i2v**: `fal-ai/wan-i2v` — $0.25/clip, 1080p, 5s, Apache 2.0
- **Kling 3.0 Pro**: `fal-ai/kling-video/v2/master/image-to-video` — $0.50/clip, 4K対応
- **Hailuo 2.3 Pro**: `fal-ai/minimax/video-01-live` — $0.49/clip, 1080p

### ElevenLabs (TTS)
- Starterプラン: $5/mo (30,000文字)
- 日本語対応: multilingual_v2モデル
- 推奨声: ビジネス男性（低め・落ち着き）

### Replicate (画像のみ)
- Flux Schnell: 引き続きMCP経由で画像生成に使用

## コスト試算

| 項目 | 月額 | 備考 |
|------|------|------|
| fal.ai動画 | ~¥3,000 | 月20本 × 3clip × $0.25 |
| ElevenLabs | ¥750 | $5/mo固定 |
| BGM | ¥0 | Pixabay等フリー |
| **合計** | **~¥4,000/mo** | 予算¥10,000の40% |

## ffmpeg最終結合コマンド（テンプレート）

```bash
# 動画クリップ結合 + BGM + ナレーション
ffmpeg -y \
  -f concat -safe 0 -i concat.txt \
  -i narration.wav \
  -i bgm.mp3 \
  -filter_complex "[1:a]volume=1.0[nar];[2:a]volume=0.15[bgm];[nar][bgm]amix=inputs=2:duration=first[aout]" \
  -map 0:v -map "[aout]" \
  -c:v libx264 -b:v 8M -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 256k -ar 48000 \
  -movflags +faststart \
  -t 15 \
  reel-final.mp4
```

## 日本市場テロップスタイル

```python
# PIL テロップ生成パラメータ
FONT = "/System/Library/Fonts/ヒラギノ丸ゴ ProN W4.ttc"  # 丸ゴシック
FONT_SIZE_MAIN = 64      # メインテロップ
FONT_SIZE_SUB = 40       # サブテロップ
COLOR_TEXT = (255, 255, 255)     # 白
COLOR_OUTLINE = (0, 0, 0)       # 黒縁
COLOR_KEYWORD = (255, 255, 0)   # キーワード黄色
OUTLINE_WIDTH = 4
SAFE_TOP = 200           # 上端からのマージン
SAFE_BOTTOM = 280        # 下端からのマージン（UIに隠れる）
SAFE_RIGHT = 90          # 右端マージン（アイコンに隠れる）
```

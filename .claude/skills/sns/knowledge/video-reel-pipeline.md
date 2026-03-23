# AI動画リール制作パイプライン — 技術リファレンス

> 2026-03-13 実証済み。全アカウント対応。

## 検証済みモデル（Replicate経由）

| モデル | 用途 | 解像度 | 尺 | コスト |
|--------|------|--------|-----|--------|
| **Flux Schnell** | 画像生成 | 1MP | - | ~$0.01 |
| **Hailuo (minimax/video-01)** | image-to-video | 720x1248 (9:16) | 5.6s | ~$0.13 |
| **Hailuo (minimax/video-01)** | text-to-video | 1280x720 (16:9) | 5.6s | ~$0.13 |
| **Hunyuan (tencent)** | text-to-video | 864x480 | 5.4s | ~$0.05 |

**推奨**: Hailuo image-to-video。品質と制御性のバランスが最良。

## VOICEVOX 話者一覧（主要）

| ID | 話者 | スタイル | 推奨用途 |
|----|------|---------|---------|
| 0 | 四国めたん | あまあま | 幼稚園・教育 |
| 1 | ずんだもん | あまあま | 子供向け・カジュアル |
| 2 | 四国めたん | ノーマル | 汎用女性 |
| 3 | ずんだもん | ノーマル | 汎用カジュアル |
| 8 | 春日部つむぎ | ノーマル | 明るい女性 |
| 11 | 玄野武宏 | ノーマル | 落ち着いた男性 |
| 13 | 青山龍星 | ノーマル | ビジネス男性 |
| 14 | 冥鳴ひまり | ノーマル | 落ち着いた女性 |
| 30 | No.7 | アナウンス | ナレーション |
| 81 | 青山龍星 | 熱血 | 力強い男性 |

## Replicate API トークン

`.mcp.json` > `mcpServers.replicate-flux.env.REPLICATE_API_TOKEN`

## VOICEVOX Engine

```bash
# 起動
docker run -d --rm --name voicevox -p 50021:50021 voicevox/voicevox_engine:cpu-latest

# 停止
docker stop voicevox

# ヘルスチェック
curl -s http://localhost:50021/version
```

## ffmpeg テロップ追加（将来拡張用）

```bash
# 下部にテキストオーバーレイ
ffmpeg -i input.mp4 \
  -vf "drawtext=text='まるやまようちえん':fontfile=/path/to/NotoSansJP.ttf:fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h-th-80:box=1:boxcolor=black@0.5:boxborderw=10" \
  -c:a copy output.mp4
```

## BGM追加（将来拡張用）

```bash
# BGMをループ + 音量下げて合成
ffmpeg -i video.mp4 -stream_loop -1 -i bgm.mp3 \
  -filter_complex "[1:a]volume=0.15[bgm];[0:a][bgm]amix=inputs=2:duration=shortest[aout]" \
  -map 0:v -map "[aout]" -c:v copy -c:a aac -shortest output.mp4
```

## プラットフォーム別仕様

| プラットフォーム | アスペクト比 | 最大尺 | 最大サイズ | 推奨尺 |
|----------------|------------|--------|----------|--------|
| Instagram Reels | 9:16 | 90秒 | 4GB | 15-30秒 |
| X動画 | 9:16 or 16:9 | 140秒 | 512MB | 15秒以内 |
| TikTok | 9:16 | 10分 | 287.6MB | 15-60秒 |
| YouTube Shorts | 9:16 | 60秒 | - | 30-60秒 |

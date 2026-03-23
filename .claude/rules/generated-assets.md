# 生成アセット管理ルール

> 画像・動画・音声など、AIやツールで生成したファイルは必ず追跡可能にする。

## 原則

1. **生成物を置いたディレクトリに `manifest.json` を作る**
2. **生成のたびに manifest に1エントリ追記する**
3. **manifest がないディレクトリに生成物を置かない**

## manifest.json フォーマット

```json
{
  "description": "このディレクトリの用途（1行）",
  "assets": [
    {
      "file": "ファイル名",
      "size": "ファイルサイズ",
      "purpose": "何のために作ったか",
      "prompt": "使用したプロンプト（省略可）",
      "tool": "生成ツール名（Flux / CodeFormer / Hailuo / ffmpeg等）",
      "created": "YYYY-MM-DD",
      "used_in": "使用先のファイルパス or 用途"
    }
  ]
}
```

## 適用範囲

| プロジェクト | 生成物ディレクトリ例 |
|------------|-------------------|
| マイプロ (cardnoir) | `public/images/lp/` |
| TomorrowProof HP | `public/images/blog/`, `public/ar/` |
| コンテンツ | `content/packages/visuals/`, `content/sns/x-daily/images/` |
| SNSリール | `content/sns/reels/YYYY-MM-DD/` |

## エージェントへの指示

- 画像・動画・音声を生成したら、**同じディレクトリの manifest.json に追記する**
- manifest.json がなければ新規作成する
- KOZUKIが「あのファイルどこ？」と聞いたら manifest.json を検索する

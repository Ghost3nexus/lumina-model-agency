# SNS自動化スタック調査結果（2026-03-11）

> Postiz / GitHub Actions + Claude Code CLI / Remotion Skills の3調査統合。
> 実装ロードマップ付き。

---

## 1. Postiz — SNSスケジューラー（コピペ不要化）

### 概要
- **リポジトリ**: gitroomhq/postiz-app (14K stars)
- **ライセンス**: AGPL-3.0（OSS）
- **対応SNS**: X, Instagram, LinkedIn, Facebook, Threads, TikTok, YouTube, Reddit 等32+
- **技術**: Next.js + NestJS + PostgreSQL + Redis（Temporal版推奨）

### TomorrowProof適用
- **Railway ワンクリックデプロイ**: https://railway.com/deploy/postiz
- **月額コスト**: $5-10
- **REST API**: 30リクエスト/時間、Node.js SDK `@postiz/node`
- **X対応**: OAuth 2.0 + v2 API、スレッド・画像OK
- **IG対応**: Facebook Business経由（Standalone不安定）
- **既存X APIキー流用可能**

### API例（投稿スケジュール）
```json
POST /public/v1/posts
{
  "type": "schedule",
  "date": "2026-03-15T08:00:00.000Z",
  "posts": [{
    "integration": { "id": "x-integration-id" },
    "value": [{ "content": "投稿テキスト", "image": [{ "id": "img-id" }] }],
    "settings": { "__type": "x" }
  }]
}
```

### リスク
- スケジュール投稿の信頼性（Issue #818 → Temporal版で改善）
- Instagram Standalone接続の不安定さ（Facebook Business経由推奨）

---

## 2. GitHub Actions + Claude Code CLI — 日次自動生成

### 概要
- Claude Code CLI の `-p` フラグで非対話モード実行
- 公式Action: `anthropics/claude-code-action@v1`
- GitHub Actions Free tier: 2,000分/月（月150-300分消費で余裕）

### コスト
| 項目 | 月額 |
|------|------|
| GitHub Actions | ¥0（Free tier内） |
| Claude API (Sonnet) | ~¥150/月（~$1/月） |
| **合計** | **~¥150/月** |

### ワークフロー設計
```
毎朝 JST 06:00（UTC 21:00）cron起動
  → Claude Code CLI で SNS SKILL.md 準拠の5投稿生成
  → /content/sns/x-daily/YYYY-MM-DD.md にコミット
  → Railway discord-bot が各時刻にファイル読んでX API投稿
```

### ワークフローファイル
`.github/workflows/x-daily-posts.yml` — 詳細は content-pipeline-research-2026.md 参照

### 必要なGitHub Secrets
- `ANTHROPIC_API_KEY`
- `X_API_KEY` / `X_API_SECRET`
- `X_ACCESS_TOKEN` / `X_ACCESS_SECRET`

---

## 3. Remotion Skills — ショート動画自動生成

### セキュリティ評価: LOW RISK（安全）
- Skills = ただのMarkdown指示ファイル（実行コードではない）
- remotion-dev = 公式組織（本体39K stars）
- TomorrowProof = 無料ライセンス対象（3名以下）

### Remotion概要
- Reactコンポーネントで動画をプログラマティック生成
- TypeScript + TailwindCSS + Node.js = 既存スタック完全互換
- 9:16（Reels/TikTok）、1:1（IG）、16:9（X）全対応
- Claude Code統合が公式サポート

### Skills内容（28+ルールファイル）
- `animations.md` — Spring、Interpolate、イージング
- `text-animations.md` — タイプライター、ワードハイライト
- `charts.md` — アニメーション棒グラフ、円グラフ、折れ線グラフ
- `transitions.md` — フェード、スライド、ワイプ
- `3d.md` — Three.js / React Three Fiber
- `voiceover.md` — ElevenLabs TTS統合

### TomorrowProof用テンプレート案（3種）

**Template 1: データカード動画（X用 16:9）**
- 大きな数字がスプリングアニメーションで出現
- ダーク背景 + シアンアクセント
- 5-10秒、ループ可能

**Template 2: テキスト引用動画（X/IG用 1:1）**
- タイプライターエフェクトで引用文が現れる
- フィルムグレインテクスチャ
- 10-15秒

**Template 3: Before/After比較動画（X用 16:9）**
- 左右分割 → スライドトランジション
- データの対比がアニメーションで表示
- 10-15秒

### レンダリング環境
- Railway上でヘッドレスChrome + FFmpeg必要
- 30秒1080p動画: ~30-120秒のレンダリング時間
- AWS Lambda ($0.01/render) もオプション

---

## 実装ロードマップ

### Phase 1: Postiz導入（3月第3-4週）
```
Day 1: Railway にPostizデプロイ（30分）
Day 1: X OAuth設定を移行（30分）
Day 2: Instagram Facebook Business接続（1時間）
Day 2: LinkedIn OAuth接続（30分）
Day 3: postizClient.js を discord-bot に作成（2-3時間）
Day 3: post-x-daily.js をPostiz API経由に改修
Day 4-7: 既存直接API投稿と並行運用テスト
Week 2: 問題なければ完全移行
```
**完了条件**: X/IG/LinkedIn投稿がPostiz API経由で成功。KOZUKIのコピペ作業ゼロ。

### Phase 2: GitHub Actions自動生成（4月第1週）
```
Day 1: .github/workflows/x-daily-posts.yml 作成
Day 1: GitHub Secrets にAPI キー設定
Day 2: workflow_dispatch で手動テスト
Day 3: 生成品質確認 → SNS SKILL.md のプロンプト調整
Day 4-7: cron自動実行テスト（生成のみ、投稿は手動確認）
Week 2: 自動投稿を有効化
```
**完了条件**: 毎朝06:00に5投稿が自動生成・コミット・X API投稿される。

### Phase 3: Remotion動画パイロット（4月第2-3週）
```
Day 1: npx skills add remotion-dev/skills
Day 1: Remotionプロジェクト初期化（npx create-video）
Day 2-3: 3つのテンプレート作成（データカード、引用、Before/After）
Day 4: Railway レンダリング環境構築（Chrome + FFmpeg）
Day 5: SNS Agent から Remotion render を呼び出すスクリプト作成
Week 2: テスト投稿（動画付きX投稿）→ エンゲージメント比較
Week 3: 問題なければ日次投稿に動画を1本追加
```
**完了条件**: 5本/日のうち1本が自動生成動画付き。エンゲージメント率を画像のみと比較。

---

## 月額コスト（全Phase完了後）

| サービス | 月額 |
|---------|------|
| Postiz (Railway) | ~$5-10 (~¥750-1,500) |
| GitHub Actions | ¥0 |
| Claude API (日次生成) | ~¥150 |
| Remotion | ¥0（無料ライセンス） |
| Railway追加CPU（動画レンダリング） | ~$3-5 (~¥450-750) |
| **合計** | **~¥1,350-2,400/月** |

現在のKOZUKIコピペ作業 ~30分/日 × 30日 = 15時間/月 が**完全ゼロ**になる。

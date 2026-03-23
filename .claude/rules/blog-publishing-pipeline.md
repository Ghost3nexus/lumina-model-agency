# ブログ公開パイプライン — 全エージェント共通仕様

> ブログが全コンテンツの起点（Single Source of Truth）。
> 1本のブログから X / note / Instagram を派生させる一気通貫フロー。
> **Marketing Agent がオーケストレーター**として全工程を統括する。
> 詳細手順: `.claude/skills/marketing/playbooks/content-orchestration.md`

---

## オーケストレーター: Marketing Agent

Marketing Agent が以下の全フェーズを順番に実行・管理する。
各フェーズ完了後、次のフェーズのエージェントを呼び出す。

---

## フェーズ1: 企画・KW選定（Marketing Agent）

- **出力**: テーマ・メインKW・関連KW・検索意図・競合分析
- **保存先**: コンテンツパッケージ Part 1 に含める
- **完了条件**: KW決定、記事構成案承認

## フェーズ2: 執筆（Writer Agent）

- **入力**: Marketing の企画出力
- **出力**: コンテンツパッケージ一式（Part 1-7）
- **保存先**: `/content/packages/YYYY-MM-DD_[slug].md`
- **VISUALタグ**: 記事本文に `<!-- VISUAL: type | テーマ: ... | スタイル: ... | 比率: ... -->` を3箇所以上埋め込む
- **Part 5（必須）**: X投稿3本 + Instagram投稿1本（ブログから派生）
- **Part 6（必須）**: note派生記事（ブログと別切り口、2000字以上）
- **完了条件**: 全7パートが埋まっている、VISUALタグ3つ以上、SNS投稿文あり

## フェーズ3: ビジュアル一括生成（Visualizer Agent）

- **入力**: コンテンツパッケージ内のVISUALタグ
- **制作ツール**（利用可能順）:
  1. **Nano Banana Pro**: ヒーロー画像・3D・ソーシャル・CTA（`tools/generate-visuals.sh` で一括生成）
  2. **HTML/CSS**: インフォグラフィック・データ図解・比較表
  3. **Mermaid**: フローチャート・アーキテクチャ図
- **追加生成（SNS用）**: x-card / note / ig-feed プリセットで各1枚
- **出力**: 画像ファイル + VISUAL-SPEC.md
- **保存先**: `/content/packages/visuals/[slug]/`
- **完了条件**: hero + OGP + x-card + note-thumb + ig = 5枚以上

## フェーズ4: HP公開（Dev Agent / CEO）

1. tomorrowproof-hp リポジトリを `/tmp` にclone
2. 記事をコンテンツパッケージから抽出 → `/content/blog/YYYY-MM-DD_[slug].md`
3. 画像を `/public/images/blog/YYYY-MM/` に配置
4. frontmatter の `heroImage` / `ogImage` パスを更新
5. `npm run build` でビルド確認
6. push → Vercel自動デプロイ
7. 公開URL確定: `https://tomorrowproof-ai.com/blog/[slug]`

## フェーズ5: SNS投稿パッケージ統合（Marketing / SNS Agent）

- Part 5（X/IG投稿文）+ Part 6（note記事）+ 画像パスを統合
- **コピペ投稿用の最終成果物**を1ファイルに出力
- 保存先: `/content/sns/YYYY-MM-DD_[slug]-posts.md`
- 投稿スケジュール表 + 各投稿文（コードブロックでコピペ可能）+ 画像パス
- **投稿方法**: KOZUKIが手動コピペ（APIなし）

### 投稿スケジュール（推奨）
| 時間 | チャネル | 内容 |
|------|---------|------|
| 08:00 | X | X-01: 核心ツイート |
| 12:15 | X | X-02: データ・事実ベース |
| 12:30 | Instagram | IG-01: ビジュアル + キャプション |
| 18:00 | X | X-03: 問いかけ・煽り |
| 翌朝 | note | 派生記事を手動投稿 |

---

## ファイルパス規約

```
/content/packages/YYYY-MM-DD_[slug].md          ← コンテンツパッケージ本体
/content/packages/visuals/[slug]/                ← 画像一式
/content/note/NN_[slug].md                       ← note派生記事
tomorrowproof-hp/content/blog/YYYY-MM-DD_[slug].md ← HP公開記事
tomorrowproof-hp/public/images/blog/YYYY-MM/     ← HP公開画像
```

## 画像命名規則

```
hero-[slug].webp          ← ヒーロー画像（ブログ用 WebP）
og-[slug].png             ← OGP画像（SNSシェア用 PNG）
diagram-[slug]-01.webp    ← 図解・チャート
x-card-[slug].png         ← X投稿カード画像（1200x675）
note-thumb-[slug].png     ← noteサムネイル（1280x670）
ig-[slug].jpg             ← Instagram（1080x1080 or 1080x1350）
```

## 品質ゲート

| チェック項目 | 担当 | 基準 |
|------------|------|------|
| VISUALタグ3つ以上 | Writer | 記事提出時 |
| 全画像生成完了 | Visualizer | VISUAL-SPEC.md作成時 |
| ビルド成功 | Dev | `npm run build` 成功 |
| OGP画像がPNG | Visualizer | og-*.png で出力 |
| alt属性100文字以内 | Writer | 記事最終化時 |
| SNS投稿文の文字数 | SNS Agent | X: 280字, IG: 2200字, LI: 3000字 |

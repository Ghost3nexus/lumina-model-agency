# コンテンツパイプライン調査結果（2026-03-11）

> 3エージェント並行リサーチの統合結果。GitHub OSS + X戦略 + ブログ/noteパイプラインのベストプラクティス。

---

## 1. 注目OSSリポジトリ

| リポジトリ | Stars | 用途 | 適用可能性 |
|-----------|-------|------|-----------|
| **Postiz** (gitroomhq/postiz-app) | 14K | セルフホストSNSスケジューラー、30+プラットフォーム、REST API | P1: Railway対応。X/IG/LinkedInのコピペ不要化 |
| **LangChain social-media-agent** | — | コンテンツ検証サブグラフ + 人間フィードバック学習 | P2: fact-check-flowの強化モデル |
| **CrewAI** | 25K | マルチエージェントフレームワーク。Content Creator Flow例あり | 参考: パイプライン設計の検証用 |
| **Conca** | — | Plan→Generate→Evaluate→Publish自律ループ、複数ブランド | P3: 将来の統合候補 |
| **n8n** | 50K | ワークフロー自動化。SNS自動投稿テンプレート490+ | P3: オーケストレーション中間層 |

## 2. X アルゴリズム 2026（Grok搭載改修 — 2026年1月）

### エンゲージメント重み（確定値）
| アクション | 重み |
|-----------|------|
| Like | x1（ベースライン） |
| Bookmark | x10 |
| Link Click | x11 |
| Profile Click | x12 |
| Reply | x13.5 |
| Retweet | x20 |
| Reply + Author Response | x150 |

### 2026年の変更点
- **Grok感情分析が稼働**: ポジティブ/建設的トーン → 拡散増。ネガティブ/攻撃的 → 減衰
- **外部リンク厳罰化（2026年3月〜）**: 非Premiumでリンク付き投稿 = ほぼゼロエンゲージメント
- **Premium = 4x in-network、2x out-of-network** の可視性ブースト
- **スコア閾値**: +17で通常表示、+65でアルゴリズムブースト。report1件 = -369
- **初速15-60分**がバイラル判定の分岐点

### スレッド戦略（研究間の矛盾点）
- 海外データ: 7ツイートスレッドが最高（+63%インプレッション）
- @gpt_workhack実績: 2ツイートで十分（3本目以降60%減衰）
- **判断**: 自アカウントの実績データを優先。2ツイートまで

## 3. ソロプレナー・コンテンツ戦略

### Build in Publicが最強の有機成長
- levelsio ($250K/月): 広告ゼロ。Xで進捗共有のみ
- Marc Lou ($43K/月、2ヶ月で): Engineering-as-Marketing（無料ミニツール公開）
- Justin Welsh ($8-10M): Content Matrix — 週4時間（ピラー75分 + スポーク2h + エンゲージ45分/日）

### TomorrowProofの最強アングル
「22体のAIエージェントで法人運営」= そのままBuild in Publicコンテンツ。
エージェントの活動、失敗、学習を共有するだけでコンテンツになる。

## 4. コンテンツパイプライン設計原則

### Evaluator-Optimizerパターン（Anthropic推奨）
```
Generator(Writer) → Evaluator(別エージェント) → Generator修正 → 公開
```
生成と評価を分離することで品質が飛躍的に向上。

### コンテンツ再利用率
- 業界標準: 1ピラー → 10+派生
- 現在のTomorrowProof: 1ピラー → 6派生（ブログ + note + X3 + IG1）
- 追加候補: LinkedIn記事、引用グラフィック3枚、メルマガ、動画スクリプト

### フィードバックループ（欠落している最重要機能）
```
公開 → 7日後パフォーマンスチェック → 30日後深掘り分析
  高パフォーマンス → フォローアップ記事 + SNS追加展開
  中パフォーマンス → タイトル/CTA/内部リンク最適化
  低パフォーマンス → 原因分析 → 次回企画へフィードバック
```

### note.com戦略（確定事項）
- ドメインパワー: **96.4/100**（自社ブログの3倍以上）
- リンクは**nofollow** → SEOバックリンク効果なし。トラフィック獲得用
- **コンテンツ重複禁止**: ブログと同じ内容 = 重複ペナルティリスク
- 切り口: ブログ=教科書（である調）/ note=ドキュメンタリー（ですます調）
- noteの弱み: アルゴリズム拡散が弱い → **Xが note の成長エンジン**

## 5. 日本市場SNS 2026

- ショート動画が主要コンテンツ形式
- SNS = 認知 → 直接収益チャネルへシフト
- AI活用はnoteの急成長ジャンル（有料記事前年比+26.8%）

## 6. GitHub Actions + Claude Code CLI 自動化

```yaml
# .github/workflows/x-daily.yml
on:
  schedule:
    - cron: '0 21 * * *'  # JST 06:00
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx claude-code --non-interactive "SNS日次投稿を生成"
      - run: node scripts/post-x-daily.js
```

実績: SmartScope blogがこの構成で完全自動ブログ運営。tiagolemos05が30日で0→6,000インプレッション達成。

# Agent Routing Rules — 担当境界と重複防止

## 原則

- **1タスク1エージェント**: 1つのタスクに複数エージェントを混在させない
- **調査と成果物を分離**: 調べる作業（research）と作る作業（document/writer等）は別ステップ
- **開発中の分岐禁止**: dev が作業中に marketing や branding の指示を混ぜない

## 担当境界マップ

### 調査系
| タスク | 担当 | NOT担当 |
|--------|------|---------|
| 市場規模・TAM/SAM/SOM算出 | **research** | planner |
| 競合サービスの機能・価格比較 | **research** | ec_director |
| 業界トレンド・統計データ収集 | **research** | news |
| 今日のニュース・速報 | **news** | research |
| EC業界の最新機能・アップデート | **ec_director** | research |

### 文書作成系
| タスク | 担当 | NOT担当 |
|--------|------|---------|
| 事業提案書・投資家向けデック | **document** | writer |
| ブログ記事・note・SEO記事 | **writer** | document |
| 営業メール・DM文面 | **sales** | writer |
| SNS投稿文（Instagram・X等） | **sns** | writer |
| LP・Webページのコピー | **marketing** | writer, branding |
| ブランドコピー・タグライン | **branding** | marketing |

### マーケティング系
| タスク | 担当 | NOT担当 |
|--------|------|---------|
| SEO戦略・テクニカルSEO | **marketing** | writer |
| Google広告運用・入札・ROAS | **google_ads** | marketing |
| SNS運用・投稿スケジュール | **sns** | marketing |
| LP改善・CVR最適化 | **marketing** | dev |
| コンテンツ企画（何を書くか） | **marketing** | writer |
| コンテンツ執筆（実際に書く） | **writer** | marketing |

### 開発・デザイン系
| タスク | 担当 | NOT担当 |
|--------|------|---------|
| コード実装・バグ修正・API連携 | **dev** | branding |
| UIデザイン方針・世界観 | **branding** | dev |
| 図解・チャート・インフォグラフィック | **visualizer** | branding |
| HP構成・ワイヤーフレーム | **branding** | dev |
| HP実装（コーディング） | **dev** | branding |

### 財務・法務系
| タスク | 担当 | NOT担当 |
|--------|------|---------|
| 月次PL・経費管理・freee操作 | **cfo** | tax |
| 節税戦略・税務申告 | **tax** | cfo |
| 契約書・利用規約・NDA | **legal** | document |
| 請求書発行 | **cfo** | sales |

### セキュリティ系
| タスク | 担当 | NOT担当 |
|--------|------|---------|
| 脆弱性診断・修正 | **security** | dev |
| セキュリティヘッダー・CORS設定 | **security** | dev |
| プロンプトインジェクション対策 | **security** | dev |
| OAuth/API認証設計 | **security** | dev |
| npm audit・依存脆弱性 | **security** | dev |
| 個人情報保護・コンプライアンス | **security** | legal |
| 利用規約・プライバシーポリシー作成 | **legal** | security |
| インシデント対応 | **security** | dev |
| CI/CDセキュリティパイプライン | **security** | dev |

### 企画系
| タスク | 担当 | NOT担当 |
|--------|------|---------|
| 新プロダクト企画・GTM設計 | **planner** | research |
| 市場データ収集（企画の前段階） | **research** | planner |
| プライシング設計 | **planner** | cfo |

## ハンドオフルール

複数エージェントが関わる場合は、**順番に**実行する:

```
例1: 新サービスの提案書を作る
  Step 1: research → 市場データ・競合情報を調査
  Step 2: planner → サービスコンセプト・GTMを設計
  Step 3: document → 提案書にまとめる

例2: ブログ→SNS一気通貫（Marketing Agentがオーケストレーション）
  Step 1: marketing → テーマ・KW選定
  Step 2: writer → コンテンツパッケージ執筆（ブログ + X3本 + IG1本 + note派生）
  Step 3: visualizer → 画像一括生成（hero + OGP + x-card + note + ig）
  Step 4: dev → HP公開（Vercel自動デプロイ）
  Step 5: marketing → SNS投稿パッケージ統合出力（/content/sns/）
  Step 6: KOZUKI → 各プラットフォームにコピペ投稿
  → 詳細: .claude/skills/marketing/playbooks/content-orchestration.md

例3: HPを作る
  Step 1: branding → デザイン方針・構成・コピー
  Step 2: dev → コーディング・実装
  Step 3: marketing → SEO最適化

例4: 月次レポート
  Step 1: cfo → 数字の集計・PL作成
  Step 2: visualizer → グラフ・チャート化
  Step 3: document → レポートにまとめる

例5: セキュリティ監査
  Step 1: security → 脆弱性スキャン・診断
  Step 2: security → 修正パッチ適用
  Step 3: dev → 動作確認・デプロイ

例6: 新機能の安全なリリース
  Step 1: dev → 実装
  Step 2: security → セキュリティレビュー
  Step 3: dev → 修正反映・デプロイ
```

## 判断に迷ったら

- **作るもの**が文書 → document / writer
- **作るもの**がコード → dev
- **作るもの**が図 → visualizer
- **集めるもの**がデータ → research
- **集めるもの**がニュース → news
- **売るための文面** → sales（営業）/ sns（投稿）/ marketing（LP）
- **守るもの**がシステム → security
- **守るもの**が法的権利 → legal

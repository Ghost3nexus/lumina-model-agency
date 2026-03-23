# TomorrowProof 技術スタック・公式ソース

## AI APIモデル
| プロバイダ | モデル | 用途 |
|-----------|--------|------|
| Anthropic | claude-sonnet-4-20250514 | メインAI（デフォルト） |
| Anthropic | claude-opus-4-6 | 高精度タスク |
| Anthropic | claude-haiku-4-5-20251001 | 軽量・高速タスク |

## インフラ
| サービス | 用途 | 公式ドキュメント |
|---------|------|-----------------|
| Vercel | LP/HP/ダッシュボード | https://vercel.com/docs |
| Railway | アプリケーション | https://docs.railway.com |
| freee | 会計（法人+個人） | https://developer.freee.co.jp |
| Google Ads | 広告運用 | https://developers.google.com/google-ads/api |
| GA4 | アクセス解析 | https://developers.google.com/analytics |

## フロントエンド
- Next.js / React / TypeScript
- Tailwind CSS
- SWR（データフェッチ）

## バックエンド
- Node.js（Express）
- Discord.js（Bot）

## 情報源ルール
- 実装・設定変更の前に**必ず公式ドキュメントで最新仕様を確認**する
- WebSearchで取得した情報は公式ソースとクロスチェックする
- APIの破壊的変更やサービスのアップデートに注意する

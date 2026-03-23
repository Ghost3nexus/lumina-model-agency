【TomorrowProof Council / 2026年03月21日】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 議題: LUMINA 統合設計 — フロントエンド・バックエンドの具体実装方針
🎯 決めること: Agency × Studio の統合アーキテクチャを具体的に確定する
👥 参加エージェント: CEO / Dev / UI/UX Designer / EC Director / CFO / Research

## CEO最終判断

**決定: Option D（Gemini単体）をPoCで検証。合格基準を満たさなければInstantID導入。**

理由:
1. ポストモーテムの教訓「二重パイプラインは品質劣化」。まず最小構成で試す
2. PoCコスト$0。1日で結論が出る
3. ダメだった場合のフォールバック（InstantID）は明確

### 合格基準
テスト: 1体のモデルで10枚生成 → リファレンス5枚をGeminiに毎回渡す
- S: 誰が見ても同じ人
- A: よく見ると違うが同一人物として通用
- B: 別人に見える
- **合格: 10枚中8枚以上がS or A**

### フェーズ分割

| Phase | 内容 | 期限 |
|-------|------|------|
| 1a | 顔一貫性PoC（Gemini単体） | 3/22 |
| 1b | PoC結果でInstantID要否判断 | 3/22 |
| 1c | AIモデル10体の顔・リファレンス生成 | 3/25 |
| 1d | Agency画面（モデル一覧 + 詳細 + サンプル着用） | 3/28 |
| 1e | Studio連携（Agencyモデルで生成） | 3/30 |

### ネクストアクション

| # | アクション | 担当 | 期限 |
|---|-----------|------|------|
| 1 | 顔一貫性PoC: リファレンス5枚でGemini生成→10枚評価 | Dev | 3/22 |
| 2 | PoC判定: S/A率80%以上ならGemini、未満ならInstantID | CEO | 3/22 |
| 3 | AIModel型定義: data/aiModels.ts 作成 | Dev | 3/23 |
| 4 | 1体目AIモデル生成: Ladies Asia 顔+リファレンス5枚 | Dev | 3/23 |
| 5 | サンプル着用画像: 1体目で3-5商品の着用画像 | Dev | 3/24 |
| 6 | CEO品質判定: モデル事務所として成立するか | CEO | 3/24 |

### 重要決定
- Agency と Studio は1プロダクト、マーケ上はブランド名を分ける
- 課金はSaaSパッケージ型（月額 + モデル指名し放題 + 月○枚生成）
- 顔一貫性はレベルC（完全一貫）。妥協なし
- Agency画面にサンプル着用画像必須（EC Director指摘）
- MVP: data/aiModels.ts にハードコード → Phase 2でSupabase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📓 Journal Agent → journal/corp/2026/03/21-council-meeting-unified-architecture.md

# About Usページ設計パターン — AIスタートアップ調査知見

> 調査対象: Kive.ai, Replicate, Runway, Linear, Vercel, Resend, Cal.com, Dub.co, Cursor, Midjourney, Sintra.ai, Ema.ai 等
> 更新: 2026-03-04

## 1. 海外AIスタートアップのAboutページ共通パターン

### 必須セクション構成
| # | セクション | 目的 | 実装優先度 |
|---|-----------|------|-----------|
| 1 | **Mission Statement** | 1文で会社の存在理由を伝える | 最高 |
| 2 | **Origin Story** | 創業の背景・「なぜ」を語る | 最高 |
| 3 | **Vision / Roadmap** | 未来像・方向性を示す | 高 |
| 4 | **Team / Agents** | 誰が（何が）動かしているか | 高 |
| 5 | **Numbers / Metrics** | 実績・インパクトを数字で | 中 |
| 6 | **Values / Principles** | 行動原則・思想 | 中 |
| 7 | **Press / Recognition** | メディア掲載・受賞 | 低（実績次第） |
| 8 | **CTA** | 次のアクション誘導 | 最高 |

### ソロファウンダー/少人数チーム特有の表現手法

1. **AIエージェントをチームとして見せる**
   - Sintra.ai: AI従業員を「採用」する表現
   - Ema.ai: Universal AI Employee として個別プロフィール
   - → TomorrowProof: 18 AI Agentsをチームメンバーとしてビジュアル化

2. **ファウンダー中心のナラティブ**
   - Midjourney (David Holz): 創業者のビジョンが全て
   - Cursor (Anysphere): MIT同級生4人の物語
   - → TomorrowProof: KOZUKI一人×AIの新しい会社の形を語る

3. **プロダクトが語る**
   - Linear: プロダクトのスクリーンショットが主役
   - Vercel: 技術力をビジュアルで証明
   - → TomorrowProof: エージェントシステムのデモ/3D可視化

## 2. デザインパターン（ダークテーマ特化）

### ビジュアルストーリーテリング
- **映画的ビジュアル**: 暗い背景にピンポイントの光（Twelve Labs方式）
- **ダーク×アクセント**: ネオンやグラデーションで視覚的階層（Together AI, Lambda）
- **動き×インタラクティブ**: スクロールに連動した微細アニメーション
- **余白の力**: 情報密度を下げ、各セクションにブレスを持たせる

### タイポグラフィ主導のAboutページ
- 大きな見出し（ミッション）+ 控えめな本文
- 数字（metrics）をタイポグラフィ的アクセントに
- モノスペースでラベル（//ABOUT, est.2025）

### Three.js/WebGL活用パターン
- パーティクルシステムでネットワーク表現
- オーブ/球体でAIの知性を表現（現HPで使用中）
- スクロール連動の3Dアニメーション

## 3. TomorrowProofへの推奨構成

### About Usページ再設計案

```
[Section 1: Mission — フルスクリーン]
  「AIで、ひとりでもプロ集団になる。」
  大きなタイポグラフィ + 3D背景（暗いパーティクル）

[Section 2: Origin Story — 左テキスト/右ビジュアル]
  なぜTomorrowProofを作ったか
  ソロ×AIで会社を再定義する物語
  タイムライン: 2025.08設立 → 現在

[Section 3: Agent Infrastructure — フルワイド]
  18 AI Agentsのインタラクティブ可視化
  各エージェントのカード（役割・アイコン・ステータス）
  「1人 × 18 AI = 次世代の組織」

[Section 4: Values/Philosophy — ミニマル]
  3-5の行動原則
  アイコン + 短文（タイポグラフィ主導）

[Section 5: Numbers — ダーク背景×大きな数字]
  プロダクト数 / エージェント数 / etc.
  アニメーションカウンター

[Section 6: Roadmap — 横スクロールタイムライン]
  2025 Q3: 設立
  2025 Q4: Lumina / AI絵本
  2026 Q1: ファッションEC AI / HP公開
  2026 Q2: 展望

[Section 7: CTA]
  お問い合わせ / 事業を見る
```

## 4. ベンチマーク参照メモ

| 企業 | 学ぶポイント | 避けるポイント |
|------|-------------|---------------|
| Kive.ai | ダークUI、AIツールの見せ方 | - |
| Linear | 極限のミニマリズム、機能美 | - |
| Vercel | 開発者向けブランディング | エンジニア特化すぎる |
| Resend | ミニマルSaaS、少人数チーム | - |
| Cursor | 創業ストーリーの力 | - |
| Sintra.ai | AIを「従業員」として見せる | ポップすぎるUI |
| Midjourney | 独立研究所としてのポジショニング | - |

## 5. 利用可能MCP/ツール

- **Canva MCP**: デザインモックアップ、アセット管理
- **FAL MCP**: AI画像生成（背景ビジュアル、ファウンダー画像）
- **Three.js**: エージェント可視化（既存AgentOrb拡張）
- **Framer Motion相当**: Reactアニメーション（既存HP利用中）

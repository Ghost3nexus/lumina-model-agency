# Character Bible — MIKU

**Model ID**: `ladies-asia-01`
**Category**: LADIES — ASIA
**Created**: 2026-04-19 (初版)
**Creative Director**: KOZUKI TAKAHIRO
**Purpose**: 著作権根拠文書 / Launch Blocker B1

---

## 1. Identity

- **Name**: MIKU
- **Age (fictional)**: 23
- **Nationality/Ethnicity (fictional)**: Japanese archetype (Tokyo-native aesthetic)
- **Archetype / Positioning**: Japanese avant-garde — reference tone: Comme des Garçons / Sacai
- **Role in roster**: LADIES-ASIA の旗艦。日本発ブランドの思想を海外に運ぶキャラクター

## 2. Physical Specification
*(Source of truth: `data/agencyModels.ts` — 変更不可)*

| Field | Value |
|-------|-------|
| Height | 175 cm |
| Bust | 78 cm |
| Waist | 57 cm |
| Hips | 85 cm |
| Hair | Black, blunt bob |
| Eyes | Dark brown, monolid |
| Vibe | Japanese avant-garde, Comme des Garçons / Sacai |

## 3. Creative Direction — KOZUKI TAKAHIRO

### なぜこのキャラクターを創造したか

LUMINA を設立する以前から決めていたのは「**日本の前衛モードを世界に出せるモデルを内製で持つこと**」だった。日本発のブランド(CDG, Sacai, Issey Miyake, Junya Watanabe, Undercover)は世界的評価を持つが、それを体現する現代的なモデルの多くは欧米ベースで、日本の美意識を本当に理解しているわけではない。MIKU はその空白を埋めるために設計された。**ブラントボブ、一重まぶた、175cm という東京の平均を少し超えた身長、B78/W57/H85 の直線的シルエット** — これらは全て「欧米的な造形に媚びない」という意志の表明である。

### 差別化ポイント(他ロスターとの関係)

- **vs ELENA**: 同じ「静けさ」を扱うが、ELENA は北欧の無機的余白、MIKU は日本の間(ま)。似て非なる
- **vs HARIN**: HARIN は K-beauty 的な艶と整形的完璧性、MIKU は不整形の美・朴訥な知性。対照的に設計
- **vs LIEN**: LIEN はフランコアジアの洗練、MIKU は和の根源性
- MIKU は **LUMINA で唯一、"一重まぶた" を sig として保持する** ladies。これは政治的判断 — アジア女性の美の多様性をハウスとして表明するため

### スタイリング・振る舞いの原則

- 笑顔は稀。口は閉じていることが多い
- ポーズは角度重視、直線的。丸みを作らない
- ヘアはブラントな切り口を維持。動かない
- ジュエリーはシルバー、オブジェ的なもの。装飾ではなく構造

### 顔・体の特徴的な設計判断

- **Monolid(一重まぶた)の明示**: 西洋的二重美学に媚びない判断。これが MIKU のアイデンティティの核
- **Blunt bob**: 切り揃えた直線。美容的計算ではなく建築的選択
- **175cm の身長**: ladies-asia の中では最長身。アジア女性の身体性を海外マーケットで引き上げるためのスペック
- **B78/W57/H85**: 直線的シルエット。**強度ではなく鋭さ** が設計方向

### 採用・起用シーン

- 日本発ブランドの editorial(CDG, Sacai, Issey Miyake, Junya Watanabe, Undercover, Yohji Yamamoto 系)
- 海外モード誌の「Tokyo designer」特集
- 建築・工芸・ギャラリー連動の広告
- 無印良品、ミナ ペルホネン的な静謐ブランド

## 4. Styling Bible

### Wardrobe categories
- Avant-garde: CDG / Sacai / Junya Watanabe 系デコンストラクション
- Outerwear: オーバーサイズジャケット、プリーツコート、ロングローブ
- Knitwear: ルーズゲージ、アシンメトリックカット
- Dresses: プリーツドレス、シフト、ブラックロング
- Accessories: タビシューズ、変形バッグ、オブジェ的アイテム

### 避けるべきルック
- フェミニンなフリル、パステル
- セクシー路線(透け、タイト、ボディライン強調)
- キュートなキャラクター物
- カメラに媚びる笑顔
- 欧米ハイジュエリー系の装飾過多

### Typical settings
- 白背景スタジオ、コンクリートの間仕切り
- 日本建築(数寄屋、和モダン)、京都の空間、東京の路地
- ギャラリー、美術館、工芸の工房
- 灰色の空、雨の日の東京

## 5. Voice & Behavior (動画生成時)

- **声質**: 低めの中音、静かな響き。日本語(標準語、東京アクセント)と英語両対応
- **語数**: 少ない。沈黙を許容する
- **視線**: カメラを見ない時間が長い(約 70%)
- **動き**: 極めて抑制された動き。静止の方が多い
- **表情変化**: マイクロ変化のみ。目線と呼吸だけで感情を運ぶ

## 6. Generation Methodology

- **Foundation model**: Gemini 3.1 Flash Image Preview
- **Reference images**: `public/agency-models/ladies-asia-01/beauty.png`, `polaroid-front.png` 他 portfolio 一式
- **Prompt規則**: LUMINA 内部プロンプト設計ガイドライン(Japanese Avant-garde / Editorial プリセット)参照
- **Quality gate**: 2-tier QA — 自動 QA + Creative Director 人間レビュー

## 7. Retirement Triggers

- Character Bible の抜本改訂時
- 実在人物(日本の女優・モデル)への意図せぬ収束時 — 特に厳格に監視
- 倫理的リスク発見時
- LUMINA 経営判断による整理

## 8. IP Ownership Declaration

株式会社TomorrowProof は、MIKU というキャラクターの identity、name、visual likeness、voice、character attributes およびこれに付随する一切の知的財産権について、全世界的・永続的に、**当該法令上許容される最大範囲において**(to the extent permitted by applicable law)保有する。本 Character Bible は、Creative Director KOZUKI TAKAHIRO による創作指示の記録であり、キャラクター創作における創作的寄与を証する一次資料である。

MIKU の使用許諾はブランド・クライアントに対して tier 別ライセンス(Standard / Extended / Campaign / Exclusive)として提供されるが、IP 自体の譲渡・サブライセンス・転売は一切行わない。

## 9. Change Log

| Date | Change | By |
|------|--------|----|
| 2026-04-19 | 初版作成 | KOZUKI TAKAHIRO |

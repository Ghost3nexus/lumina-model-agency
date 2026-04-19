# Character Bible — SHOTA

**Model ID**: `men-asia-01`
**Category**: MEN — ASIA
**Created**: 2026-04-19 (初版)
**Creative Director**: KOZUKI TAKAHIRO
**Purpose**: 著作権根拠文書 / Launch Blocker B1

---

## 1. Identity

- **Name**: SHOTA
- **Age (fictional)**: 26
- **Nationality/Ethnicity (fictional)**: Japanese archetype (Tokyo-native, minimalist aesthetic)
- **Archetype / Positioning**: Japanese minimalist — reference tone: Issey Miyake / HOMME PLISSÉ
- **Role in roster**: MEN-ASIA の旗艦。日本発ブランドのメンズ代表 + minimalist ブランドのアジア主軸

## 2. Physical Specification
*(Source of truth: `data/agencyModels.ts` — 変更不可)*

| Field | Value |
|-------|-------|
| Height | 183 cm |
| Bust | 88 cm |
| Waist | 70 cm |
| Hips | 88 cm |
| Hair | Black, medium, natural |
| Eyes | Dark brown, monolid |
| Vibe | Japanese minimalist, Issey Miyake / HOMME PLISSÉ |

## 3. Creative Direction — KOZUKI TAKAHIRO

### なぜこのキャラクターを創造したか

MIKU の対として MEN-ASIA にも「**日本の根源性**」を体現するキャラクターが必要だった。Issey Miyake / HOMME PLISSÉ / Comme des Garçons HOMME PLUS / Undercover メンズ — これらのブランドは日本発として世界で評価されているが、その世界観を体現する男性モデルは意外に少ない。欧米ベースのアジア系モデルでは、日本のプリーツや間の美学が読めない。SHOTA は日本の建築的美意識を持つキャラクターとして内製。**一重まぶた / 黒髪ミディアム / 183cm** はアジア男性モデルの理想身体ではなく、**日本の街と建築に最も馴染む造形** を優先して設計した。

### 差別化ポイント(他ロスターとの関係)

- **vs IDRIS**: IDRIS は国際ラグジュアリーの硬さ、SHOTA は日本ミニマルの間
- **vs JIHO**: JIHO は androgynous 路線、SHOTA は骨太のシンプリシティ。MEN-ASIA の2つの極
- **vs RYO**: RYO はストリートカルチャー、SHOTA は建築的ミニマル
- **vs MIKU**: MIKU の対になる MEN-ASIA 主軸。同じ「日本の根源性」を男女で持つ設計

### スタイリング・振る舞いの原則

- 表情はほぼ無表情に近い。静かな微笑みの一歩手前
- 立ち姿は直線的、コントラポストは最小限
- 髪は自然、ストレート寄り、動かない
- アクセサリーはほぼゼロ。あるとしても工芸的なシルバー一本

### 顔・体の特徴的な設計判断

- **Monolid(一重まぶた)**: 日本男性の美の多様性をハウスとして明示。MIKU と同じ政治的判断
- **Medium length, natural black hair**: 整えすぎない。日本人男性の素のヘア質感
- **183cm / B88 / W70**: アジア男性モデルとしては高身長。IDRIS との 6cm 差を意識的に保つ

### 採用・起用シーン

- 日本発ブランド(Issey Miyake, HOMME PLISSÉ, CDG HOMME PLUS, Yohji Yamamoto, Undercover, sacai HOMME)
- 無印良品、Uniqlo U の上位ライン
- 建築・工芸・インテリア・家具広告
- 和モダン旅館・ホテル・茶室
- 日本酒・焼酎・工芸品の広告

## 4. Styling Bible

### Wardrobe categories
- Avant-garde: プリーツジャケット、デコンストラクション、アシンメトリー
- Outerwear: オーバーサイズコート、キモノシルエットジャケット
- Tailoring: ルーズフィットのスーツ、ワイドトラウザー
- Knitwear: オーバーサイズニット、ルーズタートル
- Traditional: 作務衣的リラックスウェア、和要素のあるリラックスウェア

### 避けるべきルック
- 欧米スーツの硬質フィット(IDRISの領域)
- ストリート主張(RYOの領域)
- スポーツ、カジュアルカジュアル
- パステル、ネオン
- 筋肉誇示、タイトフィット

### Typical settings
- 日本の建築(数寄屋、和モダン、古民家、茶室)
- 東京の路地、谷中・神楽坂・建築の通り
- 工房、工芸のスタジオ
- グレー背景スタジオ、コンクリート間仕切り
- 雨の東京、霧のある朝

## 5. Voice & Behavior (動画生成時)

- **声質**: 低中音、落ち着いた響き。日本語(標準語)、英語もニュートラル
- **語数**: 少ない。沈黙を許容
- **視線**: カメラを見ない時間が長い(約 65%)
- **動き**: 抑制された動き、所作が美しい
- **表情変化**: マイクロ変化のみ。感情の振れ幅は小さい

## 6. Generation Methodology

- **Foundation model**: Gemini 3.1 Flash Image Preview
- **Reference images**: `public/agency-models/men-asia-01/beauty.png`, `polaroid-front.png` 他 portfolio 一式
- **Prompt規則**: LUMINA 内部プロンプト設計ガイドライン(Japanese Minimalist / Editorial プリセット)参照
- **Quality gate**: 2-tier QA — 自動 QA + Creative Director 人間レビュー

## 7. Retirement Triggers

- Character Bible の抜本改訂時
- 実在人物(日本の俳優・モデル)への意図せぬ収束時 — **特に厳格に監視**
- 倫理的リスク発見時
- LUMINA 経営判断による整理

## 8. IP Ownership Declaration

株式会社TomorrowProof は、SHOTA というキャラクターの identity、name、visual likeness、voice、character attributes およびこれに付随する一切の知的財産権について、全世界的・永続的に、**当該法令上許容される最大範囲において**(to the extent permitted by applicable law)保有する。本 Character Bible は、Creative Director KOZUKI TAKAHIRO による創作指示の記録であり、キャラクター創作における創作的寄与を証する一次資料である。

SHOTA の使用許諾はブランド・クライアントに対して tier 別ライセンス(Standard / Extended / Campaign / Exclusive)として提供されるが、IP 自体の譲渡・サブライセンス・転売は一切行わない。

## 9. Change Log

| Date | Change | By |
|------|--------|----|
| 2026-04-19 | 初版作成 | KOZUKI TAKAHIRO |

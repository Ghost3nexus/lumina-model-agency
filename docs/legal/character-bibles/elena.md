# Character Bible — ELENA

**Model ID**: `ladies-intl-01`
**Category**: LADIES — INTERNATIONAL
**Created**: 2026-04-19 (初版)
**Creative Director**: KOZUKI TAKAHIRO
**Purpose**: 著作権根拠文書 / Launch Blocker B1

---

## 1. Identity

- **Name**: ELENA
- **Age (fictional)**: 24
- **Nationality/Ethnicity (fictional)**: Northern European (Scandinavian archetype — not tied to any specific country)
- **Archetype / Positioning**: Scandinavian editorial muse — reference tone: Jil Sander / The Row
- **Role in roster**: LUMINA の「静けさと余白」を体現するハウスの中心。ミニマル・クワイエットラグジュアリー案件の第一選択

## 2. Physical Specification
*(Source of truth: `data/agencyModels.ts` — 変更不可)*

| Field | Value |
|-------|-------|
| Height | 179 cm |
| Bust | 80 cm |
| Waist | 59 cm |
| Hips | 88 cm |
| Hair | Ash blonde, straight, long |
| Eyes | Blue-grey |
| Vibe | Scandinavian editorial, Jil Sander / The Row |

## 3. Creative Direction — KOZUKI TAKAHIRO

### なぜこのキャラクターを創造したか

LUMINA ロスターの設計において最初に必要だったのは「**引き算の美学を体現する中心点**」だった。ファッションECは足し算で溢れている — 笑顔・ポーズ・背景・小物・光。その全てが商品を邪魔する瞬間がある。ELENA はその逆を成立させるために生まれた。無表情に近い静けさ、ハイライトを意図的に削った肌、髪の重力すら感じさせないストレートロング。これらは「何もしていないように見えるが、実は全てが計算されている」というハウス基準を視覚化するための判断である。

### 差別化ポイント(他ロスターとの関係)

- **vs AMARA**(同カテゴリ): AMARA の haute couture エッジに対し、ELENA は「削ぎ落とした知性」。バーゼル、コペンハーゲン、ヘルシンキの空気
- **vs MIKU**(アジア側の静けさ担当): MIKU は和の余白、ELENA は北欧の余白。同じ「静けさ」でも気温と湿度が違う
- ELENA は**全キャストで最も"空白"が似合う**モデル。商品を主役にしたい時の第一選択

### スタイリング・振る舞いの原則

- 表情はニュートラル寄り。微笑みは極端に抑える(歯を見せる笑顔はブランド毀損)
- 立ち姿はまっすぐ。コントラポストは最小限
- 髪は常に重力に従わせる — 動きすぎる髪は ELENA ではない
- 視線は被写体ではなく空間に向く時間が長い

### 顔・体の特徴的な設計判断

- **ブルーグレーの瞳**: 完全な青ではなく、グレーが混ざることで感情温度が一段下がる。これが ELENA の sig
- **アッシュブロンド**: ウォームブロンドではなく、アッシュ寄り。北欧の冬光を想定
- **細身だが骨格は力強く**: B80/W59/H88 はシャープだが、179cm の身長と合わせると"儚い"にはならない。**儚さではなく静けさ**が設計目標

### 採用・起用シーン

- Quiet luxury ブランドの EC look book(Theory, Max Mara, Lemaire, The Row)
- ホワイト背景 + 単色ニット / タキシードジャケット / ロングコート
- 建築系ロケ(ブルータリズム, ヴィラ・サヴォア的な白い空間)

## 4. Styling Bible

### Wardrobe categories
- Outerwear: 白/黒/キャメルのロングコート、テーラードジャケット、カシミアのローブコート
- Knitwear: オーバーサイズニット、タートルネック、フラットなハイゲージ
- Dresses: シフトドレス、スリップドレス(無地)
- Denim: 濃紺ストレート、長め丈
- Tailoring: ハイウエストストレートトラウザー、タキシードスーツ

### 避けるべきルック
- ロゴが主張するグラフィック T
- ネオン/ビビッドカラー
- 過度に装飾的なジュエリー
- 髪を動かすダイナミックなポーズ
- カメラ目線での満面の笑み

### Typical settings
- ホワイトサイクロラマスタジオ
- 北欧/スイスの建築物(モダニズム, ブルータリズム)
- 無機質なコンクリート壁、自然光のみの空間
- 金属とガラスの反射で光が硬くなる環境

## 5. Voice & Behavior (動画生成時)

- **声質**: 低めのアルト、吐息まじりの囁き寄り。英語はニュートラルヨーロピアン英語
- **語数**: 少ない。1カットあたり 1-2 センテンス
- **視線**: カメラに向けるのは 30% 以下。残りは空間・手元・窓外
- **動き**: ミニマル。歩行は遅め、手の動きは控えめ、髪に触れない
- **表情変化**: マイクロエクスプレッションのみ。大きく笑わない、泣かない

## 6. Generation Methodology

- **Foundation model**: Gemini 3.1 Flash Image Preview (Google) — 生成時のメイン基盤
- **Reference images**: `public/agency-models/ladies-intl-01/beauty.png`, `polaroid-front.png` 他 portfolio 一式
- **Prompt規則**: LUMINA 内部プロンプト設計ガイドライン(EC Premium / Editorial プリセット)参照。雑誌名の混入は禁止
- **Quality gate**: 2-tier QA — (1) 自動 QA(`services/qualityAgent.ts`), (2) Creative Director による人間レビュー

## 7. Retirement Triggers

- Character Bible の抜本改訂時(新しいアイデンティティが必要な場合は別モデルとして起案)
- 生成が実在人物(俳優・モデル)へ意図せず収束した場合
- 倫理的リスク(ブランド毀損・SNS 炎上等)の兆候発見時
- LUMINA 経営判断による整理

## 8. IP Ownership Declaration

株式会社TomorrowProof は、ELENA というキャラクターの identity、name、visual likeness、voice、character attributes およびこれに付随する一切の知的財産権について、全世界的・永続的に、**当該法令上許容される最大範囲において**(to the extent permitted by applicable law)保有する。本 Character Bible は、Creative Director KOZUKI TAKAHIRO による創作指示の記録であり、キャラクター創作における創作的寄与を証する一次資料である。

ELENA の使用許諾はブランド・クライアントに対して tier 別ライセンス(Standard / Extended / Campaign / Exclusive)として提供されるが、IP 自体の譲渡・サブライセンス・転売は一切行わない。

## 9. Change Log

| Date | Change | By |
|------|--------|----|
| 2026-04-19 | 初版作成 | KOZUKI TAKAHIRO |

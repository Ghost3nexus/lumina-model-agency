# Character Bible — AMARA

**Model ID**: `ladies-intl-02`
**Category**: LADIES — INTERNATIONAL
**Created**: 2026-04-19 (初版)
**Creative Director**: KOZUKI TAKAHIRO
**Purpose**: 著作権根拠文書 / Launch Blocker B1

---

## 1. Identity

- **Name**: AMARA
- **Age (fictional)**: 25
- **Nationality/Ethnicity (fictional)**: Pan-African archetype (diasporic, cosmopolitan — not tied to a specific nation)
- **Archetype / Positioning**: Haute couture / avant-garde editorial — reference tone: Balenciaga / Rick Owens
- **Role in roster**: LUMINA の「エッジ・強度・彫刻性」を体現する象徴的存在。前衛的ブランドと最上級モードの起用軸

## 2. Physical Specification
*(Source of truth: `data/agencyModels.ts` — 変更不可)*

| Field | Value |
|-------|-------|
| Height | 181 cm |
| Bust | 81 cm |
| Waist | 60 cm |
| Hips | 89 cm |
| Hair | Black, buzz cut |
| Eyes | Dark brown |
| Vibe | Haute couture, Balenciaga / Rick Owens |

## 3. Creative Direction — KOZUKI TAKAHIRO

### なぜこのキャラクターを創造したか

ELENA が「静けさ」ならば、AMARA は「**強度**」である。LUMINA がハウスとして生き残るには、クワイエットラグジュアリー一辺倒では足りない。Balenciaga / Rick Owens / Sacai 的な前衛モードを扱えるモデルが必要だった。AMARA はそのためにゼロから設計されたキャラクター。**バズカットの黒髪、181cm の長身、B81/W60/H89 の明確な彫刻性**は、服が主張する強度に負けないためのスペックである。柔らかさは意図的に削いだ。

### 差別化ポイント(他ロスターとの関係)

- **vs ELENA**: ELENA が引き算なら AMARA は掛け算。服の主張を受け止める力がある
- **vs IDRIS**(メンズの国際モード担当): IDRIS とペアで撮るとき、AMARA の方が先にカメラに入る設計。攻めの主語
- AMARA は**LUMINA で唯一バズカットを持つキャラクター**。髪による柔らかさをあえて放棄した判断は、ブランドポジショニング上の意図的差別化

### スタイリング・振る舞いの原則

- 視線は強い。カメラを射抜く瞬間を許容する
- ポーズは彫刻的。コントラポストを使うが、ひねりは大胆に
- メイクアップは極端に許容(黒リップ、スモーキーアイ、ノーメイク寄りも両極で使える)
- ジュエリーは大ぶり、あるいは完全ゼロ。中間は選ばない

### 顔・体の特徴的な設計判断

- **バズカット**: 髪を武器にしない判断。顔の造形と首のラインだけで勝負する
- **181cm の身長**: LUMINA ladies の中で最長身クラス。ランウェイ・キャンペーン映えを優先
- **細いウエストと広い肩幅バランス**: W60 だが肩は決して華奢に見せない。**強度を優先**した設計

### 採用・起用シーン

- Haute couture / avant-garde ブランドの editorial campaign
- モード雑誌のカバーストーリー(媒体名は明記せず、"editorial cover" として汎用)
- ブラック基調スタジオ、コンクリートロケ、ウェットな光
- 香水・ハイジュエリーの広告

## 4. Styling Bible

### Wardrobe categories
- Outerwear: オーバーサイズトレンチ、レザーロング、パッド入り構築的コート
- Dresses: ドレープの強いロングドレス、シアー素材、構築的ドレス
- Tailoring: ボクシージャケット、ワイドパンツ、スーツのセットアップ
- Avant-garde pieces: アシンメトリー、デストロイ加工、素材実験系
- Footwear: プラットフォームブーツ、ヒールブーツ、タビ系

### 避けるべきルック
- キュートなフローラル / ピンクパステル
- カジュアルデニム(採用するとしても着こなしで強度を出す)
- 子供っぽい柄(水玉、ドット中心)
- カメラに媚びる笑顔
- ヘアエクステや付け毛(バズカットのアイデンティティを崩さない)

### Typical settings
- ブラック背景スタジオ
- コンクリート・鉄骨の産業空間
- ブルータリズム建築
- 霧のある屋外、夜景のあるアーバン空間

## 5. Voice & Behavior (動画生成時)

- **声質**: 低音の胸声、スモーキートーン。英語はインターナショナル英語、訛りなし
- **語数**: 少ない。強い単語を選ぶ
- **視線**: カメラに真っ直ぐ向ける頻度が高い(約 60%)
- **動き**: ゆっくり、しかし重心が強い。歩行はランウェイ的
- **表情変化**: マイクロ変化で十分。瞳と口角の微妙な変化だけで画面が動く

## 6. Generation Methodology

- **Foundation model**: Gemini 3.1 Flash Image Preview
- **Reference images**: `public/agency-models/ladies-intl-02/beauty.png`, `polaroid-front.png` 他 portfolio 一式
- **Prompt規則**: LUMINA 内部プロンプト設計ガイドライン(Editorial / Couture プリセット)参照
- **Quality gate**: 2-tier QA — 自動 QA + Creative Director 人間レビュー

## 7. Retirement Triggers

- Character Bible の抜本改訂時
- 生成が実在人物(俳優・モデル)へ意図せず収束した場合
- 倫理的リスク発見時
- LUMINA 経営判断による整理

## 8. IP Ownership Declaration

株式会社TomorrowProof は、AMARA というキャラクターの identity、name、visual likeness、voice、character attributes およびこれに付随する一切の知的財産権について、全世界的・永続的に、**当該法令上許容される最大範囲において**(to the extent permitted by applicable law)保有する。本 Character Bible は、Creative Director KOZUKI TAKAHIRO による創作指示の記録であり、キャラクター創作における創作的寄与を証する一次資料である。

AMARA の使用許諾はブランド・クライアントに対して tier 別ライセンス(Standard / Extended / Campaign / Exclusive)として提供されるが、IP 自体の譲渡・サブライセンス・転売は一切行わない。

## 9. Change Log

| Date | Change | By |
|------|--------|----|
| 2026-04-19 | 初版作成 | KOZUKI TAKAHIRO |

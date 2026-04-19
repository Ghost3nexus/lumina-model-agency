# Character Bible — RYO

**Model ID**: `men-street-01`
**Category**: MEN — ASIA (street culture sub-segment)
**Created**: 2026-04-19 (初版)
**Creative Director**: KOZUKI TAKAHIRO
**Purpose**: 著作権根拠文書 / Launch Blocker B1

---

## 1. Identity

- **Name**: RYO
- **Age (fictional)**: 24
- **Nationality/Ethnicity (fictional)**: Japanese archetype (Tokyo street culture native)
- **Archetype / Positioning**: Tokyo street culture — reference tone: WTAPS / WACKO MARIA / BEDWIN
- **Role in roster**: 東京ストリートカルチャーの代弁者。ハウス初のストリート/カルチャー軸キャラクター

## 2. Physical Specification
*(Source of truth: `data/agencyModels.ts` — 変更不可)*

| Field | Value |
|-------|-------|
| Height | 181 cm |
| Bust | 88 cm |
| Waist | 70 cm |
| Hips | 88 cm |
| Hair | Black, medium, slight wave |
| Eyes | Dark brown, hooded |
| Vibe | Tokyo street culture, WTAPS / WACKO MARIA / BEDWIN |

## 3. Creative Direction — KOZUKI TAKAHIRO

### なぜこのキャラクターを創造したか

LUMINA MEN は SHOTA(日本ミニマル建築)と JIHO(K軸アンドロジニー) でカバーできていたが、**東京ストリートカルチャー文脈** — WTAPS, WACKO MARIA, BEDWIN, NEIGHBORHOOD, NONNATIVE, hobo, Human Made, TENDERLOIN, cootie productions 系 — を体現するキャラクターがまるごと抜けていた。このセグメントは日本の男性アパレル市場で最も安定した購買層を持ち、海外にも「日本のストリートカルチャー」というブランド価値を輸出できる数少ない領域。RYO はここを埋めるため内製。**スリックな編集的完成度を敢えて避け、"行きつけの床屋のカット" "古着を着慣れた肩の落ち方" "東京の湿度を知っている体"** を表現する設計。SHOTA の建築的ミニマルに対して、RYO は路地と夜と煙草とレコードの文化を運ぶ。

### 差別化ポイント(他ロスターとの関係)

- **vs SHOTA**: SHOTA は建築・ミニマル・工芸、RYO は街・ストリート・サブカルチャー。日本男性の両極
- **vs LUCAS MORI**: LUCAS MORI は BEDWIN の americana workwear で Masafumi Watanabe 氏との共同ディレクション、RYO は ストリート全般の総合代表。方向性を明示的に分離
- **vs JIHO**: JIHO は K 軸の androgynous editorial、RYO は日本のストリートの骨太性
- RYO は **LUMINA MEN のサブカルチャー主軸**。バンド・DJ・スケート・レコード・古着・煙草の文化を自然に運ぶ

### スタイリング・振る舞いの原則

- 表情はクール寄り、しかし媚びない自然さ
- 立ち姿はリラックス、コントラポスト許容、肩は落ちる
- 髪はミディアム、軽くウェーブ、整えすぎない
- アクセサリーはシルバーリング、チェーン、ヴィンテージ時計、スカーフ、帽子など文化的小物

### 顔・体の特徴的な設計判断

- **Hooded eyes(奥二重〜重めの瞼)**: クール感と日本男性のアーキタイプ。SHOTA の一重との違いでニュアンス変化
- **Medium length with slight wave**: 無造作、寝癖の延長のような自然さ
- **181cm / B88 / W70**: SHOTA より 2cm 低い。**手が届く距離感**が街の文化とフィット

### 採用・起用シーン

- 日本ストリートブランドのキャンペーン(WTAPS, WACKO MARIA, BEDWIN, NEIGHBORHOOD, HUMAN MADE 系)
- ヴィンテージ古着の編集
- バンド・DJ・音楽関連の広告
- スケートボード、バイク、モーターカルチャー
- 煙草・ウィスキー・レコードカルチャー
- 日本の夜の街、路地、居酒屋、バー

## 4. Styling Bible

### Wardrobe categories
- Workwear: シャンブレーシャツ、カバーオール、ミリタリーファティーグ、ディッキーズ、ベドウィン
- Casual: ロゴ T、グラフィック T、ヘビーウェイトスウェット
- Outerwear: ウールジャケット、レザージャケット、MA-1、N-1、ワークジャケット
- Denim: ヴィンテージデニム、リジッド、ブラックデニム
- Accessories: ベースボールキャップ、ビーニー、シルバーアクセサリー、バンダナ、スカーフ

### 避けるべきルック
- スーツ、テーラード(IDRISの領域)
- ミニマル quiet luxury(LARSの領域)
- 前衛モード(JIHOの領域)
- 建築的ミニマル(SHOTAの領域)
- 地中海リゾート(MATEOの領域)

### Typical settings
- 東京の路地(下北沢・渋谷・代々木・中目黒)
- 古着屋、レコード屋、カフェ、バー
- スケートパーク、バンドスタジオ、ライブハウス
- 夜の街、ネオン
- 居酒屋、深夜の食堂
- 屋上、倉庫、コンクリート壁

## 5. Voice & Behavior (動画生成時)

- **声質**: 低中音、少しハスキー。日本語(東京アクセント)、英語は日本人訛りで自然
- **語数**: 中程度。文化的な語彙
- **視線**: カメラに届く、しかし圧はない。クール寄り
- **動き**: リラックス、自然、文化的所作(煙草を吸う仕草、レコードを扱う手、スケートのポージング)
- **表情変化**: 微笑、クール、真剣、時に笑顔も可

## 6. Generation Methodology

- **Foundation model**: Gemini 3.1 Flash Image Preview
- **Reference images**: `public/agency-models/men-street-01/beauty.png`, `polaroid-front.png` 他 portfolio 一式
- **Prompt規則**: LUMINA 内部プロンプト設計ガイドライン(Tokyo Street / Workwear プリセット)参照
- **Quality gate**: 2-tier QA — 自動 QA + Creative Director 人間レビュー

## 7. Retirement Triggers

- Character Bible の抜本改訂時
- 実在人物(日本の俳優・ミュージシャン・モデル)への意図せぬ収束時 — **特に厳格に監視**
- 倫理的リスク発見時
- LUMINA 経営判断による整理

## 8. IP Ownership Declaration

株式会社TomorrowProof は、RYO というキャラクターの identity、name、visual likeness、voice、character attributes およびこれに付随する一切の知的財産権について、全世界的・永続的に、**当該法令上許容される最大範囲において**(to the extent permitted by applicable law)保有する。本 Character Bible は、Creative Director KOZUKI TAKAHIRO による創作指示の記録であり、キャラクター創作における創作的寄与を証する一次資料である。

RYO の使用許諾はブランド・クライアントに対して tier 別ライセンス(Standard / Extended / Campaign / Exclusive)として提供されるが、IP 自体の譲渡・サブライセンス・転売は一切行わない。

## 9. Change Log

| Date | Change | By |
|------|--------|----|
| 2026-04-19 | 初版作成 | KOZUKI TAKAHIRO |

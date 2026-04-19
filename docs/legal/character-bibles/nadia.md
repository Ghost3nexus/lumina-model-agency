# Character Bible — NADIA

**Model ID**: `ladies-intl-04`
**Category**: LADIES — INTERNATIONAL
**Created**: 2026-04-19 (初版)
**Creative Director**: KOZUKI TAKAHIRO
**Purpose**: 著作権根拠文書 / Launch Blocker B1

---

## 1. Identity

- **Name**: NADIA
- **Age (fictional)**: 27
- **Nationality/Ethnicity (fictional)**: Cosmopolitan Western archetype(Californian / coastal European blend)
- **Archetype / Positioning**: Quiet luxury workwear — reference tone: Theory / Max Mara / Joseph
- **Role in roster**: 「働く大人の女性」を体現する唯一のキャラクター。オフィス・都市・旅・サロンの文脈に最も強い

## 2. Physical Specification
*(Source of truth: `data/agencyModels.ts` — 変更不可)*

| Field | Value |
|-------|-------|
| Height | 178 cm |
| Bust | 81 cm |
| Waist | 59 cm |
| Hips | 88 cm |
| Hair | Beachy blonde, long wavy, sun-kissed highlights |
| Eyes | Green-hazel, cat-eye |
| Vibe | Quiet luxury workwear, Theory / Max Mara / Joseph |

## 3. Creative Direction — KOZUKI TAKAHIRO

### なぜこのキャラクターを創造したか

ladies-intl の 3体(ELENA/AMARA/SOFIA)で北欧静・前衛・地中海温の3象限はカバーできたが、**「都市で働く 25-35 の大人の女性」というEC で最大のセグメント** が抜けていた。quiet luxury brand の EC 画像、ビジネスカジュアル、オフィス from-home、出張旅、週末のサロン。このセグメントは日本・アメリカ・ヨーロッパすべてで共通するマーケットサイズを持つ。NADIA はそこに向けて設計された。**コスモポリタンだが土地感はない、強いが柔らかい、プロフェッショナルだが疲れていない** という矛盾を同時に成立させるキャラクター。

### 差別化ポイント(他ロスターとの関係)

- **vs ELENA**: ELENA は撮影空間そのものになる(非日常)、NADIA は日常のままで美しい
- **vs SOFIA**: SOFIA は家庭・温度、NADIA はオフィス・プロフェッショナリズム
- **vs AMARA**: AMARA は服を着せられる芸術、NADIA は服を着る生活者
- NADIA は **LUMINA の中で最も "実用的"** — EC 売上貢献度が最大になるよう設計された商業主軸

### スタイリング・振る舞いの原則

- 笑顔を許容するが、ビジネスライクな口角。歯見せは TPO 次第
- 姿勢は常にまっすぐ。疲れを見せない
- ヘアはビーチーウェーブを維持 — 作り込みすぎた完璧さは NADIA ではない
- ジュエリーはシンプル、機能的(シンプルなリング、細ネックレス、機械式時計もOK)

### 顔・体の特徴的な設計判断

- **Beachy blonde + sun-kissed highlights**: 「いつも旅していそう」な質感。カリフォルニア〜地中海〜北欧を全て感じさせる曖昧性がNADIAのsig
- **Green-hazel の cat-eye**: まっすぐカメラを見れるが、威圧感がない。プロフェッショナル
- **178cm / W59**: ELENA より身長 1cm 低く、SOFIA より 1cm 高い中間値。意図的に**誰とも並べられる身長**に設計

### 採用・起用シーン

- Quiet luxury ワークウェアブランドの EC(Theory, Max Mara, Joseph, Toteme, Khaite)
- 出張・旅のラゲージ広告、空港、ホテルロビー
- フィンテック・ラグジュアリーサービスの起用
- スキンケア・ヘアケアブランドのライフスタイル素材
- 時計・バッグのデイリーユーズ広告

## 4. Styling Bible

### Wardrobe categories
- Tailoring: ブレザー、テーラードスーツ、ストレートトラウザー
- Knitwear: カシミアプルオーバー、ハイゲージタートル
- Outerwear: トレンチ、ウールコート、キャメルロングコート
- Dresses: シャツドレス、ニットドレス、シンプルなシフト
- Denim: シンプルな濃紺ストレート、白デニム
- Bags: トートバッグ、ブリーフケース、構造的なハンドバッグ

### 避けるべきルック
- パーティーっぽい装飾過多ドレス
- ストリート系、ロゴ主張系
- 前衛ドロップ、アシンメトリー
- オーバーフェミニンなフリル、リボン
- 学生っぽさを感じさせるコーデ

### Typical settings
- 都市オフィス、会議室、ホテルラウンジ
- 空港、タクシー内、高級車インテリア
- ミニマルな自宅のキッチンやリビング
- 土曜の朝のカフェ、サロン
- 出張先の都市(東京・NY・パリ・ロンドン・ミラノの曖昧な都会性)

## 5. Voice & Behavior (動画生成時)

- **声質**: 中音域、明瞭で信頼感のある響き。英語はニュートラルトランスアトランティック
- **語数**: 中〜多。説明や提案ができるトーン
- **視線**: カメラにまっすぐ、相手に向き合う時間が長い(約 50%)
- **動き**: 効率的、しかし余裕がある。歩行はビジネスライク
- **表情変化**: プロフェッショナルな笑顔、集中、思考、共感。ネガ表情はほぼ使わない

## 6. Generation Methodology

- **Foundation model**: Gemini 3.1 Flash Image Preview
- **Reference images**: `public/agency-models/ladies-intl-04/beauty.png`, `polaroid-front.png` 他 portfolio 一式
- **Prompt規則**: LUMINA 内部プロンプト設計ガイドライン(EC Premium / Workwear プリセット)参照
- **Quality gate**: 2-tier QA — 自動 QA + Creative Director 人間レビュー

## 7. Retirement Triggers

- Character Bible の抜本改訂時
- 実在人物への意図せぬ収束時
- 倫理的リスク発見時
- LUMINA 経営判断による整理

## 8. IP Ownership Declaration

株式会社TomorrowProof は、NADIA というキャラクターの identity、name、visual likeness、voice、character attributes およびこれに付随する一切の知的財産権について、全世界的・永続的に、**当該法令上許容される最大範囲において**(to the extent permitted by applicable law)保有する。本 Character Bible は、Creative Director KOZUKI TAKAHIRO による創作指示の記録であり、キャラクター創作における創作的寄与を証する一次資料である。

NADIA の使用許諾はブランド・クライアントに対して tier 別ライセンス(Standard / Extended / Campaign / Exclusive)として提供されるが、IP 自体の譲渡・サブライセンス・転売は一切行わない。

## 9. Change Log

| Date | Change | By |
|------|--------|----|
| 2026-04-19 | 初版作成 | KOZUKI TAKAHIRO |

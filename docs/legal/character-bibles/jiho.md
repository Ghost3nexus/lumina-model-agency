# Character Bible — JIHO

**Model ID**: `men-asia-02`
**Category**: MEN — ASIA
**Created**: 2026-04-19 (初版)
**Creative Director**: KOZUKI TAKAHIRO
**Purpose**: 著作権根拠文書 / Launch Blocker B1

---

## 1. Identity

- **Name**: JIHO
- **Age (fictional)**: 24
- **Nationality/Ethnicity (fictional)**: Korean archetype (Seoul-native, androgynous aesthetic)
- **Archetype / Positioning**: Androgynous editorial — reference tone: Raf Simons / Loewe
- **Role in roster**: ジェンダーの境界を越えて機能する唯一のメンズ。モード・ビューティ・K-pop カルチャー交点の主軸

## 2. Physical Specification
*(Source of truth: `data/agencyModels.ts` — 変更不可)*

| Field | Value |
|-------|-------|
| Height | 182 cm |
| Bust | 87 cm |
| Waist | 69 cm |
| Hips | 87 cm |
| Hair | Black, medium-long, soft |
| Eyes | Dark brown, double lid |
| Vibe | Androgynous editorial, Raf Simons / Loewe |

## 3. Creative Direction — KOZUKI TAKAHIRO

### なぜこのキャラクターを創造したか

2020 年代のグローバルモードで最も image authority を持つのは「**androgynous Asian men**」という事実は、世界のハイファッション広告を見れば明らか。Raf Simons, Loewe, Bottega Veneta, Saint Laurent の多くのキャンペーンで、アジア系の中性的な男性モデルが中心化している。この潮流に LUMINA が対応できる主軸として JIHO を設計。**SHOTA の骨太ミニマルの対として**、JIHO は柔らかさ・透明性・ジェンダー境界性をハウスとして引き受ける。K-beauty / K-pop 文脈とも接続する — しかし、K-pop アイドルの具体的模倣ではなく、**アーキタイプとしての韓国的な美の抽象化**。

### 差別化ポイント(他ロスターとの関係)

- **vs SHOTA**: SHOTA の骨太シンプリシティに対し、JIHO は流れる柔らかさ。MEN-ASIA の2つの極
- **vs HARIN**(同 K-beauty 軸): HARIN が女性側の磨かれた完璧性、JIHO は男性側の境界性。K-beauty 軸のペア
- **vs IDRIS**: IDRIS の国際モード硬質性に対し、JIHO はアジア発の新しい柔らかい image authority
- JIHO は **LUMINA で唯一、androgynous 軸を明示的に引き受ける** キャラクター

### スタイリング・振る舞いの原則

- 表情は静かで透明。目線は柔らかい
- 立ち姿は細身を活かす、ひねりや曲線を許容
- 髪はミディアムロング、柔らかく、動く
- アクセサリーは繊細 — ピアス(小)、細いチェーン、シルバー

### 顔・体の特徴的な設計判断

- **Double lid(二重まぶた)**: SHOTA との明示的差別化。韓国の美学への接続
- **Medium-long soft hair**: 動く髪、流れる髪。男性性を相対化する設計判断
- **182cm / W69**: メンズで最も華奢。SHOTA より 1cm 低く、W は 1cm 細い。意図的にスリム寄り
- **Androgynous proportions**: B/W/H の比率が男女境界に近く設計されている(87/69/87)

### 採用・起用シーン

- ハイファッションモードキャンペーン(Raf Simons, Loewe, Saint Laurent, Dior men)
- K-beauty / K-pop 周辺の fashion editorial
- ジェンダーニュートラル香水、化粧品広告
- ファッション誌のカバーストーリー
- 音楽・アート・写真とのクリエイティブ交差
- 女性物ウェアも着用可能(androgynous styling 案件)

## 4. Styling Bible

### Wardrobe categories
- Editorial: Raf Simons / Loewe / Saint Laurent 系のモード
- Tailoring: スリムテーラード、短めジャケット、ソフトブレザー
- Knitwear: ハイゲージ、タートル、スリムニット
- Dress pieces: ブラウス、シルクシャツ、場合によってはスカート・ドレス的アイテム
- Outerwear: トレンチ、レザーロング、オーバーサイズコート
- Accessories: 繊細ピアス、細チェーン、リング

### 避けるべきルック
- ストリート・ヒップホップ系(RYOの領域)
- タフでマスキュリンな建設作業的ワークウェア
- 筋肉誇示のフィット
- スポーツウェアを中心としたラウンジ
- 派手なプリント、ビビッドカラーフル装備

### Typical settings
- 黒基調スタジオ、ドラマチックライティング
- ソウル・東京のモダンギャラリー、美術館
- ラグジュアリーホテルの部屋、ミラー多用
- 白背景、ソフトライティング、ビューティーセットアップ
- 夜景の都市、ウェットな光

## 5. Voice & Behavior (動画生成時)

- **声質**: 中音、柔らかくやや高め。韓国語 / 英語 / 日本語
- **語数**: 中程度。繊細な発話
- **視線**: 柔らかい、カメラとの距離感は流動的
- **動き**: 流れるような所作、髪に触れる手の美しさ
- **表情変化**: 繊細、繊細、繊細。微細な変化の重ね方が JIHO の表現

## 6. Generation Methodology

- **Foundation model**: Gemini 3.1 Flash Image Preview
- **Reference images**: `public/agency-models/men-asia-02/beauty.png`, `polaroid-front.png` 他 portfolio 一式
- **Prompt規則**: LUMINA 内部プロンプト設計ガイドライン(Androgynous / Editorial プリセット)参照
- **Quality gate**: 2-tier QA — 自動 QA + Creative Director 人間レビュー

## 7. Retirement Triggers

- Character Bible の抜本改訂時
- 実在人物(K-pop アイドル・韓国俳優)への意図せぬ収束時 — **最も厳格に監視すべきモデル**
- 倫理的リスク発見時
- LUMINA 経営判断による整理

## 8. IP Ownership Declaration

株式会社TomorrowProof は、JIHO というキャラクターの identity、name、visual likeness、voice、character attributes およびこれに付随する一切の知的財産権について、全世界的・永続的に、**当該法令上許容される最大範囲において**(to the extent permitted by applicable law)保有する。本 Character Bible は、Creative Director KOZUKI TAKAHIRO による創作指示の記録であり、キャラクター創作における創作的寄与を証する一次資料である。

JIHO の使用許諾はブランド・クライアントに対して tier 別ライセンス(Standard / Extended / Campaign / Exclusive)として提供されるが、IP 自体の譲渡・サブライセンス・転売は一切行わない。

## 9. Change Log

| Date | Change | By |
|------|--------|----|
| 2026-04-19 | 初版作成 | KOZUKI TAKAHIRO |

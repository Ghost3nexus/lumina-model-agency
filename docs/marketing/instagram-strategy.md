# LUMINA MODEL AGENCY — Instagram 公式アカウント運用戦略

> **Status**: Draft for CEO review
> **Owner**: marketing (primary) + sns (execution)
> **Last Updated**: 2026-04-19
> **Launch Date**: 2026-05-10 (日)
> **Related docs**:
> - `docs/design/MASTER-claude-design-prompt.md` §1 Brand Constitution
> - `docs/design/seo-strategy.md` §6 Topic Pillars
> - `docs/legal/character-bibles/README.md`
> - `.claude/rules/branding.md` (TomorrowProof visual tone)

---

## 0. Why Instagram — 位置づけと優先順位

Instagram は LUMINA MODEL AGENCY にとって **Brand SERP 占有の第一ピラー**、かつ **B2B リードの温め所**。伝統モデルエージェンシー (IMG / Ford / DNA / Next / Next Management) は全社が Instagram を表の顔として運用しており、「AIモデルエージェンシー」が本物の Model Agency として認識されるためには Instagram の完成度が最低ラインを超えていなければならない。

### Instagram に期待する3つの役割

1. **Brand Credibility** — 「ちゃんとしたエージェンシー」であることを一瞬で伝える。プロフィール画面単体で Editorial luxury が出ていること。
2. **Roster Showcase** — 14体のキャラクターIPを、単発プロンプト出力ではなく「継続的に生きているキャラクター」として提示する場。
3. **B2B Warm Funnel** — `/for-brands` への誘導。DMでの初期相談、linkin.bio経由のInquiry Formへの遷移。

### やらないこと

- TikTok 的なスピードと数の運用(LUMINA のトーンに合わない)
- モデル本人が喋る顔出しセルフィー系(親しみやすさを出すと Editorial luxury が壊れる)
- 「AI凄い」系の技術訴求 (IP と Editorial で語る)
- ストック写真感の投稿、フィルター多用、派手な絵文字

---

## 1. Account Identity

### 1-1. Handle / Display Name

| 項目 | 確定案 | 備考 |
|---|---|---|
| **Handle** | `@lumina.models` | MEMORY.md 既定。短く、ブランド略称と直結、検索性高い。代替案 `@lumina.model.agency` はフル表記だが長く、SNSハンドルとしては冗長。`@luminaagency` はエージェンシー単体語になり「Model」が抜けるため却下。 |
| **Display Name** | `LUMINA MODEL AGENCY` | フル表記。英字大文字は Editorial luxury(Ford / Next / DNA と同列)を示す記号。 |
| **Category** | Modeling Agency | Instagram Business Categoryで選択可能。 |

**採用推奨**: **@lumina.models**(MEMORY.md 確保済みハンドル優先)

#### 代替3候補(CEOが別案を選ぶ場合の参考)

| Handle | 長所 | 短所 |
|---|---|---|
| `@lumina.models` ✅ 採用推奨 | 短い / 検索性 / MEMORY.md既定 / ブランド略称で覚えやすい | 「Agency」が含まれない |
| `@lumina.model.agency` | フル表記で正式感 / エージェンシーだと一目瞭然 | 長い / ドット2つで入力負荷 / モバイルで折返る |
| `@luminaagency` | 短い / モデル業界外のブランドとも見える | 「Model」が抜ける / Agency単体語で曖昧 |

### 1-2. Bio (150字以内、EN/JP 併記)

#### 採用案 (139字、段組5行)

```
LUMINA MODEL AGENCY
The first AI Model Agency with Character Bibles.
キャラクターIP型 AIモデルエージェンシー — 14 models.
Book a model — link below.
#LUMINAmodelagency
```

#### 代替案 A — EN主軸、簡潔

```
LUMINA MODEL AGENCY — 14 character IPs.
The first AI Model Agency with Character Bibles.
For brands → link below.
#LUMINAmodelagency #LuminaModels
```

#### 代替案 B — JP主軸、日本語話者に刺さりやすい

```
LUMINA MODEL AGENCY
キャラクター設計から始まる、AIモデルエージェンシー。
14体のロスター、月額¥5,000から。
お問い合わせ↓
#LUMINAmodelagency
```

**採用推奨**: 上記「採用案」(EN/JP 併記、CTA + ブランドhashtag)

### 1-3. Link-in-bio

- **Phase 1 (Launch〜)**: `https://lumina-model-agency.vercel.app/for-brands`
  - LUMINA LP への直結が最強。Linktree 等の中継は CVR を落とす。
- **Phase 2 (Launch +30日〜)**: Linktree or beacons.ai で複数導線化
  - `/for-brands` (B2B Inquiry)
  - `/` (THE ROSTER)
  - `/ethics`
  - 個別キャンペーン LP

### 1-4. Profile Picture

- **メイン案**: LUMINA ワードマーク — 黒背景 (`#050508`) + 白文字 (`#FAFAFA`) `LUMINA` Inter 700 tracking 0.12em
- **サイズ**: 1080×1080 PNG、円形トリム想定で中央に収まる配置
- **禁忌**: モデルの顔を入れない(1体を主役にするとエージェンシーの中立性が崩れる)。グラデ禁止、ドロップシャドウ禁止。
- **保存先**: `public/brand/ig-profile-picture.png` (生成次第)

### 1-5. Highlight Covers (6枚)

サムネは全て同一テンプレート:
- 背景: `#050508`
- 中央に Inter 700 uppercase ラベル(白文字)
- サイズ: 1080×1080 PNG

| # | Label | Purpose | Order |
|---|---|---|---|
| 1 | `ROSTER` | 14体のモデル紹介、個別にタグ付けしたストーリー再掲 | 左端(最優先) |
| 2 | `SS26 BOOK` | Lookbook SS26 (RRL系 Americana editorial) のページ切り出し | 2 |
| 3 | `FOR BRANDS` | サービス3本柱(Nomination / Production / Campaign)+ DM相談案内 | 3 |
| 4 | `ETHICS` | AI Ethics Code の1トピックずつをカルーセル化 | 4 |
| 5 | `BEHIND` | Character Bible の思想、なぜキャラクターIPなのか | 5 |
| 6 | `PRESS` | 掲載・案件事例(Launch 30日後〜、空なら Phase 2 追加) | 右端 |

**Launch day の最低ライン**: ROSTER / SS26 BOOK / FOR BRANDS / ETHICS の 4 枚。BEHIND / PRESS は Phase 2 で追加可。

---

## 2. Content Pillars — 4本柱

LUMINA Instagram の全投稿はこの4ピラーのいずれかに必ず分類される。ピラー外の思いつき投稿は禁止。

### Pillar 1 — Model Spotlights(個別モデル紹介)

- **目的**: 14体のキャラクターIPを1体ずつ「生きている存在」として提示。エージェンシーに所属している実在感を累積する。
- **フォーマット**: カルーセル5-7枚、1枚目=ポートレイト + 名前、2-7枚目=Campaign / Editorial / Polaroid / Look の異なる切り口。
- **キャプション構成**:
  - 1行目: モデル名(大文字) + division + location
  - 2段落目: Character Bible から抜粋した1-2行のキャラクター像(過剰な詩的表現禁止)
  - 3段落目: ライセンス案内 + CTA(link in bio)
- **頻度**: 週1(Phase 2以降は2週に1体)
- **優先順序 (Launch 6週)**:
  1. LUCAS MORI (BEDWIN muse、最強の差別化ストーリー)
  2. RINKA (Creators 代表、動きがあるSNS向け)
  3. ELENA (Ladies International、Editorial luxury 代表)
  4. IDRIS (Men International)
  5. MIKU (Ladies Asia、国内ブランド訴求)
  6. RYO (Street、Subculture 代表)
- **SEO**: 各投稿のキャプションに正式モデル名 + 正式division名 + "LUMINA"を自然に含める。

### Pillar 2 — Lookbook / Editorial

- **目的**: LUMINA がエージェンシーとして Editorial を自社で生産できる力を可視化。将来の SS27 / FW26 等のシーズン展開の土台。
- **フォーマット**: カルーセル6-10枚、Lookbook spread の切り出し or 連続するカット。単画像はヒーロー1枚のみ許容。
- **素材**:
  - Phase 1: `public/case-studies/lumina-lookbook-ss26/page-01.jpg` 〜 `page-09.jpg` を分割投稿(9ページ→3-4投稿)
  - Phase 2: 各モデル個別の Campaign / Editorial 画像で補填
  - Phase 3: SS27 や FW26 などの新Lookbook(季節更新)
- **キャプション構成**:
  - Vol / Issue ナンバー + タイトル(`LUMINA_Lookbook_SS26 Vol.01 — Americana`)
  - クレジット(Creative Director / Models / Tool(簡潔に))
  - hashtag セット
- **頻度**: 月2-3回。カルーセル型なので一度に投下せず分散。

### Pillar 3 — Behind the Character Bible(思想コンテンツ)

- **目的**: 競合(ai-model.jp / ai-admakers / Deep Agency)にない LUMINA 独自概念「Character Bible」「Ethics Code」を毎月1-2回発信し、カテゴリを定義する側に立つ。
- **フォーマット**: エッセイ風カルーセル5-8枚、1枚目=Statement、2-6枚目=展開、最終=CTA。テキストベース投稿が主軸。
- **トピック例**:
  - 「なぜ Character Bible なのか」 — LUCAS MORI ✕ Watanabe の舞台裏(公開許容範囲内)
  - 「AIモデルの肖像権 — 5つの誤解」(SEO Pillar 1 と連動)
  - 「モデル引退ルール — Ethics Code §5-7 解説」
  - 「Character Bible とプロンプトの違い」
- **キャプション構成**: JP essay 250-400字 + EN summary 2-3行
- **頻度**: 月2回
- **SEO**: seo-strategy.md §6 Pillar 3 / 4 と連動。Journal記事の公開タイミングでIG側も連動投稿。

### Pillar 4 — Case Study / Brand Collab(起用事例)

- **目的**: B2B 獲得の社会的証明。「実際に使われている」を可視化。
- **フォーマット**: 案件ごとにカルーセル3-5枚。ビフォーアフター、数字(コスト削減率 / 納期短縮率)、ブランド側コメント。
- **公開基準**: **ブランド側合意後のみ**。勝手に事例化しない。
- **初期コンテンツ**:
  - Launch時点: BEDWIN 26SS (LUCAS MORI muse) — Watanabe 氏合意次第公開。合意未取得時は「BEDWIN コラボ成立」のみ一次発表。
  - Phase 2: LUMINA internal demo (EC 20SKU、自社ケーススタディ)
  - Phase 3: Harajuku Creator Package (RINKA、SNS 動画 3本 + スチル 10枚)
- **頻度**: 案件成立ごと。Phase 1 は1-2本でも十分。

---

## 3. 投稿頻度 — フェーズ別

### Phase 1: Launch 週 (2026-05-10 〜 05-16)

**6投稿を1週間に集中投入**。フォロワー0からの初速獲得とアルゴリズム学習を最優先。

| 曜日 | Pillar | テーマ |
|---|---|---|
| 日 05-10 | Brand Launch | 開業公式発表 |
| 月 05-11 | Pillar 1 | ロスター紹介 Part 1 — Ladies 4体 |
| 火 05-12 | Pillar 1 | ロスター紹介 Part 2 — Men + Creators |
| 水 05-13 | Pillar 2 | Lookbook SS26 Vol.01 spread preview |
| 木 05-14 | Pillar 3 | Why Character Bibles(思想) |
| 金 05-15 | Brand / CTA | For Brands — サービス紹介 + Inquiry導線 |

詳細コピー: `docs/marketing/ig-launch-week-posts.md`

### Phase 2: Launch +4週 (2026-05-17 〜 06-07)

**週3投稿(計12投稿)**。ピラー配分を維持しながら Reels を1本投入。

- Pillar 1 × 4 (モデル1体/週)
- Pillar 2 × 3 (Lookbook SS26 の残り spread + editorial補填)
- Pillar 3 × 2 (思想投稿)
- Pillar 4 × 1 (BEDWIN コラボ正式発表 — 合意取れれば)
- Reels × 2 (うち1本は Lookbook motion cut、もう1本は LUCAS MORI or RINKA)

詳細: `docs/marketing/ig-monthly-plan.md`

### Phase 3: 安定運用 (2026-06-08 〜)

**週2投稿**。Reels月2本、カルーセル月6本。ピラー配分は4:3:2:1(Model / Lookbook / Behind / Case)。

---

## 4. フォーマット・制作ルール

### 4-1. 投稿種別と使い分け

| Format | 用途 | 比率 |
|---|---|---|
| **Carousel** (5-10枚) | メイン主軸。全投稿の70%。1枚目で止まる読者と、スワイプしきる読者の双方を掴む。 | 70% |
| **Single image** | ヒーロー級の1枚のみ許容。弱い画像を単画で出さない。 | 10% |
| **Reels** (9:16, 6-15秒) | 週1(Phase 2以降)。Lookbook motion or モデル動画。BGM は instrumental のみ、ナレーション禁止。 | 15% |
| **Story** | ほぼ毎日。投稿の告知、ロスター巡回、問い合わせ受付、裏側(控えめに)。 | 5% (feed換算) |

### 4-2. 画像スペック

| Feed 投稿 | 仕様 |
|---|---|
| 比率 | 4:5 ポートレート基調(1080×1350)。3:4 Lookbook は crop 調整 |
| 解像度 | 最低 1080×1350、推奨 2160×2700 |
| カラープロファイル | sRGB |
| ファイル形式 | JPEG quality 95 以上 or PNG |
| 文字入れ | Title Slide と Ethics/Behind投稿のみ可。写真の上に文字を乗せない |

### 4-3. デザインテンプレート

- **Title slide (Carousel 1枚目)**: `#050508` 背景 + 中央に Inter 700 白文字 + 下部に `LUMINA` ワードマーク small
- **Body slide**: 画像フルブリード、文字なし(あっても下部1行まで)
- **CTA slide (最終枚)**: `link in bio` + hashtag少なめ、黒背景

### 4-4. Reels 撮影原則

- モデル動画(Kling I2V等)の Ken Burns + motion 0.7-1.0秒のカット
- BGM: instrumental / ambient のみ(vocal禁止、K-POP禁止、TikTok流行曲禁止)
- 音量: -14 LUFS
- 縦横比: 9:16 固定
- 尺: 6-15秒(Reach最大化ゾーン)

---

## 5. ハッシュタグ戦略

全投稿に **13タグ以内**(Instagramの Sweet spot。30タグは Reach を下げる)。以下の3層から選択。

### Layer 1 — Brand-owned (毎回必須、3-4個)

```
#LUMINAmodelagency
#LuminaModels
#CharacterBible
#LuminaAgency (Optional)
```

### Layer 2 — Niche (投稿テーマに応じて3-5個)

```
#AIfashionmodel
#EditorialFashion
#DigitalFashion
#AIモデル
#AIファッション
#FictionalCharacter
#ModelRoster
```

### Layer 3 — Broad (投稿テーマに応じて3-5個、Reach用)

```
#FashionEditorial
#Lookbook
#Minimal
#Dark
#Editorial
#Lookbook2026
#SS26
```

### ハッシュタグ運用ルール

- **モデル個別hashtag は controlled** — `#LUCASMORI` `#RINKAmodel` 等の個別hashtag はキャンペーン時のみ使用。デフォルトでは使わない(乱立防止)。
- **日本語hashtag は最大2個**。英語基調を崩さない。
- **トレンドタグへの便乗禁止** — 話題の芸能・ニュース・不幸系には絶対に乗らない。
- **同じタグセットを10投稿以上連続で使わない** — Instagram のシャドウバン対策。2-3投稿ごとに Layer 2/3 を入れ替え。

---

## 6. KPI — Launch 30日後の達成目標

### Primary KPI

| 指標 | 目標値 | 根拠 |
|---|---|---|
| **フォロワー数** | 500+ | ゼロスタートの業界標準。Lookbook + LUCAS MORI 初日露出で100、週次追加で累積 |
| **投稿平均エンゲージメント率** | 5%+ | Editorial系IGアカウントの上位ライン(業界平均は1-3%) |
| **DM 問い合わせ数** | 10件+ | うち B2B(ブランド) 3件以上、残りは個人・メディア |

### Secondary KPI

| 指標 | 目標値 |
|---|---|
| Profile visit → Follow 転換率 | 8%+ |
| Link-in-bio クリック数 | 300+ / 30日 |
| Story 閲覧完走率 | 60%+ |
| Saved 数(投稿別) | 平均 50+ |
| Share 数(投稿別) | 平均 20+ |
| 投稿への Comment 数 | 平均 10+ |

### 計測方法

- Instagram Insights を週次集計
- 毎週月曜 08:00 に sns agent が前週レポートを CEO に提出
- 30日後の Launch Review ミーティングで Phase 2 方針調整

---

## 7. 運用体制

### 7-1. 担当分担

| 役割 | 担当 | タスク |
|---|---|---|
| 戦略策定 | marketing | 本ドキュメント管理、ピラー調整、月次プラン |
| コンテンツ制作 | writer | キャプション下書き |
| ビジュアル | visualizer | 画像選定、Title Slide 制作、Lookbook crop |
| 投稿実行 | sns | スケジュール管理、hashtag運用、DM返信1次対応 |
| 最終承認 | KOZUKI (CEO) | 全投稿キャプション + 画像の最終確認(Launch週は1投稿ごと、Phase 2以降は週次まとめ) |

### 7-2. 投稿フロー

```
前週金曜: sns が翌週の投稿ドラフトをまとめて CEO に提出
月曜朝:  CEO 承認 (または修正指示)
投稿前日: sns が画像アップロード + キャプション最終化
投稿日:  指定時刻に投稿 + Story告知
投稿後2H: エンゲージメント初速チェック (sns)
```

### 7-3. 投稿時刻

| 曜日 | ベスト時刻 | 根拠 |
|---|---|---|
| 平日 | 12:00-12:30 JST / 19:30-20:30 JST | 昼休憩・夜リラックス帯 |
| 土日 | 11:00 JST / 21:00 JST | 朝ブランチ・夜 |

**Launch week** は話題性重視で 18:00-19:00 JST 中心に配置(多数のフォロワーが見ているゴールデンタイム)。

### 7-4. DM 返信ルール

| DM種別 | 1次対応 | 所要時間目安 |
|---|---|---|
| ブランド/企業からの問い合わせ | `/for-brands` Inquiry Form 案内 + 概要ヒアリング | 24H以内 |
| モデル応募的DM | 定型文「LUMINAは全てキャラクターIPです」で丁寧に断る | 48H以内 |
| メディア取材 | ethics@lumina-models.com への誘導 | 48H以内 |
| 一般質問 | link in bio 誘導 + 関連投稿へのリプリンク | 72H以内 |

**全DMログ**: Supabase or Notion に記録(将来の営業分析用)。

---

## 8. Voice & Tone — キャプション執筆ガイド

### 基本ルール

1. **JP primary / EN secondary** — 日本語本文 200-400字、英語は2-3行のサマリーのみ。
2. **絵文字は基本ゼロ、最大1投稿に1個**。使うなら `—` `/` `·` などの記号で構造を出す。
3. **「AI凄い」的宣伝NG** — 「Character IP」「Roster」「Editorial」「Lookbook」「Nomination」等のファッション業界語でブランドを保つ。
4. **「世界初」「革命」等の強気コピーNG** — 代わりに「The first with Character Bibles」等の条件付き表現。
5. **モデル名は全大文字** (例: `LUCAS MORI`, `ELENA`, `RINKA`) — Ford / Next / DNA等の伝統エージェンシー文法を踏襲。
6. **価格訴求は控えめ** — 「月¥5,000から」は最終行に1回まで。IG では Editorial を、LP で価格を語る使い分け。

### NG 表現例 → OK 表現例

| NG(使わない) | OK(代替) |
|---|---|
| 🔥革命的なAIモデル！ | LUMINA introduces a new roster. |
| 世界初のAIモデルエージェンシー誕生 | The first AI Model Agency with Character Bibles. |
| 美女モデル爆誕✨ | LUCAS MORI — Men Signature, BEDWIN 26SS muse. |
| 写真はすべてAI生成です！ | All LUMINA models are fictional characters governed by Character Bibles. |
| もう撮影コストに悩まない | From casting to content, handled in one roster. |

### カルーセル本文テンプレート

```
[モデル名 / タイトル, 全大文字]
[Division · Location · 1行キャラ description]

[日本語本文 200-400字]
[段落分けで読みやすく]

[English summary 2-3 lines.]

Book — link in bio.

#LUMINAmodelagency #LuminaModels #CharacterBible
#[Niche層3-5個]
#[Broad層3-5個]
```

---

## 9. リスク & 禁忌

### 9-1. 絶対禁止

- **実在有名人の顔/名前と見紛う表現** — Ethics Code §3 直結。モデル紹介で「〇〇さん似」等は絶対NG。
- **未合意ブランドとのコラボ発表** — 契約完了前の投稿は禁止。
- **差別的・性的・政治的コンテンツ** — Ethics Code §4 brand safety に準拠。
- **フォロワー買い** — 将来の BAN リスクと信用失墜。
- **他社モデルの投稿へのコメント/タグ付けでの売込み** — Reach スパム行為。

### 9-2. 要注意領域

- **モデル同士の関係性演出** — 「〇〇と〇〇はカップル設定」等はCharacter Bible に記載のないものを勝手に作らない。
- **ユーザー生成コンテンツ(UGC)** — 誰かが LUMINA モデルの画像を再アップロードした場合、IP License上の扱いを都度 Legal 確認してからシェア。
- **ハッシュタグジャック** — 人気hashtag に無関係に便乗しない(例: `#fashionweek` を投稿内容が FW と無関係なのに付けない)。

### 9-3. 緊急対応

| 事態 | 対応 | 担当 |
|---|---|---|
| 投稿に技術的バグ(ぼやけ画像等) | 24H以内に削除→再投稿 | sns |
| ネガティブコメント爆発 | 個別返信しない、削除もしない(削除は炎上を悪化させる)、48H経過後 CEO 判断 | sns → CEO |
| 実在人物類似の指摘 | 即時 Ethics Code §3 に従い retire + 該当投稿削除 | CEO + Legal |
| なりすましアカウント出現 | Instagram 公式に報告、Bio で告知 | sns + CEO |

---

## 10. Phase 2 以降の進化ロードマップ

### Phase 2 (Launch +30日〜60日)

- **Reels 週1化** — Lookbook motion + モデル個別動画
- **UGC収集** — `#LUMINAmodels` ハッシュタグ運用、起用ブランド側の投稿をリポスト
- **Story Highlight 2枚追加** — BEHIND / PRESS
- **Meta App Review 準備** — 将来的に Graph API 経由の半自動投稿を検討

### Phase 3 (Launch +60日〜)

- **EN 運用強化** — 海外ブランド案件獲得時、EN 比率を 30% → 50% に
- **Collab posts** — クライアントブランド側とのコラボ投稿機能活用
- **Instagram Shop 連携** — クライアントのShopifyストアへの直接導線
- **モデル個別アカウント** — RINKA 等の Creator ティアのみ個別 IG アカウントを持つ(本戦略は LUMINA 公式のみが対象)

### Phase 4 (Launch +90日〜)

- **Ads 運用開始** — B2B リード獲得目的、`/for-brands` 遷移を最適化
- **Pinterest / TikTok 連動** — LUMINA Pinterest Board 開設、TikTok は慎重検討
- **Brand SERP 占有完了** — `LUMINA MODEL AGENCY` 検索で IG top 3 に表示

---

## 11. Launch Day チェックリスト

Launch 当日 (2026-05-10) の最低ライン:

- [ ] ハンドル `@lumina.models` 確保済み(Business account化、カテゴリ「Modeling Agency」)
- [ ] プロフィール画像設定済み (LUMINA ワードマーク)
- [ ] Bio 設定済み
- [ ] Link-in-bio 設定済み (`lumina-model-agency.vercel.app/for-brands`)
- [ ] Highlight cover 4枚(ROSTER / SS26 BOOK / FOR BRANDS / ETHICS)を作成・配置
- [ ] Launch day 投稿1 (開業宣言) のドラフト + 画像承認済み
- [ ] Launch週 2-6 の投稿ドラフト完了
- [ ] DM自動返信テンプレ設定
- [ ] Instagram Insights にアクセス可能(Business account 化済み)
- [ ] Meta Business Suite で連携済み(FB Page 作成済み)

---

## 12. 参考ベンチマーク IG アカウント

LUMINA が参考にすべき(=模倣ではなく、Editorial luxury のトーン学習):

| Category | Account | 参考点 |
|---|---|---|
| 伝統エージェンシー | `@imgmodels` | ロスターの並べ方、モデル個別カルーセル |
| 伝統エージェンシー | `@nextmodels` | Editorial基調、過度な動きがない |
| 伝統エージェンシー | `@fordmodels` | Highlight整理、投稿種別のバランス |
| AI競合(反面教師) | Deep Agency 関連 | 技術訴求が強すぎて Editorial 感がない |
| Editorial magazine | `@i_d` | 文字と写真の黄金比、暗い基調 |
| Editorial magazine | `@dazed` | Post-Internet のEditorial基準 |
| Lookbook派 | `@rrl` (RRL / Ralph Lauren) | Americana editorial の教科書 |
| Brand tone 参考 | `@bedwin_and_the_heartbreakers` | LUCAS MORI 世界観の源泉 |

---

## 13. 変更履歴

| Date | Change | By |
|---|---|---|
| 2026-04-19 | 初版作成 (Launch 2026-05-10 に向けて) | marketing (代行作成) |

---

**Document Owner**: marketing (primary) + sns (execution) + CEO (approval)
**Status**: Draft — CEO レビュー待ち
**Next step**: CEO 承認 → Launch week 投稿詳細 (`ig-launch-week-posts.md`) ドラフト合意 → Phase 2 plan (`ig-monthly-plan.md`) レビュー

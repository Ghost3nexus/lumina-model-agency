# Canva MCP ガイド — Visualizer Agent 向け

> 最終更新: 2026-03-05
> ソース: Canva公式ドキュメント + MCPツールスキーマ実検証

---

## 目次

1. [概要とアーキテクチャ](#1-概要とアーキテクチャ)
2. [全ツール一覧と引数リファレンス](#2-全ツール一覧と引数リファレンス)
3. [ブログサムネイル生成ワークフロー](#3-ブログサムネイル生成ワークフロー)
4. [note.com用OGP画像の生成手順](#4-notecom用ogp画像の生成手順)
5. [SNS投稿画像の生成手順](#5-sns投稿画像の生成手順)
6. [インフォグラフィック・図解の生成方法](#6-インフォグラフィック図解の生成方法)
7. [プレゼンテーション生成ワークフロー](#7-プレゼンテーション生成ワークフロー)
8. [ブランドキット連携](#8-ブランドキット連携)
9. [TomorrowProofブランド準拠プロンプトテンプレート集](#9-tomorrowproofブランド準拠プロンプトテンプレート集)
10. [完全ワークフロー: 記事テーマからブログ埋め込みまで](#10-完全ワークフロー-記事テーマからブログ埋め込みまで)
11. [エラーハンドリング・よくある問題](#11-エラーハンドリングよくある問題)

---

## 1. 概要とアーキテクチャ

### Canva MCPとは

Canva MCP（Model Context Protocol）サーバーは、Claude CodeからCanvaのデザイン機能に直接アクセスするための接続レイヤー。自然言語プロンプトでデザイン生成・編集・エクスポートが可能。

### ツールの全体像

```
[生成系]
  generate-design          → AIプロンプトからデザイン候補を生成
  generate-design-structured → レビュー済みアウトラインからプレゼン生成
  create-design-from-candidate → 生成候補を正式なCanvaデザインに変換

[検索・取得系]
  search-designs            → 既存デザインをキーワード検索
  get-design                → デザイン詳細情報の取得
  get-design-pages          → ページ一覧とサムネイル取得
  get-design-content        → デザインのコンテンツ取得
  get-presenter-notes       → プレゼンターノート取得
  resolve-shortlink         → 短縮URLの解決

[編集系]
  start-editing-transaction   → 編集セッション開始
  perform-editing-operations  → 編集操作の実行
  commit-editing-transaction  → 編集の確定・保存
  cancel-editing-transaction  → 編集のキャンセル
  get-design-thumbnail       → 編集中サムネイル取得

[エクスポート系]
  export-design             → デザインをPNG/JPG/PDF等にエクスポート
  get-export-formats        → 対応エクスポート形式の確認
  resize-design             → デザインのリサイズ

[アセット系]
  upload-asset-from-url     → URLから画像/動画をCanvaにアップロード
  get-assets                → アセットのメタデータ・サムネイル取得

[フォルダ管理系]
  create-folder             → フォルダ作成
  move-item-to-folder       → アイテムをフォルダに移動
  list-folder-items         → フォルダ内アイテム一覧
  search-folders            → フォルダ検索

[ブランド系]
  list-brand-kits           → ブランドキット一覧取得
  request-outline-review    → プレゼンアウトラインのレビュー依頼

[コラボ系]
  comment-on-design         → デザインにコメント追加
  list-comments             → コメント一覧取得
  list-replies              → 返信一覧取得
  reply-to-comment          → コメントへの返信

[インポート系]
  import-design-from-url    → URLからデザインをインポート
```

### 重要な制約

- `user_intent` パラメータ: 全ツールに必須。255文字以内で意図を簡潔に記述する
- `design_id`: 11文字、`D`で始まるパターン（例: `DABcD1efGHi`）
- デザイン生成は**候補（candidate）**として返される。正式なデザインにするには `create-design-from-candidate` が必要
- 生成されたURLの中のIDはdesign_idではない。混同しないこと

---

## 2. 全ツール一覧と引数リファレンス

### 2.1 generate-design（デザインAI生成）

**最も重要なツール。** AIプロンプトからデザイン候補を生成する。

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `query` | string | YES | デザイン内容を記述する自然言語プロンプト。詳細であるほど高品質 |
| `design_type` | enum | YES（推奨） | デザイン形式を指定。下記の選択肢参照 |
| `brand_kit_id` | string | NO | ブランドキットID。使用前に `list-brand-kits` で取得 |
| `asset_ids` | string[] | NO | 挿入するアセットID。最大10個。順番通りに挿入される |
| `user_intent` | string | YES | 意図の説明（255文字以内） |

#### design_type 選択肢

| 値 | 用途 | TomorrowProofでの使用頻度 |
|----|------|------------------------|
| `twitter_post` | X投稿画像（1200x675） | 高 |
| `instagram_post` | IG投稿画像（1080x1080） | 高 |
| `poster` | ポスター・サムネイル | 高 |
| `infographic` | インフォグラフィック | 高 |
| `facebook_post` | Facebookポスト | 中 |
| `facebook_cover` | Facebookカバー | 低 |
| `your_story` | ストーリーズ（縦型） | 中 |
| `youtube_thumbnail` | YouTube サムネイル | 中 |
| `youtube_banner` | YouTubeバナー | 低 |
| `pinterest_pin` | Pinterestピン（縦長） | 中 |
| `presentation` | プレゼンテーション (**注意: 後述**) | 中 |
| `doc` | Canva Doc（テキスト主体の文書） | 低 |
| `document` | ページベースの文書テンプレート | 低 |
| `flyer` | フライヤー | 低 |
| `logo` | ロゴ | 低 |
| `business_card` | 名刺 | 低 |
| `resume` | 履歴書 | 低 |
| `report` | レポート（チャート・グラフ付き） | 低 |
| `proposal` | 提案書（ビジュアル付き） | 低 |
| `invitation` | 招待状 | 低 |
| `card` | カード | 低 |
| `postcard` | ポストカード | 低 |
| `photo_collage` | フォトコラージュ | 低 |
| `desktop_wallpaper` | デスクトップ壁紙 | 低 |
| `phone_wallpaper` | スマホ壁紙 | 低 |

**重要な制約:**
- `presentation` は `generate-design` で直接生成すると品質が低い。プレゼンは `request-outline-review` → `generate-design-structured` のフローを使うこと
- `query` が汎用的すぎると `'Common queries will not be generated'` エラーが返る。詳細なコンテキストを必ず含める

#### queryの書き方ベストプラクティス

```
BAD:  "ブログのサムネイル"
BAD:  "tech blog thumbnail"
GOOD: "Dark minimal tech blog thumbnail about AI agents automating
       business operations. Black background (#050508) with floating
       abstract geometric shapes. Cyan (#00D4FF) accent lighting on
       edges. No text on the image. Professional, edgy, futuristic.
       Nothing Tech inspired aesthetic."
```

ポイント:
1. **テーマ・主題を具体的に**: 何についてのデザインか明記
2. **ビジュアルスタイルを指定**: 色、雰囲気、参考ブランド
3. **構図を指示**: 配置、構成要素、余白の使い方
4. **禁止事項を明記**: テキスト不要、人物不要、など
5. **前回の会話コンテキストは引き継がれない**: 毎回フルで記述する

---

### 2.2 create-design-from-candidate（候補をデザインに変換）

生成された候補を正式なCanvaデザインに変換する。この手順を踏まないとエクスポートや編集ができない。

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `job_id` | string | YES | `generate-design` のレスポンスに含まれるジョブID |
| `candidate_id` | string | YES | 選択した候補のID |
| `user_intent` | string | YES | 意図の説明 |

**使用フロー:**
```
1. generate-design → 複数の候補が返る（candidate_id + preview thumbnail + URL）
2. ユーザーに好みの候補を選んでもらう
3. create-design-from-candidate → design_id が返る
4. この design_id でエクスポートや編集が可能になる
```

---

### 2.3 export-design（デザインエクスポート）

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `design_id` | string | YES | デザインID（11文字、D始まり） |
| `format` | object | YES | エクスポート設定（下記参照） |
| `user_intent` | string | YES | 意図の説明 |

#### format オブジェクト

| プロパティ | 型 | 対応形式 | 説明 |
|-----------|------|---------|------|
| `type` | enum | 全形式 | `"png"` `"jpg"` `"pdf"` `"gif"` `"pptx"` `"mp4"` |
| `width` | number | png/jpg/gif | 幅（px）。40-25000 |
| `height` | number | png/jpg/gif | 高さ（px）。40-25000 |
| `quality` | number/string | jpg: 1-100, mp4: string | JPG品質 or 動画品質 |
| `export_quality` | enum | 全形式 | `"regular"` or `"pro"` |
| `transparent_background` | boolean | png | 透過背景（default: false） |
| `lossless` | boolean | png | ロスレス圧縮（default: true） |
| `as_single_image` | boolean | png | 複数ページを1画像に統合 |
| `pages` | number[] | pdf/png/jpg/gif/pptx/mp4 | エクスポート対象ページ（1始まり） |
| `size` | enum | pdf | `"a4"` `"a3"` `"letter"` `"legal"` |

**エクスポート前に必ず `get-export-formats` で対応形式を確認すること。**

#### よく使うエクスポート設定

```json
// ブログ用PNG（高品質）
{
  "type": "png",
  "width": 1200,
  "height": 630,
  "export_quality": "regular"
}

// SNS用JPG（X投稿）
{
  "type": "jpg",
  "width": 1200,
  "height": 675,
  "quality": 90
}

// Instagram用PNG
{
  "type": "png",
  "width": 1080,
  "height": 1080
}

// 透過背景PNG
{
  "type": "png",
  "width": 1200,
  "height": 630,
  "transparent_background": true
}
```

---

### 2.4 resize-design（デザインリサイズ）

1つのデザインを別サイズにリサイズする。SNSマルチ展開に便利。

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `design_id` | string | YES | デザインID |
| `design_type` | object | YES | リサイズ先のサイズ指定 |
| `user_intent` | string | YES | 意図の説明 |

#### design_type オブジェクト

```json
// プリセットリサイズ
{ "type": "preset", "name": "presentation" }  // doc, whiteboard, presentation

// カスタムリサイズ
{ "type": "custom", "width": 1080, "height": 1080 }  // ピクセル指定
```

**SNSマルチ展開の例:**
```
元デザイン（ブログサムネ 1200x630）
  → resize → X投稿: custom 1200x675
  → resize → IG投稿: custom 1080x1080
  → resize → Pinterestピン: custom 1000x1500
  → resize → LinkedIn: custom 1200x627
```

---

### 2.5 upload-asset-from-url（アセットアップロード）

外部URLの画像・動画をCanvaにアップロードし、デザインで使えるようにする。

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `url` | string (URI) | YES | アップロード元のURL |
| `name` | string | YES | アセット名 |
| `user_intent` | string | YES | 意図の説明 |

**返り値に `asset_id` が含まれる。これを `generate-design` の `asset_ids` や `perform-editing-operations` の `insert_fill`/`update_fill` で使用する。**

**エラー対処:** `"Missing scopes: [asset:write]"` が出たら、ユーザーにCanvaコネクタの再接続を依頼する。

---

### 2.6 get-export-formats（エクスポート形式確認）

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `design_id` | string | YES | デザインID |
| `user_intent` | string | YES | 意図の説明 |

**必ず `export-design` の前に呼ぶこと。** デザインタイプによって対応形式が異なる。

---

### 2.7 編集トランザクション系（3ツールセット）

既存デザインの内容を変更する場合に使用する。

#### start-editing-transaction

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `design_id` | string | YES | 編集対象デザインID |
| `user_intent` | string | YES | 意図の説明 |

**返り値:** `transaction_id`（以降のすべての編集操作で使用）+ デザイン内の全テキスト要素・メディア要素の情報

#### perform-editing-operations

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `transaction_id` | string | YES | 編集トランザクションID |
| `operations` | array | YES | 編集操作の配列（下記参照） |
| `page_index` | number | YES | 最初に更新するページ番号（1始まり） |
| `user_intent` | string | YES | 意図の説明 |

##### 操作タイプ一覧

| type | 用途 | 主な引数 |
|------|------|---------|
| `update_title` | デザインタイトル変更 | `title` |
| `replace_text` | テキスト要素の全文置換 | `element_id`, `text` |
| `find_and_replace_text` | テキストの部分置換 | `element_id`, `find_text`, `replace_text` |
| `update_fill` | 画像/動画の差し替え | `element_id`, `asset_type`, `asset_id`, `alt_text` |
| `insert_fill` | 画像/動画の挿入 | `page_id`, `asset_type`, `asset_id`, `alt_text`, (位置・サイズ) |
| `delete_element` | 要素の削除 | `element_id` |
| `position_element` | 要素の位置変更 | `element_id`, `top`, `left` |
| `resize_element` | 要素のリサイズ | `element_id`, `width`, (`height`, `preserve_aspect_ratio`) |
| `format_text` | テキスト書式設定 | `element_id`, `formatting` |

##### format_text の formatting オプション

```json
{
  "color": "#00D4FF",           // テキスト色（hex）
  "text_align": "center",       // start / center / end
  "font_size": 48,              // 1-800
  "font_weight": "bold",        // normal / bold
  "font_style": "italic",       // normal / italic
  "decoration": "underline",    // none / underline
  "strikethrough": "none",      // none / strikethrough
  "line_height": 1.2,           // 0.5-2.5
  "link": "https://...",        // URL or "" で削除
  "list_level": 1,              // 0でリスト解除、1以上でリスト
  "list_marker": "disc"         // none/disc/circle/square/decimal/lower-alpha/lower-roman
}
```

**注意:** フォントファミリーの変更は非対応。サイズ・ウェイト・スタイルのみ変更可能。

#### commit-editing-transaction

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `transaction_id` | string | YES | コミットする編集トランザクションID |
| `user_intent` | string | YES | 意図の説明 |

**必ずユーザーの確認を得てから実行する。** コミット失敗時はすべての変更が失われる。

#### cancel-editing-transaction

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `transaction_id` | string | YES | キャンセルする編集トランザクションID |
| `user_intent` | string | YES | 意図の説明 |

---

### 2.8 search-designs（デザイン検索）

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `query` | string | NO | 検索キーワード（使用時は `sort_by` を `"relevance"` に） |
| `sort_by` | enum | NO | `relevance`, `modified_descending`, `modified_ascending`, `title_descending`, `title_ascending` |
| `ownership` | enum | NO | `any`（全て）, `owned`（自分の）, `shared`（共有された） |
| `continuation` | string | NO | ページネーショントークン（前回のレスポンスから取得） |
| `user_intent` | string | YES | 意図の説明 |

**注意:** テンプレート検索には使えない。テンプレートは `search-brand-templates` を使うこと。

---

### 2.9 get-design（デザイン詳細取得）

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `design_id` | string | YES | デザインID（11文字、D始まり） |
| `user_intent` | string | YES | 意図の説明 |

**返り値:** オーナー情報、タイトル、編集/閲覧URL、サムネイル、作成/更新日時、ページ数

---

### 2.10 list-brand-kits（ブランドキット一覧）

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `continuation` | string | NO | ページネーショントークン |
| `user_intent` | string | YES | 意図の説明 |

**返り値:** ブランドキットID、名前、サムネイル

**エラー対処:** `"Missing scopes: [brandkit:read]"` が出たら、ユーザーにCanvaコネクタの再接続を依頼する。

---

### 2.11 get-assets（アセットメタデータ取得）

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `asset_ids` | string[] | YES | 取得するアセットIDの配列 |
| `user_intent` | string | YES | 意図の説明 |

画像差し替え時に、ページ内の複数画像のうちどれを差し替えるか特定するために使用する。

---

## 3. ブログサムネイル生成ワークフロー

### ステップバイステップ

```
Step 1: generate-design でサムネイル候補を生成
  ↓
Step 2: ユーザーが候補を選択
  ↓
Step 3: create-design-from-candidate で正式デザインに変換
  ↓
Step 4: （必要なら）start-editing-transaction で微調整
  ↓
Step 5: get-export-formats で対応形式を確認
  ↓
Step 6: export-design でPNG/JPGにエクスポート
  ↓
Step 7: ダウンロードURLをユーザーに共有
```

### 実行例

#### Step 1: デザイン生成

```
ツール: generate-design
パラメータ:
  query: "Dark minimal blog thumbnail for an article about how AI agents
          are transforming small business operations in Japan. Deep black
          background (#050508). Central composition: abstract isometric
          3D blocks representing interconnected AI systems, with electric
          cyan (#00D4FF) edge lighting and data flow lines. Subtle grid
          in dark gray (#1A1A2E). No text. No humans. Clean, architectural,
          futuristic. Nothing Tech and Apple inspired aesthetic. Premium
          tech feel."
  design_type: "poster"
  user_intent: "ブログ記事のサムネイル画像を生成する"
```

**注意:** ブログサムネイルには `poster` タイプが最適。専用のブログサムネイルタイプは存在しない。

#### Step 2: 候補選択

レスポンスに含まれる候補一覧（サムネイル付き）からユーザーに選んでもらう。

#### Step 3: デザイン変換

```
ツール: create-design-from-candidate
パラメータ:
  job_id: "（generate-designのレスポンスから）"
  candidate_id: "（選択した候補のIDから）"
  user_intent: "選択したサムネイル候補を正式なCanvaデザインに変換する"
```

#### Step 4: 微調整（オプション）

テキスト追加や色調整が必要な場合:

```
ツール: start-editing-transaction
パラメータ:
  design_id: "（Step 3で取得したdesign_id）"
  user_intent: "ブログサムネイルのテキストや色を微調整する"
```

#### Step 5-6: エクスポート

```
ツール: get-export-formats
パラメータ:
  design_id: "（design_id）"
  user_intent: "エクスポート可能な形式を確認する"

ツール: export-design
パラメータ:
  design_id: "（design_id）"
  format:
    type: "png"
    width: 1200
    height: 630
    export_quality: "regular"
  user_intent: "ブログサムネイルをPNG形式でエクスポートする"
```

**返り値にダウンロードURLが含まれる。これをユーザーに共有する。**

---

## 4. note.com用OGP画像の生成手順

### 仕様

- サイズ: 1280 x 670 px
- アスペクト比: 1.91:1
- フォーマット: PNG or JPG

### 実行手順

```
ツール: generate-design
パラメータ:
  query: "Dark minimal OGP image for a Japanese tech blog on note.com.
          Article topic: [記事テーマを具体的に記述].
          Deep black background (#050508). Abstract geometric composition
          in the right two-thirds. Left third kept relatively clean for
          text overlay (will be added separately in note.com editor).
          Cyan (#00D4FF) accent lighting. Dark charcoal shapes (#0A0A0F)
          with thin borders (#1A1A2E). No text embedded in the image.
          Premium, minimal, tech-forward aesthetic.
          Dimensions: 1280x670px."
  design_type: "poster"
  user_intent: "note.com記事用のOGP画像を生成する"
```

エクスポート:
```
format:
  type: "png"
  width: 1280
  height: 670
  export_quality: "regular"
```

---

## 5. SNS投稿画像の生成手順

### 5.1 X（Twitter）投稿画像

**サイズ: 1200 x 675 px（16:9）**

```
ツール: generate-design
パラメータ:
  query: "Minimalist dark social media card for X/Twitter post.
          Topic: [投稿テーマ].
          Deep black background (#050508). Bold typographic layout
          with space for text overlay. Thin horizontal cyan (#00D4FF)
          accent line. Subtle geometric element in corner.
          Clean, premium, editorial feel. Nothing Tech inspired.
          No embedded text (will be added separately).
          1200x675px horizontal format."
  design_type: "twitter_post"
  user_intent: "X投稿用の画像を生成する"
```

エクスポート:
```json
{ "type": "png", "width": 1200, "height": 675 }
```

### 5.2 Instagram投稿画像

**フィード正方形: 1080 x 1080 px（1:1）**

```
ツール: generate-design
パラメータ:
  query: "Dark minimal Instagram post design.
          Topic: [投稿テーマ].
          Black background (#050508). Bold visual element centered.
          Cyan (#00D4FF) accent highlights. Dark card elements (#0A0A0F)
          with thin borders (#1A1A2E). Space for text overlay.
          Clean, premium, tech aesthetic. Square format 1080x1080px."
  design_type: "instagram_post"
  user_intent: "Instagram投稿用の正方形画像を生成する"
```

**カルーセル用（縦長）: 1080 x 1350 px（4:5）**

カルーセルの場合は、1枚ずつ生成するか、正方形を生成してからリサイズする:

```
ツール: resize-design
パラメータ:
  design_id: "（元のdesign_id）"
  design_type: { "type": "custom", "width": 1080, "height": 1350 }
  user_intent: "IGカルーセル用に縦長にリサイズする"
```

**ストーリーズ: 1080 x 1920 px（9:16）**

```
design_type: "your_story"
```

### 5.3 LinkedIn投稿画像

**サイズ: 1200 x 627 px**

```
ツール: generate-design
パラメータ:
  query: "Professional dark minimal LinkedIn post image.
          Topic: [テーマ].
          Black background (#050508). Clean, business-appropriate
          geometric composition. Cyan (#00D4FF) accent on key element.
          Data-driven feel with abstract chart or graph elements.
          No text. Professional, credible, tech-forward.
          1200x627px horizontal format."
  design_type: "facebook_post"
  user_intent: "LinkedIn投稿用の画像を生成する"
```

**注意:** LinkedInには専用のdesign_typeがない。`facebook_post` を使用し、エクスポート時にサイズ指定する。

### 5.4 Pinterest ピン

**サイズ: 1000 x 1500 px（2:3 縦長）**

```
ツール: generate-design
パラメータ:
  query: "Dark minimal Pinterest pin design. Vertical format.
          Topic: [テーマ].
          Black background (#050508). Bold visual hierarchy with
          key visual element at top, space for text in middle,
          subtle branding element at bottom. Cyan (#00D4FF) accents.
          Eye-catching but minimal. 1000x1500px vertical."
  design_type: "pinterest_pin"
  user_intent: "Pinterest用の縦長ピン画像を生成する"
```

### 5.5 マルチプラットフォーム展開ワークフロー

1つのデザインから複数SNS向けにリサイズする効率的な方法:

```
Step 1: ブログサムネイル（1200x630）を generate-design で生成
Step 2: create-design-from-candidate で正式化
Step 3: resize-design で各SNSサイズに展開:
  → X用: custom 1200x675
  → IG用: custom 1080x1080
  → Pinterest用: custom 1000x1500
  → LinkedIn用: custom 1200x627
Step 4: 各デザインを export-design でエクスポート
```

---

## 6. インフォグラフィック・図解の生成方法

### Canva MCPでのインフォグラフィック

```
ツール: generate-design
パラメータ:
  query: "Dark minimal infographic about [テーマ].
          Vertical layout. Black background (#050508).
          Data sections separated by thin lines (#1A1A2E).
          Key numbers/statistics highlighted in cyan (#00D4FF).
          Dark card sections (#0A0A0F) for each data point.
          Clean iconography (line style). Minimal text areas.
          Professional, data-driven, tech aesthetic.
          TomorrowProof brand style."
  design_type: "infographic"
  user_intent: "データインフォグラフィックを生成する"
```

### 編集トランザクションでのデータ更新

生成後にデータを正確な数値に更新する場合:

```
Step 1: start-editing-transaction
Step 2: perform-editing-operations
  operations: [
    {
      "type": "find_and_replace_text",
      "element_id": "（テキスト要素ID）",
      "find_text": "XX%",
      "replace_text": "47%"
    },
    {
      "type": "format_text",
      "element_id": "（テキスト要素ID）",
      "formatting": { "color": "#00D4FF", "font_weight": "bold" }
    }
  ]
  page_index: 1
Step 3: commit-editing-transaction
```

### Canva MCP vs HTML/CSS vs Mermaid の使い分け

| 判断基準 | Canva MCP | HTML/CSS | Mermaid |
|---------|-----------|----------|---------|
| ビジュアル品質 | S | A | B |
| データ精度 | B（編集必要） | S（コードで制御） | A |
| 制作速度 | 速い | 中 | 速い |
| ブランド準拠 | A（プロンプト次第） | S（CSS変数で完全制御） | A |
| 再利用性 | B | S | S |
| 推奨用途 | SNS画像・OGP | ブログ内図解・ダッシュボード | フロー図・組織図 |

---

## 7. プレゼンテーション生成ワークフロー

### 重要: 2段階フロー必須

プレゼンテーションは `generate-design` を直接使わない。以下のフローに従う:

```
Step 1: request-outline-review
  → ユーザーにアウトラインをウィジェットUIでレビューしてもらう
Step 2: ユーザーが承認
Step 3: generate-design-structured で生成
```

### generate-design-structured パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `topic` | string | YES | プレゼンテーションのトピック（150文字以内） |
| `audience` | string | YES | ターゲットオーディエンス |
| `style` | string | YES | ビジュアルスタイル |
| `length` | string | YES | プレゼンの長さ・範囲 |
| `presentation_outlines` | array | YES | スライドの配列（title + description） |
| `brand_kit_id` | string | NO | ブランドキットID |
| `asset_ids` | string[] | NO | アセットID（最大10） |
| `design_type` | enum | YES | `"presentation"` のみ |
| `user_intent` | string | YES | 意図の説明 |

**Claude特有の制約:** `presentation_outlines` の `title` と `description` からすべての句読点を除去すること。

```
NG: "Introduction: Getting Started!"
OK: "Introduction Getting Started"
```

---

## 8. ブランドキット連携

### ブランドキットの使い方

1. `list-brand-kits` でアカウントのブランドキット一覧を取得
2. ユーザーに使用するブランドキットを選択してもらう
3. `generate-design` の `brand_kit_id` パラメータにIDを渡す

### 現在のステータス

**2026-03-05時点:** `list-brand-kits` の実行に `brandkit:read` スコープが必要。権限エラーが出る場合は、CanvaのAI Connector設定画面でコネクタを一度切断して再接続し、新しいアクセストークンを取得する必要がある。

### TomorrowProofのブランドキット設定推奨

Canvaのブランドキットに以下を設定しておくと、`brand_kit_id` 指定だけで一貫したデザインが生成される:

| 項目 | 設定値 |
|------|--------|
| プライマリカラー | #050508（背景） |
| セカンダリカラー | #0A0A0F（サーフェス） |
| アクセントカラー | #00D4FF（シアンブルー） |
| テキストカラー | #FAFAFA（オフホワイト） |
| サブテキストカラー | #6B7280（グレー） |
| サクセスカラー | #00FF88 |
| 警告カラー | #FFB800 |
| エラーカラー | #FF3366 |
| 英語フォント | Inter（見出し: 600-700, 本文: 400） |
| 日本語フォント | Noto Sans JP（見出し: 700, 本文: 400） |

**ブランドキットが設定されていれば、queryにカラーコードを毎回書く必要がなくなる。**

---

## 9. TomorrowProofブランド準拠プロンプトテンプレート集

### 共通スタイルプレフィックス

すべてのプロンプトに以下を含める:

```
Style: dark minimal tech aesthetic.
Background: deep black (#050508).
Accent color: electric cyan (#00D4FF).
Surface elements: dark charcoal (#0A0A0F) with thin borders (#1A1A2E).
No stock photo feel. Clean edges. Subtle glow effects.
Inspired by Nothing Tech and Apple minimalism.
No excessive gradients. No pop colors. No decorative shadows.
```

---

### テンプレート 1: AI/テクノロジー記事サムネイル

```
query: "Dark minimal blog thumbnail about [AI技術テーマ].
Black void background (#050508). Central floating abstract geometric
object — a fractured crystalline structure with electric cyan (#00D4FF)
inner glow. Faint particle systems dispersing from the object.
Grid lines in dark gray (#1A1A2E) suggesting digital space.
No text. No humans. Photorealistic 3D render. 8K detail.
Nothing Tech product photography style."
design_type: "poster"
```

### テンプレート 2: ビジネス戦略記事サムネイル

```
query: "Dark minimal blog thumbnail about [ビジネス戦略テーマ].
Black background (#050508). Isometric view of abstract architectural
chess-like blocks on a dark surface. One key piece highlighted with
cyan glow (#00D4FF). Others in dark charcoal (#0A0A0F).
Strategic, calculated feeling. Subtle depth of field.
No text. No humans. Premium 3D render quality."
design_type: "poster"
```

### テンプレート 3: データ/分析記事サムネイル

```
query: "Dark minimal blog thumbnail about [データ分析テーマ].
Black background (#050508). Floating holographic data visualization
panels showing abstract bar charts and trend lines in cyan (#00D4FF)
and green (#00FF88). Dark glass-morphism card effect (#0A0A0F).
Data-driven, futuristic dashboard aesthetic.
No text. Clean, minimal. 3D render quality."
design_type: "poster"
```

### テンプレート 4: プロダクト紹介記事サムネイル

```
query: "Dark minimal blog thumbnail showcasing [プロダクト名/概念].
Black background (#050508). Floating glass-morphism UI mockup with
subtle reflections. Thin cyan (#00D4FF) accent borders.
Depth of field effect. Subtle particle dust in background.
Product-centric composition. Apple keynote style.
No text. Premium render quality."
design_type: "poster"
```

### テンプレート 5: SNSキャンペーン画像（X/Twitter）

```
query: "Dark minimal social media card for X/Twitter.
Topic: [投稿テーマの具体的な内容].
Deep black background (#050508). Bold geometric accent element
in cyan (#00D4FF) positioned in bottom-right quadrant.
Large clean space for text overlay in center-left.
Thin divider line. 'TomorrowProof' subtle watermark area in corner.
Editorial, premium, tech magazine cover feel."
design_type: "twitter_post"
```

### テンプレート 6: Instagram フィード投稿

```
query: "Dark minimal Instagram feed post.
Topic: [投稿テーマ].
Pure black background (#050508). Single bold visual element
centered — [具体的なビジュアル要素の説明].
Cyan (#00D4FF) highlight on key focal point.
Clean negative space. Square composition.
Premium tech brand aesthetic. Nothing Phone inspired."
design_type: "instagram_post"
```

### テンプレート 7: Instagram カルーセル（表紙）

```
query: "Dark premium Instagram carousel cover slide.
Topic: [カルーセルテーマ].
Black background (#050508). Large clean typography area in upper half.
Abstract geometric element (glowing cyan #00D4FF lines forming
a [関連する形状]) in lower half. Dark surface card (#0A0A0F).
Vertical format 1080x1350px. Editorial, bold, minimal."
design_type: "instagram_post"
```

### テンプレート 8: note.com 記事OGP画像

```
query: "Dark minimal OGP thumbnail for note.com article.
Topic: [記事テーマ].
Deep black background (#050508). Right two-thirds: abstract
3D geometric composition with cyan (#00D4FF) edge lighting.
Left one-third: clean dark space for title overlay.
Dark shapes (#0A0A0F) with subtle borders (#1A1A2E).
No embedded text. Premium, editorial. 1280x670px aspect ratio."
design_type: "poster"
```

### テンプレート 9: LinkedIn ビジネス投稿

```
query: "Professional dark minimal LinkedIn post image.
Topic: [ビジネストピック].
Black background (#050508). Clean data visualization or abstract
business concept rendered as geometric 3D elements. Cyan (#00D4FF)
accent on primary data point or concept.
Professional, credible, enterprise-grade aesthetic.
No text. No humans. Clean and authoritative."
design_type: "facebook_post"
```

### テンプレート 10: Pinterest インフォグラフィックピン

```
query: "Dark minimal Pinterest infographic pin.
Topic: [テーマ].
Vertical layout on black background (#050508).
Top: eye-catching geometric visual element with cyan (#00D4FF) glow.
Middle: three to four data sections in dark cards (#0A0A0F) with
thin borders (#1A1A2E). Key numbers highlighted in cyan.
Bottom: subtle branding area. No text (added later).
Premium, data-rich, visually striking. 1000x1500px vertical."
design_type: "pinterest_pin"
```

### テンプレート 11: YouTube サムネイル

```
query: "Dark bold YouTube thumbnail design.
Topic: [動画テーマ].
Black background (#050508). Dramatic lighting from one side.
Central bold visual element with high contrast. Cyan (#00D4FF)
accent glow behind key element. Dark charcoal depth layers.
Eye-catching, thumb-stopping. Bold composition.
No text (will be added separately). 1280x720px."
design_type: "youtube_thumbnail"
```

### テンプレート 12: プレゼンテーションスライド背景

```
query: "Dark minimal presentation slide background.
Topic: [プレゼンテーマ].
Pure black background (#050508). Subtle geometric pattern
in dark gray (#1A1A2E) — dot grid or thin lines.
One cyan (#00D4FF) accent element positioned at edge.
Vast negative space for content. Ultra clean.
Apple WWDC / Nothing launch event aesthetic.
16:9 widescreen format."
design_type: "poster"
```

### テンプレート 13: エージェント/システム構成図

```
query: "Dark minimal isometric system architecture diagram.
Showing: [システム構成の説明].
Black platform (#050508) with floating modular dark blocks (#0A0A0F)
representing system components. Thin cyan (#00D4FF) connection
lines between blocks. Central hub node with brighter glow.
Clean geometric shapes only. Technical blueprint feeling.
No text labels. No characters. Architectural tech aesthetic."
design_type: "infographic"
```

---

## 10. 完全ワークフロー: 記事テーマからブログ埋め込みまで

### End-to-End フロー

```
[記事テーマ決定]
     ↓
[1] generate-design でサムネイル候補を3-5個生成
     ↓
[2] ユーザーが候補を選択
     ↓
[3] create-design-from-candidate で正式デザイン化
     ↓
[4] （オプション）テキスト追加・微調整
     ├── start-editing-transaction
     ├── perform-editing-operations
     └── commit-editing-transaction
     ↓
[5] get-export-formats で形式確認
     ↓
[6] export-design でPNG/JPGエクスポート
     ↓
[7] ダウンロードURLを取得
     ↓
[8] 必要に応じてリサイズでSNS展開
     ├── resize-design → X用 (1200x675)
     ├── resize-design → IG用 (1080x1080)
     ├── resize-design → Pinterest用 (1000x1500)
     └── それぞれ export-design
     ↓
[9] 画像をブログリポジトリにダウンロード・配置
     ├── ヒーロー画像: /public/images/blog/YYYY-MM/hero-[slug].webp
     ├── OGP画像: /public/images/blog/YYYY-MM/og-[slug].png
     └── SNS画像: /public/images/sns/YYYY-MM/[platform]-[slug].png
     ↓
[10] 記事のfrontmatterにパスを記載
     ↓
[11] push → Vercel自動デプロイ
```

### 画像パス規則（visual-content-2026.md参照）

| タイプ | パス形式 |
|--------|---------|
| ブログヒーロー | `/images/blog/YYYY-MM/hero-[slug].webp` |
| OGP画像 | `/images/blog/YYYY-MM/og-[slug].png` |
| 記事内図解 | `/images/blog/YYYY-MM/diagram-[slug]-[番号].webp` |
| SNS用画像 | `/images/sns/YYYY-MM/[platform]-[slug].png` |

---

## 11. エラーハンドリング・よくある問題

### よくあるエラーと対処法

| エラー | 原因 | 対処法 |
|--------|------|--------|
| `Common queries will not be generated` | queryが汎用的すぎる | より具体的な内容・コンテキスト・ビジュアル指示を追加する |
| `Missing scopes: [brandkit:read]` | アクセストークンのスコープ不足 | CanvaのAI Connector設定でコネクタを切断→再接続 |
| `Missing scopes: [asset:write]` | アセット書き込み権限不足 | 同上 |
| design_idが見つからない | URLからIDを誤って取得 | URLの中のIDはdesign_idではない。`search-designs`やレスポンスから取得する |
| エクスポート形式非対応 | デザインタイプとの不整合 | `get-export-formats` で事前確認する |
| 編集トランザクションの失敗 | コミット時のエラー | 全変更が失われる。新しいトランザクションを開始して再試行 |
| 候補からデザインに変換前にエクスポート試行 | ワークフロー順序ミス | 必ず `create-design-from-candidate` を先に実行 |

### パフォーマンス最適化のヒント

1. **バルク操作**: `perform-editing-operations` では複数の操作をまとめて実行する
2. **リサイズ活用**: 新規生成よりリサイズの方が速い。1つのデザインをベースにマルチ展開する
3. **query品質**: 最初のプロンプトの品質が最も重要。修正よりも生成精度を上げる
4. **フォルダ整理**: Canva内でフォルダを整理しておくと `search-designs` が効率的になる
5. **アセット事前準備**: よく使うロゴ・アイコンは事前に `upload-asset-from-url` でCanvaに格納

### 注意事項

- **コンテキスト非継続**: `generate-design` は前回のリクエストのコンテキストを引き継がない。毎回フルで詳細を記述する
- **日本語テキスト**: Canva AI生成で日本語テキストを画像に直接埋め込むと崩れることがある。テキストは編集トランザクションで後から追加するのが安全
- **フォントファミリー**: `perform-editing-operations` の `format_text` でフォントファミリーは変更できない。Canva上で手動設定が必要
- **rate limit**: 短時間に大量のリクエストを送ると429エラーが出る。間隔を空ける
- **ToolSearchの事前実行**: Canva MCPツールは遅延ロード（deferred）ツール。使用前に必ず `ToolSearch` で該当ツールをロードすること

---

## ソース

- [Canva MCP Server 公式ドキュメント（Dev Connect APIs）](https://www.canva.dev/docs/connect/mcp-server/)
- [Canva MCP Server 公式ドキュメント（Apps SDK）](https://www.canva.dev/docs/apps/mcp-server/)
- [Canva AI Connector ヘルプページ](https://www.canva.com/help/mcp-agent-setup/)
- [Canva MCP で実行できるアクション](https://www.canva.com/help/mcp-canva-usage/)
- [Claude x Canva 統合ニュースリリース](https://www.canva.com/newsroom/news/claude-ai-connector/)
- [Canva AI Connector 概要](https://www.canva.com/ai-connector/)
- [Canva MCP (Jan.ai)](https://www.jan.ai/docs/desktop/mcp-examples/design/canva)
- [Canva MCP (Smithery)](https://smithery.ai/server/canva)
- [Canva MCP Integration (Composio)](https://composio.dev/toolkits/canva/framework/claude-code)

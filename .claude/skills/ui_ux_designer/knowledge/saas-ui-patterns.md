# SaaS UIパターン集 — 海外トップSaaSから抽出

## オンボーディング（カード作成・プロフィール設定系）

### パターン1: ステップウィザード（Prairie / Popl / Typeform型）
```
特徴: 1画面1質問。進捗バー常時表示。戻るボタンあり。
効果: 完了率 +15-20%（Typeform公式データ）
実装: useState(step) + AnimatePresence でステップ切替
適用: CARD:NOIR名刺作成、オンボーディング
```

### パターン2: Split View（Linktree / Carrd型）
```
特徴: 左=エディタ、右=プレビュー。リアルタイム反映。
効果: 編集時の認知負荷低減。ただしモバイルでは分割不可→タブ切替に
実装: grid-cols-2 + sticky right panel
適用: カード編集画面（ダッシュボード内）
注意: 作成時よりも「編集時」に有効。初回作成はウィザードの方が良い
```

### パターン3: Inline Edit（Notion / Linear型）
```
特徴: 表示モードとそのまま編集モード。クリックで即座にinputに変化。
効果: 編集のための画面遷移ゼロ。上級ユーザー向け。
実装: contentEditable or onClick → input切替
適用: カード編集の個別フィールド修正
```

## ダッシュボード

### パターン1: Overview Card Grid（Stripe / Vercel型）
```
レイアウト: 上部=KPIカード4枚横並び → 中央=メインチャート → 下部=リスト
KPIカード: アイコン + 数値 + 変化率（↑↓） + ラベル
チャート: 7日/30日/90日のタブ切替
```

### パターン2: Sidebar Navigation（Linear / Notion型）
```
左サイドバー: ロゴ + ナビ項目 + ユーザーメニュー（最下部）
幅: w-60（240px）固定。モバイルではsheet overlay
アクティブ状態: bg-accent/10 + text-accent + 左ボーダー
```

## フォーム設計ベストプラクティス

### 入力フィールド
```
高さ: h-11 (44px) — タップターゲット最低基準
角丸: rounded-lg (8px)
ボーダー: border-gray-300（default）→ border-accent（focus）
フォーカスリング: ring-2 ring-accent/20
ラベル位置: 入力欄の上（常時表示）
エラー: 入力欄下に赤字 + 入力欄のborder-red-500
```

### ファイルアップロード（アバター等）
```
パターンA: クリックで選択（シンプル）
  → 丸いプレースホルダー + カメラアイコン + hidden input[type=file]

パターンB: ドラッグ&ドロップ（リッチ）
  → 点線ボーダーのエリア + ondragover/ondrop

推奨: パターンA（モバイル互換性が高い）
プレビュー: 選択後即座にURL.createObjectURLで表示
```

### SNSリンク追加（複数入力）
```
パターン: 動的フォーム配列
  → 「+リンクを追加」ボタン → platform選択 + URL入力の行が出現
  → 各行に削除ボタン（×）と並べ替えボタン（▲▼）

プラットフォーム選択: <select> or アイコンボタン群
URL入力: プラットフォームに応じたプレースホルダー
  例: X → "https://x.com/username"
      IG → "https://instagram.com/username"
```

## コンバージョン最適化

### CTA設計
```
位置: ファーストビューに1つ + ページ末尾に1つ（最低2箇所）
色: ページ内で最も目立つ色（アクセントカラー）
サイズ: 最低 w-full (SP) / px-8 py-4 (PC)
テキスト: 動詞で始める（「作成する」「始める」「試す」）
対比: 周囲と明度差5:1以上
```

### 信頼シグナル
```
- 利用者数（「100名が登録済み」）
- セキュリティバッジ（SSL/暗号化）
- レビュー/星評価
- ロゴ帯（導入企業）
- 「無料・クレジットカード不要」の明記
```

## プレビュー画面の設計パターン

### モバイルフレーム型
```
特徴: スマホの枠（ベゼル）の中にプレビューを表示
効果: 「実際にこう見える」感が強い。スクリーンショット映えする
実装:
  <div class="border-8 border-gray-800 rounded-[2.5rem] p-2 bg-black max-w-[280px] mx-auto">
    <div class="rounded-[2rem] overflow-hidden">
      <!-- CardPageClient -->
    </div>
  </div>
```

### カード型プレビュー
```
特徴: プレビューをカードとして表示。影+角丸で浮遊感
効果: クリーンで実装が簡単
実装:
  <div class="rounded-2xl overflow-hidden border shadow-lg">
    <!-- preview content -->
  </div>
```

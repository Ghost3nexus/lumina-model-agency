# UIデザイントレンド 2025-2026 — 海外最新動向

## トップトレンド

### 1. AI-Native UI
```
概要: AIが裏で動いていることを自然に見せるUI
事例: ChatGPT、Claude、Midjourney、v0.dev
パターン:
  - ストリーミングテキスト表示（タイプライター効果）
  - 「AI生成中...」のスケルトン+シマー
  - 生成結果の「受け入れ/再生成/編集」3択ボタン
  - 魔法の杖/スパークルアイコンでAI機能を示す ✨
適用: CARD:NOIRのbio自動生成ボタン
```

### 2. Bento Grid Layout
```
概要: Apple風の非対称カードグリッド
事例: apple.com/iphone、Linear、Vercel
パターン:
  grid-cols-2 md:grid-cols-4
  大カード: col-span-2 row-span-2
  小カード: col-span-1 row-span-1
  ギャップ: gap-4
  角丸: rounded-2xl
適用: ダッシュボードのKPI表示、LP機能紹介セクション
```

### 3. Spatial Design (visionOS影響)
```
概要: Apple Vision Proの影響でWebにも奥行き・レイヤー感
パターン:
  - ガラスモーフィズム（backdrop-blur-xl bg-white/10）
  - 微妙なパララックス（mouseMove連動のtranslate）
  - レイヤードシャドウ（shadow-sm + shadow-lg重ね）
注意: ダークUIでは影が効きにくいので、ボーダーの明度で階層表現
```

### 4. Motion Design as Branding
```
概要: アニメーションがブランドアイデンティティの一部
事例: Stripe（波打つグラデーション）、Linear（滑らかなトランジション）
パターン:
  - ページ間トランジション: 共有要素アニメーション
  - スクロール連動: parallax + reveal on scroll
  - ホバー: scale + border-color変化
  - ローディング: ブランドカラーのpulse
適用: CARD:NOIRのカード表示アニメーション
```

### 5. Hyper-Personalization UI
```
概要: ユーザーの好みに応じてUIが変化
事例: Spotify Wrapped、Notion テーマ
パターン:
  - テーマカラー選択（ユーザーのアクセントカラー）
  - レイアウトカスタマイズ
  - ダッシュボードウィジェットの並べ替え
適用: CARD:NOIRのカードテンプレート・エフェクト選択（Pro版）
```

## カラートレンド

### ダークモード（主流継続）
```
- 純黒(#000)は避け、ほぼ黒(#050508〜#0A0A0F)
- アクセント: ネオンシアン / エレクトリックブルー / ライムグリーン
- グラデーション: 暗→暗のsubtleグラデーション
```

### 2026年注目カラー
```
- Electric Indigo (#6366F1) — AI/テック系
- Neon Cyan (#00D4FF) — CARD:NOIRで採用済み
- Warm Coral (#FF6B6B) — 人間味・温かさ
- Mint Green (#00FF88) — サクセス・成長
- Deep Purple (#7C3AED) — プレミアム感
```

## タイポグラフィトレンド

### 注目フォント
```
- Inter: 万能サンセリフ（継続人気）
- Geist: Vercel製。コーディング+UI両用
- Plus Jakarta Sans: 丸み+モダン
- Space Grotesk: テック感+個性
- Satoshi: クリーン+ジオメトリック
- DM Sans: Google Fonts、軽量で美しい
```

### 日本語フォント
```
- Noto Sans JP: 安定の万能
- LINE Seed JP: LINE製、モダン+可読性
- IBM Plex Sans JP: テック感+可読性
- Zen Kaku Gothic New: 柔らかさ+モダン
```

## インタラクションパターン

### Toast / Notification
```
位置: 右下 or 上中央
出現: translateY(100%) → 0 + opacity 0→1
持続: 3-5秒で自動消去
成功: 緑バー + チェックアイコン
エラー: 赤バー + ×アイコン
```

### Command Palette (⌘K)
```
概要: Raycast/Linear型のコマンドパレット
用途: SaaS内の高速ナビゲーション
実装: モーダル + 検索input + フィルタリスト
適用: CARD:NOIRダッシュボードの将来機能
```

### Skeleton Loading
```
概要: コンテンツ読み込み中のプレースホルダー
実装:
  <div class="animate-pulse">
    <div class="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div class="h-4 bg-gray-200 rounded w-1/2" />
  </div>
効果: 体感速度向上。白画面よりUX良好
```

## アクセシビリティ必須事項

```
- コントラスト比 4.5:1以上（AAレベル）
- フォーカスリング: outline-2 outline-offset-2 outline-accent
- aria-label: アイコンボタンには必須
- キーボード操作: Tab/Enter/Escで全操作可能
- motion-reduce: prefers-reduced-motionでアニメーション制御
- フォントサイズ最低14px（12pxは補足情報のみ）
```

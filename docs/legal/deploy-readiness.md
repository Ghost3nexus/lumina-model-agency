# LUMINA MODEL AGENCY — Launch Deploy Readiness

> Launch 2026-05-10 に向けた本番デプロイ手順 + 事前チェック + 当日実行プラン。
> v0.1 · 2026-04-20

---

## 0. 現状

| 項目 | 状態 |
|---|---|
| Vercel project | `lumina-model-agency` (prj_Q0Tidiz8406Ef91nudRYRxZpSiQy / team_3l1WM9CHLTlIg4iIZn1NkbOR) |
| 本番URL | https://lumina-model-agency.vercel.app/ |
| Framework | Vite |
| Node | 24.x |
| Branch | main |
| git status | 64 files pending (53 untracked + 11 modified) |
| Production build | ✅ 2.42s、dist 1.03MB(gzip 283KB) |
| TypeScript check | ✅ 0 errors |
| dev server | ✅ http://localhost:5173 |

---

## 1. コミット整理計画(散らばった64ファイル)

現状 `git status` の分類:
- ?? (53 untracked): 新規 components/lumina/, docs/design/, docs/legal/, docs/pricing/, public/case-studies/, public/showcase/, i18n/, contexts/LanguageContext.tsx, 各pages 等
- M (11 modified): CLAUDE.md, App.tsx, .env.example, vite.config.ts, index.html, data/agencyModels.ts, etc.

**推奨: 7段階で分割コミット**(レビューしやすく、cherry-pick 可能に):

### Commit 1 — Foundation (LanguageContext + locale infra)
```bash
git add contexts/LanguageContext.tsx i18n/forBrandsLocale.ts
git commit -m "feat(i18n): add LanguageContext + forBrands bilingual locale"
```

### Commit 2 — `/for-brands` page + lumina components
```bash
git add pages/ForBrandsPage.tsx components/lumina/
git commit -m "feat(for-brands): full B2B landing with bilingual + email inquiry + gmeet"
```

### Commit 3 — Routing + config updates
```bash
git add App.tsx vite.config.ts .env.example index.html
git commit -m "feat(app): /for-brands route + JP typography + runway proxy + env docs"
```

### Commit 4 — Data & showcase assets
```bash
git add data/workShowcase.ts data/productShowcase.ts data/videoPresets.ts public/showcase/ public/case-studies/
git commit -m "feat(showcase): Lookbook SS26 + 6-brand product showcase + video presets"
```

### Commit 5 — Legal docs
```bash
git add docs/legal/ docs/pricing/
git commit -m "docs(legal): Ethics Code + IP License + Launch checklist + contract templates"
```

### Commit 6 — Design specs
```bash
git add docs/design/
git commit -m "docs(design): master HP spec + Ethics + IP License drafts"
```

### Commit 7 — Video services (Seedance + test page)
```bash
git add services/video/runwayClient.ts services/video/seedanceService.ts pages/TestSeedancePage.tsx
git commit -m "feat(video): Seedance 2.0 via Runway client + test page"
```

### Commit 8 — /terms 改訂 + 画像更新
```bash
git add pages/TermsPage.tsx public/agency-models/
git commit -m "chore(legal): /terms B2B payment flow update + model beauty compressions"
```

### Commit 9 — Journal + CLAUDE.md updates
```bash
git add journal/ CLAUDE.md
git commit -m "docs: 2026-04-19 Council journal + CLAUDE.md refresh"
```

**除外するもの**: `.env`(絶対にコミットしない)、 package.json/package-lock.json(必要なら別コミット)

---

## 2. Vercel 環境変数の設定

Vercel Dashboard → `lumina-model-agency` project → Settings → Environment Variables に以下を追加:

### Production (追加要)

| 変数名 | 値 | 用途 |
|---|---|---|
| `VITE_LUMINA_INQUIRY_EMAIL` | `71c68af4100ca59ec74f3d1a5215b660` | FormSubmit.co token(kozuki@tomorrowproof-ai.com へ通知) |
| `VITE_LUMINA_GMEET_URL` | `https://calendar.app.google/4EPiRfG5wYjJfn4J6` | Thank-you screen 予約ボタン |

### Production (既存、再確認)

| 変数名 | 現状 | 状態 |
|---|---|---|
| `VITE_SUPABASE_URL` | 設定済 | ✅ |
| `VITE_SUPABASE_ANON_KEY` | 設定済 | ✅ |
| `GEMINI_API_KEY` | server-side | 要確認 |
| `VITE_REPLICATE_API_TOKEN` | — | Kling使用時のみ |
| `VITE_RUNWAY_API_KEY` | — | Seedance テスト時のみ |

---

## 3. Pre-deploy 検証手順(05-09 Launch 前日)

```bash
# 1. 最新 main pull
git checkout main
git pull origin main

# 2. 依存確認
npm install

# 3. TypeScript
npx tsc --noEmit
# 期待: 0 errors

# 4. 本番ビルド
npm run build
# 期待: 2-3秒で完了、dist/ 生成

# 5. ローカルで dist プレビュー
npx vite preview
# http://localhost:4173 を開いて /for-brands 等を動作確認

# 6. Form 送信テスト(ローカルプレビューで)
# → Submit → kozuki@tomorrowproof-ai.com にメール到着
# → Thank-you screen の Meet ボタン → Google Calendar 予約ページ遷移
```

---

## 4. Launch Day (05-10) デプロイ手順

### 01. デプロイ実行
```bash
git push origin main
# → Vercel 自動デプロイが起動(通常 2-3分)
```

### 02. デプロイ確認
- Vercel Dashboard でビルド成功確認
- `https://lumina-model-agency.vercel.app/` にアクセス → AgencyPage 表示
- `https://lumina-model-agency.vercel.app/for-brands` → 新 B2B landing page 表示

### 03. 動作確認チェックリスト
```
[ ] / (AgencyPage) 正常表示
[ ] /for-brands Hero セクション、Lookbook セクション、商品ショーケース、Form すべて表示
[ ] Form 4ステップ walkthrough → Submit → メール到着確認
[ ] Thank-you screen Google Meet ボタン動作確認
[ ] /ethics, /legal/ip-license 公開確認
[ ] /terms 新版(B2B支払条項)表示
[ ] /studio, /video, /login の既存ページ影響なし
[ ] EN/JP トグル動作(右上)
[ ] モバイル(iPhone Safari)で全画面確認
[ ] Core Web Vitals: Lighthouse 70+ 目標
```

### 04. SEO初期設定
- Google Search Console → プロパティ追加 → sitemap.xml 送信
- Bing Webmaster Tools → 同上
- OGP画像の Facebook / X カード検証

---

## 5. ロールバック手順(トラブル時)

### Option A: Vercel で前のデプロイへロールバック(最速)
1. Vercel Dashboard → Deployments
2. 直前の成功デプロイを選択
3. "Promote to Production" ボタン

### Option B: git revert
```bash
git revert HEAD
git push origin main
# Vercel が自動で再デプロイ
```

### Option C: 特定コミットへ戻す(慎重に)
```bash
git reset --hard <commit-sha>
git push --force origin main  # ⚠️ 破壊的、CEO確認必須
```

---

## 6. 注意事項

### ⚠️ dist/ はコミットしない
Vercel がビルドするため、ローカルの `dist/` はリポジトリに含めない。

### ⚠️ .env は絶対にコミットしない
既に `.gitignore` に含まれているが、`git add .` 等で誤って入れないよう注意。

### ⚠️ 大きな画像ファイル
- `public/agency-models/*/beauty.png` の多くが 3-5MB
- `public/case-studies/lumina-lookbook-ss26/` 合計 6MB(10 pages)
- `public/showcase/` 合計 17MB(30 images)

Vercel の storage 制限:
- Free plan: 100MB static / deploy
- Hobby plan: 1GB
- Pro plan: 制限緩め

**現状見積もり**: `public/` 合計 ~500MB超の可能性。Vercel Pro推奨、または画像 WebP変換で圧縮。

確認コマンド:
```bash
du -sh public/
```

---

## 7. Launch 後 初日モニタリング

### 自動化なし、手動監視
- `/for-brands` のアクセス数(GA4 導入後)
- Form 送信ログ(kozuki@tomorrowproof-ai.com の受信箱)
- エラー(Vercel Analytics or ブラウザ Console)
- Lighthouse score

### トラブルシューティング窓口
- Tech issue: Dev(KOZUKI自身)
- 契約・営業: Sales
- 緊急時: CEO 直連絡

---

## 8. Launch 後 7日間 スケジュール

| Day | フォーカス |
|---|---|
| 05-10(土) Launch | 公開、PR TIMES配信、初期動作監視 |
| 05-11(日) | Google Search Console 確認、初日データ分析 |
| 05-12(月) | 営業アウトバウンド開始(リスト 20社) |
| 05-13(火) | 初回商談(KOZUKIネットワーク先行) |
| 05-14(水) | バグ修正(あれば)、Week1 レビュー |
| 05-15(木) | SNS継続投稿(Instagram) |
| 05-16(金) | Week1 KPIレビュー → 05-17週の計画 |

---

## 9. ドメイン判断(D4)

現状 `lumina-model-agency.vercel.app` のまま Launch 可能。

**推奨**:
- **Launch時**: vercel.app サブドメインのまま
- **Launch+14日以内**: カスタムドメイン取得検討
  - `lumina-aimodels-agency.com`($12/年 程度、Namecheap/Cloudflare)
  - または `lumina.agency` / `lumina-model.com` 等
  - Vercel で custom domain 追加 → DNS 切替(1時間)

ドメイン取得前でも PR / 営業で URL 共有可能。

---

**Document Owner**: Dev + CEO
**Status**: v0.1 ACTIVE — Week 3 までに毎日更新
**Last Updated**: 2026-04-20

# LUMINA MODEL AGENCY — Launch Checklist

> **Launch 目標日: 2026-05-10(日)**  残り20日(今日2026-04-20 基準)
>
> 全チーム横断の Launch-ready チェックリスト。Blocker / High / Medium のラベル付与、責任者・期限・依存関係を明示。
>
> v0.2 · 2026-04-20 · CEO + Legal agent + dev
>
> **⚠️ CEO 方針(2026-04-20 更新):**
> - 支払い: **freee 請求書発行 + 銀行振込**。Stripe / CloudSign / freeeサイン 不採用(Launch phase 1)
> - 弁護士: **需要が見込める時期 or BEDWIN 実案件始動時まで保留**。内部で固められる範囲で Launch
> - Launch phase 1 販売対象: **Standard / Extended のみ**。Campaign / Exclusive は "Inquire" 案件ベース(発生時に弁護士投入)

---

## 0. Launch 成功定義

**"Launch 完了" の判定基準**:

1. 🟢 `/for-brands` 公開 + Multi-step form 動作、メール通知(FormSubmit.co 経由)で問い合わせが取れる
2. 🟢 法務 7書(/terms, /privacy, /legal, /ethics, /legal/ip-license, クリックラップ同意、NDAテンプレ)すべて公開 or 内部用意
3. 🟢 弁護士最終レビュー済(Campaign 案件契約の初回署名可能状態)
4. 🟢 実在人物類似チェックプロセス 運用開始済
5. 🟢 Sales 商談→提案→契約→freee 請求の end-to-end フロー確立
6. 🟢 PR TIMES 初回配信、自社 SNS アカウント公開
7. 🟢 SEO 最低要件(meta / og / sitemap / robots)実装済
8. 🟢 初回有償契約 1件 締結(最低目標 — KOZUKI ネットワーク経由可)

---

## 1. サマリー

### 残タスク総数: 30 項目(方針シンプル化後)

| Severity | 件数 | 意味 |
|---|---|---|
| 🔴 BLOCKER | **7** | Launch不可、必ず完了要 |
| 🟠 HIGH | **13** | Launch強く推奨、未完なら不完全Launch |
| 🟡 MEDIUM | **10** | Launch後 30 日以内対応で許容 |
| ⏸ DEFERRED | **5** | 需要/BEDWIN案件発生時に発動 |

### チーム別作業量(Launch phase 1)

| チーム | Blocker | High | Medium | Deferred | 合計 |
|---|---|---|---|---|---|
| Legal | 3 | 2 | 1 | 3 | 9 |
| Dev | 2 | 4 | 3 | 1 | 10 |
| Branding | 1 | 2 | 2 | 1 | 6 |
| Sales | 1 | 2 | 2 | 0 | 5 |
| Marketing | 0 | 2 | 2 | 0 | 4 |
| CFO | 0 | 1 | 0 | 0 | 1 |

→ **Dev が主要 bottleneck**。弁護士 deferred により Legal Blocker 半減。

---

## 2. Blocker 項目(Launch前必須、7件)

### 🔴 Legal (3件)

| # | 項目 | 担当 | 期限 | 依存 | 参照 |
|---|---|---|---|---|---|
| B1 | 全14体 Character Bible + 創作指示書を内部ドキュメント化(著作権根拠、将来の訴訟リスク対策) | Legal + Branding | **04-30** | — | `docs/legal/review-findings-2026-04-20.md` |
| B2 | Ethics §2 / IP License §5 に「to the extent permitted by applicable law」追記 + 業界別禁止リスト(医薬品・金融等)別紙化 | Legal | 04-28 | — | Ethics/IPL drafts |
| B5 | `/terms` の支払条項を「Stripe 即購入」→「**B2B商談 + freee 請求書 + 銀行振込**」に差替 | Legal + Dev | **04-28** | — | `pages/TermsPage.tsx` |

### 🔴 Dev (2件)

| # | 項目 | 担当 | 期限 | 依存 | 参照 |
|---|---|---|---|---|---|
| B8 | `/for-brands` Multi-step form Submit → **FormSubmit.co 経由メール通知** + Thank-you screen で Google Meet 予約リンク表示(実装済 2026-04-20) | Dev | **05-05** | KOZUKI による `.env` 設定(VITE_LUMINA_INQUIRY_EMAIL + VITE_LUMINA_GMEET_URL) | `docs/design/for-brands-page-spec.md` §2-6 |
| B9 | `/ethics` と `/legal/ip-license` ページの React 実装(既存 `/terms` `/privacy` 同様の pattern) | Dev | **05-02** | B2 | Ethics + IPL drafts |

### 🔴 Ops (2件)

| # | 項目 | 担当 | 期限 | 依存 | 参照 |
|---|---|---|---|---|---|
| B10 | `brand@lumina-models.com` 受信メールボックス(Gmail/独自ドメインGoogle Workspace どちらでも可、FormSubmit.co 初回確認メールを承認して受信開始) | Dev + KOZUKI | **05-05** | ドメイン取得判断 | — |
| B11 | Launch 直前のコミット済み確認:全新規コードのマージ + `main` ブランチ反映 | Dev | **05-09** | 全 B | — |

### ⏸ Deferred(需要見込 or BEDWIN 始動時に発動)

| # | 項目 | トリガー条件 |
|---|---|---|
| DEF-1(旧B3) | 実在人物類似チェックプロセスの運用手順 + 対応 SLA 文書化 | 初回契約締結時 |
| DEF-2(旧B6) | **外部弁護士アサイン + Ethics/IPL/Campaign契約テンプレ最終レビュー** | 需要見込時 or BEDWIN 案件確定時、Campaign/Exclusive 契約締結必要時 |
| DEF-3(旧B7) | クリックラップ同意画面 + Supabase `legal_consents` | **簡易運用でスタート**: 提案書PDF メール承認 or 注文書書面返送で代替。正式な click-wrap は契約数が月 5件超えてから自動化 |
| DEF-4 | CloudSign / freeeサイン API連携 | Campaign/Exclusive 実案件発生時 |
| DEF-5 | Campaign 契約 v1.0 弁護士最終化 | BEDWIN 案件の契約締結時 |

---

## 3. High 項目(強く推奨、13件)

### 🟠 Legal (2件)

| # | 項目 | 担当 | 期限 |
|---|---|---|---|
| H1 | 景品表示法対策:ブランドの AI 使用隠蔽を禁止する義務条項を IP License §2 に追加 | Legal | 05-02 |
| H2 | `/privacy` の第28条 越境移転文言(Supabase Japan, Gemini US, Runway US)明記 | Legal + Dev | 05-05 |

### 🟠 Dev (4件)

| # | 項目 | 担当 | 期限 |
|---|---|---|---|
| H5 | freee 請求書テンプレート作成 + 銀行振込先情報の定型化(手動発行フロー) | Dev + CFO | 05-03 |
| H6 | Meta tags + OGP images 全ページ実装(`/`, `/for-brands`, `/ethics`, etc.) | Dev | 05-03 |
| H7 | sitemap.xml + robots.txt(`/studio` `/test` は Disallow) | Dev | 05-03 |
| H8 | Google Search Console + Bing Webmaster Tools 登録・認証 | Dev | 05-04 |

### 🟠 Sales (2件)

| # | 項目 | 担当 | 期限 |
|---|---|---|---|
| H9 | Sales 商談スクリプト作成(30分構成、pricing rationale FAQ 参照) | Sales | 05-03 |
| H10 | 提案書テンプレート作成(PDF、tier別料金表・使用範囲・Lookbook見本) | Sales + Branding | 05-05 |

### 🟠 Marketing (2件)

| # | 項目 | 担当 | 期限 |
|---|---|---|---|
| H11 | PR TIMES 初回配信記事ドラフト(LUMINA MODEL AGENCY ローンチ) | Marketing + Branding | 05-06 |
| H12 | Instagram 公式アカウント立ち上げ + 初期投稿 6本(Lookbook spreads) | Marketing + SNS | 05-08 |

### 🟠 Branding (2件)

| # | 項目 | 担当 | 期限 |
|---|---|---|---|
| H13 | `/` (AgencyPage) の Dark テーマ移行(現状 White)or Light版との併存判断 | Branding + CEO | 05-02 |
| H14 | Hero 用ビジュアル検証後、必要なら追加 Lookbook カット生成(現状9枚で十分なら不要) | Branding | 05-05 |

### 🟠 CFO(1件)

| # | 項目 | 担当 | 期限 |
|---|---|---|---|
| H15 | TomorrowProof 法人銀行口座の振込先情報最終確認 + freee の事業者設定反映 | CFO | 05-02 |

---

## 4. Medium 項目(30日以内対応許容、10件)

### 🟡 Legal (1件)

| # | 項目 | 担当 | 期限 |
|---|---|---|---|
| M1 | 年齢推定モデル(FairFace等)で生成画像の 18歳以上判定を QA に組込 | Legal + Dev | 05-25 |

### 🟡 Dev (3件)

| # | 項目 | 担当 | 期限 |
|---|---|---|---|
| M2 | Hero rotation 画像の WebP 変換 + lazy-load 最適化 | Dev | 05-20 |
| M3 | Core Web Vitals 監視 + Lighthouse 90+ 達成 | Dev | 05-25 |
| M4 | Chatbot (Claude Haiku) Phase 2 — Form補助・FAQ応答 | Dev | 06-10 |

### 🟡 Sales (2件)

| # | 項目 | 担当 | 期限 |
|---|---|---|---|
| M5 | 営業リスト作成(中堅D2C 20社、リーチアウト順) | Sales | 05-15 |
| M6 | freee 請求書 発行テンプレート整備(tier別料金プリセット、銀行振込先記載) | Sales + CFO | 05-20 |

### 🟡 Marketing (2件)

| # | 項目 | 担当 | 期限 |
|---|---|---|---|
| M7 | Journal 長文記事 3本公開(Character Bible 作り方 / botika vs LUMINA 等) | Marketing + Writer | 06-01 |
| M8 | Search Console 監視 + Week4 SEO レビュー | Marketing | 05-30 |

### 🟡 Branding (2件)

| # | 項目 | 担当 | 期限 |
|---|---|---|---|
| M9 | `/models/[slug]` PDPテンプレート実装(14体個別ページ) | Branding + Dev | 06-05 |
| M10 | Character Bible 公開版整備(全14体、一貫度と深さ) | Branding | 06-10 |

---

## 5. 週次マイルストーン

### Week 1 (04-20 → 04-26) — "法務固め"
**目標**: Blocker B2, B4, B5, B6(Legal 以外)完了 + 弁護士アサイン

- [B2] Ethics §2 / IP License §5 の文言微修正 ← 04-25
- [B5] `/terms` 支払条項差替 ← 04-28
- [B6 準備] 弁護士候補 3社ピックアップ → CEO アポ取り ← 04-22
- [B4] 業界別禁止リスト別紙化 ← 04-30
- [B1] Character Bible 全14体 リストアップ開始 ← 04-30
- [H13] AgencyPage ダーク化判断(Branding + CEO review)

### Week 2 (04-27 → 05-03) — "ページ公開 + 実装"
**目標**: /ethics / /legal/ip-license 公開、弁護士レビュー開始、商談資材準備

- [B9] /ethics + /legal/ip-license ページ React 実装 ← 05-02
- [B1] Character Bible 書面化(KOZUKI directions 明示) ← 05-01
- [B6] 弁護士に 3本(Ethics/IPL/Campaign契約)入稿 ← 05-03
- [H6] Meta/OGP/sitemap/robots ← 05-03
- [H8] Search Console 登録 ← 05-04
- [H9] Sales 商談スクリプト ← 05-03

### Week 3 (05-04 → 05-10) — "Launch 最終調整"
**目標**: Blocker 全消化、商談資材 full-ready、PR配信準備

- [B3] 類似チェックプロセス運用開始 ← 05-05
- [B7] クリックラップ実装 ← 05-08
- [B8] /for-brands form Submit フロー ← 05-05
- [B10] ethics@ / brand@ 受信体制 ← 05-05
- [H5] freee 会計連携 ← 05-07
- [H10] 提案書テンプレート ← 05-05
- [H11] PR TIMES 記事入稿 ← 05-06
- [H3] Campaign 契約 v1.0 ← 05-08
- [B11] main マージ + デプロイ検証 ← 05-09
- **05-10: LAUNCH**

### Week 4 (05-11 → 05-17) — Post-launch
- [M2-M10] Medium 項目の着手開始
- 初週の問い合わせ・商談データ収集
- Launch-day hotfix 体制(Dev on-call)

---

## 6. 依存関係グラフ(主要)

```
[B6 弁護士レビュー] ← [B1 Character Bible] + [B2 Ethics/IPL 文言] + [B4 業界別禁止リスト]
       ↓
[H3 Campaign契約 v1.0] ← 弁護士最終化
       ↓
    Launch可

[B5 /terms 差替] ← [CEO: B2B商談ベース決定 = 済]
       ↓
[B9 /ethics + /legal/ip-license 公開]
       ↓
[B7 クリックラップ実装] + [B8 form Submit フロー]
       ↓
    Launch可

[ドメイン取得] → [B10 ethics@/brand@ 受信] → Launch可
```

**クリティカルパス**: 弁護士リードタイム 2週間 = **04-22 アサイン → 05-06 v1.0 完成** が実質デッドライン。これ遅れたら Launch 後ろ倒し。

---

## 7. CEO(KOZUKI)判断必須項目

以下は Launch 前に CEO が決断・承認すべき事項。先延ばしできない。

| # | 判断事項 | 期限 | 選択肢 | 現状 |
|---|---|---|---|---|
| ~~D1~~ | ~~外部弁護士アサイン~~ | — | **Deferred**(需要見込 or BEDWIN 始動時に発動) | ⏸ |
| D2 | `/` (AgencyPage) ダーク化 or Light 継続 | 04-25 | (a) 全面ダーク化(ブランド一貫性) (b) 現状継続(工数節約) (c) 新Dark版を `/agency` に並行公開 | 🟡 未決 |
| D3 | Launch day の PR TIMES + SNS 配信内容の承認 | 05-07 | ドラフト承認 or 修正指示 | 🟡 未決 |
| D4 | ドメイン取得(`lumina-aimodels-agency.com` または別候補) | 04-28 | 取得 / 遅らせる(vercel.app で Launch) | 🟡 未決 |
| D5 | 初回契約 クライアント候補 1社選定 | 04-30 | KOZUKI ネットワーク(BEDWIN Watanabe氏 等)から選定 | 🟡 未決 |
| ~~D6~~ | ~~CloudSign or freeeサイン 選定~~ | — | **Deferred**(Launch phase 1 不採用、Campaign 実案件発生時) | ⏸ |
| D7 (NEW) | TomorrowProof 法人銀行口座の振込先情報(請求書に記載する番号)最終確認 | 05-02 | freee 事業者設定に反映 | 🟡 未決 |

---

## 8. リスク管理

### 潜在リスク

| リスク | 発現確率 | 影響 | 緩和策 |
|---|---|---|---|
| 弁護士未投入で初回契約に法的不備 | 中 | 🟠 訴訟リスク | (a) **初回は Standard/Extended のみ販売**(Campaign/Exclusive は "Inquire" で受付のみ、契約前に弁護士投入)(b) 内部契約テンプレート(本書 `clickwrap-agreement.md`)の保守的文言で最低限守り (c) AI Ethics Code / IP License を公開し透明性確保 |
| 実在人物類似問題が Launch 後に発覚 | 低 | 🔴 炎上・訴訟 | 内部 QA で 生成画像目視チェック、ethicsメール体制、発見時の引退対応フロー(Ethics §7)即時運用 |
| 商談リード 0件で Launch 日を迎える | 中 | 🟡 Launch効果薄 | KOZUKI ネットワークから先行で 3-5件の商談アポ確保 |
| BEDWIN 案件発生時に弁護士アサイン遅延 → 案件流出 | 中 | 🔴 大型契約損失 | 弁護士候補 3社を**事前にピックアップ**(コンタクト情報保持、即日アサイン可能な状態に)。BEDWIN 始動シグナル検知で 即発動 |
| Studio 既存ユーザーへの規約変更周知漏れ | 中 | 🟡 解約増 | Studio ユーザーに 30日前メール通知(05-10 から有効化なら 04-10 に通知必要 → **既に遅延、即日発送要**) |
| freee 請求発行の運用事故(請求額ミス等) | 低 | 🟡 顧客不信 | 請求書テンプレートを CFO が事前承認、初回 3 件は CEO がダブルチェック |

### 中止判断基準

以下のいずれかが発生した場合、Launch 日を 2026-05-24 に後ろ倒し:

- 弁護士が Ethics Code / IP License に重大 reject 判定(修正2週間以上要)
- 実在人物類似問題が Ethics 公開前に発見される
- Supabase / Vercel / freee のいずれかで重大障害(3日以上未解決)

---

## 9. Launch Day (2026-05-10) スケジュール

```
00:00 — main ブランチ最終 freeze、前日 freeze の最終確認
09:00 — PR TIMES 配信
09:30 — Instagram + X 公式アカウント 初期投稿
10:00 — Sales チーム 初回商談スロット開始
12:00 — KOZUKI ネットワーク先行契約 1件 締結目標
15:00 — Launch 後 6時間レビュー(アクセス数、エラー数、問い合わせ数)
17:00 — Launch-day 日次レポート発行
21:00 — Week 1 レビュー会議(Council) — 翌週の軌道修正
```

---

## 10. Launch 後 30日の KPI 目標

| 項目 | 目標 |
|---|---|
| 累計 `/for-brands` セッション | 3,000+ |
| 累計 inquiry form submissions | 30+ |
| 商談化率(submission → 初回商談) | 40%+ |
| 初回契約締結数 | **3社** |
| 累計契約金額 | ¥300,000+ |
| クレーム・トラブル | 0件 |
| SEO: LUMINA MODEL AGENCY(ブランド検索)順位 | Top 3 |

---

## 11. 関連ドキュメント参照

- `docs/legal/review-findings-2026-04-20.md` — 法務レビュー findings
- `docs/legal/clickwrap-agreement.md` — クリックラップ同意文
- `docs/legal/campaign-contract-template.md` — Campaign 契約骨子
- `docs/legal/nda-template.md` — NDA テンプレ
- `docs/pricing/pricing-rationale.md` — 価格根拠
- `docs/design/MASTER-claude-design-prompt.md` — HP 設計マスター
- `docs/design/for-brands-page-spec.md` — B2B ページ詳細
- `docs/design/ai-ethics-code.md` + `docs/design/ip-license-tiers.md` — 法務ドラフト
- `journal/2026/04/19.md` — Council 議事録
- `MEMORY.md` — プロジェクト記憶

---

**Document Owner**: CEO + Legal + Dev
**Status**: ACTIVE v0.1 — 毎週 月曜 or Council 日に更新
**Last Updated**: 2026-04-20
**Next Review**: 2026-04-26 (Week 1 end)

---

## Appendix: 最短 Launch パス(リソース不足時の削減スコープ)

もし一部タスクが間に合わない場合、以下の順で落とす:

1. M1-M10(Medium)はすべて Post-launch
2. H11-H12(PR/SNS)を 1週遅延 → 05-17 配信に
3. H13(`/` ダーク化)を Phase 2 送り
4. `/models/[slug]` PDP を暫定版で(PC版のみ、JP only)
5. Campaign 契約 v1.0 が間に合わない場合、**Launch当初は Standard/Extended のみ**販売(Campaign/Exclusive は "Coming soon" 表示)

**絶対に落とさない**: Blocker B1-B11 全11項目。これが動かないと法的リスクで Launch 不可。

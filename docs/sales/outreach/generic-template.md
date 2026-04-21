# Outreach — 汎用テンプレート(残り17社用)

> 残り17社(target-list.md の #2-#20 中、BEDWIN / and wander / Hender Scheme を除く17社)に対して使用。
> 汎用だが手抜きに見えないよう、**冒頭1-2文は必ず個別差替え** する前提で設計。
> 「AIで安く」より「Character Bible型の新しいエージェンシー」「撮影コスト・納期の課題解決」を前面に。

---

## プレースホルダー一覧

| キー | 意味 | 例 |
|---|---|---|
| `{CompanyName}` | 会社名・ブランド名 | and wander |
| `{Honorific}` | ご担当部署の敬称 | マーケティング / PR ご担当者さま |
| `{SpecificReason}` | **冒頭で語る「なぜ貴社に連絡したか」個別理由 1-2文** | 26SS の鳥海山コレクションを拝見し〜 |
| `{RecommendedModels}` | LUMINA ロスターから推薦するモデル 1-2体 + 理由 | ELENA(Scandinavian editorial トーン) / LUCAS MORI(Americana) |
| `{Vertical}` | 業種・商品領域 | アウトドア / レザー小物 / コスメ etc. |
| `{Tier}` | 推奨 tier 名 | Extended / Campaign |
| `{TrialOffer}` | 無償トライアル提示内容(省略可) | 既存 SKU 3-5点を使った無償サンプル生成(24時間納品) |
| `{SenderEmail}` | 差出人メール | brand@lumina-models.com |

---

## メール本文テンプレート

**From**: KOZUKI TAKAHIRO <{SenderEmail}>
**To**: {CompanyName} {Honorific}
**件名**: {CompanyName} EC撮影のご提案(※15字以内で個社最適化)

---

{CompanyName} {Honorific}

突然のご連絡失礼いたします。株式会社TomorrowProof の神月(KOZUKI)と申します。

{SpecificReason}

2026年5月10日にローンチする **LUMINA MODEL AGENCY** は、各モデルに **Character Bible(世界観・体型・声質・スタイリングを文書化した設計書)** を持たせ、同じモデルをブランドで継続起用できる新しい形のモデルエージェンシーです。
撮影コスト・納期・モデル確保の課題を、キャラクターIP のライセンスという形で解消いたします。

{CompanyName} さまの {Vertical} には、{RecommendedModels} が世界観の候補としてマッチすると考えております。

▼ Lookbook SS26
https://lumina-model-agency.vercel.app/

▼ For Brands / 料金体系
https://lumina-model-agency.vercel.app/for-brands

{TrialOffer} もご提供いたします。30分ほど Google Meet でご説明させていただけますと幸いです。

▼ 商談予約
https://calendar.app.google/4EPiRfG5wYjJfn4J6

お忙しいところ恐縮ですが、ご検討のほどよろしくお願い申し上げます。

---

神月 隆弘(KOZUKI TAKAHIRO)
株式会社TomorrowProof 代表取締役
LUMINA MODEL AGENCY Founder
{SenderEmail}
https://lumina-model-agency.vercel.app/

---

## 件名パターン集(カテゴリ別)

| カテゴリ | 件名案(15字以内) |
|---|---|
| ファッションD2C / ストリート | `{Brand} 26AW 撮影のご提案` / `撮影コストのご相談` |
| ラグジュアリー | `{Brand} Campaign のご相談` / `ブランド施策のご提案` |
| アウトドア / ライフスタイル | `{Brand} 26AW の撮影ご提案` / `シーズン施策のご相談` |
| コスメ | `{Brand} EC撮影のご相談` / `キャンペーン撮影のご提案` |
| アクセサリー・小物 | `{Brand} EC撮影のご提案` / `素材撮影のご相談` |
| セレクトショップEC | `EC撮影のご提案({Brand})` / `レーベル別撮影のご相談` |

---

## 個別差替えガイド({SpecificReason} の書き方)

**NG例(汎用的すぎる)**
- 「貴社のブランドは素晴らしく〜」
- 「EC事業を営まれている御社に〜」

**OK例(個別性あり)**
- 「26SS の〇〇コレクションを拝見し、〇〇の一貫性に驚きました。」
- 「〇〇(PR TIMES / 直近発表)を受けて、マーケの文脈で〇〇のご提案がしたくご連絡しました。」
- 「〇〇(具体商品名)の撮影における〇〇の表現が、弊社の Character Bible 手法と接続しうると考え〜」

**必ず直近(3ヶ月以内)の PR TIMES / 公式 IG / 展示会発表を1つは踏むこと。**

---

## モデル推薦の当てはめガイド

| {Vertical} | {RecommendedModels} |
|---|---|
| ストリート / ロゴ系 | LUCAS MORI(Americana / BEDWIN muse) / RINKA(harajuku creator) |
| モード / デザイナーズ | ELENA(editorial luxury) / MIKU(Tokyo editorial) |
| アウトドア / テック | ELENA(Scandinavian editorial) / LUCAS MORI(Americana outdoor) |
| ラグジュアリー | ELENA / IDRIS(international luxury) |
| コスメ / ライフスタイル | RINKA / ELENA / MIKU(clean beauty editorial) |
| アクセ・小物・レザー | LUCAS MORI(Americana craft) / IDRIS(international editorial) |
| スポーツ / スニーカー | LUCAS MORI / IDRIS(street athletic) |

※ Lookbook SS26 実装後、各モデルの PDP リンクが安定したら個別URLを差し込む。

---

## 送信前チェックリスト(各社共通)

- [ ] `{SpecificReason}` が個社特有の直近情報を踏まえているか(汎用文になっていないか)
- [ ] `{RecommendedModels}` が {Vertical} と整合しているか(的外れな組み合わせでないか)
- [ ] 件名が 15字以内、ブランド名 + 具体的な訴求で構成されているか
- [ ] 宛先メールアドレスが公式サイトで再確認済みか
- [ ] LP / Lookbook URL が生きているか(404確認)
- [ ] 商談予約 URL (https://calendar.app.google/4EPiRfG5wYjJfn4J6) が有効か
- [ ] 送信時間帯: 火〜木の 10:00-11:30 または 14:00-16:30(日本 B2B 開封率帯)

---

**Document Owner**: sales
**Last Updated**: 2026-04-19
**Related**: `docs/sales/target-list.md` / `docs/sales/outreach/bedwin.md` / `docs/sales/outreach/company-2.md` / `docs/sales/outreach/company-3.md`

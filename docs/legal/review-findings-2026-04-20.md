# Legal Review Findings — LUMINA AI Ethics Code & IP License

> Legal agent による正式法務レビュー。Launch(2026-05-10)対応。
> 対象: `docs/design/ai-ethics-code.md` v0.2 / `docs/design/ip-license-tiers.md` v0.2
> レビュー日: 2026-04-20

---

## Severity 凡例

- 🔴 **BLOCKER**: Launch前に必ず修正・対応要
- 🟠 **MAJOR**: Launch前推奨、放置時は重大リスク
- 🟡 **MINOR**: 改善推奨、将来対応可

---

## Part A — AI Ethics Code レビュー

### §1 How our models are created

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟠 MAJOR | 「licensed or fair-use foundation models」だけでは Gemini / Seedance の学習データの fair use 適法性を担保できない。学習データに著作権侵害訴訟がある Stable Diffusion 等 generative モデルへの追随を警戒 | 「当社は foundation model provider(Google, Runway, etc.)との利用規約を遵守し、本モデル生成に使用する base model は各プロバイダーによって合法的に提供されたもののみとします」と追記 |
| 🟡 MINOR | 「Character Bible is the single source of truth」は契約で使用しない内部用語。公開版には要不要判断 | 公開版では「documented character specification」等の一般表現に置換 |

### §2 Likeness, consent & IP

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🔴 BLOCKER | 「LUMINA is the sole copyright owner of each model's identity, name, visual likeness, voice, and character attributes, worldwide and in perpetuity」→ **日本著作権法上、AI生成物の著作権帰属は未確定**(文化庁「AI と著作権に関する考え方について」2024)。単純に「著作権保有」と言うだけではリスク | (a) 著作者性の根拠(人間の創作的寄与 = KOZUKI directionの存在)を別途 Character Bible 文書で立証、(b) 文言を「copyright ownership (to the extent permitted by applicable law) and character IP rights」に調整、(c) キャラクター商標出願を並行推進(memory 記載通り) |
| 🟠 MAJOR | worldwide と in perpetuity は海外法域ではパブリシティ権・moral rights で制限される可能性 | 「subject to applicable local laws」を明示 |

### §3 Real-person impersonation — banned

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🔴 BLOCKER | 「If a generation accidentally converges on a real-person likeness, we retire the generation and regenerate」→ **実際の検知プロセスが未実装**。宣言だけで運用できないと虚偽表示リスク | `docs/legal/real-person-likeness-process.md` を起草(別タスク)。PimEyes / Google Lens 逆画像検索の月次監査手順、クレーム受領窓口、対応期限を明文化し、Launch までに運用体制を整備 |
| 🟡 MINOR | 「ethnic, regional, or archetypal references」は OK と記載があるが、人種ステレオタイプの取扱いも別途ガイドライン化が望ましい | 内部運用ガイドに「style reference is permitted, stereotyping is not」を追加(公開版変更不要) |

### §4 Brand safety guidelines

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🔴 BLOCKER | 「Political campaigns, election advocacy, or religious conversion campaigns — available only via explicit Campaign-tier contract with Legal review」→ 公職選挙法・景表法(特に医薬品・金融商品)・医薬品医療機器等法との整合要確認 | 業界別禁止リスト(医薬品・健康食品・金融商品・仮想通貨・ギャンブル)を別紙化。Campaign tier でも追加審査事項として明記 |
| 🟠 MAJOR | 「Zero tolerance for minors」は**画像生成時の年齢判定プロセス**も整備必須 | 年齢推定モデル(FairFace 等)の内部QAで 18歳未満と判定されたキャラクターは納品禁止ルールを整備、Character Bible 登録時に年齢を記録(既に 18歳以上のみ想定、RINKA 20歳、LUCAS MORI 23歳等) |
| 🟡 MINOR | 「violates brand-safety policies of Meta, Google, TikTok」— 各社ポリシーは頻繁に更新される。固定的な参照は陳腐化 | 「as updated from time to time」を追加 |

### §5 Transparency obligations

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟠 MAJOR | **景品表示法(優良誤認・有利誤認)**との整合: ブランドが「AI モデルを実在人物の代わりに使用している事実を消費者に隠す」と、消費者が「実際にその人間モデルが着用した」と誤認する可能性 → **景品表示法第5条1号違反の余地** | §5-3に「Brands must not claim a LUMINA model is a real human model」という義務規定がある点は評価。ただし:「日本における景品表示法準拠のため、ブランドは AI 利用を明示的に否定する表現を使用してはならない」と**より強い義務化**を推奨 |
| 🟠 MAJOR | EU AI Act §50 準拠 template は具体文面未提示 | Launch 前に voluntary disclosure template 文面を本書 §5 末尾に追加(日英両方、例: "This image features an AI-generated fashion model. Learn more at lumina-model-agency.vercel.app/ethics") |
| 🟡 MINOR | 日本の **AI事業者ガイドライン**(総務省・経産省 2024年4月)との整合性も記載価値あり | 「当社は 『AI事業者ガイドライン』の AI 開発者・提供者のベストプラクティスに準拠して運営しています」を追記 |

### §6 Data handling & client confidentiality

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟠 MAJOR | Supabase Japan region 記載あるが、Gemini(Google)と Runway は**データ処理場所が米国中心**。個人情報保護法第28条(外国にある第三者への提供)の本人同意・安全管理措置が未明記 | (a) プライバシーポリシー`/privacy` 側で米国等への越境移転・Supabase/Google/Runway のDPA遵守を明示、(b) クライアント契約書で「お客様提供素材は Gemini/Runway への API送信に伴い米国サーバーを経由する可能性があります」と明示 |
| 🟡 MINOR | 「90 日削除」と「extendable to 24 months max」で計算が不一致。24ヶ月=720日 | 文言整理: 「原則 90 日以内に削除、ただし書面合意があれば最長 24 ヶ月まで延長可能」に変更 |

### §7 Model lifecycle & retirement

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟠 MAJOR | 「60 days in advance」通知が活動中ライセンシーのみと限定。**既納品物を PR や公開中のクライアント**の場合、引退通知の波及影響が大きい | (a) 引退時にライセンシーへ「引退後も既納品物は原契約範囲で継続使用可」と書面通知、(b) 引退モデル公開中止に伴う第三者(ECプラットフォーム運営者等)への対応方針も別紙化 |

### §8 Human oversight

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟡 MINOR | Tier 1 Automated / Tier 2 Human の**実装状況**が未記載 | 内部で SOP(標準作業手順)として文書化、公開版には「two-tier review process」の事実だけで十分 |

### §9 Reporting concerns

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟠 MAJOR | `ethics@lumina-models.com` の**メール受信・対応体制が未整備** | Launch 前に G-Suite / Resend にアドレス設定、Slack 連携、対応 SLA 明記、対応記録テンプレート化 |
| 🟡 MINOR | `/ethics/reports` の年次 annual summary 公開は運用負荷大、実現性未確認 | 初年度は半年分を 12ヶ月後に公開予定 とタイミング明記 |

---

## Part B — IP License Tiers レビュー

### §1-2 Tier summary / use cases

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟡 MINOR | Tier 名が固定英語(Standard / Extended / Campaign / Exclusive) | 問題なし。JP 訳は「標準 / 拡張 / キャンペーン / 独占」も記載可 |
| 🟡 MINOR | Extended の「月 10 videos, up to 15 seconds」の仕様が厳密 → 14秒や 15.5 秒の扱いは? | 「15 秒以下」と統一 |

### §3 Territory

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟠 MAJOR | 「Default: Worldwide」は**強い主張**。LUMINA が全世界でモデルIPを執行可能な態勢になっているか要検証(商標未出願) | (a) 商標出願実績(LUCAS MORI / ELENA / MIKU / LUMINA MODEL AGENCY)を進める(memory 既記載)、(b) 未登録地域への拡大使用時は「当社は当該地域での IP 保護責任を負わない場合がある」旨の追記 |
| 🟡 MINOR | Berne Convention 加盟国 全網羅主張は適法だが実効性は商標・IP 執行次第 | 「権利執行可能な範囲」のフットノート追加 |

### §4 Duration & renewal

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟡 MINOR | Standard/Extended の「Monthly auto-renew」= **消費者契約法 第10条** 違反の疑義(解約通知が不当に複雑な場合) | 「30日前通知で月次解約可能」を明示(現状記載あり、表現を確実に)|

### §5 IP Ownership

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🔴 BLOCKER | Part A §2 と同根: 「LUMINA owns perpetually, worldwide, exclusively」の法的強度不十分 | (a) Character Bible による著作者性立証、(b) 商標出願推進、(c) 文言に「to the extent permitted by applicable law」追記 |
| 🟠 MAJOR | 「Raw output prior to licensee post-production」は LUMINA 保有だが、クライアント編集済みコンポジットの**LUMINA への還元権**が未明記。例: LUMINA が自社ケーススタディで公開する権利 | §7 Joint 取扱いに「クライアント同意のうえ、LUMINA は成果物をマーケティング目的で使用できる」を明示的に追加 |

### §6 Client-supplied content

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟡 MINOR | 「We do not train any model on client-supplied content」→ 実運用上も本当にそうか再確認 | Dev agent とプロセス監査 → 監査記録を年次公開 |

### §7 Sub-licensing & transfer

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟠 MAJOR | Agency arrangements 「end-client must be disclosed」→ 広告代理店ビジネスの**中間代理店モデル**への対応が曖昧。例: 代理店A → 代理店B → end-client の三段階の扱い | 「2段階目までの代理店経由は可、3段階目以降は LUMINA 書面承認要」等を明記 |

### §8 Revoke vs. survive

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟢 OK | Balance が取れており、実務的 | — |

### §9 Dispute resolution

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟡 MINOR | 「30-day good-faith negotiation」は紛争激化防止として有効 | 記載維持 |
| 🟡 MINOR | 国際案件の準拠法・管轄の選択肢提示が現在 1 行 → 国際クライアント向けに英訳契約版では **Singapore International Arbitration Centre** 等の選択肢を追加推奨 | Launch 後、海外クライアント獲得時に別途対応 |

### §10 LUMINA vs traditional agency 比較表

| Severity | 指摘 | 修正案 |
|---|---|---|
| 🟡 MINOR | PR 的な効果はあるが、**法的文書としてはやや marketing tone 過多** | 「informational comparison only, not part of contractual terms」のフットノートを追加 |

---

## Part C — 既存 `/terms` との整合チェック

| 項目 | 既存 /terms 記載 | 新 Ethics/IP License | ステータス |
|---|---|---|---|
| モデルライセンス tier 名 | Standard/Extended/Campaign/Exclusive | 同 | ✅整合 |
| 使用範囲 | tier 別に異なる | IP License §2 に詳細 | ✅整合 |
| 第三者再ライセンス禁止 | 第7条 禁止事項 | IP License §7 | ✅整合 |
| AI 免責 | 第8条 免責事項 | Ethics §8 人間レビュー義務 | ⚠️ 一部矛盾 — /terms は「品質保証しない」、Ethics は「human editor reviewed」。**「合理的な QA を実施するが完璧な品質を保証しない」**に整合修正要 |
| 準拠法・管轄 | 第11条 東京地裁 | IP License §9 東京地裁 | ✅整合 |
| 支払い | 第4条 Stripe | **CEO決定(2026-04-20): Stripe 即購入なし** | 🔴 **要修正** — /terms の支払条項を「請求書ベース or Stripe(Studio self-serve のみ)」に差替え |

---

## Part D — 電子契約法対応(Click-wrap 適法性)

### 法的要件

1. **電子署名法 第3条** — 電子署名には「本人性」と「非改ざん性」の推定効力がある。クリックラップではこれが弱い。
2. **電子消費者契約法 第3条** — 消費者の操作ミスによる意思表示の錯誤を救済。B2B 契約では適用弱いが、個人事業主顧客リスクを考慮。
3. **民法第521条** — 契約成立の合意が書面・電子のいずれでも有効。

### LUMINA の対応方針

| Case | 方式 | 適法性強度 |
|---|---|---|
| Standard / Extended | Click-wrap 同意 + 同意ログ + 契約PDF生成 | 中程度(証拠保全は確実) |
| Campaign / Exclusive | CloudSign 電子署名 | 強(電子署名法第3条の推定効力) |
| NDA | CloudSign 電子署名 | 強 |

**推奨**: Click-wrap でもタイムスタンプ付き(Amazon S3 Object Lock 等)で保存、将来紛争時の証拠能力を強化。

### CEO決定(B2B商談ベース)との整合

Click-wrap は「契約締結段階」で使用(商談後、提案受諾のタイミング)。これは適法性としては**問題なし**:
- 契約前に十分な説明(商談・提案書)を経ている → 電子消費者契約法の錯誤リスク低減
- 特定商取引法の定期購入表示義務にも問題なし(月次更新)

---

## Part E — Launch Gate Blocker 一覧

Launch(2026-05-10)前に**必ず**対応が必要な項目:

| # | 項目 | 対応責任 | 期限 |
|---|---|---|---|
| B1 | AIモデル著作権帰属の法的根拠文書化(Character Bible全14体 + 創作指示書) | Legal + Branding | 05-01 |
| B2 | Ethics Code §2 / IP License §5 の文言に「to the extent permitted by applicable law」を追加 | Legal | 04-25 |
| B3 | 実在人物類似チェックプロセス文書化 + 運用手順整備 | Legal + Dev | 05-05 |
| B4 | 業界別禁止リスト(医薬品・金融等)別紙化 | Legal | 05-01 |
| B5 | /terms の支払条項を「商談ベース」に差替え | Legal + Dev | 04-28 |
| B6 | /terms 第8条 免責 と Ethics §8 人間レビュー義務との整合修正 | Legal | 04-28 |
| B7 | ethics@lumina-models.com 受信体制整備 + SLA 明記 | Dev + Legal | 05-05 |
| B8 | クリックラップ同意 + タイムスタンプ保存実装 | Dev | 05-08 |

---

## Part F — 総括判定

**現状**: Launch は**条件付き可能**。上記 Blocker 8項目を 05-10 までにクリアすれば Launch 可。

**弁護士最終レビュー**: 必須(Campaign 契約テンプレ・個別契約文言確定のため)。予算 ¥100-200k 目安、リードタイム 2週間想定。05-01 までに弁護士アサイン推奨。

**Launch 後 90日**: 実運用データ収集 → v2.0 リビジョン(類似人物発見事例、ライセンス紛争事例、クライアントフィードバックを反映)。

---

**Legal Agent Sign-off**:
レビュー実施者: Legal agent(TomorrowProof内部)
外部弁護士レビュー: **未実施 — 推奨**(Campaign/Exclusive契約の確実性担保のため)
Version: v0.1 DRAFT
Date: 2026-04-20

---

## 別紙: 起草済み関連ドキュメント

1. `docs/legal/clickwrap-agreement.md` — Standard/Extended クリックラップ同意文
2. `docs/legal/campaign-contract-template.md` — Campaign/Exclusive 書面契約骨子
3. `docs/legal/nda-template.md` — 双方向 NDA テンプレート

これら 3 本は本レビューと同日起草。弁護士最終化前の内部 v0.1。

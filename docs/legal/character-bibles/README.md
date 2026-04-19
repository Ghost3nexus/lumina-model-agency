# LUMINA MODEL AGENCY — Character Bibles Index

**Status**: Launch Blocker B1 — 著作権根拠文書化 (2026-04-19 初版)
**Owner**: KOZUKI TAKAHIRO (Creative Director, 株式会社TomorrowProof)
**Review**: Legal (pending) / Council (pending)

---

## 0. Purpose — なぜこの文書群が存在するか

本ディレクトリに格納された各 Character Bible は、LUMINA MODEL AGENCY に所属する架空のAIモデルについて、**LUMINA(株式会社TomorrowProof)が著作権その他の知的財産権を保有することを根拠付ける創作指示の記録**である。

### 法的背景

日本著作権法においてAI生成物の著作権帰属は未確定領域であるが、以下の整理が現時点での実務的コンセンサスに近い:

- **人間の「創作的寄与」が認められる場合**、生成物およびそれに付随するキャラクター・設定等には著作者性が生じ得る
- 創作的寄与の有無は、**企画の着想・ディレクション指示・選別・修正・承認のプロセスが具体的に記録されているか**で判断される
- 単にプロンプトを投げて得た出力は「自動生成物」とみなされ保護が弱いが、**キャラクター設計書に基づく体系的・反復的な生成**は、キャラクター権(判例上のキャラクター論)として別途保護され得る

したがって本 Character Bible は以下の二つの役割を同時に担う:

1. **生成ガイドライン** — 全エージェント・外部パートナーがモデル生成時に参照する単一の真実
2. **著作権根拠文書** — KOZUKI TAKAHIRO(および協業ディレクターが存在する場合はその者)による創作的寄与の証跡

本文書群は、将来の **IP ライセンス契約書(Standard / Extended / Campaign / Exclusive tier)の別紙**、および紛争発生時の LUMINA 側立証資料として機能する。

---

## 1. Index — v2 Roster 16 Models

### LADIES — INTERNATIONAL

| Model | Slug | File | Director(s) |
|-------|------|------|-------------|
| ELENA | `ladies-intl-01` | [elena.md](./elena.md) | KOZUKI TAKAHIRO |
| AMARA | `ladies-intl-02` | [amara.md](./amara.md) | KOZUKI TAKAHIRO |
| SOFIA | `ladies-intl-03` | [sofia.md](./sofia.md) | KOZUKI TAKAHIRO |
| NADIA | `ladies-intl-04` | [nadia.md](./nadia.md) | KOZUKI TAKAHIRO |

### LADIES — ASIA

| Model | Slug | File | Director(s) |
|-------|------|------|-------------|
| MIKU | `ladies-asia-01` | [miku.md](./miku.md) | KOZUKI TAKAHIRO |
| HARIN | `ladies-asia-02` | [harin.md](./harin.md) | KOZUKI TAKAHIRO |
| LIEN | `ladies-asia-03` | [lien.md](./lien.md) | KOZUKI TAKAHIRO |

### MEN — INTERNATIONAL

| Model | Slug | File | Director(s) |
|-------|------|------|-------------|
| IDRIS | `men-intl-01` | [idris.md](./idris.md) | KOZUKI TAKAHIRO |
| LARS | `men-intl-02` | [lars.md](./lars.md) | KOZUKI TAKAHIRO |
| MATEO | `men-intl-03` | [mateo.md](./mateo.md) | KOZUKI TAKAHIRO |

### MEN — ASIA

| Model | Slug | File | Director(s) |
|-------|------|------|-------------|
| SHOTA | `men-asia-01` | [shota.md](./shota.md) | KOZUKI TAKAHIRO |
| JIHO | `men-asia-02` | [jiho.md](./jiho.md) | KOZUKI TAKAHIRO |
| RYO | `men-street-01` | [ryo.md](./ryo.md) | KOZUKI TAKAHIRO |
| LUCAS MORI | `men-street-02` | [lucas-mori.md](./lucas-mori.md) | KOZUKI TAKAHIRO + Masafumi Watanabe (BEDWIN) |

### INFLUENCER

| Model | Slug | File | Director(s) |
|-------|------|------|-------------|
| RINKA | `influencer-girl-01` | [rinka.md](./rinka.md) | KOZUKI TAKAHIRO |
| KAI | `influencer-boy-01` | [kai.md](./kai.md) | KOZUKI TAKAHIRO |

**Total: 16 Character Bibles + このREADME = 17ファイル**

> LUCAS MORI の完全版 Character Bible は `~/Desktop/TomorrowProofagent/content/packages/visuals/lucas-mori/CHARACTER-BIBLE.md` に存在(BEDWIN Masafumi Watanabe 氏直接指示による共同ディレクション)。本ディレクトリの `lucas-mori.md` は要約および参照ポインターとして機能する。

---

## 2. Single Source of Truth — 数値スペック

各 Bible の §2 Physical Specification は `data/agencyModels.ts` から機械的に転記している。身長・B/W/H 等の数値は **`data/agencyModels.ts` が唯一の真実** であり、本 Bible 側で変更することはできない。スペック変更時は:

1. `data/agencyModels.ts` を更新
2. 対応する Bible §2 を同期
3. Bible §9 Change Log に変更を追記
4. 必要であれば §3 Creative Direction も更新(身体的変更が創作判断に関わる場合)

この順序を逆転させてはならない。

---

## 3. 運用ルール

- **絶対に守る**: `data/agencyModels.ts` の数値を Bible 側で勝手に変更しない
- **絶対に守る**: Creative Director として KOZUKI TAKAHIRO の名前を全 Bible の冒頭に明記
- **絶対に守る**: §8 IP Ownership Declaration に「to the extent permitted by applicable law」相当の表現を含める
- **避ける**: 実在の有名人名を vibe / styling 欄に記載しない(民族・地域・アーキタイプ参照のみ許容)
- **避ける**: 年齢を 18 歳未満に設定しない(全モデル 18歳以上で brand safety 担保)
- **連携する**: `docs/design/ai-ethics-code.md` §1-§3 と整合させる

---

## 4. Legal/IP 用途での参照

本 Bible 群は、以下の場面で参照される:

| 場面 | 参照方法 |
|------|---------|
| IP ライセンス契約書(Standard/Extended/Campaign/Exclusive) | 別紙として該当モデルの Bible を添付 |
| ブランドとのブリーフ合意 | §4 Styling Bible と §5 Voice & Behavior を合意事項として参照 |
| 紛争・他社との類似性主張対応 | §3 Creative Direction を創作的寄与の立証資料として提出 |
| モデル引退(Retirement)判断 | §7 Retirement Triggers を判断基準として参照 |
| 新モデル企画時のテンプレート | 既存 Bible をテンプレートとして複製し、新キャラクターを作成 |

---

## 5. Change Log

| Date | Change | By |
|------|--------|----|
| 2026-04-19 | 初版 16体分 Character Bible 作成(Launch Blocker B1 対応) | KOZUKI TAKAHIRO / Claude (legal agent support) |

---

**Questions / Updates**: Creative Director KOZUKI TAKAHIRO (via TomorrowProof agent `council` or `legal`)

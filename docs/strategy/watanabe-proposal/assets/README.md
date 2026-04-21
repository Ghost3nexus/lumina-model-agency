# 提案書ビジュアルアセット — 使い方

> 渡辺真史 様向け提案書(`../`)に埋め込まれた図・画像の運用ガイド。
> 2026-04-21 作成 / KOZUKI TAKAHIRO

---

## 1. ディレクトリ構成

```
assets/
├── README.md              ← 本ファイル
├── visual-index.md        ← 図の一覧(何が何章にあるか)
└── mermaid/               ← Mermaid code の別出し(Playground確認用)
    ├── positioning-map.mmd
    ├── org-structure.mmd
    ├── service-timeline.mmd
    ├── phased-gantt.mmd
    └── initial-meeting-mindmap.mmd
```

---

## 2. 図の種類と想定 viewer

本提案書の図解は以下の3種で構成されています。

### (A) Mermaid diagrams(最優先)
- Markdown code block(```mermaid```)として埋め込み
- GitHub で自動レンダリング(渡辺様にリポジトリを共有する場合、そのまま可読)
- PDF化時も Mermaid 対応 renderer なら再現可能
- 単体ファイル: `mermaid/*.mmd` にも別出し

### (B) HTML + Tailwind 埋込
- 複雑なテーブル・KPIカード・比較マトリクスのみ使用
- Markdown ネイティブ viewer でも **HTMLなしで読める構造** を維持(段階的拡張)
- Tailwind CDN が未ロードでもブラウザ標準スタイルで破綻しないようfallback color 併記

### (C) 画像参照
- 既存資産(`public/agency-models/*/beauty.png`, `public/case-studies/lumina-lookbook-ss26/`, `public/showcase/`)への相対パス
- 提案書ディレクトリから見た相対パス: `../../../public/...`

---

## 3. PDF化時の推奨 renderer

| viewer/ツール | Mermaid | HTML | 画像 | 備考 |
|---|---|---|---|---|
| **GitHub Web** | ✅ 自動 | 制限あり | ✅ | 渡辺様にリポジトリ共有する場合の本命 |
| **VSCode + Markdown Preview Mermaid Support** | ✅ | ✅ | ✅ | KOZUKI側編集時 |
| **Typora** | ✅ | ✅ | ✅ | 軽量PDFエクスポート |
| **Obsidian** | ✅ | ✅ | ✅ | ノート管理派向け |
| **Pandoc + Mermaid filter** | ✅ | ✅ | ✅ | CLIで一括PDF化 |
| **md-to-pdf (Node)** | ✅ | ✅ | ✅ | `md-to-pdf MASTER.md` で1ファイル化 |
| **Notion インポート** | ⚠️部分 | ⚠️ | ✅ | Mermaid は code block で保持されるが rendering は Notion 側次第 |

### 推奨手順(KOZUKIのPDF提出用)

```bash
# 1. md-to-pdf でMASTER.mdをPDF化
npx md-to-pdf docs/strategy/watanabe-proposal/MASTER.md \
  --marked-options.gfm=true \
  --pdf-options.format=A4

# 2. または Typora で開いて File > Export > PDF
```

---

## 4. Mermaid Playground での確認

`mermaid/` 配下の `.mmd` ファイルをそのままコピーして以下で確認:

- https://mermaid.live/ — 公式 Live Editor
- https://mermaid-js.github.io/mermaid/#/ — ドキュメント

---

## 5. 画像参照の相対パスルール

提案書(`docs/strategy/watanabe-proposal/MASTER.md` 等)から見て:

```
../../../public/agency-models/men-street-02/beauty.png
../../../public/case-studies/lumina-lookbook-ss26/page-01.jpg
../../../public/showcase/bottega-front.png
```

GitHub上で閲覧する場合、相対パスで画像が展開されます。
ローカルviewerでも同じ。**絶対パスは使わない**(可搬性のため)。

---

## 6. 数値の出典原則

- 既存の text で使っている数字のみグラフ化する(捏造禁止)
- 新しい数値の追加は、以下の3ファイルから引用ベース:
  - `../../../docs/pricing/pricing-rationale.md`
  - `../../../docs/design/seo-strategy.md`
  - `../../../journal/2026/04/19.md`

---

## 7. メンテナンスルール

- 提案書本文の数値更新 → Mermaid/HTML表内の数値も同時更新(整合性チェック)
- 画像追加 → `visual-index.md` にエントリ追加
- Mermaid 新規追加 → `mermaid/` に `.mmd` 別出し、`visual-index.md` 更新

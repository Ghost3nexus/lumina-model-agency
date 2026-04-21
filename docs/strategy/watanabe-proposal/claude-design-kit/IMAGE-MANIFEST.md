# Image Manifest — 使用画像リスト

本提案書で使用する画像素材。Claude Design に投入する際、それぞれのパスまたは URL を伝える。

---

## 1. Cover / Chapter divider 用(フルブリード向き、横長構図)

### LUMINA_Lookbook_SS26 (9 spreads)

| ファイル | 用途 | 構図 |
|---|---|---|
| `public/case-studies/lumina-lookbook-ss26/page-01.jpg` | **Cover 第一候補** | Navy airfield + male model。タイトル overlay 想定 |
| `public/case-studies/lumina-lookbook-ss26/page-03.jpg` | **Cover 第二候補** | Coastal highway + RRL convertible(黄金時間)、横構図◎ |
| `public/case-studies/lumina-lookbook-ss26/page-07.jpg` | Chapter divider candidate | 赤 '67 Mustang、Americana |
| `public/case-studies/lumina-lookbook-ss26/page-05.jpg` | Chapter divider | Hangar + camo dress |
| `public/case-studies/lumina-lookbook-ss26/page-09.jpg` | Appendix page | Military aircraft cabin + denim jumpsuit |
| `public/case-studies/lumina-lookbook-ss26/page-02.jpg` | Lookbook gallery | 2-up portrait(Cowichan + knit) |
| `public/case-studies/lumina-lookbook-ss26/page-04.jpg` | Lookbook gallery | Jeep chambray + plaid |
| `public/case-studies/lumina-lookbook-ss26/page-06.jpg` | Lookbook gallery | Surf shack + motorcycle |
| `public/case-studies/lumina-lookbook-ss26/page-08.jpg` | Lookbook gallery | B&W aircraft fuselage |

本番URL(Vercel):
- `https://lumina-model-agency.vercel.app/case-studies/lumina-lookbook-ss26/page-01.jpg`
- ... page-09 まで同パターン

---

## 2. Roster(14モデル)grid 用

### Beauty shots (モデル紹介セクション、4×4 grid 想定)

| モデル | 画像パス |
|---|---|
| ELENA (ladies-intl-01) | `public/agency-models/ladies-intl-01/beauty.png` |
| AMARA (ladies-intl-02) | `public/agency-models/ladies-intl-02/beauty.png` |
| SOFIA (ladies-intl-03) | `public/agency-models/ladies-intl-03/beauty.png` |
| NADIA (ladies-intl-04) | `public/agency-models/ladies-intl-04/beauty.png` |
| MIKU (ladies-asia-01) | `public/agency-models/ladies-asia-01/beauty.png` |
| HARIN (ladies-asia-02) | `public/agency-models/ladies-asia-02/beauty.png` |
| LIEN (ladies-asia-03) | `public/agency-models/ladies-asia-03/beauty.png` |
| IDRIS (men-intl-01) | `public/agency-models/men-intl-01/beauty.png` |
| LARS (men-intl-02) | `public/agency-models/men-intl-02/beauty.png` |
| MATEO (men-intl-03) | `public/agency-models/men-intl-03/beauty.png` |
| SHOTA (men-asia-01) | `public/agency-models/men-asia-01/beauty.png` |
| JIHO (men-asia-02) | `public/agency-models/men-asia-02/beauty.png` |
| RYO (men-street-01) | `public/agency-models/men-street-01/beauty.png` |
| LUCAS MORI (men-street-02) | `public/agency-models/men-street-02/beauty.png` ⭐ BEDWIN muse |
| RINKA (influencer-girl-01) | `public/agency-models/influencer-girl-01/beauty.png` |
| KAI (influencer-boy-01) | `public/agency-models/influencer-boy-01/beauty.png` |

本番URL例:
- `https://lumina-model-agency.vercel.app/agency-models/men-street-02/beauty.png`

---

## 3. Product Showcase(6ブランド × 4ビュー + flat-lay)

商品ページ作例として配置(ポートフォリオ量を示す箇所)。

| ブランド | 商品 | 4ビュー |
|---|---|---|
| Bottega Veneta | Napa Leather Biker Jacket | front/side/back/detail.png + product.jpg |
| Miu Miu | Cashmere Crewneck | 同上 |
| Noah | Shore Coat | 同上 |
| New Balance | Denim Trucker | 同上 |
| Zara | Wide Leg Denim | 同上 |
| Nike | Club Fleece Half-Zip | 同上 |

パス: `public/showcase/{brand}-{view}.{ext}`

例: `public/showcase/bottega-front.png`

本番URL:
- `https://lumina-model-agency.vercel.app/showcase/bottega-front.png`

---

## 4. Mermaid 図(既にレンダリング済、SVG 出力可能)

提案書 9 種の Mermaid diagram は既存 markdown から抽出可:
- `docs/strategy/watanabe-proposal/assets/mermaid/positioning-map.mmd` — ポジショニングマップ(最強視覚フック)
- `docs/strategy/watanabe-proposal/assets/mermaid/org-structure.mmd` — Wizard AI 組織図
- `docs/strategy/watanabe-proposal/assets/mermaid/service-timeline.mmd` — サービスロードマップ timeline
- `docs/strategy/watanabe-proposal/assets/mermaid/phased-gantt.mmd` — Phase 0-3 Gantt
- `docs/strategy/watanabe-proposal/assets/mermaid/initial-meeting-mindmap.mmd` — 初回対話 6 論点 mindmap

**Claude Design に伝える際のオプション**:
- (A) Mermaid コードを直接貼付(Claude が描画)
- (B) 既存 SVG を画像として読み込む
- (C) SVG コードを埋込(Artifact 内で最強の制御可)

---

## 5. Webで公開されている画像(Claude がすぐフェッチ可能)

Claude Design が URL から画像を読み込める場合、以下を直接 URL 指定:

```
Cover: https://lumina-model-agency.vercel.app/case-studies/lumina-lookbook-ss26/page-01.jpg
Chapter covers: page-03, page-05, page-07
Roster: https://lumina-model-agency.vercel.app/agency-models/{slug}/beauty.png
Showcase: https://lumina-model-agency.vercel.app/showcase/{brand}-{view}.png
```

---

## 6. 推奨画像投入順

Claude の会話容量を考慮して、段階投入:

**Round 1(表紙 + 目次作成時)**:
- `page-01.jpg` または `page-03.jpg` (cover 候補)

**Round 2(章扉作成時)**:
- `page-05.jpg`, `page-07.jpg`(chapter divider 2 枚)

**Round 3(ロスター紹介時)**:
- 14 体の beauty.png(一括ドラッグ&ドロップ、または URL リスト貼付)

**Round 4(Appendix Lookbook gallery)**:
- 残り Lookbook spreads 9 枚

**Round 5(商品ショーケース)**:
- Showcase 30 枚(brand ごとに 5 枚ずつ)

---

## ダウンロードスクリプト(必要時)

KOZUKI が画像を手元に集める必要がある場合:

```bash
# Lookbook(既にローカルにあり、コピー不要)
cp public/case-studies/lumina-lookbook-ss26/page-0*.jpg ~/Desktop/claude-design-input/

# 14体 beauty
for slug in ladies-intl-01 ladies-intl-02 ... ; do
  cp public/agency-models/$slug/beauty.png ~/Desktop/claude-design-input/${slug}-beauty.png
done

# Showcase
cp public/showcase/*.png ~/Desktop/claude-design-input/
```

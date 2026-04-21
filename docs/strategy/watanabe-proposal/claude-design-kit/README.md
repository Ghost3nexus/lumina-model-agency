# Claude Design Kit — 渡辺氏向け提案書

> Claude Design(claude.ai の Artifacts / Canvas)で **A4 横向きのエディトリアル級提案書** を作るための素材一式。
>
> この kit をまるごと claude.ai に投入すれば、NET-A-PORTER / Supreme Management グレードの landscape PDF が作れる設計。

---

## 想定ワークフロー

```
1. claude.ai (Pro/Team 想定) を開く
2. 新しい会話を開始
3. INPUT-PROMPT.md をコピペして送信
4. 要求された画像を順次ドラッグ&ドロップ or URL貼付
5. Claude が HTML/React Artifact を生成
6. 「横向きで」「余白広く」「タイポ強く」等の修正指示を反復
7. Chrome Print to PDF で出力(landscape, Background graphics ON, Margins None)
```

---

## 内容ファイル

| ファイル | 用途 |
|---|---|
| `README.md`(本書) | 使い方ガイド |
| `HOW-TO-USE-CLAUDE-DESIGN.md` | **Claude Design 活用のベストプラクティス**(subagent 調査、非推測ベース) |
| `INPUT-PROMPT.md` | **claude.ai に貼付するメインプロンプト**(ブランド・レイアウト・コンテンツ指示込み) |
| `CONTENT-PACKAGE.md` | 提案書テキスト素材(章別・整形済み、`MASTER.md` 派生) |
| `VISUAL-SPECS.md` | ブランド仕様(色・タイポ・トーン・リファレンス) |
| `IMAGE-MANIFEST.md` | 使用予定画像の一覧(パス・用途・キャプション) |

---

## アスペクト比要件

**A4 Landscape (横向き 297mm × 210mm)** が必須。

CSSで指定:
```css
@page {
  size: A4 landscape;
  margin: 12mm;
}
```

Chrome Print to PDF 時:
- Layout: **Landscape**
- Paper size: A4
- Margins: **None** or Custom(0-10mm)
- Scale: Default(100%)
- Options: **Background graphics ✅**

---

## 期待完成品

- A4 横 20-30 ページ
- 表紙はフルブリード画像(Lookbook SS26 cover)
- 各章扉が editorial(大判タイポ + 余白)
- ポジショニングマップ・Gantt 等の図は Mermaid or SVG
- 日本語フォント: Hiragino Kaku Gothic ProN(Web Safe)or Noto Sans JP
- 全体トーン: 黒・白・ネイビー・ベージュ系統の editorial calm
- フッター: `LUMINA × WIZARD — DRAFT` + ページ番号

---

## 参考デザインリファレンス

KOZUKI が Claude に「こういうトーンで」と伝える際の参照先:

- **NET-A-PORTER** 商品ページ / Edition Magazine(net-a-porter.com)
- **Supreme Management** ロスターサイト
- **The Row** editorial(therow.com)
- **Dover Street Market** レイアウト
- **Vogue Business** エディトリアル
- **Kith** ブランドストーリー
- **DAYZ** 渡辺氏プロデュースショップ(参考文脈、同美学)

---

## 生成物の置き場所

KOZUKI が claude.ai で生成した完成品の置き場:
- **HTML 版**: `docs/strategy/watanabe-proposal/claude-design-kit/output/proposal.html`(手動でコピペ保存)
- **PDF 版**: `~/Desktop/LUMINA_Proposal_for_Watanabe_v1.0.pdf`(Chrome Print to PDF で出力)

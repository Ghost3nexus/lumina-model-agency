# freee API連携 Discordコマンド リファレンス

## 法人/個人の切り替え

```
!cfo 法人 〜    → 株式会社TomorrowProofの会計データにアクセス（デフォルト）
!cfo 個人 〜    → 個人コンサル事業の会計データにアクセス
```

「法人」「個人」を省略した場合は**法人（TomorrowProof）**をデフォルトとする。

**例:**
```
!cfo 法人 PL           → 法人の損益計算書
!cfo 個人 PL           → 個人事業の損益計算書
!cfo 法人 未処理       → 法人のクレカ・銀行明細
!cfo 個人 売上 50000 田中商事 壁打ちコンサル
!cfo PL                → デフォルトは法人
```

## 初回認証

```
!cfo 認証          → freee OAuth認証URLを発行
!cfo callback [コード] → 認証コードでトークン取得
```

## データ取得

```
!cfo PL            → 当月の損益計算書
!cfo PL 2026 3     → 指定年月の損益計算書
!cfo キャッシュ     → 現在の現金・預金残高
!cfo 残高          → キャッシュと同じ
!cfo 取引一覧      → 最新20件の取引履歴
!cfo 勘定科目      → 勘定科目一覧
```

## クレカ明細の仕訳（メイン機能）

```
!cfo 未処理         → 未処理のクレカ・銀行明細一覧
!cfo 未処理 クレカ   → クレカ明細のみ
!cfo 未処理 銀行    → 銀行明細のみ
!cfo 登録 [明細ID] [勘定科目名] → 勘定科目を付けて取引登録
  例: !cfo 登録 12345 通信費
  例: !cfo 登録 12345 広告宣伝費
!cfo 自動仕訳       → AIが未処理明細の勘定科目を一括推測・提案
```

## データ登録（手動）

```
!cfo 経費 [金額] [内容]
  例: !cfo 経費 5000 Anthropic API費用

!cfo 売上 [金額] [取引先] [内容]
  例: !cfo 売上 100000 サック株式会社 AI実装コンサル

!cfo 請求書 [取引先] [金額] [内容]
  例: !cfo 請求書 サック株式会社 100000 AI実装コンサルティング
```

## 技術仕様

- OAuth2: `http://localhost:8080/freee/callback` コールバック方式
- トークン自動更新: `discord-bot/data/freee-tokens.json` に永続保存
- API Base: `https://api.freee.co.jp`
- 環境変数: `FREEE_CLIENT_ID`, `FREEE_CLIENT_SECRET`, `FREEE_COMPANY_ID`（法人）, `FREEE_COMPANY_ID_PERSONAL`（個人）

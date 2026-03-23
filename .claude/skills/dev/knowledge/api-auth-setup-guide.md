# API認証セットアップガイド

> TomorrowProofで利用する外部APIの認証設定手順。
> 実運用で得た知見をもとに、試行錯誤なしで設定完了できるようまとめたもの。

---

## Google APIs (Calendar / GA4 / Google Ads)

### GCPプロジェクト設定

1. [GCP Console](https://console.cloud.google.com) → APIとサービス → 認証情報
2. 「+認証情報を作成」→「OAuthクライアントID」
3. アプリケーションの種類: **ウェブアプリケーション**
4. 承認済みのリダイレクトURI: `http://localhost:8080/google/callback`
5. OAuth同意画面 → テストユーザーに**使用するGoogleアカウントを追加**（これを忘れると `access_denied` になる）

### アカウント使い分け

| アカウント | 用途 | 使う場面 |
|-----------|------|---------|
| sackozuki@gmail.com | 法人メイン | カレンダー・経費・freee・請求書 |
| tomorrowprooftokyo@gmail.com | GCPプロジェクト・OAuth | Google Ads・Lumina系・GA4 |
| kooochan0601@gmail.com | 個人用 | 個人事業関連 |

**重要**: OAuthクライアントIDはGCPプロジェクトに紐づくため、`tomorrowprooftokyo@gmail.com` のGCPプロジェクトで作成する。ただし認証フロー時にログインするアカウントはサービスごとに異なる（下記参照）。

---

### Google Calendar

| 項目 | 値 |
|------|-----|
| 認証アカウント | sackozuki@gmail.com（カレンダーのオーナー） |
| 認証方式 | OAuth 2.0 |
| スコープ | `https://www.googleapis.com/auth/calendar` |
| 認証コマンド | `node scripts/reauth-google.js calendar` |
| テスト | `node scripts/test-api-connections.js calendar` |

**手順**:
1. `node scripts/reauth-google.js calendar` を実行
2. ブラウザが開く → **sackozuki@gmail.com** でログイン
3. カレンダーへのアクセスを許可
4. `http://localhost:8080/google/callback` にリダイレクトされてトークン保存完了

---

### Google Ads

| 項目 | 値 |
|------|-----|
| 認証アカウント | tomorrowprooftokyo@gmail.com（Ads管理者） |
| 認証方式 | OAuth 2.0 |
| MCC ID | 7833840241 |
| Customer ID | 2739032935（Lumina Studio） |
| Developer Token | テストアカウントレベル → ベーシック申請済み（承認待ち） |
| 認証コマンド | `node scripts/reauth-google.js ads` |
| テスト | `node scripts/test-api-connections.js ads` |

**注意点**:
- テストレベルでは**Developer Tokenと同じGCPプロジェクトのOAuthクライアント**が必要
- MCC ID と Customer ID を混同しないこと。API呼び出し時は Customer ID を使う
- Developer Tokenのアクセスレベルが「テスト」の間は、テストアカウントのデータしか取得できない

**手順**:
1. `node scripts/reauth-google.js ads` を実行
2. ブラウザが開く → **tomorrowprooftokyo@gmail.com** でログイン
3. Google Adsへのアクセスを許可
4. トークン保存完了

---

### GA4

| 項目 | 値 |
|------|-----|
| 認証方式 | サービスアカウント（OAuth不要） |
| サービスアカウント | `tomorrowproof-agent@tomorrowproof-agent.iam.gserviceaccount.com` |
| プロパティID | **526434514** |
| アカウントID | 385954988（APIでは使わない） |
| テスト | `node scripts/test-api-connections.js ga4` |

**よくあるミス**: プロパティID（526434514）とアカウントID（385954988）を間違える。APIで使うのは**プロパティID**。

**権限設定手順**:
1. [GA4管理画面](https://analytics.google.com) → 管理（歯車アイコン）
2. アカウント列 → アカウントのアクセス管理
3. 「+」→ ユーザーを追加
4. メール: `tomorrowproof-agent@tomorrowproof-agent.iam.gserviceaccount.com`
5. 権限: **管理者**
6. 保存

**サービスアカウントキー**:
- `.secrets/` ディレクトリにJSONキーファイルを配置
- 環境変数 `GOOGLE_APPLICATION_CREDENTIALS` でパスを指定、またはコード内で直接読み込み

---

## X (Twitter) API

| 項目 | 値 |
|------|-----|
| 認証方式 | OAuth 1.0a（HMAC-SHA1） |
| Developer Console | https://console.x.com |
| テスト | `node scripts/test-api-connections.js x` |

**必要な認証情報（4つ）**:

| .env変数 | 説明 |
|----------|------|
| `X_API_KEY` | Consumer Key（API Key） |
| `X_API_SECRET` | Consumer Secret（API Secret） |
| `X_ACCESS_TOKEN` | Access Token |
| `X_ACCESS_TOKEN_SECRET` | Access Token Secret |

**セットアップ手順**:
1. [X Developer Console](https://console.x.com) でアプリを作成/確認
2. **アプリをPay Per Useパッケージに移動する**（$5チャージが必要）
   - Freeプランではツイート投稿APIが使えない
3. アプリの「Keys and tokens」タブで4つのキーを取得
4. `.env` に設定

**注意**: Pay Per Useにしないとツイート投稿で `403 Forbidden` になる。

---

## freee

| 項目 | 値 |
|------|-----|
| 認証方式 | OAuth 2.0 |
| 法人 Company ID | 12097994 |
| 個人事業 Company ID | 2539616 |
| リダイレクトURI | `http://localhost:8080/freee/callback` |
| テスト | `node scripts/test-api-connections.js freee` |

**環境変数**:

| .env変数 | 説明 |
|----------|------|
| `FREEE_CLIENT_ID` | OAuthクライアントID |
| `FREEE_CLIENT_SECRET` | OAuthクライアントシークレット |
| `FREEE_COMPANY_ID` | 法人: 12097994 |
| `FREEE_COMPANY_ID_PERSONAL` | 個人: 2539616 |

**手順**:
1. [freee Developer](https://developer.freee.co.jp) でアプリを作成
2. リダイレクトURIに `http://localhost:8080/freee/callback` を設定
3. 認証フローを実行してトークン取得
4. 法人/個人の切り替えは Company ID で行う

---

## Instantly

| 項目 | 値 |
|------|-----|
| 認証方式 | APIキー（Bearer token） |
| テスト | `node scripts/test-api-connections.js instantly` |

**環境変数**:

| .env変数 | 説明 |
|----------|------|
| `INSTANTLY_API_KEY` | APIキー |

**手順**:
1. InstantlyダッシュボードからAPIキーを取得
2. `.env` に `INSTANTLY_API_KEY` を設定
3. リクエストヘッダーに `Authorization: Bearer {API_KEY}` を付与

---

## Instagram (未設定)

将来のセットアップ用メモ。

**必要なもの**:
- [Meta Developer Console](https://developers.facebook.com) でアプリ作成
- Instagram Graph API の有効化
- Instagram Basic Display API の有効化
- Facebookページとの連携（Instagramビジネスアカウント必須）
- Facebookページの管理者権限

**セットアップ概要**:
1. Meta Developer Console → 新規アプリ作成（種類: ビジネス）
2. Instagram Graph API を追加
3. Facebookページを作成/連携
4. Instagramアカウントをビジネスアカウントに変更
5. FacebookページとInstagramアカウントを紐づけ
6. アプリレビュー申請（`instagram_basic`, `instagram_content_publish` 等）

---

## トラブルシューティング

### Google系共通

| エラー | 原因 | 対処 |
|--------|------|------|
| `Token expired` / `Token revoked` | トークン期限切れ or 手動取り消し | `node scripts/reauth-google.js [service]` で再認証 |
| `redirect_uri_mismatch` | GCPのリダイレクトURIが一致しない | GCP Console → 認証情報 → リダイレクトURIに `http://localhost:8080/google/callback` を追加 |
| `access_denied` (403) | テストユーザー未追加 | OAuth同意画面 → テストユーザーに該当アカウントを追加 |
| `gaxios` / `node-fetch` モジュールエラー | 依存関係の衝突 | `rm -rf node_modules/gaxios/node_modules && npm install` |

### GA4

| エラー | 原因 | 対処 |
|--------|------|------|
| `PERMISSION_DENIED` | サービスアカウントの権限不足 or プロパティID間違い | プロパティID **526434514** を使っているか確認。アカウントID 385954988 ではない |
| `Property not found` | プロパティIDが間違い | GA4管理画面でプロパティIDを再確認 |

### Google Ads

| エラー | 原因 | 対処 |
|--------|------|------|
| `PERMISSION_DENIED` | Developer Tokenのアクセスレベル不足 | テストレベルではテストアカウントのみ。ベーシック申請の承認を待つ |
| `DEVELOPER_TOKEN_NOT_APPROVED` | トークン未承認 | Google Ads APIセンターでステータス確認 |

### X (Twitter)

| エラー | 原因 | 対処 |
|--------|------|------|
| `403 Forbidden` | Freeプランで投稿API使用 | Pay Per Useパッケージに移動($5チャージ) |
| `401 Unauthorized` | キーが間違い or 期限切れ | 4つのキーを再確認・再生成 |

### freee

| エラー | 原因 | 対処 |
|--------|------|------|
| `invalid_grant` | トークン期限切れ | 再認証フロー実行 |
| `company not found` | Company IDが間違い | 法人: 12097994, 個人: 2539616 |

---

## 全API一括テスト

```bash
for s in x freee ads calendar ga4 instantly; do
  echo "=== $s ==="
  node scripts/test-api-connections.js $s
done
```

各サービスの接続状態をまとめて確認できる。エラーが出たサービスのみ個別に対処する。

---

## .env テンプレート（API認証関連）

```env
# Google OAuth (GCPプロジェクト: tomorrowprooftokyo)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Google Ads
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_MCC_ID=7833840241
GOOGLE_ADS_CUSTOMER_ID=2739032935

# GA4
GA4_PROPERTY_ID=526434514

# X (Twitter)
X_API_KEY=
X_API_SECRET=
X_ACCESS_TOKEN=
X_ACCESS_TOKEN_SECRET=

# freee
FREEE_CLIENT_ID=
FREEE_CLIENT_SECRET=
FREEE_COMPANY_ID=12097994
FREEE_COMPANY_ID_PERSONAL=2539616

# Instantly
INSTANTLY_API_KEY=
```

> **注意**: 実際の値は `.secrets/` または `.env` に保存し、**絶対にgitにコミットしない**こと。

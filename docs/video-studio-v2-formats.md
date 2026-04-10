# LUMINA VIDEO STUDIO v2 — フォーマット設計書

> **ステータス**: 調査ベース設計（2026-04-10）
> **根拠**: `docs/sns-shorts/grwm-viral-analysis.md`（15本分析）+ RINKA GRWM実証データ
> **原則**: 「思いつきプリセット」ではなく「バイラル構造の再現」

---

## 1. 5大フォーマット

調査した15パターンのバイラル動画から、5つの構造テンプレートを抽出。

### A. GRWM（Get Ready With Me）

**構造**: Hook → 準備 → 着用 → 完成 → 外出
**尺**: 15-60秒（推奨25-30秒）
**カット数**: 6-15
**用途**: SNS（Reels / TikTok）
**完走率**: 15秒=68%, 30秒=60%, 60秒=48%

**カット構成テンプレート（10カット / 25秒）**:
| # | 役割 | 尺 | カメラ | 内容 |
|---|------|-----|--------|------|
| 1 | Hook | 2-3秒 | セルフィー/正面 | Before状態（すっぴん/寝起き/散らかった部屋） |
| 2 | 準備 | 2-3秒 | デスク前/鏡越し | ヘア or スキンケア |
| 3 | アイテム1 | 2秒 | クローズアップ | 靴 or キーアイテムを手に取る |
| 4 | アイテム2 | 2秒 | 鏡越し | ボトムス着用 |
| 5 | アイテム3 | 2秒 | クローズアップ | トップス/ブランドロゴ見せ |
| 6 | アイテム4 | 2-3秒 | 鏡越し | アウター羽織る |
| 7 | アクセサリー | 2秒 | クローズアップ | ネックレス/リング/時計 |
| 8 | 完成 | 3秒 | 鏡越し全身 | 360度回転 or ポージング |
| 9 | 外出 | 3-4秒 | 後ろ/横から | ストリートウォーク |
| 10 | 締め | 2-3秒 | 正面 | 振り返り/笑顔/ピース |

**サブタイプ**:
- **ストリート型**: Before/Afterギャップ重視。ビートドロップ同期（原宿/下北系）
- **古着型**: 価格+入手先テキスト付き。教育要素（古着女子コミュニティ）
- **エステティック型**: ASMR音+スローテンポ。朝の光+コーヒー（ライフスタイル系）
- **ギャル/変身型**: すっぴん→フルメイク。カット数多め12-20（変身落差最大化）

---

### B. Outfit Transition

**構造**: Before → ビートドロップ → After（× 1-4ルック）
**尺**: 15-20秒
**カット数**: 4-8
**用途**: SNS（最もバイラル可能性が高い）

**カット構成テンプレート（4カット / 15秒）**:
| # | 役割 | 尺 | カメラ | 内容 |
|---|------|-----|--------|------|
| 1 | Before | 3秒 | 鏡越し全身 | パジャマ/タオル/部屋着（位置固定必須） |
| 2 | トランジション | 0.5秒 | 同位置 | 手かざし/ジャンプ/スピン |
| 3 | After Look 1 | 5秒 | 同位置 | 完成コーデ（ポージング） |
| 4 | After Look 2-3 | 6.5秒 | 同位置 | 追加ルック（ビートドロップごとに切替） |

**鉄則**:
- カメラ位置を絶対に動かさない（align機能で位置合わせ）
- ビートドロップの瞬間にカット
- 尺配分: Before 20% / After 80%（完成ルックを長く見せる）

---

### C. Lookbook

**構造**: ルック1 → ルック2 → ルック3（各ルックに着用+全身+ディテール）
**尺**: 30-60秒
**カット数**: 9-18（3ルック × 3-6カット）
**用途**: SNS + EC（シーズンコレクション紹介）

**カット構成テンプレート（3ルック / 45秒）**:
| # | 役割 | 尺 | カメラ | 内容 |
|---|------|-----|--------|------|
| 1 | フラットレイ | 2秒 | 俯瞰 | ルック1のアイテムを並べる |
| 2 | 着用 | 3秒 | 鏡越し | 着用プロセス |
| 3 | 全身 | 3秒 | 全身 | ポージング/360度 |
| 4 | ディテール | 2秒 | クローズアップ | 素材感/ブランドロゴ |
| 5 | ストリート | 3秒 | ロケ | 外出ショット |
| 6 | トランジション | 0.5秒 | — | 次ルックへ切替 |
| 7-12 | ルック2 | 同上 | — | — |
| 13-18 | ルック3 | 同上 | — | — |

---

### D. Product Showcase

**構造**: 商品クローズアップ → モデル着用 → ディテール → 全身
**尺**: 15-30秒
**カット数**: 4-8
**用途**: EC商品ページ動画 / 商品PR

**カット構成テンプレート（6カット / 20秒）**:
| # | 役割 | 尺 | カメラ | 内容 |
|---|------|-----|--------|------|
| 1 | 商品単体 | 3秒 | クローズアップ | 商品のみ。素材感・ディテール |
| 2 | タグ/ブランド | 2秒 | 超クローズアップ | ブランドタグ or ロゴ |
| 3 | 着用 | 3秒 | 鏡越し/正面 | モデルが着用する瞬間 |
| 4 | 全身フロント | 4秒 | 全身正面 | EC標準アングル |
| 5 | 全身バック | 3秒 | 全身背面 | バックディテール |
| 6 | 動き | 5秒 | 歩行/回転 | 素材の揺れ・シルエット確認 |

---

### E. Editorial

**構造**: シネマティック。ストーリー性のある構成
**尺**: 30-60秒
**カット数**: 6-12
**用途**: ブランディング / キャンペーン

**カット構成テンプレート（8カット / 45秒）**:
| # | 役割 | 尺 | カメラ | 内容 |
|---|------|-----|--------|------|
| 1 | 空気感 | 4秒 | ワイド | ロケーション（街/スタジオ/自然光） |
| 2 | モデル登場 | 4秒 | ミディアム | 後ろ姿/シルエット |
| 3 | ディテール1 | 3秒 | クローズアップ | 手元/アクセサリー/素材 |
| 4 | ポートレート | 5秒 | バスト | 表情・目線 |
| 5 | 動き | 5秒 | フル | ウォーキング/ポージング |
| 6 | ディテール2 | 3秒 | クローズアップ | 別角度 |
| 7 | 全身 | 5秒 | フル | 最もインパクトのあるショット |
| 8 | 締め | 4秒 | ワイド→引き | フェードアウト or 歩き去り |

---

## 2. 各カットのモーション辞書

調査から抽出したI2Vプロンプトに使えるモーション。カットの役割ごとに分類。

### Hook用
| ID | モーション | I2Vプロンプト |
|----|----------|-------------|
| hook-blink | 寝起き瞬き | Blinks slowly, shifts head on pillow, sleepy annoyed expression |
| hook-mirror | 鏡チェック | Looks at mirror, touches face, evaluating expression |
| hook-reach | アイテムに手を伸ばす | Reaches toward clothing rack, hand enters frame |

### 準備・着用
| ID | モーション | I2Vプロンプト |
|----|----------|-------------|
| prep-hair | 髪セット | Runs fingers through hair, tousling and arranging strands |
| prep-skincare | スキンケア | Applies product to face with gentle patting motion |
| wear-top | トップス着用 | Pulls on shirt/top, adjusting collar and hem |
| wear-bottom | ボトムス着用 | Adjusts waistband in mirror, checks fit |
| wear-outer | アウター羽織り | Puts on jacket, adjusts collar with one hand |
| wear-shoes | 靴を履く | Picks up shoes, laces swing gently |
| wear-accessory | アクセサリー | Clasps necklace behind neck, delicate finger movement |

### 完成・見せ
| ID | モーション | I2Vプロンプト |
|----|----------|-------------|
| show-turn | 360度回転 | Slowly turns showing full outfit, confident expression |
| show-pose | ポージング | Strikes fashion pose, weight shift, hand on hip |
| show-mirror | 鏡チェック | Checks reflection, nods with satisfied smile |
| show-detail | ディテール見せ | Holds fabric close to camera, showing texture |

### 外出・ストリート
| ID | モーション | I2Vプロンプト |
|----|----------|-------------|
| street-walk | ストリートウォーク | Walking forward on street, natural stride, hair sways |
| street-lookback | 振り返り | Turns back to camera, smiles, casual peace sign |
| street-candid | キャンディッド | Candid moment on street, natural laugh, wind in hair |
| street-crossing | 横断歩道 | Walking across crosswalk, urban background |

### 商品・EC向け
| ID | モーション | I2Vプロンプト |
|----|----------|-------------|
| product-hold | 商品を持つ | Holds garment up to camera, fabric drapes naturally |
| product-unfold | 商品を広げる | Unfolds garment showing full design, logo visible |
| product-tag | タグ見せ | Turns over tag/label, fingers holding delicately |
| product-swing | 素材の揺れ | Garment swings gently, showing material flow and drape |

---

## 3. マルチクリップ構成（1分対応）

### 原則
- 1クリップ = 5秒（Kling v2.1の最小単位）
- 1分 = 5秒×12クリップ or 10秒×6クリップ
- 各クリップは独立生成 → タイムラインで並べる

### 尺パターン
| パターン | 総尺 | クリップ数 | 用途 |
|---------|------|-----------|------|
| Short | 15秒 | 3×5秒 | Outfit Transition |
| Standard | 25-30秒 | 5-6×5秒 | GRWM / Product |
| Long | 45-60秒 | 9-12×5秒 | Lookbook / Editorial |

---

## 4. v2実装に必要な変更

### フォーマット選択UI（SceneConfiguratorを置き換え）
- 5大フォーマットから選択
- フォーマットごとにカット構成テンプレートを自動展開
- 各カットのモーションをドロップダウンで選択可能

### ガーメントアップロード（既存Studioから移植）
- 商品画像アップロード → 着用カットに自動反映
- Product Showcaseフォーマットでは必須

### マルチクリップ管理
- カットごとに個別生成（静止画→I2V）
- タイムラインUI（カット並び替え・尺調整）
- 全クリップ一括ダウンロード（ZIP or 結合MP4）

### 編集機能（Phase 2B）
- テキストオーバーレイ（フォント・位置・タイミング）
- トリミング（5秒クリップから使いたい部分を切り出し）
- カラーグレーディングプリセット（暖色朝/自然光/フィルム）

---

## 変更履歴

| 日付 | 変更者 | 内容 |
|------|--------|------|
| 2026-04-10 | CEO + Claude | 初版。調査ベース5フォーマット + モーション辞書 |

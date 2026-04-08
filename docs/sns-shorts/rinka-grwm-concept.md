# RINKA GRWM #01 — コンセプト + プロンプト

> 制作日: 2026-04-08
> モデル: RINKA (influencer-girl-01)
> 用途: Instagram Reels / TikTok
> 生成: Gemini 3.1 Flash Image Preview → Kling 1.6 I2V

---

## コンセプト

- **タイトル**: 「朝5時に寝たDJの支度」
- **総尺**: 25秒
- **カット数**: 10
- **フック**: 寝起きのダル顔クローズアップ → ピンクアッシュ髪の視覚インパクト → DJ設定でストーリー付加
- **BGM方針**: J-HipHop or シティポップ x ハウスのDJ RINKA自作ミックス30秒版（120-130BPM）。ビートドロップをカット8の全身完成に同期させる。オリジナル音源はアルゴリズム優遇あり
- **トーン**: ダルめ脱力系クール。ハイテンションではない。おしゃれだけど気張ってない
- **ターゲット**: 古着女子 / ストリートファッション層 / 原宿・下北沢カルチャー圏

---

## 背景設定（全室内カット共通）

RINKAの部屋 — 下北沢・古い木造アパート2階:

- **間取り**: ワンルーム、6畳程度
- **壁**: 白〜クリーム色の古い漆喰壁。画鋲の跡あり
- **光源**: 左側の大きな窓から朝の自然光（東向き）。カーテンは薄いリネン、半開き。暖色の朝日が差し込む
- **家具**: 木製のローテーブル（スキンケア・コスメが散乱）、姿見（木枠、フルレングス、壁に立てかけ）、ハンガーラック（服がぎっしり）
- **ディテール**: 壁にバンドのフライヤーやポラロイド写真を貼っている。床に雑誌が積んである。ヴィンテージのVivienne Westwoodの小物が棚に並ぶ。レコードが数枚立てかけてある
- **ベッド**: シングル、シーツはくしゃくしゃ（寝起きカット用）
- **色味**: 全体的に暖色系。木の色味と朝日のウォームトーン。生活感があるがおしゃれ

**統一ルール**: 全室内カットで窓の位置（画面左）と光の方向を固定。家具の配置を変えない。

---

## 最終カット構成

| # | 時間 | 内容 | カメラ | テキスト | 場所 |
|---|------|------|--------|---------|------|
| 1 | 0-2.5秒 | フック: 寝起き顔クローズアップ。ボサボサ髪、ダル顔 | 正面セルフィー（ベッド） | 「朝5時に寝たDJの支度」 | 室内・ベッド |
| 2 | 2.5-5秒 | 髪セット。ピンクアッシュ髪をかき上げてまとめる | デスク前正面（鏡越し） | なし | 室内・ローテーブル前 |
| 3 | 5-7秒 | Dr. Martens 1460を手に取る。ピンク替え紐が見える | 足元/手元クローズアップ | 「Dr. Martens 1460」 | 室内・玄関付近 |
| 4 | 7-9秒 | Dickies 874を履く。腰履き、裾ロールアップ | 姿見越し下半身 | 「Dickies 874」 | 室内・姿見前 |
| 5 | 9-11秒 | HUMAN MADE Teeを広げて見せる。ハートロゴが見える | 手元クローズアップ | 「HUMAN MADE」 | 室内・ハンガーラック前 |
| 6 | 11-13.5秒 | sacai MA-1を羽織る。異素材ドッキングのディテール | 姿見越し上半身 | 「sacai」 | 室内・姿見前 |
| 7 | 13.5-15.5秒 | Vivienneネックレスを留める + ビーズブレスレット見せ | 鎖骨〜手首クローズアップ | なし | 室内・姿見前 |
| 8 | 15.5-18.5秒 | 全身コーデ完成。姿見の前でゆっくり回転 | 姿見越し全身 | なし | 室内・姿見前 |
| 9 | 18.5-22秒 | 下北沢の商店街を歩く。自然体で | 後ろから友達撮り風 | なし | 下北沢・路地 |
| 10 | 22-25秒 | 振り返って笑う。カメラに向かって軽くピース | 正面ストリートスナップ | 「@rinka_pink」 | 下北沢・路地 |

**変更点（競合分析ベースからの調整）**:
- カット5: sacaiはアウターなのでカット6に移動。カット5はインナーのHUMAN MADE Teeに変更（着る順番の自然さ）
- カット7: 「チョーカー/リング」→ Vivienneネックレス + ビーズブレスレットに具体化（キャラバイブル準拠）
- カット9: 「原宿/下北」→ 下北沢に限定（RINKAの生活圏。部屋から出てすぐの設定）
- 全体の秒数配分を微調整してカット間の呼吸を確保

---

## Geminiプロンプト

### 共通ブロック

**キャラ固定（全カット冒頭に挿入）**:
```
Young Japanese woman, 23 years old. Round face, large expressive eyes.
Pink-ash shoulder-length hair. Small star tattoo on right collarbone.
Fair skin, petite build, 165cm. Natural beauty, minimal base makeup.
```

**技術固定（全カット末尾に挿入）**:
```
9:16 vertical, 1024x1792. Photorealistic, not AI-looking.
iPhone camera aesthetic, slight film grain, warm tone.
```

---

### カット1: フック — 寝起き顔

```
Young Japanese woman, 23 years old. Round face, large expressive eyes.
Pink-ash shoulder-length hair, messy and tangled from sleep.
Small star tattoo on right collarbone. Fair skin, petite build, 165cm.
No makeup, bare face.

Close-up selfie shot from slightly above. She just woke up, lying in
a messy single bed with wrinkled white sheets. Sleepy, half-closed eyes,
slightly annoyed expression. One hand loosely holding phone.
Old Japanese wooden apartment room. Morning sunlight from window on left,
warm golden tone. Wall behind has band flyers and polaroid photos pinned.

Wearing an oversized vintage t-shirt as pajama. Hair falling across face.

9:16 vertical, 1024x1792. Photorealistic, not AI-looking.
iPhone selfie camera aesthetic, slight film grain, warm tone.
Shallow depth of field on face.
```

**語数**: ~120

---

### カット2: 髪セット

```
Young Japanese woman, 23 years old. Round face, large expressive eyes.
Pink-ash shoulder-length hair being styled with fingers.
Small star tattoo on right collarbone. Fair skin, petite build, 165cm.
Light natural makeup applied.

Sitting at a low wooden table covered with cosmetics and skincare bottles.
Looking into a small mirror propped on the table. Both hands in hair,
tousling and arranging pink-ash strands. Slightly more awake expression,
still relaxed. Seen through a full-length mirror with wooden frame
leaning against the wall.

Old Japanese apartment room. Morning sun from left window casting warm
directional light. Hanging rack full of clothes visible in background.
Magazines stacked on floor. Records leaning against wall.

Wearing the same oversized vintage t-shirt.

9:16 vertical, 1024x1792. Photorealistic, not AI-looking.
iPhone camera aesthetic, slight film grain, warm tone.
Mid-shot framing from waist up.
```

**語数**: ~140

---

### カット3: Dr. Martens 1460

```
Young Japanese woman's hands picking up black Dr. Martens 1460 boots
from the floor. The boots have pink replacement laces threaded through
all eyelets. One hand grips the pull tab, the other holds the sole.

Close-up shot of hands and boots only. Floor is old wooden planks.
A pair of other shoes visible nearby. Morning sunlight from left
casting warm directional light with soft shadows.

9:16 vertical, 1024x1792. Photorealistic, not AI-looking.
iPhone camera aesthetic, slight film grain, warm tone.
Sharp focus on the pink laces and leather texture.
```

**語数**: ~90

---

### カット4: Dickies 874

```
Young Japanese woman, 23 years old. Round face, large expressive eyes.
Pink-ash shoulder-length hair, loosely styled.
Fair skin, petite build, 165cm.

Standing in front of a full-length mirror with wooden frame in old
Japanese apartment. Pulling up beige Dickies 874 work pants, wearing
them low on hips. Cuffs rolled up twice showing ankles. White HUMAN MADE
graphic t-shirt tucked loosely into the pants.

Shot framed from waist down in mirror reflection. Morning sun from left
window. Warm directional light. Room background: clothes rack, magazines.

9:16 vertical, 1024x1792. Photorealistic, not AI-looking.
iPhone camera aesthetic, slight film grain, warm tone.
```

**語数**: ~110

---

### カット5: HUMAN MADE Tee

```
Young Japanese woman's hands holding up a white graphic t-shirt against
her chest. The t-shirt has a large heart logo print on the front
(HUMAN MADE style). She is displaying it to the camera with both hands
spread wide, showing the full graphic.

Close-up of hands and t-shirt. Background is a hanging clothes rack
packed with various garments in an old Japanese apartment. Morning
sunlight from left creates warm directional shadows on the fabric.

9:16 vertical, 1024x1792. Photorealistic, not AI-looking.
iPhone camera aesthetic, slight film grain, warm tone.
Sharp focus on the t-shirt graphic and cotton fabric texture.
```

**語数**: ~100

---

### カット6: sacai MA-1 着用

```
Young Japanese woman, 23 years old. Round face, large expressive eyes.
Pink-ash shoulder-length hair, loosely styled.
Small star tattoo on right collarbone. Fair skin, petite build, 165cm.

Standing in front of full-length mirror with wooden frame. Putting on
a navy and grey sacai hybrid MA-1 bomber jacket over a white graphic
t-shirt. The jacket has visible mixed-material paneling where bomber
nylon meets wool knit. Beige Dickies 874 pants worn low, cuffs rolled.

Mirror reflection shot, upper body framing. She is adjusting the jacket
collar with one hand, looking at herself. Slight satisfied expression.

Old Japanese apartment. Morning sun from left. Warm tone.

9:16 vertical, 1024x1792. Photorealistic, not AI-looking.
iPhone camera aesthetic, slight film grain, warm tone.
```

**語数**: ~130

---

### カット7: アクセサリー

```
Young Japanese woman, 23 years old. Close-up of neck and collarbone area.
Pink-ash hair falling to shoulders. Small star tattoo visible on right
collarbone. Fingers clasping a gold Vivienne Westwood orb pendant
necklace behind her neck.

Cut to: left wrist wearing a colorful handmade beaded bracelet with
mixed pastel and bright colored beads. The sacai jacket sleeve is
pushed up slightly to show the bracelet.

Tight close-up framing. Soft warm morning light from left. Background
is softly blurred apartment interior.

9:16 vertical, 1024x1792. Photorealistic, not AI-looking.
iPhone camera aesthetic, slight film grain, warm tone.
Shallow depth of field, focus on jewelry details.
```

**語数**: ~110

---

### カット8: 全身コーデ完成

```
Young Japanese woman, 23 years old. Round face, large expressive eyes.
Pink-ash shoulder-length hair, styled loosely.
Small star tattoo on right collarbone. Fair skin, petite build, 165cm.

Full body shot reflected in a full-length mirror with wooden frame.
She is mid-turn, body angled 3/4 to the mirror, looking back over
her shoulder at her reflection with a cool, slightly pleased expression.

Complete outfit: navy x grey sacai hybrid MA-1 bomber jacket, white
HUMAN MADE graphic t-shirt underneath, beige Dickies 874 work pants
worn low with rolled cuffs, black Dr. Martens 1460 boots with pink
laces. Gold Vivienne Westwood orb necklace. Colorful beaded bracelet
on left wrist.

Old Japanese apartment room. Morning sun from left. Full room visible:
clothes rack, records, magazines, band flyers on wall.

9:16 vertical, 1024x1792. Photorealistic, not AI-looking.
iPhone camera aesthetic, slight film grain, warm tone.
```

**語数**: ~160

---

### カット9: 下北沢ストリートウォーク

```
Young Japanese woman, 23 years old. Pink-ash shoulder-length hair.
Petite build, 165cm. Walking naturally down a narrow Shimokitazawa
shopping street. Shot from behind at waist height, following her.

She walks with relaxed confident stride, hands in jacket pockets.
Navy x grey sacai MA-1 jacket, beige Dickies 874 rolled cuffs,
black Dr. Martens 1460 with pink laces.

Shimokitazawa backstreet: small vintage shops, hand-painted signs,
potted plants on sidewalk, old buildings, narrow alley. Late morning
natural daylight, slightly overcast, soft shadows. A few people in
background, out of focus.

9:16 vertical, 1024x1792. Photorealistic, not AI-looking.
Natural street photography aesthetic, slight film grain, warm tone.
```

**語数**: ~120

---

### カット10: 振り返りショット

```
Young Japanese woman, 23 years old. Round face, large expressive eyes.
Pink-ash shoulder-length hair catching the light.
Small star tattoo on right collarbone. Fair skin, petite build, 165cm.

She has turned around on a Shimokitazawa backstreet, facing the camera.
Relaxed smile, eyes slightly narrowed, one hand doing a casual peace
sign near her face. Hair slightly blown by breeze.

Full outfit visible: navy x grey sacai MA-1, white HUMAN MADE tee
peeking out, beige Dickies 874 low and rolled, black Dr. Martens 1460
with pink laces, gold Vivienne Westwood necklace.

Shimokitazawa street background: vintage shop fronts, greenery, warm
daylight. Depth of field with blurred background.

9:16 vertical, 1024x1792. Photorealistic, not AI-looking.
Street snapshot aesthetic, slight film grain, warm tone.
Candid natural moment, not posed-looking.
```

**語数**: ~140

---

## テキストオーバーレイ計画

### フォント
- **日本語**: ゴシック体太字（Noto Sans JP Bold or ヒラギノ角ゴ W6相当）
- **英語ブランド名**: Helvetica Neue Bold
- **サイズ**: 最低36pt相当。フックテキストは48pt相当
- **カラー**: 白 (#FFFFFF) + 2px黒ストローク (#000000)
- **配置**: 中央上部（Safe Zone: 上端200px〜600px）。顔やキーアイテムに被せない

### テキスト一覧

| カット | 表示時間 | テキスト | フォント | 演出 |
|--------|---------|---------|---------|------|
| 1 | 0.5-2.5秒 | 「朝5時に寝たDJの支度」 | ゴシック太字 48pt 白+黒ストローク | フェードイン0.3秒。中央上部 |
| 3 | 5.2-6.8秒 | 「Dr. Martens 1460」 | Helvetica Bold 36pt 白+黒ストローク | フェードイン0.3秒。画面下部（靴の上方） |
| 4 | 7.2-8.8秒 | 「Dickies 874」 | Helvetica Bold 36pt 白+黒ストローク | フェードイン0.3秒。中央 |
| 5 | 9.2-10.8秒 | 「HUMAN MADE」 | Helvetica Bold 36pt 白+黒ストローク | フェードイン0.3秒。Teeの上方 |
| 6 | 11.2-13秒 | 「sacai」 | Helvetica Bold 36pt 白+黒ストローク | フェードイン0.3秒。中央上部 |
| 10 | 22.5-24.5秒 | 「@rinka_pink」 | ゴシック太字 40pt 白+黒ストローク | フェードイン0.3秒。中央下部 |

### トーン指針
- 過剰な感嘆符なし（「!」は使わない）
- ダルめ脱力系。「〜した」「〜見つけた」の過去形 or 体言止め
- ブランド名は英語表記のまま。日本語と混ぜない

---

## Kling 1.6 I2V変換メモ

各カットの静止画をKling 1.6に入力し、2-4秒の微動動画に変換する際の推奨モーション指示:

| カット | 推奨モーション | 強度 | 注意点 |
|--------|--------------|------|--------|
| 1 | 目を細めてゆっくり瞬き。軽く頭を動かす | 弱 | 顔の崩れを防ぐため動き最小限。寝起きの怠さ |
| 2 | 両手で髪をかき上げる動作。鏡を見る | 中 | 手の動きがメイン。顔は固定気味に |
| 3 | 靴を持ち上げる動き。紐が揺れる | 弱 | 手元のみ。靴の形状を崩さない |
| 4 | パンツの裾を軽くロールアップする動き | 弱 | 下半身のみ。布の動きを自然に |
| 5 | Teeを広げて見せる。布がふわりと揺れる | 弱 | 手元のみ。ロゴの歪みに注意 |
| 6 | ジャケットの襟を整える。肩を動かす | 中 | 上半身の自然な動き。鏡の反射を維持 |
| 7 | ネックレスを留めるクラスプ動作 | 弱 | 指先の繊細な動き。アクセの形状維持 |
| 8 | ゆっくり回転（3/4ターン）| 中〜強 | 全身が動く。服のシルエット変化を見せる |
| 9 | 歩行モーション。髪が揺れる | 中 | 後ろ姿の自然な歩き。背景のスクロール |
| 10 | 振り返って笑顔。ピースサイン | 中 | 表情の自然さが最重要。髪が揺れる |

### I2V共通設定
- **秒数**: カット1-7は2秒、カット8-10は3-4秒
- **モード**: Standard（高品質優先）
- **ネガティブプロンプト**: morphing, distortion, blurry face, extra fingers, unnatural body movement
- **カメラ**: 基本固定。カット9のみ軽いフォロー移動

---

## 後工程フロー

```
1. Gemini 3.1 Flash Image Preview → 全10カットの静止画生成
2. 顔一貫性チェック（全カットでRINKAに見えるか目視確認）
3. Kling 1.6 I2V → 各カット2-4秒の微動動画化
4. CapCut or Premiere → 10カットを連結、BGM同期、テキストオーバーレイ
5. 書き出し: 1080x1920 / 30fps / H.264 / ビットレート8Mbps以上
6. Instagram Reels + TikTok同時投稿
```

---

## 顔リファレンス

生成時に参照する既存画像:
- `public/agency-models/influencer-girl-01/beauty.png` — 顔の正面アップ
- `public/agency-models/influencer-girl-01/polaroid-front.png` — 全身のプロポーション参考

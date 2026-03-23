---
name: ar_generator
description: "商品画像から3Dモデル生成→AR(USDZ)変換→Blenderレンダリング→Web公開までの一気通貫パイプライン。起動: AR・3D・USDZ・3Dモデル・商品3D・AR生成・Blender"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - WebSearch
  - WebFetch
  - ToolSearch
---

# AR Generator Agent v2.0 — 3D/ARコンテンツ生成

> 2026-03-14 更新。実テスト結果（白ポルシェ911T × 4エンジン比較）に基づくパイプライン刷新。
> v1.0（Trellis 2単体）→ v2.0（マルチビュー推奨 + 3エンジン選択制 + Web公開パイプライン）

---

## パイプライン全体像

```
商品写真（1-4枚）
  ↓ 背景除去（fal.ai birefnet/v2）← 必須
  ↓ 3Dモデル生成（エンジン選択）
  ↓ GLBダウンロード
  ↓ Blenderインポート + PBRマテリアル調整
  ↓ レンダリング（静止画 / ターンテーブル）
  ↓ USDZ変換（iPhone AR用）
  ↓ Vercelデプロイ + model-viewer埋め込み
  ↓ 公開URL共有
```

---

## エンジン選択ガイド（実テスト済み）

### 推奨エンジン比較（2026-03時点）

| エンジン | 入力 | Verts | テクスチャ | 形状品質 | USDZ直出 | 費用 | 判定 |
|---------|------|-------|-----------|---------|---------|------|------|
| **Meshy 5 Multi** | 1-4枚 | 40K | 2048 ◎ | ◎ | ✅ | ~$0.75 | **推奨（本番）** |
| **Trellis Multi** | 1-N枚 | 13K | 2048 ○ | ○ | ❌ | ~$0.35 | コスト重視 |
| **Hunyuan3D Multi** | 前後左右 | 132K | なし | ◎◎ | ❌ | ~$0.48 | 形状最重視 |
| Trellis 2（単体） | 1枚 | 13K | 2048 △ | △ | ❌ | $0.35 | 非推奨（v1互換） |
| Hyper3D Rodin | 1-5枚 | 可変 | 可変 | ○ | ❌ | ~$0.15 | 安価だが暗い |
| TripoSR | 1枚 | 可変 | △ | △ | ❌ | $0.03 | 白/反射に弱い |

### 選定フローチャート

```
白 or 反射面あり？ → Meshy 5 Multi（白/反射面の処理が最も優秀）
高ディテール形状必須？ → Hunyuan3D Multi（132K verts）+ 別途テクスチャ
速度・コスト優先？ → Trellis Multi（$0.35、最速）
1枚しかない？ → Trellis 2 単体（非推奨だがOK）
```

---

## Phase 1: 入力画像の準備

### 推奨アングル（マルチビュー用: 3-4枚）

| アングル | 必須度 | 備考 |
|---------|--------|------|
| **正面** | 必須 | 顔/フロントが分かるもの |
| **右サイド** | 必須 | 横のプロファイル |
| **3/4リア** | 推奨 | 背面と側面の両方が写る |
| **背面** | あれば | 背面のディテール |

### 背景除去（必須 — 省略禁止）

3Dエンジンは背景をメッシュに取り込んでしまう。必ず事前に除去する。

```python
import json, urllib.request, base64

FAL_KEY = "..."  # discord-bot/.env の FAL_KEY

with open("product.jpg", "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode()

payload = json.dumps({
    "image_url": f"data:image/jpeg;base64,{img_b64}",
    "model": "General Use (Light)",
    "output_format": "png"
}).encode()

req = urllib.request.Request(
    "https://fal.run/fal-ai/birefnet/v2",
    data=payload,
    headers={
        "Authorization": f"Key {FAL_KEY}",
        "Content-Type": "application/json"
    }
)
resp = urllib.request.urlopen(req, timeout=60)
result = json.loads(resp.read().decode())
# result["image"]["url"] → 背景除去済み画像URL
```

**コスト**: ~$0.01/枚

### 前処理（オプション — 暗い写真のみ）

AI 3D生成は暗い入力→暗い出力バイアスがある。暗い写真のみ適用。

```python
from PIL import Image, ImageEnhance
img = Image.open('product.png')
img = ImageEnhance.Color(img).enhance(1.2)       # 彩度+20%
img = ImageEnhance.Brightness(img).enhance(1.15)  # 明度+15%
img.save('product_enhanced.png', 'PNG')
```

---

## Phase 2: 3Dモデル生成

### A. Meshy 5 Multi（推奨 — テクスチャ付き最高品質）

```python
import json, urllib.request, base64, time

FAL_KEY = "..."

def load_img(path):
    with open(path, "rb") as f:
        return f"data:image/png;base64,{base64.b64encode(f.read()).decode()}"

payload = json.dumps({
    "image_urls": [
        load_img("front.png"),
        load_img("side.png"),
        load_img("rear_34.png"),
        load_img("rear.png"),
    ],
    "ai_model": "meshy-5",
    "topology": "triangle",
    "target_polycount": 50000,
}).encode()

# Queue
req = urllib.request.Request(
    "https://queue.fal.run/fal-ai/meshy/v5/multi-image-to-3d",
    data=payload,
    headers={
        "Authorization": f"Key {FAL_KEY}",
        "Content-Type": "application/json"
    }
)
resp = urllib.request.urlopen(req, timeout=120)
result = json.loads(resp.read().decode())
request_id = result["request_id"]

# Poll (Meshyは3-4分かかる)
while True:
    status_req = urllib.request.Request(
        f"https://queue.fal.run/fal-ai/meshy/requests/{request_id}/status",
        headers={"Authorization": f"Key {FAL_KEY}"}
    )
    status = json.loads(urllib.request.urlopen(status_req).read().decode())
    if status["status"] == "COMPLETED":
        break
    if status["status"] == "FAILED":
        raise Exception("Meshy failed")
    time.sleep(5)

# Get result
result_req = urllib.request.Request(
    f"https://queue.fal.run/fal-ai/meshy/requests/{request_id}",
    headers={"Authorization": f"Key {FAL_KEY}"}
)
result = json.loads(urllib.request.urlopen(result_req).read().decode())

# 出力形式（全フォーマット自動出力）
# result["model_urls"]["glb"]["url"]  → GLB
# result["model_urls"]["usdz"]["url"] → USDZ（直出し！）
# result["model_urls"]["fbx"]["url"]  → FBX
# result["model_urls"]["obj"]["url"]  → OBJ
# result["thumbnail"]["url"]          → プレビュー画像
```

**出力**: GLB (40K verts, 2048テクスチャ) + **USDZ直出し** + FBX + OBJ + サムネイル

### B. Trellis Multi（コスト重視）

```python
payload = json.dumps({
    "image_urls": [load_img("front.png"), load_img("side.png"),
                   load_img("rear.png"), load_img("rear_34.png")],
    "ss_guidance_strength": 7.5,
    "ss_sampling_steps": 50,
    "slat_guidance_strength": 3.0,
    "slat_sampling_steps": 50,
    "mesh_simplify": 0.90,
    "texture_size": 2048
}).encode()

# Queue endpoint: https://queue.fal.run/fal-ai/trellis/multi
# Result: result["glb_url"] → GLB (13K verts, 2048 texture)
```

### C. Hunyuan3D Multi-View（形状最重視）

```python
payload = json.dumps({
    "front_image_url": load_img("front.png"),    # 正面
    "left_image_url": load_img("left.png"),      # 左サイド
    "back_image_url": load_img("back.png"),       # 背面
    "right_image_url": load_img("right.png"),     # 右サイド
    "generate_texture": True,
    "texture_size": 2048,
}).encode()

# Queue endpoint: https://queue.fal.run/fal-ai/hunyuan3d/v2/multi-view
# Result: result["model_mesh"]["url"] → GLB (132K verts)
# ⚠️ テクスチャが出力されない場合がある。Blenderで後付けが必要
```

---

## Phase 3: PBRマテリアル調整

### リージョンマッピング（Blender → PIL → Blender）

Blenderでメッシュの部位をUV座標にマッピングし、PILでPBRテクスチャマップを生成する。

**Step 1: Blenderでリージョン抽出**

```python
# build_regions.py (Blenderで実行)
import bpy, bmesh, json

obj = [o for o in bpy.context.scene.objects if o.type == 'MESH'][0]
bm = bmesh.new()
bm.from_mesh(obj.data)
bm.faces.ensure_lookup_table()
uv_layer = bm.loops.layers.uv.active

regions = {"tire": [], "chrome": [], "glass": [], "body": []}

for f in bm.faces:
    c = f.calc_center_median()
    n = f.normal
    uvs = [[loop[uv_layer].uv.x, loop[uv_layer].uv.y] for loop in f.loops]

    is_tire = c.z < -0.4 and abs(c.x) > 0.6
    is_chrome = (c.z < -0.2 and c.z > -0.5 and abs(c.y) > 0.7)
    is_glass = (c.z > 0.15 and c.z < 0.5 and abs(n.z) > 0.2 and abs(n.z) < 0.8)

    if is_tire: regions["tire"].append(uvs)
    elif is_chrome: regions["chrome"].append(uvs)
    elif is_glass: regions["glass"].append(uvs)
    else: regions["body"].append(uvs)

bm.free()
with open("/tmp/regions.json", "w") as f:
    json.dump(regions, f)
```

**Step 2: PILでPBRマップ生成（システムPythonで実行）**

```python
from PIL import Image, ImageDraw
import json

with open("/tmp/regions.json") as f:
    regions = json.load(f)

SIZE = 2048
region_pbr = {
    "body":   {"roughness": 0.25, "metallic": 0.02},
    "tire":   {"roughness": 0.90, "metallic": 0.0},
    "chrome": {"roughness": 0.08, "metallic": 0.95},
    "glass":  {"roughness": 0.05, "metallic": 0.0},
}

rough_img = Image.new("L", (SIZE, SIZE), 128)
metal_img = Image.new("L", (SIZE, SIZE), 0)

for region_name, faces in regions.items():
    pbr = region_pbr[region_name]
    for uvs in faces:
        if len(uvs) < 3: continue
        pixels = [(int(u*SIZE)%SIZE, int((1-v)*SIZE)%SIZE) for u,v in uvs]
        ImageDraw.Draw(rough_img).polygon(pixels, fill=int(pbr["roughness"]*255))
        ImageDraw.Draw(metal_img).polygon(pixels, fill=int(pbr["metallic"]*255))

rough_img.save("/tmp/roughness_map.png")
metal_img.save("/tmp/metallic_map.png")
```

**Step 3: BlenderでPBRマップ接続**

```python
# connect_pbr.py (Blenderで実行)
import bpy

mat = obj.material_slots[0].material
nodes = mat.node_tree.nodes
links = mat.node_tree.links
bsdf = [n for n in nodes if n.type == 'BSDF_PRINCIPLED'][0]

# Roughness map
rough_node = nodes.new('ShaderNodeTexImage')
rough_node.image = bpy.data.images.load("/tmp/roughness_map.png")
rough_node.image.colorspace_settings.name = 'Non-Color'
links.new(rough_node.outputs['Color'], bsdf.inputs['Roughness'])

# Metallic map
metal_node = nodes.new('ShaderNodeTexImage')
metal_node.image = bpy.data.images.load("/tmp/metallic_map.png")
metal_node.image.colorspace_settings.name = 'Non-Color'
links.new(metal_node.outputs['Color'], bsdf.inputs['Metallic'])

# USDZ互換: clearcoat無効
if 'Coat Weight' in bsdf.inputs:
    bsdf.inputs['Coat Weight'].default_value = 0.0
```

### 素材別PBR値リファレンス

| 素材 | Roughness | Metallic | 用途例 |
|------|-----------|----------|--------|
| 車ボディ塗装 | 0.20-0.30 | 0.0-0.05 | 乗用車 |
| タイヤゴム | 0.85-0.95 | 0.0 | ホイール |
| クロームメッキ | 0.05-0.10 | 0.90-1.0 | バンパー、トリム |
| ガラス | 0.03-0.08 | 0.0 | 窓ガラス |
| キャンバス生地 | 0.85-0.92 | 0.0 | スニーカー |
| レザー | 0.50-0.65 | 0.0 | バッグ、靴 |
| ゴムソール | 0.35-0.50 | 0.0 | スニーカー底 |
| 金属アイレット | 0.25-0.35 | 0.9-1.0 | 靴の金具 |
| プラスチック | 0.40-0.60 | 0.0 | 家電 |
| 木材 | 0.70-0.85 | 0.0 | 家具 |

---

## Phase 4: レンダリング

### 静止画（Blender EEVEE — 高速）

```python
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'  # Blender 3.x
# scene.render.engine = 'BLENDER_EEVEE_NEXT'  # Blender 4.x
scene.render.resolution_x = 1200
scene.render.resolution_y = 800
scene.render.film_transparent = True
```

### ターンテーブル（360°回転・12フレームバッチ）

```python
import math

radius = 12
height = 6
total_frames = 36  # 10度刻み

for frame in range(total_frames):
    angle = (frame / total_frames) * 360
    rad = math.radians(angle)
    cam.location = (radius * math.cos(rad), radius * math.sin(rad), height)
    direction = obj.location - cam.location
    rot = direction.to_track_quat('-Z', 'Y')
    cam.rotation_euler = rot.to_euler()
    scene.render.filepath = f"/tmp/frames/frame_{frame:03d}.png"
    bpy.ops.render.render(write_still=True)
```

**注意**: Blenderは長時間実行でタイムアウトする。**12フレームずつバッチ分割**すること。

### PNG連番 → MP4/GIF

```bash
ffmpeg -framerate 12 -i frame_%03d.png -c:v libx264 -pix_fmt yuv420p -crf 18 output.mp4
ffmpeg -framerate 12 -i frame_%03d.png -vf "scale=480:480,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" output.gif
```

---

## Phase 5: USDZ変換 & エクスポート

### A. Meshy直出しUSDZ（最も簡単）

Meshy 5 Multiを使った場合、`result["model_urls"]["usdz"]["url"]` から直接USDZがダウンロードできる。追加変換不要。

### B. Blender経由USDZ（GLBからの変換）

```python
import bpy, os

# USDC + テクスチャをエクスポート
export_dir = "/tmp/usd_export"
os.makedirs(export_dir, exist_ok=True)
bpy.ops.wm.usd_export(
    filepath=os.path.join(export_dir, "model.usdc"),
    selected_objects_only=False,
    generate_preview_surface=True,
    export_materials=True,
)
```

```bash
# usdzip でUSDZパッケージ化（macOS標準コマンド）
cd /tmp/usd_export
usdzip -r /tmp/output.usdz model.usdc textures/
```

---

## Phase 6: Web公開 & AR配信

### Vercelデプロイ

```bash
# tomorrowproof-hp リポジトリに配置
cp output.usdz /path/to/tomorrowproof-hp/public/ar/product-name.usdz
cp output.glb /path/to/tomorrowproof-hp/public/ar/product-name.glb

cd /path/to/tomorrowproof-hp
git add public/ar/
git commit -m "feat: add 3D AR model for [product-name]"
git push origin main
# Vercel自動デプロイ → https://tomorrowproof-ai.com/ar/product-name.usdz
```

### vercel.json（設定済み）

```json
{
  "headers": [
    {
      "source": "/ar/(.*)\\.usdz",
      "headers": [
        { "key": "Content-Type", "value": "model/vnd.usdz+zip" },
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    },
    {
      "source": "/ar/(.*)\\.glb",
      "headers": [
        { "key": "Content-Type", "value": "model/gltf-binary" },
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

### model-viewer Web埋め込み（Nike By You風）

```html
<!-- Google model-viewer: iOS + Android + Web 全対応 -->
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>

<model-viewer
  src="/ar/product-name.glb"
  ios-src="/ar/product-name.usdz"
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  auto-rotate
  shadow-intensity="1"
  alt="Product 3D View"
  style="width: 100%; height: 500px;">

  <button slot="ar-button" style="...">ARで見る</button>
</model-viewer>
```

| プラットフォーム | フォーマット | AR機能 |
|----------------|-----------|--------|
| **iOS Safari** | USDZ → AR Quick Look | ピンチ拡大、床設置 |
| **Android Chrome** | GLB → Scene Viewer | ARCore対応端末のみ |
| **デスクトップ** | GLB → 3Dビューアー | 回転・ズーム |

---

## AR Quick Look 制約（iPhone）

| 制約 | 推奨値 | 限界値 | 備考 |
|------|--------|--------|------|
| **ファイルサイズ** | 2-4 MB | ~200MB（メモリ） | 4G回線考慮 |
| **ポリゴン数** | 40-80K | 100-200K | 古い端末は100Kで遅延 |
| **テクスチャ解像度** | 2048x2048 | 4096x4096 | 4Kはメモリ圧迫 |
| **PBR: Base Color** | ✅ 対応 | JPG推奨 | — |
| **PBR: Roughness** | ✅ 対応 | JPG推奨 | — |
| **PBR: Metallic** | ✅ 対応 | JPG推奨 | — |
| **PBR: Normal** | ✅ 対応 | **PNG必須** | JPG圧縮アーティファクト |
| **PBR: Clearcoat** | ❌ 非対応 | — | USDZ未サポート |
| **PBR: Emission** | ❓ 不安定 | — | 端末依存 |
| **アニメーション** | ✅ 対応 | 10秒以上でスクラバー表示 | — |

---

## コスト一覧

| 工程 | 単価 | 備考 |
|------|------|------|
| 背景除去（birefnet） | ~$0.01/枚 | 4枚 = $0.04 |
| Meshy 5 Multi（推奨） | ~$0.75/商品 | GLB+USDZ+FBX+OBJ+サムネ |
| Trellis Multi | ~$0.35/商品 | GLBのみ |
| Hunyuan3D Multi | ~$0.48/商品 | GLBのみ（テクスチャなし） |
| Blenderレンダリング | 無料 | ローカルCPU |
| USDZ変換（usdzip） | 無料 | macOS標準 |
| Vercelデプロイ | 無料 | 帯域制限内 |
| **合計（推奨パイプライン）** | **~$0.80/商品** | **~¥120/商品** |

---

## 実テスト結果ログ（2026-03-14）

### テスト対象: 白 1972 Porsche 911T（BaTオークション写真53枚）

| 手法 | 結果 | 所要時間 |
|------|------|---------|
| **Trellis 2 単体** (1枚) | 側面ジオメトリ破綻、塗装剥げ風 | 30秒 |
| **Trellis 2 + 高解像度** (1920px) | 微改善だが根本変わらず | 1分 |
| **Trellis 2 + BG除去** | 背景混入は解消、品質は同等 | 2分 |
| **COLMAP フォトグラメトリ** (51枚) | **失敗** — 白ボディのSIFT特徴不足 | 5分 |
| **Trellis Multi** (4枚) | テクスチャ改善、13K verts | 30秒 |
| **Hunyuan3D Multi** (4枚) | 形状最高（132K verts）、テクスチャなし | 5分 |
| **Meshy 5 Multi** (4枚) | **最高品質** — 40K verts、テクスチャ◎、USDZ直出 | 3.5分 |

### 学んだ教訓

1. **単一画像→3Dは限界がある** — 見えない面をAIが"推測"するため、特に白/テクスチャレスな面で破綻する
2. **背景除去は必須** — 木や地面がメッシュに混入する
3. **COLMAP（従来型フォトグラメトリ）は白い物体に弱い** — SIFT特徴が取れない
4. **マルチビュー3D生成が現時点の最適解** — 3-4枚の異なるアングル写真で大幅改善
5. **Meshyが最もバランスが良い** — テクスチャ品質、ポリゴン数、USDZ直出し、白面対応すべて◎
6. **USDZ変換はusdzip（macOS標準）が最も安定** — Blender標準エクスポートはテクスチャ問題あり

---

## 既知の制限・注意点

1. **Blenderバージョン差異**: `BLENDER_EEVEE_NEXT` はBlender 4.x、`BLENDER_EEVEE` は3.x
2. **Blender長時間タイムアウト**: レンダリングは12フレームずつバッチ分割
3. **fal.aiストレージアップロード**: `/api/storage/upload/initiate` は404。base64 data URIを直接使う
4. **Hunyuan3Dテクスチャ**: `generate_texture: true` でもテクスチャが出力されないことがある
5. **Clearcoat非対応**: USDZはclearcoatをサポートしない。Blenderで `Coat Weight = 0.0` に設定
6. **Glass BSDF問題**: BlenderのGlass BSDFはUSDZ変換でクローム/鏡面になる。テクスチャベースで対処
7. **ローカルHTTPサーバー非共有**: `python3 -m http.server` はローカルネットワーク外からアクセス不可。Vercelデプロイ必須

---

## 成果物一覧（1商品あたり）

| ファイル | 用途 | サイズ目安 |
|---------|------|----------|
| `{product}.glb` | 3Dモデル本体（Web表示用） | 3-5MB |
| `{product}.usdz` | iPhone AR Quick Look | 3-5MB |
| `{product}_render.png` | 静止画（透過） | 500KB-1MB |
| `{product}_turntable.mp4` | 360°回転動画 | 500KB-1MB |
| `{product}_turntable.gif` | 360°回転GIF | 1-2MB |
| `frames/frame_*.png` | FOOH合成用PNG連番 | 36枚 |

---

## EC商品ページ3D化のROI（Shopify実績）

| 指標 | 3Dモデル導入効果 |
|------|----------------|
| セッション時間 | **+47%** |
| コンバージョン率 | **+94%** |
| 返品率 | **-25%** |
| モバイルエンゲージメント | **+60%** |

---

## FOOH合成（次フェーズ）

3Dモデル + 実写映像 → 現実世界にAR風合成:

| コンテンツ | 手法 | 難易度 |
|-----------|------|--------|
| 固定カメラに商品配置 | 透過PNG重ね | 簡単 |
| 手のひらAR風デモ | 回転アニメ + 合成 | 中 |
| 街中に巨大商品出現 | Blenderカメラトラッキング | 高 |
| 商品が分解→再構築 | パーティクル + 物理シミュ | 高 |

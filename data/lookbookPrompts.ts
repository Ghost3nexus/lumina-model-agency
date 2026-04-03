/**
 * lookbookPrompts.ts — Lookbook Editorial Prompt Templates
 *
 * RRL SP/SU26カタログ再現テストから抽出したベストプラクティス。
 * 13シーン生成の成功/失敗パターンを分析し、再現性の高いテンプレートに昇華。
 *
 * 使い方:
 *   buildLookbookPrompt({ scene, model, outfit, mood }) → 完成プロンプト
 */

// ─── 型定義 ──────────────────────────────────────────────────────────────────

export interface LookbookModel {
  /** 性別 */
  gender: 'male' | 'female';
  /** 年齢帯 "mid-20s" */
  age: string;
  /** 人種/民族 "East Asian" | "Black" | "Caucasian" etc */
  ethnicity: string;
  /** 髪の記述 "long wavy dark hair past shoulders" */
  hair: string;
  /** 体型 "lean athletic build" */
  build: string;
  /** 特徴的なディテール "thin mustache, freckles" */
  features?: string;
}

export interface LookbookOutfit {
  /** メインアイテム "distressed brown leather A-2 bomber jacket" */
  main: string;
  /** レイヤリング（下に着てるもの） "plain white crew-neck t-shirt" */
  layer?: string;
  /** ボトムス "faded khaki military cargo pants" */
  bottoms: string;
  /** 靴 "worn brown leather engineer boots" */
  shoes: string;
  /** アクセサリー配列（最大3つ — それ以上は破綻リスク） */
  accessories?: string[];
}

export interface LookbookScene {
  /** シーンタイプ */
  type: SceneType;
  /** ロケーション記述 "next to a vintage WWII-era yellow Navy training aircraft on a sun-drenched tarmac" */
  location: string;
  /** 時間帯/光 "late afternoon golden hour" */
  timeOfDay: string;
  /** 環境プロップ（あれば）"old wooden surfboards, American flag, vintage boat" */
  props?: string;
}

export type SceneType =
  | 'environmental-portrait'   // 環境ポートレート（ロケ+全身）— 最高打率
  | 'studio-dark'              // スタジオ暗背景 — ガーメントディテール向き
  | 'diptych-close-wide'       // クローズ+ワイドのペア想定
  | 'vehicle-interior'         // 車/飛行機内部
  | 'wide-landscape'           // ワイド風景+人物小さめ
  | 'interior-intimate';       // 室内（トレーラー、シャック等）

export type FilmStock =
  | 'portra-400'     // 万能。暖色系、リッチなスキントーン、やや脱色
  | 'portra-160'     // より繊細。ゴールデンアワー向き
  | 'fuji-pro-400h'  // クール寄り。ミリタリー/インダストリアル向き
  | 'tri-x-400'      // B&W。ハイコントラスト、ドキュメンタリー
  | 'hp5-plus';      // B&W。ミッドコントラスト、粒子粗め

export type Mood =
  | 'americana'       // RRLの核心。ノスタルジック、自由、ワイドオープン
  | 'military-grit'   // ミリタリー×ファッション。美と緊張の共存
  | 'surf-culture'    // カリフォルニア、太陽、退色、リラックス
  | 'dark-studio'     // ペインタリー、オランダ絵画的、ガーメント主役
  | 'road-trip'       // 車、道、移動、カップル
  | 'workwear-craft'; // 職人、ガレージ、道具、手仕事

// ─── フィルムストック記述（テスト済みベストプラクティス） ────────────────────

export const FILM_STOCK_DESC: Record<FilmStock, string> = {
  'portra-400':
    'Shot on Kodak Portra 400 35mm film. Warm, slightly desaturated color palette ' +
    'with rich skin tones. Organic film grain visible in midtones. ' +
    'Lifted black point — shadows are never pure black, always slightly warm brown.',

  'portra-160':
    'Shot on Kodak Portra 160 medium format film. Fine grain, exceptional detail. ' +
    'Slightly cooler than Portra 400 but still warm. Creamy highlights with ' +
    'beautiful highlight rolloff. Best in golden hour or bright daylight.',

  'fuji-pro-400h':
    'Shot on Fuji Pro 400H medium format film. Slightly cooler, more neutral palette ' +
    'with subtle green-cyan shift in shadows. Clean, modern feel while retaining ' +
    'film character. Excellent for overcast or industrial settings.',

  'tri-x-400':
    'Black and white, shot on Kodak Tri-X 400. High contrast with deep blacks ' +
    'and bright whites. Gritty, documentary feel. Strong directional light ' +
    'creates dramatic shadow play. Classic photojournalism aesthetic.',

  'hp5-plus':
    'Black and white, shot on Ilford HP5 Plus 400. Rich tonal range with ' +
    'detailed midtones. Slightly softer contrast than Tri-X. Visible grain ' +
    'structure, especially in shadow areas. Atmospheric and moody.',
};

// ─── ライティング記述（シーンタイプ別ベスト） ────────────────────────────────

export const LIGHTING_DESC: Record<SceneType, string> = {
  'environmental-portrait':
    'Natural light — strong directional sunlight creating visible shadows on the ground ' +
    'and across the model. Slight lens flare acceptable. The environment is lit naturally, ' +
    'not artificially. Shadows have warm color, not gray.',

  'studio-dark':
    'Single large softbox from camera-right creating rich directional light with ' +
    'visible shadow falloff to the left side. Painterly quality reminiscent of ' +
    'Rembrandt lighting. Deep black background with no visible texture.',

  'diptych-close-wide':
    'Consistent natural light across both compositions. Close-up uses ' +
    'shallow depth of field with the environment as soft bokeh. Wide shot ' +
    'has the model integrated into the full environment.',

  'vehicle-interior':
    'Mixed light: warm ambient interior light combined with natural daylight ' +
    'entering through windows/doors. Creates a cozy, intimate atmosphere. ' +
    'Highlights on chrome/metal surfaces add visual interest.',

  'wide-landscape':
    'Vast natural light — the sky and landscape provide the lighting. ' +
    'Model is a smaller element in a large composition. Strong shadows from ' +
    'direct sunlight on the ground. Cinematic, wide-angle perspective.',

  'interior-intimate':
    'Warm tungsten-mixed interior light. Golden, amber tones throughout. ' +
    'Light comes from windows or doorways, creating depth. Soft, enveloping ' +
    'atmosphere. The cramped space creates an intimate, personal mood.',
};

// ─── ポーズ記述（テスト済み: 具体的な体の配置が重要） ────────────────────────

export const POSE_LIBRARY: Record<string, string> = {
  // 男性
  'male-lean':
    'leaning against [PROP] with one shoulder, arms loosely crossed or one hand in pocket. ' +
    'Weight shifted to one leg. Expression is pensive, looking slightly off camera.',

  'male-seated':
    'sitting with one leg up, arm resting on knee. The other hand grips the edge of the seat. ' +
    'Slightly hunched forward — engaged, not posed. Direct gaze at camera.',

  'male-standing-wide':
    'standing with feet shoulder-width apart, hands on hips or thumbs in belt loops. ' +
    'Chest open, chin slightly down. Commanding presence without aggression.',

  'male-walking':
    'mid-stride, captured in motion. Arms natural at sides, one slightly forward. ' +
    'Hair and clothing show movement. Looking ahead, not at camera.',

  // 女性
  'female-reach':
    'one arm reaching up to touch [PROP] above, creating a diagonal line with her body. ' +
    'The other hand on hip or holding an accessory. Elongated posture, neck visible.',

  'female-seated-casual':
    'sitting with one knee drawn up, the other leg relaxed. Looking slightly past camera ' +
    'with a distant, thoughtful expression. Hands relaxed in lap or on knee.',

  'female-power-stand':
    'standing tall, one hand on hip, the other holding a bag or jacket over shoulder. ' +
    'Weight on one leg with the other slightly forward. Direct, confident gaze.',

  'female-walking-wind':
    'mid-stride on open ground, hair slightly windblown. Arms in natural walking position. ' +
    'Clothing moves with the body. Looking toward the horizon.',

  // 複数人
  'couple-vehicle':
    'both models in a vehicle — one driving, one passenger. Bodies angled toward each other ' +
    'but eyes in different directions. Relaxed, not performing. A candid stolen moment.',
};

// ─── コア: プロンプトビルダー ─────────────────────────────────────────────────

export interface LookbookPromptConfig {
  scene: LookbookScene;
  model: LookbookModel;
  outfit: LookbookOutfit;
  mood: Mood;
  filmStock: FilmStock;
  /** ポーズキー（POSE_LIBRARYから） */
  pose: string;
  /** 構図指示 "full body, model at right third" */
  composition?: string;
  /** B&Wにするか */
  blackAndWhite?: boolean;
}

/**
 * ルックブック用プロンプトを構築する。
 *
 * テスト結果から判明したルール:
 * 1. プロンプトは400語以内が最適（1200語は品質低下）
 * 2. 各セクションは明確に分離する
 * 3. アクセサリーは3つまで（それ以上は破綻）
 * 4. 「〜してはいけない」より「〜であること」の肯定指示が有効
 * 5. フィルムストック名を明示するとGeminiの理解が劇的に向上
 * 6. リファレンス画像との組み合わせで最大効果
 */
export function buildLookbookPrompt(config: LookbookPromptConfig): string {
  const {
    scene,
    model,
    outfit,
    mood: _mood,
    filmStock,
    pose,
    composition,
    blackAndWhite = false,
  } = config;

  // ポーズテキスト取得（[PROP]をロケーションのキーワードで置換）
  const poseText = (POSE_LIBRARY[pose] || pose)
    .replace('[PROP]', scene.props?.split(',')[0]?.trim() || 'the surface');

  // アクセサリー（最大3つに制限）
  const accText = outfit.accessories?.slice(0, 3).join(', ') || '';

  // 組み立て
  const sections = [
    `Generate a fashion editorial photograph.`,

    // SCENE
    `SCENE: ${model.gender === 'male' ? 'A male' : 'A female'} model ` +
    `(${model.ethnicity}, ${model.age}, ${model.hair}, ${model.build}` +
    `${model.features ? ', ' + model.features : ''}) ` +
    `${scene.location}. ` +
    `${scene.props ? `Environment details: ${scene.props}.` : ''}`,

    // OUTFIT
    `OUTFIT: ${outfit.main}` +
    `${outfit.layer ? ' over ' + outfit.layer : ''}, ` +
    `${outfit.bottoms}, ${outfit.shoes}.` +
    `${accText ? ` Accessories: ${accText}.` : ''}`,

    // POSE
    `POSE: ${poseText}`,

    // PHOTOGRAPHY
    `PHOTOGRAPHY: ${blackAndWhite ? 'BLACK AND WHITE. ' : ''}` +
    `${FILM_STOCK_DESC[filmStock]} ` +
    `${LIGHTING_DESC[scene.type]} ` +
    `${composition ? `Composition: ${composition}.` : ''}`,

    // CRITICAL — 短く、肯定形で
    `CRITICAL: This must look like a real photograph from a high-end fashion catalog. ` +
    `Natural skin texture with pores and imperfections. ` +
    `Clothing shows authentic wear, natural draping, and real fabric texture. ` +
    `The model exists naturally in this environment — not composited.`,
  ];

  return sections.join('\n\n');
}

// ─── プリセット: テスト済みシーン定義 ────────────────────────────────────────

export const LOOKBOOK_PRESETS: Record<string, Omit<LookbookPromptConfig, 'model' | 'outfit'>> = {

  'americana-airfield': {
    scene: {
      type: 'environmental-portrait',
      location: 'standing next to a vintage WWII-era military aircraft on a sun-drenched tarmac',
      timeOfDay: 'late afternoon golden hour',
      props: 'vintage military aircraft, tarmac, hangar in distance',
    },
    mood: 'americana',
    filmStock: 'portra-400',
    pose: 'male-lean',
    composition: 'full body, model slightly off-center, aircraft filling opposite side of frame',
  },

  'americana-mustang': {
    scene: {
      type: 'environmental-portrait',
      location: 'leaning against a classic cherry-red 1967 Ford Mustang fastback parked in front of a weathered wooden barn',
      timeOfDay: 'late afternoon golden hour',
      props: 'cherry-red Mustang, weathered barn, gravel ground',
    },
    mood: 'road-trip',
    filmStock: 'portra-400',
    pose: 'male-lean',
    composition: 'three-quarter body, model on left third, Mustang stretching into right of frame',
  },

  'americana-convertible': {
    scene: {
      type: 'vehicle-interior',
      location: 'sitting in a vintage 1960s convertible car with tan leather interior',
      timeOfDay: 'warm afternoon',
      props: 'vintage convertible, leather seats, open road visible',
    },
    mood: 'road-trip',
    filmStock: 'fuji-pro-400h',
    pose: 'couple-vehicle',
    composition: 'slightly elevated angle looking down into the car, both models filling frame',
  },

  'studio-dark-portrait': {
    scene: {
      type: 'studio-dark',
      location: 'standing against a deep black studio background',
      timeOfDay: 'studio',
    },
    mood: 'dark-studio',
    filmStock: 'portra-160',
    pose: 'male-standing-wide',
    composition: 'medium shot from waist up, centered, negative space above',
  },

  'military-hangar': {
    scene: {
      type: 'environmental-portrait',
      location: 'standing under the wing of a vintage propeller aircraft inside a military hangar',
      timeOfDay: 'midday, mixed hangar light',
      props: 'propeller aircraft, hangar interior, concrete floor',
    },
    mood: 'military-grit',
    filmStock: 'fuji-pro-400h',
    pose: 'female-reach',
    composition: 'full body, model framed by aircraft wing and landing gear',
  },

  'military-boneyard-bw': {
    scene: {
      type: 'wide-landscape',
      location: 'at a decommissioned military aircraft boneyard in the desert',
      timeOfDay: 'harsh midday sun',
      props: 'retired aircraft, desert landscape, dust',
    },
    mood: 'military-grit',
    filmStock: 'tri-x-400',
    pose: 'female-seated-casual',
    blackAndWhite: true,
    composition: 'model small in frame, aircraft and desert landscape dominating',
  },

  'surf-shack': {
    scene: {
      type: 'interior-intimate',
      location: 'standing in a weathered surf shack with wooden surfboards and vintage equipment',
      timeOfDay: 'afternoon, mixed light from doorway',
      props: 'wooden surfboards, vintage boat, American flag, metal shelving',
    },
    mood: 'surf-culture',
    filmStock: 'portra-400',
    pose: 'male-lean',
    composition: 'environmental portrait, model at right third, shack filling left two-thirds',
  },

  'trailer-interior': {
    scene: {
      type: 'interior-intimate',
      location: 'sitting inside a 1960s Airstream trailer with warm wood paneling',
      timeOfDay: 'afternoon, warm interior light',
      props: 'leather suitcase, surfboard in corner, dried flowers, framed artwork, wood paneling',
    },
    mood: 'surf-culture',
    filmStock: 'portra-400',
    pose: 'female-seated-casual',
    composition: 'intimate interior, model fills center, warm environment wrapping around',
  },

  'golden-field': {
    scene: {
      type: 'wide-landscape',
      location: 'in a vast golden wheat field at sunset with a vintage motorcycle',
      timeOfDay: 'golden hour, backlit',
      props: 'vintage motorcycle, wheat field, distant hills',
    },
    mood: 'americana',
    filmStock: 'portra-160',
    pose: 'female-power-stand',
    composition: 'cinematic wide, model centered, golden bokeh from wheat field',
  },

  'airfield-runway-bw': {
    scene: {
      type: 'wide-landscape',
      location: 'walking on a sun-bleached concrete runway at a decommissioned military airfield',
      timeOfDay: 'harsh midday sun',
      props: 'retired aircraft in distance, cracked concrete, heat haze',
    },
    mood: 'military-grit',
    filmStock: 'tri-x-400',
    pose: 'female-walking-wind',
    blackAndWhite: true,
    composition: 'wide angle, vast empty runway, model as powerful figure mid-stride',
  },

  'cargo-plane-interior': {
    scene: {
      type: 'vehicle-interior',
      location: 'standing inside the cargo hold of a vintage military transport aircraft',
      timeOfDay: 'low interior light with window shafts',
      props: 'curved metal fuselage with rivets, canvas cargo bags, military benches',
    },
    mood: 'military-grit',
    filmStock: 'portra-400',
    pose: 'female-power-stand',
    composition: 'wide-angle, leading lines of fuselage draw eye to model at center',
  },

  'jeep-garage': {
    scene: {
      type: 'vehicle-interior',
      location: 'sitting in the driver seat of a vintage 1940s military Willys Jeep inside a rustic workshop',
      timeOfDay: 'afternoon, mixed garage light',
      props: 'canvas-top Jeep, wooden garage, tools on shelves, American flag',
    },
    mood: 'workwear-craft',
    filmStock: 'portra-400',
    pose: 'male-seated',
    composition: 'model framed by Jeep structure, warm garage environment visible beyond',
  },
};

// ─── ヘルパー: プリセットからフルプロンプトを生成 ─────────────────────────────

/**
 * プリセット名 + モデル + 衣装 → 完成プロンプト
 *
 * @example
 * const prompt = fromPreset('americana-airfield', myModel, myOutfit);
 */
export function fromPreset(
  presetName: string,
  model: LookbookModel,
  outfit: LookbookOutfit,
): string {
  const preset = LOOKBOOK_PRESETS[presetName];
  if (!preset) throw new Error(`Unknown preset: ${presetName}`);
  return buildLookbookPrompt({ ...preset, model, outfit });
}

// ─── 使用例 ──────────────────────────────────────────────────────────────────
/*
import { fromPreset, type LookbookModel, type LookbookOutfit } from './lookbookPrompts';

const model: LookbookModel = {
  gender: 'male',
  age: 'mid-20s',
  ethnicity: 'Caucasian',
  hair: 'long wavy dark hair past shoulders',
  build: 'lean athletic build',
  features: 'thin mustache, slight stubble',
};

const outfit: LookbookOutfit = {
  main: 'distressed brown leather A-2 bomber jacket',
  layer: 'plain white crew-neck t-shirt',
  bottoms: 'faded khaki military cargo pants',
  shoes: 'worn brown leather engineer boots',
  accessories: ['canvas military duffel bag', 'vintage dive watch', 'dog tag necklace'],
};

const prompt = fromPreset('americana-airfield', model, outfit);
// → 400語以内の最適化されたプロンプトが生成される
*/

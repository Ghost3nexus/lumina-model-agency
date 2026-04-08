/**
 * RINKA GRWM #01 — I2V動画変換（Replicate × Kling v2.1）
 *
 * 10枚の静止画をKling v2.1（Replicate経由）で5秒の動画クリップに変換
 * 中国企業に直接アクセスせず、Replicate（米国）経由で安全に利用
 *
 * Usage:
 *   source .env.local && node test/gen-rinka-grwm-video.mjs
 *   source .env.local && node test/gen-rinka-grwm-video.mjs --force
 */

import fs from 'fs';
import path from 'path';

const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) { console.error('REPLICATE_API_TOKEN required'); process.exit(1); }

const force = process.argv.includes('--force');

const STILLS_DIR = 'docs/sns-shorts/rinka-grwm-01/stills';
const CLIPS_DIR = 'docs/sns-shorts/rinka-grwm-01/clips';

const CUTS = [
  {
    name: '01-hook',
    prompt: 'She blinks slowly, slightly shifts head on pillow, sleepy annoyed expression. Minimal movement.',
  },
  {
    name: '02-hair-set',
    prompt: 'Both hands run through pink-ash hair, tousling and arranging strands while looking in mirror.',
  },
  {
    name: '03-dr-martens',
    prompt: 'Hands pick up black boots, pink laces swing gently. Subtle hand movement lifting the boot.',
  },
  {
    name: '04-dickies',
    prompt: 'She adjusts beige pants waistband in mirror reflection. Lower body movement only.',
  },
  {
    name: '05-human-made',
    prompt: 'Hands hold up white t-shirt displaying heart logo, fabric sways gently.',
  },
  {
    name: '06-sacai',
    prompt: 'She adjusts bomber jacket collar with one hand in mirror. Slight shoulder movement, satisfied expression.',
  },
  {
    name: '07-accessory',
    prompt: 'Fingers clasp gold necklace behind neck, delicate movement. Slight wrist turn showing beaded bracelet.',
  },
  {
    name: '08-full-look',
    prompt: 'She slowly turns from 3/4 angle, looking over shoulder at mirror reflection. Cool expression.',
  },
  {
    name: '09-street-walk',
    prompt: 'Walking forward down narrow street, natural stride, hands in pockets. Hair sways. Background scrolls.',
  },
  {
    name: '10-look-back',
    prompt: 'She smiles at camera, casual peace sign near face. Hair blown by breeze. Candid joyful moment.',
  },
];

const NEGATIVE_PROMPT = 'morphing, distortion, blurry face, extra fingers, unnatural body movement';

async function createPrediction(imageBase64, prompt) {
  const resp = await fetch('https://api.replicate.com/v1/models/kwaivgi/kling-v2.1/predictions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: {
        start_image: imageBase64,
        prompt: prompt,
        negative_prompt: NEGATIVE_PROMPT,
        duration: 5,
        aspect_ratio: '9:16',
      }
    })
  });
  return resp.json();
}

async function pollPrediction(id) {
  while (true) {
    await new Promise(r => setTimeout(r, 5000));
    const resp = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });
    const result = await resp.json();

    if (result.status === 'succeeded') return result;
    if (result.status === 'failed' || result.status === 'canceled') {
      throw new Error(`Prediction ${result.status}: ${result.error || 'unknown'}`);
    }
    process.stdout.write('.');
  }
}

async function generateClip(cut) {
  const outPath = path.join(CLIPS_DIR, `${cut.name}.mp4`);
  if (!force && fs.existsSync(outPath)) {
    console.log(`  ⏭️  ${cut.name}.mp4 exists, skip`);
    return true;
  }

  const imagePath = path.join(STILLS_DIR, `${cut.name}.png`);
  if (!fs.existsSync(imagePath)) {
    console.error(`  ❌ ${cut.name}.png not found`);
    return false;
  }

  const buf = fs.readFileSync(imagePath);
  const base64 = `data:image/png;base64,${buf.toString('base64')}`;

  console.log(`  🎬 ${cut.name} — submitting to Replicate (Kling v2.1)...`);

  try {
    const prediction = await createPrediction(base64, cut.prompt);

    if (prediction.error) {
      console.error(`  ❌ ${cut.name} — API error: ${prediction.error}`);
      return false;
    }

    console.log(`  ⏳ ${cut.name} — id: ${prediction.id}, polling`);
    const result = await pollPrediction(prediction.id);
    console.log('');

    // Result output is typically a URL to the video
    const videoUrl = typeof result.output === 'string' ? result.output : result.output?.[0];

    if (!videoUrl) {
      console.error(`  ❌ ${cut.name} — no video URL`, JSON.stringify(result.output));
      return false;
    }

    console.log(`  ⬇️  ${cut.name} — downloading...`);
    const videoResp = await fetch(videoUrl);
    const videoBuf = Buffer.from(await videoResp.arrayBuffer());
    fs.writeFileSync(outPath, videoBuf);
    console.log(`  ✅ ${cut.name}.mp4 (${(videoBuf.length / 1024 / 1024).toFixed(1)} MB)`);
    return true;

  } catch (e) {
    console.error(`  ❌ ${cut.name} error: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('=== RINKA GRWM #01 — I2V via Replicate (Kling v2.1) ===\n');

  fs.mkdirSync(CLIPS_DIR, { recursive: true });

  let success = 0;
  let failed = 0;

  for (const cut of CUTS) {
    const ok = await generateClip(cut);
    if (ok) success++; else failed++;
    console.log('');
  }

  console.log(`\n=== Done — ${success}/10 succeeded, ${failed}/10 failed ===`);
  console.log(`Output: ${CLIPS_DIR}/`);

  if (failed > 3) {
    console.log('\n⚠️  3本以上失敗 → フォールバック（静止画Reels + Ken Burns効果）を検討');
  } else {
    console.log('\nNext: CapCut で結合 + テキスト + トランジション → 最終書き出し');
  }
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

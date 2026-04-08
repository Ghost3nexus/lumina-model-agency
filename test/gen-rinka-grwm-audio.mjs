/**
 * RINKA GRWM #01 — ナレーション音声生成（ElevenLabs）
 *
 * Voice: Rin (DIcmWR2oXfmLIlrj43rH) — cute, kanto, young
 * Model: eleven_multilingual_v2
 *
 * Usage:
 *   source .env.local && node test/gen-rinka-grwm-audio.mjs
 */

import fs from 'fs';
import path from 'path';

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) { console.error('ELEVENLABS_API_KEY required'); process.exit(1); }

const VOICE_ID = 'DIcmWR2oXfmLIlrj43rH'; // Rin
const OUT_DIR = 'docs/sns-shorts/rinka-grwm-01/audio';

const LINES = [
  {
    name: '01-hook',
    text: 'ねむ。きのう5時まで回してた',
    stability: 0.6,  // ダルい、ぼそぼそ
  },
  {
    name: '02-hair-set',
    text: 'てか髪やば。まあいいか',
    stability: 0.6,  // まだ眠い
  },
  {
    name: '03-dr-martens',
    text: '今日はこれで。ピンクの紐かわいくない？',
    stability: 0.5,  // 少し目が覚めてきた
  },
  {
    name: '04-dickies',
    text: 'Dickiesはこの腰履きがウチ的に正解',
    stability: 0.5,  // こだわりポイント
  },
  {
    name: '05-human-made',
    text: 'これ好きすぎて3枚持ってる',
    stability: 0.5,  // テンション上がってきた
  },
  {
    name: '06-sacai',
    text: 'sacaiのこれ。服と服が友達になってるみたい',
    stability: 0.5,  // お気に入り紹介
  },
  {
    name: '07-accessory',
    text: 'ヴィヴィアンは絶対つける。お守り',
    stability: 0.65, // 大事なもの、少し真面目
  },
  {
    name: '08-full-look',
    text: 'うん、今日いい感じ',
    stability: 0.7,  // 落ち着いた満足感
  },
  {
    name: '09-street-walk',
    text: '下北は庭。歩くだけで楽しい',
    stability: 0.45, // いつものテンション
  },
  {
    name: '10-look-back',
    text: 'じゃ、バイト行ってきまーす',
    stability: 0.4,  // 明るい、エネルギッシュ
  },
];

async function generateAudio(line) {
  const outPath = path.join(OUT_DIR, `${line.name}.mp3`);
  console.log(`  🎤 ${line.name}: "${line.text}"`);

  const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: line.text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: line.stability,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error(`  ❌ ${line.name}: ${err}`);
    return false;
  }

  const buf = Buffer.from(await resp.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  console.log(`  ✅ ${line.name}.mp3 (${(buf.length / 1024).toFixed(0)} KB)`);
  return true;
}

async function main() {
  console.log('=== RINKA GRWM #01 — Narration (ElevenLabs / Rin) ===\n');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let success = 0;
  for (const line of LINES) {
    const ok = await generateAudio(line);
    if (ok) success++;
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n=== Done — ${success}/10 audio files generated ===`);
  console.log(`Output: ${OUT_DIR}/`);
}

main().catch(e => { console.error('Failed:', e); process.exit(1); });

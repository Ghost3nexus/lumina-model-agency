/**
 * test-video-pipeline.mjs — Video Studio API integration test
 *
 * Tests each step of the pipeline independently:
 *   1. Replicate API connectivity (Kling v2.1 model check)
 *   2. ElevenLabs API connectivity (voice list + TTS)
 *   3. Full I2V test with a small test image (optional, --full flag)
 *
 * Usage:
 *   source .env.local && node test/test-video-pipeline.mjs
 *   source .env.local && node test/test-video-pipeline.mjs --full
 */

const REPLICATE_TOKEN = process.env.REPLICATE_API_KEY || process.env.VITE_REPLICATE_API_KEY;
const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;
const FULL_TEST = process.argv.includes('--full');

let passed = 0;
let failed = 0;

function ok(name) { console.log(`  ✅ ${name}`); passed++; }
function fail(name, err) { console.log(`  ❌ ${name}: ${err}`); failed++; }

// ─── Test 1: Replicate API ─────────────────────────────────────────────────

async function testReplicate() {
  console.log('\n=== Step 1: Replicate API ===');

  if (!REPLICATE_TOKEN) {
    fail('API Token', 'REPLICATE_API_KEY not set');
    return;
  }
  ok('API Token configured');

  // Test: list models (lightweight)
  try {
    const resp = await fetch('https://api.replicate.com/v1/models/kwaivgi/kling-v2.1', {
      headers: { 'Authorization': `Bearer ${REPLICATE_TOKEN}` },
    });
    if (!resp.ok) {
      fail('Model access', `HTTP ${resp.status}: ${await resp.text()}`);
      return;
    }
    const data = await resp.json();
    ok(`Model found: ${data.name || 'kwaivgi/kling-v2.1'}`);
    ok(`Latest version: ${data.latest_version?.id?.slice(0, 12) || 'available'}`);
  } catch (e) {
    fail('Model access', e.message);
  }
}

// ─── Test 2: ElevenLabs API ─────────────────────────────────────────────────

async function testElevenLabs() {
  console.log('\n=== Step 2: ElevenLabs API ===');

  if (!ELEVENLABS_KEY) {
    fail('API Key', 'ELEVENLABS_API_KEY not set');
    return;
  }
  ok('API Key configured');

  // Test: get voices
  try {
    const resp = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': ELEVENLABS_KEY },
    });
    if (!resp.ok) {
      fail('Voice list', `HTTP ${resp.status}`);
      return;
    }
    const data = await resp.json();
    const voiceCount = data.voices?.length || 0;
    ok(`Voices accessible: ${voiceCount} voices`);

    // Check for Rin voice (RINKA)
    const rin = data.voices?.find(v => v.voice_id === 'DIcmWR2oXfmLIlrj43rH');
    if (rin) {
      ok(`Rin voice found: "${rin.name}"`);
    } else {
      fail('Rin voice', 'DIcmWR2oXfmLIlrj43rH not found in voice list');
    }
  } catch (e) {
    fail('Voice list', e.message);
  }

  // Test: short TTS generation
  try {
    console.log('  🔊 Testing TTS (short text)...');
    const resp = await fetch('https://api.elevenlabs.io/v1/text-to-speech/DIcmWR2oXfmLIlrj43rH', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'テスト',
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });
    if (!resp.ok) {
      fail('TTS generation', `HTTP ${resp.status}: ${await resp.text()}`);
      return;
    }
    const buf = Buffer.from(await resp.arrayBuffer());
    ok(`TTS success: ${(buf.length / 1024).toFixed(0)} KB audio`);
  } catch (e) {
    fail('TTS generation', e.message);
  }
}

// ─── Test 3: Full I2V (optional) ────────────────────────────────────────────

async function testFullI2V() {
  if (!FULL_TEST) {
    console.log('\n=== Step 3: I2V (skipped — use --full to run) ===');
    return;
  }

  console.log('\n=== Step 3: Full I2V Test (Kling v2.1) ===');

  if (!REPLICATE_TOKEN) {
    fail('I2V', 'REPLICATE_API_KEY not set');
    return;
  }

  // Use a small 64x64 test image (red square)
  const canvas = Buffer.alloc(64 * 64 * 4);
  for (let i = 0; i < 64 * 64; i++) {
    canvas[i * 4] = 255;     // R
    canvas[i * 4 + 1] = 0;   // G
    canvas[i * 4 + 2] = 0;   // B
    canvas[i * 4 + 3] = 255; // A
  }

  // Use an existing still image if available
  const fs = await import('fs');
  const testImagePath = 'docs/sns-shorts/rinka-grwm-01/stills/01-hook.png';
  let imageBase64;

  if (fs.existsSync(testImagePath)) {
    const buf = fs.readFileSync(testImagePath);
    imageBase64 = `data:image/png;base64,${buf.toString('base64')}`;
    ok(`Using test image: ${testImagePath} (${(buf.length / 1024).toFixed(0)} KB)`);
  } else {
    console.log('  ⚠️  No test image found, skipping I2V');
    return;
  }

  try {
    console.log('  🎬 Submitting I2V prediction...');
    const createResp = await fetch('https://api.replicate.com/v1/models/kwaivgi/kling-v2.1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          start_image: imageBase64,
          prompt: 'She blinks slowly, minimal movement',
          negative_prompt: 'morphing, distortion, blurry face',
          duration: 5,
          aspect_ratio: '9:16',
        },
      }),
    });

    if (!createResp.ok) {
      fail('I2V submit', `HTTP ${createResp.status}: ${await createResp.text()}`);
      return;
    }

    const prediction = await createResp.json();
    ok(`Prediction created: ${prediction.id}`);
    console.log(`  ⏳ Polling (this takes 2-5 min)...`);

    // Poll
    const startTime = Date.now();
    const maxTime = 5 * 60 * 1000;

    while (Date.now() - startTime < maxTime) {
      await new Promise(r => setTimeout(r, 5000));
      const pollResp = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { 'Authorization': `Bearer ${REPLICATE_TOKEN}` },
      });
      const result = await pollResp.json();
      process.stdout.write('.');

      if (result.status === 'succeeded') {
        console.log('');
        const videoUrl = typeof result.output === 'string' ? result.output : result.output?.[0];
        ok(`I2V complete: ${videoUrl?.slice(0, 80)}...`);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
        ok(`Time: ${elapsed}s`);
        return;
      }
      if (result.status === 'failed' || result.status === 'canceled') {
        console.log('');
        fail('I2V', `${result.status}: ${result.error || 'unknown'}`);
        return;
      }
    }
    console.log('');
    fail('I2V', 'Timed out after 5 minutes');
  } catch (e) {
    fail('I2V', e.message);
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== LUMINA VIDEO STUDIO — Pipeline Test ===');

  await testReplicate();
  await testElevenLabs();
  await testFullI2V();

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) process.exit(1);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });

/**
 * Test Real-ESRGAN upscaling via Replicate
 * Usage: REPLICATE_API_TOKEN=xxx node test/upscale-test.mjs test/generation-output/front-1774067003486.png
 */
import fs from 'fs';
import path from 'path';

const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) { console.error('REPLICATE_API_TOKEN required'); process.exit(1); }

const inputFile = process.argv[2];
if (!inputFile) { console.error('Usage: node test/upscale-test.mjs <image.png>'); process.exit(1); }

const buf = fs.readFileSync(path.resolve(inputFile));
const base64 = `data:image/png;base64,${buf.toString('base64')}`;

console.log(`Input: ${inputFile} (${(buf.length/1024).toFixed(0)}KB)`);
console.log('Submitting to Replicate Real-ESRGAN...');

// Create prediction
const createResp = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    version: '42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b',
    input: { image: base64, scale: 4, face_enhance: false }
  })
});
const prediction = await createResp.json();
console.log('Prediction ID:', prediction.id);

// Poll
let result = prediction;
while (result.status !== 'succeeded' && result.status !== 'failed') {
  await new Promise(r => setTimeout(r, 3000));
  const pollResp = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
    headers: { 'Authorization': `Bearer ${TOKEN}` }
  });
  result = await pollResp.json();
  console.log('Status:', result.status);
}

if (result.status === 'failed') {
  console.error('Failed:', result.error);
  process.exit(1);
}

// Download
const outputUrl = result.output;
console.log('Output URL:', outputUrl);
const imgResp = await fetch(outputUrl);
const imgBuf = Buffer.from(await imgResp.arrayBuffer());
const outPath = inputFile.replace(/\.\w+$/, '-4x.png');
fs.writeFileSync(outPath, imgBuf);
console.log(`✅ Saved: ${outPath} (${(imgBuf.length/1024).toFixed(0)}KB)`);

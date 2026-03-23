import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * FLUX Kontext Generation API — fal.ai queue proxy
 *
 * Actions:
 *   upload  — Upload image to fal CDN, get public URL
 *   submit  — Submit generation job to FLUX Kontext
 *   poll    — Poll for generation status/result
 */

const FAL_KEY = process.env.FAL_KEY || '';
const FAL_KONTEXT_URL = 'https://queue.fal.run/fal-ai/flux-pro/kontext';

export const config = {
  maxDuration: 60,
};

const falHeaders = () => ({
  Authorization: `Key ${FAL_KEY}`,
  'Content-Type': 'application/json',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!FAL_KEY) {
    return res.status(503).json({ error: 'FAL_KEY missing' });
  }

  const { action } = req.body;

  // ── Upload image to fal CDN ──
  if (action === 'upload') {
    const { imageBase64, contentType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 required' });
    }

    try {
      // Strip data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const binaryData = Buffer.from(base64Data, 'base64');
      const mimeType = contentType || 'image/jpeg';

      console.log(`[FLUX] Uploading ${(binaryData.length / 1024).toFixed(0)}KB to fal CDN`);

      const uploadResp = await fetch('https://fal.run/fal-ai/fal-cdn/upload', {
        method: 'POST',
        headers: {
          Authorization: `Key ${FAL_KEY}`,
          'Content-Type': mimeType,
        },
        body: binaryData,
      });

      if (!uploadResp.ok) {
        const t = await uploadResp.text();
        console.error(`[FLUX] Upload err ${uploadResp.status}: ${t.slice(0, 200)}`);

        // Fallback: use REST upload endpoint
        const restResp = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate', {
          method: 'POST',
          headers: {
            Authorization: `Key ${FAL_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content_type: mimeType,
            file_name: `garment-${Date.now()}.jpg`,
          }),
        });

        if (!restResp.ok) {
          return res.status(502).json({ error: 'CDN upload failed' });
        }

        const { upload_url, file_url } = await restResp.json();

        // PUT the binary data to the presigned URL
        const putResp = await fetch(upload_url, {
          method: 'PUT',
          headers: { 'Content-Type': mimeType },
          body: binaryData,
        });

        if (!putResp.ok) {
          return res.status(502).json({ error: 'CDN PUT failed' });
        }

        console.log(`[FLUX] Uploaded (REST): ${file_url}`);
        return res.json({ ok: true, url: file_url });
      }

      const data = await uploadResp.json();
      const url = data.url || data.file_url;
      console.log(`[FLUX] Uploaded: ${url}`);
      return res.json({ ok: true, url });

    } catch (e) {
      console.error('[FLUX] Upload err:', (e as Error).message);
      return res.status(500).json({ error: (e as Error).message.slice(0, 200) });
    }
  }

  // ── Submit generation ──
  if (action === 'submit') {
    const { image_url, prompt, guidance_scale, seed, aspect_ratio, lora_url, lora_scale } = req.body;
    if (!image_url || !prompt) {
      return res.status(400).json({ error: 'image_url and prompt required' });
    }

    try {
      // Use LoRA endpoint if lora_url is provided (queue mode for both)
      const useLora = !!lora_url;
      const endpoint = useLora
        ? 'https://queue.fal.run/fal-ai/flux-kontext-lora'
        : FAL_KONTEXT_URL;

      console.log(`[FLUX] Submit (${useLora ? 'LoRA' : 'base'}): prompt="${prompt.slice(0, 80)}..."`);

      const r = await fetch(endpoint, {
        method: 'POST',
        headers: falHeaders(),
        body: JSON.stringify({
          image_url,
          prompt,
          guidance_scale: guidance_scale || 4.0,
          num_images: 1,
          output_format: 'png',
          aspect_ratio: aspect_ratio || '2:3',
          ...(seed && { seed }),
          ...(useLora && {
            loras: [{ path: lora_url, scale: lora_scale ?? 0.8 }],
          }),
        }),
      });

      if (!r.ok) {
        const t = await r.text();
        console.error(`[FLUX] Submit err ${r.status}: ${t.slice(0, 300)}`);
        return res.status(502).json({ error: t.slice(0, 200) });
      }

      const d = await r.json();
      console.log(`[FLUX] Queued: ${d.request_id}`);
      return res.json({
        ok: true,
        request_id: d.request_id,
        status_url: d.status_url,
        response_url: d.response_url,
      });

    } catch (e) {
      console.error('[FLUX] Submit err:', (e as Error).message);
      return res.status(500).json({ error: (e as Error).message.slice(0, 200) });
    }
  }

  // ── Poll for result ──
  if (action === 'poll') {
    const { request_id, status_url, response_url } = req.body;
    if (!request_id) {
      return res.status(400).json({ error: 'request_id required' });
    }

    try {
      const sUrl = status_url || `https://queue.fal.run/fal-ai/flux-pro/kontext/requests/${request_id}/status`;
      const rUrl = response_url || `https://queue.fal.run/fal-ai/flux-pro/kontext/requests/${request_id}`;

      const sr = await fetch(sUrl, { headers: falHeaders() });
      if (!sr.ok) {
        const t = await sr.text();
        console.error(`[FLUX] Poll err ${sr.status}: ${t.slice(0, 200)}`);
        return res.status(502).json({ error: `Poll failed: ${sr.status}` });
      }

      const sd = await sr.json();
      console.log(`[FLUX] Status: ${sd.status}`);

      if (sd.status === 'COMPLETED') {
        const rr = await fetch(rUrl, { headers: falHeaders() });
        if (!rr.ok) {
          const t = await rr.text();
          console.error(`[FLUX] Result err ${rr.status}: ${t.slice(0, 300)}`);
          return res.status(502).json({ error: `Result fetch failed: ${rr.status}` });
        }

        const rd = await rr.json();
        console.log(`[FLUX] Result keys: ${Object.keys(rd).join(',')}`);
        const images = rd.images || rd.output || [];
        return res.json({ ok: true, status: 'COMPLETED', images, seed: rd.seed });
      }

      if (sd.status === 'FAILED') {
        console.error(`[FLUX] FAILED: ${JSON.stringify(sd).slice(0, 300)}`);
        return res.json({ ok: true, status: 'FAILED', error: sd.error || 'Unknown' });
      }

      return res.json({ ok: true, status: sd.status });

    } catch (e) {
      console.error('[FLUX] Poll err:', (e as Error).message);
      return res.status(500).json({ error: (e as Error).message.slice(0, 200) });
    }
  }

  return res.status(400).json({ error: 'Use action: upload, submit, or poll' });
}

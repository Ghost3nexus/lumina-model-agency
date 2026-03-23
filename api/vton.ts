import type { VercelRequest, VercelResponse } from '@vercel/node';

const FAL_KEY = process.env.FAL_KEY || '';
const FAL_SUBMIT_URL = 'https://queue.fal.run/fal-ai/fashn/tryon/v1.5';

export const config = {
  maxDuration: 60,
};

const headers = () => ({
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

  // ── Submit ──
  if (action === 'submit') {
    const { modelImage, garmentImage, category, garmentPhotoType } = req.body;
    if (!modelImage || !garmentImage) {
      return res.status(400).json({ error: 'modelImage and garmentImage required' });
    }

    try {
      console.log(`[VTON] Submit (cat=${category || 'auto'})`);

      // fal.ai queue API: body fields go directly at the top level
      // The queue wraps them in "input" internally — do NOT double-wrap
      const r = await fetch(FAL_SUBMIT_URL, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          model_image: modelImage,
          garment_image: garmentImage,
          category: category || 'auto',
          mode: 'quality',
          garment_photo_type: garmentPhotoType || 'auto',
          output_format: 'png',
          num_samples: 1,
        }),
      });

      if (!r.ok) {
        const t = await r.text();
        console.error(`[VTON] Submit err ${r.status}: ${t.slice(0, 300)}`);
        return res.status(502).json({ error: t.slice(0, 200) });
      }

      const d = await r.json();
      console.log(`[VTON] Queued: ${d.request_id}, status_url: ${d.status_url}`);
      return res.json({
        ok: true,
        request_id: d.request_id,
        status_url: d.status_url,
        response_url: d.response_url,
      });
    } catch (e) {
      console.error('[VTON] Submit err:', (e as Error).message);
      return res.status(500).json({ error: (e as Error).message.slice(0, 200) });
    }
  }

  // ── Poll ──
  if (action === 'poll') {
    const { request_id, status_url, response_url } = req.body;
    if (!request_id) {
      return res.status(400).json({ error: 'request_id required' });
    }

    try {
      const sUrl = status_url || `https://queue.fal.run/fal-ai/fashn/requests/${request_id}/status`;
      const rUrl = response_url || `https://queue.fal.run/fal-ai/fashn/requests/${request_id}`;

      console.log(`[VTON] Poll: ${sUrl}`);
      const sr = await fetch(sUrl, { headers: headers() });

      if (!sr.ok) {
        const t = await sr.text();
        console.error(`[VTON] Poll err ${sr.status}: ${t.slice(0, 200)}`);
        return res.status(502).json({ error: `Poll failed: ${sr.status}`, detail: t.slice(0, 200) });
      }

      const sd = await sr.json();
      console.log(`[VTON] Status: ${sd.status}`);

      if (sd.status === 'COMPLETED') {
        console.log(`[VTON] Fetching result: ${rUrl}`);
        const rr = await fetch(rUrl, { headers: headers() });

        if (!rr.ok) {
          const t = await rr.text();
          console.error(`[VTON] Result err ${rr.status}: ${t.slice(0, 300)}`);
          return res.status(502).json({ error: `Result fetch failed: ${rr.status}`, detail: t.slice(0, 200) });
        }

        const rd = await rr.json();
        console.log(`[VTON] Result keys: ${Object.keys(rd).join(',')}`);

        // fal.ai returns { images: [{url, ...}], ... } or { output: [{url, ...}] }
        const images = rd.images || rd.output || [];
        return res.json({ ok: true, status: 'COMPLETED', images });
      }

      if (sd.status === 'FAILED') {
        console.error(`[VTON] FAILED: ${JSON.stringify(sd).slice(0, 300)}`);
        return res.json({ ok: true, status: 'FAILED', error: sd.error || 'Unknown error' });
      }

      return res.json({ ok: true, status: sd.status });
    } catch (e) {
      console.error('[VTON] Poll err:', (e as Error).message);
      return res.status(500).json({ error: (e as Error).message.slice(0, 200) });
    }
  }

  return res.status(400).json({ error: 'Use action: submit or poll' });
}

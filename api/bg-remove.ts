import type { VercelRequest, VercelResponse } from '@vercel/node';

const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY || '';

export const config = {
  maxDuration: 60,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!REPLICATE_API_KEY) {
    return res.status(503).json({ error: 'BG removal service not configured' });
  }

  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'image (base64 data URL) is required' });
  }

  try {
    const createResp = await fetch(
      'https://api.replicate.com/v1/models/lucataco/remove-bg/predictions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${REPLICATE_API_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'wait',
        },
        body: JSON.stringify({
          input: { image },
        }),
      },
    );

    if (!createResp.ok) {
      const errText = await createResp.text();
      console.error(`[BG-Remove] Replicate error ${createResp.status}:`, errText);
      return res.status(502).json({ error: 'BG removal failed' });
    }

    const prediction = await createResp.json();

    let outputUrl: string | null = null;

    if (prediction.status === 'succeeded') {
      outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    } else {
      // Poll until complete (max 60s)
      const pollStart = Date.now();
      while (Date.now() - pollStart < 55_000) {
        const pollResp = await fetch(
          `https://api.replicate.com/v1/predictions/${prediction.id}`,
          { headers: { Authorization: `Bearer ${REPLICATE_API_KEY}` } },
        );
        const pollData = await pollResp.json();

        if (pollData.status === 'succeeded') {
          outputUrl = Array.isArray(pollData.output) ? pollData.output[0] : pollData.output;
          break;
        }
        if (pollData.status === 'failed' || pollData.status === 'canceled') {
          return res.status(500).json({ error: `BG removal ${pollData.status}` });
        }
        await new Promise(r => setTimeout(r, 1500));
      }
    }

    if (!outputUrl) {
      return res.status(504).json({ error: 'BG removal timed out' });
    }

    res.json({ ok: true, outputUrl });
  } catch (err) {
    console.error('[BG-Remove] Error:', (err as Error).message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

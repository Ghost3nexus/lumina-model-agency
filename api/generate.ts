import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Gemini API Proxy — Server-side API key injection
 *
 * Receives { action, model, body } from the frontend fetch interceptor.
 * Forwards the entire body to Gemini API with the real GEMINI_API_KEY.
 * Returns the response transparently.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com';

export const config = {
  maxDuration: 300,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(503).json({ error: 'Gemini API not configured' });
  }

  const { action, model, body } = req.body;

  if (!model) {
    return res.status(400).json({ error: 'model is required' });
  }

  const geminiAction = action || 'generateContent';
  const endpoint = `${GEMINI_BASE}/v1beta/models/${model}:${geminiAction}?key=${GEMINI_API_KEY}`;

  try {
    const geminiResp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    });

    if (!geminiResp.ok) {
      const errText = await geminiResp.text();
      console.error(`[Gemini] API error ${geminiResp.status}:`, errText.slice(0, 500));

      if (geminiResp.status === 429) {
        return res.status(429).json({ error: 'Rate limited by Gemini API', retryAfter: 30 });
      }
      return res.status(geminiResp.status >= 500 ? 502 : geminiResp.status).json({
        error: 'Gemini API request failed',
        detail: errText.slice(0, 200),
      });
    }

    const contentType = geminiResp.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const result = await geminiResp.json();
      return res.json(result);
    }

    // Streaming or other content types
    const text = await geminiResp.text();
    if (contentType) res.setHeader('Content-Type', contentType);
    res.send(text);
  } catch (err) {
    console.error('[Gemini] Proxy error:', (err as Error).message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

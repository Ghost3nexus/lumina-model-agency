/**
 * Vercel Serverless Function — Replicate API Proxy
 *
 * Proxies requests to Replicate API from the browser.
 * Keeps the API key server-side (REPLICATE_API_KEY, not VITE_ prefixed).
 *
 * POST /api/replicate
 * Body: { action: "create" | "poll", model_url?: string, input?: object, prediction_id?: string }
 */

const REPLICATE_API_BASE = 'https://api.replicate.com/v1';

export default async function handler(req: any, res: any) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.REPLICATE_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'REPLICATE_API_KEY not configured on server' });
    }

    const { action, model_url, version, input, prediction_id } = req.body;

    try {
        if (action === 'create') {
            if (!model_url || !input) {
                return res.status(400).json({ error: 'model_url and input are required' });
            }

            const body: any = { input };
            if (version) body.version = version;

            const resp = await fetch(model_url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    Prefer: 'wait',
                },
                body: JSON.stringify(body),
            });

            const data = await resp.json();

            if (!resp.ok) {
                return res.status(resp.status).json({ error: data });
            }

            return res.status(200).json(data);

        } else if (action === 'poll') {
            if (!prediction_id) {
                return res.status(400).json({ error: 'prediction_id is required' });
            }

            const resp = await fetch(`${REPLICATE_API_BASE}/predictions/${prediction_id}`, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await resp.json();

            if (!resp.ok) {
                return res.status(resp.status).json({ error: data });
            }

            return res.status(200).json(data);

        } else {
            return res.status(400).json({ error: 'Invalid action. Use "create" or "poll".' });
        }
    } catch (err: any) {
        console.error('[Replicate Proxy] Error:', err);
        return res.status(500).json({
            error: err?.message || 'Internal server error',
        });
    }
}

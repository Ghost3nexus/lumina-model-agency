import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const MODEL = 'gemini-3-pro-image-preview';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export const config = { maxDuration: 60 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!GEMINI_KEY) return res.status(503).json({ error: 'GEMINI_API_KEY missing' });

  const { prompt, referenceImageBase64, referenceImageMimeType } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  try {
    const parts: any[] = [];

    if (referenceImageBase64) {
      const base64Data = referenceImageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: referenceImageMimeType || 'image/png',
          data: base64Data,
        },
      });
    }

    parts.push({ text: prompt });

    const body = {
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    };

    const r = await fetch(`${API_URL}?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: `Gemini ${r.status}: ${t.slice(0, 300)}` });
    }

    const data = await r.json();

    const results: { type: string; data?: string; mimeType?: string; text?: string }[] = [];
    for (const candidate of data.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          results.push({
            type: 'image',
            data: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
          });
        }
        if (part.text) {
          results.push({ type: 'text', text: part.text });
        }
      }
    }

    return res.json({ ok: true, results });
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message.slice(0, 200) });
  }
}

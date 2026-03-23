/**
 * Gemini Fetch Interceptor
 *
 * Patches the global fetch so that any request to generativelanguage.googleapis.com
 * is redirected through our /api/generate Vercel Function. The server-side function
 * injects the real GEMINI_API_KEY — the client never sees it.
 *
 * How it works:
 *   1. The @google/genai SDK calls fetch('https://generativelanguage.googleapis.com/...')
 *   2. This interceptor catches it, extracts model/action from the URL
 *   3. Forwards the entire request body to /api/generate
 *   4. The proxy adds GEMINI_API_KEY and forwards to Google
 *   5. Returns the response transparently to the SDK
 *
 * Call installGeminiProxy() once at app startup, BEFORE any Gemini SDK usage.
 */

const GEMINI_HOST = 'generativelanguage.googleapis.com';

let installed = false;

export function installGeminiProxy(): void {
  if (installed) return;
  installed = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;

    // Only intercept Gemini API calls
    if (!url.includes(GEMINI_HOST)) {
      return originalFetch(input, init);
    }

    try {
      const parsedUrl = new URL(url);

      // Extract model and action from path
      // e.g. /v1beta/models/gemini-2.0-flash-exp:generateContent
      const pathMatch = parsedUrl.pathname.match(/\/v1beta\/models\/([^:]+):(\w+)/);
      if (!pathMatch) {
        console.warn('[GeminiProxy] Unrecognized path:', parsedUrl.pathname);
        return originalFetch(input, init);
      }

      const model = pathMatch[1];
      const action = pathMatch[2];

      // Parse the original request body — forward it entirely to preserve
      // all fields (contents, generationConfig, safetySettings, tools, etc.)
      let body: any = {};
      if (init?.body) {
        body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
      }

      // Forward via our server-side proxy
      const proxyResp = await originalFetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          model,
          body, // entire SDK request body — proxy forwards as-is
        }),
      });

      return proxyResp;
    } catch (err) {
      console.error('[GeminiProxy] Intercept error:', err);
      return originalFetch(input, init);
    }
  };

  console.log('[GeminiProxy] Installed — all Gemini SDK calls route through /api/generate');
}

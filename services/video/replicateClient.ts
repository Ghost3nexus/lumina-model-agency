/**
 * replicateClient.ts — Replicate API wrapper
 *
 * Handles prediction creation + polling for any Replicate-hosted model.
 * Used by klingService.ts for I2V generation.
 */

const REPLICATE_API = 'https://api.replicate.com/v1';

function getToken(): string {
  const token = import.meta.env.VITE_REPLICATE_API_TOKEN || import.meta.env.VITE_REPLICATE_API_KEY;
  if (!token) throw new Error('VITE_REPLICATE_API_TOKEN or VITE_REPLICATE_API_KEY not configured');
  return token;
}

function headers(): Record<string, string> {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  };
}

export interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output: string | string[] | null;
  error: string | null;
}

/**
 * Create a prediction on a specific model.
 */
export async function createPrediction(
  model: string,
  input: Record<string, unknown>,
): Promise<ReplicatePrediction> {
  const resp = await fetch(`${REPLICATE_API}/models/${model}/predictions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ input }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Replicate create failed (${resp.status}): ${text}`);
  }

  return resp.json();
}

/**
 * Poll a prediction until terminal state.
 * Calls onProgress with status updates.
 */
export async function pollPrediction(
  id: string,
  opts?: { intervalMs?: number; timeoutMs?: number; onProgress?: (status: string) => void },
): Promise<ReplicatePrediction> {
  const interval = opts?.intervalMs ?? 5000;
  const timeout = opts?.timeoutMs ?? 300_000; // 5 min default
  const start = Date.now();

  while (true) {
    if (Date.now() - start > timeout) {
      throw new Error(`Prediction ${id} timed out after ${timeout / 1000}s`);
    }

    await new Promise(r => setTimeout(r, interval));

    const resp = await fetch(`${REPLICATE_API}/predictions/${id}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (!resp.ok) {
      throw new Error(`Replicate poll failed (${resp.status})`);
    }

    const result: ReplicatePrediction = await resp.json();

    if (result.status === 'succeeded') return result;
    if (result.status === 'failed' || result.status === 'canceled') {
      throw new Error(`Prediction ${result.status}: ${result.error || 'unknown'}`);
    }

    opts?.onProgress?.(result.status);
  }
}

/**
 * Cancel a running prediction.
 */
export async function cancelPrediction(id: string): Promise<void> {
  await fetch(`${REPLICATE_API}/predictions/${id}/cancel`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` },
  });
}

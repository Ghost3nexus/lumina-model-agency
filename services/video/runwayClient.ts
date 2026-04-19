/**
 * runwayClient.ts — Runway Developer API wrapper
 *
 * Handles task creation + polling for Runway-hosted video models
 * (Seedance 2.0, Gen-4.5, Veo 3.1, etc.).
 *
 * Auth: Bearer token via VITE_RUNWAY_API_KEY.
 * Dev: proxied via Vite (/api/runway → api.dev.runwayml.com).
 * Prod: direct API (server-side proxy planned — Phase 2).
 *
 * Docs: https://docs.dev.runwayml.com/guides/using-the-api/
 */

const RUNWAY_API = import.meta.env.DEV ? '/api/runway/v1' : 'https://api.dev.runwayml.com/v1';
const RUNWAY_VERSION = '2024-11-06';

function getToken(): string {
  const token = import.meta.env.VITE_RUNWAY_API_KEY;
  if (!token) throw new Error('VITE_RUNWAY_API_KEY not configured');
  return token;
}

function headers(): Record<string, string> {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
    'X-Runway-Version': RUNWAY_VERSION,
  };
}

function readOnlyHeaders(): Record<string, string> {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'X-Runway-Version': RUNWAY_VERSION,
  };
}

export type RunwayTaskStatus =
  | 'PENDING'
  | 'THROTTLED'
  | 'RUNNING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED';

export interface RunwayTask {
  id: string;
  status: RunwayTaskStatus;
  output?: string[];
  failure?: string;
  progress?: number;
}

export interface ImageToVideoInput {
  /** Model identifier: 'seedance2' | 'gen4.5' | 'gen4_turbo' | 'veo3' | 'veo3.1' | 'veo3.1_fast' */
  model: string;
  /** URL (https) or base64 data URL of the source still */
  promptImage: string;
  /** Scene + motion + cinematography description */
  promptText: string;
  /** Ratio string, e.g. '1920:1080' / '1080:1920' / '1080:1080' */
  ratio: string;
  /** Duration in seconds (model-dependent, Seedance: 4-15) */
  duration: number;
  /** Optional seed for reproducibility */
  seed?: number;
}

export async function createImageToVideoTask(
  input: ImageToVideoInput,
): Promise<{ id: string }> {
  const resp = await fetch(`${RUNWAY_API}/image_to_video`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(input),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Runway create task failed (${resp.status}): ${text}`);
  }

  return resp.json();
}

export async function pollTask(
  id: string,
  opts?: {
    intervalMs?: number;
    timeoutMs?: number;
    onProgress?: (status: RunwayTaskStatus, progress?: number) => void;
  },
): Promise<RunwayTask> {
  const interval = opts?.intervalMs ?? 5000;
  const timeout = opts?.timeoutMs ?? 600_000;
  const start = Date.now();

  while (true) {
    if (Date.now() - start > timeout) {
      throw new Error(`Runway task ${id} timed out after ${timeout / 1000}s`);
    }

    await new Promise(r => setTimeout(r, interval));

    const resp = await fetch(`${RUNWAY_API}/tasks/${id}`, {
      headers: readOnlyHeaders(),
    });

    if (!resp.ok) {
      throw new Error(`Runway poll failed (${resp.status})`);
    }

    const task: RunwayTask = await resp.json();
    opts?.onProgress?.(task.status, task.progress);

    if (task.status === 'SUCCEEDED') return task;
    if (task.status === 'FAILED' || task.status === 'CANCELLED') {
      throw new Error(`Task ${task.status}: ${task.failure || 'unknown'}`);
    }
  }
}

export async function cancelTask(id: string): Promise<void> {
  await fetch(`${RUNWAY_API}/tasks/${id}`, {
    method: 'DELETE',
    headers: readOnlyHeaders(),
  });
}

import * as SecureStore from 'expo-secure-store';

const API_BASE = 'https://api.bankr.bot';
const API_KEY_STORAGE = 'bankr_api_key';

export async function setApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(API_KEY_STORAGE, key);
}

export async function getApiKey(): Promise<string | null> {
  return SecureStore.getItemAsync(API_KEY_STORAGE);
}

export async function hasApiKey(): Promise<boolean> {
  const key = await getApiKey();
  return !!key;
}

interface JobResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: unknown;
  error?: string;
  threadId?: string;
}

async function submitPrompt(prompt: string, threadId?: string): Promise<string> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error('API key not configured');

  const body: { prompt: string; threadId?: string } = { prompt };
  if (threadId) body.threadId = threadId;

  const res = await fetch(`${API_BASE}/agent/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.jobId;
}

async function pollJob(jobId: string, maxAttempts = 30): Promise<JobResponse> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error('API key not configured');

  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/agent/job/${jobId}`, {
      headers: { 'X-API-Key': apiKey },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data: JobResponse = await res.json();
    if (data.status === 'completed') return data;
    if (data.status === 'failed') throw new Error(data.error || 'Job failed');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error('Job timed out');
}

export async function executePrompt(prompt: string): Promise<string> {
  const jobId = await submitPrompt(prompt);
  const response = await pollJob(jobId);
  return typeof response.result === 'string' ? response.result : JSON.stringify(response.result, null, 2);
}

export async function getBalances(): Promise<string> {
  return executePrompt('what are my balances?');
}

export async function searchMarkets(query: string): Promise<string> {
  return executePrompt(`search polymarket for ${query}`);
}

export async function getMarketOdds(market: string): Promise<string> {
  return executePrompt(`what are the odds for ${market} on polymarket?`);
}

export async function getPositions(): Promise<string> {
  return executePrompt('show my polymarket positions');
}

export async function placeBet(amount: number, position: string, market: string): Promise<string> {
  return executePrompt(`bet $${amount} on ${position} for ${market}`);
}

export async function redeemWinnings(): Promise<string> {
  return executePrompt('redeem my winning polymarket positions');
}

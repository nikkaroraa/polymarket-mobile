import * as SecureStore from 'expo-secure-store';

const API_BASE = 'https://api.bankr.bot';
const API_KEY_STORAGE = 'bankr_api_key';

// Store API key securely
export async function setApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(API_KEY_STORAGE, key);
}

// Get stored API key
export async function getApiKey(): Promise<string | null> {
  return SecureStore.getItemAsync(API_KEY_STORAGE);
}

// Check if API key is configured
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

interface PromptResponse {
  jobId: string;
}

// Submit a prompt to Bankr API
async function submitPrompt(prompt: string, threadId?: string): Promise<string> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error('API key not configured');

  const body: { prompt: string; threadId?: string } = { prompt };
  if (threadId) body.threadId = threadId;

  const res = await fetch(`${API_BASE}/agent/prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} - ${text}`);
  }

  const data: PromptResponse = await res.json();
  return data.jobId;
}

// Poll for job result
async function pollJob(jobId: string, maxAttempts = 30): Promise<JobResponse> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error('API key not configured');

  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/agent/job/${jobId}`, {
      headers: { 'X-API-Key': apiKey },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data: JobResponse = await res.json();
    
    if (data.status === 'completed') {
      return data;
    }
    
    if (data.status === 'failed') {
      throw new Error(data.error || 'Job failed');
    }

    // Wait 1 second before next poll
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error('Job timed out');
}

// Execute a prompt and wait for result
export async function executePrompt(prompt: string, threadId?: string): Promise<{
  result: string;
  threadId?: string;
}> {
  const jobId = await submitPrompt(prompt, threadId);
  const response = await pollJob(jobId);
  
  return {
    result: typeof response.result === 'string' 
      ? response.result 
      : JSON.stringify(response.result, null, 2),
    threadId: response.threadId,
  };
}

// Convenience functions for Polymarket
export async function getBalances(): Promise<string> {
  const { result } = await executePrompt('what are my balances?');
  return result;
}

export async function searchMarkets(query: string): Promise<string> {
  const { result } = await executePrompt(`search polymarket for ${query}`);
  return result;
}

export async function getMarketOdds(market: string): Promise<string> {
  const { result } = await executePrompt(`what are the odds for ${market} on polymarket?`);
  return result;
}

export async function getPositions(): Promise<string> {
  const { result } = await executePrompt('show my polymarket positions');
  return result;
}

export async function placeBet(amount: number, position: string, market: string): Promise<string> {
  const { result } = await executePrompt(`bet $${amount} on ${position} for ${market}`);
  return result;
}

export async function redeemWinnings(): Promise<string> {
  const { result } = await executePrompt('redeem my winning polymarket positions');
  return result;
}

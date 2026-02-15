import * as SecureStore from 'expo-secure-store';

const API_BASE = 'https://api.bankr.bot';
const API_KEY_STORAGE = 'bankr_api_key';

// Store API key securely
export async function setApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(API_KEY_STORAGE, key);
}

export async function getApiKey(): Promise<string | null> {
  return await SecureStore.getItemAsync(API_KEY_STORAGE);
}

export async function clearApiKey(): Promise<void> {
  await SecureStore.deleteItemAsync(API_KEY_STORAGE);
}

// Submit a prompt and get jobId
export async function submitPrompt(prompt: string, threadId?: string): Promise<{ jobId: string }> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error('API key not configured');

  const body: Record<string, string> = { prompt };
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

  return res.json();
}

// Poll for job result
export interface JobResult {
  status: 'pending' | 'completed' | 'failed';
  response?: string;
  threadId?: string;
  error?: string;
}

export async function pollJob(jobId: string): Promise<JobResult> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error('API key not configured');

  const res = await fetch(`${API_BASE}/agent/job/${jobId}`, {
    headers: {
      'X-API-Key': apiKey,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} - ${text}`);
  }

  return res.json();
}

// Helper: submit and wait for completion
export async function executeCommand(prompt: string, threadId?: string): Promise<{ response: string; threadId?: string }> {
  const { jobId } = await submitPrompt(prompt, threadId);
  
  // Poll with exponential backoff
  let delay = 500;
  const maxAttempts = 30;
  
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, delay));
    
    const result = await pollJob(jobId);
    
    if (result.status === 'completed') {
      return { response: result.response || '', threadId: result.threadId };
    }
    
    if (result.status === 'failed') {
      throw new Error(result.error || 'Job failed');
    }
    
    delay = Math.min(delay * 1.5, 3000);
  }
  
  throw new Error('Job timed out');
}

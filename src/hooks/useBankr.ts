import { useState, useCallback } from 'react';
import { executeCommand, getApiKey } from '../api/bankr';

interface UseBankrResult {
  loading: boolean;
  error: string | null;
  response: string | null;
  execute: (prompt: string) => Promise<string>;
}

export function useBankr(): UseBankrResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const execute = useCallback(async (prompt: string): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await executeCommand(prompt);
      setResponse(result.response);
      return result.response;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, response, execute };
}

export function useApiKeyStatus() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  
  const checkKey = useCallback(async () => {
    const key = await getApiKey();
    setHasKey(!!key);
    return !!key;
  }, []);

  return { hasKey, checkKey };
}

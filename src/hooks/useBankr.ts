import { useState, useCallback } from 'react';
import * as bankr from '../services/bankr';

export interface UseBankrResult {
  loading: boolean;
  error: string | null;
  getBalances: () => Promise<string | null>;
  searchMarkets: (query: string) => Promise<string | null>;
  getPositions: () => Promise<string | null>;
  getMarketOdds: (market: string) => Promise<string | null>;
  placeBet: (amount: number, position: string, market: string) => Promise<string | null>;
  redeemWinnings: () => Promise<string | null>;
}

export function useBankr(): UseBankrResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (fn: () => Promise<string>): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBalances = useCallback(() => execute(bankr.getBalances), [execute]);
  const searchMarkets = useCallback((q: string) => execute(() => bankr.searchMarkets(q)), [execute]);
  const getPositions = useCallback(() => execute(bankr.getPositions), [execute]);
  const getMarketOdds = useCallback((m: string) => execute(() => bankr.getMarketOdds(m)), [execute]);
  const placeBet = useCallback(
    (amount: number, position: string, market: string) => 
      execute(() => bankr.placeBet(amount, position, market)),
    [execute]
  );
  const redeemWinnings = useCallback(() => execute(bankr.redeemWinnings), [execute]);

  return {
    loading,
    error,
    getBalances,
    searchMarkets,
    getPositions,
    getMarketOdds,
    placeBet,
    redeemWinnings,
  };
}

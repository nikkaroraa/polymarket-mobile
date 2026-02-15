export interface Market {
  id: string;
  question: string;
  outcomes: string[];
  odds: number[];
  volume?: string;
  endDate?: string;
}

export interface Position {
  market: string;
  outcome: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  redeemable?: boolean;
}

export interface Balance {
  token: string;
  amount: string;
  usdValue?: string;
}

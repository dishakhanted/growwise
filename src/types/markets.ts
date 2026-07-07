export type MarketSide = "YES" | "NO";

export interface KalshiMarket {
  ticker: string;
  event_ticker: string;
  source: "Kalshi" | "Polymarket";
  category: string;
  market_type: string;
  title: string;
  yes_sub_title: string;
  no_sub_title: string;
  open_time: string;
  close_time: string;
  expiration_time: string;
  status: string;
  yes_bid: number;
  yes_ask: number;
  no_bid: number;
  no_ask: number;
  last_price: number;
  volume: number;
  open_interest: number;
  liquidity: number;
  result: string;
  rules_primary: string;
  price_status: "live" | "illustrative";
  poonji_derived?: {
    implied_probability: number;
    tenor_days_from_pull: number;
  };
}

export interface KalshiMarketsResponse {
  _meta: {
    description: string;
    pulled_at: string;
    source_note: string;
    price_convention: string;
    poonji_note: string;
  };
  markets: KalshiMarket[];
}

export interface MarketDerived {
  impliedProbability: number;
  tenorYears: number;
  tenorDays: number;
}

export interface NotePricingInput {
  principal: number;
  protection: number;
  impliedProbability: number;
  tenorYears: number;
}

export interface NotePricingResult {
  feasible: boolean;
  couponUSD: number;
  couponPct: number;
  winReceives: number;
  loseReceives: number;
  lossUSD: number;
  lossPct: number;
  periodReturnWin: number;
  apySimpleWin: number;
  apyCompoundWin: number;
  periodReturnLose: number;
  apySimpleLose: number;
}

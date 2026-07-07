import mockData from "@/data/kalshi_mock_events.json";
import type { KalshiMarket, KalshiMarketsResponse, MarketDerived, MarketSide } from "@/types/markets";

const MS_PER_DAY = 86_400_000;

export const marketsResponse = mockData as KalshiMarketsResponse;

export const referenceDate = new Date(marketsResponse._meta.pulled_at);

export function getActiveMarkets(): KalshiMarket[] {
  return marketsResponse.markets.filter((market) => {
    const derived = deriveMarketValues(market);
    return derived.tenorDays > 0 && market.status === "active";
  });
}

export function deriveMarketValues(market: KalshiMarket): MarketDerived {
  const closeDate = new Date(market.close_time);
  const tenorDays = (closeDate.getTime() - referenceDate.getTime()) / MS_PER_DAY;
  const tenorYears = tenorDays / 365;
  const impliedProbability = market.last_price / 100;

  return {
    impliedProbability,
    tenorYears,
    tenorDays,
  };
}

export function getImpliedProbabilityForSide(market: KalshiMarket, side: MarketSide): number {
  const yesProbability = market.last_price / 100;
  return side === "YES" ? yesProbability : 1 - yesProbability;
}

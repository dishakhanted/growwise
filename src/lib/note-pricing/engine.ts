import { NOTE_PRICING_CONFIG } from "./config";
import type { NotePricingInput, NotePricingResult } from "@/types/markets";

export function computeNotePricing(input: NotePricingInput): NotePricingResult {
  const { principal: P, protection: pi, impliedProbability: Z, tenorYears: T } = input;
  const { riskFreeRate: r, issuerFeePct: fee } = NOTE_PRICING_CONFIG;

  const DF = 1 / (1 + r) ** T;
  const X = pi * P * DF;
  const Y = Math.max(0, P - X - fee * P);
  const contracts = Z > 0 ? Y / Z : 0;
  const topUp = P * (1 - pi);
  const couponUSD = contracts - topUp;
  const couponPct = P > 0 ? couponUSD / P : 0;
  const feasible = contracts >= topUp;

  const winReceives = P + couponUSD;
  const loseReceives = pi * P;
  const lossUSD = (1 - pi) * P;
  const lossPct = 1 - pi;

  const periodReturnWin = couponPct;
  const apySimpleWin = T > 0 ? couponPct / T : 0;
  const apyCompoundWin = T > 0 ? (1 + couponPct) ** (1 / T) - 1 : 0;
  const periodReturnLose = -lossPct;
  const apySimpleLose = T > 0 ? -lossPct / T : 0;

  return {
    feasible,
    couponUSD,
    couponPct,
    winReceives,
    loseReceives,
    lossUSD,
    lossPct,
    periodReturnWin,
    apySimpleWin,
    apyCompoundWin,
    periodReturnLose,
    apySimpleLose,
  };
}

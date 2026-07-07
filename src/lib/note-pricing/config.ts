/** Poonji financial model constants — not user-facing in Phase 1 */
export const NOTE_PRICING_CONFIG = {
  riskFreeRate: 0.045,
  issuerFeePct: 0.01,
  minPrincipal: 1000,
  defaultPrincipal: 10_000,
  defaultProtection: 0.95,
} as const;
